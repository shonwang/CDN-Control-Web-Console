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
                    domain: domainInfo.domain
                }
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            // this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            // this.collection.on("get.channel.error", $.proxy(this.onGetError, this));

            this.defaultParam = {
                deleteParam: 2,
                deleteParamStr: "你渴望力量吗？",
                addParam: 2,
                addParamList: [{id:1, name: "你快乐吗？", value: "快乐呀"}, {id:2, name: "你幸福吗？", value: "我姓曾！"}]
            }

            this.$el.find(".delete-args .togglebutton input").on("click", $.proxy(this.onClickDeleteToggle, this));
            this.$el.find(".add-args .togglebutton input").on("click", $.proxy(this.onClickAddToggle, this));
            this.$el.find(".add-args .add").on("click", $.proxy(this.onClickNewArgs, this));

            this.initSetup();
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
                this.updateAddArgsTable();
            } else {
                this.$el.find(".add-args .togglebutton input").get(0).checked = false;
            }
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

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return RequestArgsModifyView;
});