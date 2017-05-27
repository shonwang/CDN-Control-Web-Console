define("isomorphismManage.view", ['require', 'exports', 'template', 'modal.view', 'utility', 'react.table'],
    function(require, exports, template, Modal, Utility, ReactTableComponent) {

        var IsomorphismManageView = Backbone.View.extend({
            events: {
                "click .opt-ctn .query": "resetList",
                "keyup #input-domain-name": "onKeyupInput"
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/isomorphismManage/isomorphismManage.html'])());

                this.collection.on("get.channel.success", $.proxy(this.onGetChannelSuccess, this));
                this.collection.on("get.channel.error", $.proxy(this.onGetError, this));

                this.curPage = 1;
                this.isInitPaginator = false;
                this.queryArgs = {
                    "currentPage": 1,
                    "pageSize": 10
                }
                this.onClickQueryButton();
                this.initDeviceDropMenu();
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

            onGetChannelSuccess: function() {
                this.initTable();
                if (!this.isInitPaginator) this.initPaginator();
            },

            onClickQueryButton: function() {
                this.queryArgs.currentPage = this.curPage;
                this.queryArgs.name = this.$el.find("#input-domain-name").val().trim();
                if (this.queryArgs.name == "") this.queryArgs.name = null;
                ReactDOM.unmountComponentAtNode(this.$el.find(".table-ctn").get(0))
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                if (this.isInitPaginator) this.$el.find(".pagination").jqPaginator('destroy');
                this.isInitPaginator = false;
                this.collection.queryChannel(this.queryArgs);
            },

            initTable: function() {
                var tableHeaderName = [
                    "加速域名",
                    "业务类型",
                    "使用协议",
                    "状态",
                    "异构版本数",
                ];

                var rowFeild = [
                    "domain",
                    "businessTypeName",
                    "protocolName",
                    "statusName",
                    "id"
                ];

                var operationList = [{
                    className: "detail",
                    callback: $.proxy(this.onClickItemDetail, this),
                    name: "异构详情"
                }]

                var ReactTableView = React.createFactory(ReactTableComponent);
                var reactTableView = ReactTableView({
                    collection: this.collection,
                    theadNames: tableHeaderName,
                    rowFeilds: rowFeild,
                    operationList: operationList
                });
                ReactDOM.render(reactTableView, this.$el.find(".table-ctn").get(0));
            },

            onClickItemDetail: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                var model = this.collection.get(id);

                require(['isomorphismManage.detail.view', 'isomorphismManage.detail.model'],
                    function(IsomorphismManageDetailView, IsomorphismManageDetailModel) {
                        var myIsomorphismManageDetailView = new IsomorphismManageDetailView({
                            collection: new IsomorphismManageDetailModel(),
                            model: model,
                            onCancelCallback: function() {
                                myIsomorphismManageDetailView.remove();
                                this.$el.find(".list-panel").show();
                            }.bind(this)
                        })

                        this.$el.find(".list-panel").hide();
                        myIsomorphismManageDetailView.render(this.$el.find(".edit-panel"))
                    }.bind(this))
            },

            initPaginator: function() {
                this.$el.find(".total-items span").html(this.collection.total)
                if (this.collection.total <= this.queryArgs.pageSize) return;
                var total = Math.ceil(this.collection.total / this.queryArgs.pageSize);
                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: this.curPage,
                    onPageChange: function(num, type) {
                        if (type !== "init") {
                            ReactDOM.unmountComponentAtNode(this.$el.find(".table-ctn").get(0))
                            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                            var args = _.extend(this.queryArgs);
                            args.currentPage = num;
                            args.pageSize = this.queryArgs.pageSize;
                            this.collection.queryChannel(args);
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
                }, {
                    name: '直播推流',
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
                    this.queryArgs.pageSize = parseInt(value);
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

        return IsomorphismManageView;
    });