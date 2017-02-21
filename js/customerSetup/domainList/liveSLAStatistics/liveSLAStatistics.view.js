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

            require(["domainSetup.model"], function(DomainSetupModel){
                var myDomainSetupModel = new DomainSetupModel();
                    myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
                    myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                    myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
            }.bind(this))

            this.$el.find(".buffer-size").hide();
            this.$el.find(".modify-open .togglebutton input").on("click", $.proxy(this.onClickToggle, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find("#first-buffer").on("blur", $.proxy(this.onBlurBufferSize, this));
            this.$el.find("#second-buffer").on("blur", $.proxy(this.onBlurBufferSize, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.on("set.chargingOpen.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.chargingOpen.error", $.proxy(this.onGetError, this));
        },

        onGetDomainInfo: function(data){
            this.defaultParam = {
                chargingOpen: 0 //0:关闭 1:开启
            }

            if (data.domainConf && data.domainConf.chargingOpen !== null && data.domainConf.chargingOpen !== undefined)
                this.defaultParam.chargingOpen = data.domainConf.chargingOpen //0:关闭 1:开启            

            this.initSetup();
        },

        initSetup: function(){
            if (this.defaultParam.chargingOpen === 0){
                this.$el.find(".modify-open .togglebutton input").get(0).checked = false;
                this.$el.find(".buffer-size").hide();
            } else {
                this.$el.find(".modify-open .togglebutton input").get(0).checked = true;
                this.$el.find(".buffer-size").show();
            }
        },

        onBlurBufferSize: function(event){
            var eventTarget = event.srcElement || event.target;
            var value = parseInt($(eventTarget).val());
            if (!Utility.isNumber(value) || value < 0 || value > 10)
                alert("最小可设置为0秒，最大可设置为10秒")
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
            var value = parseInt(this.$el.find("#first-buffer").val());
            if (!Utility.isNumber(value) || value < 0 || value > 10){
                alert("最小可设置为0秒，最大可设置为10秒")
                return
            }

            value = parseInt(this.$el.find("#second-buffer").val());
            if (!Utility.isNumber(value) || value < 0 || value > 10){
                alert("最小可设置为0秒，最大可设置为10秒")
                return
            }

            var postParam =  {
                "originId": this.domainInfo.id,
                "chargingOpen": this.defaultParam.chargingOpen,
                t: new Date().valueOf()
            }
            this.collection.setChargingOpen(postParam)
        },

        onClickToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.chargingOpen = 1;
                this.$el.find(".buffer-size").show();
            } else {
                this.defaultParam.chargingOpen = 0;
                this.$el.find(".buffer-size").hide();
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

    return LiveSLAStatisticsView;
});