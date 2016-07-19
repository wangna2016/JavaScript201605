var oBox = document.getElementById("box"),
    oTab = utils.getElementsByClass("tab", oBox)[0],
    oLis = utils.children(oTab, "li"),
    oDivs = utils.getElementsByClass("content", oBox);

for (var i = 0, len = oLis.length; i < len; i++) {
    var curLi = oLis[i];
    curLi.index = i;
    curLi.onclick = function () {
        //->�õ������һ������BG��ʽ,�������ֵ����Ƴ�BG��ʽ
        utils.addClass(this, "bg");
        var curSiblings = utils.siblings(this);
        for (var k = 0; k < curSiblings.length; k++) {
            utils.removeClass(curSiblings[k], "bg");
        }

        //->�ú͵�ǰ������LI������ͬ��DIV��ѡ�е���ʽ,�������û�м���
        for (var z = 0; z < oDivs.length; z++) {
            z === this.index ? utils.addClass(oDivs[z], "bg") : utils.removeClass(oDivs[z], "bg");
        }
    }
}