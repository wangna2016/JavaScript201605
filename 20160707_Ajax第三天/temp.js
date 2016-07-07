var count = 0;
setTimeout(function () {
    count = 10;
    console.log(count);
}, 100);

setTimeout(function () {
    count = -10;
    console.log(count);
}, 98);

var c = new Date();
var i = 0;
while (i < 1000000000) {
    i++;
}
console.log(new Date() - c);