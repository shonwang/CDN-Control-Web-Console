define("grayscaleSetup.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.isEdit = options.isEdit;
            this.businessTypeList = options.businessTypeList;

            this.$el = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.add&edit.html'])());

            if(this.isEdit){

            }else{

            }

            this.initTree();
            this.initDropMenu();
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        initTree: function(res){
            var setting = {
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: function(){
                        this.getSelected();
                    }.bind(this)
                }
            };

            //var zNodes = res[this.nodeGroupId];

            // _.each(zNodes,function(el,index,ls){
            //     el.open = false;
            //     el.highlight = false;
            //     el.nodeIcon = false;
            //     if(el.pId == -1){
            //         el.open = true;
            //         el.nodeIcon = true; //节点显示“文件夹”图标
            //     }
            //     if(el.deviceStatus != 1 && el.pId != -1){
            //         el.highlight = true;
            //     }
            //     if(el.nodeStatus != 1 && el.pId == -1){
            //         el.highlight = true;
            //     }
            // }.bind(this));

            var zNodes =[
                { id:1, pId:0, name:"节点组 1", open:true,checked:false},
                { id:11, pId:1, name:"节点 1-1", checked:false},
                { id:12, pId:1, name:"节点 1-2"},
                { id:2, pId:0, name:"节点组 2", open:true},
                { id:21, pId:2, name:"节点 2-1"},
                { id:22, pId:2, name:"节点 2-2"},
                { id:23, pId:2, name:"节点 2-3"}
            ];

            this.treeObj = $.fn.zTree.init(this.$el.find(".nodeList-ctn #tree"), setting, zNodes);
            this.getSelected();
        },

        getSelected: function(){
            var nodeIdArray = [];
            var matchFilter = function(node){
                return node;
            };
            this.nodeAllObj = this.treeObj.getNodesByFilter(matchFilter);
            //console.log(this.nodeAllObj);
            // if (!this.treeObj) return;
            // var matchFilter = function(node){
            //     return node.checked === true && node.pId === null;
            // };
            // this.matchNodes = this.treeObj.getNodesByFilter(matchFilter);
            // this.$el.find(".node-num").html(this.matchNodes.length);
            // var matchDeviceFilter = function(node){
            //     return node.checked === true && node.pId !== null;
            // };
            // this.matchDeviceNodes = this.treeObj.getNodesByFilter(matchDeviceFilter);
            // this.$el.find(".device-num").html(this.matchDeviceNodes.length);
            // _.each(this.nodeTreeLists[this.nodeGroupId], function(nodeGroupObj, k, l){
            //     var node = this.treeObj.getNodeByParam("id", nodeGroupObj.id, null);
            //     nodeGroupObj.checked = node.checked
            // }.bind(this));
            _.each(this.nodeAllObj,function(obj, key, el) {
                //console.log(obj);
                if(obj.pId && obj.checked){
                    nodeIdArray.push(obj.id);
                }
            });
            //console.log(this.nodeAllObj);
            this.initFileList();
        },

        initFileList: function(fileList){
            this.table = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.add&edit.nodeFile.html'])());
            this.$el.find(".nodeFiles").html(this.table[0]);
        },

        initDropMenu: function(){
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), this.businessTypeList, function(value){
                this.args.businessType = parseInt($.trim(value));
            }.bind(this));
            this.$el.find("#dropdown-businessType .cur-value").html(this.businessTypeList[0].name);
            if(this.isEdit){
                $.each(businessTypeList,function(k,v){
                    if(v.value == this.model.get("businessType")){
                        this.$el.find("#dropdown-businessType .cur-value").html(v.name);
                    }
                }.bind(this));
            }
        },

        getArgs: function() {
            
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var SyncProgressView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;

            this.$el = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.syncProgress.html'])());
        },
        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var GrayscaleSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            // this.initPageDropMenu();

            // this.getPageArgs = {
            //     domain: "",
            //     page: 1,
            //     count: 10
            // };

            //this.enterKeyBindQuery();

            //for test 
            this.initTable();
            //请求业务类型接口获取业务类型 for test
            this.businessTypeList = [
                {name: "cache2.0直播业务", value: 1},
                {name: "cache2.0点播播业务", value: 2},
                {name: "xxxxx", value: 3}
            ];
            this.initDropMenu(this.businessTypeList);

            this.$el.find(".create").on("click", $.proxy(this.onClickCreate, this));
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        initDropMenu: function(businessTypeList){
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), businessTypeList, function(value){
                this.args.businessType = parseInt($.trim(value));
            }.bind(this));
            this.$el.find("#dropdown-businessType .cur-value").html(businessTypeList[0].name);
            if(this.isEdit){
                $.each(businessTypeList,function(k,v){
                    if(v.value == this.model.get("businessType")){
                        this.$el.find("#dropdown-businessType .cur-value").html(v.name);
                    }
                }.bind(this));
            }
        },

        onClickQueryButton: function(){
            // this.isInitPaginator = false;
            // this.getPageArgs.page = 1;
            // this.getPageArgs.domain = this.$el.find("#input-domain").val();
            // if (this.getPageArgs.domain == "") this.getPageArgs.domain = null;
            // this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            // this.$el.find(".pagination").html("");
            // this.collection.getDomainList(this.getPageArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.table.html'])());
            this.$el.find(".table-ctn").html(this.table[0]);

            this.$el.find(".edit").on("click", $.proxy(this.onClickEdit, this));
            this.$el.find(".delete").on("click", $.proxy(this.onClickDelete, this));
            this.$el.find(".sync").on("click", $.proxy(this.onClickSync, this));
            // if (this.collection.models.length !== 0){
            //     this.table = $(_.template(template['tpl/domainManage/domainManage.table.html'])({data:this.collection.models}));
            //     this.$el.find(".table-ctn").html(this.table[0]);
            // }else{
            //     this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            // }
        },

        onClickCreate: function(){
            if (this.addPopup) $("#" + this.addPopup.modalId).remove();

            var addView = new AddOrEditView({
                collection: this.collection,
                isEdit: false,
                businessTypeList: this.businessTypeList
            });
            var options = {
                title:"新建",
                body : addView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    // var options = addView.getArgs();
                    // if (!options) return;
                    // this.collection.addDomain(options);
                    // this.addPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addPopup = new Modal(options);
            //window.addPopup = this.addPopup;
        },

        onClickEdit:function(e){
            // var eTarget = e.srcElement || e.target,id;

            // if (eTarget.tagName == "SPAN") {
            //     id = $(eTarget).parent().attr("id");
            // } else {
            //     id = $(eTarget).attr("id");
            // }
            // this.collection.getCacheRuleList(id); //调用显示缓存规则列表

            // var model = this.collection.get(id);

            // if(this.editDomainPopup) $("#" + this.editDomainPopup.modalId).remove();

            // var editDomainView = new AddOrEditDomainManageView({
            //     collection: this.collection,
            //     model: model,
            //     isEdit: true
            // });

            // var options = {
            //     title:"编辑域名",
            //     body : editDomainView,
            //     backdrop : 'static',
            //     type     : 2,
            //     onOKCallback:  function(){
            //         var options = editDomainView.getArgs();
            //         if (!options) return;
            //         this.collection.editDomain(options);
            //         this.editDomainPopup.$el.modal("hide");
            //     }.bind(this),
            //     onHiddenCallback: function(){}.bind(this)
            // }
            // this.editDomainPopup = new Modal(options);
            // window.editDomainPopup = this.editDomainPopup;
        },

        onClickDelete: function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }
            var result = confirm("你确定要删除当前域名吗？")
            if (!result) return;
            //请求删除接口
            //this.collection.deleteDomain(id);
        },

        onClickSync: function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }
            var result = confirm("你确定要同步当前域名吗？")
            if (!result) return;
            //请求同步接口
            //this.collection.getSyncProgress(id);
            this.getSyncProgressSuccess();
        },

        initPaginator: function(){
            // this.$el.find(".total-items span").html(this.collection.total)
            // if (this.collection.total <= this.getPageArgs.count) return;
            // var total = Math.ceil(this.collection.total/this.getPageArgs.count);

            // this.$el.find(".pagination").jqPaginator({
            //     totalPages: total,
            //     visiblePages: 10,
            //     currentPage: 1,
            //     onPageChange: function (num, type) {
            //         if (type !== "init"){
            //             this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            //             var args = _.extend(this.getPageArgs);
            //             args.page = num;
            //             args.count = this.getPageArgs.count;
            //             this.collection.getDomainList(args); //请求域名列表接口
            //         }
            //     }.bind(this)
            // });
            // this.isInitPaginator = true;
        },

        // initPageDropMenu: function(){
        //     var pageNum = [
        //         {name: "10条", value: 10},
        //         {name: "20条", value: 20},
        //         {name: "50条", value: 50},
        //         {name: "100条", value: 100}
        //     ]
        //     Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
        //         this.getPageArgs.count = value;
        //         this.getPageArgs.page = 1;
        //         this.onClickQueryButton();
        //     }.bind(this));
        // },

        getSyncProgressSuccess: function(res){
            if (this.syncProgressPopup) $("#" + this.syncProgressPopup.modalId).remove();

            var syncProgressView = new SyncProgressView({
                collection: this.collection
            });
            var options = {
                title:"域名：",
                body : syncProgressView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    // var options = syncProgressView.getArgs();
                    // if (!options) return;
                    // this.collection.addDomain(options);
                    // this.syncProgressPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.syncProgressPopup = new Modal(options);
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function() {
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function() {
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return GrayscaleSetupView;
});
