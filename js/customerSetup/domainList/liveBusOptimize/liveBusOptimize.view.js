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
            
            // this.collection.off("modify.DomainBasic.success");
            // this.collection.off("modify.DomainBasic.error");
            // this.collection.on("modify.DomainBasic.success", $.proxy(this.onSaveSuccess, this));
            // this.collection.on("modify.DomainBasic.error", $.proxy(this.onGetError, this));

            require(["domainSetup.model"], function(DomainSetupModel){
                var myDomainSetupModel = new DomainSetupModel();
                    myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
                    myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                    myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
            }.bind(this))
        },
        onGetDomainInfo: function(data){
            this.defaultParamGop = {
                originId:this.domainInfo.id,
                confCustomType:1,
                description:""
            }

            this.initSetup();
        },
        initSetup: function(){
            this.initGopSetup();
            this.initTimeoutSetup();
            this.initCloseClientSetup();
            this.initMetaSetup();
            // var confCustomType = this.$el.find(".Remarks-type");
            // var Standard = this.$el.find(".Remarks-type #Standard");
            // var Customization = this.$el.find(".Remarks-type #Customization");
            // var description = this.$el.find('#Remarks');
            // if(this.defaultParam.confCustomType == 1){
            //     Standard.get(0).checked = true;
            //     Customization.get(0).checked = false;
            // }else if(this.defaultParam.confCustomType == 3){
            //     Standard.get(0).checked = false;
            //     Customization.get(0).checked = true;
            // }
            
            // description.val(this.defaultParam.description);

            // this.$el.find(".Remarks-type").on('click',$.proxy(this.onClickRadio,this));
            // this.$el.find(".save").on('click',$.proxy(this.onClickSaveButton,this));

            // this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
        },

        initMetaSetup: function(){
            this.metaEl = $(_.template(template['tpl/customerSetup/domainList/liveBusOptimize/liveBusOptimize.meta.html'])());
            this.metaEl.appendTo(this.$el.find(".optimize-content"));

            this.initMetaDropDown();
        },

        initMetaDropDown: function(){
            var  baseArray = [
                {name: "append", value: "append"},
                {name: "on", value: "on"},
                {name: "copy", value: "copy"},
                {name: "off", value: "off"}
            ],
            rootNode = this.$el.find(".meta-type");
            Utility.initDropMenu(rootNode, baseArray, function(value){
                // if (value !== "custom"){
                //     this.defaultParam.obtIpCustom = value;
                //     this.$el.find("#custom-type").hide();
                // } else {
                //     this.$el.find("#custom-type").show();
                //     this.defaultParam.obtIpCustom = this.$el.find("#custom-type").val();
                // }
            }.bind(this));

            // var defaultValue = _.find(baseArray, function(object){
            //     return object.value === this.defaultParam.obtIpCustom;
            // }.bind(this));

            // if (defaultValue){
            //     this.$el.find(".get-ip-type .cur-value").html(defaultValue.name);
            //     this.$el.find("#custom-type").hide();
            // } else {
            //     this.$el.find(".get-ip-type .cur-value").html("自定义");
            //     this.$el.find("#custom-type").val(this.defaultParam.obtIpCustom);
            // }
        },

        initCloseClientSetup: function(){
            this.closeClientEl = $(_.template(template['tpl/customerSetup/domainList/liveBusOptimize/liveBusOptimize.close.html'])());
            this.closeClientEl.appendTo(this.$el.find(".optimize-content"));

            this.closeClientEl.find("#closeclient").on('blur', $.proxy(this.onBlurCloseClient, this));
        },

        onBlurCloseClient: function(target){
            var value = parseInt(this.closeClientEl.find("#closeclient").val());
            if (!Utility.isNumber(value) || value < 5 || value > 60)
                alert("延时关闭填写内容为正整数，默认为5秒，最小值为1秒，最大值为10秒")
        },

        initTimeoutSetup: function(){
            this.timeoutEl = $(_.template(template['tpl/customerSetup/domainList/liveBusOptimize/liveBusOptimize.timeout.html'])());
            this.timeoutEl.appendTo(this.$el.find(".optimize-content"));

            this.timeoutEl.find("#timeout").on('blur', $.proxy(this.onBlurTimeout, this));
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
                // this.defaultParam.obtainIp = 1;
                this.$el.find(".gopminlengthinput").show();
            } else {
                // this.defaultParam.obtainIp = 0;
                this.$el.find(".gopminlengthinput").hide();
            }
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
        /*addDomainBasicSuccess: function(res){
            alert('保存成功');
            this.update(this.options.query, this.options.query2, this.target);
        },*/
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