define("setupSendWaitCustomize.stratety.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var SelectStrategyView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.domainArray = options.domainArray;

            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.select.topo.html'])({data: {name: "下发策略"}}));

            this.initDomainList();
            require(["setupTopoManage.model"], function(SetupTopoManageModel){
                this.mySetupTopoManageModel = new SetupTopoManageModel();
                this.mySetupTopoManageModel.on("get.topoInfo.success", $.proxy(this.initTable, this));
                this.mySetupTopoManageModel.on("get.topoInfo.error", $.proxy(this.onGetError, this));
                this.mySetupTopoManageModel.getTopoinfo({
                    name:null,
                    page:1,
                    size:99999,
                    type:null
                });
            }.bind(this))
        },

        initDomainList: function(){
            this.domainList = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.domain.html'])({
                data: this.domainArray, 
            }));
            if (this.domainArray.length !== 0)
                this.$el.find(".domain-ctn").html(this.domainList[0]);
            else
                this.$el.find(".domain-ctn").html(_.template(template['tpl/empty.html'])());
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.topo.table.html'])({
                data: this.mySetupTopoManageModel.models, 
            }));
            if (this.mySetupTopoManageModel.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        onSure: function(){
            var selectedStrategy = this.$el.find("input:checked");
            if (!selectedStrategy.get(0)){
                alert("请选择一个下发策略")
                return false;
            }
            var strategyId = selectedStrategy.get(0).id,
                domainIdArray = [];

            _.each(this.domainArray, function(el, index, ls){
                domainIdArray.push(el.id)
            }.bind(this))

            var postParam = {
                strategyId: strategyId,
                preDeliDomains: domainIdArray,
                name: this.$el.find("#input-task-name").val()
            };

            return postParam
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return SelectStrategyView
});   