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
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: this.userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

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
                ipNum: 0
            }

            this.initOriginSetup();
            this.$el.find(".use-advance .togglebutton input").on("click", $.proxy(this.onClickIsUseAdvanceBtn, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.initModifyHost();
        },

        initOriginSetup: function(){
            if (this.defaultParam.isUseAdvance === 1){
                this.$el.find(".use-advance .togglebutton input").get(0).checked = false;
                this.$el.find(".advanced").hide();
                this.$el.find(".base").show();
                this.$el.find(".base #textarea-origin-type").html(this.defaultParam.originBaseDomain);
            } else if (this.defaultParam.isUseAdvance === 2) {
                this.$el.find(".use-advance .togglebutton input").get(0).checked = true;
                this.$el.find(".advanced").show();
                this.$el.find(".base").hide();
                this.$el.find(".default #primary").html(this.defaultParam.defaultPrimary);
                this.$el.find(".default #secondary").html(this.defaultParam.defaultBackup);
                this.$el.find(".unicom #primary").html(this.defaultParam.unicomPrimary);
                this.$el.find(".unicom #secondary").html(this.defaultParam.unicomBackup);
                this.$el.find(".telecom #primary").html(this.defaultParam.telecomPrimary);
                this.$el.find(".telecom #secondary").html(this.defaultParam.telecomBackup);
                this.$el.find(".mobile #primary").html(this.defaultParam.mobilePrimary);
                this.$el.find(".mobile #secondary").html(this.defaultParam.mobileBackup);
                if (this.defaultParam.originStrategy === 1){
                    this.$el.find(".poll .togglebutton input").get(0).checked = true;
                    this.$el.find(".quality .togglebutton input").get(0).checked = false;
                } else if (this.defaultParam.originStrategy === 2){
                    this.$el.find(".poll .togglebutton input").get(0).checked = false;
                    this.$el.find(".quality .togglebutton input").get(0).checked = true;
                    this.$el.find("#ip-num").html(this.defaultParam.ipNum);
                }
            }
            this.initOriginTypeDropdown();
            this.$el.find(".base #textarea-origin-type").on("blur", $.proxy(this.onBlurTextarea, this))
            this.$el.find(".advanced textarea").on("blur", $.proxy(this.onBlurAdvancedTextarea, this))
            this.$el.find(".strategy input[name='strategyRadios']").on("click", $.proxy(this.onClickStrategyRadio, this))
        },

        initOriginTypeDropdown: function(){
            var  baseArray = [
                {name: "域名回源", value: 1},
                {name: "IP回源", value: 2},
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
                {name: "域名回源", value: 1},
                {name: "IP回源", value: 2}
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
                this.$el.find(".customized-comment").show();
                this.$el.find(".base").hide();
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
                var ipNum = this.$el.find("#ip-num").val();
                if (this.defaultParam.originStrategy === 2 && parseInt(ipNum) > 10){
                    alert("IP数量上限为10个")
                    return;
                }
            }
            alert("very good!")
        },

        checkBaseOrigin: function(value, type){
            var originAddress = value || this.$el.find(".base #textarea-origin-type").val();
            var originType = type || this.defaultParam.originBaseType;
            var domainName = this.userInfo.domain;
            if(originType == 2){
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
            } else if(originType == 1){
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

        initModifyHost: function(){
            this.hideModifyHostOptions();
            this.isModifyHost = false;
            this.initModifyHostSetup();
            this.initModifyHostDropdown();

            this.$el.find(".modify-host .togglebutton input").on("click", $.proxy(this.onClickIsModifyHostBtn, this));
        },

        initModifyHostSetup: function(){
            if (this.isModifyHost){
                this.$el.find(".origin-domain").show();
            } else {
                this.$el.find(".origin-domain").hide();
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

            }.bind(this));

            var defaultValue = _.find(domainTypeArray, function(object){
                return object.value === 3;
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

        update: function(query){
            this.options.query = query;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(this.target);
        },

        render: function(target){
            this.$el.appendTo(target);
            this.target = target;
        }
    });

    return BackOriginSetupView;
});