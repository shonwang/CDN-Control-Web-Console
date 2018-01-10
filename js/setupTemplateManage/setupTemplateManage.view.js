define("setupTemplateManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var SetupTemplateManageView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.collection.on("get.frameTemplate.success", $.proxy(this.onGetFrameSuccess, this))
                this.collection.on("get.frameTemplate.error", $.proxy(this.onGetError, this))
                this.collection.getFrameTemplate({
                    type: 3
                })
                this.initFrameTemplate();
                this.$el.find("#live-push textarea").on("blur", $.proxy(this.onLivePushFrameBlur, this));
                this.$el.find("#rtmp-flv-pull textarea").on("blur", $.proxy(this.onRtmpPullFrameBlur, this));

                this.collection.on("save.frameTemplate.success", $.proxy(this.onSaveFrameSuccess, this))
                this.collection.on("save.frameTemplate.error", $.proxy(this.onGetError, this))
            },

            onLivePushFrameBlur: function() {
                this.frameMessage.frameTemplate = this.$el.find("#live-push textarea").val();
            },

            onRtmpPullFrameBlur: function() {
                this.frameMessage.frameTemplate = this.$el.find("#rtmp-flv-pull textarea").val();
            },

            onGetFrameSuccess: function(res) {
                this.frameMessage = res;
                if (this.frameMessage.type == 3)
                    this.$el.find("#live-push textarea").val(this.frameMessage.frameTemplate);
                else
                    this.$el.find("#rtmp-flv-pull textarea").val(this.frameMessage.frameTemplate);
            },

            onSaveFrameSuccess: function() {
                alert("保存成功！");
                if (this.frameMessage.type == 2)
                    this.collection.getFrameTemplate({
                        type: 2
                    })
                else
                    this.collection.getFrameTemplate({
                        type: 3
                    })
            },
            initFrameTemplate: function() {
                this.$el = $(_.template(template['tpl/setupTemplateManage/setupLiveDynamicManage.html'])({}));
                this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(this.onShownTab, this));
                this.$el.find(".saveframe").on("click", $.proxy(this.onClickSaveFrameBtn, this))
            },

            onClickSaveFrameBtn: function() {
                this.collection.saveFrameTemplate(this.frameMessage);
            },
            onShownTab: function(e) {
                var eventTarget = e.target; // newly activated tab
                var id = $(eventTarget).attr("data-target");
                relatedID = $(e.relatedTarget).attr("data-target");
                switch (id) {
                    case "#live-push":
                        this.currentTab = "#live-push";
                        this.collection.getFrameTemplate({
                            type: 3
                        })
                        break;
                    case "#rtmp-flv-pull":
                        this.currentTab = "#rtmp-flv-pull";
                        this.collection.getFrameTemplate({
                            type: 2
                        })
                        break;
                }
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            hide: function() {
                this.$el.hide();
            },

            update: function(target) {
                this.collection.off();
                this.collection.reset();
                this.remove();
                this.initialize(this.options);
                this.render(target || this.target);
            },

            render: function(target) {
                this.$el.appendTo(target)
                this.target = target;
            }
        });

        return SetupTemplateManageView;
    });