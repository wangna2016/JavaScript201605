function sum() {
    var total = null;
    for (var i = 0, len = arguments.length; i < len; i++) {
        var cur = Number(arguments[i]);
        if (!isNaN(cur)) {
            total += cur;
        }
    }
    return total;
}

module.exports = {
    sum: sum
};