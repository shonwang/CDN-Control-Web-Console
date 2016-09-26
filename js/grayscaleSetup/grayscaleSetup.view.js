define("grayscaleSetup.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.isEdit = options.isEdit;
            this.businessTypeList = options.businessTypeList;

            if(this.isEdit){
                this.args = {
                    id : this.model.get("id"),
                    domain : this.model.get("domain"),
                    bisTypeId : this.model.get("bisTypeId"),
                    nodeId : [this.model.get("nodeId")],
                    confFile : []
                }
            }else{
                this.args = {
                    domain : "",
                    bisTypeId : this.businessTypeList[0].value,
                    nodeId : [],
                    confFile : []
                }
            }
            this.$el = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.add&edit.html'])({data:this.args}));

            this.collection.off("get.nodeGroupTree.success");
            this.collection.off("get.nodeGroupTree.error");
            this.collection.on("get.nodeGroupTree.success", $.proxy(this.initTree, this));
            this.collection.on("get.nodeGroupTree.error", $.proxy(this.onGetError, this));

            this.initDropMenu();
        },

        arrIndexOf: function(arr,val){
            for (var i = 0; i < arr.length; i++) {
                if (_.isEqual(arr[i],val)) return i;
            }
            return -1;
        },

        arrRemove: function(arr,val){
            var index = this.arrIndexOf(arr,val);
            if (index > -1) {
                arr.splice(index, 1);
            }
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        initTree: function(res){
            //console.log(res);
            var zNodes = res;

            if(this.isEdit){
                var nodeId = this.model.get("nodeId");
                var setting = {
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onCheck: function(){
                            this.getEditSelected();
                        }.bind(this)
                    }
                };

                 _.each(zNodes,function(el,index,ls){
                    el.open = false;
                    el.nocheck = false;
                    if(el.pId == 0){
                        el.open = true;
                        el.nocheck = true;
                    }
                    if(el.id == nodeId){
                        el.checked = true;
                    }
                }.bind(this));
            }else{
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
                            this.getAddSelected();
                        }.bind(this)
                    }
                };

                this.oldSelectedNode = [];

                _.each(zNodes,function(el,index,ls){
                    el.open = false;
                    if(el.pId == 0){
                        el.open = true;
                    }
                }.bind(this));
            }

            // if(this.isEdit){
            //     //for edit test data
            //     var zNodes =[
            //         { id:1, pId:0, name:"节点组 1", open:true, "nocheck":true},
            //         { id:11, pId:1, name:"节点 1-1"},
            //         { id:12, pId:1, name:"节点 1-2"},
            //         { id:2, pId:0, name:"节点组 2", open:true, "nocheck":true},
            //         { id:21, pId:2, name:"节点 2-1"},
            //         { id:22, pId:2, name:"节点 2-2"},
            //         { id:23, pId:2, name:"节点 2-3"}
            //     ];
            // }else{
            //     //for add test data
            //     var zNodes =[
            //         { id:1, pId:0, name:"节点组 1", open:true},
            //         { id:11, pId:1, name:"节点 1-1"},
            //         { id:12, pId:1, name:"节点 1-2"},
            //         { id:2, pId:0, name:"节点组 2", open:true},
            //         { id:21, pId:2, name:"节点 2-1"},
            //         { id:22, pId:2, name:"节点 2-2"},
            //         { id:23, pId:2, name:"节点 2-3"}
            //     ];
            // }

            this.treeObj = $.fn.zTree.init(this.$el.find(".nodeList-ctn #tree"), setting, zNodes);

            if(this.isEdit){
                this.getEditSelected();
            }

            this.$el.find(".chk").on("focus",function(e){
                var eTarget = e.srcElement || e.target,className;
                className = $(eTarget).attr('class').split(" ")[2];
                $(eTarget).removeClass(className).addClass(className+'_focus');
            }.bind(this));
        },

        getAddSelected: function(){
            var nodeGroup = null;
            if (!this.treeObj) return;

            this.selectedNode = this.treeObj.getCheckedNodes(true);

            if(this.oldSelectedNode.length > 0 && this.selectedNode.length > 0){
                var father = this.oldSelectedNode[0];
                var fatherNum = 0;
                var fatherChildren = [];

                _.each(this.selectedNode,function(obj,key,list){
                    if(obj.pId === null){
                        fatherNum ++;
                    }
                }.bind(this));

                if(fatherNum > 1){
                    father.checked = false;
                    _.each(this.selectedNode,function(obj,key,list){
                        if(obj.pId && (obj.pId == father.id) && (obj.checked == true)){
                            obj.checked = false;
                            fatherChildren.push(obj);
                        }
                    }.bind(this));
                    _.each(fatherChildren,function(o,k,l){
                        this.$el.find('#'+o.tId+'_check').removeClass('checkbox_true_full').addClass('checkbox_false_full');
                        this.arrRemove(this.selectedNode,o);
                        this.arrRemove(this.oldSelectedNode,o);
                    }.bind(this));
                    this.$el.find('#'+father.tId+'_check').attr('class','button chk checkbox_false_part')
                    this.arrRemove(this.selectedNode,father);
                    this.arrRemove(this.oldSelectedNode,father);
                    father = this.selectedNode[0];
                    nodeGroup = father;
                }else{
                    nodeGroup = father;
                }
            }else{
                nodeGroup = this.selectedNode[0];
            }

            this.oldSelectedNode = this.selectedNode;

            this.initFileList(nodeGroup);

            this.args.nodeId = [];
            _.each(nodeGroup.children,function(obj,key,list){
                if(obj.checked){
                    this.args.nodeId.push(obj.id);
                }
            }.bind(this));

        },

        getEditSelected: function(){
            if (!this.treeObj) return;
            var matchNode = function(node){
                return node.checked === true && node.pId !== null;
            };
            var checkedNode = this.treeObj.getNodesByFilter(matchNode);
            var findFatherNode = function(node){
                return node.id === checkedNode[0].pId && node.pId === null;
            }
            var fatherNode = this.treeObj.getNodesByFilter(findFatherNode, true);

            this.initFileList(fatherNode);
            this.args.nodeId = [];
            this.args.nodeId.push(checkedNode[0].id);
        },

        initFileList: function(nodeGroup){
            //console.log(nodeGroup);
            if(nodeGroup.confFileList.length > 0){
                this.table = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.add&edit.nodeFile.html'])({data:nodeGroup.confFileList}));
                this.$el.find(".nodeFiles").html(this.table[0]);
                this.$el.find(".nodeFiles tbody td a").off("click");
                this.$el.find(".nodeFiles tbody td a").on("click",$.proxy(this.onClickConf,this));
                this.$el.find(".nodeFiles tbody td a").eq(0).trigger('click');
                if(this.isEdit){
                    _.each(nodeGroup.confFileList,function(obj,key,list){
                        this.$el.find("#"+obj.id).val(obj.content);
                    }.bind(this));
                }
            }else{
                this.$el.find(".nodeFiles").html(_.template(template['tpl/empty-2.html'])({data:{message:"此节点组暂无配置文件"}}));
            }
        },

        onClickConf: function(e){
            var eTarget = e.srcElement || e.target,id;
            id = $(eTarget).attr("data-id");
            this.$el.find(".nodeFiles textarea").hide();
            this.$el.find('#'+id).show();
        },

        initDropMenu: function(){
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), this.businessTypeList, function(value){
                this.args.bisTypeId = parseInt($.trim(value));

                this.collection.getNodeGroupTree({bisTypeId:this.args.bisTypeId});
            }.bind(this));
            if(this.isEdit){
                $.each(this.businessTypeList,function(k,v){
                    if(v.value == this.model.get("bisTypeId")){
                        this.$el.find("#dropdown-businessType .cur-value").html(v.name);
                    }
                }.bind(this));
            }else{
                this.$el.find("#dropdown-businessType .cur-value").html(this.businessTypeList[0].name);
            }
        },

        getArgs: function() {
            this.args.domain = $.trim(this.$el.find("#input-domain").val());
            if(this.args.domain.length > 0){
                if (!/\.com$|\.net$|\.org$|\.edu$|\.gov$|\.cn$/gi.test(this.args.domain)){
                    alert('域名需以com、org、net、edu、gov、cn结尾');
                    return;
                }else if(this.args.domain.length > 100){
                    alert("域名最大可输入100个字符");
                    return;
                }
            }

            //获取配置文件相应参数
            var $confDom = this.$el.find('.nodeFiles tbody td a');
            var $textareaDom = this.$el.find('.nodeFiles textarea');
            if($confDom.length > 0){
                $confDom.each(function(i){
                    var json = {};
                    json.confFileId = $.trim($textareaDom.eq(i).attr('id'));
                    json.content = $.trim($textareaDom.eq(i).val());
                    this.args.confFile.push(json);
                }.bind(this));
            }
            _.each(this.args.confFile,function(obj,k,l){
                if(obj.content.length > 4000){
                    alert("配置文件内容最多允许输入4000个字符");
                    return;
                }
            }.bind(this));


            return this.args;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var SyncProgressView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.data = options.data;

            this.$el = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.syncProgress.html'])({data:this.data.nodeGroup}));
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

            this.initPageDropMenu();

            this.getPageArgs = {
                domain: "",
                nodeId:null,
                bisTypeId:null,
                page: 1,
                count: 10
            };

            this.collection.getNodeList(); //请求节点列表
            this.collection.getBusinessList(); //初始化业务列表数据

            this.collection.on("get.domainPageList.success", $.proxy(this.onGetDomainPageListSuccess,this));
            this.collection.on("get.domainPageList.error", $.proxy(this.onGetError,this));
            this.collection.on("get.node.success", $.proxy(this.onGetNodeSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            this.collection.on("get.businessList.success", $.proxy(this.initBisDropMenu, this));
            this.collection.on("get.businessList.error", $.proxy(this.onGetError, this));
            this.collection.on("add.graydomain.success", function(){
                alert("新建灰度域名成功");
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.graydomain.error", $.proxy(this.onGetError, this));
            this.collection.on("edit.graydomain.success", function(){
                alert("编辑灰度域名成功");
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("eidt.graydomain.error", $.proxy(this.onGetError, this));
            this.collection.on("delete.grayDomain.success", function(){
                alert("删除灰度域名成功");
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("delete.grayDomain.error", $.proxy(this.onGetError, this));
            this.collection.on("get.syncProgress.success", $.proxy(this.onGetSyncProgressSuccess, this));
            this.collection.on("get.syncProgress.error", $.proxy(this.onGetError, this));
            this.collection.on("get.sync.success", $.proxy(this.onGetSyncSuccess, this));
            this.collection.on("get.sync.error", $.proxy(this.onGetError, this));

            this.$el.find(".create").on("click", $.proxy(this.onClickCreate, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            this.enterKeyBindQuery();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetDomainPageListSuccess: function(res){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onGetNodeSuccess: function(res){
            var nameList = [{name: "全部", value: "All"}];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.chName, value:el.id})
            });

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-node').get(0),
                panelID: this.$el.find('#dropdown-node').get(0),
                isSingle: true,
                openSearch: true,
                onOk: function(){},
                data: nameList,
                callback: function(data) {
                    if(data.value == 'All'){
                        this.getPageArgs.nodeId = null;
                    }else{
                        this.getPageArgs.nodeId = data.value;
                    }
                    this.$el.find('#dropdown-node .cur-value').html(data.name);
                }.bind(this)
            });
            this.$el.find(".dropdown-node .cur-value").html(nameList[0].name);
            if(nameList[0].value == 'All'){
                this.getPageArgs.nodeId = null;
            }else{
                this.getPageArgs.nodeId = nameList[0].value;
            }
        },

        initBisDropMenu: function(res){
            var businessTypeList = [];
            _.each(res, function(el, key, ls){
                businessTypeList.push({name: el.name, value: el.id})
            })
            this.businessTypeList = businessTypeList;
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), businessTypeList, function(value){
                this.getPageArgs.bisTypeId = parseInt($.trim(value));
            }.bind(this));

            this.getPageArgs.bisTypeId = parseInt(businessTypeList[0].value);
            this.collection.getDomainPageList(this.getPageArgs); //请求table列表

            if(this.isEdit){
                $.each(businessTypeList,function(k,v){
                    if(v.value == this.model.get("businessType")){
                        this.$el.find("#dropdown-businessType .cur-value").html(v.name);
                    }
                }.bind(this));
            }else{
                this.$el.find("#dropdown-businessType .cur-value").html(businessTypeList[0].name);
                this.getPageArgs.bisTypeId = parseInt(businessTypeList[0].value);
            }
        },

        onClickQueryButton: function(){
            this.getPageArgs.domain = this.$el.find("#input-domain").val();
            if (this.getPageArgs.domain == ""){
                this.getPageArgs.domain = null;
            }else{
                if (!/\.com$|\.net$|\.org$|\.edu$|\.gov$|\.cn$/gi.test(this.getPageArgs.domain)){
                    alert('域名需以com、org、net、edu、gov、cn结尾');
                    return;
                }else if(this.getPageArgs.domain.length > 100){
                    alert("域名最大可输入100个字符");
                    return;
                }
            }
            this.isInitPaginator = false;
            this.getPageArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getDomainPageList(this.getPageArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.table.html'])({data:this.collection.models}));
            if (this.collection.models.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);
            }else{
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }

            this.$el.find(".edit").on("click", $.proxy(this.onClickEdit, this));
            this.$el.find(".delete").on("click", $.proxy(this.onClickDelete, this));
            this.$el.find(".sync").on("click", $.proxy(this.onClickSync, this));
        },

        onClickCreate: function(){
            this.collection.getNodeGroupTree({bisTypeId:this.getPageArgs.bisTypeId});

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
                width : 800,
                type : 2,
                onOKCallback:  function(){
                    var options = addView.getArgs();
                    if (!options) return;
                    this.collection.addDomain(options);
                    this.addPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addPopup = new Modal(options);
        },

        onClickEdit:function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }
            this.collection.getNodeGroupTree({bisTypeId:this.getPageArgs.bisTypeId,grayDomainId:id});

            var model = this.collection.get(id);

            if(this.editPopup) $("#" + this.editPopup.modalId).remove();

            var editView = new AddOrEditView({
                collection: this.collection,
                model: model,
                isEdit: true,
                width : 800,
                businessTypeList: this.businessTypeList
            });

            var options = {
                title:"编辑",
                body : editView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = editView.getArgs();
                    if (!options) return;
                    this.collection.editDomain(options);
                    this.editPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.editPopup = new Modal(options);
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
            this.collection.deleteGrayDomain({id:id});
        },

        onClickSync: function(e){
            var eTarget = e.srcElement || e.target;
            this.syncId = "";
            this.syncDomain = "";
            this.syncBisTypeId = "";

            if (eTarget.tagName == "SPAN") {
                this.syncId = $(eTarget).parent().attr("id");
                this.syncDomain = $(eTarget).parent().attr("data-domain");
                this.syncBisTypeId = $(eTarget).parent().attr("data-bisTypeId");
            } else {
                this.syncId = $(eTarget).attr("id");
                this.syncDomain = $(eTarget).attr("data-domain");
                this.syncBisTypeId = $(eTarget).attr("data-bisTypeId");
            }
            var result = confirm("你确定要同步当前域名吗？")
            if (!result) return;

            this.collection.getSync({id:this.syncId});
        },

        onGetSyncSuccess: function(){
            //定时器
            this.timer = setInterval(function(){
                this.collection.getSyncProgress({domain:this.syncDomain,bisTypeId:this.syncBisTypeId});
            }.bind(this),5000);
        },

        onGetSyncProgressSuccess: function(res){
            if (this.syncProgressPopup) $("#" + this.syncProgressPopup.modalId).remove();

            var syncProgressView = new SyncProgressView({
                collection: this.collection,
                data: res
            });
            var options = {
                title:"域名："+res.domain,
                body : syncProgressView,
                backdrop : 'static',
                type     : 1,
                onOKCallback:  function(){}.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.syncProgressPopup = new Modal(options);

            if(res.percentage == '100'){
                clearInterval(this.timer);
            }
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.getPageArgs.count) return;
            var total = Math.ceil(this.collection.total/this.getPageArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.getPageArgs);
                        args.page = num;
                        args.count = this.getPageArgs.count;
                        this.collection.getDomainPageList(args); //请求域名列表接口
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initPageDropMenu: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.getPageArgs.count = value;
                this.getPageArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));
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
