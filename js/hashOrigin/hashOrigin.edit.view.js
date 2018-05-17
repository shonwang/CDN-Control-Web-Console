define("hashOrigin.edit.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditHashOriginView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit     = options.isEdit;
            this.model      = options.model;
            this.deviceTypeArray = options.deviceTypeArray;
            this.isLoading = true;

            this.$el = $(_.template(template['tpl/hashOrigin/hashOrigin.add&edit.html'])({}));
            this.defaultParam = {
                "id": null,
                "name": "",
                "selectedNodes": []
            }
            if(this.isEdit){
                this.defaultParam = {
                    "id": this.model.get("id"),
                    "name": this.model.get("name"),
                    "selectedNodes": this.model.get("nodeList")
                }                
            }        
            this.$el.find(".add-node").on("click",$.proxy(this.onClickAddNode,this));

            
            //this.initIpTypeDropmenu();
        },

        onClickAddNode:function(){
            require(['hashOrigin.selectNode.view'], function(SelectNodeView) {
                if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

                var mySelectNodeView = new SelectNodeView({
                    collection: this.collection,
                    selectedNodes: this.defaultParam.selectedNodes,
                });
                var options = {
                    title: "选择节点",
                    body: mySelectNodeView,
                    backdrop: 'static',
                    type: 2,
                    width: 800,
                    onOKCallback: function() {
                        this.defaultParam.selectedNodes = mySelectNodeView.getArgs();
                        this.selectNodePopup.$el.modal("hide");
                        this.initNodeTable();
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.selectNodePopup = new Modal(options);
            }.bind(this))            
        },

        initNodeTable:function(){
            
            if(this.defaultParam.selectedNodes.length>0){
                this.table = $(_.template(template['tpl/hashOrigin/hashOrigin.nodeList.table.html'])({data:this.defaultParam.selectedNodes}));
            }
            else{
                this.table = _.template(template['tpl/empty.html'])();
            }
            this.$el.find("#hash-node-list").html(this.table);
            if(this.defaultParam.selectedNodes.length>0){
                this.table.find(".maxBandwidth-input").on("blur",$.proxy(this.onMaxBandwidthInputBlur,this));
            }
        },

        onMaxBandwidthInputBlur:function(event){
            var eventTarget = event.target || event.srcElement;
            var id = $(eventTarget).attr('data-id');
            console.log(id);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onDeleteIpError: function(){},

        onGetNodeError: function(){},

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