define("nodeManage.prompt.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var PromptView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;

            this.$el = $('<div class="prompt-ctn"></div>');
            this.$el.html(_.template(template['tpl/loading.html'])({}));
            this.isLoading = true;

            this.collection.off("get.nodeState.success");
            this.collection.off("get.nodeState.error");
            this.collection.on("get.nodeState.success", $.proxy(this.onNodeStatusSuccess, this));
            this.collection.on("get.nodeState.error", $.proxy(this.onGetError, this));
        },

        onNodeStatusSuccess: function(data) {
            if (data.flag) {
                this.initOpenConfirm();
            } else {
                this.initDeviceConfirm(data);
            }
            this.isLoading = false;
        },

        initOpenConfirm: function() {
            this.$el.html('');
            var tpl = '<div>确定要开启"' + this.model.get("chName") + '"吗？</div>';
            $(tpl).appendTo(this.$el)
        },

        initDeviceConfirm: function(nodeData) {
            this.$el.html('');
            var tpl =   '<div>' +
                            '<div>以下节点有暂停的设备，确定要开启吗？</div>' +
                            '<div class="table-ctn"></div>' +
                        '</div>';
            $(tpl).appendTo(this.$el);
            this.$el.find(".table-ctn").html(_.template(template['tpl/nodeManage/nodeManage.openNode.html'])({
                data: nodeData
            }));
        },

        onSure: function(){
            if (this.isLoading) 
                return false;
            else
                return true
        },

        onGetError: function(error) {
            if (error && error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        render: function(target, rootNode) {
            this.$el.appendTo(target);
            this.rootNode = rootNode;
            this.collection.getNodeState({"id": this.model.get("id")})
        }
    });

    return PromptView;
});