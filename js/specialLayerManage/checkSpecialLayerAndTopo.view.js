define("checkSpecialLayerAndTopo.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {
        var CheckSpecialLayerAndTopoView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.html'])());

                //获取所有的拓扑关系信息
                this.collection.on("get.strategyList.success", $.proxy(this.onGetStrategySuccess, this));
                this.collection.on("get.strategyList.error", $.proxy(this.onGetError, this));
                this.collection.on("delete.strategy.success", $.proxy(this.resetList, this));
                this.collection.on("delete.strategy.error", $.proxy(this.onGetError, this));
               
                this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));
                // else
                //     this.$el.find(".opt-ctn .new").remove();
                this.curPage = 1;
                this.queryArgs = {
                    "name": null,
                    "type": null,
                    "page": 1,
                    "size": 10
                }
                this.collection.getDeviceTypeList();
                this.onClickQueryButton();
            },

            resetList: function() {
                this.curPage = 1;
                this.onClickQueryButton();
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
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            },

            onGetStrategySuccess: function() {
                this.initTable();
                if (!this.isInitPaginator) this.initPaginator();
            },

            onClickQueryButton: function() {
                this.isInitPaginator = false;
                this.queryArgs.page = this.curPage;
                this.queryArgs.name = this.$el.find("#input-topo-name").val();
                if (this.queryArgs.name == "") this.queryArgs.name = null;
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.$el.find(".pagination").html("");
                this.collection.getStrategyList(this.queryArgs);
            },

            initTable: function() {
                this.table = $(_.template(template['tpl/specialLayerManage/specialLayerManage.table.html'])({
                    data: this.collection.models,
                    permission: AUTH_OBJ
                }));
                if (this.collection.models.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .view").on("click", $.proxy(this.onClickItemView, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                this.table.find("tbody .update").on("click", $.proxy(this.onClickItemUpdate, this));
                this.table.find("tbody .copy").on("click", $.proxy(this.onClickItemCopy, this));
                this.table.find("tbody .send").on("click", $.proxy(this.onClickItemSend, this));
                this.table.find("tbody .check").on("click", $.proxy(this.onClickItemCheck, this));

                this.table.find("[data-toggle='popover']").popover();
            },

            onClickItemCheck:function(event){
                var eventTarget = event.srcElement || event.target,id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                
                var model = this.collection.get(id);
                console.log(model);
            },

            onClickItemSend:function(event){
                var eventTarget = event.srcElement || event.target,id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                
                var model = this.collection.get(id);

                // this.domainArray = [{
                //     domain: model.get("name"),
                //     id: model.get("id"),
                //     platformId: model.get("type")                    
                // }];
                // this.showSelectStrategyPopup(model);
                var args = {
                    comment:model.get("type"),
                    ruleId:model.get("id")
                };
                this.collection.strategyUpdate(args);

            },

            showSelectStrategyPopup: function(model) {
                if (this.selectStrategyPopup) $("#" + this.selectStrategyPopup.modalId).remove();

                require(["setupSendWaitCustomize.stratety.view"], function(SelectStrategyView) {
                    var mySelectStrategyView = new SelectStrategyView({
                        collection: this.collection,
                        domainArray: this.domainArray,
                        model: model,
                        source:"specialLayerManage"
                    });
                    //var type = AUTH_OBJ.ApplySendMission ? 2 : 1;
                    var options = {
                        title: "生成下发任务",
                        body: mySelectStrategyView,
                        backdrop: 'static',
                        type: 2,
                        onOKCallback: function() {
                            this.createTaskParam = mySelectStrategyView.onSure();
                            if (!this.createTaskParam) return;
                            console.log(this.createTaskParam);
                            var args = {
                                taskName:this.domainArray[0].platformId,
                                ruleId:this.domainArray[0].id,
                                strategyId:this.createTaskParam.strategyId
                            };
                            console.log(args);
                            this.collection.off("send.success");
                            this.collection.off("send.error");
                            this.collection.on("send.success", $.proxy(this.onSendSuccess, this));
                            this.collection.on("send.error", $.proxy(this.onSendError, this));
                            this.collection.strategyUpdate(args);
                            this.selectStrategyPopup.$el.modal('hide')
                        }.bind(this),
                        onHiddenCallback: function() {
                            this.enterKeyBindQuery();
                        }.bind(this)
                    }
                    this.selectStrategyPopup = new Modal(options);
                }.bind(this))
            },

            onSendSuccess:function(){
                alert("成功");
                window.location.href="#/setupSendWaitSend";
            },

            onSendError:function(data){
                alert(data.message);
            },

            onClickAddRuleTopoBtn: function() {
                this.off('enterKeyBindQuery');
                var myAddEditLayerView = new AddEditLayerView({
                    collection: this.collection,
                    onSaveCallback: function() {
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.onClickQueryButton();
                    }.bind(this),
                    onSaveAndSendCallback: function(res) {
                        var model = new this.collection.model(res);
                        require(['setupTopoManage.update.view'], function(UpdateTopoView) {
                            var myUpdateTopoView = new UpdateTopoView({
                                collection: this.collection,
                                isEdit: false,
                                pageType: 2,
                                model: model,
                                onSaveCallback: function() {}.bind(this),
                                onCancelCallback: function() {
                                    myUpdateTopoView.$el.remove();
                                    this.$el.find(".list-panel").show();
                                }.bind(this)
                            })
                            myAddEditLayerView.$el.remove();
                            myUpdateTopoView.render(this.$el.find(".update-panel"));
                        }.bind(this))
                    }.bind(this),
                    onCancelCallback: function() {
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))
            },

            onClickItemUpdate: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = this.collection.get(id);
                require(['setupTopoManage.update.view'], function(UpdateTopoView) {
                    var myUpdateTopoView = new UpdateTopoView({
                        collection: this.collection,
                        model: model,
                        isEdit: false,
                        pageType: 2,
                        onSaveCallback: function() {}.bind(this),
                        onCancelCallback: function() {
                            myUpdateTopoView.$el.remove();
                            this.$el.find(".list-panel").show();
                        }.bind(this)
                    })

                    this.$el.find(".list-panel").hide();
                    myUpdateTopoView.render(this.$el.find(".update-panel"));
                }.bind(this));
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

                var result = confirm("是否确认删除？");

                if (!result) return;

                this.collection.deleteStrategy({
                    id: id
                })
            },

            onClickItemCopy: function(event) {
                this.off('enterKeyBindQuery');
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = this.collection.get(id);
                var myAddEditLayerView = new AddEditLayerView({
                    collection: this.collection,
                    model: model,
                    isEdit: true,
                    isCopy: true,
                    onSaveCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.onClickQueryButton();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this),
                    onCancelCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))

            },

            onClickItemEdit: function(event) {
                this.off('enterKeyBindQuery');
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = this.collection.get(id);
                var myAddEditLayerView = new AddEditLayerView({
                    collection: this.collection,
                    model: model,
                    isEdit: true,
                    onSaveCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.onClickQueryButton();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this),
                    onSaveAndSendCallback: function() {
                        require(['setupTopoManage.update.view'], function(UpdateTopoView) {
                            var myUpdateTopoView = new UpdateTopoView({
                                collection: this.collection,
                                isEdit: true,
                                pageType: 2,
                                model: model,
                                onSaveCallback: function() {}.bind(this),
                                onCancelCallback: function() {
                                    myUpdateTopoView.$el.remove();
                                    this.$el.find(".list-panel").show();
                                    this.onClickQueryButton();
                                }.bind(this)
                            })
                            myAddEditLayerView.$el.remove();
                            myUpdateTopoView.render(this.$el.find(".update-panel"));
                        }.bind(this))
                    }.bind(this),
                    onCancelCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))
            },

            onClickItemView: function(event) {
                this.off('enterKeyBindQuery');
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = this.collection.get(id);
                var myAddEditLayerView = new AddEditLayerView({
                    collection: this.collection,
                    model: model,
                    isEdit: true,
                    isView: true,
                    onSaveCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.onClickQueryButton();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this),
                    onCancelCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))
            },

            initPaginator: function() {
                this.$el.find(".total-items span").html(this.collection.total)
                if (this.collection.total <= this.queryArgs.size) return;
                var total = Math.ceil(this.collection.total / this.queryArgs.size);
                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: this.curPage,
                    onPageChange: function(num, type) {
                        if (type !== "init") {
                            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                            var args = _.extend(this.queryArgs);
                            args.page = num;
                            args.count = this.queryArgs.size;
                            this.collection.getStrategyList(args);
                            this.curPage = num
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
                    if (el.id !== 200 && el.id !== 201) {
                        typeArray.push({
                            name: el.name,
                            value: el.id
                        });
                    }
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
                    this.curPage = 1;
                    this.onClickQueryButton();
                }.bind(this));
            },

            hide: function() {
                this.$el.hide();
                this.off('enterKeyBindQuery');
            },

            update: function(target) {
                this.collection.off();
                this.collection.reset();
                this.remove();
                this.initialize(this.options);
                this.render(target);
            },

            render: function(target) {
                this.$el.appendTo(target)
            }
        });

        return CheckSpecialLayerAndTopoView;
    });