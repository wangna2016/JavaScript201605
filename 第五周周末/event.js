function bind(ele,type,fn){//负责用DOM2的方法来绑定事件，ele是被绑定事件的元素，type是事件类型,fn绑定的方法
	if(ele.addEventListener){
		ele.addEventListener(type,fn,false);
	}else{
		//处理IE的this指向问题
		//如果不需要移除事件，则以下两行代码足够了
		//var fnTemp=function(){fn.call(ele)}
		//ele.attachEvent("on"+type,fnTemp);
		//如果要考虑移除，则问题就复杂了：
		//1、需要把fnTemp保存下来，并且能够在unbind里找到、识别出来
		//fnTemp保存到一个unbind和bind共有（都可以操作）的一个对象的属性上
		if(!ele["aBind"+type]){
			ele["aBind"+type]=[];	//如果不存在这个数组，则定义一个
		}
		
		var a=ele["aBind"+type];
		for(var i=0;i<a.length;i++){
			if(a[i].photo==fn)return;//在处理和绑定fn之前，先判断一下这个fn方法是否已经被处理过
			//fn1存在不存和它是否被绑定是两码事
		}
		
		var fnTemp=function(){fn.call(ele)}
		fnTemp.photo=fn;//加一个自定义属性，用来标识这个方法是由那个方法变形而来
		
		a.push(fnTemp);//就是为了把变形的方法，也就是真正绑定的方法保存下来
		ele.attachEvent("on"+type,fnTemp);
		}
	
}

function unbind(ele,type,fn){//移除绑定的方法
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);	
	}else{
		//只处理IE的问题
		var a=ele["aBind"+type];//把保存被绑定到事件上的方法的数组找到
		
		if(a)//确保这个数组存在
		for(var i=0;i<a.length;i++){
			//知道原来被绑定到type事件上的方法在a里保存着呢，但是不知道是那一个。所以开始用循环的方法一个个找（通过photo这个属性来找出来）
			if(a[i].photo==fn){
				ele.detachEvent("on"+type,a[i]);//这只是在事件上把a[i]移除了，但是数组里还没有移除呢
				a.splice(i,1);//不但在事件上将其移除，还要在数组里也要将其移除，否则再重新绑定就绑不上了
				return;//退出
			}
		}
	}	
}