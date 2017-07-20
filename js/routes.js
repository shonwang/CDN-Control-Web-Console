define("routes", ['require', 'exports', 'navbar.view', 'subNavbar.view'],
    function(require, exports, NavbarView, SubNavbar) {

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
                "pnoSetup/:query": "pnoSetup",

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
                "isomorphismManage": "isomorphismManage",
                "sharedSetup/:query": "sharedSetup",
            },

            execute: function(callback, args) {
                if (this.curView)
                    this.curView.hide();

                if (callback) {
                    this.navbarView.initLogin(function() {
                        callback.apply(this, args);
                    }.bind(this))
                }
            },

            initSetupSendNavbar: function() {
                var menu = [{
                        id: 'setupSendWaitCustomize',
                        name: '待定制',
                        hash: 'index.html#/setupSendWaitCustomize',
                        active: true,
                        children: []
                    }, {
                        id: 'setupSendWaitSend',
                        name: '待下发',
                        hash: 'index.html#/setupSendWaitSend',
                        active: false,
                        children: []
                    }, {
                        id: 'setupSending',
                        name: '下发中',
                        hash: 'index.html#/setupSending',
                        active: false,
                        children: []
                    }, {
                        id: 'setupSendDone',
                        name: '下发完成',
                        hash: 'index.html#/setupSendDone',
                        active: false,
                        children: []
                    }, ],
                    menuOptions = {
                        backHash: "",
                        menuList: menu
                    };
                if (!this.setupSendNavbar) {
                    this.setupSendNavbar = new SubNavbar(menuOptions);
                    this.setupSendNavbar.$el.find(".back").remove();
                    if (!AUTH_OBJ.WaitCustomize) {
                        this.setupSendNavbar.$el.find('#setupSendWaitCustomize').remove();
                    }
                    if (!AUTH_OBJ.WaitSend) {
                        this.setupSendNavbar.$el.find('#setupSendWaitSend').remove();
                    }
                    if (!AUTH_OBJ.Sending) {
                        this.setupSendNavbar.$el.find('#setupSending').remove();
                    }
                    if (!AUTH_OBJ.SendDone) {
                        this.setupSendNavbar.$el.find('#setupSendDone').remove();
                    }
                    this.setupSendNavbar.select(this.curPage);
                }
            },

            setupDomainManageNavbar: function(query, query2) {
                if (!this.domainManageNavbar) {
                    var menuOptions = {
                        query: query,
                        query2: query2
                    }
                    this.domainManageNavbar = new SubNavbar(menuOptions);
                    this.domainManageNavbar.select(this.curPage);
                }
            },

            setupLiveDomainManageNavbar: function(query, query2) {
                var menu = [{
                        id: 'customerSetup-domainList-liveBasicInformation',
                        name: '基本信息',
                        hash: 'index.html#/domainList/' + query + '/liveBasicInformation/' + query2,
                        children: []
                    }, {
                        id: '',
                        name: '域名设置',
                        hash: 'javascript:void(0)',
                        children: [{
                                id: 'customerSetup-domainList-liveDomainSetup',
                                name: '域名基础配置',
                                hash: 'index.html#/domainList/' + query + '/liveDomainSetup/' + query2,
                                active: false,
                                children: []
                            }, {
                                id: 'customerSetup-domainList-liveCnameSetup',
                                name: 'CNAME设置',
                                hash: 'index.html#/domainList/' + query + '/liveCnameSetup/' + query2,
                                active: false,
                                children: []
                            },
                            // {
                            //     id: 'customerSetup-domainList-liveHttpsSetup',
                            //     name: 'https配置',
                            //     hash: 'index.html#/domainList/' + query + '/liveHttpsSetup/' + query2,
                            //     active: false,
                            //     children: []
                            // }
                        ]
                    }, {
                        id: '',
                        name: '源站配置',
                        hash: 'javascript:void(0)',
                        children: [{
                            id: 'customerSetup-domainList-liveBackOriginSetup',
                            name: '回源配置',
                            hash: 'index.html#/domainList/' + query + '/liveBackOriginSetup/' + query2,
                            active: false,
                            children: []
                        }, {
                            id: 'customerSetup-domainList-liveBackOriginDetection',
                            name: '回源检测',
                            hash: 'index.html#/domainList/' + query + '/liveBackOriginDetection/' + query2,
                            active: false,
                            children: []
                        }]
                    }, {
                        id: '',
                        name: '访问控制',
                        hash: 'javascript:void(0)',
                        children: [{
                            id: 'customerSetup-domainList-liveRefererAntiLeech',
                            name: 'Referer防盗链',
                            hash: 'index.html#/domainList/' + query + '/liveRefererAntiLeech/' + query2,
                            active: false,
                            children: []
                        }, {
                            id: 'customerSetup-domainList-liveTimestamp',
                            name: '时间戳+共享秘钥防盗链',
                            hash: 'index.html#/domainList/' + query + '/liveTimestamp/' + query2,
                            active: false,
                            children: []
                        }]
                    }, {
                        id: 'customerSetup-domainList-liveOptimize',
                        name: '直播业务优化',
                        hash: 'javascript:void(0)',
                        children: [{
                            id: 'customerSetup-domainList-liveBusOptimize',
                            name: '业务优化配置',
                            hash: 'index.html#/domainList/' + query + '/liveBusOptimize/' + query2,
                            active: false,
                            children: []
                        }, {
                            id: 'customerSetup-domainList-liveH265Setup',
                            name: 'H265配置',
                            hash: 'index.html#/domainList/' + query + '/liveH265Setup/' + query2,
                            active: false,
                            children: []
                        }, {
                            id: 'customerSetup-domainList-liveAudioOnly',
                            name: '纯音频拉流',
                            hash: 'index.html#/domainList/' + query + '/liveAudioOnly/' + query2,
                            active: false,
                            children: []
                        }, {
                            id: 'customerSetup-domainList-liveEdge302',
                            name: '边缘302',
                            hash: 'index.html#/domainList/' + query + '/liveEdge302/' + query2,
                            active: false,
                            children: []
                        }]
                    }, {
                        id: 'customerSetup-domainList-liveHttpFlvOptimize',
                        name: 'PK优化配置',
                        hash: 'index.html#/domainList/' + query + '/liveHttpFlvOptimize/' + query2,
                        children: []
                    },{
                        id: 'customerSetup-domainList-liveSLASetup',
                        name: '日志配置',
                        hash: 'javascript:void(0)',
                        children: [{
                            id: 'customerSetup-domainList-liveSLAStatistics',
                            name: 'SLA统计配置',
                            hash: 'index.html#/domainList/' + query + '/liveSLAStatistics/' + query2,
                            active: false,
                            children: []
                        }, {
                            id: 'customerSetup-domainList-liveFrequencyLog',
                            name: '变频日志配置',
                            hash: 'index.html#/domainList/' + query + '/liveFrequencyLog/' + query2,
                            active: false,
                            children: []
                        }]
                    }
                ];

                if (!this.domainManageNavbar) {
                    var menuOptions = {
                        query: query,
                        query2: query2,
                        menuList: menu,
                        backHash: 'index.html#/domainList/' + query
                    }
                    this.domainManageNavbar = new SubNavbar(menuOptions);
                    this.domainManageNavbar.select(this.curPage);
                }
            },

            setupLiveUpDomainManageNavbar: function(query, query2) {
                var menu = [{
                        id: 'customerSetup-domainList-liveUpBasicInformation',
                        name: '基本信息',
                        hash: 'index.html#/domainList/' + query + '/liveUpBasicInformation/' + query2,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-liveUpBackOriginSetup',
                        name: '源站配置',
                        hash: 'index.html#/domainList/' + query + '/liveUpBackOriginSetup/' + query2,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-liveUpFlowNameChange',
                        name: '流名变换',
                        hash: 'index.html#/domainList/' + query + '/liveUpFlowNameChange/' + query2,
                        children: []
                    }
                ];

                if (!this.domainManageNavbar) {
                    var menuOptions = {
                        query: query,
                        query2: query2,
                        menuList: menu,
                        backHash: 'index.html#/domainList/' + query
                    }
                    this.domainManageNavbar = new SubNavbar(menuOptions);
                    this.domainManageNavbar.select(this.curPage);
                }
            },

            setupCustomerSetupNavbar: function(query) {
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
                        }, {
                            id: 'customerSetup-blockUrl',
                            name: '一键屏蔽URL',
                            hash: 'index.html#/blockUrl/' + query,
                            active: false,
                            children: []
                        }, {
                            id: 'customerSetup-interfaceQuota',
                            name: 'API接口配额',
                            notShow: !AUTH_OBJ.OpenApiQuota,
                            hash: 'index.html#/interfaceQuota/' + query,
                            active: false,
                            children: []
                        },{
                            id: 'customerSetup-pnoSetup',
                            name: 'PNO列表配置',
                            hash: 'index.html#/pnoSetup/' + query,
                            active: false,
                            children: []
                        }]
                    }],
                    menuOptions = {
                        backHash: "index.html#/customerSetup",
                        menuList: menu
                    };

                if (!this.customerSetupNavbar) {
                    this.customerSetupNavbar = new SubNavbar(menuOptions);
                    this.customerSetupNavbar.select(this.curPage);
                }
            },

            setupLogSetupDomainManageNavbar: function(query, query2) {
                var menu = [{
                    id: 'customerSetup-domainList-openAPILogSetup',
                    name: '日志配置',
                    hash: 'index.html#/domainList/' + query + '/openAPILogSetup/' + query2,
                    children: []
                }];

                if (!this.domainManageNavbar) {
                    var menuOptions = {
                        query: query,
                        query2: query2,
                        menuList: menu,
                        backHash: 'index.html#/domainList/' + query
                    }
                    this.domainManageNavbar = new SubNavbar(menuOptions);
                    this.domainManageNavbar.select(this.curPage);
                }
            },

            removeSubSideBar: function() {
                //从域名列表页面、新域名管理页面进入到其他一级导航页面移除域名列表的二级导航、新域名管理的二级导航
                if (this.curPage.indexOf("customerSetup-") == -1 &&
                    this.curPage.indexOf("customerSetup-domainList-") == -1) {
                    if (this.customerSetupNavbar) {
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
                    this.domainManageNavbar) {
                    this.domainManageNavbar.$el.remove();
                    this.domainManageNavbar = null;
                }
                //从下发页面进入到其他一级页面移除下发管理的二级导航
                if (this.curPage.indexOf("setupSend") === -1 && this.setupSendNavbar) {
                    this.setupSendNavbar.$el.remove();
                    this.setupSendNavbar = null;
                }
            },

            sharedSetup: function(query) {
                //if (!AUTH_OBJ.OpenApiLogManager) return;
                require(['sharedSetup.view', 'sharedSetup.model'], function(SharedSetupView, SharedSetupModel) {
                    this.curPage = 'sharedSetup';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    var renderTarget = $('.ksc-content')
                    if (!this.sharedSetupModel)
                        this.sharedSetupModel = new SharedSetupModel();
                    if (!this.sharedSetupView) {
                        var options = {
                            collection: this.sharedSetupModel,
                            query: query
                        };
                        this.sharedSetupView = new SharedSetupView(options);
                        this.sharedSetupView.render(renderTarget);
                    } else {
                        this.sharedSetupView.update(renderTarget, query);
                    }
                    this.curView = this.sharedSetupView;
                }.bind(this));
            },

            isomorphismManage: function() {
                //if (!AUTH_OBJ.OpenApiLogManager) return;
                require(['isomorphismManage.view', 'isomorphismManage.model'], function(IsomorphismManageView, IsomorphismManageModel) {
                    this.curPage = 'isomorphismManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    var renderTarget = $('.ksc-content')
                    if (!this.isomorphismManageModel)
                        this.isomorphismManageModel = new IsomorphismManageModel();
                    if (!this.isomorphismManageView) {
                        var options = {
                            collection: this.isomorphismManageModel
                        };
                        this.isomorphismManageView = new IsomorphismManageView(options);
                        this.isomorphismManageView.render(renderTarget);
                    } else {
                        this.isomorphismManageView.update(renderTarget);
                    }
                    this.curView = this.isomorphismManageView;
                }.bind(this));
            },

            openAPILogSetup: function(query, query2) {
                if (!AUTH_OBJ.OpenApiLogManager) return;
                require(['openAPILogSetup.view', 'openAPILogSetup.model'], function(OpenAPILogSetupView, OpenAPILogSetupModel) {
                    
                    if (this.customerSetupNavbar) {
                        this.customerSetupNavbar.$el.remove();
                        this.customerSetupNavbar = null;
                    }
                    
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-openAPILogSetup';
                    this.setupLogSetupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.openAPILogSetupModel)
                        this.openAPILogSetupModel = new OpenAPILogSetupModel();
                    if (!this.openAPILogSetupView) {
                        var options = {
                            collection: this.openAPILogSetupModel,
                            query: query,
                            query2: query2
                        };
                        this.openAPILogSetupView = new OpenAPILogSetupView(options);
                        this.openAPILogSetupView.render(renderTarget);
                    } else {
                        this.openAPILogSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.openAPILogSetupView;
                }.bind(this));
            },

            liveUpFlowNameChange: function(query, query2) {
                require(['liveUpFlowNameChange.view', 'liveUpFlowNameChange.model'], function (LiveUpFlowNameChangeView, LiveUpFlowNameChangeModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveUpFlowNameChange';
                    this.setupLiveUpDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveUpFlowNameChangeModel)
                        this.liveUpFlowNameChangeModel = new LiveUpFlowNameChangeModel();
                    if (!this.liveUpFlowNameChangeView) {
                        var options = {
                            collection: this.liveUpFlowNameChangeModel,
                            query: query,
                            query2: query2
                        };
                        this.liveUpFlowNameChangeView = new LiveUpFlowNameChangeView(options);
                        this.liveUpFlowNameChangeView.render(renderTarget);
                    } else {
                        this.liveUpFlowNameChangeView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveUpFlowNameChangeView;    
                }.bind(this));
            },

            liveUpBackOriginSetup: function(query, query2) {
                require(['liveUpBackOriginSetup.view', 'liveUpBackOriginSetup.model'], function(LiveUpBackOriginSetupView, LiveUpBackOriginSetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveUpBackOriginSetup';
                    this.setupLiveUpDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveUpBackOriginSetupModel)
                        this.liveUpBackOriginSetupModel = new LiveUpBackOriginSetupModel();
                    if (!this.liveUpBackOriginSetupView) {
                        var options = {
                            collection: this.liveUpBackOriginSetupModel,
                            query: query,
                            query2: query2
                        };
                        this.liveUpBackOriginSetupView = new LiveUpBackOriginSetupView(options);
                        this.liveUpBackOriginSetupView.render(renderTarget);
                    } else {
                        this.liveUpBackOriginSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveUpBackOriginSetupView;    
                }.bind(this));
            },

            liveUpBasicInformation: function(query, query2) {
                require(['liveUpBasicInformation.view', 'liveUpBasicInformation.model'], function(LiveUpBasicInformationView, LiveUpInformationModel) {
                    //一级菜单选中域名配置
                    this.navbarView.select('customerSetup');
                    //设置当前页面ID
                    this.curPage = 'customerSetup-domainList-liveUpBasicInformation';
                    //移除用户域名列表二级菜单
                    if (this.customerSetupNavbar) {
                        this.customerSetupNavbar.$el.remove();
                        this.customerSetupNavbar = null;
                    }
                    //生成直播域名管理三级菜单
                    this.setupLiveUpDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveUpBasicInformationModel)
                        this.liveUpBasicInformationModel = new LiveUpInformationModel();
                    if (!this.liveUpBasicInformationView) {
                        var options = {
                            collection: this.liveUpBasicInformationModel,
                            query: query,
                            query2: query2
                        };
                        this.liveUpBasicInformationView = new LiveUpBasicInformationView(options);
                        this.liveUpBasicInformationView.render(renderTarget);
                    } else {
                        this.liveUpBasicInformationView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveUpBasicInformationView;    
                }.bind(this));
            },

            specialLayerManage: function() {
                if (!AUTH_OBJ.LayeredStrategyManage) return;
                require(['specialLayerManage.view', 'specialLayerManage.model'], function(SpecialLayerManageView, SpecialLayerManageModel) {
                    this.curPage = 'specialLayerManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.specialLayerManageModel)
                        this.specialLayerManageModel = new SpecialLayerManageModel();
                    if (!this.specialLayerManageView) {
                        var options = {
                            collection: this.specialLayerManageModel
                        };
                        this.specialLayerManageView = new SpecialLayerManageView(options);
                        this.specialLayerManageView.render($('.ksc-content'));
                    } else {
                        this.specialLayerManageView.update($('.ksc-content'));
                    }
                    this.curView = this.specialLayerManageView;
                }.bind(this));
            },

            importDomainManage: function() {
                if (!AUTH_OBJ.AccessDomainManage) return;
                require(['importDomainManage.view', 'importDomainManage.model'], function(ImportDomainManageView, ImportDomainManageModel) {
                    this.curPage = 'importDomainManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.importDomainManageModel)
                        this.importDomainManageModel = new ImportDomainManageModel();
                    if (!this.importDomainManageView) {
                        var options = {
                            collection: this.importDomainManageModel
                        };
                        this.importDomainManageView = new ImportDomainManageView(options);
                        this.importDomainManageView.render($('.ksc-content'));
                    } else {
                        this.importDomainManageView.update();
                    }
                    this.curView = this.importDomainManageView;
                }.bind(this));
            },

            importAssess: function() {
                require(['importAssess.view', 'importAssess.model'], function(ImportAssessView, ImportAssessModel) {
                    this.curPage = 'importAssess';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.importAssessModel)
                        this.importAssessModel = new ImportAssessModel();
                    if (!this.importAssessView) {
                        var options = {
                            collection: this.importAssessModel
                        };
                        this.importAssessView = new ImportAssessView(options);
                        this.importAssessView.render($('.ksc-content'));
                    } else {
                        this.importAssessView.update();
                    }
                    this.curView = this.importAssessView;
                }.bind(this));
            },

            setupTopoManage: function() {
                require(['setupTopoManage.view', 'setupTopoManage.model'], function(SetupTopoManageView, SetupTopoManageModel) {
                    this.curPage = 'setupTopoManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.setupTopoManageModel)
                        this.setupTopoManageModel = new SetupTopoManageModel();
                    if (!this.setupTopoManageView) {
                        var options = {
                            collection: this.setupTopoManageModel
                        };
                        this.setupTopoManageView = new SetupTopoManageView(options);
                        this.setupTopoManageView.render($('.ksc-content'));
                    } else {
                        this.setupTopoManageView.update($('.ksc-content'));
                    }
                    this.curView = this.setupTopoManageView;
                }.bind(this));
            },

            setupAppManage: function() {
                require(['setupAppManage.view', 'setupAppManage.model'], function(SetupAppManageView, SetupAppManageModel) {
                    this.curPage = 'setupAppManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.setupAppManageModel)
                        this.setupAppManageModel = new SetupAppManageModel();
                    if (!this.setupAppManageView) {
                        var options = {
                            collection: this.setupAppManageModel
                        };
                        this.setupAppManageView = new SetupAppManageView(options);
                        this.setupAppManageView.render($('.ksc-content'));
                    } else {
                        this.setupAppManageView.update($('.ksc-content'));
                    }
                    this.curView = this.setupAppManageView;
                }.bind(this));
            },

            setupChannelManage: function() {
                if (!AUTH_OBJ.ManageDomain) return;
                require(['setupChannelManage.view', 'setupChannelManage.model'], function(SetupChannelManageView, SetupChannelManageModel) {
                    this.curPage = 'setupChannelManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.setupChannelManageModel)
                        this.setupChannelManageModel = new SetupChannelManageModel();
                    if (!this.setupChannelManageView) {
                        var options = {
                            collection: this.setupChannelManageModel
                        };
                        this.setupChannelManageView = new SetupChannelManageView(options);
                        this.setupChannelManageView.render($('.ksc-content'));
                    } else {
                        this.setupChannelManageView.update();
                    }
                    this.curView = this.setupChannelManageView;
                }.bind(this));
            },

            customMaintenance: function() {
                require(['customMaintenance.view', 'customMaintenance.model'], function(CustomMaintenanceView, CustomMaintenanceModel) {
                    this.curPage = 'customMaintenance';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.customMaintenanceModel)
                        this.customMaintenanceModel = new CustomMaintenanceModel();
                    if (!this.customMaintenanceView) {
                        var options = {
                            collection: this.customMaintenanceModel
                        };
                        this.customMaintenanceView = new CustomMaintenanceView(options);
                        this.customMaintenanceView.render($('.ksc-content'));
                    } else {
                        this.customMaintenanceView.update();
                    }
                    this.curView = this.customMaintenanceView;
                }.bind(this));
            },

            refreshManual: function() {
                require(['refreshManual.view', 'refreshManual.model'], function(RefreshManualView, RefreshManualModel) {
                    this.curPage = 'refreshManual';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.refreshManualModel)
                        this.refreshManualModel = new RefreshManualModel();
                    if (!this.refreshManualView) {
                        var options = {
                            collection: this.refreshManualModel
                        };
                        this.refreshManualView = new RefreshManualView(options);
                        this.refreshManualView.render($('.ksc-content'));
                    } else {
                        this.refreshManualView.update();
                    }
                    this.curView = this.refreshManualView;
                }.bind(this));
            },

            businessManage: function() {
                if (!AUTH_OBJ.ManageNodeGroups) return;
                require(['businessManage.view', 'businessManage.model', 'nodeManage.model'], function(BusinessManageView, BusinessManageModel, NodeManageModel) {
                    this.curPage = 'businessManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.businessManageModel)
                        this.businessManageModel = new BusinessManageModel();
                    if (!this.nodeManageModel)
                        this.nodeManageModel = new NodeManageModel();
                    if (!this.businessManageView) {
                        var options = {
                            collection: this.businessManageModel,
                            nodeCollection: this.nodeManageModel
                        };
                        this.businessManageView = new BusinessManageView(options);
                        this.businessManageView.render($('.ksc-content'));
                    } else {
                        this.businessManageView.update();
                    }
                    this.curView = this.businessManageView;
                }.bind(this));
            },

            ipManage: function() {
                if (!AUTH_OBJ.ManageIPs) return;
                require(['ipManage.view', 'ipManage.model', 'deviceManage.model'], function(IPManageView, IPManageModel, DeviceManageModel) {
                    this.curPage = 'ipManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.ipManageModel)
                        this.ipManageModel = new IPManageModel();
                    if (!this.deviceManageModel)
                        this.deviceManageModel = new DeviceManageModel();
                    if (!this.ipManageView) {
                        var options = {
                            collection: this.ipManageModel,
                            deviceCollection: this.deviceManageModel
                        };
                        this.ipManageView = new IPManageView(options);
                        this.ipManageView.render($('.ksc-content'));
                    } else {
                        this.ipManageView.update($('.ksc-content'));
                    }
                    this.curView = this.ipManageView;
                }.bind(this));
            },

            liveCurentSetup: function() {
                if (!AUTH_OBJ.CurrentConfigurations) return;
                require(['liveCurentSetup.view', 'liveCurentSetup.model'], function(LiveCurentSetupView, LiveCurentSetupModel) {
                    this.curPage = 'liveCurentSetup';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.liveCurentSetupModel)
                        this.liveCurentSetupModel = new LiveCurentSetupModel();
                    if (!this.liveCurentSetupView) {
                        var options = {
                            collection: this.liveCurentSetupModel
                        };
                        this.liveCurentSetupView = new LiveCurentSetupView(options);
                        this.liveCurentSetupView.render($('.ksc-content'));
                    } else {
                        this.liveCurentSetupView.update();
                    }
                    this.curView = this.liveCurentSetupView;
                }.bind(this));
            },

            liveAllSetup: function() {
                if (!AUTH_OBJ.ManageConfigs) return;
                require(['liveAllSetup.view', 'liveAllSetup.model'], function(LiveAllSetupView, LiveAllSetupModel) {
                    this.curPage = 'liveAllSetup';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.liveAllSetupModel)
                        this.liveAllSetupModel = new LiveAllSetupModel();
                    if (!this.liveAllSetupView) {
                        var options = {
                            collection: this.liveAllSetupModel
                        };
                        this.liveAllSetupView = new LiveAllSetupView(options);
                        this.liveAllSetupView.render($('.ksc-content'));
                    } else {
                        this.liveAllSetupView.update();
                    }
                    this.curView = this.liveAllSetupView;
                }.bind(this));
            },

            coverManage: function() {
                if (!AUTH_OBJ.ManageCoverrelateds) return;
                require(['coverManage.view', 'coverManage.model', 'nodeManage.model'], function(CoverManageView, CoverManageModel, NodeManageModel) {
                    this.curPage = 'coverManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.coverManageModel)
                        this.coverManageModel = new CoverManageModel();
                    if (!this.nodeManageModel)
                        this.nodeManageModel = new NodeManageModel();
                    if (!this.coverManageView) {
                        var options = {
                            collection: this.coverManageModel,
                            nodeCollection: this.nodeManageModel
                        };
                        this.coverManageView = new CoverManageView(options);
                        this.coverManageView.render($('.ksc-content'));
                    } else {
                        this.coverManageView.update();
                    }
                    this.curView = this.coverManageView;
                }.bind(this));
            },

            coverRegion: function() {
                if (!AUTH_OBJ.Coverrelateds) return;
                require(['coverRegion.view', 'coverRegion.model'], function(CoverRegionView, CoverRegionModel) {
                    this.curPage = 'coverRegion';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.coverRegionModel)
                        this.coverRegionModel = new CoverRegionModel();
                    if (!this.coverRegionView) {
                        var options = {
                            collection: this.coverRegionModel
                        };
                        this.coverRegionView = new CoverRegionView(options);
                        this.coverRegionView.render($('.ksc-content'));
                    } else {
                        this.coverRegionView.update();
                    }
                    this.curView = this.coverRegionView;
                }.bind(this));
            },

            dispConfig: function() {
                if (!AUTH_OBJ.GslbConfig) return;
                require(['dispConfig.view', 'dispConfig.model', 'dispGroup.model'], function(DispConfigView, DispConfigModel, DispGroupModel) {
                    this.curPage = 'dispConfig';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.dispConfigModel)
                        this.dispConfigModel = new DispConfigModel();
                    if (!this.diffConfigModel)
                        this.diffConfigModel = new DispConfigModel();
                    if (!this.dispGroupModel)
                        this.dispGroupModel = new DispGroupModel();
                    if (!this.dispConfigView) {
                        var options = {
                            collection: this.dispConfigModel,
                            diffCollection: this.diffConfigModel,
                            dispGroupCollection: this.dispGroupModel
                        };
                        this.dispConfigView = new DispConfigView(options);
                        this.dispConfigView.render($('.ksc-content'));
                    } else {
                        this.dispConfigView.update($('.ksc-content'));
                    }
                    this.curView = this.dispConfigView;
                }.bind(this));
            },

            dispGroup: function() {
                if (!AUTH_OBJ.ManageGslbGroups) return;
                require(['dispGroup.view', 'dispGroup.model'], function(DispGroupView, DispGroupModel) {
                    this.curPage = 'dispGroup';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.dispGroupModel)
                        this.dispGroupModel = new DispGroupModel();
                    if (!this.dispGroupView) {
                        var options = {
                            collection: this.dispGroupModel
                        };
                        this.dispGroupView = new DispGroupView(options);
                        this.dispGroupView.render($('.ksc-content'));
                    } else {
                        this.dispGroupView.update();
                    }
                    this.curView = this.dispGroupView;
                }.bind(this));
            },

            nodeManage: function() {
                if (!AUTH_OBJ.ManageNodes) return;
                require(['nodeManage.view', 'nodeManage.model'], function(NodeManageView, NodeManageModel) {
                    this.curPage = 'nodeManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.nodeManageModel)
                        this.nodeManageModel = new NodeManageModel();
                    if (!this.nodeManageView) {
                        var options = {
                            collection: this.nodeManageModel
                        };
                        this.nodeManageView = new NodeManageView(options);
                        this.nodeManageView.render($('.ksc-content'));
                    } else {
                        this.nodeManageView.update();
                    }
                    this.curView = this.nodeManageView;
                }.bind(this));
            },

            deviceManage: function(query) {
                if (!AUTH_OBJ.ManageHosts) return;
                require(['deviceManage.view', 'deviceManage.model'], function(DeviceManageView, DeviceManageModel) {
                    this.curPage = 'deviceManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.deviceManageModel)
                        this.deviceManageModel = new DeviceManageModel();
                    if (!this.deviceManageView) {
                        var options = {
                            collection: this.deviceManageModel,
                            query: query
                        };
                        this.deviceManageView = new DeviceManageView(options);
                        this.deviceManageView.render($('.ksc-content'));
                    } else {
                        this.deviceManageView.update(query, $('.ksc-content'));
                    }
                    this.curView = this.deviceManageView;
                }.bind(this));
            },

            channelManage: function() {
                if (!AUTH_OBJ.ManageChannels) return;
                require(['channelManage.view', 'channelManage.model'], function(ChannelManageView, ChannelManageModel) {
                    this.curPage = 'channelManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.channelManageModel)
                        this.channelManageModel = new ChannelManageModel();
                    if (!this.channelManageView) {
                        var options = {
                            collection: this.channelManageModel
                        };
                        this.channelManageView = new ChannelManageView(options);
                        this.channelManageView.render($('.ksc-content'));
                    } else {
                        this.channelManageView.update();
                    }
                    this.curView = this.channelManageView;
                }.bind(this));
            },

            clientStatistics: function() {
                if (!AUTH_OBJ.KACustomersBandwidthStatistics) return;
                require(['clientStatistics.view', 'clientStatistics.model'], function(ClientStatisticsView, ClientStatisticsModel) {
                    this.curPage = 'clientStatistics';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.downloadClientStatisticsModel)
                        this.downloadClientStatisticsModel = new ClientStatisticsModel();
                    if (!this.liveClientStatisticsModel)
                        this.liveClientStatisticsModel = new ClientStatisticsModel();
                    if (!this.clientStatisticsView) {
                        var options = {
                            collection: this.downloadClientStatisticsModel,
                            liveCollection: this.liveClientStatisticsModel,
                        };
                        this.clientStatisticsView = new ClientStatisticsView(options);
                        this.clientStatisticsView.render($('.ksc-content'));
                    } else {
                        this.clientStatisticsView.update($('.ksc-content'));
                    }
                    this.curView = this.clientStatisticsView;
                }.bind(this));
            },

            domainStatistics: function() {
                if (!AUTH_OBJ.KADomainBandwidthStatistics) return;
                require(['domainStatistics.view', 'domainStatistics.model'], function(DomainStatisticsView, DomainStatisticsModel) {
                    this.curPage = 'domainStatistics';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.downloadDomainStatisticsModel)
                        this.downloadDomainStatisticsModel = new DomainStatisticsModel();
                    if (!this.liveDomainStatisticsModel)
                        this.liveDomainStatisticsModel = new DomainStatisticsModel();
                    if (!this.domainStatisticsView) {
                        var options = {
                            collection: this.downloadDomainStatisticsModel,
                            liveCollection: this.liveDomainStatisticsModel,
                        };
                        this.domainStatisticsView = new DomainStatisticsView(options);
                        this.domainStatisticsView.render($('.ksc-content'));
                    } else {
                        this.domainStatisticsView.update($('.ksc-content'));
                    }
                    this.curView = this.domainStatisticsView;
                }.bind(this));
            },

            statisticsManage: function() {
                if (!AUTH_OBJ.CustomerBandwidthStatistics) return;
                require(['statisticsManage.view', 'statisticsManage.model'], function(StatisticsManageView, StatisticsManageModel) {
                    this.curPage = 'statisticsManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.downloadStatisticsManageModel)
                        this.downloadStatisticsManageModel = new StatisticsManageModel();
                    if (!this.liveStatisticsManageModel)
                        this.liveStatisticsManageModel = new StatisticsManageModel();
                    if (!this.statisticsManageView) {
                        var options = {
                            collection: this.downloadStatisticsManageModel,
                            liveCollection: this.liveStatisticsManageModel,
                        };
                        this.statisticsManageView = new StatisticsManageView(options);
                        this.statisticsManageView.render($('.ksc-content'));
                    } else {
                        this.statisticsManageView.update($('.ksc-content'));
                    }
                    this.curView = this.statisticsManageView;
                }.bind(this));
            },

            domainManage: function() {
                require(['domainManage.view', 'domainManage.model'], function(DomainManageView, DomainManageModel) {
                    this.curPage = 'domainManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.domainManageModel)
                        this.domainManageModel = new DomainManageModel();
                    if (!this.domainManageView) {
                        var options = {
                            collection: this.domainManageModel
                        };
                        this.domainManageView = new DomainManageView(options);
                        this.domainManageView.render($('.ksc-content'));
                    } else {
                        this.domainManageView.update();
                    }
                    this.curView = this.domainManageView;
                }.bind(this));
            },

            grayscaleSetup: function() {
                require(['grayscaleSetup.view', 'grayscaleSetup.model'], function(GrayscaleSetupView, GrayscaleSetupModel) {
                    this.curPage = 'grayscaleSetup';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.grayscaleSetupModel)
                        this.grayscaleSetupModel = new GrayscaleSetupModel();
                    if (!this.grayscaleSetupView) {
                        var options = {
                            collection: this.grayscaleSetupModel
                        };
                        this.grayscaleSetupView = new GrayscaleSetupView(options);
                        this.grayscaleSetupView.render($('.ksc-content'));
                    } else {
                        this.grayscaleSetupView.update();
                    }
                    this.curView = this.grayscaleSetupView;
                }.bind(this));
            },

            templateManage: function() {
                require(['templateManage.view', 'templateManage.model'], function(TemplateManageView, TemplateManageModel) {
                    this.curPage = 'templateManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.templateManageModel)
                        this.templateManageModel = new TemplateManageModel();
                    if (!this.templateManageView) {
                        var options = {
                            collection: this.templateManageModel
                        };
                        this.templateManageView = new TemplateManageView(options);
                        this.templateManageView.render($('.ksc-content'));
                    } else {
                        this.templateManageView.update();
                    }
                    this.curView = this.templateManageView;
                }.bind(this));
            },

            openNgxLog: function(query, query2) {
                if (!AUTH_OBJ.LogServer) return;
                require(['openNgxLog.view', 'openNgxLog.model'], function(OpenNgxLogView, OpenNgxLogModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-openNgxLog';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.openNgxLogModel)
                        this.openNgxLogModel = new OpenNgxLogModel();
                    if (!this.openNgxLogView) {
                        var options = {
                            collection: this.openNgxLogModel,
                            query: query,
                            query2: query2
                        };
                        this.openNgxLogView = new OpenNgxLogView(options);
                        this.openNgxLogView.render(renderTarget);
                    } else {
                        this.openNgxLogView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.openNgxLogView;
                }.bind(this));
            },

            timestamp: function(query, query2) {
                if (!AUTH_OBJ.TimeSafetychain) return;
                require(['timestamp.view', 'timestamp.model'], function(TimestampView, TimestampModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-timestamp';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.timestampModel)
                        this.timestampModel = new TimestampModel();
                    if (!this.timestampView) {
                        var options = {
                            collection: this.timestampModel,
                            query: query,
                            query2: query2
                        };
                        this.timestampView = new TimestampView(options);
                        this.timestampView.render(renderTarget);
                    } else {
                        this.timestampView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.timestampView;
                }.bind(this));
            },

            refererAntiLeech: function(query, query2) {
                //if(!AUTH_OBJ.referIPMatchingCondition) return;
                require(['refererAntiLeech.view', 'refererAntiLeech.model'], function(RefererAntiLeechView, RefererAntiLeechModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-refererAntiLeech';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.refererAntiLeechModel)
                        this.refererAntiLeechModel = new RefererAntiLeechModel();
                    if (!this.refererAntiLeechView) {
                        var options = {
                            collection: this.refererAntiLeechModel,
                            query: query,
                            query2: query2
                        };
                        this.refererAntiLeechView = new RefererAntiLeechView(options);
                        this.refererAntiLeechView.render(renderTarget);
                    } else {
                        this.refererAntiLeechView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.refererAntiLeechView;
                }.bind(this));
            },

            ipBlackWhiteList: function(query, query2) {
                //if(!AUTH_OBJ.IPMatchingCondition) return;
                require(['ipBlackWhiteList.view', 'ipBlackWhiteList.model'], function(IpBlackWhiteListView, IpBlackWhiteListModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-ipBlackWhiteList';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.ipBlackWhiteListModel)
                        this.ipBlackWhiteListModel = new IpBlackWhiteListModel();
                    if (!this.ipBlackWhiteListView) {
                        var options = {
                            collection: this.ipBlackWhiteListModel,
                            query: query,
                            query2: query2
                        };
                        this.ipBlackWhiteListView = new IpBlackWhiteListView(options);
                        this.ipBlackWhiteListView.render(renderTarget);
                    } else {
                        this.ipBlackWhiteListView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.ipBlackWhiteListView;
                }.bind(this));
            },

            requestArgsModify: function(query, query2) {
                require(['requestArgsModify.view', 'requestArgsModify.model'], function(RequestArgsModifyView, RequestArgsModifyModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-requestArgsModify';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.requestArgsModifyModel)
                        this.requestArgsModifyModel = new RequestArgsModifyModel();
                    if (!this.requestArgsModifyView) {
                        var options = {
                            collection: this.requestArgsModifyModel,
                            query: query,
                            query2: query2
                        };
                        this.requestArgsModifyView = new RequestArgsModifyView(options);
                        this.requestArgsModifyView.render(renderTarget);
                    } else {
                        this.requestArgsModifyView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.requestArgsModifyView;
                }.bind(this));
            },

            httpHeaderCtr: function(query, query2) {
                if (!AUTH_OBJ.HttpheadControl) return;
                require(['httpHeaderCtr.view', 'httpHeaderCtr.model'], function(HttpHeaderCtrView, HttpHeaderCtrModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-httpHeaderCtr';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.httpHeaderCtrModel)
                        this.httpHeaderCtrModel = new HttpHeaderCtrModel();
                    if (!this.httpHeaderCtrView) {
                        var options = {
                            collection: this.httpHeaderCtrModel,
                            query: query,
                            query2: query2
                        };
                        this.httpHeaderCtrView = new HttpHeaderCtrView(options);
                        this.httpHeaderCtrView.render(renderTarget);
                    } else {
                        this.httpHeaderCtrView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.httpHeaderCtrView;
                }.bind(this));
            },

            httpHeaderOpt: function(query, query2) {
                if (!AUTH_OBJ.HttpheadControl) return;
                require(['httpHeaderOpt.view', 'httpHeaderOpt.model'], function(HttpHeaderOptView, HttpHeaderOptModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-httpHeaderOpt';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.httpHeaderOptModel)
                        this.httpHeaderOptModel = new HttpHeaderOptModel();
                    if (!this.httpHeaderOptView) {
                        var options = {
                            collection: this.httpHeaderOptModel,
                            query: query,
                            query2: query2
                        };
                        this.httpHeaderOptView = new HttpHeaderOptView(options);
                        this.httpHeaderOptView.render(renderTarget);
                    } else {
                        this.httpHeaderOptView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.httpHeaderOptView;
                }.bind(this));
            },

            clientLimitSpeed: function(query, query2) {
                if (!AUTH_OBJ.SpeedLimit) return;
                require(['clientLimitSpeed.view', 'clientLimitSpeed.model'], function(ClientLimitSpeedView, ClientLimitSpeedModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-clientLimitSpeed';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.clientLimitSpeedModel)
                        this.clientLimitSpeedModel = new ClientLimitSpeedModel();
                    if (!this.clientLimitSpeedView) {
                        var options = {
                            collection: this.clientLimitSpeedModel,
                            query: query,
                            query2: query2
                        };
                        this.clientLimitSpeedView = new ClientLimitSpeedView(options);
                        this.clientLimitSpeedView.render(renderTarget);
                    } else {
                        this.clientLimitSpeedView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.clientLimitSpeedView;
                }.bind(this));
            },

            dragPlay: function(query, query2) {
                if (!AUTH_OBJ.OndemandOptimization) return;
                require(['dragPlay.view', 'dragPlay.model'], function(DragPlayView, DragPlayModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-dragPlay';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.dragPlayModel)
                        this.dragPlayModel = new DragPlayModel();
                    if (!this.dragPlayView) {
                        var options = {
                            collection: this.dragPlayModel,
                            query: query,
                            query2: query2
                        };
                        this.dragPlayView = new DragPlayView(options);
                        this.dragPlayView.render(renderTarget);
                    } else {
                        this.dragPlayView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.dragPlayView;
                }.bind(this));
            },

            following302: function(query, query2) {
                require(['following302.view', 'following302.model'], function(Following302View, Following302Model) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-following302';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.following302Model)
                        this.following302Model = new Following302Model();
                    if (!this.following302View) {
                        var options = {
                            collection: this.following302Model,
                            query: query,
                            query2: query2
                        };
                        this.following302View = new Following302View(options);
                        this.following302View.render(renderTarget);
                    } else {
                        this.following302View.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.following302View;
                }.bind(this));
            },

            backOriginDetection: function(query, query2) {
                require(['backOriginDetection.view', 'backOriginDetection.model'], function(BackOriginDetectionView, BackOriginDetectionModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-backOriginDetection';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.backOriginDetectionModel)
                        this.backOriginDetectionModel = new BackOriginDetectionModel();
                    if (!this.backOriginDetectionView) {
                        var options = {
                            collection: this.backOriginDetectionModel,
                            query: query,
                            query2: query2
                        };
                        this.backOriginDetectionView = new BackOriginDetectionView(options);
                        this.backOriginDetectionView.render(renderTarget);
                    } else {
                        this.backOriginDetectionView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.backOriginDetectionView;
                }.bind(this));
            },

            backOriginSetup: function(query, query2) {
                require(['backOriginSetup.view', 'backOriginSetup.model'], function(BackOriginSetupView, BackOriginSetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-backOriginSetup';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.backOriginSetupModel)
                        this.backOriginSetupModel = new BackOriginSetupModel();
                    if (!this.backOriginSetupView) {
                        var options = {
                            collection: this.backOriginSetupModel,
                            query: query,
                            query2: query2
                        };
                        this.backOriginSetupView = new BackOriginSetupView(options);
                        this.backOriginSetupView.render(renderTarget);
                    } else {
                        this.backOriginSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.backOriginSetupView;
                }.bind(this));
            },

            cnameSetup: function(query, query2) {
                require(['cnameSetup.view', 'cnameSetup.model'], function(CnameSetupView, CnameSetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-cnameSetup';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.cnameSetupModel)
                        this.cnameSetupModel = new CnameSetupModel();
                    if (!this.cnameSetupView) {
                        var options = {
                            collection: this.cnameSetupModel,
                            query: query,
                            query2: query2
                        };
                        this.cnameSetupView = new CnameSetupView(options);
                        this.cnameSetupView.render(renderTarget);
                    } else {
                        this.cnameSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.cnameSetupView;
                }.bind(this));
            },

            cacheKeySetup: function(query, query2) {
                require(['cacheKeySetup.view', 'cacheKeySetup.model'], function(CacheKeySetupView, CacheKeySetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-cacheKeySetup';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.cacheKeySetupModel)
                        this.cacheKeySetupModel = new CacheKeySetupModel();
                    if (!this.cacheKeySetupView) {
                        var options = {
                            collection: this.cacheKeySetupModel,
                            query: query,
                            query2: query2
                        };
                        this.cacheKeySetupView = new CacheKeySetupView(options);
                        this.cacheKeySetupView.render(renderTarget);
                    } else {
                        this.cacheKeySetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.cacheKeySetupView;
                }.bind(this));
            },

            delMarkCache: function(query, query2) {
                require(['delMarkCache.view', 'delMarkCache.model'], function(DelMarkCacheView, DelMarkCacheModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-delMarkCache';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.delMarkCacheModel)
                        this.delMarkCacheModel = new DelMarkCacheModel();
                    if (!this.delMarkCacheView) {
                        var options = {
                            collection: this.delMarkCacheModel,
                            query: query,
                            query2: query2
                        };
                        this.delMarkCacheView = new DelMarkCacheView(options);
                        this.delMarkCacheView.render(renderTarget);
                    } else {
                        this.delMarkCacheView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.delMarkCacheView;
                }.bind(this));
            },

            cacheRule: function(query, query2) {
                require(['cacheRule.view', 'cacheRule.model'], function(CacheRuleView, CacheRuleModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-cacheRule';
                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.cacheRuleModel)
                        this.cacheRuleModel = new CacheRuleModel();
                    if (!this.cacheRuleView) {
                        var options = {
                            collection: this.cacheRuleModel,
                            query: query,
                            query2: query2
                        };
                        this.cacheRuleView = new CacheRuleView(options);
                        this.cacheRuleView.render(renderTarget);
                    } else {
                        this.cacheRuleView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.cacheRuleView;
                }.bind(this));
            },

            basicInformation: function(query, query2) {
                require(['basicInformation.view', 'basicInformation.model'], function(BasicInformationView, BasicInformationModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-basicInformation';
                    if (this.customerSetupNavbar) {
                        this.customerSetupNavbar.$el.remove();
                        this.customerSetupNavbar = null;
                    }

                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.basicInformationModel)
                        this.basicInformationModel = new BasicInformationModel();
                    if (!this.basicInformationView) {
                        var options = {
                            collection: this.basicInformationModel,
                            query: query,
                            query2: query2
                        };
                        this.basicInformationView = new BasicInformationView(options);
                        this.basicInformationView.render(renderTarget);
                    } else {
                        this.basicInformationView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.basicInformationView;
                }.bind(this));
            },

            urlBlackList: function(query, query2) {
                require(['urlBlackList.view', 'urlBlackList.model'], function(UrlBlackListView, UrlBlackListModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-urlBlackList';
                    if (this.customerSetupNavbar) {
                        this.customerSetupNavbar.$el.remove();
                        this.customerSetupNavbar = null;
                    }

                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.urlBlackListModel)
                        this.urlBlackListModel = new UrlBlackListModel();
                    if (!this.urlBlackListView) {
                        var options = {
                            collection: this.urlBlackListModel,
                            query: query,
                            query2: query2
                        };
                        this.urlBlackListView = new UrlBlackListView(options);
                        this.urlBlackListView.render(renderTarget);
                    } else {
                        this.urlBlackListView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.urlBlackListView;
                }.bind(this));
            },

            domainSetup: function(query, query2) {
                require(['domainSetup.view', 'domainSetup.model'], function(DomainSetupView, DomainSetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-domainSetup';

                    this.setupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.domainSetupModel)
                        this.domainSetupModel = new DomainSetupModel();
                    if (!this.domainSetupView) {
                        var options = {
                            collection: this.domainSetupModel,
                            query: query,
                            query2: query2
                        };
                        this.domainSetupView = new DomainSetupView(options);
                        this.domainSetupView.render(renderTarget);
                    } else {
                        this.domainSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.domainSetupView;
                }.bind(this));
            },

            domainList: function(query) {
                if (!AUTH_OBJ.DomainLists || !AUTH_OBJ.ManageCustomer) return;
                require(['domainList.view', 'domainList.model', 'subNavbar.view'], function(DomainListView, DomainListModel, SubNavbar) {
                    this.curPage = 'customerSetup-domainList';
                    this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                    this.setupCustomerSetupNavbar(query)
                    var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                    if (!this.domainListModel)
                        this.domainListModel = new DomainListModel();
                    if (!this.domainListView) {
                        var options = {
                            collection: this.domainListModel,
                            query: query
                        };
                        this.domainListView = new DomainListView(options);
                        this.domainListView.render(renderTarget);
                    } else {
                        this.domainListView.update(query, renderTarget);
                    }
                    this.customerSetupNavbar.select(this.curPage);
                    this.curView = this.domainListView;
                }.bind(this));
            },

            blockUrl: function(query) {
                require(['blockUrl.view', 'blockUrl.model'], function(BlockUrlView, BlockUrlModel) {
                    this.curPage = 'customerSetup-blockUrl';
                    this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                    this.setupCustomerSetupNavbar(query);
                    var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                    if (!this.blockUrlModel)
                        this.blockUrlModel = new BlockUrlModel();
                    if(this.blockUrlView){
                        this.blockUrlView.remove();
                        this.blockUrlView = null;
                    }
                    if (!this.blockUrlView) {
                        var options = {
                            collection: this.blockUrlModel,
                            query: query
                        };

                        this.blockUrlView = new BlockUrlView(options);
                        this.blockUrlView.renderload(renderTarget);

                        this.permissionsControlSuccess = function(res) {
                            res = JSON.parse(res);
                            if (res.result == null) {
                                this.blockUrlView.$elload.remove();
                                this.blockUrlView.renderError(renderTarget);
                            } else {
                                this.blockUrlView.$elload.remove();
                                this.blockUrlView.render(renderTarget);
                            }
                        }
                        this.onGetError = function(error) {
                            this.blockUrlView.$elload.remove();
                            if (error && error.message) {
                                alert(error.message);
                            } else {
                                alert('网络阻塞,请刷新重试');
                            }
                        }
                        query = JSON.parse(query);
                        this.blockUrlModel.off('permissionsControl.success');
                        this.blockUrlModel.off('permissionsControl.error');
                        this.blockUrlModel.on('permissionsControl.success', $.proxy(this.permissionsControlSuccess, this));
                        this.blockUrlModel.on('permissionsControl.error', $.proxy(this.onGetError, this));
                        this.blockUrlModel.permissionsControl({
                            userId: query.uid
                        });
                    } else {
                        this.blockUrlView.update(renderTarget);
                    }
                    this.customerSetupNavbar.select(this.curPage);
                    this.curView = this.blockUrlView;
                }.bind(this));
            },

            pnoSetup: function(query) {
                if (!AUTH_OBJ.DomainLists || !AUTH_OBJ.ManageCustomer ) return;
                require(['pnoSetup.view', 'pnoSetup.model'], function(PNOSetupView, PNOSetupModel) {
                    this.curPage = 'customerSetup-pnoSetup';
                    this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                    this.setupCustomerSetupNavbar(query)
                    var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                    if (!this.pnoSetupModel)
                        this.pnoSetupModel = new PNOSetupModel();
                    if (!this.pnoSetupView) {
                        var options = {
                            collection: this.pnoSetupModel,
                            query: query
                        };
                        this.pnoSetupView = new PNOSetupView(options);
                        this.pnoSetupView.render(renderTarget);
                    } else {
                        this.pnoSetupView.update(query, renderTarget);
                    }
                    this.customerSetupNavbar.select(this.curPage);
                    this.curView = this.pnoSetupView;
                }.bind(this));
            },

            interfaceQuota: function(query) {
                if (!AUTH_OBJ.DomainLists || !AUTH_OBJ.ManageCustomer || !AUTH_OBJ.OpenApiQuota) return;
                require(['interfaceQuota.view', 'interfaceQuota.model'], function(InterfaceQuotaView, InterfaceQuotaModel) {
                    this.curPage = 'customerSetup-interfaceQuota';
                    this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                    this.setupCustomerSetupNavbar(query)
                    var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                    if (!this.interfaceQuotaModel)
                        this.interfaceQuotaModel = new InterfaceQuotaModel();
                    if (!this.interfaceQuotaView) {
                        var options = {
                            collection: this.interfaceQuotaModel,
                            query: query
                        };
                        this.interfaceQuotaView = new InterfaceQuotaView(options);
                        this.interfaceQuotaView.render(renderTarget);
                    } else {
                        this.interfaceQuotaView.update(query, renderTarget);
                    }
                    this.customerSetupNavbar.select(this.curPage);
                    this.curView = this.interfaceQuotaView;
                }.bind(this));
            },

            customerSetup: function() {
                require(['customerSetup.view', 'customerSetup.model'], function(CustomerSetupView, CustomerSetupModel) {
                    this.curPage = 'customerSetup';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));

                    if (!this.customerSetupModel)
                        this.customerSetupModel = new CustomerSetupModel();
                    if (!this.customerSetupView) {
                        var options = {
                            collection: this.customerSetupModel
                        };
                        this.customerSetupView = new CustomerSetupView(options);
                        this.customerSetupView.render($('.ksc-content'));
                    } else {
                        this.customerSetupView.update();
                    }
                    this.curView = this.customerSetupView;
                }.bind(this));
            },

            setupSendDone: function() {
                if (!AUTH_OBJ.SendDone) return;
                require(['setupSendDone.view', 'setupSendDone.model'], function(SetupSendDoneView, SetupSendDoneModel) {
                    this.curPage = 'setupSendDone';
                    this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                    this.initSetupSendNavbar()
                    var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                    if (!this.setupSendDoneModel)
                        this.setupSendDoneModel = new SetupSendDoneModel();

                    if (!this.setupSendDoneView) {
                        var options = {
                            collection: this.setupSendDoneModel
                        };
                        this.setupSendDoneView = new SetupSendDoneView(options);
                        this.setupSendDoneView.render(renderTarget);
                    } else {
                        this.setupSendDoneView.update(renderTarget);
                    }
                    this.setupSendNavbar.select(this.curPage);
                    this.curView = this.setupSendDoneView;
                }.bind(this));
            },

            setupSending: function() {
                if (!AUTH_OBJ.Sending) return;
                require(['setupSending.view', 'setupSending.model'], function(SetupSendingView, SetupSendingModel) {
                    this.curPage = 'setupSending';
                    this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                    this.initSetupSendNavbar()
                    var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                    if (!this.setupSendingModel)
                        this.setupSendingModel = new SetupSendingModel();

                    if (!this.setupSendingView) {
                        var options = {
                            collection: this.setupSendingModel
                        };
                        this.setupSendingView = new SetupSendingView(options);
                        this.setupSendingView.render(renderTarget);
                    } else {
                        this.setupSendingView.update(renderTarget);
                    }
                    this.setupSendNavbar.select(this.curPage);
                    this.curView = this.setupSendingView;
                }.bind(this));
            },

            setupSendWaitCustomize: function() {
                if (!AUTH_OBJ.WaitCustomize) return;
                require(['setupSendWaitCustomize.view', 'setupSendWaitCustomize.model'], function(SetupSendWaitCustomizeView, SetupSendWaitCustomizeModel) {
                    this.curPage = 'setupSendWaitCustomize';
                    this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                    this.initSetupSendNavbar()
                    var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                    if (!this.setupSendWaitCustomizeModel)
                        this.setupSendWaitCustomizeModel = new SetupSendWaitCustomizeModel();

                    if (!this.setupSendWaitCustomizeView) {
                        var options = {
                            collection: this.setupSendWaitCustomizeModel
                        };
                        this.setupSendWaitCustomizeView = new SetupSendWaitCustomizeView(options);
                        this.setupSendWaitCustomizeView.render(renderTarget);
                    } else {
                        this.setupSendWaitCustomizeView.update(renderTarget);
                    }
                    this.setupSendNavbar.select(this.curPage);
                    this.curView = this.setupSendWaitCustomizeView;
                }.bind(this));
            },

            setupSendWaitSend: function() {
                if (!AUTH_OBJ.WaitSend) return;
                require(['setupSendWaitSend.view', 'setupSendWaitSend.model'], function(SetupSendWaitSendView, SetupSendWaitSendModel) {
                    this.curPage = 'setupSendWaitSend';
                    this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                    this.initSetupSendNavbar()
                    var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                    if (!this.setupSendWaitSendModel)
                        this.setupSendWaitSendModel = new SetupSendWaitSendModel();

                    if (!this.setupSendWaitSendView) {
                        var options = {
                            collection: this.setupSendWaitSendModel
                        };
                        this.setupSendWaitSendView = new SetupSendWaitSendView(options);
                        this.setupSendWaitSendView.render(renderTarget);
                    } else {
                        this.setupSendWaitSendView.update(renderTarget);
                    }
                    this.setupSendNavbar.select(this.curPage);
                    this.curView = this.setupSendWaitSendView;
                }.bind(this));
            },

            liveDomainSetup: function(query, query2) {
                require(['liveDomainSetup.view', 'liveDomainSetup.model'], function(LiveDomainSetupView, LiveDomainSetupModel) {
                    //一级菜单选中域名配置
                    this.navbarView.select('customerSetup');
                    //设置当前页面ID
                    this.curPage = 'customerSetup-domainList-liveDomainSetup';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveDomainSetupModel)
                        this.liveDomainSetupModel = new LiveDomainSetupModel();
                    if (!this.liveDomainSetupView) {
                        var options = {
                            collection: this.liveDomainSetupModel,
                            query: query,
                            query2: query2
                        };
                        this.liveDomainSetupView = new LiveDomainSetupView(options);
                        this.liveDomainSetupView.render(renderTarget);
                    } else {
                        this.liveDomainSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveDomainSetupView;
                }.bind(this));
            },

            liveCnameSetup: function(query, query2) {
                require(['liveCnameSetup.view', 'liveCnameSetup.model'], function(LiveCnameSetupView, LiveCnameSetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveCnameSetup';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveCnameSetupModel)
                        this.liveCnameSetupModel = new LiveCnameSetupModel();
                    if (!this.liveCnameSetupView) {
                        var options = {
                            collection: this.liveCnameSetupModel,
                            query: query,
                            query2: query2
                        };
                        this.liveCnameSetupView = new LiveCnameSetupView(options);
                        this.liveCnameSetupView.render(renderTarget);
                    } else {
                        this.liveCnameSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveCnameSetupView;
                }.bind(this));
            },

            liveHttpsSetup: function(query, query2) {
                require(['liveHttpsSetup.view', 'liveHttpsSetup.model'], function(LiveHttpsSetupView, LiveHttpsSetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveHttpsSetup';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveHttpsSetupModel)
                        this.liveHttpsSetupModel = new LiveHttpsSetupModel();
                    if (!this.liveHttpsSetupView) {
                        var options = {
                            collection: this.liveHttpsSetupModel,
                            query: query,
                            query2: query2
                        };
                        this.liveHttpsSetupView = new LiveHttpsSetupView(options);
                        this.liveHttpsSetupView.render(renderTarget);
                    } else {
                        this.liveHttpsSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveHttpsSetupView;
                }.bind(this));
            },

            liveBackOriginSetup: function(query, query2) {
                require(['liveBackOriginSetup.view', 'liveBackOriginSetup.model'], function(LiveBackOriginSetupView, LiveHttpsSetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveBackOriginSetup';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveHttpsSetupModel)
                        this.liveHttpsSetupModel = new LiveHttpsSetupModel();
                    if (!this.liveBackOriginSetupView) {
                        var options = {
                            collection: this.liveHttpsSetupModel,
                            query: query,
                            query2: query2
                        };
                        this.liveBackOriginSetupView = new LiveBackOriginSetupView(options);
                        this.liveBackOriginSetupView.render(renderTarget);
                    } else {
                        this.liveBackOriginSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveBackOriginSetupView;
                }.bind(this));
            },

            liveBackOriginDetection: function(query, query2) {
                require(['liveBackOriginDetection.view', 'liveBackOriginDetection.model'], function(LiveBackOriginDetectionView, LiveBackOriginDetectionModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveBackOriginDetection';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveBackOriginDetectionModel)
                        this.liveBackOriginDetectionModel = new LiveBackOriginDetectionModel();
                    if (!this.liveBackOriginDetectionView) {
                        var options = {
                            collection: this.liveBackOriginDetectionModel,
                            query: query,
                            query2: query2
                        };
                        this.liveBackOriginDetectionView = new LiveBackOriginDetectionView(options);
                        this.liveBackOriginDetectionView.render(renderTarget);
                    } else {
                        this.liveBackOriginDetectionView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveBackOriginDetectionView;
                }.bind(this));
            },

            liveRefererAntiLeech: function(query, query2) {
                require(['liveRefererAntiLeech.view', 'liveRefererAntiLeech.model'], function(LiveRefererAntiLeechView, LiveRefererAntiLeechModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveRefererAntiLeech';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveRefererAntiLeechModel)
                        this.liveRefererAntiLeechModel = new LiveRefererAntiLeechModel();
                    if (!this.liveRefererAntiLeechView) {
                        var options = {
                            collection: this.liveRefererAntiLeechModel,
                            query: query,
                            query2: query2
                        };
                        this.liveRefererAntiLeechView = new LiveRefererAntiLeechView(options);
                        this.liveRefererAntiLeechView.render(renderTarget);
                    } else {
                        this.liveRefererAntiLeechView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveRefererAntiLeechView;
                }.bind(this));
            },

            liveTimestamp: function(query, query2) {
                require(['liveTimestamp.view', 'liveTimestamp.model'], function(LiveTimestampView, LiveTimestampModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveTimestamp';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveTimestampModel)
                        this.liveTimestampModel = new LiveTimestampModel();
                    if (!this.liveTimestampView) {
                        var options = {
                            collection: this.liveTimestampModel,
                            query: query,
                            query2: query2
                        };
                        this.liveTimestampView = new LiveTimestampView(options);
                        this.liveTimestampView.render(renderTarget);
                    } else {
                        this.liveTimestampView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveTimestampView;
                }.bind(this));
            },

            liveBasicInformation: function(query, query2) {
                require(['liveBasicInformation.view', 'liveBasicInformation.model'], function(LiveBasicInformationView, LiveInformationModel) {
                    //一级菜单选中域名配置
                    this.navbarView.select('customerSetup');
                    //设置当前页面ID
                    this.curPage = 'customerSetup-domainList-liveBasicInformation';
                    //移除用户域名列表二级菜单
                    if (this.customerSetupNavbar) {
                        this.customerSetupNavbar.$el.remove();
                        this.customerSetupNavbar = null;
                    }
                    //生成直播域名管理三级菜单
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveBasicInformationModel)
                        this.liveBasicInformationModel = new LiveInformationModel();
                    if (!this.liveBasicInformationView) {
                        var options = {
                            collection: this.liveBasicInformationModel,
                            query: query,
                            query2: query2
                        };
                        this.liveBasicInformationView = new LiveBasicInformationView(options);
                        this.liveBasicInformationView.render(renderTarget);
                    } else {
                        this.liveBasicInformationView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveBasicInformationView;
                }.bind(this));
            },

            liveBusOptimize: function(query, query2) {
                require(['liveBusOptimize.view', 'liveBusOptimize.model'], function(LiveBusOptimizeView, LiveBusOptimizeModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveBusOptimize';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveBusOptimizeModel)
                        this.liveBusOptimizeModel = new LiveBusOptimizeModel();
                    if (!this.liveBusOptimizeView) {
                        var options = {
                            collection: this.liveBusOptimizeModel,
                            query: query,
                            query2: query2
                        };
                        this.liveBusOptimizeView = new LiveBusOptimizeView(options);
                        this.liveBusOptimizeView.render(renderTarget);
                    } else {
                        this.liveBusOptimizeView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveBusOptimizeView;
                }.bind(this));
            },

            liveH265Setup: function(query, query2) {
                require(['liveH265Setup.view', 'liveH265Setup.model'], function(LiveH265SetupView, LiveH265SetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveH265Setup';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveH265SetupModel)
                        this.liveH265SetupModel = new LiveH265SetupModel();
                    if (!this.liveH265SetupView) {
                        var options = {
                            collection: this.liveH265SetupModel,
                            query: query,
                            query2: query2
                        };
                        this.liveH265SetupView = new LiveH265SetupView(options);
                        this.liveH265SetupView.render(renderTarget);
                    } else {
                        this.liveH265SetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveH265SetupView;
                }.bind(this));
            },

            liveAudioOnly: function(query, query2) {
                require(['liveAudioOnly.view', 'liveAudioOnly.model'], function(LiveAudioOnlyView, LiveAudioOnlyModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveAudioOnly';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveAudioOnlyModel)
                        this.liveAudioOnlyModel = new LiveAudioOnlyModel();
                    if (!this.liveAudioOnlyView) {
                        var options = {
                            collection: this.liveAudioOnlyModel,
                            query: query,
                            query2: query2
                        };
                        this.liveAudioOnlyView = new LiveAudioOnlyView(options);
                        this.liveAudioOnlyView.render(renderTarget);
                    } else {
                        this.liveAudioOnlyView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveAudioOnlyView;
                }.bind(this));
            },

            liveEdge302: function(query, query2) {
                require(['liveEdge302.view', 'liveEdge302.model'], function(LiveEdge302View, LiveEdge302Model) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveEdge302';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveEdge302Model)
                        this.liveEdge302Model = new LiveEdge302Model();
                    if (!this.liveEdge302View) {
                        var options = {
                            collection: this.liveEdge302Model,
                            query: query,
                            query2: query2
                        };
                        this.liveEdge302View = new LiveEdge302View(options);
                        this.liveEdge302View.render(renderTarget);
                    } else {
                        this.liveEdge302View.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveEdge302View;
                }.bind(this));
            },

            liveHttpFlvOptimize: function(query, query2) {
                require(['liveHttpFlvOptimize.view', 'liveHttpFlvOptimize.model'], function(LiveHttpFlvOptimizeView, LiveHttpFlvOptimizeModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveHttpFlvOptimize';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveHttpFlvOptimizeModel)
                        this.liveHttpFlvOptimizeModel = new LiveHttpFlvOptimizeModel();
                    if (!this.liveHttpFlvOptimizeView) {
                        var options = {
                            collection: this.liveHttpFlvOptimizeModel,
                            query: query,
                            query2: query2
                        };
                        this.liveHttpFlvOptimizeView = new LiveHttpFlvOptimizeView(options);
                        this.liveHttpFlvOptimizeView.render(renderTarget);
                    } else {
                        this.liveHttpFlvOptimizeView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveHttpFlvOptimizeView;
                }.bind(this));
            },

            liveRtmpOptimize: function(query, query2) {
                require(['liveRtmpOptimize.view', 'liveRtmpOptimize.model'], function(LiveRtmpOptimizeView, LiveRtmpOptimizeModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveRtmpOptimize';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveRtmpOptimizeModel)
                        this.liveRtmpOptimizeModel = new LiveRtmpOptimizeModel();
                    if (!this.liveRtmpOptimizeView) {
                        var options = {
                            collection: this.liveRtmpOptimizeModel,
                            query: query,
                            query2: query2
                        };
                        this.liveRtmpOptimizeView = new LiveRtmpOptimizeView(options);
                        this.liveRtmpOptimizeView.render(renderTarget);
                    } else {
                        this.liveRtmpOptimizeView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveRtmpOptimizeView;
                }.bind(this));
            },

            liveSLAStatistics: function(query, query2) {
                require(['liveSLAStatistics.view', 'liveSLAStatistics.model'], function(LiveSLAStatisticsView, LiveSLAStatisticsModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveSLAStatistics';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveSLAStatisticsModel)
                        this.liveSLAStatisticsModel = new LiveSLAStatisticsModel();
                    if (!this.liveSLAStatisticsView) {
                        var options = {
                            collection: this.liveSLAStatisticsModel,
                            query: query,
                            query2: query2
                        };
                        this.liveSLAStatisticsView = new LiveSLAStatisticsView(options);
                        this.liveSLAStatisticsView.render(renderTarget);
                    } else {
                        this.liveSLAStatisticsView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveSLAStatisticsView;
                }.bind(this));
            },

            liveFrequencyLog: function(query, query2) {
                require(['liveFrequencyLog.view', 'liveFrequencyLog.model'], function(LiveFrequencyLogView, LiveFrequencyLogModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-liveFrequencyLog';
                    this.setupLiveDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.liveFrequencyLogModel)
                        this.liveFrequencyLogModel = new LiveFrequencyLogModel();
                    if (!this.liveFrequencyLogView) {
                        var options = {
                            collection: this.liveFrequencyLogModel,
                            query: query,
                            query2: query2
                        };
                        this.liveFrequencyLogView = new LiveFrequencyLogView(options);
                        this.liveFrequencyLogView.render(renderTarget);
                    } else {
                        this.liveFrequencyLogView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.liveFrequencyLogView;
                }.bind(this));
            },
        });
        exports.Workspace = new Workspace();
    });