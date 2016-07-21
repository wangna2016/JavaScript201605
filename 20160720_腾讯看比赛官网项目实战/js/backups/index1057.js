var $content = $(".content"),
    $calendar = $content.find(".calendar"),
    $matchList = $content.find(".matchList");
var serURL = "http://matchweb.sports.qq.com/kbs";//->服务器数据接口的地址前缀(我们所有的数据接口基本山都要从这个服务器上获取)

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
    var $calendarFns = $.Callbacks();//->发布一个计划

    //->获取数据后:把日期列表版绑定在日期的区域
    $calendarFns.add(bindHTML);//->把某一个方法增加到计划表中 增加用add,移除用remove
    function bindHTML(data, today) {

    }

    //->获取数据后:定位当当前日期的位置或者定位到当前日期后面最近的一个位置
    $calendarFns.add(positionToday);
    function positionToday(data, today) {

    }


    //->模块中方法的入口:在这里实现获取需要的日期数据(想获取那个赛事的,就把对应赛事的columnId传递进来即可)
    function init(columnId) {
        columnId = columnId || 100000;//->默认获取的是NBA的
        $.ajax({
            url: serURL + "/calendar?columnId=" + columnId,
            type: "get",
            dataType: "jsonp",
            success: function (jsonData) {
                //->我们使用jQ提供的发布订阅模式完成数据获取成功后的相关事项
                if (jsonData && jsonData["code"] == 0) {
                    var data = jsonData["data"],
                        today = data["today"];
                    data = data["data"];
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















