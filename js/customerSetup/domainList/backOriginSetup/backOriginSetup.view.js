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

            this.hostType = data.domainConf.hostType;
            this.busnessType = data.originDomain.type;
            this.protocol = data.domainConf.protocol;

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

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.on("set.backSourceConfig.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.backSourceConfig.error", $.proxy(this.onGetError, this));

            this.initModifyHost(data);
        },
        
        initOriginSetup: function(){
            if (this.defaultParam.isUseAdvance === 1){
                this.$el.find(".use-advance .togglebutton input").get(0).checked = false;
                this.$el.find(".advanced").hide();
                this.$el.find(".base").show();
            } else if (this.defaultParam.isUseAdvance === 2) {
                this.$el.find(".use-advance .togglebutton input").get(0).checked = true;
                this.$el.find(".advanced").show();
                this.$el.find(".base").hide();
            }
            this.$el.find(".base #textarea-origin-type").val(this.defaultParam.originBaseDomain);
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

            this.initOriginTypeDropdown();
            this.$el.find(".base #textarea-origin-type").on("blur", $.proxy(this.onBlurTextarea, this))
            this.$el.find(".advanced textarea").on("blur", $.proxy(this.onBlurAdvancedTextarea, this))
            this.$el.find(".strategy input[name='strategyRadios']").on("click", $.proxy(this.onClickStrategyRadio, this))
        },

        initOriginTypeDropdown: function(){
            var  baseArray = [
                {name: "域名回源", value: 2},
                {name: "IP回源", value: 1},
                // {name: "KS3回源", value: 3}
            ],
            rootNode = this.$el.find(".base .origin-type");

            if (this.busnessType === 2 && this.protocol === 2)
                baseArray.push({name: "视频云回源", value: 3})
            else
                baseArray.push({name: "KS3回源", value: 3})

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
                
                if (this.defaultParam.originAdvanceType === 2){
                    this.$el.find("textarea[id='secondary']").hide();
                    this.$el.find("textarea[id='secondary']").val("");
                } else {
                    this.$el.find("textarea[id='secondary']").show();
                }
            }.bind(this));

            var defaultOtherValue = _.find(advancedArray, function(object){
                return object.value === this.defaultParam.originAdvanceType;
            }.bind(this));

            if (this.defaultParam.originAdvanceType === 2)
                this.$el.find("textarea[id='secondary']").hide();
            else
                this.$el.find("textarea[id='secondary']").show();

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
                value = eventTarget.value.trim();
            if (value === "") return;
            this.checkBaseOrigin();
        },

        onBlurAdvancedTextarea: function(event){
            var eventTarget = event.srcElement || event.target,
                value = eventTarget.value.trim();
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
            if ((this.hostType === 2 && this.defaultParam.originBaseType === 1 && this.defaultParam.isUseAdvance === 1) || 
                (this.hostType === 2 && this.defaultParam.isUseAdvance === 2)){
                alert("修改回源Host设置为源站域名，不能使用IP回源");
                return;
            };
            if (this.defaultParam.isUseAdvance === 1 && !this.checkBaseOrigin()){
                return;
            } if (this.defaultParam.isUseAdvance === 2) {
                var textareaNodes = this.$el.find(".advanced textarea");
                for (var i = 0; i < textareaNodes.length; i++){
                    var value = textareaNodes[i].value.trim();
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
                if (this.defaultParam.originStrategy === 2 && (ipNum > 10 || ipNum < 1)){
                    alert("IP数量取值1-10")
                    return;
                }
            }

            var postParam = {
                "originId": this.domainInfo.id,
                "domain" : this.domainInfo.domain,
                "backsourceFlag": this.defaultParam.isUseAdvance === 1 ? 0 : 1, //配置高级回源策略的开启或关闭,0:关闭 1:开启
                "originType": this.defaultParam.isUseAdvance === 1 ? this.defaultParam.originBaseType : this.defaultParam.originAdvanceType,
                "originAddress": _.uniq(this.$el.find(".base #textarea-origin-type").val().split(',')).join(','),
                "backsourcePolicy": this.defaultParam.originStrategy,
                "backsourceBestcount": parseInt(this.$el.find("#ip-num").val()),
                "advanceConfigList":[{
                    "originLine": 1, //1:default默认源； 2:un联通源; 3:ct电信源; 4:cm移动源
                    "originAddress": _.uniq(this.$el.find(".default #primary").val().split(',')).join(','),
                    "addressBackup": _.uniq(this.$el.find(".default #secondary").val().split(',')).join(',')
                },{
                    "originLine": 2,
                    "originAddress": _.uniq(this.$el.find(".unicom #primary").val().split(',')).join(','),
                    "addressBackup": _.uniq(this.$el.find(".unicom #secondary").val().split(',')).join(',') 
                },{
                    "originLine": 3,
                    "originAddress": _.uniq(this.$el.find(".telecom #primary").val().split(',')).join(','),
                    "addressBackup": _.uniq(this.$el.find(".telecom #secondary").val().split(',')).join(',') 
                },{
                    "originLine": 4,
                    "originAddress": _.uniq(this.$el.find(".mobile #primary").val().split(',')).join(','),
                    "addressBackup": _.uniq(this.$el.find(".mobile #secondary").val().split(',')).join(',') 
                }]
            }
            this.collection.setBackSourceConfig(postParam)
        },

        onSaveSuccess: function(){
            alert("保存成功！")
            this.update(this.options.query, this.options.query2, this.target);
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

        checkBaseOrigin: function(value, type){
            var originAddress = value || this.$el.find(".base #textarea-origin-type").val().trim();
            var originType = type || this.defaultParam.originBaseType;
            var domainName = this.userInfo.domain;
            if(originType == 1){
                //验证IP
                if(!originAddress){
                    //不能为空
                    alert("IP不能为空");
                    return false;
                }

                var ipArray = originAddress.split(",");
                if(ipArray.length>10){
                    alert("你的IP数是否超过了10个。");
                    return false;
                }
                for (var i = 0; i < ipArray.length; i++){
                    result = Utility.isIP(ipArray[i].trim());
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
            
            this.defaultParamModifyHost = {
                domainType: 3,
                customHostHeader: "",
                domain: "",
                originAddress:""
            }

            if (data.domainConf && data.domainConf.hostType !== null && data.domainConf.hostType !== undefined)
                this.defaultParamModifyHost.domainType = data.domainConf.hostType;

            if (data.domainConf && data.domainConf.hostFlag !== null && data.domainConf.hostFlag !== undefined)
                this.isModifyHost = data.domainConf.hostFlag === 0 ? false : true;

            this.$el.find(".modify-host .togglebutton input").get(0).checked = this.isModifyHost;
            this.defaultParamModifyHost.customHostHeader = data.domainConf.customHostHeader;
            this.defaultParamModifyHost.domain = data.originDomain.domain;
            this.defaultParamModifyHost.originAddress = data.domainConf.originAddress;

            this.originType = data.domainConf.originType;
            this.isUseAdvanced = data.domainConf.backsourceFlag === 0 ? 1 : 2

            this.initModifyHostSetup();
            this.initModifyHostDropdown();

            this.$el.find(".modify-host .togglebutton input").on("click", $.proxy(this.onClickIsModifyHostBtn, this));
            this.$el.find(".host-save").on("click", $.proxy(this.onClickHostSaveBtn, this));

            this.collection.on("set.hostConfig.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.hostConfig.error", $.proxy(this.onGetError, this));
        },

        onClickHostSaveBtn: function(){
            if ((this.defaultParamModifyHost.domainType === 2 && this.originType === 1 && this.isUseAdvanced === 1) ||
                (this.defaultParamModifyHost.domainType === 2 && this.isUseAdvanced === 2)) {
                alert("未设置回源域名不能使用此项");
                return;
            }
            if (this.defaultParamModifyHost.domainType === 3) {
                var value = this.$el.find("#textarea-host-domain").val().trim();
                var result = this.checkBaseOrigin(value, 2)
                if (!result) return;
            }
            var postParam = {
                "originId": this.domainInfo.id,
                "customHostHeader": value,
                "hostType": this.defaultParamModifyHost.domainType,
                "hostFlag": this.isModifyHost ? 1 : 0
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
              //  {name: "源站域名", value: 2},
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
            this.target = target
        }
    });

    return BackOriginSetupView;
});