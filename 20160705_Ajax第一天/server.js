var http = require("http");
//->这个模块中提供了一些方法用来创建服务和监听端口

//->创建服务:返回的结果sv就是我们当前创建的这个服务，传递进来的回调函数会在客户端向服务器端发送请求的时候被触发，话句话说，服务创建成功并没有被触发，而是只有当前客户端发送一个请求后才会被触发的，如果客户端发送100次请求，那么当前的回调函数会被分别触发100次...
var sv = http.createServer(function (request, response) {
    //->request中存储了客户端的全部请求信息
    //->response提供了向客户端返回内容的方法
    response.write("my name is zhouxiaotian~~");
    response.write("my age is 26~~");
    response.end();
});

//->sv.listen:让当前的服务监听服务器的80端口,端口监听成功后会触发回调函数执行
//->Error: listen EACCES 0.0.0.0:80 说明当前的80端口已经被占用,我们需要换一个端口号
sv.listen(88, function () {
    console.log("server is success，listening in 88 port~");
});

//->以上的两步骤完成,我们以后客户端就可以向服务器发送请求了,服务器也可以接收到请求,并且找到对应的端口号,到对应的端口号中找资源文件...


//var url = require("url");
//var fs = require("fs");