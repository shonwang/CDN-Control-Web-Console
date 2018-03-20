define("liveUpFlowNameChange.view", ['require', 'exports', 'template', 'modal.view', 'utility', 'liveBasicInformation.view'],
    function(require, exports, template, Modal, Utility, LiveBasicInformationView) {

        var LiveUpFlowNameChangeView = LiveBasicInformationView.extend({
            events: {},

            initialize: function(options) {
                this.collection = options.collection;
                this.options = options;

                this.defaultParam = {
                    "aliasFlag": 0,
                    "aliasName": "null"
                }

                this.$el = $(_.template(template['tpl/customerSetup/domainList/liveUpFlowNameChange/liveUpFlowNameChange.html'])());
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

                this.collection.on("get.pushConfig.success", $.proxy(this.onGetDomainInfo, this));
                this.collection.on("get.pushConfig.error", $.proxy(this.onGetError, this));
                this.collection.getPushLiveConfig({
                    originId: this.domainInfo.id
                });
            },

            onGetDomainInfo: function(data) {
                if (data.aliasFlag !== null && data.aliasFlag !== undefined)
                    this.defaultParam.aliasFlag = data.aliasFlag //0:关闭 1:开启   
                this.defaultParam.aliasName = data.aliasName         

                this.initSetup();

                this.$el.find(".togglebutton input").on("click", $.proxy(this.onClickToggle, this));
                this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

                this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

                this.collection.on("set.pushConfig.success", $.proxy(this.onSaveSuccess, this));
                this.collection.on("set.pushConfig.error", $.proxy(this.onGetError, this));
            },

            initSetup: function() {
                this.$el.find("#alias-name").val(this.defaultParam.aliasName)
                if (this.defaultParam.aliasFlag === 0) {
                    this.$el.find(".togglebutton input").get(0).checked = false;
                    this.$el.find("#alias-name").hide();
                } else {
                    this.$el.find(".togglebutton input").get(0).checked = true;
                    this.$el.find("#alias-name").show();
                }
            },

            onSaveSuccess: function() {
                Utility.alerts("保存成功！", "success", 5000)
            },

            launchSendPopup: function() {
                require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel) {
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
                        body: mySaveThenSendView,
                        backdrop: 'static',
                        type: 2,
                        width: 1000,
                        onOKCallback: function() {
                            mySaveThenSendView.sendConfig();
                        }.bind(this),
                        onHiddenCallback: function() {
                            if (this.sendPopup) $("#" + this.sendPopup.modalId).remove();
                            this.update(this.options.query, this.options.query2, this.target);
                        }.bind(this)
                    }
                    this.sendPopup = new Modal(options);
                }.bind(this))
            },

            onClickSaveBtn: function() {
                if (this.$el.find("#alias-name").val() === "" && this.defaultParam.aliasFlag === 1) {
                    Utility.warning("既然开启了流名变换，就请输入流名变换参数！")
                    return;
                }

                var postParam = {
                    "originId": this.domainInfo.id,
                    "aliasFlag": this.defaultParam.aliasFlag,
                    "aliasName": this.$el.find("#alias-name").val()
                }
                this.collection.setPushLiveConfig(postParam)
            },

            onClickToggle: function() {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                if (eventTarget.checked) {
                    this.defaultParam.aliasFlag = 1;
                    this.$el.find("#alias-name").show();
                } else {
                    this.defaultParam.aliasFlag = 0;
                    this.$el.find("#alias-name").hide();
                }
            },

            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            },

            hide: function() {
                this.$el.hide();
            },

            update: function(query, query2, target) {
                this.options.query = query;
                this.options.query2 = query2;
                this.collection.off();
                this.collection.reset();
                this.$el.remove();
                this.initialize(this.options);
                this.render(target);
            },

            render: function(target) {
                this.$el.appendTo(target);
                this.target = target;
            }
        });

        return LiveUpFlowNameChangeView;
    });