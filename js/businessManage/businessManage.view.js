define("businessManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditBusinessView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.businessType = options.businessType;
            this.deviceType = options.deviceType;
            this.ipType = options.ipType;

            var data = {
                "page": 1,
                "count": 99
            };
            var tplData = {
                "name": "",
                "bisTypeName": "",
                "deviceTypeName": "",
                "bisTypeId": "",
                "deviceTypeId": "",
                "ipTypeId": "",
                "ipTypeName": ""
            };
            this.nodeListFinal = [];

            this.collection.getAddTableList(data);

            if (this.isEdit) {
                tplData.name = this.model.get("name");
                tplData.bisTypeName = this.model.get("bisTypeName");
                tplData.deviceTypeName = this.model.get("deviceTypeName");
                tplData.ipTypeName = this.model.get("ipTypeName");
                tplData.bisTypeId = this.model.get("bisTypeId");
                tplData.deviceTypeId = this.model.get("deviceTypeId");
                tplData.ipTypeId = this.model.get("ipTypeId");

            } else {
                tplData.bisTypeName = this.businessType[0].name;
                tplData.deviceTypeName = this.deviceType[0].name;
                tplData.ipTypeName = this.ipType[0].name;
                tplData.bisTypeId = this.businessType[0].value;
                tplData.deviceTypeId = this.deviceType[0].value;
                tplData.ipTypeId = this.ipType[0].value;

            }
            this.collection.off("get.addTableList.success");
            this.collection.on("get.addTableList.success", $.proxy(this.initcreateAddNodeDrop, this));
            this.$el = $(_.template(template['tpl/businessManage/businessManage.add&edit.html'])({
                data: tplData
            }));
            if (this.isEdit) {
                this.setEditTable(this.model.get("nodeList"));
            }
            this.initBusinessDropMenu();
            this.initDeviceDropMenu();
            this.initIpDropMenu();
        },
        initcreateAddNodeDrop: function(res) {
            var data = [];
            var _this = this;
            _.each(res.rows, function(el, index, list) {
                data.push({
                    name: el.chName,
                    value: el.id
                });
            });
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.select-addNode').get(0),
                panelID: this.$el.find('.btn-raised').get(0),
                // isSingle: true,
                openSearch: true,
                onOk: function(data) {
                    _this.setaddNodeTr(data);
                },
                data: data,
                callback: function(data) {}
            });
        },
        getArgs: function() {

            var nodeListFinal = [];
            $('.addOrEdit tr').each(function() {
                nodeListFinal.push($(this).attr('data-id'));
            });
            this.nodeListFinal = nodeListFinal;
            var args = {
                    "id": this.model ? this.model.get("id") : '',
                    "name": this.$el.find('#nodeGroupName').val(),
                    "oldName": this.model ? this.model.get("name") : '',
                    "bisTypeId": this.$el.find('.business-type .cur-value').attr('data-id'),
                    "deviceTypeId": this.$el.find('.device-type .cur-value').attr('data-id'),
                    "ipTypeId": this.$el.find('.ip-type .cur-value').attr('data-id'),
                    "nodeList": _.uniq(this.nodeListFinal)
                }
                //console.log(args.nodeList);
            return args;
        },

        setEditTable: function(data) {
            //console.log(data);
            if (data && data.length != 0) {
                this.table = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                    data: data
                }));
                this.$el.find(".table-ctn").html(this.table[0]);
                this.$el.find(".addOrEdit .delete").on("click", $.proxy(this.onClickItemDelete, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        setaddNodeTr: function(res) {
            var data = [];

            _.each(res, function(el, index, list) {
                data.push({
                    nodeName: el.name,
                    nodeId: el.value
                });
                //console.log(data[index].nodeName,data[index].nodeId);
            });

            if (data && data.length != 0) {
                $.proxy(this.deleteExistNode(data), this);
                if (this.$el.find(".table-ctn .addOrEdit").length == 0) { //新建
                    this.table = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                        data: data
                    }));
                    this.$el.find(".table-ctn").html(this.table[0]);
                } else {
                    this.addNode = $(_.template(template['tpl/businessManage/businessManage.addNode.html'])({
                        data: data
                    }));
                    for (var i = 0; i < this.addNode.length; i++) {
                        this.$el.find(".table-ctn .addOrEdit").prepend(this.addNode[i]);
                    }
                }
                this.$el.find(".addOrEdit .delete").on("click", $.proxy(this.onClickItemDelete, this));
            }
        },

        deleteExistNode: function(data) {
            var exitId = [];
            var addId = [];
            var _this = this;
            $('.addOrEdit tr').each(function() {
                exitId.push($(this).attr('data-id'));
            });

            _.each(data, function(el, index) {
                for (var i = 0; i < exitId.length; i++) {
                    if (el.nodeId == exitId[i]) {

                        _this.$el.find("tr[data-id=" + el.nodeId + "]").remove();
                        return;
                    }
                }
            });


        },

        initBusinessDropMenu: function() {
            var rootNode = this.$el.find(".business-type");

            Utility.initDropMenu(rootNode, this.businessType, function(value) {
                this.$el.find('.business-type .cur-value').attr('data-id', value);
            }.bind(this));
        },

        initDeviceDropMenu: function() {
            var rootNode = this.$el.find(".device-type");

            Utility.initDropMenu(rootNode, this.deviceType, function(value) {
                this.$el.find('.device-type .cur-value').attr('data-id', value);
            }.bind(this));
        },

        initIpDropMenu: function() {
            var rootNode = this.$el.find(".ip-type");

            Utility.initDropMenu(rootNode, this.ipType, function(value) {
                this.$el.find('.ip-type .cur-value').attr('data-id', value);
            }.bind(this));
        },

        onClickItemDelete: function(e) {
            var eTarget = e.srcElement || e.target, id;
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
                "business": -1,
                "device": -1
            };

            this.collection.getBusinessList(); //初始化业务列表数据
            this.collection.on("get.businessList.success", $.proxy(this.initNodeDropMenu, this));
            this.collection.getDeviceTypeList(); //初始化设备列表数据
            this.collection.on("get.device.success", $.proxy(this.getDeviceData, this));
            this.collection.getIpList(); //初始化ip列表数据
            this.collection.on("get.ipList.success", $.proxy(this.getIpData, this));

            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreateButton, this));
            this.collection.on("get.editNode.success", $.proxy(this.onEditNodeSuccess), this);

            this.collection.on("add.node.success", function() {
                alert("添加成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.node.error", $.proxy(this.onGetError, this));
            this.collection.on("edit.node.success", function() {
                alert("编辑成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("edit.node.error", $.proxy(this.onGetError, this));
        },

        getDeviceData: function(res) {
            var deviceType = [];
            _.each(res, function(el, index, list) {
                deviceType.push({
                    name: el.name,
                    value: el.id
                });
            });
            this.deviceType = deviceType;
        },

        getIpData: function(res) {
            var ipType = [];
            _.each(res.rows, function(el, index, list) {
                ipType.push({
                    name: el.name,
                    value: el.id
                });
            });
            this.ipType = ipType;
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        initNodeDropMenu: function(res) {
            var businessType = [],
                rootNode = this.$el.find(".dropdown-type");

            _.each(res, function(el, index, list) {
                businessType.push({
                    name: el.name,
                    value: el.id
                });
            });

            this.businessType = businessType;
            this.Id.business = parseInt(this.businessType[0]["value"]);
            this.$el.find('.cur-value').html(this.businessType[0]["name"]);

            Utility.initDropMenu(rootNode, this.businessType, function(value) {
                this.Id.business = parseInt(value);
                this.onClickQueryButton();
            }.bind(this));

            this.onClickQueryButton();
        },

        onClickQueryButton: function() {

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getNodeGroupList(this.Id.business);
            this.collection.on("get.nodeGroupList.success", $.proxy(this.initTable, this));
        },

        initTable: function() {

            this.table = $(_.template(template['tpl/businessManage/businessManage.table.html'])({
                data: this.collection.models
            }));

            if (this.collection.models.length !== 0) {
                this.$el.find(".table-ctn").html(this.table[0]);
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickCreateButton: function() {

            if (this.addNodePopup) $("#" + this.addNodePopup.modalId).remove();

            var addBusinessView = new AddOrEditBusinessView({
                collection: this.collection,
                isEdit: false,
                businessType: this.businessType,
                deviceType: this.deviceType,
                ipType: this.ipType
            });
            var options = {
                title: "创建节点组",
                body: addBusinessView,
                backdrop: 'static',
                type: 2,
                onOKCallback: function() {
                    var options = addBusinessView.getArgs();
                    if (!options) return;
                    this.collection.addNode(options)
                    this.addNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function() {}
            }
            this.addNodePopup = new Modal(options);
        },

        onClickItemEdit: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;

            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.editBusinessPopup) $("#" + this.editBusinessPopup.modalId).remove();

            var editBusinessView = new AddOrEditBusinessView({
                collection: this.collection,
                model: model,
                isEdit: true,
                businessType: this.businessType,
                deviceType: this.deviceType,
                ipType: this.ipType
            });

            var options = {
                title: "编辑节点组",
                body: editBusinessView,
                backdrop: 'static',
                type: 2,
                onOKCallback: function() {
                    var options = editBusinessView.getArgs();
                    if (!options) return;
                    var len = this.editBusinessPopup.$el.find('.addOrEdit').children().length;
                    if(len < 1){
                        alert('请添加节点');
                    }else{
                        this.collection.editNode(options);
                        this.editBusinessPopup.$el.modal("hide");
                    }
                }.bind(this),
                onHiddenCallback: function() {}
            }

            this.editBusinessPopup = new Modal(options);
        },

        hide: function() {
            this.$el.hide();
        },

        update: function() {
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return BusinessManageView;
});