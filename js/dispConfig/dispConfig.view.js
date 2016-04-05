define("dispConfig.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SelectNodeView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.regionId = options.regionId;
            this.groupId  = options.groupId;
            this.isEdit   = options.isEdit
            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.html'])({}));
            this.$el.find(".node-list").html(_.template(template['tpl/loading.html'])({}));
            this.nodeList = [];

            this.collection.on("get.regionNode.success", $.proxy(this.onGetNodeListSuccess, this));
            this.collection.on("get.regionNode.error", $.proxy(this.onGetError, this));
            this.collection.on("get.regionOtherNode.success", $.proxy(this.onGetOtherNodeSuccess, this));
            this.collection.on("get.regionOtherNode.error", $.proxy(this.onGetError, this));

            this.$el.find(".more").on("click", $.proxy(this.onClickMoreButton, this));

            this.args = {
                regionId: this.regionId,
                groupId : this.isEdit ? this.model.get("dispGroup.id") : this.groupId
            }

            this.collection.getRegionNodeList(this.args);
        },

        onClickMoreButton: function(){
            this.$el.find(".more").hide();
            this.$el.find(".node-list").html(_.template(template['tpl/loading.html'])());
            this.collection.getRegionOtherNodeList(this.args)
        },

        onGetOtherNodeSuccess: function(res){
            _.each(res.rows, function(element, index, list){
                var temp = {};
                _.each(element, function(el, key, ls){
                    _.each(el, function(el1, key1, ls1){
                        temp[key + "." + key1] = el1
                    }.bind(this))
                }.bind(this))
                this.nodeList.push(temp);
            }.bind(this))

            if (this.nodeList.length === 0){
                this.$el.find(".node-list").html(_.template(template['tpl/empty.html'])());
                return;
            }

            this.initList();
        },

        onGetNodeListSuccess: function(res){
            if (res.rows.length === 0){
                this.$el.find(".node-list").html(_.template(template['tpl/empty.html'])());
                return;
            }
            _.each(res.rows, function(element, index, list){
                var temp = {};
                _.each(element, function(el, key, ls){
                    _.each(el, function(el1, key1, ls1){
                        temp[key + "." + key1] = el1
                    }.bind(this))
                }.bind(this))
                this.nodeList.push(temp);
            }.bind(this))

            this.nodeList[this.nodeList.length - 1].line = true
                
            this.initList();
        },

        initList: function(){
            if (this.isEdit){
                this.list = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.list.html'])({
                    data: this.nodeList, 
                    nodeId: this.model.get("node.id")
                }));
            } else {
                this.list = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.checklist.html'])({
                    data: this.nodeList, 
                    nodeId: this.model.get("node.id")
                }));
            }
            this.$el.find(".node-list").html(this.list[0]);
        },

        getArgs: function(){
            var checkedNodes = this.$el.find(".node-list input:checked"), checkedNodeIds = [];
            if (checkedNodes.length === 0) {
                alert("至少选择一个再点确定！")
                return false;
            }
            for (var i = 0; i < checkedNodes.length; i++){
                var tempId = parseInt($(checkedNodes[i]).attr("id"));
                checkedNodeIds.push(tempId)
            }
            var selectedNodes = [];
            for (var k = 0; k < checkedNodeIds.length; k++){
                var aSelectedNodeArray = _.filter(this.nodeList ,function(obj) {
                    return obj["node.id"] === checkedNodeIds[k];
                })
                var aSelectedNode = aSelectedNodeArray[0];
                var nodeChName       = aSelectedNode["node.chName"],
                    nodeMinBandwidth = aSelectedNode["node.minBandwidth"],
                    nodeMaxBandwidth = aSelectedNode["node.maxBandwidth"],
                    crossLevel       = aSelectedNode["cover.crossLevel"];
                var nodeString = nodeChName + "(" + nodeMinBandwidth + "/" + nodeMaxBandwidth + ")L" + crossLevel;
                aSelectedNode.nodeString = nodeString;
                aSelectedNode.id = aSelectedNode["node.id"];
                selectedNodes.push(aSelectedNode)
            }
            return selectedNodes
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });
    
    var DispConfigView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.dispGroupCollection = options.dispGroupCollection;

            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.html'])());

            this.collection.on("get.dispGroup.success", $.proxy(this.onDispGroupListSuccess, this));
            this.collection.on("get.dispGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("get.dispConfig.success", $.proxy(this.onDispConfigListSuccess, this));
            this.collection.on("get.dispConfig.error", function(res){
                //this.disablePopup.$el.modal('hide');
                this.onGetError(res)
            }.bind(this));

            this.collection.on("init.dispConfig.success", $.proxy(this.onDispConfigListSuccess, this));
            this.collection.on("init.dispConfig.error", function(error){
                //this.disablePopup.$el.modal('hide');
                this.onGetError(error)
                this.$el.find(".opt-ctn .init").show();
            }.bind(this));
            this.collection.on("get.regionAdvice.error", $.proxy(this.onGetError, this));

            this.collection.on("dispDns.success", function(){
                this.disablePopup.$el.modal('hide');
                alert("下发成功！")
            }.bind(this));
            this.collection.on("dispDns.error", function(res){
                this.disablePopup.$el.modal('hide');
                this.onGetError(res)
            }.bind(this));

            this.initDispConfigDropMenu();

            this.$el.find(".opt-ctn .sending").on("click", $.proxy(this.onClickSending, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .init").on("click", $.proxy(this.onClickInitButton, this));
            this.$el.find(".opt-ctn .show-remark").on("click", $.proxy(this.onClickShowRemark, this));
            this.$el.find(".opt-ctn .hide-remark").on("click", $.proxy(this.onClickHideRemark, this));
            
            this.$el.find(".page-ctn").hide();  
        },

        onClickShowRemark: function(){
            this.$el.find(".hide-remark").show();
            this.$el.find(".show-remark").hide();
            this.$el.find(".content-ctn").slideDown(200);
        },

        onClickHideRemark: function(){
            this.$el.find(".hide-remark").hide();
            this.$el.find(".show-remark").show();
            this.$el.find(".content-ctn").slideUp(200);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onDispConfigListSuccess: function(){
            //this.disablePopup.$el.modal('hide');
            this.$el.find(".opt-ctn .sending").show();
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickInitButton: function(){
            this.$el.find(".opt-ctn .init").hide();
            this.isInitPaginator = true;
            var args = _.extend({}, this.queryArgs);
            delete args.page;
            delete args.count;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.initDispConfigList(args);
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getDispConfigList(this.queryArgs);

            //this.showDisablePopup("数据加载中，请耐心等待!");
        },

        onClickSending: function(){
            var result = confirm("你确定要下发DNSPod吗？");
            if (!result) return
            var tempArray = [];

            _.each(this.collection.models, function(el, index, list){
                _.each(el.get("listFormated"), function(el1, index1, list1){
                    var tempObj =  {
                      "dgroupId" : el1.get("dispGroup.id") || this.queryArgs.groupId,
                      "nodeId"   : el1.get("node.id"),
                      "regionId" : el.get("region.id"),
                      "ttl"      : el.get("dispGroup.ttl"),
                      "ipNum"    : el1.get("dispConfIpInfo.currNum"),
                    };
                    tempArray.push(tempObj)
                }.bind(this))
            }.bind(this))
            var args = {
                groupId : this.queryArgs.groupId,
                list    : tempArray
            }
            this.collection.dispDns(args)

            this.showDisablePopup("下发中，请耐心等待...")
        },

        showDisablePopup: function(msg) {
            if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
            var options = {
                title    : "警告",
                body     : '<div class="alert alert-danger"><strong>' + msg +'</strong></div>',
                backdrop : 'static',
                type     : 0,
            }
            this.disablePopup = new Modal(options);
            this.disablePopup.$el.find(".close").remove();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/dispConfig/dispConfig.table.html'])({data: this.collection.models}));

            if (this.collection.models.length === 0){
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
                this.$el.find(".opt-ctn .init").show();
                this.$el.find(".opt-ctn .sending").hide();
            } else if (this.collection.total === 0){
                this.$el.find(".table-ctn").html(this.table[0]);
                this.$el.find(".opt-ctn .init").show();
                this.$el.find(".opt-ctn .sending").hide();
            } else {
                this.$el.find(".table-ctn").html(this.table[0]);
                this.$el.find(".opt-ctn .init").hide();
                this.$el.find(".opt-ctn .sending").show(); 
            }

            this.nodesEl = this.table.find("tbody .nodes .edit")
            this.nodesEl.on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .nodes .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.table.find("tbody .nodes .weight").on("keyup", $.proxy(this.onKeyupItemWeightInput, this));
            this.table.find("tbody .nodes .weight").on("blur", $.proxy(this.onBlurItemWeightInput, this));
            this.table.find("tbody .add").on("click", $.proxy(this.onClickItemAdd, this));
            this.table.find("tbody .adjust").on("click", $.proxy(this.onClickItemAdjust, this));
        },

        onKeyupItemWeightInput: function(event){
            var eventTarget = event.srcElement || event.target,
                value = $(eventTarget).val(),
                maxValue = $(eventTarget).attr("max"),
                re = /^\d+$/;
            if (!re.test(value)){
                $(eventTarget).val("0");
                return
            }
            if (parseInt(value) > parseInt(maxValue)){
                $(eventTarget).val("0")
            }
        },

        onBlurItemWeightInput: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId, value;
            value    = $(eventTarget).val();
            id       = $(eventTarget).attr("id");
            regionId = $(eventTarget).attr("region-id");
            var model = this.collection.get(regionId),
                list = model.get("listFormated");
            var selectedNode = _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })
            selectedNode[0].set("dispConfIpInfo.currNum", parseInt(value))
        },

        onClickItemAdjust: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            $(eventTarget).html('<span class="glyphicon glyphicon-cog"></span>载入中');
            var args = {
                groupId : this.queryArgs.groupId,
                regionId: id,
                success : function(data){
                    $(eventTarget).html('<span class="glyphicon glyphicon-cog"></span>调整')
                    $(eventTarget).off("click");
                    $(eventTarget).popover({
                        animation  : false,
                        "placement": "top", 
                        "html"     : true,
                        "content"  : data.message || data, 
                        "trigger"  : "hover"
                    })

                    $(eventTarget).popover('toggle')
                }.bind(this)
            }

            this.collection.getRegionAdvice(args);
        },

        onClickItemAdd: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), list = model.get("listFormated");

            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

            var selectNodeView = new SelectNodeView({
                collection: this.collection, 
                model     : model,
                groupId   : this.queryArgs.groupId,
                regionId  : id,
                isEdit    : false
            });

            var options = {
                title:"选择节点",
                body : selectNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = selectNodeView.getArgs();
                    if (!options) return;
                    for (var k = 0; k < options.length; k++){
                        options[k]['dispGroup.id'] = this.queryArgs.groupId;
                        for (var i = 0; i < list.length; i++){
                            if (list[i]["id"] === parseInt(options[k]["node.id"])) options.splice(k, 1);
                        }
                    }
                    if (options.length === 0) {
                        alert("你选择的节点已经添加过了！")
                        this.selectNodePopup.$el.modal("hide");
                        return;
                    }
                    for(var m = 0; m < options.length; m++){
                        model.get("listFormated").push(new this.collection.model(options[m]))
                    }
                    this.collection.trigger("get.dispConfig.success")
                    this.selectNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.selectNodePopup = new Modal(options);

        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id       = eventTarget.attr("id");
                regionId = eventTarget.attr("region-id");
            } else {
                id       = $(eventTarget).attr("id");
                regionId = $(eventTarget).attr("region-id");
            }
            var model = this.collection.get(regionId),
                list = model.get("listFormated");
            var selectedNode = _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })

            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

            var selectNodeView = new SelectNodeView({
                collection: this.collection, 
                model     : selectedNode[0],
                regionId  : regionId,
                isEdit    : true
            });

            var options = {
                title:"选择节点",
                body : selectNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = selectNodeView.getArgs();
                    if (!options) return;
                    var result = confirm("你确定要修改节点吗？")
                    if (!result) return;
                    for (var i = 0; i < list.length; i++){
                        if (list[i]["id"] === parseInt(options[0]["node.id"])){
                            this.selectNodePopup.$el.modal("hide");
                            return;
                        }
                        if (list[i]["id"] === parseInt(id)){
                            list[i].attributes =  _.extend(selectedNode[0].attributes, options[0]);
                            list[i].set("isUpdated", true);
                            break;
                        }
                    }
                    model.set("listFormated", list);
                    this.collection.trigger("get.dispConfig.success")
                    this.selectNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.selectNodePopup = new Modal(options);
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id       = eventTarget.attr("id");
                regionId = eventTarget.attr("region-id");
            } else {
                id       = $(eventTarget).attr("id");
                regionId = $(eventTarget).attr("region-id");
            }
            var model = this.collection.get(regionId),
                list = model.get("listFormated");
            var selectedNode = _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })

            var result = confirm("你确定要删除节点 " + selectedNode[0].get("node.chName") + " 吗？")
            if (!result) return;
            _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })
            for (var i = 0; i < list.length; i++){
                if (list[i]["id"] === parseInt(id)){
                    list.splice(i, 1);
                    break;
                }
            }
            this.collection.get(regionId).set("listFormated", list);
            this.collection.trigger("get.dispConfig.success")
        },

        onItemCheckedUpdated: function(event){
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

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
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

        initDispConfigDropMenu: function(){
            var regionArray = [
                {name: "全部", value: "All"},
                {name: "电信", value: "电信"},
                {name: "联通", value: "联通"},
                {name: "移动", value: "移动"}
            ],
            rootNode = this.$el.find(".dropdown-region");
            Utility.initDropMenu(rootNode, regionArray, function(value){
                this.queryArgs.regionName = value;
                if (value == "All")
                    delete this.queryArgs.regionName
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

            this.collection.getDispGroupList();
        },

        onDispGroupListSuccess: function(res){
            var temp = [];
            _.each(res.rows, function(el, index, list){
                if (el.status === 1)
                    temp.push({name: el.dispDomain, value: el.id, remark: el.remark})
            }.bind(this))

            if (temp.length === 0){
                this.$el.find(".opt-ctn").html(_.template(template['tpl/empty.html'])());
                this.$el.find(".table-ctn").parent().hide();
                return;
            }

            rootNode = this.$el.find(".dropdown-disp");
            Utility.initDropMenu(rootNode, temp, function(value){
                this.queryArgs.groupId = parseInt(value);
                var curGroup = _.find(temp, function(obj){
                    return obj.value === parseInt(value)
                }.bind(this))
                this.$el.find(".content-ctn #textarea-comment").html(curGroup.remark || "无");
                this.$el.find(".content-ctn .channel-table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.dispGroupCollection.getChannelList({groupId: this.queryArgs.groupId});
                this.onClickQueryButton();
            }.bind(this));

            this.$el.find(".dropdown-disp .cur-value").html(temp[0].name)
            this.queryArgs = {
                page : 1,
                count: 999999,
                groupId: temp[0].value
            }
            this.onClickQueryButton();
            this.$el.find(".content-ctn #textarea-comment").html(temp[0].remark || "无");
            this.$el.find(".content-ctn .channel-table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.dispGroupCollection.on("get.channel.success", $.proxy(this.onGetChannelSuccess, this));
            this.dispGroupCollection.on("get.channel.error", $.proxy(this.onGetError, this));
            this.dispGroupCollection.getChannelList({groupId: temp[0].value});
        },

        onGetChannelSuccess: function(res){
            this.channelList = _.filter(res, function(obj){
                return obj.associated === 1;
            }.bind(this));
            _.each(this.channelList, function(el, index, list){
                if (el.status === 0) el.statusName = '<span class="text-danger">已停止</span>';
                if (el.status === 1) el.statusName = '<span class="text-success">服务中</span>';
            }.bind(this))
            this.channelTable = $(_.template(template['tpl/dispGroup/dispGroup.channel.table.html'])({
                data: this.channelList, 
                isCheckedAll: false, 
                type: 1//不显示checkbox
            }));
            if (this.channelList.length !== 0)
                this.$el.find(".content-ctn .channel-table-ctn").html(this.channelTable[0]);
            else
                this.$el.find(".content-ctn .channel-table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        remove: function(){
            if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();
            this.disablePopup = null;
            this.selectNodePopup = null;
            this.collection.off();
            this.$el.remove();
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
            this.collection.getDispGroupList();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DispConfigView;
});