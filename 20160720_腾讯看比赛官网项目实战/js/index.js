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
        //->给当前的区域设定宽度,让所有的LI在UL中一行展示,以后想展示目前隐藏的LI,我们只需要控制UL在WAPPERR中的LEFT的值即可(等同于轮播图实现的思路)
    }

    //->获取数据后:定位当当前日期的位置或者定位到当前日期后面最近的一个位置
    $calendarFns.add(positionToday);
    function positionToday(data, today) {
        //->计算当天日期和所有日期的时间差
        var ary = [];
        today = new Date(today.replace(/-/g, "/"));
        $calendarList.children("li").each(function (index, curLi) {
            var curLiDate = new Date($(curLi).attr("date").replace(/-/g, "/"));
            ary.push(today - curLiDate);//->把相差毫秒差存储到数组中
        });

        //->在数组中取出距离零最近的这一个正数值,以及取出的这个值的索引(i)
        for (var i = 0; i < ary.length; i++) {
            var n = ary[i];
            if (n <= 0) {
                break;
            }
        }

        //->如果今天日期大于所有日期,我们定位到最后一个即可
        if (i === ary.length) {
            i = ary.length - 1;
        }

        //->定位到具体的位置并且让当前日期有选中的样式: -i * 110 让当前LI在七个中的最左边,如果需要让其在中间 -i*110+3*110 => (3-i)*110
        var curLeft = (3 - i) * 110;
        curLeft = curLeft > maxL ? maxL : (curLeft < minL ? minL : curLeft);
        $calendarList.css("left", curLeft).find("li:eq(" + i + ")").addClass("bg");
    }

    //->获取数据后:完成左右按钮和LI的点击操作
    $calendarFns.add(bindEvent);
    function bindEvent() {
        $calendar.on("click", function (e) {
            var tar = e.target,
                tarTag = tar.tagName.toUpperCase(),
                $tar = $(tar);

            //->如果我们点击的是SPAN我们都获取它的父级元素(A),以后我们只需要判断A即可
            if (tarTag === "SPAN") {
                tar = tar.parentNode;
                $tar = $(tar);
                tarTag = tar.tagName.toUpperCase();
            }

            if (tarTag === "A") {
                //->点击的是LI下的A
                if (tar.parentNode.tagName.toUpperCase() === "LI") {
                    $tar.parent().addClass("bg").siblings().removeClass("bg");
                    return;
                }

                //->点击的是左或者右
                var curL = parseFloat($calendarList.css("left"));
                //->为了防止快速点击,我们需要保证每一次点击的时候我们起始的LEFT的值是110的倍数才可以,只有这样才能保证每一屏幕都是完整的七个
                if (curL % 110 !== 0) {
                    curL = Math.round(curL / 110) * 110;
                }
                if ($tar.hasClass("caleTriLeft")) {
                    //->左:向右走,在原来的LEFT值基础上+770即可
                    curL += 770;
                }
                if ($tar.hasClass("caleTriRight")) {
                    //->右:向左走,在原来的LEFT值基础上-770即可
                    curL -= 770;
                }
                curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
                //->开始运动":当运动完成后,让当前展示的这七个中的第一个选中
                $calendarList.stop().animate({left: curL}, 500, function () {
                    $(this).find("li:eq(" + Math.abs(curL) / 110 + ")").addClass("bg").siblings().removeClass("bg");
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
                    $calendarFns.fire(data, today);
                }
            }
        });
    }

    return {
        init: init
    };
})();
calendarModule.init();















