define("nodeManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var NodeManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;

            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.html'])());

            this.initNodeDropMenu();

            this.collection.on("get.node.success", $.proxy(this.onNodeListSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            this.collection.on("add.node.success", function() {
                alert("添加成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.node.error", $.proxy(this.onGetError, this));
            this.collection.on("update.node.success", function() {
                alert("编辑成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.node.error", $.proxy(this.onGetError, this));
            this.collection.on("delete.node.success", function() {
                alert("删除成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("delete.node.error", $.proxy(this.onGetError, this));
            this.collection.on("update.node.status.success", function() {
                alert("操作成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.node.status.error", $.proxy(this.onGetError, this));
            this.collection.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));

            this.collection.on("operate.node.success", $.proxy(this.onOperateNodeSuccess, this));
            this.collection.on("operate.node.error", function(res) {
                this.disablePopup && this.disablePopup.$el.modal('hide');
                this.onGetError(res)
            }.bind(this));

            this.collection.on("add.assocateDispGroups.success", function() {
                alert("操作成功！")
            }.bind(this));
            this.collection.on("add.assocateDispGroups.error", $.proxy(this.onGetError, this));

            if (AUTH_OBJ.CreateNode)
                this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
            else
                this.$el.find(".opt-ctn .create").remove();
            if (AUTH_OBJ.QueryNode) {
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                this.enterKeyBindQuery();
            } else {
                this.$el.find(".opt-ctn .query").remove();
            }
            if (AUTH_OBJ.EnableorPauseNode)
                this.$el.find(".opt-ctn .multi-play").on("click", $.proxy(this.onClickMultiPlay, this));
            else
                this.$el.find(".opt-ctn .multi-play").remove();
            this.$el.find(".opt-ctn .multi-stop").on("click", $.proxy(this.onClickMultiStop, this));
            this.$el.find(".opt-ctn .multi-delete").on("click", $.proxy(this.onClickMultiDelete, this));

            this.queryArgs = {
                "page": 1,
                "count": 10,
                "chname": null, //节点名称
                "operator": null, //运营商id
                "status": null //节点状态
            }
            this.onClickQueryButton();
        },

        enterKeyBindQuery: function() {
            $(document).on('keydown', function(e) {
                if (e.keyCode == 13) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onNodeListSuccess: function() {
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function() {
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.chname = this.$el.find("#input-name").val().trim() || null;
            this.collection.getNodeList(this.queryArgs);
        },

        onClickCreate: function() {
            this.hideList();
            if (this.addNodeView) {
                this.addNodeView.destroy();
                this.addNodeView = null;
            }
            require(["nodeManage.edit.view"], function(AddOrEditNodeView) {
                this.addNodeView = new AddOrEditNodeView({
                    collection: this.collection,
                    operatorList: this.operatorList,
                    showList: function() {
                        this.showList();
                    }.bind(this),
                    onHiddenCallback: function() {
                        this.showList();
                        if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                    }.bind(this),
                    onOKCallback: function() {
                        var options = this.addNodeView.getArgs();
                        if (!options) return;
                        this.collection.addNode(options);
                        this.showList();
                        if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                    }.bind(this)
                });
                this.addNodeView.render(this.$el.find(".node-manage-add-edit-pannel"));
                if (!AUTH_OBJ.ApplyCreateNode) addNodeView.$el.find(".btn-primary").remove();
            }.bind(this))
        },

        showList: function() {
            this.$el.find(".node-manage-list-pannel").show();
        },

        hideList: function() {
            this.$el.find(".node-manage-list-pannel").hide();
        },

        nameList: {
            1: "95峰值",
            2: "包端口",
            3: "峰值",
            4: "第三峰"
        },

        initTable: function() {
            var nameList = this.nameList;
            this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");
            _.each(this.collection.models, function(item) {
                var _rsNodeCorpDtos = item.attributes.rsNodeCorpDtos && item.attributes.rsNodeCorpDtos.length > 0 && item.attributes.rsNodeCorpDtos || null;
                if (_rsNodeCorpDtos) {
                    _.each(_rsNodeCorpDtos, function(i) {
                        i.chargingTypeName = nameList[i.chargingType];
                    })
                }
            })
            this.table = $(_.template(template['tpl/nodeManage/nodeManage.table.html'])({
                data: this.collection.models,
                permission: AUTH_OBJ
            }));
            if (this.collection.models.length !== 0) {
                this.$el.find(".table-ctn").html(this.table[0]);
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .node-name").on("click", $.proxy(this.onClickItemNodeName, this));
                if (AUTH_OBJ.DeleteNode)
                    this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                else
                    this.table.find("tbody .delete").remove();
                this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
                this.table.find("tbody .hangup").on("click", $.proxy(this.onClickItemHangup, this));
                this.table.find("tbody .operateDetail").on("click", $.proxy(this.onClickDetail, this));
                this.table.find("tbody .stop").on("click", $.proxy(this.onClickItemStop, this));
                this.table.find("tbody .disp-info").on("click", $.proxy(this.onClickDispGroupInfo, this));

                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));

                this.table.find("[data-toggle='popover']").popover();
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickDispGroupInfo: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.dispGroupPopup) $("#" + this.dispGroupPopup.modalId).remove();

            require(["nodeManage.dispInfo.view"], function(DispGroupInfoView) {
                var dispGroupInfoView = new DispGroupInfoView({
                    collection: this.collection,
                    model: model,
                    isEdit: true
                });
                var options = {
                    title: model.get("chName") + "关联调度组信息",
                    body: dispGroupInfoView,
                    backdrop: 'static',
                    type: 2,
                    width: 800,
                    height: 500,
                    onOKCallback: function() {
                        var options = dispGroupInfoView.getArgs();
                        if (!options) return;
                        this.collection.addAssocateDispGroups(options, model.get("id"))
                        this.dispGroupPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function() {
                        this.enterKeyBindQuery();
                    }.bind(this)
                }
                this.dispGroupPopup = new Modal(options);
                if (!AUTH_OBJ.NodeAssociatetoGslbGroup)
                    this.dispGroupPopup.$el.find(".btn-primary").remove();
            }.bind(this));
        },

        onClickItemNodeName: function(event) {
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id"),
                model = this.collection.get(id),
                args = {
                    nodeId: id,
                    chName: model.get("chName")
                }
            window.location.hash = "#/deviceManage/" + JSON.stringify(args)
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

            this.hideList();
            if (this.editNodeView) {
                this.editNodeView.destroy();
                this.editNodeView = null;
            }

            require(["nodeManage.edit.view"], function(AddOrEditNodeView) {
                this.editNodeView = new AddOrEditNodeView({
                    collection: this.collection,
                    model: model,
                    isEdit: true,
                    operatorList: this.operatorList,
                    showList: function() {
                        //show当前列表
                        this.showList();
                    }.bind(this),
                    onHiddenCallback: function() {
                        this.showList();
                        if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                    }.bind(this),
                    onOKCallback: function() {
                        var options = this.editNodeView.getArgs();
                        if (!options) return;
                        var args = _.extend(model.attributes, options)
                        this.collection.updateNode(args);
                        this.showList();
                        if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                    }.bind(this)
                });
                this.editNodeView.render(this.$el.find(".node-manage-add-edit-pannel"));
                if (!AUTH_OBJ.ApplyCreateNode) this.editNodeView.$el.find(".btn-primary").remove();
            }.bind(this))
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
            var model = this.collection.get(id);

            if (this.deleteNodeTipsPopup) $("#" + this.deleteNodeTipsPopup.modalId).remove();

            require(["nodeManage.operateDetail.view"], function(NodeTips) {
                var deleteNodeTips = new NodeTips({
                    type: 1,
                    model: model,
                    placeHolder: "请输入删除的原因,并请您谨慎操作，一旦删除，不可恢复"
                });
                var options = {
                    title: "你确定要删除节点<span class='text-danger'>" + model.attributes.name + "</span>吗？删除后将不可恢复, 请谨慎操作！",
                    body: deleteNodeTips,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var options = deleteNodeTips.getArgs();
                        if (!options) return;
                        this.collection.deleteNode({
                            id: parseInt(id),
                            opRemark: options.opRemark
                        })
                        this.deleteNodeTipsPopup.$el.modal("hide");
                    }.bind(this)
                }
                this.deleteNodeTipsPopup = new Modal(options);
            }.bind(this));
        },

        onClickItemPlay: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);

            if (this.promptPopup) $("#" + this.promptPopup.modalId).remove();

            require(["nodeManage.prompt.view"], function(PromptView) {
                var myPromptView = new PromptView({
                    collection: this.collection,
                    model: model
                });
                var options = {
                    title: "开启节点",
                    body: myPromptView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var options = myPromptView.onSure();
                        if (!options) return;
                        this.collection.operateNode({
                            opRemark:'',
                            nodeId: id,
                            operator: 1,
                            t: new Date().valueOf()
                        })
                        this.promptPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function() {
                        this.enterKeyBindQuery();
                    }.bind(this)
                }
                this.promptPopup = new Modal(options);
            }.bind(this));
        },

        onClickMultiPlay: function(event) {
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list) {
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            this.collection.updateNodeStatus({
                ids: ids,
                status: 1
            })
        },

        onClickItemHangup: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var result = confirm("你确定要挂起节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({
                ids: [parseInt(id)],
                status: 2
            })
        },

        onClickDetail: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            if (this.detailTipsPopup) $("#" + this.detailTipsPopup.modalId).remove();

            require(["nodeManage.operateDetail.view"], function(NodeTips) {
                var detailTipsView = new NodeTips({
                    type: 2,
                    model: model
                });
                var options = {
                    title: "操作说明",
                    body: detailTipsView,
                    backdrop: 'static',
                    type: 1,
                    onHiddenCallback: function() {

                    }.bind(this)
                }
                this.nodeTipsPopup = new Modal(options);
            }.bind(this));
        },

        onClickItemStop: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);
            if (this.nodeTipsPopup) $("#" + this.nodeTipsPopup.modalId).remove();
            
            require(["nodeManage.operateDetail.view"], function(NodeTips) {
                var stopNodeView = new NodeTips({
                    type: 1,
                    model: model
                });
                var options = {
                    title: "暂停节点操作",
                    body: stopNodeView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var options = stopNodeView.getArgs();
                        if (!options) return;
                        this.currentPauseNodeId = id;
                        this.collection.operateNode({
                            opRemark: options.opRemark,
                            nodeId: id,
                            operator: -1,
                            t: new Date().valueOf()
                        })
                        this.nodeTipsPopup.$el.modal("hide");
                        this.showDisablePopup("服务端正在努力暂停中...")
                    }.bind(this),
                    onHiddenCallback: function() {

                    }.bind(this)
                }
                this.nodeTipsPopup = new Modal(options);
            }.bind(this));
        },


        onOperateNodeSuccess: function(res) {
            this.disablePopup && this.disablePopup.$el.modal('hide');
            if (res.msg == "1" && res.status === 200) {
                alert("操作成功！")
                this.onClickQueryButton();
            } else if (res.msg == "-1" && res.status === 200) {
                require(["dispSuggesttion.view", "dispSuggesttion.model"], function(DispSuggesttionViews, DispSuggesttionModel) {
                    this.onRequireDispSuggesttionModule(DispSuggesttionViews, DispSuggesttionModel, this.currentPauseNodeId)
                }.bind(this))
            } else {
                alert("操作失败！")
                this.onClickQueryButton();
            }
        },

        onRequireDispSuggesttionModule: function(DispSuggesttionViews, DispSuggesttionModel, nodeId) { //
            if (!this.dispSuggesttionFailModel)
                this.dispSuggesttionFailModel = new DispSuggesttionModel();
            this.hide();
            var options = {
                nodeId: nodeId,
                collection: this.dispSuggesttionFailModel,
                backCallback: $.proxy(this.backFromDispSuggesttion, this)
            };
            this.dispSuggesttionView = new DispSuggesttionViews.DispSuggesttionView(options);
            this.dispSuggesttionView.render($('.ksc-content'));
        },

        backFromDispSuggesttion: function() {
            this.dispSuggesttionView.remove();
            this.dispSuggesttionView = null;
            this.dispSuggesttionFailModel = null;
            this.update();
        },

        onClickMultiStop: function(event) {
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list) {
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            var result = confirm("你确定要批量关闭选择的节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({
                ids: ids,
                status: 3
            })
        },

        onClickMultiDelete: function(event) {
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list) {
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            var result = confirm("你确定要批量删除选择的节点吗？")
            if (!result) return
            alert(ids.join(",") + "。接口不支持，臣妾做不到啊！");
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
                        this.collection.getNodeList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function() {
            var statusArray = [{
                    name: "全部",
                    value: "All"
                }, {
                    name: "运行",
                    value: 1
                }, {
                    name: "挂起",
                    value: 2
                }, {
                    name: "暂停",
                    value: 4
                }, {
                    name: "关闭",
                    value: 3
                }],
                rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value) {
                if (value !== "All")
                    this.queryArgs.status = parseInt(value);
                else
                    this.queryArgs.status = null;
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
                name: "100条",
                value: 100
            }]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value) {
                this.queryArgs.count = value;
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));

            this.collection.getOperatorList();
        },

        onGetOperatorSuccess: function(res) {
            this.operatorList = res.rows;
            var nameList = [{
                name: "全部",
                value: "All"
            }];
            _.each(res.rows, function(el, index, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), nameList, function(value) {
                if (value !== "All")
                    this.queryArgs.operator = parseInt(value)
                else
                    this.queryArgs.operator = null;
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
                this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");
            } else {
                this.$el.find(".opt-ctn .multi-delete").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").removeAttr("disabled", "disabled");
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
                this.$el.find(".opt-ctn .multi-delete").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            }
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

        hide: function() {
            if (this.dispSuggesttionView) {
                this.dispSuggesttionView.remove();
                this.dispSuggesttionView = null;
                this.dispSuggesttionFailModel = null;
            }
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function() {
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(this.target);
        },

        render: function(target) {
            this.$el.appendTo(target)
            this.target = target
        }
    });

    return NodeManageView;
});