define("basicInformation.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var BasicInformationView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/basicInformation/basicInformation.html'])());
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
            
            this.collection.off("modify.DomainBasic.success");
            this.collection.off("modify.DomainBasic.error");
            this.collection.on("modify.DomainBasic.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("modify.DomainBasic.error", $.proxy(this.onGetError, this));

            require(["domainSetup.model"], function(DomainSetupModel){
                var myDomainSetupModel = new DomainSetupModel();
                    myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
                    myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                    myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
            }.bind(this))
        },
        onGetDomainInfo: function(data){
            this.defaultParam = {
                originId:this.domainInfo.id,
                confCustomType:1,
                description:""
            }

            if(data.domainConf.confCustomType !== null && data.domainConf.confCustomType !== undefined){
                this.defaultParam.confCustomType = data.domainConf.confCustomType;
                this.firstconfCustomType = this.defaultParam.confCustomType;
            }
            if(data.originDomain.description !== null && data.originDomain.description !== undefined){
                this.defaultParam.description = data.originDomain.description;
            }

            this.initSetup();
        },
        initSetup: function(){
            var confCustomType = this.$el.find(".Remarks-type");
            var Standard = this.$el.find(".Remarks-type #Standard");
            var Customization = this.$el.find(".Remarks-type #Customization");
            var description = this.$el.find('#Remarks');
            if(this.defaultParam.confCustomType == 1){
                Standard.get(0).checked = true;
                Customization.get(0).checked = false;
            }else if(this.defaultParam.confCustomType == 3){
                Standard.get(0).checked = false;
                Customization.get(0).checked = true;
            }
            
            description.val(this.defaultParam.description);

            this.$el.find(".Remarks-type").on('click',$.proxy(this.onClickRadio,this));
            this.$el.find(".save").on('click',$.proxy(this.onClickSaveButton,this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
        },
        onClickRadio: function(event){
            var target = event.target || event.srcElement;
            if(target.tagName != 'INPUT') return;
            
            var description = this.$el.find('#Remarks');
            var value = parseInt($(target).val());
            
            if(value == this.firstconfCustomType){
                description.val(this.defaultParam.description);
            }else{
                description.val('');
            }

            this.defaultParam.confCustomType = value;
        },
        onClickSaveButton: function(){
            this.defaultParam.description = this.$el.find("#Remarks").val();
            this.collection.modifyDomainBasic(this.defaultParam);
        },

        onSaveSuccess: function(){
            alert("保存成功！")
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: new SaveThenSendModel(),
                    domainInfo: this.domainInfo,
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
                    width: 800,
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

    return BasicInformationView;
});