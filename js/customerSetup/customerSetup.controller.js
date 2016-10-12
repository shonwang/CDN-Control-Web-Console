define("customerSetup.controller", ['require','exports'], 
    function(require, exports) {

    var CustomerSetupController = Backbone.Router.extend({

        openNgxLogCallback: function(query, query2) {
            require(['openNgxLog.view', 'openNgxLog.model'], function(OpenNgxLogView, OpenNgxLogModel){
                this.curPage = 'openNgxLog';
                this.setUpThirdNavbar(query, query2);

                if (!this.openNgxLogModel)
                    this.openNgxLogModel = new OpenNgxLogModel();
                if (!this.openNgxLogView ){
                    var options = {
                        collection: this.openNgxLogModel,
                        query     : query,
                        query2    : query2
                    };
                    this.openNgxLogView = new OpenNgxLogView(options);
                    this.openNgxLogView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.openNgxLogView.update(query, query2);
                }
            }.bind(this));
        },

        timestampCallback: function(query, query2) {
            require(['timestamp.view', 'timestamp.model'], function(TimestampView, TimestampModel){
                this.curPage = 'timestamp';
                this.setUpThirdNavbar(query, query2);

                if (!this.timestampModel)
                    this.timestampModel = new TimestampModel();
                if (!this.timestampView ){
                    var options = {
                        collection: this.timestampModel,
                        query     : query,
                        query2    : query2
                    };
                    this.timestampView = new TimestampView(options);
                    this.timestampView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.timestampView.update(query, query2);
                }
            }.bind(this));
        },

        refererAntiLeechCallback: function(query, query2) {
            require(['refererAntiLeech.view', 'refererAntiLeech.model'], function(RefererAntiLeechView, RefererAntiLeechModel){
                this.curPage = 'refererAntiLeech';
                this.setUpThirdNavbar(query, query2);

                if (!this.refererAntiLeechModel)
                    this.refererAntiLeechModel = new RefererAntiLeechModel();
                if (!this.refererAntiLeechView ){
                    var options = {
                        collection: this.refererAntiLeechModel,
                        query     : query,
                        query2    : query2
                    };
                    this.refererAntiLeechView = new RefererAntiLeechView(options);
                    this.refererAntiLeechView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.refererAntiLeechView.update(query, query2);
                }
            }.bind(this));
        },

        ipBlackWhiteListCallback: function(query, query2) {
            require(['ipBlackWhiteList.view', 'ipBlackWhiteList.model'], function(IpBlackWhiteListView, IpBlackWhiteListModel){
                this.curPage = 'ipBlackWhiteList';
                this.setUpThirdNavbar(query, query2);

                if (!this.ipBlackWhiteListModel)
                    this.ipBlackWhiteListModel = new IpBlackWhiteListModel();
                if (!this.ipBlackWhiteListView ){
                    var options = {
                        collection: this.ipBlackWhiteListModel,
                        query     : query,
                        query2    : query2
                    };
                    this.ipBlackWhiteListView = new IpBlackWhiteListView(options);
                    this.ipBlackWhiteListView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.ipBlackWhiteListView.update(query, query2);
                }
            }.bind(this));
        },

        requestArgsModifyCallback: function(query, query2) {
            require(['requestArgsModify.view', 'requestArgsModify.model'], function(RequestArgsModifyView, RequestArgsModifyModel){
                this.curPage = 'requestArgsModify';
                this.setUpThirdNavbar(query, query2);

                if (!this.requestArgsModifyModel)
                    this.requestArgsModifyModel = new RequestArgsModifyModel();
                if (!this.requestArgsModifyView ){
                    var options = {
                        collection: this.requestArgsModifyModel,
                        query     : query,
                        query2    : query2
                    };
                    this.requestArgsModifyView = new RequestArgsModifyView(options);
                    this.requestArgsModifyView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.requestArgsModifyView.update(query, query2);
                }
            }.bind(this));
        },

        httpHeaderCtrCallback: function(query, query2) {
            require(['httpHeaderCtr.view', 'httpHeaderCtr.model'], function(HttpHeaderCtrView, HttpHeaderCtrModel){
                this.curPage = 'httpHeaderCtr';
                this.setUpThirdNavbar(query, query2);

                if (!this.httpHeaderCtrModel)
                    this.httpHeaderCtrModel = new HttpHeaderCtrModel();
                if (!this.httpHeaderCtrView ){
                    var options = {
                        collection: this.httpHeaderCtrModel,
                        query     : query,
                        query2    : query2
                    };
                    this.httpHeaderCtrView = new HttpHeaderCtrView(options);
                    this.httpHeaderCtrView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.httpHeaderCtrView.update(query, query2);
                }
            }.bind(this));
        },


        httpHeaderOptCallback: function(query, query2) {
            require(['httpHeaderOpt.view', 'httpHeaderOpt.model'], function(HttpHeaderOptView, HttpHeaderOptModel){
                this.curPage = 'httpHeaderOpt';
                this.setUpThirdNavbar(query, query2);

                if (!this.httpHeaderOptModel)
                    this.httpHeaderOptModel = new HttpHeaderOptModel();
                if (!this.httpHeaderOptView ){
                    var options = {
                        collection: this.httpHeaderOptModel,
                        query     : query,
                        query2    : query2
                    };
                    this.httpHeaderOptView = new HttpHeaderOptView(options);
                    this.httpHeaderOptView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.httpHeaderOptView.update(query, query2);
                }
            }.bind(this));
        },


        clientLimitSpeedCallback: function(query, query2) {
            require(['clientLimitSpeed.view', 'clientLimitSpeed.model'], function(ClientLimitSpeedView, ClientLimitSpeedModel){
                this.curPage = 'clientLimitSpeed';
                this.setUpThirdNavbar(query, query2);

                if (!this.clientLimitSpeedModel)
                    this.clientLimitSpeedModel = new ClientLimitSpeedModel();
                if (!this.clientLimitSpeedView ){
                    var options = {
                        collection: this.clientLimitSpeedModel,
                        query     : query,
                        query2    : query2
                    };
                    this.clientLimitSpeedView = new ClientLimitSpeedView(options);
                    this.clientLimitSpeedView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.clientLimitSpeedView.update(query, query2);
                }
            }.bind(this));
        },

        dragPlayCallback: function(query, query2) {
            require(['dragPlay.view', 'dragPlay.model'], function(DragPlayView, DragPlayModel){
                this.curPage = 'dragPlay';
                this.setUpThirdNavbar(query, query2);

                if (!this.dragPlayModel)
                    this.dragPlayModel = new DragPlayModel();
                if (!this.dragPlayView ){
                    var options = {
                        collection: this.dragPlayModel,
                        query     : query,
                        query2    : query2
                    };
                    this.dragPlayView = new DragPlayView(options);
                    this.dragPlayView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.dragPlayView.update(query, query2);
                }
            }.bind(this));
        },

        following302Callback: function(query, query2) {
            require(['following302.view', 'following302.model'], function(Following302View, Following302Model){
                this.curPage = 'following302';
                this.setUpThirdNavbar(query, query2);

                if (!this.following302Model)
                    this.following302Model = new Following302Model();
                if (!this.following302View ){
                    var options = {
                        collection: this.following302Model,
                        query     : query,
                        query2    : query2
                    };
                    this.following302View = new Following302View(options);
                    this.following302View.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.following302View.update(query, query2);
                }
            }.bind(this));
        },


        backOriginSetupCallback: function(query, query2) {
            require(['backOriginSetup.view', 'backOriginSetup.model'], function(BackOriginSetupView, BackOriginSetupModel){
                this.curPage = 'backOriginSetup';
                this.setUpThirdNavbar(query, query2);

                if (!this.backOriginSetupModel)
                    this.backOriginSetupModel = new BackOriginSetupModel();
                if (!this.backOriginSetupView ){
                    var options = {
                        collection: this.backOriginSetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.backOriginSetupView = new BackOriginSetupView(options);
                    this.backOriginSetupView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.backOriginSetupView.update(query, query2);
                }
            }.bind(this));
        },

        cnameSetupCallback: function(query, query2) {
            require(['cnameSetup.view', 'cnameSetup.model'], function(CnameSetupView, CnameSetupModel){
                this.curPage = 'cnameSetup';
                this.setUpThirdNavbar(query, query2);

                if (!this.cnameSetupModel)
                    this.cnameSetupModel = new CnameSetupModel();
                if (!this.cnameSetupView ){
                    var options = {
                        collection: this.cnameSetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.cnameSetupView = new CnameSetupView(options);
                    this.cnameSetupView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.cnameSetupView.update(query, query2);
                }
            }.bind(this));
        },

        cacheKeySetupCallback: function(query, query2) {
            require(['cacheKeySetup.view', 'cacheKeySetup.model'], function(CacheKeySetupView, CacheKeySetupModel){
                this.curPage = 'cacheKeySetup';
                this.setUpThirdNavbar(query, query2);

                if (!this.cacheKeySetupModel)
                    this.cacheKeySetupModel = new CacheKeySetupModel();
                if (!this.cacheKeySetupView ){
                    var options = {
                        collection: this.cacheKeySetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.cacheKeySetupView = new CacheKeySetupView(options);
                    this.cacheKeySetupView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.cacheKeySetupView.update(query, query2);
                }
            }.bind(this));
        },

        delMarkCacheCallback: function(query, query2) {
            require(['delMarkCache.view', 'delMarkCache.model'], function(DelMarkCacheView, DelMarkCacheModel){
                this.curPage = 'delMarkCache';
                this.setUpThirdNavbar(query, query2);

                if (!this.delMarkCacheModel)
                    this.delMarkCacheModel = new DelMarkCacheModel();
                if (!this.delMarkCacheView ){
                    var options = {
                        collection: this.delMarkCacheModel,
                        query     : query,
                        query2    : query2
                    };
                    this.delMarkCacheView = new DelMarkCacheView(options);
                    this.delMarkCacheView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.delMarkCacheView.update(query, query2);
                }
            }.bind(this));
        },


        cacheRuleCallback: function(query, query2) {
            require(['cacheRule.view', 'cacheRule.model'], function(CacheRuleView, CacheRuleModel){
                this.curPage = 'cacheRule';
                this.setUpThirdNavbar(query, query2);

                if (!this.cacheRuleModel)
                    this.cacheRuleModel = new CacheRuleModel();
                if (!this.cacheRuleView ){
                    var options = {
                        collection: this.cacheRuleModel,
                        query     : query,
                        query2    : query2
                    };
                    this.cacheRuleView = new CacheRuleView(options);
                    this.cacheRuleView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.cacheRuleView.update(query, query2);
                }
            }.bind(this));
        },

        domainSetupCallback: function(query, query2) {
            require(['domainSetup.view', 'domainSetup.model'], function(DomainSetupView, DomainSetupModel){
                this.curPage = 'domainSetup';
                this.setUpThirdNavbar(query, query2);

                if (!this.domainSetupModel)
                    this.domainSetupModel = new DomainSetupModel();
                if (!this.domainSetupView ){
                    var options = {
                        collection: this.domainSetupModel,
                        query     : query,
                        query2    : query2
                    };
                    this.domainSetupView = new DomainSetupView(options);
                    this.domainSetupView.render(this.thirdNavbar.$el.find('.sub-content'));
                } else {
                    this.thirdNavbar.select(this.curPage);
                    this.domainSetupView.update(query, query2);
                }
            }.bind(this));
        },

        domainListCallback: function(query) {
            require(['domainList.view', 'domainList.model', 'subNavbar.view'], function(DomainListView, DomainListModel, SubNavbar){
                this.curPage = 'domainList';
                var menu = [{
                    id: '',
                    name: '客户配置管理',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'domainList',
                        name: '域名列表',
                        hash: 'index.html#/domainList/' + query,
                        active: true,
                        children: []
                    }]
                }], menuOptions = {
                    backHash: "index.html#/customerSetup",
                    menuList: menu
                }
                if (!this.subNavbar){
                    this.subNavbar = new SubNavbar(menuOptions);
                    this.subNavbar.select(this.curPage);
                } else {
                    this.subNavbar.update(query, null, menu, menuOptions.backHash)
                }
                if (!this.domainListModel)
                    this.domainListModel = new DomainListModel();
                if (!this.domainListView ){
                    var options = {
                        collection: this.domainListModel,
                        query     : query
                    };
                    this.domainListView = new DomainListView(options);
                    this.domainListView.render(this.subNavbar.$el.find('.sub-content'));
                } else {
                    this.subNavbar.select(this.curPage);
                    this.domainListView.update(query);
                }
            }.bind(this));
        },

        customerSetupCallback: function(){
            require(['customerSetup.view', 'customerSetup.model'], function(CustomerSetupView, CustomerSetupModel){
                this.curPage = 'customerSetup';
                this.navbarView.select(this.curPage);
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