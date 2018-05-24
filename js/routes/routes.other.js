define("routes.other", ['require', 'exports', 'subNavbar.view'],
    function(require, exports, SubNavbar) {
        var RouterOther = {
            statisticsDataSourceSwitch: function() {
                require(['statisticsDataSourceSwitch.view', 'statisticsDataSourceSwitch.model'], function(StatisticsDataSourceSwitchView, StatisticsDataSourceSwitchModel) {
                    this.curPage = 'statisticsDataSourceSwitch';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.statisticsDataSourceSwitchModel)
                        this.statisticsDataSourceSwitchModel = new StatisticsDataSourceSwitchModel();
                    if (!this.statisticsDataSourceSwitchView) {
                        var options = {
                            collection: this.statisticsDataSourceSwitchModel
                        };
                        this.statisticsDataSourceSwitchView = new StatisticsDataSourceSwitchView(options);
                        this.statisticsDataSourceSwitchView.render($('.ksc-content'));
                    } else {
                        this.statisticsDataSourceSwitchView.update($('.ksc-content'));
                    }
                    this.curView = this.statisticsDataSourceSwitchView;
                }.bind(this));
            },

            userMove: function() {
                if (!AUTH_OBJ.ChangeDomainUser) return;
                require(['userMove.view', 'userMove.model'], function(UserMoveView, UserMoveModel) {
                    this.curPage = 'userMove';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.userMoveModel)
                        this.userMoveModel = new UserMoveModel();
                    if (!this.userMoveView) {
                        var options = {
                            collection: this.userMoveModel
                        };
                        this.userMoveView = new UserMoveView(options);
                        this.userMoveView.render($('.ksc-content'));
                    } else {
                        this.userMoveView.update();
                    }
                    this.curView = this.userMoveView;
                }.bind(this));
            },

            commonCache: function() {
                if (!AUTH_OBJ.CcacheManager) return;
                require(['commonCache.view', 'commonCache.model'], function(CommonCacheView, CommonCacheModel) {
                    this.curPage = 'commonCache';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.commonCacheModel)
                        this.commonCacheModel = new CommonCacheModel();
                    if (!this.commonCacheView) {
                        var options = {
                            collection: this.commonCacheModel
                        };
                        this.commonCacheView = new CommonCacheView(options);
                        this.commonCacheView.render($('.ksc-content'));
                    } else {
                        this.commonCacheView.update();
                    }
                    this.curView = this.commonCacheView;
                }.bind(this));
            },

            speedMeasure: function() {
                require(['speedMeasure.view', 'speedMeasure.model'], function(SpeedMeasureView, SpeedMeasureModel) {
                    this.curPage = 'speedMeasure';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.speedMeasureModel)
                        this.speedMeasureModel = new SpeedMeasureModel();
                    if (!this.speedMeasureView) {
                        var options = {
                            collection: this.speedMeasureModel
                        };
                        this.speedMeasureView = new SpeedMeasureView(options);
                        this.speedMeasureView.render($('.ksc-content'));
                    } else {
                        this.speedMeasureView.update();
                    }
                    this.curView = this.speedMeasureView;
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

        }

        return RouterOther
    }
);