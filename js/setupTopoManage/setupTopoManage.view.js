define("setupTopoManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var SetupTopoManageView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
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

                if (AUTH_OBJ.QueryTopos) {
                    this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                    this.off('enterKeyBindQuery');
                    this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                    this.enterKeyBindQuery();
                } else {
                    this.$el.find(".opt-ctn .query").remove();
                }
                if (AUTH_OBJ.CreateTopos)
                    this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));
                else
                    this.$el.find(".opt-ctn .new").remove();

                this.queryArgs = {
                    "name": null,
                    "type": null,
                    "page": 1,
                    "size": 10
                }
                this.onClickQueryButton();
                this.collection.getDeviceTypeList();
            },

            enterKeyBindQuery: function() {
                $(document).on('keydown', function(e) {
                    if (e.keyCode == 13) {
                        this.trigger('enterKeyBindQuery');
                    }
                }.bind(this));
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            onGetTopoSuccess: function() {
                this.initTable();
                if (!this.isInitPaginator) this.initPaginator();
            },

            onClickQueryButton: function() {
                this.isInitPaginator = false;
                this.queryArgs.page = 1;
                this.queryArgs.name = this.$el.find("#input-topo-name").val().trim();
                if (this.queryArgs.name == "") this.queryArgs.name = null;
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.$el.find(".pagination").html("");
                this.collection.getTopoinfo(this.queryArgs);
            },

            initTable: function() {
                this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.table.html'])({
                    data: this.collection.models,
                    permission: AUTH_OBJ
                }));
                if (this.collection.models.length !== 0) {
                    this.$el.find(".table-ctn").html(this.table[0]);
                } else {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "暂无数据"
                        }
                    }));
                }

                if (AUTH_OBJ.EditTopos)
                    this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                else
                    this.table.find("tbody .edit").remove();

                this.table.find("tbody .send").on("click", $.proxy(this.onClickItemSend, this));
                this.table.find("tbody .history").on("click", $.proxy(this.onClickItemHistory, this));

                this.table.find("[data-toggle='tooltip']").tooltip();
            },

            onClickAddRuleTopoBtn: function() {
                this.off('enterKeyBindQuery');
                require(['setupTopoManage.edit.view'], function(EditTopoView) {
                    var myEditTopoView = new EditTopoView({
                        collection: this.collection,
                        onSaveCallback: function() {
                            this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                            myEditTopoView.$el.remove();
                            this.$el.find(".list-panel").show();
                            this.onClickQueryButton();
                        }.bind(this),
                        onCancelCallback: function() {
                            this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                            myEditTopoView.$el.remove();
                            this.$el.find(".list-panel").show();
                        }.bind(this)
                    })

                    this.$el.find(".list-panel").hide();
                    myEditTopoView.render(this.$el.find(".edit-panel"))
                }.bind(this));
            },

            onClickItemEdit: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = this.collection.get(id);
                require(['setupTopoManage.edit.view'], function(EditTopoView) {
                    var myEditTopoView = new EditTopoView({
                        collection: this.collection,
                        model: model,
                        isEdit: true,
                        onSaveCallback: function() {
                            myEditTopoView.$el.remove();
                            this.$el.find(".list-panel").show();
                            this.onClickQueryButton();
                            setTimeout($.proxy(this.alertChangeType, this, model), 500);
                        }.bind(this),
                        onCancelCallback: function() {
                            myEditTopoView.$el.remove();
                            this.$el.find(".list-panel").show();
                        }.bind(this)
                    })

                    this.$el.find(".list-panel").hide();
                    myEditTopoView.render(this.$el.find(".edit-panel"));
                }.bind(this));
            },

            alertChangeType: function(model) {
                if (this.commonPopup) $("#" + this.commonPopup.modalId).remove();

                var message = '<div class="alert alert-danger">' +
                    '<strong>重要提示: </strong>' +
                    model.get('name') + '已修改成功，请及时修改下发策略！' +
                    '</div>';
                var options = {
                    title: "警告",
                    body: message,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        this.onClickItemSend(null, model)
                        this.commonPopup.$el.modal('hide');
                    }.bind(this),
                    onCancelCallback: function() {
                        this.commonPopup.$el.modal('hide');
                    }.bind(this)
                }

                this.commonPopup = new Modal(options);
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
                require(['setupTopoManage.history.view'], function(HistoryView) {
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
                    myHistoryView.render(this.$el.find(".history-panel"))
                }.bind(this));
            },

            onClickItemSend: function(event, model) {
                this.off('enterKeyBindQuery');
                var eventTarget, id;
                if (!model) {
                    eventTarget = event.srcElement || event.target
                    if (eventTarget.tagName == "SPAN") {
                        eventTarget = $(eventTarget).parent();
                        id = eventTarget.attr("id");
                    } else {
                        id = $(eventTarget).attr("id");
                    }
                    model = this.collection.get(id);
                }
                require(['setupTopoManageSendStrategy.model', 'setupTopoManageSendStrategy.view'],
                    function(setupTopoManageSendStrategyModel, setupTopoManageSendStrategyView) {
                        var mySendStrategeModel = new setupTopoManageSendStrategyModel();
                        var options = mySendStrategeModel;
                        var mySendView = new setupTopoManageSendStrategyView({
                            collection: options,
                            model: model,
                            onSaveCallback: function() {
                                this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                                mySendView.$el.remove();
                                this.$el.find(".list-panel").show();
                            }.bind(this),
                            onCancelCallback: function() {
                                this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                                mySendView.$el.remove();
                                this.$el.find(".list-panel").show();
                            }.bind(this)
                        })

                        this.$el.find(".list-panel").hide();
                        mySendView.render(this.$el.find(".edit-panel"))
                    }.bind(this));
            },

            initPaginator: function() {
                this.$el.find(".total-items span").html(this.collection.total)
                if (this.collection.total <= this.queryArgs.size) return;
                var total = Math.ceil(this.collection.total / this.queryArgs.size);
                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: 1,
                    onPageChange: function(num, type) {
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

            initDeviceDropMenu: function(res) {
                this.deviceTypeArray = [];
                var typeArray = [{
                        name: '全部',
                        value: 'all'
                    }],
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
                    var rootNode = this.$el.find(".dropdown-app");
                    Utility.initDropMenu(rootNode, typeArray, function(value) {
                        if (value !== "All")
                            this.queryArgs.type = parseInt(value)
                        else
                            this.queryArgs.type = null
                    }.bind(this));
                } else {
                    this.$el.find("#dropdown-app").attr("disabled", "disabled")
                }

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
                    name: "100条",
                    value: 100
                }]
                Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value) {
                    this.queryArgs.size = parseInt(value);
                    this.queryArgs.page = 1;
                    this.onClickQueryButton();
                }.bind(this));
            },

            hide: function() {
                this.$el.hide();
                this.off('enterKeyBindQuery');
            },

            update: function() {
                this.$el.show();
                this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
            },

            render: function(target) {
                this.$el.appendTo(target)
            }
        });

        return SetupTopoManageView;
    });