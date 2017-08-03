define("luaAdvanceConfigCacheSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LuaAdvanceConfigCacheSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaAdvanceConfigCacheSetup/cacheSetup.html'])());

            this.initSetup();
        },

        initSetup:function(){
            //请求接口后设置缓存时间
            this.setCacheTimeView();
            this.setDelMarkView()
        },

        setCacheTimeView:function(){
            //加载缓存时间视图
            if(this.cacheTimeView){
                this.cacheTimeView.update(this.$el.find(".advance-config-cacheSetup-panel-content-cacheTime"));
                return false;
            }

            require(["luaAdvanceConfigCommonTab.view"],function(LuaAdvanceConfigCommonTabView){
                this.cacheTimeView = new LuaAdvanceConfigCommonTabView({
                    title:"缓存时间",
                    collection:this.collection,
                    onSaveCallback:function(){},
                    target:this.$el.find(".advance-config-cacheSetup-panel-content-cacheTime")
                });
            }.bind(this));
        },

        setDelMarkView:function(){
            //加载去问号视图
            if(this.delMarkView){
                this.delMarkView.update(this.$el.find(".advance-config-cacheSetup-panel-content-delMark"));
                return false;
            }

            require(["luaAdvanceConfigCommonTab.view"],function(LuaAdvanceConfigCommonTabView){
                this.delMarkView = new LuaAdvanceConfigCommonTabView({
                    title:"去问号缓存",
                    collection:this.collection,
                    target:this.$el.find(".advance-config-cacheSetup-panel-content-delMark")
                });
            }.bind(this));
        },

        update: function(target){
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },
        
        render:function(target){
            this.$el.appendTo(target);
        }

    });

    return LuaAdvanceConfigCacheSetupView;
});