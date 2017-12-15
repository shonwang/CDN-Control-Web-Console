define("setupModuleManage.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var SetupModuleManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupModuleManage/setupModuleManage.html'])());
            this.$el.find(".createModule").on("click",$.proxy(this.onClickAddModule,this));
            this.moduleList=[{
                id:1,
                moduleName:"直播日志",
                moduleKey:"ssss",//模块key
                type:2,
                valueType:1,
                defaultDisplay:true,
                moduleDescription:"直播日志"   
            },{
                id:2,
                moduleName:"直播转推",
                moduleKey:"aaaa",//模块key
                type:3,
                valueType:2,
                defaultDisplay:true,
                moduleDescription:"直播转推"   
            }]
            this.initTable();
        },
        
        onClickAddModule:function(){
            this.hideList();
             require(["setupModuleManage.addModule.view"], function(AddModule) {
                this.addModule = new AddModule({
                    collection: this.collection,
                    isEdit: false
                });
                this.addModule.render(this.$el.find(".addModule"));
            }.bind(this))
           
        },

        
        showList: function() {
            this.$el.find(".moduleManage").show();
        },

        hideList: function() {
            this.$el.find(".moduleManage").hide();
        },

        initTable:function(){
            this.table = $(_.template(template['tpl/setupModuleManage/setupModuleManage.table.html'])({
                data:this.moduleList
            }));
            this.$el.find(".table-ctn").html(this.table[0]);
            this.table.find(".editModule").on("click",$.proxy(this.onClickEditModule,this));
        },
        
        onClickEditModule:function(){
            this.hideList();
             require(["setupModuleManage.addModule.view"], function(AddModule) {
                this.addModule = new AddModule({
                    collection: this.collection,
                    isEdit: true,
                });
                this.addModule.render(this.$el.find(".addModule"));
            }.bind(this))
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

    return SetupModuleManageView;
});