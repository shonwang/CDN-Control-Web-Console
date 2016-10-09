define("cnameSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var CnameSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/cnameSetup/cnameSetup.html'])());
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

            this.$el.find(".save").on("click", $.proxy(this.onClickSaveButton, this))

            this.collection.on("modify.cname.success", $.proxy(this.launchSendPopup, this));
            this.collection.on("modify.cname.error", $.proxy(this.onGetError, this));
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

        checkDomainName:function(){
            //检查域名
            var domainName = this.$el.find("#cname-set").val();
            if(domainName == ""){
                alert("域名不能为空");
                return false;
            }
            var result = Utility.isDomain(domainName);
            if(!result){
                alert("域名填写错误");
                return false;
            }
            return true;
        },

        onClickSaveButton: function(){
            var result = this.checkDomainName();
            if (!result) return
            var postParam = {
                cnameId: this.domainInfo.id,
                cname: this.$el.find("#cname-set").val().trim(),
            };
            this.collection.modifyDomainCname(postParam);
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

        update: function(query){
            this.options.query = query;
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

    return CnameSetupView;
});