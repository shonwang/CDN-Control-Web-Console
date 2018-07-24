define("routes.dispSetup", ['require', 'exports'], 
    function(require, exports) {
        var RouterDispSetup = {
            hashOrigin:function(){
                if (!AUTH_OBJ.HashManage) return;
                require(['hashOrigin.view', 'hashOrigin.model'], function(HashOriginView, HashOriginModel) {
                    this.curPage = 'hashOrigin';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.hashOriginModel)
                        this.hashOriginModel = new HashOriginModel();
                    if (!this.hashOriginView) {
                        var options = {
                            collection: this.hashOriginModel
                        };
                        this.hashOriginView = new HashOriginView(options);
                        this.hashOriginView.render($('.ksc-content'));
                    } else {
                        this.hashOriginView.update($('.ksc-content'));
                    }
                    this.curView = this.hashOriginView;
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

            dispConfig: function() {
                return;
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

            dispConfigNew:function(){
                if (!AUTH_OBJ.GslbConfig) return;
                require(['newDispConfig.view', 'newDispConfig.model', 'dispGroup.model'], function(DispConfigView, DispConfigModel, DispGroupModel) {
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
        }

        return RouterDispSetup
    }
);