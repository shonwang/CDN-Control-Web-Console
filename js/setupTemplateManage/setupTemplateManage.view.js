define("setupTemplateManage.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var SetupTemplateManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupTemplateManage/setupLiveDynamicManage.html'])());
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(this.onShownTab, this));

        },

        onShownTab: function (e) {
            var eventTarget = e.target; // newly activated tab
            var id = $(eventTarget).attr("data-target");
            relatedID = $(e.relatedTarget).attr("data-target");
            switch(id){
                case "#live-push":
                    this.currentTab = "#live-push";   
                    break;
                case "#rtmp-flv-pull":
                    this.currentTab = "#rtmp-flv-pull";
                    break;
            }
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(target) {
            this.collection.off();
            this.collection.reset();
            this.remove();
            this.initialize(this.options);
            this.render(target || this.target);
        },

        render: function(target) {
            this.$el.appendTo(target)
            this.target = target;
        }
    });

    return SetupTemplateManageView;
});