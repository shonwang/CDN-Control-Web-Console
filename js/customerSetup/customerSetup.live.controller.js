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
        }

    });
    return new CustomerSetupLiveController();
});