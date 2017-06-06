define("sharedSetup.detail.view", ['require', 'exports', 'template', 'modal.view', 'utility', 'react.doubleSelect.panel'],
    function(require, exports, template, Modal, Utility, ReactDoubleSelectComponent) {

        var SharedSetupDetailView = Backbone.View.extend({
            events: {
                "click .cancel": "onClickBackBtn",
                "click .save": "onClickSaveBtn"
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.$el = $(_.template(template['tpl/sharedSetup/sharedSetup.detail.html'])({
                    data: this.model
                }));
                this.mainDomain = this.model ? this.model.get("mainDomain") : "";
                this.sharedDomain = this.model ? this.model.get("sharedDomain")  : "";

                this.initDoubleSelect();
            },

            onClickBackBtn: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message);
                else
                    Utility.alerts("网络阻塞，请刷新重试！");
            },

            initDoubleSelect: function() {
                var ReactTableView = React.createFactory(ReactDoubleSelectComponent);
                var reactTableView = ReactTableView({
                    collection: this.collection,
                    mainDomain: this.mainDomain,
                    selected: this.sharedDomain&&this.sharedDomain.split(","),
                    onChangeMainDomain: $.proxy(this.onChangeMainDomain, this),
                    onChangeSharedDomain: $.proxy(this.onChangeSharedDomain, this)
                });
                ReactDOM.render(reactTableView, this.$el.find(".select-domain-ctn").get(0));
            },

            onChangeMainDomain: function(domain){
                this.mainDomain = domain;
            },

            onChangeSharedDomain: function(domains){
                this.sharedDomain = domains.join(",");
            },

            onClickSaveBtn: function(){
                if (this.mainDomain === "") {
                    Utility.alerts("请选择主域名！")
                    return;
                }
                var postParam = {
                    name: this.$el.find("#input-setup-name").val().trim(),
                    mainDomain: this.mainDomain,
                    sharedDomain: this.sharedDomain
                }

                if (postParam.name === "") {
                    Utility.alerts("请输入共享配置名称！")
                    return;
                }
            },

            render: function(target) {
                this.$el.appendTo(target)
            }

        });

        return SharedSetupDetailView;
    });