var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    //->创建一个静态资源文件请求处理的服务
    var reg = /\.(TXT|JSON|HTML|JS|CSS)/i;
    if (reg.test(pathname)) {//->说明pathname至少存储了正则中的某一个后缀名,也说明我们请求的应该是一个资源文件

        try {
            //->获取请求资源文件的后缀名从而计算出对应的MIME类型
            var suffix = reg.exec(pathname)[1].toUpperCase();
            var suffixMIME = "text/plain";
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
                    break;
            }

            //->读取对应文件中的内容,然后向客户端返回,注意指定的MIME类型需要和文件保持统一
            var fileCon = fs.readFileSync("." + pathname, "utf-8");
            response.writeHead(200, {'content-type': suffixMIME + ';charset=utf-8;'});
            response.end(fileCon);

        } catch (e) {
            //->对于非正常的请求(比如请求的文件在服务器不存在),我们返回给客户端404(资源文件不存在)
            response.writeHead(404);
            response.end("当前的页面不存在~~");
        }
    }

});
server.listen(80, function () {
    console.log("服务创建成功正在监听80端口!");
});