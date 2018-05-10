define("notStandardBackOriginSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var AddEditBackupSourceView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.backupOriginType = options.backupOriginType;
            this.backsourceCustom = options.backsourceCustom
            this.$el = $(_.template(template['tpl/customerSetup/domainList/backOriginSetup/notStandardBackOriginSetup.add.html'])());
            this.initSetup();
        },

        initSetup: function(){
            _.each(this.model, function(el){
                this.$el.find(".advanced #secondary-" + el.originLine).val(el.addressBackup);
            }.bind(this))
            this.$el.find(".advanced #custom").val(this.backsourceCustom);

            var advancedArray = [
                {name: "域名回源", value: 2},
                {name: "IP回源", value: 1},
                {name: "自定义", value: 3},
            ];

            var rootOtherNode = this.$el.find(".advanced .origin-type");
            Utility.initDropMenu(rootOtherNode, advancedArray, function(value){
                this.backupOriginType = parseInt(value);
                this.displayCustom();
            }.bind(this));

            var defaultOtherValue = _.find(advancedArray, function(object){
                return object.value === this.backupOriginType;
            }.bind(this));

            this.displayCustom();

            if (defaultOtherValue)
                this.$el.find(".advanced #dropdown-origin-type .cur-value").html(defaultOtherValue.name);
            else
                this.$el.find(".advanced #dropdown-origin-type .cur-value").html(advancedArray[0].name);
        },

        displayCustom: function(){
            if (this.backupOriginType === 3) {
                this.$el.find(".default").hide();
                this.$el.find(".unicom").hide();
                this.$el.find(".telecom").hide();
                this.$el.find(".mobile").hide();
                this.$el.find(".custom").show();
            } else {
                this.$el.find(".default").show();
                this.$el.find(".unicom").show();
                this.$el.find(".telecom").show();
                this.$el.find(".mobile").show();
                this.$el.find(".custom").hide();                  
            }
        },

        onSure: function(){
            _.each(this.model, function(el){
                el.addressBackup = this.$el.find(".advanced #secondary-" + el.originLine).val();
            }.bind(this))
            this.backsourceCustom = this.$el.find(".advanced #custom").val();
            return {
                "backupOriginType": this.backupOriginType,
                "backsourceCustom": this.backsourceCustom
            }
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var BackOriginSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/backOriginSetup/notStandardBackOriginSetup.html'])());
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

            this.defaultParam = {
                "backsourceFlag":0,  //高级回源策略开关 0:关 1:开
                "originType": 1,     //普通回源回源类型1.IP,  2.源站域名,3.金山云域名
                "originAddress": "1.1.1.1",//回源地址
                "backsourceAdvance": {//高级回源
                    "hostOriginType":1,//主源站类型 1:IP源站 2:域名源站
                    "backupOriginType":1,//备源站类型 1:IP源站 2:域名源站 3：自定义
                    "backsourcePolicy":1,//1:rr轮训 2:quality按质量最优的topN来轮训回源 
                    "backsourceBestcount":1,//当OriginPolicy是quality时，该项必填。取值1-10
                    "strategyOpenFlag": 0,//高级回源策略开关
                    "edgeOpenFlag": 0,//边缘回源设置
                    "rangeConfig": 0,//分片回源开关
                    "checkLastmod": 0,//文件一致性校验
                    "backsourceCustom": "",
                    "advanceConfigList":[],
                    "strategyAdvanceList":[]
                }
            };

            this.defaultAdvanceConfigList = [{
                "originLine": 1, //源站线路，1:default默认源； 2:un联通源; 3:ct电信源; 4:cm移动源
                "originAddress": "", //主回源地址
                "addressBackup": "" //备回源地址
            }, {
                "originLine": 2,
                "originAddress": "",
                "addressBackup": ""
            }, {
                "originLine": 3,
                "originAddress": "",
                "addressBackup": ""
            }, {
                "originLine": 4,
                "originAddress": "",
                "addressBackup": ""
            }];

            this.defaultStrategyAdvanceList = [{ //高级回源策略
                "originLine": 2, //源站线路，1:default默认源； 2:un联通源; 3:ct电信源; 4:cm移动源
                "backsourcePolicy": 1, //1:rr轮训 2:quality按质量最优的topN来轮训回源 
                "backsourceBestcount": 1, //当OriginPolicy是quality时，该项必填。取值1-10
                "openFlag": 0, //0:关闭  1:开启
            }, {
                "originLine": 3,
                "backsourcePolicy": 1,
                "backsourceBestcount": 1,
                "openFlag": 0,
            }, {
                "originLine": 4,
                "backsourcePolicy": 1,
                "backsourceBestcount": 1,
                "openFlag": 0,
            }]

            this.$el.find(".use-advance .togglebutton input").on("click", $.proxy(this.onClickIsUseAdvanceBtn, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.on("set.backSourceConfig.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.backSourceConfig.error", $.proxy(this.onGetError, this));
            this.collection.on("get.backSourceConfig.success", $.proxy(this.onGetBackSourceConfig, this));
            this.collection.on("get.backSourceConfig.error", $.proxy(this.onGetError, this));
            this.collection.on("set.edgeOpen.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.edgeOpen.error", $.proxy(this.onGetError, this));
            this.collection.on("set.rangeConfig.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.rangeConfig.error", $.proxy(this.onGetError, this));
            this.collection.on("set.originProtocol.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.originProtocol.error", $.proxy(this.onGetError, this));

            require(["domainSetup.model"], function(DomainSetupModel){
                var myDomainSetupModel = new DomainSetupModel();
                    myDomainSetupModel.on("get.domainInfo.success", $.proxy(this.onGetDomainInfo, this));
                    myDomainSetupModel.on("get.domainInfo.error", $.proxy(this.onGetError, this));
                    myDomainSetupModel.getDomainInfo({originId: this.domainInfo.id});
            }.bind(this))
        },

        onGetDomainInfo: function(data){
            this.domainInfoData = data;
            this.hostType = data.domainConf.hostType;
            this.busnessType = data.originDomain.type;
            this.protocol = data.domainConf.protocol;
            this.originProtocol = data.domainConf.originProtocol;
            this.checkSourceHttps = data.domainConf.checkSourceHttps;
            this.collection.getBackSourceConfig({originId: this.domainInfo.id})
        },

        onGetBackSourceConfig: function(data){
            this.initOriginSetup(data);
            this.initModifyHost(this.domainInfoData);
        },
        
        initOriginSetup: function(data){
            if (data) {
                this.defaultParam = _.extend(this.defaultParam, data)
            }

            this.initOriginTypeDropdown();
            
            _.each(this.defaultStrategyAdvanceList, function(el){
                _.each(this.defaultParam.backsourceAdvance.strategyAdvanceList, function(el1){
                    if (el.originLine === el1.originLine) {
                        el.backsourcePolicy = el1.backsourcePolicy;
                        el.backsourceBestcount = el1.backsourceBestcount;
                        el.openFlag = el1.openFlag;
                    }
                }.bind(this))
            }.bind(this))
            this.defaultParam.backsourceAdvance.strategyAdvanceList = this.defaultStrategyAdvanceList

            _.each(this.defaultAdvanceConfigList, function(el){
                _.each(this.defaultParam.backsourceAdvance.advanceConfigList, function(el1){
                    if (el.originLine === el1.originLine) {
                        el.originAddress = el1.originAddress;
                        el.addressBackup = el1.addressBackup;
                    }
                }.bind(this))
            }.bind(this))
            this.defaultParam.backsourceAdvance.advanceConfigList = this.defaultAdvanceConfigList

            if (this.defaultParam.backsourceFlag === 0){
                this.$el.find(".use-advance .togglebutton input").get(0).checked = false;
                this.$el.find(".advanced").hide();
                this.$el.find(".base").show();
            } else if (this.defaultParam.backsourceFlag === 1) {
                this.$el.find(".use-advance .togglebutton input").get(0).checked = true;
                this.$el.find(".advanced").show();
                this.$el.find(".base").hide();
            }
            this.$el.find(".base #textarea-origin-type").val(this.defaultParam.originAddress);

            var isHaveBackupAddress = "", tpl = '', backupOriginTypeStr = '';
            _.each(this.defaultParam.backsourceAdvance.advanceConfigList, function(el){
                this.$el.find("#primary-" + el.originLine).val(el.originAddress);
                isHaveBackupAddress = isHaveBackupAddress + el.addressBackup
            }.bind(this))
            backupOriginTypeStr = this.getBackupOriginTypeStr(this.defaultParam.backsourceAdvance.backupOriginType);

            tpl = $(_.template(template['tpl/customerSetup/domainList/backOriginSetup/notStandardBackOriginSetup.table.html'])({
                data: {
                    "backupOriginTypeStr" : backupOriginTypeStr
                }
            }));

            $(tpl).appendTo(this.$el.find(".backup"));
            _.each(this.defaultParam.backsourceAdvance.advanceConfigList, function(el){
                this.$el.find("#secondary-" + el.originLine).val(el.addressBackup);
            }.bind(this))
            this.$el.find("#custom").val(this.defaultParam.backsourceAdvance.backsourceCustom);

            this.$el.find(".backup .edit").on("click", $.proxy(this.onClickAddBackupSource, this));
            this.$el.find(".backup .delete").on("click", $.proxy(this.onClickDeleteBackupSource, this));
            this.$el.find(".backup .add").on("click", $.proxy(this.onClickAddBackupSource, this));

            this.displayCustom();

            if (isHaveBackupAddress || this.defaultParam.backsourceAdvance.backsourceCustom)  {
                this.$el.find(".backup .add").hide();
            } else {
                this.$el.find(".backup table").hide();
            }

            if (this.defaultParam.backsourceAdvance.backsourcePolicy === 1){
                this.$el.find(".poll .radio input").get(0).checked = true;
                this.$el.find(".quality .radio input").get(0).checked = false;
            } else if (this.defaultParam.backsourceAdvance.backsourcePolicy === 2){
                this.$el.find(".poll .radio input").get(0).checked = false;
                this.$el.find(".quality .radio input").get(0).checked = true;
            }
            this.$el.find("#ip-num").val(this.defaultParam.backsourceAdvance.backsourceBestcount);

            if (this.defaultParam.backsourceAdvance.strategyOpenFlag === 1){
                this.$el.find(".advance-strategy .togglebutton input").get(0).checked = true;
                this.$el.find(".strategy-table").show();
            } else {
                this.$el.find(".advance-strategy .togglebutton input").get(0).checked = false;
                this.$el.find(".strategy-table").hide();
            }

            this.initStrategyAdvanceList();

            this.$el.find(".base #textarea-origin-type").on("blur", $.proxy(this.onBlurTextarea, this))
            this.$el.find("textarea[id*='primary-']").on("blur", $.proxy(this.onBlurAdvancedTextarea, this))
            this.$el.find(".strategy input[name='strategyRadios']").on("click", $.proxy(this.onClickStrategyRadio, this));
            this.$el.find(".advance-strategy .togglebutton input").on("click", $.proxy(this.onClickAdvanceStrategyBtn, this));
            this.$el.find(".strategy-table .togglebutton input").on("click", $.proxy(this.onClickAdvanceStrategyToggle, this));
            this.$el.find(".strategy-table input[name*='-option']").on("click", $.proxy(this.onClickTableStrategyRadio, this));
            this.$el.find(".strategy-table input[type='number']").on("blur", $.proxy(this.onBlurTableStrategyInput, this));

            this.$el.find(".base #textarea-origin-type").on("focus", Utility.onContentChange);
            this.$el.find(".advanced textarea").on("focus", Utility.onContentChange)

            this.initPollInputStatus();

            if (this.defaultParam.backsourceAdvance.edgeOpenFlag === 1){
                this.$el.find(".edge-open .togglebutton input").get(0).checked = true;
            } else {
                this.$el.find(".edge-open .togglebutton input").get(0).checked = false;
            }
            this.$el.find(".edge-open .togglebutton input").on("click", $.proxy(this.onClickAdvanceEdgeBtn, this));
            this.$el.find(".edge-save").on("click", $.proxy(this.onClickEdgeSaveBtn, this));

            if (this.defaultParam.backsourceAdvance.rangeConfig === 1){
                this.$el.find(".slice-open .togglebutton input").get(0).checked = true;
            } else {
                this.$el.find(".slice-open .togglebutton input").get(0).checked = false;
            }
            this.$el.find(".slice-open .togglebutton input").on("click", $.proxy(this.onClickSliceBtn, this));

            if (this.defaultParam.backsourceAdvance.checkLastmod === 1){
                this.$el.find(".file-check input").get(0).checked = true;
            } else {
                this.$el.find(".file-check input").get(0).checked = false;
            }
            this.$el.find(".file-check input").on("click", $.proxy(this.onClickFileCheckBtn, this));
            this.$el.find(".slice-save").on("click", $.proxy(this.onClickSliceSaveBtn, this));

            this.initOriginProtocol();
            Utility.onContentSave();
        },

        initOriginProtocol: function(){
            // HTTP(0, "HTTP"),
            // HTTPFLV(1, "HDL"),
            // HLS(2, "HLS"),
            // RTMP(3, "RTMP"),
            // HTTPS(4, "HTTPS"),
            // PROTOCOL_FOLLOW(5, "协议跟随");
            var  baseArray = [
                {name: "http", value: 0},
                //{name: "HDL", value: 1},
                {name: "HLS", value: 2},
                //{name: "RTMP", value: 3},
                {name: "https", value: 4},
                {name: "协议跟随", value: 5}
            ],
            rootNode = this.$el.find(".origin-domain-protocol");

            Utility.initDropMenu(rootNode, baseArray, function(value){
                Utility.onContentChange();
                this.originProtocol = parseInt(value)
                if (this.originProtocol == 4 || this.originProtocol == 5) {
                    this.$el.find(".check-source").show();
                } else if (this.originProtocol != 4 && this.originProtocol != 5) {
                    this.$el.find(".check-source").hide();
                }
            }.bind(this));

            var defaultValue = _.find(baseArray, function(object){
                return object.value === this.originProtocol;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-origin-domain-protocol .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-origin-domain-protocol .cur-value").html(baseArray[0].name);

            if (this.checkSourceHttps === 1){
                this.$el.find(".check-source input").get(0).checked = true;
            } else {
                this.$el.find(".check-source input").get(0).checked = false;
            }
            this.$el.find(".check-source input").on("click", $.proxy(this.onClickSourceCheckBtn, this));

            if (this.originProtocol == 4 || this.originProtocol == 5) {
                this.$el.find(".check-source").show();
            } else if (this.originProtocol != 4 && this.originProtocol != 5) {
                this.$el.find(".check-source").hide();
            }

            this.$el.find(".origin-protocol-save").on("click", $.proxy(this.onClickOriginProSaveBtn, this));
        },

        onClickSourceCheckBtn: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.checkSourceHttps = 1;
            } else {
                this.checkSourceHttps = 0;
            }
            Utility.onContentChange();
        },

        onClickSliceBtn: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.backsourceAdvance.rangeConfig = 1;
            } else {
                this.defaultParam.backsourceAdvance.rangeConfig = 0;
            }
            Utility.onContentChange();
        },

        onClickFileCheckBtn: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.backsourceAdvance.checkLastmod = 1;
            } else {
                this.defaultParam.backsourceAdvance.checkLastmod = 0;
            }
            Utility.onContentChange();
        },

        onClickAdvanceEdgeBtn: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.backsourceAdvance.edgeOpenFlag = 1;
            } else {
                this.defaultParam.backsourceAdvance.edgeOpenFlag = 0;
            }
            Utility.onContentChange();
        },

        onClickEdgeSaveBtn: function(){
            this.collection.setEdgeOpenFlag({
                originId: this.domainInfo.id,
                edgeOpenFlag: this.defaultParam.backsourceAdvance.edgeOpenFlag
            });
            Utility.onContentSave();
        },

        onClickSliceSaveBtn: function(){
            var rangeConfig = this.defaultParam.backsourceAdvance.rangeConfig,
                checkLastmod = this.defaultParam.backsourceAdvance.checkLastmod;
            this.collection.setRangeConfig({
                originId: this.domainInfo.id,
                "rangeConfig": rangeConfig === undefined ? 0 : rangeConfig,
                "checkLastmod": checkLastmod === undefined ? 0 : checkLastmod
            });
            Utility.onContentSave();
        },

        onClickOriginProSaveBtn: function(){
            this.collection.setOriginProtocol({
                originId: this.domainInfo.id,
                "originProtocol": this.originProtocol,
                "checkSourceHttps": this.originProtocol == 0 ? null : this.checkSourceHttps
            });
            Utility.onContentSave();
        },

        initStrategyAdvanceList: function(){
            _.each(this.defaultParam.backsourceAdvance.strategyAdvanceList, function(el){
                this.$el.find("#originline-" + el.originLine + " .togglebutton input").get(0).checked = el.openFlag === 0 ? false : true;
                this.$el.find("#originline-" + el.originLine + " input[value='" + el.backsourcePolicy + "']").get(0).checked = true;
                this.$el.find("#originline-" + el.originLine + " input[type='number']").val(el.backsourceBestcount)
            }.bind(this))
        },

        onBlurTableStrategyInput: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var originLine = $(eventTarget).parents("tr").get(0).id.split("-")[1];
            var result = _.find(this.defaultParam.backsourceAdvance.strategyAdvanceList, function(el){
                return el.originLine === parseInt(originLine);
            }.bind(this))
            if (result) result.backsourceBestcount = $(eventTarget).val().trim();;
            Utility.onContentChange();
        },

        onClickTableStrategyRadio:function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var originLine = $(eventTarget).parents("tr").get(0).id.split("-")[1];
            var result = _.find(this.defaultParam.backsourceAdvance.strategyAdvanceList, function(el){
                return el.originLine === parseInt(originLine);
            }.bind(this))
            if (result) result.backsourcePolicy = parseInt($(eventTarget).val());
            Utility.onContentChange();
        },

        onClickAdvanceStrategyToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var originLine = $(eventTarget).parents("tr").get(0).id.split("-")[1];
            var result = _.find(this.defaultParam.backsourceAdvance.strategyAdvanceList, function(el){
                return el.originLine === parseInt(originLine);
            }.bind(this))
            if (result) result.openFlag = eventTarget.checked ? 1 : 0;
            Utility.onContentChange();
        },

        onClickDeleteBackupSource: function(event){
            _.each(this.defaultParam.backsourceAdvance.advanceConfigList, function(el){
                el.addressBackup = "";
            }.bind(this));
            this.defaultParam.backsourceAdvance.backsourceCustom = "";
            this.$el.find(".backup table").hide();
            this.$el.find(".backup .add").show();
            Utility.onContentChange();
        },

        onClickAddBackupSource: function(event){
            if (this.addBackupPopup) $("#" + this.addBackupPopup.modalId).remove();

            var myAddEditBackupSourceView = new AddEditBackupSourceView({
                collection: this.collection,
                model: this.defaultParam.backsourceAdvance.advanceConfigList,
                backupOriginType: this.defaultParam.backsourceAdvance.backupOriginType,
                backsourceCustom: this.defaultParam.backsourceAdvance.backsourceCustom
            });

            var options = {
                title:"添加备源",
                body : myAddEditBackupSourceView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var result = myAddEditBackupSourceView.onSure(),
                        backupOriginType = result.backupOriginType,
                        backsourceCustom = result.backsourceCustom, 
                        backupOriginTypeStr;
                    this.defaultParam.backsourceAdvance.backupOriginType = backupOriginType;
                    this.defaultParam.backsourceAdvance.backsourceCustom = backsourceCustom;
                    backupOriginTypeStr = this.getBackupOriginTypeStr(backupOriginType);
                    this.$el.find(".backup table .type").html(backupOriginTypeStr);
                    _.each(this.defaultParam.backsourceAdvance.advanceConfigList, function(el){
                        this.$el.find("#secondary-" + el.originLine).val(el.addressBackup);
                    }.bind(this))
                    this.$el.find("#custom").val(backsourceCustom);
                    this.$el.find(".backup table").show();
                    this.$el.find(".backup .add").hide();
                    this.displayCustom();
                    this.addBackupPopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addBackupPopup = new Modal(options);
            Utility.onContentChange();
        },

        displayCustom: function(){
            if (this.defaultParam.backsourceAdvance.backupOriginType === 3) {
                this.$el.find(".backup .default").hide();
                this.$el.find(".backup .unicom").hide();
                this.$el.find(".backup .telecom").hide();
                this.$el.find(".backup .mobile").hide();
                this.$el.find(".backup .custom").show();
            } else {
                this.$el.find(".backup .default").show();
                this.$el.find(".backup .unicom").show();
                this.$el.find(".backup .telecom").show();
                this.$el.find(".backup .mobile").show();
                this.$el.find(".backup .custom").hide();                  
            }
        },

        getBackupOriginTypeStr: function(backupOriginType){
            var backupOriginTypeStr = "";
            switch(backupOriginType) {
                case 1:
                  backupOriginTypeStr = "备源类型：IP源站";
                  break;
                case 2:
                  backupOriginTypeStr = "备源类型：域名源站";
                  break;
                case 3:
                  backupOriginTypeStr = "备源类型：自定义";
                  break;
            }

            return backupOriginTypeStr
        },

        initOriginTypeDropdown: function(){
            var  baseArray = [
                {name: "域名回源", value: 2},
                {name: "IP回源", value: 1},
            ],
            rootNode = this.$el.find(".base .origin-type");

            if (this.busnessType === 2 && this.protocol === 2)
                baseArray.push({name: "视频云回源", value: 3})
            else
                baseArray.push({name: "KS3回源", value: 3})

            Utility.initDropMenu(rootNode, baseArray, function(value){
                Utility.onContentChange();
                this.defaultParam.originType = parseInt(value)
            }.bind(this));

            var defaultValue = _.find(baseArray, function(object){
                return object.value === this.defaultParam.originType;
            }.bind(this));

            if (defaultValue)
                this.$el.find(".base #dropdown-origin-type .cur-value").html(defaultValue.name);
            else
                this.$el.find(".base #dropdown-origin-type .cur-value").html(baseArray[0].name);

            var advancedArray = [
                {name: "域名回源", value: 2},
                {name: "IP回源", value: 1}
            ];

            var rootOtherNode = this.$el.find(".advanced .origin-type");
            Utility.initDropMenu(rootOtherNode, advancedArray, function(value){
                this.defaultParam.backsourceAdvance.hostOriginType = parseInt(value)
                this.initPollInputStatus();
                Utility.onContentChange();
            }.bind(this));

            var defaultOtherValue = _.find(advancedArray, function(object){
                return object.value === this.defaultParam.backsourceAdvance.hostOriginType;
            }.bind(this));

            if (defaultOtherValue)
                this.$el.find(".advanced #dropdown-origin-type .cur-value").html(defaultOtherValue.name);
            else
                this.$el.find(".advanced #dropdown-origin-type .cur-value").html(advancedArray[0].name);
        },

        initPollInputStatus: function(){
            if (this.defaultParam.backsourceAdvance.hostOriginType === 2) {
                this.$el.find("#strategyRadios2").click();
                this.$el.find("#strategyRadios1").attr("disabled", "disabled");
                this.$el.find(".ipnum-input").click();
                this.$el.find(".poll-input").attr("disabled", "disabled");
            } else {
                this.$el.find("#strategyRadios1").removeAttr("disabled");
                this.$el.find(".poll-input").removeAttr("disabled");
            }            
        },

        onClickStrategyRadio: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.backsourceAdvance.backsourcePolicy = parseInt($(eventTarget).val())
            Utility.onContentChange();
        },

        onBlurTextarea: function(event){
            var eventTarget = event.srcElement || event.target,
                value = eventTarget.value.trim();
            if (value === "") return;
            this.checkBaseOrigin();
        },

        onBlurAdvancedTextarea: function(event){
            var eventTarget = event.srcElement || event.target,
                value = eventTarget.value.trim(), 
                originLine = eventTarget.id.split("-")[1];
            var result = _.find(this.defaultParam.backsourceAdvance.advanceConfigList, function(obj){
                return obj.originLine === parseInt(originLine)
            }.bind(this))
            result.originAddress = value;
            if (value === "") return;
            this.checkBaseOrigin(value, this.defaultParam.backsourceAdvance.hostOriginType);
        },

        onClickIsUseAdvanceBtn: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.backsourceFlag = 1;
                this.$el.find(".advanced").show();
                this.$el.find(".base").hide();
                this.$el.find("#ip-num").val(this.defaultParam.backsourceAdvance.backsourceBestcount);
            } else {
                this.defaultParam.backsourceFlag = 0;
                this.$el.find(".advanced").hide();
                this.$el.find(".base").show();
            }
            Utility.onContentChange();
        },

        onClickAdvanceStrategyBtn: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.defaultParam.backsourceAdvance.strategyOpenFlag = 1;
                this.$el.find(".strategy-table").show();
            } else {
                this.defaultParam.backsourceAdvance.strategyOpenFlag = 0;
                this.$el.find(".strategy-table").hide();
            }
            Utility.onContentChange();
        },

        onClickSaveBtn: function(){
            if ((this.hostType === 2 && this.defaultParam.originType === 1 && this.defaultParam.backsourceFlag === 0) || 
                (this.hostType === 2 && this.defaultParam.backsourceFlag === 1)){
                Utility.warning("修改回源Host设置为源站域名，不能使用IP回源");
                return;
            };
            if (this.defaultParam.backsourceFlag === 0 && !this.checkBaseOrigin()){
                return;
            }
            var textareaNodes, defaultPrimary, ipNum; 
            if (this.defaultParam.backsourceFlag === 1) {
                //校验主源
                textareaNodes = this.$el.find("textarea[id*='primary-']");
                for (var i = 0; i < textareaNodes.length; i++){
                    var value = textareaNodes[i].value.trim();
                    if (value === "") continue;
                    var result = this.checkBaseOrigin(value, this.defaultParam.backsourceAdvance.hostOriginType)
                    if (!result) return;
                }
                defaultPrimary = this.$el.find(".default #primary-1").val().trim();
                if (defaultPrimary === ""){
                    Utility.warning("默认源主必填！")
                    return;
                }
                //校验备源
                textareaNodes = this.$el.find("textarea[id*='secondary-']");
                for (var i = 0; i < textareaNodes.length; i++){
                    var value = textareaNodes[i].value.trim();
                    if (value === "") continue;
                    var backupOriginType = this.defaultParam.backsourceAdvance.backupOriginType;
                    if (backupOriginType === 3) backupOriginType = 4;
                    var result = this.checkBaseOrigin(value, backupOriginType)
                    if (!result) return;
                }
                ipNum = this.$el.find("#ip-num").val();
                if (this.defaultParam.backsourceAdvance.backsourcePolicy === 2 && (!ipNum || parseInt(ipNum) > 10 || parseInt(ipNum) < 1)){
                    this.$el.find("#ip-num").focus();
                    Utility.warning("回源策略IP数量取值1-10")
                    return;
                }
                var isError = false;
                _.each(this.defaultParam.backsourceAdvance.strategyAdvanceList, function(el, index){
                    if (el.openFlag === 1 && el.backsourcePolicy === 2 && 
                       (!el.backsourceBestcount || parseInt(el.backsourceBestcount) > 10 || parseInt(el.backsourceBestcount) < 1)){
                       Utility.warning("高级回源策略第" + (index + 1) + "行IP数量取值1-10")
                       isError = true
                    }
                }.bind(this))
                if (isError) return;
            }

            if (this.defaultParam.backsourceAdvance.backupOriginType === 3) {
                _.each(this.defaultParam.backsourceAdvance.advanceConfigList, function(el){
                    el.addressBackup = ""
                }.bind(this))
            } else {
                this.defaultParam.backsourceAdvance.backsourceCustom = "";
            }

            var postParam = {
                "originId": this.domainInfo.id,
                "backsourceFlag": this.defaultParam.backsourceFlag,
                "originType": this.defaultParam.originType,
                "originAddress": _.uniq(this.$el.find(".base #textarea-origin-type").val().split(',')).join(','),
                "backsourceAdvance": {
                    "hostOriginType": this.defaultParam.backsourceAdvance.hostOriginType,
                    "backupOriginType": this.defaultParam.backsourceAdvance.backupOriginType,
                    "backsourcePolicy": this.defaultParam.backsourceAdvance.backsourcePolicy,
                    "backsourceCustom": this.defaultParam.backsourceAdvance.backsourceCustom,
                    "backsourceBestcount": this.$el.find("#ip-num").val().trim(),
                    "strategyOpenFlag": this.defaultParam.backsourceAdvance.strategyOpenFlag,
                    "advanceConfigList": this.defaultParam.backsourceAdvance.advanceConfigList,
                    "strategyAdvanceList": this.defaultParam.backsourceAdvance.strategyAdvanceList
                }
            }
            this.collection.setBackSourceConfig(postParam)
            Utility.onContentSave();
        },

        onSaveSuccess: function(){
            Utility.alerts("保存成功！", "success", 5000)
            this.update(this.options.query, this.options.query2, this.target);
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: new SaveThenSendModel(),
                    domainInfo: this.domainInfo,
                    onSendSuccess: function() {
                        this.sendPopup.$el.modal("hide");
                        window.location.hash = '#/domainList/' + this.options.query;
                    }.bind(this)
                });
                var options = {
                    title: "发布",
                    body : mySaveThenSendView,
                    backdrop : 'static',
                    type     : 2,
                    width: 1000,
                    onOKCallback:  function(){
                        mySaveThenSendView.sendConfig();
                    }.bind(this),
                    onHiddenCallback: function(){
                        if (this.sendPopup) $("#" + this.sendPopup.modalId).remove();
                        this.update(this.options.query, this.options.query2, this.target);
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
        },

        checkBaseOrigin: function(value, type){
            var originAddress = value || this.$el.find(".base #textarea-origin-type").val().trim();
            var originType = type || this.defaultParam.originType;
            var domainName = this.userInfo.domain;

            if (!originAddress) {
                Utility.warning("不能为空");
                return false;
            }
            if (originType == 1) {
                var ipArray = originAddress.split(",");
                if (ipArray.length > 10) {
                    Utility.warning("你的IP数是否超过了10个。");
                    return false;
                }
                for (var i = 0; i < ipArray.length; i++) {
                    result = Utility.isIP(ipArray[i].trim());
                    if (!result) {
                        Utility.warning("你的IP填写有误,请检查");
                        return false;
                    }
                }
            } else if (originType == 2 || originType == 3) {
                if (domainName == originAddress) {
                    Utility.warning("源站地址不能与加速域名相同");
                    return false;
                }
                //域名校验
                var result = Utility.isDomain(originAddress);
                var isIPStr = Utility.isIP(originAddress);
                if (result && !isIPStr && originAddress !== domainName && 
                    originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-") {
                    return true;
                } else {
                    Utility.warning("域名填写错误");
                    return false;
                }
            }
            return true;
        },

        //修改回源Host==================================================

        initModifyHost: function(data){
            this.hideModifyHostOptions();
            this.isModifyHost = true;
            
            this.defaultParamModifyHost = {
                domainType: 3,
                customHostHeader: "",
                domain: "",
                originAddress:""
            }

            if (data.domainConf && data.domainConf.hostType !== null && data.domainConf.hostType !== undefined)
                this.defaultParamModifyHost.domainType = data.domainConf.hostType;

            if (data.domainConf && data.domainConf.hostFlag !== null && data.domainConf.hostFlag !== undefined)
                this.isModifyHost = data.domainConf.hostFlag === 0 ? false : true;

            this.$el.find(".modify-host .togglebutton input").get(0).checked = this.isModifyHost;
            this.defaultParamModifyHost.customHostHeader = data.domainConf.customHostHeader;
            this.defaultParamModifyHost.domain = data.originDomain.domain;
            this.defaultParamModifyHost.originAddress = data.domainConf.originAddress;

            this.originType = data.domainConf.originType;
            this.isUseAdvanced = data.domainConf.backsourceFlag === 0 ? 1 : 2

            this.initModifyHostSetup();
            this.initModifyHostDropdown();

            this.$el.find(".modify-host .togglebutton input").on("click", $.proxy(this.onClickIsModifyHostBtn, this));
            this.$el.find(".host-save").on("click", $.proxy(this.onClickHostSaveBtn, this));

            this.collection.on("set.hostConfig.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.hostConfig.error", $.proxy(this.onGetError, this));

            this.$el.find("#textarea-host-domain").on("focus", Utility.onContentChange);
        },

        onClickHostSaveBtn: function(){
            if ((this.defaultParamModifyHost.domainType === 2 && this.originType === 1 && this.isUseAdvanced === 1) ||
                (this.defaultParamModifyHost.domainType === 2 && this.isUseAdvanced === 2)) {
                Utility.warning("未设置回源域名不能使用此项");
                return;
            }
            if (this.defaultParamModifyHost.domainType === 3) {
                var value = this.$el.find("#textarea-host-domain").val().trim();
                //var result = this.checkBaseOrigin(value, 2)
                //if (!result) return;
            }
            var postParam = {
                "originId": this.domainInfo.id,
                "customHostHeader": value,
                "hostType": this.defaultParamModifyHost.domainType,
                "hostFlag": this.isModifyHost ? 1 : 0
            };
            this.collection.setHostHeaderConfig(postParam);
            Utility.onContentSave();
        },

        initModifyHostSetup: function(){
            if (this.isModifyHost){
                this.$el.find(".origin-domain").show();
            } else {
                this.$el.find(".origin-domain").hide();
            }
            var textareaNode = this.$el.find("#textarea-host-domain");
            if (this.defaultParamModifyHost.domainType !== 3)
                textareaNode.attr("readonly", "true")
            else
                textareaNode.removeAttr("readonly")

            if (this.defaultParamModifyHost.domainType === 3) {
                textareaNode.val(this.defaultParamModifyHost.customHostHeader);
            } else if (this.defaultParamModifyHost.domainType === 1){
                textareaNode.val(this.defaultParamModifyHost.domain);
            } else if (this.defaultParamModifyHost.domainType === 2){
                textareaNode.val(this.defaultParamModifyHost.originAddress);
            }
        },

        hideModifyHostOptions: function(){
            this.$el.find(".origin-domain").hide();
        },

        initModifyHostDropdown: function(){
            var  domainTypeArray = [
                {name: "加速域名", value: 1},
              //  {name: "源站域名", value: 2},
                {name: "自定义域名", value: 3}
            ],
            rootNode = this.$el.find(".origin-domain");
            Utility.initDropMenu(rootNode, domainTypeArray, function(value){
                Utility.onContentChange();
                this.defaultParamModifyHost.domainType = parseInt(value);
                this.initModifyHostSetup();
            }.bind(this));

            var defaultValue = _.find(domainTypeArray, function(object){
                return object.value === this.defaultParamModifyHost.domainType;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-origin-domain .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-origin-domain .cur-value").html(domainTypeArray[0].name);
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
            this.initModifyHostSetup();
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query, query2, target){
            this.options.query = query;
            this.options.query2 = query2;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target){
            this.$el.appendTo(target);
            this.target = target
        }
    });

    return BackOriginSetupView;
});