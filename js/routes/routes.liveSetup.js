define("routes.liveSetup", ['require', 'exports'], 
    function(require, exports) {
        var RouterLiveSetup = {

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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveUpFlowNameChangeView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveUpBackOriginSetupView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveUpBasicInformationView.update(query, query2, renderTarget);
                    }
                    this.curView = this.liveUpBasicInformationView;    
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveDomainSetupView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveCnameSetupView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveHttpsSetupView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveBackOriginSetupView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveBackOriginDetectionView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveRefererAntiLeechView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveTimestampView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveBasicInformationView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveBusOptimizeView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveH265SetupView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveAudioOnlyView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveEdge302View.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveHttpFlvOptimizeView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveRtmpOptimizeView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveSLAStatisticsView.update(query, query2, renderTarget);
                    }
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
                        this.domainManageNavbar.select(this.curPage);
                        this.liveFrequencyLogView.update(query, query2, renderTarget);
                    }
                    this.curView = this.liveFrequencyLogView;
                }.bind(this));
            },
        }

        return RouterLiveSetup
    }
);