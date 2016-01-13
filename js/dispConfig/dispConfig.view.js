define("dispConfig.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var DispConfigView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.html'])());

            this.collection.on("get.dispGroup.success", $.proxy(this.onDispGroupListSuccess, this));
            this.collection.on("get.dispGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("get.dispConfig.success", $.proxy(this.onDispConfigListSuccess, this));
            this.collection.on("get.dispConfig.error", $.proxy(this.onGetError, this));

            this.initDispConfigDropMenu();

            this.$el.find(".opt-ctn .sending").on("click", $.proxy(this.onClickSending, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onDispConfigListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getDispConfigList(this.queryArgs);
        },

        onClickSending: function(){
            // if (this.addNodePopup) $("#" + this.addNodePopup.modalId).remove();

            // var addNodeView = new AddOrEditNodeView({collection: this.collection});
            // var options = {
            //     title:"添加节点",
            //     body : addNodeView,
            //     backdrop : 'static',
            //     type     : 2,
            //     onOKCallback:  function(){
            //         var options = addNodeView.getArgs();
            //         if (!options) return;
            //         this.collection.addNode(options)
            //         this.addNodePopup.$el.modal("hide");
            //     }.bind(this),
            //     onHiddenCallback: function(){}
            // }
            // this.addNodePopup = new Modal(options);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/dispConfig/dispConfig.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            // this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            // this.table.find("tbody .node-name").on("click", $.proxy(this.onClickItemNodeName, this));
            // this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            // this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var model = this.collection.get(id);
            model.set("isChecked", eventTarget.checked)

            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            if (checkedList.length === this.collection.models.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.collection.models.length)
                this.table.find("thead input").get(0).checked = false;
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.editNodePopup) $("#" + this.editNodePopup.modalId).remove();

            var editNodeView = new AddOrEditNodeView({
                collection: this.collection, 
                model     : model,
                isEdit    : true
            });
            var options = {
                title:"编辑设备",
                body : editNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = editNodeView.getArgs();
                    if (!options) return;
                    var args = _.extend(model.attributes, options)
                    this.collection.updateDevice(args)
                    this.editNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.editNodePopup = new Modal(options);
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

        initDispConfigDropMenu: function(){
            var regionArray = [
                {name: "全部", value: "All"},
                {name: "电信", value: "电信"},
                {name: "联通", value: "联通"},
                {name: "移动", value: "移动"}
            ],
            rootNode = this.$el.find(".dropdown-region");
            Utility.initDropMenu(rootNode, regionArray, function(value){
                this.queryArgs.regionName = value;
                if (value == "All")
                    delete this.queryArgs.regionName
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

            this.collection.getDispGroupList();
        },

        onDispGroupListSuccess: function(res){
            var temp = [];
            _.each(res.rows, function(el, index, list){
                temp.push({name: el.dispDomain, value: el.id})
            }.bind(this))
            rootNode = this.$el.find(".dropdown-disp");
            Utility.initDropMenu(rootNode, temp, function(value){
                this.queryArgs.groupId = parseInt(value);
                this.onClickQueryButton();
            }.bind(this));

            this.$el.find(".dropdown-disp .cur-value").html(res.rows[0].dispDomain)

            this.queryArgs = {
                page : 1,
                count: 10,
                groupId: res.rows[0].id
            }
            this.onClickQueryButton();
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

    return DispConfigView;
});