define("kdmGlobleSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var KdmGlobleSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/kdmGlobleSetup/kdmGlobleSetup.html'])());

            // this.initChannelDropMenu();

            // this.collection.on("get.client.success", $.proxy(this.onGetClientMessage, this));
            // this.collection.on("get.client.error", $.proxy(this.onGetError, this));
            // this.collection.on("update.client", $.proxy(this.updateUserInfoView, this));
            // this.collection.on("update.assess.table", $.proxy(this.initTable, this));
            // this.collection.on("get.evaluationFlag.success", $.proxy(this.onGetEvaluationSuccess, this));
            // this.collection.on("get.evaluationFlag.error", $.proxy(this.onGetError, this));

            // this.$el.find(".opt-ctn .confirm").on("click", $.proxy(this.onClickConfirmButton, this));
            // this.$el.find(".add-domain").on("click", $.proxy(this.onClickAddDomain, this));
            // this.$el.find(".start-assess").on("click", $.proxy(this.onClickStartAssess, this));
            // this.$el.find(".multi-delete").on("click", $.proxy(this.onClickMultiDelete, this));
            // this.$el.find(".history").on("click", $.proxy(this.onClickItemHistory, this));

            // this.enterKeyBindQuery();

            // this.collection.trigger("update.assess.table");
        },
        
        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickConfirmButton();
                }
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onClickConfirmButton: function(){
            if (!this.currentModel){
                alert("请填写相关信息!");
                return
            }
            if (!this.currentModel.get("groupName")){
                alert("请选择调度组!");
                return
            }
            if (!this.regionId){
                alert("请选择区域!");
                return
            }
            if (!this.$el.find("#input-bandwidth").val()){
                alert("请填写带宽!");
                return
            }
            if (parseInt(this.$el.find("#input-bandwidth").val()) <= 0){
                alert("带宽必须大于零!");
                return
            }
            var defaultParam = {
                "cnameId": this.currentModel.get("cnameId"),
                "cname": this.currentModel.get("cname"),
                "accelerateName": this.currentModel.get("accelerateName").replace(/\|/g, '<br>'),
                "clientName": this.currentModel.get("clientName").replace(/\|/g, '<br>'),
                "groupId": this.currentModel.get("groupId"),
                "groupName": this.currentModel.get("groupName"),
                "regionId": this.regionId,
                "regionName": this.regionName,
                "increBandwidth": this.$el.find("#input-bandwidth").val()
            }
            var newModel = new this.collection.model(defaultParam)
            newModel.set("createTime", new Date().format("yyyy/MM/dd hh:mm:ss"));
            this.collection.models.reverse();
            this.collection.push(newModel);
            this.collection.each(function(el){
                el.set("isChecked", false);
            }.bind(this))
            this.collection.trigger("update.assess.table");
        },

        onClickStartAssess: function(){
            var checkedList = this.collection.filter(function(obj){
                return obj.get("isChecked") === true;
            }.bind(this))

            if (checkedList.length === 0){
                alert("至少添加并选择一条信息!")
                return;
            }

            var postParam = [];
            _.each(checkedList, function(el, index, ls){
                postParam.push({
                    "cnameId": el.get("cnameId"),
                    "cname": el.get("cname"),
                    "accelerateName": el.get("accelerateName").replace(/<br>/g, '|'),
                    "clientName": el.get("clientName").replace(/<br>/g, '|'),
                    "groupId": el.get("groupId"),
                    "groupName": el.get("groupName"),
                    "regionId": el.get("regionId"),
                    "regionName": el.get("regionName"),
                    "increBandwidth": el.get("increBandwidth"),
                    "createTime": new Date(el.get("createTime")).valueOf(),
                    "issuedTime": el.get("issuedTime"),
                    "orgId": el.get("orgId"),
                    "evalState": el.get("evalState")
                })
            }.bind(this))

            this.currentInfo = postParam

            this.collection.getEvaluationFlag(postParam)
        },

        onGetEvaluationSuccess: function(res){
            var result = false;

            if (res === "true")
                result = confirm("客户带宽可以接入！点击确定查看评估详情！");
            else
                result = confirm("客户带宽接入将导致部分区域的节点不足以承载服务，具体信息请点击确定查看评估详情！");

            if (result){
                require(["dispSuggesttion.view", "dispSuggesttion.model"], function(DispSuggesttionViews, DispSuggesttionModel){
                    this.onRequireDispSuggesttionModule(DispSuggesttionViews, DispSuggesttionModel, this.currentPauseNodeId)
                }.bind(this))
            }
        },

        onRequireDispSuggesttionModule: function(DispSuggesttionViews, DispSuggesttionModel, nodeId){//
            if (!this.dispSuggesttionFailModel)
                this.dispSuggesttionFailModel = new DispSuggesttionModel();
            this.hide();
            var options = {
                assessInfo: this.currentInfo,
                collection: this.dispSuggesttionFailModel,
                backCallback: $.proxy(this.backFromDispSuggesttion, this)
            };
            this.dispSuggesttionView = new DispSuggesttionViews.DispSuggesttionView(options);
            this.dispSuggesttionView.render($('.ksc-content'));
        },

        backFromDispSuggesttion: function(){
            this.dispSuggesttionView.remove();
            this.dispSuggesttionView = null;
            this.dispSuggesttionFailModel = null;
            this.update();
        },

        initTable: function(){
            this.collection.models.reverse();
            this.$el.find(".multi-delete").attr("disabled", "disabled");
            this.table = $(_.template(template['tpl/kdmGlobleSetup/kdmGlobleSetup.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));

            this.table.find("[data-toggle='popover']").popover();
        },

        onGetClientMessage: function(res){
            this.currentModel = new this.collection.model(res);
            this.collection.trigger("update.client");
        },

        updateUserInfoView: function(){
            this.$el.find("#input-cname").val(this.currentModel.get("cname"));
            this.$el.find("#input-client").val(this.currentModel.get("clientName"));
            this.$el.find("#input-domain").val(this.currentModel.get("accelerateName"));
            this.$el.find(".dropdown-dispgroup .cur-value").html(this.currentModel.get("groupName") || "请选择");
            // this.$el.find(".dropdown-region .cur-value").html(this.currentModel.get("regionName") || "请选择");
            // this.$el.find("#input-bandwidth").html(this.currentModel.get("increBandwidth"));
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
                    this.$el.find("#input-cname").val(result.name)
                    this.collection.getClientMessage({cnameId: result.id})
                    //this.collection.getClientMessage({cname: "mt.huluxia.com.download.ks-cdn.com"})
                    this.selectDomain.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    this.enterKeyBindQuery();
                }.bind(this)
            }
            this.selectDomain = new Modal(options);
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);
            this.collection.remove(model);
            this.collection.models.reverse();
            this.collection.trigger("update.assess.table");
        },

        onClickMultiDelete: function(){
            var checkedList = this.collection.filter(function(obj){
                return obj.get("isChecked") === true;
            }.bind(this))

            this.collection.remove(checkedList);
            this.collection.models.reverse();
            this.collection.trigger("update.assess.table");
        },

        onClickItemHistory: function(){
            var myHistoryView = new HistoryView({
                collection: this.collection,
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
                this.$el.find(".multi-delete").attr("disabled", "disabled");
            } else {
                this.$el.find(".multi-delete").removeAttr("disabled", "disabled");
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
                this.$el.find(".multi-delete").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".multi-delete").attr("disabled", "disabled");
            }
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

            this.collection.on("get.region.success", $.proxy(this.onGetRegionList, this));
            this.collection.on("get.region.error", $.proxy(this.onGetError, this));
            this.collection.selectRegionList({
               "page": 1,
               "count": 99999,
               "name": null
            });
        },

        onGetRegionList: function(res){
            var regionArray = []
            _.each(res.rows, function(el, index, lst){
                regionArray.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-region').get(0),
                panelID: this.$el.find('#dropdown-region').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function(){},
                data: regionArray,
                callback: function(data) {
                    this.$el.find(".dropdown-region .cur-value").html(data.name || "请选择");
                    this.regionId = data.value;
                    this.regionName = data.name;
                }.bind(this)
            });
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

    return KdmGlobleSetupView;
});