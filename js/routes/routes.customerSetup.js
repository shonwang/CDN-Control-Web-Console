define("routes.customerSetup", ['require', 'exports'], 
    function(require, exports) {
        var RouterCustomerSetup = {

            checkUrl:function(query){
                require(['checkUrl.view', 'checkUrl.model'], function(CheckUrlView, CheckUrlModel) {
                    this.curPage = 'customerSetup-checkUrl';
                    this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                    this.setupCustomerSetupNavbar(query)
                    var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                    if (!this.checkUrlModel)
                        this.checkUrlModel = new CheckUrlModel();
                    if (!this.checkUrlView) {
                        var options = {
                            collection: this.checkUrlModel,
                            query: query
                        };
                        this.checkUrlView = new CheckUrlView(options);
                        this.checkUrlView.render(renderTarget);
                    } else {
                        this.checkUrlView.update(query, renderTarget);
                    }
                    this.customerSetupNavbar.select(this.curPage);
                    this.curView = this.checkUrlView;
                }.bind(this));                
            },

            pnoSetup: function(query) {
                if (!AUTH_OBJ.DomainLists || !AUTH_OBJ.ManageCustomer ) return;
                require(['pnoSetup.view', 'pnoSetup.model'], function(PNOSetupView, PNOSetupModel) {
                    this.curPage = 'customerSetup-pnoSetup';
                    this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                    this.setupCustomerSetupNavbar(query)
                    var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                    if (!this.pnoSetupModel)
                        this.pnoSetupModel = new PNOSetupModel();
                    if (!this.pnoSetupView) {
                        var options = {
                            collection: this.pnoSetupModel,
                            query: query
                        };
                        this.pnoSetupView = new PNOSetupView(options);
                        this.pnoSetupView.render(renderTarget);
                    } else {
                        this.pnoSetupView.update(query, renderTarget);
                    }
                    this.customerSetupNavbar.select(this.curPage);
                    this.curView = this.pnoSetupView;
                }.bind(this));
            },

            openAPILogSetup: function(query, query2) {
                if (!AUTH_OBJ.OpenApiLogManager) return;
                require(['openAPILogSetup.view', 'openAPILogSetup.model'], function(OpenAPILogSetupView, OpenAPILogSetupModel) {
                    
                    if (this.customerSetupNavbar) {
                        this.customerSetupNavbar.$el.remove();
                        this.customerSetupNavbar = null;
                    }
                    
                    this.navbarView.select('customerSetup');
                    this.curPage = 'customerSetup-domainList-openAPILogSetup';
                    this.setupLogSetupDomainManageNavbar(query, query2);
                    var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                    if (!this.openAPILogSetupModel)
                        this.openAPILogSetupModel = new OpenAPILogSetupModel();
                    if (!this.openAPILogSetupView) {
                        var options = {
                            collection: this.openAPILogSetupModel,
                            query: query,
                            query2: query2
                        };
                        this.openAPILogSetupView = new OpenAPILogSetupView(options);
                        this.openAPILogSetupView.render(renderTarget);
                    } else {
                        this.openAPILogSetupView.update(query, query2, renderTarget);
                    }
                    this.domainManageNavbar.select(this.curPage);
                    this.curView = this.openAPILogSetupView;
                }.bind(this));
            },

            domainList: function(query) {
                if (!AUTH_OBJ.DomainLists || !AUTH_OBJ.ManageCustomer) return;
                require(['domainList.view', 'domainList.model', 'subNavbar.view'], function(DomainListView, DomainListModel, SubNavbar) {
                    this.curPage = 'customerSetup-domainList';
                    this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                    this.setupCustomerSetupNavbar(query)
                    var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                    if (!this.domainListModel)
                        this.domainListModel = new DomainListModel();
                    if (!this.domainListView) {
                        var options = {
                            collection: this.domainListModel,
                            query: query
                        };
                        this.domainListView = new DomainListView(options);
                        this.domainListView.render(renderTarget);
                    } else {
                        this.domainListView.update(query, renderTarget);
                    }
                    this.customerSetupNavbar.select(this.curPage);
                    this.curView = this.domainListView;
                }.bind(this));
            },

            blockUrl: function(query) {
                require(['blockUrl.view', 'blockUrl.model'], function(BlockUrlView, BlockUrlModel) {
                    this.curPage = 'customerSetup-blockUrl';
                    this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                    this.setupCustomerSetupNavbar(query);
                    var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                    if (!this.blockUrlModel)
                        this.blockUrlModel = new BlockUrlModel();
                    if(this.blockUrlView){
                        this.blockUrlView.remove();
                        this.blockUrlView = null;
                    }
                    if (!this.blockUrlView) {
                        var options = {
                            collection: this.blockUrlModel,
                            query: query
                        };

                        this.blockUrlView = new BlockUrlView(options);
                        this.blockUrlView.renderload(renderTarget);

                        this.permissionsControlSuccess = function(res) {
                            res = JSON.parse(res);
                            if (res.result == null) {
                                this.blockUrlView.$elload.remove();
                                this.blockUrlView.renderError(renderTarget);
                            } else {
                                this.blockUrlView.$elload.remove();
                                this.blockUrlView.render(renderTarget);
                            }
                        }
                        this.onGetError = function(error) {
                            this.blockUrlView.$elload.remove();
                            if (error && error.message) {
                                alert(error.message);
                            } else {
                                alert('网络阻塞,请刷新重试');
                            }
                        }
                        query = JSON.parse(query);
                        this.blockUrlModel.off('permissionsControl.success');
                        this.blockUrlModel.off('permissionsControl.error');
                        this.blockUrlModel.on('permissionsControl.success', $.proxy(this.permissionsControlSuccess, this));
                        this.blockUrlModel.on('permissionsControl.error', $.proxy(this.onGetError, this));
                        this.blockUrlModel.permissionsControl({
                            userId: query.uid
                        });
                    } else {
                        this.blockUrlView.update(renderTarget);
                    }
                    this.customerSetupNavbar.select(this.curPage);
                    this.curView = this.blockUrlView;
                }.bind(this));
            },

            interfaceQuota: function(query) {
                if (!AUTH_OBJ.DomainLists || !AUTH_OBJ.ManageCustomer || !AUTH_OBJ.OpenApiQuota) return;
                require(['interfaceQuota.view', 'interfaceQuota.model'], function(DomainListView, DomainListModel) {
                    this.curPage = 'customerSetup-interfaceQuota';
                    this.navbarView.select('customerSetup', $.proxy(this.removeSubSideBar, this));
                    this.setupCustomerSetupNavbar(query)
                    var renderTarget = this.customerSetupNavbar.$el.find('.sub-content');

                    if (!this.interfaceQuotaModel)
                        this.interfaceQuotaModel = new DomainListModel();
                    if (!this.interfaceQuotaView) {
                        var options = {
                            collection: this.interfaceQuotaModel,
                            query: query
                        };
                        this.interfaceQuotaView = new DomainListView(options);
                        this.interfaceQuotaView.render(renderTarget);
                    } else {
                        this.interfaceQuotaView.update(query, renderTarget);
                    }
                    this.customerSetupNavbar.select(this.curPage);
                    this.curView = this.interfaceQuotaView;
                }.bind(this));
            },

            customerSetup: function() {
                require(['customerSetup.view', 'customerSetup.model'], function(CustomerSetupView, CustomerSetupModel) {
                    this.curPage = 'customerSetup';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));

                    if (!this.customerSetupModel)
                        this.customerSetupModel = new CustomerSetupModel();
                    if (!this.customerSetupView) {
                        var options = {
                            collection: this.customerSetupModel
                        };
                        this.customerSetupView = new CustomerSetupView(options);
                        this.customerSetupView.render($('.ksc-content'));
                    } else {
                        this.customerSetupView.update();
                    }
                    this.curView = this.customerSetupView;
                }.bind(this));
            },

        }

        return RouterCustomerSetup
    }
);