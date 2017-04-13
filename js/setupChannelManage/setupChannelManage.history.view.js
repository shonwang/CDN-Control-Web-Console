define("setupChannelManage.history.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var AddCommentsView = Backbone.View.extend({

            initialize: function() {
                this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.history.addComments.html'])({
                    data: {}
                }));
            },

            onSure: function() {
                return this.$el.find('#secondary').val();
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        })

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

                this.requirySetupSendWaitCustomizeModel();

                //this.description = this.model.get("description");
            },

            requirySetupSendWaitCustomizeModel: function(){
                require(['setupSendWaitCustomize.model'], function(SetupSendWaitCustomizeModel){
                    this.mySetupSendWaitCustomizeModel = new SetupSendWaitCustomizeModel();
                    this.mySetupSendWaitCustomizeModel.off("get.channel.config.success");
                    this.mySetupSendWaitCustomizeModel.off("get.channel.config.error");
                    this.mySetupSendWaitCustomizeModel.on("get.channel.config.success", $.proxy(this.onGetApplicationType, this));
                    this.mySetupSendWaitCustomizeModel.on("get.channel.config.error", $.proxy(this.onGetError, this));
                    this.mySetupSendWaitCustomizeModel.getChannelConfig({
                        domain: this.model.get("domain"),
                        version: this.model.get("version") || this.model.get("domainVersion")
                    })
                }.bind(this));
            },

            onGetApplicationType: function(data){
                this.applicationType = data.applicationType.type
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
                        el.createTimeFormated = new Date(el.createTime).format("yyyy/MM/dd hh:mm:ss");
                    if (el.deliveryStatus === -1) el.statusStr = "<span class='test-danger'>失败</span>";
                    if (el.deliveryStatus === 1) el.statusStr = "<span class='test-success'>成功</span>";
                    if (!el.deliveryStatus) el.statusStr = "<span class='test-muted'>未发布</span>";
                    this.originId = el.originId;
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
                this.table.find("tbody .config").on("click", $.proxy(this.onClickItemConfig, this));
                this.table.find("tbody .publish").on("click", $.proxy(this.onClickItemPublish, this));
                this.table.find("tbody .comments").on("click", $.proxy(this.onClickItemComments, this));

                this.table.find("[data-toggle='popover']").popover();
            },

            onClickItemComments: function(event) {
                var eventTarget = event.srcElement || event.target,
                    version = $(eventTarget).attr("version");

                if (this.commentsPopup) $("#" + this.commentsPopup.modalId).remove();

                var myAddCommentsView = new AddCommentsView({
                    collection: this.collection,
                });
                var options = {
                    title: "添加备注",
                    body: myAddCommentsView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var comments = myAddCommentsView.onSure();
                        this.collection.off('set.remark.success');
                        this.collection.off('set.remark.error');
                        this.collection.on('set.remark.success', function() {
                            alert("修改成功");
                            this.collection.getVersionList({
                                "originId": this.model.get("id")
                            })
                        }.bind(this))
                        this.collection.on('set.remark.error', $.proxy(this.onGetError, this))
                        this.collection.modifyVersionRemark({
                            originId: this.originId,
                            version: version,
                            remark: comments
                        })
                        this.commentsPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.commentsPopup = new Modal(options);
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

            onClickItemConfig: function(event) {
                var eventTarget = event.srcElement || event.target,
                    version = $(eventTarget).attr("version");

                var clickedObj = {
                    domain: this.model.get("domain"),
                    domainVersion: version,
                    isCustom: this.model.get("isCustom"),
                    platformId: this.applicationType
                }

                require(["setupSending.detail.view"], function(SendDetailView) {
                    if (this.configFilePopup) $("#" + this.configFilePopup.modalId).remove();

                    var myConfiFileDetailView = new SendDetailView.ConfiFileDetailView({
                        collection: this.collection,
                        model: clickedObj
                    });
                    var options = {
                        title: "配置文件详情",
                        body: myConfiFileDetailView,
                        backdrop: 'static',
                        type: 1,
                        onOKCallback: function() {
                            this.configFilePopup.$el.modal("hide");
                        }.bind(this),
                        onHiddenCallback: function() {}.bind(this)
                    }
                    this.configFilePopup = new Modal(options);
                }.bind(this))
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