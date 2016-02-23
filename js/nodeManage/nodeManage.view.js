define("nodeManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditNodeView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit     = options.isEdit;
            this.model      = options.model;

            if (this.isEdit){
                this.args = {
                    "id"                 : this.model.get("id"),
                    "name"               : this.model.get("name"),
                    "chName"             : this.model.get("chName"),
                    "operator"           : this.model.get("operator"),
                    "chargingType"       : this.model.get("chargingType"),
                    "minBandwidth"       : this.model.get("minBandwidth"),
                    "maxBandwidth"       : this.model.get("maxBandwidth"),
                    "maxBandwidthThreshold" : this.model.get("maxBandwidthThreshold"),
                    "minBandwidthThreshold" : this.model.get("minBandwidthThreshold"),
                    "unitPrice"          : this.model.get("unitPrice"),
                    "inZabName"          : this.model.get("inZabName"),
                    "outZabName"         : this.model.get("outZabName"),
                    "remark"             : this.model.get("remark"),
                    "operatorId"         : this.model.get("operatorId"),
                    "operatorName"       : this.model.get("operatorName"),
                    "startChargingTime"  : this.model.get("startChargingTime")
                }
            } else {
                this.args = {
                    "id"                 : 0,
                    "name"               : "",
                    "chName"             : "",
                    "operator"           : "",
                    "chargingType"       : 1 ,
                    "minBandwidth"       : "",
                    "maxBandwidth"       : "",
                    "maxBandwidthThreshold" : "",
                    "minBandwidthThreshold" : "",
                    "unitPrice"          : "",
                    "inZabName"          : "",
                    "outZabName"         : "",
                    "remark"             : "",
                    "operatorId"         : "",
                    "operatorName"       : "",
                    "startChargingTime"  : new Date().valueOf()
                }
            }

            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.add&edit.html'])({data: this.args}));

            this.initDropList(options.list);
            this.initChargeDatePicker();
        },

        getArgs: function(){
            var args = {
                "id"                 : this.model ? this.model.get("id") : 0,
                "name"               : this.$el.find("#input-english").val(),
                "chName"             : this.$el.find("#input-name").val(),
                "operatorId"         : this.operatorId,
                "operatorName"       : this.operatorName,
                "minBandwidth"       : this.$el.find("#input-minbandwidth").val(),
                "maxBandwidth"       : this.$el.find("#input-maxbandwidth").val(),
                "maxBandwidthThreshold" : this.$el.find("#input-threshold").val(),
                "minBandwidthThreshold" : this.$el.find("#input-minthreshold").val(),
                "unitPrice"          : this.$el.find("#input-unitprice").val(),
                "inZabName"          : this.$el.find("#input-inzabname").val(),
                "outZabName"         : this.$el.find("#input-outzabname").val(),
                "remark"             : this.$el.find("#textarea-comment").val(),
                "startChargingTime"  : this.args.startChargingTime,
                "chargingType"       : this.args.chargingType
            }
            return args;
        },

        onGetOperatorSuccess: function(res){
            var nameList = [];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), nameList, function(value){
                this.operatorId = value;
            }.bind(this));
            if (this.isEdit){
                var defaultValue = _.find(nameList, function(object){
                    return object.value === this.model.attributes.operatorId
                }.bind(this));

                this.$el.find(".dropdown-operator .cur-value").html(defaultValue.name)
                this.operatorId = defaultValue.value;
                this.operatorName = defaultValue.name;
            } else {
                this.$el.find(".dropdown-operator .cur-value").html(nameList[0].name);
                this.operatorId = nameList[0].value;
                this.operatorName = nameList[0].name;
            }
        },

        initDropList: function(list){
            var nameList = [
                {name: "95峰值", value: 1}
                // {name: "免费", value: 0}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-charging"), nameList, function(value){
                this.args.chargingType = parseInt(value);
            }.bind(this));

            if (this.isEdit){
                var defaultValue = _.find(nameList, function(object){
                    return object.value === this.model.attributes.chargingType
                }.bind(this));
                this.$el.find(".dropdown-charging .cur-value").html(defaultValue.name)
            }

            this.onGetOperatorSuccess(list)
        },

        initChargeDatePicker: function(){
            var startVal = null, endVal = null;
            if (this.args.startChargingTime)
                startVal = new Date(this.args.startChargingTime).format("yyyy/MM/dd");
            var startOption = {
                lang:'ch',
                timepicker: false,
                scrollInput: false,
                format:'Y/m/d', 
                value: startVal, 
                onChangeDateTime: function(){
                    this.args.startChargingTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#input-start").datetimepicker(startOption);
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


    var NodeManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.html'])());
            this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");
            this.initNodeDropMenu();

            this.collection.on("get.node.success", $.proxy(this.onNodeListSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            this.collection.on("add.node.success", function(){
                alert("添加成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.node.error", $.proxy(this.onGetError, this));
            this.collection.on("update.node.success", function(){
                alert("编辑成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.node.error", $.proxy(this.onGetError, this));
            this.collection.on("delete.node.success", function(){
                alert("删除成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("delete.node.error", $.proxy(this.onGetError, this));
            this.collection.on("update.node.status.success", function(){
                alert("操作成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.node.status.error", $.proxy(this.onGetError, this));
            this.collection.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .multi-play").on("click", $.proxy(this.onClickMultiPlay, this));

            this.queryArgs = {
                "page"    : 1,
                "count"   : 10,
                "chname"  : null,//节点名称
                "operator": null,//运营商id
                "status"  : null//节点状态
            }
            this.onClickQueryButton();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onNodeListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.chname = this.$el.find("#input-name").val() || null;
            this.collection.getNodeList(this.queryArgs);
        },

        onClickCreate: function(){
            if (this.addNodePopup) $("#" + this.addNodePopup.modalId).remove();

            var addNodeView = new AddOrEditNodeView({
                collection: this.collection,
                list      : this.operatorList
            });
            var options = {
                title:"添加节点",
                body : addNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = addNodeView.getArgs();
                    if (!options) return;
                    this.collection.addNode(options)
                    this.addNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.addNodePopup = new Modal(options);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/nodeManage/nodeManage.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .node-name").on("click", $.proxy(this.onClickItemNodeName, this));
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
            this.table.find("tbody .hangup").on("click", $.proxy(this.onClickItemHangup, this));
            this.table.find("tbody .stop").on("click", $.proxy(this.onClickItemStop, this));

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
        },

        onClickItemNodeName: function(event){
            var eventTarget = event.srcElement || event.target, 
                id = $(eventTarget).attr("id"),
                model = this.collection.get(id),
                args = {
                    nodeId: id,
                    chName: model.get("chName")
                }
            window.location.hash = "#/deviceManage/" + JSON.stringify(args)
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

            if (this.editNodePopup) $("#" + this.editNodePopup.modalId).remove();

            var editNodeView = new AddOrEditNodeView({
                collection: this.collection, 
                model     : model,
                isEdit    : true,
                list      : this.operatorList
            });
            var options = {
                title:"编辑设备",
                body : editNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = editNodeView.getArgs();
                    if (!options) return;
                    var args = _.extend(model.attributes, options)
                    this.collection.updateNode(args)
                    this.editNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.editNodePopup = new Modal(options);
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
            var result = confirm("你确定要删除节点" + model.attributes.name + "吗");
            if (!result) return;
            this.collection.deleteNode({id:parseInt(id)})
        },

        onClickItemPlay: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            this.collection.updateNodeStatus({ids:[parseInt(id)], status:1})
        },

        onClickMultiPlay: function(event){
            
        },

        onClickItemHangup: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var result = confirm("你确定要挂起节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({ids:[parseInt(id)], status:2})
        },

        onClickItemStop: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var result = confirm("你确定要关闭节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({ids:[parseInt(id)], status:3})
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

        initNodeDropMenu: function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name: "运行中", value: 1},
                {name: "挂起", value: 2},
                {name: "已关闭", value: 3}
            ],
            rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                if (value !== "All")
                    this.queryArgs.status = parseInt(value);
                else
                    this.queryArgs.status = null;
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

            this.collection.getOperatorList();
        },

        onGetOperatorSuccess: function(res){
            this.operatorList = res
            var nameList = [{name: "全部", value: "All"}];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), nameList, function(value){
                if (value !== "All")
                    this.queryArgs.operator = parseInt(value)
                else
                    this.queryArgs.operator = null;
            }.bind(this));
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
            if (checkedList.length === 0) {
                this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");
            } else {
                this.$el.find(".opt-ctn .multi-delete").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").removeAttr("disabled", "disabled");
            }
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
            if (eventTarget.checked){
                this.$el.find(".opt-ctn .multi-delete").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            }
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return NodeManageView;
});