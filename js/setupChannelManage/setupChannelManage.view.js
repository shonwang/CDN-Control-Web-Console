define("setupChannelManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var SetupChannelManageView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.html'])());


                if (!AUTH_OBJ.QueryDomain) {
                    this.$el.find('.query').remove();
                }
                if (!AUTH_OBJ.ChangeTopo) {
                    this.$el.find(".multi-modify-topology").remove();
                }

                this.initChannelDropMenu();

                this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
                this.collection.on("get.channel.error", $.proxy(this.onGetError, this));

                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                this.$el.find(".multi-modify-topology").on("click", $.proxy(this.onClickMultiModifyTopology, this))
                this.$el.find(".multi-modify-layer").on("click", $.proxy(this.onClickMultiModifyLayer, this))
                this.enterKeyBindQuery();

                this.queryArgs = {
                    "domain": null,
                    "type": null,
                    "protocol": null,
                    "cdnFactory": null,
                    "auditStatus": null,
                    "topologyId": null,
                    "roleId": null,
                    "currentPage": 1,
                    "pageSize": 10
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
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            onChannelListSuccess: function() {
                this.initTable();
                if (!this.isInitPaginator) this.initPaginator();
            },

            onClickQueryButton: function() {
                this.isInitPaginator = false;
                this.queryArgs.currentPage = 1;
                this.queryArgs.domain = this.$el.find("#input-domain").val();
                if (this.queryArgs.domain == "") this.queryArgs.domain = null;
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.$el.find(".pagination").html("");
                this.collection.queryChannel(this.queryArgs);
            },

            initTable: function() {
                this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
                this.$el.find(".multi-modify-layer").attr("disabled", "disabled");
                this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.table.html'])({
                    data: this.collection.models,
                    permission: AUTH_OBJ
                }));

                if (!AUTH_OBJ.EditDomain) {
                    this.table.find('.edit').remove();
                }
                if (!AUTH_OBJ.ManageSpecialUpstreamStrategy) {
                    this.table.find('.strategy').remove();
                }
                if (!AUTH_OBJ.DomainConfigHistory) {
                    this.table.find('.history').remove();
                }

                if (this.collection.models.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .strategy").on("click", $.proxy(this.onClickItemSpecialLayer, this));
                this.table.find("tbody .history").on("click", $.proxy(this.onClickItemHistory, this));

                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));

                this.table.find(".remark").popover();
            },

            onClickMultiModifyTopology: function() {
                require(["setupChannelManage.select.view"], function(setupChannelManageSelectView) {
                    var checkedList = this.collection.filter(function(model) {
                        return model.get("isChecked") === true;
                    });

                    this.domainArray = [];
                    _.each(checkedList, function(el, index, ls) {
                        this.domainArray.push({
                            domain: el.get("domain"),
                            version: el.get("version"),
                            description: el.get("description"),
                            id: el.get("id")
                        });
                    }.bind(this))

                    if (this.selectTopoPopup) $("#" + this.selectTopoPopup.modalId).remove();

                    var type = AUTH_OBJ.ApplyChangeTopo ? 2 : 1;
                    var mySelectTopoView = new setupChannelManageSelectView.SelectTopoView({
                        collection: this.collection,
                        domainArray: this.domainArray
                    });
                    var options = {
                        title: "选择拓扑关系",
                        body: mySelectTopoView,
                        backdrop: 'static',
                        type: type,
                        onOKCallback: function() {
                            var result = mySelectTopoView.onSure();
                            if (!result) return;
                            this.collection.off("add.channel.topology.success");
                            this.collection.off("add.channel.topology.error");
                            this.collection.on("add.channel.topology.success", $.proxy(this.onAddChannelTopologySuccess, this));
                            this.collection.on("add.channel.topology.error", $.proxy(this.onGetError, this));
                            this.collection.addTopologyList(result)
                            this.selectTopoPopup.$el.modal("hide");
                            this.showDisablePopup("服务器正在努力处理中...")
                        }.bind(this),
                        onHiddenCallback: function() {
                            this.enterKeyBindQuery();
                        }.bind(this)
                    }
                    this.selectTopoPopup = new Modal(options);
                }.bind(this));
            },

            onClickMultiModifyLayer: function() {
                require(["setupChannelManage.select.view"], function(setupChannelManageSelectView) {
                    var checkedList = this.collection.filter(function(model) {
                        return model.get("isChecked") === true;
                    });

                    this.domainArray = [];
                    _.each(checkedList, function(el, index, ls) {
                        this.domainArray.push({
                            domain: el.get("domain"),
                            version: el.get("version"),
                            description: el.get("description"),
                            id: el.get("id")
                        });
                    }.bind(this))

                    if (this.selectLayerPopup) $("#" + this.selectLayerPopup.modalId).remove();

                    //var type = AUTH_OBJ.ApplyChangeTopo ? 2 : 1;
                    var mySelectLayerView = new setupChannelManageSelectView.SelectLayerView({
                        collection: this.collection,
                        domainArray: this.domainArray
                    });
                    var options = {
                        title: "选择分层策略",
                        body: mySelectLayerView,
                        backdrop: 'static',
                        type: 2,
                        onOKCallback: function() {
                            var result = mySelectLayerView.onSure();
                            if (!result) return;
                            this.collection.off("set.layerStrategy.success");
                            this.collection.off("set.layerStrategy.error");
                            this.collection.on("set.layerStrategy.success", $.proxy(this.onAddChannelTopologySuccess, this));
                            this.collection.on("set.layerStrategy.error", $.proxy(this.onGetError, this));
                            this.collection.addTopologyRuleList(result)
                            this.selectLayerPopup.$el.modal("hide");
                            this.showDisablePopup("服务器正在努力处理中...")
                        }.bind(this),
                        onHiddenCallback: function() {
                            this.enterKeyBindQuery();
                        }.bind(this)
                    }
                    this.selectLayerPopup = new Modal(options);
                }.bind(this));
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

            onAddChannelTopologySuccess: function() {
                var postParam = [];
                _.each(this.domainArray, function(el, index, ls) {
                    postParam.push({
                        domain: el.domain,
                        version: el.version,
                        description: el.description,
                        configReason: 2
                    });
                }.bind(this))

                this.collection.off("post.predelivery.success");
                this.collection.off("post.predelivery.error");
                this.collection.on("post.predelivery.success", $.proxy(this.onPostPredelivery, this));
                this.collection.on("post.predelivery.error", $.proxy(this.onGetError, this));
                this.collection.predelivery(postParam)
            },

            onPostPredelivery: function() {
                this.disablePopup && this.disablePopup.$el.modal('hide');
                alert("批量更换拓扑关系成功！")

                window.location.hash = '#/setupSendWaitSend';
            },

            onClickItemHistory: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                var model = this.collection.get(id);
                require(["setupChannelManage.history.view"], function(HistoryView) {
                    var myHistoryView = new HistoryView({
                        collection: this.collection,
                        model: model,
                        onSaveCallback: function() {}.bind(this),
                        onCancelCallback: function() {
                            myHistoryView.$el.remove();
                            this.$el.find(".list-panel").show();
                        }.bind(this)
                    })

                    this.$el.find(".list-panel").hide();
                    myHistoryView.render(this.$el.find(".history-panel"));
                }.bind(this));
            },

            onClickItemSpecialLayer: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                var model = this.collection.get(id);

                if (model.get('topologyId') == null) {
                    alert('该域名未指定拓扑关系，无法添加特殊分层策略');
                    return;
                }

                require(["setupChannelManage.specialLayer.view"], function(SpecialLayerManageView) {
                    var mySpecialLayerManageView = new SpecialLayerManageView({
                        collection: this.collection,
                        model: model,
                        isEdit: true,
                        onSaveCallback: function() {
                            this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                            mySpecialLayerManageView.$el.remove();
                            this.$el.find(".list-panel").show();
                            this.onClickQueryButton();
                            this.initRuleTable(data, this.checked);
                        }.bind(this),
                        onCancelCallback: function() {
                            mySpecialLayerManageView.$el.remove();
                            this.$el.find(".list-panel").show();
                        }.bind(this)
                    })

                    this.$el.find(".list-panel").hide();
                    mySpecialLayerManageView.render(this.$el.find(".strategy-panel"))
                }.bind(this));
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
                    this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
                    this.$el.find(".multi-modify-layer").attr("disabled", "disabled");
                } else {
                    this.$el.find(".multi-modify-topology").removeAttr("disabled", "disabled");
                    this.$el.find(".multi-modify-layer").removeAttr("disabled", "disabled");
                }
            },

            onAllCheckedUpdated: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                this.collection.each(function(model) {
                    model.set("isChecked", eventTarget.checked);
                }.bind(this))
                this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
                if (eventTarget.checked) {
                    this.$el.find(".multi-modify-topology").removeAttr("disabled", "disabled");
                    this.$el.find(".multi-modify-layer").removeAttr("disabled", "disabled");
                } else {
                    this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
                    this.$el.find(".multi-modify-layer").attr("disabled", "disabled");
                }
            },

            initPaginator: function() {
                this.$el.find(".total-items span").html(this.collection.total)

                if (this.collection.total <= this.queryArgs.pageSize) return;
                var total = Math.ceil(this.collection.total / this.queryArgs.pageSize);

                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: 1,
                    onPageChange: function(num, type) {
                        if (type !== "init") {
                            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                            var args = _.extend(this.queryArgs);
                            args.currentPage = num;
                            args.pageSize = this.queryArgs.pageSize;
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
                        name: "删除",
                        value: -1
                    }, {
                        name: "审核中",
                        value: 0
                    }, {
                        name: "审核通过",
                        value: 1
                    }, {
                        name: "审核失败",
                        value: 2
                    }, {
                        name: "停止",
                        value: 3
                    }, {
                        name: "配置中",
                        value: 4
                    }, {
                        name: "编辑中",
                        value: 6
                    }, {
                        name: "待下发",
                        value: 7
                    }, {
                        name: "待定制",
                        value: 8
                    }, {
                        name: "定制化配置错误",
                        value: 9
                    }, {
                        name: "下发中",
                        value: 10
                    }, {
                        name: "下发失败",
                        value: 11
                    }, {
                        name: "下发成功",
                        value: 12
                    }, {
                        name: "运行中",
                        value: 13
                    }, {
                        name: "配置失败",
                        value: 14
                    }],
                    rootNode = this.$el.find(".dropdown-status");
                Utility.initDropMenu(rootNode, statusArray, function(value) {
                    if (value == "All")
                        this.queryArgs.auditStatus = null;
                    else
                        this.queryArgs.auditStatus = parseInt(value)
                }.bind(this));

                var protocolArray = [{
                        name: "全部",
                        value: "All"
                    }, {
                        name: "http+hlv",
                        value: 1
                    }, {
                        name: "hls",
                        value: 2
                    }, {
                        name: "rtmp",
                        value: 3
                    }],
                    rootNode = this.$el.find(".dropdown-protocol");
                Utility.initDropMenu(rootNode, protocolArray, function(value) {
                    if (value == "All")
                        this.queryArgs.protocol = null;
                    else
                        this.queryArgs.protocol = parseInt(value)
                }.bind(this));

                var companyArray = [{
                        name: "全部",
                        value: "All"
                    }, {
                        name: "自建",
                        value: 1
                    }, {
                        name: "网宿",
                        value: 2
                    }],
                    rootNode = this.$el.find(".dropdown-company");
                Utility.initDropMenu(rootNode, companyArray, function(value) {
                    if (value == "All")
                        this.queryArgs.cdnFactory = null;
                    else
                        this.queryArgs.cdnFactory = parseInt(value)
                }.bind(this));

                var typeArray = [{
                        name: "全部",
                        value: "All"
                    }, {
                        name: "下载加速",
                        value: 1
                    }, {
                        name: "直播加速",
                        value: 2
                    }],
                    rootNode = this.$el.find(".dropdown-type");
                Utility.initDropMenu(rootNode, typeArray, function(value) {
                    if (value == "All")
                        this.queryArgs.type = null;
                    else
                        this.queryArgs.type = parseInt(value)
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
                    this.queryArgs.pageSize = value;
                    this.queryArgs.currentPage = 1;
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
                }.bind(this))

                require(["specialLayerManage.model"], function(SpecialLayerManage) {
                    this.mySpecialLayerManage = new SpecialLayerManage();
                    this.mySpecialLayerManage.on("get.strategyList.success", $.proxy(this.onGetLayerSuccess, this))
                    this.mySpecialLayerManage.on("get.strategyList.error", $.proxy(this.onGetError, this))
                    var postParam = {
                        "name": null,
                        "type": null,
                        "page": 1,
                        "size": 99999
                    }
                    this.mySpecialLayerManage.getStrategyList(postParam);
                }.bind(this))
            },

            onGetLayerSuccess: function() {
                var topoArray = [{
                    name: "全部",
                    value: "All"
                },{
                    name: "没有分层策略",
                    value: -1
                }]
                this.mySpecialLayerManage.each(function(el, index, lst) {
                    topoArray.push({
                        name: el.get('name'),
                        value: el.get('id')
                    })
                }.bind(this))

                rootNode = this.$el.find(".dropdown-layer");
                Utility.initDropMenu(rootNode, topoArray, function(value) {
                    if (value == "All")
                        this.queryArgs.roleId = null;
                    else
                        this.queryArgs.roleId = parseInt(value)
                }.bind(this));
            },

            onGetTopoSuccess: function() {
                var topoArray = [{
                    name: "全部",
                    value: "All"
                }]
                this.mySetupTopoManageModel.each(function(el, index, lst) {
                    topoArray.push({
                        name: el.get('name'),
                        value: el.get('id')
                    })
                }.bind(this))

                rootNode = this.$el.find(".dropdown-topo");
                Utility.initDropMenu(rootNode, topoArray, function(value) {
                    if (value == "All")
                        this.queryArgs.topologyId = null;
                    else
                        this.queryArgs.topologyId = parseInt(value)
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
                this.render(target || this.target);
            },

            render: function(target) {
                this.$el.appendTo(target);
                this.target = target;
            }
        });

        return SetupChannelManageView
    });