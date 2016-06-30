function on(ele,type,fn){
	
	if(ele.addEventListener){
		ele.addEventListener(type,fn,false);
	}else{
		if(!ele["aEvent"+type]){//这一步算是核心代码2
			ele["aEvent"+type]=[];//先要创建这个事件池数组
			ele.attachEvent("on"+type,function(){run.call(ele)});//真正绑定到事件上的是run方法，把run方法用这种方式绑定到ele的type事件，并且这句表达式只能写在这儿。为什么？这样可以确定run的绑定不重复（因为这行代码只执行一次）
		}
		var a=ele["aEvent"+type];
		for(var i=0;i<a.length;i++){
			if(a[i]==fn)return;	//避免fn被重复保存到数组里
		}
		a.push(fn);//核心代码，把fn保存到自定义的事件池里
	}
	
}

function run(){
	
	var e=window.event;
	var type=e.type;
	var a=this["aEvent"+type]
	if(a)//确定数组存在
		for(var i=0;i<a.length;i++){
			a[i].call(this,e);	//核心代码，当事件触发的时候，由run方法遍历执行保存在自定义事件池里的那些方法
		}
}

function off(ele,type,fn){
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);
			
	}else{
		var a=ele["aEvent"+type];
		if(a)//确保这个数组存在
			for(var i=0;i<a.length;i++){
				if(a[i]==fn){
					a.splice(i,1);//核心代码：把要移除的方法fn在事件池数组里找到移除
					i--;//在这儿i--没有意义 ，这里的i减减了，影响不到run方法里的i，问题是出现在run方法里
					return;	
				}
			}
	}
	
}