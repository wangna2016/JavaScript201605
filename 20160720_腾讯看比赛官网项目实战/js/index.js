~function (pro) {
    pro.myFormatTime = myFormatTime;
    //->myFormatTime:用来把指定的时间字符串按照既定的模板格式进行格式化
    function myFormatTime(template) {
        template = template || "{0}年{1}月{2}日 {3}时{4}分{5}秒";
        var ary = this.match(/\d+/g);
        return template.replace(/\{(\d+)\}/g, function () {
            var index = arguments[1],
                item = ary[index];
            !item ? item = "00" : null;
            item.length < 2 ? item = "0" + item : null;
            return item;
        });
    }
}(String.prototype);

//->获取需要操作的元素对象
var $content = $(".content"),
    $calendar = $content.find(".calendar"),
    $calendarList = $calendar.find("ul"),
    $matchList = $content.find(".matchList");
var serURL = "http://matchweb.sports.qq.com/kbs";

//第一步：控制区域CONTENT/MATCH LIST的高度
changeHeight();
function changeHeight() {
    var $winH = $(window).innerHeight();
    $content.css("height", $winH - 63 - 30);
    $matchList.css("height", $content.outerHeight() - $calendar.outerHeight() - 15);
}
$(window).on("resize", changeHeight);


//第二步：使用ISCROLL.JS实现指定区域的局部滚动
var menuScroll = new IScroll(".menu", {
    scrollbars: true,
    bounce: false,
    mouseWheel: true
});
var matchListScroll = new IScroll(".matchList", {
    scrollbars: true,
    bounce: false,
    mouseWheel: true
});
$(".iScrollVerticalScrollbar").css("opacity", 0.3);

//第三步：绑定日期区域的数据
var calendarModule = (function () {
    var $calendarFns = $.Callbacks();
    var maxL = 0, minL = 0;

    //->获取数据后:把日期列表版绑定在日期的区域
    $calendarFns.add(bindHTML);
    function bindHTML(data, today) {
        var str = '';
        $.each(data, function (index, curData) {
            str += '<li date="' + curData["date"] + '"><a href="javascript:;">';
            str += '<span>' + curData["weekday"] + '</span>';
            str += '<span>' + curData["date"].myFormatTime("{1}-{2}") + '</span>';
            str += '</a></li>';
        });
        $calendarList.html(str).css("width", data.length * 110);
    }

    //->获取数据后:定位当当前日期的位置或者定位到当前日期后面最近的一个位置
    $calendarFns.add(positionToday);
    function positionToday(data, today, columnId) {
        var ary = [];
        today = new Date(today.replace(/-/g, "/"));
        $calendarList.children("li").each(function (index, curLi) {
            var curLiDate = new Date($(curLi).attr("date").replace(/-/g, "/"));
            ary.push(today - curLiDate);
        });
        for (var i = 0; i < ary.length; i++) {
            var n = ary[i];
            if (n <= 0) {
                break;
            }
        }
        if (i === ary.length) {
            i = ary.length - 1;
        }
        var curLeft = (3 - i) * 110;
        curLeft = curLeft > maxL ? maxL : (curLeft < minL ? minL : curLeft);
        $calendarList.css("left", curLeft).find("li:eq(" + i + ")").addClass("bg");

        //->绑定数据
        matchModule.init(columnId);
    }

    //->获取数据后:完成左右按钮和LI的点击操作
    $calendarFns.add(bindEvent);
    function bindEvent(data, today, columnId) {
        $calendar.on("click", function (e) {
            var tar = e.target,
                tarTag = tar.tagName.toUpperCase(),
                $tar = $(tar);
            if (tarTag === "SPAN") {
                tar = tar.parentNode;
                $tar = $(tar);
                tarTag = tar.tagName.toUpperCase();
            }
            if (tarTag === "A") {
                if (tar.parentNode.tagName.toUpperCase() === "LI") {
                    $tar.parent().addClass("bg").siblings().removeClass("bg");
                    matchModule.scrollTo($tar.parent().attr("date"));
                    return;
                }

                //->点击的是左或者右
                var curL = parseFloat($calendarList.css("left"));
                if (curL % 110 !== 0) {
                    curL = Math.round(curL / 110) * 110;
                }
                if ($tar.hasClass("caleTriLeft")) {
                    curL += 770;
                }
                if ($tar.hasClass("caleTriRight")) {
                    curL -= 770;
                }
                curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
                $calendarList.stop().animate({left: curL}, 500, function () {
                    $(this).find("li:eq(" + Math.abs(curL) / 110 + ")").addClass("bg").siblings().removeClass("bg");

                    //->绑定数据
                    matchModule.init(columnId);
                });
            }

        });
    }

    //->模块中方法的入口
    function init(columnId) {
        columnId = columnId || 100000;
        $.ajax({
            url: serURL + "/calendar?columnId=" + columnId,
            type: "get",
            dataType: "jsonp",
            success: function (jsonData) {
                if (jsonData && jsonData["code"] == 0) {
                    var data = jsonData["data"],
                        today = data["today"];
                    data = data["data"];
                    minL = -(data.length - 7) * 110;//->最小LEFT
                    $calendarFns.fire(data, today, columnId);
                }
            }
        });
    }

    return {
        init: init
    };
})();

//第四步：绑定比赛列表区域的数据
var matchModule = (function () {
    //->滚动到具体的日期位置
    function scrollTo(tarTime) {
        var tarElement = $(".matchInfo[date='" + tarTime + "']")[0];
        if (tarElement) {
            matchListScroll.scrollToElement(tarElement);
        }
    }

    //->绑定HTML
    function bindHTML(data) {
        var str = '';
        $.each(data, function (key, value) {
            str += '<div class="matchInfo" date="' + key + '">';
            str += '<h2>' + key.myFormatTime("{1}月{2}日") + '</h2>';
            str += '<ul>';
            $.each(value, function (index, curData) {
                //->每一个LI中还包含很多的详细信息,在这里把对应的HTML字符串拼接完成即可(自己回去扩展)
                str += '<li></li>';
            });
            str += '</ul>';
            str += '</div>';
        });
        $matchList.children("div").eq(0).html(str);
        matchListScroll.refresh();
        scrollTo($calendarList.find("li[class='bg']").attr("date"));
    }

    //->获取数据
    function init(columnId) {
        columnId = columnId || 100000;
        var strIn = Math.abs(parseFloat($calendarList.css("left"))) / 110,
            endIn = strIn + 6;
        var $allLis = $calendarList.find("li"),
            strTime = $allLis.eq(strIn).attr("date"),
            endTime = $allLis.eq(endIn).attr("date");

        $.ajax({
            url: serURL + "/list?columnId=" + columnId + "&startTime=" + strTime + "&endTime=" + endTime,
            type: "get",
            dataType: "jsonp",
            success: function (jsonData) {
                if (jsonData && jsonData["code"] == 0) {
                    bindHTML(jsonData["data"]);
                }
            }
        });
    }

    return {
        init: init,
        scrollTo: scrollTo
    };
})();

//第五步：点击左侧的MENU中的LI,右侧跟着改变
$(".menu a").on("click", function (e) {
    $(this).parent().addClass("bg").siblings().removeClass("bg");
    //->获取每一个LI对应的columnId
    var hash = $(this).attr("href").substring(1);
    calendarModule.init(queryColumnId(hash));

    //->滚动到具体的区域
    menuScroll.scrollToElement($(this).parent()[0], 300);
});
function queryColumnId(hash) {
    var columnId = 100000;
    switch (hash) {
        case "nba":
            columnId = 100000;
            break;
        case "ec":
            columnId = 3;
            break;
        case "csl":
            columnId = 208;
            break;
        case "afc":
            columnId = 605;
            break;
        case "ucl":
            columnId = 5;
            break;
        case "pl":
            columnId = 8;
            break;
        case "laliga":
            columnId = 23;
            break;
        case "seriea":
            columnId = 21;
            break;
        case "bundesliga":
            columnId = 22;
            break;
        case "l1":
            columnId = 24;
            break;
        case "cba":
            columnId = 100008;
            break;
        case "nfl":
            columnId = 100005;
            break;
        case "others":
            columnId = 100002;
            break;
    }
    return columnId;
}


//->开始进来绑定对应赛事的操作
var url = window.location.href,
    reg = /#([^?=&#]+)/;
var hash = reg.test(url) ? reg.exec(url)[1] : null;

var $curMenu = $(".menu a[href*='" + hash + "']");
if ($curMenu.length > 0) {
    $curMenu.parent().addClass("bg").siblings().removeClass("bg");
    menuScroll.scrollToElement($curMenu.parent()[0], 300);
}

calendarModule.init(queryColumnId(hash));

















