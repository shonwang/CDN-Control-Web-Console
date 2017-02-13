define("customerSetup.live.controller", ['require','exports'], 
    function(require, exports) {

    var CustomerSetupLiveController = Backbone.Router.extend({

        liveBasicDomainSetupCallback:function(query, query2){
            require(['liveDomainSetup.view', 'liveDomainSetup.model'], function(LiveDomainSetupView, LiveDomainSetupModel){
                //一级菜单选中域名配置
                this.navbarView.select('customerSetup');
                //设置当前页面ID
                this.curPage = 'customerSetup-domainList-liveDomainSetup';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveDomainSetupModel)
                    this.liveDomainSetupModel = new LiveDomainSetupModel();
                if (!this.liveDomainSetupView ){
                    var options = {
                        collection: this.liveDomainSetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveDomainSetupView = new LiveDomainSetupView(options);
                    this.liveDomainSetupView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveDomainSetupView.update(query, query2, renderTarget);
                }
            }.bind(this));        
        },

        liveCnameSetupCallback:function(query, query2){
            require(['liveCnameSetup.view', 'liveCnameSetup.model'], function(LiveCnameSetupView, LiveCnameSetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveCnameSetup';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveCnameSetupModel)
                    this.liveCnameSetupModel = new LiveCnameSetupModel();
                if (!this.liveCnameSetupView ){
                    var options = {
                        collection: this.liveCnameSetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveCnameSetupView = new LiveCnameSetupView(options);
                    this.liveCnameSetupView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveCnameSetupView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        liveHttpsSetupCallback:function(query, query2){
            require(['liveHttpsSetup.view', 'liveHttpsSetup.model'], function(LiveHttpsSetupView, LiveHttpsSetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveHttpsSetup';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveHttpsSetupModel)
                    this.liveHttpsSetupModel = new LiveHttpsSetupModel();
                if (!this.liveHttpsSetupView ){
                    var options = {
                        collection: this.liveHttpsSetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveHttpsSetupView = new LiveHttpsSetupView(options);
                    this.liveHttpsSetupView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveHttpsSetupView.update(query, query2, renderTarget);
                }
            }.bind(this));            
        },
        
        liveBackOriginSetupCallback:function(query, query2){
            require(['liveBackOriginSetup.view', 'liveBackOriginSetup.model'], function(LiveBackOriginSetupView, LiveHttpsSetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveBackOriginSetup';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveHttpsSetupModel)
                    this.liveHttpsSetupModel = new LiveHttpsSetupModel();
                if (!this.liveBackOriginSetupView ){
                    var options = {
                        collection: this.liveHttpsSetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveBackOriginSetupView = new LiveBackOriginSetupView(options);
                    this.liveBackOriginSetupView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveBackOriginSetupView.update(query, query2, renderTarget);
                }
            }.bind(this));           
        },

        liveBackOriginDetectionCallback:function(query, query2){
            require(['liveBackOriginDetection.view', 'liveBackOriginDetection.model'], function(LiveBackOriginDetectionView, LiveBackOriginDetectionModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveBackOriginDetection';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveBackOriginDetectionModel)
                    this.liveBackOriginDetectionModel = new LiveBackOriginDetectionModel();
                if (!this.liveBackOriginSetupView ){
                    var options = {
                        collection: this.liveBackOriginDetectionModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveBackOriginDetectionView = new LiveBackOriginDetectionView(options);
                    this.liveBackOriginDetectionView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveBackOriginDetectionView.update(query, query2, renderTarget);
                }
            }.bind(this));                
        },

        liveRefererAntiLeechCallback:function(query, query2){
            
        },

        liveBasicInformationCallback: function(query, query2){
            require(['liveBasicInformation.view', 'liveBasicInformation.model'], function(LiveBasicInformationView, LiveInformationModel){
                //一级菜单选中域名配置
                this.navbarView.select('customerSetup');
                //设置当前页面ID
                this.curPage = 'customerSetup-domainList-liveBasicInformation';
                //移除用户域名列表二级菜单
                if (this.customerSetupNavbar){
                    this.customerSetupNavbar.$el.remove();
                    this.customerSetupNavbar = null;
                }
                //生成直播域名管理三级菜单
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveBasicInformationModel)
                    this.liveBasicInformationModel = new LiveInformationModel();
                if (!this.liveBasicInformationView ){
                    var options = {
                        collection: this.liveBasicInformationModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveBasicInformationView = new LiveBasicInformationView(options);
                    this.liveBasicInformationView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveBasicInformationView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        liveBusOptimizeCallback: function(query, query2){
            require(['liveBusOptimize.view', 'liveBusOptimize.model'], function(LiveBusOptimizeView, LiveBusOptimizeModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveBusOptimize';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveBusOptimizeModel)
                    this.liveBusOptimizeModel = new LiveBusOptimizeModel();
                if (!this.liveBusOptimizeView ){
                    var options = {
                        collection: this.liveBusOptimizeModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveBusOptimizeView = new LiveBusOptimizeView(options);
                    this.liveBusOptimizeView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveBusOptimizeView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        liveH265SetupCallback: function(query, query2){
            require(['liveH265Setup.view', 'liveH265Setup.model'], function(LiveH265SetupView, LiveH265SetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveH265Setup';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveH265SetupModel)
                    this.liveH265SetupModel = new LiveH265SetupModel();
                if (!this.liveH265SetupView ){
                    var options = {
                        collection: this.liveH265SetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveH265SetupView = new LiveH265SetupView(options);
                    this.liveH265SetupView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveH265SetupView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        liveAudioOnlyCallback: function(query, query2){
            require(['liveAudioOnly.view', 'liveAudioOnly.model'], function(LiveAudioOnlyView, LiveAudioOnlyModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveAudioOnly';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveAudioOnlyModel)
                    this.liveAudioOnlyModel = new LiveAudioOnlyModel();
                if (!this.liveAudioOnlyView ){
                    var options = {
                        collection: this.liveAudioOnlyModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveAudioOnlyView = new LiveAudioOnlyView(options);
                    this.liveAudioOnlyView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveAudioOnlyView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        liveEdge302Callback: function(query, query2){
            require(['liveEdge302.view', 'liveEdge302.model'], function(LiveEdge302View, LiveEdge302Model){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveEdge302';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveEdge302Model)
                    this.liveEdge302Model = new LiveEdge302Model();
                if (!this.liveEdge302View ){
                    var options = {
                        collection: this.liveEdge302Model,
                        query     : query,
                        query2    : query2
                    };
                    this.liveEdge302View = new LiveEdge302View(options);
                    this.liveEdge302View.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveEdge302View.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        liveHttpFlvOptimizeCallback: function(query, query2){
            require(['liveHttpFlvOptimize.view', 'liveHttpFlvOptimize.model'], function(LiveHttpFlvOptimizeView, LiveHttpFlvOptimizeModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveHttpFlvOptimize';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveHttpFlvOptimizeModel)
                    this.liveHttpFlvOptimizeModel = new LiveHttpFlvOptimizeModel();
                if (!this.liveHttpFlvOptimizeView ){
                    var options = {
                        collection: this.liveHttpFlvOptimizeModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveHttpFlvOptimizeView = new LiveHttpFlvOptimizeView(options);
                    this.liveHttpFlvOptimizeView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveHttpFlvOptimizeView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        liveRtmpOptimizeCallback: function(query, query2){
            require(['liveRtmpOptimize.view', 'liveRtmpOptimize.model'], function(LiveRtmpOptimizeView, LiveRtmpOptimizeModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveRtmpOptimize';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveRtmpOptimizeModel)
                    this.liveRtmpOptimizeModel = new LiveRtmpOptimizeModel();
                if (!this.liveRtmpOptimizeView ){
                    var options = {
                        collection: this.liveRtmpOptimizeModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveRtmpOptimizeView = new LiveRtmpOptimizeView(options);
                    this.liveRtmpOptimizeView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveRtmpOptimizeView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        liveSLAStatisticsCallback: function(query, query2){
            require(['liveSLAStatistics.view', 'liveSLAStatistics.model'], function(LiveSLAStatisticsView, LiveSLAStatisticsModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveSLAStatistics';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveSLAStatisticsModel)
                    this.liveSLAStatisticsModel = new LiveSLAStatisticsModel();
                if (!this.liveSLAStatisticsView ){
                    var options = {
                        collection: this.liveSLAStatisticsModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveSLAStatisticsView = new LiveSLAStatisticsView(options);
                    this.liveSLAStatisticsView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveSLAStatisticsView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        liveFrequencyLogCallback: function(query, query2){
            require(['liveFrequencyLog.view', 'liveFrequencyLog.model'], function(LiveFrequencyLogView, LiveFrequencyLogModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-liveFrequencyLog';
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveFrequencyLogModel)
                    this.liveFrequencyLogModel = new LiveFrequencyLogModel();
                if (!this.liveFrequencyLogView ){
                    var options = {
                        collection: this.liveFrequencyLogModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveFrequencyLogView = new LiveFrequencyLogView(options);
                    this.liveFrequencyLogView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveFrequencyLogView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },
    });
    return new CustomerSetupLiveController();
});