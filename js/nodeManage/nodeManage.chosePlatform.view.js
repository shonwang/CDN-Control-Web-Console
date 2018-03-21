define("nodeManage.chosePlatform.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var ChosePlatformView = Backbone.View.extend({
            initialize: function(options) {
                this.options = options;
                this.$el = $(_.template(template['tpl/nodeManage/nodeManage.chosePlatform.html'])({}));
                this.$el.find(".card").on("click", $.proxy(this.onClickPlatformCard, this))
            },

            onClickPlatformCard: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                if (id == "live") {
                    this.platformId = 203
                } else if (id == "cache") {
                    this.platformId = 202
                }
                this.options.onSelectPlatform(this.platformId)
                this.rootNode.modal("hide");
            },

            render: function(target, rootNode) {
                this.$el.appendTo(target);
                if (rootNode) this.rootNode = rootNode;
            }
        });
        return ChosePlatformView
    })