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
    function getCss( attr) {
        var val = null;
        if (window.getComputedStyle) {
            val = window.getComputedStyle(this, null)[attr];
        } else {
            if (attr === 'opacity') {
                val = this.currentStyle['filter'];
                var filterReg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = filterReg.test(val) ? filterReg.exec(val)[1] / 100 : 1;
            } else {
                val = this.currentStyle[attr];
            }
        }
        var reg = /^-?\d+(\.\d+)?(px|em|rem|deg|pt)?$/;
        if (reg.test(val)) {
            val = parseFloat(val)
        }
        return val;
    }
    function setCss(attr, val) {　
        if (attr === 'opacity') {
            this.style[attr] = val;
            this.style.filter = 'alpha(opacity=' + val * 100 + ')';
            return;
        }
        if (attr === 'float') {
            this.style['cssFloat'] = val;
            this.style['styleFloat'] = val;
            return;
        }

        var reg = /^width|height|top|left|right|bottom|border|(margin|padding)(Left|Top|right|bottom)$/;
        if (reg.test(attr)) {
            if (!isNaN(val)) {
                val += 'px';
            }
        }
        this['style'][attr] = val;
    }
    // 设置一组样式
    function setGroupCss(options){ //批量设置options这个对象里每一组属性
        //context = context || document
        options = options || []; //这一行代码就是保证options.toString()不报错
        //{left:500,height:600}   setCss(ele,left,500) setCss(ele,height,600)
        if(options.toString() == '[object Object]'){
            for(var key in options){
                if(options.hasOwnProperty(key)){
                    setCss.call(this,key,options[key]); //这个this是要操作的那个元素
                }
            }
        }
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
    function prev(ele){ //
        var pre = ele.previousSibling;
        while(pre && pre.nodeType != 1){
            pre = pre.previousSibling;
        }
        return pre;
    }
    function next(ele){
        var next = ele.nextSibling;
        while(next && next.nodeType != 1){
            next = next.nextSibling;
        }
        return next;
    }
    function prevAll(ele){
        var ary = [];
        var pre = ele.previousSibling; //
        while(pre){
            if(pre.nodeType == 1){ //
                ary.unshift(pre);
            }
            pre = pre.previousSibling; //pre = this.prev(pre);
        }
        return ary;
    }
    function nextAll(ele){
        var ary = [];
        var next = ele.nextSibling; //
        while(next){
            if(next.nodeType == 1){ //
                ary.push(next);
            }
            next = next.nextSibling; //pre = this.prev(pre);
        }
        return ary;
    }

    function siblings(ele){
        return prevAll(ele).concat(nextAll(ele));
    }
    function index(ele){
        return this.prevAll(ele).length;
    }

    // hasClass(oDiv,'c1')  <div class='     c1' ></div>  /c1/g
    function hasClass(ele,className){
        var reg = new RegExp('(^| +)'+className+"( +|$)");
        return reg.test(ele.className);
    }

    //addClass    <div class='c1 c2 c3'></div>
    //addClass(oDiv,'c2 c3')
    function addClass(ele,strClass){
       //把传进来的这个strClass不仅仅要去掉首尾空格还要拆分成数组
        var classAry = strClass.replace(/^ +| +$/g,"").split(/ +/g);
        //['c2','c3'] ==> 我把c2和c3都添加到ele.className中后面去
        for(var i=0; i<classAry.length; i++){
            var curClass = classAry[i];
            if(!hasClass(ele,curClass)){ //如果ele中不存这个class我才添加
                ele.className += ' '+curClass;
            }
        }
    }

    //<div class='c1 c2  c3'></div>
    //removeClass(oDiv,' c2 c3 ');
    function removeClass(ele,strClass){
        var classAry = strClass.replace(/^ +| +$/g,"").split(/ +/g);
        //['c2','c3']
        for(var i=0; i<classAry.length; i++){
            var curClass = classAry[i];
            var reg = new RegExp('(^| +)'+ curClass + '( +|$)','g');
            if(hasClass(ele,curClass)){
                ele.className = ele.className.replace(reg,' ');
            }
        }
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
    //     getCss(oDiv,'width') 获取 ==> 第二个参数是一个字符串
    //setGroupCss(oDiv,{opacity: 0.8})  ==>第二个参数是一个对象
    //     setCss(oDiv,'height',500);  设置

    function css(ele){ //根据参数的不同做不同操作，根据参数不同调用不同的函数
        var secondArgu = arguments[1]; //第二个参数
        var thirdArgu = arguments[2]; //第三个参数
        var newArg = listToArray(arguments).slice(1);
        if(typeof secondArgu != 'undefined'){ //第二个参数传了
            if(typeof thirdArgu != 'undefined'){ //第三个参数传了，设置样式
                setCss.apply(ele,newArg); //我只是想把这三个参数原封不动传给setCss    arguments = [ele,2,3]
            }else{ //第三个参数没传，但是第二个参数传了  1 对象  2 string
                if(typeof secondArgu == 'string'){
                    return getCss.apply(ele,newArg);
                }else if(secondArgu.toString() == '[object Object]' ){
                    setGroupCss.apply(ele,newArg);
                }
            }
        }
    }


    return {
        listToArray : listToArray,
        jsonParse : jsonParse,
        win : win,
/*
        getCss : getCss,
        setCss : setCss,
*/
        offset : offset,
        hasClass : hasClass,
        addClass : addClass,
        removeClass : removeClass,
        prev : prev,
        next:next,
        prevAll : prevAll,
        index : index,
        setGroupCss : setGroupCss,
        getElementsByClass : getElementsByClass,
        siblings: siblings,
        css : css
    }
})();





