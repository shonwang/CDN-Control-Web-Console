define("base.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var BaseView = Backbone.View.extend({
        events: {},

        initialize: function(options) {},

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(target, query) {
            this.options.query = query;
            this.collection.off();
            this.collection.reset();
            this.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return BaseView;
});