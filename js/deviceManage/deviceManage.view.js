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

            this.uploadOption = {
                runtimes : 'html5,flash,silverlight,html4', //上传模式，依次退化;
                url: BASE_URL + "/rs/device/batchAdd", 
                browse_button: 'import-device-button', //触发对话框的DOM元素自身或者其ID
                flash_swf_url : 'resource/Moxie.swf', //Flash组件的相对路径
                silverlight_xap_url : 'resource/Moxie.xap', //Silverlight组件的相对路径;
                multipart: true,
                filters: {
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
            if (!AUTH_OBJ.BrowseHostFile){
                this.$el.find("#import-device-button").remove();
            } else {
                setTimeout(function(){
                    this.initUploader();
                }.bind(this), 200)
            }
        }
    });

    var IPPauseView = Backbone.View.extend({
        initialize: function(options){
            this.collection = options.collection;
            this.data = options.data;
            this.id = options.id;
            this.status = options.status;
            this.deviceId = options.deviceId;

            this.$el = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:this.data}));
            this.$el.find('.table-place').html(_.template(template['tpl/ipManage/ipManage.start&pause.table.html'])({data:this.data}));
        },

        onClickSubmit: function(){
            var submitData = {
                "ip_id" : this.id,
                "device_id" : this.deviceId
            }
            return submitData;
        },

        render: function(target) {
            this.$el.appendTo(target);
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

            this.noticeInfoStr = '<div class="alert alert-info"><strong>数据加载中，请耐心等待 </strong></div>';

            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancelEditIP, this));
            this.$el.find(".update").on("click", $.proxy(this.onClickUpateIP, this));
            if (AUTH_OBJ.CreateIP)
                this.$el.find(".create").on("click", $.proxy(this.onClickAddIP, this));
            else
                this.$el.find(".create").remove()

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

            this.collection.off("operator.type.success");
            this.collection.off("operator.type.error");
            this.collection.on("operator.type.success", $.proxy(this.onGetOperatorTypeSuccess, this));
            this.collection.on("operator.type.error", $.proxy(this.onGetError, this));


            this.collection.off("get.ipInfoPause.success");
            this.collection.on("get.ipInfoPause.success", $.proxy(this.onIpInfoPauseSuccess, this));
            this.collection.off("get.ipInfoStart.error");
            this.collection.on("get.ipInfoStart.error", function(err){
                this.commonPopup.$el.modal('hide');
                this.onGetError(err);
            }.bind(this));
            this.collection.off("get.ipInfoPause.error");
            this.collection.on("get.ipInfoPause.error", function(err){
                this.commonPopup.$el.modal('hide');
                this.onGetError(err);
            }.bind(this));

            this.collection.off("get.ipInfoSubmit.success");
            this.collection.on("get.ipInfoSubmit.success", function(res){
                this.showIpManagePopup();
                this.collection.ipTypeList();
            }.bind(this));
            this.collection.off("get.ipInfoSubmit.error");
            this.collection.on("get.ipInfoSubmit.error",  $.proxy(this.onGetError, this));

            this.collection.ipTypeList();
            
            var isMultiNode = this.model.get('multiNode');
            //var isMultiNode = true;
            if(isMultiNode == false){
                this.$el.find('.ip-operator-type').remove();
                this.operatorId = 0;
            }else{
                this.$el.find('.ip-operator-default').remove();
                this.collection.operatorTypeList();
            }
            
        },
        //点击设备管理中的名称时，请求成功后执行的函数
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

        onGetOperatorTypeSuccess:function(data){
            this.operatorTypeList = data;
            var typeOperatorArray = [];
            _.each(this.operatorTypeList,function(el,key,ls){
                typeOperatorArray.push({name:el.name,value:el.id})
            });
            Utility.initDropMenu(this.$el.find('.ip-operator-type'),typeOperatorArray,function(value){
                this.operatorId = parseInt(value);
            }.bind(this));
            this.$el.find('.ip-operator-type .cur-value').html(data[0].name);

            this.operatorId = data[0].id;
        },

        onGetIpSuccess: function(data){
            this.ipList = data;
            this.updateIpTable();
        },

        onDeleteIpSuccess: function(){
            alert("删除成功！")
            var id = this.model.get("id");
            this.collection.getDeviceIpList({deviceId:id});
            this.showIpManagePopup();
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
                if (el.status === 1) el.statusName = "<span class='text-success'>运行中</span>";
                if (el.status === 2 || el.status === 8 || el.status === 10) el.statusName = "<span class='text-warning'>暂停中</span>";
                if (el.status === 4) el.statusName = "<span class='text-danger'>宕机</span>";
                if (el.status === 6 || el.status === 12 || el.status === 14) el.statusName = "暂停且宕机";
            }.bind(this))
           
            this.table = $(_.template(template['tpl/deviceManage/deviceManage.ip.table.html'])({
                data: this.ipList, 
                permission: AUTH_OBJ,
                isCreate: false
            }));
            this.$el.find(".ip-table-ctn").html(this.table[0]);
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.table.find("tbody .ipOperation").on("click", $.proxy(this.onClickIpOperation, this));
            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert(error)
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
            var eventTarget = event.srcElement || event.target, id,ip;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
                ip = eventTarget.attr("data-ip");
                this.status = eventTarget.attr("data-status");
            } else {
                id = $(eventTarget).attr("id");
                ip = $(eventTarget).attr("data-ip");
                this.status = $(eventTarget).attr("data-status");
            }
            this.id = id;
            this.ip = ip;
            this.deviceId = this.model.get("id");
            this.hideIpManagePopup();
            setTimeout(function(){
                this.collection.getIpInfoPause(ip,'delete');
            }.bind(this),500);
        },

        onClickIpOperation: function(event){
            var eventTarget = event.srcElement || event.target,id,status,ip;

            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
                status = eventTarget.attr("data-status");
                ip = eventTarget.attr("data-ip");
            } else {
                id = $(eventTarget).attr("id");
                status = $(eventTarget).attr("data-status");
                ip = $(eventTarget).attr("data-ip");
            }
            this.id = id;
            this.status = status;
            this.ip = ip;
            if(status == '1'){ //开启

                this.hideIpManagePopup();
                setTimeout(function(){
                    this.collection.getIpInfoStart(ip);

                    this.commonDialog();
                    this.commonPopup.$el.find('.close').hide();
                    this.commonPopup.$el.find('.commonPopup').hide();

                    this.collection.off("get.ipInfoStart.success");
                    this.collection.on("get.ipInfoStart.success", $.proxy(this.onIpInfoStartSuccess, this));
                }.bind(this),500);
            }else if(status == '2' || status == '6'){ //暂停

                this.hideIpManagePopup();
                setTimeout(function(){
                    this.collection.getIpInfoPause(ip,'pause');

                    this.commonDialog();
                    this.commonPopup.$el.find('.close').hide();
                    this.commonPopup.$el.find('.commonPopup').hide();

                }.bind(this),500);
            }
        },

        hideIpManagePopup: function(){
            var modelId = $('#ipManageDialogId').val();
            $('#'+modelId).modal('hide');
        },

        showIpManagePopup: function(){
            var modelId = $('#ipManageDialogId').val();
            $('#'+modelId).modal('show');
        },

        commonDialog: function(){
            if (this.commonPopup) $("#" + this.commonPopup.modalId).remove();
            var options = {
                title: "警告",
                body : this.noticeInfoStr,
                backdrop : 'static',
                type     : 2,
                cancelButtonText : "关闭",
                onOKCallback:  function(){
                    var options = {
                        "id" : this.id,
                        "status" : this.status
                    }
                    if (!options) return;
                    this.collection.getIpInfoSubmit(options);
                    this.commonPopup.$el.modal('hide');
                }.bind(this),
                onCancelCallback: function(){
                    this.commonPopup.$el.modal('hide');
                    setTimeout(function(){
                        this.showIpManagePopup();
                    }.bind(this),500);
                }.bind(this)
            }

            this.commonPopup = new Modal(options);
        },

        onIpInfoStartSuccess: function(res){
            var data = res;
            var body = '';
            if(data.length > 0){
                data[0].title = 'IP '+this.ip+'暂停前在下列调度关系中服务，点击确定，下列调度关系将恢复，点击取消，IP状态不会变更，是否确定？';

                this.table_modal = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:data}));
                this.table_modal.find('.table-place').html(_.template(template['tpl/ipManage/ipManage.start&pause.table.html'])({data:data}));

                this.commonPopup.$el.find('.modal-body').html(this.table_modal);
            }else{
                body = '确定要开启服务吗？';
                this.commonPopup.$el.find('.close').show();
                this.commonPopup.$el.find('.commonPopup').show();
                this.commonPopup.$el.find('h4').html('恢复IP');
                this.commonPopup.$el.find('.modal-body strong').html(body);
            }
        },

        onIpInfoPauseSuccess: function(res){
            if (this.PausePopup) $("#" + this.PausePopup.modalId).remove();
            var data = res;
            var body = '';
            if(data.res.length > 0){
                if(data.operation == 'delete'){
                    data.res[0].title = 'IP '+this.ip+'在下列调度关系中服务，点击确定，下列调度关系将彻底删除，点击取消，下列调度服务不会改变，是否确定？';

                    var ipPauseView = new IPPauseView({
                        collection : this.collection,
                        data : data.res,
                        id : this.id,
                        status: this.status,
                        deviceId: this.deviceId
                    });

                    var options = {
                        title:"删除IP",
                        body : ipPauseView,
                        backdrop : 'static',
                        type     : 2,
                        cancelButtonText : '取消',
                        onOKCallback:  function(){
                            var options = ipPauseView.onClickSubmit();
                            this.PausePopup.$el.modal("hide");
                            if (!options) return;
                            this.collection.deleteDeviceIp(options);
                        }.bind(this),
                        onCancelCallback: function(){
                            this.showIpManagePopup();
                        }.bind(this)
                    }

                    this.PausePopup = new Modal(options);
                }else if(data.operation == 'pause'){
                    data.res[0].title = 'IP '+this.ip+'在下列调度关系中服务，点击确定，该IP将不对下列调度关系服务，点击取消，IP状态不会改变，是否确定？';
                    this.commonPopup.$el.find('h4').html('暂停IP');
                    this.table_modal = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:data.res}));
                    this.table_modal.find('.table-place').html(_.template(template['tpl/ipManage/ipManage.start&pause.table.html'])({data:data.res}));

                    this.commonPopup.$el.find('.modal-body').html(this.table_modal);
                }
            }else{
                if(data.operation == 'delete'){
                    var result = confirm("你确定要删除绑定的IP吗？");
                    if (!result) {this.showIpManagePopup(); return}
                    this.collection.deleteDeviceIp({device_id:this.deviceId, ip_id: this.id});
                }else if(data.operation == 'pause'){
                    body = '确定要暂停服务吗？';
                    this.commonPopup.$el.find('h4').html('暂停IP');
                    this.commonPopup.$el.find('.close').show();
                    this.commonPopup.$el.find('.commonPopup').show();
                    this.commonPopup.$el.find('.modal-body strong').html(body);
                }
            }
        },

        onClickAddIP: function(){
            var ip = this.$el.find("#input-ip").val();
            var args =  {
                "deviceId": this.model.get("id"),
                "ip"      : ip,
                "ipType"  : this.ipType,
                "operatorId" : this.operatorId
             }
            this.collection.addDeviceIP(args);
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

            //新添，当operatorId == 9时，需要添加IP运营商
            this.collection.off("operator.type.success");
            this.collection.off("operator.type.error");
            this.collection.on("operator.type.success", $.proxy(this.onGetOperatorTypeSuccess, this));
            this.collection.on("operator.type.error", $.proxy(this.onGetError, this));


            if (this.isEdit){
                this.$el.find("#input-name").val(this.model.attributes.name);
                this.deviceType = this.model.attributes.type;
                this.$el.find("#textarea-comment").val(this.model.attributes.remark);
                this.$el.find(".ip-ctn").hide();
                this.$el.find("#dropdown-node").attr('disabled','disabled');
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
                alert("网络阻塞，请刷新重试！")
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
            this.table = $(_.template(template['tpl/deviceManage/deviceManage.ip.table.html'])({
                data: this.ipList, 
                permission: AUTH_OBJ, 
                isCreate: true
            }));
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
            var operatorId = this.operatorId || 0;
            var args = {
                ip: ip,
                type: this.ipType,
                operatorId:operatorId
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

        onGetNodeSuccessOld: function(res){
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

        onGetNodeSuccess: function(res){
            var nameList = [];
            var isMultiwireList = {};
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.chName, value:el.id})
                isMultiwireList[el.id]= (el.operatorId == 9);
            });
            this.isMultiwireList = isMultiwireList;
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-node').get(0),
                panelID: this.$el.find('#dropdown-node').get(0),
                isSingle: true,
                openSearch: true,
                onOk: function(){},
                data: nameList,
                callback: function(data) {
                    this.nodeId = data.value;
                    this.$el.find('#dropdown-node .cur-value').html(data.name);
                    this.setIspList();
                }.bind(this)
            });
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
                this.setIspList();
            } 
            
        },
        
        operatorList:{
            //缓存运营商列表
            hasData:false,
            data:null
        },

        setIspList:function(){
            //设置运营商下拉列表
            var operatorList = this.operatorList;
            var isMultiwireList = this.isMultiwireList;
            if(!isMultiwireList[this.nodeId]){
                //不是多线
                this.$el.find('.ip-operator-type').hide();
                this.$el.find('.ip-operator-default').show();
                this.operatorId = 0;
            }
            else{
                this.$el.find('.ip-operator-default').hide();
                this.$el.find('.ip-operator-type').show();
                if(!operatorList.hasData){
                    this.collection.operatorTypeList();
                }
                else{
                    this.setOperatorTypeList(operatorList.data);
                }
            }
        },

        onGetOperatorTypeSuccess:function(data){
            this.operatorTypeList = data;
            var typeOperatorArray = [];
            _.each(this.operatorTypeList,function(el,key,ls){
                typeOperatorArray.push({name:el.name,value:el.id})
            });
            this.operatorList.data = typeOperatorArray;
            this.operatorList.hasData = true;
            this.setOperatorTypeList(typeOperatorArray);
            
        },


        setOperatorTypeList:function(typeOperatorArray){
            Utility.initDropMenu(this.$el.find('.ip-operator-type'),typeOperatorArray,function(value){
                this.operatorId = parseInt(value);
            }.bind(this));     
            this.operatorId = typeOperatorArray[0].value;
            this.$el.find('.ip-operator-type .cur-value').html(typeOperatorArray[0].name);
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
            if (AUTH_OBJ.CreateIP)
                this.$el.find(".create").on("click", $.proxy(this.onClickAddIP, this))
            else
                this.$el.find(".create").remove();
        },

        getArgs: function(){
            var options = {}, deviceName = this.$el.find("#input-name").val(), re = /^[a-zA-Z\d\.\-]+$/;
            if (!re.test(deviceName)){
                alert("设备名称只能输入如下字符：英文 数字 - .");
                return;
            }
            if (!this.isEdit){
                var ipIdArray = [];
                _.each(this.ipList, function(el, ind, list){
                    ipIdArray.push(el.id)
                }.bind(this))
                options = {
                     "name"   : deviceName,
                     "nodeId" : this.nodeId,
                     "type"   : this.deviceType,
                     "status" : 1,
                     "ips"    : ipIdArray.join(","),
                     "remark" : this.$el.find("#textarea-comment").val()
                }
            } else {
                options = {
                     "name"   : deviceName,
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
            this.options = options;
            this.collection = options.collection;
            this.query      = options.query;
            this.$el = $(_.template(template['tpl/deviceManage/deviceManage.html'])());

            this.noticeInfoStr = '<div class="alert alert-info"><strong>数据加载中，请耐心等待 </strong></div>';

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
            this.collection.on("get.deviceStatusSubmit.success", function(){
                alert('设置成功');
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("get.deviceStatusSubmit.error", $.proxy(this.onGetError, this));
            this.collection.on("update.device.status.error", $.proxy(this.onGetError, this));

            this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
            this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));

            this.collection.on("get.deviceOpen.success", $.proxy(this.onDeviceOpenSuccess, this));
            this.collection.on("get.deviceOpen.error", function(err){
                this.commonPopup.$el.modal('hide');
                this.onGetError(err);
            }.bind(this));

            this.collection.on("get.devicePause.success", $.proxy(this.onDevicePauseSuccess, this));
            this.collection.on("get.devicePause.error", function(err){
                this.commonPopup.$el.modal('hide');
                this.onGetError(err);
            }.bind(this));

            if (AUTH_OBJ.CreateHost)
                this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
            else 
                this.$el.find(".opt-ctn .create").remove();

            if (AUTH_OBJ.ImportHostFile)
                this.$el.find(".opt-ctn .import").on("click", $.proxy(this.onClickImport, this));
            else
                this.$el.find(".opt-ctn .import").remove(); 

            if (AUTH_OBJ.QueryHost) {
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                this.enterKeyBindQuery();
            } else {
                this.$el.find(".opt-ctn .query").remove();
            }
            if (AUTH_OBJ.EnableorPauseHost)
                this.$el.find(".opt-ctn .multi-play").on("click", $.proxy(this.onClickMultiPlay, this));
            else
                this.$el.find(".opt-ctn .multi-play").remove();

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

        onDeviceListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
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
                    if (AUTH_OBJ.BrowseHostFile){
                        importDeviceView.uploader.stop();
                        importDeviceView.uploader.destroy();
                    }  
                    if (AUTH_OBJ.QueryHost) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.importDevicePopup = new Modal(options);
            if (!AUTH_OBJ.ApplyImportHostFile)
                this.importDevicePopup.$el.find(".modal-footer .btn-primary").remove();
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
                onHiddenCallback: function(){
                    if (AUTH_OBJ.QueryHost) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.addDevicePopup = new Modal(options);
            if (!AUTH_OBJ.ApplyCreateHost)
                this.addDevicePopup.$el.find(".modal-footer .btn-primary").remove();
        },

        initTable: function(){
            this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");

            this.table = $(_.template(template['tpl/deviceManage/deviceManage.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
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

                this.$el.find(".open").on("click", $.proxy(this.onClickDeviceOpen, this));
                this.$el.find(".pause").on("click", $.proxy(this.onClickDevicePause, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        commonDialog: function(){
            if (this.commonPopup) $("#" + this.commonPopup.modalId).remove();
            var options = {
                title: "警告",
                body : this.noticeInfoStr,
                backdrop : 'static',
                type     : 2,
                cancelButtonText : "关闭",
                onOKCallback:  function(){
                    var options = {
                        "deviceId" : this.clickDeviceId,
                        "status" : this.clickStatus
                    }
                    if (!options) return;
                    this.collection.getDeviceStatusSubmit(options);
                    this.commonPopup.$el.modal('hide');
                }.bind(this),
                onCancelCallback: function(){
                    this.commonPopup.$el.modal('hide');
                }.bind(this)
            }

            this.commonPopup = new Modal(options);
        },

        onClickDeviceOpen: function(event){
            var eventTarget = event.srcElement || event.target,deviceId,status,name;

            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                deviceId = eventTarget.attr("id");
                status = eventTarget.attr("data-status");
                name = eventTarget.attr("data-name");
            } else {
                deviceId = $(eventTarget).attr("id");
                status = $(eventTarget).attr("data-status");
                name = $(eventTarget).attr("data-name");
            }

            this.clickDeviceId = deviceId;
            this.clickStatus = status;
            this.name = name;

            this.collection.getDeviceStatusOpen(deviceId);

            this.commonDialog();
            this.commonPopup.$el.find('.close').hide();
            this.commonPopup.$el.find('.commonPopup').hide();
        },

        onClickDevicePause: function(event){
            var eventTarget = event.srcElement || event.target,deviceId,status,name;

            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                deviceId = eventTarget.attr("id");
                status = eventTarget.attr("data-status");
                name = eventTarget.attr("data-name");
            } else {
                deviceId = $(eventTarget).attr("id");
                status = $(eventTarget).attr("data-status");
                name = $(eventTarget).attr("data-name");
            }

            this.clickDeviceId = deviceId;
            this.clickStatus = status;
            this.name = name;

            this.collection.getDeviceStatusPause(deviceId);

            this.commonDialog();
            this.commonPopup.$el.find('.close').hide();
            this.commonPopup.$el.find('.commonPopup').hide();

        },

        onDeviceOpenSuccess: function(res){
            var data = res;
            var body = '';
            if(data.length > 0){
                data[0].title = '设备 '+this.name+'暂停前在下列调度关系中服务，点击确定，下列调度关系将恢复，点击取消，设备状态不会变更，是否确定？';

                this.table_modal = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:data}));
                this.table_modal.find('.table-place').html(_.template(template['tpl/ipManage/ipManage.start&pause.table.html'])({data:data}));

                this.commonPopup.$el.find('.modal-body').html(this.table_modal);
            }else{
                body = '确定要开启服务吗？';
                this.commonPopup.$el.find('.close').show();
                this.commonPopup.$el.find('.commonPopup').show();
                this.commonPopup.$el.find('h4').html('恢复设备');
                this.commonPopup.$el.find('.modal-body strong').html(body);
            }
        },

        onDevicePauseSuccess: function(res){
            var data = res;
            var body = '';
            if(data.length > 0){
                data[0].title = '设备 '+this.name+'在下列调度关系中服务，点击确定，该设备将不对下列调度关系服务，点击取消，设备状态不会改变，是否确定？';
                
                this.table_modal = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:data}));
                this.table_modal.find('.table-place').html(_.template(template['tpl/ipManage/ipManage.start&pause.table.html'])({data:data}));

                this.commonPopup.$el.find('.modal-body').html(this.table_modal);
            }else{
                body = '确定要暂停服务吗？';
                this.commonPopup.$el.find('.close').show();
                this.commonPopup.$el.find('.commonPopup').show();
                this.commonPopup.$el.find('h4').html('暂停设备');
                this.commonPopup.$el.find('.modal-body strong').html(body);
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
            //if (eventTarget.tagName == "SPAN"){
            //    eventTarget = $(eventTarget).parent();
            //    id = eventTarget.attr("id");
            //} else {
                id = $(eventTarget).attr("id");
            //}
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
                width: 700,
                onOKCallback:  function(){},
                onHiddenCallback: function(){
                    if (AUTH_OBJ.QueryHost) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.ipManagePopup = new Modal(options);
            $('#ipManageDialogId').val(this.ipManagePopup.$el[0]['id']);
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
                {name: "暂停中", value: 2}
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

        update: function(query, target){
            this.options.query = query;
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

    return DeviceManageView;
});