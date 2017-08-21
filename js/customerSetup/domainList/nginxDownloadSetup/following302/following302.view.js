define("following302.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var Following302View = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/following302/following302.html'])());
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
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

            require(["domainSetup.model"], function(DomainSetupModel){
                var myDomainSetupModel = new DomainSetupModel();
                    myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
                    myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                    myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
            }.bind(this))
        },

        onGetDomainInfo: function(data){
            this.defaultParam = {following: 0}

            if (data.domainConf && data.domainConf.following !== null && data.domainConf.following !== undefined)
                this.defaultParam.following = data.domainConf.following //0:关闭 1:开启

            this.initSetup();

            this.$el.find(".following302 .togglebutton input").on("click", $.proxy(this.onClickToggle, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.collection.on("set.following.success", $.proxy(this.launchSendPopup, this));
            this.collection.on("set.following.error", $.proxy(this.onGetError, this));
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: new SaveThenSendModel(),
                    domainInfo: this.domainInfo,
                    onSendSuccess: function() {
                        this.sendPopup.$el.modal("hide");
                    }.bind(this)
                });
                var options = {
                    title: "发布",
                    body : mySaveThenSendView,
                    backdrop : 'static',
                    type     : 2,
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

        initSetup: function(){
            if (this.defaultParam.following === 0) {
                this.$el.find(".following302 .togglebutton input").get(0).checked = false;
                this.$el.find(".domain-ctn").hide();
            } else {
                this.$el.find(".following302 .togglebutton input").get(0).checked = true;
                this.$el.find(".domain-ctn").show();
            }
        },

        onClickSaveBtn: function(){
            var domainArray = this.$el.find("#domain").val().split("\n"), domain, result;
            if (this.defaultParam.following === 1) {
                for (var i = 0; i < domainArray.length; i++) {
                    domain = domainArray[i];
                    if (domain === "") {
                        alert("第" + (i+1) + "个域名为空！");
                        return;
                    }
                    result = Utility.isDomain(domain)
                    if (!result) {
                        alert("第" + (i+1) + "个域名输错了！");
                        return;
                    }
                }
            }

            var postParam =  {
                "originId": this.domainInfo.id,
                "following": this.defaultParam.following
            }
            this.collection.setFollowing(postParam)
        },

        onClickToggle: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.following = 1;
                this.$el.find(".domain-ctn").show();
            } else {
                this.defaultParam.following = 0;
                this.$el.find(".domain-ctn").hide();
            }
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

    return Following302View;
});