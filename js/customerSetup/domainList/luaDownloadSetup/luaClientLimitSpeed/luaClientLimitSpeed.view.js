define("luaClientLimitSpeed.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

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

    var ClientLimitSpeedView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/mainCtn.html'])({
                data: {
                    mainTitle: "限速",
                    subTitle: "客户端限速"
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
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.$el.find(".main-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.on("get.speed.success", $.proxy(this.initSetup, this));
            this.collection.on("get.speed.error", $.proxy(this.onGetError, this));
            this.collection.on("set.speed.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.speed.error", $.proxy(this.onGetError, this));
            this.collection.getClientSpeed({originId: this.domainInfo.id});

            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.defaultParam = {
                byteNotLimit: 1,
                byteNotLimitUnit: 1,
                limitSpeedToggle: 1,  
                limitSpeed: 0,
                preUnlimit: 0,
                timeLimitList: [],
            }

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
            var preUnlimit = parseInt(this.$el.find("#byte-limit").val());

            if (this.defaultParam.byteNotLimitUnit === 2)
                preUnlimit = preUnlimit * 1024

            var speedLimit = parseInt(this.$el.find("#set-limit").val()), 
                timeLimit = [], nowDate = new Date().format("yyyy/MM/dd");

            _.each(this.defaultParam.timeLimitList, function(el, index, ls){
                timeLimit.push({
                    "id": el.id,
                    "startTime" : el.start,
                    "endTime" : el.end,
                    "speedLimit": el.limitSpeed
                })
            })

            var postParam = {
                "originId": this.domainInfo.id,
                "list": [{
                    "preUnlimit": preUnlimit,
                    "speedLimit": speedLimit,
                    "timeLimit": timeLimit,
                    "preFlag": this.defaultParam.byteNotLimit === 1 ? 0 : 1,
                    "speedFlag": this.defaultParam.limitSpeedToggle === 1 ? 0 : 1,
                    "locationId": this.defaultParam.locationId
                }]
            }

            this.collection.setClientSpeedBatch(postParam)
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        initSetup: function(data){
            if (data) {
                this.defaultParam.locationId = data.locationId;
                this.defaultParam.byteNotLimit = data.preFlag === 0 ? 1 : 2;
                this.defaultParam.byteNotLimitUnit = data.preUnlimit >= 1024 ? 2 : 1;
                this.defaultParam.preUnlimit = data.preUnlimit || 0;
                this.defaultParam.limitSpeedToggle = data.speedFlag === 0 ? 1 : 2;
                this.defaultParam.limitSpeed = data.speedLimit || 0;
                _.each(data.timeLimit, function(el, index, ls){
                    this.defaultParam.timeLimitList.push({
                        id: el.id,
                        start: el.startTime,
                        end: el.endTime,
                        limitSpeed: el.speedLimit
                    })
                }.bind(this))
            }

            this.clientLimitSpeed = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.add.html'])());
            this.$el.find(".main-ctn").html(this.clientLimitSpeed.get(0));

            this.$el.find(".byte-limit-toggle .togglebutton input").on("click", $.proxy(this.onClickByteLimitToggle, this));
            this.$el.find(".set-limit-toggle .togglebutton input").on("click", $.proxy(this.onClickSetLimitToggle, this));
            this.$el.find(".add-time-limit").on("click", $.proxy(this.onClickAddTimeLimit, this));

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
            if (this.defaultParam.limitSpeedToggle === 1){
                this.$el.find(".set-limit-toggle .togglebutton input").get(0).checked = false;
                this.$el.find(".set-limit").hide();
            } else if (this.defaultParam.limitSpeedToggle === 2){
                this.$el.find(".set-limit-toggle .togglebutton input").get(0).checked = true;
                this.$el.find(".set-limit").show();
            }
            this.$el.find("#set-limit").val(this.defaultParam.limitSpeed);
            this.updateTimeLimitTable();

            this.$el.find("#byte-limit").on("focus",Utility.onContentChange);
            this.$el.find("#set-limit").on("focus",Utility.onContentChange);
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
            Utility.onContentChange();
        },

        onClickAddTimeLimit: function(){

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
                    Utility.onContentChange();
                }.bind(this),
                onHiddenCallback: function(){
                }.bind(this)
            }
            this.addTimeLimitPopup = new Modal(options);
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
            Utility.onContentChange();
        },

        onClickSetLimitToggle: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.$el.find(".set-limit").show();
                this.defaultParam.limitSpeedToggle = 2;
            } else {
                this.$el.find(".set-limit").hide();
                this.defaultParam.limitSpeedToggle = 1;
            }
            Utility.onContentChange();
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