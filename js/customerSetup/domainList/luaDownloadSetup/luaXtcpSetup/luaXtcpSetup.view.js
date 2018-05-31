define("luaXtcpSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LuaXtcpSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            console.log("This is a second test!")
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/xtcpSetup/xtcpSetup.html'])());
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
            this.$el.find(".advanceSetup-toggle .togglebutton input").on("click", $.proxy(this.onClickIsAdvanceSetupBtn,this));

            this.initEffectTimeDropMenu();

            this.collection.on("get.xtcp.success", $.proxy(this.initSetup, this));
            this.collection.on("get.xtcp.error", $.proxy(this.onGetError, this));
            this.collection.on("set.xtcp.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.xtcp.error", $.proxy(this.onGetError, this));
            // this.colleciton.getXtcpSetupInfo();
           
            this.defaultParam = {

            };
        },

        initSetup:function(data){
            var _data = data;
            

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
            }.bind(this));
            Utility.initDropMenu(this.$el.find(".dropdown-effecttime-end"), timeEndArray, function(value) {
                this.effectTimeEnd = parseInt(value);
            }.bind(this));
            // if(this.isEdit){
            //     var defaultValue = _.find(liveLevelArray, function(object) {
            //         return object.value === this.model.attributes.liveLevel
            //     }.bind(this));
            //     if (defaultValue) {
            //         this.$el.find(".dropdown-liveLevel .cur-value").html(defaultValue.name)
            //         this.liveLevel = defaultValue.value;
            //     } else {
            //         this.$el.find(".dropdown-liveLevel .cur-value").html(liveLevelArray[0].name);
            //         this.liveLevel = liveLevelArray[0].value;
            //     }
            // }else{
            //     this.$el.find(".dropdown-liveLevel .cur-value").html(liveLevelArray[0].name);
            //     this.liveLevel = liveLevelArray[0].value;
            // }
        },

        onClickSaveButton:function(){

            var postParam = {
                "originId": this.domainInfo.id,
                "userId": this.clientInfo.uid,
                
            }

            // this.collection.postXtcpSetupInfo(postParam);
            // Utility.onContentSave();
        },

        onSaveSuccess: function(){
            alert("保存成功！")
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