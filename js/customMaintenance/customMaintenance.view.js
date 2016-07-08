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

    return CustomMaintenanceView;
});