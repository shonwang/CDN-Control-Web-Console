define("sharedSetup.detail.view", ['require', 'exports', 'template', 'modal.view', 'utility', 'react.doubleSelect.panel'],
    function(require, exports, template, Modal, Utility, ReactDoubleSelectComponent) {

        var SharedSetupDetailView = Backbone.View.extend({
            events: {
                "click .cancel": "onClickBackBtn",
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.$el = $(_.template(template['tpl/sharedSetup/sharedSetup.detail.html'])({
                    data: this.model
                }));

                this.initDoubleSelect();
                this.mainDomain = this.model ? this.model.get("mainDomain") : null;
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
                    mainDomain: "jiangran.hdllive.ks-cdn.com",
                    selected: "jiangran.hdllive.ks-cdn.com,jiangran.rtmplive.ks-cdn.com,jiangran.uplive.ks-cdn.com".split(",")
                });
                ReactDOM.render(reactTableView, this.$el.find(".select-domain-ctn").get(0));
            },

            render: function(target) {
                this.$el.appendTo(target)
            }

        });

        return SharedSetupDetailView;
    });