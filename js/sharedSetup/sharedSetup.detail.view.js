define("sharedSetup.detail.view", ['require', 'exports', 'template', 'modal.view', 'utility', 'react.doubleSelect.panel', "react", "react-dom"],
    function(require, exports, template, Modal, Utility, ReactDoubleSelectComponent, React, ReactDOM) {

        var SharedSetupDetailView = Backbone.View.extend({
            events: {
                // "click .cancel": "onClickBackBtn",
                // "click .save": "onClickSaveBtn"
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.$el = $(_.template(template['tpl/sharedSetup/sharedSetup.detail.html'])({
                    data: this.model
                }));

                this.collection.off("set.configSharedGroup.success");
                this.collection.off("set.configSharedGroup.error"); 
                this.collection.on("set.configSharedGroup.success", $.proxy(this.onSetConfigSharedGroupSuccess, this));
                this.collection.on("set.configSharedGroup.error", $.proxy(this.onGetError, this));
                this.$el.find(".cancel").on("click", $.proxy(this.onClickBackBtn, this));
                this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this))

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
                ReactDOM.unmountComponentAtNode(this.$el.find(".select-domain-ctn").get(0));
                ReactDOM.render(reactTableView, this.$el.find(".select-domain-ctn").get(0));
            },

            onChangeMainDomain: function(domain){
                this.mainDomain = domain;
            },

            onChangeSharedDomain: function(domains){
                this.sharedDomain = domains.join(",");
            },

            onSetConfigSharedGroupSuccess: function(){
                Utility.alerts("操作成功！", "success", 3000);
                this.onClickBackBtn();
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

                if (this.model){
                    postParam.id = this.model.get("id");
                    this.collection.updateConfigSharedGroup(postParam)
                } else {
                    this.collection.addConfigSharedGroup(postParam)
                }
            },

            render: function(target) {
                this.$el.appendTo(target)
            }

        });

        return SharedSetupDetailView;
    });