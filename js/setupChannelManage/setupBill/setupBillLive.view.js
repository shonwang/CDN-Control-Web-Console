define("setupBillLive.view", ['require','exports', 'template', 'modal.view', 'utility', 'setupBill.view'], 
    function(require, exports, template, Modal, Utility, SetupBillView) {

    var SetupBillView = SetupBillView.extend({
        events: {},

        initOriginDetection: function(argument) {
            this.originDetectionInfo = this.config.detectOriginConfig || {};

            var flag = this.config.detectOriginConfig.flag;
            if (flag === 0) this.originDetectionInfo.flagStr = "关闭"
            if (flag === 1) this.originDetectionInfo.flagStr = "开启"

            this.originHostSetupTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.backOriginDetection.html'])({
                data: this.originDetectionInfo
            }));
            this.originHostSetupTable.appendTo(this.$el.find(".bill-ctn"));

            this.initRefererAntiLeech()
        },

        initRefererAntiLeech: function(){
        },

        initTimestamp: function(){
        },

    });

    return SetupBillView;
});