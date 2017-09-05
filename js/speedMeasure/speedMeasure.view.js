define("speedMeasure.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var SpeedMeasureSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.imageParam = options.imageParam;
            this.typeData = options.typeData
            this.$el = $(_.template(template['tpl/speedMeasure/speedMeasure.table.html'])());
            this.initTable();

            this.$el.find("input").on("blur", $.proxy(this.onBlurInput, this));
        },

        initTable: function(){
            this.$el.find("#test-dir").val(this.imageParam.testDir)
            var domainNodes = this.$el.find(".domain-field input"),
                inputNodes = this.$el.find(".input-field input");
            _.each(this.typeData, function(el, index){
                _.each(domainNodes, function(node, nodeIndex){
                    if (index === nodeIndex)
                        node.value = el.typeDomain
                }.bind(this))
                _.each(inputNodes, function(node, nodeIndex){
                    if (index === nodeIndex)
                        node.value = el.typeParam
                }.bind(this))
            }.bind(this))
        },

        onBlurInput: function(event){
            var eventTarget = event.srcElement || event.target,
                id = eventTarget.id, 
                trNode = $(eventTarget).parents("tr")
            switch(id){
                case "test-dir":
                    this.imageParam.testDir = eventTarget.value;
                    break;
                case "upload":
                    if (trNode.hasClass("domain-field"))
                        this.typeData[0].typeDomain = eventTarget.value;
                    else
                        this.typeData[0].typeParam = eventTarget.value;
                    break;
                case "download":
                    if (trNode.hasClass("domain-field"))
                        this.typeData[1].typeDomain = eventTarget.value;
                    else
                        this.typeData[1].typeParam = eventTarget.value;
                    break;
                case "push":
                    if (trNode.hasClass("domain-field"))
                        this.typeData[2].typeDomain = eventTarget.value;
                    else
                        this.typeData[2].typeParam = eventTarget.value;
                    break;
                case "pull":
                    if (trNode.hasClass("domain-field"))
                        this.typeData[3].typeDomain = eventTarget.value;
                    else
                        this.typeData[3].typeParam = eventTarget.value;
                    break;
            }
        },

        onSure: function(){
            localStorage["SPEED_MEASURE_TEST_DIR"] = this.imageParam.testDir;
            localStorage["SPEED_MEASURE_TYPE_DATA"] = JSON.stringify(this.typeData);
            alert("已经成功保存至你的电脑！")
        },

        render: function(target) {
            this.$el.appendTo(target)
            this.target = target;
        }
    });

    var SpeedMeasureSharedView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.imageParam = options.imageParam;
            this.$el = $(_.template(template['tpl/speedMeasure/speedMeasure.shared.html'])());
            this.$el.find('.image-ctn').html(_.template(template['tpl/loading.html'])({}));
            this.$el.find("#copy-btn").on("click", $.proxy(this.onClickCopy, this));

            this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.channel.error", $.proxy(this.onGetError, this));
            this.queryArgs = {
                "domain": this.imageParam.domain
            }
            this.collection.queryChannel(this.queryArgs);
        },

        onChannelListSuccess: function(){
            if (this.collection.models.length === 0) {
                this.$el.find('.image-ctn').html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "该测速域名不是服务域名，请核实后重新输入"
                    }
                }));
            } else if (this.collection.models.length === 1 && 
                this.collection.models[0].get("auditStatus") !== -1 &&
                this.collection.models[0].get("auditStatus") !== 0 &&
                this.collection.models[0].get("auditStatus") !== 2){
                this.$el.find('.image-ctn').html("")
                var url = "http://" + this.imageParam.typeDomain + '/' + 
                          this.imageParam.testDir + 
                          this.imageParam.typeParam + '/index.html?host=' +
                          this.imageParam.domain;

                this.$el.find("#url").val(url)
                this.$el.find('.image-ctn').qrcode({
                    width: 192,
                    height: 192,
                    text: url
                });
            } else {
                this.$el.find('.image-ctn').html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "该测速域名不是服务域名，请核实后重新输入"
                    }
                }));
            }
        },

        onClickCopy: function(){
            var inputContainer = this.$el.find("#url").get(0);
            inputContainer.focus();
            inputContainer.select();
            document.execCommand("copy");
            alert("复制成功!")
        },

        onGetError: function(error){
            var message = "查询域名服务状态出错，请刷新重试！"
            if (error&&error.message)
                message = error.message

            this.$el.find('.image-ctn').html(_.template(template['tpl/empty-2.html'])({
                data: {
                    message: message
                }
            }));
        },

        render: function(target) {
            this.$el.appendTo(target)
            this.target = target;
        }
    });

    var SpeedMeasureView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/speedMeasure/speedMeasure.html'])());
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

            var mySelectTopoView = new SpeedMeasureSharedView({
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

            var mySelectTopoView = new SpeedMeasureSetupView({
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

    return SpeedMeasureView;
});