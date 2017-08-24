define("liveBackOriginDetection.view", ['require','exports', 'template', 'modal.view', 'utility', 'backOriginDetection.view'], 
    function(require, exports, template, Modal, Utility, BackOriginDetectionView) {

    var LiveBackOriginDetectionView = BackOriginDetectionView.extend({
        events: {},

        initOriginSetup: function(){
            this.$el.find(".port").hide();
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
            
            requestWay.attr('disabled','disabled');
            responseState.attr('readonly','readonly');
            detectionFrequency.attr('readonly','readonly');

            this.initOriginTypeDropdown();
        },

        initOriginTypeDropdown: function(){
            var  baseArray = [
                {name: "HEAD", value: "HEAD"},
                // {name: "GET", value: "GET"},
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

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: new SaveThenSendModel(),
                    domainInfo: this.domainInfo,
                    isRealLive: true,
                    description: this.$el.find("#Remarks").val(),
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
        }
    });

    return LiveBackOriginDetectionView;
});