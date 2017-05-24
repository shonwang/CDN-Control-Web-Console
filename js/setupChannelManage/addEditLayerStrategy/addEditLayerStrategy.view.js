define("addEditLayerStrategy.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditLayerStrategyView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;

            this.rule = options.rule;
            this.curEditRule = options.curEditRule
            this.isEdit = options.isEdit;
            this.notFilter = options.notFilter;

            this.topologyId = options.topologyId;

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
            console.log("规则初始化默认值: ", this.defaultParam)
            this.$el = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            require(['nodeManage.model'], function(NodeManageModel) {
                var myNodeManageModel = new NodeManageModel();
                myNodeManageModel.on("get.operator.success", $.proxy(this.initDropMenu, this));
                myNodeManageModel.on("get.operator.error", $.proxy(this.onGetError, this));
                myNodeManageModel.getOperatorList();
                myNodeManageModel.on("get.node.success", $.proxy(this.initSetup, this));
                myNodeManageModel.on("get.node.error", $.proxy(this.onGetError, this));
                myNodeManageModel.getNodeList({
                    "page": 1,
                    "count": 99999,
                    "chname": null, //节点名称
                    "operator": null, //运营商id
                    "status": null //节点状态
                });
            }.bind(this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".strategy-type input").on("click", $.proxy(this.onClickLocalTypeRadio, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancelBtn, this));
            this.$el.find('.upper .add-node').hide()
            this.$el.find('.local .add-node').hide();
            this.$el.find("#strategyRadio1").attr("disabled", "disabled");
            this.$el.find("#strategyRadio2").attr("disabled", "disabled");
        },

        initDropMenu: function(data) {
            this.statusArray = [];
            var rootNode = this.$el.find(".operator");

            _.each(data.rows, function(el, key, list) {
                this.statusArray.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))

            Utility.initDropMenu(rootNode, this.statusArray, function(value) {
                var opObj = _.find(this.statusArray, function(object) {
                    return object.value == parseInt(value);
                }.bind(this));
                this.defaultParam.local = [{
                    id: parseInt(value),
                    name: opObj.name,
                }];
            }.bind(this));

            var defaultValue = null;

            if (this.defaultParam.localType === 2 && this.defaultParam.local[0]) {
                defaultValue = _.find(this.statusArray, function(object) {
                    return object.value == this.defaultParam.local[0].id;
                }.bind(this));
            }

            if (defaultValue) {
                this.$el.find("#dropdown-operator .cur-value").html(defaultValue.name);
            } else {
                this.$el.find("#dropdown-operator .cur-value").html(this.statusArray[0].name);
                if (this.defaultParam.localType === 2) {
                    this.defaultParam.local = []
                    this.defaultParam.local.push({
                        id: parseInt(this.statusArray[0].value),
                        name: this.statusArray[0].name,
                    })
                }
            }
        },

        initSetup: function(data) {
            this.allNodesArray = [];
            _.each(data, function(el, index, list) {
                if (el.status !== 3 && el.status !== 2) {
                    this.allNodesArray.push(el);
                }
            }.bind(this))

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

            this.$el.find("#strategyRadio2").removeAttr("disabled", "disabled")
            this.$el.find("#strategyRadio1").removeAttr("disabled", "disabled")

            if (!this.options.localNodes && !this.options.upperNodes && !this.notFilter) {
                this.collection.on("get.topo.OriginInfo.success", $.proxy(this.onGetLocalNodeByTopo, this));
                this.collection.on("get.topo.OriginInfo.error", $.proxy(this.onGetError, this));
                this.collection.getTopoOrigininfo(this.topologyId);
                console.log("拓扑ID: ", this.topologyId)
            } else if (!this.options.localNodes && !this.options.upperNodes && this.notFilter) {
                this.options.localNodes = this.allNodesArray;
                this.options.upperNodes = this.allNodesArray;
                this.onGetLocalNodeFromArgs();
                this.onGetUpperNodeFromArgs();
            } else {
                if (this.options.localNodes.length <= this.options.upperNodes.length) {
                    this.$el.find("#strategyRadio1").attr("disabled", "disabled")
                }
                this.onGetLocalNodeFromArgs();
                this.onGetUpperNodeFromArgs();
            }
        },

        onClickCancelBtn: function() {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onClickSaveBtn: function() {
            if (this.defaultParam.local.length == 0) {
                alert('请选择本层节点');
                return;
            } else if (this.defaultParam.upper.length == 0) {
                alert('请选择上层节点');
                return;
            }

            var chiefTypeArray = [];
            chiefTypeArray = _.filter(this.defaultParam.upper, function(obj) {
                return obj.chiefType === 0
            }.bind(this))
            if (chiefTypeArray.length === this.defaultParam.upper.length) {
                alert("不能都设置为备用")
                return;
            }

            var errorMsg = [];
            _.each(this.rule, function(rule, index, list) {
                if (this.defaultParam.localType === rule.localType && rule.id !== this.defaultParam.id) {
                    _.each(this.defaultParam.local, function(node) {
                        var nodesError = _.find(rule.local, function(obj) {
                            return obj.id === node.id
                        }.bind(this))
                        if (nodesError) errorMsg.push(nodesError)
                    }.bind(this))
                }
            }.bind(this))

            if (errorMsg.length > 0) {
                alert(errorMsg[0].name + '不能同时存在于两条规则的“本层”中');
                return;
            }

            if (!this.isEdit) this.rule.push(this.defaultParam)

            console.log("当前保存的规则：this.rule: ", this.rule);

            this.options.onSaveCallback && this.options.onSaveCallback();
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetLocalNodeFromArgs: function() {
            this.$el.find('.local .add-node').show();

            this.topoAllNodes = [];
            _.each(this.options.localNodes, function(node) {
                var tempNode = _.find(this.allNodesArray, function(obj) {
                    return obj.id === node.id
                }.bind(this))
                if (tempNode) this.topoAllNodes.push(tempNode)
            }.bind(this))

            console.log("拓扑所有节点: ", this.topoAllNodes);

            this.topoUpperNodes = [];
            _.each(this.options.upperNodes, function(node) {
                var tempNode = _.find(this.allNodesArray, function(obj) {
                    return obj.id === node.id
                }.bind(this))
                if (tempNode) this.topoUpperNodes.push(tempNode)
            }.bind(this));

            console.log("拓扑上层节点: ", this.topoUpperNodes);

            this.localNodeListForSelect = this.topoAllNodes;
            if (!this.notFilter) {
                _.each(this.topoUpperNodes, function(node) {
                    this.localNodeListForSelect = _.filter(this.localNodeListForSelect, function(obj) {
                        return obj.id !== node.id;
                    }.bind(this))
                }.bind(this))
            }

            console.log("拓扑本层节点: ", this.localNodeListForSelect);
            this.$el.find('.local .add-node').on('click', $.proxy(this.onClickAddLocalNodeButton, this))
            this.initLocalTable();
        },

        onClickAddLocalNodeButton: function(event) {
            require(['setupTopoManage.selectNode.view'], function(SelectNodeView) {
                if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

                var mySelectNodeView = new SelectNodeView({
                    collection: this.collection,
                    selectedNodes: this.defaultParam.local,
                    nodesList: this.localNodeListForSelect
                });
                var options = {
                    title: "选择节点",
                    body: mySelectNodeView,
                    backdrop: 'static',
                    type: 2,
                    height: 500,
                    onOKCallback: function() {
                        this.defaultParam.local = mySelectNodeView.getArgs();
                        this.selectNodePopup.$el.modal("hide");
                        this.initLocalTable();
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.selectNodePopup = new Modal(options);
            }.bind(this))
        },

        onGetLocalNodeByTopo: function(res) {
            console.log("根据拓扑ID获取拓扑信息：", res);
            this.options.localNodes = res.allNodes;
            this.options.upperNodes = res.upperNodes;
            this.onGetLocalNodeFromArgs();
            this.onGetUpperNodeFromArgs();
        },

        initLocalTable: function() {
            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.defaultParam.local
            }));
            if (this.defaultParam.local.length !== 0)
                this.$el.find(".local .table-ctn").html(this.localTable[0]);
            else
                this.$el.find(".local .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "你还没有添加节点"
                    }
                }));

            this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemLocalDelete, this));
        },

        onClickItemLocalDelete: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            this.defaultParam.local = _.filter(this.defaultParam.local, function(obj) {
                return obj.id !== parseInt(id)
            }.bind(this));

            this.initLocalTable();
        },

        onClickLocalTypeRadio: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.localType = parseInt($(eventTarget).val());

            if (this.defaultParam.localType === 1) {
                this.defaultParam.local = [];
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2) {
                this.defaultParam.local = [{
                    id: this.statusArray[0].value,
                    name: this.statusArray[0].name
                }];
                this.$el.find("#dropdown-operator .cur-value").html(this.statusArray[0].name);
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").show();
            }
            this.initLocalTable();
        },

        onGetUpperNodeFromArgs: function() {
            this.$el.find('.upper .add-node').show();
            _.each(this.defaultParam.upper, function(el) {
                el.id = el.rsNodeMsgVo.id;
            }.bind(this))
            this.$el.find('.upper .add-node').on('click', $.proxy(this.onClickAddUpperNodeButton, this))
            this.initUpperTable();
        },

        onClickAddUpperNodeButton: function(event) {
            require(['setupTopoManage.selectNode.view'], function(SelectNodeView) {
                if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

                var mySelectNodeView = new SelectNodeView({
                    collection: this.collection,
                    selectedNodes: this.defaultParam.upper,
                    nodesList: this.topoAllNodes
                });
                var options = {
                    title: "选择节点",
                    body: mySelectNodeView,
                    backdrop: 'static',
                    type: 2,
                    height: 500,
                    onOKCallback: function() {
                        this.defaultParam.upper = mySelectNodeView.getArgs();
                        var tempArray = []
                        _.each(this.defaultParam.upper, function(el) {
                            var rsNodeMsgVo = {};
                            rsNodeMsgVo.id = el.id;
                            rsNodeMsgVo.name = el.chName;
                            rsNodeMsgVo.operatorId = el.operatorId;
                            tempArray.push({
                                chiefType: el.chiefType,
                                ipCorporation: el.ipCorporation,
                                rsNodeMsgVo: rsNodeMsgVo,
                                id: el.id
                            })
                        }.bind(this))
                        this.defaultParam.upper = tempArray;
                        this.selectNodePopup.$el.modal("hide");
                        this.initUpperTable();
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.selectNodePopup = new Modal(options);
            }.bind(this))
        },

        initUpperTable: function() {
            var nodeList = [];
            _.each(this.defaultParam.upper, function(el) {
                nodeList.push({
                    nodeId: el.rsNodeMsgVo.id,
                    nodeName: el.rsNodeMsgVo.name,
                    operatorId: el.rsNodeMsgVo.operatorId,
                    chiefType: el.chiefType,
                    ipCorporation: el.ipCorporation
                })
            }.bind(this))

            var duoxianArray = _.filter(nodeList, function(obj) {
                return obj.operatorId === 9
            }.bind(this))
            var feiDuoxianArray = _.filter(nodeList, function(obj) {
                return obj.operatorId !== 9
            }.bind(this))

            nodeList = duoxianArray.concat(feiDuoxianArray)

            this.upperTable = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.upper.table.html'])({
                data: nodeList
            }));

            if (nodeList.length !== 0) {
                this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
            } else {
                this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "你还没有添加节点"
                    }
                }));
            }

            this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));
            this.upperTable.find("tbody .spareradio").on("click", $.proxy(this.onClickCheckboxButton, this));

            require(['deviceManage.model'], function(deviceManageModel) {
                var mydeviceManageModel = new deviceManageModel();
                mydeviceManageModel.on("operator.type.success", $.proxy(this.initOperatorUpperList, this));
                mydeviceManageModel.on("operator.type.error", $.proxy(this.onGetError, this));
                mydeviceManageModel.operatorTypeList();
            }.bind(this));
        },

        initOperatorUpperList: function(data) {
            var statusArray = [];
            _.each(data, function(el, key, list) {
                statusArray.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            rootNodes = this.upperTable.find(".ipOperator .dropdown");

            for (var i = 0; i < rootNodes.length; i++) {
                this.initTableDropMenu($(rootNodes[i]), statusArray, function(value, nodeId) {
                    _.each(this.defaultParam.upper, function(el, key, list) {
                        if (el.rsNodeMsgVo.id == parseInt(nodeId)) {
                            el.ipCorporation = parseInt(value);
                        }
                    }.bind(this));
                }.bind(this));

                _.each(this.defaultParam.upper, function(node) {
                    var curNodeId = parseInt(rootNodes[i].id);
                    if (node.rsNodeMsgVo.id === curNodeId) {
                        var defaultValue = _.find(statusArray, function(obj) {
                            return obj.value === node.ipCorporation
                        }.bind(this))

                        if (defaultValue) {
                            $(rootNodes[i]).find("#dropdown-ip-operator .cur-value").html(defaultValue.name)
                        } else {
                            $(rootNodes[i]).find("#dropdown-ip-operator .cur-value").html(statusArray[0].name);
                            node.ipCorporation = statusArray[0].value;
                        }
                    }
                }.bind(this))
            }
        },

        initTableDropMenu: function(rootNode, typeArray, callback) {
            var dropRoot = rootNode.find(".dropdown-menu"),
                rootId = rootNode.attr("id"),
                showNode = rootNode.find(".cur-value");
            dropRoot.html("");
            _.each(typeArray, function(element, index, list) {
                var itemTpl = '<li value="' + element.value + '">' +
                    '<a href="javascript:void(0);" value="' + element.value + '">' + element.name + '</a>' +
                    '</li>',
                    itemNode = $(itemTpl);
                itemNode.on("click", function(event) {
                    var eventTarget = event.srcElement || event.target;
                    showNode.html($(eventTarget).html()),
                        value = $(eventTarget).attr("value");
                    callback && callback(value, rootId);
                });
                itemNode.appendTo(dropRoot);
            });
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

            this.defaultParam.upper = _.filter(this.defaultParam.upper, function(obj) {
                return obj.rsNodeMsgVo.id !== parseInt(id)
            }.bind(this));

            this.initUpperTable();
        },

        onClickCheckboxButton: function(event) {
            var eventTarget = event.srcElement || event.target;
            var id = eventTarget.id;

            _.each(this.defaultParam.upper, function(obj) {
                if (obj.rsNodeMsgVo.id === parseInt(id))
                    obj.chiefType = eventTarget.checked ? 0 : 1;
            }.bind(this))
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });
    return AddEditLayerStrategyView;
});