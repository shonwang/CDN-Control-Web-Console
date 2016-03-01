define("liveCurentSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveCurentSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/liveCurentSetup/liveCurentSetup.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.on("get.fileGroup.success", $.proxy(this.onGetFileGroupSuccess, this));
            this.collection.on("get.fileGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("get.confList.success", $.proxy(this.onSetupFileListSuccess, this));
            this.collection.on("get.confList.error", $.proxy(this.onGetError, this));

            this.collection.on("get.effectSingleConf.success", function(){
                alert("操作成功！");
                var args = {
                    groupId: this.groupTypeId,
                    page   : 1,
                    count  : 9999
                }
                this.collection.getConfList(args)
            }.bind(this));
            this.collection.on("get.effectSingleConf.error", $.proxy(this.onGetError, this));

            this.collection.getFileGroupList();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onGetFileGroupSuccess: function(res){
            this.fileGroupList = res
            var groupList = [];
            _.each(this.fileGroupList, function(el, index, list){
                groupList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-filegroup"), groupList, function(value){
                this.groupTypeId = parseInt(value)
                var args = {
                    groupId: this.groupTypeId,
                    page   : 1,
                    count  : 9999
                }
                this.collection.getConfList(args)
            }.bind(this));

            this.$el.find(".dropdown-filegroup .cur-value").html(groupList[0].name)
            this.groupTypeId = groupList[0].value;
            var args = {
                groupId: this.groupTypeId,
                page   : 1,
                count  : 9999
            }
            this.collection.getConfList(args)
        },

        onSetupFileListSuccess: function(){
            this.initTable();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/liveCurentSetup/liveCurentSetup.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);
                this.table.find("tbody .shell").on("click", $.proxy(this.onClickItemShell, this));
                this.table.find("tbody .use").on("click", $.proxy(this.onClickItemUse, this));
                this.table.find("tbody .file-name").on("click", $.proxy(this.onClickItemFile, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickItemUse: function(event){
            var result = confirm("你确定要生效吗？")
            if (!result) return;
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            this.collection.effectSingleConf({currConfId: id})
        },

        onClickItemFile: function(event){
            var eventTarget = event.srcElement || event.target,
                filesid = $(eventTarget).attr("files-id"),
                id = $(eventTarget).attr("id");
            var model = this.collection.get(filesid);

            var defaultValue = _.find(model.attributes.files, function(object){
                return object.id === parseInt(id)
            }.bind(this));

            var temp = new this.collection.model(defaultValue)

            if (this.viewShellPopup1) $("#" + this.viewShellPopup1.modalId).remove();

            var options = {
                title:"查看",
                body : _.template(template['tpl/liveAllSetup/liveAllSetup.viewShell.html'])({data: temp, dataType: 1}),
                backdrop : 'static',
                type     : 1,
                width: 800
            }
            this.viewShellPopup1 = new Modal(options);
        },

        onClickItemShell: function(event){
            var eventTarget = event.srcElement || event.target, id;
                id = $(eventTarget).attr("id");
            var model = this.collection.get(id);

            if (this.viewShellPopup) $("#" + this.viewShellPopup.modalId).remove();

            var options = {
                title:"查看",
                body : _.template(template['tpl/liveAllSetup/liveAllSetup.viewShell.html'])({data: model, dataType: 2}),
                backdrop : 'static',
                type     : 1,
                width: 800
            }
            this.viewShellPopup = new Modal(options);
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
                {name: "运行中", value: 1},
                {name: "挂起", value: 2},
                {name: "已关闭", value: 3}
            ],
            rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                if (value !== "All")
                    this.queryArgs.status = parseInt(value);
                else
                    this.queryArgs.status = null;
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

            this.collection.getOperatorList();
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

    return LiveCurentSetupView;
});