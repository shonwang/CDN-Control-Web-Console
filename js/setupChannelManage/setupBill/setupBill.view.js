define("setupBill.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SetupBillView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.html'])());
            // var clientInfo = JSON.parse(options.query), 
            //     domainInfo = JSON.parse(options.query2),
            //     userInfo = {
            //         clientName: clientInfo.clientName,
            //         domain: domainInfo.domain,
            //         uid: clientInfo.uid
            //     }
            // this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
            //     data: userInfo,
            //     notShowBtn: true
            // }));
            // this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.$el.find(".cancel").on("click", $.proxy(this.onClickBackButton, this))

        },

        onClickBackButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query){
            this.options.query = query;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(this.target);
        },

        render: function(target){
            this.$el.appendTo(target);
            this.target = target;
        }
    });

    return SetupBillView;
});