var http = require("http"),
    url = require("url");//->URL模块:提供一些方法用来解析URL地址的

//->创建一个服务:接收客户端的请求信息,准备对应的内容文件,并且把数据和内容返回给客户端
var server = http.createServer(function (request, response) {
    //->首先需要接收到客户端的请求信息
    //->request.url:存储的是客户端请求的地址(包含了路径、文件名称、问号后面的参数值)，例如：/lib/index.html?name=12&age=7

    //->url.parse:用来解析URL地址的 url.parse([url string],[true|false](第二个参数不传递默认就是false)) 返回一个解析后的对象
    var obj = url.parse(request.url, true),
        pathname = obj["pathname"],
        query = obj["query"];


    response.write(JSON.stringify(obj));//->我们服务器端向客户端响应的数据内容必须是字符串或者Buffer格式的数据
    response.end();
});

//->监听一个端口
server.listen(80, function () {
    console.log("服务已经启动,正在监听80端口!");
});