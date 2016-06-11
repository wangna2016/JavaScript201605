/**
 * Created by lucky on 2016/6/10.
 */

var utils = (function (){
    function listToArray(likeArray) {
        try {
            return Array.prototype.slice.call(likeArray, 0);
            //[].slice.call(likeArray,0)
        } catch (e) {
            var a = [];
            for (var i = 0; i < likeArray.length; i++) {
                a[a.length] = likeArray[i];
            }
            return a;
        }
    }
    function jsonParse(jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }
    function win(attr, val) {
        if (typeof val != "undefined") {
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    }
    function getCss(ele, attr) {
        var val = null;
        if (window.getComputedStyle) {
            val = window.getComputedStyle(ele, null)[attr];
        } else {
            if (attr === 'opacity') {
                val = ele.currentStyle['filter'];
                var filterReg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = filterReg.test(val) ? filterReg.exec(val)[1] / 100 : 1;
            } else {
                val = ele.currentStyle[attr];
            }
        }
        var reg = /^-?\d+(\.\d+)?(px|em|rem|deg|pt)?$/;
        if (reg.test(val)) {
            val = parseFloat(val)
        }
        return val;
    }
    function setCss(ele, attr, val) {　
        if (attr === 'opacity') {
            ele.style[attr] = val;
            ele.style.filter = 'alpha(opacity=' + val * 100 + ')';
            return;
        }
        if (attr === 'float') {
            ele.style['cssFloat'] = val;
            ele.style['styleFloat'] = val;
            return;
        }

        var reg = /^width|height|top|left|right|bottom|border|(margin|padding)(Left|Top|right|bottom)$/;
        if (reg.test(attr)) {
            if (!isNaN(val)) {
                val += 'px';
            }
        }
        ele['style'][attr] = val;
    }
    function offset(ele){
        var l = null,t = null, parent = ele.offsetParent;
        l += ele.offsetLeft;
        t += ele.offsetTop;
        while(parent){
            l += parent.clientLeft + parent.offsetLeft;
            t +=  parent.clientTop + parent.offsetTop;
            parent = parent.offsetParent;
        }
        return { left : l, top : t };
    }
    function prev(ele){ //��ȡԪ�ص���һ��Ԫ�ظ��ڵ�
        var pre = ele.previousSibling;
        while(pre && pre.nodeType != 1){
            pre = pre.previousSibling;
        }
        return pre;
    }
    function prevAll(ele){
        var ary = [];
        var pre = ele.previousSibling; //pre = this.prev(ele); ����this.prev��ȡ���Ķ���Ԫ��
        while(pre){
            if(pre.nodeType == 1){ //�������prev��������жϾ�û�б�Ҫ��
                ary.unshift(pre);
            }
            pre = pre.previousSibling; //pre = this.prev(pre);
        }
        return ary;
    }
    function index(ele){
        return this.prevAll(ele).length;
    }
    function getElementsByClass(strClass,context){ //'c1  c2' ==[c1,c2]
        context = context || document;
        if('getComputedStyle' in window){
            return context.getElementsByClassName(strClass);
        }

        var ary = [];
        var nodeList = context.getElementsByTagName('*');
        var classArray = strClass.replace(/^ +| +$/g,'').split(/ +/g);
        for(var i=0; i<nodeList.length; i++){
            var culTag = nodeList[i];
            var flag = true;
            for(var j=0; j<classArray.length; j++){
                var curClass = classArray[j];
                var reg = new RegExp('\\b'+curClass+'\\b'); //<div class='c1 c2 '>
                if(!reg.test(culTag.className)){
                    flag = false;
                    break;
                }
            }
            if(flag){
                ary.push(culTag);
            }
        }
        return ary;
    }
    return {
        listToArray : listToArray,
        jsonParse : jsonParse,
        win : win,
        getCss : getCss,
        setCss : setCss,
        offset : offset,
        prev : prev,
        prevAll : prevAll,
        index : index,
        getElementsByClass : getElementsByClass
    }
})();




