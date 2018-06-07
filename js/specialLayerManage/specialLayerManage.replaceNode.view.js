define("specialLayerManage.replaceNode.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var ReplaceNodeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            console.log(options)
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.replaceNode.html'])({}));
            
        //    明天过来把下拉列表的逻辑写一下
            this.initSetup();
            this.initNodeTable();
            
        },
         
        initSetup:function(){

        },

        initNodeTable: function() {
            this.nodeTable = $(_.template(template['tpl/specialLayerManage/specialLayerManage.editNode.table.html'])({
                data: this.collection.models
            }));
            console.log(this.collection.models)
            if (this.collection.models.length === 100){
                this.$el.find(".table-ctn").html(this.nodeTable[0]);
            }else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "暂无数据"
                    }
                }));

            // this.table.find("tbody .view").on("click", $.proxy(this.onClickItemView, this));
        },

        onClickItemView:function(){

        },

        render: function(target) {
            this.$el.appendTo(target);

        }
    });

    return ReplaceNodeView;
});