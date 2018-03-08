define("setupSendWaitCustomize.stratety.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var SelectStrategyView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.domainArray = options.domainArray;
            this.model = options.model;
            
            /*
            ** source:specialLayerManage从特殊分层策略过来的，不需要展示文字和涉及的域名
            */
            this.source = options.source || null;

            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.select.topo.html'])({data: {name: "下发策略"}}));
            if(!this.source){
                this.$el.find("#input-task-name").val(this.domainArray[0].domain + "等" + this.domainArray.length + "个域名的下发任务")
            }
            else{
                this.$el.find("#input-task-name").val(this.domainArray[0].domain);
                this.$el.find(".domain-list").hide();
            }
            this.initDomainList();
            require(["setupTopoManageSendStrategy.model"], function(SetupTopoManageSendStrategy){
                this.mySetupTopoManageSendStrategy = new SetupTopoManageSendStrategy();
                this.mySetupTopoManageSendStrategy.on("get.sendInfo.success", $.proxy(this.initTable, this));
                this.mySetupTopoManageSendStrategy.on("get.sendInfo.error", $.proxy(this.onGetError, this));
                this.mySetupTopoManageSendStrategy.getSendinfo({
                    topologyId: this.model.get("topologyId"),
                    page:1,
                    count:99999
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
                data: this.mySetupTopoManageSendStrategy.models, 
            }));
            if (this.mySetupTopoManageSendStrategy.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        onSure: function(){
            var selectedStrategy = this.$el.find("input:checked");
            if (!selectedStrategy.get(0)){
                Utility.alerts("请选择一个下发策略")
                return false;
            }
            var taskName = this.$el.find("#input-task-name").val();
            if (taskName === ""){
                Utility.alerts("请输入任务名称")
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
                Utility.alerts(error.message)
            else
                Utility.alerts("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return SelectStrategyView
});   