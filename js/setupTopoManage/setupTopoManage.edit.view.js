define("setupTopoManage.edit.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var EditTopoView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.isEdit = options.isEdit;

                this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.edit.html'])({
                    data: {}
                }));

                this.collection.off('get.topo.OriginInfo.success');
                this.collection.off('get.topo.OriginInfo.error');
                this.collection.on('get.topo.OriginInfo.success', $.proxy(this.onOriginInfo, this));
                this.collection.on('get.topo.OriginInfo.error', $.proxy(this.onGetError, this));
                //添加拓扑关系
                this.collection.off('add.topo.success');
                this.collection.off('add.topo.error');
                this.collection.on('add.topo.success', $.proxy(this.addTopoSuccess, this));
                this.collection.on('add.topo.error', $.proxy(this.addTopoError, this));
                //修改拓扑关系
                this.collection.off('modify.topo.success');
                this.collection.off('modify.topo.error');
                this.collection.on('modify.topo.success', $.proxy(this.modifyTopoSuccess, this));
                this.collection.on('modify.topo.error', $.proxy(this.modifyTopoError, this));

                if (this.isEdit) {
                    this.collection.getTopoOrigininfo(this.model.get('id'));
                } else {
                    this.defaultParam = {
                        "id": null,
                        "name": "",
                        "type": null,
                        "allNodes": [],
                        "upperNodes": [],
                        "rule": []
                    }
                    this.initSetup();
                }
            },

            addTopoSuccess: function() {
                alert('保存成功');
                this.options.onSaveCallback && this.options.onSaveCallback();
            },

            addTopoError: function(error) {
                if (error && error.message)
                    alert(error.message);
                else
                    alert("网络阻塞，请刷新重试！");
            },

            modifyTopoSuccess: function() {
                this.options.onSaveCallback && this.options.onSaveCallback();
                alert('修改成功');
            },

            modifyTopoError: function(error) {
                if (error && error.message)
                    alert(error.message);
                else
                    alert("网络阻塞，请刷新重试！");
            },

            onOriginInfo: function(res) {
                this.defaultParam = {
                    "id": res.id,
                    "name": res.name,
                    "allNodes": res.allNodes,
                    "upperNodes": res.upperNodes,
                    "rule": res.rule,
                    "type": res.type
                }

                this.$el.find("#input-name").val(res.name);
                this.$el.find("#input-name").attr("readonly", "true");

                console.log("编辑的拓扑: ", this.defaultParam)
                this.initSetup();
            },

            initSetup: function() {
                //this.$el.find('.all .add-node').hide();
                this.$el.find('.upper .add-node').hide();
                this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));

                if (!this.isEdit && AUTH_OBJ.ApplyCreateTopos) {
                    this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                } else if (AUTH_OBJ.ApplyEditTopos){
                    this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                }

                this.$el.find(".add-rule").on("click", $.proxy(this.onClickAddRuleButton, this));
                this.$el.find('.all .add-node').on("click", $.proxy(this.onClickAddAllNodeButton, this))

                this.collection.off("get.devicetype.success");
                this.collection.off("get.devicetype.error");
                this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
                this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));
                this.collection.getDeviceTypeList(); //获取应用类型列表接口

                this.initAllNodesTable();
                this.initRuleTable();
            },

            onClickSaveButton: function() {
                this.defaultParam.name = $.trim(this.$el.find("#input-name").val());
                if (this.defaultParam.name == '') {
                    alert('请输入拓扑关系名称');
                    return;
                } else if (this.defaultParam.type == null) {
                    alert('请选择设备类型');
                    return;
                } else if (this.defaultParam.allNodes.length == 0) {
                    alert('请选择加入拓扑关系的节点');
                    return;
                } else if (this.defaultParam.upperNodes.length == 0) {
                    alert('请选择拓扑关系的上层节点');
                    return;
                } else if (this.defaultParam.rule.length == 0) {
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
                        localIdArray.push(node.id)
                    }.bind(this))
                    _.each(rule.upper, function(node) {
                        upperObjArray.push({
                            nodeId: node.rsNodeMsgVo.id,
                            ipCorporation: node.ipCorporation,
                            chiefType: node.chiefType === undefined ? 1 : node.chiefType
                        })
                    }.bind(this))

                    tempRule.id = rule.id;
                    tempRule.localType = rule.localType
                    tempRule.local = localIdArray;
                    tempRule.upper = upperObjArray;
                    postRules.push(tempRule);
                }.bind(this))

                postTopo.allNodes = this.defaultParam.allNodes;
                postTopo.id = this.defaultParam.id;
                postTopo.name = this.defaultParam.name;
                postTopo.type = this.defaultParam.type;
                postTopo.upperNodes = this.defaultParam.upperNodes;
                postTopo.rule = postRules

                if (this.isEdit)
                    this.collection.topoModify(postTopo);
                else
                    this.collection.topoAdd(postTopo);
                this.options.onSaveCallback && this.options.onSaveCallback();
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
                if (!this.isEdit) {
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

            onGetAllNode: function(res) {
                this.$el.find('.all .add-node').show();
                this.allNodes = res;
                //过滤掉关闭和挂起的节点
                var resFlag = [];
                _.each(res, function(el, index, list) {
                    if (el.status != 3 && el.status != 2) resFlag.push(el)
                })

                this.selectedAllNodeList = [];
                this.nodesArrayFirst = [];

                _.each(resFlag, function(el, index, list) {
                    el.checked = false;
                    _.each(this.defaultParam.allNodes, function(defaultLocalId, inx, ls) {
                        if (defaultLocalId === el.id) {
                            el.checked = true;
                            this.selectedAllNodeList.push({
                                nodeId: el.id,
                                nodeName: el.chName,
                                operator: el.operatorId,
                                checked: el.checked
                            })
                        }
                    }.bind(this));
                    this.nodesArrayFirst.push({
                        name: el.chName,
                        value: el.id,
                        checked: el.checked,
                        operator: el.operatorId
                    });
                }.bind(this))

                //this.initAllNodesSelect();
                this.initAllNodesTable();
            },

            onClickAddAllNodeButton: function(event) {
                require(['setupTopoManage.selectNode.view'], function(SelectNodeView) {
                    if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

                    var mySelectNodeView = new SelectNodeView({
                        collection: this.collection,
                        selectedNodes: this.defaultParam.allNodes
                    });
                    var options = {
                        title: "选择节点",
                        body: mySelectNodeView,
                        backdrop: 'static',
                        type: 2,
                        height: 500,
                        onOKCallback: function() {
                            this.defaultParam.allNodes = mySelectNodeView.getArgs();
                            this.selectNodePopup.$el.modal("hide");
                            this.initAllNodesTable();
                        }.bind(this),
                        onHiddenCallback: function() {}.bind(this)
                    }
                    this.selectNodePopup = new Modal(options);
                }.bind(this))
            },

            initAllNodesTable: function() {
                this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                    data: this.defaultParam.allNodes
                }));

                if (this.defaultParam.allNodes.length !== 0) {
                    this.$el.find(".all .table-ctn").html(this.localTable[0]);
                } else {
                    this.$el.find(".all .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "还没有添加节点"
                        }
                    }));
                }

                this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemAllDelete, this));

                //this.onGetUpperNode();
            },

            onClickItemAllDelete: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                this.defaultParam.allNodes = _.filter(this.defaultParam.allNodes, function(obj) {
                    return obj.id !== parseInt(id)
                }.bind(this))

                this.initAllNodesTable();
            },

            onGetUpperNode: function(res) {
                this.$el.find('.upper .add-node').show();

                this.selectedUpperNodeList = [];
                this.nodesArrayFirstUpper = [];

                _.each(this.selectedAllNodeList, function(el, index, list) {
                    el.checked = false;
                    _.each(this.defaultParam.upperNodes, function(upperId, inx, ls) {
                        if (upperId === el.nodeId) {
                            el.checked = true;
                            this.selectedUpperNodeList.push({
                                nodeId: el.nodeId,
                                nodeName: el.nodeName,
                                checked: true
                            })
                        }
                    }.bind(this))
                    this.nodesArrayFirstUpper.push({
                        name: el.nodeName,
                        value: el.nodeId,
                        checked: el.checked,
                        operator: el.operatorId
                    });
                }.bind(this))

                this.initUpperTable()
                this.initUpperSelect()
            },

            initUpperSelect: function() {
                if (this.searchSelectUpper)
                    this.searchSelectUpper.destroy();
                var options = {
                    containerID: this.$el.find('.upper .add-node-ctn').get(0),
                    panelID: this.$el.find('.upper .add-node').get(0),
                    openSearch: true,
                    onOk: $.proxy(this.onClickUpperNodesSelectOK, this),
                    data: this.nodesArrayFirstUpper,
                    callback: function(data) {}.bind(this)
                }

                this.searchSelectUpper = new SearchSelect(options);
                this.$el.find(".upper .add-node-ctn .select-container").css("left", "-170px");
            },

            onClickUpperNodesSelectOK: function(data) {
                this.selectedUpperNodeList = [];
                _.each(data, function(el, key, ls) {
                    this.selectedUpperNodeList.push({
                        nodeId: parseInt(el.value),
                        nodeName: el.name,
                        operatorId: ''
                    })
                }.bind(this))

                this.defaultParam.upperNodes = [];
                _.each(this.selectedUpperNodeList, function(el) {
                    this.defaultParam.upperNodes.push(parseInt(el.nodeId));
                }.bind(this))

                _.each(this.nodesArrayFirstUpper, function(el, key, ls) {
                    el.checked = false;
                    _.each(this.selectedUpperNodeList, function(data, key, ls) {
                        if (el.value == data.nodeId) {
                            el.checked = true;
                            data.operator = el.operator;
                        }
                    }.bind(this))
                }.bind(this))

                this.initUpperTable()
            },

            initUpperTable: function() {
                this.upperTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                    data: this.selectedUpperNodeList
                }));
                if (this.selectedUpperNodeList.length !== 0)
                    this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
                else
                    this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "还没有添加节点"
                        }
                    }));

                if (!this.isEdit)
                    this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));
                else
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

                _.each(this.nodesArrayFirstUpper, function(el, index, ls) {
                    if (parseInt(el.value) === parseInt(id)) el.checked = false;
                }.bind(this))
                this.selectedUpperNodeList = _.filter(this.selectedUpperNodeList, function(obj) {
                    return parseInt(obj.nodeId) !== parseInt(id)
                }.bind(this))

                this.defaultParam.upperNodes = [];
                _.each(this.selectedUpperNodeList, function(el, key, ls) {
                    this.defaultParam.upperNodes.push(parseInt(el.nodeId));
                }.bind(this))

                this.initUpperSelect();
                this.initUpperTable();
            },

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
                        localLayerArray.push(local.name)
                    }.bind(this));

                    primaryArray = _.filter(rule.upper, function(obj) {
                        return obj.chiefType !== 0;
                    }.bind(this))
                    backupArray = _.filter(rule.upper, function(obj) {
                        return obj.chiefType === 0;
                    }.bind(this))

                    _.each(primaryArray, function(upper, inx, list) {
                        if (upper.rsNodeMsgVo)
                            primaryNameArray.push(upper.rsNodeMsgVo.name)
                        else
                            primaryNameArray.push("[后端没有返回名称]")
                    }.bind(this));
                    _.each(backupArray, function(upper, inx, list) {
                        if (upper.rsNodeMsgVo)
                            backupNameArray.push(upper.rsNodeMsgVo.name)
                        else
                            backupNameArray.push("[后端没有返回名称]")
                    }.bind(this));

                    var upperLayer = primaryNameArray.join('、');
                    if (rule.upper.length > 1)
                        upperLayer = '<strong>主：</strong>' + primaryNameArray.join('、');
                    if (backupArray.length > 0)
                        upperLayer += '<br><strong>备：</strong>' + backupNameArray.join('、');

                    var ruleStrObj = {
                        id: rule.id,
                        localLayer: localLayerArray.join('、'),
                        upperLayer: upperLayer
                    }
                    this.ruleList.push(ruleStrObj)
                }.bind(this))

                this.roleTable = $(_.template(template['tpl/setupChannelManage/setupChannelManage.role.table.html'])({
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

                if (!this.isEdit) {
                    this.roleTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                    this.roleTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                } else {
                    this.roleTable.find("tbody .edit").hide();
                    this.roleTable.find("tbody .delete").hide();
                }
            },

            onClickItemEdit: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");

                this.curEditRule = _.find(this.defaultParam.rule, function(obj) {
                    return obj.id === parseInt(id)
                }.bind(this))

                if (!this.curEditRule) {
                    alert("找不到此行的数据，无法编辑");
                    return;
                }

                require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], function(AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                    var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                        collection: this.collection,
                        localNodes: this.selectedAllNodeList,
                        upperNodes: this.selectedUpperNodeList,
                        rule: this.defaultParam.rule,
                        curEditRule: this.curEditRule,
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

            onClickItemDelete: function() {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                this.defaultParam.rule = _.filter(this.defaultParam.rule, function(obj) {
                    return obj.id !== parseInt(id)
                }.bind(this))

                this.initRuleTable();
            },

            onClickAddRuleButton: function() {
                require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], function(AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                    var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                    var options = myAddEditLayerStrategyModel;
                    var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                        collection: options,
                        localNodes: this.selectedAllNodeList,
                        upperNodes: this.selectedUpperNodeList,
                        rule: this.defaultParam.rule,
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

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return EditTopoView;
    });