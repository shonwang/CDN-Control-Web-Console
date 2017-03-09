define("setupChannelManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function (require, exports, template, Modal, Utility) {

    var HistoryView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function (options) {
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;

            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.history.html'])({data: {}}));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));

            this.collection.off("get.channel.history.success");
            this.collection.off("get.channel.history.error");
            this.collection.on("get.channel.history.success", $.proxy(this.initSetup, this));
            this.collection.on("get.channel.history.error", $.proxy(this.onGetError, this));
            this.collection.getVersionList({"originId": this.model.get("id")})

            this.$el.find('#input-domain').val(this.model.get("domain"))
        },

        initSetup: function (data) {
            this.versionList = data;

            _.each(data, function(el, index, ls){
                if (el.createTime)
                    el.createTimeFormated = new Date(el.createTime).format("yyyy/MM/dd hh:mm:ss")
            }.bind(this))

            this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.history.table.html'])({
                data: data,
            }));

            if (!AUTH_OBJ.SendHistoryConfig) {
                this.table.find('.publish').remove();
            }
            if (data.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .bill").on("click", $.proxy(this.onClickItemBill, this));
            this.table.find("tbody .publish").on("click", $.proxy(this.onClickItemPublish, this));
        },

        onClickItemPublish: function () {
            var eventTarget = event.srcElement || event.target,
                version = $(eventTarget).attr("version");

            var postParam = [{
                domain: this.model.get("domain"),
                version: version,
                description: this.model.get("description"),
                configReason: 1
            }]

            this.collection.off("post.predelivery.success");
            this.collection.off("post.predelivery.error");
            this.collection.on("post.predelivery.success", $.proxy(this.onPostPredelivery, this));
            this.collection.on("post.predelivery.error", $.proxy(this.onGetError, this));
            this.collection.predelivery(postParam)
        },

        onPostPredelivery: function () {
            alert("发布成功！")
            window.location.hash = '#/setupSendWaitSend';
        },

        onClickItemBill: function (event) {
            var eventTarget = event.srcElement || event.target,
                version = $(eventTarget).attr("version");

            require(['setupBill.view', 'setupBill.model'], function (SetupBillView, SetupBillModel) {
                var mySetupBillModel = new SetupBillModel();
                var mySetupBillView = new SetupBillView({
                    collection: mySetupBillModel,
                    originId: this.model.get("id"),
                    version: version,
                    onSaveCallback: function () {}.bind(this),
                    onCancelCallback: function () {
                        mySetupBillView.$el.remove();
                        this.$el.find(".history-panel").show();
                    }.bind(this)
                })

                this.$el.find(".history-panel").hide();
                mySetupBillView.render(this.$el.find(".bill-panel"));
            }.bind(this))
        },

        onClickCancelButton: function () {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function (error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function (target) {
            this.$el.appendTo(target);
        }
    });

    var SpecialLayerManageView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function (options) {
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;
            this.rule = [];
            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.specialLayer.html'])({data: this.model.attributes}));

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
            this.collection.on("get.channel.history.success", $.proxy(function (res) {
                this.version = res[0].version
            }, this));
            this.collection.on("get.channel.history.error", $.proxy(this.onGetError, this));
            this.collection.getVersionList({"originId": this.model.get("id")});
            //获取域名的基本信息
            this.collection.off("get.domainInfo.success");
            this.collection.off("get.domainInfo.error");
            this.collection.on("get.domainInfo.success", $.proxy(function (res) {
                this.confCustomType = res.domainConf.confCustomType;
            }, this));
            this.collection.on("get.domainInfo.error", $.proxy(this.onGetError, this));
            this.collection.getDomainInfo({originId: this.model.get("id")});

            this.defaultParam = {
                "rule": []
            };
        },

        getTopologyRuleSuccess: function (res) {
            console.log("获取频道的特殊分层策略规则ID: ", res)
            this.collection.off('get.rule.origin.success');
            this.collection.off('get.rule.origin.error');
            this.collection.on('get.rule.origin.success', $.proxy(this.initRuleTable, this));
            this.collection.on('get.rule.origin.error', $.proxy(this.onGetError, this));
            this.collection.getRuleOrigin(res);
            this.notEditId = res;
        },

        getTopologyRuleError: function (error) {
            if (error && error.status == 404) {
                this.initRuleTable();
            } else if (error && error.message && error.status != 404) {
                alert(error.message);
            } else {
                alert("网络阻塞，请刷新重试！")
            }
        },

        onClickItemPublish: function () {
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

        onPostPredelivery: function (res) {
            this.options.onSaveCallback && this.options.onSaveCallback();
            alert('操作成功');
            if (this.confCustomType === 1)
                window.location.hash = '#/setupSendWaitSend';
            else if (this.confCustomType === 3)
                window.location.hash = '#/setupSendWaitCustomize';
        },

        //保存特殊策略成功之后保存特殊策略的域名ID和特殊规则的id成功
        addTopologyRuleSuccess: function (res) {
            this.onClickItemPublish();
        },

        //保存特殊策略成功
        addSpecialSuccess: function (res) {
            var ruleIds = [];
            _.each(res.rule, function (res, index, list) {
                ruleIds.push(res.id);
            });
            ruleIds = ruleIds.join(',');
            var args = {
                "originId": this.model.get('id'),
                "roleIds": ruleIds
            }
            this.collection.addTopologyRule(args); //保存域名的ID和特殊策略的ID
        },

        addSpecialError: function (error) {
            if (error && error.message)
                alert(error.message);
            else
                alert("网络阻塞，请刷新重试！");
        },

        initRuleTable: function (res) {
            console.log("获取频道的特殊分层策略规则: ", res);
            if (res && res.length > 0) this.defaultParam.rule = res;
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            this.ruleList = [];

            _.each(this.defaultParam.rule, function(rule, index, ls){
                var localLayerArray = [], upperLayer = [],
                    primaryArray = [], backupArray = [],
                    primaryNameArray = [], backupNameArray = [];
                _.each(rule.local, function(local, inx, list){
                    localLayerArray.push(local.name)
                }.bind(this));

                primaryArray = _.filter(rule.upper, function(obj){
                    return obj.chiefType !== 0;
                }.bind(this))
                backupArray = _.filter(rule.upper, function(obj){
                    return obj.chiefType === 0;
                }.bind(this))

                _.each(primaryArray, function(upper, inx, list){
                    if (upper.rsNodeMsgVo)
                        primaryNameArray.push(upper.rsNodeMsgVo.name)
                    else
                        primaryNameArray.push("[后端没有返回名称]")
                }.bind(this));
                _.each(backupArray, function(upper, inx, list){
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

            _.each(this.ruleTable.find("tbody .edit"), function(el){
                _.each(this.notEditId, function(id){
                    if (id === parseInt(el.id)){
                        $(el).hide();
                        $(el).siblings(".delete").hide();
                    }
                }.bind(this))
            }.bind(this))
        },

        onClickItemEdit: function (event) {
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            this.curEditRule = _.find(this.defaultParam.rule, function(obj){
                return obj.id === parseInt(id)
            }.bind(this))

            if (!this.curEditRule){
                alert("找不到此行的数据，无法编辑");
                return;
            }
            require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], 
                function (AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                var options = myAddEditLayerStrategyModel;
                var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                    collection: options,
                    rule: this.defaultParam.rule,
                    topologyId: this.model.get('topologyId'),
                    curEditRule: this.curEditRule,
                    isEdit: true,
                    onSaveCallback: function () {
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".special-layer").show();
                        this.initRuleTable();
                    }.bind(this),
                    onCancelCallback: function () {
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".special-layer").show();
                    }.bind(this)
                })

                this.$el.find(".special-layer").hide();
                myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
            }.bind(this))
        },

        onClickItemDelete: function () {
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");
            this.defaultParam.rule = _.filter(this.defaultParam.rule, function(obj){
                return obj.id !== parseInt(id)
            }.bind(this))

            this.initRuleTable();
        },

        onClickAddRuleButton: function () {
            require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], function (AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                var options = myAddEditLayerStrategyModel;
                var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                    collection: options,
                    rule: this.defaultParam.rule,
                    topologyId: this.model.get('topologyId'),
                    onSaveCallback: function () {
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".special-layer").show();
                        this.initRuleTable();
                    }.bind(this),
                    onCancelCallback: function () {
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".special-layer").show();
                    }.bind(this)
                })

                this.$el.find(".special-layer").hide();
                myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
            }.bind(this))
        },

        onClickCancelButton: function () {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        //点击保存按钮保存特殊策略
        onClickSaveButton: function () {
            if (this.defaultParam.rule.length == 0) {
                alert('请添加规则');
                return;
            }
            _.each(this.defaultParam.rule, function(rule){
                var localIdArray = [], upperObjArray = [];
                _.each(rule.local, function(node){
                    localIdArray.push(node.id)
                }.bind(this))
                _.each(rule.upper, function(node){
                    upperObjArray.push({
                        nodeId: node.rsNodeMsgVo.id,
                        ipCorporation: node.ipCorporation,
                        chiefType: node.chiefType === undefined ? 1 : node.chiefType
                    })
                }.bind(this))

                rule.local = localIdArray;
                rule.upper = upperObjArray;
            }.bind(this))

            var postParam = {
                "topoId": this.model.get('topologyId'),
                "rule": this.defaultParam.rule
            }
            this.collection.specilaAdd(postParam);
        },

        onGetError: function (error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！");
        },

        render: function (target) {
            this.$el.appendTo(target);
        }
    });

    var SelectTopoView = Backbone.View.extend({
        events: {},

        initialize: function (options) {
            this.options = options;
            this.collection = options.collection;
            this.domainArray = options.domainArray;

            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.select.topo.html'])({data: {name: "拓扑关系"}}));

            this.initDomainList();

            require(["setupTopoManage.model"], function (SetupTopoManageModel) {
                this.mySetupTopoManageModel = new SetupTopoManageModel();
                this.mySetupTopoManageModel.on("get.topoInfo.success", $.proxy(this.initTable, this));
                this.mySetupTopoManageModel.on("get.topoInfo.error", $.proxy(this.onGetError, this));
                this.mySetupTopoManageModel.getTopoinfo({
                    name: null,
                    page: 1,
                    size: 99999,
                    type: null
                });
            }.bind(this))
        },

        initDomainList: function () {
            this.domainList = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.domain.html'])({
                data: this.domainArray,
            }));
            if (this.domainArray.length !== 0)
                this.$el.find(".domain-ctn").html(this.domainList[0]);
            else
                this.$el.find(".domain-ctn").html(_.template(template['tpl/empty.html'])());
        },

        initTable: function () {
            this.table = $(_.template(template['tpl/setupSendManage/setupSendWaitSend/setupSendWaitSend.sendStrategy.table.html'])({
                data: this.mySetupTopoManageModel.models,
            }));
            if (this.mySetupTopoManageModel.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        onSure: function () {
            var selectedTopo = this.$el.find("input:checked");
            if (!selectedTopo.get(0)) {
                alert("请选择一个拓扑关系")
                return false;
            }
            var topoId = selectedTopo.get(0).id,
                domainIdArray = [];

            _.each(this.domainArray, function (el, index, ls) {
                domainIdArray.push(el.id)
            }.bind(this))

            var postParam = {
                topologyId: topoId,
                originIdList: domainIdArray
            };

            return postParam
        },

        onGetError: function (error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function (target) {
            this.$el.appendTo(target);
        }
    });

    var SetupChannelManageView = Backbone.View.extend({
        events: {},

        initialize: function (options) {
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
            this.enterKeyBindQuery();

            this.queryArgs = {
                "domain": null,
                "type": null,
                "protocol": null,
                "cdnFactory": null,
                "auditStatus": null,
                "topologyId": null,
                "currentPage": 1,
                "pageSize": 10
            }
            this.onClickQueryButton();
        },

        enterKeyBindQuery: function () {
            $(document).on('keydown', function (e) {
                if (e.keyCode == 13) {
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetError: function (error) {
            this.disablePopup && this.disablePopup.$el.modal('hide');
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onChannelListSuccess: function () {
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function () {
            this.isInitPaginator = false;
            this.queryArgs.currentPage = 1;
            this.queryArgs.domain = this.$el.find("#input-domain").val();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.queryChannel(this.queryArgs);
        },

        initTable: function () {
            this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
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
        },

        onClickMultiModifyTopology: function () {
            var checkedList = this.collection.filter(function (model) {
                return model.get("isChecked") === true;
            });

            this.domainArray = [];
            _.each(checkedList, function (el, index, ls) {
                this.domainArray.push({
                    domain: el.get("domain"),
                    version: el.get("version"),
                    description: el.get("description"),
                    id: el.get("id")
                });
            }.bind(this))

            if (this.selectTopoPopup) $("#" + this.selectTopoPopup.modalId).remove();

            var type = AUTH_OBJ.ApplyChangeTopo ? 2 : 1;
            var mySelectTopoView = new SelectTopoView({
                collection: this.collection,
                domainArray: this.domainArray
            });
            var options = {
                title: "选择拓扑关系",
                body: mySelectTopoView,
                backdrop: 'static',
                type: type,
                onOKCallback: function () {
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
                onHiddenCallback: function () {
                    this.enterKeyBindQuery();
                }.bind(this)
            }
            this.selectTopoPopup = new Modal(options);
        },

        showDisablePopup: function (msg) {
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

        onAddChannelTopologySuccess: function () {
            var postParam = [];
            _.each(this.domainArray, function (el, index, ls) {
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

        onPostPredelivery: function () {
            this.disablePopup && this.disablePopup.$el.modal('hide');
            alert("批量更换拓扑关系成功！")

            window.location.hash = '#/setupSendWaitSend';
        },

        onClickItemHistory: function (event) {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);

            var myHistoryView = new HistoryView({
                collection: this.collection,
                model: model,
                onSaveCallback: function () {
                }.bind(this),
                onCancelCallback: function () {
                    myHistoryView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myHistoryView.render(this.$el.find(".history-panel"))
        },

        onClickItemSpecialLayer: function (event) {
            var eventTarget = event.srcElement || event.target, id;
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

            var mySpecialLayerManageView = new SpecialLayerManageView({
                collection: this.collection,
                model: model,
                isEdit: true,
                onSaveCallback: function () {
                    this.on('enterKeyBindQuery', $.proxy(this.onClickQueryButton, this));
                    mySpecialLayerManageView.$el.remove();
                    this.$el.find(".list-panel").show();
                    this.onClickQueryButton();
                    this.initRuleTable(data, this.checked);
                }.bind(this),
                onCancelCallback: function () {
                    mySpecialLayerManageView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            mySpecialLayerManageView.render(this.$el.find(".strategy-panel"))
        },

        onClickItemEdit: function (event) {
            require(['setupChannelManage.edit.view'], function (EditChannelView) {
                var eventTarget = event.srcElement || event.target, id;
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
                    onSaveCallback: function () {
                    }.bind(this),
                    onCancelCallback: function () {
                        myEditChannelView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myEditChannelView.render(this.$el.find(".edit-panel"))
            }.bind(this));
        },

        onItemCheckedUpdated: function (event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");
            var model = this.collection.get(id);
            model.set("isChecked", eventTarget.checked)

            var checkedList = this.collection.filter(function (model) {
                return model.get("isChecked") === true;
            })
            if (checkedList.length === this.collection.models.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.collection.models.length)
                this.table.find("thead input").get(0).checked = false;
            if (checkedList.length === 0) {
                this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
            } else {
                this.$el.find(".multi-modify-topology").removeAttr("disabled", "disabled");
            }
        },

        onAllCheckedUpdated: function (event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function (model) {
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
            if (eventTarget.checked) {
                this.$el.find(".multi-modify-topology").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
            }
        },

        initPaginator: function () {
            this.$el.find(".total-items span").html(this.collection.total)

            if (this.collection.total <= this.queryArgs.pageSize) return;
            var total = Math.ceil(this.collection.total / this.queryArgs.pageSize);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
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

        initChannelDropMenu: function () {
            var statusArray = [
                    {name: "全部", value: "All"},
                    {name: "删除", value: -1},
                    {name: "审核中", value: 0},
                    {name: "审核通过", value: 1},
                    {name: "审核失败", value: 2},
                    {name: "停止", value: 3},
                    {name: "配置中", value: 4},
                    {name: "编辑中", value: 6},
                    {name: "待下发", value: 7},
                    {name: "待定制", value: 8},
                    {name: "定制化配置错误", value: 9},
                    {name: "下发中", value: 10},
                    {name: "下发失败", value: 11},
                    {name: "下发成功", value: 12},
                    {name: "运行中", value: 13},
                    {name: "配置失败", value: 14}
                ],
                rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function (value) {
                if (value == "All")
                    this.queryArgs.auditStatus = null;
                else
                    this.queryArgs.auditStatus = parseInt(value)
            }.bind(this));

            var protocolArray = [
                    {name: "全部", value: "All"},
                    {name: "http+hlv", value: 1},
                    {name: "hls", value: 2},
                    {name: "rtmp", value: 3}
                ],
                rootNode = this.$el.find(".dropdown-protocol");
            Utility.initDropMenu(rootNode, protocolArray, function (value) {
                if (value == "All")
                    this.queryArgs.protocol = null;
                else
                    this.queryArgs.protocol = parseInt(value)
            }.bind(this));

            var companyArray = [
                    {name: "全部", value: "All"},
                    {name: "自建", value: 1},
                    {name: "网宿", value: 2}
                ],
                rootNode = this.$el.find(".dropdown-company");
            Utility.initDropMenu(rootNode, companyArray, function (value) {
                if (value == "All")
                    this.queryArgs.cdnFactory = null;
                else
                    this.queryArgs.cdnFactory = parseInt(value)
            }.bind(this));

            var typeArray = [
                    {name: "全部", value: "All"},
                    {name: "下载加速", value: 1},
                    {name: "直播加速", value: 2}
                ],
                rootNode = this.$el.find(".dropdown-type");
            Utility.initDropMenu(rootNode, typeArray, function (value) {
                if (value == "All")
                    this.queryArgs.type = null;
                else
                    this.queryArgs.type = parseInt(value)
            }.bind(this));

            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "3000条", value: 3000}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function (value) {
                this.queryArgs.pageSize = value;
                this.queryArgs.currentPage = 1;
                this.onClickQueryButton();
            }.bind(this));

            require(["setupTopoManage.model"], function (SetupTopoManageModel) {
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
        },

        onGetTopoSuccess: function () {
            var topoArray = [{name: "全部", value: "All"}]
            this.mySetupTopoManageModel.each(function (el, index, lst) {
                topoArray.push({
                    name: el.get('name'),
                    value: el.get('id')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-topo");
            Utility.initDropMenu(rootNode, topoArray, function (value) {
                if (value == "All")
                    this.queryArgs.topologyId = null;
                else
                    this.queryArgs.topologyId = parseInt(value)
            }.bind(this));
        },

        hide: function () {
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function (target) {
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target || this.target);
        },

        render: function (target) {
            this.$el.appendTo(target);
            this.target = target;
        }
    });

    return SetupChannelManageView;
});