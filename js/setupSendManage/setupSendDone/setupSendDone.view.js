define("setupSendDone.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SetupSendDoneView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupSendManage/setupSendDone/setupSendDone.html'])());

            this.initChannelDropMenu();

            this.collection.on("get.donlist.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.donlist.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", function(){
                this.curPage = 1;
                this.onClickQueryButton();
            }.bind(this));
            this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));

            this.enterKeyBindQuery();

            this.curPage = 1;

             this.queryArgs = {
                "name"           : null,//任务名称
                "platformId" : null,//应用平台ID
                "topologyId"     : null,//拓扑关系ID
                "deliveryStrategyDefId"       : null,//下发策略ID
                "status"           : null,//任务状态，目前接口没有
                "page"             : 1,
                "count"            : 10
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
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onChannelListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = this.curPage;
            this.queryArgs.name = this.$el.find("#input-task-name").val();
            if (this.queryArgs.name == "") this.queryArgs.domain = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.queryTaskDonelist(this.queryArgs);
        },

        initTable: function(){
            this.$el.find(".mulit-send").attr("disabled", "disabled");
            this.table = $(_.template(template['tpl/setupSendManage/setupSendDone/setupSendDone.table.html'])({
                data: this.collection.models, permission: AUTH_OBJ
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .repeat").on("click", $.proxy(this.onClickRePublish, this));
            this.table.find("tbody .detail").on("click", $.proxy(this.onShowDetail, this));
        },

        onShowDetail: function(event){
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

        rePublish:function(taskId){
            // require(["setupChannelManage.model"], function(SetupChannelManageModel){
            //     this.mySetupChannelManageModel = new SetupChannelManageModel();
            //     var postParam = []
                    
            //     _.each(domains, function(item){
            //         postParam.push({
            //             domain: item.domain,
            //             version: item.domainVersion,
            //             configReason: 1 
            //         })
            //     });

            //     this.mySetupChannelManageModel.off("post.predelivery.success");
            //     this.mySetupChannelManageModel.off("post.predelivery.error");
            //     this.mySetupChannelManageModel.on("post.predelivery.success", $.proxy(this.rePublishSuccess, this));
            //     this.mySetupChannelManageModel.on("post.predelivery.error", $.proxy(this.rePublishError, this));
            //     this.mySetupChannelManageModel.predelivery(postParam);
            // }.bind(this))

            this.collection.off("get.retrytask.success");
            this.collection.off("get.retrytask.error");
            this.collection.on("get.retrytask.success", $.proxy(this.rePublishSuccess, this));
            this.collection.on("get.retrytask.error", $.proxy(this.rePublishError, this));
            this.collection.retryTask({taskId: taskId});
        },

        rePublishSuccess:function(){
            alert("发布成功");
            this.onClickQueryButton();
        },

        rePublishError:function(res){
            var msg = res.message || "重新发布失败";
            alert(msg);
        },

        onClickItemSend: function(event){
            var result = confirm("你确定要下发吗？");
            if (!result) return;

            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);
        },

        onClickRePublish: function(event){
            var result = confirm("重新发布后，任务包含的频道将返回至待定制和待下发页面，可重新进行下发，是否确定重新发布？？");
            if (!result) return;

            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);
            var domains = model.get("domains");
            this.rePublish(id);
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

            var mySendDetailView = new SendDetailView({
                collection: this.collection,
                model: model,
                onSaveCallback: function(){}.bind(this),
                onCancelCallback: function(){
                    mySendDetailView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            mySendDetailView.render(this.$el.find(".edit-panel"))
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
                currentPage: this.curPage,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        this.curPage = num;
                        args.count = this.queryArgs.count;
                        this.collection.queryTaskDonelist(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initChannelDropMenu: function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name:"下发完成", value: 2},
                {name: "被终止", value: 3},
            ],
            rootNode = this.$el.find(".dropdown-done-type");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                 if (value == "All"){
                     this.queryArgs.status = null;
                 }
                 else{
                     this.queryArgs.status = parseInt(value)
                 }
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
            }.bind(this));
            
            //下发策略
            require(['setupTopoManageSendStrategy.model'],function(SetupTopoManageSendStrategyModel){
                this.mySetupTopoManageSendStrategyModel = new SetupTopoManageSendStrategyModel();
                this.mySetupTopoManageSendStrategyModel.on("get.sendInfo.success", $.proxy(this.onGetSendStrategySuccess, this))
                this.mySetupTopoManageSendStrategyModel.on("get.sendInfo.error", $.proxy(this.onGetSendStrategyError, this))
                this.mySetupTopoManageSendStrategyModel.getSendinfo();
            }.bind(this));
        },

        onGetSendStrategySuccess:function(){
            //下发策略下拉框
            var mySetupTopoManageSendStrategyModel=this.mySetupTopoManageSendStrategyModel;
            var dendStrategyArr = [{name:"全部",value:"All"}];
            mySetupTopoManageSendStrategyModel.each(function(el,index,lst){
                dendStrategyArr.push({
                    name:el.get('name'),
                    value:el.get('id')
                });
            }.bind(this));
            rootNode = this.$el.find('.dropdown-strategy');
            Utility.initDropMenu(rootNode, dendStrategyArr, function(value){
                 if (value == "All"){
                     this.queryArgs.deliveryStrategyDefId = null;
                 }
                 else{
                     this.queryArgs.deliveryStrategyDefId = parseInt(value)
                 }
            }.bind(this));
        },

        onGetTopoSuccess: function(){
            //拓扑关系下拉框
            var topoArray = [{name:"全部",value:"All"}]
            this.mySetupTopoManageModel.each(function(el, index, lst){
                topoArray.push({
                    name: el.get('name'),
                    value: el.get('id')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-topo");
            Utility.initDropMenu(rootNode, topoArray, function(value){
                 if (value == "All"){
                     this.queryArgs.topologyId = null;
                 }
                 else{
                     this.queryArgs.topologyId = parseInt(value)
                 }
            }.bind(this));
        },

        onGetAppSuccess: function(){
            //应用 下拉框
            var appArray = [{name:"全部",value:"All"}]
            this.mySetupAppManageModel.each(function(el, index, lst){
                appArray.push({
                    name: el.get('typeName'),
                    value: el.get('type')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-app");
            Utility.initDropMenu(rootNode, appArray, function(value){
                if (value == "All"){
                    this.queryArgs.platformId = null;
                } else {
                    this.queryArgs.platformId = parseInt(value)
                }
            }.bind(this));
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
        }
    });


    return SetupSendDoneView;
});