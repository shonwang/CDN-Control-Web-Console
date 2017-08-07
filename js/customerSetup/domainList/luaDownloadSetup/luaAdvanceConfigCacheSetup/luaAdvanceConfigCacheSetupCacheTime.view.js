define("luaAdvanceConfigCacheSetupCacheTime.view", ['require','exports', 'template', 'modal.view', 'utility',"luaCacheRule.view"], function(require, exports, template, Modal, Utility, LuaCacheRuleView) {

    var LuaAdvanceConfigCacheSetupCacheTimeView = LuaCacheRuleView.extend({


        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.locationId = options.locationId;
            this.domainInfo = options.domainInfo;
            this.clientInfo = options.clientInfo;
            
            this.target = options.target;
            this.initSetupCacheView();
        },

        initSetupCacheView:function(){
            if(this.cacheTimeView){
                this.cacheTimeView.update(this.target);
                this.onRequireCacheMessage();
                return false;
            }

            require(["luaAdvanceConfigCommonTab.view"],function(LuaAdvanceConfigCommonTabView){
                this.cacheTimeView = new LuaAdvanceConfigCommonTabView({
                    random:new Date().valueOf(),
                    title:"缓存时间",
                    collection:this.collection,
                    onGlobalCallback:function(){
                        this.onGlobalClick();
                    }.bind(this),
                    onCustomCallback:function(){
                        //this.onCustomClick();
                    }.bind(this),
                    onSaveCallback:function(){
                        this.onClickSaveBtn();
                    }.bind(this),
                    target:this.target
                });
            }.bind(this));    
            
            this.onRequireCacheMessage();
        },

        onGlobalClick:function(){
        
        },

        onRequireCacheMessage:function(){
            this.collection.off("get.policy.success");
            this.collection.off("get.policy.error");
            this.collection.off("set.policy.success");
            this.collection.off("set.policy.error");
            //this.$cacheRoleView = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.add.html'])());
            //this.$cacheRoleView.appendTo(container);
            this.collection.on("get.policy.success", $.proxy(this.initSetup, this));
            this.collection.on("get.policy.error", $.proxy(this.onGetError, this));
            this.collection.on("set.policy.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.policy.error", $.proxy(this.onGetError, this));
            this.collection.getCachePolicy({originId: this.domainInfo.id});

            this.defaultParam = {
                cacheTimeType: 1,
                cacheTime: 60 * 60 * 24 * 30,
                cacheOriginTime: 60 * 60 * 24 * 30,
                locationId: this.locationId
            };

            //this.initSetup();   
        },

        initSetup: function(data){
            if (data) {
                this.defaultParam.locationId = data.locationId;
                if (data.expireTime === 0 && data.hasOriginPolicy === 0)
                    this.defaultParam.cacheTimeType = 1;
                if (data.expireTime !== 0 && data.hasOriginPolicy === 0){
                    this.defaultParam.cacheTimeType = 2;
                    this.defaultParam.cacheTime = data.expireTime || 60 * 60 * 24 * 30;
                }
                if (data.expireTime !== 0 && data.hasOriginPolicy === 1){
                    this.defaultParam.cacheTimeType = 3;
                    this.defaultParam.cacheOriginTime = data.expireTime || 60 * 60 * 24 * 30;
                }
            }
            var container = this.cacheTimeView.getTemplateContainer();
            this.$el = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.add.html'])());
            container.html(this.$el.get(0));

            if (this.defaultParam.cacheTimeType === 1){
                this.$el.find("#cacheTimeRadios1").get(0).checked = true;
            } else if (this.defaultParam.cacheTimeType === 2) {
                this.$el.find("#cacheTimeRadios2").get(0).checked = true;
            } else if (this.defaultParam.cacheTimeType === 3){
                this.$el.find("#cacheTimeRadios3").get(0).checked = true;
            }
            this.initTimeDropdown();
            this.$el.find("input[name=cacheTimeRadios]").on("change",Utility.onContentChange);
            this.$el.find("#yes-cache-time").on("focus",Utility.onContentChange);
            this.$el.find("#origin-cache-time").on("focus",Utility.onContentChange);
        },

        updateCacheTime: function(target,locationId,domainInfo,clientInfo){
            this.options.target = target;
            this.options.locationId = locationId;
            this.options.domainInfo = domainInfo;
            this.options.clientInfo = clientInfo;
            this.collection.off();
            this.initialize(this.options);
        }

    });

    return LuaAdvanceConfigCacheSetupCacheTimeView;
});