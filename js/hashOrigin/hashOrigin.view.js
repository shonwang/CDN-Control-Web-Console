define("hashOrigin.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var HashOriginView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/hashOrigin/hashOrigin.html'])());
            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
   
            this.queryArgs = {
                "devicename": null,//设备名称
                "nodename"  : this.nodesName,//节点名称
                "status"    : null,//设备状态
                "type"      : null,//设备类型
                "page"      : 1,
                "count"     : 10
            }
            this.onDeviceListSuccess();

        },

        hideList: function() {
            this.$el.find(".hash-origin-list-pannel").hide();
        },        

        showList: function() {
            this.$el.find(".hash-origin-list-pannel").show();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    e.stopPropagation();
                    e.preventDefault();
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetOperateTypeListSuccess: function(res){
            this.operateTypeList = [{
                name: "全部",
                value: "All"
            }]
            _.each(res, function(el, index){
                this.operateTypeList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            Utility.initDropMenu(this.$el.find(".dropdown-reason"), this.operateTypeList, function(value) {
                if (value !== "All")
                    this.queryArgs.opType = parseInt(value)
                else
                    this.queryArgs.opType = null;
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onDeviceListSuccess: function(){
            this.initTable();
            //if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.devicename = this.$el.find("#input-domain").val().trim() || null;
            this.queryArgs.nodename = this.$el.find("#input-node").val().trim() || null;
            this.collection.getDeviceList(this.queryArgs);
        },

        onClickCreate: function(){
            this.hideList();
            if (this.addHashView) {
                this.addHashView.destroy();
                this.addHashView = null;
            }
            require(["hashOrigin.edit.view"], function(AddOrEditHashView) {
                this.addHashView = new AddOrEditHashView({
                    collection: this.collection,
                    operatorList:null,
                    obj:this,
                    showList: function() {
                        this.showList();
                    }.bind(this),
                    onHiddenCallback: function() {
                        this.showList();
                        if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                    }.bind(this),
                    onOKCallback: function() {
                        var options = this.addNodeView.getArgs();
                        if (!options) return;
                        this.collection.addNode(options);
                        this.showList();
                        if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                    }.bind(this)
                });
                this.addHashView.render(this.$el.find(".hash-origin-add-edit-pannel"));
            }.bind(this))
        },

        initTable: function(){

            this.table = $(_.template(template['tpl/hashOrigin/hashOrigin.table.html'])({permission: AUTH_OBJ}));
            this.$el.find(".table-ctn").html(this.table[0]);
            // if (this.collection.models.length !== 0){
            //     this.$el.find(".table-ctn").html(this.table[0]);

            //     this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            //     this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            //     this.table.find("tbody .ip-manage").on("click", $.proxy(this.onClickItemIp, this));

            //     this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
            //     this.table.find("tbody .hangup").on("click", $.proxy(this.onClickItemHangup, this));
            //     this.table.find("tbody .stop").on("click", $.proxy(this.onClickItemStop, this));

            //     this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            //     this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));

            //     this.table.find("tbody .operateDetail").on("click", $.proxy(this.onClickDetail, this));

            //     this.$el.find(".open").on("click", $.proxy(this.onClickDeviceOpen, this));
            //     this.$el.find(".pause").on("click", $.proxy(this.onClickDevicePause, this));

            //     this.table.find("[data-toggle='popover']").popover();
            // } else {
            //     this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            // }
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

            if (this.editDevicePopup) $("#" + this.editDevicePopup.modalId).remove();

            require(["deviceManage.edit.view"], function(AddOrEditDeviceView) {
                var editDeviceView = new AddOrEditDeviceView({
                    collection: this.collection, 
                    model     : model,
                    isEdit    : true,
                    deviceTypeArray: this.deviceTypeArray
                });
                var options = {
                    title:"编辑设备",
                    body : editDeviceView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback:  function(){
                        var options = editDeviceView.getArgs();
                        if (!options) return;
                        var tmp = _.extend({}, model.attributes),
                            args = _.extend(tmp, options);
                        this.collection.updateDevice(args)
                        this.editDevicePopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){
                        if (AUTH_OBJ.QueryHost) this.enterKeyBindQuery();
                    }.bind(this)
                }
                this.editDevicePopup = new Modal(options);
                if (!AUTH_OBJ.ApplyEditHost)
                    this.editDevicePopup.$el.find(".modal-footer .btn-primary").remove();
            }.bind(this));
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var result = confirm("你确定要删除设备" + model.attributes.name + "吗");
            if (!result) return;
            this.collection.deleteDevice({id:parseInt(id)})
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
                        this.collection.getDeviceList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initHashOriginDropMenu: function(res){
            this.deviceTypeArray = [];
            var typeArray = [
                {name: "全部", value: "All"}
            ],
            rootNode = this.$el.find(".dropdown-type");

            _.each(res, function(el, index, ls){
                typeArray.push({name:el.name, value: el.id});
                this.deviceTypeArray.push({name:el.name, value: el.id});
            }.bind(this));

            Utility.initDropMenu(rootNode, typeArray, function(value){
                if (value !== "All")
                    this.queryArgs.type = parseInt(value)
                else
                    this.queryArgs.type = null
            }.bind(this));
            
            var statusArray = [
                {name: "全部", value: "All"},
                {name: "运行中", value: 1},
                {name: "暂停中", value: 2},
                {name: "启动中", value:8}
            ],
            rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                if (value !== "All")
                    this.queryArgs.status = parseInt(value)
                else
                    this.queryArgs.status = null
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
        
        showList: function() {
            this.$el.find(".hash-origin-list-pannel").show();
        },        

        hide: function(){
            this.$el.hide();
        },

        update: function(target){
            this.collection.off();
            this.collection.reset();
            this.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return HashOriginView;
});