define("deviceManage.ipManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

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

    return IpManageView;
});