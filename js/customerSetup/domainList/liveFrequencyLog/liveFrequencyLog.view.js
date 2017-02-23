define("liveFrequencyLog.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveFrequencyLogView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveFrequencyLog/liveFrequencyLog.html'])());
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

            this.$el.find(".log-interval").hide();
            this.$el.find(".frequency-log-open .togglebutton input").on("click", $.proxy(this.onClickToggle, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.on("set.setLogConf.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.setLogConf.error", $.proxy(this.onGetError, this));
        },

        onGetDomainInfo: function(data){
            this.defaultParam = {
                frequencyFlag: 0, //0:关闭 1:开启
                frequencyInterval: 300
            }
            //TODO 假数据
            var data = {
                "appLives":[
                    {
                        "logConf":{
                            "id":null,
                            "liveId":null,
                            "slaAccessFlag":null,
                            "slaFirstCache":null,
                            "slaSecondCache":null,
                            "frequencyFlag":1,
                            "frequencyInterval":600,
                        }
                    }
                ]
            };

            data = data.appLives

            if (data.logConf && data.logConf.frequencyFlag !== null && data.logConf.frequencyFlag !== undefined)
                this.defaultParam.frequencyFlag = data.logConf.frequencyFlag //0:关闭 1:开启    
            if (data.logConf && data.logConf.frequencyInterval !== null && data.logConf.frequencyInterval !== undefined)
                this.defaultParam.frequencyInterval = data.logConf.frequencyInterval //0:关闭 1:开启          

            this.initSetup();
        },

        initSetup: function(){
            if (this.defaultParam.frequencyFlag === 0){
                this.$el.find(".frequency-log-open .togglebutton input").get(0).checked = false;
                this.$el.find(".log-interval").hide();
            } else {
                this.$el.find(".frequency-log-open .togglebutton input").get(0).checked = true;
                this.$el.find(".log-interval").show();
            }
            this.initTimeUnitDropDown();
        },

        initTimeUnitDropDown: function(){
            var  timeArray = [
                {"value": 1, "name": "秒"},
                {"value": 60, "name": "分"},
                {"value": 60 * 60, "name": "时"},
                {"value": 60 * 60 * 24, "name": "天"},
                {"value": 60 * 60 * 24 * 30, "name": "月"},
                {"value": 60 * 60 * 24 * 30 * 12, "name": "年"},
            ];

            var input = this.defaultParam.frequencyInterval,
                rootNode = this.$el.find(".time-unit");
                curEl = this.$el.find("#dropdown-time-unit .cur-value"),
                curInputEl = this.$el.find("#log-interval");

            Utility.initDropMenu(rootNode, timeArray, function(value){
                this.defaultParam.frequencyInterval = parseInt(curInputEl.val()) * parseInt(value);
            }.bind(this));

            curEl.html("秒");
            curInputEl.val(input);
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
                    width: 800,
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
                "frequencyFlag": this.defaultParam.frequencyFlag,
                t: new Date().valueOf()
            }
            this.collection.setLogConf(postParam)
        },

        onClickToggle: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.frequencyFlag = 1;
                this.$el.find(".log-interval").show();
            } else {
                this.defaultParam.frequencyFlag = 0;
                this.$el.find(".log-interval").hide();
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

    return LiveFrequencyLogView;
});