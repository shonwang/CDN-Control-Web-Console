define("saveThenSend.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SaveThenSendView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/saveThenSend/saveThenSend.html'])());

            this.collection.on("get.send.success", $.proxy(this.onSendSuccess, this));
            this.collection.on("get.send.error", $.proxy(this.onGetError, this));
        },

        onSendSuccess: function() {
            alert("发布成功！")
            this.options.onSendSuccess && this.options.onSendSuccess();
        },

        sendConfig: function() {
            this.collection.publishConfig({originId: this.options.originId})
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

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return SaveThenSendView;
});