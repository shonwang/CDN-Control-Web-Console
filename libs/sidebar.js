var _ks_unit = {
	/*左边收起开关*/
	sideLeftToggle : function () {
		var siderbarBtn = document.querySelector('.sidebar-btn')
		var sideLeft = document.querySelectorAll('.ksyun-logo, .ctrl-sidebar-container');
		var mainContainer = document.querySelector('.ctrl-main-container');

		for (var i = 0, len = sideLeft.length; i < len; i++) {
			sideLeft[i].classList.toggle('shrink');
		}
		mainContainer.classList.toggle('large');
	},
	/*事件兼容封装*/
	ksEventUtil : {
		addHandler: function(element, type, handler){
			if (element.addEventListener){
				element.addEventListener(type, handler, false);
			} else if (element.attachEvent){
				element.attachEvent("on" + type, handler);
			} else {
				element["on" + type] = handler;
			}
		},

		getEvent: function(event){
			return event ? event : window.event;
		},

		getTarget: function(event){
			return event.target || event.srcElement;
		},

		removeHandler: function(element, type, handler){
			if (element.removeEventListener){
				element.removeEventListener(type, handler, false);
			} else if (element.detachEvent){
				element.detachEvent("on" + type, handler);
			} else {
				element["on" + type] = null;
			}
		},

	}

};

function __ks_sidebar_event_init(){
	_ks_unit.ksEventUtil.addHandler(document.querySelector('.sidebar-btn'),"click",function(e){
		_ks_unit.sideLeftToggle();
	});

	_ks_unit.ksEventUtil.addHandler(document.querySelector('.ctrl-sidebar-container'),"click",function(e){
		e = _ks_unit.ksEventUtil.getEvent(e);
		var target = _ks_unit.ksEventUtil.getTarget(e);

		//二级菜单收放事件绑定
		if (target.matches('.ctrl-sidebar-container .two-level > a, .ctrl-sidebar-container .two-level > a *')){
			target = findParent(target,'li'); //查找一级菜单的li标签
			level2Toggle (target);
		}

		//选项的选中事件
		if(target.matches('.ctrl-sidebar-container .dashboard *, .ctrl-sidebar-container .two-level li *, .ctrl-sidebar-container .one-level *')){
			target = findParent(target,'li');
			target.classList.toggle("active-select");
		}

		//二级菜单收放操作函数
		function level2Toggle (target){
			if(!findParent(target,'.ctrl-sidebar-container').classList.contains('shrink')){//菜单没有收起时可下拉
				target.querySelector('.level').classList.toggle('rotate');
				target.querySelector('ul').classList.toggle('level-one-shrink');
				if(target.querySelector('.level-one-shrink .active-select')){//二级有选中且收起时操作
					target.classList.add("active-level");
				}else{
					target.classList.remove("active-level");
				}
			}
		}

		//查找当前node的父node,用于代理事件的定位.
		function findParent(target,selector){
			for(var i = 0 ;i < 10; i ++){
				if(target.matches(selector)){
					i = 10;
				}else{
					target = target.parentNode;
				}
			}
			return target;
		}
	});

}

function __ks_sidebar_dom_init(sidebarData){
	var container = document.querySelector(".ctrl-sidebar-container nav ul")

	for(var i = 0, len = sidebarData.length; i < len ; i ++){
		var levelOneDom = document.createElement('li');

		if(sidebarData[i].levelTwo){
			levelOneDom.innerHTML = createOptionHtml(sidebarData[i],'one');
			levelOneDom.classList.add('two-level');

			(function(levelOneData){
				var levelTwoDom = document.createElement('ul');
				levelTwoDom.className = "list-unstyled level-one-shrink";
				var levelTwoData = levelOneData.levelTwo;

				for(var i = 0,len = levelTwoData.length; i < len; i++){
					var levelTwoOptionDom = document.createElement('li');
					levelTwoOptionDom.innerHTML = createOptionHtml(levelTwoData[i],'two');
					levelTwoDom.appendChild(levelTwoOptionDom);
				}
				levelOneDom.appendChild(levelTwoDom);
			})(sidebarData[i])
		}else{
			levelOneDom.innerHTML = createOptionHtml(sidebarData[i],'two');

			if(sidebarData[i].active == true){
				levelOneDom.classList.add('active-select');
			}
			levelOneDom.classList.add('one-level');
		}

		container.appendChild(levelOneDom);
	}

	function createOptionHtml(optionData,type){
		var html = '';
		if(!optionData.url){
			optionData.url = "javascript:void(0)"
		}

		if(type === 'one'){
			html = '<a href="'
					+optionData.url
					+'"><i class="icon '
					+optionData.iconClass
					+'"></i><span>'
					+optionData.name
					+'</span><i class="level icon icon-expand-10"></i></a>';
		}else {
			html =  '<a href="'
					+optionData.url
					+'"><i class="icon '
					+optionData.iconClass
					+'"></i><span>'
					+optionData.name
					+'</span></a>';
		}
		return html;
	}
}

var sidebarData = [
	{
		name:'客户资源',
		iconClass:'icon-rds-16"',
		url:"",
		levelTwo:[
			{
				name:'频道管理',
				iconClass:'icon-monit-20',
				url:"#"
			}
		]
	},
	{
		name:'资源管理',
		iconClass:'icon-vm-16',
		url:"",
		levelTwo:[
			{
				name:'节点管理',
				iconClass:'icon-loadblance-16',
				url:"#/nodeManage"
			},
			{
				name:'设备管理',
				iconClass:'icon-physical-16',
				url:"#/deviceManage/none"
			},
			// {
			// 	name:'IP管理',
			// 	iconClass:'icon-ip-16',
			// 	url:"#/ipManage"
			// }
		]
	},
	{
		name:'服务管理',
		iconClass:'icon-content-16',
		url:"",
		levelTwo:[
			{
				name:'调度组管理',
				iconClass:'icon-cache-16',
				url:"#/dispGroup"
			},
			{
				name:'调度配置',
				iconClass:'icon-set-20',
				url:"#/dispConfig"
			}
		]

	},
	{
		name:'区域管理',
		iconClass:'icon-home-16',
		url:"",
		levelTwo:[
			{
				name:'覆盖管理',
				iconClass:'icon-home-16',
				url:"#/coverManage"
			},
			{
				name:'节点区域关联',
				iconClass:'icon-loadblance-16',
				url:"#/coverRegion"
			}
		]
	},
	{
		name:'直播配置',
		iconClass:'icon-webcast-16',
		url:"",
		levelTwo:[
			{
				name:'所有配置',
				iconClass:'icon-set-20',
				url:"#/liveAllSetup"
			},
			{
				name:'当前配置',
				iconClass:'icon-set-20',
				url:"#/liveCurentSetup"
			}
		]

	}
];


__ks_sidebar_dom_init(sidebarData);
__ks_sidebar_event_init();
