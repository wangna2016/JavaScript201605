var oBox = document.getElementById("box");
oBox.onclick = function (ev) {
    ev = ev || window.event;

    //->获取事件源
    var tar = ev.target || ev.srcElement,
        tarTag = tar.tagName.toUpperCase();

    //->此条件成立说明点击的事件源是页卡区域的LI
    if (tarTag === "LI" && tar.parentNode.className === "tab") {
        //->让当前点击的事件源有选中的样式,事件源的其它兄弟元素没有选中的样式
        var tarSiblings = utils.siblings(tar);
        for (var i = 0; i < tarSiblings.length; i++) {
            utils.removeClass(tarSiblings[i], "bg");
        }
        utils.addClass(tar, "bg");

        //->获取到对应的内容区域的DIV,让与事件源索引对应的DIV有选中样式,而其余的没有选中的样式
        var tarDivs = utils.nextAll(tar.parentNode),
            index = utils.index(tar);
        for (var k = 0; k < tarDivs.length; k++) {
            k === index ? utils.addClass(tarDivs[k], "bg") : utils.removeClass(tarDivs[k], "bg");
        }
    }
};