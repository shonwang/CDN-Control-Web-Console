define("specialLayerManage.deleteNode.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var DeleteNodeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.deleteNode.html'])({}));
            this.$el.find("#dropdown-node").attr("disabled", true);
            this.$el.find(".opt-ctn .save").html("删除")

            this.collection.off("set.dataItem.success");
            this.collection.on("set.dataItem.success", $.proxy(this.onSetDataItemSuccess, this));
            this.collection.off("get.strategyInfoByNode.success");
            this.collection.off("get.strategyInfoByNode.error");
            this.collection.on("get.strategyInfoByNode.success", $.proxy(this.onGetStrategySuccess, this));
            this.collection.on("get.strategyInfoByNode.error", $.proxy(this.onGetError, this));
            this.collection.off("get.node.success");
            this.collection.off("get.node.error");
            this.collection.on("get.node.success", $.proxy(this.onGetNodeSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            this.collection.getNodeList();

            this.collection.off("get.ruleInfo.success");
            this.collection.off("get.ruleInfo.error");
            this.collection.on("get.ruleInfo.success", $.proxy(this.onGetRuleInfoSuccess, this));
            this.collection.on("get.ruleInfo.error", $.proxy(this.onGetError, this));

            this.collection.off("update.strategy.success");
            this.collection.off("update.strategy.error");
            this.collection.on("update.strategy.success", $.proxy(this.onUpdateStrategySuccess, this));
            this.collection.on("update.strategy.error", $.proxy(this.onGetError, this));
            
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickDeleteButton, this));
            this.defaultParam = [];
            this.defaultRuleParam = [];
            this.distributeLowerLevelParam = []
            this.dataList = {};
            this.ruleDataList = {};
            this.initLayerStrategyTable();
            
            
        },

         
        onSetDataItemSuccess:function(){
            this.distributeLowerLevelPopup.$el.find(".ok").removeAttr("disabled");
        },

        onGetNodeSuccess:function(res){
            this.$el.find("#dropdown-node").attr("disabled", false);
            var nameList = [];
            var isMultiwireList = {};
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.chName, value:el.id})
                isMultiwireList[el.id]= (el.operatorId == 9);
            });
            // this.isMultiwireList = originIsMultiwireList;
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-node').get(0),
                panelID: this.$el.find('#dropdown-node').get(0),
                isSingle: true,
                openSearch: true,
                onOk: function(){},
                data: nameList,
                callback: function(data) {
                    this.nodeId = data.value;
                    this.$el.find('#dropdown-node .cur-value').html(data.name);
                    if(Object.getOwnPropertyNames(this.dataList).length > 0){
                        this.dataList = {}
                    }
                    this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                    this.collection.getStrategyInfoByNode(data)
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
            this.defaultParam = strategyParam
            this.initLayerStrategyTable();
        },

        onUpdateStrategySuccess: function(res, id){
            if(!res) return;
            this.ruleDataList[id] = res;
            this.collection.trigger("get.layerInfo.success",res)

        },

        onClickDeleteButton: function(){
            if(!this.nodeId){
                Utility.warning("请设置原节点！");
                return false;
            }
            var args = [];
            _.each(this.defaultParam, function(el){
                console.log(el.id, el.isChecked)
                if(el.isChecked === true){
                    var localArgs = {
                        id: el.id,
                        type: "strategy",
                        rules: "",
                        oldNodeId: this.nodeId,
                        operateType: "delete"
                    }
                    var tempRule = []
                    _.each(this.dataList[el.id], function(item){
                        if(item.isChecked === true){
                            tempRule.push(item.id)
                        }
                    }.bind(this))
                    var ruleStr = tempRule.join(",");
                    localArgs.rules = ruleStr;
                    this.collection.updateStrategy(localArgs);
                }
            }.bind(this))


            if (this.distributeLowerLevelPopup) $("#" + this.distributeLowerLevelPopup.modalId).remove();

            require(["specialLayerManage.lowerLevel.view"], function(DistributeLowerLevelView) {
                var myDistributeLowerLevelView = new DistributeLowerLevelView({
                    collection: this.collection,
                    dataParam: this.defaultParam
                });
                var options = {
                    title:"配置下发",
                    body : myDistributeLowerLevelView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback:  function(){
                        var args = myDistributeLowerLevelView.getArgs();
                        if(!args) return;
                        this.ruleConfirmInfo = []
                        this.collection.off("send.success");
                        this.collection.off("send.error");
                        this.collection.on("send.success", $.proxy(this.onSendSuccess, this));
                        this.collection.on("send.error", $.proxy(this.onSendError, this));
                        _.each(args, function(el){
                            this.collection.strategyUpdate(el);
                        }.bind(this))
                        this.options.onCancelCallback && this.options.onCancelCallback();
                        // this.distributeLowerLevelPopup.$el.modal('hide');

                    }.bind(this),
                    onHiddenCallback: function(){
    
                        }.bind(this)
                    }
                this.distributeLowerLevelPopup = new Modal(options);
                this.distributeLowerLevelPopup.$el.find(".ok").attr("disabled","disabled");
                this.distributeLowerLevelPopup.$el.find(".cancel").html("取消");
                
            }.bind(this))
        },

        onSendSuccess:function(data, id){
            this.ruleConfirmInfo.push(data);
            this.collection.trigger("get.ruleConfirmInfo.success", data, id)
            if(this.ruleConfirmInfo.length === this.defaultParam.length){
                this.distributeLowerLevelPopup.$el.find(".ok").off("click");
                this.distributeLowerLevelPopup.$el.find(".ok").on("click" ,function(){
                    this.distributeLowerLevelPopup.$el.modal('hide');
                }.bind(this));
            }
        },

        onSendError: function(data, id){
            this.ruleConfirmInfo.push(data);
            this.collection.trigger("get.ruleConfirmInfo.error", data, id)
            if(this.ruleConfirmInfo.length === this.defaultParam.length){
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
                        nodeId: this.nodeId
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
            _.each(this.de1, function(el, index, list){
                el.isChecked = eventTarget.checked
            }.bind(this))
            this.nodeTable.find("tbody tr[data-id]").find("input").prop("checked", eventTarget.checked);
        },

        onClickItemView:function(event){     
            var eventTarget = event.currentTarget || event.target, id;
            id = $(eventTarget).attr("id");
            this.defaultRuleParam = this.dataList[id] || []
            this.ruleTable = $(_.template(template['tpl/specialLayerManage/specialLayerManage.viewRule.html'])({
                data: this.defaultRuleParam
            }));
            var idStrPar = "tr[data-nodeid=" + id + "]" + ".toggle-show";
            var idStrSon = "td[data-nodeid=" + id + "]" + ".tdTable";
            if (this.defaultRuleParam.length !== 0){    
                this.$el.find(idStrSon).html(this.ruleTable[0]);
                this.ruleTable.find("tbody[data-rule] tr").on("click", $.proxy(this.onRuleItemCheckedUpdated, this));
                this.ruleTable.find("thead[data-rule] input").on("click", $.proxy(this.onRuleAllCheckedUpdated, this));
            }else{
                this.$el.find(idStrSon).html(_.template(template['tpl/empty-2.html'])({
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
            if (checkedList.length === this.defaultRuleParam.length)
                this.ruleTable.find("thead[data-rule] input").get(0).checked = true;
            if (checkedList.length !== this.defaultRuleParam.length)
                this.ruleTable.find("thead[data-rule] input").get(0).checked = false;
        },

        onRuleAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            _.each(this.de1, function(el, index, list){
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

    return DeleteNodeView;
});