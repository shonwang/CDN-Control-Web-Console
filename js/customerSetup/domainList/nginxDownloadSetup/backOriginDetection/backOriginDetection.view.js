define("backOriginDetection.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var BackOriginDetectionView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/backOriginDetection/backOriginDetection.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2);
                this.userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: this.userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));
            
            
            this.collection.off("get.DetectInfo.success");
            this.collection.off("get.DetectInfo.error");
            this.collection.on("get.DetectInfo.success", $.proxy(this.getDetecInfoSuccess, this));
            this.collection.on("get.DetectInfo.error", $.proxy(this.onGetError, this));

            this.collection.getDetectInfo(this.domainInfo.id);

            this.collection.off("add.DetectInfo.success");
            this.collection.off("add.DetectInfo.error");
            this.collection.on("add.DetectInfo.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("add.DetectInfo.error", $.proxy(this.onGetError, this));

            this.$el.find(".setup .backOriginSetupType").bootstrapSwitch('state',true);
        },

        getDetecInfoSuccess: function(data){
            var originId = "";
            if (this.domainInfo) originId = this.domainInfo.id;

            this.defaultParam = {
               originId: originId,
               flag:1,
               detectMethod:'HEAD',
               expectedResponse:"2xx,3xx,4xx",
               detectUrl:"",
               host:"",
               frequency:60

            }
            if(data.flag !== null && data.flag !== undefined){
                this.defaultParam.flag = data.flag;
            }
            if(data.detectMethod && data.detectMethod !== null && data.detectMethod !== undefined){
                this.defaultParam.detectMethod = data.detectMethod;
            }
            if(data.detectUrl && data.detectUrl !== null && data.detectUrl !== undefined){
                this.defaultParam.detectUrl = data.detectUrl;
            }
            if(data.host && data.host !== null && data.host !== undefined){
                this.defaultParam.host = data.host;
            }
            if(data.frequency && data.frequency !== null && data.frequency !== undefined){
                this.defaultParam.frequency = parseInt(data.frequency);
            }
            
            this.initOriginSetup();
            
            this.$el.find(".setup .backOriginDetectiontype").on("switchChange.bootstrapSwitch", $.proxy(this.onClickIsUseDetectionBtn, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
        },
        
        initOriginSetup: function(){
            
            var backOriginSetupType = this.$el.find('.setup .backOriginSetupType');
            var requestWay = this.$el.find('.way #requestWay');
            var detectionFile = this.$el.find(".way #detectionFile");
            var setupHost = this.$el.find(".host #setupHost");
            var responseState =  this.$el.find(".state #responseState");
            var detectionFrequency = this.$el.find(".frequency #detectionFrequency");
            
            if (this.defaultParam.flag === 1){
                backOriginSetupType.bootstrapSwitch('state',true);
            } else if (this.defaultParam.flag === 0) {
                backOriginSetupType.bootstrapSwitch('state',false);
                detectionFile.attr('readonly','readonly');
                setupHost.attr('readonly','readonly');
            }

            detectionFile.val(this.defaultParam.detectUrl);
            setupHost.val(this.defaultParam.host);
            responseState.val(this.defaultParam.expectedResponse);
            detectionFrequency.val(this.defaultParam.frequency);
            
            //requestWay.attr('disabled','disabled');
            responseState.attr('readonly','readonly');
            detectionFrequency.attr('readonly','readonly');

            this.initOriginTypeDropdown();
        },

        initOriginTypeDropdown: function(){
            var  baseArray = [
                {name: "HEAD", value: "HEAD"},
                {name: "GET", value: "GET"},
                // {name: "POST", value: "POST"}
            ],
            rootNode = this.$el.find(".way .way-type");
            Utility.initDropMenu(rootNode, baseArray, function(value){
                this.defaultParam.detectMethod = value;
            }.bind(this));

            var defaultValue = _.find(baseArray, function(object){
                return object.value === this.defaultParam.detectMethod;
            }.bind(this));

            if (defaultValue)
                this.$el.find(".way #requestWay .cur-value").html(defaultValue.name);
            else
                this.$el.find(".way #requestWay .cur-value").html(baseArray[0].name);
        },
        onClickIsUseDetectionBtn: function(event,state){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if(state == false){
                this.$el.find(".way #detectionFile").attr('readonly','readonly');
                this.$el.find(".host #setupHost").attr('readonly','readonly');
            }else{
                this.$el.find(".way #detectionFile").removeAttr('readonly');
                this.$el.find(".host #setupHost").removeAttr('readonly');
            }
            this.defaultParam.flag = (state == true) ? 1:0;
        },

        onClickSaveBtn: function(){
            var reg = /^\//g,
                detectionFile = this.$el.find(".way #detectionFile").val().trim();
            if(reg.test(detectionFile) == false || detectionFile === "/"){
                alert('探测文件需以"/"开头, 但是不能只输入“/”');
                return;
            }
            if(this.$el.find(".host #setupHost").val() == ""){
                alert('请求HOST头不能为空');
                return;
            }
            
            var detectionFile = this.$el.find(".way #detectionFile");
            var setupHost = this.$el.find(".host #setupHost");
            var responseState =  this.$el.find(".state #responseState");
            var detectionFrequency = this.$el.find(".frequency #detectionFrequency");
            
            this.defaultParam.host = setupHost.val();
            this.defaultParam.detectUrl = detectionFile.val();
            this.defaultParam.expectedResponse = responseState.val();
            this.defaultParam.frequency = parseInt(detectionFrequency.val());
            
            this.collection.addDetectInfo(this.defaultParam);
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
                        this.update(this.options.query, this.options.query2, this.target);
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
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
            this.target = target
        }
    });

    return BackOriginDetectionView;
});