define("luaConfigListEdit.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LuaConfigListEditView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.path = 'index.html#/domainList/'+options.query+"/luaAdvanceConfig/"+options.query2;
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaConfigListEdit/luaConfigListEdit.html'])());
            this.domainInfo = domainInfo;
            this.clientInfo = clientInfo;
            this.locationId = JSON.parse(options.query3),
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));
            
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(this.onShownTab, this));
            this.$el.find(".return").on("click",$.proxy(this.onReturnClick,this));

            this.initSetup();
            
        },

        initSetup:function(){
            //上来加载缓存页
            this.luaConfigCacheSetup();
        },

        onReturnClick:function(e){
            var eventTarget = e.target;
            var IS_ALERT_SAVE = window.IS_ALERT_SAVE;
            if(IS_ALERT_SAVE){
                if (confirm("你确定提交吗？")) {  
                    window.location.href= this.path;
                }  
                else {  
                    return false;
                }  
            }
            else{
                window.location.href= this.path;
            }
        },

        onShownTab: function (e) {
            var eventTarget = e.target;
            var id = $(eventTarget).attr("data-target");
            relatedID = $(e.relatedTarget).attr("data-target");
            switch(id){
                case "#luaconfig-cache-set":
                    this.currentTab = "#luaconfig-cache-set";
                    this.luaConfigCacheSetup();
                    break;
                case "#luaconfig-http-header-control":
                    this.currentTab = "#luaconfig-http-header-control";
                    this.httpHeaderControl();
                    break;
                case "#luaconfig-refer-set":
                    this.currentTab = "#luaconfig-refer-set";
                    this.referSet();
                    break;
                case "#luaconfig-speed-set":
                    this.currentTab = "#luaconfig-speed-set";
                    this.speedSet();
                    break;
            }
        },

        luaConfigCacheSetup:function(){
            //缓存设置
            if(this.cacheSetupView){
                this.cacheSetupView.update(this.$el.find("#luaconfig-cache-set"),this.locationId,this.domainInfo);
                return false;
            }
            require(["luaAdvanceConfigCacheSetup.view","luaAdvanceConfigCacheSetup.model"],function(LuaAdvanceConfigCacheSetupView,LuaAdvanceConfigCacheSetupModel){
                var M = new LuaAdvanceConfigCacheSetupModel();
                this.cacheSetupView = new LuaAdvanceConfigCacheSetupView({
                    collection:M,
                    locationId:this.locationId,
                    domainInfo:this.domainInfo
                });
                this.cacheSetupView.render(this.$el.find("#luaconfig-cache-set"));
            }.bind(this));
        },

        httpHeaderControl:function(){
            //http头控制
            if(this.httpHeaderOptView){
                var domainId = this.domainInfo.id;
                this.httpHeaderOptView.update(domainId,this.$el.find("#luaconfig-http-header-control"));
                return false;    
            }
            require(["luaAdvanceConfigHttpHeaderOpt.view","luaAdvanceConfigHttpHeaderOpt.model"],function(LuaAdvanceConfigHttpHeaderOptView,LuaAdvanceConfigHttpHeaderOptModel){
               var M = new LuaAdvanceConfigHttpHeaderOptModel();
               this.httpHeaderOptView = new LuaAdvanceConfigHttpHeaderOptView({
                    collection:M,
                    domainId:this.domainInfo.id
                });

                this.httpHeaderOptView.render(this.$el.find("#luaconfig-http-header-control"));
            }.bind(this));

        },

        referSet:function(){
            //防盗链
            this.getAdvanceIpBlackWhiteList();
            this.getAdvanceRefererAntiLeech();
            this.getAdvanceTimestamp();
        },

        speedSet:function(){
            //限速
            if(this.luaAdvanceClientLimitSpeedView){
                this.luaAdvanceClientLimitSpeedView.update(this.domainInfo, this.locationId, this.$el.find("#luaconfig-speed-set"));
                return false;    
            }
            require(["luaAdvanceClientLimitSpeed.view","luaAdvanceClientLimitSpeed.model"],
                function(LuaAdvanceClientLimitSpeedView,LuaAdvanceClientLimitSpeedModel){
                   var myLuaAdvanceClientLimitSpeedModel = new LuaAdvanceClientLimitSpeedModel();
                   this.luaAdvanceClientLimitSpeedView = new LuaAdvanceClientLimitSpeedView({
                        collection: myLuaAdvanceClientLimitSpeedModel,
                        domainInfo: this.domainInfo,
                        locationId: this.locationId
                    });

                    this.luaAdvanceClientLimitSpeedView.render(this.$el.find("#luaconfig-speed-set"));
            }.bind(this));
        },

        getAdvanceIpBlackWhiteList: function(){
            var tabNode = this.$el.find("#luaconfig-refer-set #collapseOne .panel-body")

            if(this.luaAdvanceIpBlackWhiteListView){
                this.luaAdvanceIpBlackWhiteListView.update(this.domainInfo, this.locationId, tabNode);
                return false;    
            }
            require(["luaAdvanceIpBlackWhiteList.view","luaIpBlackWhiteList.model"],
                function(LuaAdvanceIpBlackWhiteListView,LuaAdvanceIpBlackWhiteListModel){
                   var myLuaAdvanceIpBlackWhiteListModel = new LuaAdvanceIpBlackWhiteListModel();
                   this.luaAdvanceIpBlackWhiteListView = new LuaAdvanceIpBlackWhiteListView({
                        collection: myLuaAdvanceIpBlackWhiteListModel,
                        domainInfo: this.domainInfo,
                        locationId: this.locationId
                    });

                    this.luaAdvanceIpBlackWhiteListView.render(tabNode);
            }.bind(this));
        },

        getAdvanceRefererAntiLeech: function(){
            var tabNode = this.$el.find("#luaconfig-refer-set #collapseTwo .panel-body")

            if(this.luaAdvanceRefererAntiLeechView){
                this.luaAdvanceRefererAntiLeechView.update(this.domainInfo, this.locationId, tabNode);
                return false;    
            }
            require(["luaAdvanceRefererAntiLeech.view","luaRefererAntiLeech.model"],
                function(LuaAdvanceRefererAntiLeechView,LuaAdvanceRefererAntiLeechModel){
                   var myLuaAdvanceRefererAntiLeechModel = new LuaAdvanceRefererAntiLeechModel();
                   this.luaAdvanceRefererAntiLeechView = new LuaAdvanceRefererAntiLeechView({
                        collection: myLuaAdvanceRefererAntiLeechModel,
                        domainInfo: this.domainInfo,
                        locationId: this.locationId
                    });
                   
                    this.luaAdvanceRefererAntiLeechView.render(tabNode);
            }.bind(this));
        },

        getAdvanceTimestamp: function(){
            var tabNode = this.$el.find("#luaconfig-refer-set #collapseThree .panel-body")

            if(this.luaAdvanceTimestampView){
                this.luaAdvanceTimestampView.update(this.domainInfo, this.locationId, tabNode);
                return false;    
            }
            require(["luaAdvanceTimestamp.view","luaTimestamp.model"],
                function(LuaAdvanceTimestampView,LuaAdvanceTimestampModel){
                   var myLuaAdvanceTimestampModel = new LuaAdvanceTimestampModel();
                   this.luaAdvanceTimestampView = new LuaAdvanceTimestampView({
                        collection: myLuaAdvanceTimestampModel,
                        domainInfo: this.domainInfo,
                        locationId: this.locationId
                    });
                   
                    this.luaAdvanceTimestampView.render(tabNode);
            }.bind(this));
        },

        onSaveSuccess: function(){
            alert("保存成功！")
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: new SaveThenSendModel(),
                    domainInfo: this.domainInfo,
                    onSendSuccess: function() {
                        this.sendPopup.$el.modal("hide");
                        window.location.hash = '#/domainList/' + this.options.query;
                    }.bind(this)
                });
                var options = {
                    title: "发布",
                    body : mySaveThenSendView,
                    backdrop : 'static',
                    type     : 2,
                    width: 1000,
                    onOKCallback:  function(){
                        mySaveThenSendView.sendConfig();
                    }.bind(this),
                    onHiddenCallback: function(){
                        if (this.sendPopup) $("#" + this.sendPopup.modalId).remove();
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
        },

        onClickSaveBtn: function(){
            var list = [];
            this.collection.each(function(obj){
                list.push({
                    "type": obj.get('type'),
                    "policy": obj.get('policy'),
                    "expireTime": obj.get('expireTime'),
                    "hasOriginPolicy": obj.get('hasOriginPolicy'),
                })
            }.bind(this))

            var postParam = {
                "originId": this.domainInfo.id,
                "userId": this.clientInfo.uid,
                "list": list
            }

            this.collection.setPolicy(postParam)
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query, query2,query3, target){
            this.options.query = query;
            this.options.query2 = query2;
            this.options.query3 = query3;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target){
            this.$el.appendTo(target);
        }
    });

    return LuaConfigListEditView;
});