define("routes.logManage", ['require', 'exports'], 
    function(require, exports) {
        var RouterLogManage = {

            logTemplateManage: function() {
                require(['logTemplateManage.view', 'logTemplateManage.model'], function(LogTemplateManageView, LogTemplateManageModel) {
                    this.curPage = 'logTemplateManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.logTemplateManageModel)
                        this.logTemplateManageModel = new LogTemplateManageModel();
                    if (!this.logTemplateManageView) {
                        var options = {
                            collection: this.logTemplateManageModel
                        };
                        this.logTemplateManageView = new LogTemplateManageView(options);
                        this.logTemplateManageView.render($('.ksc-content'));
                    } else {
                        this.logTemplateManageView.update($('.ksc-content'));
                    }
                    this.curView = this.logTemplateManageView;
                }.bind(this));
            },

        }

        return RouterLogManage
    }
);