define("setupSendWaitSend.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SetupSendWaitSendView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupSendManage/setupSendWaitSend/setupSendWaitSend.html'])());

            this.initChannelDropMenu();

            this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.channel.error", $.proxy(this.onGetError, this));
            this.collection.on("roll.back.success", $.proxy(this.onRollBackSuccess, this));
            this.collection.on("roll.back.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".mulit-send").on("click", $.proxy(this.onClickMultiSend, this))

            this.enterKeyBindQuery();

            this.queryArgs = {
                "domain" : null,
                "operateType": null,
                "platformId" : null,
                "status" : 1,
                "count": 10,
                "page": 1
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

        onChannelListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onRollBackSuccess: function(){
            alert("操作成功！");
            this.update(this.target)
        },

        onClickMultiSend: function(){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            });

            this.domainArray = [];
            _.each(checkedList, function(el, index, ls){
                this.domainArray.push({
                    domain: el.get("domain"),
                    id: el.get("id")
                });
            }.bind(this))

            this.showSelectStrategyPopup();
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

        showSelectStrategyPopup: function(){
            if (this.selectStrategyPopup) $("#" + this.selectStrategyPopup.modalId).remove();

            require(["setupSendWaitCustomize.stratety.view"], function(SelectStrategyView){
                var mySelectStrategyView = new SelectStrategyView({
                    collection: this.collection, 
                    domainArray : this.domainArray
                });
                var options = {
                    title: "生成下发任务",
                    body : mySelectStrategyView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback:  function(){
                        var result  = mySelectStrategyView.onSure();
                        if (!result) return;
                        this.collection.off("create.task.success");
                        this.collection.off("create.task.error");
                        this.collection.on("create.task.success", $.proxy(this.onCreatTaskSuccess, this));
                        this.collection.on("create.task.error", $.proxy(this.onGetError, this));
                        this.collection.createTask(result);
                        this.selectStrategyPopup.$el.modal('hide')
                        this.showDisablePopup("服务器正在努力处理中...")
                    }.bind(this),
                    onHiddenCallback: function(){
                        this.enterKeyBindQuery();
                    }.bind(this)
                }
                this.selectStrategyPopup = new Modal(options);
            }.bind(this))
        },

        onCreatTaskSuccess: function(){
            this.disablePopup&&this.disablePopup.$el.modal('hide');
            alert("创建任务成功！");
            this.update(this.target)
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.domain = this.$el.find("#input-domain").val();
            this.queryArgs.clientName = this.$el.find("#input-client").val();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            if (this.queryArgs.clientName == "") this.queryArgs.clientName = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.queryChannel(this.queryArgs);
        },

        initTable: function(){
            this.$el.find(".mulit-send").attr("disabled", "disabled");
            this.table = $(_.template(template['tpl/setupSendManage/setupSendWaitSend/setupSendWaitSend.table.html'])({
                data: this.collection.models, permission: AUTH_OBJ
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .send").on("click", $.proxy(this.onClickItemSend, this));
            this.table.find("tbody .reject").on("click", $.proxy(this.onClickItemReject, this));

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
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

            this.domainArray = [{
                domain: model.get("domain"),
                id: model.get("id")
            }];

            this.showSelectStrategyPopup();
        },

        onClickItemReject: function(event){
            var result = confirm("你确定要打回吗？");
            if (!result) return;

            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            this.collection.rollBack({predeliveryId: id})
        },

        onClickItemEdit: function(event){
            require(['setupChannelManage.edit.view'], function(EditChannelView){
                var eventTarget = event.srcElement || event.target, id;
                if (eventTarget.tagName == "SPAN"){
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                var model = this.collection.get(id);

                var myEditChannelView = new EditChannelView({
                    collection: this.collection,
                    model: model,
                    isEdit: false,
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){
                        myEditChannelView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myEditChannelView.render(this.$el.find(".edit-panel"))
            }.bind(this));
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
                        this.collection.queryChannel(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initChannelDropMenu: function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name:"新增", value:0},
                {name: "更新", value:1},
                {name: "删除", value:2},
            ],
            rootNode = this.$el.find(".dropdown-oper");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                if (value == "All")
                    this.queryArgs.operateType = null;
                else
                    this.queryArgs.operateType = parseInt(value)
            }.bind(this));

            var isCustomizeArray = [
                {name: "全部", value: "All"},
                {name:"是", value:0},
                {name: "否", value:1},
            ],
            rootNode = this.$el.find(".dropdown-iscustomize");
            Utility.initDropMenu(rootNode, isCustomizeArray, function(value){
                if (value == "All")
                    this.queryArgs.status = null;
                else
                    this.queryArgs.status = parseInt(value)
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

            // require(["setupTopoManage.model"], function(SetupTopoManageModel){
            //     this.mySetupTopoManageModel = new SetupTopoManageModel();
            //     this.mySetupTopoManageModel.on("get.topoInfo.success", $.proxy(this.onGetTopoSuccess, this))
            //     this.mySetupTopoManageModel.on("get.topoInfo.error", $.proxy(this.onGetError, this))
            //     var postParam = {
            //         "name" : null,
            //         "type" : null,
            //         "page" : 1,
            //         "size" : 99999
            //      }
            //     this.mySetupTopoManageModel.getTopoinfo(postParam);
            // }.bind(this))

            require(["setupAppManage.model"], function(SetupAppManageModel){
                this.mySetupAppManageModel = new SetupAppManageModel();
                this.mySetupAppManageModel.on("get.app.info.success", $.proxy(this.onGetAppSuccess, this))
                this.mySetupAppManageModel.on("get.app.info.error", $.proxy(this.onGetError, this))
                this.mySetupAppManageModel.getAppInfo();
            }.bind(this))
        },

        onGetTopoSuccess: function(){
            var topoArray = []
            this.mySetupTopoManageModel.each(function(el, index, lst){
                topoArray.push({
                    name: el.get('name'),
                    value: el.get('id')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-topo");
            Utility.initDropMenu(rootNode, topoArray, function(value){
                // if (value == "All")
                //     this.queryArgs.status = null;
                // else
                //     this.queryArgs.status = parseInt(value)
            }.bind(this));
        },

        onGetAppSuccess: function(){
            var appArray = [{name: "全部", value: "All"}]
            this.mySetupAppManageModel.each(function(el, index, lst){
                appArray.push({
                    name: el.get('name'),
                    value: el.get('id')
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

        hide: function(){
            this.$el.hide();
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
            this.target = target;
        }
    });

    return SetupSendWaitSendView;
});