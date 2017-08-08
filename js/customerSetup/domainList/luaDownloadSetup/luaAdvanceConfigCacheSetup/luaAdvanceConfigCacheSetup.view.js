define("luaAdvanceConfigCacheSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LuaAdvanceConfigCacheSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.locationId = options.locationId;
            this.domainInfo = options.domainInfo;
            this.clientInfo = options.clientInfo;
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
                this.cacheTimeView.updateCacheTime(this.$el.find(".advance-config-cacheSetup-panel-content-cacheTime"),this.locationId,this.domainInfo,this.clientInfo);
                return false;
            }

            require(["luaAdvanceConfigCacheSetupCacheTime.view","luaAdvanceConfigCacheSetupCacheTime.model"],function(LuaAdvanceConfigCacheSetupCacheTimeView,LuaAdvanceConfigCacheSetupCacheTimeModel){
                var M = new LuaAdvanceConfigCacheSetupCacheTimeModel();
                this.cacheTimeView = new LuaAdvanceConfigCacheSetupCacheTimeView({
                    collection:M,
                    locationId:this.locationId,
                    domainInfo:this.domainInfo,
                    clientInfo:this.clientInfo,
                    target:this.$el.find(".advance-config-cacheSetup-panel-content-cacheTime")
                });
            }.bind(this));
        },

        setDelMarkView:function(){
            //加载去问号视图
            if(this.delMarkView){
                this.delMarkView.updateDelMark(this.$el.find(".advance-config-cacheSetup-panel-content-delMark"),this.locationId,this.domainInfo);
                return false;
            }
            require(["luaAdvanceConfigCacheSetupDelMark.view","luaAdvanceConfigCacheSetupDelMark.model"],function(LuaAdvanceConfigCacheSetupDelMarkView,LuaAdvanceConfigCacheSetupDelMarkModel){
                var M = new LuaAdvanceConfigCacheSetupDelMarkModel();
                this.delMarkView = new LuaAdvanceConfigCacheSetupDelMarkView({
                    collection:M,
                    locationId:this.locationId,
                    domainInfo:this.domainInfo,
                    target:this.$el.find(".advance-config-cacheSetup-panel-content-delMark")
                });
            }.bind(this));
            /*
            require(["luaAdvanceConfigCommonTab.view"],function(LuaAdvanceConfigCommonTabView){
                this.delMarkView = new LuaAdvanceConfigCommonTabView({
                    title:"去问号缓存",
                    collection:this.collection,
                    target:this.$el.find(".advance-config-cacheSetup-panel-content-delMark")
                });
            }.bind(this));
            */
        },

        update: function(target,locationId,domainInfo,clientInfo){
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.options.domainInfo = domainInfo;
            this.options.locationId = locationId;
            this.options.clientInfo = clientInfo;
            this.initialize(this.options);
            this.render(target);
        },
        
        render:function(target){
            this.$el.appendTo(target);
        }

    });

    return LuaAdvanceConfigCacheSetupView;
});