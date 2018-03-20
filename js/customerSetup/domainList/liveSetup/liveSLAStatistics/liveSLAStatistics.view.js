define("liveSLAStatistics.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveSLAStatisticsView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveSLAStatistics/liveSLAStatistics.html'])());
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
                slaAccessFlag: 0, //0:关闭 1:开启
                slaFirstCache: 3,
                slaSecondCache: 1
            }

            this.$el.find(".buffer-size").hide();
            this.$el.find(".modify-open .togglebutton input").on("click", $.proxy(this.onClickToggle, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find("#first-buffer").on("blur", $.proxy(this.onBlurBufferSize, this));
            this.$el.find("#second-buffer").on("blur", $.proxy(this.onBlurBufferSize, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.on("set.logConfig.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.logConfig.error", $.proxy(this.onGetError, this));
            this.collection.on("get.logConfig.success", $.proxy(this.onGetDomainInfo, this));
            this.collection.on("get.logConfig.error", $.proxy(this.onGetError, this));
            this.collection.getLogConf({originId:this.domainInfo.id});
        },

        onGetDomainInfo: function(data){
            //TODO 假数据
            // var data = {
            //     "appLives":[
            //         {
            //             "logConf":{
            //                 "slaAccessFlag": 1,
            //                 "slaFirstCache": 20,
            //                 "slaSecondCache":15,
            //             }
            //         }
            //     ]
            // };

            data = data.appLives[0]

            if (data.logConf && data.logConf.slaAccessFlag !== null && data.logConf.slaAccessFlag !== undefined)
                this.defaultParam.slaAccessFlag = data.logConf.slaAccessFlag //0:关闭 1:开启
            if (data.logConf && data.logConf.slaFirstCache !== null && data.logConf.slaFirstCache !== undefined)
                this.defaultParam.slaFirstCache = data.logConf.slaFirstCache
            if (data.logConf && data.logConf.slaSecondCache !== null && data.logConf.slaSecondCache !== undefined)
                this.defaultParam.slaSecondCache = data.logConf.slaSecondCache                  

            this.initSetup();
        },

        initSetup: function(){
            if (this.defaultParam.slaAccessFlag === 0){
                this.$el.find(".modify-open .togglebutton input").get(0).checked = false;
                this.$el.find(".buffer-size").hide();
            } else {
                this.$el.find(".modify-open .togglebutton input").get(0).checked = true;
                this.$el.find(".buffer-size").show();
            }
            this.$el.find("#first-buffer").val(this.defaultParam.slaFirstCache)
            this.$el.find("#second-buffer").val(this.defaultParam.slaSecondCache)
        },

        onBlurBufferSize: function(event){
            var eventTarget = event.srcElement || event.target;
            var value = parseInt($(eventTarget).val());
            if (!Utility.isNumber(value) || value < 0 || value > 10)
                Utility.warning("最小可设置为0秒，最大可设置为10秒")
        },

        onSaveSuccess: function(){
            Utility.alerts("保存成功！", "success", 5000)
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
            var value1 = parseInt(this.$el.find("#first-buffer").val());
            if (!Utility.isNumber(value1) || value1 < 0 || value1 > 10){
                Utility.warning("最小可设置为0秒，最大可设置为10秒")
                return
            }

            var value2 = parseInt(this.$el.find("#second-buffer").val());
            if (!Utility.isNumber(value2) || value2 < 0 || value2 > 10){
                Utility.warning("最小可设置为0秒，最大可设置为10秒")
                return
            }

            var postParam =  {
                    "originId": this.domainInfo.id,
                    "slaAccessFlag": this.defaultParam.slaAccessFlag,
                    "slaFirstCache": value1,
                    "slaSecondCache": value2,
                }
            this.collection.setLogConf(postParam)
        },

        onClickToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.slaAccessFlag = 1;
                this.$el.find(".buffer-size").show();
            } else {
                this.defaultParam.slaAccessFlag = 0;
                this.$el.find(".buffer-size").hide();
            }
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
        }
    });

    return LiveSLAStatisticsView;
});