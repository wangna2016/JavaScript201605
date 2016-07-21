var $content = $(".content"),
    $calendar = $content.find(".calendar"),
    $matchList = $content.find(".matchList");

//第一步：控制区域CONTENT/MATCH LIST的高度
changeHeight();
function changeHeight() {
    var $winH = $(window).innerHeight();

    //->CONTENT的高度=一屏幕的高度-HEADER高度-MARGIN值
    $content.css("height", $winH - 63 - 30);

    //->MATCH LIST的高度=CONTENT的高度-CALENDAR的高度-MARGIN值
    $matchList.css("height", $content.outerHeight() - $calendar.outerHeight() - 15);
}
//->当浏览器窗口大小改变的时候,重新把对应区域的高度进行改变
$(window).on("resize", changeHeight);


//第二步：使用ISCROLL.JS实现指定区域的局部滚动
//[例如让MENU区域实现局部滚动]
//->首先给MENU区域加一个CSS样式 "position: relative;" , 这样做的目的是为了让一会出现的滚动条是相对于MENU这个区域定位的(我们看见的滚动条是ISCROLL给自动创建的,它的样式中是用position: absolute实现的,如果MENU区域没有加relative,它会相对于BODY去定位,这样滚动条就不能处出现在MENU区域内了)

//->第二步初始化ISCROLL
var menuScroll = new IScroll(".menu", {
    scrollbars: true,//->显示滚动条
    bounce: false,//->到达边界后没有缓冲效果
    mouseWheel: true//->PC端鼠标滚轮滚动,区域也跟着滚动
});

//->第三步:我们还可以自定义滚动条的样式 原理:ISCROLL生成的滚动条有“iScrollVerticalScrollbar”样式,我们自己设定它的样式
$(".menu .iScrollVerticalScrollbar").css({
    opacity: 0.3
});

//[matchList 区域的局部滚动]
//ISCROLL的部分原理:ISCROLL需要外层容器的高度是固定的,并且它是给外层容器中的第一个子元素实现滚动的,所以需要把容器中的内容统一放在容器第一个子元素中
var matchListScroll = new IScroll(".matchList", {
    scrollbars: true,
    bounce: false,
    mouseWheel: true
});
$(".matchList .iScrollVerticalScrollbar").css({
    opacity: 0.3
});
