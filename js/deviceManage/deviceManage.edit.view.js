define("deviceManage.edit.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditDeviceView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit     = options.isEdit;
            this.model      = options.model;
            this.deviceTypeArray = options.deviceTypeArray;
            this.isLoading = true;

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
            this.isLoading = false; 
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
            this.isLoading = false;
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
            if (this.isLoading) {
                alert("请等待节点加载完毕再点确定！")
                return;
            }

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

    return AddOrEditDeviceView;
});