define("businessManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var AddOrEditFlieView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit     = options.isEdit;
            this.model      = options.model;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var BusinessManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/liveAllSetup/liveAllSetup.html'])());
            this.$el.find(".list .table-ctn").html(_.template(template['tpl/loading.html'])({}));
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

    return BusinessManageView;
});