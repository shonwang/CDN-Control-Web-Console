define("businessManage.view", ['require','exports', 'template', 'modal.view', 'utility','searchSelect'], function(require, exports, template, Modal, Utility,SearchSelect) {
    
    var AddOrEditBusinessView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit     = options.isEdit;
            this.model      = options.model; 
            this.businessType = options.businessType;
            this.deviceType = options.deviceType;

            var data = {
                "page":1,
                "count":99
            };
            var tplData = {
                "name":"",
                "bisTypeName":"",
                "deviceTypeName":"",
                "bisTypeId":"",
                "deviceTypeId":""
            };
            this.nodeList = [];

            this.collection.getAddTableList(data);

            if(this.isEdit){

                tplData.name = this.model.attributes.name;
                tplData.bisTypeName = this.model.attributes.bisTypeName;
                tplData.deviceTypeName = this.model.attributes.deviceTypeName;
                tplData.bisTypeId = this.model.attributes.bisTypeId;
                tplData.deviceTypeId = this.model.attributes.deviceTypeId;

                this.collection.on("get.addTableList.success", $.proxy(this.getAddEditNodeSuccess, this));
            }else{
                tplData.bisTypeName = this.businessType[0].name;
                tplData.deviceTypeName = this.deviceType[0].name;
                tplData.bisTypeId = this.businessType[0].value;
                tplData.deviceTypeId = this.deviceType[0].id;

                this.collection.on("get.addTableList.success", $.proxy(this.initcreateAddNodeDrop, this));
            }
            this.$el = $(_.template(template['tpl/businessManage/businessManage.add&edit.html'])({data:tplData}));
            this.initBusinessDropMenu();
            this.initDeviceDropMenu();

        },
        initcreateAddNodeDrop: function(res){
            var data = [];
            var data1 = [];
            var _this = this;
            _.each(res.rows, function(el, index, list){
                data.push({name: el.chName, value:el.id});
                data1.push({name: el.chName, id:el.id});
            });
            var searchSelect = new SearchSelect({
                containerID : this.$el.find('.select-addNode').get(0),
                panelID : this.$el.find('.btn-raised').get(0),
                openSearch:true,
                onOk:function(data){
                    //console.log(JSON.stringify(data));
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
                "id": this.model?this.model.id:"",
                "name":this.$el.find("#nodeGroupName").val(),
                "oldName":this.model?this.model.attributes.name:"",
                "bisTypeId":this.$el.find('.business-type .cur-value').attr('data-id'),
                "deviceTypeId":this.$el.find('.device-type .cur-value').attr('data-id'),
                "nodeList":this.nodeList
            }
            return args;
        },

        getAddEditNodeSuccess: function(res){

            this.table = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({data: res.rows}));

            if (res.rows.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);
            }else{
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }

            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));

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
            //this.bisTypeId = 1;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/businessManage/businessManage.html'])());

            this.businessType = [];
            this.deviceType = [];
            this.Id = {
                "business":-1,
                "device":-1
            };

            this.collection.getBusinessList(); //初始化业务列表数据
            this.collection.on("get.businessList.success", $.proxy(this.initNodeDropMenu, this));
            this.collection.getDeviceTypeList();//初始化设备列表数据
            this.collection.on("get.device.success", $.proxy(this.getDeviceData, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreateButton, this));
            this.collection.on("get.editNode.success", $.proxy(this.onEditNodeSuccess), this);

        },

        getDeviceData: function(res){
            var deviceType = [];
            _.each(res, function(el, index, list){
                deviceType.push({name: el.name, value:el.id});
            });
            this.deviceType = deviceType;
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
                deviceType: this.deviceType
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

            var editBusinessView = new AddOrEditBusinessView({
                collection: this.collection, 
                model     : model,
                isEdit    : true,
                businessType: this.businessType,
                deviceType: this.deviceType

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
            var reviewData = {
                "name": ""
            };
            reviewData.name = this.editBusinessPopup.$el.find('#nodeGroupName').val();
            $("tr[data-id="+id+"]").children().eq(0).html(reviewData.name);
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