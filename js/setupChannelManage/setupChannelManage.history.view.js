define("setupChannelManage.history.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var HistoryView = Backbone.View.extend({
            events: {
                //"click .search-btn":"onClickSearch"
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;

                this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.history.html'])({
                    data: {}
                }));

                this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));

                this.collection.off("get.channel.history.success");
                this.collection.off("get.channel.history.error");
                this.collection.on("get.channel.history.success", $.proxy(this.initSetup, this));
                this.collection.on("get.channel.history.error", $.proxy(this.onGetError, this));
                this.collection.getVersionList({
                    "originId": this.model.get("id")
                })
            },

            initSetup: function(data) {
                this.versionList = data;

                this.$el.find('#input-domain').val(this.model.get("domain"))

                _.each(data, function(el, index, ls) {
                    if (el.createTime)
                        el.createTimeFormated = new Date(el.createTime).format("yyyy/MM/dd hh:mm:ss")
                }.bind(this))

                this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.history.table.html'])({
                    data: data,
                }));

                if (!AUTH_OBJ.SendHistoryConfig) {
                    this.table.find('.publish').remove();
                }
                if (data.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

                this.table.find("tbody .bill").on("click", $.proxy(this.onClickItemBill, this));
                this.table.find("tbody .publish").on("click", $.proxy(this.onClickItemPublish, this));
            },

            onClickItemPublish: function(event) {
                var eventTarget = event.srcElement || event.target,
                    version = $(eventTarget).attr("version");

                var postParam = [{
                    domain: this.model.get("domain"),
                    version: version,
                    description: this.model.get("description"),
                    configReason: 1
                }]

                this.collection.off("post.predelivery.success");
                this.collection.off("post.predelivery.error");
                this.collection.on("post.predelivery.success", $.proxy(this.onPostPredelivery, this));
                this.collection.on("post.predelivery.error", $.proxy(this.onGetError, this));
                this.collection.predelivery(postParam)
            },

            onPostPredelivery: function() {
                alert("发布成功！")
                window.location.hash = '#/setupSendWaitSend';
            },

            onClickItemBill: function(event) {
                var eventTarget = event.srcElement || event.target,
                    version = $(eventTarget).attr("version");

                require(['setupBill.view', 'setupBill.model'], function(SetupBillView, SetupBillModel) {
                    var mySetupBillModel = new SetupBillModel();
                    var mySetupBillView = new SetupBillView({
                        collection: mySetupBillModel,
                        originId: this.model.get("id"),
                        version: version,
                        onSaveCallback: function() {}.bind(this),
                        onCancelCallback: function() {
                            mySetupBillView.$el.remove();
                            this.$el.find(".history-panel").show();
                        }.bind(this)
                    })

                    this.$el.find(".history-panel").hide();
                    mySetupBillView.render(this.$el.find(".bill-panel"));
                }.bind(this))
            },

            onClickCancelButton: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return HistoryView
    });