var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    //->前端路由:我们在NODE中创建的服务会根据客户端请求资源文件的不一样,给客户端也返回不一样的内容,这种处理判断的机制就是“前端路由”
    if (pathname === "/json/data.txt" || pathname === "/index.html") {
        //->"." + pathname => "./json/data.txt" 原理：./是当前服务目录,我们请求的地址和资源是谁,我们服务就从自己的目录开始一级级查找即可
        var fileCon = fs.readFileSync("." + pathname, "utf-8");
        response.writeHead(200, {'content-type': 'text/plain;charset=utf-8;'});
        response.end(fileCon);
        return;
    }

    if (pathname === "/index.html") {
        fileCon = fs.readFileSync("." + pathname, "utf-8");
        response.writeHead(200, {
            'content-type': 'text/html;charset=utf-8;'
        });
        response.end(fileCon);
    }
});
server.listen(80, function () {
    console.log("服务创建成功正在监听80端口!");
});