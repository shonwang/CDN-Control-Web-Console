define("setupModuleManage.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var SetupModuleManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupModuleManage/setupModuleManage.html'])());
            this.$el.find(".create").on('click', $.proxy(this.onClickCreateBtn, this));
            this.$el.find(".setup").on('click', $.proxy(this.onClickSetupBtn, this));

            this.typeData = [{
                typeDomain: "speedtest.ksc-test.com",
                typeParam: "upload"
            },{
                typeDomain: "speedtest.ksc-test.com",
                typeParam: "download"
            },{
                typeDomain: "domain name3",
                typeParam: "push"
            },{
                typeDomain: "domain name4",
                typeParam: "pull"
            }]

            this.defaultParam = {
                domain: "",
                type: 1,
                typeDomain: this.typeData[1].typeDomain,
                typeParam: this.typeData[1].typeParam,
                testDir: ""
            }

            var testDir = localStorage["SPEED_MEASURE_TEST_DIR"],
                typeDataStr = localStorage["SPEED_MEASURE_TYPE_DATA"];

            if (testDir) this.defaultParam.testDir = testDir;
            if (typeDataStr) this.typeData = JSON.parse(typeDataStr);

            this.initDropdown();
        },

        initDropdown: function(){
            var protocolArray = [
                // {
                //     name: "点播上传",
                //     value: 0
                // }, 
                {
                    name: "点播下载",
                    value: 1
                }, 
                // {
                //     name: "直播推流",
                //     value: 2
                // }, {
                //     name: "直播拉流",
                //     value: 3
                // }
                ],
                rootNode = this.$el.find(".dropdown-type");
            Utility.initDropMenu(rootNode, protocolArray, function(value) {
                this.defaultParam.type = parseInt(value)
                this.defaultParam.typeDomain = this.typeData[this.defaultParam.type].typeDomain;
                this.defaultParam.typeParam = this.typeData[this.defaultParam.type].typeParam;
            }.bind(this));
        },

        onClickCreateBtn: function() {
            this.defaultParam.domain = this.$el.find("#input-domain").val().trim();

            if (this.defaultParam.domain === "") {
                alert("你什么都没有输入！")
                return;
            }

            if (this.selectTopoPopup) $("#" + this.selectTopoPopup.modalId).remove();

            var mySelectTopoView = new SetupModuleManageSharedView({
                collection: this.collection,
                imageParam: this.defaultParam
            });
            var options = {
                title: "分享测速链接",
                body: mySelectTopoView,
                backdrop: 'static',
                type: 1,
                onOKCallback: function() {
                    this.selectTopoPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function() {}.bind(this)
            }
            this.selectTopoPopup = new Modal(options);
        },

        onClickSetupBtn: function() {
            if (this.selectTopoPopup) $("#" + this.selectTopoPopup.modalId).remove();

            var mySelectTopoView = new SetupModuleManageSetupView({
                collection: this.collection,
                imageParam: this.defaultParam,
                typeData: this.typeData
            });
            var options = {
                title: "设置",
                body: mySelectTopoView,
                backdrop: 'static',
                type: 2,
                width: 800,
                onOKCallback: function() {
                    mySelectTopoView.onSure();
                    this.selectTopoPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function() {}.bind(this)
            }
            this.selectTopoPopup = new Modal(options);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function(){
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

    return SetupModuleManageView;
});