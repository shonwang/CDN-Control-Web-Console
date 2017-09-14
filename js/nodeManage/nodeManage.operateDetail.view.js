define("nodeManage.operateDetail.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var NodeTips = Backbone.View.extend({
        initialize: function(options) {
            this.type = options.type; //type=1:暂停操作 type=2 查看详情,不可编辑
            this.model = options.model;
            this.args = {
                opRemark: ''
            };

            var obj = {
                type: options.type,
                name: this.model.get("name") || "---",
                chName: this.model.attributes.chName || this.model.get("name"),
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