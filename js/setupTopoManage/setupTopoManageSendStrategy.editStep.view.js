define("setupTopoManageSendStrategy.editStep.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var AddOrEditStepView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.deliveryDetail = options.deliveryDetail; //全部的步骤参数
                this.isEdit = options.isEdit;
                this.allNodes = options.allNodes;

                if (this.isEdit) {
                    this.currentStep = options.currentStep; //每一条的步骤参数
                    if (this.currentStep.range === undefined) this.currentStep.range = 0;
                    if (this.currentStep.exclude === undefined) this.currentStep.exclude = [];
                } else {
                    this.currentStep = {
                        "step": this.deliveryDetail.deliveryStrategyDef.length + 1,
                        "nodeId": [],
                        "exclude": [],
                        "shell": "",
                        "range": 0
                    }
                }

                this.canAddNode = true;

                console.log("所有步骤：", this.deliveryDetail.deliveryStrategyDef);
                console.log("当前编辑的步骤：", this.currentStep);

                this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.addStep.html'])({
                    data: this.currentStep
                }));

                this.$el.find('.opt-ctn .save').on('click', $.proxy(this.onClickSaveButton, this));
                this.$el.find('.opt-ctn .cancel').on('click', $.proxy(this.onClickCancelButton, this));
                this.$el.find('.other-all-node').on('click', $.proxy(this.onClickOtherNodeButton, this));
                //this.$el.find('.script').on('click', $.proxy(this.onClickScriptButton, this));

                // if (this.currentStep.shell != "" && 
                //     this.currentStep.shell !== null && 
                //     this.currentStep.shell !== undefined) {
                //     this.$el.find(".script").trigger('click');
                //     this.$el.find(".scriptContent").val(this.currentStep.shell);
                // }
                this.filterNode()
                if (this.currentStep.range == 1) {
                    this.$el.find('.all').hide();
                    this.$el.find('.exclude').show();
                    this.formatExcludeData();
                    this.initExcludeSelect();
                    this.initExcludeTable();
                } else if (this.currentStep.range == 0) {
                    this.$el.find('.exclude').hide();
                    this.$el.find('.all').show();
                    this.onGetNodeSuccess();
                }
            },

            filterNode: function() {
                this.allNodesforFilter = [];
                _.each(this.allNodes, function(el, index, list) {
                    this.allNodesforFilter.push(el);
                }.bind(this));
                console.log('步骤-拓扑中所有节点: ', this.allNodesforFilter);

                _.each(this.deliveryDetail.deliveryStrategyDef, function(step) {
                    if (step.step !== this.currentStep.step && step.range != 1) {
                        _.each(step.nodeId, function(el) {
                            this.allNodesforFilter = _.filter(this.allNodesforFilter, function(node) {
                                return node.id !== el
                            }.bind(this))
                        }.bind(this))
                        console.log("步骤-过滤掉第" + step.step + "步后剩余的节点", this.allNodesforFilter);
                    }
                }.bind(this))
                console.log("步骤-过滤后节点：", this.allNodesforFilter);

                if (this.allNodesforFilter.length === 0) this.canAddNode = false;

                var remainderNodes = [],
                    allStepNodes = [];
                _.each(this.deliveryDetail.deliveryStrategyDef, function(el) {
                    if (el.range !== 1) {
                        allStepNodes = allStepNodes.concat(el.nodeId)
                    } else {
                        this.$el.find('.other-all-node').hide();
                        if (!this.isEdit) this.canAddNode = false;
                    }
                }.bind(this))
                console.log('步骤-所有步骤的节点: ', allStepNodes);

                _.each(this.allNodesforFilter, function(nodeObj) {
                    if (_.indexOf(allStepNodes, nodeObj.id) === -1)
                        remainderNodes.push(nodeObj.id)
                }.bind(this))
                console.log('步骤-过滤掉所有步骤节点后剩余的节点: ', remainderNodes);
                this.remainderNodes = remainderNodes;
            },

            onGetNodeSuccess: function(res) {
                this.selectedAllNodeList = [];
                this.nodesArrayFirst = [];

                _.each(this.allNodesforFilter, function(el, index, list) {
                    el.checked = false;
                    _.each(this.currentStep.nodeId, function(nodeId, inx, ls) {
                        if (nodeId === el.id) {
                            el.checked = true;
                            this.selectedAllNodeList.push({
                                nodeId: el.id,
                                nodeName: el.name,
                                operator: el.operatorId,
                                checked: el.checked
                            })
                        }
                    }.bind(this))
                    this.nodesArrayFirst.push({
                        name: el.name,
                        value: el.id,
                        checked: el.checked,
                        operator: el.operatorId
                    })
                }.bind(this))

                this.initSelcet();
                this.initNodesTable();
            },

            formatExcludeData: function() {
                this.selectedExcludeNode = [];
                this.remainderNodeList = [];

                _.each(this.allNodesforFilter, function(el, index, list) {
                    _.each(this.remainderNodes, function(nodeId, inx) {
                        if (nodeId == el.id) {
                            this.remainderNodeList.push({
                                name: el.name,
                                value: el.id,
                                checked: false,
                            })
                        }
                    }.bind(this))
                }.bind(this))

                _.each(this.remainderNodeList, function(el, index, list) {
                    _.each(this.currentStep.exclude, function(nodeId, inx) {
                        if (nodeId == el.value) {
                            el.checked = true;
                            this.selectedExcludeNode.push({
                                name: el.name,
                                id: el.id
                            })
                        }
                    }.bind(this))
                }.bind(this))
            },

            initExcludeSelect: function() {
                var options = {
                    containerID: this.$el.find('.exclude .add-node-ctn').get(0),
                    panelID: this.$el.find('.exclude .select-node').get(0),
                    openSearch: true,
                    onOk: $.proxy(this.onClickExcludeSelectOK, this),
                    data: this.remainderNodeList,
                    callback: function(data) {}.bind(this)
                }

                this.excludeSelect = new SearchSelect(options);
            },

            onClickExcludeSelectOK: function(data) {
                this.selectedExcludeNode = [];
                _.each(data, function(el, key, ls) {
                    this.selectedExcludeNode.push({
                        id: parseInt(el.value),
                        name: el.name,
                    });
                }.bind(this))

                this.currentStep.exclude = [];
                _.each(this.selectedExcludeNode, function(el, key, ls) {
                    this.currentStep.exclude.push(el.id);
                }.bind(this));

                _.each(this.remainderNodeList, function(el, key, ls) {
                    el.checked = false;
                    _.each(this.selectedExcludeNode, function(data, key, ls) {
                        if (el.value == data.id) el.checked = true;
                    }.bind(this))
                }.bind(this))

                this.initExcludeTable()
            },

            initExcludeTable: function() {
                this.nodeExcludeTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                    data: this.selectedExcludeNode
                }));
                if (this.selectedExcludeNode.length !== 0)
                    this.$el.find(".exclude-table-ctn").html(this.nodeExcludeTable[0]);
                else
                    this.$el.find(".exclude-table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "你还没有排除节点"
                        }
                    }));

                this.nodeExcludeTable.find("tbody .delete").on("click", $.proxy(this.onClickExcludeItemDelete, this));
            },

            onClickExcludeItemDelete: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                _.each(this.remainderNodeList, function(el, index, ls) {
                    if (el.value === parseInt(id)) el.checked = false;
                }.bind(this))
                this.selectedExcludeNode = _.filter(this.selectedExcludeNode, function(obj) {
                    return obj.id !== parseInt(id)
                }.bind(this))

                this.currentStep.exclude = [];
                _.each(this.selectedExcludeNode, function(el, key, ls) {
                    this.currentStep.exclude.push(el.id);
                }.bind(this))

                if (this.excludeSelect)
                    this.excludeSelect.destroy();

                this.initExcludeSelect();
                this.initExcludeTable();
            },

            initSelcet: function() {
                var options = {
                    containerID: this.$el.find('.all .add-node-ctn').get(0),
                    panelID: this.$el.find('.all .add-node').get(0),
                    openSearch: true,
                    onOk: $.proxy(this.onClickSelectOK, this),
                    data: this.nodesArrayFirst,
                    callback: function(data) {}.bind(this)
                }

                this.searchSelect = new SearchSelect(options);
            },

            onClickSelectOK: function(data) {
                this.selectedAllNodeList = [];
                _.each(data, function(el, key, ls) {
                    this.selectedAllNodeList.push({
                        nodeId: el.value,
                        nodeName: el.name,
                        operatorId: ''
                    });
                }.bind(this))

                this.currentStep.nodeId = [];
                _.each(this.selectedAllNodeList, function(el, key, ls) {
                    this.currentStep.nodeId.push(parseInt(el.nodeId));
                }.bind(this));

                _.each(this.nodesArrayFirst, function(el, key, ls) {
                    el.checked = false;
                    _.each(this.selectedAllNodeList, function(data, key, ls) {
                        if (el.value == data.nodeId) {
                            el.checked = true;
                            data.operatorId = el.operator;
                        }
                    }.bind(this))
                }.bind(this))

                this.initNodesTable()
            },

            initNodesTable: function() {
                this.nodeTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                    data: this.selectedAllNodeList
                }));
                if (this.selectedAllNodeList.length !== 0)
                    this.$el.find(".table-ctn").html(this.nodeTable[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "你还没有添加节点"
                        }
                    }));

                this.nodeTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            },

            onClickItemDelete: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                _.each(this.nodesArrayFirst, function(el, index, ls) {
                    if (parseInt(el.value) === parseInt(id)) el.checked = false;
                }.bind(this))
                this.selectedAllNodeList = _.filter(this.selectedAllNodeList, function(obj) {
                    return parseInt(obj.nodeId) !== parseInt(id)
                }.bind(this))

                this.currentStep.nodeId = [];
                _.each(this.selectedAllNodeList, function(el, key, ls) {
                    this.currentStep.nodeId.push(parseInt(el.nodeId));
                }.bind(this))

                if (this.searchSelect)
                    this.searchSelect.destroy();

                this.initSelcet();
                this.initNodesTable();
            },

            onClickOtherNodeButton: function() {
                this.filterNode()
                _.each(this.allNodesforFilter, function(node) {
                    this.currentStep.nodeId.push(node.id);
                }.bind(this))
                this.currentStep.nodeId = _.uniq(this.currentStep.nodeId)
                this.currentStep.range = 1;
                this.$el.find('.all').hide();
                this.$el.find('.exclude').show();
                this.formatExcludeData();
                this.initExcludeSelect();
                this.initExcludeTable();
            },

            onClickScriptButton: function() {
                this.$el.find('.scriptContent').toggle("fast");
            },

            onClickCancelButton: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            onClickSaveButton: function() {
                //this.currentStep.shell = $(".scriptContent").val();
                if (this.currentStep.nodeId.length == 0) {
                    Utility.warning('您还未选择节点');
                    return;
                }
                if (!this.isEdit) {
                    this.deliveryDetail.deliveryStrategyDef.push(this.currentStep)
                }
                _.each(this.deliveryDetail.deliveryStrategyDef, function(step) {
                    step.name = "第" + step.step + "步";
                }.bind(this))
                console.log("保存时的策略详情: ", this.deliveryDetail)
                this.options.onSaveCallback && this.options.onSaveCallback();
            },

            render: function(target) {
                if (!this.canAddNode) {
                    Utility.warning("已经没有节点可以添加了")
                    this.onClickCancelButton();
                } else {
                    this.$el.appendTo(target);
                }
            }
        });

        return AddOrEditStepView;
    });