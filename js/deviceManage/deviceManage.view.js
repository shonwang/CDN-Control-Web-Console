define("deviceManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var ImportDevciceView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/deviceManage/deviceManage.import.html'])({}));
            this.$el.find(".progress-ctn").hide();

            this.isUploading = false;
            this.isError = false;
            this.isSelectedFile = false;

            this.multipartParams = {
                "key": "${filename}",
                "acl": "private",
                "signature" : "",
                "KSSAccessKeyId": "",
                "policy": ""
            };

            this.uploadOption = {
                runtimes : 'html5,flash,silverlight,html4', //上传模式，依次退化;
                url: BASE_URL + "/rs/device/batchAdd", 
                browse_button: 'import-device-button', //触发对话框的DOM元素自身或者其ID
                flash_swf_url : 'resource/Moxie.swf', //Flash组件的相对路径
                silverlight_xap_url : 'resource/Moxie.xap', //Silverlight组件的相对路径;
                multipart: true,
                //multipart_params: this.multipartParams,
                filters: {
                  // mime_types : [
                  //   { title : "Excel files", extensions : "xls" }
                  // ],
                  max_file_size: 1024 * 1024 * 10
                },
                multi_selection: false,
                send_file_name: false, //是否添加额外的文件名，后端需要根据此计算签名，默认是true
            };
        },

        initUploader: function(){
            this.uploader = new plupload.Uploader(this.uploadOption);
            this.uploader.init();

            this.uploader.bind("Error", function(up, obj){
                if (obj && obj.code === -600){
                    alert("上传文件超出最大限制:10MB");
                    return;
                }
                try{
                    var error = JSON.parse(obj.response)
                    alert(error.message)
                } catch(e){
                    alert("导入失败了！")
                }
                this.isError = true;
                this.uploader.splice(0, 1);
                this.isSelectedFile = false;
            }.bind(this));

            this.uploader.bind("FilesAdded", function(up, obj){
                if (!up) return;
                if (this.isError) this.isError = false;
                if (up.files.length > 1) this.uploader.splice(0, 1);
                this.$el.find("#import-device-file").val(up.files[0].name);
                this.$el.find(".progress-bar").css("width", "0%");
                this.$el.find(".progress-bar").html("0%");
                this.isSelectedFile = true;
            }.bind(this));

            this.uploader.bind("FileUploaded", function(up, obj, res){
                this.uploader.splice(0, 1);
                this.isSelectedFile = false;
            }.bind(this)); 

            this.uploader.bind("UploadProgress", function(up, obj){
                if (this.uploader.state === plupload.STOPPED) return;
                if (!obj) return;
                this.$el.find(".progress-bar").css("width", obj.percent + "%");
                this.$el.find(".progress-bar").html(obj.percent + "%");
            }.bind(this));

            this.uploader.bind("UploadComplete", function(up, obj, res){
                this.isUploading = false;
                this.uploader.disableBrowse(false);
                this.$el.find("#import-device-button").removeAttr("disabled")
                this.$el.find("#import-device-file").removeAttr("readonly")
                this.$el.find("#import-device-file").val("");
                if (this.isError) return;
                alert("导入完成！")
                this.options.uploadCompleteCallback && this.options.uploadCompleteCallback();
            }.bind(this));
        },

        onClickOK: function(){
            if (!this.isSelectedFile){
                alert("你还没有选择要导入的文件，或者你选择的文件已经导入过了！")
                return false;
            }
            if (this.isUploading) return false;
            var result = confirm("你确定要导入设备吗？");
            if (!result) return false;
            this.isUploading = true;
            this.$el.find(".progress-ctn").show();
            this.$el.find("#import-device-button").attr("disabled", "disabled")
            this.$el.find("#import-device-file").attr("readonly", "true")
            this.uploader.disableBrowse(true);
            this.uploader.start();
        },

        render: function(target) {
            this.$el.appendTo(target);
            setTimeout(function(){
                this.initUploader();
            }.bind(this), 200)
        }
    });

    var IpManageView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/deviceManage/deviceManage.ipmanage.html'])({}));
            this.$el.find(".ip-table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancelEditIP, this));
            this.$el.find(".update").on("click", $.proxy(this.onClickUpateIP, this));
            this.$el.find(".create").on("click", $.proxy(this.onClickAddIP, this));

            this.$el.find(".update").hide();
            this.$el.find(".cancel").hide();

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

            this.collection.off("ip.type.success");
            this.collection.off("ip.type.error");
            this.collection.on("ip.type.success", $.proxy(this.onGetIpTypeSuccess, this));
            this.collection.on("ip.type.error", $.proxy(this.onGetError, this));

            this.collection.ipTypeList();
        },

        onGetIpTypeSuccess: function(data){
            this.ipTypeList = data;
            var typeIpArray = [];
            _.each(this.ipTypeList, function(el, key, ls){
                typeIpArray.push({name: el.name, value: el.id})
            })
            Utility.initDropMenu(this.$el.find(".ip-type"), typeIpArray, function(value){
                this.ipType = parseInt(value);
            }.bind(this));
            this.ipType = data[0].id;
            this.$el.find(".ip-type .cur-value").html(data[0].name)

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
                var ipTypeArray = _.filter(this.ipTypeList ,function(obj) {
                    return obj["id"] === parseInt(el.type);
                })
                if (ipTypeArray[0]) el.typeName = ipTypeArray[0].name;
            }.bind(this))
            this.table = $(_.template(template['tpl/deviceManage/deviceManage.ip.table.html'])({data: this.ipList}));
            this.$el.find(".ip-table-ctn").html(this.table[0]);
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var aIPArray = _.filter(this.ipList ,function(obj) {
                return obj["id"] === parseInt(id);
            })
            this.$el.find("#input-ip").val(aIPArray[0].ip);
            this.$el.find(".ip-type .cur-value").html(aIPArray[0].typeName);
            this.ipType = aIPArray[0].type;
            this.$el.find(".create").hide();
            this.$el.find(".update").show();
            this.$el.find(".cancel").show();
            this.$el.find("#input-ip").focus();
        },

        onClickCancelEditIP: function(){
            this.$el.find(".create").show();
            this.$el.find(".update").hide();
            this.$el.find(".cancel").hide();
        },

        onClickUpateIP: function(){
            alert("接口暂未提供！")
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
            this.deviceTypeArray = options.deviceTypeArray;

            this.$el = $(_.template(template['tpl/deviceManage/deviceManage.add&edit.html'])({}));

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
                this.collection.off("ip.type.success");
                this.collection.off("ip.type.error");
                this.collection.on("ip.type.success", $.proxy(this.onGetIpTypeSuccess, this));
                this.collection.on("ip.type.error", $.proxy(this.onGetError, this));
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

        onDeleteIpSuccess: function(id){
            var index;
            _.each(this.ipList, function(el, ind, list){
                if (el.id === id)
                    index = ind
            }.bind(this))
            this.ipList.splice(index, 1)
            this.updateIpTable();
        },

        onAddIpSuccess: function(res){
            var ipTypeArray = _.filter(this.ipList ,function(obj) {
                return obj["id"] === parseInt(res.id);
            })
            if (ipTypeArray.length > 0){
                alert("这个IP已经添加过了")
                return;
            }
            this.ipList.push(res);
            this.updateIpTable();
        },

        updateIpTable: function(){
            if (this.ipList.length === 0){
                this.$el.find(".ip-table-ctn").html("");
                return;
            }
            _.each(this.ipList, function(el, index, list){
                var ipTypeArray = _.filter(this.ipTypeList ,function(obj) {
                    return obj["id"] === parseInt(el.type);
                })
                if (ipTypeArray[0]) el.typeName = ipTypeArray[0].name;
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
            //this.currentDeleteId = id;
            //this.collection.deleteIp({id:id})
            this.onDeleteIpSuccess(parseInt(id));
        },

        onClickAddIP: function(){
            var ip = this.$el.find("#input-ip").val();
            var args = {
                ip: ip,
                type: this.ipType
            }
            this.collection.addIp(args)
        },

        initIpTypeDropmenu: function(res){
            var typeArray = this.deviceTypeArray;
            Utility.initDropMenu(this.$el.find(".dropdown-type"), typeArray, function(value){
                this.deviceType = parseInt(value);
            }.bind(this));

            this.collection.getNodeList();

            if (this.isEdit){ 
                var defaultValue = _.find(typeArray, function(object){
                    return object.value === this.model.attributes.type
                }.bind(this));
                if (defaultValue)
                    this.$el.find(".dropdown-type .cur-value").html(defaultValue.name)
            } else {
                this.$el.find(".dropdown-type .cur-value").html(typeArray[0].name);
                this.deviceType = typeArray[0].value
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

                this.collection.ipTypeList();
            } 
        },

        onGetIpTypeSuccess: function(data){
            this.ipTypeList = data;
            var typeIpArray = [];
            _.each(this.ipTypeList, function(el, key, ls){
                typeIpArray.push({name: el.name, value: el.id})
            })
            Utility.initDropMenu(this.$el.find(".ip-type"), typeIpArray, function(value){
                this.ipType = parseInt(value);
            }.bind(this));
            this.ipType = data[0].id
            this.$el.find(".ip-type .cur-value").html(data[0].name)

            this.$el.find(".create").on("click", $.proxy(this.onClickAddIP, this))
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

            this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
            this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));            

            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
            this.$el.find(".opt-ctn .import").on("click", $.proxy(this.onClickImport, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .multi-play").on("click", $.proxy(this.onClickMultiPlay, this));
            this.$el.find(".opt-ctn .multi-stop").on("click", $.proxy(this.onClickMultiStop, this));
            this.$el.find(".opt-ctn .multi-delete").on("click", $.proxy(this.onClickMultiDelete, this));

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
            this.collection.getDeviceTypeList();
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

        onClickImport: function(){
            if (this.importDevicePopup) $("#" + this.importDevicePopup.modalId).remove();

            var importDeviceView = new ImportDevciceView({
                collection: this.collection,
                uploadCompleteCallback: function(){
                    this.onClickQueryButton();
                }.bind(this)
            });
            var options = {
                title:"导入设备",
                body : importDeviceView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = importDeviceView.onClickOK();
                }.bind(this),
                onHiddenCallback: function(){
                    importDeviceView.uploader.stop();
                    importDeviceView.uploader.destroy();
                }.bind(this)
            }
            this.importDevicePopup = new Modal(options);
        },

        onClickCreate: function(){
            if (this.addDevicePopup) $("#" + this.addDevicePopup.modalId).remove();

            var addDeviceView = new AddOrEditDeviceView({
                collection: this.collection,
                deviceTypeArray: this.deviceTypeArray
            });
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
            this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");

            this.table = $(_.template(template['tpl/deviceManage/deviceManage.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);

                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                this.table.find("tbody .ip-manage").on("click", $.proxy(this.onClickItemIp, this));
                this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
                this.table.find("tbody .hangup").on("click", $.proxy(this.onClickItemHangup, this));
                this.table.find("tbody .stop").on("click", $.proxy(this.onClickItemStop, this));

                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
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

            if (this.editDevicePopup) $("#" + this.editDevicePopup.modalId).remove();

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

        onClickMultiPlay: function(event){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list){
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            this.collection.updateDeviceStatus({ids:ids, status:1})
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
            var result = confirm("你确定要批量关闭选择的设备吗？")
            if (!result) return
            this.collection.updateDeviceStatus({ids:ids, status:3})
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
            var result = confirm("你确定要批量删除选择的设备吗？")
            if (!result) return
            alert(ids.join(",") + "。接口不支持，臣妾做不到啊！");
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

        initDeviceDropMenu: function(res){
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