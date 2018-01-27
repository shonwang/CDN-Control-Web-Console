define("routes.codeRateSetup", ['require', 'exports'], 
    function(require, exports) {
        var RouterCodeRateSetup = {

            codeRateManage: function(query, query2) {
                require(['codeRateManage.view', 'codeRateManage.model'], function (CodeRateManageView, CodeRateManageModel) {
                    this.navbarView.select('codeRate');
                    this.curPage = 'customerSetup-codeRate-codeRateManage';
                    this.setUpCodeRateManageNavbar(query, query2);
                    var renderTarget = this.codeRateManageNavbar.$el.find('.sub-content')

                    if (!this.codeRateManageModel)
                        this.codeRateManageModel = new CodeRateManageModel();
                    if (!this.codeRateManageView) {
                        var options = {
                            collection: this.codeRateManageModel,
                            query: query,
                            query2: query2
                        };
                        this.codeRateManageView = new CodeRateManageView(options);
                        this.codeRateManageView.render(renderTarget);
                    } else {
                        this.codeRateManageView.update(query, query2, renderTarget);
                    }
                    this.codeRateManageNavbar.select(this.curPage);
                    this.curView = this.codeRateManageView;    
                }.bind(this));
            }

        }

        return RouterCodeRateSetup
    }
);