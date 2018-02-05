define("nodeManage.chosePlatform.view", ['require', 'exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var ChosePlatformView=Backbone.View.extend({
        initialize:function(options){
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.chosePlatform.html'])({}));
            this.initDropMenu();
        },

        initDropMenu:function(){
            this.apply=[{
                    name:"Live",
                    value:203
               },{
                    name:"Cache",
                    value:202
            }]
            var rootNode=this.$el.find(".dropdown-app")
            Utility.initDropMenu(rootNode, this.apply,function(value){
                this.platformId=value
            }.bind(this));
            this.$el.find("#dropdown-app .cur-value").html(this.apply[0].name)
            this.platformId=this.apply[0].value
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });
    return ChosePlatformView
})