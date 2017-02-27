define("liveTimestamp.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveTimestampView= Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveTimestamp/liveTimestamp.html'])());
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
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.defaultParam = {
                isOpenSetup: 1,
                isBaseSetup: 1,
                antiLeech: 1,
                baseSecretKeyPrimary: "",
                baseSecretKeyBackup: [],
                baseDeadline: 1,

                encryption: 1,
                mtPosition: 2,
                timestampType: 2,
                advancedDeadline: 1,
                advancedSecretKeyPrimary: "",
                advancedSecretKeyBackup: [],
                spliceMd5: 1,
                timeParam: "t",
                hashParam: "k",
                //authFactor: "",
                atuthDivisorArray: [],
                md5Truncate: "",
                type: 9,
                policy: ""
            };

            this.$el.find(".open-timestamp .togglebutton input").on("click", $.proxy(this.onClickSetupToggle, this));
            this.$el.find(".setup-type input").on("click", $.proxy(this.onClickSetupRadio, this));
            this.$el.find(".anti-leech input").on("click", $.proxy(this.onClickAntiLeechRadio, this));
            this.$el.find(".base-setup .add-secret-key-backup").on("click", $.proxy(this.onClickBaseNewKey, this));
            this.$el.find(".base-setup.deadline input[name='baseDeadline']").on("click", $.proxy(this.onClickBaseDeadlineRadio, this));

            this.$el.find("#secret-key-primary").on("blur", $.proxy(this.onBlurSecretKeyInput, this));
            this.$el.find("#new-backup-key").on("blur", $.proxy(this.onBlurSecretKeyInput, this));

            this.$el.find(".encryption-url input[name='encryption']").on("click", $.proxy(this.onClickEncryptionUrlRadio, this));
            this.$el.find(".advanced-setup.deadline input[name='deadline']").on("click", $.proxy(this.onClickAdvancedDeadlineRadio, this));
            this.$el.find(".advanced-setup .add-secret-key-backup").on("click", $.proxy(this.onClickAdvancedNewKey, this));
            this.$el.find(".splice-md5 input[name='spliceMd5']").on("click", $.proxy(this.onClickSpliceMd5Radio, this));
            this.$el.find(".advanced-setup .add-atuth-divisor").on("click", $.proxy(this.onClickAddAtuthDivisor, this));

            this.collection.on("get.protection.success", $.proxy(this.initBaseAdvancedSetup, this));
            this.collection.on("get.protection.error", $.proxy(this.onGetError, this));
            this.$el.find(".save").on("click", $.proxy(this.onSure, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.getStandardProtection({originId:this.domainInfo.id});
        },

        initBaseAdvancedSetup: function(){
            //TODO 假数据
            var data = [
                {
                    "openFlag": 1,
                    "confType": 1,
                    "protectionType": 1,
                    "timeParam": "null",
                    "hashParam": "null",
                    "timeType": 2,
                    "timeValue": "null",
                    "expirationTime": 3600,
                    "md5Truncate": '123,123',
                    "authKeyList": [
                        {
                            "id": 4,
                            "authKey": "xxx",
                        }
                    ],
                    "authDivisorList": [
                        {
                            "id": 4,
                            "divisor": 1,
                            "divisorParam":"",
                        }
                    ]
                }
            ]
            data = data[0]

            if (data){
                if (data.openFlag !== null && data.openFlag !== undefined)
                    this.defaultParam.isOpenSetup = data.openFlag
                if (data.authDivisorList) {
                    var  atuthDivisorArray = [
                        {value: 1, name: "host:用户请求域名"},
                        {value: 2, name: "uri：用户请求的uri"},
                        {value: 3, name: "url：不带参数"},
                        {value: 4, name: "arg&name:请求url中的参数名称"},
                        {value: 5, name: "time：请求url中是时间戳"},
                        {value: 6, name: "key：秘钥"},
                        {value: 7, name: "filename：文件名称，带后缀"},
                        {value: 8, name: "filenameno：文件名称，不带后缀"}
                    ];
                    _.each(data.authDivisorList, function(el, index, ls){
                        var nameObj = _.find(atuthDivisorArray, function(obj){
                            return obj.value === el.divisor
                        }.bind(this))
                        if (nameObj) el.divisorName = nameObj.name
                    }.bind(this))
                    this.defaultParam.atuthDivisorArray = data.authDivisorList
                }

                var protectionType = data.protectionType, //1:typeA 2:typeB 3:typeC
                    confType = data.confType,
                    authKeyList = data.authKeyList,
                    md5Truncate = data.md5Truncate,
                    expirationTime = data.expirationTime;

                if (confType === 0) {
                    this.defaultParam.antiLeech = protectionType
                } else if (confType === 1 && protectionType === 1){
                    this.defaultParam.encryption = protectionType
                } else if (confType === 1 && protectionType === 2) {
                    this.defaultParam.mtPosition = protectionType
                    this.defaultParam.encryption = 2
                } else if (confType === 1 && protectionType === 3) {
                    this.defaultParam.mtPosition = protectionType
                    this.defaultParam.encryption = 2
                }

                if (authKeyList && authKeyList.length > 0 && confType === 0){
                    this.defaultParam.baseSecretKeyPrimary = authKeyList[0].authKey;
                } else if (authKeyList && authKeyList.length > 0 && confType === 1) {
                    this.defaultParam.advancedSecretKeyPrimary = authKeyList[0].authKey;
                }

                _.each(authKeyList, function(el, index, ls){
                    if (index !== 0 && confType === 0) {
                        this.defaultParam.baseSecretKeyBackup.push({
                            id: el.id,
                            backupKey: el.authKey
                        })
                    } else if (index !== 0 && confType === 1){
                        this.defaultParam.advancedSecretKeyBackup.push({
                            id: el.id,
                            backupKey: el.authKey
                        })
                    }
                }.bind(this))

                if (expirationTime === 0 && confType === 0)
                    this.defaultParam.baseDeadline === 1;
                else if (expirationTime !== 0 && confType === 0)
                    this.defaultParam.baseDeadline === 2;
                else if (expirationTime === 0 && confType === 1)
                    this.defaultParam.advancedDeadline = 1;
                else if (expirationTime !== 0 && confType === 1)
                    this.defaultParam.advancedDeadline = 2;

                if (md5Truncate === ""){
                    this.defaultParam.spliceMd5 = 1;
                } else {
                    this.defaultParam.spliceMd5 = 2;
                }
                this.defaultParam.isBaseSetup = confType === 0 ? 1 : 2; //0:标准配置 1:高级配置
                this.defaultParam.timestampType = data.timeType || 1; //1:UNIX时间（十六进制）2:UNix时间（十进制）3：Text格式
                // this.defaultParam.authFactor = data.authFactor;
                this.defaultParam.timeParam = data.timeParam;
                this.defaultParam.hashParam = data.hashParam;
                this.defaultParam.md5Truncate = data.md5Truncate;
                this.$el.find(".deadline-time #deadline-time").val(data.expirationTime)
            }

            if (this.defaultParam.isOpenSetup === 1) {
                this.$el.find(".open-timestamp .togglebutton input").get(0).checked = true;
                this.$el.find(".setup-content").show(200);
            } else if (this.defaultParam.isOpenSetup === 0) {
                this.$el.find(".open-timestamp .togglebutton input").get(0).checked = false;
                this.$el.find(".setup-content").hide(200);
            }

            this.hideOrShowSetup();
            if (this.defaultParam.isBaseSetup === 1)
                this.$el.find(".setup-type #setupType1").get(0).checked = true;
            else if (this.defaultParam.isBaseSetup === 2)
                this.$el.find(".setup-type #setupType2").get(0).checked = true;

            if (this.defaultParam.antiLeech === 1)
                this.$el.find(".anti-leech #antiLeech1").get(0).checked = true;
            else if (this.defaultParam.antiLeech === 2)
                this.$el.find(".anti-leech #antiLeech2").get(0).checked = true;
            else if (this.defaultParam.antiLeech === 3)
                this.$el.find(".anti-leech #antiLeech3").get(0).checked = true;
            this.$el.find(".base-setup #secret-key-primary").val(this.defaultParam.baseSecretKeyPrimary);
            this.updateBaseKeyTable();
            if (this.defaultParam.baseDeadline === 1)
                this.$el.find(".base-setup.deadline #deadline1").get(0).checked = true;
            else if (this.defaultParam.baseDeadline === 2)
                this.$el.find(".base-setup.deadline #deadline2").get(0).checked = true;

            //高级配置
            if (this.defaultParam.encryption === 1)
                this.$el.find(".advanced-setup #encryption1").get(0).checked = true;
            else if (this.defaultParam.encryption === 2)
                this.$el.find(".advanced-setup #encryption2").get(0).checked = true;
            this.initDropDropdown();
            if (this.defaultParam.advancedDeadline === 1)
                this.$el.find(".advanced-setup.deadline #deadline1").get(0).checked = true;
            else if (this.defaultParam.advancedDeadline === 2)
                this.$el.find(".advanced-setup.deadline #deadline2").get(0).checked = true;
            this.$el.find(".advanced-setup #secret-key-primary").val(this.defaultParam.advancedSecretKeyPrimary);
            this.updateAdvancedKeyTable();
            if (this.defaultParam.spliceMd5 === 1)
                this.$el.find(".advanced-setup.splice-md5 #spliceMd51").get(0).checked = true;
            else if (this.defaultParam.spliceMd5 === 2)
                this.$el.find(".advanced-setup.splice-md5 #spliceMd52").get(0).checked = true;

            //this.$el.find("#atuth-divisor").val(this.defaultParam.authFactor);
            this.$el.find("#key_time").val(this.defaultParam.timeParam);
            this.$el.find("#key_hash").val(this.defaultParam.hashParam);

            if (this.defaultParam.md5Truncate.indexOf(",") !== -1){
                this.$el.find("#md5-start").val(this.defaultParam.md5Truncate.split(",")[0])
                this.$el.find("#md5-end").val(this.defaultParam.md5Truncate.split(",")[1])
            } 

            this.updateAtuthDivisorTable();
        },

        initDropDropdown: function(){
            var  mtPositionArray = [
                {name: "{md5hash/timestamp}", value: 2},
                {name: "{timestamp/md5hash}", value: 3}
            ],
            rootNode = this.$el.find(".mt-position");
            Utility.initDropMenu(rootNode, mtPositionArray, function(value){
                this.defaultParam.mtPosition = parseInt(value)
            }.bind(this));

            var defaultValue = _.find(mtPositionArray, function(object){
                return object.value === this.defaultParam.mtPosition;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-mt-position .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-mt-position .cur-value").html(mtPositionArray[0].name);

            var  timeTypeArray = [
                {name: "UNIX时间（十进制）", value: 2},
                {name: "UNIX时间（十六进制）", value: 1},
                // {name: "Text格式（例如20130623181426）", value: 3}
            ],
            rootOtherNode = this.$el.find(".timestamp-type");
            Utility.initDropMenu(rootOtherNode, timeTypeArray, function(value){
                this.defaultParam.timestampType = parseInt(value)
            }.bind(this));

            var defaultOtherValue = _.find(timeTypeArray, function(object){
                return object.value === this.defaultParam.timestampType;
            }.bind(this));

            if (defaultOtherValue)
                this.$el.find("#dropdown-timestamp-type .cur-value").html(defaultOtherValue.name);
            else
                this.$el.find("#dropdown-timestamp-type .cur-value").html(timeTypeArray[0].name);

            this.curAtuthDivisor = 1;
            this.curAtuthDivisorParam = "";
            this.$el.find("#atuth-divisor-param").hide();

            //1:host 2:URI 3:url 4:param_key 5:time 6:key 7:filename 8:filenameno 9:method 10:head_key
            var  atuthDivisorArray = [
                {value: 1, name: "host:用户请求域名"},
                {value: 2, name: "uri：用户请求的uri"},
                {value: 3, name: "url：不带参数"},
                {value: 4, name: "arg&name:请求url中的参数名称"},
                {value: 5, name: "time：请求url中是时间戳"},
                {value: 6, name: "key：秘钥"},
                {value: 7, name: "filename：文件名称，带后缀"},
                {value: 8, name: "filenameno：文件名称，不带后缀"}
            ],
            atuthDivisorRootNode = this.$el.find(".atuth-divisor");
            Utility.initDropMenu(atuthDivisorRootNode, atuthDivisorArray, function(value){
                this.curAtuthDivisor = parseInt(value);
                if (this.curAtuthDivisor === 4){
                    this.$el.find("#atuth-divisor-param").show();
                } else {
                    this.$el.find("#atuth-divisor-param").hide();
                    this.$el.find("#atuth-divisor-param").val("");
                }
            }.bind(this));
        },
        hideOrShowSetup: function(){
            if (this.defaultParam.isBaseSetup === 1){
                this.$el.find(".base-setup").show();
                this.$el.find(".advanced-setup").hide();
            } else if (this.defaultParam.isBaseSetup === 2){
                this.$el.find(".advanced-setup").show();
                this.$el.find(".base-setup").hide();
            }
        },

        onClickSetupToggle : function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.$el.find(".setup-content").show(200);
                this.defaultParam.isOpenSetup = 1;
            } else {
                this.defaultParam.isOpenSetup = 0;
                this.$el.find(".setup-content").hide(200);
            }
        },

        onClickSetupRadio: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.isBaseSetup = parseInt($(eventTarget).val())

            this.hideOrShowSetup();
        },

        onBlurSecretKeyInput: function(event){
            var eventTarget = event.srcElement || event.target,
                value = $(eventTarget).val(),
                re = /^[a-zA-Z0-9]+$/
            if (value === "") return false;
            if (!re.test(value) || value.length < 6 || value.length > 32){
                alert("KEY只能由大小写字母，数字组成，长度6到32位")
                return false
            }
            return true;
        },

        //标准配置====================================================

        updateBaseKeyTable: function(){
            this.$el.find(".base-setup .backup-key-table").find(".table").remove()
            this.baseBackupKeyTable = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.backupKeyTable.html'])({
                data: this.defaultParam.baseSecretKeyBackup
            }))

            this.baseBackupKeyTable.find(".delete").on("click", $.proxy(this.onClickBaseKeyTableItemDelete, this));
            this.$el.find(".base-setup .backup-key-table .table-ctn").html(this.baseBackupKeyTable.get(0));
        },

        onClickBaseKeyTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.defaultParam.baseSecretKeyBackup, function(obj){
                return obj.id !== parseInt(id)
            }.bind(this))

            this.defaultParam.baseSecretKeyBackup = filterArray;
            this.updateBaseKeyTable();
        },

        onClickBaseNewKey: function(event){
            var eventTarget = event.srcElement || event.target;

            var newKey = this.$el.find(".base-setup #new-backup-key").val();
            if (this.defaultParam.baseSecretKeyBackup.length >= 4) {
                alert("只能设置4个备选秘钥");
                return;
            }
            this.defaultParam.baseSecretKeyBackup.push({
                id: new Date().valueOf(),
                backupKey: newKey
            });
            this.updateBaseKeyTable();
            this.$el.find(".base-setup #new-backup-key").val("");
        },

        onClickAntiLeechRadio: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.antiLeech = parseInt($(eventTarget).val());
        },

        onClickBaseDeadlineRadio: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.baseDeadline = parseInt($(eventTarget).val())
        },

        //高级配置====================================================

        onClickEncryptionUrlRadio: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.encryption = parseInt($(eventTarget).val());
        },

        onClickAdvancedDeadlineRadio: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.advancedDeadline = parseInt($(eventTarget).val())
        },

        onClickSpliceMd5Radio: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.spliceMd5 = parseInt($(eventTarget).val())
        },

        onClickAddAtuthDivisor: function(event){
            var eventTarget = event.srcElement || event.target;

            this.curAtuthDivisorParam = this.$el.find("#atuth-divisor-param").val();
            if (this.curAtuthDivisor === 4 && this.curAtuthDivisorParam === ""){
                alert("参数不能为空")
                return;
            }

            if (this.defaultParam.atuthDivisorArray.length >= 6) {
                alert("最大可以设置6个");
                return;
            }

            this.defaultParam.atuthDivisorArray.push({
                id: new Date().valueOf(),
                divisorName: this.$el.find("#dropdown-atuth-divisor .cur-value").html(),
                divisor: this.curAtuthDivisor,
                divisorParam: this.curAtuthDivisorParam
            });
            this.updateAtuthDivisorTable();
            this.$el.find("#atuth-divisor-param").val("")
        },

        updateAtuthDivisorTable: function(){
            this.$el.find(".advanced-setup .atuth-divisor-table").find(".table").remove()
            this.atuthDivisorTable = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.atuthDivisor.table.html'])({
                data: this.defaultParam.atuthDivisorArray
            }))

            this.atuthDivisorTable.find(".delete").on("click", $.proxy(this.onClickAuthDivisorTableItemDelete, this));
            this.$el.find(".advanced-setup .atuth-divisor-table .table-ctn").html(this.atuthDivisorTable.get(0));
        },

        onClickAuthDivisorTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.defaultParam.atuthDivisorArray, function(obj){
                return obj.id !== parseInt(id)
            }.bind(this))

            if (filterArray.length <= 1) {
                alert("最少不能少于2个");
                return;
            }

            this.defaultParam.atuthDivisorArray = filterArray;
            this.updateAtuthDivisorTable();
        },

        updateAdvancedKeyTable: function(){
            this.$el.find(".advanced-setup .backup-key-table").find(".table").remove()
            this.advancedBackupKeyTable = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.backupKeyTable.html'])({
                data: this.defaultParam.advancedSecretKeyBackup
            }))

            this.advancedBackupKeyTable.find(".delete").on("click", $.proxy(this.onClickAdvancedKeyTableItemDelete, this));
            this.$el.find(".advanced-setup .backup-key-table .table-ctn").html(this.advancedBackupKeyTable.get(0));
        },

        onClickAdvancedKeyTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.defaultParam.advancedSecretKeyBackup, function(obj){
                return obj.id !== parseInt(id)
            }.bind(this))

            this.defaultParam.advancedSecretKeyBackup = filterArray;
            this.updateAdvancedKeyTable();
        },

        onClickAdvancedNewKey: function(event){
            var eventTarget = event.srcElement || event.target;

            var newKey = this.$el.find(".advanced-setup #new-backup-key").val();
            if (this.defaultParam.advancedSecretKeyBackup.length >= 4) {
                alert("只能设置4个备选秘钥");
                return;
            }
            this.defaultParam.advancedSecretKeyBackup.push({
                id: new Date().valueOf(),
                backupKey: newKey
            });
            this.updateAdvancedKeyTable();
            this.$el.find(".advanced-setup #new-backup-key").val("")
        },

        checkBalabala: function(){
            var baseDeadlineTime = this.$el.find(".base-setup #deadline-time").val();
            if (this.defaultParam.isBaseSetup === 1 && this.defaultParam.baseDeadline === 2 && baseDeadlineTime === ""){
                alert("你选择了标准设置失效时间自定义，需要填写失效时间！");
                return;
            }
            var advancedDeadlineTime = this.$el.find(".advanced-setup #deadline-time").val();
            if (this.defaultParam.isBaseSetup === 2 && this.defaultParam.advancedDeadline === 2 && advancedDeadlineTime === ""){
                alert("你选择了高级设置失效时间自定义，需要填写失效时间！");
                return;
            }
            var baseKey = this.$el.find(".base-setup #secret-key-primary").val();
            if (this.defaultParam.isBaseSetup === 1 && baseKey === ""){
                alert("你选择了标准设置，需要填写主享秘钥！");
                return;
            }
            var advancedKey = this.$el.find(".advanced-setup #secret-key-primary").val();
            if (this.defaultParam.isBaseSetup === 2 &&  advancedKey === ""){
                alert("你选择了高级设置，需要填写主享秘钥！");
                return;
            }
            var atuthDivisor = this.$el.find(".advanced-setup #atuth-divisor").val();
            if (this.defaultParam.isBaseSetup === 2 &&  atuthDivisor === ""){
                alert("你选择了高级设置，需要填写鉴权因子！");
                return;
            }
            var spliceMd5Min = this.$el.find("#md5-start").val(),
                spliceMd5Max = this.$el.find("#md5-end").val();
            if (this.defaultParam.spliceMd5 === 2 && 
                (spliceMd5Max === "" || spliceMd5Min === "" || parseInt(spliceMd5Max) - parseInt(spliceMd5Min) < 0)){
                alert("你选择了高级设置截取MD5值，需要填写正确的取值范围！");
                return;
            }
            var result = true;
            if (this.defaultParam.isBaseSetup === 1){
                var basePrimaryKey = this.$el.find(".base-setup #secret-key-primary").get(0)
                result = this.onBlurSecretKeyInput({target: basePrimaryKey})
            } else if (this.defaultParam.isBaseSetup === 2){
                var advancedPrimaryKey = this.$el.find(".advanced-setup #secret-key-primary").get(0)
                result = this.onBlurSecretKeyInput({target: advancedPrimaryKey})
            }
            return result;
        },

        onSure: function(){
            var result = this.checkBalabala();
            if (!result) return false;

            var protectionType, confType, expirationTime, md5Truncate;
            confType = this.defaultParam.isBaseSetup === 1 ? 0 : 1
            if (confType === 0){
                protectionType = this.defaultParam.antiLeech;
            } else if (confType === 1 && this.defaultParam.encryption === 1){
                protectionType = 1;
            } else if (confType === 1 && this.defaultParam.encryption === 2){
                protectionType = this.defaultParam.mtPosition;
            }

            var advancedTimeInput = this.$el.find(".advanced-setup #deadline-time").val(),
                baseTimeInput = this.$el.find(".base-setup #deadline-time").val()

            if ((this.defaultParam.baseDeadline === 1 && confType === 0) || 
                (this.defaultParam.advancedDeadline === 1 && confType === 1)){
                expirationTime = 0;
            } else if (this.defaultParam.baseDeadline === 2 && confType === 0) {
                expirationTime = baseTimeInput;
            } else if (this.defaultParam.advancedDeadline === 2 && confType === 1) {
                expirationTime = advancedTimeInput;
            }

            if (this.defaultParam.spliceMd5 === 1) {
                md5Truncate = "";
            } else {
                md5Truncate = this.$el.find("#md5-start").val() + "," + this.$el.find("#md5-end").val()
            }
            var authKeyList = [];

            if (confType === 0){
                authKeyList.push({
                    id: new Date().valueOf(),
                    authKey: this.$el.find(".base-setup #secret-key-primary").val()
                })
                _.each(this.defaultParam.baseSecretKeyBackup, function(el, index, ls){
                    authKeyList.push({
                        id: el.id,
                        authKey: el.backupKey
                    })
                }.bind(this))
            } else {
                authKeyList.push({
                    id: new Date().valueOf(),
                    authKey: this.$el.find(".advanced-setup #secret-key-primary").val()
                })
                _.each(this.defaultParam.advancedSecretKeyBackup, function(el, index, ls){
                    authKeyList.push({
                        id: el.id,
                        authKey: el.backupKey
                    })
                }.bind(this))
            }

            var postParam = {
                "openFlag": this.defaultParam.isOpenSetup,
                "confType": confType,
                "protectionType": protectionType,
                "timeParam": this.$el.find("#key_time").val(),
                "hashParam": this.$el.find("#key_hash").val(),
                "timeType": this.defaultParam.timestampType,
                "expirationTime": expirationTime,
                // "authFactor": this.$el.find("#atuth-divisor").val(),
                "md5Truncate": md5Truncate,
                "authKeyList": authKeyList,
                "authDivisorList": this.defaultParam.atuthDivisorArray
            }
            postParam = {
                "originId": this.domainInfo.id,
                "list": [postParam]
            }

            this.collection.setStandardProtection(postParam)
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
        }
    });

    return LiveTimestampView;
});