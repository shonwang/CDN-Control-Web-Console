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

            this.collection.off("get.city.success");
            this.collection.off("get.city.error");
            this.collection.on("get.city.success", $.proxy(this.onGetAllCity, this));
            this.collection.on("get.city.error", $.proxy(this.onGetError, this));

            this.collection.off("get.location.success");
            this.collection.off("get.location.error");
            this.collection.on("get.location.success", $.proxy(this.onGetLocation, this));
            this.collection.on("get.location.error", $.proxy(this.onGetLocation, this));

            this.initDropList(options.list);
            this.initChargeDatePicker();
        },

        getArgs: function(){
            var enName = this.$el.find("#input-english").val(),
                chName = this.$el.find("#input-name").val(),
                maxBandwidthThreshold = this.$el.find("#input-threshold").val(),
                minBandwidthThreshold = this.$el.find("#input-minthreshold").val(),
                maxBandwidth = this.$el.find("#input-maxbandwidth").val(),
                minBandwidth = this.$el.find("#input-minbandwidth").val(),
                unitPrice = this.$el.find("#input-unitprice").val(),
                longitudeLatitude = this.$el.find('#input-longitude-latitude').val(),
                re = /^\d+$/,
                reLocation = /^\d+(\.\d+)?----\d+(\.\d+)?$/;
            // if (!reLocation.test(longitudeLatitude)){
            //     alert("您需要填写正确的经纬度，否则该节点无法在地图中展示！");
            //     return
            // }
            if (!enName || !chName){
                alert("节点名称和英文名称都要填写！");
                return;
            }
            if (!re.test(maxBandwidth) || !re.test(minBandwidth)){
                alert("上联带宽和保底带宽只能填入数字！");
                return;
            }
            if (parseInt(maxBandwidth) > 100000000 || parseInt(maxBandwidth) < 0){
                alert("上联带宽：0-100000000（0-100T，单位转换按1000算）");
                return; 
            }
            if (parseInt(minBandwidth) > 100000000 || parseInt(minBandwidth) < 0){
                alert("保底带宽：0-100000000（0-100T，单位转换按1000算）");
                return; 
            }
            if (parseInt(maxBandwidth) < parseInt(minBandwidth)){
                alert("上联带宽不能小于保底带宽！");
                return;
            }
            if (!re.test(maxBandwidthThreshold) || !re.test(minBandwidthThreshold)){
                alert("上联带宽阈值和保底带宽阈值只能填入数字！");
                return;
            }
            if (parseInt(maxBandwidthThreshold) < 0 || parseInt(maxBandwidthThreshold) > parseInt(maxBandwidth)){
                alert("上联带宽阈值：0-上联带宽");
                return;
            }
            if (parseInt(minBandwidthThreshold) < 0 || parseInt(minBandwidthThreshold) > parseInt(maxBandwidth)){
                alert("保底带宽阈值：0-上联带宽");
                return;
            }
            if (!re.test(unitPrice)){
                alert("成本权值只能填入数字！");
                return;
            }
            if (parseInt(unitPrice) > 1000000 || parseInt(unitPrice) < 0){
                alert("成本权值：0-1000000");
                return; 
            }
            var args = {
                "id"                 : this.model ? this.model.get("id") : 0,
                "name"               : this.$el.find("#input-english").val().replace(/\s+/g, ""),
                "chName"             : this.$el.find("#input-name").val().replace(/\s+/g, ""),
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

            this.onGetOperatorSuccess(list);
            this.collection.getAllCity();
        },

        onGetAllCity: function(res){
            var cityArray = [];
            res = _.uniq(res);
            _.each(res, function(el, index, list){
                cityArray.push({name:el, value: el, isDisplay: false})
            }.bind(this))
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-city').get(0),
                panelID: this.$el.find('#dropdown-city').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: true,
                onOk: function(){},
                data: cityArray,
                callback: function(data) {
                    this.$el.find('#dropdown-city .cur-value').html(data.name);
                    this.$el.find('#input-longitude-latitude').val("查找中...");
                    this.$el.find('#dropdown-city').attr("disabled", "disabled");
                    this.collection.getLocation({addr: data.value})
                }.bind(this)
            });
            this.$el.find('#input-longitude-latitude').val("查找中...");
            this.$el.find('#dropdown-city').attr("disabled", "disabled");
            this.collection.getLocation({addr: "北京"})
        },

        onGetLocation: function(res){
            if (typeof res !== "string" && res.status !== 200){
                this.$el.find('#input-longitude-latitude').val("没有查到该城市的经纬度，请自己谷歌百度后填写！");
                this.$el.find('#input-longitude-latitude').removeAttr("readonly");
            } else {
                this.$el.find('#input-longitude-latitude').val(res);
                this.$el.find('#input-longitude-latitude').attr("readonly", true);
            }
            this.$el.find('#dropdown-city').removeAttr("disabled");
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
            this.$el.find(".opt-ctn .multi-stop").on("click", $.proxy(this.onClickMultiStop, this));
            this.$el.find(".opt-ctn .multi-delete").on("click", $.proxy(this.onClickMultiDelete, this));

            this.enterKeyBindQuery();

            this.queryArgs = {
                "page"    : 1,
                "count"   : 10,
                "chname"  : null,//节点名称
                "operator": null,//运营商id
                "status"  : null//节点状态
            }
            this.onClickQueryButton();
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
                onHiddenCallback: function(){
                    this.enterKeyBindQuery();
                }.bind(this)
            }
            this.addNodePopup = new Modal(options);
        },

        initTable: function(){
            this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");

            this.table = $(_.template(template['tpl/nodeManage/nodeManage.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .node-name").on("click", $.proxy(this.onClickItemNodeName, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
                this.table.find("tbody .hangup").on("click", $.proxy(this.onClickItemHangup, this));
                this.table.find("tbody .stop").on("click", $.proxy(this.onClickItemStop, this));

                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
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
                onHiddenCallback: function(){
                    this.enterKeyBindQuery();
                }.bind(this)
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
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list){
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            this.collection.updateNodeStatus({ids:ids, status:1})
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

        onClickMultiStop : function(event){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list){
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            var result = confirm("你确定要批量关闭选择的节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({ids:ids, status:3})
        },

        onClickMultiDelete: function(event){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list){
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            var result = confirm("你确定要批量删除选择的节点吗？")
            if (!result) return
            alert(ids.join(",") + "。接口不支持，臣妾做不到啊！");
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
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return NodeManageView;
});