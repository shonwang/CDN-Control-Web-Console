define("liveBasicInformation.view", ['require','exports', 'template', 'modal.view', 'utility', 'basicInformation.view'], 
    function(require, exports, template, Modal, Utility, BasicInformationView) {

    var LiveBasicInformationView = BasicInformationView.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/basicInformation/basicInformation.html'])());
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
            
            this.collection.off("modify.DomainBasic.success");
            this.collection.off("modify.DomainBasic.error");
            this.collection.on("modify.DomainBasic.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("modify.DomainBasic.error", $.proxy(this.onGetError, this));

            require(["domainSetup.model"], function(DomainSetupModel){
                var myDomainSetupModel = new DomainSetupModel();
                    myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
                    myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                    myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
            }.bind(this))

            this.$el.find(".Remarks-type").show();
        },
    });

    return LiveBasicInformationView;
});