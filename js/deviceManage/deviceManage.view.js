define("deviceManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

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

            this.collection.on("set.status.success", $.proxy(this.onSetStatusSuccess, this));
            this.collection.on("set.status.error", $.proxy(this.onGetError, this));

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
            require(["deviceManage.importDevice.view"], function(ImportDevciceView) {
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
            }.bind(this));
        },

        onClickCreate: function(){
            if (this.addDevicePopup) $("#" + this.addDevicePopup.modalId).remove();

            require(["deviceManage.edit.view"], function(AddOrEditDeviceView) {
                var addDeviceView = new AddOrEditDeviceView({
                    collection: this.collection,
                    deviceTypeArray: this.deviceTypeArray
                });
                var options = {
                    title:"添加设备",
                    body : addDeviceView,
                    backdrop : 'static',
                    type     : 2,
                    width : 700,
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
            }.bind(this))
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

                this.table.find("tbody .operateDetail").on("click", $.proxy(this.onClickDetail, this));

                this.$el.find(".open").on("click", $.proxy(this.onClickDeviceOpen, this));
                this.$el.find(".pause").on("click", $.proxy(this.onClickDevicePause, this));

                this.table.find("[data-toggle='popover']").popover();
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickDetail: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            if (this.detailTipsPopup) $("#" + this.detailTipsPopup.modalId).remove();

            require(["nodeManage.operateDetail.view"], function(NodeTips) {
                var detailTipsView = new NodeTips({
                    type: 2,
                    model: model
                });
                var options = {
                    title: "操作说明",
                    body: detailTipsView,
                    backdrop: 'static',
                    type: 1,
                    onHiddenCallback: function() {

                    }.bind(this)
                }
                this.nodeTipsPopup = new Modal(options);
            }.bind(this));
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
                    var refreshFlag = false
                    if (this.curDevice.get("type") != 203) {
                        this.commonPopup.$el.find("#refresh").get(0).checked
                    }
                    var options = {
                        "ids":[this.clickDeviceId],
                        "status": this.clickStatus,
                        "refreshFlag": refreshFlag
                     }

                    this.collection.modifyStatus(options);
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

            //this.collection.getDeviceStatusOpen(deviceId);

            this.commonDialog();
            this.commonPopup.$el.find('.close').hide();
            this.commonPopup.$el.find('.commonPopup').hide();
            this.onDeviceOpenSuccess()
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
            var model = this.collection.get(deviceId);

            if (this.nodeTipsPopup) $("#" + this.nodeTipsPopup.modalId).remove();
            
            require(["nodeManage.operateDetail.view"], function(NodeTips) {
                var stopNodeView = new NodeTips({
                    type: 1,
                    model: model
                });
                var options = {
                    title: "暂停设备",
                    body: stopNodeView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var options = stopNodeView.getArgs();
                        if (!options) return;
                        this.reason = options || {};
                        //this.collection.getDeviceStatusPause(deviceId);
                        this.onDevicePauseSuccess()
                    }.bind(this),
                    onHiddenCallback: function() {

                    }.bind(this)
                }
                this.nodeTipsPopup = new Modal(options);
            }.bind(this));
        },

        onDeviceOpenSuccess: function(res){
            var data = res;
            var body = '';
            if(data&&data.length > 0){
                data[0].title = '设备 '+this.name+'暂停前在下列调度关系中服务，点击确定，下列调度关系将恢复，点击取消，设备状态不会变更，是否确定？';

                this.table_modal = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:data}));
                this.table_modal.find('.table-place').html(_.template(template['tpl/ipManage/ipManage.start&pause.table.html'])({data:data}));

                this.commonPopup.$el.find('.modal-body').html(this.table_modal);
            } else {
                body = '确定要开启服务吗？请选择是否同步刷新:<br>';
                body = body + 
                    '<div class="checkbox disabled">' +
                      '<label>' +
                        '<input type="checkbox" value="" disabled checked>同步配置' +
                      '</label>' +
                    '</div>'
                this.curDevice = this.collection.get(this.clickDeviceId);
                if (this.curDevice.get("type") != 203) {
                    body = body + 
                        '<div class="checkbox">' +
                          '<label>' +
                            '<input type="checkbox" value="" id="refresh">同步刷新' +
                          '</label>' +
                        '</div>'
                }
                this.commonPopup.$el.find('.close').show();
                this.commonPopup.$el.find('.commonPopup').show();
                this.commonPopup.$el.find('h4').html('恢复设备');
                this.commonPopup.$el.find('.modal-body strong').html(body);
            }
        },

        onDevicePauseSuccess: function(res){
            var data = res;
            var body = '';
            if(data&&data.length > 0){
                this.nodeTipsPopup.$el.modal("hide");
                setTimeout(function(){
                    this.commonDialog();
                    this.commonPopup.$el.find('.close').hide();
                    this.commonPopup.$el.find('.commonPopup').hide();
                }.bind(this), 500)

                data[0].title = '设备 '+this.name+'在下列调度关系中服务，点击确定，该设备将不对下列调度关系服务，点击取消，设备状态不会改变，是否确定？';
                
                this.table_modal = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:data}));
                this.table_modal.find('.table-place').html(_.template(template['tpl/ipManage/ipManage.start&pause.table.html'])({data:data}));

                this.commonPopup.$el.find('.modal-body').html(this.table_modal);
            } else {
                // body = '确定要暂停服务吗？';
                // this.commonPopup.$el.find('.close').show();
                // this.commonPopup.$el.find('.commonPopup').show();
                // this.commonPopup.$el.find('h4').html('暂停设备');
                // this.commonPopup.$el.find('.modal-body strong').html(body);
                var options = {
                    "ids":[this.clickDeviceId],
                    "status": this.clickStatus,
                    "reason": this.reason.opRemark  
                 }
                this.collection.modifyStatus(options);
                this.nodeTipsPopup.$el.modal("hide");
            }
        },

        onSetStatusSuccess: function(data){
            var successList = [], errorList = []
            _.each(data, function(el){
                if (el.result) {
                    successList.push(el.name)
                } else {
                    errorList.push(el.name)
                }
            }.bind(this))

            var message = '';
            if (successList.length > 0)
                message = "<span class='text-success'>以下设备操作成功：</span><br>" + successList.join("<br>") + "<br>";
            if (errorList.length > 0)
                message = message +  "<span class='text-danger'>以下设备为不可用状态暂时无法操作：</span><br>" + errorList.join("<br>");
            alert(message)
            this.onClickQueryButton();
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

            require(["deviceManage.edit.view"], function(AddOrEditDeviceView) {
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
            }.bind(this));
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

            require(["deviceManage.ipManage.view"], function(IpManageView) {
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
            }.bind(this));
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

            if (this.commonPopup) $("#" + this.commonPopup.modalId).remove();
            var body = '确定要开启服务吗？请选择是否同步刷新:<br>';
            body = body + 
                '<div class="checkbox disabled">' +
                  '<label>' +
                    '<input type="checkbox" value="" disabled checked>同步配置' +
                  '</label>' +
                '</div>' +
                '<div class="checkbox">' +
                  '<label>' +
                    '<input type="checkbox" value="" id="refresh">同步刷新' +
                  '</label>' +
                '</div>'


            var options = {
                title: "警告",
                body : body,
                backdrop : 'static',
                type     : 2,
                cancelButtonText : "关闭",
                onOKCallback:  function(){
                    var args = {
                        "ids": ids,
                        "status": 1,
                        "refreshFlag": this.commonPopup.$el.find("#refresh").get(0).checked
                     }
                    this.collection.modifyStatus(args);
                    this.commonPopup.$el.modal('hide');
                }.bind(this),
                onCancelCallback: function(){
                    this.commonPopup.$el.modal('hide');
                }.bind(this)
            }

            this.commonPopup = new Modal(options);
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

            var model = this.collection.get(checkedList[0].get("id"));

            if (this.nodeTipsPopup) $("#" + this.nodeTipsPopup.modalId).remove();
            
            require(["nodeManage.operateDetail.view"], function(NodeTips) {
                var stopNodeView = new NodeTips({
                    type: 1,
                    model: model,
                    isMulti: true
                });
                var options = {
                    title: "暂停设备",
                    body: stopNodeView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var options = stopNodeView.getArgs();
                        if (!options) return;
                        var args = {
                            "ids": ids,
                            "status": 2,
                            "reason": options.opRemark  
                         }
                        this.collection.modifyStatus(args);
                        this.nodeTipsPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function() {

                    }.bind(this)
                }
                this.nodeTipsPopup = new Modal(options);
            }.bind(this));
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