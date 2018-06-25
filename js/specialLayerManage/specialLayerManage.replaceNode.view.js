define("specialLayerManage.replaceNode.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var ReplaceNodeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.replaceNode.html'])({}));
            this.$el.find("#dropdown-originNode").attr("disabled", true);
            this.$el.find("#dropdown-nowNode").attr("disabled", true);

            this.collection.off("set.dataItem");
            this.collection.on("set.dataItem", $.proxy(this.onSetDataItem, this));
            this.collection.off("get.strategyInfoByNode.success");
            this.collection.off("get.strategyInfoByNode.error");
            this.collection.on("get.strategyInfoByNode.success", $.proxy(this.onGetStrategySuccess, this));
            this.collection.on("get.strategyInfoByNode.error", $.proxy(this.onGetError, this));
            this.collection.off("get.node.success");
            this.collection.off("get.node.error");
            this.collection.on("get.node.success", $.proxy(this.onGetNodeSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            this.collection.getNodeList();

            this.collection.off("get.operator.success");
            this.collection.off("get.operator.error");
            this.collection.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));
            this.collection.getOperatorList();

            this.collection.off("get.ruleInfo.success");
            this.collection.off("get.ruleInfo.error");
            this.collection.on("get.ruleInfo.success", $.proxy(this.onGetRuleInfoSuccess, this));
            this.collection.on("get.ruleInfo.error", $.proxy(this.onGetError, this));

            this.collection.off("update.strategy.success");
            this.collection.off("update.strategy.error");
            this.collection.on("update.strategy.success", $.proxy(this.onUpdateStrategySuccess, this));
            this.collection.on("update.strategy.error", $.proxy(this.onUpdateStrategyError, this));
            
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
            this.defaultParam = [];
            this.checkedParam = [];
            this.defaultRuleParam = [];
            this.checkedRuleParam = [];
            this.distributeLowerLevelParam = []
            this.dataList = {};
            this.ruleDataList = {};
            this.initLayerStrategyTable();
            
            
        },

        onGetOperatorSuccess:function(res){
            var _data = res.rows;
            this.operateTypeList = [{
                name: "全部",
                value: ""
            }];
            this.operateType = ""
            _.each(_data, function(el, index) {
                this.operateTypeList.push({
                    name: el.name,
                    value: el.name
                })
            }.bind(this))
            Utility.initDropMenu(this.$el.find(".dropdown-ipCorporator"), this.operateTypeList, function(el) {
                if (value !== "")
                    this.operateType = el
            }.bind(this));
        },
         
        onSetDataItem:function(){
            this.distributeLowerLevelPopup.$el.find(".ok").removeAttr("disabled");
        },

        onGetNodeSuccess:function(res){
            this.$el.find("#dropdown-originNode").attr("disabled", false);
            this.$el.find("#dropdown-nowNode").attr("disabled", false);
            var originNameList = [];
            var nowNameList = [];
            var originIsMultiwireList = {};
            var nowIsMultiwireList = {};
            _.each(res.rows, function(el, index, list){
                originNameList.push({name: el.chName, value:el.id})
                originIsMultiwireList[el.id]= (el.operatorId == 9);
                nowNameList.push({name: el.chName, value:el.id})
                nowIsMultiwireList[el.id]= (el.operatorId == 9);
            });
            // this.isMultiwireList = originIsMultiwireList;
            var originSearchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-originNode').get(0),
                panelID: this.$el.find('#dropdown-originNode').get(0),
                isSingle: true,
                openSearch: true,
                onOk: function(){},
                data: originNameList,
                callback: function(data) {
                    this.oldNodeId = data.value;
                    this.$el.find('#dropdown-originNode .cur-value').html(data.name);
                    if(Object.getOwnPropertyNames(this.dataList).length > 0){
                        this.dataList = {}
                    }
                    this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                    this.collection.getStrategyInfoByNode(data.value);
                }.bind(this)
            });
            var nowSearchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-nowNode').get(0),
                panelID: this.$el.find('#dropdown-nowNode').get(0),
                isSingle: true,
                openSearch: true,
                onOk: function(){},
                data: nowNameList,
                callback: function(data) {
                    this.newNodeId = data.value;
                    this.$el.find('#dropdown-nowNode .cur-value').html(data.name);
                    if(nowIsMultiwireList[data.value] === true){
                        this.$el.find(".ipCorporator").show();
                    }else if(nowIsMultiwireList[data.value] === false){
                        this.$el.find(".ipCorporator").hide();
                    }
                }.bind(this)
            });
            
        },

        onGetStrategySuccess:function(res){
            var strategyParam = []
            if(res.length !== 0){
                _.each(res, function(el){
                    el.isChecked = true;
                    _.each(el.rule, function(item){
                        item.isChecked = true
                    }.bind(this))
                    strategyParam.push(el)
                    if(el.type === 202){
                        el.typeName = "cache"
                    }else if(el.type === 203){
                        el.typeName = "live"
                        }
                }.bind(this));
            }
            this.defaultParam = strategyParam;
            this.initLayerStrategyTable();
        },

        onUpdateStrategySuccess: function(res, id){
            if(!res) return;
            this.ruleDataList[id] = res;
            this.collection.trigger("get.layerInfo.success", res, id)
        },

        onUpdateStrategyError: function(res, id, name){
            this.ruleDataList[id] = res;
            this.collection.trigger("get.layerInfo.error", res, id, name)
        },

        onClickSaveButton: function(){
            if(!this.oldNodeId){
                Utility.warning("请设置原节点！");
                return false;
            }
            if(!this.newNodeId){
                Utility.warning("请设置现节点！");
                return false;
            }
            var tempList = []
            _.each(this.defaultParam, function(el){
                var idList = "input#"+el.id
                if(this.nodeTable.find(idList).is(":checked") === true){
                    tempList.push(el)
                }
            }.bind(this))
            this.checkedParam = tempList;
            if(this.checkedParam.length > 10){
                Utility.warning("分层策略选择一次不可超过10条！");
                return false;
            }
            if(this.checkedParam.length === 0){
                Utility.warning("分层策略不可为空！");
                return false;
            }
            console.log("点保存",this.checkedParam,this.defaultParam);
            _.each(this.checkedParam, function(el){
                if(el.isChecked === true){
                    var layerName = el.name
                    var localArgs = {
                        id: el.id,
                        type: "strategy",
                        rules: "",
                        oldNodeId: this.oldNodeId,
                        newNodeId: this.newNodeId,
                        operateType: "replace",
                    }
                    localArgs.ipCorporation = this.operateType || "";
                    var tempRule = []
                    _.each(this.dataList[el.id], function(item){
                        if(item.isChecked === true){
                            tempRule.push(item.id)
                        }
                    }.bind(this))
                    var ruleStr = tempRule.join(",");
                    localArgs.rules = ruleStr;
                    console.log("保存时ajax发送的数据：",localArgs)
                    this.collection.updateStrategy(localArgs, layerName);
                }
            }.bind(this))


            if (this.distributeLowerLevelPopup) $("#" + this.distributeLowerLevelPopup.modalId).remove();

            require(["specialLayerManage.lowerLevel.view"], function(DistributeLowerLevelView) {
                var myDistributeLowerLevelView = new DistributeLowerLevelView({
                    collection: this.collection,
                    dataParam: this.checkedParam,
                    type:1
                });
                var options = {
                    title:"配置下发",
                    body : myDistributeLowerLevelView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback:  function(){
                        var args = myDistributeLowerLevelView.getArgs();
                        console.log("待下发参数：",args)
                        this.ruleConfirmInfo = []
                        this.collection.off("send.success");
                        this.collection.off("send.error");
                        this.collection.on("send.success", $.proxy(this.onSendSuccess, this));
                        this.collection.on("send.error", $.proxy(this.onSendError, this));
                        if(args[0].length > 0){
                            _.each(args[0], function(el){
                                this.collection.strategyUpdate(el,args[1]);
                                this.options.onCancelCallback && this.options.onCancelCallback();
                            }.bind(this))
                        }else if(args[0].length === 0){
                            this.distributeLowerLevelPopup.$el.modal('hide');

                        }
                    }.bind(this),
                    onHiddenCallback: function(){
    
                        }.bind(this)
                    }
                this.distributeLowerLevelPopup = new Modal(options);
                this.distributeLowerLevelPopup.$el.find(".ok").attr("disabled","disabled");
                this.distributeLowerLevelPopup.$el.find(".cancel").html("取消");
                
            }.bind(this))
        },

        onSendSuccess:function(data, id, num){
            this.ruleConfirmInfo.push(data);
            this.collection.trigger("get.ruleConfirmInfo.success", data, id)
            if(this.ruleConfirmInfo.length === num){
                this.collection.trigger("get.unchecked");
                this.distributeLowerLevelPopup.$el.find(".ok").off("click");
                this.distributeLowerLevelPopup.$el.find(".ok").on("click" ,function(){
                    this.distributeLowerLevelPopup.$el.modal('hide');
                }.bind(this));
            }
        },

        onSendError: function(data, id, num){
            this.ruleConfirmInfo.push(data);
            this.collection.trigger("get.ruleConfirmInfo.error", data, id)
            if(this.ruleConfirmInfo.length === num){
                this.collection.trigger("get.unchecked");
                this.distributeLowerLevelPopup.$el.find(".ok").off("click");
                this.distributeLowerLevelPopup.$el.find(".ok").on("click" ,function(){
                    this.distributeLowerLevelPopup.$el.modal('hide');
                }.bind(this));
            }
        },

        onClickCancelButton: function() {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        initLayerStrategyTable: function() {
            this.nodeTable = $(_.template(template['tpl/specialLayerManage/specialLayerManage.editNode.table.html'])({
                data: this.defaultParam
            }));
            if (this.defaultParam.length !== 0){   
                this.$el.find(".table-ctn").html(this.nodeTable[0]);
                _.each(this.defaultParam, function(el){
                    var args = {
                        id: el.id,
                        nodeId: this.oldNodeId
                    }
                    this.collection.getRuleInfo(args)
                }.bind(this)) 
                this.nodeTable.find("tbody .view").on("click", $.proxy(this.onClickItemView, this));
                this.nodeTable.find("tbody tr[data-id]").on("click", $.proxy(this.onLayerItemCheckedUpdated, this));
                this.nodeTable.find("thead[data-parent] input").on("click", $.proxy(this.onLayerAllCheckedUpdated, this));
            }else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "暂无数据"
                    }
                }));
            
        },

        onLayerItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");
            var selectedObj = _.find(this.defaultParam, function(object){
                return object.id === parseInt(id)
            }.bind(this));
            selectedObj.isChecked = eventTarget.checked
            var checkedList = this.defaultParam.filter(function(object) {
                return object.isChecked === true;
            })
            if (checkedList.length === this.defaultParam.length)
                this.nodeTable.find("thead[data-parent] input").get(0).checked = true;
            if (checkedList.length !== this.defaultParam.length)
                this.nodeTable.find("thead[data-parent] input").get(0).checked = false;
        },

        onLayerAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            _.each(this.defaultParam, function(el, index, list){
                el.isChecked = eventTarget.checked
            }.bind(this))
            this.nodeTable.find("tbody tr[data-id]").find("input").prop("checked", eventTarget.checked);
        },

        onClickItemView:function(event){     
            var eventTarget = event.currentTarget || event.target, id;
            id = $(eventTarget).attr("id");
            this.ruleList = [];
            _.each(this.dataList[id], function(rule, index, ls) {
                var localLayerArray = [],
                    upperLayer = [],
                    primaryArray = [],
                    backupArray = [],
                    primaryNameArray = [],
                    backupNameArray = [];
                _.each(rule.local, function(local, inx, list) {
                    localLayerArray.push(local.name)
                }.bind(this));

                primaryArray = _.filter(rule.upper, function(obj) {
                    return obj.chiefType !== 0;
                }.bind(this))
                backupArray = _.filter(rule.upper, function(obj) {
                    return obj.chiefType === 0;
                }.bind(this))

                _.each(primaryArray, function(upper, inx, list) {
                    upper.ipCorporationName = "";
                    if (upper.rsNodeMsgVo && upper.rsNodeMsgVo.operatorId === 9) {
                        for (var i = 0; i < this.operatorList.length; i++) {
                            if (this.operatorList[i].id === upper.ipCorporation) {
                                upper.ipCorporationName = "-" + this.operatorList[i].name;
                                break;
                            }
                        }
                    }
                    if (upper.rsNodeMsgVo)
                        primaryNameArray.push(upper.rsNodeMsgVo.name + upper.ipCorporationName)
                    else
                        primaryNameArray.push("[后端没有返回名称]")
                }.bind(this));
                _.each(backupArray, function(upper, inx, list) {
                    upper.ipCorporationName = "";
                    if (upper.rsNodeMsgVo && upper.rsNodeMsgVo.operatorId === 9) {
                        for (var i = 0; i < this.operatorList.length; i++) {
                            if (this.operatorList[i].id === upper.ipCorporation) {
                                upper.ipCorporationName = "-" + this.operatorList[i].name;
                                break;
                            }
                        }
                    }
                    if (upper.rsNodeMsgVo)
                        backupNameArray.push(upper.rsNodeMsgVo.name + upper.ipCorporationName)
                    else
                        backupNameArray.push("[后端没有返回名称]")
                }.bind(this));

                var upperLayer = primaryNameArray.join('<br>');
                if (rule.upper.length > 1)
                    upperLayer = '<strong>主：</strong>' + primaryNameArray.join('<br>');
                if (backupArray.length > 0)
                    upperLayer += '<br><strong>备：</strong>' + backupNameArray.join('<br>');

                var ruleStrObj = {
                    id: rule.id,
                    localLayer: localLayerArray.join('<br>'),
                    upperLayer: upperLayer
                }
                this.ruleList.push(ruleStrObj)
            }.bind(this))

            this.ruleTable = $(_.template(template['tpl/specialLayerManage/specialLayerManage.viewRule.html'])({
                data: this.ruleList
            }));
            var idStrPar = "tr[data-nodeid=" + id + "]" + ".toggle-show";
            var idStrSon = "td[data-nodeid=" + id + "]" + ".tdTable";
            if (this.ruleList.length !== 0) {
                this.$el.find(idStrSon).html(this.ruleTable[0]);
                this.ruleTable.find("tbody[data-rule] tr").on("click", $.proxy(this.onRuleItemCheckedUpdated, this));
                this.ruleTable.find("thead[data-rule] input").on("click", $.proxy(this.onRuleAllCheckedUpdated, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "暂无数据"
                    }
                }));
            }
           
            if(this.$el.find(idStrPar).css("display") == "none"){
                this.$el.find(idStrPar).show()
            }else{
                this.$el.find(idStrPar).hide()
            }
        },

        onGetRuleInfoSuccess:function(res,id){
            var _data = res || []
            _.each(_data, function(el){
                el.isChecked = true
            }.bind(this))
            this.dataList[id] = _data;
        },

        onRuleItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");
            var selectedObj = _.find(this.defaultRuleParam, function(object){
                return object.id === parseInt(id)
            }.bind(this));
            selectedObj.isChecked = eventTarget.checked
            var checkedList = this.defaultRuleParam.filter(function(object) {
                return object.isChecked === true;
            })
            this.checkedRuleParam = checkedList
            if (checkedList.length === this.defaultRuleParam.length)
                this.ruleTable.find("thead[data-rule] input").get(0).checked = true;
            if (checkedList.length !== this.defaultRuleParam.length)
                this.ruleTable.find("thead[data-rule] input").get(0).checked = false;
        },

        onRuleAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            _.each(this.defaultRuleParam, function(el, index, list){
                el.isChecked = eventTarget.checked
            }.bind(this))
            this.ruleTable.find("tbody[data-rule] tr").find("input").prop("checked", eventTarget.checked);
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        render: function(target) {
            this.$el.appendTo(target);

        }
    });

    return ReplaceNodeView;
});