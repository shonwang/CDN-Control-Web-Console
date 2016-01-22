define("deviceManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var IpManageView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/deviceManage/deviceManage.ipmanage.html'])({}));
            this.$el.find(".ip-table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.ipType = 1
            this.initIpTypeDropmenu();
            this.$el.find(".create").on("click", $.proxy(this.onClickAddIP, this))
            this.collection.off("get.device.ip.success");
            this.collection.off("get.device.ip.error");
            this.collection.on("get.device.ip.success", $.proxy(this.onGetIpSuccess, this));
            this.collection.on("get.device.ip.error", $.proxy(this.onGetError, this));
            this.collection.off("delete.device.ip.success");
            this.collection.off("delete.device.ip.error");
            this.collection.on("delete.device.ip.success", $.proxy(this.onDeleteIpSuccess, this));
            this.collection.on("delete.device.ip.error", $.proxy(this.onGetError, this));
            this.collection.off("add.device.ip.success");
            this.collection.off("add.device.ip.error");
            this.collection.on("add.device.ip.success", function(){
                var id = this.model.get("id");
                this.collection.getDeviceIpList({deviceId:id})
            }.bind(this));
            this.collection.on("add.device.ip.error", $.proxy(this.onGetError, this));

            var id = this.model.get("id");
            this.collection.getDeviceIpList({deviceId:id})
        },

        onGetIpSuccess: function(data){
            this.ipList = data;
            this.updateIpTable();
        },

        onDeleteIpSuccess: function(){
            alert("删除成功！")
            var id = this.model.get("id");
            this.collection.getDeviceIpList({deviceId:id})
        },

        updateIpTable: function(){
            if (this.ipList.length === 0){
                this.$el.find(".ip-table-ctn").html(_.template(template['tpl/empty.html'])({data: this.ipList}));
                return;
            }
            _.each(this.ipList, function(el, index, list){
                if (el.type === 1) el.typeName = "内网IP";
                if (el.type === 2) el.typeName = "外网IP";
                if (el.type === 3) el.typeName = "虚拟IP"
            }.bind(this))
            this.table = $(_.template(template['tpl/deviceManage/deviceManage.ip.table.html'])({data: this.ipList}));
            this.$el.find(".ip-table-ctn").html(this.table[0]);
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var result = confirm("你确定要删除绑定的IP吗？");
            if (!result) return
            this.collection.deleteDeviceIp({device_id:this.model.get("id"), ip_id: id})
        },

        initIpTypeDropmenu: function(){
            var typeIpArray = [
                {name: "内网IP", value: 1},
                {name: "外网IP", value: 2},
                {name: "虚拟IP", value: 3}
            ]
            Utility.initDropMenu(this.$el.find(".ip-type"), typeIpArray, function(value){
                this.ipType = parseInt(value);
            }.bind(this));
        },

        onClickAddIP: function(){
            var ip = this.$el.find("#input-ip").val();
            var args =  {
                "deviceId": this.model.get("id"),
                "ip"      : ip,
                "ipType"  : this.ipType
             }
            this.collection.addDeviceIP(args)
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var AddOrEditDeviceView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit     = options.isEdit;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/deviceManage/deviceManage.add&edit.html'])({}));

            this.$el.find(".create").on("click", $.proxy(this.onClickAddIP, this))
            this.collection.off("add.ip.success");
            this.collection.off("add.ip.error");
            this.collection.on("add.ip.success", $.proxy(this.onAddIpSuccess, this));
            this.collection.on("add.ip.error", $.proxy(this.onGetError, this));
            this.collection.off("delete.ip.success");
            this.collection.off("delete.ip.error");
            this.collection.on("delete.ip.success", $.proxy(this.onDeleteIpSuccess, this));
            this.collection.on("delete.ip.error", $.proxy(this.onGetError, this));
            this.collection.off("get.node.success");
            this.collection.off("get.node.error");
            this.collection.on("get.node.success", $.proxy(this.onGetNodeSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));

            if (this.isEdit){
                this.$el.find("#input-name").val(this.model.attributes.name);
                this.deviceType = this.model.attributes.type;
                this.$el.find("#textarea-comment").val(this.model.attributes.remark);
                this.$el.find(".ip-ctn").hide();
            } else {
                this.ipList = [];
                this.ipType = 1;
                this.deviceType = 1; 
            }
            this.initIpTypeDropmenu();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onDeleteIpError: function(){},

        onGetNodeError: function(){},

        onDeleteIpSuccess: function(){
            var index;
            _.each(this.ipList, function(el, ind, list){
                if (el.id === this.currentDeleteId)
                    index = ind
            }.bind(this))
            this.ipList.splice(index, 1)
            this.updateIpTable();
        },

        onAddIpSuccess: function(res){
            this.ipList.push(res);
            this.updateIpTable();
        },

        updateIpTable: function(){
            if (this.ipList.length === 0){
                this.$el.find(".ip-table-ctn").html("");
                return;
            }
            _.each(this.ipList, function(el, index, list){
                if (el.type === 1) el.typeName = "内网IP";
                if (el.type === 2) el.typeName = "外网IP";
                if (el.type === 3) el.typeName = "虚拟IP"
            }.bind(this))
            this.table = $(_.template(template['tpl/deviceManage/deviceManage.ip.table.html'])({data: this.ipList}));
            this.$el.find(".ip-table-ctn").html(this.table[0]);
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            this.currentDeleteId = id;
            //this.collection.deleteIp({id:id})
            this.onDeleteIpSuccess();
        },

        onClickAddIP: function(){
            var ip = this.$el.find("#input-ip").val();
            var args = {
                ip: ip,
                type: this.ipType
            }
            this.collection.addIp(args)
        },

        initIpTypeDropmenu: function(){
            var typeArray = [
                {name: "lvs", value: 1},
                {name: "cache", value: 2},
                {name: "relay", value: 3}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-type"), typeArray, function(value){
                this.deviceType = parseInt(value);
            }.bind(this));

            this.collection.getNodeList();

            if (!this.isEdit){ 
                var typeIpArray = [
                    {name: "内网IP", value: 1},
                    {name: "外网IP", value: 2},
                    {name: "虚拟IP", value: 3}
                ]
                Utility.initDropMenu(this.$el.find(".ip-type"), typeIpArray, function(value){
                    this.ipType = parseInt(value);
                }.bind(this));
            } else {
                var defaultValue = _.find(typeArray, function(object){
                    return object.value === this.model.attributes.type
                }.bind(this));

                this.$el.find(".dropdown-type .cur-value").html(defaultValue.name)
            }
        },

        onGetNodeSuccess: function(res){
            var nameList = [];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.chName, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-node"), nameList, function(value){
                this.nodeId = value;
            }.bind(this));
            if (this.isEdit){
                var defaultValue = _.find(nameList, function(object){
                    return object.value === this.model.attributes.nodeId
                }.bind(this));

                this.$el.find(".dropdown-node .cur-value").html(defaultValue.name)
                this.nodeId = defaultValue.value;
            } else {
                this.$el.find(".dropdown-node .cur-value").html(nameList[0].name);
                this.nodeId = nameList[0].value;
            }
        },

        getArgs: function(){
            var options = {};
            if (!this.isEdit){
                var ipIdArray = [];
                _.each(this.ipList, function(el, ind, list){
                    ipIdArray.push(el.id)
                }.bind(this))
                options = {
                     "name"   : this.$el.find("#input-name").val(),
                     "nodeId" : this.nodeId,
                     "type"   : this.deviceType,
                     "status" : 1,
                     "ips"    : ipIdArray.join(","),
                     "remark" : this.$el.find("#textarea-comment").val()
                }
            } else {
                options = {
                     "name"   : this.$el.find("#input-name").val(),
                     "nodeId" : this.nodeId,
                     "type"   : this.deviceType,
                     "status" : 1,
                     "remark" : this.$el.find("#textarea-comment").val()
                }
            }
            return options;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var DeviceManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.query      = options.query;
            this.$el = $(_.template(template['tpl/deviceManage/deviceManage.html'])());

            this.initDeviceDropMenu();

            this.collection.on("get.device.success", $.proxy(this.onDeviceListSuccess, this));
            this.collection.on("get.device.error", $.proxy(this.onGetError, this));
            this.collection.on("add.device.success", function(){
                alert("添加成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.device.error", $.proxy(this.onGetError, this));
            this.collection.on("update.device.success", function(){
                alert("编辑成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.device.error", $.proxy(this.onGetError, this));
            this.collection.on("delete.device.success", function(){
                alert("删除成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("delete.device.error", $.proxy(this.onGetError, this));
            this.collection.on("update.device.status.success", function(){
                alert("操作成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.device.status.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            if (this.query !== "none"){
                this.query = JSON.parse(this.query);
                this.nodeId = this.query.nodeId;
                this.$el.find("#input-node").val(this.query.chName);
                this.nodesName = this.query.chName;
            } else {
                this.nodeId = -1;
                this.nodesName = null;
                this.$el.find("#input-node").val("");
            }

            this.queryArgs = {
                "devicename": null,//设备名称
                "nodename"  : this.nodesName,//节点名称
                "status"    : null,//设备状态
                "type"      : null,//设备类型
                "page"      : 1,
                "count"     : 10
            }
            this.onClickQueryButton();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onDeviceListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.devicename = this.$el.find("#input-domain").val() || null;
            this.queryArgs.nodename = this.$el.find("#input-node").val() || null;
            this.collection.getDeviceList(this.queryArgs);
        },

        onClickCreate: function(){
            if (this.addDevicePopup) $("#" + this.addDevicePopup.modalId).remove();

            var addDeviceView = new AddOrEditDeviceView({collection: this.collection});
            var options = {
                title:"添加设备",
                body : addDeviceView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = addDeviceView.getArgs();
                    if (!options) return;
                    this.collection.addDevice(options)
                    this.addDevicePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.addDevicePopup = new Modal(options);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/deviceManage/deviceManage.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.table.find("tbody .ip-manage").on("click", $.proxy(this.onClickItemIp, this));
            this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
            this.table.find("tbody .hangup").on("click", $.proxy(this.onClickItemHangup, this));
            this.table.find("tbody .stop").on("click", $.proxy(this.onClickItemStop, this));
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

            var editDeviceView = new AddOrEditDeviceView({
                collection: this.collection, 
                model     : model,
                isEdit    : true
            });
            var options = {
                title:"编辑设备",
                body : editDeviceView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = editDeviceView.getArgs();
                    if (!options) return;
                    var args = _.extend(model.attributes, options)
                    this.collection.updateDevice(args)
                    this.editDevicePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.editDevicePopup = new Modal(options);
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

        onClickItemIp: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.ipManagePopup) $("#" + this.ipManagePopup.modalId).remove();

            var ipManageView = new IpManageView({
                collection: this.collection, 
                model     : model
            });
            var options = {
                title:"IP管理：" + model.get('name'),
                body : ipManageView,
                backdrop : 'static',
                type     : 1,
                onOKCallback:  function(){},
                onHiddenCallback: function(){}
            }
            this.ipManagePopup = new Modal(options);
        },

        onClickItemPlay: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            this.collection.updateDeviceStatus({ids:[parseInt(id)], status:1})
        },

        onClickItemHangup: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var result = confirm("你确定要挂起设备吗？")
            if (!result) return
            this.collection.updateDeviceStatus({ids:[parseInt(id)], status:2})
        },

        onClickItemStop: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var result = confirm("你确定要关闭设备吗？")
            if (!result) return
            this.collection.updateDeviceStatus({ids:[parseInt(id)], status:3})
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

        initDeviceDropMenu: function(){
            var typeArray = [
                {name: "全部", value: "All"},
                {name: "lvs", value: 1},
                {name: "cache", value: 2},
                {name: "relay", value: 3}
            ],
            rootNode = this.$el.find(".dropdown-type");
            Utility.initDropMenu(rootNode, typeArray, function(value){
                if (value !== "All")
                    this.queryArgs.type = parseInt(value)
                else
                    this.queryArgs.type = null
            }.bind(this));

            var statusArray = [
                {name: "全部", value: "All"},
                {name: "运行中", value: 1},
                {name: "挂起", value: 2},
                {name: "已关闭", value: 3}
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

        hide: function(){
            this.$el.hide();
        },

        update: function(query){
            this.$el.show();
            this.query = query;
            if (this.query !== "none"){
                this.query = JSON.parse(this.query);
                this.nodeId = this.query.nodeId;
                //this.queryArgs.nodeId = this.nodeId;
                this.nodesName = this.query.chName;
                this.queryArgs.nodename = this.nodesName;
                this.$el.find("#input-node").val(this.query.chName);
            } else {
                this.nodeId = -1;
                //this.queryArgs.nodeId = this.nodeId;
                this.nodesName = null;
                this.queryArgs.nodename = this.nodesName;
                this.$el.find("#input-node").val("");
            }
            this.onClickQueryButton();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DeviceManageView;
});