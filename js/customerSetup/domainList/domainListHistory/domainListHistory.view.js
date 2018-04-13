define("domainListHistory.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DomainListHistoryView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.originId = options.originId;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/domainListHistory/domainListHistory.html'])());
            this.$el.find(".bill-ctn").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
            this.$el.find(".cancel").on("click", $.proxy(this.onClickBackButton, this))

            this.defaultParam = {
                originId: this.originId,
                currentPage: 1,
                pageSize: 10 
            }
            this.collection.on("get.log.success", $.proxy(this.onGetLogSuccess, this));
            this.collection.on("get.log.error", $.proxy(this.onGetError, this));
            this.collection.getOperateLog(this.defaultParam)
            this.initPageDropMenu();
            this.isInitPaginator = false;
        },

        onClickBackButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetLogSuccess: function(res){
            //返回数据示例
            // res = {
            //     "totalCount": 2,
            //     "data": [{
            //         "operator":"1", //操作人
            //         "operateTime": new Date().valueOf(),//操作时间
            //         "operateContent":"操作内容"//操作内容
            //     },{
            //         "operator":"2",
            //         "operateTime": new Date().valueOf(),
            //         "operateContent": "操作内容"
            //     }]
            // };

            _.each(res.data, function(el){
                el.id = Utility.randomStr(8);
                if (el.operateTime)
                    el.operateTimeFormated = new Date(el.operateTime).format("yyyy/MM/dd hh:mm");
            }.bind(this))
            this.total = res.totalCount;
            this.initTable(res.data);
        },

        initTable: function(data){
            if (data.length == 0) {
                this.$el.find(".history-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "暂无数据"
                    }
                }));
            } else {
                this.table = $(_.template(template['tpl/customerSetup/domainList/domainListHistory/domainListHistory.table.html'])({
                    data: data
                }));
                this.$el.find(".history-ctn").html(this.table[0]);
            }

            if (!this.isInitPaginator) {
                this.$el.find(".pagination").html('');
                this.initPaginator();
            }
        },

        initPaginator: function() {
            this.$el.find(".total-items span").html(this.total)
            if (this.total <= this.defaultParam.pageSize) return;
            var total = Math.ceil(this.total / this.defaultParam.pageSize);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: this.defaultParam.currentPage,
                onPageChange: function(num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        this.defaultParam.currentPage = num;
                        this.collection.getOperateLog(this.defaultParam);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initPageDropMenu: function() {
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
                this.defaultParam.pageSize = parseInt(value);
                this.defaultParam.currentPage = 1;
                this.collection.getOperateLog(this.defaultParam);
                this.isInitPaginator = false;
            }.bind(this));         
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query){
            this.options.query = query;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(this.target);
        },

        render: function(target){
            this.$el.appendTo(target);
            this.target = target;
        }
    });

    return DomainListHistoryView;
});