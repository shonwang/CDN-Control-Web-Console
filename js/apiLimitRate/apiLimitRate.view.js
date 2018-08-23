define("apiLimitRate.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var ApiLimitRateView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            
            this.$el = $(_.template(template['tpl/apiLimitRate/apiLimitRate.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.off("get.apiLimitRate.success");
            this.collection.off("get.apiLimitRate.error");
            this.collection.on("get.apiLimitRate.success",$.proxy(this.getApiLimitRateSuccess,this));
            this.collection.on("get.apiLimitRate.error",$.proxy(this.onGetError,this));
            
            // this.collection.off("del.userTopo.success");
            // this.collection.off("del.userTopo.error");
            // this.collection.on("del.userTopo.success",$.proxy(this.delUserTopoSuccess,this));
            // this.collection.on("del.userTopo.error",$.proxy(this.onGetError,this));

            this.collection.off("add.apiLimitRate.success");
            this.collection.off("add.apiLimitRate.error");
            this.collection.on("add.apiLimitRate.success",$.proxy(this.addApiLimitRateSuccess,this));
            this.collection.on("add.apiLimitRate.error",$.proxy(this.onGetError,this));

            this.collection.off("update.apiLimitRate.success");
            this.collection.off("update.apiLimitRate.error");
            this.collection.on("update.apiLimitRate.success",$.proxy(this.updateApiLimitRateSuccess,this));
            this.collection.on("update.apiLimitRate.error",$.proxy(this.onGetError,this));

            this.$el.find(".query").on('click', $.proxy(this.onClickQueryButton, this));
            this.$el.find(".create").on('click', $.proxy(this.onClickCreateButton, this));
            this.queryArgs = {
                "uri": null,
                "start": 1,
                "total": 10,
            }
            var queryString = "?start="+this.queryArgs.start+"&total="+this.queryArgs.total
            this.collection.getApiLimitRateInfo(queryString)
        },

        addApiLimitRateSuccess: function(){
            Utility.alerts("添加成功！", "success", 5000);
            this.onClickQueryButton();
        },

        updateApiLimitRateSuccess: function(){
            Utility.alerts("修改成功！", "success", 5000);
            this.onClickQueryButton();
        },

        // delUserTopoSuccess: function(){
        //     Utility.alerts("删除成功！", "success", 5000)
        //     this.onClickQueryButton();
        // },

        timestampToTime: function(timestamp){
            var date = new Date(timestamp);
            Y = date.getFullYear() + '-';
            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            D = date.getDate() + ' ';
            h = date.getHours() + ':';
            m = date.getMinutes() + ':';
            s = date.getSeconds();
            return Y+M+D+h+m+s;
        },

        getApiLimitRateSuccess: function(data){
            console.log(data)
            var _data = data.data;
            this.apiInfoList = _data;
            _.each(this.apiInfoList, function(el){
                el.createTime = this.timestampToTime(el.createTime);
                if(el.updateTime == null){
                    el.updateTime = el.createTime
                }else{
                    el.updateTime = this.timestampToTime(el.updateTime)
                }
            }.bind(this))
            this.totalCount = data.count;
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
                this.queryArgs.total = value;
                this.queryArgs.start = 1;
                this.onClickQueryButton();
            }.bind(this));
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.start = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.uri = this.$el.find("#input-uri").val().trim() || '';
            console.log("gggg", this.queryArgs)
            var queryString = "?uri="+this.queryArgs.uri+"&start="+this.queryArgs.start+"&total="+this.queryArgs.total
            this.collection.getApiLimitRateInfo(queryString, true);
        },

        onClickCreateButton: function(){
            if (this.apiAddOrEditPopup) $("#" + this.apiAddOrEditPopup.modalId).remove();

            require(["apiLimitRate.add&edit.view"], function(ApiAddOrEditView) {
                var addApiLimitRateView = new ApiAddOrEditView({
                    collection: this.collection,
                });
                var options = {
                    title:"添加api限速信息",
                    body : addApiLimitRateView,
                    backdrop : 'static',
                    type     : 2,
                    width : 550,
                    onOKCallback:  function(){
                        var options = addApiLimitRateView.getArgs();
                        if (!options) return;
                        this.collection.addApiLimitRateInfo(options)
                        this.apiAddOrEditPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){

                    }.bind(this)
                }
                this.apiAddOrEditPopup = new Modal(options);
                // if (!AUTH_OBJ.ApplyCreateHost)
                //     this.apiAddOrEditPopup.$el.find(".modal-footer .btn-primary").remove();
            }.bind(this))
        },

        initTable: function(){
            this.apiInfoTable = $(_.template(template['tpl/apiLimitRate/apiLimitRate.table.html'])({
                data: this.apiInfoList
            }));
            if (this.apiInfoList.length !== 0) {
                this.$el.find(".table-ctn").html(this.apiInfoTable);
                this.apiInfoTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                // this.listTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                this.apiInfoTable.find("[data-toggle='popover']").popover();

            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        initPaginator: function() {
            this.$el.find(".total-items span").html(this.totalCount)
            if (this.apiInfoList.totalCount <= this.queryArgs.total) return;
            var total = Math.ceil(this.totalCount / this.queryArgs.total);
            console.log("yyyyy", total)
            if(total > 0){
                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: 1,
                    onPageChange: function(num, type) {
                        if (type !== "init") {
                            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                            var args = {};
                            args.uri = this.queryArgs.uri || ''
                            args.start = num;
                            args.total = this.queryArgs.total;
                            var argString = "?uri="+args.uri+"&start="+args.start+"&total="+args.total
                            this.collection.getApiLimitRateInfo(argString);
                        }
                    }.bind(this)
                });
            }
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
            _.each(this.apiInfoList, function(el){
                if(el.id == id){model = el}    
            }.bind(this))

            if (this.apiAddOrEditPopup) $("#" + this.apiAddOrEditPopup.modalId).remove();
            require(["apiLimitRate.add&edit.view"], function(AddOrEditApiView) {
                var editApiLimitRateView = new AddOrEditApiView({
                    collection: this.collection, 
                    model     : model,
                    isEdit    : true,
                });
                var options = {
                    title:"编辑api限速信息",
                    body : editApiLimitRateView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback:  function(){
                        var options = editApiLimitRateView.getArgs();
                        if (!options) return;
                        options.id = parseInt(model.id);
                        console.log("bbbbb", options)
                        this.collection.updateApiLimitRateInfo(options)
                        this.apiAddOrEditPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){
        
                    }.bind(this)
                }
                this.apiAddOrEditPopup = new Modal(options);
                // if (!AUTH_OBJ.ApplyEditHost)
                //     this.listAddOrEditPopup.$el.find(".modal-footer .btn-primary").remove();
            }.bind(this));
        },

        // onClickItemDelete: function(){
        //     var eventTarget = event.srcElement || event.target, id, model;
        //     if (eventTarget.tagName == "SPAN"){
        //         eventTarget = $(eventTarget).parent();
        //         id = eventTarget.attr("data-id");
        //     } else {
        //         id = $(eventTarget).attr("data-id");
        //     }
        //     _.each(this.listInfoList, function(el){
        //         if(el.id = id){model = el}    
        //     }.bind(this))
        //     var result = confirm("你确定要删除客户信息" + model.companyName + "吗");
        //     if (!result) return;
        //     this.collection.delUserTopoInfo({id:parseInt(id)})
        // },



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

    
    return ApiLimitRateView;
});