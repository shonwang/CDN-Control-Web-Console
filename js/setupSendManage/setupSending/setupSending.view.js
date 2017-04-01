define("setupSending.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var SetupSendingView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.html'])());

            this.initChannelDropMenu();

            this.collection.on("get.sending.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.sending.channel.error", $.proxy(this.onGetError, this));
            this.collection.on("channel.terminate.success", $.proxy(this.onChannelTerminateSuccess, this));
            this.collection.on("channel.terminate.error", $.proxy(this.onGetError, this));
            this.collection.on("channel.next.success", $.proxy(this.onChannelNextSuccess, this));
            this.collection.on("channel.next.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".mulit-next").on("click", $.proxy(this.onClickMultiNext, this));

            this.enterKeyBindQuery();

            this.queryArgs = {
              "name": null, 
              "platformId": null, 
              "topologyId": null, 
              "deliveryStrategyDefId": null, 
              "configReason": null, //"1：用户配置变更 2：拓扑变更",
              "status": null, //"1：执行中 2：执行完成 3:任务被终止 4：等待下一步",
              "page": 1,
              "count": 10
            }
            this.onClickQueryButton();
        },
        
        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetError: function(error){
            this.disablePopup&&this.disablePopup.$el.modal('hide');
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        showDisablePopup: function(msg) {
            if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
            var options = {
                title    : "警告",
                body     : '<div class="alert alert-danger"><strong>' + msg +'</strong></div>',
                backdrop : 'static',
                type     : 0,
            }
            this.disablePopup = new Modal(options);
            this.disablePopup.$el.find(".close").remove();
        },

        onChannelTerminateSuccess: function(){
            alert("操作成功！")
            this.update(this.target)
        },

        onChannelNextSuccess: function(){
            this.disablePopup&&this.disablePopup.$el.modal('hide');
            alert("操作成功！")
            this.update(this.target)
        },

        onChannelListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickMultiNext: function(){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            });

            this.domainArray = [];
            _.each(checkedList, function(el, index, ls){
                this.domainArray.push({
                    predeliveryId: el.get("id")
                });
            }.bind(this))
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.name = this.$el.find("#input-task-name").val();
            if (this.queryArgs.name == "") this.queryArgs.name = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.querySendingChannel(this.queryArgs);
        },

        initTable: function(){
            this.$el.find(".mulit-send").attr("disabled", "disabled");
            this.table = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.table.html'])({
                data: this.collection.models, permission: AUTH_OBJ
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .detail").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .send").on("click", $.proxy(this.onClickItemSend, this));
            this.table.find("tbody .reject").on("click", $.proxy(this.onClickItemReject, this));

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));

            this.table.find(".glyphicon-question-sign").popover();
        },

        onClickItemSend: function(event){
            var result = confirm("你确定要进入下一步吗？");
            if (!result) return;

            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);

            this.collection.nextTask({
                taskId: id,
                taskStepId: model.get("taskStepId")
            })

            this.showDisablePopup("服务器正在努力处理中...")
        },

        onClickItemReject: function(event){
            var result = confirm("你确定要终止吗？");
            if (!result) return;

            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            this.collection.terminateTask({taskId: id})
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

            require(["setupSendDetail.view", "setupSendDetail.model"], function(SendDetailView, SetupSendDetailModel){
                var mySetupSendDetailModel = new SetupSendDetailModel();
                var mySendDetailView = new SendDetailView({
                    collection: mySetupSendDetailModel,
                    model: model,
                    isSending: true,
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){
                        mySendDetailView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                mySendDetailView.render(this.$el.find(".edit-panel"))
            }.bind(this))
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
                this.$el.find(".mulit-send").attr("disabled", "disabled");
            } else {
                this.$el.find(".mulit-send").removeAttr("disabled", "disabled");
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
                this.$el.find(".mulit-send").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".mulit-send").attr("disabled", "disabled");
            }
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

        initChannelDropMenu: function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name: "执行中", value:1},
                {name: "执行完成", value:2},
                {name: "任务被终止", value:3},
                {name: "等待下一步", value:4}
            ],
            rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                if (value == "All")
                    this.queryArgs.status = null;
                else
                    this.queryArgs.status = parseInt(value)
            }.bind(this));

            //"1：用户配置变更 2：拓扑变更",
            var taskType = [
                {name: "全部", value: "All"},
                {name:"用户配置变更", value:1},
                {name: "拓扑变更", value:2},
            ],
            rootNode = this.$el.find(".dropdown-task-type");
            Utility.initDropMenu(rootNode, taskType, function(value){
                if (value == "All")
                    this.queryArgs.configReason = null;
                else
                    this.queryArgs.configReason = parseInt(value)
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

            require(["setupTopoManage.model"], function(SetupTopoManageModel){
                this.mySetupTopoManageModel = new SetupTopoManageModel();
                this.mySetupTopoManageModel.on("get.topoInfo.success", $.proxy(this.onGetTopoSuccess, this))
                this.mySetupTopoManageModel.on("get.topoInfo.error", $.proxy(this.onGetError, this))
                var postParam = {
                    "name" : null,
                    "type" : null,
                    "page" : 1,
                    "size" : 99999
                 }
                this.mySetupTopoManageModel.getTopoinfo(postParam);
            }.bind(this))

            require(["setupAppManage.model"], function(SetupAppManageModel){
                this.mySetupAppManageModel = new SetupAppManageModel();
                this.mySetupAppManageModel.on("get.app.info.success", $.proxy(this.onGetAppSuccess, this))
                this.mySetupAppManageModel.on("get.app.info.error", $.proxy(this.onGetError, this))
                this.mySetupAppManageModel.getAppInfo();
            }.bind(this))

            require(["setupTopoManageSendStrategy.model"], function(SetupTopoManageSendStrategy){
                this.mySetupTopoManageSendStrategy = new SetupTopoManageSendStrategy();
                this.mySetupTopoManageSendStrategy.on("get.sendInfo.success", $.proxy(this.onGetStrategySuccess, this));
                this.mySetupTopoManageSendStrategy.on("get.sendInfo.error", $.proxy(this.onGetError, this));
                this.mySetupTopoManageSendStrategy.getSendinfo({
                    topologyId:null,
                    page:1,
                    count:99999
                });
            }.bind(this))
        },

        onGetTopoSuccess: function(){
            var topoArray = [{name: "全部", value: "All"}]
            this.mySetupTopoManageModel.each(function(el, index, lst){
                topoArray.push({
                    name: el.get('name'),
                    value: el.get('id')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-topo");
            Utility.initDropMenu(rootNode, topoArray, function(value){
                if (value == "All")
                    this.queryArgs.topologyId = null;
                else
                    this.queryArgs.topologyId = parseInt(value)
            }.bind(this));
        },

        onGetAppSuccess: function(){
            var appArray = [{name: "全部", value: "All"}]
            this.mySetupAppManageModel.each(function(el, index, lst){
                appArray.push({
                    name: el.get('typeName'),
                    value: el.get('type')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-app");
            Utility.initDropMenu(rootNode, appArray, function(value){
                if (value == "All")
                    this.queryArgs.platformId = null;
                else
                    this.queryArgs.platformId = parseInt(value)
            }.bind(this));
        },

        onGetStrategySuccess: function(){
            var strategyArray = [{name: "全部", value: "All"}]
            this.mySetupTopoManageSendStrategy.each(function(el, index, lst){
                var tempName = el.get('name').replace(/</g, "&lt;").replace(/>/g, "&gt;")
                strategyArray.push({
                    name: tempName,
                    value: el.get('id')
                })
            }.bind(this))

            // rootNode = this.$el.find(".dropdown-strategy");
            // Utility.initDropMenu(rootNode, strategyArray, function(value){
            //     if (value == "All")
            //         this.queryArgs.deliveryStrategyDefId = null;
            //     else
            //         this.queryArgs.deliveryStrategyDefId = parseInt(value)
            // }.bind(this));

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-strategy').get(0),
                panelID: this.$el.find('#dropdown-strategy').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function(){},
                data: strategyArray,
                callback: function(data) {
                    if (data.value == "All")
                        this.queryArgs.deliveryStrategyDefId = null;
                    else
                        this.queryArgs.deliveryStrategyDefId = parseInt(data.value)
                    this.$el.find('#dropdown-strategy .cur-value').html(data.name);
                }.bind(this)
            });
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(target){
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target){
            this.$el.appendTo(target);
            this.target = target
        }
    });

    return SetupSendingView;
});