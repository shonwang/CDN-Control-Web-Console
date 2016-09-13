define("customerSetup.controller", ['require','exports'], 
    function(require, exports) {

    var CustomerSetupController = Backbone.Router.extend({
        domainSetupCallback: function(query, query2) {
            require(['domainList.view', 'domainList.model', 'subNavbar.view'], function(DomainSetupView, DomainSetupModel, SubNavbar){
                this.curPage = 'domainSetup';
                if (!this.thirdNavbar){
                    var menu = [{
                        id: '',
                        name: '域名设置',
                        hash: 'javascript:void(0)',
                        children: [{
                            id: 'domainSetup',
                            name: '域名基础设置',
                            hash: 'index.html#/domainList/' + query + /domainSetup/ + query2,
                            active: true,
                            children: []
                        },{
                            id: 'cnameSetup',
                            name: 'CNAME设置',
                            hash: 'index.html#/domainList/' + query + /cnameSetup/ + query2,
                            active: false,
                            children: []
                        }]
                    },{
                        id: '',
                        name: '源站配置',
                        hash: 'javascript:void(0)',
                        children: [{
                            id: '',
                            name: '回源配置',
                            hash: 'index.html#/domainList/' + query + /domainSetup/ + query2,
                            active: true,
                            children: []
                        },{
                            id: '',
                            name: '回源Host',
                            hash: 'index.html#/domainList/' + query + /domainSetup/ + query2,
                            active: false,
                            children: []
                        }]
                    }], menuOptions = {
                        backHash: 'index.html#/domainList/' + query,
                        menuList: menu
                    }
                    this.thirdNavbar = new SubNavbar(menuOptions);
                    this.thirdNavbar.select(this.curPage);
                }
                if (!this.domainSetupModel)
                    this.domainSetupModel = new DomainSetupModel();
                if (!this.domainSetupView ){
                    var options = {
                        collection: this.domainSetupModel,
                        query     : query
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