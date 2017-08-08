define("luaAdvanceConfigCommonTab.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LuaAdvanceConfigCommonTabView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.random = options.random || '';
            this.options = options;
            this.title = options.title || "----"
            this.target = options.target;
            this.onGlobalCallback = options.onGlobalCallback || function(){};
            this.onCustomCallback = options.onCustomCallback || function(){};
            this.onSaveCallback = options.onSaveCallback || function(){};
            this.initSetup();
            
        },

        initSetup:function(){
            //请求接口后设置缓存时间
            var obj = {
                title:this.title
            };
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaAdvanceConfigCacheSetup/commonTab.html'])({
                data:obj,
                random:this.random
            }));
            this.render();
            this.bindEvents();
        },

        getTemplateContainer:function(){
            return this.$el.find("#advanceCommonTabsRight");
        },

        bindEvents:function(){
            this.$el.find("input[name^='advanceCommonTabs']").on("change",$.proxy(this.onRadiosChange,this));
            this.$el.find(".save").on("click",$.proxy(this.onSaveCallback,this));
        },

        onRadiosChange:function(event){
            var eventTarget = event.target || event.srcElement;
            var value = $(eventTarget).val();
            if(value == 1){
                this.$el.find("#advanceCommonTabsLeft").show();
                this.$el.find("#advanceCommonTabsRight").hide();
                this.onGlobalCallback && this.onGlobalCallback();
            }
            else if(value == 2){
                this.$el.find("#advanceCommonTabsLeft").hide();
                this.$el.find("#advanceCommonTabsRight").show();
                this.onCustomCallback && this.onCustomCallback();
            }
        },
        select:function(i){
            if(i==1){
                this.$el.find("#advanceCommonTabs1").click();
            }
            else if(i==2){
                this.$el.find("#advanceCommonTabs2").click();
            }
        },
        update: function(target){
            this.options.target = target;
            this.collection.off();
            this.$el.remove();
            this.initialize(this.options);
        },
        
        render:function(){
            this.$el.appendTo(this.target);
        }

    });

    return LuaAdvanceConfigCommonTabView;
});