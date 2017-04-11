define("customerSetup.controller", ['require','exports'], 
    function(require, exports) {

    var CustomerSetupController = Backbone.Router.extend({

        openNgxLogCallback: function(query, query2) {
            if(!AUTH_OBJ.LogServer) return;
            require(['openNgxLog.view', 'openNgxLog.model'], function(OpenNgxLogView, OpenNgxLogModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-openNgxLog';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.openNgxLogView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        timestampCallback: function(query, query2) {
            if(!AUTH_OBJ.TimeSafetychain) return;
            require(['timestamp.view', 'timestamp.model'], function(TimestampView, TimestampModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-timestamp';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.timestampView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        refererAntiLeechCallback: function(query, query2) {
            //if(!AUTH_OBJ.referIPMatchingCondition) return;
            require(['refererAntiLeech.view', 'refererAntiLeech.model'], function(RefererAntiLeechView, RefererAntiLeechModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-refererAntiLeech';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.refererAntiLeechView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        ipBlackWhiteListCallback: function(query, query2) {
            //if(!AUTH_OBJ.IPMatchingCondition) return;
            require(['ipBlackWhiteList.view', 'ipBlackWhiteList.model'], function(IpBlackWhiteListView, IpBlackWhiteListModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-ipBlackWhiteList';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.ipBlackWhiteListView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        requestArgsModifyCallback: function(query, query2) {
            require(['requestArgsModify.view', 'requestArgsModify.model'], function(RequestArgsModifyView, RequestArgsModifyModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-requestArgsModify';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.requestArgsModifyView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        httpHeaderCtrCallback: function(query, query2) {
            if(!AUTH_OBJ.HttpheadControl) return;
            require(['httpHeaderCtr.view', 'httpHeaderCtr.model'], function(HttpHeaderCtrView, HttpHeaderCtrModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-httpHeaderCtr';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.httpHeaderCtrView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        httpHeaderOptCallback: function(query, query2) {
            if(!AUTH_OBJ.HttpheadControl) return;
            require(['httpHeaderOpt.view', 'httpHeaderOpt.model'], function(HttpHeaderOptView, HttpHeaderOptModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-httpHeaderOpt';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.httpHeaderOptView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        clientLimitSpeedCallback: function(query, query2) {
            if(!AUTH_OBJ.SpeedLimit) return;
            require(['clientLimitSpeed.view', 'clientLimitSpeed.model'], function(ClientLimitSpeedView, ClientLimitSpeedModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-clientLimitSpeed';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.clientLimitSpeedView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        dragPlayCallback: function(query, query2) {
            if(!AUTH_OBJ.OndemandOptimization) return;
            require(['dragPlay.view', 'dragPlay.model'], function(DragPlayView, DragPlayModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-dragPlay';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.dragPlayView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        following302Callback: function(query, query2) {
            require(['following302.view', 'following302.model'], function(Following302View, Following302Model){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-following302';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.following302View.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        backOriginDetectionCallback: function(query, query2) {
            require(['backOriginDetection.view', 'backOriginDetection.model'], function(BackOriginDetectionView, BackOriginDetectionModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-backOriginDetection';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.backOriginDetectionModel)
                    this.backOriginDetectionModel = new BackOriginDetectionModel();
                if (!this.backOriginDetectionView ){
                    var options = {
                        collection: this.backOriginDetectionModel,
                        query     : query,
                        query2    : query2
                    };
                    this.backOriginDetectionView = new BackOriginDetectionView(options);
                    this.backOriginDetectionView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.backOriginDetectionView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        backOriginSetupCallback: function(query, query2) {
            require(['backOriginSetup.view', 'backOriginSetup.model'], function(BackOriginSetupView, BackOriginSetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-backOriginSetup';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.backOriginSetupView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        cnameSetupCallback: function(query, query2) {
            require(['cnameSetup.view', 'cnameSetup.model'], function(CnameSetupView, CnameSetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-cnameSetup';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.cnameSetupView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        cacheKeySetupCallback: function(query, query2) {
            require(['cacheKeySetup.view', 'cacheKeySetup.model'], function(CacheKeySetupView, CacheKeySetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-cacheKeySetup';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.cacheKeySetupView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        delMarkCacheCallback: function(query, query2) {
            require(['delMarkCache.view', 'delMarkCache.model'], function(DelMarkCacheView, DelMarkCacheModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-delMarkCache';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.delMarkCacheView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        cacheRuleCallback: function(query, query2) {
            require(['cacheRule.view', 'cacheRule.model'], function(CacheRuleView, CacheRuleModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-cacheRule';
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.cacheRuleView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        basicInformationCallback: function(query, query2){
            require(['basicInformation.view', 'basicInformation.model'], function(BasicInformationView, BasicInformationModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-basicInformation';
                if (this.customerSetupNavbar){
                    this.customerSetupNavbar.$el.remove();
                    this.customerSetupNavbar = null;
                }
                
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.basicInformationModel)
                    this.basicInformationModel = new BasicInformationModel();
                if (!this.basicInformationView ){
                    var options = {
                        collection: this.basicInformationModel,
                        query     : query,
                        query2    : query2
                    };
                    this.basicInformationView = new BasicInformationView(options);
                    this.basicInformationView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.basicInformationView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        urlBlackListCallback: function(query, query2){
            require(['urlBlackList.view', 'urlBlackList.model'], function(UrlBlackListView, UrlBlackListModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-urlBlackList';
                if (this.customerSetupNavbar){
                    this.customerSetupNavbar.$el.remove();
                    this.customerSetupNavbar = null;
                }
                
                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.urlBlackListModel)
                    this.urlBlackListModel = new UrlBlackListModel();
                if (!this.urlBlackListView ){
                    var options = {
                        collection: this.urlBlackListModel,
                        query     : query,
                        query2    : query2
                    };
                    this.urlBlackListView = new UrlBlackListView(options);
                    this.urlBlackListView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.urlBlackListView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },

        domainSetupCallback: function(query, query2) {
            require(['domainSetup.view', 'domainSetup.model'], function(DomainSetupView, DomainSetupModel){
                this.navbarView.select('customerSetup');
                this.curPage = 'customerSetup-domainList-domainSetup';

                this.setupDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

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
                    this.domainManageNavbar.select(this.curPage);
                    this.domainSetupView.update(query, query2, renderTarget);
                }
            }.bind(this));
        },
        
        domainListCallback: function(query) {
            if(!AUTH_OBJ.DomainLists || !AUTH_OBJ.ManageCustomer) return;
            require(['domainList.view', 'domainList.model', 'subNavbar.view'], function(DomainListView, DomainListModel, SubNavbar){
                this.curPage = 'customerSetup-domainList';
                this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                this.setupCustomerSetupNavbar(query)
                var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

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
                    this.customerSetupNavbar.select(this.curPage);
                    this.domainListView.update(query, renderTarget);
                }
            }.bind(this));
        },

        blockUrlCallback: function(query){
            require(['blockUrl.view','blockUrl.model'],function(BlockUrlView,BlockUrlModel){
                 this.curPage = 'customerSetup-blockUrl';
                 this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                 this.setupCustomerSetupNavbar(query);
                 var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                if(!this.blockUrlModel)
                    this.blockUrlModel = new BlockUrlModel();
                if(!this.BlockUrlView){
                    var options = {
                        collection: this.blockUrlModel,
                        query     : query
                    };

                    this.blockUrlView = new BlockUrlView(options);
                    this.blockUrlView.renderload(renderTarget);
                    
                    this.permissionsControlSuccess = function(res){
                        res = JSON.parse(res);
                        if(res.result == null){
                           this.blockUrlView.$elload.remove();
                           this.blockUrlView.renderError(renderTarget);
                        }
                        else{
                           this.blockUrlView.$elload.remove();
                           this.blockUrlView.render(renderTarget);
                        }
                    }  
                    this.onGetError = function(error){
                        this.blockUrlView.$elload.remove();
                        if(error && error.message){
                            alert(error.message);
                        }else{
                            alert('网络阻塞,请刷新重试');
                        }
                    }       
                    query = JSON.parse(query);
                    this.blockUrlModel.off('permissionsControl.success');
                    this.blockUrlModel.off('permissionsControl.error');
                    this.blockUrlModel.on('permissionsControl.success',$.proxy(this.permissionsControlSuccess,this));
                    this.blockUrlModel.on('permissionsControl.error',$.proxy(this.onGetError,this));
                    this.blockUrlModel.permissionsControl({userId:query.uid}); 
                } 

            }.bind(this));
        },

        interfaceQuotaCallback: function(query) {
            if(!AUTH_OBJ.DomainLists || !AUTH_OBJ.ManageCustomer) return;
            require(['interfaceQuota.view', 'interfaceQuota.model'], function(DomainListView, DomainListModel){
                this.curPage = 'customerSetup-interfaceQuota';
                this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                this.setupCustomerSetupNavbar(query)
                var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                if (!this.interfaceQuotaModel)
                    this.interfaceQuotaModel = new DomainListModel();
                if (!this.interfaceQuotaView ){
                    var options = {
                        collection: this.interfaceQuotaModel,
                        query     : query
                    };
                    this.interfaceQuotaView = new DomainListView(options);
                    this.interfaceQuotaView.render(renderTarget);
                } else {
                    this.customerSetupNavbar.select(this.curPage);
                    this.interfaceQuotaView.update(query, renderTarget);
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