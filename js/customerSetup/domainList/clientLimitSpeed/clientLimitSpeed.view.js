define("clientLimitSpeed.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var TimeLimitAddEditView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.addTimeLimit.html'])());
        },

        onSure: function(){
            var startHour = parseInt(this.$el.find("#start-hour").val() || "0"),
                startMinutes = parseInt(this.$el.find("#start-minutes").val() || "0"),
                startSecond = parseInt(this.$el.find("#start-second").val() || "0"),
                endHour = parseInt(this.$el.find("#end-hour").val() || "0"),
                endMinutes = parseInt(this.$el.find("#end-minutes").val() || "0"),
                endSecond = parseInt(this.$el.find("#end-second").val() || "0");

            if (startHour > 23 || endHour > 23) {
                alert("小时不能大于23！")
                return false;
            }
            if (startMinutes > 59 || endMinutes > 59 || endMinutes > 59 || endSecond > 59) {
                alert("分钟、秒不能大于59！")
                return false;
            }

            var startTimeStr = startHour + ":" + startMinutes + ":" + startSecond,
                endTimeStr = endHour + ":" + endMinutes + ":" + endSecond;

            var nowDate = new Date().format("yyyy/MM/dd");

            var startTime = new Date(nowDate + " " + startTimeStr).format("hhmmss"),
                endTime   = new Date(nowDate + " " + endTimeStr).format("hhmmss")
            if (parseInt(endTime) <= parseInt(startTime)) {
                alert("结束时间不能小于等于开始时间！")
                return false;
            }

            var limitTimeObj = {
                id: new Date().valueOf(),
                start: new Date(nowDate + " " + startTimeStr).format("hh:mm:ss"),
                end: new Date(nowDate + " " + endTimeStr).format("hh:mm:ss"),
                limitSpeed: this.$el.find("#set-limit").val()
            }
            return limitTimeObj;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var AddEditLimitView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.add.html'])());

            this.defaultParam = {
                byteNotLimit: 1,
                byteNotLimitUnit: 1, 
                limitSpeed: 0,
                preUnlimit: 0,
                timeLimitList: [],
                type: 9,
                policy: ""
            }

            if (this.isEdit){
                this.defaultParam.type = this.model.get("matchingType") || 0;
                this.defaultParam.policy = this.model.get("matchingValue") || "";
                this.defaultParam.byteNotLimit = this.model.get("preUnlimit") === 0 ? 1 : 2;
                this.defaultParam.byteNotLimitUnit = this.model.get("preUnlimit") >= 1024 ? 2 : 1;
                this.defaultParam.preUnlimit = this.model.get("preUnlimit") || 0;
                this.defaultParam.limitSpeed = this.model.get("speedLimit") || 0;
                _.each(this.model.get("timeLimit"), function(el, index, ls){
                    this.defaultParam.timeLimitList.push({
                        id: el.id,
                        start: new Date(el.startTime).format("hh:mm:ss"),
                        end: new Date(el.endTime).format("hh:mm:ss"),
                        limitSpeed: el.speedLimit
                    })
                }.bind(this))
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

                this.initSetup();
            }.bind(this))

            this.$el.find(".byte-limit-toggle .togglebutton input").on("click", $.proxy(this.onClickByteLimitToggle, this));
            this.$el.find(".add-time-limit").on("click", $.proxy(this.onClickAddTimeLimit, this));
        },

        initSetup: function(){
            this.initUnitDropdown();
            if (this.defaultParam.byteNotLimit === 1){
                this.$el.find(".byte-limit-toggle .togglebutton input").get(0).checked = false;
                this.$el.find(".byte-limit").hide();
            } else if (this.defaultParam.byteNotLimit === 2){
                this.$el.find(".byte-limit-toggle .togglebutton input").get(0).checked = true;
                this.$el.find(".byte-limit").show();
            }
            if (this.defaultParam.byteNotLimitUnit === 1){
                this.$el.find("#byte-limit").val(this.defaultParam.preUnlimit);
            } else {
                this.$el.find("#byte-limit").val(this.defaultParam.preUnlimit / 1024);
            }
            this.$el.find("#set-limit").val(this.defaultParam.limitSpeed);
            this.updateTimeLimitTable();
        },

        updateTimeLimitTable: function(){
            this.$el.find(".table-ctn").find(".table").remove()
            this.timeLimitTable = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.timeLimitTable.html'])({
                data: this.defaultParam.timeLimitList
            }))

            this.timeLimitTable.find(".delete").on("click", $.proxy(this.onClickTimeLimitTableItemDelete, this));
            this.$el.find(".table-ctn").html(this.timeLimitTable.get(0));
        },

        onClickTimeLimitTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.defaultParam.timeLimitList, function(obj){
                return obj.id !== parseInt(id)
            }.bind(this))

            this.defaultParam.timeLimitList = filterArray;
            this.updateTimeLimitTable();
        },

        onClickAddTimeLimit: function(){
            this.rootNode.modal("hide");

            if (this.addTimeLimitPopup) $("#" + this.addTimeLimitPopup.modalId).remove();

            var myTimeLimitAddEditView = new TimeLimitAddEditView({collection: this.collection});

            var options = {
                title:"添加时间限速",
                body : myTimeLimitAddEditView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var aTimeLimit = myTimeLimitAddEditView.onSure();
                    if (!aTimeLimit) return;
                    this.defaultParam.timeLimitList.push(aTimeLimit);
                    this.updateTimeLimitTable();
                    this.addTimeLimitPopup.$el.modal("hide");
                    setTimeout(function(){
                        this.rootNode.modal("show")
                    }.bind(this), 500)
                }.bind(this),
                onHiddenCallback: function(){
                    this.rootNode.modal('show')
                }.bind(this)
            }
            setTimeout(function(){
                this.addTimeLimitPopup = new Modal(options);
            }.bind(this), 500)

        },

        initUnitDropdown: function(){
            var  unitArray = [
                {name: "KB", value: 1},
                {name: "MB", value: 2}
            ],
            rootNode = this.$el.find(".byte-limit-unit");
            Utility.initDropMenu(rootNode, unitArray, function(value){
                this.defaultParam.byteNotLimitUnit = parseInt(value)
            }.bind(this));

            var defaultValue = _.find(unitArray, function(object){
                return object.value === this.defaultParam.byteNotLimitUnit;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-byte-limit-unit .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-byte-limit-unit .cur-value").html(unitArray[0].name);
        },

        onClickByteLimitToggle: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.$el.find(".byte-limit").show();
                this.defaultParam.byteNotLimit = 2;
            } else {
                this.$el.find(".byte-limit").hide();
                this.defaultParam.byteNotLimit = 1;
            }
        },

        onSure: function(){
            var matchConditionParam = this.matchConditionView.getMatchConditionParam();
            if (!matchConditionParam) return false;

            var preUnlimit = parseInt(this.$el.find("#byte-limit").val());

            if (this.defaultParam.byteNotLimitUnit === 2)
                preUnlimit = preUnlimit * 1024
            if (this.defaultParam.byteNotLimit === 1) preUnlimit = 0;

            speedLimit = this.$el.find("#set-limit").val(), 
            summary = '', timeLimit = [], nowDate = new Date().format("yyyy/MM/dd");

            if (preUnlimit === 0) summary = "指定不限速字节数：关闭。限速字节数：" + speedLimit + "kb/s<br>";
            if (preUnlimit !== 0) summary = "指定不限速字节数：" + preUnlimit + "kb。限速字节数：" + speedLimit + "kb/s<br>";

            _.each(this.defaultParam.timeLimitList, function(el, index, ls){
                var startTime = el.start,
                    endTime = el.end,
                    speedLimit2 = el.limitSpeed + "kb/s<br>"
                var timeStr = "限速时间段：" + startTime + "至" + endTime + "，限速字节数：" + speedLimit2;
                summary = summary + timeStr;
                timeLimit.push({
                    "id": el.id,
                    "startTime" : new Date(nowDate + " " + el.start).valueOf(),
                    "endTime" : new Date(nowDate + " " + el.end).valueOf(),
                    "speedLimit": el.limitSpeed
                })
            })

            var postParam = {
                "id": this.isEdit ? this.model.get("id") : new Date().valueOf(),
                "matchingType": matchConditionParam.type,
                "matchingValue": matchConditionParam.policy,
                "preUnlimit": preUnlimit,
                "speedLimit": speedLimit,
                "timeLimit": timeLimit,
                "summary": summary
            }
            return postParam
        },

        render: function(target, rootNode) {
            this.$el.appendTo(target);
            this.rootNode = rootNode;
        }
    });

    var ClientLimitSpeedView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: false
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.collection.on("get.speed.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.speed.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRule, this))
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.onClickQueryButton();
            this.collection.on("set.speed.success", $.proxy(this.launchSendPopup, this));
            this.collection.on("set.speed.error", $.proxy(this.onGetError, this));
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
                    "matchingType": obj.get('matchingType'),
                    "matchingValue": obj.get('matchingValue'),
                    "preUnlimit": obj.get('preUnlimit'),
                    "speedLimit": obj.get('speedLimit'),
                    "timeLimit": obj.get('timeLimit'),
                })
            }.bind(this))

            var postParam = {
                "originId": this.domainInfo.id,
                "list": list
            }

            this.collection.setClientSpeed(postParam)
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
            this.collection.getClientSpeed({originId:this.domainInfo.id});
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

            this.table = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.table.html'])({
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

            var myAddEditLimitView = new AddEditLimitView({
                collection: this.collection,
                model: model,
                isEdit: true
            });

            var options = {
                title:"客户端限速",
                body : myAddEditLimitView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditLimitView.onSure();
                    if (!postParam) return;
                    _.each(postParam, function(value, key, ls){
                        model.set(key, value);
                    }.bind(this))
                    this.collection.trigger("get.speed.success");
                    this.addRolePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickAddRule: function(event){
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditLimitView = new AddEditLimitView({collection: this.collection});

            var options = {
                title:"客户端限速",
                body : myAddEditLimitView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditLimitView.onSure();
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
                    this.collection.trigger("get.speed.success");
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
                    this.collection.trigger("get.speed.success")
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

            this.collection.trigger("get.speed.success")
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

            this.collection.trigger("get.speed.success")
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

    return ClientLimitSpeedView;
});