define("routes.luaDownloadSetup", ['require', 'exports'], 
    function(require, exports) {
        var RouterLuaDownloadSetup = {

            openNgxLog: function(query, query2) {
                if (!AUTH_OBJ.LogServer) return;
                require(['openNgxLog.view', 'openNgxLog.model'], function(OpenNgxLogView, OpenNgxLogModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-openNgxLog';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.openNgxLogView.update(query, query2, renderTarget);
                    }
                    this.curView = this.openNgxLogView;
                }.bind(this));
            },

            timestamp: function(query, query2) {
                if (!AUTH_OBJ.TimeSafetychain) return;
                require(['timestamp.view', 'timestamp.model'], function(TimestampView, TimestampModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-timestamp';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.timestampView.update(query, query2, renderTarget);
                    }
                    this.curView = this.timestampView;
                }.bind(this));
            },

            refererAntiLeech: function(query, query2) {
                //if(!AUTH_OBJ.referIPMatchingCondition) return;
                require(['refererAntiLeech.view', 'refererAntiLeech.model'], function(RefererAntiLeechView, RefererAntiLeechModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-refererAntiLeech';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.refererAntiLeechView.update(query, query2, renderTarget);
                    }
                    this.curView = this.refererAntiLeechView;
                }.bind(this));
            },

            ipBlackWhiteList: function(query, query2) {
                //if(!AUTH_OBJ.IPMatchingCondition) return;
                require(['ipBlackWhiteList.view', 'ipBlackWhiteList.model'], function(IpBlackWhiteListView, IpBlackWhiteListModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-ipBlackWhiteList';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.ipBlackWhiteListView.update(query, query2, renderTarget);
                    }
                    this.curView = this.ipBlackWhiteListView;
                }.bind(this));
            },

            requestArgsModify: function(query, query2) {
                require(['requestArgsModify.view', 'requestArgsModify.model'], function(RequestArgsModifyView, RequestArgsModifyModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-requestArgsModify';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.requestArgsModifyView.update(query, query2, renderTarget);
                    }
                    this.curView = this.requestArgsModifyView;
                }.bind(this));
            },

            httpHeaderCtr: function(query, query2) {
                if (!AUTH_OBJ.HttpheadControl) return;
                require(['httpHeaderCtr.view', 'httpHeaderCtr.model'], function(HttpHeaderCtrView, HttpHeaderCtrModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-httpHeaderCtr';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.httpHeaderCtrView.update(query, query2, renderTarget);
                    }
                    this.curView = this.httpHeaderCtrView;
                }.bind(this));
            },

            httpHeaderOpt: function(query, query2) {
                if (!AUTH_OBJ.HttpheadControl) return;
                require(['httpHeaderOpt.view', 'httpHeaderOpt.model'], function(HttpHeaderOptView, HttpHeaderOptModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-httpHeaderOpt';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.httpHeaderOptView.update(query, query2, renderTarget);
                    }
                    this.curView = this.httpHeaderOptView;
                }.bind(this));
            },

            clientLimitSpeed: function(query, query2) {
                if (!AUTH_OBJ.SpeedLimit) return;
                require(['clientLimitSpeed.view', 'clientLimitSpeed.model'], function(ClientLimitSpeedView, ClientLimitSpeedModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-clientLimitSpeed';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.clientLimitSpeedView.update(query, query2, renderTarget);
                    }
                    this.curView = this.clientLimitSpeedView;
                }.bind(this));
            },

            dragPlay: function(query, query2) {
                if (!AUTH_OBJ.OndemandOptimization) return;
                require(['dragPlay.view', 'dragPlay.model'], function(DragPlayView, DragPlayModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-dragPlay';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.dragPlayView.update(query, query2, renderTarget);
                    }
                    this.curView = this.dragPlayView;
                }.bind(this));
            },

            following302: function(query, query2) {
                require(['following302.view', 'following302.model'], function(Following302View, Following302Model) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-following302';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.following302View.update(query, query2, renderTarget);
                    }
                    this.curView = this.following302View;
                }.bind(this));
            },

            cacheKeySetup: function(query, query2) {
                require(['cacheKeySetup.view', 'cacheKeySetup.model'], function(CacheKeySetupView, CacheKeySetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-cacheKeySetup';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.cacheKeySetupView.update(query, query2, renderTarget);
                    }
                    this.curView = this.cacheKeySetupView;
                }.bind(this));
            },

            delMarkCache: function(query, query2) {
                require(['delMarkCache.view', 'delMarkCache.model'], function(DelMarkCacheView, DelMarkCacheModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-delMarkCache';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.delMarkCacheView.update(query, query2, renderTarget);
                    }
                    this.curView = this.delMarkCacheView;
                }.bind(this));
            },

            luaCacheRule: function(query, query2) {
                require(['luaCacheRule.view', 'luaCacheRule.model'], function(LuaCacheRuleView, LuaCacheRuleModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaCacheRule';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaCacheRuleModel)
                        this.luaCacheRuleModel = new LuaCacheRuleModel();
                    if (!this.luaCacheRuleView) {
                        var options = {
                            collection: this.luaCacheRuleModel,
                            query: query,
                            query2: query2
                        };
                        this.luaCacheRuleView = new LuaCacheRuleView(options);
                        this.luaCacheRuleView.render(renderTarget);
                    } else {
                        this.domainManageNavbar.select(this.curPage);
                        this.luaCacheRuleView.update(query, query2, renderTarget);
                    }
                    this.curView = this.luaCacheRuleView;
                }.bind(this));
            },

            luaBackOriginSetup: function(query, query2) {
                require(['backOriginSetup.view', 'backOriginSetup.model'], function(BackOriginSetupView, BackOriginSetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaBackOriginSetup';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.backOriginSetupView.update(query, query2, renderTarget);
                    }
                    this.curView = this.backOriginSetupView;
                }.bind(this));
            },

            luaBackOriginDetection: function(query, query2) {
                require(['backOriginDetection.view', 'backOriginDetection.model'], function(BackOriginDetectionView, BackOriginDetectionModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaBackOriginDetection';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.backOriginDetectionView.update(query, query2, renderTarget);
                    }
                    this.curView = this.backOriginDetectionView;
                }.bind(this));
            },

            luaCnameSetup: function(query, query2) {
                require(['cnameSetup.view', 'cnameSetup.model'], function(CnameSetupView, CnameSetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaCnameSetup';
                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.cnameSetupView.update(query, query2, renderTarget);
                    }
                    this.curView = this.cnameSetupView;
                }.bind(this));
            },

            luaDomainSetup: function(query, query2) {
                require(['domainSetup.view', 'domainSetup.model'], function(DomainSetupView, DomainSetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaDomainSetup';

                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.domainSetupView.update(query, query2, renderTarget);
                    }
                    this.curView = this.domainSetupView;
                }.bind(this));
            },

            luaBasicInformation: function(query, query2) {
                require(['basicInformation.view', 'basicInformation.model'], function(BasicInformationView, BasicInformationModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaBasicInformation';
                    if (this.customerSetupNavbar) {
                        this.customerSetupNavbar.$el.remove();
                        this.customerSetupNavbar = null;
                    }

                    this.setupLuaDomainManageNavbar(query, query2);
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
                        this.domainManageNavbar.select(this.curPage);
                        this.basicInformationView.update(query, query2, renderTarget);
                    }
                    this.curView = this.basicInformationView;
                }.bind(this));
            },
        }

        return RouterLuaDownloadSetup
    }
);