define("customerSetup.live.controller", ['require','exports'], 
    function(require, exports) {

    var CustomerSetupLiveController = Backbone.Router.extend({

        liveBasicInformationCallback: function(query, query2){
            require(['liveBasicInformation.view', 'liveBasicInformation.model'], function(LiveBasicInformationView, LiveInformationModel){
                //一级菜单选中域名配置
                this.navbarView.select('customerSetup');
                //设置当前页面ID
                this.curPage = 'customerSetup-domainList-liveBasicInformation';
                //移除用户域名列表二级菜单
                if (this.customerSetupNavbar){
                    this.customerSetupNavbar.$el.remove();
                    this.customerSetupNavbar = null;
                }
                //生成直播域名管理三级菜单
                this.setupLiveDomainManageNavbar(query, query2);
                var renderTarget = this.domainManageNavbar.$el.find('.sub-content')

                if (!this.liveBasicInformationModel)
                    this.liveBasicInformationModel = new LiveInformationModel();
                if (!this.liveBasicInformationView ){
                    var options = {
                        collection: this.liveBasicInformationModel,
                        query     : query,
                        query2    : query2
                    };
                    this.liveBasicInformationView = new LiveBasicInformationView(options);
                    this.liveBasicInformationView.render(renderTarget);
                } else {
                    this.domainManageNavbar.select(this.curPage);
                    this.liveBasicInformationView.update(query, query2, renderTarget);
                }
            }.bind(this));
        }
    });
    return new CustomerSetupLiveController();
});