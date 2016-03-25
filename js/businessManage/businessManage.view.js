define("businessManage.view", ['require','exports', 'template', 'modal.view', 'utility','searchSelect'], function(require, exports, template, Modal, Utility,SearchSelect) {
    
    var AddOrEditBusinessView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit     = options.isEdit;
            this.model      = options.model; 
            this.businessType = options.businessType;
            this.deviceType = options.deviceType;
            this.ipType = options.ipType;
            this.editEndData = options.editEndData;

            var data = {
                "page":1,
                "count":99
            };
            var tplData = {
                "name":"",
                "bisTypeName":"",
                "deviceTypeName":"",
                "bisTypeId":"",
                "deviceTypeId":"",
                "ipTypeId":"",
                "ipTypeName":""
            };
            this.nodeList = [];

            this.collection.getAddTableList(data);

            if(this.isEdit){
                tplData.name = this.editEndData.name;
                tplData.bisTypeName = this.editEndData.busName;
                tplData.deviceTypeName = this.editEndData.devName;
                tplData.ipTypeName = this.editEndData.ipName;
                tplData.bisTypeId = this.editEndData.busId;
                tplData.deviceTypeId = this.editEndData.devId;
                tplData.ipTypeId = this.editEndData.ipId;

                this.collection.on("get.addTableList.success", $.proxy(this.getAddEditNodeSuccess, this));
            }else{
                tplData.bisTypeName = this.businessType[0].name;
                tplData.deviceTypeName = this.deviceType[0].name;
                tplData.ipTypeName = this.ipType[0].name;
                tplData.bisTypeId = this.businessType[0].value;
                tplData.deviceTypeId = this.deviceType[0].id;
                tplData.ipTypeId = this.ipType[0].id;

            }
            this.collection.on("get.addTableList.success", $.proxy(this.initcreateAddNodeDrop, this));
            this.$el = $(_.template(template['tpl/businessManage/businessManage.add&edit.html'])({data:tplData}));
            this.initBusinessDropMenu();
            this.initDeviceDropMenu();
            this.initIpDropMenu();
        },
        initcreateAddNodeDrop: function(res){
            var data = [];
            var data1 = [];
            var _this = this;
            _.each(res.rows, function(el, index, list){
                data.push({name: el.chName, value:el.id});
            });
            var searchSelect = new SearchSelect({
                containerID : this.$el.find('.select-addNode').get(0),
                panelID : this.$el.find('.btn-raised').get(0),
                openSearch:true,
                onOk:function(data){
                    //console.log(data);
                    _.each(data, function(el, index, list){
                        data1.push({chName: el.name, id:el.value});
                    });
                    _this.getAddEditNodeSuccess(data1);
                },
                data:data,
                callback:function(data){
                    //console.log(data);
                }
            });
        },
        getArgs: function(){
            var nodeList = [];
            $('.addOrEdit tr').each(function(){
                nodeList.push($(this).attr('data-id'));
            });
            this.nodeList = nodeList;
            var args = {
                "id": this.editEndData?this.editEndData.id:'',
                "name":this.$el.find('#nodeGroupName').val(),
                "oldName":this.editEndData?this.editEndData.name:'',
                "bisTypeId":this.$el.find('.business-type .cur-value').attr('data-id'),
                "deviceTypeId":this.$el.find('.device-type .cur-value').attr('data-id'),
                "ipTypeId":this.$el.find('.ip-type .cur-value').attr('data-id'),
                "nodeList":this.nodeList
            }
            return args;
        },

        getAddEditNodeSuccess: function(res){ //初始化节点列表以及添加节点
            var resData = [];
            if(res.rows){
                resData = res.rows;
            }else{
                resData = res;
            }

            

            if (resData && resData.length != 0){
                if(this.$el.find(".table-ctn .addOrEdit").length == 0){//新建
                    this.table = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({data: resData}));
                    this.$el.find(".table-ctn").html(this.table[0]);
                }else{
                    this.addNode = $(_.template(template['tpl/businessManage/businessManage.addNode.html'])({data: resData}));
                    this.$el.find(".table-ctn .addOrEdit").prepend(this.addNode[0]);
                }
                this.$el.find(".addOrEdit .delete").on("click", $.proxy(this.onClickItemDelete, this));
            }else{
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        initBusinessDropMenu: function(){
            var rootNode = this.$el.find(".business-type");

            Utility.initDropMenu(rootNode, this.businessType, function(value){
                this.$el.find('.business-type .cur-value').attr('data-id',value);
            }.bind(this));
        },

        initDeviceDropMenu: function(){
            var rootNode = this.$el.find(".device-type");

            Utility.initDropMenu(rootNode, this.deviceType, function(value){
                this.$el.find('.device-type .cur-value').attr('data-id',value);
            }.bind(this));
        },

        initIpDropMenu: function(){
            var rootNode = this.$el.find(".ip-type");

            Utility.initDropMenu(rootNode, this.ipType, function(value){
                this.$el.find('.ip-type .cur-value').attr('data-id',value);
            }.bind(this));
        },

        onClickItemDelete: function(e){
            var eTarget = e.srcElement || e.target,id;
            $(eTarget).parents('tr').remove(); //删除当前行
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var BusinessManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.flag = 0;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/businessManage/businessManage.html'])());

            this.businessType = [];
            this.deviceType = [];
            this.ipType = [];
            this.Id = {
                "business":-1,
                "device":-1
            };

            this.editEndData = [];

            this.collection.getBusinessList(); //初始化业务列表数据
            this.collection.on("get.businessList.success", $.proxy(this.initNodeDropMenu, this));
            this.collection.getDeviceTypeList();//初始化设备列表数据
            this.collection.on("get.device.success", $.proxy(this.getDeviceData, this));
            this.collection.getIpList();//初始化ip列表数据
            this.collection.on("get.ipList.success", $.proxy(this.getIpData, this));

            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreateButton, this));
            this.collection.on("get.editNode.success", $.proxy(this.onEditNodeSuccess), this);

            this.collection.on("add.node.success", function(){
                alert("添加成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.node.error", $.proxy(this.onGetError, this));
            this.collection.on("edit.node.success", function(){
                alert("编辑成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("edit.node.error", $.proxy(this.onGetError, this));
        },

        getDeviceData: function(res){
            var deviceType = [];
            _.each(res, function(el, index, list){
                deviceType.push({name: el.name, value:el.id});
            });
            this.deviceType = deviceType;
        },

        getIpData: function(res){
            var ipType = [];
            _.each(res.rows, function(el, index, list){
                ipType.push({name: el.name, value:el.id});
            });
            this.ipType = ipType;
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        initNodeDropMenu: function(res){
            var businessType = [],
            rootNode = this.$el.find(".dropdown-type");

            _.each(res, function(el, index, list){
                businessType.push({name: el.name, value:el.id});
            });

            this.businessType = businessType;
            this.Id.business = parseInt(this.businessType[0]["value"]);
            this.$el.find('.cur-value').html(this.businessType[0]["name"]);

            Utility.initDropMenu(rootNode, this.businessType, function(value){
                this.Id.business = parseInt(value);
                this.onClickQueryButton();
            }.bind(this));

            this.onClickQueryButton();
        },

        onClickQueryButton: function(){

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getNodeGroupList(this.Id.business);
            this.collection.on("get.nodeGroupList.success", $.proxy(this.initTable, this));
        },

        initTable:function(){

            this.table = $(_.template(template['tpl/businessManage/businessManage.table.html'])({data:this.collection.models}));

            if (this.collection.models.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickCreateButton: function(){

            if (this.addNodePopup) $("#" + this.addNodePopup.modalId).remove();

            var addBusinessView = new AddOrEditBusinessView({
                collection: this.collection,
                isEdit    : false,
                businessType: this.businessType,
                deviceType: this.deviceType,
                ipType: this.ipType
            });
            var options = {
                title:"创建组",
                body : addBusinessView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = addBusinessView.getArgs();
                    if (!options) return;
                    this.collection.addNode(options)
                    this.addNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.addNodePopup = new Modal(options);
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target,id;

            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.editBusinessPopup) $("#" + this.editBusinessPopup.modalId).remove();

            if(!this.flag){
                this.editEndData = {
                    'id' : id,
                    'name': model.attributes.name,
                    'busId':model.attributes.bisTypeId,
                    'busName':model.attributes.bisTypeName,
                    'devId':model.attributes.deviceTypeId,
                    'devName':model.attributes.deviceTypeName,
                    'ipId':model.attributes.ipTypeName,
                    'ipName':model.attributes.ipTypeId
                }
            }

            var editBusinessView = new AddOrEditBusinessView({
                collection: this.collection, 
                model     : model,
                isEdit    : true,
                businessType: this.businessType,
                deviceType: this.deviceType,
                ipType: this.ipType,
                editEndData: this.editEndData
            });

            var options = {
                title:"编辑组",
                body : editBusinessView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = editBusinessView.getArgs();
                    if (!options) return;
                    this.collection.editNode(options);
                    this.onEditNodeSuccess(id);
                    this.editBusinessPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }

            this.editBusinessPopup = new Modal(options);
        },

        onEditNodeSuccess: function(id){
            this.flag = 1;
            this.editEndData.id = id;
            this.editEndData.name = this.editBusinessPopup.$el.find('#nodeGroupName').val();

            this.editEndData.busId = this.editBusinessPopup.$el.find('#dropdown-business').children().eq(0).attr('data-id');
            this.editEndData.busName = this.editBusinessPopup.$el.find('#dropdown-business').children().eq(0).html();
            this.editEndData.devId = this.editBusinessPopup.$el.find('#dropdown-device').children().eq(0).attr('data-id');
            this.editEndData.devName = this.editBusinessPopup.$el.find('#dropdown-device').children().eq(0).html();
            this.editEndData.ipId = this.editBusinessPopup.$el.find('#dropdown-ip').children().eq(0).attr('data-id');
            this.editEndData.ipName = this.editBusinessPopup.$el.find('#dropdown-ip').children().eq(0).html();
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

    return BusinessManageView;
});