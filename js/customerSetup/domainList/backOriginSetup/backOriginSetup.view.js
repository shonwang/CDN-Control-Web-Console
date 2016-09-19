define("backOriginSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var BackOriginSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/backOriginSetup/backOriginSetup.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain
                }
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

            this.hideAllOptions();
            this.isUseAdvance = false;
            this.initOriginSetup();
            this.initOriginTypeDropdown();

            this.$el.find(".use-advance .togglebutton input").on("click", $.proxy(this.onClickIsUseAdvanceBtn, this));

            this.hideModifyHostOptions();
            this.isModifyHost = false;
            this.initModifyHost();
            this.initModifyHostDropdown();

            this.$el.find(".modify-host .togglebutton input").on("click", $.proxy(this.onClickIsModifyHostBtn, this));

            //this.$el.find(".setup-ctn").html(_.template(template['tpl/loading.html'])({}));

            // this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            // this.collection.on("get.channel.error", $.proxy(this.onGetError, this));

        },

        onClickIsUseAdvanceBtn: function(event){
            this.hideAllOptions();
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.isUseAdvance = true;
            } else {
                this.isUseAdvance = false;
            }
            this.initOriginSetup();
        },

        initOriginSetup: function(){
            if (this.isUseAdvance){
                this.$el.find(".advanced").show();
            } else {
                this.$el.find(".base").show();
            }
        },

        initOriginTypeDropdown: function(){
            var  baseArray = [
                {name: "域名回源", value: 1},
                {name: "IP回源", value: 2},
                {name: "KS3回源", value: 3}
            ],
            rootNode = this.$el.find(".base .origin-type");
            Utility.initDropMenu(rootNode, baseArray, function(value){

            }.bind(this));

            var defaultValue = _.find(baseArray, function(object){
                return object.value === 3;
            }.bind(this));

            if (defaultValue)
                this.$el.find(".base #dropdown-origin-type .cur-value").html(defaultValue.name);
            else
                this.$el.find(".base #dropdown-origin-type .cur-value").html(baseArray[0].name);

            var advancedArray = [
                {name: "域名回源", value: 1},
                {name: "IP回源", value: 2}
            ];

            var rootOtherNode = this.$el.find(".advanced .origin-type");
            Utility.initDropMenu(rootOtherNode, advancedArray, function(value){

            }.bind(this));

            var defaultOtherValue = _.find(advancedArray, function(object){
                return object.value === 2;
            }.bind(this));

            if (defaultOtherValue)
                this.$el.find(".advanced #dropdown-origin-type .cur-value").html(defaultOtherValue.name);
            else
                this.$el.find(".advanced #dropdown-origin-type .cur-value").html(advancedArray[0].name);
        },

        hideAllOptions: function(){
            this.$el.find(".base").hide();
            this.$el.find(".advanced").hide();
        },

        hideModifyHostOptions: function(){
            this.$el.find(".origin-domain").hide();
        },

        initModifyHostDropdown: function(){
            var  domainTypeArray = [
                {name: "加速域名", value: 1},
                {name: "源站域名", value: 2},
                {name: "自定义域名", value: 3}
            ],
            rootNode = this.$el.find(".origin-domain");
            Utility.initDropMenu(rootNode, domainTypeArray, function(value){

            }.bind(this));

            var defaultValue = _.find(domainTypeArray, function(object){
                return object.value === 3;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-origin-domain .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-origin-domain .cur-value").html(domainTypeArray[0].name);
        },

        initModifyHost: function(){
            if (this.isModifyHost){
                this.$el.find(".origin-domain").show();
            } else {
                this.$el.find(".origin-domain").hide();
            }
        },

        onClickIsModifyHostBtn: function(event){
            this.hideModifyHostOptions();
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.isModifyHost = true;
            } else {
                this.isModifyHost = false;
            }
            this.initModifyHost();
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

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return BackOriginSetupView;
});