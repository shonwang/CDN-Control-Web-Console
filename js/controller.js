define("controller", ['require','exports'], 
    function(require, exports) {

    var Controller = Backbone.Router.extend({

        importAssessCallback: function(){
            require(['importAssess.view', 'importAssess.model'], function(ImportAssessView, ImportAssessModel){
                this.curPage = 'importAssess';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.importAssessModel)
                    this.importAssessModel = new ImportAssessModel();
                if (!this.importAssessView ){
                    var options = {
                        collection: this.importAssessModel
                    };
                    this.importAssessView = new ImportAssessView(options);
                    this.importAssessView.render($('.ksc-content'));
                } else {
                    this.importAssessView.update();
                }
            }.bind(this));
        },

        setupTopoManageCallback: function(){
            require(['setupTopoManage.view', 'setupTopoManage.model'], function(SetupTopoManageView, SetupTopoManageModel){
                this.curPage = 'setupTopoManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.setupTopoManageModel)
                    this.setupTopoManageModel = new SetupTopoManageModel();
                if (!this.setupTopoManageView ){
                    var options = {
                        collection: this.setupTopoManageModel
                    };
                    this.setupTopoManageView = new SetupTopoManageView(options);
                    this.setupTopoManageView.render($('.ksc-content'));
                } else {
                    this.setupTopoManageView.update();
                }
            }.bind(this));
        },

        setupAppManageCallback: function(){
            require(['setupAppManage.view', 'setupAppManage.model'], function(SetupAppManageView, SetupAppManageModel){
                this.curPage = 'setupAppManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.setupAppManageModel)
                    this.setupAppManageModel = new SetupAppManageModel();
                if (!this.setupAppManageView ){
                    var options = {
                        collection: this.setupAppManageModel
                    };
                    this.setupAppManageView = new SetupAppManageView(options);
                    this.setupAppManageView.render($('.ksc-content'));
                } else {
                    this.setupAppManageView.update();
                }
            }.bind(this));
        },

        setupChannelManageCallback: function(){
            if(!AUTH_OBJ.ManageDomain) return;
            require(['setupChannelManage.view', 'setupChannelManage.model'], function(SetupChannelManageView, SetupChannelManageModel){
                this.curPage = 'setupChannelManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.setupChannelManageModel)
                    this.setupChannelManageModel = new SetupChannelManageModel();
                if (!this.setupChannelManageView ){
                    var options = {
                        collection: this.setupChannelManageModel
                    };
                    this.setupChannelManageView = new SetupChannelManageView(options);
                    this.setupChannelManageView.render($('.ksc-content'));
                } else {
                    this.setupChannelManageView.update();
                }
            }.bind(this));
        },

        customMaintenanceCallback: function(){
            require(['customMaintenance.view', 'customMaintenance.model'], function(CustomMaintenanceView, CustomMaintenanceModel){
                this.curPage = 'customMaintenance';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.customMaintenanceModel)
                    this.customMaintenanceModel = new CustomMaintenanceModel();
                if (!this.customMaintenanceView ){
                    var options = {collection: this.customMaintenanceModel};
                    this.customMaintenanceView = new CustomMaintenanceView(options);
                    this.customMaintenanceView.render($('.ksc-content'));
                } else {
                    this.customMaintenanceView.update();
                }
            }.bind(this));
        },

        refreshManualCallback: function(){
            require(['refreshManual.view', 'refreshManual.model'], function(RefreshManualView, RefreshManualModel){
                this.curPage = 'refreshManual';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.refreshManualModel)
                    this.refreshManualModel = new RefreshManualModel();
                if (!this.refreshManualView ){
                    var options = {collection: this.refreshManualModel};
                    this.refreshManualView = new RefreshManualView(options);
                    this.refreshManualView.render($('.ksc-content'));
                } else {
                    this.refreshManualView.update();
                }
            }.bind(this));
        },

        businessManageCallback: function(){
            if (!AUTH_OBJ.ManageNodeGroups) return;
            require(['businessManage.view', 'businessManage.model', 'nodeManage.model'], function(BusinessManageView, BusinessManageModel, NodeManageModel){
                this.curPage = 'businessManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.businessManageModel)
                    this.businessManageModel = new BusinessManageModel();
                if (!this.nodeManageModel)
                    this.nodeManageModel = new NodeManageModel();
                if (!this.businessManageView ){
                    var options = {
                        collection: this.businessManageModel,
                        nodeCollection: this.nodeManageModel
                    };
                    this.businessManageView = new BusinessManageView(options);
                    this.businessManageView.render($('.ksc-content'));
                } else {
                    this.businessManageView.update();
                }
            }.bind(this));
        },

        ipManageCallback: function(){
            if (!AUTH_OBJ.ManageIPs) return;
            require(['ipManage.view', 'ipManage.model', 'deviceManage.model'], function(IPManageView, IPManageModel, DeviceManageModel){
                this.curPage = 'ipManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.ipManageModel)
                    this.ipManageModel = new IPManageModel();
                if (!this.deviceManageModel)
                    this.deviceManageModel = new DeviceManageModel();
                if (!this.ipManageView ){
                    var options = {
                        collection: this.ipManageModel,
                        deviceCollection: this.deviceManageModel
                    };
                    this.ipManageView = new IPManageView(options);
                    this.ipManageView.render($('.ksc-content'));
                }
            }.bind(this));
        },

        liveCurentSetupCallback: function(){
            if (!AUTH_OBJ.CurrentConfigurations) return;
            require(['liveCurentSetup.view', 'liveCurentSetup.model'], function(LiveCurentSetupView, LiveCurentSetupModel){
                this.curPage = 'liveCurentSetup';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.liveCurentSetupModel)
                    this.liveCurentSetupModel = new LiveCurentSetupModel();
                if (!this.liveCurentSetupView ){
                    var options = {collection: this.liveCurentSetupModel};
                    this.liveCurentSetupView = new LiveCurentSetupView(options);
                    this.liveCurentSetupView.render($('.ksc-content'));
                } else {
                    this.liveCurentSetupView.update();
                }
            }.bind(this));
        },

        liveAllSetupCallback: function(){
            if (!AUTH_OBJ.ManageConfigs) return;
            require(['liveAllSetup.view', 'liveAllSetup.model'], function(LiveAllSetupView, LiveAllSetupModel){
                this.curPage = 'liveAllSetup';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.liveAllSetupModel)
                    this.liveAllSetupModel = new LiveAllSetupModel();
                if (!this.liveAllSetupView ){
                    var options = {collection: this.liveAllSetupModel};
                    this.liveAllSetupView = new LiveAllSetupView(options);
                    this.liveAllSetupView.render($('.ksc-content'));
                } else {
                    this.liveAllSetupView.update();
                }
            }.bind(this));
        },

        coverManageCallback: function() {
            if (!AUTH_OBJ.ManageCoverrelateds) return;
            require(['coverManage.view', 'coverManage.model', 'nodeManage.model'], function(CoverManageView, CoverManageModel, NodeManageModel){
                this.curPage = 'coverManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.coverManageModel)
                    this.coverManageModel = new CoverManageModel();
                if (!this.nodeManageModel)
                    this.nodeManageModel = new NodeManageModel();
                if (!this.coverManageView ){
                    var options = {
                        collection: this.coverManageModel,
                        nodeCollection: this.nodeManageModel
                    };
                    this.coverManageView = new CoverManageView(options);
                    this.coverManageView.render($('.ksc-content'));
                } else {
                    this.coverManageView.update();
                }
            }.bind(this));
        },

        coverRegionCallback: function() {
            if (!AUTH_OBJ.Coverrelateds) return;
            require(['coverRegion.view', 'coverRegion.model'], function(CoverRegionView, CoverRegionModel){
                    this.curPage = 'coverRegion';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.coverRegionModel)
                        this.coverRegionModel = new CoverRegionModel();
                    if (!this.coverRegionView ){
                        var options = {collection: this.coverRegionModel};
                        this.coverRegionView = new CoverRegionView(options);
                        this.coverRegionView.render($('.ksc-content'));
                    } else {
                        this.coverRegionView.update();
                    }
                }.bind(this));
        },

        dispConfigCallback: function() {
            if (!AUTH_OBJ.GslbConfig) return;
            require(['dispConfig.view', 'dispConfig.model', 'dispGroup.model'], function(DispConfigView, DispConfigModel, DispGroupModel){
                this.curPage = 'dispConfig';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.dispConfigModel)
                    this.dispConfigModel = new DispConfigModel();
                if (!this.diffConfigModel)
                    this.diffConfigModel = new DispConfigModel();
                if (!this.dispGroupModel)
                    this.dispGroupModel = new DispGroupModel();
                if (!this.dispConfigView ){
                    var options = {
                        collection: this.dispConfigModel,
                        diffCollection: this.diffConfigModel,
                        dispGroupCollection: this.dispGroupModel
                    };
                    this.dispConfigView = new DispConfigView(options);
                    this.dispConfigView.render($('.ksc-content'));
                } else {
                    this.dispConfigView.update();
                }
            }.bind(this));
        },

        dispGroupCallback: function() {
            if (!AUTH_OBJ.ManageGslbGroups) return;
            require(['dispGroup.view', 'dispGroup.model'], function(DispGroupView, DispGroupModel){
                this.curPage = 'dispGroup';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.dispGroupModel)
                    this.dispGroupModel = new DispGroupModel();
                if (!this.dispGroupView ){
                    var options = {collection: this.dispGroupModel};
                    this.dispGroupView = new DispGroupView(options);
                    this.dispGroupView.render($('.ksc-content'));
                } else {
                    this.dispGroupView.update();
                }
            }.bind(this));
        },

        nodeManageCallback: function() {
            if (!AUTH_OBJ.ManageNodes) return;
            require(['nodeManage.view', 'nodeManage.model'], function(NodeManageView, NodeManageModel){
                this.curPage = 'nodeManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.nodeManageModel)
                    this.nodeManageModel = new NodeManageModel();
                if (!this.nodeManageView ){
                    var options = {collection: this.nodeManageModel};
                    this.nodeManageView = new NodeManageView(options);
                    this.nodeManageView.render($('.ksc-content'));
                } else {
                    this.nodeManageView.update();
                }
            }.bind(this));
        },

        deviceManageCallback: function(query) {
            if (!AUTH_OBJ.ManageHosts) return;
            require(['deviceManage.view', 'deviceManage.model'], function(DeviceManageView, DeviceManageModel){
                this.curPage = 'deviceManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.deviceManageModel)
                    this.deviceManageModel = new DeviceManageModel();
                if (!this.deviceManageView ){
                    var options = {
                        collection: this.deviceManageModel,
                        query     : query
                    };
                    this.deviceManageView = new DeviceManageView(options);
                    this.deviceManageView.render($('.ksc-content'));
                } else {
                    this.deviceManageView.update(query);
                }
            }.bind(this));
        },

        channelManageCallback: function(){
            if (!AUTH_OBJ.ManageChannels) return;
            require(['channelManage.view', 'channelManage.model'], function(ChannelManageView, ChannelManageModel){
                this.curPage = 'channelManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.channelManageModel)
                    this.channelManageModel = new ChannelManageModel();
                if (!this.channelManageView){
                    var options = {collection: this.channelManageModel};
                    this.channelManageView = new ChannelManageView(options);
                    this.channelManageView.render($('.ksc-content'));
                } else {
                    this.channelManageView.update();
                }
            }.bind(this));
        },

        clientStatisticsCallback: function(){
            if (!AUTH_OBJ.KACustomersBandwidthStatistics) return;
            require(['clientStatistics.view', 'clientStatistics.model'], function(ClientStatisticsView, ClientStatisticsModel){
                this.curPage = 'clientStatistics';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.downloadClientStatisticsModel)
                    this.downloadClientStatisticsModel = new ClientStatisticsModel();
                if (!this.liveClientStatisticsModel)
                    this.liveClientStatisticsModel = new ClientStatisticsModel();
                if (!this.clientStatisticsView){
                    var options = {
                        collection: this.downloadClientStatisticsModel,
                        liveCollection: this.liveClientStatisticsModel,
                    };
                    this.clientStatisticsView = new ClientStatisticsView(options);
                    this.clientStatisticsView.render($('.ksc-content'));
                }
            }.bind(this));
        },

        domainStatisticsCallback: function(){
            if (!AUTH_OBJ.KADomainBandwidthStatistics) return;
            require(['domainStatistics.view', 'domainStatistics.model'], function(DomainStatisticsView, DomainStatisticsModel){
                this.curPage = 'domainStatistics';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.downloadDomainStatisticsModel)
                    this.downloadDomainStatisticsModel = new DomainStatisticsModel();
                if (!this.liveDomainStatisticsModel)
                    this.liveDomainStatisticsModel = new DomainStatisticsModel();
                if (!this.domainStatisticsView ){
                    var options = {
                        collection: this.downloadDomainStatisticsModel,
                        liveCollection: this.liveDomainStatisticsModel,
                    };
                    this.domainStatisticsView = new DomainStatisticsView(options);
                    this.domainStatisticsView.render($('.ksc-content'));
                }
            }.bind(this));
        },

        statisticsManageCallback: function(){
            if (!AUTH_OBJ.CustomerBandwidthStatistics) return;
            require(['statisticsManage.view', 'statisticsManage.model'], function(StatisticsManageView, StatisticsManageModel){
                this.curPage = 'statisticsManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.downloadStatisticsManageModel)
                    this.downloadStatisticsManageModel = new StatisticsManageModel();
                if (!this.liveStatisticsManageModel)
                    this.liveStatisticsManageModel = new StatisticsManageModel();
                if (!this.statisticsManageView ){
                    var options = {
                        collection: this.downloadStatisticsManageModel,
                        liveCollection: this.liveStatisticsManageModel,
                    };
                    this.statisticsManageView = new StatisticsManageView(options);
                    this.statisticsManageView.render($('.ksc-content'));
                }
            }.bind(this));
        },

        domainManageCallback: function(){
            require(['domainManage.view', 'domainManage.model'], function(DomainManageView, DomainManageModel){
                this.curPage = 'domainManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.domainManageModel)
                    this.domainManageModel = new DomainManageModel();
                if (!this.domainManageView){
                    var options = {collection: this.domainManageModel};
                    this.domainManageView = new DomainManageView(options);
                    this.domainManageView.render($('.ksc-content'));
                } else {
                    this.domainManageView.update();
                }
            }.bind(this));
        },

        grayscaleSetupCallback: function(){
            require(['grayscaleSetup.view', 'grayscaleSetup.model'], function(GrayscaleSetupView, GrayscaleSetupModel){
                this.curPage = 'grayscaleSetup';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.grayscaleSetupModel)
                    this.grayscaleSetupModel = new GrayscaleSetupModel();
                if (!this.grayscaleSetupView){
                    var options = {collection: this.grayscaleSetupModel};
                    this.grayscaleSetupView = new GrayscaleSetupView(options);
                    this.grayscaleSetupView.render($('.ksc-content'));
                } else {
                    this.grayscaleSetupView.update();
                }
            }.bind(this));
        },

        templateManageCallback: function(){
            require(['templateManage.view', 'templateManage.model'], function(TemplateManageView, TemplateManageModel){
                this.curPage = 'templateManage';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                if (!this.templateManageModel)
                    this.templateManageModel = new TemplateManageModel();
                if (!this.templateManageView){
                    var options = {collection: this.templateManageModel};
                    this.templateManageView = new TemplateManageView(options);
                    this.templateManageView.render($('.ksc-content'));
                } else {
                    this.templateManageView.update();
                }
            }.bind(this));
        },
    });
    return new Controller();
});