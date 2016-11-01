define("backOriginSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var BackOriginSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/backOriginSetup/backOriginSetup.html'])());
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
        },

        onGetDomainInfo: function(data){
            this.defaultParam = {
                isUseAdvance: 1,
                originBaseType: 1,
                originBaseDomain: "",

                originAdvanceType: 1,
                defaultPrimary: "",
                defaultBackup: "",
                unicomPrimary: "",
                unicomBackup: "",
                telecomPrimary: "",
                telecomBackup: "",
                mobilePrimary: "",
                mobileBackup: "",
                originStrategy: 1,
                ipNum: 1
            }

            if (data.domainConf && data.domainConf.backsourceFlag !== null && data.domainConf.backsourceFlag !== undefined)
                this.defaultParam.isUseAdvance = data.domainConf.backsourceFlag === 0 ? 1 : 2;

            if (data.domainConf && data.domainConf.originType !== null && data.domainConf.originType !== undefined)
                this.defaultParam.originBaseType = data.domainConf.originType;

            if (data.domainConf && data.domainConf.advanceOriginType !== null && data.domainConf.advanceOriginType !== undefined)
                this.defaultParam.originAdvanceType = data.domainConf.advanceOriginType;

            if (data.domainConf && data.domainConf.originAddress !== null && data.domainConf.originAddress !== undefined)
                this.defaultParam.originBaseDomain = data.domainConf.originAddress;

            if (data.domainConf && data.domainConf.backsourcePolicy !== null && data.domainConf.backsourcePolicy !== undefined)
                this.defaultParam.originStrategy = data.domainConf.backsourcePolicy;

            if (data.domainConf && data.domainConf.backsourceBestcount !== null && data.domainConf.backsourceBestcount !== undefined)
                this.defaultParam.ipNum = data.domainConf.backsourceBestcount;

            if (data.advanceConfigList){
                _.each(data.advanceConfigList, function(el, index, ls) {
                    if (el.originLine === 1){
                        this.defaultParam.defaultPrimary =  el.originAddress;
                        this.defaultParam.defaultBackup = el.addressBackup;
                    } else if (el.originLine === 2){
                        this.defaultParam.unicomPrimary =  el.originAddress;
                        this.defaultParam.unicomBackup = el.addressBackup;
                    } else if (el.originLine === 3){
                        this.defaultParam.telecomPrimary =  el.originAddress;
                        this.defaultParam.telecomBackup = el.addressBackup;
                    } else if (el.originLine === 4){
                        this.defaultParam.mobilePrimary =  el.originAddress;
                        this.defaultParam.mobileBackup = el.addressBackup;                        
                    }
                }.bind(this))
            }

            this.initOriginSetup();
            this.$el.find(".use-advance .togglebutton input").on("click", $.proxy(this.onClickIsUseAdvanceBtn, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.collection.on("set.backSourceConfig.success", $.proxy(this.launchSendPopup, this));
            this.collection.on("set.backSourceConfig.error", $.proxy(this.onGetError, this));

            this.initModifyHost(data);
        },
        
        initOriginSetup: function(){
            if (this.defaultParam.isUseAdvance === 1){
                this.$el.find(".use-advance .togglebutton input").get(0).checked = false;
                this.$el.find(".advanced").hide();
                this.$el.find(".base").show();
                this.$el.find(".base #textarea-origin-type").val(this.defaultParam.originBaseDomain);
            } else if (this.defaultParam.isUseAdvance === 2) {
                this.$el.find(".use-advance .togglebutton input").get(0).checked = true;
                this.$el.find(".advanced").show();
                this.$el.find(".base").hide();
                this.$el.find(".default #primary").val(this.defaultParam.defaultPrimary);
                this.$el.find(".default #secondary").val(this.defaultParam.defaultBackup);
                this.$el.find(".unicom #primary").val(this.defaultParam.unicomPrimary);
                this.$el.find(".unicom #secondary").val(this.defaultParam.unicomBackup);
                this.$el.find(".telecom #primary").val(this.defaultParam.telecomPrimary);
                this.$el.find(".telecom #secondary").val(this.defaultParam.telecomBackup);
                this.$el.find(".mobile #primary").val(this.defaultParam.mobilePrimary);
                this.$el.find(".mobile #secondary").val(this.defaultParam.mobileBackup);
                if (this.defaultParam.originStrategy === 1){
                    this.$el.find(".poll .radio input").get(0).checked = true;
                    this.$el.find(".quality .radio input").get(0).checked = false;
                } else if (this.defaultParam.originStrategy === 2){
                    this.$el.find(".poll .radio input").get(0).checked = false;
                    this.$el.find(".quality .radio input").get(0).checked = true;
                }
                this.$el.find("#ip-num").val(this.defaultParam.ipNum);
            }
            this.initOriginTypeDropdown();
            this.$el.find(".base #textarea-origin-type").on("blur", $.proxy(this.onBlurTextarea, this))
            this.$el.find(".advanced textarea").on("blur", $.proxy(this.onBlurAdvancedTextarea, this))
            this.$el.find(".strategy input[name='strategyRadios']").on("click", $.proxy(this.onClickStrategyRadio, this))
        },

        initOriginTypeDropdown: function(){
            var  baseArray = [
                {name: "域名回源", value: 2},
                {name: "IP回源", value: 1},
                {name: "KS3回源", value: 3}
            ],
            rootNode = this.$el.find(".base .origin-type");
            Utility.initDropMenu(rootNode, baseArray, function(value){
                this.defaultParam.originBaseType = parseInt(value)
            }.bind(this));

            var defaultValue = _.find(baseArray, function(object){
                return object.value === this.defaultParam.originBaseType;
            }.bind(this));

            if (defaultValue)
                this.$el.find(".base #dropdown-origin-type .cur-value").html(defaultValue.name);
            else
                this.$el.find(".base #dropdown-origin-type .cur-value").html(baseArray[0].name);

            var advancedArray = [
                {name: "域名回源", value: 2},
                {name: "IP回源", value: 1}
            ];

            var rootOtherNode = this.$el.find(".advanced .origin-type");
            Utility.initDropMenu(rootOtherNode, advancedArray, function(value){
                this.defaultParam.originAdvanceType = parseInt(value)
            }.bind(this));

            var defaultOtherValue = _.find(advancedArray, function(object){
                return object.value === this.defaultParam.originAdvanceType;
            }.bind(this));

            if (defaultOtherValue)
                this.$el.find(".advanced #dropdown-origin-type .cur-value").html(defaultOtherValue.name);
            else
                this.$el.find(".advanced #dropdown-origin-type .cur-value").html(advancedArray[0].name);
        },

        onClickStrategyRadio: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.originStrategy = parseInt($(eventTarget).val())
        },

        onBlurTextarea: function(event){
            var eventTarget = event.srcElement || event.target,
                value = eventTarget.value;
            if (value === "") return;
            this.checkBaseOrigin();
        },

        onBlurAdvancedTextarea: function(event){
            var eventTarget = event.srcElement || event.target,
                value = eventTarget.value;
            if (value === "") return;
            this.checkBaseOrigin(value, this.defaultParam.originAdvanceType);
        },

        onClickIsUseAdvanceBtn: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.isUseAdvance = 2;
                this.$el.find(".advanced").show();
                this.$el.find(".base").hide();
                this.$el.find("#ip-num").val(this.defaultParam.ipNum);
            } else {
                this.defaultParam.isUseAdvance = 1;
                this.$el.find(".advanced").hide();
                this.$el.find(".base").show();
            }
        },

        onClickSaveBtn: function(){
            if (this.defaultParam.isUseAdvance === 1 && !this.checkBaseOrigin()){
                return;
            } if (this.defaultParam.isUseAdvance === 2) {
                var textareaNodes = this.$el.find(".advanced textarea");
                for (var i = 0; i < textareaNodes.length; i++){
                    var value = textareaNodes[i].value;
                    if (value === "") continue;
                    var result = this.checkBaseOrigin(value, this.defaultParam.originAdvanceType)
                    if (!result) return;
                }
                var defaultPrimary = this.$el.find(".default #primary").val();
                if (defaultPrimary === ""){
                    alert("默认源主必填！")
                    return;
                }
                var ipNum = parseInt(this.$el.find("#ip-num").val());
                if (this.defaultParam.originStrategy === 2 && parseInt(ipNum) > 10 && parseInt(ipNum) < 1){
                    alert("IP数量取值1-10")
                    return;
                }
            }

            var postParam = {
                "originId": this.domainInfo.id,
                "domain" : this.domainInfo.domain,
                "backsourceFlag": this.defaultParam.isUseAdvance === 1 ? 0 : 1, //配置高级回源策略的开启或关闭,0:关闭 1:开启
                "originType": this.defaultParam.isUseAdvance === 1 ? this.defaultParam.originBaseType : this.defaultParam.originAdvanceType,
                "originAddress": this.$el.find(".base #textarea-origin-type").val(),
                "backsourcePolicy": this.defaultParam.originStrategy,
                "backsourceBestcount": parseInt(this.$el.find("#ip-num").val()),
                "advanceConfigList":[{
                    "originLine": 1, //1:default默认源； 2:un联通源; 3:ct电信源; 4:cm移动源
                    "originAddress": this.$el.find(".default #primary").val(),
                    "addressBackup": this.$el.find(".default #secondary").val()
                },{
                    "originLine": 2,
                    "originAddress": this.$el.find(".unicom #primary").val(),
                    "addressBackup": this.$el.find(".unicom #secondary").val() 
                },{
                    "originLine": 3,
                    "originAddress": this.$el.find(".telecom #primary").val(),
                    "addressBackup": this.$el.find(".telecom #secondary").val() 
                },{
                    "originLine": 4,
                    "originAddress": this.$el.find(".mobile #primary").val(),
                    "addressBackup": this.$el.find(".mobile #secondary").val() 
                }]
            }
            this.collection.setBackSourceConfig(postParam)
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: new SaveThenSendModel(),
                    originId: this.domainInfo.id,
                    onSendSuccess: function() {
                        this.sendPopup.$el.modal("hide");
                    }.bind(this)
                });
                var options = {
                    title: "发布",
                    body : mySaveThenSendView,
                    backdrop : 'static',
                    type     : 2,
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

        checkBaseOrigin: function(value, type){
            var originAddress = value || this.$el.find(".base #textarea-origin-type").val();
            var originType = type || this.defaultParam.originBaseType;
            var domainName = this.userInfo.domain;
            if(originType == 1){
                //验证IP
                if(!originAddress){
                    //不能为空
                    alert("IP不能为空");
                    return false;
                }

                var ipArray = originAddress.split(";");
                if(ipArray.length>10){
                    alert("你的IP数是否超过了10个。");
                    return false;
                }
                for (var i = 0; i < ipArray.length; i++){
                    result = Utility.isIP(ipArray[i]);
                    if (!result){
                        alert("你的IP填写有误,请检查");
                        return false;
                    }
                }
            } else if(originType == 2){
                //验证域名
                if(!originAddress){
                    //不能为空
                    alert("域名不能为空");
                    return false;
                }
                if(domainName == originAddress){
                    //域名不能与填写的域名相同
                    alert("源站地址不能与加速域名相同");
                    return false;
                }
                //域名校验
                var result = Utility.isDomain(originAddress);
                var isIPStr = Utility.isIP(originAddress);
                if (result && !isIPStr && originAddress !== domainName && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-"){
                    return true;
                } else {
                    alert("域名填写错误");
                    return false;
                }
            } else if(originType == 3){
                //验证KS3域名，此情况只能填一个
                //验证IP
                if(!originAddress){
                    //不能为空
                    alert("域名不能为空");
                    return false;
                }
                if(domainName == originAddress){
                    //域名不能与填写的域名相同
                    alert("源站地址不能与加速域名相同");
                    return false;
                }
                //域名校验
                var result = Utility.isDomain(originAddress);
                var isIPStr = Utility.isIP(originAddress);
                if (result && !isIPStr && originAddress !== domainName && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-"){
                    return true;
                }
                else{
                    alert("域名填写错误");
                    return false;
                }          
            }
            return true;
        },

        //修改回源Host==================================================

        initModifyHost: function(data){
            this.hideModifyHostOptions();
            this.isModifyHost = true;
            this.$el.find(".modify-host .togglebutton input").get(0).checked = true
            this.defaultParamModifyHost = {
                domainType: 3,
                customHostHeader: "",
                domain: "",
                originAddress:""
            }

            if (data.domainConf && data.domainConf.hostType !== null && data.domainConf.hostType !== undefined)
                this.defaultParamModifyHost.domainType = data.domainConf.hostType;

            this.defaultParamModifyHost.customHostHeader = data.domainConf.customHostHeader;
            this.defaultParamModifyHost.domain = data.originDomain.domain;
            this.defaultParamModifyHost.originAddress = data.domainConf.originAddress;

            this.originType = data.domainConf.originType;

            this.initModifyHostSetup();
            this.initModifyHostDropdown();

            this.$el.find(".modify-host .togglebutton input").on("click", $.proxy(this.onClickIsModifyHostBtn, this));
            this.$el.find(".host-save").on("click", $.proxy(this.onClickHostSaveBtn, this));

            this.collection.on("set.hostConfig.success", $.proxy(this.launchSendPopup, this));
            this.collection.on("set.hostConfig.error", $.proxy(this.onGetError, this));
        },

        onClickHostSaveBtn: function(){
            if (this.defaultParamModifyHost.domainType === 2 && this.originType === 1) {
                alert("未设置回源域名不能使用此项");
                return;
            };
            var value = this.$el.find("#textarea-host-domain").val();
            var result = this.checkBaseOrigin(value, 2)
            if (!result) return;
            var postParam = {
                "originId": this.domainInfo.id,
                "customHostHeader": value
            };
            this.collection.setHostHeaderConfig(postParam)
        },

        initModifyHostSetup: function(){
            if (this.isModifyHost){
                this.$el.find(".origin-domain").show();
            } else {
                this.$el.find(".origin-domain").hide();
            }
            var textareaNode = this.$el.find("#textarea-host-domain");
            if (this.defaultParamModifyHost.domainType !== 3)
                textareaNode.attr("readonly", "true")
            else
                textareaNode.removeAttr("readonly")

            if (this.defaultParamModifyHost.domainType === 3) {
                textareaNode.val(this.defaultParamModifyHost.customHostHeader);
            } else if (this.defaultParamModifyHost.domainType === 1){
                textareaNode.val(this.defaultParamModifyHost.domain);
            } else if (this.defaultParamModifyHost.domainType === 2){
                textareaNode.val(this.defaultParamModifyHost.originAddress);
            }
        },

        hideModifyHostOptions: function(){
            this.$el.find(".origin-domain").hide();
        },

        initModifyHostDropdown: function(){
            var  domainTypeArray = [
                {name: "加速域名", value: 1},
                {name: "源站域名", value: 2},
                {name: "自定义域名", value: 3}
            ],
            rootNode = this.$el.find(".origin-domain");
            Utility.initDropMenu(rootNode, domainTypeArray, function(value){
                this.defaultParamModifyHost.domainType = parseInt(value);
                this.initModifyHostSetup();
            }.bind(this));

            var defaultValue = _.find(domainTypeArray, function(object){
                return object.value === this.defaultParamModifyHost.domainType;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-origin-domain .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-origin-domain .cur-value").html(domainTypeArray[0].name);
        },

        onClickIsModifyHostBtn: function(event){
            this.hideModifyHostOptions();
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.isModifyHost = true;
            } else {
                this.isModifyHost = false;
            }
            this.initModifyHostSetup();
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

    return BackOriginSetupView;
});