define("importAssess.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var HistoryView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/importAssess/importAssess.history.html'])({data: {}}));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));

            this.initSetup()
        },

        initSetup: function(){
            var data = [{localLayer: "1111", upperLayer: "22222"}];
            this.table = $(_.template(template['tpl/importAssess/importAssess.history.table.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .bill").on("click", $.proxy(this.onClickItemBill, this));
        },

        onClickItemBill: function(event){
            require(['setupBill.view', 'setupBill.model'], function(SetupBillView, SetupBillModel){
                var mySetupBillModel = new SetupBillModel();
                var mySetupBillView = new SetupBillView({
                    collection: mySetupBillModel,
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){
                        mySetupBillView.$el.remove();
                        this.$el.find(".history-panel").show();
                    }.bind(this)
                })

                this.$el.find(".history-panel").hide();
                mySetupBillView.render(this.$el.find(".bill-panel"));
            }.bind(this))
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

    var SelectDomainView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.domainArray = options.domainArray;

            this.$el = $(_.template(template['tpl/importAssess/importAssess.select.domain.html'])());
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            this.initChannelDropMenu();

            this.queryArgs = {
                domain: null,
                page:1,
                count:10
            }
            this.onClickQueryButton();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.domain = this.$el.find("#input-cname").val();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");

            require(["setupChannelManage.model"], function(SetupChannelManageModel){
                this.mySetupChannelManageModel = new SetupChannelManageModel();
                this.mySetupChannelManageModel.on("get.channel.success", $.proxy(this.initTable, this));
                this.mySetupChannelManageModel.on("get.channel.error", $.proxy(this.onGetError, this));
                this.mySetupChannelManageModel.queryChannel(this.queryArgs);
            }.bind(this))
        },

        initTable: function(){
            if (!this.isInitPaginator) this.initPaginator();
            this.table = $(_.template(template['tpl/importAssess/importAssess.domain.table.html'])({
                data: this.mySetupChannelManageModel.models, 
            }));
            if (this.mySetupChannelManageModel.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.mySetupChannelManageModel.total)
            if (this.mySetupChannelManageModel.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.mySetupChannelManageModel.total/this.queryArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                first: '',
                last: '',
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.count;
                        this.mySetupChannelManageModel.getTopoinfo(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initChannelDropMenu: function(){
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

        onSure: function(){
            var selectedDomain = this.$el.find("input:checked");
            if (!selectedDomain.get(0)){
                alert("请选择一个域名")
                return false;
            }
            var id = selectedDomain.get(0).id,
                model = this.mySetupChannelManageModel.get(id);

            return model;   
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

    var ImportAssessView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/importAssess/importAssess.html'])());

            this.initChannelDropMenu();

            this.collection.on("get.client.success", $.proxy(this.onGetClientMessage, this));
            this.collection.on("get.client.error", $.proxy(this.onGetError, this));
            this.collection.on("update.client", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".add-domain").on("click", $.proxy(this.onClickAddDomain, this))
            this.enterKeyBindQuery();

            //this.onClickQueryButton();
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
            this.queryArgs.domain = this.$el.find("#input-cname").val();
            this.queryArgs.clientName = this.$el.find("#input-client").val();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            if (this.queryArgs.clientName == "") this.queryArgs.clientName = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.queryChannel(this.queryArgs);
        },

        initTable: function(){
            this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
            this.table = $(_.template(template['tpl/importAssess/importAssess.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .strategy").on("click", $.proxy(this.onClickItemSpecialLayer, this));
            this.table.find("tbody .history").on("click", $.proxy(this.onClickItemHistory, this));

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
        },

        onGetClientMessage: function(res){
            this.currentModel = new this.collection.model(res);
            this.collection.trigger("update.client");
        },

        updateUserInfoView: function(){
            this.$el.find("#input-cname").val(this.currentModel.get(cname));
            this.$el.find("#input-client").val(this.currentModel.get(clientName));
            this.$el.find("#input-domain").val(this.currentModel.get(clientName));
            this.$el.find(".dropdown-dispgroup .cur-value").html(this.currentModel.get(groupName));
            this.$el.find(".dropdown-region .cur-value").html(this.currentModel.get(regionName));
            this.$el.find("#input-bandwidth").html(this.currentModel.get(increBandwidth));
        },

        onClickAddDomain: function(){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            });

            var domainArray = [];
            _.each(checkedList, function(el, index, ls){
                domainArray.push({
                    domain: el.get("domain"), 
                    id: el.get("id")
                });
            }.bind(this))

            if (this.selectDomain) $("#" + this.selectDomain.modalId).remove();

            var mySelectDomainView = new SelectDomainView({
                collection: this.collection, 
                domainArray : domainArray
            });
            var options = {
                title: "选择接入域名",
                body : mySelectDomainView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var result  = mySelectDomainView.onSure();
                    if (!result) return;
                    this.$el.find("#input-cname").val(result.get("cname"))
                    this.collection.getClientMessage({cname: result.get("cname")})
                    this.selectDomain.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    this.enterKeyBindQuery();
                }.bind(this)
            }
            this.selectDomain = new Modal(options);
        },

        onClickItemHistory: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);

            var myHistoryView = new HistoryView({
                collection: this.collection,
                model: model,
                onSaveCallback: function(){}.bind(this),
                onCancelCallback: function(){
                    myHistoryView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myHistoryView.render(this.$el.find(".history-panel"))
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
                this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
            } else {
                this.$el.find(".multi-modify-topology").removeAttr("disabled", "disabled");
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
                this.$el.find(".multi-modify-topology").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
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
            require(["dispGroup.model"], function(DispGroupModel){
                this.myDispGroupModel = new DispGroupModel();
                this.myDispGroupModel.on("get.dispGroup.success", $.proxy(this.onGetDispGroupList, this));
                this.myDispGroupModel.on("get.dispGroup.error", $.proxy(this.onGetError, this));
                this.myDispGroupModel.getDispGroupList({
                    "name"  : null,//调度组名称
                    "status": null,//调度组状态
                    "level" : null,//覆盖级别
                    "page"  : 1,
                    "count" : 99999
                });
            }.bind(this))
        },

        onGetDispGroupList: function(){
            var dispGroupArray = []
            this.myDispGroupModel.each(function(el, index, lst){
                dispGroupArray.push({
                    name: el.get('dispDomain'),
                    value: el.get('id')
                })
            }.bind(this))

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-dispgroup').get(0),
                panelID: this.$el.find('#dropdown-dispgroup').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function(){},
                data: dispGroupArray,
                callback: function(data) {
                    var defaultParam = {
                        "cnameId": 0,
                        "cname": "",
                        "accelerateName": "",
                        "clientName": "",
                        "groupId": data.value,
                        "groupName": data.name,
                        "regionId": 0,
                        "regionName": "",
                        "increBandwidth": ""
                    }
                    this.currentModel = new this.collection.model(defaultParam)

                    this.collection.trigger("update.client")
                }.bind(this)
            });
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return ImportAssessView;
});