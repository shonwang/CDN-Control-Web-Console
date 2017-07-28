define("routes", ['require', 'exports', 'navbar.view',
        'routes.subNavbar',
        'routes.resourceManage',
        'routes.ngnixDownloadSetup',
        'routes.luaDownloadSetup',
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
        RouterLuaDownloadSetup,
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
                // 资源管理
                "deviceManage/:query": "deviceManage",
                "nodeManage": "nodeManage",
                "ipManage": "ipManage",
                "setupAppManage": "setupAppManage",
                "setupTopoManage": "setupTopoManage",
                "specialLayerManage": "specialLayerManage",

                // 调度配置
                "dispGroup": "dispGroup",
                "importAssess": "importAssess",
                "dispConfig": "dispConfig",
                "importAssess": "importAssess",
                "importDomainManage": "importDomainManage",
                "coverRegion": "coverRegion",
                "coverManage": "coverManage",
                "statisticsManage": "statisticsManage",
                "domainStatistics": "domainStatistics",
                "clientStatistics": "clientStatistics",

                // 客户配置
                "": "customerSetup",
                "customerSetup": "customerSetup",
                "blockUrl/:query": "blockUrl",
                "interfaceQuota/:query": "interfaceQuota",
                "pnoSetup/:query": "pnoSetup",
                "domainList/:query": "domainList",
                "domainList/:query/openAPILogSetup/:query2": "openAPILogSetup",

                //Lua 下载域名配置
                "domainList/:query/luaBasicInformation/:query2": "luaBasicInformation",
                "domainList/:query/luaDomainSetup/:query2": "luaDomainSetup",
                "domainList/:query/luaCnameSetup/:query2": "luaCnameSetup",
                "domainList/:query/luaBackOriginDetection/:query2": "luaBackOriginDetection",
                "domainList/:query/luaBackOriginSetup/:query2": "luaBackOriginSetup",
                "domainList/:query/luaCacheRule/:query2": "luaCacheRule",
                "domainList/:query/luaDelMarkCache/:query2": "luaDelMarkCache",
                "domainList/:query/luaCacheKeySetup/:query2": "luaCacheKeySetup",
                "domainList/:query/luaDragPlay/:query2": "luaDragPlay",
                "domainList/:query/luaClientLimitSpeed/:query2": "luaClientLimitSpeed",
                "domainList/:query/luaHttpHeaderOpt/:query2": "luaHttpHeaderOpt",
                "domainList/:query/luaHttpHeaderCtr/:query2": "luaHttpHeaderCtr",
                "domainList/:query/luaAdvanceConfig/:query2": "luaAdvanceConfig",
                "domainList/:query/luaRequestArgsModify/:query2": "luaRequestArgsModify",
                "domainList/:query/luaIpBlackWhiteList/:query2": "luaIpBlackWhiteList",
                "domainList/:query/luaRefererAntiLeech/:query2": "luaRefererAntiLeech",
                "domainList/:query/luaTimestamp/:query2": "luaTimestamp",

                //直播域名配置
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

                //直播上行域名配置
                "domainList/:query/liveUpBasicInformation/:query2": "liveUpBasicInformation",
                "domainList/:query/liveUpBackOriginSetup/:query2": "liveUpBackOriginSetup",
                "domainList/:query/liveUpFlowNameChange/:query2": "liveUpFlowNameChange",

                //配置下发2.0
                "setupChannelManage": "setupChannelManage",
                "setupSendDone": "setupSendDone",
                "setupSending": "setupSending",
                "setupSendWaitCustomize": "setupSendWaitCustomize",
                "setupSendWaitSend": "setupSendWaitSend",

                //Ngnix 下载域名配置(部分废弃)
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

                //配置下发1.0（废弃）
                "liveAllSetup": "liveAllSetup",
                "liveCurentSetup": "liveCurentSetup",
                "domainManage": "domainManage",
                "businessManage": "businessManage",
                "grayscaleSetup": "grayscaleSetup",
                "templateManage": "templateManage",
                "channelManage": "channelManage",

                //张振建提的半途而废的需求（废弃）
                "refreshManual": "refreshManual",
                "customMaintenance": "customMaintenance"
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
        Workspace = Workspace.extend(RouterLuaDownloadSetup);
        Workspace = Workspace.extend(RouterLiveSetup);
        Workspace = Workspace.extend(RouterDispSetup);
        Workspace = Workspace.extend(RouterCustomerSetup);
        Workspace = Workspace.extend(RouterSetupSend);
        Workspace = Workspace.extend(RouterOther);

        exports.Workspace = new Workspace();
    });