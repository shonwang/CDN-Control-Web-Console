define("adminManage.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var AdminManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            
            this.$el = $(_.template(template['tpl/adminManage/adminManage.html'])());
            this.collection.off("get.userTopo.success");
            this.collection.off("get.userTopo.error");
            this.collection.on("get.userTopo.success",$.proxy(this.getUserTopoSuccess,this));
            this.collection.on("get.userTopo.error",$.proxy(this.onGetError,this));
            
            this.collection.off("del.userTopo.success");
            this.collection.off("del.userTopo.error");
            this.collection.on("del.userTopo.success",$.proxy(this.delUserTopoSuccess,this));
            this.collection.on("del.userTopo.error",$.proxy(this.onGetError,this));

            this.collection.off("add.topoInfo.success");
            this.collection.off("add.topoInfo.error");
            this.collection.on("add.topoInfo.success",$.proxy(this.addUserTopoInfoSuccess,this));
            this.collection.on("add.topoInfo.error",$.proxy(this.onGetError,this));

            this.$el.find(".query").on('click', $.proxy(this.onClickQueryButton, this));
            this.$el.find(".create").on('click', $.proxy(this.onClickCreateButton, this));
            this.queryArgs = {
                "userId": null,
                "companyName": null,
                "currentPage": 1,
                "pageSize": 10,
            }
            this.collection.getUserTopoInfo(this.queryArgs)
        },

        addUserTopoInfoSuccess: function(res, isEdit){
            if(isEdit){
                Utility.alerts("更改成功！", "success", 5000)
            }else{
                Utility.alerts("添加成功！", "success", 5000)
            }
            this.onClickQueryButton();
        },

        delUserTopoSuccess: function(){
            Utility.alerts("删除成功！", "success", 5000)
            this.onClickQueryButton();
        },

        getUserTopoSuccess: function(data){
            var _data = data.data;
            this.adminInfoList = _data;
            this.totalCount = data.totalCount;
            this.initTable();
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
                this.queryArgs.pageSize = value;
                this.queryArgs.currentPage = 1;
                this.onClickQueryButton();
            }.bind(this));
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.currentPage = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.companyName = this.$el.find("#input-name").val().trim() || null;
            this.queryArgs.userId = parseInt(this.$el.find("#input-id").val().trim()) || null;
            this.collection.getUserTopoInfo(this.queryArgs);
        },

        onClickCreateButton: function(){
            if (this.adminAddOrEditPopup) $("#" + this.adminAddOrEditPopup.modalId).remove();

            require(["adminManage.add&edit.view"], function(AdminAddOrEditView) {
                var addAdminView = new AdminAddOrEditView({
                    collection: this.collection,
        
                });
                var options = {
                    title:"添加客户信息",
                    body : addAdminView,
                    backdrop : 'static',
                    type     : 2,
                    width : 550,
                    onOKCallback:  function(){
                        var options = addAdminView.getArgs();
                        console.log(options)
                        if (!options) return;
                        this.collection.addUserTopoInfo(options)
                        this.adminAddOrEditPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){

                    }.bind(this)
                }
                this.adminAddOrEditPopup = new Modal(options);
                if (!AUTH_OBJ.ApplyCreateHost)
                    this.adminAddOrEditPopup.$el.find(".modal-footer .btn-primary").remove();
            }.bind(this))
        },

        initTable: function(){
            this.adminTable = $(_.template(template['tpl/adminManage/adminManage.table.html'])({
                data: this.adminInfoList
            }));
            if (this.adminInfoList.length !== 0) {
                this.$el.find(".table-ctn").html(this.adminTable);
                this.adminTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.adminTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));

                this.adminTable.find("[data-toggle='popover']").popover();

            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        initPaginator: function() {
            this.$el.find(".total-items span").html(this.totalCount)
            if (this.adminInfoList.totalCount <= this.queryArgs.pageSize) return;
            var total = Math.ceil(this.totalCount / this.queryArgs.pageSize);

            console.log("yyyy", total, this.totalCount, this.queryArgs.pageSize)
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function(num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.currentPage = num;
                        args.pageSize = this.queryArgs.pageSize;
                        this.collection.getUserTopoInfo(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        onClickItemEdit: function(){
            var eventTarget = event.srcElement || event.target, id, model;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("data-id");
            } else {
                id = $(eventTarget).attr("data-id");
            }
            _.each(this.adminInfoList, function(el){
                if(el.id == id){model = el}    
            }.bind(this))

            if (this.adminAddOrEditPopup) $("#" + this.adminAddOrEditPopup.modalId).remove();
            require(["adminManage.add&edit.view"], function(AddOrEditDeviceView) {
                var editAdminView = new AddOrEditDeviceView({
                    collection: this.collection, 
                    model     : model,
                    isEdit    : true,
                });
                var options = {
                    title:"编辑客户信息",
                    body : editAdminView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback:  function(){
                        var options = editAdminView.getArgs();
                        if (!options) return;
                        options.id = parseInt(model.id);
                        this.collection.addUserTopoInfo(options, true)
                        this.adminAddOrEditPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){
        
                    }.bind(this)
                }
                this.adminAddOrEditPopup = new Modal(options);
                if (!AUTH_OBJ.ApplyEditHost)
                    this.adminAddOrEditPopup.$el.find(".modal-footer .btn-primary").remove();
            }.bind(this));
        },

        onClickItemDelete: function(){
            var eventTarget = event.srcElement || event.target, id, model;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("data-id");
            } else {
                id = $(eventTarget).attr("data-id");
            }
            _.each(this.adminInfoList, function(el){
                if(el.id = id){model = el}    
            }.bind(this))
            var result = confirm("你确定要删除客户信息" + model.companyName + "吗");
            if (!result) return;
            this.collection.delUserTopoInfo({id:parseInt(id)})
        },



        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            // this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    
    return AdminManageView;
});