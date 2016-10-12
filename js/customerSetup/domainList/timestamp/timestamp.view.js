define("timestamp.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditTimestampView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.add.html'])());

            require(['matchCondition.view'], function(MatchConditionView){
                var  matchConditionArray = [
                    {name: "全部文件", value: 1},
                    {name: "文件类型", value: 2},
                    {name: "指定URI", value: 3},
                    {name: "指定目录", value: 4},
                    {name: "正则匹配", value: 5},
                ], matchConditionOption = {
                    defaultCondition : 4,
                    matchConditionArray: matchConditionArray
                }
                this.matchConditionView = new MatchConditionView(matchConditionOption);
                this.matchConditionView.render(this.$el.find(".match-condition-ctn"));
            }.bind(this))

            this.$el.find(".setup-type input").on("click", $.proxy(this.onClickSetupRadio, this));
            this.$el.find(".anti-leech input").on("click", $.proxy(this.onClickAntiLeechRadio, this));
            this.$el.find(".base-setup .add-secret-key-backup").on("click", $.proxy(this.onClickBaseNewKey, this));
            this.$el.find(".base-setup.deadline input").on("click", $.proxy(this.onClickBaseDeadlineRadio, this));

            this.$el.find("#secret-key-primary").on("blur", $.proxy(this.onBlurSecretKeyInput, this));
            this.$el.find("#new-backup-key").on("blur", $.proxy(this.onBlurSecretKeyInput, this));

            this.$el.find(".encryption-url input").on("click", $.proxy(this.onClickEncryptionUrlRadio, this));
            this.$el.find(".advanced-setup.deadline input").on("click", $.proxy(this.onClickAdvancedDeadlineRadio, this));
            this.$el.find(".advanced-setup .add-secret-key-backup").on("click", $.proxy(this.onClickAdvancedNewKey, this));
            this.$el.find(".splice-md5 input[name='spliceMd5']").on("click", $.proxy(this.onClickSpliceMd5Radio, this));

            this.defaultParam = {
                isBaseSetup: 2,
                antiLeech: 1,
                baseSecretKeyPrimary: "你好呀",
                baseSecretKeyBackup: [{id:1, backupKey: "你快乐吗？"}, {id:2, backupKey: "你幸福吗？"}],
                baseDeadline: 1,

                encryption: 1,
                mtPosition: 1,
                timestampType: 1,
                advancedDeadline: 1,
                advancedSecretKeyPrimary: "你渴望力量吗？",
                advancedSecretKeyBackup: [{id:1, backupKey: "不！"}, {id:2, backupKey: "我渴望……"}],
                spliceMd5: 1


            };
            this.initBaseAdvancedSetup();
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
            if (this.defaultParam.baseDeadline === 1)
                this.$el.find(".advanced-setup #encryption1").get(0).checked = true;
            else if (this.defaultParam.baseDeadline === 2)
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
        },

        initDropDropdown: function(){
            var  mtPositionArray = [
                {name: "{md5hash/timestamp}", value: 1},
                {name: "{timestamp/md5hash}", value: 2}
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
                {name: "UNIX时间（十进制）", value: 1},
                {name: "UNIX时间（十六进制）", value: 2},
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
            if (result) alert("very good")
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
                    domain: domainInfo.domain
                }
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: false
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.channel.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRole, this))

            this.queryArgs = {
                "domain"           : null,
                "accelerateDomain" : null,
                "businessType"     : null,
                "clientName"       : null,
                "status"           : null,
                "page"             : 1,
                "count"            : 10
             }

             this.onClickQueryButton();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onChannelListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.domain = this.$el.find("#input-domain").val();
            this.queryArgs.clientName = this.$el.find("#input-client").val();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            if (this.queryArgs.clientName == "") this.queryArgs.clientName = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.queryChannel(this.queryArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.table.html'])({
                data: this.collection.models
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .manage").on("click", $.proxy(this.onClickItemNodeName, this));
            this.table.find("tbody .up").on("click", $.proxy(this.onClickItemUp, this));
            this.table.find("tbody .down").on("click", $.proxy(this.onClickItemDown, this));
        },

        onClickAddRole: function(event){
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditTimestampView = new AddEditTimestampView({collection: this.collection});

            var options = {
                title:"时间戳+共享秘钥防盗链新增配置",
                body : myAddEditTimestampView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    myAddEditTimestampView.onSure();
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
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
            this.collection.each(function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            this.collection.models = Utility.adjustElement(this.collection.models, modelIndex, true)

            this.collection.trigger("get.channel.success")
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
            this.collection.each(function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            this.collection.models = Utility.adjustElement(this.collection.models, modelIndex, false)

            this.collection.trigger("get.channel.success")
        },

        onClickItemNodeName: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id), args = JSON.stringify({
                domain: model.get("domain")
            })
            //var clientName = JSON.parse(this.options.query)
            window.location.hash = '#/domainList/' + clientName + "/domainSetup/" + args;
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.count;
                        this.collection.queryChannel(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
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