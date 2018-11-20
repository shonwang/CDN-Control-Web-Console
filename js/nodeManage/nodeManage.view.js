define("nodeManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var NodeManageView = Backbone.View.extend({
            events: {},
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/nodeManage/nodeManage.html'])());
        
                this.initNodeDropMenu();
                // this.initNodeTypeDropMenu();

                this.collection.on("update.remark.success", $.proxy(this.onUpdateRemarkSuccess, this));
                this.collection.on("update.remark.error", $.proxy(this.onGetError, this));

                this.collection.on("get.node.success", $.proxy(this.onNodeListSuccess, this));
                this.collection.on("get.node.error", $.proxy(this.onGetError, this));
                this.collection.on("add.node.success", function() {
                    Utility.alerts("添加成功！", "success", 5000)
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on("add.node.error", $.proxy(this.onGetError, this));
                this.collection.on("update.node.success", function() {
                    Utility.alerts("编辑成功！", "success", 5000)
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on("update.node.error", function(error){
                    this.onGetError(error);
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on("delete.node.success", function() {
                    Utility.alerts("删除成功！", "success", 5000)
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on("delete.node.error", $.proxy(this.onGetError, this));
                this.collection.on("update.node.status.success", function() {
                    Utility.alerts("操作成功！", "success", 5000)
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on("update.node.status.error", $.proxy(this.onGetError, this));

                this.collection.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
                this.collection.on("get.operator.error", $.proxy(this.onGetError, this));

                this.collection.on("get.area.success", $.proxy(this.onGetLargeAreaSuccess, this));
                this.collection.on("get.area.error", $.proxy(this.onGetError, this));

                this.collection.on("get.operate.type.success", $.proxy(this.onGetOperateTypeListSuccess, this));
                this.collection.on("get.operate.type.error", $.proxy(this.onGetError, this));

                this.collection.on("get.province.success", $.proxy(this.onGetProvinceSuccess, this));
                this.collection.on("get.province.error", $.proxy(this.onGetError, this));
                //查询共享出口的相关信息
                this.collection.on("get.getAssociationNodeInfo.success", $.proxy(this.onGetNodeIdInfoSuccess, this));
                this.collection.on("get.getAssociationNodeInfo.error", $.proxy(this.onGetError, this));

                this.collection.on("operate.node.success", $.proxy(this.onOperateNodeSuccess, this));
                this.collection.on("operate.node.error", function(res) {
                    this.disablePopup && this.disablePopup.$el.modal('hide');
                    this.onGetError(res)
                }.bind(this));

                this.collection.on("add.assocateDispGroups.success", function() {
                    Utility.alerts("操作成功！", "success", 5000)
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
                    "status": null, //节点状态
                    "appType": null, //节点类型
                    "provinceId": null, //省份名称
                    "areaId": null, //大区名称
                    "opType": null,
                    "tags":null,//共享出口的节点tag
                    "liveLevel": null,//直播层级，没有就null
                    "cacheLevel": null
                }
                this.tableColumn = [{
                    name: "运营商",
                    isChecked: true,
                    isMultiRows: true,
                    key: "operatorName"
                }, {
                    name: "上联带宽",
                    isChecked: false,
                    isMultiRows: true,
                    key: "maxBandwidth"
                }, {
                    name: "保底带宽",
                    isChecked: false,
                    isMultiRows: true,
                    key: "minBandwidth"
                }, {
                    name: "成本权值",
                    isChecked: false,
                    isMultiRows: true,
                    key: "unitPrice"
                }, {
                    name: "上联带宽阈值",
                    isChecked: false,
                    isMultiRows: true,
                    key: "maxBandwidthThreshold"
                }, {
                    name: "保底带宽阈值",
                    isChecked: false,
                    isMultiRows: true,
                    key: "minBandwidthThreshold"
                },
                    {
                    name: "计费类型",
                    isChecked: true,
                    isMultiRows: true,
                    key: "chargingTypeName"
                }, {
                    name: "状态",
                    isChecked: true,
                    key: "statusName"
                }, {
                    name: "开始计费时间",
                    isChecked: true,
                    key: "startChargingTimeFormated"
                }, {
                    name: "创建时间",
                    isChecked: true,
                    key: "createTimeFormated"
                }, {
                    name: "省份",
                    isChecked: true,
                    key: "provName"
                }, {
                    name: "大区",
                    isChecked: false,
                    key: "areaName"
                }, {
                    name:"交换机名称",
                    isChecked:true,
                    key:"sharePortTag"
                    }];
                this.initLiveLevelDropMenu();
                this.initCacheLevelDropMenu();
                this.initTableHeader();
                this.onClickQueryButton();
            },
            //获取共享出口的节点相关信息
            onGetNodeIdInfoSuccess:function(res){
                this.mergeArgs = res;
            },

            onUpdateRemarkSuccess:function(){
                Utility.alerts("更新成功", "success", 5000);
                this.onClickQueryButton();
            },

            initLiveLevelDropMenu: function() {
                var liveLevelArray = [{
                    name: "全部",
                    value: "All"
                },{
                    name: "上层",
                    value: 1
                }, {
                    name: "中层",
                    value: 2
                },{
                    name: "下层",
                    value: 3
                }]
                Utility.initDropMenu(this.$el.find(".dropdown-liveLevel"), liveLevelArray, function(value) {
                    if(value !== "All"){
                        this.queryArgs.liveLevel = parseInt(value);
                    }else{
                        this.queryArgs.liveLevel = null;
                    }
                    
                }.bind(this));
            },
    
            initCacheLevelDropMenu: function() {
                var cacheLevelArray = [{
                    name:"全部",
                    value: "All"
                },{
                    name: "上层",
                    value: 1
                }, {
                    name: "中层",
                    value: 2
                },{
                    name: "下层",
                    value: 3
                }]
                Utility.initDropMenu(this.$el.find(".dropdown-cacheLevel"), cacheLevelArray, function(value) {
                    if(value !== "All"){
                        this.queryArgs.cacheLevel = parseInt(value);
                    }else{
                        this.queryArgs.cacheLevel = null;
                    }
                }.bind(this));
            },
            
            initTableHeader: function() {
                var isCheckedStr = '<div class="checkbox">' +
                    '<label>' +
                    '<input type="checkbox" name="All"/>All' +
                    '</label>' +
                    '</div>';
                var tpl = '<li>' + isCheckedStr + '</li>'
                $(tpl).appendTo(this.$el.find(".listShow"));

                _.each(this.tableColumn, function(el) {
                    var isCheckedStr = '<div class="checkbox">' +
                        '<label>' +
                        '<input type="checkbox" name="' + el.name + '"/>' + el.name +
                        '</label>' +
                        '</div>';
                    if (el.isChecked) {
                        isCheckedStr = '<div class="checkbox">' +
                            '<label>' +
                            '<input type="checkbox" checked="true" name="' + el.name + '"/>' + el.name +
                            '</label>' +
                            '</div>';
                    }
                    var tpl = '<li>' + isCheckedStr + '</li>'
                    $(tpl).appendTo(this.$el.find(".listShow"));
                }.bind(this))
                this.$el.find(".listShow li input").on("click", $.proxy(this.onClickSelectTableHeader, this));
                this.$el.find(".listShow li input[name='All']").on("click", $.proxy(this.onClickSelectTableHeaderAll, this));
            },

            onClickSelectTableHeader: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                var inputChecked = $(eventTarget).attr("checked");
                var inputName = $(eventTarget).attr("name");
                if (inputName != "All") {
                    _.each(this.tableColumn, function(el) {
                        if (el.name === inputName) el.isChecked = eventTarget.checked;
                    })
                    this.initTable();
                    var selectedNodes = this.$el.find(".listShow li input:checked").length;
                    if (this.$el.find(".listShow li input[name='All']").get(0).checked)
                        selectedNodes--;
                    if (selectedNodes == this.tableColumn.length) {
                        this.$el.find(".listShow li input[name='All']").prop("checked", true);
                    } else {
                        this.$el.find(".listShow li input[name='All']").prop("checked", false);
                    }
                }
            },

            onClickSelectTableHeaderAll: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                this.$el.find(".listShow li input[name!='All']").prop("checked", eventTarget.checked);
                _.each(this.tableColumn, function(el) {
                    el.isChecked = eventTarget.checked;
                })
                this.initTable();
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
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
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
                this.queryArgs.id = parseInt(this.$el.find("#input-id").val().trim()) || null;
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
                this.$el.find(".opt-ctn .m").attr("disabled", "disabled");
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
                    titleList: this.tableColumn,
                    permission: AUTH_OBJ
                }));
                if (this.collection.models.length !== 0) {
                    this.$el.find(".table-ctn").html(this.table[0]);
                } else {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
                }
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
                this.table.find("tbody .start").on("click", $.proxy(this.onClickItemStart, this));
                this.table.find("tbody .init").on("click", $.proxy(this.onClickItemInit, this));

                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
                this.table.find("tbody .hoverTag").on("mouseover",$.proxy(this.onHoverNodeString,this))
                this.table.find("[data-toggle='popover1']").popover({
                    html:true
                });
                // this.table.find("tbody .KSCCDN-HeFeiCT01").attr('data-content','111111111')
                var sharePortTagList = [];
                _.each(this.collection.models,function (model) {
                    if(model.get("sharePortTag")) {
                        sharePortTagList.push(model.get("sharePortTag"));
                    }
                });
                this.collection.getAssociationNodeByTags(sharePortTagList);
            },
            onHoverNodeString:function(event){
                var eventTarget = event.srcElement || event.target;
                var content = $(eventTarget).attr("data-content");
                if(content){return false;}
                var id = $(eventTarget).attr("data-key");
                var valueList = this.mergeArgs[id];
                var tipsHTML = ["<h4><b>当前机房出口所有关联的节点</b></h4>"];
                for (var i = 0; i < valueList.length; i++) {
                    var _html = '<div>' + valueList[i] + '</div>';
                    tipsHTML.push(_html);
                }
                $(eventTarget).attr('data-content', tipsHTML.join(''))
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
                        type: 1,
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
                                opRemark: '',
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

            onOperateNodeSuccess: function(res) {
                this.disablePopup && this.disablePopup.$el.modal('hide');
                if (res.msg == "1" && res.status === 200) {
                    Utility.alerts("操作成功！", "success", 5000)
                    this.onClickQueryButton();
                } else if (res.msg == "-1" && res.status === 200) {
                    require(["dispSuggesttion.view", "dispSuggesttion.model"], function(DispSuggesttionViews, DispSuggesttionModel) {
                        this.onRequireDispSuggesttionModule(DispSuggesttionViews, DispSuggesttionModel, this.currentPauseNodeId)
                    }.bind(this))
                } else {
                    Utility.warning("操作失败！")
                    this.onClickQueryButton();
                }
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
                Utility.warning(ids.join(",") + "。接口不支持，臣妾做不到啊！");
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
                this.collection.getAllProvince();
                this.collection.getAreaList();
                this.collection.getOpereteTypeList();
            },

            onGetOperateTypeListSuccess: function(res) {
                this.operateTypeList = [{
                    name: "全部",
                    value: "All"
                }]
                _.each(res, function(el, index) {
                    this.operateTypeList.push({
                        name: el.name,
                        value: el.id
                    })
                }.bind(this))
                Utility.initDropMenu(this.$el.find(".dropdown-reason"), this.operateTypeList, function(value) {
                    if (value !== "All")
                        this.queryArgs.opType = parseInt(value)
                    else
                        this.queryArgs.opType = null;
                }.bind(this));
            },

            onGetLargeAreaSuccess: function(res) {
                this.largeArea = res;
                var nameList = [{
                    name: "全部",
                    value: "All"
                }];
                _.each(res, function(el, index, list) {
                    nameList.push({
                        name: el.name,
                        value: el.id
                    })
                });
                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.dropdown-largeArea').get(0),
                    panelID: this.$el.find('#dropdown-largeArea').get(0),
                    isSingle: true,
                    openSearch: true,
                    selectWidth: 200,
                    isDataVisible: false,
                    onOk: function() {},
                    data: nameList,
                    callback: function(data) {
                        this.$el.find('#dropdown-largeArea .cur-value').html(data.name);
                        if (data.name == "全部") this.queryArgs.areaId = null;
                        else this.queryArgs.areaId = parseInt(data.value);
                    }.bind(this)
                });
                this.$el.find("#dropdown-largeArea .cur-value").html(nameList[0].name);
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

            onGetProvinceSuccess: function(res) {
                this.provinceList = res;
                var nameList = [{
                    name: "全部",
                    value: "All"
                }];
                _.each(res, function(el, key, list) {
                    nameList.push({
                        name: el.name,
                        value: el.id
                    })
                }.bind(this))

                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.dropdown-province').get(0),
                    panelID: this.$el.find('#dropdown-province').get(0),
                    isSingle: true,
                    openSearch: true,
                    selectWidth: 200,
                    isDataVisible: false,
                    onOk: function() {},
                    data: nameList,
                    callback: function(data) {
                        this.$el.find('#dropdown-province .cur-value').html(data.name);
                        if (data.name == "全部") this.queryArgs.provinceId = null;
                        else this.queryArgs.provinceId = parseInt(data.value);
                    }.bind(this)
                });
                this.$el.find("#dropdown-province .cur-value").html(nameList[0].name);
            },

            onItemCheckedUpdated: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                var id = $(eventTarget).attr("id");
                console.log(id)
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
            },

            onClickItemStart: function(event) {
                //  this.onClickItemPlay()
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
                                opRemark: '',
                                nodeId: id,
                                operator: -1,
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

            onClickItemInit: function(evnet) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = this.collection.get(id);
                if (this.chosePlatPopup) $("#" + this.chosePlatPopup.modalId).remove();

                require(["nodeManage.chosePlatform.view"], function(ChosePlatformView) {
                    var myChosePlatformView = new ChosePlatformView({
                        onSelectPlatform: function(platformId) {
                            require(['setupTopoManage.update.view'], function(UpdateTopoView) {
                                var myUpdateTopoView = new UpdateTopoView({
                                    collection: this.collection,
                                    model: model,
                                    isEdit: false,
                                    pageType: 3,
                                    platformId: platformId,
                                    onSaveCallback: function() {}.bind(this),
                                    onCancelCallback: function() {
                                        myUpdateTopoView.$el.remove();
                                        this.$el.find(".node-manage-list-pannel").show();
                                    }.bind(this)
                                })
                                this.$el.find(".node-manage-list-pannel").hide();
                                myUpdateTopoView.render(this.$el.find(".update-panel"));
                            }.bind(this));
                        }.bind(this)
                    })
                    var options = {
                        title: "选择平台",
                        body: myChosePlatformView,
                        backdrop: 'static',
                        type: 1,
                        onOKCallback: function() {}.bind(this),
                        onHiddenCallback: function() {
                            this.enterKeyBindQuery();
                        }.bind(this)
                    }
                    this.chosePlatPopup = new Modal(options);
                }.bind(this));
            },

            onClickDetail: function(event) {
                if (!this.operateTypeList || this.operateTypeList.length == 0) {
                    Utility.alerts("没有获取到操作说明列表!")
                    return false;
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
                if (this.detailTipsPopup) $("#" + this.detailTipsPopup.modalId).remove();

                require(["nodeManage.operateDetail.view"], function(NodeTips) {
                    var detailTipsView = new NodeTips({
                        type: 2,
                        model: model,
                        whoCallMe: 'node',
                        collection: this.collection,
                        operateTypeList: this.operateTypeList
                    });
                    var options = {
                        title: "操作说明",
                        body: detailTipsView,
                        backdrop: 'static',
                        type: 2,
                        onOKCallback:function(){
                            var result = detailTipsView.getArgs();
                            if(!result){
                                return false;
                            }
                            result.id = id;
                            this.collection.updateRemark(result);
                            this.nodeTipsPopup.$el.modal("hide");
                        }.bind(this),
                        onHiddenCallback: function() {}.bind(this)
                    }
                    this.nodeTipsPopup = new Modal(options);
                }.bind(this));
            },

            onClickItemDelete: function(event) {
                if (!this.operateTypeList || this.operateTypeList.length == 0) {
                    Utility.alerts("没有获取到操作说明列表!")
                    return false;
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

                if (this.deleteNodeTipsPopup) $("#" + this.deleteNodeTipsPopup.modalId).remove();

                require(["nodeManage.operateDetail.view"], function(NodeTips) {
                    var deleteNodeTips = new NodeTips({
                        type: 1,
                        model: model,
                        whoCallMe: 'node',
                        operateTypeList: this.operateTypeList,
                        collection: this.collection,
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
                                opRemark: options.opRemark,
                                opType: options.opType
                            })
                            this.deleteNodeTipsPopup.$el.modal("hide");
                        }.bind(this)
                    }
                    this.deleteNodeTipsPopup = new Modal(options);
                }.bind(this));
            },

            onClickItemStop: function(event) {
                if (!this.operateTypeList || this.operateTypeList.length == 0) {
                    Utility.alerts("没有获取到操作说明列表!")
                    return false;
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
                if (this.nodeTipsPopup) $("#" + this.nodeTipsPopup.modalId).remove();

                require(["nodeManage.operateDetail.view"], function(NodeTips) {
                    var stopNodeView = new NodeTips({
                        type: 1,
                        model: model,
                        whoCallMe: 'node',
                        operateTypeList: this.operateTypeList,
                        collection: this.collection,
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
                                opType: options.opType,
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
        });
        return NodeManageView;
    });