var oDiv = document.getElementById("box");
oDiv.onmousemove = function () {
    this.style.background = "red";
};
oDiv.onmouseout = function () {
    this.style.background = "green";
};