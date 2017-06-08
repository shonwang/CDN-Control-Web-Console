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
                    "domain": this.model.get("domain"),
                    "subType": this.model.get("subType")
                }
                this.$el.find(".opt-ctn .diff").attr("disabled", "disabled");

                this.collection.on("get.domain.version.success", $.proxy(this.onGetVersionListSuccess, this));
                this.collection.on("get.domain.version.error", $.proxy(this.onGetError, this));
                this.collection.on("get.nodelist.success", $.proxy(this.onGetNodeListSuccess, this));
                this.collection.on("get.nodelist.error", $.proxy(this.onGetError, this));
                this.collection.getVersionList(this.queryArgs);
            },

            onClickDiffBtn: function() {
                var checkedList = this.collection.filter(function(obj){
                    return obj.get("isChecked");
                }.bind(this))

                this.$el.find(".list-panel").hide();
                require(["react.config.panel"], function(ReactConfigPanelComponent){
                    var ReactTableView = React.createFactory(ReactConfigPanelComponent);
                    var reactTableView = ReactTableView({
                        collection: this.collection,
                        version: checkedList[0].get("version") + "," + checkedList[1].get("version"),
                        domain: this.model.get("domain"),
                        type: 3,
                        isCustom: this.model.get("isCustom"),
                        isShowOpt: true,
                        headerStr: "DIFF配置文件",
                        onClickBackCallback: $.proxy(this.onClickBackCallback, this)
                    });
                    ReactDOM.render(reactTableView, this.$el.find(".edit-panel").get(0));
                }.bind(this))
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
                    "domainVersion",
                    "createTimeStr",
                    "deliveryNodeTotal"
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
                    callback: $.proxy(this.onClickItemNodes, this),
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

            onClickItemNodes: function(event){
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                var model = this.collection.get(id);

                if (this.nodesPopup) $("#" + this.nodesPopup.modalId).remove();

                var options = {
                    title: "已下发节点",
                    body: _.template(template['tpl/loading.html'])({}),
                    backdrop: 'static',
                    type: 1,
                    onOKCallback: function() {
                        this.nodesPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.nodesPopup = new Modal(options);

                this.collection.nodelist({
                    domain: this.model.get("domain"),
                    domainversion: model.get("domainVersion")
                })
            },

            onGetNodeListSuccess: function(data){
                var nodes = "";
                _.each(data, function(el){
                    nodes = nodes + '<li class="list-group-item">' + el.nodeName + ' </li>'
                }.bind(this))

                var tplUl = '<ul class="list-group">' + nodes + '</ul>';

                this.nodesPopup.$el.find(".modal-body").html(tplUl)
            },

            onClickItemEdit: function(event){
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                var model = this.collection.get(id);
                this.$el.find(".list-panel").hide();
                require(["react.config.panel"], function(ReactConfigPanelComponent){
                    var ReactTableView = React.createFactory(ReactConfigPanelComponent);
                    var reactTableView = ReactTableView({
                        collection: this.collection,
                        version: model.get("domainVersion"),
                        domain: this.model.get("domain"),
                        type: 2, //1：配置文件只读；2，配置文件编辑；3：配置文件只读diff模式
                        isCustom: this.model.get("isCustom"),
                        isShowOpt: true,
                        headerStr: "编辑配置文件",
                        onClickBackCallback: $.proxy(this.onClickBackCallback, this)
                    });
                    ReactDOM.render(reactTableView, this.$el.find(".edit-panel").get(0));
                }.bind(this)) 
            },

            onClickItemConfig: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                var model = this.collection.get(id);
                this.$el.find(".list-panel").hide();
                require(["react.config.panel"], function(ReactConfigPanelComponent){
                    var ReactTableView = React.createFactory(ReactConfigPanelComponent);
                    var reactTableView = ReactTableView({
                        collection: this.collection,
                        version: model.get("domainVersion"),
                        domain: this.model.get("domain"),
                        type: 1,
                        isCustom: this.model.get("isCustom"),
                        isShowOpt: true,
                        headerStr: "配置文件",
                        onClickBackCallback: $.proxy(this.onClickBackCallback, this)
                    });
                    ReactDOM.render(reactTableView, this.$el.find(".edit-panel").get(0));
                }.bind(this))
            },

            onClickItemBill: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                var model = this.collection.get(id);

                require(['setupBillLive.view', 'setupBill.model'], function(SetupBillView, SetupBillModel) {
                    var mySetupBillModel = new SetupBillModel();
                    var mySetupBillView = new SetupBillView({
                        collection: mySetupBillModel,
                        originId: model.get("originId"),
                        version: model.get("domainVersion"),
                        onSaveCallback: function() {}.bind(this),
                        onCancelCallback: function() {
                            mySetupBillView.remove();
                            this.$el.find(".list-panel").show();
                        }.bind(this)
                    })

                    this.$el.find(".list-panel").hide();
                    mySetupBillView.render(this.$el.find(".edit-panel"));
                }.bind(this))
            },

            onClickBackCallback: function(){
                ReactDOM.unmountComponentAtNode(this.$el.find(".edit-panel").get(0));
                this.$el.find(".list-panel").show();
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