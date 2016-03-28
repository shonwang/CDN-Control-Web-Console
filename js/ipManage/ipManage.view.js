define("ipManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var IPQueryDetailView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/ipManage/ipManage.queryDetail.html'])());
        },

        getArgs: function(){
            var queryKey = this.$el.find("#textarea-content").val();
            return queryKey;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });


    var IPManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/ipManage/ipManage.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.initNodeDropMenu();

            this.collection.on("get.ipInfo.success", $.proxy(this.onIpInfoListSuccess, this));
            this.collection.on("get.ipInfo.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            this.queryArgs = {
                page : 1,
                count: 10,
                ips  : ""
            }
            this.onStartQueryButton();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onIpInfoListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(event){
            if (this.queryDetailPopup) $("#" + this.queryDetailPopup.modalId).remove();

            var detailView = new IPQueryDetailView({
                collection: this.collection
            });
            var options = {
                title: "查询IP",
                body : detailView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = detailView.getArgs();
                    this.queryArgs.ips = options;
                    this.onStartQueryButton();
                    this.queryDetailPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.queryDetailPopup = new Modal(options);
        },

        onStartQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getIpInfoList(this.queryArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/ipManage/ipManage.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.count;
                        this.collection.getIpInfoList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.count = value;
                this.queryArgs.page = 1;
                this.onStartQueryButton();
            }.bind(this));
        },

        remove: function(){
            if (this.queryDetailPopup) $("#" + this.queryDetailPopup.modalId).remove();
            this.queryDetailPopup = null;
            this.$el.remove();
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return IPManageView;
});