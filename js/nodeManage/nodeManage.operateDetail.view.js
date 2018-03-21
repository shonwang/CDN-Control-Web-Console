define("nodeManage.operateDetail.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var NodeTips = Backbone.View.extend({
        initialize: function(options) {
            this.type = options.type; //type=1:暂停操作 type=2 查看详情,不可编辑
            this.model = options.model;
            this.whoCallMe = options.whoCallMe;// node: 节点管理；device：节点管理; block: 域名封禁
            this.operateTypeList = options.operateTypeList;
            this.collection = options.collection;
            this.args = {
                opRemark: ''
            };

            var obj = {
                type: options.type,
                name: this.model.get("name") || "---",
                chName: this.model.attributes.chName || this.model.get("name") || this.model.get("domain"),
                operator: this.model.attributes.operator || "---",
                updateTime: this.model.attributes.updateTimeFormated || "---",
                opRemark: this.model.attributes.opRemark || this.model.attributes.reason || "---",
                placeHolder: options.placeHolder || "请输入暂停原因"
            };

            if (options.isMulti)
                obj.chName = obj.chName + "..."
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.tips.html'])({
                data: obj
            }));
            this.$el.find("#stop-reason").on("focus", $.proxy(this.onFocus, this));

            if (this.whoCallMe != 'node' && this.whoCallMe != 'device') {
                this.collection.off("block.detail.success");
                this.collection.off("block.detail.error");
                this.collection.on("block.detail.success", $.proxy(this.onGetDetailSuccess, this));
                this.collection.on("block.detail.error", $.proxy(this.onGetError, this));
                this.collection.blockDetail({
                    domain: this.model.get("domain")
                })
            }

            if (this.whoCallMe == 'node' || this.whoCallMe == 'device') {
                this.initDropMenu();
            }
        },

        initDropMenu: function() {
            if (this.operateTypeList[0].value == 'All')
                this.operateTypeList.shift();
            Utility.initDropMenu(this.$el.find(".dropdown-reason"), this.operateTypeList, function(value) {
                this.args.opType = parseInt(value)
            }.bind(this));

            if (this.type == 2) {
                var defaultValue = _.find(this.operateTypeList, function(object) {
                    return object.value == this.model.get("opType");
                }.bind(this));
                if (defaultValue) {
                    this.$el.find(".dropdown-reason .cur-value").html(defaultValue.name);
                    this.args.opType = defaultValue.value;
                } else {
                    this.$el.find(".dropdown-reason .cur-value").html("服务器返回了未知的操作原因");
                    this.args.opType = null;
                }
                this.$el.find(".dropdown-reason button").prop("disabled", true);
                if (this.whoCallMe == 'node') {
                    this.collection.off("get.operate.history.success");
                    this.collection.off("get.operate.history.error");
                    this.collection.on("get.operate.history.success", $.proxy(this.onGetHistorySuccess, this));
                    this.collection.on("get.operate.history.error", $.proxy(this.onGetError, this));
                    this.collection.selecOperatetRecords({
                        "resourceName": this.model.get("name"),
                        "type": 1
                    });
                } else {
                    require(["nodeManage.model"], function(NodeManageModel) {
                        var myNodeManageModel = new NodeManageModel();
                        myNodeManageModel.on("get.operate.history.success", $.proxy(this.onGetHistorySuccess, this));
                        myNodeManageModel.on("get.operate.history.error", $.proxy(this.onGetError, this));
                        myNodeManageModel.selecOperatetRecords({
                            "resourceName": this.model.get("name"),
                            "type": 2
                        });
                    }.bind(this));
                }
            } else {
                this.$el.find(".dropdown-reason .cur-value").html(this.operateTypeList[0].name);
                this.args.opType = this.operateTypeList[0].value;
            }
        },

        onGetHistorySuccess: function(res){   
            _.each(res, function(el){
                if (this.whoCallMe == "node") {
                    if (el.resultState === 3) el.statusName = '<span class="label label-dagner">关闭</a>';
                    if (el.resultState === 4) el.statusName = '<span class="label label-danger">暂停</a>';
                    if (el.resultState === 2) el.statusName = '<span class="label label-warning">挂起</span>';
                    if (el.resultState === 1) el.statusName = '<span class="label label-success" >开启</span>';
                } else if (this.whoCallMe == "device") {
                    if (el.resultState == "1") 
                        el.statusName = statusName = "<span class='label label-success'>开启</span>";
                    if (el.resultState == "4" || el.resultState == "20" || el.resultState == "28") 
                        el.statusName = statusName = "<span class='label label-danger'>宕机</span>";
                    if (el.resultState == "6" || el.resultState == "12" || el.resultState == "14" || el.resultState == "22" || el.resultState == "30") 
                        el.statusName = statusName = "暂停且宕机";
                    if (el.resultState == "2" || el.resultState == "8" || el.resultState == "10" || el.resultState == "16" || el.resultState == "18" || el.resultState == "24" || el.resultState == "26") 
                        el.statusName = statusName = "<span class='label label-warning'>暂停</span>";
                }
                if (el.changeTime) 
                    el.changeTimeFormated = new Date(el.changeTime).format("yyyy/MM/dd hh:mm");
            }.bind(this))

            this.initHistory(res);
        },

        initHistory: function(res){
            this.table = $(_.template(template['tpl/nodeManage/nodeManage.tips.histroy.html'])({
                data: res
            }));
            this.$el.find(".table-ctn").html(this.table[0]);
            if (res.length == 0) {
                var tpl = '<tr><td colspan="3" class="text-center">' + _.template(template['tpl/empty.html'])() + '</td></tr>'
                this.table.find("tbody").html(tpl);
            }
        },

        onGetDetailSuccess: function(data){
            this.$el.find("#stop-reason").val(data.remark || "---");
            this.$el.find("#input-oper").val(data.operator || "---");
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onFocus: function() {
            this.$el.find("#stop-reason").css("-webkit-animation-name", "");
            this.$el.find("#stop-reason").removeClass("error-tip-input");
        },

        getArgs: function() {
            var opRemark = this.$el.find("#stop-reason").val().trim();
            if (!opRemark) {
                this.$el.find("#stop-reason").addClass("error-tip-input");
                this.$el.find("#stop-reason").css("-webkit-animation-name", "error-tip-input");
                return false;
            }
            this.args.opRemark = opRemark;
            return this.args;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return NodeTips;
});