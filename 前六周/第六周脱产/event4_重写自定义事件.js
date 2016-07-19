function on(ele,type,fn){
	if(/^self/.test(type)){
		if(!ele["aSelf"+type]){
			ele["aSelf"+type]=[];	
		}
		var a=ele["aSelf"+type];
		for(var i=0;i<a.length;i++){
			if(a[i]==fn)return;
		}
		a.push(fn);
	}else if(ele.addEventListener){
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
	
	if(!e.target){
		e.target=e.srcElement;
		e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
		e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
		e.preventDefault=function(){e.returnValue=false;}
		e.stopPropagation=function(){e.cancelBubble=true;}
				
	}
	
	var a=this["aEvent"+type]
	if(a)//确定数组存在
	
		for(var i=0;i<a.length;i++){
			if(typeof a[i] =="function"){
				a[i].call(this,e);	
			}else{
				//[null,null,null,fn4,fn5,fn6,fn7];
				a.splice(i,1);
				i--;
			}
		}
}

function selfRun(selfType,e){
	var a=this["aSelf"+selfType];
	if(a){
		for(var i=0;i<a.length;i++){
			a[i].call(this,e);
			//a[i]();	
		}
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
					a[i]=null;//用null值代替原来fn的位置
					return;	
				}
			}
	}
	
}
function processThis(fn,obj){
	return function(e){fn.call(obj,e)}	
}


//确定事件类型，完成绑定事件的方法，完成通知的方法，在什么时候通知，完成解除绑定的方法

//1、给每个拖拽的阶段规定一个标识符---确定事件类型
	//在拖拽开始的阶段---selfdragstart---down
	//在拖拽进行的阶段---selfdragging---move
	//在拖拽结束的阶段---selfdragend-----up
	
//2、on方法--让on方法支持自定义事件

//3、完成selfRun方法，用来通知

//4、什么叫通知（通知的原理是什么），什么时候通知
