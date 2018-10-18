define("setupSending.detail.view", ['require','exports', 'template', 'modal.view', 'utility', "react", "react-dom"], 
    function(require, exports, template, Modal, Utility, React, ReactDOM) {
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
                        manuallyModifed: true,
                        applicationType: this.model.platformId
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
                Utility.alerts(error.message)
            else
                Utility.alerts("网络阻塞，请刷新重试！")
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
            this.$el.find(".opt-ctn .query").on("click", function(){
                this.curPage = 1;
                this.onClickQueryButton();
            }.bind(this));

            this.curPage = 1;

            if (this.isSending) {
                this.collection.on("get.task.doingdetail.success",$.proxy(this.queryDetailSuccess,this));
                this.collection.on("get.task.doingdetail.error",$.proxy(this.onGetError,this));
                this.collection.on("get.ingoredevice.success",$.proxy(this.onSkipSuccess,this));
                this.collection.on("get.ingoredevice.error",$.proxy(this.onGetSkipError,this));
                this.$el.find(".multi-skip").on("click", $.proxy(this.onClickMultiSkipButton, this));
                this.queryArgs = {
                    "taskId" : this.model.get('taskId'),//任务ID
                    "taskStepId" : this.model.get('taskStepId'),//任务stepId
                    "deviceName" : null,
                    "nodeId": null,// "节点ID"
                    "status": 1,
                    "page": this.curPage,
                    "count": 10
                };
            } else {
                this.collection.on("get.task.donedetail.success",$.proxy(this.queryDetailSuccess,this));
                this.collection.on("get.task.donedetail.error",$.proxy(this.onGetError,this));
                this.$el.find(".multi-skip").remove();
                this.queryArgs = {
                    "taskId" : this.model.get('taskId'),//任务ID
                    "deviceName" : null,
                    "nodeId": null,// "节点ID"
                    "status": 1,
                    "page": this.curPage,
                    "count": 10
                };
            }

            this.initSetup();
            this.onClickQueryButton();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = this.curPage;
            this.queryArgs.deviceName = this.$el.find("#input-device").val().trim();
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
                this.curPage = 1;
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
            this.$el.find(".multi-skip").attr("disabled", "disabled");
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

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
        },

        onClickMultiSkipButton: function(){
            this.isMultiSkip = true;
            this.skipList = _.filter(this.collection.models, function(el){
                return el.get("isChecked") === true && (el.get("status") === 1 || el.get("status") === 3);
            }.bind(this))

            this.showDisablePopup();

            var postParam = [];
            _.each(this.skipList, function(el){
                postParam.push({
                    taskStepId: this.model.get('taskStepId'),
                    deviceId: el.get('id')
                })
            }.bind(this))

            this.collection.batchIgnoreDevice(postParam);
        },

        showDisablePopup: function() {
            if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
            var options = {
                title    : "警告",
                body     : '<div class="alert alert-danger"><strong>服务器正在努力跳过...</strong></div>',
                backdrop : 'static',
                type     : 0,
            }
            this.disablePopup = new Modal(options);
            this.disablePopup.$el.find(".close").remove();
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
                this.$el.find(".multi-skip").attr("disabled", "disabled");
            } else {
                this.$el.find(".multi-skip").removeAttr("disabled", "disabled");
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
                this.$el.find(".multi-skip").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".multi-skip").attr("disabled", "disabled");
            }
        },

        updateDomainList: function(){
            _.each(this.collection.deliveryDomains, function(el, index, ls){
                el.id = Utility.randomStr(16),
                el.platformId = this.model.get("platformId")
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
            var result = confirm("跳过后设备的配置下发状态将不会统计在下发结果内，不再影响下发进度，是否确定跳过？")
            if (!result) return
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var postParam = [{
                taskStepId: this.model.get('taskStepId'),
                deviceId: id
            }]
            this.collection.batchIgnoreDevice(postParam)
        },

        onSkipSuccess: function(){
            if (this.isMultiSkip) {
                this.isMultiSkip = false;
                this.disablePopup&&this.disablePopup.$el.modal('hide');
            }
            this.onClickQueryButton();
            Utility.alerts("跳过成功！", "success", 3000)
            this.onClickQueryButton();
        },

        onClickItemDetail: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var clickedObj = _.find(this.collection.deliveryDomains, function(obj){
                return obj.id === id;
            })

            // if (this.configFilePopup) $("#" + this.configFilePopup.modalId).remove();

            // var myConfiFileDetailView = new ConfiFileDetailView({
            //     collection: this.collection, 
            //     model     : clickedObj
            // });
            // var options = {
            //     title: "配置文件详情",
            //     body : myConfiFileDetailView,
            //     backdrop : 'static',
            //     type     : 1,
            //     onOKCallback:  function(){
            //         this.configFilePopup.$el.modal("hide");
            //     }.bind(this),
            //     onHiddenCallback: function(){}.bind(this)
            // }
            // this.configFilePopup = new Modal(options);

            require(["react.config.panel"], function(ReactConfigPanelComponent){
                var ReactTableView = React.createFactory(ReactConfigPanelComponent);
                var reactTableView = ReactTableView({
                    collection: this.collection,
                    version: clickedObj.domainVersion,
                    domain: clickedObj.domain,
                    type: 1,
                    isCustom: clickedObj.isCustom,
                    headerStr: "",
                    panelClassName: "col-md-12",
                    onClickBackCallback: $.proxy(this.onClickBackCallback, this)
                });
                
                if (this.configFilePopup) $("#" + this.configFilePopup.modalId).remove();
                var options = {
                    title: "配置文件详情",
                    body: "",
                    backdrop: 'static',
                    type: 1,
                    onOKCallback: function() {
                        this.configFilePopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.configFilePopup = new Modal(options);
                ReactDOM.render(reactTableView, this.configFilePopup.$el.find(".modal-body").get(0));
            }.bind(this))
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: this.curPage,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        this.curPage = num;
                        args.count = this.queryArgs.count;
                        this.collection.queryTaskDoingDetail(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetSkipError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("网络阻塞，请刷新重试！")
            if (this.isMultiSkip) {
                this.isMultiSkip = false;
                this.disablePopup&&this.disablePopup.$el.modal('hide');
            }
            this.onClickQueryButton();
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    exports.SendDetailView = SendDetailView;
    exports.ConfiFileDetailView = ConfiFileDetailView;
});