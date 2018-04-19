define("setupSendWaitSend.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SetupSendWaitSendView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupSendManage/setupSendWaitSend/setupSendWaitSend.html'])());
            if (!AUTH_OBJ.BatchSendToSending) {
                this.$el.find('.mulit-send').remove();
            }
            this.initChannelDropMenu();

            this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.channel.error", $.proxy(this.onGetError, this));
            this.collection.on("roll.back.success", $.proxy(this.onRollBackSuccess, this));
            this.collection.on("roll.back.error", $.proxy(this.onGetError, this));
            this.collection.on("get.topoSpecialStrategy.success", $.proxy(this.onGetLayerSuccess, this));
            this.collection.on("get.topoSpecialStrategy.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".mulit-send").on("click", $.proxy(this.onClickMultiSend, this))
            this.$el.find(".mulit-reject").on("click", $.proxy(this.onClickMultiReject, this))

            this.enterKeyBindQuery();

            this.queryArgs = {
                "domain": null,
                "operateType": null,
                "platformId": null,
                "configReason": null,
                "status": 1,
                "count": 10,
                "page": 1
            }
            this.onClickQueryButton();
        },

        enterKeyBindQuery: function() {
            $(document).on('keydown', function(e) {
                if (e.keyCode == 13) {
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetError: function(error) {
            this.disablePopup && this.disablePopup.$el.modal('hide');
            if (error && error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("网络阻塞，请刷新重试！")
        },

        onChannelListSuccess: function() {
            this.curLayer = "All"
            this.$el.find("#dropdown-layer .cur-value").html("全部");
            this.curTopo = "All"
            this.$el.find("#dropdown-topo .cur-value").html("全部");
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onRollBackSuccess: function() {
            Utility.alerts("操作成功！", "success", 3000);
            this.update(this.target)
        },
        
        onClickMultiReject:function(){
            Utility.confirm("你确定要打回吗？", function(){
                var checkedList = this.collection.filter(function(model) {
                    return model.get("isChecked") === true;
                });

                this.domainArray = [];
                _.each(checkedList, function(el, index, ls) {
                    this.domainArray.push({
                        predeliveryId: el.get("id")
                    });
                }.bind(this))
                this.collection.rollBack(this.domainArray)
            }.bind(this))      
        },

        onClickMultiSend: function() {
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            });

            this.domainArray = [];
            _.each(checkedList, function(el, index, ls) {
                this.domainArray.push({
                    domain: el.get("domain"),
                    id: el.get("id"),
                    platformId: el.get("platformId")
                });
            }.bind(this));

            var tempArray = _.filter(checkedList, function(obj) {
                return obj.get("topologyId") === checkedList[0].get("topologyId")
            }.bind(this))

            if (tempArray.length !== checkedList.length) {
                Utility.alerts("你选择了不同的拓扑！")
                return;
            } else {
                this.currentModel = checkedList[0];
            }
            this.showSelectStrategyPopup();
        },

        showDisablePopup: function(msg) {
            if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
            var options = {
                title: "警告",
                body: '<div class="alert alert-danger"><strong>' + msg + '</strong></div>',
                backdrop: 'static',
                type: 0,
            }
            this.disablePopup = new Modal(options);
            this.disablePopup.$el.find(".close").remove();
        },

        showSelectStrategyPopup: function() {
            if (this.selectStrategyPopup) $("#" + this.selectStrategyPopup.modalId).remove();

            require(["setupSendWaitCustomize.stratety.view"], function(SelectStrategyView) {
                var mySelectStrategyView = new SelectStrategyView({
                    collection: this.collection,
                    domainArray: this.domainArray,
                    model: this.currentModel
                });
                var type = AUTH_OBJ.ApplySendMission ? 2 : 1;
                var options = {
                    title: "生成下发任务",
                    body: mySelectStrategyView,
                    backdrop: 'static',
                    type: type,
                    onOKCallback: function() {
                        this.createTaskParam = mySelectStrategyView.onSure();
                        if (!this.createTaskParam) return;
                        this.collection.off("check.diff.success");
                        this.collection.off("check.diff.error");
                        this.collection.on("check.diff.success", $.proxy(this.onCheckDiffSuccess, this));
                        this.collection.on("check.diff.error", $.proxy(this.onGetError, this));
                        this.collection.checkdiff(this.domainArray);
                    }.bind(this),
                    onHiddenCallback: function() {
                        this.enterKeyBindQuery();
                    }.bind(this)
                }
                this.selectStrategyPopup = new Modal(options);
            }.bind(this))
        },

        onCheckDiffSuccess: function(data){
            var message = data.diffdomain&&data.diffdomain.split(",").join('<br>');
            if (!data.result){
                message = message + "线上节点存在异构版本，本次下发将覆盖之前版本，是否确定进行下发！"
                Utility.confirm(message, $.proxy(this.excuteCreatTask, this))
            } else {
                this.excuteCreatTask();
            }
        },

        excuteCreatTask: function(){
            this.collection.off("create.task.success");
            this.collection.off("create.task.error");
            this.collection.on("create.task.success", $.proxy(this.onCreatTaskSuccess, this));
            this.collection.on("create.task.error", $.proxy(this.onGetError, this));
            this.collection.createTask(this.createTaskParam);
            this.selectStrategyPopup.$el.modal('hide')
            this.showDisablePopup("服务器正在努力处理中...")
        },

        onCreatTaskSuccess: function() {
            this.disablePopup && this.disablePopup.$el.modal('hide');
            setTimeout(function(){
                Utility.alerts("创建任务成功！", "success", 3000);
                this.update(this.target)
            }.bind(this), 500)
        },

        onClickQueryButton: function() {
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.domain = this.$el.find("#input-domain").val().trim();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            this.$el.find(".table-ctn tbody").html('<tr><td  colspan="12" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
            this.$el.find(".pagination").html("");
            this.collection.queryChannel(this.queryArgs);
        },

        initTable: function() {
            this.$el.find(".mulit-send").attr("disabled", "disabled");
            this.$el.find(".mulit-reject").attr("disabled", "disabled");
            this.tableList = $(_.template(template['tpl/setupSendManage/setupSendWaitSend/setupSendWaitSend.table.html'])({
                data: this.collection.models,
                permission: AUTH_OBJ
            }));

            this.table = this.$el.find(".table-ctn .table");
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn .table tbody").html(this.tableList);
            else
                this.$el.find(".table-ctn .table tbody").html('<tr><td  colspan="12" class="text-center">' + _.template(template['tpl/empty.html'])() + '</td></tr>');

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .send").on("click", $.proxy(this.onClickItemSend, this));
            this.table.find("tbody .reject").on("click", $.proxy(this.onClickItemReject, this));

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));

            this.table.find(".remark").popover();
            this.table.find("[data-toggle='tooltip']").tooltip();
        },

        onClickItemSend: function(event) {
            Utility.confirm("你确定要下发吗？", function(e){
                if (!AUTH_OBJ.ApplySendMission) {
                    Utility.alerts('没有权限');
                    return;
                }
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                var model = this.collection.get(id);
                this.domainArray = [{
                    domain: model.get("domain"),
                    id: model.get("id"),
                    platformId: model.get("platformId")
                }];

                this.currentModel = this.collection.get(id)

                setTimeout(function(){
                    this.showSelectStrategyPopup();
                }.bind(this), 500)
            }.bind(this));
        },

        onClickItemReject: function(event) {
            Utility.confirm("你确定要打回吗？", function(){
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                this.collection.rollBack([{
                    predeliveryId: id
                }])
            }.bind(this))
        },

        onClickItemEdit: function(event) {
            require(['setupChannelManage.edit.view'], function(EditChannelView) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                var model = this.collection.get(id);

                var myEditChannelView = new EditChannelView({
                    collection: this.collection,
                    model: model,
                    isEdit: false,
                    isFromSend: true,
                    onSaveCallback: function() {}.bind(this),
                    onCancelCallback: function() {
                        myEditChannelView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myEditChannelView.render(this.$el.find(".edit-panel"))
            }.bind(this));
        },

        onItemCheckedUpdated: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");
            var model = this.collection.get(id);
            model.set("isChecked", eventTarget.checked)

            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            if (checkedList.length === this.collection.models.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.collection.models.length)
                this.table.find("thead input").get(0).checked = false;
            if (checkedList.length === 0) {
                this.$el.find(".mulit-send").attr("disabled", "disabled");
                this.$el.find(".mulit-reject").attr("disabled", "disabled");
            } else {
                this.$el.find(".mulit-send").removeAttr("disabled", "disabled");
                this.$el.find(".mulit-reject").removeAttr("disabled", "disabled");
            }
        },

        onAllCheckedUpdated: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model) {
                if (model.get("isDisplay"))
                    model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
            if (eventTarget.checked) {
                this.$el.find(".mulit-send").removeAttr("disabled", "disabled");
                this.$el.find(".mulit-reject").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".mulit-send").attr("disabled", "disabled");
                this.$el.find(".mulit-reject").attr("disabled", "disabled");
            }
        },

        initPaginator: function() {
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total / this.queryArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function(num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn tbody").html('<tr><td  colspan="12" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.count;
                        this.collection.queryChannel(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initChannelDropMenu: function() {
            var statusArray = [{
                    name: "全部",
                    value: "All"
                }, {
                    name: "新增",
                    value: 0
                }, {
                    name: "更新",
                    value: 1
                }, {
                    name: "删除",
                    value: 2
                }, ],
                rootNode = this.$el.find(".dropdown-oper");
            Utility.initDropMenu(rootNode, statusArray, function(value) {
                if (value == "All")
                    this.queryArgs.operateType = null;
                else
                    this.queryArgs.operateType = parseInt(value)
            }.bind(this));

            //"1：用户配置变更 2：拓扑变更",
            var taskType = [{
                    name: "全部",
                    value: "All"
                }, {
                    name: "用户配置变更",
                    value: 1
                }, {
                    name: "拓扑变更",
                    value: 2
                }, {
                    name: "分层策略变更",
                    value: 4
                }],
                rootNode = this.$el.find(".dropdown-task-type");
            Utility.initDropMenu(rootNode, taskType, function(value) {
                if (value == "All")
                    this.queryArgs.configReason = null;
                else
                    this.queryArgs.configReason = parseInt(value)
            }.bind(this));

            var isCustomizeArray = [{
                    name: "全部",
                    value: "All"
                }, {
                    name: "是",
                    value: 0
                }, {
                    name: "否",
                    value: 1
                }, ],
                rootNode = this.$el.find(".dropdown-iscustomize");
            Utility.initDropMenu(rootNode, isCustomizeArray, function(value) {
                if (value == "All")
                    this.queryArgs.status = null;
                else
                    this.queryArgs.status = parseInt(value)
            }.bind(this));

            var pageNum = [{
                name: "10条",
                value: 10
            }, {
                name: "20条",
                value: 20
            }, {
                name: "50条",
                value: 50
            }, {
                name: "3000条",
                value: 3000
            }]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value) {
                this.queryArgs.count = value;
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));

            require(["setupTopoManage.model"], function(SetupTopoManageModel) {
                this.mySetupTopoManageModel = new SetupTopoManageModel();
                this.mySetupTopoManageModel.on("get.topoInfo.success", $.proxy(this.onGetTopoSuccess, this))
                this.mySetupTopoManageModel.on("get.topoInfo.error", $.proxy(this.onGetError, this))
                var postParam = {
                    "name": null,
                    "type": null,
                    "page": 1,
                    "size": 99999
                }
                this.mySetupTopoManageModel.getTopoinfo(postParam);
                this.curTopo = "All";
            }.bind(this))

            require(["setupAppManage.model"], function(SetupAppManageModel) {
                this.mySetupAppManageModel = new SetupAppManageModel();
                this.mySetupAppManageModel.on("get.app.info.success", $.proxy(this.onGetAppSuccess, this))
                this.mySetupAppManageModel.on("get.app.info.error", $.proxy(this.onGetError, this))
                this.mySetupAppManageModel.getAppInfo();
            }.bind(this))

            this.curLayer = "All";
            this.collection.getStrategyList({
                "name": null,
                "type": null,
                "page": 1,
                "size": 99999
            });
            //this.collection.topoSpecialStrategy({t: new Date().valueOf()});
        },

        onGetTopoSuccess: function() {
            var topoArray = [{
                name: "全部",
                value: "All"
            }, {
                name: "默认拓扑",
                value: "default"
            }]
            this.mySetupTopoManageModel.each(function(el, index, lst) {
                topoArray.push({
                    name: el.get('name'),
                    value: el.get('id')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-topo");
            Utility.initDropMenu(rootNode, topoArray, function(value) {
                this.curTopo = value;
                this.filterByTopoAndLayer();
            }.bind(this));
        },

        filterByTopoAndLayer: function() {
            this.collection.each(function(el) {
                el.set("isDisplay", false);
                el.set("isChecked", false);
            }.bind(this))

            var topoDomainArray = [];
            topoId = this.curTopo;

            if (topoId !== "default" && topoId !== "All") {
                topoDomainArray = this.collection.filter(function(obj) {
                    return parseInt(obj.get("topologyId")) === parseInt(topoId)
                }.bind(this));
            } else if (topoId == "All") {
                topoDomainArray = this.collection.models;
            } else {
                topoDomainArray = this.collection.filter(function(obj) {
                    return !obj.get("topologyId")
                }.bind(this));
            }

            var layerDomainArray = [];
            layerId = this.curLayer;

            if (layerId == "All") {
                layerDomainArray = topoDomainArray;
            } else {
                layerDomainArray = topoDomainArray.filter(function(obj) {
                    return parseInt(obj.get("specialStrategyId")) === parseInt(layerId)
                }.bind(this));         
            }
            _.each(layerDomainArray, function(el) {
                el.set("isDisplay", true)
            }.bind(this))
            this.initTable();
        },

        onGetLayerSuccess: function(data) {
            var layerArray = [{
                name: "全部",
                value: "All"
            }]
            _.each(data.rows, function(el, index, lst) {
                layerArray.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-layer");
            Utility.initDropMenu(rootNode, layerArray, function(value) {
                this.curLayer = value;
                this.filterByTopoAndLayer();
            }.bind(this));
        },

        onGetAppSuccess: function() {
            var appArray = [{
                name: "全部",
                value: "All"
            }]
            this.mySetupAppManageModel.each(function(el, index, lst) {
                appArray.push({
                    name: el.get('typeName'),
                    value: el.get('type')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-app");
            Utility.initDropMenu(rootNode, appArray, function(value) {
                var temp = value;
                if (value == "All") temp = null;
                if (this.queryArgs.platformId != temp) {
                    this.curLayer = "All"
                    this.$el.find("#dropdown-layer .cur-value").html("全部");
                    this.filterByTopoAndLayer();
                }
                if (value == "All") {
                    this.queryArgs.platformId = null;
                    this.collection.getStrategyList({
                        "name": null,
                        "type": null,
                        "page": 1,
                        "size": 99999
                    });
                } else {
                    this.queryArgs.platformId = parseInt(value)
                    this.collection.getStrategyList({
                        "name": null,
                        "type": this.queryArgs.platformId,
                        "page": 1,
                        "size": 99999
                    });
                }
            }.bind(this));
        },

        hide: function() {
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(target) {
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target);
            this.target = target;
        }
    });

    return SetupSendWaitSendView;
});