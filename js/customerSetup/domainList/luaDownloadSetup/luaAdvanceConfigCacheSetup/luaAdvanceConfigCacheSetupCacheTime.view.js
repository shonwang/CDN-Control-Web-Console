define("luaAdvanceConfigCacheSetupCacheTime.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LuaAdvanceConfigCacheSetupCacheTimeView = Backbone.View.extend({


        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.target = options.target;
            this.initSetup();
            
        },

        initSetup:function(){
            require(["luaAdvanceConfigCommonTab.view"],function(LuaAdvanceConfigCommonTabView){
                this.cacheTimeView = new LuaAdvanceConfigCommonTabView({
                    title:"缓存时间",
                    collection:this.collection,
                    onSaveCallback:function(){},
                    target:this.$el.find(".advance-config-cacheSetup-panel-content-cacheTime")
                });
            }.bind(this));            
        },

        update: function(target){
            this.options.target = target;
            this.collection.off();
            this.$el.remove();
            this.initialize(this.options);
        }

    });

    return LuaAdvanceConfigCacheSetupCacheTimeView;
});