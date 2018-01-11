define("setupTopoManage.update.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var UpdateTopoView = Backbone.View.extend({
            events: {},
           
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                
                this.collection.off('get.topo.OriginInfo.success');
                this.collection.off('get.topo.OriginInfo.error');
                this.collection.on('get.topo.OriginInfo.success', $.proxy(this.onOriginInfo, this));
                this.collection.on('get.topo.OriginInfo.error', $.proxy(this.onGetError, this));

                this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.update.html'])({
                    data: {},
                    pageType:this.options.pageType
                }));

            },

            onOriginInfo: function(res) {
                this.defaultParam = {
                    "id": res.id,
                    "name": res.name,
                    "allNodes": res.allNodes,
                    "upperNodes": res.upperNodes,
                    "rule": res.rule,
                    "type": res.type,
                    "mark": res.mark
                }

                this.$el.find("#input-name").val(res.name);
                this.$el.find("#comment").val(res.mark);
                this.$el.find("#input-name").attr("readonly", "true");
                if (this.isView)
                    this.$el.find("#comment").attr("readonly", "true");

                console.log("编辑的拓扑: ", this.defaultParam)
                this.initSetup();
            },
            
            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            onSaveError: function(error) {
                this.isSaving = false;
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return UpdateTopoView;
    });