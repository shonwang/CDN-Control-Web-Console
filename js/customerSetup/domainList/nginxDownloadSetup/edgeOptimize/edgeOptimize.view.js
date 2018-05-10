define("edgeOptimize.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var EdgeOptimizeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/edgeOptimize/edgeOptimize.html'])());
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
            
            this.$el.find("#edge-set").on("focus",Utility.onContentChange);
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveButton, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
        },

        onGetDomainInfo: function(data){
            this.collection.on("set.edgeIpCount.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.edgeIpCount.error", $.proxy(this.onGetError, this));
            
            if (data.domainConf.edgeIpCount) 
                this.$el.find("#edge-set").val(data.domainConf.edgeIpCount);
        },

        onSaveSuccess: function(){
            Utility.alerts("保存成功！", "success", 5000)
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

        onClickSaveButton: function(){
            var value = this.$el.find("#edge-set").val().trim();
            if(value == ""){
                Utility.warning("不能为空");
                return false;
            }
            var postParam = {
                originId:this.domainInfo.id,
                edgeIpCount : value
            };
            this.collection.setEdgeIpCount(postParam);
            Utility.onContentSave();
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
            this.target = target;
            this.$el.appendTo(target);
        }
    });

    return EdgeOptimizeView;
});