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

            // this.collection.off("query.nodeStatus.success");
            // this.collection.off("query.nodeStatus.error");
            // this.collection.on("query.nodeStatus.success", $.proxy(this.onNodeStatusSuccess, this));
            // this.collection.on("query.nodeStatus.error", $.proxy(this.onGetError, this));
        },

        onNodeStatusSuccess: function(res) {
            var data = {
                "name": 'asdasd', //节点名称
                "flag": false, //节点下设备是否都在运行中
                "detail": [{
                    "type": "relay", //设备类型
                    "totalNum": 10, //总数
                    "pauseNum": 6 //暂停数量
                }]
            }

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
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target, rootNode) {
            this.$el.appendTo(target);
            this.rootNode = rootNode;
            this.onNodeStatusSuccess();
        }
    });

    return PromptView;
});