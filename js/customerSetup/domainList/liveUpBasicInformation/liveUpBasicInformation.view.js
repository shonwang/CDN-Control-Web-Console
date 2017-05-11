define("liveUpBasicInformation.view", ['require','exports', 'template', 'modal.view', 'utility', 'liveBasicInformation.view'], 
    function(require, exports, template, Modal, Utility, LiveBasicInformationView) {

    var LiveUpBasicInformationView = LiveBasicInformationView.extend({
        events: {},

        // initialize: function(options) {
        //     this.collection = options.collection;
        //     this.options = options;
        //     this.$el = $(_.template(template['tpl/customerSetup/domainList/basicInformation/basicInformation.html'])());
        //     var clientInfo = JSON.parse(options.query), 
        //         domainInfo = JSON.parse(options.query2);
        //         this.userInfo = {
        //             clientName: clientInfo.clientName,
        //             domain: domainInfo.domain,
        //             uid: clientInfo.uid
        //         }
        //     this.domainInfo = domainInfo;
        //     this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
        //         data: this.userInfo,
        //         notShowBtn: true
        //     }));
        //     this.optHeader.appendTo(this.$el.find(".opt-ctn"));
            
        //     this.collection.off("modify.DomainBasic.success");
        //     this.collection.off("modify.DomainBasic.error");
        //     this.collection.on("modify.DomainBasic.success", $.proxy(this.onSaveSuccess, this));
        //     this.collection.on("modify.DomainBasic.error", $.proxy(this.onGetError, this));

        //     require(["domainSetup.model"], function(DomainSetupModel){
        //         var myDomainSetupModel = new DomainSetupModel();
        //             myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
        //             myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
        //             myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
        //     }.bind(this))

        //     this.$el.find(".Remarks-type").show();
        // },

        // launchSendPopup: function(){
        //     require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
        //         var mySaveThenSendView = new SaveThenSendView({
        //             collection: new SaveThenSendModel(),
        //             domainInfo: this.domainInfo,
        //             isRealLive: true,
        //             description: this.$el.find("#Remarks").val(),
        //             onSendSuccess: function() {
        //                 this.sendPopup.$el.modal("hide");
        //                 window.location.hash = '#/domainList/' + this.options.query;
        //             }.bind(this)
        //         });
        //         var options = {
        //             title: "发布",
        //             body : mySaveThenSendView,
        //             backdrop : 'static',
        //             type     : 2,
        //             width: 1000,
        //             onOKCallback:  function(){
        //                 mySaveThenSendView.sendConfig();
        //             }.bind(this),
        //             onHiddenCallback: function(){
        //                 if (this.sendPopup) $("#" + this.sendPopup.modalId).remove();
        //                 this.update(this.options.query, this.options.query2, this.target);
        //             }.bind(this)
        //         }
        //         this.sendPopup = new Modal(options);
        //     }.bind(this))
        // },
    });

    return LiveUpBasicInformationView;
});