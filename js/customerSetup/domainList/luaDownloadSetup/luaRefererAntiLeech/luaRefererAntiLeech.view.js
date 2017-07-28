define("luaRefererAntiLeech.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var RefererAntiLeechView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/mainCtn.html'])({
                data: {
                    mainTitle: "访问控制",
                    subTitle: "Referer防盗链"
                }
            }));
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
            this.luaRefererAntiLeechEl = $(_.template(template['tpl/customerSetup/domainList/refererAntiLeech/refererAntiLeech.add.html'])());
            this.luaRefererAntiLeechEl.appendTo(this.$el.find(".main-ctn"));

            // this.collection.on("get.refer.success", $.proxy(this.onChannelListSuccess, this));
            // this.collection.on("get.refer.error", $.proxy(this.onGetError, this));
            // this.collection.on("set.refer.success", $.proxy(this.onSaveSuccess, this));
            // this.collection.on("set.refer.error", $.proxy(this.onGetError, this));
            // this.onClickQueryButton();

            // this.$el.find(".add").on("click", $.proxy(this.onClickAddRule, this));
            // this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.defaultParam = {
                refererType: 1,
                domains: "",
                nullReferer: 0,
                type: 9,
                policy: ""
            };

            // if (this.isEdit){
            //     this.defaultParam.type = this.model.get("matchingType");
            //     this.defaultParam.policy = this.model.get("matchingValue") || "";
            //     this.defaultParam.refererType = this.model.get("type");
            //     this.defaultParam.domains = this.model.get("domains") || "";
            //     this.defaultParam.nullReferer = this.model.get("nullReferer");
            // }
            if (this.defaultParam.refererType === 1) {
                this.$el.find(".black-list").hide();
                this.$el.find("#white-domain").val(this.defaultParam.domains)
            } else if (this.defaultParam.refererType === 2){
                this.$el.find(".white-list").hide();
                this.$el.find("#black-domain").val(this.defaultParam.domains)
            }

            if (this.defaultParam.nullReferer === 1){
                this.$el.find(".null-referer .togglebutton input").get(0).checked = true;
            } else if (this.defaultParam.nullReferer === 0){
                this.$el.find(".null-referer .togglebutton input").get(0).checked = false;
            }

            this.initTypeDropdown();

            // this.$el.find("#white-domain").on("blur", $.proxy(this.onBlurDomainInput, this));
            // this.$el.find("#white-url").on("blur", $.proxy(this.onBlurUrlInput, this));
            // this.$el.find("#black-domain").on("blur", $.proxy(this.onBlurDomainInput, this));
            // this.$el.find("#black-url").on("blur", $.proxy(this.onBlurUrlInput, this));
            this.$el.find(".null-referer .togglebutton input").on("click", $.proxy(this.onClickIsNullReferer, this));
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

        onBlurDomainInput: function(event){
            var eventTarget = event.srcElement || event.target,
                value = eventTarget.value, domains = [], error;

            if (value === "") return false; 
            if (value.indexOf(",") > -1){
                domains = value.split(",");
                if (domains.length > 100){
                    alert("超过100条")
                    return;
                }
                for (var i = 0; i < domains.length; i++){
                    if (!Utility.isAntileechDomain(domains[i])){
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

        onBlurUrlInput: function(event){
            var eventTarget = event.srcElement || event.target,
                value = eventTarget.value, domains = [], error;

            if (value === "") return false;    
            if (value.indexOf(",") > -1){
                domains = value.split(",");
                for (var i = 0; i < domains.length; i++){
                    if (!Utility.isURL(domains[i])){
                        error = {message: "第" + (i + 1) + "个URL输错了！"};
                        alert(error.message)
                        return false;
                    }
                }
            } else if (!Utility.isURL(value)){
                error = {message: "请输入正确的URL！"};
                alert(error.message)
                return false;
            } else {
                this.$el.find(".error-ctn").html("");
            }
            return true;
        },

        checkEverything: function(){
            var whiteDomain = this.$el.find("#white-domain").val(),
                whiteUrl    = "暂时隐藏"//this.$el.find("#white-url").val(),
                balckDomain = this.$el.find("#black-domain").val(),
                blackUrl    = "暂时隐藏"//this.$el.find("#black-url").val();

            if (this.defaultParam.refererType === 1 && (whiteDomain === "" || whiteUrl === "")){
                alert("请输入合法域名、URL！")
                return false;
            }
            else if (this.defaultParam.refererType === 2 && (balckDomain === "" || blackUrl === "")){
                alert("请输入非法域名、URL！")
                return false;
            }
            if (this.defaultParam.refererType === 1 && whiteDomain.indexOf(",") > -1){
                var domains = whiteDomain.split(",");
                if (domains.length > 100){
                    alert("超过100条")
                    return false;
                }
            }
            if (this.defaultParam.refererType === 2 && balckDomain.indexOf(",") > -1){
                var domains = whiteDomain.split(",");
                if (domains.length > 100){
                    alert("超过100条")
                    return false;
                }
            }
            var result = true;
            // if (this.defaultParam.refererType === 1){
            //     result = this.onBlurDomainInput({target: this.$el.find("#white-domain").get(0)});
            //     //result = this.onBlurUrlInput({target: this.$el.find("#white-url").get(0)});
            // } else if (this.defaultParam.refererType === 2) {
            //     result = this.onBlurDomainInput({target: this.$el.find("#black-domain").get(0)});
            //     //result = this.onBlurUrlInput({target: this.$el.find("#black-url").get(0)})
            // }
            return result;
        },

        onSure: function(){
            var result = this.checkEverything();
            if (!result) return false;
            var matchConditionParam = this.matchConditionView.getMatchConditionParam();
            if (!matchConditionParam) return false;

            var matchingType = matchConditionParam.type, matchingTypeName;
            if (matchingType === 0) matchingTypeName = "文件类型";
            if (matchingType === 1) matchingTypeName = "指定目录";
            if (matchingType === 2) matchingTypeName = "指定URL";
            if (matchingType === 3) matchingTypeName = "正则匹配";
            if (matchingType === 4) matchingTypeName = "url包含指定参数";
            if (matchingType === 9) matchingTypeName = "全部文件";

            var type = this.defaultParam.refererType, typeName;
            if (type === 1) typeName = "Referer类型：白名单<br>";
            if (type === 2) typeName = "Referer类型：黑名单<br>";

            var domains = '', domainsName = '';
            
            if (this.defaultParam.refererType === 1) 
                domains = _.uniq(this.$el.find("#white-domain").val().split(',')).join(',')
            else
                domains = _.uniq(this.$el.find("#black-domain").val().split(',')).join(',')

            if (domains&&type === 1) domainsName = "合法域名：" + domains + "<br>";
            if (domains&&type === 1) domainsName = "非法域名：" + domains + "<br>";

            var nullReferer = this.defaultParam.nullReferer, nullRefererName;
            if (nullReferer === 0) nullRefererName = "是否允许空引用：否<br>";
            if (nullReferer === 1) nullRefererName = "是否允许空引用：是<br>";

            var summary = typeName + domainsName + nullRefererName;

            var postParam = {
                type: type,
                domains: domains,
                nullReferer: this.defaultParam.nullReferer,
                id: this.isEdit ? this.model.get("id") : new Date().valueOf(),
                matchingType: matchingType,
                matchingValue: matchConditionParam.policy,
                summary: summary,
                matchingTypeName: matchingTypeName
            }

            return postParam
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

    return RefererAntiLeechView;
});