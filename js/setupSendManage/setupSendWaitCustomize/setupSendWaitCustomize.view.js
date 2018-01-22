define("setupSendWaitCustomize.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SetupSendWaitCustomizeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupSendManage/setupSendWaitCustomize/setupSendWaitCustomize.html'])());
            if (!AUTH_OBJ.BatchSendToWaitSend) {
                this.$el.find('.mulit-send').remove();
            }
            this.initChannelDropMenu();

            this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.channel.error", $.proxy(this.onGetError, this));
            this.collection.on("set.publish.success", $.proxy(this.onPublishSuccess, this));
            this.collection.on("set.publish.error", $.proxy(this.onGetError, this));
            this.collection.on("roll.back.success", $.proxy(this.onRollBackSuccess, this));
            this.collection.on("roll.back.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".mulit-send").on("click", $.proxy(this.onClickMultiSend, this));
            this.$el.find(".mulit-reject").on("click", $.proxy(this.onClickMultiReject, this));

            this.enterKeyBindQuery();

            this.queryArgs = {
                "domain": null,
                "operateType": null,
                "platformId": null,
                "configReason": null,
                "status": 0,
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
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
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

        onClickMultiSend: function() {
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            });

            this.domainArray = [];
            _.each(checkedList, function(el, index, ls) {
                this.domainArray.push({
                    predeliveryId: el.get("id")
                });
            }.bind(this))

            this.collection.publish(this.domainArray)
            this.showDisablePopup("服务器正在努力处理中...")
        },

        onClickMultiReject:function(){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            });

            this.domainArray = [];
            _.each(checkedList, function(el, index, ls) {
                this.domainArray.push({
                    predeliveryId: el.get("id")
                });
            }.bind(this))

            //this.collection.rollBack(this.domainArray)
            this.showDisablePopup("服务器正在努力处理中...")
        },

        onPublishSuccess: function() {
            this.disablePopup && this.disablePopup.$el.modal('hide');
            Utility.alerts("操作成功！", "success", 3000);
            this.update(this.target)
        },

        onRollBackSuccess: function() {
            Utility.alerts("操作成功！", "success", 3000);
            this.update(this.target)
        },

        onClickQueryButton: function() {
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.domain = this.$el.find("#input-domain").val().trim();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.queryChannel(this.queryArgs);
        },

        initTable: function() {
            this.$el.find(".mulit-send").attr("disabled", "disabled");
            this.$el.find(".mulit-reject").attr("disabled", "disabled");
            this.table = $(_.template(template['tpl/setupSendManage/setupSendWaitCustomize/setupSendWaitCustomize.table.html'])({
                data: this.collection.models,
                permission: AUTH_OBJ
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .send").on("click", $.proxy(this.onClickItemSend, this));
            this.table.find("tbody .reject").on("click", $.proxy(this.onClickItemReject, this));

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));

            this.table.find(".remark").popover();
        },

        onClickItemSend: function(event) {
            Utility.confirm("你确定要发布到待下发吗？", function(e){
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");

                this.domainArray = [{
                    predeliveryId: id
                }];

                this.collection.publish(this.domainArray)
            }.bind(this))
        },

        onClickItemReject: function(event) {
            Utility.confirm("你确定要打回吗？", function(e){
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");

                this.collection.rollBack({
                    predeliveryId: id
                })
            }.bind(this));
        },

        onClickItemEdit: function(event) {
            require(['setupChannelManage.edit.view'], function(EditChannelView) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");

                var model = this.collection.get(id);

                var myEditChannelView = new EditChannelView({
                    collection: this.collection,
                    model: model,
                    isEdit: true,
                    isFromSend: true,
                    onSaveCallback: function() {}.bind(this),
                    onCancelCallback: function() {
                        myEditChannelView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                if (!AUTH_OBJ.ApplyEditCustomize) {
                    myEditChannelView.$el.find('.save').remove();
                }
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
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
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

            //  require(["setupTopoManage.model"], function(SetupTopoManageModel){
            //     this.mySetupTopoManageModel = new SetupTopoManageModel();
            //     this.mySetupTopoManageModel.on("get.topoInfo.success", $.proxy(this.onGetTopoSuccess, this))
            //     this.mySetupTopoManageModel.on("get.topoInfo.error", $.proxy(this.onGetError, this))
            //     var postParam = {
            //         "name" : null,
            //         "type" : null,
            //         "page" : 1,
            //         "size" : 99999
            //      }
            //     this.mySetupTopoManageModel.getTopoinfo(postParam);
            // }.bind(this))

            require(["setupAppManage.model"], function(SetupAppManageModel) {
                this.mySetupAppManageModel = new SetupAppManageModel();
                this.mySetupAppManageModel.on("get.app.info.success", $.proxy(this.onGetAppSuccess, this))
                this.mySetupAppManageModel.on("get.app.info.error", $.proxy(this.onGetError, this))
                this.mySetupAppManageModel.getAppInfo();
            }.bind(this))
        },

        onGetTopoSuccess: function() {
            var topoArray = []
            this.mySetupTopoManageModel.each(function(el, index, lst) {
                topoArray.push({
                    name: el.get('name'),
                    value: el.get('id')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-topo");
            Utility.initDropMenu(rootNode, topoArray, function(value) {
                // if (value == "All")
                //     this.queryArgs.status = null;
                // else
                //     this.queryArgs.status = parseInt(value)
            }.bind(this));
        },

        onGetAppSuccess: function() {
            var appArray = [{
                name: "全部",
                value: "All"
            }, ]
            this.mySetupAppManageModel.each(function(el, index, lst) {
                appArray.push({
                    name: el.get('typeName'),
                    value: el.get('type')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-app");
            Utility.initDropMenu(rootNode, appArray, function(value) {
                if (value == "All")
                    this.queryArgs.platformId = null;
                else
                    this.queryArgs.platformId = parseInt(value)
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

    return SetupSendWaitCustomizeView;
});