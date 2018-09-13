define("hashOrigin.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var CheckView = Backbone.View.extend({
        initialize:function(options){
            this.collection = options.collection;
            this.model = options.model;
            this.id = this.model.get("id");
            this.collection.off("check.hashOrigin.success");
            this.collection.off("check.hashOrigin.error");
            this.collection.on("check.hashOrigin.success",$.proxy(this.onCheckSuccess,this));
            this.collection.on("check.hashOrigin.errir",$.proxy(this.onGetError,this));
            this.$el = $("<div class='checkCtn'></div>");
            this.showLoading();
            this.collection.selectStrategyByHashId(this.id);
        },

        onCheckSuccess:function(res){
            this.dataList = res;
            if(res.length>0){
               this.table = $(_.template(template['tpl/hashOrigin/hashOrigin.check.html'])({data:res}));
            }
            else{
                this.table = $(_.template(template['tpl/empty.html'])({}));
            }
            //this.table = $(_.template(template['tpl/hashOrigin/hashOrigin.check.html'])({data:res}));
            this.$el.html(this.table);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },        

        showLoading:function(){
            this.$el.html(_.template(template['tpl/loading.html'])({}));
        },

        getArgs:function(){
            var arr=[];
            _.each(this.dataList,function(list){
                arr.push({
                    "id":list.id,
                    "type":list.type,
                    "name":list.name
                });
            });
            return arr;
        },

        render:function(target,el){
            this.$el.appendTo(target);
            el.find(".ok").html("下发")
        }
    });

    var HashOriginView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isInitPaginator = false;
            this.$el = $(_.template(template['tpl/hashOrigin/hashOrigin.html'])());
            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
   
            this.queryArgs = {
                "name": null,
                "nodeName"  : null,
                "type"      : null,
                "autoFlag"  : null,
                "page"      : 1,
                "count"     : 10
            }
            this.collection.on("get.hashOrigin.success",$.proxy(this.onGetHashOriginSuccess,this));
            this.collection.on("get.hashOrigin.error",$.proxy(this.onGetError,this));
            this.collection.on("sendBatchStratefy.success",$.proxy(this.onSendBatchStratefySuccess,this));
            this.collection.on("sendBatchStratefy.error",$.proxy(this.onGetError,this));

            this.$el.find('.query').on("click",$.proxy(this.resetPageAndQuery,this));
            this.initDropMenu();
            this.onClickQueryButton();
        },

        onSendBatchStratefySuccess:function(){
            Utility.alerts("下发成功","success",5000)
        },

        initDropMenu: function(res){
            var typeArray = [
                {name:"全部",value:"all"},
                {name:"Cache",value:202},
                {name:"Live",value:203}
            ];
            var flagArray = [
                {name:"全部",value:"all"},
                {name:"允许",value:1},
                {name:"不允许",value:0}
            ];

            var isMultiArray = [
                {name:"否",value:0},
                {name:"是",value:1}
            ];

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
            }];

            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value) {
                this.queryArgs.count = value;
                this.queryArgs.page = 1;
                this.isInitPaginator = false;
                this.onClickQueryButton();
            }.bind(this));

            Utility.initDropMenu(this.$el.find(".dropdown-node-type"), typeArray, function(value){
                if(value == 'all'){
                    this.queryArgs.type = null;
                }
                else{
                    this.queryArgs.type = parseInt(value);
                }
            }.bind(this));

            Utility.initDropMenu(this.$el.find(".dropdown-auto-flag"), flagArray, function(value){
                if(value == 'all'){
                    this.queryArgs.autoFlag = null;
                }
                else{
                    this.queryArgs.autoFlag = parseInt(value);
                }
            }.bind(this));

            // Utility.initDropMenu(this.$el.find(".dropdown-is-multi"), isMultiArray, function(value){
            //     this.queryArgs.isMulti = parseInt(value);
            // }.bind(this));
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

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetHashOriginSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        resetPageAndQuery:function(){
            this.queryArgs.page = 1;
            this.isInitPaginator = false;
            this.onClickQueryButton();
        },

        onClickQueryButton: function(){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.name = this.$el.find("#input-name").val().trim() || null;
            this.queryArgs.nodeName = this.$el.find("#input-node-name").val().trim() || null;
            this.collection.getHashList(this.queryArgs);
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
            this.table = $(_.template(template['tpl/hashOrigin/hashOrigin.table.html'])({data:this.collection.models}));
            // this.$el.find(".table-ctn").html(this.table[0]);
            if (this.collection.models.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);

                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                this.table.find("tbody .check").on("click", $.proxy(this.onClickItemCheck, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
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

            this.hideList();
            if (this.addHashView) {
                this.addHashView.destroy();
                this.addHashView = null;
            }
            require(["hashOrigin.edit.view"], function(AddOrEditHashView) {
                this.addHashView = new AddOrEditHashView({
                    collection: this.collection,
                    model:model,
                    operatorList:null,
                    isEdit:true,
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

        onClickItemCheck: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.checkHashPopup) $("#" + this.checkHashPopup.modalId).remove();

            var myCheckView = new CheckView({
                collection: this.collection,
                model: model
            });

            var options = {
                title: "hash关联特殊分层策略列表",
                body: myCheckView,
                backdrop: 'static',
                type: 2,
                onHiddenCallback: function() {}.bind(this),
                onOKCallback:function(){
                    var result = myCheckView.getArgs();
                    if(!result){
                        return false;
                    }
                    this.collection.sendBatchStratefyTask(result);
                    this.checkHashPopup.$el.modal('hide');
                }.bind(this)
            }
            this.checkHashPopup = new Modal(options);

            
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
                        this.queryArgs.page = num;
                        this.onClickQueryButton();
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