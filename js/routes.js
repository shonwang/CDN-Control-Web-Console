define("routes", ['require','exports', 'utility','navbar.view'], 
    function(require, exports, Utility, NavbarView) {

    var Workspace = Backbone.Router.extend({

        routes: {
            ""                    : "channelManage",
            "deviceManage/:query" : "deviceManage",
            "nodeManage"          : "nodeManage",
            "dispGroup"           : "dispGroup",
            "dispConfig"          : "dispConfig",
            "coverRegion"         : "coverRegion",
            "coverManage"         : "coverManage",
            "liveAllSetup"        : "liveAllSetup",
            "liveCurentSetup"     : "liveCurentSetup",
            "ipManage"            : "ipManage",
            "statisticsManage"    : "statisticsManage",
            "domainStatistics"    : "domainStatistics",
            "businessManage"      : "businessManage",
            "domainManage"        : "domainManage",
            "grayscaleSetup"     : "grayscaleSetup"
        },

        initialize: function(){
            Utility.dateFormat();
            this.navbarView = new NavbarView();
            this.curPage = "";
        },

        execute: function(callback, args) {
            switch(this.curPage){
                case 'channelManage':
                  this.channelManageView.hide();
                  break;
                case 'deviceManage':
                  this.deviceManageView.remove();
                  this.deviceManageView = null;
                  break;
                case 'nodeManage':
                  this.nodeManageView.hide();
                  break;
                case 'dispGroup':
                  this.dispGroupView.hide();
                  break;
                case 'dispConfig':
                  this.dispConfigView.remove();
                  this.dispConfigView = null;
                  break;
                case 'coverRegion':
                  this.coverRegionView.hide();
                  break;
                case 'coverManage':
                  this.coverManageView.hide();
                  break;
                case "liveAllSetup":
                    this.liveAllSetupView.hide();
                  break;
                case "liveCurentSetup":
                    this.liveCurentSetupView.hide();
                  break;
                case "ipManage":
                    this.ipManageView.remove();
                    this.ipManageView = null
                  break;
                case "businessManage":
                    this.businessManageView.hide();
                  break;
                case 'statisticsManage':
                  this.statisticsManageView.remove();
                  this.statisticsManageView = null;
                  break;
                case 'domainStatistics':
                  this.domainStatisticsView.remove();
                  this.domainStatisticsView = null;
                  break;
                case 'domainManage':
                    this.domainManageView.hide();
                    break;
                case 'grayscaleSetup':
                    this.grayscaleSetupView.hide();
                    break;
                default:
            }
            if (callback)
                callback.apply(this, args);
        },

        businessManage: function(){
            this.navbarView.initLogin($.proxy(this.businessManageCallback, this))
        },

        businessManageCallback: function(){
            if (!AUTH_OBJ.ManageNodeGroups) return;
            require(['businessManage.view', 'businessManage.model', 'nodeManage.model'], function(BusinessManageView, BusinessManageModel, NodeManageModel){
                this.curPage = 'businessManage';
                this.navbarView.select(this.curPage);
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

        ipManage: function(){
            this.navbarView.initLogin($.proxy(this.ipManageCallback, this))
        },

        ipManageCallback: function(){
            if (!AUTH_OBJ.ManageIPs) return;
            require(['ipManage.view', 'ipManage.model', 'deviceManage.model'], function(IPManageView, IPManageModel, DeviceManageModel){
                this.curPage = 'ipManage';
                this.navbarView.select(this.curPage);
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

        liveCurentSetup: function(){
            this.navbarView.initLogin($.proxy(this.liveCurentSetupCallback, this))
        },

        liveCurentSetupCallback: function(){
            if (!AUTH_OBJ.CurrentConfigurations) return;
            require(['liveCurentSetup.view', 'liveCurentSetup.model'], function(LiveCurentSetupView, LiveCurentSetupModel){
                this.curPage = 'liveCurentSetup';
                this.navbarView.select(this.curPage);
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

        liveAllSetup: function(){
            this.navbarView.initLogin($.proxy(this.liveAllSetupCallback, this))
        },

        liveAllSetupCallback: function(){
            if (!AUTH_OBJ.ManageConfigs) return;
            require(['liveAllSetup.view', 'liveAllSetup.model'], function(LiveAllSetupView, LiveAllSetupModel){
                this.curPage = 'liveAllSetup';
                this.navbarView.select(this.curPage);
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

        coverManage: function(){
            this.navbarView.initLogin($.proxy(this.coverManageCallback, this))
        },

        coverManageCallback: function() {
            if (!AUTH_OBJ.ManageCoverrelateds) return;
            require(['coverManage.view', 'coverManage.model', 'nodeManage.model'], function(CoverManageView, CoverManageModel, NodeManageModel){
                this.curPage = 'coverManage';
                this.navbarView.select(this.curPage);
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

        coverRegion: function(){
            this.navbarView.initLogin($.proxy(this.coverRegionCallback, this))
        },

        coverRegionCallback: function() {
            if (!AUTH_OBJ.Coverrelateds) return;
            require(['coverRegion.view', 'coverRegion.model'], function(CoverRegionView, CoverRegionModel){
                    this.curPage = 'coverRegion';
                    this.navbarView.select(this.curPage);
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

        dispConfig: function(){
            this.navbarView.initLogin($.proxy(this.dispConfigCallback, this))
        },

        dispConfigCallback: function() {
            if (!AUTH_OBJ.GslbConfig) return;
            require(['dispConfig.view', 'dispConfig.model', 'dispGroup.model'], function(DispConfigView, DispConfigModel, DispGroupModel){
                this.curPage = 'dispConfig';
                this.navbarView.select(this.curPage);
                if (!this.dispConfigModel)
                    this.dispConfigModel = new DispConfigModel();
                if (!this.dispGroupModel)
                    this.dispGroupModel = new DispGroupModel();
                if (!this.dispConfigView ){
                    var options = {
                        collection: this.dispConfigModel,
                        dispGroupCollection: this.dispGroupModel
                    };
                    this.dispConfigView = new DispConfigView(options);
                    this.dispConfigView.render($('.ksc-content'));
                } else {
                    this.dispConfigView.update();
                }
            }.bind(this));
        },

        dispGroup: function(){
            this.navbarView.initLogin($.proxy(this.dispGroupCallback, this))
        },

        dispGroupCallback: function() {
            if (!AUTH_OBJ.ManageGslbGroups) return;
            require(['dispGroup.view', 'dispGroup.model'], function(DispGroupView, DispGroupModel){
                this.curPage = 'dispGroup';
                this.navbarView.select(this.curPage);
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

        nodeManage: function(){
            this.navbarView.initLogin($.proxy(this.nodeManageCallback, this))
        },

        nodeManageCallback: function() {
            if (!AUTH_OBJ.ManageNodes) return;
            require(['nodeManage.view', 'nodeManage.model'], function(NodeManageView, NodeManageModel){
                this.curPage = 'nodeManage';
                this.navbarView.select(this.curPage);
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

        deviceManage: function(query){
            this.navbarView.initLogin($.proxy(this.deviceManageCallback, this, query))
        },

        deviceManageCallback: function(query) {
            if (!AUTH_OBJ.ManageHosts) return;
            require(['deviceManage.view', 'deviceManage.model'], function(DeviceManageView, DeviceManageModel){
                this.curPage = 'deviceManage';
                this.navbarView.select(this.curPage);
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

        channelManage: function(){
            this.navbarView.initLogin($.proxy(this.channelManageCallback, this))
        },

        channelManageCallback: function(){
            if (!AUTH_OBJ.ManageChannels) return;
            require(['channelManage.view', 'channelManage.model'], function(ChannelManageView, ChannelManageModel){
                this.curPage = 'channelManage';
                this.navbarView.select(this.curPage);
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

        domainStatistics: function(){
            this.navbarView.initLogin($.proxy(this.domainStatisticsCallback, this))
        },

        domainStatisticsCallback: function(){
            if (!AUTH_OBJ.KACustomerBandwidthStatistics) return;
            require(['domainStatistics.view', 'domainStatistics.model'], function(DomainStatisticsView, DomainStatisticsModel){
                this.curPage = 'domainStatistics';
                this.navbarView.select(this.curPage);
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

        statisticsManage: function(){
            this.navbarView.initLogin($.proxy(this.statisticsManageCallback, this))
        },

        statisticsManageCallback: function(){
            if (!AUTH_OBJ.CustomerBandwidthStatistics) return;
            require(['statisticsManage.view', 'statisticsManage.model'], function(StatisticsManageView, StatisticsManageModel){
                this.curPage = 'statisticsManage';
                this.navbarView.select(this.curPage);
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

        domainManage: function(){
            this.navbarView.initLogin($.proxy(this.domainManageCallback, this))
        },

        domainManageCallback: function(){
            require(['domainManage.view', 'domainManage.model'], function(DomainManageView, DomainManageModel){
                this.curPage = 'domainManage';
                this.navbarView.select(this.curPage);
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

        grayscaleSetup: function(){
            this.navbarView.initLogin($.proxy(this.grayscaleSetupCallback, this))
        },

        grayscaleSetupCallback: function(){

            require(['grayscaleSetup.view', 'grayscaleSetup.model'], function(GrayscaleSetupView, GrayscaleSetupModel){
                this.curPage = 'grayscaleSetup';
                this.navbarView.select(this.curPage);
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
        }
    });
    exports.Workspace = new Workspace();
});