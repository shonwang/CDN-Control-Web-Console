define("liveRefererAntiLeech.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var LiveRefererAntiLeechView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveRefererAntiLeech/liveRefererAntiLeech.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.clientInfo = clientInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.defaultParam = {
                isOpenSetup: 1,
                refererType: 1,
                domains: "",
                nullReferer: 0,
                forgeReferer: 0,
                regexps: ""
            };
            this.$el.find(".save").on("click", $.proxy(this.onSure, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
            this.$el.find(".open-referer .togglebutton input").on("click", $.proxy(this.onClickSetupToggle, this));
            this.$el.find("#white-domain").on("blur", $.proxy(this.onBlurDomainInput, this));
            this.$el.find("#black-domain").on("blur", $.proxy(this.onBlurDomainInput, this));
            this.$el.find(".null-referer .togglebutton input").on("click", $.proxy(this.onClickIsNullReferer, this));
            this.$el.find(".forge-referer .togglebutton input").on("click", $.proxy(this.onClickIsForgeReferer, this));

            this.collection.on("set.refer.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.refer.error", $.proxy(this.onGetError, this));
            this.collection.on("get.refer.success", $.proxy(this.initSetup, this));
            this.collection.on("get.refer.error", $.proxy(this.onGetError, this));
            this.collection.getReferSafetyChainList({originId:this.domainInfo.id});
        },

        initSetup: function(data){
            //TODO 假数据
            // var data = [
            //     {
            //         "type": 2,   //防盗链类型 1:白名单 2:黑名单
            //         "domains": "",   //域名,英文逗号分隔
            //         "nullReferer": 1,   //允许空referer 0:关 1:开
            //         "openFlag": 1,   //直播开启refer防盗链 0:关 1:开
            //         "regexps": "123",   //正则表达式，英文逗号分隔
            //         "forgeReferer": 1,   //是否允许伪造的refer 0:否 1:是
            //     }
            // ]
            data = data[0]

            if (data){
                if (data.openFlag !== null && data.openFlag !== undefined)
                    this.defaultParam.isOpenSetup = data.openFlag
                if (data.type !== null && data.type !== undefined && data.type !== 0)
                    this.defaultParam.refererType = data.type
                if (data.forgeReferer !== null && data.forgeReferer !== undefined)
                    this.defaultParam.forgeReferer = data.forgeReferer
                this.defaultParam.domains = data.domains || "";
                this.defaultParam.domains = this.defaultParam.domains.split(",").join("\n");
                if (data.nullReferer !== null && data.nullReferer !== undefined)
                    this.defaultParam.nullReferer = data.nullReferer
                this.defaultParam.regexps = data.regexps || "";
                this.defaultParam.regexps = this.defaultParam.regexps.split(",").join("\n");
            }

            if (this.defaultParam.isOpenSetup === 1) {
                this.$el.find(".open-referer .togglebutton input").get(0).checked = true;
                this.$el.find(".setup-content").show(200);
            } else if (this.defaultParam.isOpenSetup === 0) {
                this.$el.find(".open-referer .togglebutton input").get(0).checked = false;
                this.$el.find(".setup-content").hide(200);
            }

            if (this.defaultParam.refererType === 1) {
                this.$el.find(".black-list").hide();
                this.$el.find("#white-domain").val(this.defaultParam.domains)
                this.$el.find("#white-re").val(this.defaultParam.regexps)
            } else if (this.defaultParam.refererType === 2){
                this.$el.find(".white-list").hide();
                this.$el.find("#black-domain").val(this.defaultParam.domains)
                this.$el.find("#black-re").val(this.defaultParam.regexps)
            }

            if (this.defaultParam.nullReferer === 1){
                this.$el.find(".null-referer .togglebutton input").get(0).checked = true;
            } else if (this.defaultParam.nullReferer === 0){
                this.$el.find(".null-referer .togglebutton input").get(0).checked = false;
            }

            if (this.defaultParam.forgeReferer === 1){
                this.$el.find(".forge-referer .togglebutton input").get(0).checked = true;
            } else if (this.defaultParam.forgeReferer === 0){
                this.$el.find(".forge-referer .togglebutton input").get(0).checked = false;
            }

            this.initTypeDropdown();
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
            var list = [];
            this.collection.each(function(obj){
                list.push({
                    "matchingType": obj.get('matchingType'),
                    "matchingValue": obj.get('matchingValue'),
                    type: obj.get('type'),
                    domains: obj.get('domains'),
                    nullReferer: obj.get('nullReferer'),
                })
            }.bind(this))

            var postParam = {
                "originId": this.domainInfo.id,
                "list": list
            }

            this.collection.setReferSafetyChains(postParam)
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onClickSetupToggle : function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.$el.find(".setup-content").show(200);
                this.defaultParam.isOpenSetup = 1;
            } else {
                this.defaultParam.isOpenSetup = 0;
                this.$el.find(".setup-content").hide(200);
            }
        },

        initTypeDropdown: function(){
            var  timeArray = [
                {name: "白名单", value: 1},
                {name: "黑名单", value: 2}
            ],
            rootNode = this.$el.find(".referer-type");
            Utility.initDropMenu(rootNode, timeArray, function(value){
                if (parseInt(value) === 1){
                    this.$el.find(".black-list").hide();
                    this.$el.find(".white-list").show();
                } else if(parseInt(value) === 2){
                    this.$el.find(".black-list").show();
                    this.$el.find(".white-list").hide();
                }
                this.defaultParam.refererType = parseInt(value);
            }.bind(this));

            var defaultValue = _.find(timeArray, function(object){
                return object.value === this.defaultParam.refererType;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-referer-type .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-referer-type .cur-value").html(timeArray[0].name);
        },

        onClickIsNullReferer: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.nullReferer = 1;
            } else {
                this.defaultParam.nullReferer = 0;
            }
        },

        onClickIsForgeReferer: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.forgeReferer = 1;
            } else {
                this.defaultParam.forgeReferer = 0;
            }
        },

        onBlurDomainInput: function(event){
            var eventTarget = event.srcElement || event.target,
                value = eventTarget.value, domains = [], error;

            if (value === "") return false; 
            if (value.indexOf("\n") > -1){
                domains = value.split("\n");
                if (domains.length > 100){
                    alert("超过100条")
                    return;
                }
                for (var i = 0; i < domains.length; i++){
                    if (!Utility.isAntileechDomain(domains[i])){
                        if (domains[i] === '')
                            error = {message: "第" + i + "个域名后面换行了，请继续输入域名，否则请取消换行!"}
                        else
                            error = {message: "第" + (i + 1) + "个域名输错了！"};
                        alert(error.message)
                        return false;
                    }
                }
            } else if (!Utility.isAntileechDomain(value)){
                error = {message: "请输入正确的域名！"};
                alert(error.message)
                return false;
            } else {
                this.$el.find(".error-ctn").html("");
            }
            return true;
        },

        checkEverything: function(){
            var whiteDomain = this.$el.find("#white-domain").val(),
                balckDomain = this.$el.find("#black-domain").val();
            var blackRe = this.$el.find("#black-re").val();
            var whiteRe = this.$el.find("#white-re").val();

            if (this.defaultParam.refererType === 1 && (whiteDomain === "") && (whiteRe === "")){
                alert("请输入合法域名！")
                return false;
            } else if (this.defaultParam.refererType === 2 && (balckDomain === "") && (blackRe === "")){
                alert("请输入非法域名！")
                return false;
            }
            if (this.defaultParam.refererType === 1 && whiteDomain.indexOf("\n") > -1){
                var domains = whiteDomain.split("\n");
                if (domains.length > 100){
                    alert("超过100条")
                    return false;
                }
            }
            if (this.defaultParam.refererType === 2 && balckDomain.indexOf("\n") > -1){
                var domains = whiteDomain.split("\n");
                if (domains.length > 100){
                    alert("超过100条")
                    return false;
                }
            }
            var result = false;
            if (this.defaultParam.refererType === 1 && whiteDomain !== ""){
                result = this.onBlurDomainInput({target: this.$el.find("#white-domain").get(0)});
            } else if (this.defaultParam.refererType === 2 && balckDomain !== "") {
                result = this.onBlurDomainInput({target: this.$el.find("#black-domain").get(0)});
            } else {
                result = true;
            }
            return result;
        },

        onSure: function(){
            var result;
            if (this.defaultParam.isOpenSetup) {
                result = this.checkEverything();
                if (!result) return false;
            }

            var domains = '', regexps;
            if (this.defaultParam.refererType === 1) {
                domains = _.uniq(this.$el.find("#white-domain").val().split('\n')).join(',')
                regexps = this.$el.find("#white-re").val().split('\n').join(',')
            } else {
                domains = _.uniq(this.$el.find("#black-domain").val().split('\n')).join(',')
                regexps = this.$el.find("#black-re").val().split('\n').join(',')
            }

            var postParam = {
                type: this.defaultParam.refererType,
                domains: domains,
                nullReferer: this.defaultParam.nullReferer,
                "originId": this.domainInfo.id,
                "openFlag": this.defaultParam.isOpenSetup,
                "regexps": regexps,
                "forgeReferer": this.defaultParam.forgeReferer
            }
            postParam = {
                "originId": this.domainInfo.id,
                "list": [postParam]
            }

            this.collection.setReferSafetyChains(postParam)
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

    return LiveRefererAntiLeechView;
});