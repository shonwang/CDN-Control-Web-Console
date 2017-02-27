define("liveAudioOnly.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveAudioOnlyView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;

            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveAudioOnly/liveAudioOnly.html'])());
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

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.defaultParam = [{
                    id: Utility.randomStr(8),
                    audioOnlyFlag: 0, //0:关闭 1:开启
                    audioOnlyParam: "audio-only",
                    type: "Http+Flv"
                },{
                    id: Utility.randomStr(8),
                    audioOnlyFlag: 0, //0:关闭 1:开启
                    audioOnlyParam: "audio-only",
                    type: "Rtmp"
                }
            ]

            // this.collection.on("get.drag.success", $.proxy(this.onDragListSuccess, this));
            // this.collection.on("get.drag.error", $.proxy(this.onGetError, this));
            //this.collection.getDragConfList({originId: this.domainInfo.id})

            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
            this.collection.on("set.setLiveConf.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.setLiveConf.error", $.proxy(this.onGetError, this));

            this.onDragListSuccess();
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
            var postParam =  {
                "originId": this.domainInfo.id,
            }
            this.collection.each(function(obj){
                if (obj.get('type') === 'Http+Flv'){
                    postParam.hdlAudioOnlyFlag = obj.get('audioOnlyFlag');
                    postParam.hdlAudioOnlyParam = obj.get('audioOnlyParam');
                } else if (obj.get('type') === 'Rtmp'){
                    postParam.rtmpAudioOnlyFlag = obj.get('audioOnlyFlag');
                    postParam.rtmpAudioOnlyParam = obj.get('audioOnlyParam');
                }
            }.bind(this))

            console.log(postParam)
            //this.collection.setLiveConf(postParam)
        },

        onDragListSuccess: function(){
            //TODO 假数据
            var data = {
                "appLives":[
                    {
                        "optimizeConf":{
                            "hdlAudioOnlyFlag": 1,
                            "hdlAudioOnlyParam": "audio-only1",
                            "rtmpAudioOnlyFlag": 1,
                            "rtmpAudioOnlyParam": "audio-only1",
                        }
                    }
                ]
            };

            data = data.appLives[0];

            _.each(this.defaultParam, function(el, index, ls){
                if (data.optimizeConf) {
                    if (data.optimizeConf.hdlAudioOnlyFlag !== null && 
                        data.optimizeConf.hdlAudioOnlyFlag !== undefined &&
                        el.type === "Http+Flv"){
                        el.audioOnlyFlag = data.optimizeConf.hdlAudioOnlyFlag
                    }
                    if (data.optimizeConf.hdlAudioOnlyParam !== null && 
                        data.optimizeConf.hdlAudioOnlyParam !== undefined &&
                        el.type === "Http+Flv"){
                        el.audioOnlyParam = data.optimizeConf.hdlAudioOnlyParam
                    }
                    if (data.optimizeConf.rtmpAudioOnlyFlag !== null && 
                        data.optimizeConf.rtmpAudioOnlyFlag !== undefined &&
                        el.type === "Rtmp"){
                        el.audioOnlyFlag = data.optimizeConf.rtmpAudioOnlyFlag
                    }
                    if (data.optimizeConf.rtmpAudioOnlyParam !== null && 
                        data.optimizeConf.rtmpAudioOnlyParam !== undefined &&
                        el.type === "Rtmp"){
                        el.audioOnlyParam = data.optimizeConf.rtmpAudioOnlyParam
                    }
                }
                this.collection.push(new this.collection.model(el))
            }.bind(this))
            this.initTable();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/customerSetup/domainList/liveAudioOnly/liveAudioOnly.table.html'])({
                data: this.collection.models
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .param").on("blur", $.proxy(this.onBlurItemParam, this));
            this.table.find("tbody .togglebutton input").on("click", $.proxy(this.onClickItemToggle, this));
        },

        onBlurItemParam: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id);

            model.set("audioOnlyParam", $(eventTarget).val());
        },

        onClickItemToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;

            var id = $(eventTarget).attr("id"),
                model = this.collection.get(id);

            model.set("audioOnlyFlag", eventTarget.checked ? 1 : 0)
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

    return LiveAudioOnlyView;
});