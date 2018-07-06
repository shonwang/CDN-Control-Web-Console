define("setupTopoManageSendStrategy.view", ['require', 'exports', 'template', 'modal.view', 'utility'], 
    function (require, exports, template, Modal, Utility) {

    var SendView = Backbone.View.extend({
        event: {},

        initialize: function (options) {
            this.options = options;
            this.modelTopo = options.model;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.send.html'])({data: {}}));

            this.curPage = 1;
            this.initNumberDrop();

            this.queryArgs = {
                "topologyId": this.modelTopo.get('id'),
                "name": null,
                "page": 1,
                "count": 10
            }

            this.$el.find("#input-name").val(this.modelTopo.get('name'));
            this.collection.on("get.sendInfo.success", $.proxy(this.getSendInfoSuccess, this));
            this.collection.on("get.sendInfo.error", $.proxy(this.onGetError, this));
            //删除下发策略
            this.collection.on("delete.SendStrategy.success", $.proxy(this.deleteSendStrategySuccess, this));
            this.collection.on("delete.SendStrategy.error", $.proxy(this.onGetError, this));
            //设为默认
            this.collection.on("set.DefaultStrategy.success", $.proxy(this.setDefaultStrategySuccess, this));
            this.collection.on("set.DefaultStrategy.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            //Enter键查询
            this.$el.find('#input-topo-name').on('keydown', $.proxy(this.onEnter, this));
            this.$el.find('.opt-ctn .query').on('click', $.proxy(this.onClickQueryButton, this));
            this.$el.find('.opt-ctn .new').on('click', $.proxy(this.onClickAddSend, this));

            this.refreshList();
        },

        onEnter: function(e){
            if (e.keyCode == 13) this.onClickQueryButton();
        },

        onClickQueryButton: function(){
            this.curPage = 1;
            this.refreshList();
        },

        refreshList: function () {
            this.isInitPaginator = false;
            this.queryArgs.page = this.curPage;
            this.queryArgs.name = this.$el.find("#input-topo-name").val();
            if (this.queryArgs.name == "") this.queryArgs.name = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");

            this.collection.getSendinfo(this.queryArgs);
        },

        onClickCancelButton: function () {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        getSendInfoSuccess: function (res) {
            this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.send.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({data: {message: "暂无数据"}}));

            this.table.find('.edit').on('click', $.proxy(this.onClickEditSend, this));
            this.table.find('.delete').on('click', $.proxy(this.onClickDeleteSend, this));
            this.table.find('.setDefault').on('click', $.proxy(this.onClickDefault, this));

            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickAddSend: function () {
            require(['setupTopoManageSendStrategy.edit.view'], function(EditOrAddSendView) {
                var myEditOrAddSendView = new EditOrAddSendView({
                    collection: this.collection,
                    modelTopo: this.modelTopo,
                    onSaveCallback: function () {
                        this.refreshList();
                        myEditOrAddSendView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this),
                    onCancelCallback: function () {
                        myEditOrAddSendView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                });
                this.$el.find('.list-panel').hide();
                myEditOrAddSendView.render(this.$el.find('.SendTable'));
            }.bind(this));
        },

        onClickEditSend: function (event) {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            require(['setupTopoManageSendStrategy.edit.view'], function(EditOrAddSendView) {
                var myEditOrAddSendView = new EditOrAddSendView({
                    collection: this.collection,
                    modelTopo: this.modelTopo,
                    isEdit: true,
                    model: model,
                    onSaveCallback: function () {
                        this.refreshList();
                        myEditOrAddSendView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this),
                    onCancelCallback: function () {
                        myEditOrAddSendView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                });
                this.$el.find('.list-panel').hide();
                myEditOrAddSendView.render(this.$el.find('.SendTable'));
            }.bind(this));
        },

        onClickDeleteSend: function () {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var result = confirm("确定删除" + model.get('name') + '?');
            if (!result) return;
            this.collection.deleteSendStrategy(id);
        },

        onClickDefault: function () {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var result = confirm("确定将" + model.get('name') + "设为默认?");
            if (!result) return;
            this.collection.setDefaultStrategy(id);
        },

        deleteSendStrategySuccess: function () {
            Utility.alerts("删除成功！", "success", 5000)
            this.refreshList();
        },

        setDefaultStrategySuccess: function () {
            Utility.alerts("设置成功！", "success", 5000);
            this.refreshList();
        },

        initPaginator: function () {
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total / this.queryArgs.count);
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: this.curPage,
                onPageChange: function (num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        this.curPage = num;
                        args.count = this.queryArgs.count;
                        this.collection.getSendinfo(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNumberDrop: function () {
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function (value) {
                this.queryArgs.count = parseInt(value);
                this.onClickQueryButton();
            }.bind(this));
        },

        onGetError: function (error) {
            if (error && error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        render: function (target) {
            this.$el.appendTo(target);
        }
    });

    return SendView;
});