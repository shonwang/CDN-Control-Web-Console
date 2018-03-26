define("domainListHistory.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DomainListHistoryView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/domainListHistory/domainListHistory.html'])());
            this.$el.find(".bill-ctn").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
            this.$el.find(".cancel").on("click", $.proxy(this.onClickBackButton, this))
            this.initPageDropMenu();
        },

        onClickBackButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        initPaginator: function() {
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total / this.queryArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function(num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.count;
                        //this.collection.getNodeList(args);
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