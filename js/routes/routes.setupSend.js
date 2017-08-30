define("routes.setupSend", ['require', 'exports'], 
    function(require, exports) {
        var RouterSetupSend = {
            sharedSetup: function(query) {
                if (!AUTH_OBJ.ShareConfig) return;
                require(['sharedSetup.view', 'sharedSetup.model'], function(SharedSetupView, SharedSetupModel) {
                    this.curPage = 'sharedSetup';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    var renderTarget = $('.ksc-content')
                    if (!this.sharedSetupModel)
                        this.sharedSetupModel = new SharedSetupModel();
                    if (!this.sharedSetupView) {
                        var options = {
                            collection: this.sharedSetupModel,
                            query: query
                        };
                        this.sharedSetupView = new SharedSetupView(options);
                        this.sharedSetupView.render(renderTarget);
                    } else {
                        this.sharedSetupView.update(renderTarget, query);
                    }
                    this.curView = this.sharedSetupView;
                }.bind(this));
            },

            isomorphismManage: function() {
                //if (!AUTH_OBJ.OpenApiLogManager) return;
                if (!AUTH_OBJ.IsomerismManage) return;
                require(['isomorphismManage.view', 'isomorphismManage.model'], function(IsomorphismManageView, IsomorphismManageModel) {
                    this.curPage = 'isomorphismManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    var renderTarget = $('.ksc-content')
                    if (!this.isomorphismManageModel)
                        this.isomorphismManageModel = new IsomorphismManageModel();
                    if (!this.isomorphismManageView) {
                        var options = {
                            collection: this.isomorphismManageModel
                        };
                        this.isomorphismManageView = new IsomorphismManageView(options);
                        this.isomorphismManageView.render(renderTarget);
                    } else {
                        this.isomorphismManageView.update(renderTarget);
                    }
                    this.curView = this.isomorphismManageView;
                }.bind(this));
            },
            
            setupChannelManage: function() {
                if (!AUTH_OBJ.ManageDomain) return;
                require(['setupChannelManage.view', 'setupChannelManage.model'], function(SetupChannelManageView, SetupChannelManageModel) {
                    this.curPage = 'setupChannelManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.setupChannelManageModel)
                        this.setupChannelManageModel = new SetupChannelManageModel();
                    if (!this.setupChannelManageView) {
                        var options = {
                            collection: this.setupChannelManageModel
                        };
                        this.setupChannelManageView = new SetupChannelManageView(options);
                        this.setupChannelManageView.render($('.ksc-content'));
                    } else {
                        this.setupChannelManageView.update();
                    }
                    this.curView = this.setupChannelManageView;
                }.bind(this));
            },

            setupSendDone: function() {
                if (!AUTH_OBJ.SendDone) return;
                require(['setupSendDone.view', 'setupSendDone.model'], function(SetupSendDoneView, SetupSendDoneModel) {
                    this.curPage = 'setupSendDone';
                    this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                    this.initSetupSendNavbar()
                    var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                    if (!this.setupSendDoneModel)
                        this.setupSendDoneModel = new SetupSendDoneModel();

                    if (!this.setupSendDoneView) {
                        var options = {
                            collection: this.setupSendDoneModel
                        };
                        this.setupSendDoneView = new SetupSendDoneView(options);
                        this.setupSendDoneView.render(renderTarget);
                    } else {
                        this.setupSendDoneView.update(renderTarget);
                    }
                    this.setupSendNavbar.select(this.curPage);
                    this.curView = this.setupSendDoneView;
                }.bind(this));
            },

            setupSending: function() {
                if (!AUTH_OBJ.Sending) return;
                require(['setupSending.view', 'setupSending.model'], function(SetupSendingView, SetupSendingModel) {
                    this.curPage = 'setupSending';
                    this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                    this.initSetupSendNavbar()
                    var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                    if (!this.setupSendingModel)
                        this.setupSendingModel = new SetupSendingModel();

                    if (!this.setupSendingView) {
                        var options = {
                            collection: this.setupSendingModel
                        };
                        this.setupSendingView = new SetupSendingView(options);
                        this.setupSendingView.render(renderTarget);
                    } else {
                        this.setupSendingView.update(renderTarget);
                    }
                    this.setupSendNavbar.select(this.curPage);
                    this.curView = this.setupSendingView;
                }.bind(this));
            },

            setupSendWaitCustomize: function() {
                if (!AUTH_OBJ.WaitCustomize) return;
                require(['setupSendWaitCustomize.view', 'setupSendWaitCustomize.model'], function(SetupSendWaitCustomizeView, SetupSendWaitCustomizeModel) {
                    this.curPage = 'setupSendWaitCustomize';
                    this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                    this.initSetupSendNavbar()
                    var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                    if (!this.setupSendWaitCustomizeModel)
                        this.setupSendWaitCustomizeModel = new SetupSendWaitCustomizeModel();

                    if (!this.setupSendWaitCustomizeView) {
                        var options = {
                            collection: this.setupSendWaitCustomizeModel
                        };
                        this.setupSendWaitCustomizeView = new SetupSendWaitCustomizeView(options);
                        this.setupSendWaitCustomizeView.render(renderTarget);
                    } else {
                        this.setupSendWaitCustomizeView.update(renderTarget);
                    }
                    this.setupSendNavbar.select(this.curPage);
                    this.curView = this.setupSendWaitCustomizeView;
                }.bind(this));
            },

            setupSendWaitSend: function() {
                if (!AUTH_OBJ.WaitSend) return;
                require(['setupSendWaitSend.view', 'setupSendWaitSend.model'], function(SetupSendWaitSendView, SetupSendWaitSendModel) {
                    this.curPage = 'setupSendWaitSend';
                    this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                    this.initSetupSendNavbar()
                    var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                    if (!this.setupSendWaitSendModel)
                        this.setupSendWaitSendModel = new SetupSendWaitSendModel();

                    if (!this.setupSendWaitSendView) {
                        var options = {
                            collection: this.setupSendWaitSendModel
                        };
                        this.setupSendWaitSendView = new SetupSendWaitSendView(options);
                        this.setupSendWaitSendView.render(renderTarget);
                    } else {
                        this.setupSendWaitSendView.update(renderTarget);
                    }
                    this.setupSendNavbar.select(this.curPage);
                    this.curView = this.setupSendWaitSendView;
                }.bind(this));
            },

            applicationChange:function(){
                if (!AUTH_OBJ.PlatformChange) return;
                require(['applicationChange.view', 'applicationChange.model'], function(ApplicationChangeView, ApplicationChangeModel) {
                    this.curPage = 'applicationChange';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.applicationChangeModel)
                        this.applicationChangeModel = new ApplicationChangeModel();
                    if (!this.applicationChangeView) {
                        var options = {
                            collection: this.applicationChangeModel
                        };
                        this.applicationChangeView = new ApplicationChangeView(options);
                        this.applicationChangeView.render($('.ksc-content'));
                    } else {
                        this.applicationChangeView.update();
                    }
                    this.curView = this.applicationChangeView;
                }.bind(this));
            },

        }

        return RouterSetupSend
    }
);