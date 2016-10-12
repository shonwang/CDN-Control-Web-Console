define("httpHeaderCtr.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var HttpHeaderCtrView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/httpHeaderCtr/httpHeaderCtr.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.clientInfo = clientInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.defaultParam = {
                obtainIp: 0, //0:不获取客户端ip 1：获取客户端ip
                obtIpCustom: "",
                addCors: 0,
                removeCookie: 0,
                removeKs3: 1
            };  

            this.collection.on("set.headerCtr.success", $.proxy(this.launchSendPopup, this));
            this.collection.on("set.headerCtr.error", $.proxy(this.onGetError, this));
            
            this.$el.find(".get-client-ip .togglebutton input").on("click", $.proxy(this.onClickGetIpToggle, this));
            this.$el.find(".add-cors-header .togglebutton input").on("click", $.proxy(this.onClickAddCrosToggle, this));
            this.$el.find(".delete-cookie-header .togglebutton input").on("click", $.proxy(this.onClickDelCookieToggle, this));
            this.$el.find(".header-ctr-save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.initSetup();
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: this.collection, 
                });
                var options = {
                    title: "发布",
                    body : mySaveThenSendView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback:  function(){
                        this.sendPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){
                        if (this.sendPopup) $("#" + this.sendPopup.modalId).remove();
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
        },

        onClickSaveBtn: function(){
            var postParam = {
                "originId": this.domainInfo.id,
                "obtainIp": this.defaultParam.obtainIp,
                "obtIpCustom": this.$el.find("#custom-type").val(),
                "addCors" : this.defaultParam.addCors,
                "removeCookie": this.defaultParam.removeCookie,
                "removeKs3": this.defaultParam.removeKs3
            }

            this.collection.setHttpHeaderControl(postParam)
        },

        initSetup: function(){
            if (this.defaultParam.obtainIp === 0){
                this.$el.find(".get-client-ip .togglebutton input").get(0).checked = false;
                this.$el.find(".get-ip-type").hide();
            } else if (this.defaultParam.obtainIp === 1){
                this.$el.find(".get-client-ip .togglebutton input").get(0).checked = true;
                this.$el.find(".get-ip-type").show();
            }
            if (this.defaultParam.addCors === 0)
                this.$el.find(".add-cors-header .togglebutton input").get(0).checked = false;
            else if (this.defaultParam.addCors === 1)
                this.$el.find(".add-cors-header .togglebutton input").get(0).checked = true;

            if (this.defaultParam.removeCookie === 0)
                this.$el.find(".delete-cookie-header .togglebutton input").get(0).checked = false;
            else if (this.defaultParam.removeCookie === 1)
                this.$el.find(".delete-cookie-header .togglebutton input").get(0).checked = true;
            this.initDropDown();
        },

        initDropDown: function(){
            var  baseArray = [
                {name: "Cdn-Src-IP", value: "Cdn-Src-IP"},
                {name: "X-Forwarded-For", value: "X-Forwarded-For"},
                {name: "自定义", value: "custom"}
            ],
            rootNode = this.$el.find(".get-ip-type");
            Utility.initDropMenu(rootNode, baseArray, function(value){
                if (value !== "custom"){
                    this.defaultParam.obtIpCustom = parseInt(value);
                    this.$el.find("#custom-type").hide();
                } else {
                    this.$el.find("#custom-type").show();
                    this.defaultParam.obtIpCustom = this.$el.find("#custom-type").val();
                }
            }.bind(this));

            var defaultValue = _.find(baseArray, function(object){
                return object.value === this.defaultParam.obtIpCustom;
            }.bind(this));

            if (defaultValue){
                this.$el.find(".get-ip-type .cur-value").html(defaultValue.name);
            } else {
                this.$el.find(".get-ip-type .cur-value").html("自定义");
                this.$el.find("#custom-type").val(this.defaultParam.obtIpCustom);
            }
        },

        onClickGetIpToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.obtainIp = 1;
                this.$el.find(".get-ip-type").show();
            } else {
                this.defaultParam.obtainIp = 0;
                this.$el.find(".get-ip-type").hide();
            }
        },

        onClickDelCookieToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.removeCookie = 1;
            } else {
                this.defaultParam.removeCookie = 0;
            }
        },

        onClickAddCrosToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.addCors = 1;
            } else {
                this.defaultParam.addCors = 0;
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

        update: function(query, query2){
            this.options.query = query;
            this.options.query2 = query2;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(this.target);
        },

        render: function(target){
            this.$el.appendTo(target);
            this.target = target;
        }
    });

    return HttpHeaderCtrView;
});