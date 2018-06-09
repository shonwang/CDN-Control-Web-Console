define("hashOrigin.edit.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditHashOriginView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit     = options.isEdit;
            this.model      = options.model || null;
            this.parent = options.obj;
            this.deviceTypeArray = options.deviceTypeArray;
            this.isLoading = true;
            this.canAddNode = true;

            this.collection.off("get.hashInfo.success");
            this.collection.off("get.hashInfo.error");
            this.collection.off("add.hashOrigin.success");
            this.collection.off("add.hashOrigin.error");
            this.collection.off("modify.hashOrigin.success");
            this.collection.off("modify.hashOrigin.error");
            this.collection.on("get.hashInfo.success",$.proxy(this.onGetHashInfoSuccess,this));
            this.collection.on("get.hashInfo.error",$.proxy(this.onGetError,this));

            this.collection.on("add.hashOrigin.success",$.proxy(this.onAddHashInfoSuccess,this));
            this.collection.on("add.hashOrigin.error",$.proxy(this.onGetError,this));

            this.collection.on("modify.hashOrigin.success",$.proxy(this.onModifyHashInfoSuccess,this));
            this.collection.on("modify.hashOrigin.error",$.proxy(this.onGetError,this));

            this.defaultParam = {
                "id": null,
                "name": "",
                type:202,
                autoFlag:1,
                autoFlagName:'',
                isMulti:0,
                typeName:'',
                "hashNodeList": []
            }
            if(this.isEdit){
                this.stopAddNode();
                this.defaultParam = {
                    "id": this.model.get("id"),
                    "name": this.model.get("name"),
                    type:this.model.get("type"),
                    isMulti:this.model.get("isMulti"),
                    autoFlag:this.model.get('autoFlag'),
                    autoFlagName:this.autoFlagName[this.model.get('autoFlag')],
                    isMultiName:this.isMultiName[this.model.get('isMulti')],
                    typeName:this.typeNameList[this.model.get("type")],
                    "hashNodeList":[]
                }
                this.collection.getHashInfoById(this.defaultParam.id);            
            }     
            this.$el = $(_.template(template['tpl/hashOrigin/hashOrigin.add&edit.html'])({data:this.defaultParam}));   
            this.$el.find(".add-node").on("click",$.proxy(this.onClickAddNode,this));
            this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onSave, this));
            this.$el.find(".cancel").on("click",$.proxy(this.onCancelClick,this));
            this.initDropMenu();

            
            //this.initIpTypeDropmenu();
        },

        onAddHashInfoSuccess:function(){
            this.onModifyHashInfoSuccess();
        },

        typeNameList:{
            202:"Cache",
            203:"Live"
        },

        autoFlagName:{
            1:"允许",
            0:"不允许"
        },

        isMultiName:{
            0:"否",
            1:"是"
        },

        onGetHashInfoSuccess:function(){
            this.onCancelClick();
            this.parent.resetPageAndQuery();
        },

        onModifyHashInfoSuccess:function(){
            this.onCancelClick();
            this.parent.resetPageAndQuery();
        },

        onSave:function(){
            this.defaultParam.name = this.$el.find("#input-name").val().trim();
            if(!this.defaultParam.name){
                Utility.alerts("请填名称");
                return false;
            }
            if(this.defaultParam.hashNodeList.length == 0){
                Utility.alerts("请选择至少一个节点名称");
                return false;
            }
            if(this.isEdit){
                this.collection.modifyHashOrigin(this.defaultParam);
            }
            else{
                this.collection.addHashOrigin(this.defaultParam);
            }
        },

        onGetHashInfoSuccess:function(res){
            _.each(res.hashNodeList,function(el){
                el.name = el.nodeName;
            });
            this.defaultParam.hashNodeList = res.hashNodeList;
            this.initNodeTable();
            this.openAddNode();
        },

        stopAddNode:function(){
            this.canAddNode = false;
            this.$el.find(".add-node").attr("disabled","disabled");
        },

        openAddNode:function(){
            this.canAddNode = true;
            this.$el.find(".add-node").removeAttr("disabled");
        },

        onCancelClick: function() {
            this.destroy();
            this.parent.showList();
        },        

        destroy: function() {
            this.$el.remove();
        },

        onClickAddNode:function(){
            if(!this.canAddNode){
                return false;
            }
            require(['hashOrigin.selectNode.view'], function(SelectNodeView) {
                if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

                var mySelectNodeView = new SelectNodeView({
                    collection: this.collection,
                    selectedNodes: this.defaultParam.hashNodeList,
                });
                var options = {
                    title: "选择节点",
                    body: mySelectNodeView,
                    backdrop: 'static',
                    type: 2,
                    width: 800,
                    onOKCallback: function() {
                        this.defaultParam.hashNodeList = mySelectNodeView.getArgs();
                        this.selectNodePopup.$el.modal("hide");
                        this.changeToObj();
                        this.changeToArray();
                        this.initNodeTable();
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.selectNodePopup = new Modal(options);
            }.bind(this))            
        },

        initNodeTable:function(){
            if(this.defaultParam.hashNodeList.length>0){
                this.table = $(_.template(template['tpl/hashOrigin/hashOrigin.nodeList.table.html'])({data:this.defaultParam.hashNodeList}));
            }
            else{
                this.table = _.template(template['tpl/empty.html'])();
            }
            this.$el.find("#hash-node-list").html(this.table);
            if(this.defaultParam.hashNodeList.length>0){
                this.table.find(".maxBandwidth-input").on("blur",$.proxy(this.onMaxBandwidthInputBlur,this));
                this.table.find(".delete").on("click",$.proxy(this.onDeleteNode,this));
            }
        },

        onMaxBandwidthInputBlur:function(event){
            var eventTarget = event.target || event.srcElement;
            var id = $(eventTarget).attr('data-id');
            this.changeToObj();
            this.selectedObj[id].weight = $(eventTarget).val();
            this.changeToArray();
        },

        onDeleteNode:function(event){
            var eventTarget = event.target || event.srcElement;
            var id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            this.changeToObj();
            delete this.selectedObj[id];
            this.changeToArray();
            this.initNodeTable();
        },

        changeToObj:function(){
            var hashNodeList = this.defaultParam.hashNodeList;
            var obj = {};
            for(var i=0;i<hashNodeList.length;i++){
                obj[hashNodeList[i]["id"]] = hashNodeList[i];
            }
            this.selectedObj = obj;
        },

        changeToArray:function(){
            var selectedObj = this.selectedObj;
            var arr = [];
            for(var i in selectedObj){
                arr.push(selectedObj[i]);
            }
            this.defaultParam.hashNodeList = arr;
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onDeleteIpError: function(){},

        onGetNodeError: function(){},

        initDropMenu: function(res){
            var typeArray = [
                {name:"Cache",value:202},
                {name:"Live",value:203}
            ];
            var flagArray = [
                {name:"允许",value:1},
                {name:"不允许",value:0}
            ];

            var isMultiArray = [
                {name:"否",value:0},
                {name:"是",value:1}
            ];            

            Utility.initDropMenu(this.$el.find(".dropdown-hash-type"), typeArray, function(value){
                this.defaultParam.type = parseInt(value);
            }.bind(this));

            Utility.initDropMenu(this.$el.find(".dropdown-auto-dispatch"), flagArray, function(value){
                this.defaultParam.autoFlag = parseInt(value);
            }.bind(this));

            Utility.initDropMenu(this.$el.find(".dropdown-is-multi"), isMultiArray, function(value){
                this.defaultParam.isMulti = parseInt(value);
            }.bind(this));            
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

    return AddOrEditHashOriginView;
});