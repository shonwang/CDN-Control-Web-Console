define("routes.resourceManage", ['require', 'exports'], 
    function(require, exports) {
        var RouterResourceManage = {
            
            coverManage: function() {
                if (!AUTH_OBJ.ManageCoverrelateds) return;
                require(['coverManage.view', 'coverManage.model', 'nodeManage.model'], function(CoverManageView, CoverManageModel, NodeManageModel) {
                    this.curPage = 'coverManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.coverManageModel)
                        this.coverManageModel = new CoverManageModel();
                    if (!this.nodeManageModel)
                        this.nodeManageModel = new NodeManageModel();
                    if (!this.coverManageView) {
                        var options = {
                            collection: this.coverManageModel,
                            nodeCollection: this.nodeManageModel
                        };
                        this.coverManageView = new CoverManageView(options);
                        this.coverManageView.render($('.ksc-content'));
                    } else {
                        this.coverManageView.update();
                    }
                    this.curView = this.coverManageView;
                }.bind(this));
            },

            coverRegion: function() {
                if (!AUTH_OBJ.Coverrelateds) return;
                require(['coverRegion.view', 'coverRegion.model'], function(CoverRegionView, CoverRegionModel) {
                    this.curPage = 'coverRegion';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.coverRegionModel)
                        this.coverRegionModel = new CoverRegionModel();
                    if (!this.coverRegionView) {
                        var options = {
                            collection: this.coverRegionModel
                        };
                        this.coverRegionView = new CoverRegionView(options);
                        this.coverRegionView.render($('.ksc-content'));
                    } else {
                        this.coverRegionView.update();
                    }
                    this.curView = this.coverRegionView;
                }.bind(this));
            },
            specialLayerManage: function() {
                if (!AUTH_OBJ.LayeredStrategyManage) return;
                require(['specialLayerManage.view', 'specialLayerManage.model'], function(SpecialLayerManageView, SpecialLayerManageModel) {
                    this.curPage = 'specialLayerManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.specialLayerManageModel)
                        this.specialLayerManageModel = new SpecialLayerManageModel();
                    if (!this.specialLayerManageView) {
                        var options = {
                            collection: this.specialLayerManageModel
                        };
                        this.specialLayerManageView = new SpecialLayerManageView(options);
                        this.specialLayerManageView.render($('.ksc-content'));
                    } else {
                        this.specialLayerManageView.update($('.ksc-content'));
                    }
                    this.curView = this.specialLayerManageView;
                }.bind(this));
            },

            setupTopoManage: function() {
                require(['setupTopoManage.view', 'setupTopoManage.model'], function(SetupTopoManageView, SetupTopoManageModel) {
                    this.curPage = 'setupTopoManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.setupTopoManageModel)
                        this.setupTopoManageModel = new SetupTopoManageModel();
                    if (!this.setupTopoManageView) {
                        var options = {
                            collection: this.setupTopoManageModel
                        };
                        this.setupTopoManageView = new SetupTopoManageView(options);
                        this.setupTopoManageView.render($('.ksc-content'));
                    } else {
                        this.setupTopoManageView.update($('.ksc-content'));
                    }
                    this.curView = this.setupTopoManageView;
                }.bind(this));
            },

            setupAppManage: function() {
                require(['setupAppManage.view', 'setupAppManage.model'], function(SetupAppManageView, SetupAppManageModel) {
                    this.curPage = 'setupAppManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.setupAppManageModel)
                        this.setupAppManageModel = new SetupAppManageModel();
                    if (!this.setupAppManageView) {
                        var options = {
                            collection: this.setupAppManageModel
                        };
                        this.setupAppManageView = new SetupAppManageView(options);
                        this.setupAppManageView.render($('.ksc-content'));
                    } else {
                        this.setupAppManageView.update($('.ksc-content'));
                    }
                    this.curView = this.setupAppManageView;
                }.bind(this));
            },

            ipManage: function() {
                if (!AUTH_OBJ.ManageIPs) return;
                require(['ipManage.view', 'ipManage.model', 'deviceManage.model'], function(IPManageView, IPManageModel, DeviceManageModel) {
                    this.curPage = 'ipManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.ipManageModel)
                        this.ipManageModel = new IPManageModel();
                    if (!this.deviceManageModel)
                        this.deviceManageModel = new DeviceManageModel();
                    if (!this.ipManageView) {
                        var options = {
                            collection: this.ipManageModel,
                            deviceCollection: this.deviceManageModel
                        };
                        this.ipManageView = new IPManageView(options);
                        this.ipManageView.render($('.ksc-content'));
                    } else {
                        this.ipManageView.update($('.ksc-content'));
                    }
                    this.curView = this.ipManageView;
                }.bind(this));
            },

            nodeManage: function() {
                if (!AUTH_OBJ.ManageNodes) return;
                require(['nodeManage.view', 'nodeManage.model'], function(NodeManageView, NodeManageModel) {
                    this.curPage = 'nodeManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.nodeManageModel)
                        this.nodeManageModel = new NodeManageModel();
                    if (!this.nodeManageView) {
                        var options = {
                            collection: this.nodeManageModel
                        };
                        this.nodeManageView = new NodeManageView(options);
                        this.nodeManageView.render($('.ksc-content'));
                    } else {
                        this.nodeManageView.update();
                    }
                    this.curView = this.nodeManageView;
                }.bind(this));
            },

            deviceManage: function(query) {
                if (!AUTH_OBJ.ManageHosts) return;
                require(['deviceManage.view', 'deviceManage.model'], function(DeviceManageView, DeviceManageModel) {
                    this.curPage = 'deviceManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.deviceManageModel)
                        this.deviceManageModel = new DeviceManageModel();
                    if (!this.deviceManageView) {
                        var options = {
                            collection: this.deviceManageModel,
                            query: query
                        };
                        this.deviceManageView = new DeviceManageView(options);
                        this.deviceManageView.render($('.ksc-content'));
                    } else {
                        this.deviceManageView.update(query, $('.ksc-content'));
                    }
                    this.curView = this.deviceManageView;
                }.bind(this));
            }
        }

        return RouterResourceManage
    }
);