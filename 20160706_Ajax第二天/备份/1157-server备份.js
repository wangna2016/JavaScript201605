var http = require("http"),
    url = require("url"),
    fs = require("fs");//->FS模块提供了一些方法供我们进行文件的读写(I/O操作)

var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj["pathname"],
        query = urlObj["query"];

    //->说明我们当前需要请求的是JSON这个文件夹下的DATA.TXT文件:我们需要把这个文件中的内容得到,然后返回给客户端即可
    if (pathname === "/json/data.txt") {
        //->fs.readFileSync([file path],[file encoding]):同步读取指定路径和名称的文件中的内容(同步读取:当前文件内容没有读取完成,下面的代码是不会执行的)
        var fileCon = fs.readFileSync("./json/data.txt", "utf-8");

        response.writeHead(200, {'content-type': 'text/plain;charset=utf-8;'});//->重写响应头信息,content-type是响应内容的类型 text/plain是文本的MIME类型 charset=utf-8设定响应内容的编码格式
        response.end(fileCon);
    }
});
server.listen(1234, function () {
    console.log("当前服务已经启动,正在监听1234端口!");
});
