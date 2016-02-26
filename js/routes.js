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
            "ipManage"            : "ipManage"
        },

        initialize: function(){
            Utility.dateFormat();
            this.navbarView = new NavbarView();
            this.navbarView.render($('.ksc-nav-ctn'));
            this.curPage = "";
        },

        execute: function(callback, args) {
            switch(this.curPage){
                case 'channelManage':
                  this.channelManageView.hide();
                  break;
                case 'deviceManage':
                  this.deviceManageView.hide();
                  break;
                case 'nodeManage':
                  this.nodeManageView.hide();
                  break;
                case 'dispGroup':
                  this.dispGroupView.hide();
                  break;
                case 'dispConfig':
                  this.dispConfigView.hide();
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
                    this.ipManageView.hide();
                  break;
                default:
            }
            if (callback)
                callback.apply(this, args);
        },

        ipManage: function(){
            require(['ipManage.view', 'ipManage.model'], function(IPManageView, IPManageModel){
                this.curPage = 'ipManage';
                if (!this.ipManageModel)
                    this.ipManageModel = new IPManageModel();
                if (!this.ipManageView ){
                    var options = {collection: this.ipManageModel};
                    this.ipManageView = new IPManageView(options);
                    this.ipManageView.render($('.ksc-content'));
                } else {
                    this.ipManageView.update();
                }
            }.bind(this));
        },

        liveCurentSetup: function(){
            require(['liveCurentSetup.view', 'liveCurentSetup.model'], function(LiveCurentSetupView, LiveCurentSetupModel){
                this.curPage = 'liveCurentSetup';
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
            require(['liveAllSetup.view', 'liveAllSetup.model'], function(LiveAllSetupView, LiveAllSetupModel){
                this.curPage = 'liveAllSetup';
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

        coverManage: function() {
            require(['coverManage.view', 'coverManage.model'], function(CoverManageView, CoverManageModel){
                this.curPage = 'coverManage';
                if (!this.coverManageModel)
                    this.coverManageModel = new CoverManageModel();
                if (!this.coverManageView ){
                    var options = {collection: this.coverManageModel};
                    this.coverManageView = new CoverManageView(options);
                    this.coverManageView.render($('.ksc-content'));
                } else {
                    this.coverManageView.update();
                }
            }.bind(this));
        },

        coverRegion: function() {
            require(['coverRegion.view', 'coverRegion.model'], function(CoverRegionView, CoverRegionModel){
                this.curPage = 'coverRegion';
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

        dispConfig: function() {
            require(['dispConfig.view', 'dispConfig.model'], function(DispConfigView, DispConfigModel){
                this.curPage = 'dispConfig';
                if (!this.dispConfigModel)
                    this.dispConfigModel = new DispConfigModel();
                if (!this.dispConfigView ){
                    var options = {collection: this.dispConfigModel};
                    this.dispConfigView = new DispConfigView(options);
                    this.dispConfigView.render($('.ksc-content'));
                } else {
                    this.dispConfigView.update();
                }
            }.bind(this));
        },

        dispGroup: function() {
            require(['dispGroup.view', 'dispGroup.model'], function(DispGroupView, DispGroupModel){
                this.curPage = 'dispGroup';
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

        nodeManage: function() {
            require(['nodeManage.view', 'nodeManage.model'], function(NodeManageView, NodeManageModel){
                this.curPage = 'nodeManage';
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

        deviceManage: function(query) {
            require(['deviceManage.view', 'deviceManage.model'], function(DeviceManageView, DeviceManageModel){
            this.curPage = 'deviceManage';
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
            require(['channelManage.view', 'channelManage.model'], function(ChannelManageView, ChannelManageModel){
            this.curPage = 'channelManage';
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
        }
    });
    exports.Workspace = new Workspace();
});