define("luaAdvanceConfigCacheSetupDelMark.view", ['require','exports', 'template', 'modal.view', 'utility', 'luaDelMarkCache.view'], function(require, exports, template, Modal, Utility, LuaDelMarkCacheView) {

    var LuaAdvanceConfigCacheSetupDelMarkView = LuaDelMarkCacheView.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.locationId = options.locationId;
            this.domainInfo = options.domainInfo;
            this.target = options.target;
            this.initSetupDelMarkView();
        },

        initSetupDelMarkView:function(){
            if(this.delMarkView){
                this.delMarkView.update(this.target);
                this.onRequireDelMarkMessage();
                return false;
            }

            require(["luaAdvanceConfigCommonTab.view"],function(LuaAdvanceConfigCommonTabView){
                this.delMarkView = new LuaAdvanceConfigCommonTabView({
                    random:new Date().valueOf(),
                    title:"去问号缓存",
                    collection:this.collection,
                    onGlobalCallback:function(){
                        this.cacheTimeType = 1;
                    }.bind(this),
                    onCustomCallback:function(){
                        this.cacheTimeType = 2;
                    }.bind(this),
                    onSaveCallback:function(){
                        this.onBeforeClickSaveBtn();
                    }.bind(this),
                    target:this.target
                });
            }.bind(this));  
            
            this.onRequireDelMarkMessage();
        },

        onBeforeClickSaveBtn:function(){
            if(this.cacheTimeType == 1){
                this.collection.delCacheQuestionMark({originId:this.domainInfo.id,locationId:this.locationId});
            }
            else{
                this.defaultParam.locationId = this.locationId;
                this.onClickSaveBtn();
            }
        },

        onRequireDelMarkMessage:function(){

            this.collection.off("get.mark.success");
            this.collection.off("get.mark.error");
            this.collection.off("set.mark.success");
            this.collection.off("set.mark.error");
            this.collection.off("set.delCacheQuestionMark.success");
            this.collection.off("set.delCacheQuestionMark.error");
            this.defaultParam = {
                markType: 1,
                markValue: "",
            };  

            this.collection.on("get.mark.success", $.proxy(this.initSetup, this));
            this.collection.on("get.mark.error", $.proxy(this.onGetError, this));
            this.collection.on("set.mark.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.mark.error", $.proxy(this.onGetError, this));
            this.collection.on("set.delCacheQuestionMark.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.delCacheQuestionMark.error", $.proxy(this.onGetError, this));
            this.collection.getCacheQuestionMark({originId: this.domainInfo.id,locationId:this.locationId});

        },

        initSetup: function(data){
            var data = data.data;
            if(!data){
                //无数据，表示遵循全局配置
                this.delMarkType = 1;
                this.delMarkView.select(1);
            }
            else{
                this.delMarkType = 2;
                this.delMarkView.select(2);
            }
            if (data) {
                this.defaultParam.locationId = data.locationId;
                this.defaultParam.markType = data.markType;
                this.defaultParam.markValue = data.markValue || "";
            }
            var container = this.delMarkView.getTemplateContainer();
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaDelMarkCache/delMarkCache.add.html'])());
            container.html(this.$el.get(0));

            if (this.defaultParam.markType === 1){
                this.$el.find("#delMarkRadio1").get(0).checked = true;
            } else if (this.defaultParam.markType === 2) {
                this.$el.find("#delMarkRadio2").get(0).checked = true;
                this.$el.find("#sp-param").val(this.defaultParam.markValue)
            } else if (this.defaultParam.markType === 0) {
                this.$el.find("#delMarkRadio3").get(0).checked = true;
            }

            this.$el.find("input[name=delMarkRadio]").on("change",Utility.onContentChange);
            this.$el.find("#sp-param").on("focus",Utility.onContentChange);
        },

        updateDelMark: function(target,locationId,domainInfo){
            this.options.target = target;
            this.options.locationId = locationId;
            this.options.domainInfo = domainInfo;
            this.collection.off();
            this.initialize(this.options);
        }

    });

    return LuaAdvanceConfigCacheSetupDelMarkView;
});