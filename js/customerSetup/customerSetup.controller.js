define("customerSetup.controller", ['require','exports'], 
    function(require, exports) {

    var CustomerSetupController = Backbone.Router.extend({

        openNgxLogCallback: function(query, query2) {
            require(['openNgxLog.view', 'openNgxLog.model'], function(OpenNgxLogView, OpenNgxLogModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-openNgxLog';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.openNgxLogModel)
                    this.openNgxLogModel = new OpenNgxLogModel();
                if (!this.openNgxLogView ){
                    var options = {
                        collection: this.openNgxLogModel,
                        query     : query,
                        query2    : query2
                    };
                    this.openNgxLogView = new OpenNgxLogView(options);
                    this.openNgxLogView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.openNgxLogView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        timestampCallback: function(query, query2) {
            require(['timestamp.view', 'timestamp.model'], function(TimestampView, TimestampModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-timestamp';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.timestampModel)
                    this.timestampModel = new TimestampModel();
                if (!this.timestampView ){
                    var options = {
                        collection: this.timestampModel,
                        query     : query,
                        query2    : query2
                    };
                    this.timestampView = new TimestampView(options);
                    this.timestampView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.timestampView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        refererAntiLeechCallback: function(query, query2) {
            require(['refererAntiLeech.view', 'refererAntiLeech.model'], function(RefererAntiLeechView, RefererAntiLeechModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-refererAntiLeech';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.refererAntiLeechModel)
                    this.refererAntiLeechModel = new RefererAntiLeechModel();
                if (!this.refererAntiLeechView ){
                    var options = {
                        collection: this.refererAntiLeechModel,
                        query     : query,
                        query2    : query2
                    };
                    this.refererAntiLeechView = new RefererAntiLeechView(options);
                    this.refererAntiLeechView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.refererAntiLeechView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        ipBlackWhiteListCallback: function(query, query2) {
            require(['ipBlackWhiteList.view', 'ipBlackWhiteList.model'], function(IpBlackWhiteListView, IpBlackWhiteListModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-ipBlackWhiteList';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.ipBlackWhiteListModel)
                    this.ipBlackWhiteListModel = new IpBlackWhiteListModel();
                if (!this.ipBlackWhiteListView ){
                    var options = {
                        collection: this.ipBlackWhiteListModel,
                        query     : query,
                        query2    : query2
                    };
                    this.ipBlackWhiteListView = new IpBlackWhiteListView(options);
                    this.ipBlackWhiteListView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.ipBlackWhiteListView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        requestArgsModifyCallback: function(query, query2) {
            require(['requestArgsModify.view', 'requestArgsModify.model'], function(RequestArgsModifyView, RequestArgsModifyModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-requestArgsModify';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.requestArgsModifyModel)
                    this.requestArgsModifyModel = new RequestArgsModifyModel();
                if (!this.requestArgsModifyView ){
                    var options = {
                        collection: this.requestArgsModifyModel,
                        query     : query,
                        query2    : query2
                    };
                    this.requestArgsModifyView = new RequestArgsModifyView(options);
                    this.requestArgsModifyView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.requestArgsModifyView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        httpHeaderCtrCallback: function(query, query2) {
            require(['httpHeaderCtr.view', 'httpHeaderCtr.model'], function(HttpHeaderCtrView, HttpHeaderCtrModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-httpHeaderCtr';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.httpHeaderCtrModel)
                    this.httpHeaderCtrModel = new HttpHeaderCtrModel();
                if (!this.httpHeaderCtrView ){
                    var options = {
                        collection: this.httpHeaderCtrModel,
                        query     : query,
                        query2    : query2
                    };
                    this.httpHeaderCtrView = new HttpHeaderCtrView(options);
                    this.httpHeaderCtrView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.httpHeaderCtrView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },


        httpHeaderOptCallback: function(query, query2) {
            require(['httpHeaderOpt.view', 'httpHeaderOpt.model'], function(HttpHeaderOptView, HttpHeaderOptModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-httpHeaderOpt';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.httpHeaderOptModel)
                    this.httpHeaderOptModel = new HttpHeaderOptModel();
                if (!this.httpHeaderOptView ){
                    var options = {
                        collection: this.httpHeaderOptModel,
                        query     : query,
                        query2    : query2
                    };
                    this.httpHeaderOptView = new HttpHeaderOptView(options);
                    this.httpHeaderOptView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.httpHeaderOptView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },


        clientLimitSpeedCallback: function(query, query2) {
            require(['clientLimitSpeed.view', 'clientLimitSpeed.model'], function(ClientLimitSpeedView, ClientLimitSpeedModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-clientLimitSpeed';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.clientLimitSpeedModel)
                    this.clientLimitSpeedModel = new ClientLimitSpeedModel();
                if (!this.clientLimitSpeedView ){
                    var options = {
                        collection: this.clientLimitSpeedModel,
                        query     : query,
                        query2    : query2
                    };
                    this.clientLimitSpeedView = new ClientLimitSpeedView(options);
                    this.clientLimitSpeedView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.clientLimitSpeedView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        dragPlayCallback: function(query, query2) {
            require(['dragPlay.view', 'dragPlay.model'], function(DragPlayView, DragPlayModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-dragPlay';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.dragPlayModel)
                    this.dragPlayModel = new DragPlayModel();
                if (!this.dragPlayView ){
                    var options = {
                        collection: this.dragPlayModel,
                        query     : query,
                        query2    : query2
                    };
                    this.dragPlayView = new DragPlayView(options);
                    this.dragPlayView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.dragPlayView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        following302Callback: function(query, query2) {
            require(['following302.view', 'following302.model'], function(Following302View, Following302Model){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-following302';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.following302Model)
                    this.following302Model = new Following302Model();
                if (!this.following302View ){
                    var options = {
                        collection: this.following302Model,
                        query     : query,
                        query2    : query2
                    };
                    this.following302View = new Following302View(options);
                    this.following302View.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.following302View.update(query, query2, renderTarget);
                }
            }.bind(this));
        },


        backOriginSetupCallback: function(query, query2) {
            require(['backOriginSetup.view', 'backOriginSetup.model'], function(BackOriginSetupView, BackOriginSetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-backOriginSetup';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.backOriginSetupModel)
                    this.backOriginSetupModel = new BackOriginSetupModel();
                if (!this.backOriginSetupView ){
                    var options = {
                        collection: this.backOriginSetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.backOriginSetupView = new BackOriginSetupView(options);
                    this.backOriginSetupView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.backOriginSetupView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        cnameSetupCallback: function(query, query2) {
            require(['cnameSetup.view', 'cnameSetup.model'], function(CnameSetupView, CnameSetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-cnameSetup';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.cnameSetupModel)
                    this.cnameSetupModel = new CnameSetupModel();
                if (!this.cnameSetupView ){
                    var options = {
                        collection: this.cnameSetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.cnameSetupView = new CnameSetupView(options);
                    this.cnameSetupView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.cnameSetupView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        cacheKeySetupCallback: function(query, query2) {
            require(['cacheKeySetup.view', 'cacheKeySetup.model'], function(CacheKeySetupView, CacheKeySetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-cacheKeySetup';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.cacheKeySetupModel)
                    this.cacheKeySetupModel = new CacheKeySetupModel();
                if (!this.cacheKeySetupView ){
                    var options = {
                        collection: this.cacheKeySetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.cacheKeySetupView = new CacheKeySetupView(options);
                    this.cacheKeySetupView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.cacheKeySetupView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        delMarkCacheCallback: function(query, query2) {
            require(['delMarkCache.view', 'delMarkCache.model'], function(DelMarkCacheView, DelMarkCacheModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-delMarkCache';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.delMarkCacheModel)
                    this.delMarkCacheModel = new DelMarkCacheModel();
                if (!this.delMarkCacheView ){
                    var options = {
                        collection: this.delMarkCacheModel,
                        query     : query,
                        query2    : query2
                    };
                    this.delMarkCacheView = new DelMarkCacheView(options);
                    this.delMarkCacheView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.delMarkCacheView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        cacheRuleCallback: function(query, query2) {
            require(['cacheRule.view', 'cacheRule.model'], function(CacheRuleView, CacheRuleModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-cacheRule';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.cacheRuleModel)
                    this.cacheRuleModel = new CacheRuleModel();
                if (!this.cacheRuleView ){
                    var options = {
                        collection: this.cacheRuleModel,
                        query     : query,
                        query2    : query2
                    };
                    this.cacheRuleView = new CacheRuleView(options);
                    this.cacheRuleView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.cacheRuleView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        domainSetupCallback: function(query, query2) {
            require(['domainSetup.view', 'domainSetup.model'], function(DomainSetupView, DomainSetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-domainSetup';
                this.setUpThirdNavbar(query, query2);
                var renderTarget = this.thirdNavbar.$el.find('.sub-content')

                if (!this.domainSetupModel)
                    this.domainSetupModel = new DomainSetupModel();
                if (!this.domainSetupView ){
                    var options = {
                        collection: this.domainSetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.domainSetupView = new DomainSetupView(options);
                    this.domainSetupView.render(renderTarget);
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.domainSetupView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        domainListCallback: function(query) {
            require(['domainList.view', 'domainList.model', 'subNavbar.view'], function(DomainListView, DomainListModel, SubNavbar){
                this.curPage = 'customerSetup-domainList';
                this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
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
                    }]
                }], menuOptions = {
                    backHash: "index.html#/customerSetup",
                    menuList: menu
                };
                if (!this.subNavbar){
                    this.subNavbar = new SubNavbar(menuOptions);
                    this.subNavbar.select(this.curPage);
                }
                var renderTarget = this.subNavbar.$el.find('.sub-content');

                if (!this.domainListModel)
                    this.domainListModel = new DomainListModel();
                if (!this.domainListView ){
                    var options = {
                        collection: this.domainListModel,
                        query     : query
                    };
                    this.domainListView = new DomainListView(options);
                    this.domainListView.render(renderTarget);
                } else {
                    this.subNavbar.select(this.curPage);
                    this.domainListView.update(query, renderTarget);
                }
            }.bind(this));
        },

        customerSetupCallback: function(){
            require(['customerSetup.view', 'customerSetup.model'], function(CustomerSetupView, CustomerSetupModel){
                this.curPage = 'customerSetup';
                this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));

                if (!this.customerSetupModel)
                    this.customerSetupModel = new CustomerSetupModel();
                if (!this.customerSetupView){
                    var options = {collection: this.customerSetupModel};
                    this.customerSetupView = new CustomerSetupView(options);
                    this.customerSetupView.render($('.ksc-content'));
                } else {
                    this.customerSetupView.update();
                }
            }.bind(this));
        }
    });
    return new CustomerSetupController();
});