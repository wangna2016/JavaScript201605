var test1 = require("./test1");
var test2 = require("./test2");

function fn() {
    var total = test1.sum(1, 2, 3, 4);
    var res = test2.sum(total);
    return res + 100;
}
var res = fn();
console.log(res);