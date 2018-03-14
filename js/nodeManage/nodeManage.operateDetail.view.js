define("nodeManage.operateDetail.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var NodeTips = Backbone.View.extend({
        initialize: function(options) {
            this.type = options.type; //type=1:暂停操作 type=2 查看详情,不可编辑
            this.model = options.model;
            this.whoCallMe = options.whoCallMe;// node: 节点管理；device：节点管理; block: 域名封禁
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

            if (this.collection) {
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
            var typeArray = [{
                name: "网络故障",
                value: "All"
            }, {
                name: "系统故障",
                value: 203
            }, {
                name: "软件升级",
                value: 202
            },{
                name: "配置下发",
                value: 202
            },{
                name: "网络改造",
                value: 202
            },{
                name: "其他",
                value: 202
            }]
            if (this.whoCallMe == "device") {
                typeArray = [{
                    name: "网络故障",
                    value: "All"
                }, {
                    name: "系统故障",
                    value: 203
                }, {
                    name: "软件升级",
                    value: 202
                },{
                    name: "配置下发",
                    value: 202
                },{
                    name: "网络改造",
                    value: 202
                },{
                    name: "Monitor（系统自动探测暂停的设备）",
                    value: 202
                },{
                    name: "其他",
                    value: 202
                }]
            }
            Utility.initDropMenu(this.$el.find(".dropdown-reason"), typeArray, function(value) {
                // if (value !== "All")
                //     this.queryArgs.appType = parseInt(value)
                // else
                //     this.queryArgs.appType = null;
            }.bind(this));

            if (this.type == 2) {
                var defaultValue = _.find(typeArray, function(object) {
                    return object.value === 203;
                }.bind(this));
                if (defaultValue)
                    this.$el.find(".dropdown-reason .cur-value").html(defaultValue.name)
                this.initHistory();
            } else {
                this.$el.find(".dropdown-reason .cur-value").html(typeArray[0].name)
            }
        },

        initHistory: function(){
            this.table = $(_.template(template['tpl/nodeManage/nodeManage.tips.histroy.html'])({
                data: []
            }));
            // if (.length !== 0) {
                this.$el.find(".table-ctn").html(this.table[0]);
            // } else {
            //     this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            // }
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