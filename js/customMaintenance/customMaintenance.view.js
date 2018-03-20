define("customMaintenance.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var CustomMaintenanceView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/customMaintenance/customMaintenance.html'])());

            this.initList();
        },

        initList: function(){
            this.table = $(_.template(template['tpl/customMaintenance/customMaintenance.list.html'])({}));
            this.$el.find(".list-ctn").html(this.table[0]);
        },

        remove: function(){
            this.$el.remove();
            this.collection.off();
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
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

    return CustomMaintenanceView;
});