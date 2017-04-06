define("setupChannelManage.select.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var SelectLayerView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.domainArray = options.domainArray;

                this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.select.topo.html'])({
                    data: {
                        name: "分层策略"
                    }
                }));

                this.initDomainList();

                this.$el.find("#input-layer").on('keyup', $.proxy(this.onKeyupLayerInput, this));

                require(["specialLayerManage.model"], function(SpecialLayerManageModel) {
                    this.mySpecialLayerManageModel = new SpecialLayerManageModel();
                    this.mySpecialLayerManageModel.on("get.strategyList.success", $.proxy(this.initTable, this));
                    this.mySpecialLayerManageModel.on("get.strategyList.error", $.proxy(this.onGetError, this));
                    this.mySpecialLayerManageModel.getStrategyList({
                        name: null,
                        page: 1,
                        size: 99999,
                        type: null
                    });
                }.bind(this))
            },

            initDomainList: function() {
                this.domainList = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.domain.html'])({
                    data: this.domainArray,
                }));
                if (this.domainArray.length !== 0)
                    this.$el.find(".domain-ctn").html(this.domainList[0]);
                else
                    this.$el.find(".domain-ctn").html(_.template(template['tpl/empty.html'])());
            },

            onKeyupLayerInput: function() {
                if (!this.mySpecialLayerManageModel.models || this.mySpecialLayerManageModel.models.length === 0) return;
                var keyWord = this.$el.find("#input-layer").val();

                _.each(this.mySpecialLayerManageModel.models, function(model, index, list) {
                    if (keyWord === "") {
                        model.set("notDisplay", false);
                    } else {
                        if (model.get("name").indexOf(keyWord) > -1)
                            model.set("notDisplay", false);
                        else
                            model.set("notDisplay", true);
                    }
                }.bind(this));
                this.initTable();
            },

            initTable: function() {
                this.table = $(_.template(template['tpl/specialLayerManage/specialLayerManage.radio.table.html'])({
                    data: this.mySpecialLayerManageModel.models,
                }));
                if (this.mySpecialLayerManageModel.models.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            },

            onSure: function() {
                var selectedTopo = this.$el.find("input:checked");
                if (!selectedTopo.get(0)) {
                    alert("请选择一个拓扑关系")
                    return false;
                }
                var topoId = selectedTopo.get(0).id,
                    topologyName = selectedTopo.siblings('span').html(),
                    domainIdArray = [];

                _.each(this.domainArray, function(el, index, ls) {
                    domainIdArray.push(el.id)
                }.bind(this))

                var postParam = {
                    ruleId: topoId,
                    ruleName: topologyName,
                    originIdList: domainIdArray
                };

                return postParam
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

        var SelectTopoView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.domainArray = options.domainArray;

                this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.select.topo.html'])({
                    data: {
                        name: "拓扑关系"
                    }
                }));

                this.initDomainList();
                require(["setupTopoManage.model"], function(SetupTopoManageModel) {
                    this.mySetupTopoManageModel = new SetupTopoManageModel();
                    this.mySetupTopoManageModel.on("get.topoInfo.success", $.proxy(this.onGetTopoInfo, this));
                    this.mySetupTopoManageModel.on("get.topoInfo.error", $.proxy(this.onGetError, this));
                    this.mySetupTopoManageModel.getTopoinfo({
                        name: null,
                        page: 1,
                        size: 99999,
                        type: null
                    });
                }.bind(this))
            },

            onGetTopoInfo: function() {
                this.initTopoTable()
                this.$el.find(".layer-toggle .togglebutton input").on("click", $.proxy(this.onClickToggle, this));
                var mySelectLayerView = new SelectLayerView({
                    collection: this.collection,
                    domainArray: this.domainArray
                });

                mySelectLayerView.$el.find(".domain-list").remove()
                mySelectLayerView.render(this.$el.find(".layer-ctn"))
            },

            onClickToggle: function() {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                if (eventTarget.checked) {
                    this.$el.find(".layer-ctn").show();
                } else {
                    this.$el.find(".layer-ctn").hide();
                }
            },

            initDomainList: function() {
                this.domainList = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.domain.html'])({
                    data: this.domainArray,
                }));
                if (this.domainArray.length !== 0)
                    this.$el.find(".domain-ctn").html(this.domainList[0]);
                else
                    this.$el.find(".domain-ctn").html(_.template(template['tpl/empty.html'])());
            },

            initTopoTable: function() {
                this.table = $(_.template(template['tpl/setupSendManage/setupSendWaitSend/setupSendWaitSend.sendStrategy.table.html'])({
                    data: this.mySetupTopoManageModel.models,
                }));
                if (this.mySetupTopoManageModel.models.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            },

            onSure: function() {
                var selectedTopo = this.$el.find(".topo input:checked");
                if (!selectedTopo.get(0)) {
                    alert("请选择一个拓扑关系")
                    return false;
                }
                var topoId = selectedTopo.get(0).id,
                    topologyName = selectedTopo.siblings('span').html(),
                    domainIdArray = [];

                _.each(this.domainArray, function(el, index, ls) {
                    domainIdArray.push(el.id)
                }.bind(this))

                var postParam = {
                    topologyId: topoId,
                    originIdList: domainIdArray,
                    topologyName: topologyName
                };

                var isOpenLayer = this.$el.find(".layer-toggle .togglebutton input").get(0).checked;

                if (isOpenLayer) {
                    var selectedLayer = this.$el.find(".layer input:checked");
                    if (!selectedLayer.get(0)) {
                        alert("请选择一个分层策略")
                        return false;
                    }
                    var layerId = selectedLayer.get(0).id;
                    var layerName = selectedLayer.siblings('span').html();
                    postParam.topologyRuleId = layerId;
                    postParam.ruleName = layerName;
                }
                return postParam
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

        exports.SelectLayerView = SelectLayerView;
        exports.SelectTopoView = SelectTopoView;
    });