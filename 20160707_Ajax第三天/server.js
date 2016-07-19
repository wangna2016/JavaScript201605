var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    //->请求的是HTML/CSS/JS等资源文件
    var reg = /\.(HTML|CSS|JS|TXT|JSON)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = "text/plain";
        switch (suffix) {
            case "HTML":
                suffixMIME = "text/html";
                break;
            case "CSS":
                suffixMIME = "text/css";
                break;
            case "JS":
                suffixMIME = "text/javascript";
                break;
            case "JSON":
                suffixMIME = "application/json";
        }
        try {
            var fileCon = fs.readFileSync("." + pathname, "utf-8");
            response.writeHead(200, {'content-type': suffixMIME + ';charset=utf-8;'});
            response.end(fileCon);
        } catch (e) {
            response.writeHead(404);
            response.end();
        }
        return;
    }

    //->编写数据请求的API接口地址
    if (pathname === "/data/getAllData") {
        var userInfo = fs.readFileSync("./json/userInfo.json", "utf-8");
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(userInfo);
    }
});
server.listen(666, function () {
    console.log("server is success! listening in 666 port!");
});