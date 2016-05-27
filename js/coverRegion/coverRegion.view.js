define("coverRegion.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var CoverRegionView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/coverRegion/coverRegion.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.initNodeDropMenu();

            this.collection.on("get.node.success", $.proxy(this.onNodeListSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            this.enterKeyBindQuery();

            this.queryArgs = {
                page : 1,
                count: 10
            }
            this.onClickQueryButton();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onNodeListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getNodeList(this.queryArgs);
        },

        onClickCreate: function(){
            if (this.addNodePopup) $("#" + this.addNodePopup.modalId).remove();

            var addNodeView = new AddOrEditNodeView({collection: this.collection});
            var options = {
                title:"添加节点",
                body : addNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = addNodeView.getArgs();
                    if (!options) return;
                    this.collection.addNode(options)
                    this.addNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.addNodePopup = new Modal(options);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/coverRegion/coverRegion.table.html'])({data: this.collection.models}));
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
                        this.collection.getNodeList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name: "电信", value: "电信"},
                {name: "移动", value: "移动"},
                {name: "联通", value: "联通"}
            ],
            rootNode = this.$el.find(".dropdown-region");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                this.queryArgs.region_name = value;
                if (value == "All") delete this.queryArgs.region_name
            }.bind(this));

            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.count = value;
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return CoverRegionView;
});