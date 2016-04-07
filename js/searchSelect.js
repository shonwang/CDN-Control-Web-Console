(function() {
	var root = this;
	var SearchSelect = function(options) {
		this.openSearch = options.openSearch || false;
		this.selectData = options.data || null;
		var containerID = options.containerID;
		var panelID = options.panelID;
		this.container = this.getID(containerID);
		this.panel = this.getID(panelID);
		this.callback = options.callback || null;
		this.selectWidth = options.selectWidth || null;
		this.onOk = options.onOk || null;
		this.hasOkBtn = options.onOk || false;
		this.checkList = {};
		this.init();

	};
	SearchSelect.prototype = {
		init: function() {
			this.draw();
		},
		draw: function() {
			this.selectContainer = document.createElement("div");
			this.selectContainer.className = "select-container";

			//title
			var oTitleContainer = document.createElement("div");
			oTitleContainer.className = "select-title-container";
			this.oTitleContainer = oTitleContainer;
			this.createTitle();
			//var oSelectInput=document.createElement("input");
			//oSelectInput.type="search";
			//oTitleContainer.appendChild(oSelectInput);

			//var oCheckBoxContainer=this.createElement("div");
			//oCheckBoxContainer.className="checkbox-container";
			//oCheckBoxContainer.appendChild(this.createCheckBtn());

			//oTitleContainer.appendChild(oCheckBoxContainer);

			this.selectContainer.appendChild(oTitleContainer);

			var oUl = document.createElement("ul");
			oUl.className = "select-value-layer";

			this.selectValueLayer = oUl;


			this.selectContainer.appendChild(oUl);

			this.selectObject.unshift({
				title: this.panel,
				container: this.selectContainer
			});

			this.container.appendChild(this.selectContainer);
			if (this.panel.tagName.toLowerCase() == "input") {
				this.bindInputPanel();
			} else if (this.panel) {
				this.bindPanelEvent();
			}
			this.setProperty();
			this.bindEvent();
		},

		createTitle: function() {
			if (this.openSearch) {
				var oTips = document.createElement("span");
				oTips.className = "select-search-tips";
				oTips.innerHTML = "过滤";
				var oSelectInput = document.createElement("input");
				oSelectInput.type = "search";
				this.oTitleContainer.appendChild(oTips);
				this.oTitleContainer.appendChild(oSelectInput);
				this.oSelectInput = oSelectInput;
			}
			var oCheckBoxContainer = this.createElement("div");
			oCheckBoxContainer.className = "select-checkbox-container";
			oCheckBoxContainer.appendChild(this.createCheckBtn());
			this.oTitleContainer.appendChild(oCheckBoxContainer);
			//关闭按钮
			var oClose = this.createElement("div");
			oClose.className = "select-select-close";
			this.oTitleContainer.appendChild(oClose);
			this.btnClose = oClose;


		},

		bindInputPanel: function() {
			var selectObject = this.selectObject;
			var inputPanel = this.panel;
			var selectContainer = this.selectContainer;
			inputPanel.onfocus = function() {

				selectContainer.style.display = "block";
				for (var i = 0; i < selectObject.length; i++) {
					var title = selectObject[i].title;
					var obj = selectObject[i].container;
					if (this == title) {
						continue;
					}
					obj.style.display = "none";
				}
			}
			inputPanel.onclick = function(ev) {
				var oEvent = window.event || ev;
				oEvent.cancelBubble = true;

			}
		},

		bindPanelEvent: function() {
			var selectObject = this.selectObject;
			var inputPanel = this.panel;
			var selectContainer = this.selectContainer;
			inputPanel.onclick = function() {
				var oEvent = window.event || ev;
				oEvent.cancelBubble = true;
				selectContainer.style.display = "block";
				for (var i = 0; i < selectObject.length; i++) {
					var title = selectObject[i].title;
					var obj = selectObject[i].container;
					if (this == title) {
						continue;
					}
					obj.style.display = "none";
				}
			}

		},

		createCheckBtn: function() {
			var html = [];
			var oCheckAll = this.createElement("span");
			oCheckAll.className = "select-check-all";
			oCheckAll.innerHTML = "全选";
			var oCancelAll = this.createElement("span");
			oCancelAll.className = "select-cancel-all";
			oCancelAll.innerHTML = "全不选";

			var oSelectBack = this.createElement("span");
			oSelectBack.className = "select-select-back";
			oSelectBack.innerHTML = "反选";
			var oSelectBtnOK = this.createElement("span");
			if (this.hasOkBtn) {
				oSelectBtnOK.className = "select-btn-ok";
				oSelectBtnOK.innerHTML = "确定";
			}

			this.btnCheckAll = oCheckAll;
			this.btnCancelAll = oCancelAll;
			this.btnSelectBack = oSelectBack;
			this.btnSearchOK = oSelectBtnOK;
			var oFragMent = document.createDocumentFragment("");
			oFragMent.appendChild(oCheckAll);
			oFragMent.appendChild(oCancelAll);
			oFragMent.appendChild(oSelectBack);
			oFragMent.appendChild(oSelectBtnOK);
			return oFragMent;

		},
		selectObject: [],
		setProperty: function() {
			var selectContainer = this.selectContainer;
			var selectWidth = this.selectWidth;
			//设置select的宽
			if (selectWidth) {
				selectContainer.style.width = selectWidth + "px";
			}

			var selectObject = this.selectObject;

			//设置zIndex
			for (var i = 0; i < selectObject.length; i++) {
				selectObject[i]["container"].style.zIndex = i;
			}


			this.setData();
		},

		setData: function() {
			var oUl = this.selectValueLayer;
			var _data = this.selectData;
			var arr = [];
			if (_data && _data.length > 0) {
				for (var i = 0, _len = _data.length; i < _len; i++) {
					var _html = this.createCheckBox(_data[i]["name"]);
					arr.push('<li data-name=' + _data[i]["name"] + ' value=' + _data[i]["value"] + '>' + _html + '</li>');
				}
				oUl.innerHTML = arr.join('');
				this.bindClick();
			}
		},
		checkList: {

		},

		close: function() {
			var selectContainer = this.selectContainer;
			selectContainer.style.display = "none";
		},

		bindEvent: function() {
			var me = this;
			var selectContainer = this.selectContainer;
			this.addEvent(document, "click", function(ev) {
				var oEvent = window.event || ev;
				oEvent.cancelBubble = true;
				selectContainer.style.display = "none";
			});
			selectContainer.onclick = function(ev) {
				var oEvent = window.event || ev;
				oEvent.cancelBubble = true;
			}



			var btnCheckAll = this.btnCheckAll;
			var btnCancelAll = this.btnCancelAll;
			var btnSelectBack = this.btnSelectBack;
			var btnSearchOK = this.btnSearchOK;
			var btnClose = this.btnClose;
			btnCheckAll.onclick = function() {
				me.checkAll(true);
			}
			btnCancelAll.onclick = function() {
				me.checkAll(false);
			}
			btnSelectBack.onclick = function() {
				me.selectInvert();
			}
			if (btnSearchOK) {
				//定制ok按钮
				btnSearchOK.onclick = function() {
					var list = me.getCheckedObj();
					me.onOk && me.onOk(list);
					me.close();
				}
			}
			btnClose.onclick = function() {
				selectContainer.style.display = "none";
			}

			if (this.openSearch) {
				this.bindSearchInputEvent();
			}

		},

		bindSearchInputEvent: function() {
			var me = this;
			var oSelectInput = this.oSelectInput;
			this.pTimer = null;
			oSelectInput.onfocus = oSelectInput.onclick = oSelectInput.onkeyup = oSelectInput.onkeydown = function() {
				me.search(this);
			}
			oSelectInput.onpaste = function() {
				var that = this;
				me.pTimer && clearTimeout(me.pTimer);
				me.pTimer = setTimeout(function() {
					me.search(that);
				}, 0);
			}
		},

		search: function(obj) {
			var value = obj.value;
			var oUl = this.selectValueLayer;
			var aLi = oUl.getElementsByTagName("li");
			for (var i = 0; i < aLi.length; i++) {
				var _value = aLi[i].getAttribute("data-name");
				if (_value.indexOf(value) > -1) {
					aLi[i].className = "";
				} else {
					aLi[i].className = "hide";
				}
			}
		},

		bindClick: function() {
			var oUl = this.selectValueLayer;
			var me = this;
			var aLi = oUl.getElementsByTagName("li");
			var selectList = oUl.getElementsByTagName("input");
			for (var i = 0; i < selectList.length; i++) {
				selectList[i].onchange = function(ev) {

						var _parent = this.parentNode.parentNode;
						var value = _parent.getAttribute("value");
						var name = _parent.getAttribute("data-name");
						if (this.checked) {
							me.checkList[value] = {
								name: name,
								value: value
							};
						} else {
							delete me.checkList[value];
						}
						//console.log(JSON.stringify(me.checkList));
						var checkedList = me.getCheckedValue();
						me.callback && me.callback(checkedList);
					}
					/*
					aLi[i].onclick=selectList[i].onclick=function(ev){
						var oEvent=window.event || ev;
						oEvent.cancelBubble=true;
					}*/

			}
		},

		getID: function(id) {
			return typeof id == "string" ? document.getElementById(id) : id;
		},

		addEvent: function(obj, handle, fn) {
			if (obj.addEventListener) {
				obj.addEventListener(handle, fn, false);
			} else if (obj.attachEvent) {
				obj.attachEvent('on' + handle, function() {
					fn.call(obj);
				});
			} else {
				obj["on" + handle] = fn;
			}
		},

		createCheckBox: function(tit) {
			var html = [];
			html.push('<label class="select-checkboxcon">');
			html.push('<input class="select-checkbox" type="checkbox" />');
			html.push('<div class="select-checkbox-value">' + tit + '</div>');
			html.push('</label>');
			return html.join('');
		},

		checkAll: function(bool) {
			var oUl = this.selectValueLayer;
			var liList = oUl.getElementsByTagName("li");
			var selectList = oUl.getElementsByTagName("input");
			for (var i = 0, _len = liList.length; i < _len; i++) {
				var _className = liList[i].className;
				if (_className == "hide") {
					continue;
				}
				var _val = liList[i].getAttribute("value");
				var _name = liList[i].getAttribute('data-name');
				selectList[i].checked = bool || false;
				if (bool) {
					this.checkList[_val] = {
						value: _val,
						name: _name
					};
					//selectList[i].checked=true;
				} else {
					//selectList[i].checked=false;
					delete this.checkList[_val];
				}
			}
			var checkedList = this.getCheckedValue();
			this.callback && this.callback(checkedList);
		},

		selectInvert: function() {
			var oUl = this.selectValueLayer;
			var liList = oUl.getElementsByTagName("li");
			var selectList = oUl.getElementsByTagName("input");
			for (var i = 0, _len = liList.length; i < _len; i++) {
				var _className = liList[i].className;
				if (_className == "hide") {
					continue;
				}
				var _val = liList[i].getAttribute("value");
				var _name = liList[i].getAttribute("data-name");
				if (selectList[i].checked) {
					selectList[i].checked = false;
					delete this.checkList[_val];
				} else {
					selectList[i].checked = true;
					this.checkList[_val] = {
						value: _val,
						name: _name
					};
				}

			}
			var checkedList = this.getCheckedValue();
			this.callback && this.callback(checkedList);
		},

		getCheckedValue: function() {
			var checkList = this.checkList;
			var arr = [];
			for (var item in checkList) {
				arr.push(checkList[item].value);
			}
			return arr;
		},

		getCheckedObj: function() {
			var checkList = this.checkList;
			var arr = [];
			for (var item in checkList) {
				arr.push({
					name: checkList[item].name,
					value: checkList[item].value
				});
			}
			return arr;
		},

		createElement: function(tag) {
			return document.createElement(tag);
		}


	};

	// AMD / RequireJS
	if (typeof define !== 'undefined' && define.amd) {
		define([], function() {
			return SearchSelect;
		});
	}
	// CMD
	else if (typeof module !== 'undefined' && module.exports) {
		module.exports = SearchSelect;
	}
	// included directly via <script> tag
	else {
		root.SearchSelect = SearchSelect;
	}


}());