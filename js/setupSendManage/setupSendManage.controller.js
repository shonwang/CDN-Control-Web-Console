define("setupSendManage.controller", ['require','exports'], 
    function(require, exports) {
    var SetupSendManageController = Backbone.Router.extend({

        setupSendDoneCallback: function(){
            require(['setupSendDone.view', 'setupSendDone.model'], function(SetupSendDoneView, SetupSendDoneModel){
                this.curPage = 'setupSendDone';
                this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                this.initSetupSendNavbar()
                var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                if (!this.setupSendDoneModel)
                    this.setupSendDoneModel = new SetupSendDoneModel();

                if (!this.setupSendDoneView ){
                    var options = {
                        collection: this.setupSendDoneModel
                    };
                    this.setupSendDoneView = new SetupSendDoneView(options);
                    this.setupSendDoneView.render(renderTarget);
                } else {
                    this.setupSendNavbar.select(this.curPage);
                    this.setupSendDoneView.update(renderTarget);
                }
            }.bind(this));
        },

        setupSendingCallback: function(){
            require(['setupSending.view', 'setupSending.model'], function(SetupSendingView, SetupSendingModel){
                this.curPage = 'setupSending';
                this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                this.initSetupSendNavbar()
                var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                if (!this.setupSendingModel)
                    this.setupSendingModel = new SetupSendingModel();

                if (!this.setupSendingView ){
                    var options = {
                        collection: this.setupSendingModel
                    };
                    this.setupSendingView = new SetupSendingView(options);
                    this.setupSendingView.render(renderTarget);
                } else {
                    this.setupSendNavbar.select(this.curPage);
                    this.setupSendingView.update(renderTarget);
                }
            }.bind(this));
        },

        setupSendWaitCustomizeCallback: function(){
            require(['setupSendWaitCustomize.view', 'setupSendWaitCustomize.model'], function(SetupSendWaitCustomizeView, SetupSendWaitCustomizeModel){
                this.curPage = 'setupSendWaitCustomize';
                this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                this.initSetupSendNavbar()
                var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                if (!this.setupSendWaitCustomizeModel)
                    this.setupSendWaitCustomizeModel = new SetupSendWaitCustomizeModel();

                if (!this.setupSendWaitCustomizeView ){
                    var options = {
                        collection: this.setupSendWaitCustomizeModel
                    };
                    this.setupSendWaitCustomizeView = new SetupSendWaitCustomizeView(options);
                    this.setupSendWaitCustomizeView.render(renderTarget);
                } else {
                    this.setupSendNavbar.select(this.curPage);
                    this.setupSendWaitCustomizeView.update(renderTarget);
                }
            }.bind(this));
        },

        setupSendWaitSendCallback: function(){
            require(['setupSendWaitSend.view', 'setupSendWaitSend.model'], function(SetupSendWaitSendView, SetupSendWaitSendModel){
                this.curPage = 'setupSendWaitSend';
                this.navbarView.select('setupSendManage', $.proxy(this.removeSubSideBar, this));
                this.initSetupSendNavbar()
                var renderTarget = this.setupSendNavbar.$el.find('.sub-content');

                if (!this.setupSendWaitSendModel)
                    this.setupSendWaitSendModel = new SetupSendWaitSendModel();

                if (!this.setupSendWaitSendView ){
                    var options = {
                        collection: this.setupSendWaitSendModel
                    };
                    this.setupSendWaitSendView = new SetupSendWaitSendView(options);
                    this.setupSendWaitSendView.render(renderTarget);
                } else {
                    this.setupSendNavbar.select(this.curPage);
                    this.setupSendWaitSendView.update(renderTarget);
                }
            }.bind(this));
        },

    });
    return new SetupSendManageController();
});