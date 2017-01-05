define("requestArgsModify.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var RequestArgsModifyView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/requestArgsModify/requestArgsModify.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.clientInfo = clientInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.collection.on("get.parameter.success", $.proxy(this.onUrlParameterSuccess, this));
            this.collection.on("get.parameter.error", $.proxy(this.onGetError, this));
            this.collection.on("set.parameter.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.parameter.error", $.proxy(this.onGetError, this));
            this.collection.getUrlParameter({originId: this.domainInfo.id})
        },

        onUrlParameterSuccess: function (data) {
            this.defaultParam = {
                deleteParam: 1,
                deleteParamStr: "",
                addParam: 1,
                addParamList: []
            }

            if (data && data.delType !== null && data.delType !== undefined)
                this.defaultParam.deleteParam = data.delType === 0 ? 1 : 2;

            if (data) this.defaultParam.deleteParamStr = data.delKeys;

            if (data && data.addType !== null && data.addType !== undefined)
                this.defaultParam.addParam = data.addType === 0 ? 1 : 2;
            if (data){
                _.each(data.addDetails, function(el, index, list){
                    this.defaultParam.addParamList.push({
                        id: el.id || new Date().valueOf(),
                        name: el.key,
                        value: el.value
                    })
                }.bind(this))
            }

            this.$el.find(".delete-args .togglebutton input").on("click", $.proxy(this.onClickDeleteToggle, this));
            this.$el.find(".add-args .togglebutton input").on("click", $.proxy(this.onClickAddToggle, this));
            this.$el.find(".add-args .add").on("click", $.proxy(this.onClickNewArgs, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
            
            this.initSetup();
        },

        onClickSaveBtn: function (argument) {
            var list = [{
                "parameterKey": "",
                "parameterValue": _.uniq(this.$el.find("#delete-args").val().split(',')).join(','),
                "type": 0,
                "status": this.defaultParam.deleteParam === 1 ? 0 : 1
            }];

            _.each(this.defaultParam.addParamList, function(el, index, ls) {
                list.push({
                "parameterKey": el.name,
                "parameterValue": el.value,
                "type": 1,
                "status": this.defaultParam.addParam === 1 ? 0 : 1
            })
            }.bind(this))

            var postParam = {
                "originId": this.domainInfo.id,
                "list": list
            }

            this.collection.setUrlParameter(postParam)
        },

        onSaveSuccess: function(){
            alert("保存成功！")
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: new SaveThenSendModel(),
                    domainInfo: this.domainInfo,
                    onSendSuccess: function() {
                        this.sendPopup.$el.modal("hide");
                        window.location.hash = '#/domainList/' + this.options.query;
                    }.bind(this)
                });
                var options = {
                    title: "发布",
                    body : mySaveThenSendView,
                    backdrop : 'static',
                    type     : 2,
                    width: 800,
                    onOKCallback:  function(){
                        mySaveThenSendView.sendConfig();
                    }.bind(this),
                    onHiddenCallback: function(){
                        if (this.sendPopup) $("#" + this.sendPopup.modalId).remove();
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
        },

        initSetup: function(){
            if (this.defaultParam.deleteParam === 2){
                this.$el.find(".delete-args .togglebutton input").get(0).checked = true;
                this.$el.find("#delete-args").val(this.defaultParam.deleteParamStr);
            } else {
                this.$el.find(".delete-args .togglebutton input").get(0).checked = false;
            }
            if (this.defaultParam.addParam === 2){
                this.$el.find(".add-args .togglebutton input").get(0).checked = true;
            } else {
                this.$el.find(".add-args .togglebutton input").get(0).checked = false;
            }
            this.updateAddArgsTable();
        },

        updateAddArgsTable: function(){
            this.$el.find(".add-args .table-ctn").find(".table").remove()
            this.AddArgsTable = $(_.template(template['tpl/customerSetup/domainList/requestArgsModify/requestArgsModify.addArgsTable.html'])({
                data: this.defaultParam.addParamList
            }))

            this.AddArgsTable.find(".delete").on("click", $.proxy(this.onClickAddArgsTableItemDelete, this));
            this.$el.find(".add-args .table-ctn").html(this.AddArgsTable.get(0));
        },

        onClickNewArgs: function(event){
            var eventTarget = event.srcElement || event.target;

            var newName = this.$el.find(".add-args #args").val(),
                newKey = this.$el.find(".add-args #value").val()

            this.defaultParam.addParamList.push({
                id: new Date().valueOf(),
                name: newName,
                value: newKey
            });
            if (this.defaultParam.addParamList.length > 20){
                alert("只能添加20个");
                return
            }
            this.updateAddArgsTable();
        },

        onClickAddArgsTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.defaultParam.addParamList, function(obj){
                return obj.id !== parseInt(id)
            }.bind(this))

            this.defaultParam.addParamList = filterArray;
            this.updateAddArgsTable();
        },

        onClickAddToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.addParam = 2;
            } else {
                this.defaultParam.addParam = 1;
            }
        },

        onClickDeleteToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.deleteParam = 2;
            } else {
                this.defaultParam.deleteParam = 1;
            }
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query, query2, target){
            this.options.query = query;
            this.options.query2 = query2;
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

    return RequestArgsModifyView;
});