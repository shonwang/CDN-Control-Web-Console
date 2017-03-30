define("routes", ['require', 'exports', 'utility', 'navbar.view', 'subNavbar.view', 'controller', 'customerSetup.controller', 'setupSendManage.controller'], 
    function(require, exports, Utility, NavbarView, SubNavbar, Controller, CustomerSetupController, SetupSendManageController) {

    var Workspace = Backbone.Router.extend({

        initialize: function(){
            Utility.dateFormat();
            this.navbarView = new NavbarView();
            this.curPage = "";
        },

        routes: {
            ""                    : "channelManage",
            "deviceManage/:query" : "deviceManage",
            "nodeManage"          : "nodeManage",
            "dispGroup"           : "dispGroup",
            "dispConfig"          : "dispConfig",
            "importAssess"        : "importAssess",
            "importDomainManage"  : "importDomainManage",
            "coverRegion"         : "coverRegion",
            "coverManage"         : "coverManage",
            "liveAllSetup"        : "liveAllSetup",
            "liveCurentSetup"     : "liveCurentSetup",
            "ipManage"            : "ipManage",
            "statisticsManage"    : "statisticsManage",
            "refreshManual"       : "refreshManual",
            "customMaintenance"   : "customMaintenance",
            "domainStatistics"    : "domainStatistics",
            "domainManage"        : "domainManage",
            "clientStatistics"    : "clientStatistics",
            "businessManage"      : "businessManage",
            "grayscaleSetup"      : "grayscaleSetup",
            "templateManage"      : "templateManage",
            "customerSetup"       : "customerSetup",
            "domainList/:query"   : "domainList",
            "blockUrl/:query"     : "blockUrl",
            
            "domainList/:query/basicInformation/:query2"          : "basicInformation",
            "domainList/:query/urlBlackList/:query2"              : "urlBlackList",
            "domainList/:query/domainSetup/:query2"               : "domainSetup",
            "domainList/:query/cnameSetup/:query2"                : "cnameSetup",
            "domainList/:query/cacheRule/:query2"                 : "cacheRule",
            "domainList/:query/delMarkCache/:query2"              : "delMarkCache",
            "domainList/:query/cacheKeySetup/:query2"             : "cacheKeySetup",
            "domainList/:query/backOriginDetection/:query2"       : "backOriginDetection",  
            "domainList/:query/backOriginSetup/:query2"           : "backOriginSetup",
            "domainList/:query/following302/:query2"              : "following302",
            "domainList/:query/dragPlay/:query2"                  : "dragPlay",
            "domainList/:query/clientLimitSpeed/:query2"          : "clientLimitSpeed",
            "domainList/:query/httpHeaderOpt/:query2"             : "httpHeaderOpt",
            "domainList/:query/httpHeaderCtr/:query2"             : "httpHeaderCtr",
            "domainList/:query/requestArgsModify/:query2"         : "requestArgsModify",
            "domainList/:query/ipBlackWhiteList/:query2"          : "ipBlackWhiteList",
            "domainList/:query/refererAntiLeech/:query2"          : "refererAntiLeech",
            "domainList/:query/timestamp/:query2"                 : "timestamp",
            "domainList/:query/openNgxLog/:query2"                : "openNgxLog",

            "setupChannelManage"     : "setupChannelManage",
            "setupAppManage"         : "setupAppManage",
            "setupTopoManage"        : "setupTopoManage",
            "setupSendDone"          : "setupSendDone",
            "setupSending"           : "setupSending",
            "setupSendWaitCustomize" : "setupSendWaitCustomize",
            "setupSendWaitSend"      : "setupSendWaitSend",
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
                case 'importAssess':
                    this.importAssessView.hide();
                    break;
                case 'importDomainManage':
                    this.importDomainManageView.hide();
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
                case 'clientStatistics':
                    this.clientStatisticsView.remove();
                    this.clientStatisticsView = null;
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
                case 'refreshManual':
                    this.refreshManualView.remove();
                    this.refreshManualView = null;
                    break;
                case 'customMaintenance':
                    this.customMaintenanceView.remove();
                    this.customMaintenanceView = null;
                    break;
                case 'grayscaleSetup':
                    this.grayscaleSetupView.hide();
                    break;
                case 'templateManage':
                    this.templateManageView.hide();
                    break;
                case 'setupChannelManage':
                    this.setupChannelManageView.hide();
                    break;
                case 'setupAppManage':
                    this.setupAppManageView.remove();
                    this.setupAppManageView = null;
                    break;
                case 'setupTopoManage':
                    this.setupTopoManageView.remove();
                    this.setupTopoManageView = null;
                    break;
                case 'setupSendDone':
                    this.setupSendDoneView.hide();
                    break;
                case 'setupSending':
                    this.setupSendingView.hide();
                    break;
                case 'setupSendWaitCustomize':
                    this.setupSendWaitCustomizeView.hide();
                    break;
                case 'setupSendWaitSend':
                    this.setupSendWaitSendView.hide();
                    break;
                case 'customerSetup':
                    this.customerSetupView.hide();
                    break;
                case 'customerSetup-domainList':
                    this.domainListView.hide();
                    break;
                case 'customerSetup-domainList-basicInformation':
                    this.basicInformationView.hide();
                    break;
                case 'customerSetup-domainList-urlBlackList':
                    this.urlBlackListView.hide();
                    break;
                case 'customerSetup-blockUrl':
                    this.blockUrlView.hide();
                    break;
                case 'customerSetup-domainList-domainSetup':
                    this.domainSetupView.hide();
                    break;
                case 'customerSetup-domainList-cacheRule':
                    this.cacheRuleView.hide();
                    break;
                case 'customerSetup-domainList-delMarkCache':
                    this.delMarkCacheView.hide();
                    break;
                case 'customerSetup-domainList-cacheKeySetup':
                    this.cacheKeySetupView.hide();
                    break;
                case 'customerSetup-domainList-cnameSetup':
                    this.cnameSetupView.hide();
                    break;
                case 'customerSetup-domainList-backOriginDetection':
                    this.backOriginDetectionView.hide();
                    break;
                case 'customerSetup-domainList-backOriginSetup':
                    this.backOriginSetupView.hide();
                    break;
                case 'customerSetup-domainList-following302':
                    this.following302View.hide();
                    break;
                case 'customerSetup-domainList-dragPlay':
                    this.dragPlayView.hide();
                    break;
                case 'customerSetup-domainList-clientLimitSpeed':
                    this.clientLimitSpeedView.hide();
                    break;
                case 'customerSetup-domainList-httpHeaderOpt':
                    this.httpHeaderOptView.hide();
                    break;
                case 'customerSetup-domainList-httpHeaderCtr':
                    this.httpHeaderCtrView.hide();
                    break;
                case 'customerSetup-domainList-requestArgsModify':
                    this.requestArgsModifyView.hide();
                    break;
                case 'customerSetup-domainList-ipBlackWhiteList':
                    this.ipBlackWhiteListView.hide();
                    break;
                case 'customerSetup-domainList-refererAntiLeech':
                    this.refererAntiLeechView.hide();
                    break;
                case 'customerSetup-domainList-timestamp':
                    this.timestampView.hide();
                    break;
                case 'customerSetup-domainList-openNgxLog':
                    this.openNgxLogView.hide();
                    break;
                default:
            }

            if (callback) callback.apply(this, args);
        },

        setupSendDone: function(){
            this.navbarView.initLogin($.proxy(SetupSendManageController.setupSendDoneCallback, this))
        },

        setupSending: function(){
            this.navbarView.initLogin($.proxy(SetupSendManageController.setupSendingCallback, this))
        },

        setupSendWaitCustomize: function(){
            this.navbarView.initLogin($.proxy(SetupSendManageController.setupSendWaitCustomizeCallback, this))
        },

        setupSendWaitSend: function(){
            this.navbarView.initLogin($.proxy(SetupSendManageController.setupSendWaitSendCallback, this))
        },

        initSetupSendNavbar: function(){
            var menu = [{
                    id: 'setupSendWaitCustomize',
                    name: '待定制',
                    hash: 'index.html#/setupSendWaitCustomize',
                    active: true,
                    children: []
                },{
                    id: 'setupSendWaitSend',
                    name: '待下发',
                    hash: 'index.html#/setupSendWaitSend',
                    active: false,
                    children: []
                },{
                    id: 'setupSending',
                    name: '下发中',
                    hash: 'index.html#/setupSending',
                    active: false,
                    children: []
                },{
                    id: 'setupSendDone',
                    name: '下发完成',
                    hash: 'index.html#/setupSendDone',
                    active: false,
                    children: []
                },], menuOptions = {
                backHash: "",
                menuList: menu
            };
            if (!this.setupSendNavbar){
                this.setupSendNavbar = new SubNavbar(menuOptions);
                this.setupSendNavbar.$el.find(".back").remove();
                if(!AUTH_OBJ.WaitCustomize){
                    this.setupSendNavbar.$el.find('#setupSendWaitCustomize').remove();
                }
                if(!AUTH_OBJ.WaitSend){
                    this.setupSendNavbar.$el.find('#setupSendWaitSend').remove();
                }
                if(!AUTH_OBJ.Sending){
                    this.setupSendNavbar.$el.find('#setupSending').remove();
                }
                if(!AUTH_OBJ.SendDone){
                    this.setupSendNavbar.$el.find('#setupSendDone').remove();
                }
                this.setupSendNavbar.select(this.curPage);
            }
        },

        setupTopoManage: function(){
            this.navbarView.initLogin($.proxy(Controller.setupTopoManageCallback, this))
        },

        setupAppManage: function(){
            this.navbarView.initLogin($.proxy(Controller.setupAppManageCallback, this))
        },

        setupChannelManage: function(){
            this.navbarView.initLogin($.proxy(Controller.setupChannelManageCallback, this))
        },
        
        customMaintenance: function(){
            this.navbarView.initLogin($.proxy(Controller.customMaintenanceCallback, this))
        },

        refreshManual: function(){
            this.navbarView.initLogin($.proxy(Controller.refreshManualCallback, this))
        },

        businessManage: function(){
            this.navbarView.initLogin($.proxy(Controller.businessManageCallback, this))
        },

        ipManage: function(){
            this.navbarView.initLogin($.proxy(Controller.ipManageCallback, this))
        },

        liveCurentSetup: function(){
            this.navbarView.initLogin($.proxy(Controller.liveCurentSetupCallback, this))
        },

        liveAllSetup: function(){
            this.navbarView.initLogin($.proxy(Controller.liveAllSetupCallback, this))
        },

        coverManage: function(){
            this.navbarView.initLogin($.proxy(Controller.coverManageCallback, this))
        },

        coverRegion: function(){
            this.navbarView.initLogin($.proxy(Controller.coverRegionCallback, this))
        },

        dispConfig: function(){
            this.navbarView.initLogin($.proxy(Controller.dispConfigCallback, this))
        },

        importAssess: function(){
            this.navbarView.initLogin($.proxy(Controller.importAssessCallback, this))
        },

        importDomainManage: function(){
            this.navbarView.initLogin($.proxy(Controller.importDomainManageCallback, this))
        },

        dispGroup: function(){
            this.navbarView.initLogin($.proxy(Controller.dispGroupCallback, this))
        },

        nodeManage: function(){
            this.navbarView.initLogin($.proxy(Controller.nodeManageCallback, this))
        },

        deviceManage: function(query){
            this.navbarView.initLogin($.proxy(Controller.deviceManageCallback, this, query))
        },

        channelManage: function(){
            this.navbarView.initLogin($.proxy(Controller.channelManageCallback, this))
        },

        clientStatistics: function(){
            this.navbarView.initLogin($.proxy(Controller.clientStatisticsCallback, this))
        },

        domainStatistics: function(){
            this.navbarView.initLogin($.proxy(Controller.domainStatisticsCallback, this))
        },

        statisticsManage: function(){
            this.navbarView.initLogin($.proxy(Controller.statisticsManageCallback, this))
        },

        domainManage: function(){
            this.navbarView.initLogin($.proxy(Controller.domainManageCallback, this))
        },

        grayscaleSetup: function(){
            this.navbarView.initLogin($.proxy(Controller.grayscaleSetupCallback, this))
        },

        templateManage: function(){
            this.navbarView.initLogin($.proxy(Controller.templateManageCallback, this))
        },

        openNgxLog: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.openNgxLogCallback, this, query, query2))
        },

        timestamp: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.timestampCallback, this, query, query2))
        },

        refererAntiLeech: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.refererAntiLeechCallback, this, query, query2))
        },

        ipBlackWhiteList: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.ipBlackWhiteListCallback, this, query, query2))
        },

        requestArgsModify: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.requestArgsModifyCallback, this, query, query2))
        },

        httpHeaderCtr: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.httpHeaderCtrCallback, this, query, query2))
        },

        httpHeaderOpt: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.httpHeaderOptCallback, this, query, query2))
        },

        clientLimitSpeed: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.clientLimitSpeedCallback, this, query, query2))
        },

        dragPlay: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.dragPlayCallback, this, query, query2))
        },

        following302: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.following302Callback, this, query, query2))
        },
        backOriginDetection: function(query,query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.backOriginDetectionCallback, this, query, query2))
        },

        backOriginSetup: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.backOriginSetupCallback, this, query, query2))
        },

        cnameSetup: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.cnameSetupCallback, this, query, query2))
        },

        cacheKeySetup: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.cacheKeySetupCallback, this, query, query2))
        },

        delMarkCache: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.delMarkCacheCallback, this, query, query2))
        },

        cacheRule: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.cacheRuleCallback, this, query, query2))
        },

        basicInformation: function(query ,query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.basicInformationCallback, this, query, query2))
        },

        urlBlackList: function(query ,query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.urlBlackListCallback, this, query, query2))
        },
        
        domainSetup: function(query, query2){
            this.navbarView.initLogin($.proxy(CustomerSetupController.domainSetupCallback, this, query, query2))
        },

        domainList: function(query){
            this.navbarView.initLogin($.proxy(CustomerSetupController.domainListCallback, this, query))
        },
        
        blockUrl: function(query){
            this.navbarView.initLogin($.proxy(CustomerSetupController.blockUrlCallback, this, query))
        },

        setupDomainManageNavbar: function(query, query2){
            if (!this.domainManageNavbar){
                var menuOptions = {
                    query: query,
                    query2: query2
                }
                this.domainManageNavbar = new SubNavbar(menuOptions);
                this.domainManageNavbar.select(this.curPage);
            }
        },

        customerSetup: function(){
            this.navbarView.initLogin($.proxy(CustomerSetupController.customerSetupCallback, this))
        },

        setupCustomerSetupNavbar: function(query){
            var menu = [{
                id: '',
                name: '客户配置管理',
                hash: 'javascript:void(0)',
                children: [{
                    id: 'customerSetup-domainList',
                    name: '域名列表',
                    hash: 'index.html#/domainList/' + query,
                    active: true,
                    children: []
                },{
                    id: 'customerSetup-blockUrl',
                    name: '一键屏蔽URL',
                    hash: 'index.html#/blockUrl/' + query,
                    active: false,
                    children: []
                }]
            }], menuOptions = {
                backHash: "index.html#/customerSetup",
                menuList: menu
            };
            if (!this.customerSetupNavbar){
                this.customerSetupNavbar = new SubNavbar(menuOptions);
                this.customerSetupNavbar.select(this.curPage);
            }
        },

        removeSubSideBar: function(){
            //从域名列表页面、新域名管理页面进入到其他一级导航页面移除域名列表的二级导航、新域名管理的二级导航
            if (this.curPage.indexOf("customerSetup-") == -1 && 
                this.curPage.indexOf("customerSetup-domainList-") == -1){
                if (this.customerSetupNavbar){
                    this.customerSetupNavbar.$el.remove();
                    this.customerSetupNavbar = null;
                }
                if (this.domainManageNavbar) {
                    this.domainManageNavbar.$el.remove();
                    this.domainManageNavbar = null;
                } 
            }
            //从新域名管理页面进入到域名列表页面移除新域名管理的二级导航
            if (this.curPage.indexOf("customerSetup-") > -1 &&
                this.curPage.indexOf("customerSetup-domainList-") == -1 && 
                this.domainManageNavbar){
                this.domainManageNavbar.$el.remove();
                this.domainManageNavbar = null;
            }
            //从下发页面进入到其他一级页面移除下发管理的二级导航
            if (this.curPage.indexOf("setupSend") === -1 && this.setupSendNavbar){
                this.setupSendNavbar.$el.remove();
                this.setupSendNavbar = null;
            }
        }
    });
    exports.Workspace = new Workspace();
});