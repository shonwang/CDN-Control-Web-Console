define("setupTopoManageSendStrategy.edit.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var NextStepView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.nextTimeTable.html'])({
                    data: {}
                }));
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        var EditOrAddSendView = Backbone.View.extend({
            events: {},
            initialize: function(options) {
                this.options = options;
                this.modelTopo = options.modelTopo;
                this.model = options.model;
                this.collection = options.collection;
                this.isEdit = options.isEdit;

                this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.send.edit.html'])({
                    data: {}
                }));

                this.$el.find('.add-step').on('click', $.proxy(this.onClickAddStepButton, this));
                this.$el.find('.nextStep').on('click', $.proxy(this.onClickNextStepButton, this));
                this.$el.find('.opt-ctn .cancel').on('click', $.proxy(this.onClickCancelButton, this));
                this.$el.find('.opt-ctn .save').on('click', $.proxy(this.onClickSaveButton, this));

                this.$el.find('.add-step').css('display', 'none');

                this.defaultParam = {
                    "name": null,
                    "topologyId": null,
                    "description": null,
                    "deliveryStrategyDef": []
                }
                console.log("拓扑id：", this.modelTopo.get('id'))
                //新建下发策略
                this.collection.off('add.SendView.error');
                this.collection.off('add.SendView.success');
                this.collection.on('add.SendView.success', $.proxy(this.addSendViewSuccess, this));
                this.collection.on('add.SendView.error', $.proxy(this.onGetError, this));
                //查看下发策略详情
                this.collection.off('get.SendViewDetail.success');
                this.collection.off('get.SendViewDetail.error');
                this.collection.on('get.SendViewDetail.success', $.proxy(this.getSendViewDetailSuccess, this));
                this.collection.on('get.SendViewDetail.error', $.proxy(this.onGetError, this));
                //修改下发策略
                this.collection.off('modify.SendStrategy.success');
                this.collection.off('modify.SendStrategy.error');
                this.collection.on('modify.SendStrategy.success', $.proxy(this.modifySendStrategySuccess, this));
                this.collection.on('modify.SendStrategy.error', $.proxy(this.onGetError, this));

                this.collection.off('get.topo.OriginInfo.error');
                this.collection.off('get.topo.OriginInfo.success');
                this.collection.on('get.topo.OriginInfo.success', $.proxy(this.onGetTopoInfoSuccess, this));
                this.collection.on('get.topo.OriginInfo.error', $.proxy(this.onGetError, this));
                this.collection.getTopoOrigininfo(this.modelTopo.get('id'));
                //this.initNextStep();
            },

            getSendViewDetailSuccess: function(res) {
                console.log('编辑-策略详情: ', res)
                this.defaultParam = res;
                this.$el.find('#input-Name').val(this.defaultParam.name);
                this.$el.find('#description').val(this.defaultParam.description);

                this.initNodeName();
                this.initStepTable();
            },

            onGetTopoInfoSuccess: function(res) {
                console.log("拓扑信息：", res)
                this.$el.find('#input-Topo').val(res.name);
                this.$el.find('.add-step').css('display', 'inline-block');

                this.allNodes = res.allNodes; //所有的节点,会执行节点的过滤操作
                console.log('拓扑中的所有节点: ', this.allNodes)
                if (this.isEdit) {
                    this.collection.getSendViewDetail(this.model.get('id'));
                    console.log('编辑-下发策略ID: ', this.model.get('id'))
                } else {
                    console.log('新建-默认策略详情: ', this.defaultParam)
                    this.initNodeName();
                    this.initStepTable();
                }
            },

            initNextStep: function() {
                var myNextStepView = new NextStepView({});
                myNextStepView.render(this.$el.find('#selectNextTime'));
                this.$el.find('#selectNextTime').css('visibility', 'hidden');
            },

            initNodeName: function() {
                var nodeNames = {};
                _.each(this.allNodes, function(el) {
                    nodeNames[el.id] = el.name;
                }.bind(this))
                if (this.defaultParam.nodeNames)
                    this.nodeNamesXHR = this.defaultParam.nodeNames
                this.defaultParam.nodeNames = nodeNames;
                console.log('节点名称: ', this.defaultParam.nodeNames)
            },

            initStepTable: function() {
                // var data = [
                //     {step:1,nodeName:'扬州电信节点<br>扬州联通节点<br>杭州'},
                //     {step:2,nodeName:'济南联通节点<br>惠州联通节点<br>天津电信节点'},
                //     {step:3,nodeName:'石家庄联通节点<br>襄阳电信节点<br>德阳电信节点<br>天津移动节点'}
                // ]
                var stepArray = [];
                _.each(this.defaultParam.deliveryStrategyDef, function(step) {
                    var nodeName = '';
                    _.each(step.nodeId, function(nodeId) {
                        nodeName = nodeName +
                            (this.defaultParam.nodeNames[nodeId] || '<span class="text-danger" title="此节点已经不在拓扑中">' + this.nodeNamesXHR[nodeId] + '</span>') + '<br>'
                    }.bind(this))
                    stepArray.push({
                        step: step.step,
                        nodeName: nodeName,
                        range: step.range
                    })
                }.bind(this))
                this.stepTable = $(_.template(template['tpl/setupTopoManage/setupTopoManage.addStep.table.html'])({
                    data: stepArray
                }));

                if (stepArray.length !== 0)
                    this.$el.find(".sendStrategy .table-ctn").html(this.stepTable[0]);
                else
                    this.$el.find(".sendStrategy .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "你还没有添加步骤"
                        }
                    }));

                this.stepTable.find('.edit').on('click', $.proxy(this.onClickEditStepButton, this));
                this.stepTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
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

                this.defaultParam.deliveryStrategyDef = _.filter(this.defaultParam.deliveryStrategyDef, function(obj) {
                    return obj.step !== parseInt(id);
                }.bind(this))

                _.each(this.defaultParam.deliveryStrategyDef, function(step, index) {
                    step.step = index + 1
                }.bind(this))

                this.initStepTable();
            },

            onClickAddStepButton: function() {
                require(['setupTopoManageSendStrategy.editStep.view'], function(AddOrEditStepView) {
                    var myAddStepView = new AddOrEditStepView({
                        collection: this.collection,
                        deliveryDetail: this.defaultParam,
                        isEdit: false,
                        allNodes: this.allNodes,
                        onCancelCallback: function() {
                            myAddStepView && myAddStepView.$el.remove();
                            this.$el.find('.sendStrategy').show();
                        }.bind(this),
                        onSaveCallback: function() {
                            this.initStepTable();
                            myAddStepView && myAddStepView.$el.remove();
                            this.$el.find('.sendStrategy').show();
                        }.bind(this)
                    });
                    this.$el.find('.sendStrategy').hide();
                    myAddStepView.render(this.$el.find('.add-step-ctn'));
                }.bind(this));
            },

            onClickEditStepButton: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                var currentStep = _.find(this.defaultParam.deliveryStrategyDef, function(obj) {
                    return obj.step === parseInt(id)
                }.bind(this))
                require(['setupTopoManageSendStrategy.editStep.view'], function(AddOrEditStepView) {
                    var myAddStepView = new AddOrEditStepView({
                        collection: this.collection,
                        deliveryDetail: this.defaultParam,
                        isEdit: true,
                        allNodes: this.allNodes,
                        currentStep: currentStep,
                        onCancelCallback: function() {
                            myAddStepView && myAddStepView.$el.remove();
                            this.$el.find('.sendStrategy').show();
                        }.bind(this),
                        onSaveCallback: function() {
                            this.initStepTable();
                            myAddStepView && myAddStepView.$el.remove();
                            this.$el.find('.sendStrategy').show();
                        }.bind(this)
                    });
                    this.$el.find('.sendStrategy').hide();
                    myAddStepView.render(this.$el.find('.add-step-ctn'));
                }.bind(this));
            },

            onClickNextStepButton: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName != 'INPUT') return;

                if (eventTarget.id == 'ManualRadio') {
                    this.$el.find('#selectNextTime').css('visibility', 'hidden');
                } else if (eventTarget.id == 'TimingRadio') {
                    this.$el.find('#selectNextTime').css('visibility', 'visible');
                }
            },

            onClickSaveButton: function() {
                this.defaultParam.name = this.$el.find('#input-Name').val();
                this.defaultParam.topologyId = this.modelTopo.get('id');
                this.defaultParam.description = this.$el.find('#description').val();
                if (!this.isEdit) {
                    this.collection.addSendView(this.defaultParam);
                } else {
                    delete this.defaultParam.creator;
                    delete this.defaultParam.nodeNames;
                    delete this.defaultParam.default;
                    this.collection.modifySendStrategy(this.defaultParam);
                }
            },

            addSendViewSuccess: function(res) {
                Utility.alerts("保存成功！", "success", 5000);
                this.options.onSaveCallback && this.options.onSaveCallback();
            },

            modifySendStrategySuccess: function(res) {
                Utility.alerts("修改成功！", "success", 5000)
                this.options.onSaveCallback && this.options.onSaveCallback();
            },

            onClickCancelButton: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return EditOrAddSendView;
    });