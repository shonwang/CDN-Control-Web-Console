define("liveUpConnection.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveUpConnectionView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveUpConnection/liveUpConnection.html'])());
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

            this.defaultParam = {
                upCascade: 0 //0:关闭 1:开启
            }

            this.$el.find(".frequency-log-open .togglebutton input").on("click", $.proxy(this.onClickToggle, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.on("set.liveBaseConf.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.liveBaseConf.error", $.proxy(this.onGetError, this));
            this.collection.on("get.liveBaseConf.success", $.proxy(this.onGetDomainInfo, this));
            this.collection.on("get.liveBaseConf.error", $.proxy(this.onGetError, this));
            this.collection.getLiveBaseConf({originId:this.domainInfo.id});
        },

        onGetDomainInfo: function(data){
            //TODO 假数据
            // var data = {
            //     "appLives":[
            //         {
            //             "logConf":{
            //                 "id":null,
            //                 "liveId":null,
            //                 "slaAccessFlag":null,
            //                 "slaFirstCache":null,
            //                 "slaSecondCache":null,
            //                 "frequencyFlag":1,
            //                 "frequencyInterval":600,
            //             }
            //         }
            //     ]
            // };

            var upCascade = data.upCascade || 0;

            this.defaultParam.upCascade = upCascade; //0:关闭 1:开启    
            
            this.initSetup();
        },

        initSetup: function(){
            console.log(this.defaultParam.upCascade);
            if (this.defaultParam.upCascade === 0){
                this.$el.find(".frequency-log-open .togglebutton input").get(0).checked = false;
            } else {
                this.$el.find(".frequency-log-open .togglebutton input").get(0).checked = true;
            }
            
        },

        onSaveSuccess: function(){
            alert("保存成功！")
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: new SaveThenSendModel(),
                    domainInfo: this.domainInfo,
                    isRealLive: true,
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
            var postParam =  {
                    "originId": this.domainInfo.id,
                    "upCascade": this.defaultParam.upCascade
                }
            this.collection.setLiveBaseConf(postParam)
        },

        onClickToggle: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.upCascade = 1;
            } else {
                this.defaultParam.upCascade = 0;
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

    return LiveUpConnectionView;
});