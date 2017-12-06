define("routes.luaDownloadSetup", ['require', 'exports'], 
    function(require, exports) {
        var RouterLuaDownloadSetup = {

            luaTimestamp: function(query, query2) {
                //if (!AUTH_OBJ.TimeSafetychain) return;
                require(['luaTimestamp.view', 'luaTimestamp.model'], function(TimestampView, TimestampModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaTimestamp';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaTimestampModel)
                        this.luaTimestampModel = new TimestampModel();
                    if (!this.luaTimestampView) {
                        var options = {
                            collection: this.luaTimestampModel,
                            query: query,
                            query2: query2
                        };
                        this.luaTimestampView = new TimestampView(options);
                        this.luaTimestampView.render(renderTarget);
                    } else {
                        this.luaTimestampView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaTimestampView;
                }.bind(this));
            },

            luaRefererAntiLeech: function(query, query2) {
                //if(!AUTH_OBJ.referIPMatchingCondition) return;
                require(['luaRefererAntiLeech.view', 'luaRefererAntiLeech.model'], function(RefererAntiLeechView, RefererAntiLeechModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaRefererAntiLeech';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaRefererAntiLeechModel)
                        this.luaRefererAntiLeechModel = new RefererAntiLeechModel();
                    if (!this.luaRefererAntiLeechView) {
                        var options = {
                            collection: this.luaRefererAntiLeechModel,
                            query: query,
                            query2: query2
                        };
                        this.luaRefererAntiLeechView = new RefererAntiLeechView(options);
                        this.luaRefererAntiLeechView.render(renderTarget);
                    } else {
                        this.luaRefererAntiLeechView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaRefererAntiLeechView;
                }.bind(this));
            },

            luaIpBlackWhiteList: function(query, query2) {
                //if(!AUTH_OBJ.IPMatchingCondition) return;
                require(['luaIpBlackWhiteList.view', 'luaIpBlackWhiteList.model'], function(IpBlackWhiteListView, IpBlackWhiteListModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaIpBlackWhiteList';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaIpBlackWhiteListModel)
                        this.luaIpBlackWhiteListModel = new IpBlackWhiteListModel();
                    if (!this.luaIpBlackWhiteListView) {
                        var options = {
                            collection: this.luaIpBlackWhiteListModel,
                            query: query,
                            query2: query2
                        };
                        this.luaIpBlackWhiteListView = new IpBlackWhiteListView(options);
                        this.luaIpBlackWhiteListView.render(renderTarget);
                    } else {
                        this.luaIpBlackWhiteListView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaIpBlackWhiteListView;
                }.bind(this));
            },

            luaRequestArgsModify: function(query, query2) {
                require(['requestArgsModify.view', 'requestArgsModify.model'], function(RequestArgsModifyView, RequestArgsModifyModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaRequestArgsModify';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaRequestArgsModifyModel)
                        this.luaRequestArgsModifyModel = new RequestArgsModifyModel();
                    if (!this.luaRequestArgsModifyView) {
                        var options = {
                            collection: this.luaRequestArgsModifyModel,
                            query: query,
                            query2: query2
                        };
                        this.luaRequestArgsModifyView = new RequestArgsModifyView(options);
                        this.luaRequestArgsModifyView.render(renderTarget);
                    } else {
                        this.luaRequestArgsModifyView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaRequestArgsModifyView;
                }.bind(this));
            },

            luaHttpHeaderCtr: function(query, query2) {
                //if (!AUTH_OBJ.HttpheadControl) return;
                require(['httpHeaderCtr.view', 'httpHeaderCtr.model'], function(HttpHeaderCtrView, HttpHeaderCtrModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaHttpHeaderCtr';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaHttpHeaderCtrModel)
                        this.luaHttpHeaderCtrModel = new HttpHeaderCtrModel();
                    if (!this.luaHttpHeaderCtrView) {
                        var options = {
                            collection: this.luaHttpHeaderCtrModel,
                            query: query,
                            query2: query2
                        };
                        this.luaHttpHeaderCtrView = new HttpHeaderCtrView(options);
                        this.luaHttpHeaderCtrView.render(renderTarget);
                    } else {
                        this.luaHttpHeaderCtrView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaHttpHeaderCtrView;
                }.bind(this));
            },

            luaHttpHeaderOpt: function(query, query2) {
                //if (!AUTH_OBJ.HttpheadControl) return;
                require(['luaHttpHeaderOpt.view', 'luaHttpHeaderOpt.model'], function(HttpHeaderOptView, HttpHeaderOptModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaHttpHeaderOpt';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaHttpHeaderOptModel)
                        this.luaHttpHeaderOptModel = new HttpHeaderOptModel();
                    if (!this.luaHttpHeaderOptView) {
                        var options = {
                            collection: this.luaHttpHeaderOptModel,
                            query: query,
                            query2: query2
                        };
                        this.luaHttpHeaderOptView = new HttpHeaderOptView(options);
                        this.luaHttpHeaderOptView.render(renderTarget);
                    } else {
                        this.luaHttpHeaderOptView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaHttpHeaderOptView;
                }.bind(this));
            },

            luaClientLimitSpeed: function(query, query2) {
                //if (!AUTH_OBJ.SpeedLimit) return;
                require(['luaClientLimitSpeed.view', 'luaClientLimitSpeed.model'], function(ClientLimitSpeedView, ClientLimitSpeedModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaClientLimitSpeed';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaClientLimitSpeedModel)
                        this.luaClientLimitSpeedModel = new ClientLimitSpeedModel();
                    if (!this.luaClientLimitSpeedView) {
                        var options = {
                            collection: this.luaClientLimitSpeedModel,
                            query: query,
                            query2: query2
                        };
                        this.luaClientLimitSpeedView = new ClientLimitSpeedView(options);
                        this.luaClientLimitSpeedView.render(renderTarget);
                    } else {
                        this.luaClientLimitSpeedView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaClientLimitSpeedView;
                }.bind(this));
            },

            luaDragPlay: function(query, query2) {
                //if (!AUTH_OBJ.OndemandOptimization) return;
                require(['dragPlay.view', 'dragPlay.model'], function(DragPlayView, DragPlayModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaDragPlay';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaDragPlayModel)
                        this.luaDragPlayModel = new DragPlayModel();
                    if (!this.luaDragPlayView) {
                        var options = {
                            collection: this.luaDragPlayModel,
                            query: query,
                            query2: query2
                        };
                        this.luaDragPlayView = new DragPlayView(options);
                        this.luaDragPlayView.render(renderTarget);
                    } else {
                        this.luaDragPlayView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaDragPlayView;
                }.bind(this));
            },

            luaCacheKeySetup: function(query, query2) {
                require(['cacheKeySetup.view', 'cacheKeySetup.model'], function(CacheKeySetupView, CacheKeySetupModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaCacheKeySetup';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaCacheKeySetupModel)
                        this.luaCacheKeySetupModel = new CacheKeySetupModel();
                    if (!this.luaCacheKeySetupView) {
                        var options = {
                            collection: this.luaCacheKeySetupModel,
                            query: query,
                            query2: query2
                        };
                        this.luaCacheKeySetupView = new CacheKeySetupView(options);
                        this.luaCacheKeySetupView.render(renderTarget);
                    } else {
                        this.luaCacheKeySetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaCacheKeySetupView;
                }.bind(this));
            },

            luaDelMarkCache: function(query, query2) {
                require(['luaDelMarkCache.view', 'luaDelMarkCache.model'], function(DelMarkCacheView, DelMarkCacheModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaDelMarkCache';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaDelMarkCacheModel)
                        this.luaDelMarkCacheModel = new DelMarkCacheModel();
                    if (!this.luaDelMarkCacheView) {
                        var options = {
                            collection: this.luaDelMarkCacheModel,
                            query: query,
                            query2: query2
                        };
                        this.luaDelMarkCacheView = new DelMarkCacheView(options);
                        this.luaDelMarkCacheView.render(renderTarget);
                    } else {
                        this.luaDelMarkCacheView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaDelMarkCacheView;
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
                        this.luaCacheRuleView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaCacheRuleView;
                }.bind(this));
            },

            luaBackOriginSetup: function(query, query2) {
                require(['notStandardBackOriginSetup.view', 'notStandardBackOriginSetup.model'], function(BackOriginSetupView, BackOriginSetupModel) {
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
                        this.backOriginSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
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
                        this.backOriginDetectionView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
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
                        this.cnameSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
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
                        this.domainSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
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
                        this.basicInformationView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.basicInformationView;
                }.bind(this));
            },

            luaAdvanceConfig: function(query, query2) {
                require(['luaAdvanceConfig.view', 'luaAdvanceConfig.model'], function(LuaAdvanceConfigView, LuaAdvanceConfigModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaConfig';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaAdvanceConfigModel)
                        this.luaAdvanceConfigModel = new LuaAdvanceConfigModel();
                    if (!this.luaAdvanceConfigView) {
                        var options = {
                            collection: this.luaAdvanceConfigModel,
                            query: query,
                            query2: query2
                        };
                        this.luaAdvanceConfigView = new LuaAdvanceConfigView(options);
                        this.luaAdvanceConfigView.render(renderTarget);
                    } else {
                        this.luaAdvanceConfigView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaAdvanceConfigView;
                }.bind(this));
            },   
            
            luaConfigListEdit: function(query, query2,query3) {
                require(['luaConfigListEdit.view', 'luaConfigListEdit.model'], function(LuaConfigListEditView, LuaConfigListEditModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaConfigListEdit';
                    this.setupLuaDomainManageNavbar(query, query2,query3);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')
                    if (!this.luaConfigListEditModel)
                        this.luaConfigListEditModel = new LuaConfigListEditModel();
                    if (!this.luaConfigListEditView) {
                        var options = {
                            collection: this.luaConfigListEditModel,
                            query: query,
                            query2: query2,
                            query3:query3
                        };
                        this.luaConfigListEditView = new LuaConfigListEditView(options);
                        this.luaConfigListEditView.render(renderTarget);
                    } else {
                        this.luaConfigListEditView.update(query, query2, query3, renderTarget);
                    }
                    this.domainManageNavbar.select("customerSetup-domainList-luaConfig");
                    this.curView = this.luaConfigListEditView;
                }.bind(this));
            },

            luaStatusCodeCache: function(query, query2){
                require(['luaStatusCodeCache.view', 'luaStatusCodeCache.model'], function(LuaStatusCodeCacheView, LuaStatusCodeCacheModel) {
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-luaStatusCodeCache';
                    this.setupLuaDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.luaStatusCodeCacheModel)
                        this.luaStatusCodeCacheModel = new LuaStatusCodeCacheModel();
                    if (!this.luaStatusCodeCacheView) {
                        var options = {
                            collection: this.luaStatusCodeCacheModel,
                            query: query,
                            query2: query2
                        };
                        this.luaStatusCodeCacheView = new LuaStatusCodeCacheView(options);
                        this.luaStatusCodeCacheView.render(renderTarget);
                    } else {
                        this.luaStatusCodeCacheView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.luaStatusCodeCacheView;
                }.bind(this));            
            }
        }

        return RouterLuaDownloadSetup
    }
);