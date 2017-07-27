define("luaCacheRule.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var CacheRuleView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/mainCtn.html'])({
                data: {
                    mainTitle: "缓存优化",
                    subTitle: "缓存规则"
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
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

            this.luaCacheRuleEl = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.add.html'])());
            this.luaCacheRuleEl.appendTo(this.$el.find(".main-ctn"));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            // this.collection.on("get.policy.success", $.proxy(this.onChannelListSuccess, this));
            // this.collection.on("get.policy.error", $.proxy(this.onGetError, this));
            // this.collection.on("set.policy.success", $.proxy(this.onSaveSuccess, this));
            // this.collection.on("set.policy.error", $.proxy(this.onGetError, this));
            // this.onClickQueryButton();

            this.defaultParam = {
                cacheTimeType: 1,
                cacheTime: 60 * 60 * 24 * 30,
                cacheOriginTime: 60 * 60 * 24 * 30,
                type: 9,
                policy: ""
            };

            this.initSetup();            
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

        onClickQueryButton: function(){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getPolicyList({originId: this.domainInfo.id});
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
            this.$el.find("input[name=cacheTimeRadios]").on("change",Utility.onContentChange);
            this.$el.find("#yes-cache-time").on("focus",Utility.onContentChange);
            this.$el.find("#origin-cache-time").on("focus",Utility.onContentChange);
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
                Utility.onContentChange();
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
            if (num !== 60 * 60 * 24 * 30){
                curInputEl.val(num);
                curEl.html('秒');
                return;
            }
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
                summary = "缓存时间：" + Utility.timeFormat2(expireTime);
                //summary = "缓存时间：" + expireTime + "秒";
            } else if(cacheTimeType === 3){
                expireTime = this.defaultParam.cacheOriginTime,
                hasOriginPolicy = 1
                summary = "使用源站缓存, 若源站无缓存时间，则缓存：" + Utility.timeFormat2(expireTime);
                //summary = "使用源站缓存, 若源站无缓存时间，则缓存：" + expireTime + "秒";
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