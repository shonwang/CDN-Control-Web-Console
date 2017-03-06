define("setupTopoManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function (require, exports, template, Modal, Utility) {


    var EditTopoView = Backbone.View.extend({
        events: {},

        initialize: function (options) {
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;
            this.isEdit = options.isEdit;

            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.edit.html'])({data: {}}));

            this.collection.off('get.topo.OriginInfo.success');
            this.collection.off('get.topo.OriginInfo.error');
            this.collection.on('get.topo.OriginInfo.success', $.proxy(this.onOriginInfo, this));
            this.collection.on('get.topo.OriginInfo.error', $.proxy(this.onGetError, this));

            this.collection.off("get.operator.success");
            this.collection.off("get.operator.error");
            this.collection.on("get.operator.success", $.proxy(this.setOperatorInfo, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));
            this.collection.getOperatorList();
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

        addTopoSuccess: function () {
            alert('保存成功');
            this.options.onSaveCallback && this.options.onSaveCallback();
        },

        addTopoError: function (error) {
            if (error && error.message)
                alert(error.message);
            else
                alert("网络阻塞，请刷新重试！");
        },

        modifyTopoSuccess: function () {
            this.options.onSaveCallback && this.options.onSaveCallback();
            alert('修改成功');
        },

        modifyTopoError: function (error) {
            if (error && error.message)
                alert(error.message);
            else
                alert("网络阻塞，请刷新重试！");
        },

        onOriginInfo: function (res) {
            var allNodes = [], upperNodes = [];

            _.each(res.allNodes, function (el) {
                allNodes.push(el.id);
            }.bind(this));
            _.each(res.upperNodes, function (el) {
                upperNodes.push(el.id);
            });

            this.defaultParam = {
                "id": res.id,
                "name": res.name,
                "allNodes": allNodes,
                "upperNodes": upperNodes,
                "rule": res.rule,
                "type": res.type
            }

            this.NodeleteNodes = [];

            _.each(this.defaultParam.allNodes, function (el) {
                this.NodeleteNodes.push(el)
            }.bind(this));

            this.$el.find("#input-name").val(res.name);
            this.$el.find("#input-name").attr("readonly", "true");

            console.log(this.defaultParam)
            this.initSetup();
        },

        initSetup: function () {
            this.$el.find('.all .add-node').hide();
            this.$el.find('.upper .add-node').hide();
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            if (!this.isEdit) {
                if (AUTH_OBJ.ApplyCreateTopos)
                    this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                this.$el.find(".add-rule").on("click", $.proxy(this.onClickAddRuleButton, this));
                this.$el.find(".alert-danger").show();
            } else {
                if (AUTH_OBJ.ApplyEditTopos)
                    this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                this.$el.find(".add-rule").hide();
                this.$el.find(".alert-danger").hide();
            }
            this.collection.off("get.node.success");
            this.collection.off("get.node.error");
            this.collection.on("get.node.success", $.proxy(this.onGetAllNode, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));

            this.collection.off("get.devicetype.success");
            this.collection.off("get.devicetype.error");
            this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
            this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));

            this.collection.getNodeList(); //获取所有节点列表接口
            this.collection.getDeviceTypeList();//获取应用类型列表接口

            this.initRuleTable();
        },

        onClickSaveButton: function () {
            var flag = true;
            this.defaultParam = this.addChiefType(this.defaultParam);
            this.defaultParam.name = $.trim(this.$el.find("#input-name").val());
            if (this.defaultParam.name == '') {
                alert('请输入拓扑关系名称');
                return;
            }
            else if (this.defaultParam.type == null) {
                alert('请选择设备类型');
                return;
            }
            else if (this.defaultParam.allNodes.length == 0) {
                alert('请选择加入拓扑关系的节点');
                return;
            }
            else if (this.defaultParam.upperNodes.length == 0) {
                alert('请选择拓扑关系的上层节点');
                return;
            }
            else if (this.defaultParam.rule.length == 0) {
                alert('请添加规则');
                return;
            }
            _.each(this.defaultParam.rule, function (el) {
                if (el.local.length == 0) {
                    alert('请在配置规则中选择本层节点');
                    flag = false;
                    return;
                } else if (el.upper.length == 0) {
                    alert('请在配置规则中选择上层节点');
                    flag = false;
                    return;
                }
            })

            if (!flag) return;
            if (this.isEdit)
                this.collection.topoModify(this.defaultParam);
            else
                this.collection.topoAdd(this.defaultParam);
            this.options.onSaveCallback && this.options.onSaveCallback();
        },

        onClickCancelButton: function () {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        initDeviceDropMenu: function (res) {
            this.deviceTypeArray = [];
            var typeArray = [],
                rootNode = this.$el.find(".dropdown-type");

            _.each(res, function (el, index, ls) {
                typeArray.push({name: el.name, value: el.id});
                this.deviceTypeArray.push({name: el.name, value: el.id});
            }.bind(this));
            if (!this.isEdit) {
                this.defaultParam.type = typeArray[0].value;
                var rootNode = this.$el.find(".dropdown-app");
                Utility.initDropMenu(rootNode, typeArray, function (value) {
                    this.defaultParam.type = parseInt(value)
                }.bind(this));
                this.$el.find("#dropdown-app .cur-value").html(typeArray[0].name);
            } else {
                var upperObj = _.find(typeArray, function (object) {
                    return object.value == this.defaultParam.type;
                }.bind(this))
                this.$el.find('#dropdown-app .cur-value').html(upperObj.name);
                this.$el.find("#dropdown-app").attr("disabled", "disabled")
            }
        },

        onGetAllNode: function (res) {
            this.$el.find('.all .add-node').show();
            this.allNodes = res;
            //过滤掉关闭和挂起的节点
            var resFlag = [];
            _.each(res, function (el, index, list) {
                if (el.status != 3 && el.status != 2) resFlag.push(el)
            })

            this.selectedAllNodeList = [];
            this.nodesArrayFirst = [];

            _.each(resFlag, function (el, index, list) {
                el.checked = false;
                _.each(this.defaultParam.allNodes, function (defaultLocalId, inx, ls) {
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

            this.initAllNodesSelect();
            this.initAllNodesTable();
        },

        initAllNodesSelect: function () {
            var options = {
                    containerID: this.$el.find('.all .add-node-ctn').get(0),
                    panelID: this.$el.find('.all .add-node').get(0),
                    openSearch: true,
                    onOk: $.proxy(this.onClickAllNodesSelectOK, this),
                    data: this.nodesArrayFirst,
                    callback: function (data) {}.bind(this)
                }

            if (this.isEdit){
                options.isDisabled = true;
                options.disabledNode = _.filter(this.nodesArrayFirst, function(obj){
                    return obj.checked === true;
                });
            }
            this.searchSelectAllNodes = new SearchSelect(options);
        },

        onClickAllNodesSelectOK: function(data){
            this.selectedAllNodeList = [];
            _.each(data, function (el, key, ls) {
                this.selectedAllNodeList.push({
                    nodeId: parseInt(el.value), 
                    nodeName: el.name, 
                    checked: true
                });
            }.bind(this))

            this.defaultParam.allNodes = [];
            _.each(this.selectedAllNodeList, function (el, key, ls) {
                this.defaultParam.allNodes.push(parseInt(el.nodeId));
            }.bind(this))

            _.each(this.nodesArrayFirst, function (el, key, ls) {
                el.checked = false;
                _.each(this.selectedAllNodeList, function (data, key, ls) {
                    if (el.value == data.nodeId) {
                        el.checked = true;
                        data.operator = el.operator;
                    }
                }.bind(this))
            }.bind(this))

            this.initAllNodesTable();
        },

        initAllNodesTable: function () {
            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedAllNodeList
            }));

            if (this.selectedAllNodeList.length !== 0)
                this.$el.find(".all .table-ctn").html(this.localTable[0]);
            else
                this.$el.find(".all .table-ctn").html(_.template(template['tpl/empty.html'])());

            if (!this.isEdit)
                this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemAllDelete, this));
            else
                this.localTable.find("tbody .delete").remove();

            this.onGetUpperNode();
        },

        onClickItemAllDelete: function (event) {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            _.each(this.nodesArrayFirst, function(el, index, ls){
                if (parseInt(el.value) === parseInt(id)) el.checked = false;
            }.bind(this))
            this.selectedAllNodeList = _.filter(this.selectedAllNodeList, function(obj){
                return parseInt(obj.nodeId) !== parseInt(id)
            }.bind(this))

            this.defaultParam.allNodes = [];
            _.each(this.selectedAllNodeList, function (el, key, ls) {
                this.defaultParam.allNodes.push(parseInt(el.nodeId));
            }.bind(this))

            if (this.searchSelectAllNodes)
                this.searchSelectAllNodes.destroy();
            this.initAllNodesSelect();
            this.initAllNodesTable();
        },

        onGetUpperNode: function (res) {
            if (!this.isEdit) this.$el.find('.upper .add-node').show();

            this.selectedUpperNodeList = [];
            this.nodesArrayFirstUpper = [];

            _.each(this.selectedAllNodeList, function (el, index, list) {
                el.checked = false;
                _.each(this.defaultParam.upperNodes, function (upperId, inx, ls) {
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

        initUpperSelect: function () {
            if (this.searchSelectUpper)
                this.searchSelectUpper.destroy();
            var options = {
                containerID: this.$el.find('.upper .add-node-ctn').get(0),
                panelID: this.$el.find('.upper .add-node').get(0),
                openSearch: true,
                // selectWidth: 200,
                onOk: $.proxy(this.onClickUpperNodesSelectOK, this),
                data: this.nodesArrayFirstUpper,
                callback: function (data) {}.bind(this)
            }

            this.searchSelectUpper = new SearchSelect(options);
            this.$el.find(".upper .add-node-ctn .select-container").css("left", "-170px");
        },

        onClickUpperNodesSelectOK: function (data) {
            this.selectedUpperNodeList = [];
            _.each(data, function (el, key, ls) {
                this.selectedUpperNodeList.push({
                    nodeId: parseInt(el.value),
                    nodeName: el.name,
                    operatorId: ''
                })
            }.bind(this))

            this.defaultParam.upperNodes = [];
            _.each(this.selectedUpperNodeList, function (el) {
                this.defaultParam.upperNodes.push(parseInt(el.nodeId));
            }.bind(this))

            _.each(this.nodesArrayFirstUpper, function (el, key, ls) {
                el.checked = false;
                _.each(this.selectedUpperNodeList, function (data, key, ls) {
                    if (el.value == data.nodeId) {
                        el.checked = true;
                        data.operator = el.operator;
                    }
                }.bind(this))
            }.bind(this))

            this.initUpperTable()
        },

        initUpperTable: function () {
            this.upperTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedUpperNodeList
            }));
            if (this.selectedUpperNodeList.length !== 0)
                this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
            else
                this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty.html'])());

            if (!this.isEdit)
                this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));
            else
                this.upperTable.find("tbody .delete").hide();
        },

        onClickItemUpperDelete: function (event) {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            
            _.each(this.nodesArrayFirstUpper, function(el, index, ls){
                if (parseInt(el.value) === parseInt(id)) el.checked = false;
            }.bind(this))
            this.selectedUpperNodeList = _.filter(this.selectedUpperNodeList, function(obj){
                return parseInt(obj.nodeId) !== parseInt(id)
            }.bind(this))

            this.defaultParam.upperNodes = [];
            _.each(this.selectedUpperNodeList, function (el, key, ls) {
                this.defaultParam.upperNodes.push(parseInt(el.nodeId));
            }.bind(this))

            if (this.searchSelectUpper)
                this.searchSelectUpper.destroy();
            this.initUpperSelect();
            this.initUpperTable();
        },

        initRuleTable: function (data) {
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            this.ruleList = [];

            _.each(this.defaultParam.rule, function(rule, index, ls){
                var localLayerArray = [], upperLayer = [],
                    primaryArray = [], backupArray = [],
                    primaryNameArray = [], backupNameArray = [];
                _.each(rule.local, function(local, inx, list){
                    localLayerArray.push(local.name)
                }.bind(this));

                primaryArray = _.filter(rule.upper, function(obj){
                    return obj.chiefType !== 0;
                }.bind(this))
                backupArray = _.filter(rule.upper, function(obj){
                    return obj.chiefType === 0;
                }.bind(this))

                _.each(primaryArray, function(upper, inx, list){
                    if (upper.rsNodeMsgVo)
                        primaryNameArray.push(upper.rsNodeMsgVo.name)
                    else
                        primaryNameArray.push("[后端没有返回名称]")
                }.bind(this));
                _.each(backupArray, function(upper, inx, list){
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
                this.$el.find(".rule .table-ctn").html(_.template(template['tpl/empty.html'])());

            // if (!this.isEdit) {
                this.roleTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.roleTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            // } else {
            //     this.roleTable.find("tbody .edit").hide();
            //     this.roleTable.find("tbody .delete").hide();
            // }
        },

        onClickItemEdit: function (event) {
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            this.curEditRule = _.find(this.defaultParam.rule, function(obj){
                return obj.id === parseInt(id)
            }.bind(this))

            if (!this.curEditRule){
                alert("找不到此行的数据，无法编辑");
                return;
            }
            
            require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], function (AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                    collection: this.collection,
                    localNodes: this.selectedAllNodeList,
                    upperNodes: this.selectedUpperNodeList,
                    rule: this.defaultParam.rule,
                    curEditRule: this.curEditRule,
                    isEdit: true,
                    onSaveCallback: function () {
                        this.defaultParam.rule = this.rule;
                        var data = this.InformationProcessing(this.rule);
                        myAddEditLayerStrategyView.$el.remove();

                        this.$el.find(".add-topo").show();
                        this.checked = myAddEditLayerStrategyView.checked;
                        this.chiefType = myAddEditLayerStrategyView.chiefType;

                        this.initRuleTable(data, this.checked);
                    }.bind(this),
                    onCancelCallback: function () {
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                    }.bind(this)
                })

                this.$el.find(".add-topo").hide();
                myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
            }.bind(this))
        },

        onClickItemDelete: function () {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "A") {
                eventTarget = $(eventTarget).parent().parent();
                id = eventTarget.attr("data-id");
            } else {
                id = $(eventTarget).attr("data-id");
            }
            this.rule.splice(id, 1);
            this.initRuleTable(data);

        },

        onClickAddRuleButton: function () {
            require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], function (AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                var options = myAddEditLayerStrategyModel;
                var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                    collection: options,
                    localNodes: this.selectedAllNodeList,
                    upperNodes: this.selectedUpperNodeList,
                    rule: this.rule,
                    onSaveCallback: function () {
                        this.defaultParam.rule = this.rule;
                        var data = this.InformationProcessing(this.rule);
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                        this.checked = myAddEditLayerStrategyView.checked;
                        this.chiefType = myAddEditLayerStrategyView.chiefType;
                        this.initRuleTable(data, this.checked);

                    }.bind(this),
                    onCancelCallback: function () {
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                    }.bind(this)
                })

                this.$el.find(".add-topo").hide();
                myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
            }.bind(this))
        },

        setOperatorInfo: function (res) {
            this.operator = [];
            _.each(res.rows, function (el, index, list) {
                this.operator.push({
                    'name': el.name,
                    'value': el.id
                })
            }.bind(this));
        },

        InformationProcessing: function (data) {
            //TODO STEP5
            //看那个对象里面有chiefType属性 对象改成 从upperLayer -> mainLayer spareLayer
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            var hasChiefType = [];
            for (var i = 0; i < data.length; i++) {
                hasChiefType.push(false);
                _.each(data[i].upper, function (item) {
                    if (item.chiefType === 0) {
                        hasChiefType[i] = true;
                    }
                });
            }
            var constVar = '';
            if (this.isEdit) {
                constVar = 'id';
            } else {
                constVar = '';
            }

            var data_save = [];
            var self = this;
            _.each(data, function (el, key, ls) {
                var data_save_content = {
                    id: null,
                    'localLayer': [],
                    'upperLayer': [],
                    'mainUpperLayer': [],
                    'spareUpperLayer': []
                };
                
                if (el.localType == 2) {
                    _.each(el.local, function (local) {
                        _.each(self.operator, function (operator) {
                            if (local == operator.value || local.id == operator.value) {
                                data_save_content.localLayer.push(operator.name)
                            }
                        })
                    }.bind(this))
                } else if (el.localType == 1) {
                    _.each(el.local, function (local) {
                        _.each(self.allNodes, function (nodes) {
                            if ((local.id == nodes.id || local == nodes.id) && nodes.id != undefined) {
                                data_save_content.localLayer.push(nodes.chName);
                            }
                        })
                    })
                }
                _.each(el.upper, function (upper) {
                    _.each(self.allNodes, function (nodes) {
                        if (self.isEdit) {
                            if (upper.rsNodeMsgVo.id == nodes.id) {
                                if (!hasChiefType[key]) {
                                    data_save_content.upperLayer.push(nodes.chName)
                                } else {
                                    if (upper.chiefType === 0) {
                                        data_save_content.spareUpperLayer.push(nodes.chName);
                                    } else {
                                        data_save_content.mainUpperLayer.push(nodes.chName);
                                    }
                                }
                            }
                        } else {
                            if (upper.nodeId == nodes.id) {
                                if (!hasChiefType[key]) {
                                    data_save_content.upperLayer.push(nodes.chName)
                                } else {
                                    if (upper.chiefType === 0) {
                                        data_save_content.spareUpperLayer.push(nodes.chName);
                                    } else {
                                        data_save_content.mainUpperLayer.push(nodes.chName);
                                    }
                                }
                            }
                        }

                    })

                });


                data_save_content.localLayer = data_save_content.localLayer.join('、');
                data_save_content.upperLayer = data_save_content.upperLayer.join('、');
                data_save_content.spareUpperLayer = data_save_content.spareUpperLayer.join('、');
                data_save_content.mainUpperLayer = data_save_content.mainUpperLayer.join('、');

                data_save_content.id = key;
                data_save.push(data_save_content);
                //TODO
                //在这里给data_save_content对象赋值 上面的 主X 副X  条件是 如果chiefType值为0
            });
            return data_save
            
        },
        onGetError: function (error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function (target) {
            this.$el.appendTo(target);
        }
    });

    var SetupTopoManageView = Backbone.View.extend({
        events: {},

        initialize: function (options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.html'])());
            //获取所有的拓扑关系信息
            this.collection.off("get.topoInfo.success");
            this.collection.off("get.topoInfo.error");
            this.collection.on("get.topoInfo.success", $.proxy(this.onGetTopoSuccess, this));
            this.collection.on("get.topoInfo.error", $.proxy(this.onGetError, this));
            //获取应用类型
            this.collection.off("get.devicetype.success");
            this.collection.off("get.devicetype.error");
            this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
            this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));

            //this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            //this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));

            if (AUTH_OBJ.QueryTopos) {
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                this.off('enterKeyBindQuery');
                this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                this.enterKeyBindQuery();
            }
            else {
                this.$el.find(".opt-ctn .query").remove();
            }
            if (AUTH_OBJ.CreateTopos) {
                this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));
            }
            else {

                this.$el.find(".opt-ctn .new").remove();
            }


            this.queryArgs = {
                "name": null,
                "type": null,
                "page": 1,
                "size": 10
            }
            this.onClickQueryButton();
            this.collection.getDeviceTypeList();


        },
        enterKeyBindQuery: function () {
            $(document).on('keydown', function (e) {
                if (e.keyCode == 13) {
                    this.trigger('enterKeyBindQuery');
                }
            }.bind(this));
        },

        onGetError: function (error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetTopoSuccess: function () {
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function () {
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.name = this.$el.find("#input-topo-name").val();
            if (this.queryArgs.name == "") this.queryArgs.name = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            //this.collection.queryChannel(this.queryArgs);
            this.collection.getTopoinfo(this.queryArgs);
        },

        initTable: function () {
            this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.table.html'])({
                data: this.collection.models,
                permission: AUTH_OBJ
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            if (AUTH_OBJ.EditTopos) {
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            } else {
                this.table.find("tbody .edit").remove();
            }
            this.table.find("tbody .send").on("click", $.proxy(this.onClickItemSend, this));
        },
        onClickAddRuleTopoBtn: function () {
            this.off('enterKeyBindQuery');
            var myEditTopoView = new EditTopoView({
                collection: this.collection,
                WhetherSaveSuccess: this.WhetherSaveSuccess,
                onSaveCallback: function () {
                    
                    this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                    this.onClickQueryButton();
                }.bind(this),
                onCancelCallback: function () {
                    this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myEditTopoView.render(this.$el.find(".edit-panel"))
        },

        onClickItemEdit: function (event) {
            
            this.off('enterKeyBindQuery');
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var myEditTopoView = new EditTopoView({
                collection: this.collection,
                model: model,
                isEdit: true,
                onSaveCallback: function () {
                    
                    this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                    this.onClickQueryButton();
                }.bind(this),
                onCancelCallback: function () {
                    this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myEditTopoView.render(this.$el.find(".edit-panel"))
        },
        onClickItemSend: function () {
            this.off('enterKeyBindQuery');
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            require(['setupTopoManageSendStrategy.model'], function (setupTopoManageSendStrategyModel) {
                var mySendStrategeModel = new setupTopoManageSendStrategyModel();
                var options = mySendStrategeModel;
                var mySendView = new SendView({
                    collection: options,
                    model: model,
                    onSaveCallback: function () {
                        
                        this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                        mySendView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this),
                    onCancelCallback: function () {
                        this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                        mySendView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                mySendView.render(this.$el.find(".edit-panel"))
            }.bind(this));


        },
        initPaginator: function () {
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.size) return;
            var total = Math.ceil(this.collection.total / this.queryArgs.size);
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.size;
                        this.collection.getTopoinfo(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initDeviceDropMenu: function (res) {
            this.deviceTypeArray = [];
            var typeArray = [
                    {
                        name: '全部',
                        value: 'all'
                    }
                ],
                rootNode = this.$el.find(".dropdown-type");

            _.each(res, function (el, index, ls) {
                typeArray.push({name: el.name, value: el.id});
                this.deviceTypeArray.push({name: el.name, value: el.id});
            }.bind(this));
            if (!this.isEdit) {
                var rootNode = this.$el.find(".dropdown-app");
                Utility.initDropMenu(rootNode, typeArray, function (value) {
                    if (value !== "All")
                        this.queryArgs.type = parseInt(value)
                    else
                        this.queryArgs.type = null
                }.bind(this));
            } else {
                this.$el.find("#dropdown-app").attr("disabled", "disabled")
            }

            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function (value) {
                this.queryArgs.size = parseInt(value);
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));
        },

        hide: function () {
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function () {
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function (target) {
            this.$el.appendTo(target)
        }
    });

    return SetupTopoManageView;
});