define("applicationChange.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var ApplicationChangeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/applicationChange/applicationChange.html'])());

            this.collection.off("get.topoInfo.success");
            this.collection.off("get.topoInfo.error");

            this.collection.on("get.topoInfo.success",$.proxy(this.getTopuInfoSuccess,this));
            this.collection.on("get.topoInfo.error",$.proxy(this.onGetError,this));
            


            this.initDropdownMenu();
            this.args = {};
        },
        
        topuList:{
            202:null,//cache
            203:null//live
        },

        initDropdownMenu:function(){
            var applicationList = [
                {name:"Cache",value:202},
                {name:"Live",value:203}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-application"), applicationList, function(value) {
                this.args.applicationType = parseInt(value);
                this.toSetTopuList(parseInt(value));
            }.bind(this));   
        },

        toSetTopuList:function(value){
            var topuList = this.topuList;
            if(topuList[value]){
                this.setTopuList(value);
            }else{
                this.getTopuList(value);
            }
        },

        getTopuList:function(type){
            this.$el.find(".dropdown-topuList .cur-value").html("加载中...");
            this.collection.getTopoinfo({
                name:null,
                page:1,
                size:9999,
                type:type
            });
        },

        getTopuInfoSuccess:function(data){
            var _data = data.rows;
            var cache202List = [];
            var type = null;
            _.each(_data,function(el){
                el.value = el.id;
                type = el.type;
            })
            this.topuList[type]=_data;
            this.setTopuList(type);
        },
        
        setTopuList:function(type){
            var topuList = this.topuList;
            var data = topuList[type];
            var topuInfo = {};
            _.each(data,function(el){
                topuInfo[el.id] = el;
            });
            Utility.initDropMenu(this.$el.find(".dropdown-topuList"), data, function(value) {
                this.args.topologyId = parseInt(value);
                this.args.topologyName = topuInfo[value].name;
            }.bind(this));     
            this.$el.find(".dropdown-topuList .cur-value").html("请选择");

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
            this.$el.appendTo(target);
        }
    });

    return ApplicationChangeView;
});