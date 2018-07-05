
define("setupTopoManage.edit.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var EditTopoView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                // 是新建还是编辑状态
                this.isEdit = options.isEdit;
                // 是否是查看状态
                this.isView = options.isView;
                this.isSaving = false;

                // 注意这里this.$el指的是什么，在哪里应该都一样，是引用的那个tpl模板
                this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.edit.html'])({
                    data: {}
                }));

                this.spareAllNode = [];
                this.collection.off('get.topo.OriginInfo.success');
                this.collection.off('get.topo.OriginInfo.error');
                this.collection.on('get.topo.OriginInfo.success', $.proxy(this.onOriginInfo, this));
                this.collection.on('get.topo.OriginInfo.success', $.proxy(this.onGetAllNode, this));
                this.collection.on('get.topo.OriginInfo.error', $.proxy(this.onGetError, this));
                //添加拓扑关系
                this.collection.off('add.topo.success');
                this.collection.off('add.topo.error');
                this.collection.on('add.topo.success', $.proxy(this.addTopoSuccess, this));
                this.collection.on('add.topo.error', $.proxy(this.onSaveError, this));
                //修改拓扑关系
                this.collection.off('modify.topo.success');
                this.collection.off('modify.topo.error');
                this.collection.on('modify.topo.success', $.proxy(this.modifyTopoSuccess, this));
                this.collection.on('modify.topo.error', $.proxy(this.onSaveError, this));
                this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
                
                // 编辑模式（isEdit）
                if (this.isEdit && !this.isView) {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                    this.collection.getLatestVersion(this.model.get('id'));
                } else if (!this.isEdit && this.isView){
                    this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                    this.collection.getTopoInfo(this.model.get('id'));
                    this.$el.find(".opt-ctn .save").hide();
                    this.$el.find('.upper .add-node').hide();
                    this.$el.find('.middle .add-node').hide();
                    this.$el.find('.lower .add-node').hide();
                    this.$el.find(".add-rule").hide();
                // 新建模式（！isEdit）
                } else {
                    this.defaultParam = {
                        "id": null,
                        "name": "",
                        "type": null,
                        "upperNodes": [],
                        "middleNodes":[],
                        "lowerNodes":[],
                        "rule": [],
                        "mark": ""
                    }
                    this.initSetup();
                }
            },

            onGetAllNode:function(){
                require(['nodeManage.model'], function(NodeManageModel) {
                    var myNodeManageModel = new NodeManageModel();
                    myNodeManageModel.on("get.node.success", $.proxy(this.onGetAllNodeTest, this));
                    myNodeManageModel.on("get.node.error", $.proxy(this.onGetError, this));
                    myNodeManageModel.getNodeList({
                        "page": 1,
                        "count": 9999,
                        "chname": null, //节点名称
                        "operator": null, //运营商id
                        "status": "1,4", //节点状态
                        "appType": this.appType,
                        "cacheLevel":null,
                        "liveLevel":null
                    });
                }.bind(this))
            },

            onGetAllNodeTest:function(res){
                var testUpperArray = [];
                var testLowerArray = [];
                var testMiddleArray = [];
                _.each(res, function(el, index, list) {
                    _.each(this.defaultParam.upperNodes, function(node){
                        if(el.id === node.id){
                            el.name = el.chName || el.name;
                            testUpperArray.push(el);
                        }
                    }.bind(this));
                    _.each(this.defaultParam.middleNodes, function(node){
                        if(el.id === node.id){
                            el.name = el.chName || el.name;
                            testMiddleArray.push(el)
                        }
                    }.bind(this))
                    _.each(this.defaultParam.lowerNodes, function(node){
                        if(el.id === node.id){
                            el.name = el.chName || el.name;
                            testLowerArray.push(el)
                        }
                    }.bind(this))
                }.bind(this));
                this.defaultParam.upperNodes = testUpperArray;
                this.defaultParam.middleNodes = testMiddleArray;
                this.defaultParam.lowerNodes = testLowerArray;
            },

            addTopoSuccess: function() {
                this.isSaving = false;
                alert('保存成功');
                this.options.onSaveCallback && this.options.onSaveCallback();
            },

            modifyTopoSuccess: function() {
                this.isSaving = false;
                this.options.onSaveCallback && this.options.onSaveCallback();
            },


            onOriginInfo: function(res) {
                this.defaultParam = {
                    "id": res.id,
                    "name": res.name,
                    "upperNodes": res.upperNodes,
                    "middleNodes":res.middleNodes,
                    "lowerNodes":res.lowerNodes,

                    "rule": res.rule,
                    // 拓扑关系有类型之分
                    "type": res.type,
                    "mark": res.mark
                }

                this.$el.find("#input-name").val(res.name);
                this.$el.find("#comment").val(res.mark);
                this.$el.find("#input-name").attr("readonly", "true");
                if (this.isView)
                    this.$el.find("#comment").attr("readonly", "true");

                console.log("编辑的拓扑: ", this.defaultParam)

                this.initSetup();
            },

            // 新建和编辑状态下都会用到
            initSetup: function() {
                // 管理权限
                if (!this.isEdit && AUTH_OBJ.ApplyCreateTopos) {
                    this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                } else if (AUTH_OBJ.ApplyEditTopos) {
                    this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                }

                this.$el.find(".add-rule").on("click", $.proxy(this.onClickAddRuleButton, this));

                // 上、中、下层节点自添部分开始
                this.$el.find('.upper .add-node').on("click", $.proxy(this.onClickAddUpperNodeButton, this));
                this.$el.find('.middle .add-node').on("click",$.proxy(this.onClickAddMiddleNodeButton,this));
                this.$el.find('.lower .add-node').on("click",$.proxy(this.onClickAddLowerNodeButton,this));
                // 上、中、下层节点自添部分结束
                
                // 显示与隐藏
                this.$el.find(".view-more").on("click", $.proxy(this.onClickViewMoreButton, this));
                this.$el.find(".view-less").on("click", $.proxy(this.onClickViewLessButton, this));

                this.collection.off("get.devicetype.success");
                this.collection.off("get.devicetype.error");
                this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
                this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));
                this.collection.getDeviceTypeList(); //获取应用类型列表接口

                // this.initAllNodesTable();
                this.initUpperTable();
                this.initMiddleTable();
                this.initLowerTable();

                require(['nodeManage.model'], function(NodeManageModel) {
                    var myNodeManageModel = new NodeManageModel();
                    // 获取运营商信息
                    myNodeManageModel.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
                    myNodeManageModel.on("get.operator.error", $.proxy(this.onGetError, this));
                    myNodeManageModel.getOperatorList();
                }.bind(this))
            },

            // 显示更多，已做修改
            onClickViewMoreButton: function(event) {
                var eventTarget = event.srcElement || event.target;
                if($(eventTarget).parents(".upper").get(0)){
                    this.$el.find(".upper .table-ctn").show(200);
                    this.$el.find('.upper .view-less').show();
                    this.$el.find(".upper .view-more").hide();
                }else if($(eventTarget).parents(".middle").get(0)){
                    this.$el.find(".middle .table-ctn").show(200);
                    this.$el.find('.middle .view-less').show();
                    this.$el.find(".middle .view-more").hide();
                }else if($(eventTarget).parents(".lower").get(0)){
                    this.$el.find(".lower .table-ctn").show(200);
                    this.$el.find('.lower .view-less').show();
                    this.$el.find(".lower .view-more").hide();
                }
            },

            // 显示省略，已做修改
            onClickViewLessButton: function(event) {
                var eventTarget = event.srcElement || event.target;
                if($(eventTarget).parents(".upper").get(0)){
                    this.$el.find(".upper .table-ctn").hide(200);
                    this.$el.find('.upper .view-less').hide();
                    this.$el.find(".upper .view-more").show();
                }else if($(eventTarget).parents(".middle").get(0)){
                    this.$el.find(".middle .table-ctn").hide(200);
                    this.$el.find('.middle .view-less').hide();
                    this.$el.find(".middle .view-more").show();
                }else if($(eventTarget).parents(".lower").get(0)){
                    this.$el.find(".lower .table-ctn").hide(200);
                    this.$el.find('.lower .view-less').hide();
                    this.$el.find(".lower .view-more").show();
                }
            },

            onGetOperatorSuccess: function(res) {
                this.operatorList = res.rows;
                this.initRuleTable();
            },

            // 逻辑没问题，暂不需要修改
            onClickSaveButton: function() {
                if (this.isSaving === true) return;

                this.defaultParam.name = $.trim(this.$el.find("#input-name").val());
                if (this.defaultParam.name == '') {
                    alert('请输入拓扑关系名称');
                    return;
                } else if (this.defaultParam.type == null) {
                    alert('请选择设备类型');
                    return;
                } else if (this.defaultParam.upperNodes.length == 0 && this.defaultParam.middleNodes.length == 0) {
                    alert('请选择拓扑关系的上层或中层节点');
                    return;
                    // 中层或上层节点
                } else if(this.defaultParam.lowerNodes.length == 0){
                    alert("请选择拓扑关系的下层节点");
                    return;
                }else if (this.defaultParam.rule.length == 0) {
                    alert('请添加规则');
                    return;
                }

                console.log("点击保存按钮时的拓扑", this.defaultParam)

                var postRules = [],
                    postTopo = {};

                _.each(this.defaultParam.rule, function(rule) {
                    var localIdArray = [],
                        upperObjArray = [],
                        tempRule = {};
                    _.each(rule.local, function(node) {
                        if(rule.localType===3){
                            localIdArray.push([node.provinceId, node.operatorId]);
                        }else if(rule.localType===4){
                            localIdArray.push([node.areaId, node.operatorId]);
                        }
                        localIdArray.push(node.id)
                    }.bind(this));
                    _.each(rule.upper, function(node) {
                        upperObjArray.push({
                            nodeId: node.rsNodeMsgVo.id,
                            ipCorporation: node.ipCorporation,
                            chiefType: node.chiefType === undefined ? 1 : node.chiefType
                        })
                    }.bind(this));
                    tempRule.id = rule.id;
                    tempRule.localType = rule.localType
                    tempRule.local = localIdArray;
                    tempRule.upper = upperObjArray;
                    postRules.push(tempRule);
                }.bind(this))

                postTopo.id = this.defaultParam.id;
                postTopo.name = this.defaultParam.name;
                postTopo.type = this.defaultParam.type;
                postTopo.upperNodes = [];
                _.each(this.defaultParam.upperNodes, function(el){
                       postTopo.upperNodes.push(el.id)
                }.bind(this));
                postTopo.middleNodes = [];
                _.each(this.defaultParam.middleNodes, function(el){
                       postTopo.middleNodes.push(el.id)
                }.bind(this));
                postTopo.lowerNodes = [];
                _.each(this.defaultParam.lowerNodes, function(el){
                       postTopo.lowerNodes.push(el.id)
                }.bind(this));
                postTopo.rule = postRules
                postTopo.mark = this.$el.find("#comment").val();
                // console.log(postTopo)
                if (this.isEdit)
                // Ajax拓扑关系编辑
                    this.collection.topoModify(postTopo);
                else
                // Ajax拓扑关系新建
                    this.collection.topoAdd(postTopo);

                this.isSaving = true;
                this.$el.find("opt-ctn .save").attr("disabled","disabled");
            },
    
            onClickCancelButton: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            initDeviceDropMenu: function(res) {
                this.deviceTypeArray = [];
                var typeArray = [],
                    rootNode = this.$el.find(".dropdown-type");

                _.each(res, function(el, index, ls) {
                    typeArray.push({
                        name: el.name,
                        value: el.id
                    });
                    this.deviceTypeArray.push({
                        name: el.name,
                        value: el.id
                    });
                }.bind(this));
                if (!this.isEdit && !this.isView) {
                    this.defaultParam.type = typeArray[0].value;
                    var rootNode = this.$el.find(".dropdown-app");
                    Utility.initDropMenu(rootNode, typeArray, function(value) {
                        this.defaultParam.type = parseInt(value)
                    }.bind(this));
                    this.$el.find("#dropdown-app .cur-value").html(typeArray[0].name);
                } else {
                    var upperObj = _.find(typeArray, function(object) {
                        return object.value == this.defaultParam.type;
                    }.bind(this))
                    this.$el.find('#dropdown-app .cur-value').html(upperObj.name);
                    this.$el.find("#dropdown-app").attr("disabled", "disabled")
                }
            },

            // 接口还未规定，这个接口是另一个接口
            onClickAddUpperNodeButton: function(event) {
                if(this.defaultParam.type != 202 && this.defaultParam.type !==203){
                    alert("目前只支持直播(Live)或点播(Cache)类型");
                    return;
                };
                require(['setupTopoManage.selectNode.view'], function(SelectNodeView) {
                    if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();
                    var mySelectNodeView = new SelectNodeView({
                        collection: this.collection,
                        selectedNodes: this.defaultParam.upperNodes,            
                        appType: this.defaultParam.type,
                        level: 1
                    });
                    // 这部分是打钩选择的节点
                    var options = {
                        title: "选择节点",
                        // 渲染出来应该就是上层节点全打钩
                        body: mySelectNodeView,
                        backdrop: 'static',
                        type: 2,
                        width: 800,
                        onOKCallback: function() {
                            this.defaultParam.upperNodes = mySelectNodeView.getUpperArgs();
                            this.selectNodePopup.$el.modal("hide");
                            this.initUpperTable();
                        }.bind(this),
                        onHiddenCallback: function() {}.bind(this)
                    }
                    this.selectNodePopup = new Modal(options);
                }.bind(this))
            },

            // 重新渲染上层节点列表，出来的应该是已经选择的节点
            initUpperTable: function() {
                this.upperTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                    // 所以节点变量应该如下
                    data: this.defaultParam.upperNodes
                }));
                if (this.defaultParam.upperNodes.length !== 0)
                    this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
                else
                    this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "还没有添加节点"
                        }
                    }));

                this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));

                if (this.isView)
                    this.upperTable.find("tbody .delete").hide();
            },

            onClickItemUpperDelete: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                this.defaultParam.upperNodes = _.filter(this.defaultParam.upperNodes, function(obj) {
                    return obj.id !== parseInt(id)
                }.bind(this))

                this.initUpperTable();
            },

            // 规则选择部分，不需要修改，只是刷新规则列表,有效的是localLayer和upperLayer
            initRuleTable: function() {
                //var data = [{localLayer: "1111", upperLayer: "22222"}];
                this.ruleList = [];

                _.each(this.defaultParam.rule, function(rule, index, ls) {
                    var localLayerArray = [],
                        upperLayer = [],
                        primaryArray = [],
                        backupArray = [],
                        primaryNameArray = [],
                        backupNameArray = [];
                    _.each(rule.local, function(local, inx, list) {
                        var name = local.name;
                        if(rule.localType===3) {
                            name = local.provinceName + '/'+local.name;
                        }else if(rule.localType===4){
                            name = local.areaName+'/'+local.name;
                        }
                        localLayerArray.push(name || "[后端没有返回名称]")
                    }.bind(this));
                   // if(rule.localType===1) localLayerArray=localLayerArray.join('<br>')
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
                        upperLayer = '<strong>主：</strong><br>' + primaryNameArray.join('<br>');
                    if (backupArray.length > 0)
                        upperLayer += '<br><strong>备：</strong><br>' + backupNameArray.join('<br>');

                    // 这部分是规则选择后的数据形式
                    var ruleStrObj = {
                        id: rule.id,
                        localLayer: localLayerArray.join("<br>"),
                        upperLayer: upperLayer,
                        localType:rule.localType
                    }
                    this.ruleList.push(ruleStrObj)
                }.bind(this))
                // 渲染到数据列表中
                this.roleTable = $(_.template(template['tpl/setupChannelManage/setupChannelManage.rule.table.html'])({
                    data: this.ruleList
                }));
                if (this.ruleList.length !== 0)
                    this.$el.find(".rule .table-ctn").html(this.roleTable[0]);
                else
                    this.$el.find(".rule .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "还没有添加规则"
                        }
                    }));

                this.roleTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.roleTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));

                this.roleTable.find("[data-toggle='popover']").popover();

                if (this.isView){
                    this.roleTable.find("tbody .edit").hide();
                    this.roleTable.find("tbody .delete").hide();
                }
            },

            onClickAddMiddleNodeButton: function(event) {
                if(this.defaultParam.type != 202 && this.defaultParam.type !==203){
                    alert("目前只支持直播(Live)或点播(Cache)类型");
                    return;
                };

                require(['setupTopoManage.selectNode.view'], function(SelectNodeView) {
                    if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

                    var mySelectNodeView = new SelectNodeView({
                        collection: this.collection,
                        // 默认中层节点全打钩
                        selectedNodes: this.defaultParam.middleNodes,
                        // nodesList: this.defaultParam.allNodes,
                        appType: this.defaultParam.type,
                        level: 2
                    });
                    var options = {
                        title: "选择节点",
                        body: mySelectNodeView,
                        backdrop: 'static',
                        type: 2,
                        width: 800,
                        onOKCallback: function() {
                            this.defaultParam.middleNodes = mySelectNodeView.getMiddleArgs();
                            this.selectNodePopup.$el.modal("hide");
                            this.initMiddleTable();
                        }.bind(this),
                        onHiddenCallback: function() {}.bind(this)
                    }
                    this.selectNodePopup = new Modal(options);
                }.bind(this))
            },

            initMiddleTable: function() {
                this.middleTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                    data: this.defaultParam.middleNodes
                }));
                if (this.defaultParam.middleNodes.length !== 0)
                    this.$el.find(".middle .table-ctn").html(this.middleTable[0]);
                else
                    this.$el.find(".middle .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "还没有添加节点"
                        }
                    }));

                this.middleTable.find("tbody .delete").on("click", $.proxy(this.onClickItemMiddleDelete, this));

                if (this.isView)
                    this.middleTable.find("tbody .delete").hide();
            },

            onClickItemMiddleDelete: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                this.defaultParam.middleNodes = _.filter(this.defaultParam.middleNodes, function(obj) {
                    return obj.id !== parseInt(id)
                }.bind(this))

                this.initMiddleTable();
            },

            onClickAddLowerNodeButton: function(event) {
                if(this.defaultParam.type != 202 && this.defaultParam.type !==203){
                    alert("目前只支持直播(Live)或点播(Cache)类型");
                    return;
                };

                require(['setupTopoManage.selectNode.view'], function(SelectNodeView) {
                    if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

                    var mySelectNodeView = new SelectNodeView({
                        collection: this.collection,
                        selectedNodes: this.defaultParam.lowerNodes,
                        appType: this.defaultParam.type,
                        level: 3
                    });
                    var options = {
                        title: "选择节点",
                        body: mySelectNodeView,
                        backdrop: 'static',
                        type: 2,
                        width: 800,
                        onOKCallback: function() {
                            this.defaultParam.lowerNodes = mySelectNodeView.getLowerArgs();
                            this.selectNodePopup.$el.modal("hide");
                            this.initLowerTable();
                        }.bind(this),
                        onHiddenCallback: function() {}.bind(this)
                    }
                    this.selectNodePopup = new Modal(options);
                }.bind(this))
            },

            initLowerTable: function() {
                this.lowerTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                    data: this.defaultParam.lowerNodes
                }));
                if (this.defaultParam.lowerNodes.length !== 0)
                    this.$el.find(".lower .table-ctn").html(this.lowerTable[0]);
                else
                    this.$el.find(".lower .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "还没有添加节点"
                        }
                    }));

                this.lowerTable.find("tbody .delete").on("click", $.proxy(this.onClickItemLowerDelete, this));

                if (this.isView)
                    this.lowerTable.find("tbody .delete").hide();
            },

            onClickItemLowerDelete: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                this.defaultParam.lowerNodes = _.filter(this.defaultParam.lowerNodes, function(obj) {
                    return obj.id !== parseInt(id)
                }.bind(this))

                this.initLowerTable();
            },

            onClickItemEdit: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                    console.log(this.defaultParam.rule)
                this.curEditRule = _.find(this.defaultParam.rule, function(obj) {
                    return obj.id === parseInt(id)
                }.bind(this))
                console.log("点编辑时的this.curEditRule", this.curEditRule)
             //  console.log("this.curEditRule"+this.curEditRule.local[1].name);
                if (!this.curEditRule) {
                    alert("找不到此行的数据，无法编辑");
                    return;
                }

                require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'],
                    function(AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                        var newLocalNodes = _.union(this.defaultParam.lowerNodes,this.defaultParam.middleNodes);
                        var newUpperNodes = _.union(this.defaultParam.upperNodes,this.defaultParam.middleNodes);
                        var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                            
                            collection: this.collection,
                            localNodes: newLocalNodes,
                            upperNodes: newUpperNodes,
                            rule: this.defaultParam.rule,
                            curEditRule: this.curEditRule,
                            appType: this.defaultParam.type,
                            isEdit: true,
                            onSaveCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                                this.initRuleTable();
                            }.bind(this),
                            onCancelCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                            }.bind(this)
                        })

                        this.$el.find(".add-topo").hide();
                        myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
                    }.bind(this))
            },

            onClickItemDelete: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                    this.defaultParam.rule=_.filter(this.defaultParam.rule,function(el){
                         return parseInt(id)!=el.id
                    }.bind(this))
                
                this.initRuleTable();
            },

            // 添加规则按钮
            onClickAddRuleButton: function() {
                if(this.defaultParam.upperNodes.length === 0 && this.defaultParam.middleNodes.length === 0){
                    alert("请先完成上层或中层节点的添加！");
                    return;
                }
                if(this.defaultParam.lowerNodes.length === 0){
                    alert("请完成下层节点的添加！");
                    return;
                }

                require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'],
                    function(AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                        var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                        var options = myAddEditLayerStrategyModel;
                        var newLocalNodes = _.union(this.defaultParam.lowerNodes,this.defaultParam.middleNodes);
                        var newUpperNodes = _.union(this.defaultParam.upperNodes,this.defaultParam.middleNodes);
                        var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                            collection: options,
                            localNodes: newLocalNodes,
                            upperNodes: newUpperNodes,
                            
                            rule: this.defaultParam.rule,
                            appType: this.defaultParam.type,
                            onSaveCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                                this.initRuleTable();
                            }.bind(this),
                            onCancelCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                            }.bind(this)
                        })
                        this.$el.find(".add-topo").hide();
                        myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
                    }.bind(this))
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            onSaveError: function(error) {
                this.isSaving = false;
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
             this.$el.find(".opt-ctn .save").removeAttr("disabled");
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return EditTopoView;
    });


    // upperAllNodes-->upperNodes   由可选的上层节点中选择自己需要的上层节点
    // middleAllNodes-->middleNodes 由可选的中层节点中选择自己需要的中层节点
    // lowerAllNodes-->lowerNodes   由可选的下层节点中选择自己需要的下层节点
    // upperNodes + middleNodes = newUpperNodes-->upperLayer 
    // middleNodes + lowerNodes = newLocalNodes-->localLayer