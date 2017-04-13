define("cacheKeySetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var CacheKeySetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/cacheKeySetup/cacheKeySetup.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            require(["domainSetup.model"], function(DomainSetupModel){
                var myDomainSetupModel = new DomainSetupModel();
                    myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
                    myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                    myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
            }.bind(this))
        },

        onGetDomainInfo: function(data){
            this.defaultParam = {
                cacheKeyFlag: 0 //0:关闭 1:开启
            }
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveButton, this))
            this.$el.find(".cache-key input").on("click", $.proxy(this.onClickToggle, this))

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.on("modify.cacheKey.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("modify.cacheKey.error", $.proxy(this.onGetError, this));

            this.initSetup(data)
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

        initSetup: function(data){
            if (data.domainConf)
                this.defaultParam.cacheKeyFlag = data.domainConf.cacheKeyFlag

            if (this.defaultParam.cacheKeyFlag === 0)
                this.$el.find(".cache-key .togglebutton input").get(0).checked = false;
            else
                this.$el.find(".cache-key .togglebutton input").get(0).checked = true;

            if (data.domainConf && data.domainConf.cacheKey)
                this.$el.find("#modify-cache-host").val(data.domainConf.cacheKey)
        },

        onClickToggle: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.cacheKeyFlag = 1;
            } else {
                this.defaultParam.cacheKeyFlag = 0;
            }
        },

        checkDomainName:function(){
            //检查域名
            var domainName = this.$el.find("#modify-cache-host").val().trim();
            if(domainName !== ""){
                var result = Utility.isDomain(domainName);
                if(!result){
                    alert("填写错误");
                    return false;
                }
            }
            return true;
        },

        onClickSaveButton: function(){
            var result = this.checkDomainName();
            if (!result) return
            var postParam = {
                originId:this.domainInfo.id,
                cacheKey: this.$el.find("#modify-cache-host").val().trim(),
                cacheKeyFlag: this.defaultParam.cacheKeyFlag
            };
            this.collection.setCacheKey(postParam);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query, query2, target){
            this.options.query = query;
            this.options.query2 = query2;
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

    return CacheKeySetupView;
});