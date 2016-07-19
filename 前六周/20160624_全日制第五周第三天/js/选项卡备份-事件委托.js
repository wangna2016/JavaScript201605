var oBox = document.getElementById("box");
oBox.onclick = function (ev) {
    ev = ev || window.event;

    //->��ȡ�¼�Դ
    var tar = ev.target || ev.srcElement,
        tarTag = tar.tagName.toUpperCase();

    //->����������˵��������¼�Դ��ҳ�������LI
    if (tarTag === "LI" && tar.parentNode.className === "tab") {
        //->�õ�ǰ������¼�Դ��ѡ�е���ʽ,�¼�Դ�������ֵ�Ԫ��û��ѡ�е���ʽ
        var tarSiblings = utils.siblings(tar);
        for (var i = 0; i < tarSiblings.length; i++) {
            utils.removeClass(tarSiblings[i], "bg");
        }
        utils.addClass(tar, "bg");

        //->��ȡ����Ӧ�����������DIV,�����¼�Դ������Ӧ��DIV��ѡ����ʽ,�������û��ѡ�е���ʽ
        var tarDivs = utils.nextAll(tar.parentNode),
            index = utils.index(tar);
        for (var k = 0; k < tarDivs.length; k++) {
            k === index ? utils.addClass(tarDivs[k], "bg") : utils.removeClass(tarDivs[k], "bg");
        }
    }
};