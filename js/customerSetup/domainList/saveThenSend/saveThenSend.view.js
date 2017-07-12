define("saveThenSend.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SaveThenSendView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/saveThenSend/saveThenSend.html'])());

            this.collection.on("get.send.success", $.proxy(this.onSendSuccess, this));
            this.collection.on("get.send.error", $.proxy(this.onGetError, this));

            if (!this.options.isRealLive){
                require(['setupBill.view', 'setupBill.model'], function(SetupBillView, SetupBillModel){
                    var mySetupBillModel = new SetupBillModel();
                    var mySetupBillView = new SetupBillView({
                        collection: mySetupBillModel,
                        originId: this.options.domainInfo.id,
                        isFromPublish: true,
                        onSaveCallback: function(){}.bind(this),
                        onCancelCallback: function(){}.bind(this)
                    })
                    mySetupBillView.render(this.$el.find(".bill-ctn"));
                    mySetupBillView.$el.find(".opt-ctn").remove();
                }.bind(this))
            } else {
                require(['setupBillLive.view', 'setupBill.model'], function(SetupBillView, SetupBillModel){
                    var mySetupBillModel = new SetupBillModel();
                    var mySetupBillView = new SetupBillView({
                        collection: mySetupBillModel,
                        originId: this.options.domainInfo.id,
                        isFromPublish: true,
                        onSaveCallback: function(){}.bind(this),
                        onCancelCallback: function(){}.bind(this)
                    })
                    mySetupBillView.render(this.$el.find(".bill-ctn"));
                    mySetupBillView.$el.find(".opt-ctn").remove();
                }.bind(this))
            }
        },

        onSendSuccess: function(res) {
            var message = "";
            if (res.mainDomain) {
                this.modalRoot.modal('hide');
                message = "域名" + this.options.domainInfo.domain + "存在共享配置，此操作只能修改回源配置，" + 
                          "如需要修改nginx配置请发布共享配置组中的主域名" + res.mainDomain + "，是否确定执行修改回源配置的操作。"
                Utility.confirm(message, function(){
                    this.excutePreDelivery(res);
                }.bind(this))
            } else {
                this.excutePreDelivery(res)
            }

        },

        excutePreDelivery: function(res){
            require(["setupChannelManage.model"], function(SetupChannelManageModel){
                this.mySetupChannelManageModel = new SetupChannelManageModel();

                var postParam = [{
                        domain: this.options.domainInfo.domain,
                        version: res.version,
                        configReason: 1,
                        description: this.options.description
                    }]

                this.mySetupChannelManageModel.off("post.predelivery.success");
                this.mySetupChannelManageModel.off("post.predelivery.error");
                this.mySetupChannelManageModel.on("post.predelivery.success", $.proxy(this.onPostPredelivery, this));
                this.mySetupChannelManageModel.on("post.predelivery.error", $.proxy(this.onGetError, this));
                this.mySetupChannelManageModel.predelivery(postParam)
            }.bind(this))
        },

        onPostPredelivery: function(){
            Utility.alerts("配置已发布，生成配置文件后将进入待下发阶段!", "success", 3000)
            this.options.onSendSuccess && this.options.onSendSuccess();
        },

        sendConfig: function() {
            this.collection.publishConfig({originId: this.options.domainInfo.id});
            this.$el.find(".alert strong").html("服务器正在努力的处理中...")
            this.modalRoot.find(".ok").remove();
            this.modalRoot.find(".cancel").remove();
            this.modalRoot.find(".close").remove();
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("网络阻塞，请刷新重试！")
            this.options.onSendSuccess && this.options.onSendSuccess();
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
        },

        render: function(target, modalRoot) {
            this.$el.appendTo(target)
            // modalRoot.find(".ok").removeClass("btn-primary").addClass("btn-default").html("发布");
            // modalRoot.find(".cancel").removeClass("btn-default").addClass("btn-primary").html("暂不发布，继续编辑");
            this.modalRoot = modalRoot;
        }
    });

    return SaveThenSendView;
});