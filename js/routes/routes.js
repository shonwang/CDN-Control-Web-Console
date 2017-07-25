define("routes", ['require', 'exports', 'navbar.view', 
                  'routes.subNavbar', 
                  'routes.resourceManage', 
                  'routes.ngnixDownloadSetup',
                  'routes.liveSetup'
                  'routes.other'],
    function(require, exports, NavbarView, 
        RouterSubNavbar, 
        RouterResourceManage, 
        RouterNgnixDownloadSetup,
        RouterLiveSetup,
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
                        this.domainManageNavbar.select(this.curPage);
                        this.openAPILogSetupView.update(query, query2, renderTarget);
                    }
                    this.curView = this.openAPILogSetupView;
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
                        this.customerSetupNavbar.select(this.curPage);
                        this.domainListView.update(query, renderTarget);
                    }
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
                    }
                    else{
                        this.customerSetupNavbar.select(this.curPage);
                        this.blockUrlView.update(renderTarget);
                    }
                    this.curView = this.blockUrlView;
                }.bind(this));
            },

            interfaceQuota: function(query) {
                if (!AUTH_OBJ.DomainLists || !AUTH_OBJ.ManageCustomer || !AUTH_OBJ.OpenApiQuota) return;
                require(['interfaceQuota.view', 'interfaceQuota.model'], function(DomainListView, DomainListModel) {
                    this.curPage = 'customerSetup-interfaceQuota';
                    this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                    this.setupCustomerSetupNavbar(query)
                    var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                    if (!this.interfaceQuotaModel)
                        this.interfaceQuotaModel = new DomainListModel();
                    if (!this.interfaceQuotaView) {
                        var options = {
                            collection: this.interfaceQuotaModel,
                            query: query
                        };
                        this.interfaceQuotaView = new DomainListView(options);
                        this.interfaceQuotaView.render(renderTarget);
                    } else {
                        this.customerSetupNavbar.select(this.curPage);
                        this.interfaceQuotaView.update(query, renderTarget);
                    }
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
                        this.setupSendNavbar.select(this.curPage);
                        this.setupSendDoneView.update(renderTarget);
                    }
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
                        this.setupSendNavbar.select(this.curPage);
                        this.setupSendingView.update(renderTarget);
                    }
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
                        this.setupSendNavbar.select(this.curPage);
                        this.setupSendWaitCustomizeView.update(renderTarget);
                    }
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
                        this.setupSendNavbar.select(this.curPage);
                        this.setupSendWaitSendView.update(renderTarget);
                    }
                    this.curView = this.setupSendWaitSendView;
                }.bind(this));
            },

        });

        Workspace = Workspace.extend(RouterSubNavbar);
        Workspace = Workspace.extend(RouterResourceManage);
        Workspace = Workspace.extend(RouterNgnixDownloadSetup);
        Workspace = Workspace.extend(RouterOther);

        exports.Workspace = new Workspace();
    });