define("importDomainManage.edit.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var SelectDispView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;

            this.$el = $(_.template(template['tpl/importDomainManage/importDomainManage.select.disp.html'])());
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickSearchButton, this));
            this.$el.find(".opt-ctn .cancel-select").on("click", $.proxy(this.onClickCancelSelectButton, this));

            this.curPage = 1;
            this.initDispListDropMenu();

            this.queryArgs = {
                    "name"  : null,//调度组名称
                    "status": null,//调度组状态
                    "level" : null,//覆盖级别
                    "remark": null,
                    "page"  : 1,
                    "count" : 10
                }
            this.refreshList();
        },

        getDispGroupList: function(){
            require(["dispGroup.model"], function(DispGroupModel){
                this.myDispGroupModel = new DispGroupModel();
                this.myDispGroupModel.on("get.dispGroup.success", $.proxy(this.onGetDispGroupList, this));
                this.myDispGroupModel.on("get.dispGroup.error", $.proxy(this.onGetError, this));
                this.myDispGroupModel.getDispGroupList(this.queryArgs);
            }.bind(this))
        },

        enterKeyBindQuery: function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickSearchButton();
                }
            }.bind(this));
        },

        onClickSearchButton: function(){
            this.curPage = 1;
            this.refreshList();
        },

        refreshList: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = this.curPage;
            this.queryArgs.name = this.$el.find("#input-name").val().trim();
            if (this.queryArgs.name == "") this.queryArgs.name = null; 
            this.queryArgs.remark = this.$el.find("#input-remark").val().trim();
            if (this.queryArgs.remark == "") this.queryArgs.remark = null; 

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.getDispGroupList();
        },

        onGetDispGroupList: function(){
            this.myDispGroupModel.off("ip.type.success");
            this.myDispGroupModel.off("ip.type.error");
            this.myDispGroupModel.on("ip.type.success", $.proxy(this.onGetIpTypeSuccess, this));
            this.myDispGroupModel.on("ip.type.error", $.proxy(this.onGetError, this));
            this.myDispGroupModel.ipTypeList();
        },

        onGetIpTypeSuccess: function(data){
            _.each(this.myDispGroupModel.models, function(el, inx, list){
                var ipObj = _.find(data, function(obj){
                    return parseInt(obj.id) === parseInt(el.get("resolveIpType"))
                }.bind(this))
                if (ipObj) el.set("resolveIpTypeName", ipObj.name)
            }.bind(this))

            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        initTable: function(data){
            this.table = $(_.template(template['tpl/importDomainManage/importDomainManage.disp.table.html'])({
                data: this.myDispGroupModel.models,
                permission:{}
            }));
            if (this.myDispGroupModel.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find(".remark").popover();
            this.table.find("tbody input").on("click", $.proxy(this.onClickRadioButton, this));
        },

        onClickCancelSelectButton: function(){
            _.each(this.table.find("tbody input"), function(el){
                el.checked = false;
            })
            this.options.onCancelSelectCallback && this.options.onCancelSelectCallback()
        },

        onClickRadioButton: function(event){
            var eventTarget = event.srcElement || event.target, 
                id = $(eventTarget).attr("id");

            var dispName = $(eventTarget).siblings('span').html();

            var data = {
                dispId: id,
                dispName: dispName
            }

            this.options.onOKCallback && this.options.onOKCallback(data)
        },

        initPaginator: function () {
            this.$el.find(".total-items span").html(this.myDispGroupModel.total)
            if (this.myDispGroupModel.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.myDispGroupModel.total / this.queryArgs.count);
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: this.curPage,
                onPageChange: function (num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        this.curPage = num;
                        args.count = this.queryArgs.count;
                        this.refreshList();
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initDispListDropMenu: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.count = value;
                this.refreshList();
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
            this.enterKeyBindQuery();
        }
    }); 

    var ImportDomainManageEditView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.curModel;

            this.$el = $(_.template(template['tpl/importDomainManage/importDomainManage.edit.html'])({data: this.model}));
            this.$el.find(".hide-disp-domain").on("click", $.proxy(this.onClickHideDisp, this));
            this.$el.find(".show-disp-domain").on("click", $.proxy(this.onClickShowDisp, this));
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".togglebutton input").on("click", $.proxy(this.onClickToggle, this));
            this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));

            this.currentDispId = this.model.get('dispId');
            this.curOpen302 = this.model.get('open302') ? 1 : 0;
            this.$el.find(".disp-list-ctn").hide();
            this.initDispList();
        },

        onClickToggle: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;

            var message = '';
            if (!this.curOpen302)
                message = this.model.get('domain') || "[后端返回domain为null]" + "域名是否确定要开启302调度服务？"
            else
                message = this.model.get('domain') || "[后端返回domain为null]" + "域名是否确定要关闭302调度服务？"

            var result = confirm(message)
            if (!result)
                eventTarget.checked = !eventTarget.checked
            this.curOpen302 = eventTarget.checked ? 1 : 0;
        },

        onClickSaveButton: function(){
            var message = this.model.get('cname') + '接入域名将CNAME到' + this.model.get('dispDomain') + '调度域名，是否确定修改？';
            var result = confirm(message);
            var postParam = {
                cnameId: this.model.get("cnameId"),
                topoId: this.model.get("topoId"),
                dispId: this.currentDispId,
                open302: this.curOpen302
            }
            if (result) {
                this.collection.off("set.cname.success");
                this.collection.off("set.cname.error");
                this.collection.on("set.cname.success", $.proxy(this.onSaveSuccess, this));
                this.collection.on("set.cname.error", $.proxy(this.onGetError, this));
                this.collection.editCname(postParam)
            }
        },

        onSaveSuccess: function(){
            alert("保存并下发成功")
            this.onClickCancelButton();
        },

        onClickHideDisp: function(){
            this.$el.find(".hide-disp-domain").hide();
            this.$el.find(".show-disp-domain").show();
            this.$el.find(".disp-list-ctn").slideUp(200);
        },

        onClickShowDisp: function(){
            this.$el.find(".hide-disp-domain").show();
            this.$el.find(".show-disp-domain").hide();
            this.$el.find(".disp-list-ctn").slideDown(200);
        },

        initDispList: function(){
            var mySelectDispView = new SelectDispView({
                curModel: this.model,
                collection: this.collection,
                onOKCallback: function(data){
                    this.currentDispId = data.dispId;
                    this.$el.find(".disp-domain .disp-domain-html").html(data.dispName)
                }.bind(this),
                onCancelSelectCallback: function(){
                    this.currentDispId = this.model.get('dispId');
                    this.$el.find(".disp-domain .disp-domain-html").html(this.model.get('dispDomain'));
                }.bind(this)
            });
            mySelectDispView.render(this.$el.find(".disp-list-ctn"))
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return ImportDomainManageEditView;
});