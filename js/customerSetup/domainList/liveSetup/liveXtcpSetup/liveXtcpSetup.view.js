define("liveXtcpSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveXtcpSetupView = Backbone.View.extend({
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
            this.$el.find(".publish").hide();
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveButton, this));
            this.$el.find(".main-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.off("get.xtcp.success");
            this.collection.off("get.xtcp.error");
            this.collection.off("set.xtcp.success");
            this.collection.off("set.xtcp.success");
            this.collection.on("get.xtcp.success", $.proxy(this.onGetXtcpSuccess, this));
            this.collection.on("get.xtcp.error", $.proxy(this.onGetError, this));
            this.collection.on("set.xtcp.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.xtcp.error", $.proxy(this.onGetError, this));
            // this.colleciton.getXtcpSetupInfo({originId: this.domainInfo.id});
            
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
                    "effectWeek": ["Sun","Mon","Tue","Wes","Thu","Fri","Sat"],
                    "effectTime": [0,24],
                    "workModeVip": 1,     //高级配置工作模式
                    "effectRadioVip": 100   //高级配置生效比例
                } 
            }    

            //初始化配置是暂时的过渡，等后端接口开通应该省去初始化的配置    
            this.initSetup()
            this.$el.find(".advanceSetup-toggle .togglebutton input").on("click", $.proxy(this.onClickIsAdvanceSetupBtn,this));
        },

        onGetXtcpSuccess: function(data){
            // 对传过来的数据做一些处理
            var _data = data
            if(_data){
                this.isEdit === true
            }
            this.defaultParam = _data
            this.liveXtcpTemp = $(_.template(template['tpl/customerSetup/domainList/xtcpSetup/xtcpSetup.html'])({
                data:this.defaultParam
            }));
            this.$el.find(".main-ctn").html(this.liveXtcpTemp.get(0))
            this.$el.find("input[name=options-effectWeek]").on("click", $.proxy(this.onClickCheckedWeek, this));
            this.initEffectTimeDropMenu();
        },

        initSetup:function(){

            if(true){
                this.isEdit = true
                this.defaultParam = {
                    userInfo:{
                        "originId": this.domainInfo.id,
                        "userId": this.clientInfo.uid
                    },
                    defSetup:{
                        "workModeDef": 2,      //默认配置工作模式
                        "effectRadioDef": 50,  //默认配置生效比例
                    },
                    vipSetup:{
                        "effectWeek": ["Sun","Mon","Wes","Fri","Sat"],
                        "effectTime": [8,18],
                        "workModeVip": 3,     //高级配置工作模式
                        "effectRadioVip": 90   //高级配置生效比例
                    } 
                };    
            }else{
                
            }

            this.liveXtcpTemp = $(_.template(template['tpl/customerSetup/domainList/xtcpSetup/xtcpSetup.html'])({
                data:this.defaultParam
            }));
            
            this.$el.find(".main-ctn").html(this.liveXtcpTemp.get(0))
            this.$el.find("input[name=options-effectWeek]").on("click", $.proxy(this.onClickCheckedWeek, this));
            this.initEffectTimeDropMenu();
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
                this.$el.find(".advanceSetup").show();
            } else {
                this.$el.find(".advanceSetup").hide();
            }
        },

        initEffectTimeDropMenu:function(){
            var timeBeginArray = [{
                    name:"00:00",
                    value:0
                },{
                    name:"01:00",
                    value:1
                },{
                    name:"02:00",
                    value:2
                },{
                    name:"03:00",
                    value:3
                },{
                    name:"04:00",
                    value:4
                },{
                    name:"05:00",
                    value:5
                },{
                    name:"06:00",
                    value:6
                },{
                    name:"07:00",
                    value:7
                },{
                    name:"08:00",
                    value:8
                },{
                    name:"09:00",
                    value:9
                },{
                    name:"10:00",
                    value:10
                },{
                    name:"11:00",
                    value:11
                },{
                    name:"12:00",
                    value:12
                },{
                    name:"13:00",
                    value:13
                },{
                    name:"14:00",
                    value:14
                },{
                    name:"15:00",
                    value:15
                },{
                    name:"16:00",
                    value:16
                },{
                    name:"17:00",
                    value:17
                },{
                    name:"18:00",
                    value:18
                },{
                    name:"19:00",
                    value:19
                },{
                    name:"20:00",
                    value:20
                },{
                    name:"21:00",
                    value:21
                },{
                    name:"22:00",
                    value:22
                },{
                    name:"23:00",
                    value:23
                },{
                    name:"23:59",
                    value:24
                }];
            var timeEndArray = [];
            _.each(timeBeginArray, function(item){
                timeEndArray.push(_.clone(item))
            });
            Utility.initDropMenu(this.$el.find(".dropdown-effecttime-begin"), timeBeginArray, function(value) {
                this.effectTimeBegin = parseInt(value);
                this.defaultParam.vipSetup.effectTime[0] = this.effectTimeBegin;
            }.bind(this));
            Utility.initDropMenu(this.$el.find(".dropdown-effecttime-end"), timeEndArray, function(value) {
                this.effectTimeEnd = parseInt(value);
                this.defaultParam.vipSetup.effectTime[1] = this.effectTimeEnd;
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
            }
            //将生效时间传递给this.defaultParam.vipSetup.effectTime
        },

        onClickSaveButton:function(){
            // 数据前端校验环节
            if(this.defaultParam.defSetup.effectRadioDef <= 0){
                alert("请选择合理的生效比例");
                return false;
            }
            if(this.defaultParam.vipSetup.effectWeek.length <= 0){
                alert("请选择合理的生效周别");
                return false;
            }
            if(this.defaultParam.vipSetup.effectTime[0] >= this.defaultParam.vipSetup.effectTime[1]){
                alert("请选择合理的生效时间");
                return false;
            }
            if(this.defaultParam.vipSetup.effectRadioVip <= 0){
                alert("请选择合理的生效比例");
                return false;
            }
            // 此处将数据整理成后端需要的形式
            // this.collection.postXtcpSetupInfo(this.defaultParam);
            console.log("待发送的参数", this.defaultParam)

            
        },

        onSaveSuccess: function(){
            alert("保存成功！")
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.warning(error.message)
            else
                Utility.warning("网络阻塞，请刷新重试！")
        },

        hide: function(){
            this.$el.hide();
        },

        render: function(target){
            this.target = target;
            this.$el.appendTo(target);
        }
    });

    return LiveXtcpSetupView;
});