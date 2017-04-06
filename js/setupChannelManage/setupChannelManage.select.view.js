define("setupChannelManage.select.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

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

            initDomainList: function() {
                this.domainList = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.domain.html'])({
                    data: this.domainArray,
                }));
                if (this.domainArray.length !== 0)
                    this.$el.find(".domain-ctn").html(this.domainList[0]);
                else
                    this.$el.find(".domain-ctn").html(_.template(template['tpl/empty.html'])());
            },

            initTable: function() {
                this.table = $(_.template(template['tpl/setupSendManage/setupSendWaitSend/setupSendWaitSend.sendStrategy.table.html'])({
                    data: this.mySetupTopoManageModel.models,
                }));
                if (this.mySetupTopoManageModel.models.length !== 0)
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
                    domainIdArray = [];

                _.each(this.domainArray, function(el, index, ls) {
                    domainIdArray.push(el.id)
                }.bind(this))

                var postParam = {
                    topologyId: topoId,
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

        exports.SelectTopoView = SelectTopoView;
    });