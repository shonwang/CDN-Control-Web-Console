define("setupSendDetail.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var ConfiFileDetailView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;

            require(['setupSendWaitCustomize.model'], function(SetupSendWaitCustomizeModel){
                this.mySetupSendWaitCustomizeModel = new SetupSendWaitCustomizeModel();

                if (this.model.isCustom) {
                    this.mySetupSendWaitCustomizeModel.off("get.all.config.success");
                    this.mySetupSendWaitCustomizeModel.off("get.all.config.error");
                    this.mySetupSendWaitCustomizeModel.on("get.all.config.success", $.proxy(this.initSetup, this));
                    this.mySetupSendWaitCustomizeModel.on("get.all.config.error", $.proxy(this.onGetError, this));
                    this.mySetupSendWaitCustomizeModel.getAllConfig({
                        domain: this.model.domain,
                        version: this.model.domainVersion,
                        manuallyModifed: true
                    })
                } else {
                    this.mySetupSendWaitCustomizeModel.off("get.channel.config.success");
                    this.mySetupSendWaitCustomizeModel.off("get.channel.config.error");
                    this.mySetupSendWaitCustomizeModel.on("get.channel.config.success", $.proxy(this.initSetup, this));
                    this.mySetupSendWaitCustomizeModel.on("get.channel.config.error", $.proxy(this.onGetError, this));
                    this.mySetupSendWaitCustomizeModel.getChannelConfig({
                        domain: this.model.domain,
                        version: this.model.domainVersion,
                    })
                }
            }.bind(this));
        },

        initSetup: function(data){
            var configObj = this.getConfigObj(data);

            if (configObj.up.length === 0 && configObj.down.length === 0){
                this.$el = $(_.template(template['tpl/empty-2.html'])({data:{message: "暂无数据！"}}));
            } else {
                this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.editCfgFalse.html'])({
                    data: configObj,
                    panelId: Utility.randomStr(8)
                })); 
            }

            this.$el.appendTo(this.target);
        },

        getConfigObj: function(data){
            var upArray = [], downArray = [];

            _.each(data, function(el, key, ls){
                if (key !== "applicationType"){
                    _.each(el, function(fileObj, index, list){
                        if (fileObj&&fileObj.topologyLevel === 1){
                            upArray.push({
                                id: fileObj.id,
                                name: key,
                                content: fileObj.content,
                                luaOnly: fileObj.luaOnly === undefined ? true : fileObj.luaOnly
                            })
                        } else if (fileObj&&fileObj.topologyLevel === 2){
                            downArray.push({
                                id: fileObj.id,
                                name: key,
                                content: fileObj.content,
                                luaOnly: fileObj.luaOnly === undefined ? true : fileObj.luaOnly
                            })
                        }
                    }.bind(this))
                }
            }.bind(this))

            return {up: upArray, down: downArray}
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.target = target;
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
            this.isSending  = options.isSending;

            this.$el = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.html'])({data: {}}));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            if (this.isSending) {
                this.collection.on("get.task.doingdetail.success",$.proxy(this.queryDetailSuccess,this));
                this.collection.on("get.task.doingdetail.error",$.proxy(this.onGetError,this));
                this.collection.on("get.ingoredevice.success",$.proxy(this.onSkipSuccess,this));
                this.collection.on("get.ingoredevice.error",$.proxy(this.onGetError,this));

                this.queryArgs = {
                    "taskId" : this.model.get('taskId'),//任务ID
                    "taskStepId" : this.model.get('taskStepId'),//任务stepId
                    "deviceName" : null,
                    "nodeId": null,// "节点ID"
                    "status": null,
                    "page": 1,
                    "count": 10
                };
            } else {
                this.collection.on("get.task.donedetail.success",$.proxy(this.queryDetailSuccess,this));
                this.collection.on("get.task.donedetail.error",$.proxy(this.onGetError,this));

                this.queryArgs = {
                    "taskId" : this.model.get('taskId'),//任务ID
                    "deviceName" : null,
                    "nodeId": null,// "节点ID"
                    "status": null,
                    "page": 1,
                    "count": 10
                };
            }

            this.initSetup();
            this.onClickQueryButton();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.deviceName = this.$el.find("#input-device").val();
            if (this.queryArgs.deviceName == "") this.queryArgs.deviceName = null;

            this.$el.find(".domain-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.$el.find(".pagination").html("");
            if (this.isSending)
                this.collection.queryTaskDoingDetail(this.queryArgs);
            else
                this.collection.queryTaskDoneDetail(this.queryArgs);
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
                if (value == "All")
                    this.queryArgs.status = null;
                else
                    this.queryArgs.status = parseInt(value)
            }.bind(this));    
            
            //节点管理
            require(['nodeManage.model'],function(NodeManageModel){
                this.nodeManageModel = new NodeManageModel();
                this.nodeManageModel.on("get.node.success", $.proxy(this.onGetNodeListSuccess, this))
                this.nodeManageModel.on("get.node.error", $.proxy(this.onGetNodeListError, this))
                this.nodeManageModel.getNodeList({page: 1,count: 9999});
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

        onGetNodeListSuccess:function(){
            var nodeManageModel = this.nodeManageModel;
            var nodeSelectList = [{name:"全部",value:"All"}];
            nodeManageModel.each(function(el){
                nodeSelectList.push({
                    name:el.get("chName"),
                    value:el.get("id")
                });
            });

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-node').get(0),
                panelID: this.$el.find('#dropdown-node').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function(){},
                data: nodeSelectList,
                callback: function(data) {
                    if (data.value == "All")
                        this.queryArgs.nodeId = null;
                    else
                        this.queryArgs.nodeId = parseInt(data.value)
                    this.$el.find('#dropdown-node .cur-value').html(data.name)
                }.bind(this)
            });
        },

        queryDetailSuccess:function(){
            this.initDeviceTable();
            this.updateDomainList();
            if (!this.isInitPaginator) this.initPaginator();
        },

        initDeviceTable: function(){
            data = this.collection.models;

            this.table = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.table.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            if (this.isSending)
                this.table.find(".skip").on("click", $.proxy(this.onClickItemSkip, this));
            else
                this.table.find(".skip").hide();
            
        },

        updateDomainList: function(){
            _.each(this.collection.deliveryDomains, function(el, index, ls){
                el.id = Utility.randomStr(16)
            }.bind(this))

            this.domainList = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.domain.html'])({
                data: this.collection.deliveryDomains, 
            }));
            if (this.collection.deliveryDomains.length !== 0)
                this.$el.find(".domain-ctn").html(this.domainList[0]);
            else
                this.$el.find(".domain-ctn").html(_.template(template['tpl/empty.html'])());

            this.domainList.find(".node-item").on("click", $.proxy(this.onClickItemDetail, this));
        },

        onClickItemSkip: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            //?taskStepId={任务StepID}&deviceName={设备名称}&deviceId={设备ID}
            this.collection.ingoreDevice({
                taskStepId: this.model.get('taskStepId'),
                deviceName: this.collection.get(id).get("deviceName"),
                deviceId: id
            })
        },

        onSkipSuccess: function(){
            this.onClickQueryButton();
            alert("跳过成功")
        },

        onClickItemDetail: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var clickedObj = _.find(this.collection.deliveryDomains, function(obj){
                return obj.id === id;
            })

            if (this.configFilePopup) $("#" + this.configFilePopup.modalId).remove();

            var myConfiFileDetailView = new ConfiFileDetailView({
                collection: this.collection, 
                model     : clickedObj
            });
            var options = {
                title: "配置文件详情",
                body : myConfiFileDetailView,
                backdrop : 'static',
                type     : 1,
                onOKCallback:  function(){
                    this.configFilePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.configFilePopup = new Modal(options);
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
                        this.collection.querySendingChannel(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
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