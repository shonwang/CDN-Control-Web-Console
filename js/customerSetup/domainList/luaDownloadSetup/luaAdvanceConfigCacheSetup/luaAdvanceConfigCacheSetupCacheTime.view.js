define("luaAdvanceConfigCacheSetupCacheTime.view", ['require','exports', 'template', 'modal.view', 'utility',"luaCacheRule.view"], function(require, exports, template, Modal, Utility, LuaCacheRule) {

    var LuaAdvanceConfigCacheSetupCacheTimeView = LuaCacheRule.extend({


        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.target = options.target;
            this.initSetupCacheView();
            
        },

        initSetupCacheView:function(){
            require(["luaAdvanceConfigCommonTab.view"],function(LuaAdvanceConfigCommonTabView){
                this.cacheTimeView = new LuaAdvanceConfigCommonTabView({
                    title:"缓存时间",
                    collection:this.collection,
                    onGlobalCallback:function(){
                        this.onGlobalClick();
                    }.bind(this),
                    onCustomCallback:function(){
                        this.onCustomClick();
                    }.bind(this),
                    onSaveCallback:function(){},
                    target:this.target
                });
            }.bind(this));            
        },
        onGlobalClick:function(){
        
        },

        onCustomClick:function(){
            var container = this.cacheTimeView.getTemplateContainer();

            this.$cacheRoleView = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.add.html'])());
            this.$cacheRoleView.appendTo(container);
            this.collection.on("get.policy.success", $.proxy(this.initSetup, this));
            this.collection.on("get.policy.error", $.proxy(this.onGetError, this));
            this.collection.on("set.policy.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.policy.error", $.proxy(this.onGetError, this));
            this.collection.getCachePolicy({originId: this.domainInfo.id});

            this.defaultParam = {
                cacheTimeType: 1,
                cacheTime: 60 * 60 * 24 * 30,
                cacheOriginTime: 60 * 60 * 24 * 30,
            };

            this.initSetup();   
        },

        updateCacheTime: function(target){
            this.options.target = target;
            this.collection.off();
            this.$el.remove();
            this.initialize(this.options);
        }

    });

    return LuaAdvanceConfigCacheSetupCacheTimeView;
});