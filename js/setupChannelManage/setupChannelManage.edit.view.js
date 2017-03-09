define("setupChannelManage.edit.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var EditChannelView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.isEdit = options.isEdit;
            this.isFromSend = options.isFromSend;

            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.edit.html'])({data: {}}));

            this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".use-customized .togglebutton input").on("click", $.proxy(this.onClickIsUseCustomizedBtn, this));
            this.$el.find(".view-setup-list").on("click", $.proxy(this.onClickViewSetupBillBtn, this))

            if (this.isFromSend){
                this.$el.find("#text-comment").attr("readonly", true)
                this.collection.off("get.originDomain.success");
                this.collection.off("get.originDomain.error");
                this.collection.on("get.originDomain.success", $.proxy(this.onGetOriginId, this));
                this.collection.on("get.originDomain.error", $.proxy(this.onGetError, this));
                this.collection.getOriginDomain({domain: this.model.get("domain")});
            } else {
                this.requirySetupSendWaitCustomizeModel();
            }

            if (this.model.get("topologyId")) {
                require(['setupTopoManage.model'], function(SetupTopoManageModel){
                    var mySetupTopoManageModel = new SetupTopoManageModel();
                    mySetupTopoManageModel.on("get.topo.OriginInfo.success", $.proxy(this.onGetTopoInfo, this));
                    mySetupTopoManageModel.on("get.topo.OriginInfo.error", $.proxy(this.onGetError, this));
                    mySetupTopoManageModel.getTopoOrigininfo(this.model.get("topologyId"))
                }.bind(this));
            } else {
                this.$el.find("#input-topology").val("默认拓扑关系");
            }

            this.$el.find("#input-domain").val(this.model.get("domain"));
            this.$el.find("#input-type").val(this.model.get("businessTypeName") || this.model.get("platformName"));
            this.$el.find("#input-protocol").val(this.model.get("protocolName"));
            this.$el.find("#text-comment").val(this.model.get("description"));
        },

        onGetOriginId: function(res){
            this.originId = res.id;
            this.requirySetupSendWaitCustomizeModel();
        },

        requirySetupSendWaitCustomizeModel: function(){
            require(['setupSendWaitCustomize.model'], function(SetupSendWaitCustomizeModel){
                this.mySetupSendWaitCustomizeModel = new SetupSendWaitCustomizeModel();
                this.mySetupSendWaitCustomizeModel.off("get.channel.config.success");
                this.mySetupSendWaitCustomizeModel.off("get.channel.config.error");
                this.mySetupSendWaitCustomizeModel.on("get.channel.config.success", $.proxy(this.initSetup, this));
                this.mySetupSendWaitCustomizeModel.on("get.channel.config.error", $.proxy(this.onGetError, this));
                this.mySetupSendWaitCustomizeModel.getChannelConfig({
                    domain: this.model.get("domain"),
                    version: this.model.get("version") || this.model.get("domainVersion")
                })
            }.bind(this));
        },

        onGetTopoInfo: function(data){
            this.$el.find("#input-topology").val(data.name);
        },

        initSetup: function(data){
            this.applicationType = data.applicationType.type;
            this.$el.find("#input-application").val(data.applicationType.name);

            var isUseCustomized = this.model.get("tempUseCustomized");
            this.$el.find(".use-customized .togglebutton input").attr("disabled", "disabled");
            if (isUseCustomized === 2){
                this.$el.find(".use-customized .togglebutton input").get(0).checked = true;
                this.showCustomized();
            } else {
                this.$el.find(".use-customized .togglebutton input").get(0).checked = false;
                this.hideCustomized();
            }

            this.initConfigFile(data);
        },

        getConfigObj: function(data){
            var upArray = [], downArray = [];

            _.each(data, function(el, key, ls){
                if (key !== "applicationType"){
                    _.each(el, function(fileObj, index, list){
                        if (fileObj&&fileObj.topologyLevel === 1){
                            upArray.push({
                                id: fileObj.id,
                                name: key,
                                content: fileObj.content,
                                luaOnly: fileObj.luaOnly === undefined ? true : fileObj.luaOnly
                            })
                        } else if (fileObj&&fileObj.topologyLevel === 2){
                            downArray.push({
                                id: fileObj.id,
                                name: key,
                                content: fileObj.content,
                                luaOnly: fileObj.luaOnly === undefined ? true : fileObj.luaOnly
                            })
                        }
                    }.bind(this))
                }
            }.bind(this))

            return {up: upArray, down: downArray}
        },

        initConfigFile: function(data){
            this.autoConfigInfo = data;

            var autoConfigObj = this.getConfigObj(data);

            this.configReadOnly = $(_.template(template['tpl/setupChannelManage/setupChannelManage.editCfgFalse.html'])({
                data: autoConfigObj,
                panelId: Utility.randomStr(8)
            }));
            this.configReadOnly.appendTo(this.$el.find(".automatic"))

            var isUseCustomized = this.model.get("tempUseCustomized");
            if (isUseCustomized === 1) return;

            this.mySetupSendWaitCustomizeModel.off("get.all.config.success");
            this.mySetupSendWaitCustomizeModel.off("get.all.config.error");
            this.mySetupSendWaitCustomizeModel.on("get.all.config.success", $.proxy(this.initCustomizedSetupFile, this));
            this.mySetupSendWaitCustomizeModel.on("get.all.config.error", $.proxy(this.onGetError, this));
            this.mySetupSendWaitCustomizeModel.getAllConfig({
                domain: this.model.get("domain"),
                version: this.model.get("version") || this.model.get("domainVersion"),
                manuallyModifed: true,
                applicationType: data.applicationType.type
            })
        },

        initCustomizedSetupFile: function(data){
            this.cusConfigInfo = data;

            _.each(this.cusConfigInfo, function(fileObj, inx, list){
                _.each(fileObj, function(el, index, ls){
                    if (!el.id) el.id = Utility.randomStr(8);
                }.bind(this))
            }.bind(this))

            var cusConfigObj = this.getConfigObj(this.cusConfigInfo);

            var tplPath = 'tpl/setupChannelManage/setupChannelManage.editCfgTrue.html';
            if (!this.isEdit) tplPath = 'tpl/setupChannelManage/setupChannelManage.editCfgFalse.html'

            this.configEdit = $(_.template(template[tplPath])({
                data: cusConfigObj,
                panelId: Utility.randomStr(8),
                applicationType: this.applicationType
            }));
            this.configEdit.appendTo(this.$el.find(".customized"))
        },

        onClickIsUseCustomizedBtn: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.model.set("tempUseCustomized", 2);
                this.showCustomized();
            } else {
                this.model.set("tempUseCustomized", 1);
                this.hideCustomized();
            }
        },

        hideCustomized: function(){
            this.$el.find(".customized").hide();
            this.$el.find(".customized-comment").hide();
            this.$el.find(".automatic").addClass("col-md-offset-3");
        },

        showCustomized: function(){
            this.$el.find(".customized").show();
            this.$el.find(".customized-comment").show();
            this.$el.find(".automatic").removeClass("col-md-offset-3");
        },

        onClickViewSetupBillBtn: function(){
            require(['setupBillLive.view', 'setupBill.model'], function(SetupBillView, SetupBillModel){
                var mySetupBillModel = new SetupBillModel();
                var mySetupBillView = new SetupBillView({
                    collection: mySetupBillModel,
                    originId: this.originId || this.model.get("id"),
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){
                        mySetupBillView.$el.remove();
                        this.$el.find(".edit-panel").show();
                    }.bind(this)
                })

                this.$el.find(".edit-panel").hide();
                mySetupBillView.render(this.$el.find(".bill-panel"));
            }.bind(this))
        },

        onClickSaveButton: function(){
            // debugger
            if (this.isEdit) {
                var postParam = [], cusConfig = this.cusConfigInfo;

                _.each(cusConfig, function(fileObj, inx, list){
                    _.each(fileObj, function(el, index, ls){
                        postParam.push({
                            domain: this.model.get("domain"),
                            version: this.model.get("version") || this.model.get("domainVersion"),
                            "topologyLevel": el.topologyLevel,
                            "manuallyModifed": true,
                            "content": this.$el.find("#customized-file-" + el.id).val() || ""
                        })
                    }.bind(this))
                }.bind(this))

                this.mySetupSendWaitCustomizeModel.off("set.channel.config.success");
                this.mySetupSendWaitCustomizeModel.off("set.channel.config.error");
                this.mySetupSendWaitCustomizeModel.on("set.channel.config.success", $.proxy(this.onSaveComment, this));
                this.mySetupSendWaitCustomizeModel.on("set.channel.config.error", $.proxy(this.onGetError, this));
                if (this.applicationType !== 203) {
                    this.mySetupSendWaitCustomizeModel.setChannelNgConfig(postParam)
                } else {
                    try {
                        _.each(postParam, function(el){
                            JSON.parse(el.content)
                        }.bind(this))
                    } catch (e){
                        alert("JSON 格式错误！")
                        return;
                    }
                    this.mySetupSendWaitCustomizeModel.setChannelLuaConfig(postParam)
                }
            } else {
                this.onSaveComment();
            }
        },

        onSaveComment: function(){
            if (this.isFromSend) {
                this.onSaveConfigSuccess();
                return;

                // this.collection.off("modify.domainDescription.success");
                // this.collection.off("modify.domainDescription.error");
                // this.collection.on("modify.domainDescription.success", $.proxy(this.onSaveConfigSuccess, this));
                // this.collection.on("modify.domainDescription.error", $.proxy(this.onGetError, this));
                // this.collection.modifyDomainDescription({
                //     originId: this.originId,
                //     description: this.$el.find("#text-comment").val()
                // });
                // return;
            }
            require(['basicInformation.model'], function(BasicInformationModel){
                this.myBasicInformationModel = new BasicInformationModel();
                this.myBasicInformationModel.off("modify.DomainBasic.success");
                this.myBasicInformationModel.off("modify.DomainBasic.error");
                this.myBasicInformationModel.on("modify.DomainBasic.success", $.proxy(this.onSaveConfigSuccess, this));
                this.myBasicInformationModel.on("modify.DomainBasic.error", $.proxy(this.onGetError, this));
                this.myBasicInformationModel.modifyDomainBasic({
                    originId: this.model.get("id"),
                    description: this.$el.find("#text-comment").val()
                })
            }.bind(this));
        },

        onSaveConfigSuccess: function(){
            alert("操作成功！")
            this.onClickCancelButton();
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return EditChannelView;
});