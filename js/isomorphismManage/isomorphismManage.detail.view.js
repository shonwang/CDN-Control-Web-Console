define("isomorphismManage.detail.view", ['require', 'exports', 'template', 'modal.view', 'utility', 'react.table'],
    function(require, exports, template, Modal, Utility, ReactTableComponent) {

        var IsomorphismManageDetailView = Backbone.View.extend({
            events: {
                "click .opt-ctn .back": "onClickBackBtn",
                "click .opt-ctn .diff": "onClickDiffBtn"
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.$el = $(_.template(template['tpl/isomorphismManage/isomorphismManage.detail.html'])({
                    data: this.model
                }));

                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.queryArgs = {
                    "originId": this.model.get("id"),
                }
                this.$el.find(".opt-ctn .diff").attr("disabled", "disabled");

                this.collection.on("get.channel.history.success", $.proxy(this.onGetVersionListSuccess, this));
                this.collection.on("get.channel.history.error", $.proxy(this.onGetError, this));
                this.collection.getVersionList(this.queryArgs);
            },

            onClickDiffBtn: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
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

            onGetVersionListSuccess: function() {
                this.initTable();
            },

            initTable: function() {
                var tableHeaderName = [
                    "checkbox",
                    "版本号",
                    "创建时间",
                    "已下发节点数"
                ];

                var rowFeild = [
                    "checkbox",
                    "version",
                    "createTimeStr",
                    "id"
                ];

                var operationList = [{
                    className: "setup-file",
                    callback: $.proxy(this.onClickItemConfig, this),
                    name: "配置文件"
                }, {
                    className: "setup-bill",
                    callback: $.proxy(this.onClickItemBill, this),
                    name: "配置单"
                }, {
                    className: "nodes",
                    callback: $.proxy(this.onClickItemEdit, this),
                    name: "已下发节点"
                }, {
                    className: "edit",
                    callback: $.proxy(this.onClickItemEdit, this),
                    name: "编辑"
                }]

                var ReactTableView = React.createFactory(ReactTableComponent);
                var reactTableView = ReactTableView({
                    collection: this.collection,
                    theadNames: tableHeaderName,
                    rowFeilds: rowFeild,
                    operationList: operationList,
                    onChangeCheckedBox: $.proxy(this.onChangeCheckedBox, this)
                });
                ReactDOM.render(reactTableView, this.$el.find(".table-ctn").get(0));
            },

            onChangeCheckedBox: function(){
                var checkedList = this.collection.filter(function(model){
                    return model.get("isChecked")
                })

                if (checkedList.length === 2) {
                    this.$el.find(".opt-ctn .diff").removeAttr("disabled");
                } else {
                    this.$el.find(".opt-ctn .diff").attr("disabled", "disabled");
                }
            },

            onClickItemConfig: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                var model = this.collection.get(id);
                var myAddEditLayerView = new AddEditLayerView({
                    collection: this.collection,
                    model: model,
                    isEdit: true,
                    onSaveCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.onClickQueryButton();
                    }.bind(this),
                    onCancelCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))
            },

            hide: function() {
                this.$el.hide();
            },

            update: function(target) {
                this.collection.off();
                this.collection.reset();
                this.remove();
                this.initialize(this.options);
                this.delegateEvents(this.events)
                this.render(target);
            },

            render: function(target) {
                this.$el.appendTo(target)
            }

        });

        return IsomorphismManageDetailView;
    });