define("specialLayerManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var AddEditLayerView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.isEdit = options.isEdit;
                this.isView = options.isView;

                this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.edit.html'])({
                    data: {}
                }));

                this.collection.off('get.strategyInfoById.success');
                this.collection.off('get.strategyInfoById.error');
                this.collection.on('get.strategyInfoById.success', $.proxy(this.onStrategyInfo, this));
                this.collection.on('get.strategyInfoById.error', $.proxy(this.onGetError, this));

                this.collection.off('add.strategy.success');
                this.collection.off('add.strategy.error');
                this.collection.on('add.strategy.success', $.proxy(this.addStrategySuccess, this));
                this.collection.on('add.strategy.error', $.proxy(this.onGetError, this));

                this.collection.off('modify.strategy.success');
                this.collection.off('modify.strategy.error');
                this.collection.on('modify.strategy.success', $.proxy(this.modifyStrategySuccess, this));
                this.collection.on('modify.strategy.error', $.proxy(this.onGetError, this));

                if (this.isEdit) {
                    this.collection.getStrategyInfoById({
                        id: this.model.get('id')
                    });
                } else {
                    this.defaultParam = {
                        "id": null,
                        "name": "",
                        "type": null,
                        'remark': null,
                        "rule": []
                    }
                    this.initSetup();
                }

                this.$el.find('.view-less').hide();
            },

            addStrategySuccess: function() {
                alert('保存成功');
                this.options.onSaveCallback && this.options.onSaveCallback();
            },

            modifyStrategySuccess: function() {
                this.options.onSaveCallback && this.options.onSaveCallback();
                alert('修改成功');
            },

            onStrategyInfo: function(res) {
                this.defaultParam = {
                    "id": res.id || this.model.get('id'),
                    "name": res.name,
                    "remark": res.remark,
                    "rule": res.rule,
                    "type": res.type
                }

                this.domainList = res.domainList || ['没有关联的域名'];

                this.$el.find("#input-name").val(res.name);
                this.$el.find("#input-name").attr("readonly", "true");
                this.$el.find("#secondary").val(res.remark);

                console.log("编辑的分层策略: ", this.defaultParam)
                this.initSetup();
            },

            initSetup: function() {
                this.initDomainList();
                // this.$el.find('.upper .add-node').hide();
                this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
                if (!this.isEdit) {
                    // if (AUTH_OBJ.ApplyCreateTopos)
                    this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                    this.$el.find(".add-rule").on("click", $.proxy(this.onClickAddRuleButton, this));
                    this.$el.find(".domain-list").hide();
                } else if (!this.isView && this.isEdit) {
                    // if (AUTH_OBJ.ApplyEditTopos)
                    this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                    this.$el.find(".view-more").on("click", $.proxy(this.onClickViewMoreButton, this));
                    this.$el.find(".view-less").on("click", $.proxy(this.onClickViewLessButton, this));
                    this.$el.find(".add-rule").on("click", $.proxy(this.onClickAddRuleButton, this));
                    //this.$el.find(".comment-group").hide();
                } else if (this.isView) {
                    this.$el.find(".view-more").on("click", $.proxy(this.onClickViewMoreButton, this));
                    this.$el.find(".view-less").on("click", $.proxy(this.onClickViewLessButton, this));
                    this.$el.find(".add-rule").hide();
                    this.$el.find(".opt-ctn .save").hide();
                    //this.$el.find(".comment-group").hide();
                }
                this.collection.off("get.node.success");
                this.collection.off("get.node.error");
                this.collection.on("get.node.success", $.proxy(this.onGetAllNode, this));
                this.collection.on("get.node.error", $.proxy(this.onGetError, this));

                this.collection.off("get.devicetype.success");
                this.collection.off("get.devicetype.error");
                this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
                this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));

                this.collection.getNodeList(); //获取所有节点列表接口
                this.collection.getDeviceTypeList(); //获取应用类型列表接口
            },

            initDomainList: function(){
                var nodeTpl = '';
                _.each(this.domainList, function(el){
                    nodeTpl = '<li class="node-item">' + 
                                   '<span class="label label-primary" id="' + Utility.randomStr(8) +'">'+ el +'</span>' +
                              '</li>';
                    $(nodeTpl).appendTo(this.$el.find(".node-ctn"))
                }.bind(this))
            },

            onClickViewMoreButton: function(event) {
                this.$el.find('.view-less').show();
                this.$el.find(".view-more").hide();
                this.$el.find('.domain-ctn').css('max-height', 'none');
            },

            onClickViewLessButton: function(event) {
                this.$el.find('.view-less').hide();
                this.$el.find(".view-more").show();
                this.$el.find('.domain-ctn').css('max-height', '200px');
            },

            onClickSaveButton: function() {
                this.defaultParam.name = $.trim(this.$el.find("#input-name").val());
                if (this.defaultParam.name == '') {
                    alert('请输入名称');
                    return;
                } else if (this.defaultParam.type == null) {
                    alert('请选择设备类型');
                    return;
                } else if (this.defaultParam.rule.length == 0) {
                    alert('请添加规则');
                    return;
                }

                console.log("点击保存按钮时的分层策略", this.defaultParam)

                var postRules = [],
                    postTopo = {};

                _.each(this.defaultParam.rule, function(rule) {
                    var localIdArray = [],
                        upperObjArray = [],
                        tempRule = {};
                    _.each(rule.local, function(node) {
                        localIdArray.push(node.id)
                    }.bind(this))
                    _.each(rule.upper, function(node) {
                        upperObjArray.push({
                            nodeId: node.rsNodeMsgVo.id,
                            ipCorporation: node.ipCorporation,
                            chiefType: node.chiefType === undefined ? 1 : node.chiefType
                        })
                    }.bind(this))

                    tempRule.id = rule.id;
                    tempRule.localType = rule.localType
                    tempRule.local = localIdArray;
                    tempRule.upper = upperObjArray;
                    postRules.push(tempRule);
                }.bind(this))

                postTopo.id = this.defaultParam.id;
                postTopo.name = this.defaultParam.name;
                postTopo.type = this.defaultParam.type;
                postTopo.rule = postRules;
                postTopo.remark = this.$el.find("#secondary").val();

                if (this.isEdit)
                    this.collection.modifyStrategy(postTopo);
                else
                    this.collection.addStrategy(postTopo);
            },

            onClickCancelButton: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            initDeviceDropMenu: function(res) {
                this.deviceTypeArray = [];
                var typeArray = [],
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
                    this.defaultParam.type = typeArray[0].value;
                    var rootNode = this.$el.find(".dropdown-app");
                    Utility.initDropMenu(rootNode, typeArray, function(value) {
                        this.defaultParam.type = parseInt(value)
                    }.bind(this));
                    this.$el.find("#dropdown-app .cur-value").html(typeArray[0].name);
                } else {
                    var upperObj = _.find(typeArray, function(object) {
                        return object.value == this.defaultParam.type;
                    }.bind(this))
                    this.$el.find('#dropdown-app .cur-value').html(upperObj.name);
                    this.$el.find("#dropdown-app").attr("disabled", "disabled")
                }
            },

            onGetAllNode: function(res) {
                this.allNodes = res;
                //过滤掉关闭和挂起的节点
                var resFlag = [];
                _.each(res, function(el, index, list) {
                    if (el.status != 3 && el.status != 2) resFlag.push(el)
                })
                this.nodesArrayFirst = [];

                _.each(resFlag, function(el, index, list) {
                    el.checked = false;
                    this.nodesArrayFirst.push({
                        nodeName: el.chName,
                        nodeId: el.id,
                        checked: el.checked,
                        operator: el.operatorId
                    });
                }.bind(this))

                this.initRuleTable();
            },

            initRuleTable: function() {
                //var data = [{localLayer: "1111", upperLayer: "22222"}];
                this.ruleList = [];

                _.each(this.defaultParam.rule, function(rule, index, ls) {
                    var localLayerArray = [],
                        upperLayer = [],
                        primaryArray = [],
                        backupArray = [],
                        primaryNameArray = [],
                        backupNameArray = [];
                    _.each(rule.local, function(local, inx, list) {
                        localLayerArray.push(local.name)
                    }.bind(this));

                    primaryArray = _.filter(rule.upper, function(obj) {
                        return obj.chiefType !== 0;
                    }.bind(this))
                    backupArray = _.filter(rule.upper, function(obj) {
                        return obj.chiefType === 0;
                    }.bind(this))

                    _.each(primaryArray, function(upper, inx, list) {
                        if (upper.rsNodeMsgVo)
                            primaryNameArray.push(upper.rsNodeMsgVo.name)
                        else
                            primaryNameArray.push("[后端没有返回名称]")
                    }.bind(this));
                    _.each(backupArray, function(upper, inx, list) {
                        if (upper.rsNodeMsgVo)
                            backupNameArray.push(upper.rsNodeMsgVo.name)
                        else
                            backupNameArray.push("[后端没有返回名称]")
                    }.bind(this));

                    var upperLayer = primaryNameArray.join('、');
                    if (rule.upper.length > 1)
                        upperLayer = '<strong>主：</strong>' + primaryNameArray.join('、');
                    if (backupArray.length > 0)
                        upperLayer += '<br><strong>备：</strong>' + backupNameArray.join('、');

                    var ruleStrObj = {
                        id: rule.id,
                        localLayer: localLayerArray.join('、'),
                        upperLayer: upperLayer
                    }
                    this.ruleList.push(ruleStrObj)
                }.bind(this))

                this.roleTable = $(_.template(template['tpl/setupChannelManage/setupChannelManage.role.table.html'])({
                    data: this.ruleList
                }));
                if (this.ruleList.length !== 0)
                    this.$el.find(".rule .table-ctn").html(this.roleTable[0]);
                else
                    this.$el.find(".rule .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "还没有添加规则"
                        }
                    }));

                if (!this.isView) {
                    this.roleTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                    this.roleTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                } else {
                    this.roleTable.find("tbody .edit").hide();
                    this.roleTable.find("tbody .delete").hide();
                }
            },

            onClickItemEdit: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");

                this.curEditRule = _.find(this.defaultParam.rule, function(obj) {
                    return obj.id === parseInt(id)
                }.bind(this))

                if (!this.curEditRule) {
                    alert("找不到此行的数据，无法编辑");
                    return;
                }

                require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'],
                    function(AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                        var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                        var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                            collection: myAddEditLayerStrategyModel,
                            localNodes: this.nodesArrayFirst,
                            upperNodes: this.nodesArrayFirst,
                            rule: this.defaultParam.rule,
                            curEditRule: this.curEditRule,
                            isEdit: true,
                            notFilter: true,
                            onSaveCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                                this.initRuleTable();
                            }.bind(this),
                            onCancelCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                            }.bind(this)
                        })

                        this.$el.find(".add-topo").hide();
                        myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
                    }.bind(this))
            },

            onClickItemDelete: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                this.defaultParam.rule = _.filter(this.defaultParam.rule, function(obj) {
                    return obj.id !== parseInt(id)
                }.bind(this))

                this.initRuleTable();
            },

            onClickAddRuleButton: function() {
                require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'],
                    function(AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                        var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                        var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                            collection: myAddEditLayerStrategyModel,
                            localNodes: this.nodesArrayFirst,
                            upperNodes: this.nodesArrayFirst,
                            rule: this.defaultParam.rule,
                            notFilter: true,
                            onSaveCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                                this.initRuleTable();
                            }.bind(this),
                            onCancelCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                            }.bind(this)
                        })

                        this.$el.find(".add-topo").hide();
                        myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
                    }.bind(this))
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        var SpecialLayerManageView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.html'])());

                //获取所有的拓扑关系信息
                this.collection.on("get.strategyList.success", $.proxy(this.onGetStrategySuccess, this));
                this.collection.on("get.strategyList.error", $.proxy(this.onGetError, this));
                this.collection.on("delete.strategy.success", $.proxy(this.resetList, this));
                this.collection.on("delete.strategy.error", $.proxy(this.onGetError, this));
                //获取应用类型
                this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
                this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));

                // if (AUTH_OBJ.QueryTopos) {
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.resetList, this));
                this.on('enterKeyBindQuery', $.proxy(this.resetList, this));

                this.enterKeyBindQuery();
                // } else {
                //     this.$el.find(".opt-ctn .query").remove();
                // }
                // if (AUTH_OBJ.CreateTopos)
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
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
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

                // if (AUTH_OBJ.EditTopos)
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                // else
                //     this.table.find("tbody .edit").remove();

                this.table.find("tbody .view").on("click", $.proxy(this.onClickItemView, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));

                this.table.find("[data-toggle='popover']").popover();
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
                    onCancelCallback: function() {
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))
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

                this.collection.deleteStrategy({
                    id: id
                })
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
                var myAddEditLayerView = new AddEditLayerView({
                    collection: this.collection,
                    model: model,
                    isEdit: true,
                    onSaveCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.onClickQueryButton();
                    }.bind(this),
                    onCancelCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))
            },

            onClickItemView: function(event) {
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
                    }.bind(this),
                    onCancelCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
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
                    this.curPage = 1;
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

        return SpecialLayerManageView;
    });