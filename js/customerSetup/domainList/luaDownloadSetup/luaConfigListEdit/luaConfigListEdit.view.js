define("luaConfigListEdit.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LuaConfigListEditView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.path = 'index.html#/domainList/'+options.query+"/luaAdvanceConfig/"+options.query2;
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                configListInfo = JSON.parse(options.query3),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaConfigListEdit/luaConfigListEdit.html'])());
            this.domainInfo = domainInfo;
            this.clientInfo = clientInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))
            
            
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(this.onShownTab, this));
            this.$el.find(".return").on("click",$.proxy(this.onReturnClick,this));
            
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
                    this.luaConfigSet();
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

        luaConfigSet:function(){
            //缓存设置
        },

        httpHeaderControl:function(){
            //http头控制
        },

        referSet:function(){
            //防盗链
        },

        speedSet:function(){
            //限速
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