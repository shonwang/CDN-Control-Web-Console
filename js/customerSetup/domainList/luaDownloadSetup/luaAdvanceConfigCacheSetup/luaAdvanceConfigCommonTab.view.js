define("luaAdvanceConfigCommonTab.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LuaAdvanceConfigCommonTabView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
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
                data:obj
            }));
            this.render();
            this.bindEvents();
        },

        bindEvents:function(){
            this.$el.find("input[name=advanceCommonTabs]").on("change",$.proxy(this.onRadiosChange,this));
        },

        onRadiosChange:function(){
            
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