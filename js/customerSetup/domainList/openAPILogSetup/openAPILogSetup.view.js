define("openAPILogSetup.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var OpenAPILogSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/openAPILogSetup/openAPILogSetup.html'])());
            var clientInfo = JSON.parse(options.query),
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.clientInfo = clientInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));

            this.optHeader.find(".publish").remove();
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

            this.defaultParam = {
                "userId": clientInfo.uid, //Long 用户id
                "originId": this.domainInfo.id, //String 域名
                "ks3Id": null, //Long Ks3日志配置记录id 不返回表示未开通或已关闭
                "granularity": 1, //粒度， 1 按天；0按小时; 2 按分钟; 3 30分钟；） 
                "bucket": "", //String ks3存储位置 
                "formatId": 1, //Long 日志模板id
                "formatName": null, //String 日志模板名称
                "formatType": 1, //Integer 日志模板类型
                "fileTemplate": "", //String 日志文件名称模板
                "pathTemplate": "", //String 日志文件存储地址模板
                "updateTime": null, //String
                "createTime": null, //String
                "interfaceCaller": $(".user-name").html()
            }

            this.$el.find(".ks3-log .togglebutton input").on("click", $.proxy(this.onClickToggle, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.collection.on("get.templateInfo.success", $.proxy(this.initDropdown, this))
            this.collection.on("get.templateInfo.error", $.proxy(this.onGetError, this))
            this.collection.on("set.logSetup.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.logSetup.error", $.proxy(this.onGetError, this));
            this.collection.on("get.logSetup.success", $.proxy(this.onGetDomainInfo, this));
            this.collection.on("get.logSetup.eror", $.proxy(this.onGetError, this));
            this.collection.getLogSetup({
                userId: clientInfo.uid,
                domainName: this.domainInfo.domain
            });
        },

        initDropdown: function(data) {
            var templateTypeArray = [],
                rootNode = this.$el.find(".log-template");

            _.each(data.openApiLogFormat, function(el) {
                templateTypeArray.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))

            Utility.initDropMenu(rootNode, templateTypeArray, function(value) {
                this.defaultParam.formatId = parseInt(value)
            }.bind(this));

            if (!this.defaultParam.formatName) {
                this.$el.find("#dropdown-log-template .cur-value").html(templateTypeArray[0].name);
                this.defaultParam.formatId = templateTypeArray[0].value
            } else {
                this.$el.find("#dropdown-log-template .cur-value").html(this.defaultParam.formatName);
            }

            var granularityArray = [],
                rootNode = this.$el.find(".log-granularity");

            _.each(data.openApiLogGranularity, function(el) {
                granularityArray.push({
                    name: el.name,
                    value: el.granularity
                })
            }.bind(this))

            Utility.initDropMenu(rootNode, granularityArray, function(value) {
                this.defaultParam.granularity = parseInt(value)
            }.bind(this));

            var defaultValue = _.find(granularityArray, function(object) {
                return object.value === this.defaultParam.granularityArray;
            }.bind(this));

            if (defaultValue) {
                this.$el.find("#dropdown-log-granularity .cur-value").html(defaultValue.name);
            } else {
                this.$el.find("#dropdown-log-granularity .cur-value").html(granularityArray[0].name);
                this.defaultParam.granularity = granularityArray[0].value;
            }
        },

        onGetDomainInfo: function(data) {
            this.defaultParam = _.extend({}, data)
            this.initSetup();
            this.$el.find("#bucket").val(this.defaultParam.bucket);
            this.$el.find("#file-template").val(this.defaultParam.fileTemplate);
            this.$el.find("#path-template").val(this.defaultParam.pathTemplate);
            this.$el.find("#create-date").val(this.defaultParam.createTime);
            this.$el.find("#update-date").val(this.defaultParam.updateTime);

            this.collection.getAPITemplateInfo({
                userId: this.clientInfo.uid,
                originId: this.domainInfo.id
            });
        },

        initSetup: function() {
            if (!this.defaultParam.ks3Id) {
                this.$el.find(".ks3-log .togglebutton input").get(0).checked = false;
                this.$el.find(".log-ctn").hide(200);
                this.defaultParam.action = "stop";
            } else {
                this.$el.find(".ks3-log .togglebutton input").get(0).checked = true;
                this.$el.find(".log-ctn").show(200);
                this.defaultParam.action = "start";
            }
        },

        onSaveSuccess: function() {
            alert("保存成功！")
            this.collection.getLogSetup({
                userId: this.clientInfo.uid,
                domainName: this.domainInfo.domain
            });
        },

        onClickSaveBtn: function() {
            var postParam = {
                "userId": this.defaultParam.userId,
                "originId": this.domainInfo.id,
                "action": this.defaultParam.action,
                "granularity": this.defaultParam.granularity,
                "bucket": this.defaultParam.bucket,
                "formatId": this.defaultParam.formatId,
                "fileTemplate": this.defaultParam.fileTemplate,
                "pathTemplate": this.defaultParam.pathTemplate,
                "interfaceCaller": this.defaultParam.interfaceCaller || $(".user-name").html()
            }
            this.collection.setLogSetup(postParam)
        },

        onClickToggle: function() {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked) {
                this.defaultParam.action = "start";
                this.$el.find(".log-ctn").show(200);
            } else {
                this.defaultParam.action = "stop";
                this.$el.find(".log-ctn").hide(200);
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

        update: function(query, query2, target) {
            this.options.query = query;
            this.options.query2 = query2;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return OpenAPILogSetupView;
});