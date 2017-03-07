define("liveHttpFlvOptimize.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveHttpFlvOptimizeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveHttpFlvOptimize/liveHttpFlvOptimize.html'])());
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

            this.defaultParam = {
                keepAliveFlag: 0, //0:关闭 1:开启
                keepAliveTime: 0,
                avHeaderWaitTime: 5,
                avHeaderFlag: 0,
                hdlAvhZeroTimestamp: 0,
                hdlTimestampZeroStart: 0,
                hdlGopZeroTimestamp: 0,
                hdlGopSendAudio: 1,
                rtmpAvhZeroTimestamp: 0,
                rtmpTimestampZeroStart: 0,
                rtmpGopZeroTimestamp: 0,
                rtmpGopSendAudio: 1,
            }

            this.$el.find(".keepduration").hide();
            this.$el.find(".keeptoggle .togglebutton input").on("click", $.proxy(this.onClicKeepToggle, this));
            this.$el.find(".avheadergroup").hide();
            this.$el.find(".avheader .togglebutton input").on("click", $.proxy(this.onClicAvheaderToggle, this));
            this.$el.find(".save-common").on("click", $.proxy(this.onClickSaveCommon, this));
            this.$el.find(".httpflv-optimize-setup .save").on("click", $.proxy(this.onClickSaveHdl, this));
            this.$el.find(".rtmp-optimize-setup .save").on("click", $.proxy(this.onClickSaveRtmp, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.on("set.pkConfig.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.pkConfig.error", $.proxy(this.onGetError, this));
            this.collection.on("get.pkConfig.success", $.proxy(this.onGetDomainInfo, this));
            this.collection.on("get.pkConfig.error", $.proxy(this.onGetError, this));
            this.collection.getPKConf({originId:this.domainInfo.id});
        },

        onGetDomainInfo: function(data){
            //TODO 假数据
            // var data = {
            //     "appLives":[
            //         {
            //             "pkConf":{
            //                 "hdlAvhZeroTimestamp": 1,
            //                 "hdlTimestampZeroStart": 1,
            //                 "hdlGopZeroTimestamp": 1,
            //                 "hdlGopSendAudio": 0,
            //                 "rtmpAvhZeroTimestamp": 1,
            //                 "rtmpTimestampZeroStart": 1,
            //                 "rtmpGopZeroTimestamp": 1,
            //                 "rtmpGopSendAudio": 0,
            //                 "avHeaderFlag": 1,
            //                 "avHeaderWaitTime": 1,
            //                 "keepAliveFlag": 1,
            //                 "keepAliveTime": 1,
            //             }
            //         }
            //     ]
            // };

            data = data.appLives[0]

            if (data.pkConf && data.pkConf.keepAliveFlag !== null && data.pkConf.keepAliveFlag !== undefined)
                this.defaultParam.keepAliveFlag = data.pkConf.keepAliveFlag //0:关闭 1:开启
            if (data.pkConf && data.pkConf.keepAliveTime !== null && data.pkConf.keepAliveTime !== undefined)
                this.defaultParam.keepAliveTime = data.pkConf.keepAliveTime
            if (data.pkConf && data.pkConf.avHeaderFlag !== null && data.pkConf.avHeaderFlag !== undefined)
                this.defaultParam.avHeaderFlag = data.pkConf.avHeaderFlag //0:关闭 1:开启
            if (data.pkConf && data.pkConf.avHeaderWaitTime !== null && data.pkConf.avHeaderWaitTime !== undefined)
                this.defaultParam.avHeaderWaitTime = data.pkConf.avHeaderWaitTime 

            if (data.pkConf && data.pkConf.hdlAvhZeroTimestamp !== null && data.pkConf.hdlAvhZeroTimestamp !== undefined)
                this.defaultParam.hdlAvhZeroTimestamp = data.pkConf.hdlAvhZeroTimestamp
            if (data.pkConf && data.pkConf.hdlTimestampZeroStart !== null && data.pkConf.hdlTimestampZeroStart !== undefined)
                this.defaultParam.hdlTimestampZeroStart = data.pkConf.hdlTimestampZeroStart
            if (data.pkConf && data.pkConf.hdlGopSendAudio !== null && data.pkConf.hdlGopSendAudio !== undefined)
                this.defaultParam.hdlGopSendAudio = data.pkConf.hdlGopSendAudio 
            if (data.pkConf && data.pkConf.hdlGopZeroTimestamp !== null && data.pkConf.hdlGopZeroTimestamp !== undefined)
                this.defaultParam.hdlGopZeroTimestamp = data.pkConf.hdlGopZeroTimestamp

            if (data.pkConf && data.pkConf.rtmpAvhZeroTimestamp !== null && data.pkConf.rtmpAvhZeroTimestamp !== undefined)
                this.defaultParam.rtmpAvhZeroTimestamp = data.pkConf.rtmpAvhZeroTimestamp
            if (data.pkConf && data.pkConf.rtmpGopZeroTimestamp !== null && data.pkConf.rtmpGopZeroTimestamp !== undefined)
                this.defaultParam.rtmpGopZeroTimestamp = data.pkConf.rtmpGopZeroTimestamp   
            if (data.pkConf && data.pkConf.rtmpTimestampZeroStart !== null && data.pkConf.rtmpTimestampZeroStart !== undefined)
                this.defaultParam.rtmpTimestampZeroStart = data.pkConf.rtmpTimestampZeroStart   
            if (data.pkConf && data.pkConf.rtmpGopSendAudio !== null && data.pkConf.rtmpGopSendAudio !== undefined)
                this.defaultParam.rtmpGopSendAudio = data.pkConf.rtmpGopSendAudio                           

            this.initSetup();
        },

        initSetup: function(){
            if (this.defaultParam.keepAliveFlag === 0){
                this.$el.find(".keeptoggle .togglebutton input").get(0).checked = false;
                this.$el.find(".keepduration").hide();
            } else {
                this.$el.find(".keeptoggle .togglebutton input").get(0).checked = true;
                this.$el.find(".keepduration").show();
            }
            this.$el.find("#keepduration").val(this.defaultParam.keepAliveTime);

            if (this.defaultParam.avHeaderFlag === 0){
                this.$el.find(".avheader .togglebutton input").get(0).checked = false;
                this.$el.find(".avheadergroup").hide();
            } else {
                this.$el.find(".avheader .togglebutton input").get(0).checked = true;
                this.$el.find(".avheadergroup").show();
            }
            this.$el.find("#waitduration").val(this.defaultParam.avHeaderWaitTime);
            this.initTimeUnitDropDown();

            this.$el.find(".httpflv-optimize-setup .timestamp .togglebutton input").get(0).checked = this.defaultParam.hdlAvhZeroTimestamp === 0 ? false : true
            this.$el.find(".httpflv-optimize-setup .timestampincrease .togglebutton input").get(0).checked = this.defaultParam.hdlTimestampZeroStart === 0 ? false : true
            this.$el.find(".httpflv-optimize-setup .goptimestamp .togglebutton input").get(0).checked = this.defaultParam.hdlGopSendAudio === 0 ? false : true
            this.$el.find(".httpflv-optimize-setup .goptimestampzero .togglebutton input").get(0).checked = this.defaultParam.hdlGopZeroTimestamp === 0 ? false : true

            this.$el.find(".rtmp-optimize-setup .timestamp .togglebutton input").get(0).checked = this.defaultParam.rtmpAvhZeroTimestamp === 0 ? false : true
            this.$el.find(".rtmp-optimize-setup .goptimestampzero .togglebutton input").get(0).checked = this.defaultParam.rtmpGopZeroTimestamp === 0 ? false : true
            this.$el.find(".rtmp-optimize-setup .timestampincrease .togglebutton input").get(0).checked = this.defaultParam.rtmpTimestampZeroStart === 0 ? false : true
            this.$el.find(".rtmp-optimize-setup .goptimestamp .togglebutton input").get(0).checked = this.defaultParam.rtmpGopSendAudio === 0 ? false : true
        },

        initTimeUnitDropDown: function(){
            var  timeArray = [
                {"value": 1, "name": "秒"},
                {"value": 60, "name": "分"}
            ];

            var input = this.defaultParam.keepAliveTime,
                rootNode = this.$el.find(".time-unit");
                curEl = this.$el.find("#dropdown-time-unit .cur-value"),
                curInputEl = this.$el.find("#keepduration");

            Utility.initDropMenu(rootNode, timeArray, function(value){
                this.defaultParam.keepAliveTime = parseInt(curInputEl.val()) * parseInt(value);
            }.bind(this));

            curEl.html("秒");
            curInputEl.val(input);

            curInputEl.on("click", function(){curInputEl.focus()}.bind(this))
            curInputEl.on("blur", function(){
                var unit = _.find(timeArray, function(obj){
                    return obj.name === curEl.html();
                }.bind(this));
                this.defaultParam.keepAliveTime = unit.value * parseInt(curInputEl.val());
            }.bind(this))

            curEl.html("秒");
            curInputEl.val(input);
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

        onClickSaveCommon: function(){
            if (this.defaultParam.keepAliveTime < 0 || this.defaultParam.keepAliveTime > 1440 * 60){
                alert("保持连接时长最小值为0秒，最大值为1440分钟");
                return;
            }
            this.defaultParam.avHeaderWaitTime = parseInt(this.$el.find("#waitduration").val());
            if (this.defaultParam.avHeaderWaitTime < 1 || this.defaultParam.avHeaderWaitTime > 30){
                alert("等待音视频合并头持续的时间最小值为1秒，最大值为30秒");
                return;
            }

            var postParam =  {
                "originId": this.domainInfo.id,
                "avHeaderFlag":this.defaultParam.avHeaderFlag,
                "avHeaderWaitTime":this.defaultParam.avHeaderWaitTime,
                "keepAliveFlag":this.defaultParam.keepAliveFlag,
                "keepAliveTime": this.defaultParam.keepAliveTime
            }
            this.collection.setPKConf(postParam)
        },

        onClickSaveHdl: function(){
            var postParam =  {
                "originId": this.domainInfo.id,
                "hdlAvhZeroTimestamp": this.$el.find(".httpflv-optimize-setup .timestamp .togglebutton input").get(0).checked === true ? 1 : 0,
                "hdlTimestampZeroStart": this.$el.find(".httpflv-optimize-setup .timestampincrease .togglebutton input").get(0).checked === true ? 1 : 0,
                "hdlGopSendAudio": this.$el.find(".httpflv-optimize-setup .goptimestamp .togglebutton input").get(0).checked === true ? 1 : 0,
                "hdlGopZeroTimestamp" : this.$el.find(".httpflv-optimize-setup .goptimestampzero .togglebutton input").get(0).checked === true ? 1 : 0
            }
            this.collection.setPKConf(postParam)
        },

        onClickSaveRtmp: function(){
            var postParam =  {
                "originId": this.domainInfo.id,
                "rtmpAvhZeroTimestamp": this.$el.find(".rtmp-optimize-setup .timestamp .togglebutton input").get(0).checked === true ? 1 : 0,
                "rtmpTimestampZeroStart": this.$el.find(".rtmp-optimize-setup .timestampincrease .togglebutton input").get(0).checked === true ? 1 : 0,
                "rtmpGopSendAudio": this.$el.find(".rtmp-optimize-setup .goptimestamp .togglebutton input").get(0).checked === true ? 1 : 0,
                "rtmpGopZeroTimestamp" : this.$el.find(".rtmp-optimize-setup .goptimestampzero .togglebutton input").get(0).checked === true ? 1 : 0
            }
            this.collection.setPKConf(postParam)
        },

        onClicAvheaderToggle: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.avHeaderFlag = 1;
                this.$el.find(".avheadergroup").show();
            } else {
                this.defaultParam.avHeaderFlag = 0;
                this.$el.find(".avheadergroup").hide();
            }
        },

        onClicKeepToggle: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.keepAliveFlag = 1;
                this.$el.find(".keepduration").show();
            } else {
                this.defaultParam.keepAliveFlag = 0;
                this.$el.find(".keepduration").hide();
            }
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
            this.$el.appendTo(target);
        }
    });

    return LiveHttpFlvOptimizeView;
});