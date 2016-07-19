var oBox = document.getElementById("box"),
    oTab = utils.getElementsByClass("tab", oBox)[0],
    oLis = utils.children(oTab, "li"),
    oDivs = utils.getElementsByClass("content", oBox);

for (var i = 0, len = oLis.length; i < len; i++) {
    var curLi = oLis[i];
    curLi.index = i;
    curLi.onclick = function () {
        //->让点击的这一个增加BG样式,而它的兄弟们移除BG样式
        utils.addClass(this, "bg");
        var curSiblings = utils.siblings(this);
        for (var k = 0; k < curSiblings.length; k++) {
            utils.removeClass(curSiblings[k], "bg");
        }

        //->让和当前点击这个LI索引相同的DIV有选中的样式,而其余的没有即可
        for (var z = 0; z < oDivs.length; z++) {
            z === this.index ? utils.addClass(oDivs[z], "bg") : utils.removeClass(oDivs[z], "bg");
        }
    }
}