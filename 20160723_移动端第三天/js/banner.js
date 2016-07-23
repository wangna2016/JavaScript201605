//->querySelectorAll不存在DOM的映射 getElementsByTagName这个方法存在DOM的映射
var banner = document.querySelector(".banner"),
    wrapper = banner.querySelector(".wrapper"),
    bannerTip = banner.querySelector(".tip");
var wraDivList = wrapper.getElementsByTagName("div"),
    wraImgList = wrapper.getElementsByTagName("img"),
    tipList = bannerTip.getElementsByTagName("li");

//->计算REM和PX的换算比例
~function (desW) {
    var winW = document.documentElement.clientWidth;
    if (winW >= desW) {
        banner.style.width = desW + "px";
        banner.style.margin = "0 auto";
        return;
    }
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}(640);

//->实现轮播图的业务逻辑
var bannerModule = (function () {
    var total = 0,//->Number of stored div
        step = 1,//->Index of this area of the current activity
        autoTimer = null,
        interval = 2000;
    var winW = banner.offsetWidth;

    //->AUTO MOVE
    function autoMove() {
        step++;
        wrapper.style.left = -step * winW + "px";
    }
    
    //->LAZY IMG
    function lazyImg() {
        [].forEach.call(wraImgList, function (curImg, index) {
            var oImg = new Image;
            oImg.src = curImg.getAttribute("data-src");
            oImg.onload = function () {
                curImg.src = this.src;
                curImg.style.display = "block";
                curImg.className = "imgMove";
                oImg = null;
            }
        });
    }

    //->BIND HTML
    function bindHTML(data) {
        var str1 = '', str2 = '';
        str1 += '<div><img data-src="' + data[data.length - 1]["img"] + '"/></div>';
        data.forEach(function (curData, index) {
            str1 += '<div><img data-src="' + curData["img"] + '"/></div>';

            index === 0 ? str2 += '<li class="bg"></li>' : str2 += '<li></li>';
        });
        str1 += '<div><img data-src="' + data[0]["img"] + '"/></div>';
        wrapper.innerHTML = str1;
        bannerTip.innerHTML = str2;

        //->computed div width
        total = data.length + 2;
        [].forEach.call(wraDivList, function (item) {
            item.style.width = winW + "px";
        });
        wrapper.style.width = total * winW + "px";

        //->lazy img
        window.setTimeout(lazyImg, 500);

        //->auto move
        autoTimer = window.setInterval(autoMove, interval);
    }

    //->SEND AJAX
    function init() {
        var xhr = new XMLHttpRequest;
        xhr.open("get", "json/banner.json?_=" + Math.random(), true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                var data = JSON.parse(xhr.responseText);
                bindHTML && bindHTML(data);//->Get the data to achieve the binding of the page and calculate the width of the area
            }
        };
        xhr.send(null);
    }

    return {
        init: init
    }
})();
bannerModule.init();




