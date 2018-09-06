define("domainList.project.view", ['require','exports', 'template','utility', "modal.view"],
    function(require, exports, template, Utility, Modal) {


    var ProjectView = Backbone.View.extend({
        initialize: function(options) {
            this.collection = options.collection;
            this.parent = options.obj;
            this.selectedList = options.selectedList;
            this.$el = $(_.template(template['tpl/customerSetup/customSetup.project.html'])({data:this.selectedList}));
            this.$el.find("#add-domain-btnCancle").on("click",$.proxy(this.onCancel,this));
        },

        onCancel:function(){
            
        },

        updateView:function(obj){
            console.log('ddd');
        },
        
        render: function(target){
            this.$el.appendTo(target);
        }

    });

    return ProjectView;

});