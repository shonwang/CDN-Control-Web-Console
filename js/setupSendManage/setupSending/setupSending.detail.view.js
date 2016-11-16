define("setupSendDetail.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var ConfiFileDetailView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.editCfgFalse.html'])({
                data: {},
                panelId: Utility.randomStr(8)
            }));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var SendDetailView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.collection.off("et.task.doingdetail.success");
            this.collection.off("et.task.doingdetail.error");
            this.collection.on("et.task.doingdetail.success",$.proxy(this.queryDetailSuccess,this));
            this.collection.on("et.task.doingdetail.error",$.proxy(this.queryDetailError,this));
            this.queryArgs = {
                "taskId":this.model.get('taskId'),//任务ID
                "taskStepId":this.model.get('taskStepId'),//任务stepId
                "deviceName":this.model.get('deviceName'),//设备名称
                "nodeId":this.model.get('nodeId'),// "节点ID"
                "status":this.model.get('status'),// "1：执行下发中 2：下发完成 3：下发失败 4:跳过 5:忽略"
                "page"             : 1,
                "count"            : 10
            };
            this.$el = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.html'])({data: {}}));
            

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            this.initSetup();
            this.onClickQueryButton();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.deviceName = this.$el.find("#input-device").val();
            this.queryArgs.nodeId = this.$el.find("#input-node").val();
            if (this.queryArgs.deviceName == "") this.queryArgs.deviceName = null;
            if (this.queryArgs.nodeId == "") this.queryArgs.nodeId = null;

            this.$el.find(".domain-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.$el.find(".pagination").html("");
            this.collection.queryTaskDoingdetail(this.queryArgs);
        },  
            
        initSetup:function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name:"执行下发中", value:1},
                {name: "下发完成", value:2},
                {name: "下发失败", value:3},
                {name: "跳过", value:4},
                {name: "忽略", value:5}
            ],
            rootNode = this.$el.find(".dropdown-task-type");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                 if (value == "All"){
                     this.queryArgs.status = null;
                 }
                 else{
                     this.queryArgs.status = parseInt(value)
                 }
            }.bind(this));    
            

            //节点管理
            var nodeArgs={
                page:1,
                count:9999
            };
            require(['nodeManage.model'],function(NodeManageModel){
                this.nodeManageModel = new NodeManageModel();
                this.nodeManageModel.on("get.node.success", $.proxy(this.onGetNodeListSuccess, this))
                this.nodeManageModel.on("get.node.error", $.proxy(this.onGetNodeListError, this))
                this.nodeManageModel.getNodeList(nodeArgs);
            }.bind(this));
        },

        onGetNodeListSuccess:function(){
            var nodeManageModel = this.nodeManageModel;
            var nodeSelectList=[{name:"全部",value:"All"}];
            nodeManageModel.each(function(el){
                nodeSelectList.push({
                    name:el.get("chName"),
                    value:el.get("id")
                });
            });
            rootNode = this.$el.find('.dropdown-node-type');
            Utility.initDropMenu(rootNode, nodeSelectList, function(value){
                 if (value == "All"){
                     this.queryArgs.nodeId = null;
                 }
                 else{
                     this.queryArgs.nodeId = parseInt(value)
                 }
            }.bind(this));
        },

        queryDetailSuccess:function(){
            this.updatePublisDomain();
            this.updateDomainList();
        },

        updatePublisDomain: function(){
           
            var data = [{localLayer: "1111", upperLayer: "22222"}];
            this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.history.table.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find(".node-item").on("click", $.proxy(this.onClickItemDetail, this));
            
        },

        updateDomainList: function(){
            var data = [{domain: "test1.ksyun.com", id: 1}];
            this.domainList = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.domain.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".domain-ctn").html(this.domainList[0]);
            else
                this.$el.find(".domain-ctn").html(_.template(template['tpl/empty.html'])());

            this.domainList.find(".node-item").on("click", $.proxy(this.onClickItemDetail, this));
        },

        onClickItemDetail: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");
            //var model = this.collection.get(id);

            if (this.configFilePopup) $("#" + this.configFilePopup.modalId).remove();

            var myConfiFileDetailView = new ConfiFileDetailView({
                collection: this.collection, 
                //model     : model,
                isEdit    : true
            });
            var options = {
                title: "配置文件详情",//model.get("chName") + "关联调度组信息",
                body : myConfiFileDetailView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    this.configFilePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.configFilePopup = new Modal(options);
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return SendDetailView
});