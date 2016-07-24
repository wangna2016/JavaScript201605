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

//->动态设定REM的根植
~function (desW) {
    var winW = document.documentElement.clientWidth;
    if (winW > desW * 2) {
        var oMain = document.querySelector(".main");
        oMain.style.margin = "0 auto";
        oMain.style.width = desW * 2 + "px";
        return;
    }
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}(320);

//->menu event
var $nav = $(".nav"),
    $menuBtn = $(".menuBtn");
$menuBtn.singleTap(function () {
    if ($nav.attr("isBok") === "block") {
        $nav.css({
            padding: "0 0",
            height: "0"
        }).attr("isBok", "none");
        return;
    }
    $nav.css({
        padding: "0.05rem 0",
        height: "1.21rem"
    }).attr("isBok", "block");
});

//->get match data
var matchModule = (function () {
    function supportEvent() {
        var $supLeft = $("#supLeft"),
            $supRight = $("#supRight");
        //->验证之前是否点击过
        var support = localStorage.getItem("support");
        if (support) {
            support = JSON.parse(support);
            if (support.isClick) {
                var type = support.type;
                type == 1 ? $supLeft.addClass("bg") : $supRight.addClass("bg");
                return;
            }
        }

        $supLeft.singleTap(fn);
        $supRight.singleTap(fn);
        function fn() {
            if ($(this).parent().attr("isTap") === "true") {
                return;
            }
            $(this).html(parseFloat($(this).html()) + 1).addClass("bg").siblings().removeClass("bg");
            $(this).parent().attr("isTap", "true");

            //->存储到本地一份数据:{isClick:true,type:1}
            localStorage.setItem("support", JSON.stringify({
                isClick: true,
                type: $(this).attr("type")
            }));

            //->向服务器发送请求
            $.ajax({
                url: "http://matchweb.sports.qq.com/kbs/teamSupport?mid=100000:1468531&type=" + $(this).attr("type"),
                dataType: "jsonp"
            });
        }
    }

    function bindHTML(data) {
        var matchInfo = data["matchInfo"];
        var str = '';
        str += '<div class="base">';
        str += '<div><img src="' + matchInfo["leftBadge"] + '"/> <span>' + matchInfo["leftGoal"] + '</span></div>';
        str += '<div>' + matchInfo["startTime"].myFormatTime("{1}月{2}日 {3}:{4}") + '</div>';
        str += '<div><span>' + matchInfo["rightGoal"] + '</span> <img src="' + matchInfo["rightBadge"] + '"/></div>';
        str += '</div>';

        str += '<div class="line"><span></span></div>';

        str += '<div class="sup">';
        str += '<span id="supLeft" type="1">' + data["leftSupport"] + '</span>';
        str += '<span>' + matchInfo["matchDesc"] + '</span>';
        str += '<span id="supRight" type="2">' + data["rightSupport"] + '</span>';
        str += '</div>';
        $(".match").html(str);

        //->计算百分比
        window.setTimeout(function () {
            var l = parseFloat(data["leftSupport"]),
                r = parseFloat(data["rightSupport"]);
            $(".line span").css("width", (l / (l + r)) * 100 + "%");
        }, 500);
    }

    function init() {
        $.ajax({
            url: "http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468531",
            dataType: "jsonp",
            success: function (jsonData) {
                if (jsonData && jsonData[0] == 0) {
                    var data = jsonData[1];

                    //->bind html
                    bindHTML(data);

                    //->support
                    supportEvent();
                }
            }
        });
    }

    return {
        init: init
    };
})();
matchModule.init();