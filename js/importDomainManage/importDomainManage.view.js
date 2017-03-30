define("importDomainManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var ImportDomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/importDomainManage/importDomainManage.html'])());

            this.curPage = 1;
            this.initNumberDrop();

            this.collection.on("get.list.success", $.proxy(this.onGetDomainList, this));
            this.collection.on("get.list.error", $.proxy(this.onGetError, this));
            this.collection.on("set.stop.success", $.proxy(this.refreshList, this));
            this.collection.on("set.stop.error", $.proxy(this.onGetError, this));
            this.collection.on("set.open.success", $.proxy(this.refreshList, this));
            this.collection.on("set.open.error", $.proxy(this.onGetError, this));
            this.collection.on("set.delete.success", $.proxy(this.refreshList, this));
            this.collection.on("set.delete.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.enterKeyBindQuery();

            this.queryArgs = {
                "cname": null,
                "currentPage": 1,
                "pageSize": 10,
                "open302": null
            };

            this.refreshList();
        },

        onClickQueryButton: function(){
            this.curPage = 1;
            this.refreshList();
        },

        refreshList: function () {
            this.isInitPaginator = false;
            this.queryArgs.currentPage = this.curPage;
            this.queryArgs.cname = this.$el.find("#input-cname").val();
            if (this.queryArgs.cname == "") this.queryArgs.cname = null;
            // this.queryArgs.domain = this.$el.find("#input-domain").val();
            // if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");

            this.collection.queryByPage(this.queryArgs);
        },
        
        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickConfirmButton();
                }
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        initTable: function() {
            this.table = $(_.template(template['tpl/importDomainManage/importDomainManage.table.html'])({
                data: this.collection.models,
                permission: AUTH_OBJ
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .stop").on("click", $.proxy(this.onClickItemStop, this));
            this.table.find("tbody .open").on("click", $.proxy(this.onClickItemOpen, this));
        },

        onGetDomainList: function(res){
            if (!this.isInitPaginator) this.initPaginator();
            this.initTable();
        },

        onClickItemOpen: function(event){
            var eventTarget = event.srcElement || event.target, 
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id),
                cnameId = model.get('cnameId');
            this.collection.activeCname({cnameId: cnameId, t: new Date().valueOf()})
        },

        onClickItemStop: function(event){
            var eventTarget = event.srcElement || event.target, 
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id),
                cnameId = model.get('cnameId');
            this.collection.forbiddenCname({cnameId: cnameId, t: new Date().valueOf()})
        },

        onClickAddDomain: function(){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            });

            var domainArray = [];
            _.each(checkedList, function(el, index, ls){
                domainArray.push({
                    domain: el.get("domain"), 
                    id: el.get("id")
                });
            }.bind(this))

            if (this.selectDomain) $("#" + this.selectDomain.modalId).remove();

            var mySelectDomainView = new SelectDomainView({
                collection: this.collection, 
                domainArray : domainArray
            });
            var options = {
                title: "选择接入域名",
                body : mySelectDomainView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var result  = mySelectDomainView.onSure();
                    if (!result) return;
                    this.$el.find("#input-cname").val(result.name)
                    this.collection.getClientMessage({cnameId: result.id})
                    //this.collection.getClientMessage({cname: "mt.huluxia.com.download.ks-cdn.com"})
                    this.selectDomain.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    this.enterKeyBindQuery();
                }.bind(this)
            }
            this.selectDomain = new Modal(options);
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, 
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id),
                cnameId = model.get('cnameId');
            this.collection.deleteCname({cnameId: cnameId, t: new Date().valueOf()})
        },

        onClickItemEdit: function(event){
            require(['importDomainManage.edit.view'], function(ImportDomainManageEditView){
                var eventTarget = event.srcElement || event.target, 
                    id = $(eventTarget).attr("id");

                var model = this.collection.get(id);
                var myHistoryView = new HistoryView({
                    curModel: model,
                    collection: this.collection,
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){
                        myHistoryView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myHistoryView.render(this.$el.find(".history-panel"))
            }.bind(this))
        },

        initChannelDropMenu: function(){
            require(["dispGroup.model"], function(DispGroupModel){
                this.myDispGroupModel = new DispGroupModel();
                this.myDispGroupModel.on("get.dispGroup.success", $.proxy(this.onGetDispGroupList, this));
                this.myDispGroupModel.on("get.dispGroup.error", $.proxy(this.onGetError, this));
                this.myDispGroupModel.getDispGroupList({
                    "name"  : null,//调度组名称
                    "status": null,//调度组状态
                    "level" : null,//覆盖级别
                    "page"  : 1,
                    "count" : 99999
                });
            }.bind(this))

            this.collection.on("get.region.success", $.proxy(this.onGetRegionList, this));
            this.collection.on("get.region.error", $.proxy(this.onGetError, this));
            this.collection.selectRegionList({
               "page": 1,
               "count": 99999,
               "name": null
            });
        },

        initPaginator: function () {
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.pageSize) return;
            var total = Math.ceil(this.collection.total / this.queryArgs.pageSize);
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: this.curPage,
                onPageChange: function (num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.currentPage = num;
                        this.curPage = num;
                        args.pageSize = this.queryArgs.pageSize;
                        this.collection.queryByPage(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNumberDrop: function () {
            var dispatch302Array = [
                {name: "全部", value: 'all'},
                {name: "关闭", value: 0},
                {name: "开启", value: 1}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-302dispatch"), dispatch302Array, function (value) {
                if (value === "all")
                    this.queryArgs.open302 = null;
                else
                    this.queryArgs.open302 = parseInt(value);
                this.refreshList();
            }.bind(this));

            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function (value) {
                this.queryArgs.pageSize = parseInt(value);
                this.refreshList();
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

    return ImportDomainManageView;
});