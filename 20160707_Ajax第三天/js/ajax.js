//->createXHR:创建AJAX对象兼容所有的浏览器
function createXHR() {
    var xhr = null;
    var ary = [
        function () {
            return new XMLHttpRequest;
        },
        function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml2.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml3.XMLHTTP");
        }
    ];
    for (var i = 0, len = ary.length; i < len; i++) {
        var curFn = ary[i];
        try {
            xhr = curFn();
        } catch (e) {
            continue;
        }
        createXHR = curFn;
        break;
    }
    return xhr;
}

//->ajax:实现AJAX的数据请求
//options是我们唯一的形参,需要传递给方法的参数都以options这个对象的属性名和属性值的方式传递进来
function ajax(options) {
    //->默认的参数配置:用传递进来的值替换默认的值
    var _default = {
        type: "get",
        url: null,
        async: true,
        data: null,
        success: null
    };
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            _default[key] = options[key];
        }
    }

    //->如果当前的请求是GET,我们需要在URL的末尾追加一个随机数清除缓存
    if (_default.type === "get") {
        _default.url.indexOf("?") === -1 ? _default.url += "?_=" : _default.url += "&_=";
        _default.url += Math.random();
    }

    //->开始编写AJAX请求的程序
    var xhr = createXHR();
    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            var val = xhr.responseText,
                data = "JSON" in window ? JSON.parse(val) : eval("(" + val + ")");
            //->回调函数
            if (typeof _default.success === "function") {
                _default.success.call(xhr, data);
            }
            //_default.success && _default.success.call(xhr, data);
        }
    };
    xhr.send(_default.data);
}

