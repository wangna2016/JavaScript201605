var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    if (pathname === "/getData") {
        //->获取客户端传递进来的方法名
        var tempFn = query["callback"];

        //->把数据准备好
        var data = fs.readFileSync("./data.json", "utf-8");

        //->进行拼接
        var result = tempFn + '(' + data + ')';//->'aa(...)'

        //->返回给客户端
        res.writeHead(200, {'content-type': 'text/javascript;charset=utf-8;'});
        res.end(result);
    }
});
server.listen(80);