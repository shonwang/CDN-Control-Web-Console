define("specialLayerManage.deleteNode.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DeleteNodeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.deleteNode.html'])({}));

            this.defaultParam = {
                local: {}
            }
            this.initNodeTable();
            
        },
         
        initNodeTable: function() {
            this.nodeTable = $(_.template(template['tpl/specialLayerManage/specialLayerManage.editNode.table.html'])({
                data: this.collection.models
            }));
            if (this.defaultParam.local.length === 100){
                console.log("bbbb")
                this.$el.find(".table-ctn").html(this.localTable);
            }else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "暂无数据"
                    }
                }));

            // this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemLocalDelete, this));
        },

        render: function(target) {
            this.$el.appendTo(target);

        }
    });

    return DeleteNodeView;
});