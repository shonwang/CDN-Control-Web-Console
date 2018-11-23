define("chargeManage.view",['require', 'exports', 'template', 'modal.view', 'utility'],
    function (require,exports,template,Modal,Utility) {
        var AddOrEditChargeView = Backbone.View.extend({
            initialize:function (options) {
                this.isEdit = options.isEdit;
                this.collection = options.collection;
                this.checkedList = options.checkedList;
                this.checkedListNotNull = options.checkedListNotNull;
                this.type = options.type;
                this.$el = $(_.template(template['tpl/chargeManage/chargeManage.selectCharge.html'])());
                this.collection.on("get.MergeChargeTagOtherNodeInfo.success",$.proxy(this.onNodeInfoSuccess, this));
                this.collection.on("get.MergeChargeTagOtherNodeInfo.error", $.proxy(this.onGetError, this));
                this.$el.find("#dropdown-merge").on("change",$.proxy(this.addNodeClick,this))
                this.unique();
                var mergeTagName,nodeNameList = [];
                _.each(this.checkedList,function (el) {
                    nodeNameList.push(el.get("chName"))
                })
                var nodeNameListHtml = [];
                for(var i=0;i<nodeNameList.length;i++){
                    var _html = '<div>'+nodeNameList[i]+'</div>';
                    nodeNameListHtml.push(_html);
                }
                mergeTagName = this.checkedList[0].get("mergeChargeTag");
                this.$el.find("#inputMergeTagName").val(mergeTagName);
                this.$el.find("#inputNodeName").html(nodeNameListHtml.join(""))
                this.collection.getAllMergeTagNames();
                if(this.isEdit) {
                    this.mergeList = options.mergeList
                    this.collection.off("get.MergeChargeTags.success");
                    this.collection.off("get.MergeChargeTags.error");
                    this.collection.on("get.MergeChargeTags.success",$.proxy(this.initDropDownMenu, this));
                    this.collection.on("get.MergeChargeTags.error", $.proxy(this.onGetError, this));
                    this.$el.find("#inputNodeName2").html(nodeNameListHtml.join(""))
                    this.$el.find("#add").hide();
                }else if(!this.isEdit){
                    this.collection.off("get.MergeChargeTags.success");
                    this.collection.off("get.MergeChargeTags.error");
                    this.$el.find("#modify").hide();
                }

            },
            unique:function(){
                for(var item in this.checkedList){
                    if(this.checkedList[item].attributes.mergeChargeTag){
                        this.checkedMergeName = this.checkedList[item].mergeChargeTag;
                    }
                }
                for(var i in this.checkedListNotNull){
                    this.checkedMergeNameNotNull = this.checkedListNotNull[i].attributes.mergeChargeTag;
                }

            },
            initDropDownMenu:function(res){
                var mergeNameList = res,
                    mergeNameobj = [{name:'无'}];
                _.each(mergeNameList,function (val) {
                    mergeNameobj.push({
                        name:val
                    })
                })
                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('#dropdown-merge').get(0),
                    panelID: this.$el.find('#dropdown-merge').get(0),
                    isSingle: true,
                    openSearch: true,
                    selectWidth: 200,
                    isDataVisible: false,
                    onOk: function() {},
                    data: mergeNameobj,
                    callback: function(data) {
                        this.$el.find('#dropdown-merge .cur-value').html(data.name);
                    }.bind(this)
                });
                if(this.checkedMergeName != null){
                    this.$el.find("#dropdown-merge .cur-value").html(this.checkedMergeName);
                }else if(this.checkedMergeNameNotNull != null){
                    this.$el.find("#dropdown-merge .cur-value").html(this.checkedMergeNameNotNull);
                }
                var mergeTagVal = this.$el.find("#dropdown-merge .cur-value").text().trim();
                if(mergeTagVal != ''){
                    this.collection.getMergeTagOtherNodeInfo(mergeTagVal);
                }
            },
            getAllList:function(){

                var nodeIds = [];
                _.each(this.checkedList,function (el) {
                    nodeIds.push(el.get('id'))
                })
                if(this.isEdit){
                    var obj = {
                        mergeChargeTag:this.$el.find("#dropdown-merge .cur-value").text(),
                        nodeIds:nodeIds.join(','),
                        operateAction:this.type
                    };
                    return obj;
                }else{
                    var val = this.$el.find("#inputMergeTagName").val();
                    re = /^[\u4E00-\u9FFFa-zA-Z][\w\u4E00-\u9FFF]{3,29}$/g
                    if(!re.test(val)){
                        Utility.warning("中英文开始、可包含数字下划线，长度在4-30字符之间");
                        return false;
                    }
                    var obj = {
                        mergeChargeTag:this.$el.find("#inputMergeTagName").val(),
                        nodeIds:nodeIds.join(','),
                        operateAction:this.type
                    };
                    return obj;
                }
            },
            alertTips:function(event){
                var eventTarget = event.srcElement || event.target,
                    val = $(eventTarget).val();
                re = /^[\u4E00-\u9FFFa-zA-Z][\w\u4E00-\u9FFF]{3,29}$/g
                if(!re.test(val)){
                    Utility.warning("中英文开始、可包含数字下划线，长度在4-30字符之间");
                    return false;
                }
            },
            onGetError: function(error) {
                if (error && error.message){
                    Utility.alerts(error.message)
                }
                else{
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
                }
            },
            render:function (target) {
                    this.$el.appendTo(target);
            },
            onNodeInfoSuccess:function (res) {
                var nodeInfoList = res,
                    nodeNameList = [];
                _.each(nodeInfoList,function (el) {
                    nodeNameList.push(el.chName)
                })
                var tipsHTML = [];
                for(var i=0;i<nodeNameList.length;i++){
                    var _html = '<div class="nodeNameMerge">'+nodeNameList[i]+'</div>';
                    tipsHTML.push(_html);
                }
                this.$el.find("#mergeNode").html(tipsHTML.join(" "));
            },
            addNodeClick:function () {
                var mergeTagVal = this.$el.find("#dropdown-merge .cur-value").text();
                this.collection.getMergeTagOtherNodeInfo(mergeTagVal);
            }
        });
        var ChargeManageView = Backbone.View.extend({
            events:{},
            initialize:function (options) {
                this.options = options;
                this.collection = options.collection;
                this.isInitPaginator = false;
                this.$el = $(_.template(template['tpl/chargeManage/chargeManage.html'])());

                this.initNodeDropMenu();

                //查询共享出口的相关信息
                this.collection.on("get.getAssociationNodeInfo.success", $.proxy(this.onGetNodeIdInfoSuccess, this));
                this.collection.on("get.getAssociationNodeInfo.error", $.proxy(this.onGetError, this));
                this.collection.on("get.node.success",$.proxy(this.onNodeListSuccess, this));
                this.collection.on("get.node.error", $.proxy(this.onGetError, this));
                this.collection.on("updateCharge.node.success", function() {
                    Utility.alerts("保存成功！", "success", 5000)
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on("updateCharge.node.error", function(error){
                    this.onGetError(error);
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on("addCharge.success", function() {
                    Utility.alerts("添加成功！", "success", 5000)
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on("addCharge.error", $.proxy(this.onGetError, this));
                this.enterKeyBindQuery();
                if (AUTH_OBJ.QueryNode) {
                    this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                    this.enterKeyBindQuery();
                } else {
                    this.$el.find(".opt-ctn .query").remove();
                }
                this.$el.find("#add").on("click",function () {
                    this.onClickAddButton("add");

                }.bind(this));
                this.$el.find("#modify").on("click",function () {
                    this.onClickModifyButton("modify")
                }.bind(this));
                this.queryArgs = {
                    "page": 1,
                    "count": 10,
                    "chname": null, //节点名称
                    "operator": null, //运营商id
                    "status": null, //节点状态
                    "appType": null, //节点类型
                    "provinceId": null, //省份名称
                    "areaId": null, //大区名称
                    "opType": null,
                    "tags":null,//共享出口的节点tag
                    "liveLevel": null,//直播层级，没有就null
                    "cacheLevel": null
                }
                this.tableColumn = [{
                    name: "运营商",
                    isChecked: true,
                    isMultiRows: true,
                    key: "operatorName"
                }, {
                    name: "开始计费时间",
                    isChecked: true,
                    key: "startChargingTimeFormated"
                    }, {
                    name: "省份",
                    isChecked: true,
                    key: "provName"
                    }, {
                    name:"计费组",
                    isChecked:true,
                    key:"mergeChargeTagName"
                },{
                    name:"交换机名称",
                    isChecked: true,
                    key:"sharePortTag"
                }, {
                    name:"成本权值",
                    isChecked: true,
                    isMultiRows: true,
                    key:"unitPrice"
                }, {
                    name:"免费带宽开始日期",
                    isChecked:true,
                    key:"freeStartTimeFormated"
                }, {
                    name:"免费带宽结束日期",
                    isChecked:true,
                    key:"freeEndTimeFormated"
                }];
                this.collection.getNodeList(this.queryArgs);
                this.collection.getAllMergeTagNames();
            },
            initNodeDropMenu:function(){
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
                    this.queryArgs.count = value;
                    this.queryArgs.page = 1;
                    this.onClickQueryButton();
                }.bind(this));
            },
            render: function(target) {
                this.$el.appendTo(target)
            },
            hide: function() {
                this.$el.hide();
            },
            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            },
            onNodeListSuccess:function (res) {
                this.initTable();
                if(!this.isInitPaginator) this.initPaginator();
            },
            //获取共享出口的节点相关信息
            onGetNodeIdInfoSuccess:function(res){
                this.mergeArgs = res;
            },
            initTable:function () {
                this.table = $(_.template(template['tpl/chargeManage/chargeManage.table.html'])({
                    data: this.collection.models,
                    titleList: this.tableColumn,
                    permission: AUTH_OBJ
                }));
                if(this.collection.models.length !== 0){
                    this.$el.find(".table-ctn").html(this.table[0]);
                } else{
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
                }
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .node-name").on("click", $.proxy(this.onClickItemNodeName, this));
                this.table.find("tbody tr").find(".checkedBox").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
                this.table.find("tbody .hoverTag").on("mouseover",$.proxy(this.onHoverNodeString,this))
                this.table.find("[data-toggle='popover1']").popover({
                    html:true
                });
                var sharePortTagList = [];
                _.each(this.collection.models,function (model) {
                    if(model.get("sharePortTag")) {
                        sharePortTagList.push(model.get("sharePortTag"));
                    }
                });
                this.collection.getAssociationNodeByTags(sharePortTagList);
            },
            onHoverNodeString:function(event){
                var eventTarget = event.srcElement || event.target;
                var content = $(eventTarget).attr("data-content");
                if(content){return false;}
                var id = $(eventTarget).attr("data-key");
                var valueList = this.mergeArgs[id];
                var tipsHTML = ["<h4><b>当前机房出口所有关联的节点</b></h4>"];
                for (var i = 0; i < valueList.length; i++) {
                    var _html = '<div>' + valueList[i] + '</div>';
                    tipsHTML.push(_html);
                }
                $(eventTarget).attr('data-content', tipsHTML.join(''))
            },
            initPaginator:function () {
                this.$el.find(".total-items span").html(this.collection.total)
                if (this.collection.total <= this.queryArgs.count) return;
                var total = Math.ceil(this.collection.total / this.queryArgs.count);
                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: 1,
                    onPageChange: function(num, type) {
                        if (type !== "init") {
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
            onClickItemEdit:function (event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if(eventTarget.tagName == 'INPUT'){
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                }else{
                    id = eventTarget.attr("id");
                }
                var model = this.collection.get(id);
                this.hideList();
                if (this.editNodeView) {
                    this.editNodeView.destroy();
                    this.editNodeView = null;
                }
                require(["nodeManage.edit.view"],function (AddOrEditNodeView) {
                    this.editNodeView = new AddOrEditNodeView({
                        collection: this.collection,
                        model: model,
                        isChargeEdit:true,
                        operatorList: this.operatorList,
                        showList: function() {
                            //show当前列表
                            this.showList();
                        }.bind(this),
                        onHiddenCallback: function() {
                            this.showList();
                            if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                        }.bind(this),
                        onOKCallback: function() {
                            var options = this.editNodeView.getArgs();
                            if (!options) return;

                            var args = _.extend(model.attributes, options)
                            this.collection.updateNode(args);
                            this.showList();
                            if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                        }.bind(this)
                    });
                    this.editNodeView.render(this.$el.find(".charge-manage-add-edit-pannel"));
                }.bind(this))
            },
            onClickItemNodeName:function(event){
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id"),
                    model = this.collection.get(id);
                this.hideList();
                if (this.editNodeView) {
                    this.editNodeView.destroy();
                    this.editNodeView = null;
                }
                require(["nodeManage.edit.view"],function (AddOrEditNodeView) {
                    this.editNodeView = new AddOrEditNodeView({
                        collection: this.collection,
                        model: model,
                        isChargeEdit:true,
                        operatorList: this.operatorList,
                        showList: function() {
                            //show当前列表
                            this.showList();
                        }.bind(this),
                        onHiddenCallback: function() {
                            this.showList();
                            if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                        }.bind(this),
                        onOKCallback: function() {
                            var options = this.editNodeView.getArgs();
                            if (!options) return;

                            var args = _.extend(model.attributes, options)
                            this.collection.updateNode(args);
                            this.showList();
                            if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                        }.bind(this)
                    });
                    this.editNodeView.render(this.$el.find(".charge-manage-add-edit-pannel"));
                }.bind(this))
            },
            onClickQueryButton: function() {
                this.isInitPaginator = false;
                this.queryArgs.page = 1;
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.$el.find(".pagination").html("");
                this.queryArgs.chname = this.$el.find("#input-name").val().trim() || null;
                this.queryArgs.mergeChargeTag  = this.$el.find("#input-id").val().trim() || null;
                this.collection.getNodeList(this.queryArgs);
            },
            enterKeyBindQuery: function() {
                $(document).on('keydown', function(e) {
                    if (e.keyCode == 13) {
                        e.stopPropagation();
                        e.preventDefault();
                        this.onClickQueryButton();
                    }
                }.bind(this));
            },
            hideList:function () {
                this.$el.find(".charge-node-manage-list-pannel").hide();
            },
            showList:function () {
                this.$el.find(".charge-node-manage-list-pannel").show();
            },
            onClickAddButton:function (t) {
                var checkedList = this.collection.filter(function(model) {
                    return model.get("isChecked") === true;
                });
                var checkedListNotNull = this.collection.filter(function(model) {
                    return model.get("isChecked") === true && model.get("mergeChargeTag")!=null;
                });
                if(checkedList.length == 0){
                    //弹窗
                    Utility.warning("请选择节点");
                    return false;
                }
                if(checkedListNotNull.length>0) {
                    var isCommon = true;
                    var firstChecked = checkedListNotNull[0].get("mergeChargeTag");
                    for (var i = 0; i < checkedListNotNull.length; i++) {
                        if(checkedListNotNull[i].get("mergeChargeTag")!=firstChecked){
                            isCommon = false;
                            break;
                        }
                    }
                    if(!isCommon){
                        Utility.warning("所选的节点的计费组名称不相同，不能新增计费组");
                        return false;
                    }
                }

                if (this.selectChargeViewPopup) $("#" + this.selectChargeViewPopup.modalId).remove();
                this.selectChargeView = new AddOrEditChargeView({
                    collection:this.collection,
                    checkedList: checkedList,
                    checkedListNotNull:checkedListNotNull,
                    type:t,
                    isEdit:false,
                });
                var options = {
                    title: "新增计费组",
                    add:true,
                    body: this.selectChargeView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var result = this.selectChargeView.getAllList();
                        this.collection.addMergeTags(result);
                        this.selectChargeViewPopup.$el.modal("hide");
                        this.enterKeyBindQuery();
                    }.bind(this),
                    onHiddenCallback: function() {
                        this.enterKeyBindQuery();
                    }.bind(this)
                }
                this.selectChargeViewPopup = new Modal(options);
            },
            onClickModifyButton:function(t){
                var checkedList = this.collection.filter(function(model) {
                    return model.get("isChecked") === true;
                });
                var checkedListNotNull = this.collection.filter(function(model) {
                    return model.get("isChecked") === true && model.get("mergeChargeTag")!=null;
                });
                if(checkedList.length == 0){
                    //弹窗
                    Utility.warning("请选择节点");
                    return false;
                }
                if(checkedListNotNull.length>0) {
                    var isCommon = true;
                    var firstChecked = checkedListNotNull[0].get("mergeChargeTag");
                    for (var i = 0; i < checkedListNotNull.length; i++) {
                        if(checkedListNotNull[i].get("mergeChargeTag")!=firstChecked){
                            isCommon = false;
                            break;
                        }
                    }
                    if(!isCommon){
                        Utility.warning("所选的节点的计费组名称不相同，不能新增计费组");
                        return false;
                    }
                }
                if (this.selectChargeViewPopup) $("#" + this.selectChargeViewPopup.modalId).remove();
                this.selectChargeView = new AddOrEditChargeView({
                    collection:this.collection,
                    checkedList: checkedList,
                    checkedListNotNull:checkedListNotNull,
                    type:t,
                    isEdit:true
                });
                var options = {
                    title: "配置计费组",
                    modify:true,
                    body: this.selectChargeView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var result = this.selectChargeView.getAllList();
                        this.collection.addMergeTags(result);
                        this.selectChargeViewPopup.$el.modal("hide");
                        this.enterKeyBindQuery();
                    }.bind(this),
                    onHiddenCallback: function() {
                        this.enterKeyBindQuery();
                    }.bind(this)
                }
                this.selectChargeViewPopup = new Modal(options);

            },
            onItemCheckedUpdated:function (event) {
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
            onAllCheckedUpdated:function (event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                this.collection.each(function(model) {
                    model.set("isChecked", eventTarget.checked);
                }.bind(this))
                this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
            },
            alertTips:function (event) {
                var eventTarget = event.srcElement || event.target,
                    val = $(eventTarget).val();
                    re = /^[a-zA-Z\W][0-9a-zA-Z_]{4,30}/
                if(!re.test(val)){
                    Utility.warning("中英文开始、数字，长度在4-30字符之间");
                    return false;
                }
            },
        })
        return ChargeManageView;
})