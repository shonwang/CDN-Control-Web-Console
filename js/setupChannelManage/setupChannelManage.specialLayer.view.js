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
            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.specialLayer.html'])({ data: this.model.attributes }));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
            this.$el.find(".add-role").on("click", $.proxy(this.onClickAddRuleButton, this));

            if (!AUTH_OBJ.ApplySpecialUpstreamStrategy) {
                this.$el.find('.save').attr('disabled', 'disabled');
                this.$el.find('.save').off("click");
            }
            //添加特殊策略
            this.collection.off('add.special.success');
            this.collection.off('add.special.error');
            this.collection.on('add.special.success', $.proxy(this.addSpecialSuccess, this));
            this.collection.on('add.special.error', $.proxy(this.addSpecialError, this));
            //保存特殊规则的id
            this.collection.off('addTopologyRule.success');
            this.collection.off('addTopologyRule.error');
            this.collection.on('addTopologyRule.success', $.proxy(this.addTopologyRuleSuccess, this));
            this.collection.on('addTopologyRule.error', $.proxy(this.onGetError, this));
            //推送到待下发中
            this.collection.off("post.predelivery.success");
            this.collection.off("post.predelivery.error");
            this.collection.on("post.predelivery.success", $.proxy(this.onPublishSuccess, this));
            this.collection.on("post.predelivery.error", $.proxy(this.onGetError, this));

            //获取特殊规则的id
            this.collection.off('getTopologyRule.success');
            this.collection.off('getTopologyRule.error');
            this.collection.on('getTopologyRule.success', $.proxy(this.getTopologyRuleSuccess, this));
            this.collection.on('getTopologyRule.error', $.proxy(this.getTopologyRuleError, this));
            this.collection.getTopologyRule(this.model.get('id'));
            //获取到version
            this.collection.off("get.channel.history.success");
            this.collection.off("get.channel.history.error");
            this.collection.on("get.channel.history.success", $.proxy(function(res) {
                this.version = res[0].version
            }, this));
            this.collection.on("get.channel.history.error", $.proxy(this.onGetError, this));
            this.collection.getVersionList({ "originId": this.model.get("id") });
            //获取域名的基本信息
            this.collection.off("get.domainInfo.success");
            this.collection.off("get.domainInfo.error");
            this.collection.on("get.domainInfo.success", $.proxy(function(res) {
                this.confCustomType = res.domainConf.confCustomType;
            }, this));
            this.collection.on("get.domainInfo.error", $.proxy(this.onGetError, this));
            this.collection.getDomainInfo({ originId: this.model.get("id") });

            this.defaultParam = {
                "rule": []
            };
        },

        getTopologyRuleSuccess: function(res) {
            console.log("获取频道的特殊分层策略规则ID: ", res)
            this.collection.off('get.rule.origin.success');
            this.collection.off('get.rule.origin.error');
            this.collection.on('get.rule.origin.success', $.proxy(this.initRuleTable, this));
            this.collection.on('get.rule.origin.error', $.proxy(this.onGetError, this));
            this.collection.getRuleOrigin(res);
            this.notEditId = res;
        },

        getTopologyRuleError: function(error) {
            if (error && error.status == 404) {
                this.initRuleTable();
            } else if (error && error.message && error.status != 404) {
                alert(error.message);
            } else {
                alert("网络阻塞，请刷新重试！")
            }
        },

        onClickItemPublish: function() {
            if (this.confCustomType === 1) {
                var result = confirm("确定将域名放入待下发吗？");
            } else if (this.confCustomType === 3) {
                var result = confirm("确定将域名放入待定制吗？");
            } else {
                alert('此域名的confCustomType为' + this.confCustomType + '无法待下发或者是待定制');
            }
            if (!result) return;

            var postParam = [{
                domain: this.model.get("domain"),
                version: this.version,
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
            alert('操作成功');
            if (this.confCustomType === 1)
                window.location.hash = '#/setupSendWaitSend';
            else if (this.confCustomType === 3)
                window.location.hash = '#/setupSendWaitCustomize';
        },

        //保存特殊策略成功之后保存特殊策略的域名ID和特殊规则的id成功
        addTopologyRuleSuccess: function(res) {
            this.onClickItemPublish();
        },

        //保存特殊策略成功
        addSpecialSuccess: function(res) {
            var ruleIds = [];
            _.each(res.rule, function(res, index, list) {
                ruleIds.push(res.id);
            });
            ruleIds = ruleIds.join(',');
            var args = {
                "originId": this.model.get('id'),
                "roleIds": ruleIds
            }
            this.collection.addTopologyRule(args); //保存域名的ID和特殊策略的ID
        },

        addSpecialError: function(error) {
            if (error && error.message)
                alert(error.message);
            else
                alert("网络阻塞，请刷新重试！");
        },

        initRuleTable: function(res) {
            if (res && res.length > 0) {
                this.defaultParam.rule = res;
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

            this.ruleTable = $(_.template(template['tpl/setupChannelManage/setupChannelManage.role.table.html'])({
                data: this.ruleList
            }));
            if (this.ruleList.length !== 0)
                this.$el.find(".table-ctn").html(this.ruleTable[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.ruleTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.ruleTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));

            _.each(this.ruleTable.find("tbody .edit"), function(el) {
                _.each(this.notEditId, function(id) {
                    if (id === parseInt(el.id)) {
                        $(el).hide();
                        $(el).siblings(".delete").hide();
                    }
                }.bind(this))
            }.bind(this))
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

        onClickCancelButton: function() {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        //点击保存按钮保存特殊策略
        onClickSaveButton: function() {
            if (this.defaultParam.rule.length == 0) {
                alert('请添加规则');
                return;
            }
            console.log("保存当前所有规则", this.defaultParam.rule);

            var postRules = [];

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
                postRules.push(tempRule)
            }.bind(this))

            var postParam = {
                "topoId": this.model.get('topologyId'),
                "rule": postRules
            }
            this.collection.specilaAdd(postParam);
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！");
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

        return SpecialLayerManageView
    });