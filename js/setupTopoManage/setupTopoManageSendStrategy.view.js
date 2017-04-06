define("setupTopoManageSendStrategy.view", ['require', 'exports', 'template', 'modal.view', 'utility'], 
    function (require, exports, template, Modal, Utility) {

    var nextStepView = Backbone.View.extend({
        events: {},

        initialize: function (options) {
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.nextTimeTable.html'])({data: {}}));
        },

        render: function(target){
            this.$el.appendTo(target);
        }
    });

    var AddOrEditStepView = Backbone.View.extend({
        events: {},

        initialize: function (options) {
            this.options = options;
            this.collection = options.collection;
            this.deliveryDetail = options.deliveryDetail; //全部的步骤参数
            this.isEdit = options.isEdit;
            this.allNodes = options.allNodes;

            if (this.isEdit){
                this.currentStep = options.currentStep;//每一条的步骤参数
                if (this.currentStep.range === undefined) this.currentStep.range = 0
            } else {
                this.currentStep = {
                    "step": this.deliveryDetail.deliveryStrategyDef.length + 1,
                    "nodeId": [],
                    "shell": "",
                    "range": 0
                }
            }
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.addStep.html'])({data: this.currentStep}));

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
            console.log("当前所有步骤：", this.deliveryDetail.deliveryStrategyDef);
            console.log("添加编辑当前步骤默认值：", this.currentStep);
            this.filterNode()
            this.onGetNodeSuccess();
        },

        filterNode: function(){
            console.log("过滤前节点：", this.allNodes)
            this.allNodesforFilter = [];
            _.each(this.allNodes, function (el, index, list) {
                this.allNodesforFilter.push(el);
            }.bind(this));

            _.each(this.deliveryDetail.deliveryStrategyDef, function(step){
                if (step.step !== this.currentStep.step){
                    _.each(step.nodeId, function(el){
                        this.allNodesforFilter = _.filter(this.allNodesforFilter, function(node){
                            return node.id !== el
                        }.bind(this))
                    }.bind(this))
                }
            }.bind(this))
            console.log("过滤后节点：", this.allNodesforFilter)
        },

        onGetNodeSuccess: function (res) {
            this.selectedAllNodeList = [];
            this.nodesArrayFirst = [];

            _.each(this.allNodesforFilter, function (el, index, list) {
                el.checked = false;
                _.each(this.currentStep.nodeId, function (nodeId, inx, ls) {
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

        initSelcet: function(){
            var options = {
                containerID: this.$el.find('.all .add-node-ctn').get(0),
                panelID: this.$el.find('.all .add-node').get(0),
                openSearch: true,
                onOk: $.proxy(this.onClickSelectOK, this),
                data: this.nodesArrayFirst,
                callback: function (data) {}.bind(this)
            }

            this.searchSelect = new SearchSelect(options);
        },

        onClickSelectOK: function (data) {
            this.selectedAllNodeList = [];
            _.each(data, function (el, key, ls) {
                this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId: ''});
            }.bind(this))

            this.currentStep.nodeId = [];
            _.each(this.selectedAllNodeList, function (el, key, ls) {
                this.currentStep.nodeId.push(parseInt(el.nodeId));
            }.bind(this));

            _.each(this.nodesArrayFirst, function (el, key, ls) {
                el.checked = false;
                _.each(this.selectedAllNodeList, function (data, key, ls) {
                    if (el.value == data.nodeId) {
                        el.checked = true;
                        data.operatorId = el.operator;
                    }
                }.bind(this))
            }.bind(this))

            this.initNodesTable()
        },

        initNodesTable: function () {
            this.nodeTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedAllNodeList
            }));
            if (this.selectedAllNodeList.length !== 0)
                this.$el.find(".table-ctn").html(this.nodeTable[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({data: {message: "你还没有添加节点"}}));

            this.nodeTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
        },

        onClickItemDelete: function (event) {
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

            this.currentStep.nodeId = [];
            _.each(this.selectedAllNodeList, function (el, key, ls) {
                this.currentStep.nodeId.push(parseInt(el.nodeId));
            }.bind(this))

            if (this.searchSelect)
                this.searchSelect.destroy();

            this.initSelcet();
            this.initNodesTable();
        },

        onClickOtherNodeButton: function () {
            this.filterNode()
            _.each(this.allNodesforFilter, function(node){
                this.currentStep.nodeId.push(node.id);
            }.bind(this))
            this.currentStep.nodeId = _.uniq(this.currentStep.nodeId)
            this.currentStep.range = 1;
            this.$el.find('.all').hide();
        },

        onClickScriptButton: function () {
            this.$el.find('.scriptContent').toggle("fast");
        },

        onClickCancelButton: function () {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onClickSaveButton: function () {
            //this.currentStep.shell = $(".scriptContent").val();
            if (this.currentStep.nodeId.length == 0) {
                alert('您还未选择节点');
                return;
            }
            if (!this.isEdit) {
                this.deliveryDetail.deliveryStrategyDef.push(this.currentStep)
            } 
            _.each(this.deliveryDetail.deliveryStrategyDef, function(step){
                step.name = "第" + step.step + "步";
            }.bind(this))
            console.log("保存时的策略详情: ", this.deliveryDetail)
            this.options.onSaveCallback && this.options.onSaveCallback();
        },

        render: function (target) {
            this.$el.appendTo(target);
            if (this.allNodesforFilter.length === 0) {
                alert("已经没有节点可以添加了")
                this.onClickCancelButton();
            }
        }
    });

    var EditOrAddSendView = Backbone.View.extend({
        events: {},
        initialize: function (options) {
            this.options = options;
            this.modelTopo = options.modelTopo;
            this.model = options.model;
            this.collection = options.collection;
            this.isEdit = options.isEdit;

            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.send.edit.html'])({data: {}}));

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
            this.collection.getTopoOrigininfo(this.modelTopo.get('id'));
            console.log("新建编辑下发策略之拓扑ID：", this.modelTopo.get('id'))
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

            //this.initNextStep();
        },

        getSendViewDetailSuccess: function (res) {
            console.log('编辑情况下发策略ID获取策略详情: ', res)
            this.defaultParam = res;
            this.$el.find('#input-Name').val(this.defaultParam.name);
            this.$el.find('#description').val(this.defaultParam.description);
            this.initNodeName();
            this.initStepTable();
        },

        onGetTopoInfoSuccess: function (res) {
            console.log("根据拓扑ID获取拓扑信息：", res)
            this.$el.find('#input-Topo').val(res.name);
            this.$el.find('.add-step').css('display', 'inline-block');

            this.allNodes = res.allNodes; //所有的节点,会执行节点的过滤操作
            console.log('拓扑中的所有节点: ', this.allNodes)
            if (this.isEdit) {
                this.collection.getSendViewDetail(this.model.get('id'));
                console.log('编辑情况下发策略ID: ', this.model.get('id'))
            } else {
                console.log('新建默认策略详情: ', this.defaultParam)
                this.initNodeName();
                this.initStepTable();
            }
        },

        initNextStep: function () {
            var mynextStepView = new nextStepView({});
            mynextStepView.render(this.$el.find('#selectNextTime'));
            this.$el.find('#selectNextTime').css('visibility', 'hidden');
        },

        initNodeName: function(){
            var nodeNames = {};
            _.each(this.allNodes, function(el){
                nodeNames[el.id] = el.name;
            }.bind(this))
            this.defaultParam.nodeNames = nodeNames;
            console.log('节点名称: ', this.defaultParam.nodeNames)
        },

        initStepTable: function(){
            // var data = [
            //     {step:1,nodeName:'扬州电信节点<br>扬州联通节点<br>杭州'},
            //     {step:2,nodeName:'济南联通节点<br>惠州联通节点<br>天津电信节点'},
            //     {step:3,nodeName:'石家庄联通节点<br>襄阳电信节点<br>德阳电信节点<br>天津移动节点'}
            // ]
            var stepArray = [];
            _.each(this.defaultParam.deliveryStrategyDef, function(step){
                var nodeName = '';
                _.each(step.nodeId, function(nodeId){
                    nodeName = nodeName + this.defaultParam.nodeNames[nodeId] + '<br>'
                }.bind(this))
                stepArray.push({
                    step: step.step,
                    nodeName: nodeName,
                })
            }.bind(this))
            this.stepTable = $(_.template(template['tpl/setupTopoManage/setupTopoManage.addStep.table.html'])({
                data: stepArray
            }));

            if (stepArray.length !== 0)
                this.$el.find(".sendStrategy .table-ctn").html(this.stepTable[0]);
            else
                this.$el.find(".sendStrategy .table-ctn").html(_.template(template['tpl/empty-2.html'])({data: {message: "你还没有添加步骤"}}));

            this.stepTable.find('.edit').on('click', $.proxy(this.onClickEditStepButton, this));
            this.stepTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
        },

        onClickItemDelete: function (event) {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            this.defaultParam.deliveryStrategyDef = _ .filter(this.defaultParam.deliveryStrategyDef, function(obj){
                return obj.step !== parseInt(id);
            }.bind(this))

            _.each(this.defaultParam.deliveryStrategyDef, function(step, index){
                step.step = index + 1
            }.bind(this))

            this.initStepTable();
        },

        onClickAddStepButton: function () {
            var myAddStepView = new AddOrEditStepView({
                collection: this.collection,
                deliveryDetail: this.defaultParam,
                isEdit: false,
                allNodes: this.allNodes,
                onCancelCallback: function () {
                    myAddStepView&&myAddStepView.$el.remove();
                    this.$el.find('.sendStrategy').show();
                }.bind(this),
                onSaveCallback: function () {
                    this.initStepTable();
                    myAddStepView&&myAddStepView.$el.remove();
                    this.$el.find('.sendStrategy').show();
                }.bind(this)
            });
            this.$el.find('.sendStrategy').hide();
            myAddStepView.render(this.$el.find('.add-step-ctn'));
        },

        onClickEditStepButton: function (event) {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var currentStep = _.find(this.defaultParam.deliveryStrategyDef, function(obj){
                return obj.step === parseInt(id)
            }.bind(this))

            var myAddStepView = new AddOrEditStepView({
                collection: this.collection,
                deliveryDetail: this.defaultParam,
                isEdit: true,
                allNodes: this.allNodes,
                currentStep: currentStep,
                onCancelCallback: function () {
                    myAddStepView&&myAddStepView.$el.remove();
                    this.$el.find('.sendStrategy').show();
                }.bind(this),
                onSaveCallback: function () {
                    this.initStepTable();
                    myAddStepView&&myAddStepView.$el.remove();
                    this.$el.find('.sendStrategy').show();
                }.bind(this)
            });
            this.$el.find('.sendStrategy').hide();
            myAddStepView.render(this.$el.find('.add-step-ctn'));
        },

        onClickNextStepButton: function (event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName != 'INPUT') return;

            if (eventTarget.id == 'ManualRadio') {
                this.$el.find('#selectNextTime').css('visibility', 'hidden');
            }
            else if (eventTarget.id == 'TimingRadio') {
                this.$el.find('#selectNextTime').css('visibility', 'visible');
            }
        },

        onClickSaveButton: function () {
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

        addSendViewSuccess: function (res) {
            alert('保存成功');
            this.options.onSaveCallback && this.options.onSaveCallback();
        },

        modifySendStrategySuccess: function (res) {
            alert('修改成功');
            this.options.onSaveCallback && this.options.onSaveCallback();
        },

        onClickCancelButton: function () {
            this.options.onCancelCallback && this.options.onCancelCallback();
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

    var SendView = Backbone.View.extend({
        event: {},

        initialize: function (options) {
            this.options = options;
            this.modelTopo = options.model;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.send.html'])({data: {}}));

            this.curPage = 1;
            this.initNumberDrop();

            this.queryArgs = {
                "topologyId": this.modelTopo.get('id'),
                "name": null,
                "page": 1,
                "count": 10
            }

            this.collection.on("get.sendInfo.success", $.proxy(this.getSendInfoSuccess, this));
            this.collection.on("get.sendInfo.error", $.proxy(this.onGetError, this));
            //删除下发策略
            this.collection.on("delete.SendStrategy.success", $.proxy(this.deleteSendStrategySuccess, this));
            this.collection.on("delete.SendStrategy.error", $.proxy(this.onGetError, this));
            //设为默认
            this.collection.on("set.DefaultStrategy.success", $.proxy(this.setDefaultStrategySuccess, this));
            this.collection.on("set.DefaultStrategy.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            //Enter键查询
            this.$el.find('#input-topo-name').on('keydown', $.proxy(this.onEnter, this));
            this.$el.find('.opt-ctn .query').on('click', $.proxy(this.onClickQueryButton, this));
            this.$el.find('.opt-ctn .new').on('click', $.proxy(this.onClickAddSend, this));

            this.refreshList();
        },

        onEnter: function(e){
            if (e.keyCode == 13) this.onClickQueryButton();
        },

        onClickQueryButton: function(){
            this.curPage = 1;
            this.refreshList();
        },

        refreshList: function () {
            this.isInitPaginator = false;
            this.queryArgs.page = this.curPage;
            this.queryArgs.name = this.$el.find("#input-topo-name").val();
            if (this.queryArgs.name == "") this.queryArgs.name = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");

            this.collection.getSendinfo(this.queryArgs);
        },

        onClickCancelButton: function () {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        getSendInfoSuccess: function (res) {
            this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.send.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({data: {message: "暂无数据"}}));

            this.table.find('.edit').on('click', $.proxy(this.onClickEditSend, this));
            this.table.find('.delete').on('click', $.proxy(this.onClickDeleteSend, this));
            this.table.find('.setDefault').on('click', $.proxy(this.onClickDefault, this));

            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickAddSend: function () {
            var myEditOrAddSendView = new EditOrAddSendView({
                collection: this.collection,
                modelTopo: this.modelTopo,
                onSaveCallback: function () {
                    this.refreshList();
                    myEditOrAddSendView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this),
                onCancelCallback: function () {
                    myEditOrAddSendView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            });
            this.$el.find('.list-panel').hide();
            myEditOrAddSendView.render(this.$el.find('.SendTable'));
        },

        onClickEditSend: function (event) {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var myEditOrAddSendView = new EditOrAddSendView({
                collection: this.collection,
                modelTopo: this.modelTopo,
                isEdit: true,
                model: model,
                onSaveCallback: function () {
                    this.refreshList();
                    myEditOrAddSendView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this),
                onCancelCallback: function () {
                    myEditOrAddSendView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            });
            this.$el.find('.list-panel').hide();
            myEditOrAddSendView.render(this.$el.find('.SendTable'));
        },

        onClickDeleteSend: function () {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var result = confirm("确定删除" + model.get('name') + '?');
            if (!result) return;
            this.collection.deleteSendStrategy(id);
        },

        onClickDefault: function () {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var result = confirm("确定将" + model.get('name') + "设为默认?");
            if (!result) return;
            this.collection.setDefaultStrategy(id);
        },

        deleteSendStrategySuccess: function () {
            alert('删除成功');
            this.refreshList();
        },

        setDefaultStrategySuccess: function () {
            alert('设置成功');
            this.refreshList();
        },

        initPaginator: function () {
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total / this.queryArgs.count);
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: this.curPage,
                onPageChange: function (num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        this.curPage = num;
                        args.count = this.queryArgs.count;
                        this.collection.getSendinfo(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNumberDrop: function () {
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function (value) {
                this.queryArgs.count = parseInt(value);
                this.onClickQueryButton();
            }.bind(this));
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

    return SendView;
});