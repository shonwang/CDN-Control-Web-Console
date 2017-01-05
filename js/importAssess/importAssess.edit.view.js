define("setupChannelManage.edit.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var EditChannelView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.edit.html'])({data: {}}));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".use-customized .togglebutton input").on("click", $.proxy(this.onClickIsUseCustomizedBtn, this));
            this.$el.find(".view-setup-list").on("click", $.proxy(this.onClickViewSetupBillBtn, this))

            this.initSetup()
        },

        initSetup: function(){
            var isUseCustomized = this.model.get("tempUseCustomized");
            if (isUseCustomized === 2){
                this.$el.find(".use-customized .togglebutton input").get(0).checked = true;
                this.showCustomized();
            } else {
                this.$el.find(".use-customized .togglebutton input").get(0).checked = false;
                this.hideCustomized();
            }

            this.initConfigFile();
        },

        initConfigFile: function(){
            this.configReadOnly = $(_.template(template['tpl/setupChannelManage/setupChannelManage.editCfgFalse.html'])({
                data: {},
                panelId: Utility.randomStr(8)
            }));
            this.configReadOnly.appendTo(this.$el.find(".automatic"))
            this.configEdit = $(_.template(template['tpl/setupChannelManage/setupChannelManage.editCfgTrue.html'])({
                data: {},
                panelId: Utility.randomStr(8)
            }));
            this.configEdit.appendTo(this.$el.find(".customized"))
        },

        onClickIsUseCustomizedBtn: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.model.set("tempUseCustomized", 2);
                this.showCustomized();
            } else {
                this.model.set("tempUseCustomized", 1);
                this.hideCustomized();
            }
        },

        hideCustomized: function(){
            this.$el.find(".customized").hide();
            this.$el.find(".customized-comment").hide();
            this.$el.find(".automatic").addClass("col-md-offset-3");
        },

        showCustomized: function(){
            this.$el.find(".customized").show();
            this.$el.find(".customized-comment").show();
            this.$el.find(".automatic").removeClass("col-md-offset-3");
        },

        onClickViewSetupBillBtn: function(){
            require(['setupBill.view', 'setupBill.model'], function(SetupBillView, SetupBillModel){
                var mySetupBillModel = new SetupBillModel();
                var mySetupBillView = new SetupBillView({
                    collection: mySetupBillModel,
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){
                        mySetupBillView.$el.remove();
                        this.$el.find(".edit-panel").show();
                    }.bind(this)
                })

                this.$el.find(".edit-panel").hide();
                mySetupBillView.render(this.$el.find(".bill-panel"));
            }.bind(this))
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return EditChannelView;
});