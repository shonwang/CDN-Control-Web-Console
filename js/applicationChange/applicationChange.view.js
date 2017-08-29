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

            this.collection.on("get.applicaction.success",$.proxy(this.getApplicationSuccess,this));
            this.collection.on("get.applicaction.error",$.proxy(this.onGetError,this));

            this.collection.on("modify.application.success",$.proxy(this.setApplicationSuccess,this));
            this.collection.on("modify.application.error",$.proxy(this.onGetError,this));

            this.$el.find(".query").on("click",$.proxy(this.onClickQueryButton,this));
            this.initDropdownMenu();
            this.args = {};
            this.isCanSearch = false;
            this.$el.find(".save").on("click",$.proxy(this.onClickSaveButton,this));
            this.$el.find("#input-domain").on("focus",$.proxy(this.onInputFocus,this));
            this.$el.find("#input-domain").on("blur",$.proxy(this.onInputBlur,this));
            this.enterKeyBindQuery();
            //this.collection.trigger("get.applicaction.success",{});
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13 && this.isCanSearch){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onInputFocus:function(){
            this.isCanSearch = true;
        },

        onInputBlur:function(){
            this.isCanSearch = false;
        },

        onClickSaveButton:function(){
            var args = this.args;
            if(!args.originId){
                alert("请先查询你的域名是否存在");
                return false;
            }
            if(!args.applicationType){
                alert("请选择平台");
                return false;
            }

            if(!args.topologyId){
                alert("请选择拓扑");
                return false;
            }

            this.collection.modifyApplication(args);
        },

        onClickQueryButton:function(){
            var val = this.$el.find("#input-domain").val();
            if(!val){
                alert("请输入要查询的域名");
                return false;
            }
            var args = {
                domain:val
            };
            this.showLoading();
            this.collection.getApplication(args);
        },

        getApplicationSuccess:function(){
            var _data = this.collection.models[0].attributes.originId;//如果没有oringinId说明不存在这个域名
            if(!_data){
                this.$el.find(".table").html(_.template(template['tpl/empty.html'])());
                return false;
            }

            this.initTable();
        },

        setApplicationSuccess:function(){
            alert("保存成功");
        },

        showLoading:function(){
            this.$el.find(".table").html(_.template(template['tpl/loading.html'])());
        },

        initTable:function(){
            var _data =this.collection.models[0].attributes ;
            this.table = $(_.template(template['tpl/applicationChange/applicationChange.table.html'])({data:_data}));
            this.$el.find(".table-ctn").html(this.table[0]);
            this.args.originId = _data.originId;
            this.$el.find("#input-topu-domain").val(_data.domain);
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
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return ApplicationChangeView;
});