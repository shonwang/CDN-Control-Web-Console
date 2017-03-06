define("addEditLayerStrategy.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function (require, exports, template, Modal, Utility) {

    var AddEditLayerStrategyView = Backbone.View.extend({
        events: {},

        initialize: function (options) {
            this.options = options;
            this.collection = options.collection;

            this.rule = options.rule;
            this.curEditRule = options.curEditRule
            this.isEdit = options.isEdit;

            this.topologyId = options.topologyId;
            this.isChannel = options.isChannel;

            if (!this.isEdit) {
                this.defaultParam = {
                    "id": new Date().valueOf(),
                    "local": [],
                    "localType": 2,
                    "upper": []
                }
            } else {
                this.defaultParam = this.curEditRule
            }
            console.log("addEditLayerStrategy.view defaultParam: ", this.defaultParam)
            this.$el = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.html'])());

            require(['deviceManage.model'], function (deviceManageModel) {
                var mydeviceManageModel = new deviceManageModel();
                mydeviceManageModel.operatorTypeList();
                mydeviceManageModel.off("operator.type.success");
                mydeviceManageModel.off("operator.type.error");
                mydeviceManageModel.on("operator.type.success", $.proxy(this.initDropMenu, this));
                mydeviceManageModel.on("operator.type.error", $.proxy(this.onGetError, this));
            }.bind(this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".strategy-type input").on("click", $.proxy(this.onClickLocalTypeRadio, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancelBtn, this));
        },

        initDropMenu: function (data) {
            this.statusArray = [];
            var rootNode = this.$el.find(".operator");
            _.each(data, function (el, key, list) {
                this.statusArray.push({name: el.name, value: el.id})
            }.bind(this))

            Utility.initDropMenu(rootNode, this.statusArray, function (value) {
                this.defaultParam.local = [parseInt(value)];
            }.bind(this));

            var defaultValue = null;

            if (this.defaultParam.localType === 2 && this.defaultParam.local[0]) {
                defaultValue = _.find(this.statusArray, function (object) {
                    return object.value == this.defaultParam.local[0].id;
                }.bind(this));
            }

            if (defaultValue) {
                this.$el.find("#dropdown-operator .cur-value").html(defaultValue.name);
            } else {
                this.$el.find("#dropdown-operator .cur-value").html(this.statusArray[0].name);
                if (this.defaultParam.localType === 2){
                    this.defaultParam.local = []
                    this.defaultParam.local.push({
                        id: parseInt(this.statusArray[0].value),
                        name: this.statusArray[0].name,
                    })
                }
            }

            this.initSetup();
        },

        initSetup: function () {
            this.$el.find('.local .add-node').hide();
            if (this.defaultParam.localType === 1) {
                this.$el.find("#strategyRadio1").get(0).checked = true;
                this.$el.find("#strategyRadio2").get(0).checked = false;
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2) {
                this.$el.find("#strategyRadio2").get(0).checked = true;
                this.$el.find("#strategyRadio1").get(0).checked = false;
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").show();
            }

            if (!this.options.localNodes && !this.options.upperNodes) {
                this.collection.on("get.topoAndNodeInfo.success", $.proxy(this.onGetLocalNode, this));
                this.collection.on("get.topoAndNodeInfo.error", $.proxy(this.onGetError, this));
                this.collection.getTopoAndNodeInfo(this.topologyId);
            } else {
                console.log("addEditLayerStrategy.view this.options.localNodes: ", this.options.localNodes)
                console.log("addEditLayerStrategy.view this.options.upperNodes: ", this.options.upperNodes)
                this.onGetLocalNodeFromArgs();
                this.onGetUpperNodeFromArgs();
            }
        },

        onClickCancelBtn: function () {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onClickSaveBtn: function () {
            if (this.defaultParam.local.length == 0) {
                alert('请选择本层节点');
                return;
            } else if (this.defaultParam.upper.length == 0) {
                alert('请选择上层节点');
                return;
            }

            var errorMsg = [];

            _.each(this.rule, function (rule, index, list) {
                if (this.defaultParam.localType === rule.localType && rule.id !== this.defaultParam.id){
                    _.each(this.defaultParam.local, function(node){
                        var nodesError =  _.find(rule.local, function(obj){
                            return obj.id === node.id
                        }.bind(this))
                        if (nodesError) errorMsg.push(nodesError)
                    }.bind(this))
                }
            }.bind(this))

            if (errorMsg.length > 0){
                alert(errorMsg[0].name + '不能同时存在于两条规则的“本层”中');
                return;
            }

            if (!this.isEdit) this.rule.push(this.defaultParam)

            console.log("addEditLayerStrategy.view this.rule: ", this.rule)

            this.options.onSaveCallback && this.options.onSaveCallback();
        },

        onGetError: function (error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetLocalNodeFromArgs: function(){
            this.$el.find('.local .add-node').show();
            this.localNodeListForSelect = [];

            _.each(this.options.localNodes, function(el){
                el.checked = false
                if (this.defaultParam.localType === 1){
                    _.each(this.defaultParam.local, function(node){
                        if (node.id === el.nodeId) el.checked = true;
                    }.bind(this))
                }
                _.each(this.options.upperNodes, function(node){
                    if (node.nodeId !== el.nodeId) {
                        this.localNodeListForSelect.push({
                            checked: el.checked,
                            name: el.nodeName,
                            operator: el.operator,
                            value: el.nodeId
                        })
                    }
                }.bind(this))
            }.bind(this))

            this.initLocalSelect();
            this.initLocalTable();
        },

        onGetLocalNode: function (res) {
            this.$el.find('.local .add-node').show();
            var nodesArray = [], data = res;

            this.selectedLocalNodeList = [];
            this.nodesArrayFirst = [];
            var data = res;

            if (res && res.rows) data = res.rows;
            if (this.isChannel) {
                data = res.allNodes;
            }
            _.each(data, function (el, index, list) {
                el.checked = false;
                if (typeof(el.chName) == 'undefined') {
                    el.chName = el.name;
                }
                _.each(this.defaultParam.local, function (defaultLocalId, inx, ls) {
                    if (defaultLocalId == el.id) {
                        el.checked = true;
                        this.selectedLocalNodeList.push({
                            nodeId: el.id,
                            nodeName: el.chName,
                            operatorId: el.operatorId,
                            checked: el.checked
                        })
                    }
                }.bind(this))
                if (el.nodeId) el.id = el.nodeId;
                if (el.nodeName) el.chName = el.nodeName;
                nodesArray.push({name: el.chName, value: el.id, checked: el.checked, operatorId: el.operatorId});
                this.nodesArrayFirst.push({
                    name: el.chName,
                    value: el.id,
                    checked: el.checked,
                    operatorId: el.operatorId
                })
            }.bind(this))
            this.initLocalTable();

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.local .add-node-ctn').get(0),
                panelID: this.$el.find('.local .add-node').get(0),
                openSearch: true,
                onOk: function (data) {
                    this.selectedLocalNodeList = [];
                    this.ruleContent.local = [];
                    _.each(data, function (el, key, ls) {
                        el.checked = true;
                        this.selectedLocalNodeList.push({nodeId: el.value, nodeName: el.name, checked: el.checked})
                        this.ruleContent.local.push(parseInt(el.value));
                    }.bind(this))
                    _.each(this.nodesArrayFirst, function (el, key, ls) {
                        el.checked = false;
                        _.each(this.selectedLocalNodeList, function (data, key, ls) {
                            if (el.value == data.nodeId) {
                                el.checked = true;
                                data.operatorId = el.operatorId;
                            }
                        }.bind(this))
                    }.bind(this))
                    this.initLocalTable()
                }.bind(this),
                data: nodesArray,
                callback: function (data) {
                }.bind(this)
            });
            this.addNodeSearchSelect = searchSelect;
            this.onGetUpperNode(res);
        },

        onClickLocalSelectOK: function (data) {
            this.defaultParam.local = [];
            _.each(data, function (el, key, ls) {
                this.defaultParam.local.push({
                    id: parseInt(el.value), 
                    name: el.name, 
                })
            }.bind(this))

            _.each(this.localNodeListForSelect, function (el, key, ls) {
                el.checked = false;
                _.each(this.defaultParam.local, function (data, key, ls) {
                    if (el.value == data.id) {
                        el.checked = true;
                        data.operatorId = el.operator;
                    }
                }.bind(this))
            }.bind(this))
            this.initLocalTable()
        },

        initLocalSelect: function(){
            var options = {
                containerID: this.$el.find('.local .add-node-ctn').get(0),
                panelID: this.$el.find('.local .add-node').get(0),
                openSearch: true,
                onOk: $.proxy(this.onClickLocalSelectOK, this),
                data: this.localNodeListForSelect,
                callback: function (data) {}.bind(this)
            }

            this.searchSelectLocal = new SearchSelect(options);
        },

        initLocalTable: function () {
            var nodeList = [];
            _.each(this.defaultParam.local, function(el){
                nodeList.push({
                    nodeId: el.id,
                    nodeName: el.name
                })
            }.bind(this))

            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: nodeList
            }));
            if (this.defaultParam.local.length !== 0)
                this.$el.find(".local .table-ctn").html(this.localTable[0]);
            else
                this.$el.find(".local .table-ctn").html(_.template(template['tpl/empty-2.html'])({data: {message: "你还没有添加节点"}}));

            this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemLocalDelete, this));
        },

        onClickItemLocalDelete: function (event) {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            this.defaultParam.local = _.filter(this.defaultParam.local, function(obj){
                return obj.id !== parseInt(id)
            }.bind(this));

            _.each(this.localNodeListForSelect, function(el, index, ls){
                if (parseInt(el.value) === parseInt(id)) el.checked = false;
            }.bind(this));

            if (this.searchSelectLocal)
                this.searchSelectLocal.destroy();

            this.initLocalSelect();
            this.initLocalTable();
        },

        onClickLocalTypeRadio: function (event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.localType = parseInt($(eventTarget).val());

            if (this.defaultParam.localType === 1){
                this.searchSelectLocal && this.searchSelectLocal.cancelAll();
                this.defaultParam.local = [];
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2){
                this.searchSelectLocal && this.searchSelectLocal.cancelAll();
                this.defaultParam.local = [{
                    id: this.statusArray[0].value,
                    name: this.statusArray[0].name
                }];
                this.$el.find("#dropdown-operator .cur-value").html(this.statusArray[0].name);
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").show();
            }
            this.initLocalSelect();
            this.initLocalTable();
        },

        onGetUpperNodeFromArgs: function(){
            this.$el.find('.upper .add-node').show();
            this.upperNodeListForSelect = [];

            _.each(this.options.localNodes, function(el){
                el.checked = false
                _.each(this.defaultParam.upper, function(node){
                    if (node.rsNodeMsgVo.id === el.nodeId) {
                        el.checked = true;
                        el.chiefType = node.chiefType;
                        el.ipCorporation = node.ipCorporation;
                    }
                }.bind(this))
                this.upperNodeListForSelect.push({
                    checked: el.checked,
                    name: el.nodeName,
                    operator: el.operator,
                    value: el.nodeId,
                    chiefType: el.chiefType,
                    ipCorporation: el.ipCorporation
                })
            }.bind(this))

            this.initUpperSelect();
            this.initUpperTable();
        },

        onGetUpperNode: function (res) {
            this.$el.find('.upper .add-node').show();
            var nodesArray = [];
            this.selectedUpperNodeList = [];
            this.nodesArrayFirstLocal = [];
            var data = res;
            if (res && res.rows) data = res.rows
            if (this.isChannel) {
                // debugger
                data = res.allNodes;
            }
            _.each(data, function (el, index, list) {
                el.checked = false;
                if (typeof(el.chName) == 'undefined') {
                    el.chName = el.name;
                }
                _.each(this.defaultParam.upper, function (defaultNode, inx, ls) {
                    if (defaultNode.nodeId == el.id) {
                        el.checked = true;
                        //TODO
                        //在selectedUpperNodeList里面的对象里面添加chiefType 取值于 el.chiefType
                        this.selectedUpperNodeList.push({
                            nodeId: el.id,
                            nodeName: el.chName,
                            ipCorporation: defaultNode.ipCorporation,
                            operatorId: el.operatorId,
                            chiefType: el.chiefType
                        });
                    }
                }.bind(this))
                nodesArray.push({name: el.chName, value: el.id, checked: el.checked, operatorId: el.operatorId});
                this.nodesArrayFirstLocal.push({
                    name: el.chName,
                    value: el.id,
                    checked: el.checked,
                    operatorId: el.operatorId
                });
            }.bind(this))
            this.initUpperTable()

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.upper .add-node-ctn').get(0),
                panelID: this.$el.find('.upper .add-node').get(0),
                openSearch: true,
                onOk: function (data) {
                    var NowselectedUpperNodeList = [];
                    _.each(this.selectedUpperNodeList, function (el, index, list) {
                        NowselectedUpperNodeList.push(el);
                    }.bind(this));

                    var NowruleContentUpper = [];
                    _.each(this.ruleContent.upper, function (el, index, list) {
                        NowruleContentUpper.push(el);
                    }.bind(this));

                    this.selectedUpperNodeList = [];
                    this.ruleContent.upper = [];

                    _.each(data, function (el, key, ls) {
                        this.selectedUpperNodeList.push({
                            nodeId: el.value,
                            nodeName: el.name,
                            ipCorporation: 0,
                            operatorId: ''
                        });
                        this.ruleContent.upper.push({"nodeId": el.value, "ipCorporation": 0});
                    }.bind(this))

                    _.each(this.selectedUpperNodeList, function (el, index, list) {
                        el.ipCorporation = 0;
                        _.each(NowselectedUpperNodeList, function (upperNode, index, list) {
                            if (el.nodeId == upperNode.nodeId) {
                                el.ipCorporation = upperNode.ipCorporation;
                            }
                        })
                    }.bind(this))

                    _.each(this.ruleContent.upper, function (el, index, list) {
                        el.ipCorporation = 0;
                        _.each(NowruleContentUpper, function (upper, index, list) {
                            if (el.nodeId == upper.nodeId) {
                                el.ipCorporation = upper.ipCorporation;
                            }
                        })
                    }.bind(this))

                    _.each(this.nodesArrayFirstLocal, function (el, key, ls) {
                        el.checked = false;
                        _.each(this.selectedUpperNodeList, function (data, key, ls) {
                            if (el.value == data.nodeId) {
                                el.checked = true;
                                data.operatorId = el.operatorId;
                            }
                        }.bind(this))
                    }.bind(this))
                    this.initUpperTable()
                }.bind(this),
                data: nodesArray,
                callback: function (data) {
                }.bind(this)
            });
        },

        initUpperSelect: function (res) {
            var options = {
                containerID: this.$el.find('.upper .add-node-ctn').get(0),
                panelID: this.$el.find('.upper .add-node').get(0),
                openSearch: true,
                onOk: $.proxy(this.onClickUpperSelectOK, this),
                data: this.upperNodeListForSelect,
                callback: function (data) {}.bind(this)
            }

            var searchSelectUpper = new SearchSelect(options);
            this.$el.find(".upper .add-node-ctn .select-container").css("left", "-80px");
        },

        onClickUpperSelectOK: function (data) {
            this.defaultParam.upper = [];
            _.each(data, function (el, key, ls) {
                this.defaultParam.upper.push({
                    rsNodeMsgVo: {
                        id: parseInt(el.value), 
                        name: el.name
                    } 
                })
            }.bind(this))

            console.log("addEditLayerStrategy.view upperNodeListForSelect: ", this.upperNodeListForSelect)

            _.each(this.upperNodeListForSelect, function (el, key, ls) {
                el.checked = false;
                _.each(this.defaultParam.upper, function (data, key, ls) {
                    if (el.value == data.rsNodeMsgVo.id) {
                        el.checked = true;
                        data.chiefType = el.chiefType;
                        data.ipCorporation = el.ipCorporation;
                        data.rsNodeMsgVo.operatorId = el.operator;
                    }
                }.bind(this))
            }.bind(this))

            console.log("addEditLayerStrategy.view this.defaultParam.upper: ", this.defaultParam.upper)

            this.initUpperTable();
        },

        initUpperTable: function () {
            var nodeList = [];
            _.each(this.defaultParam.upper, function(el){
                nodeList.push({
                    nodeId: el.rsNodeMsgVo.id,
                    nodeName: el.rsNodeMsgVo.name,
                    operatorId: el.rsNodeMsgVo.operatorId,
                    chiefType: el.chiefType,
                    ipCorporation: el.ipCorporation 
                })
            }.bind(this))

            this.upperTable = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.upper.table.html'])({
                data: nodeList,
            }));

            if (nodeList.length !== 0)
                this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
            else
                this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty-2.html'])({data: {message: "你还没有添加节点"}}));

            this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));
            this.upperTable.find("tbody .spareradio").on("click", $.proxy(this.onClickRadioButton, this));

            require(['deviceManage.model'], function (deviceManageModel) {
                var mydeviceManageModel = new deviceManageModel();
                mydeviceManageModel.operatorTypeList();
                mydeviceManageModel.off("operator.type.success");
                mydeviceManageModel.off("operator.type.error");
                mydeviceManageModel.on("operator.type.success", $.proxy(this.initOperatorUpperList, this));
                mydeviceManageModel.on("operator.type.error", $.proxy(this.onGetError, this));
            }.bind(this));
        },

        initOperatorUpperList: function (data) {
            var statusArray = [];
            _.each(data, function (el, key, list) {
                statusArray.push({name: el.name, value: el.id})
            }.bind(this))
            rootNodes = this.upperTable.find(".ipOperator .dropdown");

            for (var i = 0; i < rootNodes.length; i++) {
                this.initTableDropMenu($(rootNodes[i]), statusArray, function (value, nodeId) {
                    _.each(this.upperNodeListForSelect, function (el, key, list) {
                        if (parseInt(el.value) === parseInt(nodeId)) {
                            el.ipCorporation = parseInt(value);
                        }
                    }.bind(this));
                    _.each(this.defaultParam.upper, function (el, key, list) {
                        if (el.rsNodeMsgVo.id == parseInt(nodeId)) {
                            el.ipCorporation = parseInt(value);
                        }
                    }.bind(this));
                }.bind(this));

                _.each(this.defaultParam.upper, function(node){
                    var curNodeId = parseInt(rootNodes[i].id);
                    if (node.rsNodeMsgVo.id === curNodeId) {
                        var defaultValue = _.find(statusArray, function(obj){
                            return obj.value === node.ipCorporation
                        }.bind(this))

                        if (defaultValue){
                            $(rootNodes[i]).find("#dropdown-ip-operator .cur-value").html(defaultValue.name)
                        } else {
                            $(rootNodes[i]).find("#dropdown-ip-operator .cur-value").html(statusArray[0].name);
                            node.ipCorporation = statusArray[0].value;
                        }
                    }
                }.bind(this))
            }
        },

        initTableDropMenu: function (rootNode, typeArray, callback) {
            var dropRoot = rootNode.find(".dropdown-menu"),
                rootId = rootNode.attr("id"),
                showNode = rootNode.find(".cur-value");
            dropRoot.html("");
            _.each(typeArray, function (element, index, list) {
                var itemTpl = '<li value="' + element.value + '">' +
                        '<a href="javascript:void(0);" value="' + element.value + '">' + element.name + '</a>' +
                        '</li>',
                    itemNode = $(itemTpl);
                itemNode.on("click", function (event) {
                    var eventTarget = event.srcElement || event.target;
                    showNode.html($(eventTarget).html()),
                        value = $(eventTarget).attr("value");
                    callback && callback(value, rootId);
                });
                itemNode.appendTo(dropRoot);
            });
        },

        onClickItemUpperDelete: function (event) {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            this.defaultParam.upper = _.filter(this.defaultParam.upper, function(obj){
                return obj.rsNodeMsgVo.id !== parseInt(id)
            }.bind(this));

            _.each(this.upperNodeListForSelect, function(el, index, ls){
                if (parseInt(el.value) === parseInt(id)) el.checked = false;
            }.bind(this));

            if (this.searchSelectUpper)
                this.searchSelectUpper.destroy();

            this.initUpperSelect();
            this.initUpperTable();
        },

        onClickRadioButton: function (event) {
            var eventTarget = event.srcElement || event.target, id;
            var id = eventTarget.id;
            _.each(this.defaultParam.upper, function(obj){
                obj.chiefType = 1;
                if (obj.rsNodeMsgVo.id === parseInt(id)) obj.chiefType = 0;
            }.bind(this))
        },

        render: function (target) {
            this.$el.appendTo(target)
        }
    });
    return AddEditLayerStrategyView;
});