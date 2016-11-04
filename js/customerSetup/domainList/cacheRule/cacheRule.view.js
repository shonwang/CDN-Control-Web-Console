define("cacheRule.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditRoleView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.add.html'])());

            this.defaultParam = {
                cacheTimeType: 1,
                cacheTime: 60 * 60 * 24 * 30,
                cacheOriginTime: 60 * 60 * 24 * 30,
                type: 9,
                policy: ""
            };            

            if (this.isEdit){
                if (this.model.get("expireTime") === 0 && this.model.get("hasOriginPolicy") === 0)
                    this.defaultParam.cacheTimeType = 1;
                if (this.model.get("expireTime") !== 0 && this.model.get("hasOriginPolicy") === 0){
                    this.defaultParam.cacheTimeType = 2;
                    this.defaultParam.cacheTime = this.model.get("expireTime") || 60 * 60 * 24 * 30;
                }
                if (this.model.get("expireTime") !== 0 && this.model.get("hasOriginPolicy") === 1){
                    this.defaultParam.cacheTimeType = 3;
                    this.defaultParam.cacheOriginTime = this.model.get("expireTime") || 60 * 60 * 24 * 30;
                }
                this.defaultParam.type = this.model.get("type");
                this.defaultParam.policy = this.model.get("policy") || "";
            }

            require(['matchCondition.view', 'matchCondition.model'], function(MatchConditionView, MatchConditionModel){
                //0文件后缀，1目录，2具体url,3正则预留,4url包含指定参数9全局默认缓存配置项
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

                this.initSetup();
            }.bind(this))
        },

        initSetup: function(){
            if (this.defaultParam.cacheTimeType === 1){
                this.$el.find("#cacheTimeRadios1").get(0).checked = true;
            } else if (this.defaultParam.cacheTimeType === 2) {
                this.$el.find("#cacheTimeRadios2").get(0).checked = true;
            } else if (this.defaultParam.cacheTimeType === 3){
                this.$el.find("#cacheTimeRadios3").get(0).checked = true;
            }
            this.initTimeDropdown();
        },

        initTimeDropdown: function(){
            var  timeArray = [
                {"value": 1, "name": "秒"},
                {"value": 60, "name": "分"},
                {"value": 60 * 60, "name": "时"},
                {"value": 60 * 60 * 24, "name": "天"},
                {"value": 60 * 60 * 24 * 30, "name": "月"},
                {"value": 60 * 60 * 24 * 30 * 12, "name": "年"},
            ];
            
            var input = this.defaultParam.cacheTime,
                rootNode = this.$el.find(".yes-cache");
                curEl = this.$el.find("#dropdown-yes-cache .cur-value"),
                curInputEl = this.$el.find("#yes-cache-time");

            Utility.initDropMenu(rootNode, timeArray, function(value){
                this.defaultParam.cacheTime = parseInt(curInputEl.val()) * parseInt(value);
            }.bind(this));

            curInputEl.on("click", function(){curInputEl.focus()}.bind(this))
            curInputEl.on("blur", function(){
                var unit = _.find(timeArray, function(obj){
                    return obj.name === curEl.html();
                }.bind(this));
                this.defaultParam.cacheTime = unit.value * parseInt(curInputEl.val());
            }.bind(this))

            this.timeFormatWithUnit(input, curEl, curInputEl);

            //若源站无缓存时间，则缓存
            var inputNum = this.defaultParam.cacheOriginTime,
                rootOtherNode = this.$el.find(".origin-cache")
                curEl2 = this.$el.find("#dropdown-origin-cache .cur-value"),
                curInputEl2 = this.$el.find("#origin-cache-time");

            Utility.initDropMenu(rootOtherNode, timeArray, function(value){
                this.defaultParam.cacheOriginTime = parseInt(curInputEl2.val()) * parseInt(value);
            }.bind(this));

            curInputEl2.on("click", function(){curInputEl2.focus()}.bind(this))
            curInputEl2.on("blur", function(){
                var unit = _.find(timeArray, function(obj){
                    return obj.name === curEl2.html();
                }.bind(this));
                this.defaultParam.cacheOriginTime = unit.value * parseInt(curInputEl2.val());
            }.bind(this))

            this.timeFormatWithUnit(inputNum, curEl2, curInputEl2);
        },

        timeFormatWithUnit: function(input, curEl, curInputEl) {
            var num = parseInt(input);
            if (input >= 60 && input < 60 * 60) {
                num = Math.ceil(input / 60)
                curEl.html('分');
            } else if (input >= 60 * 60 && input < 60 * 60 * 24) {
                num = Math.ceil(input / 60 / 60);
                curEl.html('时');
            } else if (input >= 60 * 60 * 24 && input < 60 * 60 * 24 * 30) {
                num = Math.ceil(input / 60 / 60 / 24);
                curEl.html('天');
            } else if (input >= 60 * 60 * 24 * 30 && input < 60 * 60 * 24 * 30 * 12) {
                num = Math.ceil(input / 60 / 60 / 24 / 30);
                curEl.html('月');
            } else if (input >= 60 * 60 * 24 * 30 * 12){
                num = Math.ceil(input / 60 / 60 / 24 / 30 / 12);
                curEl.html('年');
            } else {
                curEl.html('秒');
            }
            curInputEl.val(num)
        },

        onSure: function(){
            var matchConditionParam = this.matchConditionView.getMatchConditionParam(),
                hasOriginPolicy, expireTime, summary,
                cacheTimeType = parseInt(this.$el.find("[name='cacheTimeRadios']:checked").val());

            if (!matchConditionParam) return false;

            if (cacheTimeType === 1) {
                expireTime = 0,
                hasOriginPolicy = 0
                summary = "缓存时间：不缓存";
            } else if (cacheTimeType === 2){
                hasOriginPolicy = 0
                expireTime = this.defaultParam.cacheTime,
                summary = "缓存时间：" + Utility.timeFormat(expireTime);
            } else if(cacheTimeType === 3){
                expireTime = this.defaultParam.cacheOriginTime,
                hasOriginPolicy = 1
                summary = "使用源站缓存, 若源站无缓存时间，则缓存：" + Utility.timeFormat(expireTime);
            }

            var postParam = {
                "id": this.isEdit ? this.model.get("id") : new Date().valueOf(),
                "type": matchConditionParam.type,
                "typeName": matchConditionParam.typeName,
                "policy": matchConditionParam.policy,
                "expireTime": expireTime,
                "hasOriginPolicy": hasOriginPolicy,
                "summary": summary
            }
            return postParam
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var CacheRuleView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.html'])());
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

            this.collection.on("get.policy.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.policy.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRole, this))
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this))

            this.onClickQueryButton();

            this.collection.on("set.policy.success", $.proxy(this.launchSendPopup, this));
            this.collection.on("set.policy.error", $.proxy(this.onGetError, this));
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

        onClickSaveBtn: function(){
            var list = [];
            this.collection.each(function(obj){
                list.push({
                    "type": obj.get('type'),
                    "policy": obj.get('policy'),
                    "expireTime": obj.get('expireTime'),
                    "hasOriginPolicy": obj.get('hasOriginPolicy'),
                })
            }.bind(this))

            var postParam = {
                "originId": this.domainInfo.id,
                "userId": this.clientInfo.uid,
                "list": list
            }

            this.collection.setPolicy(postParam)
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
            this.collection.getPolicyList({originId: this.domainInfo.id});
        },

        initTable: function(){
            var allFileArray = this.collection.filter(function(obj){
                return obj.get('type') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('type') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('type') !== 2 && obj.get('type') !== 9;
            }.bind(this));

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.table = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.table.html'])({
                data: this.collection.models,
                hideAction: false
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

            var myAddEditRoleView = new AddEditRoleView({
                collection: this.collection,
                model: model,
                isEdit: true
            });

            var options = {
                title:"缓存规则",
                body : myAddEditRoleView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditRoleView.onSure();
                    if (!postParam) return;
                    _.each(postParam, function(value, key, ls){
                        model.set(key, value);
                    }.bind(this))
                    this.collection.trigger("get.policy.success");
                    this.addRolePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickAddRole: function(event){
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditRoleView = new AddEditRoleView({collection: this.collection});

            var options = {
                title:"缓存规则",
                body : myAddEditRoleView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditRoleView.onSure();
                    if (!postParam) return;
                    var model = new this.collection.model(postParam);
                    var allFileArray = this.collection.filter(function(obj){
                        return obj.get('type') === 9;
                    }.bind(this));

                    var specifiedUrlArray = this.collection.filter(function(obj){
                        return obj.get('type') === 2;
                    }.bind(this));

                    var otherArray = this.collection.filter(function(obj){
                        return obj.get('type') !== 2 && obj.get('type') !== 9;
                    }.bind(this));

                    if (postParam.type === 9) allFileArray.push(model)
                    if (postParam.type === 2) specifiedUrlArray.push(model)
                    if (postParam.type !== 9 && postParam.type !== 2) otherArray.push(model)
  
                    this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)
                    this.collection.trigger("get.policy.success");
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
                    this.collection.trigger("get.policy.success")
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
                return obj.get('type') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('type') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('type') !== 2 && obj.get('type') !== 9;
            }.bind(this));

            _.each(otherArray, function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            otherArray = Utility.adjustElement(otherArray, modelIndex, true)

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.collection.trigger("get.policy.success")
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
                return obj.get('type') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('type') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('type') !== 2 && obj.get('type') !== 9;
            }.bind(this));

            _.each(otherArray, function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            otherArray = Utility.adjustElement(otherArray, modelIndex, false)

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.collection.trigger("get.policy.success")
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

    return CacheRuleView;
});