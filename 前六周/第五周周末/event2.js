
function on(ele,type,fn){
	if(ele.addEventListener){
		ele.addEventListener(type,fn,false);
		return;	
	}
	
	if(!ele["aEvent"+type]){
		ele["aEvent"+type]=[];
		ele.attachEvent("on"+type,function(){run.call(ele)});//避免run方法被重复绑定到系统的事件上
	}
	var a=ele["aEvent"+type];
	
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return;	//避免fn方法被重复保存到自己定义的事件池中
	}
	
	a.push(fn);
	
}

function run(){
	var e=window.event;	
	var a=this["aEvent"+e.type];
	if(a){
		e.target=e.srcElement;
		e.pageX=e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft);
		e.pageY=e.clientY+(document.documentElement.scrollTop||document.body.scrollTop);
		e.preventDefault=function(){e.returnValue=false;}
		e.stopPropagation=function(){e.cancelBubble=true;}
		for(var i=0;i<a.length;i++){
			if(typeof a[i]=="function"){
				a[i].call(this,e);//为了让使用自定义事件模式的那些方法也能够使用 参数e
			}else{
				//如果数组中此项为null，则在这里删除，相当于整理数组的长度，把无效的项目清掉
				a.splice(i,1);
				i--;
			}
			
		}
	}
}
function off(ele,type,fn){
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);
		return;	
	}
	var a=ele["aEvent"+type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				//a.splice(i,1);
				a[i]=null;
				return;					
			}
		}
		
	}
	
		
}


function processThis(fn,obj){//这个方法会返回一个新的方法，这个新方法的功能和fn一样，但fn里的this关键字会强制指向obj
			return function(e){fn.call(obj,e)}
			
			}
