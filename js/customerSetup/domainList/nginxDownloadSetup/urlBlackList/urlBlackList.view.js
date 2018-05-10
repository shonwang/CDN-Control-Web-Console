define("urlBlackList.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var UrlBlackListView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/urlBlackList/urlBlackList.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2);
                this.userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: this.userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

            require(["domainSetup.model"], function(DomainSetupModel){
                    this.myDomainSetupModel = new DomainSetupModel();
                    this.myDomainSetupModel.on("modify.domain.success", $.proxy(this.launchSendPopup, this));
                    this.myDomainSetupModel.on("modify.domain.error", $.proxy(this.onGetError, this));
                    this.myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
                    this.myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                    this.myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
            }.bind(this))
        },

        onGetDomainInfo: function(data){
            this.defaultParam = {
                originId:this.domainInfo.id,
                urlContent: "",
            }

            if(data.originDomain.urlContent !== null && data.originDomain.urlContent !== undefined)
                this.defaultParam.urlContent = data.originDomain.urlContent;

            this.initSetup();
        },

        initSetup: function(){
            var description = this.$el.find('#url-black');

            description.val(this.defaultParam.urlContent);

            this.$el.find(".save").on('click',$.proxy(this.onClickSaveButton,this));
            this.$el.find("#url-black").on("blur", $.proxy(this.onBlurURLInput, this));
        },

        onBlurURLInput: function(event){
            var eventTarget = event.srcElement || event.target,
                value = eventTarget.value, urls = [], error;

            if (value === "") return false; 
            if (value.indexOf("\n") > -1){
                urls = value.split("\n");
                for (var i = 0; i < urls.length; i++){
                    if (!this.isStartWithHTTP(urls[i])){
                        error = {message: "第" + (i + 1) + "个URL需要输入http://！"};
                        Utility.alerts(error.message)
                        return false;
                    }
                }
            } else if (!this.isStartWithHTTP(value)){
                error = {message: "需要输入http://！"};
                Utility.alerts(error.message)
                return false;
            } 
            return true;
        },

        isStartWithHTTP: function(url){
            if (url.substr(0, 7) !== "http://") return false;
            return true
        },

        onClickSaveButton: function(){
            var valueNode = this.$el.find("#url-black");
            var result  = this.onBlurURLInput({target: valueNode.get(0)})
            if (!result) return
            this.defaultParam.urlContent = valueNode.val();
            this.myDomainSetupModel.modifyDomainBasic(this.defaultParam);
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
                        this.update(this.options.query, this.options.query2, this.target);
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
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
            this.target = target
            this.$el.find("#url-black").focus();
        }
    });

    return UrlBlackListView;
});