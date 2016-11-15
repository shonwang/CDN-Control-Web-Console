define("setupSending.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
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

            this.$el = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.html'])({data: {}}));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));

            this.initSetup()
        },

        initSetup: function(){
            var data = [{localLayer: "1111", upperLayer: "22222"}];
            this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.history.table.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            //this.table.find(".node-item").on("click", $.proxy(this.onClickItemDetail, this));
            this.initDomainList();
        },

        initDomainList: function(){
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

    var SetupSendingView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.html'])());

            this.initChannelDropMenu();

            this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.channel.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));

            this.enterKeyBindQuery();

            this.queryArgs = {
                "domain"           : null,
                "accelerateDomain" : null,
                "businessType"     : null,
                "clientName"       : null,
                "status"           : null,
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

            var model = this.collection.get(id);
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
                {name: "修改", value:2},
            ],
            rootNode = this.$el.find(".dropdown-oper");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                // if (value == "All")
                //     this.queryArgs.status = null;
                // else
                //     this.queryArgs.status = parseInt(value)
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
            var appArray = []
            this.mySetupAppManageModel.each(function(el, index, lst){
                appArray.push({
                    name: el.get('name'),
                    value: el.get('id')
                })
            }.bind(this))

            rootNode = this.$el.find(".dropdown-app");
            Utility.initDropMenu(rootNode, appArray, function(value){
                // if (value == "All")
                //     this.queryArgs.status = null;
                // else
                //     this.queryArgs.status = parseInt(value)
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
        }
    });

    return SetupSendingView;
});