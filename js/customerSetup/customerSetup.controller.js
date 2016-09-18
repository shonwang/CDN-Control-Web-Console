define("customerSetup.controller", ['require','exports'], 
    function(require, exports) {

    var CustomerSetupController = Backbone.Router.extend({
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
                    this.cacheRuleView.update(query);
                }
            }.bind(this));
        },

        domainSetupCallback: function(query, query2) {
            require(['domainList.view', 'domainList.model'], function(DomainSetupView, DomainSetupModel){
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
                    this.thirdNavbar.update();
                    this.thirdNavbar.select(this.curPage);
                    this.domainSetupView.update(query);
                }
            }.bind(this));
        },

        domainListCallback: function(query) {
            require(['domainList.view', 'domainList.model', 'subNavbar.view'], function(DomainListView, DomainListModel, SubNavbar){
                this.curPage = 'domainList';
                if (!this.subNavbar){
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
                    this.subNavbar = new SubNavbar(menuOptions);
                    this.subNavbar.select(this.curPage);
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
                    this.subNavbar.update();
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