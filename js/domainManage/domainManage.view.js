define("domainManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddDomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {

        },

        
        getArgs: function() {
            
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var EditDomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {

        },

        
        getArgs: function() {
            
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var DomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/domainManage/domainManage.html'])());
            this.initTable();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/domainManage/domainManage.table.html'])());
            this.$el.find(".table-ctn").html(this.table[0]);
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function() {
            this.$el.hide();
        },

        update: function() {
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DomainManageView;
});