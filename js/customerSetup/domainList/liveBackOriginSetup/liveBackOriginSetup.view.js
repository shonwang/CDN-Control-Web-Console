define("liveBackOriginSetup.view", ['require','exports', 'template', 'modal.view', 'utility', 'backOriginSetup.view'], 
    function(require, exports, template, Modal, Utility, BackOriginSetupView) {

    var LiveBackOriginSetupView = BackOriginSetupView.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveBackOriginSetup/liveBackOriginSetup.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2);
                this.userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: this.userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

            require(["domainSetup.model"], function(DomainSetupModel){
                var myDomainSetupModel = new DomainSetupModel();
                    myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
                    myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                    myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
            }.bind(this))

            this.$el.find(".advanced").hide();
        },

        onGetDomainInfo: function(data){
            this.defaultParam = {
                isUseAdvance: 1,
                originBaseType: 1,
                originBaseDomain: "",

                originAdvanceType: 1,
                defaultPrimary: "",
                defaultBackup: "",
                unicomPrimary: "",
                unicomBackup: "",
                telecomPrimary: "",
                telecomBackup: "",
                mobilePrimary: "",
                mobileBackup: "",
                originStrategy: 1,
                ipNum: 1
            }

            if (data.domainConf && data.domainConf.backsourceFlag !== null && data.domainConf.backsourceFlag !== undefined)
                this.defaultParam.isUseAdvance = data.domainConf.backsourceFlag === 0 ? 1 : 2;

            if (data.domainConf && data.domainConf.originType !== null && data.domainConf.originType !== undefined)
                this.defaultParam.originBaseType = data.domainConf.originType;

            if (data.domainConf && data.domainConf.advanceOriginType !== null && data.domainConf.advanceOriginType !== undefined)
                this.defaultParam.originAdvanceType = data.domainConf.advanceOriginType;

            if (data.domainConf && data.domainConf.originAddress !== null && data.domainConf.originAddress !== undefined)
                this.defaultParam.originBaseDomain = data.domainConf.originAddress;

            if (data.domainConf && data.domainConf.backsourcePolicy !== null && data.domainConf.backsourcePolicy !== undefined)
                this.defaultParam.originStrategy = data.domainConf.backsourcePolicy;

            if (data.domainConf && data.domainConf.backsourceBestcount !== null && data.domainConf.backsourceBestcount !== undefined)
                this.defaultParam.ipNum = data.domainConf.backsourceBestcount;

            this.hostType = data.domainConf.hostType;
            this.busnessType = data.originDomain.type;
            this.protocol = data.domainConf.protocol;

            if (data.advanceConfigList){
                _.each(data.advanceConfigList, function(el, index, ls) {
                    if (el.originLine === 1){
                        this.defaultParam.defaultPrimary =  el.originAddress;
                        this.defaultParam.defaultBackup = el.addressBackup;
                    } else if (el.originLine === 2){
                        this.defaultParam.unicomPrimary =  el.originAddress;
                        this.defaultParam.unicomBackup = el.addressBackup;
                    } else if (el.originLine === 3){
                        this.defaultParam.telecomPrimary =  el.originAddress;
                        this.defaultParam.telecomBackup = el.addressBackup;
                    } else if (el.originLine === 4){
                        this.defaultParam.mobilePrimary =  el.originAddress;
                        this.defaultParam.mobileBackup = el.addressBackup;                        
                    }
                }.bind(this))
            }

            this.initOriginSetup();
            this.$el.find(".use-advance .togglebutton input").on("click", $.proxy(this.onClickIsUseAdvanceBtn, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.on("set.backSourceConfig.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.backSourceConfig.error", $.proxy(this.onGetError, this));

            this.initModifyHost(data);
        },
        
        initOriginSetup: function(){
            if (this.defaultParam.isUseAdvance === 1){
                this.$el.find(".use-advance .togglebutton input").get(0).checked = false;
                this.$el.find(".advanced").hide();
                this.$el.find(".base").show();
            } else if (this.defaultParam.isUseAdvance === 2) {
                this.$el.find(".use-advance .togglebutton input").get(0).checked = true;
                this.$el.find(".advanced").show();
                this.$el.find(".base").hide();
            }
            this.$el.find(".base #textarea-origin-type").val(this.defaultParam.originBaseDomain);
            this.$el.find(".default #primary").val(this.defaultParam.defaultPrimary);
            this.$el.find(".default #secondary").val(this.defaultParam.defaultBackup);
            this.$el.find(".unicom #primary").val(this.defaultParam.unicomPrimary);
            this.$el.find(".unicom #secondary").val(this.defaultParam.unicomBackup);
            this.$el.find(".telecom #primary").val(this.defaultParam.telecomPrimary);
            this.$el.find(".telecom #secondary").val(this.defaultParam.telecomBackup);
            this.$el.find(".mobile #primary").val(this.defaultParam.mobilePrimary);
            this.$el.find(".mobile #secondary").val(this.defaultParam.mobileBackup);
            if (this.defaultParam.originStrategy === 1){
                this.$el.find(".poll .radio input").get(0).checked = true;
                this.$el.find(".quality .radio input").get(0).checked = false;
            } else if (this.defaultParam.originStrategy === 2){
                this.$el.find(".poll .radio input").get(0).checked = false;
                this.$el.find(".quality .radio input").get(0).checked = true;
            }
            this.$el.find("#ip-num").val(this.defaultParam.ipNum);

            this.initOriginTypeDropdown();
            this.$el.find(".base #textarea-origin-type").on("blur", $.proxy(this.onBlurTextarea, this))
            this.$el.find(".advanced textarea").on("blur", $.proxy(this.onBlurAdvancedTextarea, this))
            this.$el.find(".strategy input[name='strategyRadios']").on("click", $.proxy(this.onClickStrategyRadio, this))
        },

        initOriginTypeDropdown: function(){
            var  baseArray = [
                {name: "域名回源", value: 2},
                {name: "视频云回源", value: 3}
            ],
            rootNode = this.$el.find(".base .origin-type");

            Utility.initDropMenu(rootNode, baseArray, function(value){
                this.defaultParam.originBaseType = parseInt(value)
            }.bind(this));

            var defaultValue = _.find(baseArray, function(object){
                return object.value === this.defaultParam.originBaseType;
            }.bind(this));

            if (defaultValue)
                this.$el.find(".base #dropdown-origin-type .cur-value").html(defaultValue.name);
            else
                this.$el.find(".base #dropdown-origin-type .cur-value").html(baseArray[0].name);

            // var advancedArray = [
            //     {name: "域名回源", value: 2},
            //     {name: "IP回源", value: 1}
            // ];

            // var rootOtherNode = this.$el.find(".advanced .origin-type");
            // Utility.initDropMenu(rootOtherNode, advancedArray, function(value){
            //     this.defaultParam.originAdvanceType = parseInt(value)
                
            //     if (this.defaultParam.originAdvanceType === 2){
            //         this.$el.find("textarea[id='secondary']").hide();
            //         this.$el.find("textarea[id='secondary']").val("");
            //     } else {
            //         this.$el.find("textarea[id='secondary']").show();
            //     }
            // }.bind(this));

            // var defaultOtherValue = _.find(advancedArray, function(object){
            //     return object.value === this.defaultParam.originAdvanceType;
            // }.bind(this));

            // if (this.defaultParam.originAdvanceType === 2)
            //     this.$el.find("textarea[id='secondary']").hide();
            // else
            //     this.$el.find("textarea[id='secondary']").show();

            // if (defaultOtherValue)
            //     this.$el.find(".advanced #dropdown-origin-type .cur-value").html(defaultOtherValue.name);
            // else
            //     this.$el.find(".advanced #dropdown-origin-type .cur-value").html(advancedArray[0].name);
        },

        // onClickSaveBtn: function(){
        //     if ((this.hostType === 2 && this.defaultParam.originBaseType === 1 && this.defaultParam.isUseAdvance === 1) || 
        //         (this.hostType === 2 && this.defaultParam.isUseAdvance === 2)){
        //         alert("修改回源Host设置为源站域名，不能使用IP回源");
        //         return;
        //     };
        //     if (this.defaultParam.isUseAdvance === 1 && !this.checkBaseOrigin()){
        //         return;
        //     } if (this.defaultParam.isUseAdvance === 2) {
        //         var textareaNodes = this.$el.find(".advanced textarea");
        //         for (var i = 0; i < textareaNodes.length; i++){
        //             var value = textareaNodes[i].value.trim();
        //             if (value === "") continue;
        //             var result = this.checkBaseOrigin(value, this.defaultParam.originAdvanceType)
        //             if (!result) return;
        //         }
        //         var defaultPrimary = this.$el.find(".default #primary").val();
        //         if (defaultPrimary === ""){
        //             alert("默认源主必填！")
        //             return;
        //         }
        //         var ipNum = parseInt(this.$el.find("#ip-num").val());
        //         if (this.defaultParam.originStrategy === 2 && (ipNum > 10 || ipNum < 1)){
        //             alert("IP数量取值1-10")
        //             return;
        //         }
        //     }

        //     var postParam = {
        //         "originId": this.domainInfo.id,
        //         "domain" : this.domainInfo.domain,
        //         "backsourceFlag": this.defaultParam.isUseAdvance === 1 ? 0 : 1, //配置高级回源策略的开启或关闭,0:关闭 1:开启
        //         "originType": this.defaultParam.isUseAdvance === 1 ? this.defaultParam.originBaseType : this.defaultParam.originAdvanceType,
        //         "originAddress": _.uniq(this.$el.find(".base #textarea-origin-type").val().split(',')).join(','),
        //         "backsourcePolicy": this.defaultParam.originStrategy,
        //         "backsourceBestcount": parseInt(this.$el.find("#ip-num").val()),
        //         "advanceConfigList":[{
        //             "originLine": 1, //1:default默认源； 2:un联通源; 3:ct电信源; 4:cm移动源
        //             "originAddress": _.uniq(this.$el.find(".default #primary").val().split(',')).join(','),
        //             "addressBackup": _.uniq(this.$el.find(".default #secondary").val().split(',')).join(',')
        //         },{
        //             "originLine": 2,
        //             "originAddress": _.uniq(this.$el.find(".unicom #primary").val().split(',')).join(','),
        //             "addressBackup": _.uniq(this.$el.find(".unicom #secondary").val().split(',')).join(',') 
        //         },{
        //             "originLine": 3,
        //             "originAddress": _.uniq(this.$el.find(".telecom #primary").val().split(',')).join(','),
        //             "addressBackup": _.uniq(this.$el.find(".telecom #secondary").val().split(',')).join(',') 
        //         },{
        //             "originLine": 4,
        //             "originAddress": _.uniq(this.$el.find(".mobile #primary").val().split(',')).join(','),
        //             "addressBackup": _.uniq(this.$el.find(".mobile #secondary").val().split(',')).join(',') 
        //         }]
        //     }
        //     this.collection.setBackSourceConfig(postParam)
        // },

        // launchSendPopup: function(){
        //     require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
        //         var mySaveThenSendView = new SaveThenSendView({
        //             collection: new SaveThenSendModel(),
        //             domainInfo: this.domainInfo,
        //             onSendSuccess: function() {
        //                 this.sendPopup.$el.modal("hide");
        //                 window.location.hash = '#/domainList/' + this.options.query;
        //             }.bind(this)
        //         });
        //         var options = {
        //             title: "发布",
        //             body : mySaveThenSendView,
        //             backdrop : 'static',
        //             type     : 2,
        //             width: 800,
        //             onOKCallback:  function(){
        //                 mySaveThenSendView.sendConfig();
        //             }.bind(this),
        //             onHiddenCallback: function(){
        //                 if (this.sendPopup) $("#" + this.sendPopup.modalId).remove();
        //                 this.update(this.options.query, this.options.query2, this.target);
        //             }.bind(this)
        //         }
        //         this.sendPopup = new Modal(options);
        //     }.bind(this))
        // },
    });

    return LiveBackOriginSetupView;
});