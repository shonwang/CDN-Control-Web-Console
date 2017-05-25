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

                this.collection.on("get.strategyList.success", $.proxy(this.onGetStrategySuccess, this));
                this.collection.on("get.strategyList.error", $.proxy(this.onGetError, this));

                this.curPage = 1;
                this.queryArgs = {
                    "name": null,
                    "type": null,
                    "page": 1,
                    "size": 10
                }
                this.$el.find(".opt-ctn .diff").attr("disabled", "disabled");
                this.onClickQueryButton();
                this.initDeviceDropMenu();
            },

            onClickDiffBtn: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            onClickBackBtn: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            resetList: function() {
                this.curPage = 1;
                this.onClickQueryButton();
            },

            onKeyupInput: function(e) {
                if (e.keyCode == 13) this.resetList();
            },

            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message);
                else
                    Utility.alerts("网络阻塞，请刷新重试！");
            },

            onGetStrategySuccess: function() {
                this.initTable();
                if (!this.isInitPaginator) this.initPaginator();
            },

            onClickQueryButton: function() {
                this.queryArgs.page = this.curPage;
                this.queryArgs.name = this.$el.find("#input-domain-name").val().trim();
                if (this.queryArgs.name == "") this.queryArgs.name = null;
                ReactDOM.unmountComponentAtNode(this.$el.find(".table-ctn").get(0))
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                if (this.isInitPaginator) this.$el.find(".pagination").jqPaginator('destroy');
                this.isInitPaginator = false;
                this.collection.getStrategyList(this.queryArgs);
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
                    "name",
                    "name",
                    "name"
                ];

                var operationList = [{
                    className: "setup-file",
                    callback: $.proxy(this.onClickItemEdit, this),
                    name: "配置文件"
                }, {
                    className: "setup-bill",
                    callback: $.proxy(this.onClickItemEdit, this),
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

            onClickItemEdit: function(event) {
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

            initPaginator: function() {
                this.$el.find(".total-items span").html(this.collection.total)
                if (this.collection.total <= this.queryArgs.size) return;
                var total = Math.ceil(this.collection.total / this.queryArgs.size);
                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: this.curPage,
                    onPageChange: function(num, type) {
                        if (type !== "init") {
                            ReactDOM.unmountComponentAtNode(this.$el.find(".table-ctn").get(0))
                            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                            var args = _.extend(this.queryArgs);
                            args.page = num;
                            args.count = this.queryArgs.size;
                            this.collection.getStrategyList(args);
                            this.curPage = num
                        }
                    }.bind(this)
                });
                this.isInitPaginator = true;
            },

            initDeviceDropMenu: function(res) {
                this.deviceTypeArray = [];
                var typeArray = [{
                    name: '全部',
                    value: 'all'
                }, {
                    name: '下载',
                    value: 'all'
                }, {
                    name: '直播',
                    value: 'all'
                }];

                var rootNode = this.$el.find(".dropdown-bus-type");
                Utility.initDropMenu(rootNode, typeArray, function(value) {
                    if (value !== "All")
                        this.queryArgs.type = parseInt(value)
                    else
                        this.queryArgs.type = null
                }.bind(this));

                var pageNum = [{
                    name: "10条",
                    value: 10
                }, {
                    name: "20条",
                    value: 20
                }, {
                    name: "50条",
                    value: 50
                }, {
                    name: "100条",
                    value: 100
                }]
                Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value) {
                    this.queryArgs.size = parseInt(value);
                    this.curPage = 1;
                    this.onClickQueryButton();
                }.bind(this));
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