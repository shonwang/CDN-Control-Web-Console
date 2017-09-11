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

            // this.collection.off("get.assocateDispGroups.success");
            // this.collection.off("get.assocateDispGroups.error");
            // this.collection.on("get.assocateDispGroups.success", $.proxy(this.onGetDispConfigSuccess, this));
            // this.collection.on("get.assocateDispGroups.error", $.proxy(this.onGetError, this));
        },

        initOpenConfirm: function(){
            this.$el.html('');
            var tpl = '<div>确定要开启"' + this.model.get("chName") + '"吗？</div>';
            $(tpl).appendTo(this.$el)
        },

        initAssocateConfirm: function(){
            //this.$el.html('');
            this.rootNode.find(".ok").remove();
            var tpl = '<div>"' + this.model.get("chName") + '"下未关联设备，请处理后再开启节点！</div>';
            $(tpl).appendTo(this.$el)
        },

        initDeviceConfirm: function(){
            //this.$el.html('');
            var tpl = '<div>' + 
                        '<div>以下节点有暂停的设备，确定要开启吗？</div>' + 
                        '<div class="table-ctn"></div>' + 
                      '</div>';
            $(tpl).appendTo(this.$el);
            this.$el.find(".table-ctn").html(_.template(template['tpl/nodeManage/nodeManage.openNode.html'])({}));
        },

        initDeleteConfirm: function(){
            this.$el.html('');
            var tpl = "<div>你确定要删除节点<span class='text-danger'>" + this.model.get("chName")+ "</span>吗？删除后将不可恢复, 请谨慎操作！</div>";
            $(tpl).appendTo(this.$el)
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
            this.initOpenConfirm();
            this.initAssocateConfirm();
            this.initDeviceConfirm();
            this.initDeleteConfirm();
        }
    });

    return PromptView;
});