define("timestamp.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditTimestampView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.add.html'])());

            this.defaultParam = {
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
                timeParam: "",
                hashParam: "",
                authFactor: "",
                atuthDivisorArray: [{
                    "id": -1,
                    "divisor": 6,
                }, {
                    "id": -2,
                    "divisor": 2,
                }, {
                    "id": -3,
                    "divisor": 5,
                }],
                md5Truncate: "",
                type: 9,
                policy: ""
            };

            var authDivisorList = this.defaultParam.atuthDivisorArray;

            if (this.isEdit){
                var protectionType = this.model.get("protectionType"), //1:typeA 2:typeB 3:typeC
                    confType = this.model.get("confType"),
                    authKeyList = this.model.get("authKeyList"),
                    md5Truncate = this.model.get("md5Truncate")
                    expirationTime = this.model.get("expirationTime"),
                    authDivisorList = this.model.get("authDivisorList");

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

                if (expirationTime === "" || expirationTime === null) expirationTime = 0;

                if (expirationTime === 0){
                    this.defaultParam.baseDeadline = 1;
                    this.defaultParam.advancedDeadline = 1;
                } else if (expirationTime !== 0) {
                    this.defaultParam.baseDeadline = 2;
                    this.defaultParam.advancedDeadline = 2;
                }

                if (md5Truncate === ""){
                    this.defaultParam.spliceMd5 = 1;
                } else {
                    this.defaultParam.spliceMd5 = 2;
                }
                this.defaultParam.isBaseSetup = confType === 0 ? 1 : 2; //0:标准配置 1:高级配置
                this.defaultParam.timestampType = this.model.get("timeType") || 1; //1:UNIX时间（十六进制）2:UNix时间（十进制）3：Text格式
                //this.defaultParam.authFactor = this.model.get("authFactor");
                this.defaultParam.timeParam = this.model.get("timeParam");
                this.defaultParam.hashParam = this.model.get("hashParam");
                this.defaultParam.md5Truncate = this.model.get("md5Truncate");
                this.defaultParam.type = this.model.get("matchingType") || 0;
                this.defaultParam.policy = this.model.get("matchingValue") || "";
            }

            if (authDivisorList) {
                var  atuthDivisorArray = [
                    {value: 1, name: "host:用户请求域名"},
                    {value: 2, name: "uri：用户请求的uri"},
                    {value: 3, name: "url：不带参数"},
                    {value: 4, name: "arg&name:请求url中的参数名称"},
                    {value: 5, name: "time：请求url中是时间戳"},
                    {value: 6, name: "key：秘钥"},
                    {value: 7, name: "filename：文件名称，带后缀"},
                    {value: 8, name: "filenameno：文件名称，不带后缀"},
                    {value: 9, name: "method: 用户请求方法"},
                    {value: 10, name: "hdr&name：请求头中的header名称"}
                ];
                _.each(authDivisorList, function(el, index, ls){
                    var nameObj = _.find(atuthDivisorArray, function(obj){
                        return obj.value === el.divisor
                    }.bind(this))
                    if (nameObj) el.divisorName = nameObj.name
                }.bind(this))
                this.defaultParam.atuthDivisorArray = authDivisorList
            }

            require(['matchCondition.view', 'matchCondition.model'], function(MatchConditionView, MatchConditionModel){
                var  matchConditionArray = [
                    {name: "全部文件", value: 9},
                    {name: "文件类型", value: 0},
                    {name: "指定URI", value: 2},
                    {name: "指定目录", value: 1},
                    {name: "正则匹配", value: 3},
                ], matchConditionOption = {
                    collection: new MatchConditionModel(),
                    defaultCondition : this.defaultParam.type,
                    defaultPolicy: this.defaultParam.policy,
                    matchConditionArray: matchConditionArray
                }
                this.matchConditionView = new MatchConditionView(matchConditionOption);
                this.matchConditionView.render(this.$el.find(".match-condition-ctn"));

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
                this.initBaseAdvancedSetup();
            }.bind(this))
        },

        initBaseAdvancedSetup: function(){
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

            if (this.model)
                this.$el.find(".deadline-time #deadline-time").val(this.model.get("expirationTime"))

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
                {name: "Text格式（例如20130623181426）", value: 3}
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
                {value: 8, name: "filenameno：文件名称，不带后缀"},
                {value: 9, name: "method: 用户请求方法"},
                {value: 10, name: "hdr&name：请求头中的header名称"}
            ],
            atuthDivisorRootNode = this.$el.find(".atuth-divisor");
            Utility.initDropMenu(atuthDivisorRootNode, atuthDivisorArray, function(value){
                this.curAtuthDivisor = parseInt(value);
                if (this.curAtuthDivisor === 4 || this.curAtuthDivisor === 10){
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
            this.$el.find(".base-setup #new-backup-key").val("")
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
            if (this.curAtuthDivisor === 10 && this.curAtuthDivisorParam === ""){
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
            this.$el.find(".advanced-setup #new-backup-key").val("");
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

            var matchConditionParam = this.matchConditionView.getMatchConditionParam();
            if (!matchConditionParam) return false;

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

            var confTypeName;
            if (confType === 0) confTypeName = "配置类型：标准配置<br>";
            if (confType === 1) confTypeName = "配置类型：高级配置<br>";

            var protectionTypeName;
            if (protectionType === 1 && confType === 0) protectionTypeName = "防盗链格式：TypeA<br>";
            if (protectionType === 2 && confType === 0) protectionTypeName = "防盗链格式：TypeB<br>";
            if (protectionType === 3 && confType === 0) protectionTypeName = "防盗链格式：TypeC<br>";
            if (protectionType === 1 && confType === 1) protectionTypeName = "加密URL形式：形式1：加密字符串在参数中<br>";
            if (protectionType === 2 && confType === 1) protectionTypeName = "加密URL形式：形式2：加密字符串在路径中<br>";
            if (protectionType === 3 && confType === 1) protectionTypeName = "加密URL形式：形式2：加密字符串在路径中<br>";

            var authKeyListName;
            authKeyListName = "共享秘钥：1主，" + (authKeyList.length - 1) + "备<br>";

            var expirationTimeName;
            if (expirationTime === 0) expirationTimeName = "失效时间：时间戳时间<br>";
            if (expirationTime !== 0) expirationTimeName = "失效时间：时间戳时间+过期时间：" + expirationTime + "秒<br>";

            var summary = confTypeName + protectionTypeName + authKeyListName + expirationTimeName;

            var postParam = {
                "id": this.model ? this.model.get("id") : new Date().valueOf(),
                "matchingType": matchConditionParam.type,
                "matchingValue": matchConditionParam.policy,
                "typeName": matchConditionParam.typeName,
                "confType": confType,
                "protectionType": protectionType,
                "timeParam": this.$el.find("#key_time").val(),
                "hashParam": this.$el.find("#key_hash").val(),
                "timeType": this.defaultParam.timestampType,
                "expirationTime": expirationTime,
                //"authFactor": this.$el.find("#atuth-divisor").val(),
                "authDivisorList": this.defaultParam.atuthDivisorArray,
                "md5Truncate": md5Truncate,
                "authKeyList": authKeyList,
                "summary": summary
            }
            return postParam;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });


    var TimestampView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.html'])());
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
                notShowBtn: false
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.collection.on("get.protection.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.protection.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRule, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.collection.on("set.protection.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.protection.error", $.proxy(this.onGetError, this));

            this.onClickQueryButton()
        },

        onSaveSuccess: function(){
            alert("保存成功！")
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
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
        },

        onClickSaveBtn: function(){
            var list = [];
            this.collection.each(function(obj){
                list.push({
                    "matchingType": obj.get('matchingType'),
                    "matchingValue": obj.get('matchingValue'),
                    "confType": obj.get('confType'),
                    "protectionType": obj.get('protectionType'),
                    "timeParam": obj.get('timeParam'),
                    "hashParam": obj.get('hashParam'),
                    "timeType": obj.get('timeType'),
                    "expirationTime": obj.get('expirationTime'),
                    "authDivisorList": obj.get('authDivisorList'),
                    "md5Truncate": obj.get('md5Truncate'),
                    "authKeyList": obj.get('authKeyList'),
                })
            }.bind(this))

            var postParam = {
                "originId": this.domainInfo.id,
                "list": list
            }

            this.collection.setStandardProtection(postParam)
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onChannelListSuccess: function(){
            this.initTable();
        },

        onClickQueryButton: function(){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getStandardProtection({originId:this.domainInfo.id});
        },

        initTable: function(){
            var allFileArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
            }.bind(this));

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.table = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.table.html'])({
                data: this.collection.models,
                hideAction: false
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .up").on("click", $.proxy(this.onClickItemUp, this));
            this.table.find("tbody .down").on("click", $.proxy(this.onClickItemDown, this));
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.find(function(obj){
                return obj.get("id") === parseInt(id)
            }.bind(this));
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditTimestampView = new AddEditTimestampView({
                collection: this.collection,
                model: model,
                isEdit: true
            });

            var options = {
                title:"时间戳+共享秘钥防盗链",
                body : myAddEditTimestampView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditTimestampView.onSure();
                    if (!postParam) return;
                    _.each(postParam, function(value, key, ls){
                        model.set(key, value);
                    }.bind(this))
                    this.collection.trigger("get.protection.success");
                    this.addRolePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickAddRule: function(event){
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditTimestampView = new AddEditTimestampView({collection: this.collection});

            var options = {
                title:"时间戳+共享秘钥防盗链",
                body : myAddEditTimestampView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditTimestampView.onSure();
                    if (!postParam) return;
                    var model = new this.collection.model(postParam);
                    var allFileArray = this.collection.filter(function(obj){
                        return obj.get('matchingType') === 9;
                    }.bind(this));

                    var specifiedUrlArray = this.collection.filter(function(obj){
                        return obj.get('matchingType') === 2;
                    }.bind(this));

                    var otherArray = this.collection.filter(function(obj){
                        return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
                    }.bind(this));

                    if (postParam.type === 9) allFileArray.push(model)
                    if (postParam.type === 2) specifiedUrlArray.push(model)
                    if (postParam.type !== 9 && postParam.type !== 2) otherArray.push(model)
  
                    this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)
                    this.collection.trigger("get.protection.success");
                    this.addRolePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickItemDelete: function(event){
            var result = confirm("你确定要删除吗？");
            if (!result) return;
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");
            for (var i = 0; i < this.collection.models.length; i++){
                if (this.collection.models[i].get("id") === parseInt(id)){
                    this.collection.models.splice(i, 1);
                    this.collection.trigger("get.protection.success")
                    return;
                }
            }
        },

        onClickItemUp: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), modelIndex;

            var allFileArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
            }.bind(this));

            _.each(otherArray, function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            otherArray = Utility.adjustElement(otherArray, modelIndex, true)

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.collection.trigger("get.protection.success")
        },

        onClickItemDown: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), modelIndex;

            var allFileArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
            }.bind(this));

            _.each(otherArray, function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            otherArray = Utility.adjustElement(otherArray, modelIndex, false)

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.collection.trigger("get.protection.success")
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

    return TimestampView;
});