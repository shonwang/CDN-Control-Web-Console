define("saveThenSend.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SaveThenSendView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/saveThenSend/saveThenSend.html'])());

            this.collection.on("get.send.success", $.proxy(this.onSendSuccess, this));
            this.collection.on("get.send.error", $.proxy(this.onGetError, this));

            require(['setupBill.view', 'setupBill.model'], function(SetupBillView, SetupBillModel){
                var mySetupBillModel = new SetupBillModel();
                var mySetupBillView = new SetupBillView({
                    collection: mySetupBillModel,
                    originId: this.options.domainInfo.id,
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){}.bind(this)
                })
                mySetupBillView.render(this.$el.find(".bill-ctn"));
                mySetupBillView.$el.find(".opt-ctn").remove();
            }.bind(this))
        },

        onSendSuccess: function(res) {
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
            alert("配置已发布，生成配置文件后将进入待下发阶段!")
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
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
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