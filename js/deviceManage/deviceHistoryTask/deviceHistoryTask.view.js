define("deviceHistoryTask.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var DeviceHistoryTaskView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/deviceManage/deviceHistoryTask/deviceHistoryTask.html'])());
            
            this.collection.on("get.task.history.success", $.proxy(this.onTaksListSuccess, this));
            this.collection.on("get.task.history.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.enterKeyBindQuery();
            this.initDeviceDropMenu();
            this.queryArgs = {
                  "replayType": 0,
                  "replayStatus": 0,
                  "pageNum": 1,
                  "pageSize": 10
             }
            this.onClickQueryButton();
        },

        enterKeyBindQuery: function() {
            $(document).on('keydown', function(e) {
                if (e.keyCode == 13) {
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        onTaksListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        initPaginator: function() {
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.pageSize) return;
            var total = Math.ceil(this.collection.total / this.queryArgs.pageSize);
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function(num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.pageNum = num;
                        args.pageSize = this.queryArgs.pageSize;
                        this.collection.getTaskHistory(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getTaskHistory(this.queryArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/deviceManage/deviceHistoryTask/deviceHistoryTask.taskItem.html'])({
                data: this.collection.models,
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find(".device-detail").on("click", $.proxy(this.onClickItemOpt, this, 1));
        },

        onClickItemOpt: function(status, event){
            var eventTarget = event.srcElement || event.target, id;
            id = $(eventTarget).attr("id");
            var model = this.collection.get(id);

            if (this.detailDevicePopup) $("#" + this.detailDevicePopup.modalId).remove();

            require(["deviceHistoryTask.detail.view"], function(DeviceHistoryTaskDetailView) {
                var deviceHistoryTaskDetailView = new DeviceHistoryTaskDetailView({
                    collection: this.collection, 
                    model: model
                });
                var options = {
                    title:"设备详情",
                    body: deviceHistoryTaskDetailView,
                    backdrop: 'static',
                    type: 1,
                    onOKCallback:  function(){
                        this.detailDevicePopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){}.bind(this)
                }
                this.detailDevicePopup = new Modal(options);
            }.bind(this));
        },

        initDeviceDropMenu: function() {
            this.deviceTypeArray = [];
            // replayType（回放类型）：0代表全部类型 201代表relay，202代表cache
            // replayStatus（回放状态）：0代表全部任务 4代表回放完成，5代表放弃，6代表回放失败
            var typeArray = [{
                    name: '全部',
                    value: 0
                },{
                    name: 'relay',
                    value: 201
                },{
                    name: 'cache',
                    value: 202
                }],
                rootNode = this.$el.find(".dropdown-type");
            Utility.initDropMenu(rootNode, typeArray, function(value) {
                this.queryArgs.replayType = parseInt(value)
            }.bind(this));

            var statusArray = [{
                    name: '全部',
                    value: 0
                },{
                    name: '已完成',
                    value: 4
                },{
                    name: '已放弃',
                    value: 5
                },{
                    name: '回放失败',
                    value: 6
                }],
                rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value) {
                this.queryArgs.replayStatus = parseInt(value)
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
                this.queryArgs.pageNum = 1;
                this.onClickQueryButton();
            }.bind(this));
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown')
        },

        update: function(target) {
            this.collection.off();
            this.collection.reset();
            this.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DeviceHistoryTaskView;
});