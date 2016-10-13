define("refererAntiLeech.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditRefererAntiLeechView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/refererAntiLeech/refererAntiLeech.add.html'])());

            this.defaultParam = {
                refererType: 1,
                domains: "",
                nullReferer: 0,
                type: 9,
                policy: ""
            };

            if (this.isEdit){
                this.defaultParam.type = this.model.get("matchingType") || 9;
                this.defaultParam.policy = this.model.get("matchingValue") || "";
                this.defaultParam.refererType = this.model.get("type") || 1;
                this.defaultParam.domains = this.model.get("domains") || "";
                this.defaultParam.nullReferer = this.model.get("nullReferer") || 0;
            }

            require(['matchCondition.view', 'matchCondition.model'], function(MatchConditionView, MatchConditionModel){
                var  matchConditionArray = [
                    {name: "全部文件", value: 9},
                    {name: "文件类型", value: 0},
                    {name: "指定URI", value: 2},
                    {name: "指定目录", value: 1},
                    {name: "正则匹配", value: 3},
                ], matchConditionOption = {
                    collection: new MatchConditionModel(),
                    defaultCondition : this.defaultParam.type,
                    defaultPolicy: this.defaultParam.policy,
                    matchConditionArray: matchConditionArray
                }
                this.matchConditionView = new MatchConditionView(matchConditionOption);
                this.matchConditionView.render(this.$el.find(".match-condition-ctn"));

                if (this.defaultParam.refererType === 1)
                    this.$el.find(".black-list").hide();
                else if (this.defaultParam.refererType === 2)
                    this.$el.find(".white-list").hide();

                if (this.defaultParam.nullReferer === 1){
                    this.$el.find(".null-referer .togglebutton input").get(0).checked = true;
                } else if (this.defaultParam.nullReferer === 0){
                    this.$el.find(".null-referer .togglebutton input").get(0).checked = false;
                }

                this.initTypeDropdown();

                this.$el.find("#white-domain").on("blur", $.proxy(this.onBlurDomainInput, this));
                this.$el.find("#white-url").on("blur", $.proxy(this.onBlurUrlInput, this));
                this.$el.find("#black-domain").on("blur", $.proxy(this.onBlurDomainInput, this));
                this.$el.find("#black-url").on("blur", $.proxy(this.onBlurUrlInput, this));
                this.$el.find(".null-referer .togglebutton input").on("click", $.proxy(this.onClickIsNullReferer, this));
            }.bind(this))
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
            var result = true;
            if (this.defaultParam.refererType === 1){
                result = this.onBlurDomainInput({target: this.$el.find("#white-domain").get(0)});
                //result = this.onBlurUrlInput({target: this.$el.find("#white-url").get(0)});
            } else if (this.defaultParam.refererType === 2) {
                result = this.onBlurDomainInput({target: this.$el.find("#black-domain").get(0)});
                //result = this.onBlurUrlInput({target: this.$el.find("#black-url").get(0)})
            }
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
            if (type === 0) typeName = "Referer类型：白名单<br>";
            if (type === 1) typeName = "Referer类型：黑名单<br>";

            var domains = this.defaultParam.refererType === 1 ? this.$el.find("#white-domain").val() : this.$el.find("#black-domain").val(), 
                domainsName;
            if (domains) domainsName = "合法域名：" + domains + "<br>";

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

            console.log(postParam)

            return postParam
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });


    var RefererAntiLeechView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/refererAntiLeech/refererAntiLeech.html'])());
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
                notShowBtn: false
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.collection.on("get.refer.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.refer.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRule, this))
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.onClickQueryButton();
            this.collection.on("set.refer.success", $.proxy(this.launchSendPopup, this));
            this.collection.on("set.refer.error", $.proxy(this.onGetError, this));
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: this.collection, 
                });
                var options = {
                    title: "发布",
                    body : mySaveThenSendView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback:  function(){
                        this.sendPopup.$el.modal("hide");
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

        onChannelListSuccess: function(){
            this.initTable();
        },

        onClickQueryButton: function(){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getReferSafetyChainList({originId:this.domainInfo.id});
        },

        initTable: function(){
            var allFileArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
            }.bind(this));

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.table = $(_.template(template['tpl/customerSetup/domainList/refererAntiLeech/refererAntiLeech.table.html'])({
                data: this.collection.models
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .up").on("click", $.proxy(this.onClickItemUp, this));
            this.table.find("tbody .down").on("click", $.proxy(this.onClickItemDown, this));
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.find(function(obj){
                return obj.get("id") === parseInt(id)
            }.bind(this));
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditRefererAntiLeechView = new AddEditRefererAntiLeechView({
                collection: this.collection,
                model: model,
                isEdit: true
            });

            var options = {
                title:"referer防盗链",
                body : myAddEditRefererAntiLeechView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditRefererAntiLeechView.onSure();
                    if (!postParam) return;
                    _.each(postParam, function(value, key, ls){
                        this.collection.get(id).set(key, value);
                    }.bind(this))
                    this.collection.trigger("get.refer.success");
                    this.addRolePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickAddRule: function(event){
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditRefererAntiLeechView = new AddEditRefererAntiLeechView({collection: this.collection});

            var options = {
                title:"referer防盗链",
                body : myAddEditRefererAntiLeechView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditRefererAntiLeechView.onSure();
                    if (!postParam) return;
                    var model = new this.collection.model(postParam);
                    var allFileArray = this.collection.filter(function(obj){
                        return obj.get('matchingType') === 9;
                    }.bind(this));

                    var specifiedUrlArray = this.collection.filter(function(obj){
                        return obj.get('matchingType') === 2;
                    }.bind(this));

                    var otherArray = this.collection.filter(function(obj){
                        return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
                    }.bind(this));

                    if (postParam.type === 9) allFileArray.push(model)
                    if (postParam.type === 2) specifiedUrlArray.push(model)
                    if (postParam.type !== 9 && postParam.type !== 2) otherArray.push(model)
  
                    this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)
                    this.collection.trigger("get.refer.success");
                    this.addRolePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickItemDelete: function(event){
            var result = confirm("你确定要删除吗？");
            if (!result) return;
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");
            for (var i = 0; i < this.collection.models.length; i++){
                if (this.collection.models[i].get("id") === parseInt(id)){
                    this.collection.models.splice(i, 1);
                    this.collection.trigger("get.refer.success")
                    return;
                }
            }
        },

        onClickItemUp: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), modelIndex;

            var allFileArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
            }.bind(this));

            _.each(otherArray, function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            otherArray = Utility.adjustElement(otherArray, modelIndex, true)

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.collection.trigger("get.refer.success")
        },

        onClickItemDown: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), modelIndex;

            var allFileArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
            }.bind(this));

            _.each(otherArray, function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            otherArray = Utility.adjustElement(otherArray, modelIndex, false)

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.collection.trigger("get.refer.success")
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