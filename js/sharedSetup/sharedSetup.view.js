define("sharedSetup.view", ['require', 'exports', 'template', 'modal.view', 'utility', 'react.table'],
    function(require, exports, template, Modal, Utility, ReactTableComponent) {

        var SharedSetupView = Backbone.View.extend({
            events: {
                "click .opt-ctn .query": "resetList",
                "keyup #input-domain-name": "onKeyupInput",
                "keyup #input-customer-id": "onKeyupInput",
                "click .add": "onClickAddBtn",
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.query = options.query;
                this.$el = $(_.template(template['tpl/sharedSetup/sharedSetup.html'])());

                this.collection.on("get.configSharedGroup.success", $.proxy(this.onGetChannelSuccess, this));
                this.collection.on("get.configSharedGroup.error", $.proxy(this.onGetError, this));
                this.collection.on("delete.configSharedGroup.success", $.proxy(this.onDeleteSuccess, this));
                this.collection.on("delete.configSharedGroup.error", $.proxy(this.onGetError, this));

                this.curPage = 1;
                this.isInitPaginator = false;
                this.queryArgs = {
                    "domain": null,
                    "userId": null,
                    "page": 1,
                    "size": 1
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
                if (this.query !== "all") {
                    var model = this.collection.find(function(obj){
                        return obj.get("mainDomain") === this.query || obj.get("sharedDomain").indexOf(this.query) > -1;
                    }.bind(this))
                    if (model) {
                        this.onClickItemToView(null, model)
                    } else {
                        Utility.alerts("未找到" + this.query + "的共享域名配置！")
                        window.location.hash = "#/sharedSetup/all"
                    }
                } else {
                    this.initTable();
                    if (!this.isInitPaginator) this.initPaginator();
                }
            },

            onClickQueryButton: function() {
                this.queryArgs.page = this.curPage;
                if (this.query !== 'all') {
                    this.$el.find("#input-domain-name").val(this.query)
                }
                this.queryArgs.domain = this.$el.find("#input-domain-name").val().trim();
                if (this.queryArgs.domain == "") delete this.queryArgs.domain;
                this.queryArgs.userId = this.$el.find("#input-customer-id").val().trim();
                if (this.queryArgs.userId == "") delete this.queryArgs.userId;
                ReactDOM.unmountComponentAtNode(this.$el.find(".table-ctn").get(0))
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                if (this.isInitPaginator) this.$el.find(".pagination").jqPaginator('destroy');
                this.isInitPaginator = false;
                this.collection.getConfigSharedGroup(this.queryArgs);
            },

            initTable: function() {
                var tableHeaderName = [
                    "共享配置名称",
                    "主域名",
                    "业务类型",
                    "共享域名数量",
                    "创建时间",
                ];

                var rowFeild = [
                    "name",
                    "mainDomain",
                    "businessTypeName",
                    "sharedDomainNum",
                    "createdTimeFormated",
                ];

                var operationList = [{
                    className: "detail",
                    callback: $.proxy(this.onClickItemToView, this),
                    name: "查看"
                }, {
                    className: "modify",
                    callback: $.proxy(this.onClickItemDetail, this),
                    name: "修改"
                },{
                    className: "delete",
                    callback: $.proxy(this.onClickItemDelete, this),
                    name: "删除"
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

            onClickAddBtn: function(){
                require(['sharedSetup.detail.view'],
                    function(SharedSetupDetailView) {
                        var mySharedSetupDetailView = new SharedSetupDetailView({
                            collection: this.collection,
                            model: null,
                            onCancelCallback: function() {
                                if (this.query === "all") {
                                    mySharedSetupDetailView.remove();
                                    this.$el.find(".list-panel").show();
                                    this.onClickQueryButton();
                                } else {
                                    window.location.hash = "#/sharedSetup/all"
                                }
                            }.bind(this)
                        })

                        this.$el.find(".list-panel").hide();
                        mySharedSetupDetailView.render(this.$el.find(".edit-panel"))
                    }.bind(this))
            },

            onClickItemDetail: function(event, model) {
                var eventTarget, id;
                if (event) {
                    eventTarget = event.srcElement || event.target;
                    id = $(eventTarget).attr("id");
                    model = this.collection.get(id);
                }

                require(['sharedSetup.detail.view'],
                    function(SharedSetupDetailView) {
                        var mySharedSetupDetailView = new SharedSetupDetailView({
                            collection: this.collection,
                            model: model,
                            onCancelCallback: function() {
                                if (this.query === "all") {
                                    mySharedSetupDetailView.remove();
                                    this.$el.find(".list-panel").show();
                                    this.onClickQueryButton();
                                } else {
                                    window.location.hash = "#/sharedSetup/all"
                                }
                            }.bind(this)
                        })

                        this.$el.find(".list-panel").hide();
                        mySharedSetupDetailView.render(this.$el.find(".edit-panel"))
                    }.bind(this))
            },

            onClickItemDelete: function(event){
                var eventTarget, id;
                eventTarget = event.srcElement || event.target;
                id = $(eventTarget).attr("id");
                model = this.collection.get(id);

                Utility.confirm("你确定要删除" + model.get("name") + "吗？" , function(){
                    this.collection.deleteConfigSharedGroup({id:id})
                }.bind(this))
            },

            onDeleteSuccess: function(){
                Utility.alerts("操作成功", "success", 3000);
                this.onClickQueryButton();
            },

            onClickItemToView: function(event, model) {
                var eventTarget, id;
                if (event) {
                    eventTarget = event.srcElement || event.target;
                    id = $(eventTarget).attr("id");
                    model = this.collection.get(id);
                }

                this.toViewEl = $(_.template(template['tpl/sharedSetup/sharedSetup.toView.html'])({
                    data: model
                }));
                this.$el.find(".list-panel").hide();
                this.toViewEl.appendTo(this.$el.find(".edit-panel"))

                this.toViewEl.find(".cancel").on("click", function(){
                    if (this.query === "all") {
                        this.toViewEl.find(".cancel").off();
                        this.toViewEl.remove();
                        this.$el.find(".list-panel").show();
                    } else {
                        window.location.hash = "#/sharedSetup/all"
                    }
                }.bind(this))

                var nodeTpl = '';
                _.each(model.get("sharedDomain")&&model.get("sharedDomain").split(","), function(el) {
                    if (el === model.get("mainDomain")) return;
                    nodeTpl = '<li class="node-item">' +
                        '<span class="label label-info" id="' + Utility.randomStr(8) + '">' + el + '</span>' +
                        '</li>';
                    $(nodeTpl).appendTo(this.$el.find(".sub-domain .node-ctn"))
                }.bind(this))
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
                            args.size = this.queryArgs.size;
                            this.collection.getConfigSharedGroup(args);
                            this.curPage = num
                        }
                    }.bind(this)
                });
                this.isInitPaginator = true;
            },

            initDeviceDropMenu: function(res) {
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

            update: function(target, query) {
                this.options.query = query;
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

        return SharedSetupView;
    });