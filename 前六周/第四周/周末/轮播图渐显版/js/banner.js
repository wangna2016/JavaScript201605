//获取元素
var banner = document.getElementById('banner2');
var bannerInner = utils.fistEleChild(banner);
var focusList = utils.children(banner,'ul')[0];
var left = utils.getElementsByClass('left',banner)[0];
var right = utils.getElementsByClass('right',banner)[0];
var imgBoxList = bannerInner.getElementsByTagName('div');
var imgList = bannerInner.getElementsByTagName('img');
var lis = focusList.getElementsByTagName('li');
var data = null;

//获取数据
function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt?_='+Math.random(),false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)){
            data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
}
getData();
console.log(data);

//数据绑定
function bindData(){
    if(data){
        var str1 = '';
        var str2 = '';
        for(var i=0; i<data.length; i++){
            var curDataObj = data[i];
            str1 += '<div><img src="" trueSrc="' + curDataObj.src + '" alt=""/></div>';
            str2 +=    i==0 ? '<li class="bg"></li>' : '<li></li>';
        }
        bannerInner.innerHTML = str1;
        focusList.innerHTML = str2;
    }
}
bindData();

//图片延迟加载
function imgDelayLoad(){
    for(var i=0; i<imgList.length; i++){
        ;(function (i){
            var curImg = imgList[i];
            if(curImg.isLoad) return;
            var tempImg = new Image();
            tempImg.src = curImg.getAttribute('trueSrc');
            tempImg.onload = function (){
                curImg.src = this.src;
                utils.css(curImg,'display','block');
                tempImg = null;
                if( i === 0 ){ //这会是第一张图片,我处理透明度需要处理第一张图片父级div
                    utils.css(curImg.parentNode,'zIndex',1);
                    zhufengAnimate(curImg.parentNode,{opacity:1},100);
                }else{
                    utils.css(curImg,'zIndex',0);
                }
            }
            curImg.isLoad = true;
        })(i);
    }
}
window.setTimeout(imgDelayLoad,500);

//
var step = 0; //用来记录当前是第几张图,默认是第一张显示
var timer = null;
var interval = 2000;

function autoMove(){
    if(step == data.length-1){
        step = -1;
    }
    step++; //step   0 => 1 我让第二张的zIndex变成1
    setBanner();
}

function setBanner(){
    for(var i=0; i< imgBoxList.length; i++){
        var curDiv = imgBoxList[i];
        if(i == step){ //我要显示的那一张
            utils.css(curDiv,'zIndex',1);
            zhufengAnimate(curDiv,{opacity:1},200,function (){
                //当前运动的那一张的透明度从0运动到1之后，我需要把其他的图片盒子的透明设置成0
                var siblings = utils.siblings(this); //获取除了我之外的所有兄弟节点
                for(var j=0; j<siblings.length; j++){
                    var curSibling = siblings[j];
                    utils.css(curSibling,'opacity',0);
                }
            });
        }else{
            utils.css(curDiv,'zIndex',0);  //如果不是我要显示的那一张我就把它的z-index设置为0
        }
    }

    //处理焦点对齐的问题
    for(var k=0; k<lis.length; k++){
        var curLi = lis[k];
        k === step ? utils.addClass(curLi,'bg') : utils.removeClass(curLi,'bg'); //和当前显示图片索引相同的添加bg这个类，否则移除这个类
    }
}
timer = window.setInterval(autoMove,interval);

banner.onmouseover = function (){
    window.clearInterval(timer);
    utils.css(left,'display','block');
    utils.css(right,'display','block');
}
banner.onmouseout = function (){
    timer = window.setInterval(autoMove,interval);
    utils.css(left,'display','none');
    utils.css(right,'display','none');
}

function bindEvetnForFocus(){
    for(var i=0; i<lis.length; i++){
        var curLi = lis[i];
        curLi.index = i; //保存这个自定义属性是用来点击时候运动到这一张
        curLi.onclick = function (){
            step = this.index;
            setBanner();
        }
    }
}
bindEvetnForFocus();

left.onclick = function (){
    if(step ==0){ //已经运动到了第一张，下一次就该运动到最后一张了
        step = data.length;
    }
    step--;
    setBanner();
}
right.onclick = autoMove;  //点击right按钮就是antoMove

