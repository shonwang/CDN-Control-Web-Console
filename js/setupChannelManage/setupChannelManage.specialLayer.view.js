define("setupChannelManage.specialLayer.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var SpecialLayerManageView = Backbone.View.extend({
            events: {
                //"click .search-btn":"onClickSearch"
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.rule = [];
                this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.specialLayer.html'])({
                    data: this.model.attributes
                }));
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

                this.defaultParam = {
                    "rule": []
                };

                this.curLayerId = this.model.get('topologyRoleId');
                this.notEditId = [];

                this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
                this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                this.$el.find(".add-role").on("click", $.proxy(this.onClickAddRuleButton, this));
                this.$el.find(".add-role").hide();

                if (!AUTH_OBJ.ApplySpecialUpstreamStrategy) {
                    this.$el.find('.save').attr('disabled', 'disabled');
                    this.$el.find('.save').off("click");
                }

                require(["specialLayerManage.model"], function(SpecialLayerManageModel) {
                    this.mySpecialLayerManageModel = new SpecialLayerManageModel();
                    this.mySpecialLayerManageModel.off("get.strategyList.success");
                    this.mySpecialLayerManageModel.off("get.strategyList.error");
                    this.mySpecialLayerManageModel.on("get.strategyList.success", $.proxy(this.onGetSpecialLayerInfo, this));
                    this.mySpecialLayerManageModel.on("get.strategyList.error", $.proxy(this.onGetError, this));
                    this.mySpecialLayerManageModel.getStrategyList({
                        name: null,
                        page: 1,
                        size: 99999,
                        type: null
                    });

                    this.mySpecialLayerManageModel.off("get.strategyInfoById.success");
                    this.mySpecialLayerManageModel.off("get.strategyInfoById.error");
                    this.mySpecialLayerManageModel.on("get.strategyInfoById.success", $.proxy(this.initRuleTable, this));
                    this.mySpecialLayerManageModel.on("get.strategyInfoById.error", $.proxy(this.onGetError, this));
                }.bind(this))

                this.getTopoAppNameForShow();
            },

            onGetSpecialLayerInfo: function() {
                var layerArray = []
                this.mySpecialLayerManageModel.each(function(el, index, lst) {
                    layerArray.push({
                        name: el.get('name'),
                        value: el.get('id')
                    })
                }.bind(this))

                this.layerArray = layerArray;

                rootNode = this.$el.find(".dropdown-layer");
                Utility.initDropMenu(rootNode, layerArray, function(value) {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                    this.mySpecialLayerManageModel.getStrategyInfoById({
                        id: value
                    })
                    this.curLayerId = value;
                }.bind(this));

                require(['nodeManage.model'], function(NodeManageModel) {
                    var myNodeManageModel = new NodeManageModel();
                    myNodeManageModel.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
                    myNodeManageModel.on("get.operator.error", $.proxy(this.onGetError, this));
                    myNodeManageModel.getOperatorList();
                }.bind(this))
            },

            // getTopologyRule -> getStrategyList
            getTopologyRuleSuccess: function(res) {
                console.log("获取频道的分层策略ID: ", res)
                // this.collection.off('get.rule.origin.success');
                // this.collection.off('get.rule.origin.error');
                // this.collection.on('get.rule.origin.success', $.proxy(this.initRuleTable, this));
                // this.collection.on('get.rule.origin.error', $.proxy(this.onGetError, this));
                //this.collection.getRuleOrigin(res);
                this.notEditId = res;
                this.setLayerDefaultData();
            },

            onGetOperatorSuccess: function(res) {
                this.operatorList = res.rows;
                //获取特殊规则的id
                this.collection.off('getTopologyRule.success');
                this.collection.off('getTopologyRule.error');
                this.collection.on('getTopologyRule.success', $.proxy(this.getTopologyRuleSuccess, this));
                this.collection.on('getTopologyRule.error', $.proxy(this.getTopologyRuleError, this));
                this.collection.getTopologyRule(this.model.get('id'));
            },

            setLayerDefaultData: function() {
                var defaultValue = _.find(this.layerArray, function(object) {
                    return object.value === this.notEditId[0]
                }.bind(this));

                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

                if (defaultValue) {
                    this.$el.find(".dropdown-layer .cur-value").html(defaultValue.name)
                    this.mySpecialLayerManageModel.getStrategyInfoById({
                        id: defaultValue.value
                    })
                } else {
                    this.$el.find(".dropdown-layer .cur-value").html('没有对应的分层策略');
                    this.initRuleTable();
                }
            },

            getTopologyRuleError: function(error) {
                if (error && error.status == 404) {
                    this.notEditId = [];
                    this.setLayerDefaultData();
                } else if (error && error.message && error.status != 404) {
                    Utility.alerts(error.message);
                } else {
                    Utility.alerts("网络阻塞，请刷新重试！")
                }
            },

            initRuleTable: function(res) {
                if (res && res.rule.length > 0) {
                    this.defaultParam.rule = res.rule;
                    console.log("获取频道的特殊分层策略规则: ", res);
                }
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
                        upper.ipCorporationName = "";
                        if (upper.rsNodeMsgVo && upper.rsNodeMsgVo.operatorId === 9) {
                            for (var i = 0; i < this.operatorList.length; i++) {
                                if (this.operatorList[i].id === upper.ipCorporation) {
                                    upper.ipCorporationName = "-" + this.operatorList[i].name;
                                    break;
                                }
                            }
                        }
                        if (upper.rsNodeMsgVo)
                            primaryNameArray.push(upper.rsNodeMsgVo.name + upper.ipCorporationName)
                        else
                            primaryNameArray.push("[后端没有返回名称]")
                    }.bind(this));
                    _.each(backupArray, function(upper, inx, list) {
                        upper.ipCorporationName = "";
                        if (upper.rsNodeMsgVo && upper.rsNodeMsgVo.operatorId === 9) {
                            for (var i = 0; i < this.operatorList.length; i++) {
                                if (this.operatorList[i].id === upper.ipCorporation) {
                                    upper.ipCorporationName = "-" + this.operatorList[i].name;
                                    break;
                                }
                            }
                        }
                        if (upper.rsNodeMsgVo)
                            backupNameArray.push(upper.rsNodeMsgVo.name + upper.ipCorporationName)
                        else
                            backupNameArray.push("[后端没有返回名称]")
                    }.bind(this));

                    var upperLayer = primaryNameArray.join('<br>');
                    if (rule.upper.length > 1)
                        upperLayer = '<strong>主：</strong>' + primaryNameArray.join('<br>');
                    if (backupArray.length > 0)
                        upperLayer += '<br><strong>备：</strong>' + backupNameArray.join('<br>');

                    var ruleStrObj = {
                        id: rule.id,
                        localLayer: localLayerArray.join('<br>'),
                        upperLayer: upperLayer
                    }
                    this.ruleList.push(ruleStrObj)
                }.bind(this))

                this.ruleTable = $(_.template(template['tpl/setupChannelManage/setupChannelManage.role.table.html'])({
                    data: this.ruleList
                }));
                if (this.ruleList.length !== 0) {
                    this.$el.find(".table-ctn").html(this.ruleTable[0]);
                } else {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "暂无数据"
                        }
                    }));
                }

                this.ruleTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.ruleTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));

                this.ruleTable.find("[data-toggle='popover']").popover();

                // _.each(this.ruleTable.find("tbody .edit"), function(el) {
                //     _.each(this.notEditId, function(id) {
                //         if (id === parseInt(el.id)) {
                //             $(el).hide();
                //             $(el).siblings(".delete").hide();
                //         }
                //     }.bind(this))
                // }.bind(this))
                this.ruleTable.find("tbody .edit").hide();
                this.ruleTable.find("tbody .delete").hide();
            },

            onClickItemEdit: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");

                this.curEditRule = _.find(this.defaultParam.rule, function(obj) {
                    return obj.id === parseInt(id)
                }.bind(this))

                if (!this.curEditRule) {
                    Utility.alerts("找不到此行的数据，无法编辑");
                    return;
                }
                require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'],
                    function(AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                        var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                        var options = myAddEditLayerStrategyModel;
                        var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                            collection: options,
                            rule: this.defaultParam.rule,
                            topologyId: this.model.get('topologyId'),
                            curEditRule: this.curEditRule,
                            isEdit: true,
                            onSaveCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".special-layer").show();
                                this.initRuleTable();
                            }.bind(this),
                            onCancelCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".special-layer").show();
                            }.bind(this)
                        })

                        this.$el.find(".special-layer").hide();
                        myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
                    }.bind(this))
            },

            onClickItemDelete: function() {
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
                        var options = myAddEditLayerStrategyModel;
                        var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                            collection: options,
                            rule: this.defaultParam.rule,
                            topologyId: this.model.get('topologyId'),
                            onSaveCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".special-layer").show();
                                this.initRuleTable();
                            }.bind(this),
                            onCancelCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".special-layer").show();
                            }.bind(this)
                        })

                        this.$el.find(".special-layer").hide();
                        myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
                    }.bind(this))
            },

            //点击保存按钮-> isTopoStrategyMatch -> addTopologyRuleSuccess -> onPostPredelivery
            onClickSaveButton: function() {
                if (this.defaultParam.rule.length == 0) {
                    Utility.alerts('请添加规则');
                    return;
                }

                // console.log("保存当前所有规则", this.defaultParam.rule);

                // var postRules = [];

                // _.each(this.defaultParam.rule, function(rule) {
                //     var localIdArray = [],
                //         upperObjArray = [],
                //         tempRule = {};

                //     _.each(rule.local, function(node) {
                //         localIdArray.push(node.id)
                //     }.bind(this))

                //     _.each(rule.upper, function(node) {
                //         upperObjArray.push({
                //             nodeId: node.rsNodeMsgVo.id,
                //             ipCorporation: node.ipCorporation,
                //             chiefType: node.chiefType === undefined ? 1 : node.chiefType
                //         })
                //     }.bind(this))

                //     tempRule.id = rule.id;
                //     tempRule.localType = rule.localType
                //     tempRule.local = localIdArray;
                //     tempRule.upper = upperObjArray;
                //     postRules.push(tempRule)
                // }.bind(this))

                // var postParam = {
                //         "topoId": this.model.get('topologyId'),
                //         "rule": postRules
                //     }
                // 添加特殊策略
                // this.collection.off('add.special.success');
                // this.collection.off('add.special.error');
                // this.collection.on('add.special.success', $.proxy(this.addSpecialSuccess, this));
                // this.collection.on('add.special.error', $.proxy(this.onGetError, this));
                // this.collection.specilaAdd(postParam);

                var postParam = {
                    strategyIds: [this.curLayerId],
                    topoIds: [this.model.get('topologyId')]
                }
                this.collection.off('get.isTopoStrategyMatch.success');
                this.collection.off('get.isTopoStrategyMatch.error');
                this.collection.on('get.isTopoStrategyMatch.success', $.proxy(this.onCheckTopoAndLayerSuccess, this));
                this.collection.on('get.isTopoStrategyMatch.error', $.proxy(this.onGetError, this));
                this.collection.isTopoStrategyMatch(postParam);

            },

            onCheckTopoAndLayerSuccess: function() {
                var postParam = {
                    topologyId: this.model.get('topologyId'),
                    originIdList: [this.model.get('id')],
                    topologyName: this.$el.find("#input-topology").val(),
                    topologyRuleId: this.curLayerId,
                    ruleName: this.$el.find(".dropdown-layer .cur-value").html()
                };

                this.collection.off("add.channel.topology.success");
                this.collection.off("add.channel.topology.error");
                this.collection.on("add.channel.topology.success", $.proxy(this.addTopologyRuleSuccess, this));
                this.collection.on("add.channel.topology.error", $.proxy(this.onGetError, this));
                this.collection.addTopologyList(postParam);
            },

            // addSpecialSuccess: function(res) {
            //     var ruleIds = [];
            //     _.each(res.rule, function(res, index, list) {
            //         ruleIds.push(res.id);
            //     });
            //     ruleIds = ruleIds.join(',');
            //     var args = {
            //             "originId": this.model.get('id'),
            //             "roleIds": ruleIds
            //         }
            //         //保存特殊规则的id
            //     this.collection.off('addTopologyRule.success');
            //     this.collection.off('addTopologyRule.error');
            //     this.collection.on('addTopologyRule.success', $.proxy(this.addTopologyRuleSuccess, this));
            //     this.collection.on('addTopologyRule.error', $.proxy(this.onGetError, this));
            //     this.collection.addTopologyRule(args); //保存域名的ID和特殊策略的ID
            // },

            addTopologyRuleSuccess: function() {
                if (this.confCustomType === 1 || this.confCustomType === 2) {
                    Utility.confirm("确定将域名放入待下发吗？", $.proxy(this.predelivery, this));
                } else if (this.confCustomType === 3) {
                    Utility.confirm("确定将域名放入待定制吗？",$.proxy(this.predelivery, this));
                } else {
                    Utility.alerts('此域名的confCustomType为' + this.confCustomType + '无法待下发或者是待定制');
                }
            },

            predelivery: function(){
                var postParam = [{
                    domain: this.model.get("domain"),
                    version: this.model.get("version"),
                    description: this.model.get("description"),
                    configReason: 2
                }]

                this.collection.off("post.predelivery.success");
                this.collection.off("post.predelivery.error");
                this.collection.on("post.predelivery.success", $.proxy(this.onPostPredelivery, this));
                this.collection.on("post.predelivery.error", $.proxy(this.onGetError, this));
                this.collection.predelivery(postParam)                
            },

            onPostPredelivery: function(res) {
                this.options.onSaveCallback && this.options.onSaveCallback();
                Utility.alerts('操作成功', "success", 3000);
                if (this.confCustomType === 1)
                    window.location.hash = '#/setupSendWaitSend';
                else if (this.confCustomType === 3)
                    window.location.hash = '#/setupSendWaitCustomize';
            },

            getTopoAppNameForShow: function() {
                //获取域名的基本信息
                this.collection.off("get.domainInfo.success");
                this.collection.off("get.domainInfo.error");
                this.collection.on("get.domainInfo.success", $.proxy(this.onGetConfCustomType, this));
                this.collection.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                this.collection.getDomainInfo({
                    originId: this.model.get("id")
                });
                //获取拓扑名称
                if (this.model.get("topologyId")) {
                    require(['setupTopoManage.model'], function(SetupTopoManageModel) {
                        var mySetupTopoManageModel = new SetupTopoManageModel();
                        mySetupTopoManageModel.on("get.topo.OriginInfo.success", $.proxy(this.onGetTopoInfo, this));
                        mySetupTopoManageModel.on("get.topo.OriginInfo.error", $.proxy(this.onGetError, this));
                        mySetupTopoManageModel.getTopoOrigininfo(this.model.get("topologyId"))
                    }.bind(this));
                } else {
                    this.$el.find("#input-topology").val("默认拓扑关系");
                }
                //获取应用名称
                require(['setupSendWaitCustomize.model'], function(SetupSendWaitCustomizeModel) {
                    var mySetupSendWaitCustomizeModel = new SetupSendWaitCustomizeModel();
                    mySetupSendWaitCustomizeModel.on("get.channel.config.success", $.proxy(this.onGetConfigInfo, this));
                    mySetupSendWaitCustomizeModel.on("get.channel.config.error", $.proxy(this.onGetError, this));
                    mySetupSendWaitCustomizeModel.getChannelConfig({
                        domain: this.model.get("domain"),
                        version: this.model.get("version") || this.model.get("domainVersion")
                    })
                }.bind(this));
            },

            onClickCancelButton: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            onGetConfCustomType: function(res) {
                this.confCustomType = res.domainConf.confCustomType;
            },

            onGetTopoInfo: function(data) {
                this.$el.find("#input-topology").val(data.name);
            },

            onGetConfigInfo: function(data) {
                this.$el.find("#input-application").val(data.applicationType.name);
            },

            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message)
                else
                    Utility.alerts("网络阻塞，请刷新重试！");
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return SpecialLayerManageView
    });