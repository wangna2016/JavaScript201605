function fn() {
    console.log("hello word!");
}

//->module和module.exports都是NODE天生自带的:用来把本模块中某些东西导出的方法
//typeof module ->"object"
//typeof module.exports ->"object"  在exports上增加的属性名和属性值就是我们向外导出的方法

module.exports.fn = fn;