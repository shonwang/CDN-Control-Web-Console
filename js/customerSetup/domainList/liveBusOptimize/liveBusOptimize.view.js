define("liveBusOptimize.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveBusOptimizeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveBusOptimize/liveBusOptimize.main.html'])());
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
                var myDomainSetupModel = new DomainSetupModel();
                    myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
                    myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                    myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
            }.bind(this))

            this.collection.on("set.setLiveConf.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.setLiveConf.error", $.proxy(this.onGetError, this));

            this.$el.find(".save").on('click',$.proxy(this.onClickSaveButton,this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
        },
        onGetDomainInfo: function(data){
            this.defaultParam = {
                gopType: 1,
                gopMaxDuration: 30,
                gopNum: 2,
                gopMinSendFlag: 0,
                gopMinSend: 1,
                noFlowTimeout: 20,
                delayClose: 5,
                metaType: 1
            }

            //TODO 假数据
            var data = {
                "appLives":[
                    {
                        "optimizeConf":{
                            "gopType": 2, //1:按时长 2:按个数
                            "gopNum": 3,
                            "gopMaxDuration": 15,
                            "gopMinSendFlag": 1,
                            "gopMinSend": 2,
                            "noFlowTimeout": 21,
                            "delayClose": 6,
                            "metaType": 2, //1:append 2:on 3:copy 4:off
                        }
                    }
                ]
            };

            data = data.appLives[0]

            if (data.optimizeConf && data.optimizeConf.gopType !== null && data.optimizeConf.gopType !== undefined)
                this.defaultParam.gopType = data.optimizeConf.gopType  
            if (data.optimizeConf && data.optimizeConf.gopNum !== null && data.optimizeConf.gopNum !== undefined)
                this.defaultParam.gopNum = data.optimizeConf.gopNum
            if (data.optimizeConf && data.optimizeConf.gopMaxDuration !== null && data.optimizeConf.gopMaxDuration !== undefined)
                this.defaultParam.gopMaxDuration = data.optimizeConf.gopMaxDuration
            if (data.optimizeConf && data.optimizeConf.gopMinSendFlag !== null && data.optimizeConf.gopMinSendFlag !== undefined)
                this.defaultParam.gopMinSendFlag = data.optimizeConf.gopMinSendFlag
            if (data.optimizeConf && data.optimizeConf.gopMinSend !== null && data.optimizeConf.gopMinSend !== undefined)
                this.defaultParam.gopMinSend = data.optimizeConf.gopMinSend
            if (data.optimizeConf && data.optimizeConf.noFlowTimeout !== null && data.optimizeConf.noFlowTimeout !== undefined)
                this.defaultParam.noFlowTimeout = data.optimizeConf.noFlowTimeout
            if (data.optimizeConf && data.optimizeConf.delayClose !== null && data.optimizeConf.delayClose !== undefined)
                this.defaultParam.delayClose = data.optimizeConf.delayClose
            if (data.optimizeConf && data.optimizeConf.metaType !== null && data.optimizeConf.metaType !== undefined)
                this.defaultParam.metaType = data.optimizeConf.metaType                        

            this.initSetup();
        },
        initSetup: function(){
            this.initGopSetup();
            this.initTimeoutSetup();
            this.initCloseClientSetup();
            this.initMetaSetup();
        },

        initMetaSetup: function(){
            this.metaEl = $(_.template(template['tpl/customerSetup/domainList/liveBusOptimize/liveBusOptimize.meta.html'])());
            this.metaEl.appendTo(this.$el.find(".optimize-content"));

            this.initMetaDropDown();
        },

        initMetaDropDown: function(){
            var  baseArray = [
                {name: "append", value: 1},
                {name: "on", value: 2},
                {name: "copy", value: 3},
                {name: "off", value: 4}
            ],
            rootNode = this.$el.find(".meta-type");
            Utility.initDropMenu(rootNode, baseArray, function(value){
                this.defaultParam.metaType = value
            }.bind(this));

            var defaultValue = _.find(baseArray, function(object){
                return object.value === this.defaultParam.metaType;
            }.bind(this));

            if (defaultValue) 
                this.$el.find(".meta-type .cur-value").html(defaultValue.name);
        },

        initCloseClientSetup: function(){
            this.closeClientEl = $(_.template(template['tpl/customerSetup/domainList/liveBusOptimize/liveBusOptimize.close.html'])());
            this.closeClientEl.appendTo(this.$el.find(".optimize-content"));

            this.closeClientEl.find("#closeclient").on('blur', $.proxy(this.onBlurCloseClient, this));

            this.closeClientEl.find("#closeclient").val(this.defaultParam.delayClose)
        },

        onBlurCloseClient: function(target){
            var value = parseInt(this.closeClientEl.find("#closeclient").val());
            if (!Utility.isNumber(value) || value < 1 || value > 10)
                alert("延时关闭填写内容为正整数，默认为5秒，最小值为1秒，最大值为10秒")
        },

        initTimeoutSetup: function(){
            this.timeoutEl = $(_.template(template['tpl/customerSetup/domainList/liveBusOptimize/liveBusOptimize.timeout.html'])());
            this.timeoutEl.appendTo(this.$el.find(".optimize-content"));

            this.timeoutEl.find("#timeout").on('blur', $.proxy(this.onBlurTimeout, this));

            this.timeoutEl.find("#timeout").val(this.defaultParam.noFlowTimeout)
        },

        onBlurTimeout: function(target){
            var value = parseInt(this.timeoutEl.find("#timeout").val());
            if (!Utility.isNumber(value) || value < 5 || value > 60)
                alert("无流断开的超时时间填写内容为正整数，默认为20秒，最小值为5秒，最大值为60秒")
        },

        initGopSetup: function(){
            this.gopEl = $(_.template(template['tpl/customerSetup/domainList/liveBusOptimize/liveBusOptimize.gop.html'])());
            this.gopEl.appendTo(this.$el.find(".optimize-content"));

            this.gopEl.find("#gopduration").on('blur', $.proxy(this.onBlurGopDuration, this));
            this.gopEl.find("#gopnum").on('blur', $.proxy(this.onBlurGopNum, this));
            this.gopEl.find("#gopmaxduration").on('blur', $.proxy(this.onBlurGopMaxDuration, this));
            this.gopEl.find("#gopminlength").on('blur', $.proxy(this.onBlurGopMinLength, this));
            this.$el.find(".gopminlength .togglebutton input").on("click", $.proxy(this.onClickGopMinLengthToggle, this));

            this.$el.find(".gopminlengthinput").hide();

            if (this.defaultParam.gopType === 1) {
                this.gopEl.find("#gopCacheType1").get(0).checked = true;
                this.gopEl.find("#gopduration").val(this.defaultParam.gopNum)
            } else {
                this.gopEl.find("#gopCacheType2").get(0).checked = true;
                this.gopEl.find("#gopnum").val(this.defaultParam.gopNum)
            }
            this.gopEl.find("#gopmaxduration").val(this.defaultParam.gopMaxDuration)

            if (this.defaultParam.gopMinSendFlag === 0){
                this.$el.find(".gopminlength .togglebutton input").get(0).checked = false;
                this.$el.find(".gopminlengthinput").hide();
            } else {
                this.$el.find(".gopminlength .togglebutton input").get(0).checked = true;
                this.$el.find(".gopminlengthinput").show();
            }
            this.gopEl.find("#gopminlength").val(this.defaultParam.gopMinSend)
        },

        onBlurGopDuration: function(target){
            var value = parseInt(this.gopEl.find("#gopduration").val());
            if (!Utility.isNumber(value) || value < 2 || value > 30)
                alert("gop缓存时长填写内容为正整数，默认为5秒，最小值为2秒，最大值为30秒")
        },

        onBlurGopNum: function(target){
            var value = parseInt(this.gopEl.find("#gopnum").val());
            if (!Utility.isNumber(value) || value < 1 || value > 15)
                alert("gop缓存个数填写内容为正整数，默认为2个，最小值为1个，最大值为15个")
        },

        onBlurGopMaxDuration: function(){
            var value = parseInt(this.gopEl.find("#gopmaxduration").val());
            var minVal = parseInt(this.gopEl.find("#gopduration").val());
            if (!Utility.isNumber(value) || value < minVal || value > 30)
                alert("最大gop缓存时长填写内容为正整数，默认为30秒，最小值不能小于gop缓存时长填写的时间，最大值为30秒")
        },

        onBlurGopMinLength: function(){
            var value = parseInt(this.gopEl.find("#gopminlength").val());
            if (!Utility.isNumber(value) || value < 1 || value > 30)
                alert("最大gop缓存时长填写内容为正整数，默认为30秒，最小值不能小于gop缓存时长填写的时间，最大值为30秒")
        },

        onClickGopMinLengthToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.gopMinSendFlag = 1;
                this.$el.find(".gopminlengthinput").show();
            } else {
                this.defaultParam.gopMinSendFlag = 0;
                this.$el.find(".gopminlengthinput").hide();
            }
        },

        onClickSaveButton: function(){
            var value = "";
            if (this.gopEl.find("#gopCacheType1").get(0).checked === true){
                this.defaultParam.gopType === 1
                value = parseInt(this.gopEl.find("#gopduration").val());
                if (!Utility.isNumber(value) || value < 2 || value > 30){
                    alert("gop缓存时长填写内容为正整数，默认为5秒，最小值为2秒，最大值为30秒")
                    return;
                }
            } else if (this.gopEl.find("#gopCacheType2").get(0).checked === true){
                this.defaultParam.gopType === 2
                value = parseInt(this.gopEl.find("#gopnum").val());
                if (!Utility.isNumber(value) || value < 1 || value > 15){
                    alert("gop缓存个数填写内容为正整数，默认为2个，最小值为1个，最大值为15个")
                    return;
                }
            }
            this.defaultParam.gopNum = value;

            var gopMaxDuration = parseInt(this.gopEl.find("#gopmaxduration").val());
            var minVal = parseInt(this.gopEl.find("#gopduration").val());
            if (!Utility.isNumber(gopMaxDuration) || gopMaxDuration < minVal || gopMaxDuration > 30){
                alert("最大gop缓存时长填写内容为正整数，默认为30秒，最小值不能小于gop缓存时长填写的时间，最大值为30秒")
                return;
            }
            this.defaultParam.gopMaxDuration = gopMaxDuration;

            if (this.defaultParam.gopMinSendFlag === 1) {
                var gopMinSend = parseInt(this.gopEl.find("#gopminlength").val());
                if (!Utility.isNumber(gopMinSend) || gopMinSend < 1 || gopMinSend > 30){
                    alert("最大gop缓存时长填写内容为正整数，默认为30秒，最小值不能小于gop缓存时长填写的时间，最大值为30秒")
                    return;
                }
                this.defaultParam.gopMinSend = gopMinSend;
            }

            var noFlowTimeout = parseInt(this.timeoutEl.find("#timeout").val());
            if (!Utility.isNumber(noFlowTimeout) || noFlowTimeout < 5 || noFlowTimeout > 60){
                alert("无流断开的超时时间填写内容为正整数，默认为20秒，最小值为5秒，最大值为60秒")
                return;
            }
            this.defaultParam.noFlowTimeout = noFlowTimeout

            var delayClose = parseInt(this.closeClientEl.find("#closeclient").val());
            if (!Utility.isNumber(delayClose) || delayClose < 1 || delayClose > 10) {
                alert("延时关闭填写内容为正整数，默认为5秒，最小值为1秒，最大值为10秒")
                return;
            }
            this.defaultParam.delayClose = delayClose

            var postParam =  {
                    "originId": this.domainInfo.id,
                    "gopType": this.defaultParam.gopType,
                    "gopNum": this.defaultParam.gopNum,
                    "gopMaxDuration":this.defaultParam.gopMaxDuration,
                    "gopMinSendFlag": this.defaultParam.gopMinSendFlag,
                    "gopMinSend": this.defaultParam.gopMinSend,
                    "noFlowTimeout": this.defaultParam.noFlowTimeout,
                    "delayClose": this.defaultParam.delayClose,
                    "metaType": this.defaultParam.metaType
                }
            console.log(postParam)
            //this.collection.setLiveConf(postParam)
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
                    description: this.$el.find("#Remarks").val(),
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
                        this.update(this.options.query, this.options.query2, this.target);
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
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
            this.target = target
        }
    });

    return LiveBusOptimizeView;
});