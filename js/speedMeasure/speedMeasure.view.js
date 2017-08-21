define("speedMeasure.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

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
                "domain": this.imageParam.domain,
                "type": null,
                "protocol": null,
                "cdnFactory": null,
                "auditStatus": 13, //运行中
                "topologyId": null,
                "roleId": null,
                "currentPage": 1,
                "pageSize": 99999
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
            } else if (this.collection.models.length === 1){
                this.$el.find('.image-ctn').html("")
                var url = "http://" + this.imageParam.typeDomain + '/' + 
                          this.imageParam.testDir + '/' +
                          this.imageParam.typeParam + '?domain=' +
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

            this.typeData = [{
                typeDomain: "domain name1",
                typeParam: "upload_speed"
            },{
                typeDomain: "domain name2",
                typeParam: "download_speed"
            },{
                typeDomain: "domain name3",
                typeParam: "push_speed"
            },{
                typeDomain: "domain name4",
                typeParam: "pull_speed"
            }]

            this.defaultParam = {
                domain: "",
                type: 0,
                typeDomain: this.typeData[0].typeDomain,
                typeParam: this.typeData[0].typeParam,
                testDir: "kcdn-speedtest"
            }

            this.initDropdown();
        },

        initDropdown: function(){
            var protocolArray = [{
                    name: "点播上传",
                    value: 0
                }, {
                    name: "点播下载",
                    value: 1
                }, {
                    name: "直播上传",
                    value: 2
                }, {
                    name: "直播下载",
                    value: 3
                }],
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