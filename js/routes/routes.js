define("routes", ['require', 'exports', 'navbar.view',
        'routes.subNavbar',
        'routes.resourceManage',
        'routes.ngnixDownloadSetup',
        'routes.liveSetup',
        'routes.dispSetup',
        'routes.customerSetup',
        'routes.setupSend',
        'routes.other'
    ],
    function(require, exports, NavbarView,
        RouterSubNavbar,
        RouterResourceManage,
        RouterNgnixDownloadSetup,
        RouterLiveSetup,
        RouterDispSetup,
        RouterCustomerSetup,
        RouterSetupSend,
        RouterOther) {

        var Workspace = Backbone.Router.extend({

            initialize: function() {
                this.navbarView = new NavbarView();
                this.curPage = "";
                this.curView = null;
            },

            routes: {
                "": "customerSetup",
                "channelManage": "channelManage",
                "deviceManage/:query": "deviceManage",
                "nodeManage": "nodeManage",
                "dispGroup": "dispGroup",
                "importAssess": "importAssess",
                "dispConfig": "dispConfig",
                "importAssess": "importAssess",
                "specialLayerManage": "specialLayerManage",
                "importDomainManage": "importDomainManage",
                "coverRegion": "coverRegion",
                "coverManage": "coverManage",
                "liveAllSetup": "liveAllSetup",
                "liveCurentSetup": "liveCurentSetup",
                "ipManage": "ipManage",
                "statisticsManage": "statisticsManage",
                "refreshManual": "refreshManual",
                "customMaintenance": "customMaintenance",
                "domainStatistics": "domainStatistics",
                "domainManage": "domainManage",
                "clientStatistics": "clientStatistics",
                "businessManage": "businessManage",
                "grayscaleSetup": "grayscaleSetup",
                "templateManage": "templateManage",
                "customerSetup": "customerSetup",
                "domainList/:query": "domainList",
                "blockUrl/:query": "blockUrl",
                "interfaceQuota/:query": "interfaceQuota",

                "domainList/:query/basicInformation/:query2": "basicInformation",
                "domainList/:query/urlBlackList/:query2": "urlBlackList",
                "domainList/:query/domainSetup/:query2": "domainSetup",
                "domainList/:query/cnameSetup/:query2": "cnameSetup",
                "domainList/:query/cacheRule/:query2": "cacheRule",
                "domainList/:query/delMarkCache/:query2": "delMarkCache",
                "domainList/:query/cacheKeySetup/:query2": "cacheKeySetup",
                "domainList/:query/backOriginDetection/:query2": "backOriginDetection",
                "domainList/:query/backOriginSetup/:query2": "backOriginSetup",
                "domainList/:query/following302/:query2": "following302",
                "domainList/:query/dragPlay/:query2": "dragPlay",
                "domainList/:query/clientLimitSpeed/:query2": "clientLimitSpeed",
                "domainList/:query/httpHeaderOpt/:query2": "httpHeaderOpt",
                "domainList/:query/httpHeaderCtr/:query2": "httpHeaderCtr",
                "domainList/:query/requestArgsModify/:query2": "requestArgsModify",
                "domainList/:query/ipBlackWhiteList/:query2": "ipBlackWhiteList",
                "domainList/:query/refererAntiLeech/:query2": "refererAntiLeech",
                "domainList/:query/timestamp/:query2": "timestamp",
                "domainList/:query/openNgxLog/:query2": "openNgxLog",

                "domainList/:query/liveBasicInformation/:query2": "liveBasicInformation",
                "domainList/:query/liveDomainSetup/:query2": "liveDomainSetup",
                "domainList/:query/liveCnameSetup/:query2": "liveCnameSetup",
                "domainList/:query/liveHttpsSetup/:query2": "liveHttpsSetup",
                "domainList/:query/liveBackOriginSetup/:query2": "liveBackOriginSetup",
                "domainList/:query/liveBackOriginDetection/:query2": "liveBackOriginDetection",
                "domainList/:query/liveRefererAntiLeech/:query2": "liveRefererAntiLeech",
                "domainList/:query/liveTimestamp/:query2": "liveTimestamp",
                "domainList/:query/liveBusOptimize/:query2": "liveBusOptimize",
                "domainList/:query/liveH265Setup/:query2": "liveH265Setup",
                "domainList/:query/liveAudioOnly/:query2": "liveAudioOnly",
                "domainList/:query/liveEdge302/:query2": "liveEdge302",
                "domainList/:query/liveHttpFlvOptimize/:query2": "liveHttpFlvOptimize",
                "domainList/:query/liveRtmpOptimize/:query2": "liveRtmpOptimize",
                "domainList/:query/liveSLAStatistics/:query2": "liveSLAStatistics",
                "domainList/:query/liveFrequencyLog/:query2": "liveFrequencyLog",
                "domainList/:query/openAPILogSetup/:query2": "openAPILogSetup",
                //直播上行
                "domainList/:query/liveUpBasicInformation/:query2": "liveUpBasicInformation",
                "domainList/:query/liveUpBackOriginSetup/:query2": "liveUpBackOriginSetup",
                "domainList/:query/liveUpFlowNameChange/:query2": "liveUpFlowNameChange",

                "setupChannelManage": "setupChannelManage",
                "setupAppManage": "setupAppManage",
                "setupTopoManage": "setupTopoManage",
                "setupSendDone": "setupSendDone",
                "setupSending": "setupSending",
                "setupSendWaitCustomize": "setupSendWaitCustomize",
                "setupSendWaitSend": "setupSendWaitSend",
            },

            execute: function(callback, args) {
                if (this.curView)
                    this.curView.hide();

                if (callback) {
                    this.navbarView.initLogin(function() {
                        callback.apply(this, args);
                    }.bind(this))
                }
            }
        });

        Workspace = Workspace.extend(RouterSubNavbar);
        Workspace = Workspace.extend(RouterResourceManage);
        Workspace = Workspace.extend(RouterNgnixDownloadSetup);
        Workspace = Workspace.extend(RouterLiveSetup);
        Workspace = Workspace.extend(RouterDispSetup);
        Workspace = Workspace.extend(RouterCustomerSetup);
        Workspace = Workspace.extend(RouterSetupSend);
        Workspace = Workspace.extend(RouterOther);

        exports.Workspace = new Workspace();
    });