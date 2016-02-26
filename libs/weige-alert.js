if(!window.kingSoft){
	window.kingSoft={};
}
if(!kingSoft.tool){
	kingSoft.tool={};
}
(function(self){


	var ksLib={
		getID:function(id){
			return typeof id == "string" ? document.getElementById(id) : id;
		},
		getClass:function(obj,cla,tag){
			var _tag=tag || "*";
			var reg=new RegExp("\\b"+cla+"","");
			var oList=obj.getElementsByTagName(_tag);
			var arr=[];
			for(var i=0,_len=oList.length;i<_len;i++){
				var _cla=oList[i].className;
				if(reg.test(_cla)){
					arr.push(oList[i]);
				}
			}
			return arr;
		},
		addEvent:function(obj,handle,fn){
			if(obj.addEventListener){
				obj.addEventListener(handle,fn,false);
			}
			else if(obj.attachEvent) {
				obj.attachEvent('on'+handle,function(){
					fn.call(obj);
				});
			}
			else{
				obj["on"+handle]=fn;
			}
		},

		bindConfirmEvent:function(obj,dialog){
			var btnOk=ksLib.getClass(obj,"btn-primary","button")[0];
			btnOk.onclick=function(){
				dialog.close();
			}
		}
	}

	var alert=function(message,callback,w,h,closeCallback,zindex){
		var _callback=ksLib.bindConfirmEvent;
		var _closeCallback=closeCallback || function(){};
		var arr=[];
		arr.push('<div class="manage-dialog-baseMessage">');
		arr.push('<div style="height:auto;margin-bottom:10px;">'+message+'</div>');
		arr.push('<hr style="margin-bottom: 10px">');
		arr.push('<div class="manage-dialog-change-btnContainer text-right"><button class="btn btn-primary">确定</button></div>');
		arr.push('</div>');
		var _html=arr.join('');
		var _w=w || 300;
		var _h=h || 180;
		var _zIndex=zindex || 9999;
		var titleArr=[];
		titleArr.push('<div class="common-dialog-title">提示</div>');
		var _titleHtml=titleArr.join('');
		window.d1g = new kingSoft.tool.dialog();
		d1g.init({ //配置参数
			w :_w,
			h :_h,
			title :_titleHtml,
			content : _html,
			callback:_callback,
			zIndex:_zIndex,
			closeCallback:_closeCallback
		});		
	};
	window.alert=alert;


function Dialog(){
	this.oDialog = null;
	this.settings = { //默认参数
		w : 300,
		h : 250,
		align : 'center',
		valign : 'center',
		title : '弹窗标题',
		fixedNumber:0,
		content : '',
		bMask : true,
		callback:null,//加载完后执行
		zIndex:null,
		loaded:null
	}
}
Dialog.prototype.init = function(opt){
	extend(this.settings, opt);
	this.createDialog();	
	this.createCloseBtn();
	if(this.settings.bMask){
		this.createMask();
	}
	if (this.settings.h > viewHeight())
	{
		this.oDialog.style.position = 'absolute';
		this.oDialog.style.left = (viewWidth()-this.settings.w)/2 + 'px';
		this.oDialog.style.top = ( document.documentElement.scrollTop || document.body.scrollTop ) + 'px';
		return;
	}
	this.setDialogPos();
	new Drag(this.oDialogHead).init();
}
Dialog.prototype.createDialog = function(){
	this.weige = document.createElement('div');
	this.weige.className = 'weige';
	this.oDialog = document.createElement('div');
	this.oDialog.className = 'dialog fadeInDown animated';
	this.oDialog.style.width = this.settings.w + 'px';
	if(this.settings.h=="auto"){
		this.oDialog.style.height = "auto";
	}
	else{
		this.oDialog.style.height = this.settings.h + 'px';
	}
	if(this.settings.zIndex){
		this.oDialog.style.zIndex = this.settings.zIndex;
	}
	this.oDialogHead = document.createElement('div');
	this.oDialogHead.className = 'head';
	this.oDialogHead.innerHTML = '<div class="dialog-title">'+ this.settings.title +'</div><span class="dialog-close" title="关闭"></span>';
	this.oDialog.appendChild(this.oDialogHead);
	this.oDialogContent = document.createElement('div');
	this.oDialogContent.className = 'content';
	this.oDialogContent.innerHTML = this.settings.content;
	this.oDialog.appendChild(this.oDialogContent);
	this.weige.appendChild(this.oDialog);
	document.body.appendChild(this.weige);
	this.settings.callback && this.settings.callback(this.oDialog,this);
	this.settings.loaded && this.settings.loaded(this.oDialog,this);
	var _this=this;
	ksLib.addEvent(window,"resize",function(){
		if(_this.oDialog){
			_this.setDialogPos();
		}
		_this.setMaskPos();
	});
}


Dialog.prototype.setContent=function(str){
	this.oDialogContent.innerHTML=str;
}


Dialog.prototype.onOk=function(){
	this.settings.onOk && this.settings.onOk(this.oDialog,this);
}

Dialog.prototype.onCancel=function(){
	this.settings.onCancel && this.settings.onCancel();
}

Dialog.prototype.setDialogPos = function(){
	if(this.settings.align == 'center'){
		this.oDialog.style.left = (viewWidth() - this.oDialog.offsetWidth)/2 + 'px';
	}else if(this.settings.align == 'left'){
		this.oDialog.style.left = '0px';
	}else if(this.settings.align == 'right'){
		this.oDialog.style.left = viewWidth() - this.oDialog.offsetWidth + 'px';
	}
	var scrollTop =0;
	if ( navigator.userAgent.indexOf("MSIE 6.0")>0 )
	{
		scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	}
	if(this.settings.valign == 'center'){
		this.oDialog.style.top = scrollTop + (viewHeight() - this.oDialog.offsetHeight)/2 + 'px';
	}else if(this.settings.valign == 'top'){
		this.oDialog.style.top = scrollTop +this.settings.fixedNumber+ 'px';
	}else if(this.settings.valign == 'bottom'){
		this.oDialog.style.top = scrollTop + viewHeight() - this.oDialog.offsetHeight + 'px';
	}
}
Dialog.prototype.createCloseBtn = function(){
	var This = this;
	var closeCallback=this.settings.closeCallback;
//	this.oCloseBtn = this.oDialogHead.getElementsByTagName('span')[1];
	this.oCloseBtn = ksLib.getClass(this.oDialogHead,"dialog-close","span")[0];
	this.oCloseBtn.onclick = function(){
		closeCallback && closeCallback();
		document.body.removeChild(This.weige);
		if(This.settings.bMask){
			document.body.removeChild(This.oMask);
		}
	}
}
Dialog.prototype.createMask = function(){
	this.oMask = document.createElement('div');
	this.oMask.className = 'weige-mask';
	this.setMaskPos();
	if(this.settings.zIndex){
		this.oMask.style.zIndex = this.settings.zIndex-1;
	}
	document.body.appendChild(this.oMask);

	var me=this;
	ksLib.addEvent(this.oMask,"click",function(){
		me.close();
	});
}
Dialog.prototype.setMaskPos=function(){
	if(this.oMask){
		this.oMask.style.width = viewWidth() + 'px';
		this.oMask.style.height = viewHeight() + 'px';		
	}
}
Dialog.prototype.close = function(){
	document.body.removeChild(this.weige);
	if (this.settings.bMask)
	{
		document.body.removeChild(this.oMask);
	}
}
Dialog.prototype.alert = function(){
	var str = '默认参数如下：\n';
	for (var attr in this.settings)
	{
		str += attr + ' ： ' + this.settings[attr] + '\n';
	}
	str += "（参数值注意加引号。如 aaa:'xxx'）";
	alert(str);
}
function viewWidth(){
	return document.documentElement.clientWidth;
}
function viewHeight(){
	return document.documentElement.clientHeight;
}
function extend(obj1, obj2){
	for(var attr in obj2){
		obj1[attr] = obj2[attr];
	}
}
function Drag(obj){
	this.oDragDiv = this.oOuterDiv = obj;
	this.disX = 0;
	this.disY = 0;
}
Drag.prototype.init = function(){
	var This = this;
	if (this.oDragDiv.className == 'head'){
		this.oOuterDiv = this.oDragDiv.parentNode;
		this.oDragDiv.style.cursor = 'move' ;
	} else {
		this.oDragDiv.style.cursor = 'move' ;
	}
	this.oDragDiv.onmousedown = function(ev){
		var ev = ev || window.event;
		This.fnDown(ev);
		document.onmousemove = function(ev){
			var ev = ev || window.event;
			This.fnMove(ev);
		}
		document.onmouseup = function(){
			This.fnUp();
		}
		return false;
	}
}
Drag.prototype.fnDown = function(ev){
	var ev = ev || window.event;
	this.disX = ev.clientX - this.oOuterDiv.offsetLeft;
	this.disY = ev.clientY - this.oOuterDiv.offsetTop;
}
Drag.prototype.fnMove = function(ev){
	var ev = ev || window.event;
	var L = ev.clientX - this.disX;
	var T = ev.clientY - this.disY;
	if(L < 0){
		L = 0;
	}else if(L > viewWidth() - this.oOuterDiv.offsetWidth){
		L = viewWidth() - this.oOuterDiv.offsetWidth;
	}
	if(T < 0){
		T = 0;
	}else if(T > document.documentElement.scrollTop + viewHeight() - this.oOuterDiv.offsetHeight){
		//T = viewHeight() - this.oDragDiv.offsetHeight;
		T = document.documentElement.scrollTop + viewHeight() - this.oOuterDiv.offsetHeight;
	}
	this.oOuterDiv.style.left = L + 'px';
	this.oOuterDiv.style.top = T + 'px';
}
Drag.prototype.fnUp = function(){
	document.onmousemove = null;
	document.onmouseup = null;
}



kingSoft.tool.dialog = Dialog;
})(kingSoft.tool);