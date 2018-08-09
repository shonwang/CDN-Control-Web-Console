define("luaXtcpSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LuaXtcpSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/mainCtn.html'])({
                data: {
                    mainTitle: "域名设置",
                    subTitle: "xtcp配置"
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
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveButton, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
            this.$el.find(".main-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.off("get.xtcp.success");
            this.collection.off("get.xtcp.error");
            this.collection.off("set.xtcp.success");
            this.collection.off("set.xtcp.success");
            this.collection.on("get.xtcp.success", $.proxy(this.onGetXtcpSuccess, this));
            this.collection.on("get.xtcp.error", $.proxy(this.onGetError, this));
            this.collection.on("set.xtcp.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.xtcp.error", $.proxy(this.onGetError, this));
            this.collection.getXtcpSetupInfo({
                originId: this.domainInfo.id
            });
            
            this.defaultParam = {
                userInfo:{
                    "originId": this.domainInfo.id,
                    "userId": this.clientInfo.uid
                },
                defSetup:{
                    "workModeDef": 1,      //默认配置工作模式
                    "effectRadioDef": 100,  //默认配置生效比例
                },
                vipSetup:{
                    "effectWeek": [],
                    "effectTime": [1539705600000,1539705600000],
                    "workModeVip": 1,     //高级配置工作模式
                    "effectRadioVip": 100   //高级配置生效比例
                } 
            }    

            //初始化配置是暂时的过渡，等后端接口开通应该省去初始化的配置    
            console.log(this.$el.find(".advanceSetup-toggle .togglebutton input"))
            
        },

        onGetXtcpSuccess: function(data){
            // 对传过来的数据做一些处理
            console.log("cccccc", data);
            var def = data.defConf;
            var adv = data.advConfList;
            this.defId = def.id;
            this.advFlag = def.advFlag;
            if(adv != null){
                this.isEdit = true 
                this.vipId = adv[0].id || null;
                console.log(this.vipId)   
                this.defaultParam.defSetup = {
                    "workModeDef": def.model,      //默认配置工作模式
                    "effectRadioDef": def.ratio,
                };
                this.defaultParam.vipSetup = {
                    "effectWeek": adv[0].workDay.split(""),
                    "effectTime": [adv[0].startTime, adv[0].endTime],
                    "workModeVip": adv[0].model,     //高级配置工作模式
                    "effectRadioVip": adv[0].ratio   //高级配置生效比例
                }     
            }
            console.log(this.defaultParam)

            this.luaXtcpTemp = $(_.template(template['tpl/customerSetup/domainList/xtcpSetup/xtcpSetup.html'])({
                data:this.defaultParam
            }));

            console.log(this.advFlag)
            this.$el.find(".main-ctn").html(this.luaXtcpTemp.get(0))
            this.$el.find("#effect-ratio").on('keyup', $.proxy(this.onNumberOnly, this))
            this.$el.find("#effect-ratio").on('afterpaste', $.proxy(this.onNumberOnly, this))
            if(this.advFlag === 1){
                this.$el.find(".togglebutton input").attr("checked", true);
                this.$el.find(".advanceSetup").show();
                this.$el.find("#effect-ratio-vip").on('keyup', $.proxy(this.onNumberOnly, this))
                this.$el.find("#effect-ratio-vip").on('afterpaste', $.proxy(this.onNumberOnly, this))
            }
            if(this.defaultParam.vipSetup.effectWeek.length === 7){
                console.log(this.defaultParam.vipSetup.effectWeek)
                this.$el.find("input#effectweek-all").prop("checked", true);
            }else{
                this.$el.find("input#effectweek-all").prop("checked", false);
            }
            this.$el.find(".advanceSetup-toggle .togglebutton input").on("click", $.proxy(this.onClickIsAdvanceSetupBtn,this));
            this.$el.find("input[name=options-effectWeek]").on("click", $.proxy(this.onClickCheckedWeek, this));
            this.initEffectTimeDropMenu();
        },

        onNumberOnly: function(event){
            var eventTarget = event.srcElement || event.target;
            eventTarget.value = eventTarget.value.replace(/\D/g,'')
        },

        onClickCheckedWeek:function(event){
            var globalWeek = this.defaultParam.vipSetup.effectWeek;
            var effectWeek = this.$el.find("input[name=options-effectWeek]:not(#effectweek-all)");
            var tempWeek = [];
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if(eventTarget.value == "all"){
                if(eventTarget.checked){
                    this.$el.find("input[name=options-effectWeek]:not(#effectweek-all)").prop("checked", true);
                }else{
                    this.$el.find("input[name=options-effectWeek]:not(#effectweek-all)").prop("checked", false);
                }
            }else{
                if(eventTarget.checked){
                    if(globalWeek.length === 6){
                        this.$el.find("input#effectweek-all").prop("checked", true);
                    }
                }else{
                    this.$el.find("input#effectweek-all").prop("checked", false);
                }
            }
            _.each(effectWeek, function(el){
                if(el.checked === true){
                    tempWeek.push(el.value)
                }
            }.bind(this))
            console.log(tempWeek)
            this.defaultParam.vipSetup.effectWeek = tempWeek
            // 输出tempweek,将值传递给this.defaultParam.vipSetup.effectWeek
        },

        onClickIsAdvanceSetupBtn:function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                console.log("bbbbbbb")
                this.$el.find(".advanceSetup").show();
                this.advFlag = 1
            } else {
                this.$el.find(".advanceSetup").hide();
                this.advFlag = 0
            }
        },

        initEffectTimeDropMenu:function(){
            console.log("生效时间编辑状态")
            var time = '2018/07/20 ';
            var timeBeginArray = []
            for(var i = 0; i < 24; i++){
                if(i < 10){
                    var tempTime1 = "0" + i + ":00"
                    var tempValue1 = new Date(time + tempTime1).valueOf();
                    var tempTime2 = "0" + i + ":30"
                    var tempValue2 = new Date(time + tempTime2).valueOf();
                    timeBeginArray.push({
                        name: tempTime1,
                        value: tempValue1
                    },{
                        name: tempTime2,
                        value: tempValue2
                    })
                }else if(i >= 10 && i < 23){
                    var tempTime1 = i + ":00"
                    var tempValue1 = new Date(time + tempTime1).valueOf();
                    var tempTime2 = i + ":30"
                    var tempValue2 = new Date(time + tempTime2).valueOf();
                    timeBeginArray.push({
                        name: tempTime1,
                        value: tempValue1
                    },{
                        name: tempTime2,
                        value: tempValue2
                    })
                }else if(i === 23){
                    var tempTime1 = i + ":59"
                    var tempValue1 = new Date(time + tempTime1).valueOf();
                    var tempTime2 = i + ":30"
                    var tempValue2 = new Date(time + tempTime2).valueOf();
                    timeBeginArray.push({
                        name: "23:00",
                        value: new Date(time + "23:00").valueOf()
                    },{
                        name: tempTime2,
                        value: tempValue2
                    },{
                        name: tempTime1,
                        value: tempValue1
                    })
                }
            }
            console.log(timeBeginArray)
            var timeEndArray = [];
            _.each(timeBeginArray, function(item){
                timeEndArray.push(_.clone(item))
            });
            Utility.initDropMenu(this.$el.find(".dropdown-effecttime-begin"), timeBeginArray, function(value) {
                this.effectTimeBegin = parseInt(value);    
            }.bind(this));
            Utility.initDropMenu(this.$el.find(".dropdown-effecttime-end"), timeEndArray, function(value) {
                this.effectTimeEnd = parseInt(value);   
            }.bind(this));
            if(this.isEdit){
                console.log("此时处于编辑状态", this.defaultParam.vipSetup.effectTime[0], this.defaultParam.vipSetup.effectTime[1])
                var defaultBeginValue = _.find(timeBeginArray, function(obj){
                    return obj.value === this.defaultParam.vipSetup.effectTime[0]
                }.bind(this))
                var defaultEndValue = _.find(timeEndArray, function(obj){
                    return obj.value === this.defaultParam.vipSetup.effectTime[1]
                }.bind(this))
                console.log(defaultBeginValue, defaultEndValue)
                if(defaultBeginValue && defaultEndValue){
                    this.$el.find(".dropdown-effecttime-begin .cur-value").html(defaultBeginValue.name);
                    this.$el.find(".dropdown-effecttime-end .cur-value").html(defaultEndValue.name)
                    this.effectTimeBegin = defaultBeginValue.value;
                    this.effectTimeEnd = defaultEndValue.value;
                }else{
                    this.$el.find(".dropdown-effecttime-begin .cur-value").html(timeBeginArray[0].name);
                    this.$el.find(".dropdown-effecttime-end .cur-value").html(timeEndArray[0].name);
                    this.effectTimeBegin = timeBeginArray[0].value;
                    this.effectTimeEnd = timeEndArray[0].value;
                }
            }else{
                this.$el.find(".dropdown-effecttime-begin .cur-value").html(timeBeginArray[0].name);
                this.$el.find(".dropdown-effecttime-end .cur-value").html(timeEndArray[0].name);
                this.effectTimeBegin = timeBeginArray[0].value;
                this.effectTimeEnd = timeEndArray[0].value;
                console.log("ttttt", this.effectTimeBegin)
            }
                
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

        onClickSaveButton:function(){
            // 数据前端校验环节
            this.defaultParam.defSetup.workModeDef = this.$el.find("input[name='options-workmode']:checked").val();
            this.defaultParam.defSetup.effectRadioDef = this.$el.find("#effect-ratio").val();
            var numberTestDef = parseInt(this.defaultParam.defSetup.effectRadioDef)
            if(numberTestDef <= 0 || numberTestDef > 100 || Number.isNaN(numberTestDef)){
                alert("请选择合理的生效比例");
                return false;
            }
            console.log(this.vipId)
            var postParam = {
                "originId": this.domainInfo.id,
                "originXtcpDto": {
                    "defConf": {
                        "id": this.defId,
                        "originId": null,
                        "model": this.defaultParam.defSetup.workModeDef,
                        "ratio": this.defaultParam.defSetup.effectRadioDef,
                        "advFlag": 0,
                    },
                    "advConfList": [{
                        "id": this.vipId
                    }]
                }
            };

            if(this.advFlag){
                this.defaultParam.vipSetup.workModeVip = this.$el.find("input[name='options-workmode-vip']:checked").val()
                this.defaultParam.vipSetup.effectRadioVip = this.$el.find("#effect-ratio-vip").val();
                console.log("oooo", this.effectTimeBegin, this.effectTimeEnd)
                var numberTestVip = parseInt(this.defaultParam.vipSetup.effectRadioVip)
                this.defaultParam.vipSetup.effectTime = [this.effectTimeBegin, this.effectTimeEnd]
                if(this.defaultParam.vipSetup.effectTime[0] >= this.defaultParam.vipSetup.effectTime[1]){
                    alert("请选择合理的生效时间");
                    return false;
                }
                if(numberTestVip <= 0 || numberTestVip > 100 || Number.isNaN(numberTestVip)){
                    alert("请选择合理的生效比例");
                    return false;
                }
                if(this.defaultParam.vipSetup.effectWeek.length <= 0){
                    alert("请选择合理的生效周别");
                    return false;
                }
                console.log(this.defaultParam.vipSetup.effectTime)
                postParam.originXtcpDto.defConf.advFlag = this.advFlag;
                postParam.originXtcpDto.advConfList = [{
                    "id": this.vipId,
                    "originId": null,
                    "model": this.defaultParam.vipSetup.workModeVip,
                    "ratio": this.defaultParam.vipSetup.effectRadioVip,
                    "advFlag": null,
                    "workDay": this.defaultParam.vipSetup.effectWeek.join(""),
                    "startTime": this.defaultParam.vipSetup.effectTime[0],
                    "endTime": this.defaultParam.vipSetup.effectTime[1]
                }]
            }
            // 此处将数据整理成后端需要的形式
            console.log("待发送的参数", postParam)
            this.collection.postXtcpSetupInfo(postParam);
            
        },

        onSaveSuccess: function(){
            alert("保存成功！");
            this.collection.getXtcpSetupInfo({
                originId: this.domainInfo.id
            });
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
            this.target = target;
            this.$el.appendTo(target);
        }
    });

    return LuaXtcpSetupView;
});