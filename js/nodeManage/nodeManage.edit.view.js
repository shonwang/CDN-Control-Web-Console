define("nodeManage.edit.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var IspTemplateView = Backbone.View.extend({
        initialize: function(options) {
            this.args1 = options.args || {}
            this.operatorList = options.operatorList;
            this.operatorListArrToObj();
            this.ispIndex = options.index; //编辑的时候，需要用到ispIndex
            this.model = options.model;
            var args = options.args || {};
            this.isEdit = options.isEdit || false;
            this.isSingle = options.isSingle || false;
            this.isChargeEdit = options.isChargeEdit || false;
            this.isMultiwire = options.isMultiwire || false; //是否是多线
            if (this.isEdit || this.isChargeEdit) {
                this.args = {
                    "index": this.ispIndex,
                    "isMultiwire": this.isMultiwire,
                    "operatorId": args.operatorId || 1, //运营商
                    "chargingType": args.chargingType || 1, //计费方式
                    "minBandwidth": args.minBandwidth || '', //保底带宽
                    "maxBandwidth": args.maxBandwidth || '', //上联带宽
                    "maxBandwidthThreshold": args.maxBandwidthThreshold || '', //上联带宽阈值
                    "minBandwidthThreshold": args.minBandwidthThreshold || '', //保低带宽阈值
                    "unitPrice": args.unitPrice || '', //成本权值
                    // "inZabName": args.inZabName || '', //入口带宽zabbix名称
                    // "outZabName": args.outZabName || '', //出口带宽zabbix名称
                    "buildBandwidth":args.buildBandwidth  || '',//建设带宽名称
                    "freeBandwidth":args.freeBandwidth || '',//免费带宽
                    "freeStartTime":args.freeStartTime || '',//免费带宽开始时间
                    "freeEndTime":args.freeEndTime || '',//免费带宽结束时间
                    //"startChargingTime": args.startChargingTime || '',//开始计费日期
                    //"rsNodeCorpDtos":args.rsNodeCorpDtos  || ''                 //单项添加不需要此项
                }

            } else {
                this.args = {
                    "index": this.ispIndex || null,
                    "isMultiwire": this.isMultiwire,
                    "operatorId": 1, //运营商
                    "chargingType": 1, //计费方式
                    "minBandwidth": '', //保底带宽
                    "maxBandwidth": '', //上联带宽
                    "maxBandwidthThreshold": '', //上联带宽阈值
                    "minBandwidthThreshold": '', //保低带宽阈值
                    "unitPrice": '', //成本权值
                    // "inZabName": '', //入口带宽zabbix名称
                    // "outZabName": '', //出口带宽zabbix名称
                    "buildBandwidth":'',//建设带宽名称
                    "freeBandwidth":'',//免费带宽
                    "freeStartTime":'',
                    "freeEndTime":''

                };
            }
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.isp.html'])({
                data: this.args
            }));
            this.hideDate();
            this.setDropDownList();
            //this.initChargeDatePicker();
            if (this.isMultiwire) {
                this.setOperatorDorpDownList();
            }
            if(this.isChargeEdit){
                this.disable();
            }
            this.$el.find("#input-maxbandwidth").on("blur",$.proxy(this.onMaxBandwidthBlur,this));
            this.initFreeStartTime()
            this.initFreeEndTime()
        },
        hideDate:function(){
            if (this.isSingle){
                this.$el.find("#free-end-time12").hide();
                this.$el.find("#free-start-time12").hide();
            }
        },
        //免费带宽开始计费日期
        initFreeStartTime:function(){
            var startVal = null,
                endVal = null;
            if (this.args.freeStartTime)
                startVal = new Date(this.args.freeStartTime).format("yyyy/MM/dd");
            var startOption = {
                lang: 'ch',
                timepicker: false,
                scrollInput: false,
                format: 'Y/m/d',
                value: startVal,
                onChangeDateTime: function() {
                    this.args.freeStartTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#free-start-time").datetimepicker(startOption);
        },
        //免费带宽结束时间
        initFreeEndTime:function(){
            var startVal = null,
                endVal = null;
            if (this.args.freeEndTime)
                startVal = new Date(this.args.freeEndTime).format("yyyy/MM/dd");
            var startOption = {
                lang: 'ch',
                timepicker: false,
                scrollInput: false,
                format: 'Y/m/d',
                value: startVal,
                onChangeDateTime: function() {
                    this.args.freeEndTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#free-end-time").datetimepicker(startOption);
        },
        disable:function(){
            this.$el.find('#input-maxbandwidth').attr("readonly", true);
            this.$el.find('#input-minbandwidth').attr("readonly", true);
            this.$el.find('#input-backupBandwidth').attr("readonly", true);
            this.$el.find('#input-threshold').attr("readonly", true);
            this.$el.find('#input-minthreshold').attr("readonly", true);
            this.$el.find('#input-freeBandwidth').attr("readonly", true);
            this.$el.find("#free-start-time").attr('disabled','disabled')
            this.$el.find("#free-end-time").attr('disabled','disabled')
        },
        onMaxBandwidthBlur:function(){
            var _value = this.$el.find("#input-maxbandwidth").val();
            if(this.isEdit || this.isChargeEdit){
                if(_value != this.args.maxBandwidth){
                    this.$el.find(".up-bandwidth-change-tips").show();
                }
            }
        },

        setOperatorDorpDownList: function() {
            var operatorList = this.operatorList;
            Utility.initDropMenu(this.$el.find(".dropdown-ispList"), operatorList, function(value) {
                this.args.operatorId = parseInt(value);
            }.bind(this));
            if (this.isEdit || this.isChargeEdit) {
                var defaultValue = _.find(operatorList, function(object) {
                    return object.value === this.args.operatorId;
                }.bind(this));
                this.$el.find(".dropdown-ispList .cur-value").html(defaultValue.name)
            } else {
                this.$el.find(".dropdown-ispList .cur-value").html(operatorList[0].name)
            }
        },

        operatorListArrToObj: function() {
            var arr = this.operatorList;
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                obj[arr[i]["value"]] = arr[i]["name"];
            }
            obj["9"] && delete obj["9"];
            this.operatorListObj = obj;
            this.reBuildOperatorList();
        },

        reBuildOperatorList: function() {
            var operatorListObj = this.operatorListObj;
            var arr = [];
            for (var item in operatorListObj) {
                arr.push({
                    name: operatorListObj[item],
                    value: parseInt(item)
                });
            }
            this.operatorList = arr;
        },

        
        setDropDownList: function() {
            var defaultValue;
         
            var nameList = [{
                    name: "95峰值",
                    value: 1
                }, {
                    name: "包端口",
                    value: 2
                }, {
                    name: "峰值",
                    value: 3
                }, {
                    name: "第三峰",
                    value: 4
                }, {
                   name:"流量",
                   value:5
            }, {
                   name:"日95月均值",
                   value:6
            }
            ];

            if(this.isEdit || this.isChargeEdit){
                defaultValue = _.find(nameList, function(object) {
                    return object.value === this.args.chargingType
                }.bind(this));  
            }             
            Utility.initDropMenu(this.$el.find(".dropdown-charging"), nameList, function(value) {
                if(this.isEdit || this.isChargeEdit && defaultValue.value != value){
                    this.$el.find(".charge-change-tips").show();
                }
                this.args.chargingType = parseInt(value);
            }.bind(this));

            if (this.isEdit || this.isChargeEdit) {
                if(this.isChargeEdit){
                    this.$el.find("#dropdown-charging").attr("disabled","diaabled")
                }
                this.$el.find(".dropdown-charging .cur-value").html(defaultValue.name)
            } else {
                this.$el.find(".dropdown-charging .cur-value").html(nameList[0].name)
            }
        },

        initChargeDatePicker: function() {
            var startVal = null,
                endVal = null;
            if (this.args.startChargingTime)
                startVal = new Date(this.args.startChargingTime).format("yyyy/MM/dd");
            var startOption = {
                lang: 'ch',
                timepicker: false,
                scrollInput: false,
                format: 'Y/m/d',
                value: startVal,
                onChangeDateTime: function() {
                    // this.args.startChargingTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#input-start").datetimepicker(startOption);
        },

        getArgs: function() {
            //var enName = this.$el.find("#input-english").val().replace(/\s+/g, ""),
            //chName = this.$el.find("#input-name").val().replace(/\s+/g, ""),
            var maxBandwidthThreshold = this.$el.find("#input-threshold").val(), //上联带宽阈值
                minBandwidthThreshold = this.$el.find("#input-minthreshold").val(), //保底带宽阈值
                maxBandwidth = this.$el.find("#input-maxbandwidth").val(), //上联带宽
                minBandwidth = this.$el.find("#input-minbandwidth").val(), //保底带宽
                unitPrice = this.$el.find("#input-unitprice").val(), //成本权值
                buildBandwidth = this.$el.find("#input-backupBandwidth").val(),//冷备带宽
                freeStartTime = this.$el.find("#free-start-time").val(),
                freeEndTime = this.$el.find("#free-end-time").val(),
                freeBandwidth = this.$el.find("#input-freeBandwidth").val(),
                //longitudeLatitude = this.$el.find('#input-longitude-latitude').val(),
                // outzabname = this.$el.find('#input-outzabname').val().replace(/\s+/g, ""), //出口带宽zabbix名称
                // inzabname = this.$el.find("#input-inzabname").val().replace(/\s+/g, ""), //入口带宽zabbix名称
                re = /^[0-9]+(.[0-9]+)?$/,
                outzabnameRe = /^[0-9A-Za-z\-\[\]\_]+$/,
                letterRe = /[A-Za-z]+/,
                reLocation = /^\d+(\.\d+)?----\d+(\.\d+)?$/;

            if(freeStartTime > freeEndTime){
                Utility.warning("免费带宽开始时间小于等于免费带宽结束时间!");
                return false;
            }
            if(!re.test(buildBandwidth)){
                Utility.warning("建设带宽不能为空，且建设带宽只能填入数字！");
                return false;
            }
            if(freeBandwidth != ''){
                if(!re.test(freeBandwidth)){
                    Utility.warning("免费带宽只能填入数字！");
                    return false;
                }
            }
            if(parseInt(freeBandwidth) > 100000000 || parseInt(freeBandwidth) < 0 ){
                Utility.warning("免费带宽：0-100000000（0-100T，单位转换按1000算）");
                return false;
            }
            if(parseInt(freeBandwidth) > parseInt(buildBandwidth)){
                Utility.warning("免费带宽不能大于建设带宽");
                return false;
            }
            if(parseInt(buildBandwidth) > 100000000 || parseInt(buildBandwidth) < 0 ){
                Utility.warning("建设带宽：0-100000000（0-100T，单位转换按1000算）");
                return false;
            }
            if (parseInt(maxBandwidth) > parseInt(buildBandwidth)) {
                Utility.warning("上联带宽不能大于建设带宽！");
                return false;
            }
            if (!re.test(maxBandwidth)) {
                Utility.warning("上联带宽不能为空，且上联带宽只能填入数字！");
                return false;
            }
            if (!re.test(minBandwidth)) {
                Utility.warning("保底带宽不能为空，且保底带宽只能填入数字！");
                return false;
            }
            if (parseInt(maxBandwidth) > 100000000 || parseInt(maxBandwidth) < 0) {
                Utility.warning("上联带宽：0-100000000（0-100T，单位转换按1000算）");
                return false;
            }
            if (parseInt(minBandwidth) > 100000000 || parseInt(minBandwidth) < 0) {
                Utility.warning("保底带宽：0-100000000（0-100T，单位转换按1000算）");
                return false;
            }
            if (parseInt(maxBandwidth) < parseInt(minBandwidth)) {
                Utility.warning("上联带宽不能小于保底带宽！");
                return false;
            }
            if (!re.test(maxBandwidthThreshold)) {
                Utility.warning("上联带宽阈值不能为空，且上联带宽阈值只能填入数字！");
                return false;
            }
            if (!re.test(minBandwidthThreshold)) {
                Utility.warning("保底带宽阈值不能为空，且保底带宽阈值只能填入数字！");
                return false;
            }
            if (parseInt(maxBandwidthThreshold) < 0 || parseInt(maxBandwidthThreshold) > parseInt(maxBandwidth)) {
                Utility.warning("上联带宽阈值:"+ 0 + "-"+maxBandwidth);
                return false;
            }
            if (parseInt(minBandwidthThreshold) < 0 || parseInt(minBandwidthThreshold) > parseInt(maxBandwidth)) {
                Utility.warning("保底带宽阈值:"+ 0 + "-"+maxBandwidth);
                return false;
            }
            if (parseInt(minBandwidthThreshold) < parseInt(minBandwidth)) {
                Utility.warning("保底带宽阈值：只能>=保底带宽");
                return false;
            }
            if (!re.test(unitPrice)) {
                Utility.warning("成本权值不能为空，且成本权值只能填入数字！");
                return false;
            }
            if (parseInt(unitPrice) > 2147483647 || parseInt(unitPrice) < 0) {
                Utility.warning("成本权值不能小于0且大于长整型的最大值");
                return false;
            }
            // if (!outzabnameRe.test(outzabname) || outzabname.indexOf("-") === -1 ||
            //     outzabname.indexOf("_") === -1 || outzabname.indexOf("[") === -1 ||
            //     outzabname.indexOf("]") === -1 || !letterRe.test(outzabname)) {
            //     Utility.warning("zabbix出口带宽英文、“-”、“_”、“[”、“]”为必填项，数字为可填项，即组合可包含数字，也可不包含数字");
            //     return false;
            // }

            this.args.minBandwidth = minBandwidth;
            this.args.maxBandwidth = maxBandwidth;
            this.args.maxBandwidthThreshold = maxBandwidthThreshold;
            this.args.minBandwidthThreshold = minBandwidthThreshold;
            this.args.unitPrice = unitPrice;
            // this.args.inZabName = inzabname;
            // this.args.outZabName = outzabname;
            this.args.buildBandwidth = buildBandwidth;
            this.args.freeBandwidth = freeBandwidth;
            this.args.freeStartTime = this.args.freeStartTime;
            this.args.freeEndTime = this.args.freeEndTime;
            return this.args;
        },

        destroy: function() {
            this.$el.remove();
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var MultiwireTemplateView = Backbone.View.extend({
        initialize: function(options) {
            this.operatorList = options.operatorList;
            this.operatorListArrToObj();
            var args = options.args;
            this.model = options.model;
            this.isEdit = options.isEdit || false;
            this.isChargeEdit = options.isChargeEdit || false;
            this.isMultiwire = true;
            if (this.isEdit || this.isChargeEdit) {
                this.args = {
                    isMultiwire: true,
                    "rsNodeCorpDtos": args.rsNodeCorpDtos || [] //为了兼容老版库里没有数据的情况
                }
            } else {
                this.args = {
                    isMultiwire: true,
                    "rsNodeCorpDtos": []
                };
            }
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.ispMultiwire.html'])({
                data: this.args
            }));
            this.$el.find(".addIsp").on("click", $.proxy(this.onAddIspClick, this));
            this.setRsNodeCorpDtosList();
        },
        setRsNodeCorpDtosList: function() {
            var rsNodeCorpDtos = this.args.rsNodeCorpDtos;
            var obj = {};
            for (var i = 0; i < rsNodeCorpDtos.length; i++) {
                obj[i] = rsNodeCorpDtos[i];
            }
            this.rsNodeCorpDtosList = obj;
            this.setRsNodeCorpDtosTbody();
        },

        formatRsNodeCorpDtosList: function() {
            var rsNodeCorpDtosList = this.rsNodeCorpDtosList;
            var arr = [];
            for (var i in rsNodeCorpDtosList) {
                arr.push(parseInt(i));
            }

            arr.sort(function(a, b) {
                return a - b;
            });

            var newRsNodeCorpDtosList = [];
            for (var i = 0; i < arr.length; i++) {
                newRsNodeCorpDtosList.push(rsNodeCorpDtosList[arr[i]]);
            }

            var obj = {};
            for (var i = 0; i < newRsNodeCorpDtosList.length; i++) {
                obj[i] = newRsNodeCorpDtosList[i];
            }
            this.rsNodeCorpDtosList = obj;
            this.totalRsNodeCorpDtosListLength = newRsNodeCorpDtosList.length;
            return newRsNodeCorpDtosList;
        },

        chargingNameList: {
            1: "95峰值",
            2: "包端口",
            3: "峰值",
            4: "第三峰",
            5:"流量",
            6:"日95月均值"
        },

        setRsNodeCorpDtosTbody: function() {
            var chargingNameList = this.chargingNameList;
            var obj = this.formatRsNodeCorpDtosList();
            _.each(obj, function(item) {
                item.chargingTypeName = chargingNameList[item.chargingType];
                item.operatorName = item.operatorId && this.operatorListObj[item.operatorId] || "---";
                item.freeStartTimeFormated = item.freeStartTime && new Date(item.freeStartTime).format('yyyy/MM/dd hh:mm') || '---';
                item.freeEndTimeFormated = item.freeEndTime && new Date(item.freeEndTime).format('yyyy/MM/dd hh:mm') || '---';
            }.bind(this));
            var rsNodeCorpDtosList = $(_.template(template['tpl/nodeManage/nodeManage.ispTbody.html'])({
                data: obj
            }));
            if (obj && obj.length == 0) {
                this.$el.find(".isp-table tbody").html('<tr><td colspan="11" class="text-center">请添加运营商信息!</td></tr>');
            } else {
                this.$el.find(".isp-table tbody").html(rsNodeCorpDtosList);
            }
            rsNodeCorpDtosList.find(".rsNodeCorpDtos-modify").click($.proxy(this.toModify, this));
            rsNodeCorpDtosList.find(".rsNodeCorpDtos-delete").click($.proxy(this.toDelete, this));
        },

        toModify: function(event) {

            var rsNodeCorpDtosList = this.formatRsNodeCorpDtosList();
            var eventTarget = event.srcElement || event.target;
            var id = parseInt($(eventTarget).attr("data-id"));
            var _data = rsNodeCorpDtosList[id];
            if (this.addIspPopup) $("#" + this.addIspPopup.modalId).remove();
            if(this.isEdit){
                var ispTemplateView = new IspTemplateView({
                    index: id,
                    operatorList: this.operatorList,
                    args: _data,
                    isEdit: true,
                    isMultiwire: true
                });
            }else if(this.isChargeEdit){
                var ispTemplateView = new IspTemplateView({
                    index: id,
                    operatorList: this.operatorList,
                    args: _data,
                    isChargeEdit: true,
                    isMultiwire: true
                });
            }

            var options = {
                title: "编辑运营商",
                body: ispTemplateView,
                backdrop: 'static',
                type: 2,
                width: 800,
                height: 800,
                bg: true,
                onOKCallback: function() {
                    var result = ispTemplateView.getArgs();
                    if (!result) {
                        return false;
                    }
                    var index = result.index;
                    this.rsNodeCorpDtosList[index] = result;
                    this.setRsNodeCorpDtosTbody();
                    this.addIspPopup.$el.modal("hide");
                }.bind(this)
            }
            this.addIspPopup = new Modal(options);
        },

        toDelete: function(event) {
            var target = event.target || event.srcElement;
            var id = $(target).attr("data-id");
            var rsNodeCorpDtosList = this.rsNodeCorpDtosList;
            delete rsNodeCorpDtosList[id];
            this.setRsNodeCorpDtosTbody();
        },

        onAddIspClick: function() {

            var rsNodeCorpDtosList = this.formatRsNodeCorpDtosList();
            var index = rsNodeCorpDtosList.length;

            if (this.addIspPopup) $("#" + this.addIspPopup.modalId).remove();
            var ispTemplateView = new IspTemplateView({
                operatorList: this.operatorList,
                args: null,
                isEdit: false,
                isChargeEdit:false,
                isMultiwire: true
            });
            var options = {
                title: "添加运营商",
                body: ispTemplateView,
                backdrop: 'static',
                type: 2,
                width: 800,
                height: 800,
                bg: true,
                onOKCallback: function() {
                    var result = ispTemplateView.getArgs();
                    if (!result) {
                        return false;
                    }
                    this.rsNodeCorpDtosList[index] = result;
                    this.setRsNodeCorpDtosTbody();
                    this.addIspPopup.$el.modal("hide");
                }.bind(this)
            }
            this.addIspPopup = new Modal(options);
        },

        operatorListArrToObj: function() {
            var arr = this.operatorList;
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                obj[arr[i]["value"]] = arr[i]["name"];
            }
            obj["9"] && delete obj["9"];
            this.operatorListObj = obj;
            this.reBuildOperatorList();
        },

        reBuildOperatorList: function() {
            var operatorListObj = this.operatorListObj;
            var arr = [];
            for (var item in operatorListObj) {
                arr.push({
                    name: operatorListObj[item],
                    value: parseInt(item)
                });
            }
            this.operatorList = arr;
        },

        destroy: function() {
            this.$el.remove();
        },

        getArgs: function() {
            this.args.rsNodeCorpDtos = this.formatRsNodeCorpDtosList();
            if (this.args.rsNodeCorpDtos.length == 0) {
                Utility.warning("请添加运营商!");
                return false;
            }
            return this.args;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });


    var AddOrEditNodeView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.isChargeEdit = options.isChargeEdit;
            this.model = options.model;
            this.showParentList = options.showList;
            this.onOKCallback = options.onOKCallback || null;
            this.onHiddenCallback = options.onHiddenCallback || null;
            if (this.isEdit) {
                this.args = {
                    "id": this.model.get("id"),
                    "name": this.model.get("name"),
                    "chName": this.model.get("chName"),
                    "operator": this.model.get("operator"),
                    "chargingType": this.model.get("chargingType"),
                    "minBandwidth": this.model.get("minBandwidth"),
                    "maxBandwidth": this.model.get("maxBandwidth"),
                    "maxBandwidthThreshold": this.model.get("maxBandwidthThreshold"),
                    "minBandwidthThreshold": this.model.get("minBandwidthThreshold"),
                    "unitPrice": this.model.get("unitPrice"),
                    "remark": this.model.get("remark"),
                    "operatorId": this.model.get("operatorId"),
                    "operatorName": this.model.get("operatorName"),
                    "startChargingTime": this.model.get("startChargingTime"),
                    "rsNodeCorpDtos": this.model.get("rsNodeCorpDtos"),   
                    "freeStartTime":this.model.get("freeStartTime"),
                    "freeEndTime":this.model.get("freeEndTime"),
                    "cacheLevel": this.model.get("cacheLevel"),
                    "liveLevel":this.model.get("liveLevel"),
                    "buildBandwidth":this.model.get("buildBandwidth") ,//建设带宽
                    "freeBandwidth":this.model.get("freeBandwidth")//免费带宽
                }
            }else if(this.isChargeEdit){
                this.args = {
                    "id": this.model.get("id"),
                    "name": this.model.get("name"),
                    "chName": this.model.get("chName"),
                    "operator": this.model.get("operator"),
                    "chargingType": this.model.get("chargingType"),
                    "minBandwidth": this.model.get("minBandwidth"),
                    "maxBandwidth": this.model.get("maxBandwidth"),
                    "maxBandwidthThreshold": this.model.get("maxBandwidthThreshold"),
                    "minBandwidthThreshold": this.model.get("minBandwidthThreshold"),
                    "unitPrice":this.model.get("unitPrice"),
                    "remark": this.model.get("remark"),
                    "operatorId": this.model.get("operatorId"),
                    "operatorName": this.model.get("operatorName"),
                    "startChargingTime": this.model.get("startChargingTime"),
                    "rsNodeCorpDtos": this.model.get("rsNodeCorpDtos"),
                    "freeStartTime":this.model.get("freeStartTime"),
                    "freeEndTime":this.model.get("freeEndTime"),
                    "cacheLevel": this.model.get("cacheLevel"),
                    "liveLevel":this.model.get("liveLevel"),
                    "buildBandwidth":this.model.get("buildBandwidth"), //建设带宽
                    "freeBandwidth":this.model.get("freeBandwidth")//免费带宽
                }
            } else {
                this.args = {
                    "id": 0,
                    "name": "",
                    "chName": "",
                    "operator": "",
                    "chargingType": 1,
                    "minBandwidth": "",
                    "maxBandwidth": "",
                    "maxBandwidthThreshold": "",
                    "minBandwidthThreshold": "",
                    "unitPrice": "",
                    // "inZabName": "",
                    // "outZabName": "",
                    "remark": "",
                    "operatorId": "",
                    "operatorName": "",
                    "startChargingTime": new Date().valueOf(),
                    "rsNodeCorpDtos": [],
                    "freeStartTime":"",
                    "freeEndTime":"",
                    "cacheLevel": 0,
                    "liveLevel": 0,
                    "buildBandwidth": "",
                    "freeBandwidth":''
                }
            }
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.add&edit.html'])({
                data: this.args
            }));


            this.collection.off("get.city.success");
            this.collection.off("get.city.error");
            this.collection.on("get.city.success", $.proxy(this.onGetAllCity, this));
            this.collection.on("get.city.error", $.proxy(this.onGetError, this));

            this.collection.off("get.location.success");
            this.collection.off("get.location.error");
            this.collection.on("get.location.success", $.proxy(this.onGetLocation, this));
            this.collection.on("get.location.error", $.proxy(this.onGetError, this));

            this.collection.off("get.continent.success");
            this.collection.off("get.continent.error");
            this.collection.on("get.continent.success", $.proxy(this.onGetAllContinent, this));
            this.collection.on("get.continent.error", $.proxy(this.onGetError, this));

            this.collection.off("get.countryByContinent.success");
            this.collection.off("get.countryByContinent.error");
            this.collection.on("get.countryByContinent.success", $.proxy(this.onGetCountryByContinent, this));
            this.collection.on("get.countryByContinent.error", $.proxy(this.onGetError, this));

            this.collection.off("get.operationByCountry.success");
            this.collection.off("get.operationByCountry.error");
            this.collection.on("get.operationByCountry.success", $.proxy(this.onGetOperatorSuccess, this));
            this.collection.on("get.operationByCountry.error", $.proxy(this.onGetError, this));

            this.collection.off("get.province.success");
            this.collection.off("get.province.error");
            this.collection.on("get.province.success", $.proxy(this.onGetAllProvince, this));
            this.collection.on("get.province.error", $.proxy(this.onGetError, this));

            this.collection.off("get.cityByProvince.success");
            this.collection.off("get.cityByProvince.error");
            this.collection.on("get.cityByProvince.success", $.proxy(this.onGetAllCityAndBigArea, this));
            this.collection.on("get.cityByProvince.error", $.proxy(this.onGetError, this));

            this.$el.find(".save").on("click", $.proxy(this.onSaveClick, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onCancelClick, this));

            if (this.isEdit){
                this.$el.find("small").html("/编辑");
            }else if(this.isChargeEdit){
                // this.$el.find("#h4-j").html("<small>/计费详情</small>")
                this.$el.find("small").html("/计费详情");
                this.$el.find("#input-start").attr("disabled","disabled")
                this.$el.find("#free-start-time").attr("disabled","disabled")
                this.$el.find("#free-end-time").attr("disabled","disabled")
                this.$el.find("#input-name").attr("readonly",true)
                this.$el.find("#input-english").attr("readonly",true)
            }


            this.initDropList(options.list);
            this.initChargeDatePicker();
            this.initFreeStartTime();
            this.initFreeEndTime();
        },

        initLiveLevelDropMenu: function() {
            var liveLevelArray = [{
                name: "非直播属性",
                value: 0
            }, {
                name: "上层",
                value: 1
            }, {
                name: "中层",
                value: 2
            },{
                name: "下层",
                value: 3
            }]
            Utility.initDropMenu(this.$el.find(".dropdown-liveLevel"), liveLevelArray, function(value) {
                this.liveLevel = parseInt(value);
            }.bind(this));
            if(this.isEdit || this.isChargeEdit){
                // this.$el.find("#dropdown-liveLevel").attr("disabled","disabled");
                var defaultValue = _.find(liveLevelArray, function(object) {
                    return object.value === this.model.attributes.liveLevel
                }.bind(this));
                if (defaultValue) {
                    if(this.isChargeEdit){
                        this.$el.find("#dropdown-liveLevel").attr("disabled","disabled")
                    }
                    this.$el.find(".dropdown-liveLevel .cur-value").html(defaultValue.name)
                    this.liveLevel = defaultValue.value;
                } else {
                    if(this.isChargeEdit){
                        this.$el.find("#dropdown-liveLevel").attr("disabled","disabled")
                    }
                    this.$el.find(".dropdown-liveLevel .cur-value").html(liveLevelArray[0].name);
                    this.liveLevel = liveLevelArray[0].value;
                }
            }else{
                this.$el.find(".dropdown-liveLevel .cur-value").html(liveLevelArray[0].name);
                this.liveLevel = liveLevelArray[0].value;
            }
        },

        initCacheLevelDropMenu: function() {
            var cacheLevelArray = [{
                name: "非点播属性",
                value: 0
            }, {
                name: "上层",
                value: 1
            }, {
                name: "中层",
                value: 2
            },{
                name: "下层",
                value: 3
            }]
            Utility.initDropMenu(this.$el.find(".dropdown-cacheLevel"), cacheLevelArray, function(value) {
                this.cacheLevel = parseInt(value);
            }.bind(this));
            if(this.isEdit || this.isChargeEdit){
                var defaultValue = _.find(cacheLevelArray, function(object) {
                    return object.value === this.model.attributes.cacheLevel
                }.bind(this));
                if (defaultValue) {
                    if(this.isChargeEdit){
                        this.$el.find("#dropdown-cacheLevel").attr("disabled","disabled")
                    }
                    this.$el.find(".dropdown-cacheLevel .cur-value").html(defaultValue.name)
                    this.cacheLevel = defaultValue.value;
                } else {
                    if(this.isChargeEdit){
                        this.$el.find("#dropdown-cacheLevel").attr("disabled","disabled")
                    }
                    this.$el.find(".dropdown-cacheLevel .cur-value").html(cacheLevelArray[0].name);
                    this.cacheLevel = cacheLevelArray[0].value;
                }
            }else{
                this.$el.find(".dropdown-cacheLevel .cur-value").html(cacheLevelArray[0].name);
                this.cacheLevel = cacheLevelArray[0].value;
            }
        },


        onSaveClick: function() {
            var args = this.getArgs();
            if (!args) {
                return false;
            }
            this.onOKCallback && this.onOKCallback();
            this.hide();
            this.showParentList();
        },

        onCancelClick: function() {
            this.destroy();
            this.showParentList();
        },

        getArgs: function() {
            var enName = this.$el.find("#input-english").val().replace(/\s+/g, ""),
                chName = this.$el.find("#input-name").val().replace(/\s+/g, ""),
                freeStartTime = this.$el.find("#free-start-time").val().replace(/\s+/g, ""),
                freeEndTime = this.$el.find("#free-end-time").val().replace(/\s+/g, ""),
                longitudeLatitude = this.$el.find('#input-longitude-latitude').val(),
                re = /^\d+$/,
                outzabnameRe = /^[0-9A-Za-z\-\[\]\_]+$/,
                letterRe = /[A-Za-z]+/,
                reLocation = /^\d+(\.\d+)?----\d+(\.\d+)?$/;
            if(freeStartTime>freeEndTime){
                Utility.warning("开始时间不能大于结束时间")
                return
            }
            if (!reLocation.test(longitudeLatitude)) {
                Utility.warning("需要填写正确的经纬度，否则该节点无法在地图中展示！比如：108.953098----34.2778");
                return
            }
            if (!enName || !chName) {
                Utility.warning("节点名称和英文名称都要填写！");
                return;
            }
           
            var ispTempalteData = this.ispTemplate.getArgs();
            if (!ispTempalteData) {
                return false;
            }
            var maxBandwidthThreshold = ispTempalteData.maxBandwidthThreshold || null;
            var minBandwidthThreshold = ispTempalteData.minBandwidthThreshold || null;
            var maxBandwidth = ispTempalteData.maxBandwidth || null;
            var unitPrice = ispTempalteData.unitPrice || null;
            var minBandwidth = ispTempalteData.minBandwidth || null;
            // var freeStartTime = ispTempalteData.freeStartTime || null;
            // var freeEndTime  = ispTempalteData.freeEndTime || null;
            // var outZabName = ispTempalteData.outZabName || null;
            // var inZabName = ispTempalteData.inZabName || null;
            var rsNodeCorpDtos = ispTempalteData.rsNodeCorpDtos || null;
            var chargingType = ispTempalteData.chargingType || null;
            var buildBandwidth  = ispTempalteData.buildBandwidth || null;
            var freeBandwidth = ispTempalteData.freeBandwidth || null;
            var args = {
                "id": this.model ? this.model.get("id") : 0,
                "name": this.$el.find("#input-english").val().replace(/\s+/g, ""),
                "chName": this.$el.find("#input-name").val().replace(/\s+/g, ""),
                "operatorId": this.operatorId,
                "operatorName": this.operatorName,
                "liveLevel": this.liveLevel,
                "cacheLevel": this.cacheLevel,
                "remark": this.$el.find("#textarea-comment").val(),
                "startChargingTime": this.args.startChargingTime,
                //"chargingType": this.args.chargingType,

                "minBandwidth": minBandwidth,
                "maxBandwidth": maxBandwidth,
                "maxBandwidthThreshold": maxBandwidthThreshold,
                "minBandwidthThreshold": minBandwidthThreshold,
                "unitPrice": unitPrice,
                // "inZabName": inZabName,
                // "outZabName": outZabName,
                //"startChargingTime": startChargingTime,
                "chargingType": chargingType,
                "rsNodeCorpDtos": this.operatorId == 9 ? rsNodeCorpDtos : [],
                "cityId": this.cityId,
                "lon": this.$el.find('#input-longitude-latitude').val().split("----")[0],
                "lat": this.$el.find('#input-longitude-latitude').val().split("----")[1],
                //freeStartTime
                "freeStartTime":this.args.freeStartTime,
                "freeEndTime":this.args.freeEndTime,
                "buildBandwidth":buildBandwidth ,
                "freeBandwidth":freeBandwidth
            }
            if(args.cacheLevel === 0 && args.liveLevel === 0){
                alert("节点的直播或点播层级属性设置错误");
                return;
            }
            return args;
        },


        onGetOperatorSuccess: function(res) {
            var nameList = [];
            _.each(res.rows, function(el, index, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            });
            this.operatorList = nameList;
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), nameList, function(value) {
                this.operatorId = value;
                this.setIspTemplate();
            }.bind(this));
            if (this.isEdit || this.isChargeEdit) {
                this.$el.find("#dropdown-operator").attr("disabled","disabled");
                var defaultValue = _.find(nameList, function(object) {
                    return object.value === this.model.attributes.operatorId
                }.bind(this));

                if (defaultValue) {
                    this.$el.find(".dropdown-operator .cur-value").html(defaultValue.name)
                    this.operatorId = defaultValue.value;
                    this.operatorName = defaultValue.name;
                } else {
                    this.$el.find(".dropdown-operator .cur-value").html(nameList[0].name);
                    this.operatorId = nameList[0].value;
                    this.operatorName = nameList[0].name;
                }
            } else {
                this.$el.find(".dropdown-operator .cur-value").html(nameList[0].name);
                this.operatorId = nameList[0].value;
                this.operatorName = nameList[0].name;
            }
            //添加运营商模板
            this.setIspTemplate();
        },

        setIspTemplate: function() {
            var isEdit = this.isEdit;
            var operatorId = this.operatorId;
            var args = this.args;
            if (this.ispTemplate) {
                this.ispTemplate.destroy();
                this.ispTemplate = null;
            }

            if (operatorId == 9) {
                //加载运营商为多线的模板
                this.$el.find("#free-start-time1").hide()
                this.$el.find("#free-end-time1").hide()
                this.ispTemplate = new MultiwireTemplateView({
                    operatorList: this.operatorList,
                    isEdit: isEdit,
                    isChargeEdit:this.isChargeEdit,
                    args: args
                });
            } else {
                //加载单个运营商模板

                this.ispTemplate = new IspTemplateView({
                    operatorList: this.operatorList,
                    isEdit: isEdit,
                    isChargeEdit:this.isChargeEdit,
                    isSingle:true,
                    args: args
                });
            }

            this.ispTemplate.render(this.$el.find("#isp-template"));
        },

        initDropList: function(list) {
            this.initLiveLevelDropMenu();
            this.initCacheLevelDropMenu();
            this.collection.getAllContinent();
            this.collection.getAllProvince();
            //this.collection.getAllCity();
        },

        onGetAllContinent: function(list) {
            var nameList = [];
            _.each(list.rows, function(el, inx, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            Utility.initDropMenu(this.$el.find(".dropdown-continent"), nameList, function(value) {
                this.collection.getCountryByContinent({
                    id: value
                })
            }.bind(this));

            if (this.isEdit || this.isChargeEdit) {
                this.$el.find("#dropdown-continent").attr("disabled","disabled");
                this.$el.find(".dropdown-continent .cur-value").html(this.model.get("continentName"));
                this.collection.getCountryByContinent({
                        id: this.model.get("continentId")
                    })
                    //this.$el.find("#dropdown-continent").prop("disabled", true)
            } else {
                this.$el.find(".dropdown-continent .cur-value").html(nameList[0].name);
                this.collection.getCountryByContinent({
                    id: nameList[0].value
                })
            }
        },
        onGetAllProvince: function(list) {
            var nameList = [];
            _.each(list, function(el, inx, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-province').get(0),
                panelID: this.$el.find('#dropdown-province').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: nameList,
                callback: function(data) {
                    this.$el.find('#dropdown-province .cur-value').html(data.name);
                    this.collection.getAllCityAndBigArea({
                        provId: data.value
                    })
                }.bind(this)
            });

            if (this.isEdit || this.isChargeEdit) {
                this.$el.find("#dropdown-province").attr("disabled","disabled");
                this.$el.find(".dropdown-province .cur-value").html(this.model.get("provName") || nameList[0].name);
                this.collection.getAllCityAndBigArea({
                    provId: this.model.get("provId") || nameList[0].value
                })
            } else {
                this.$el.find("#dropdown-province .cur-value").html(nameList[0].name);
                this.collection.getAllCityAndBigArea({
                    provId: nameList[0].value
                })
            }
        },

        onGetAllCityAndBigArea: function(res) {
            var area = res.cityProvArea.name,
                list = res.list;
            var cityArray = [];
            if(list.length > 0){
                _.each(list, function(el, index, list) {
                    cityArray.push({
                        name: el.name,
                        value: el.id,
                        isDisplay: true
                    })
                }.bind(this))
                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.dropdown-city').get(0),
                    panelID: this.$el.find('#dropdown-city').get(0),
                    isSingle: true,
                    openSearch: true,
                    selectWidth: 200,
                    isDataVisible: true,
                    onOk: function() {},
                    data: cityArray,
                    callback: function(data) {
                        this.$el.find('#dropdown-city .cur-value').html(data.name);
                        this.$el.find('#input-longitude-latitude').val("查找中...");
                        this.$el.find('#dropdown-city').attr("disabled", "disabled");
                        this.collection.getLocation({
                            addr: data.name
                        });
                        this.cityId = data.value;
                    }.bind(this)
                });

                this.$el.find('#input-longitude-latitude').val("查找中...");
                this.$el.find('#dropdown-region .cur-value').html(area);
                if (this.isEdit || this.isChargeEdit) {
                    this.$el.find("#dropdown-region").attr("disabled","disabled");
                    this.$el.find("#dropdown-city").attr("disabled","disabled");
                    this.cityId = this.model.get("cityId") || cityArray[0].value;
                    this.$el.find('#dropdown-city .cur-value').html(this.model.get("cityName") || cityArray[0].name);
                    if (!this.model.get("lon") || !this.model.get("lat"))
                        this.collection.getLocation({
                            addr: this.model.get("cityName") || cityArray[0].name
                        });
                    else
                        this.$el.find('#input-longitude-latitude').val(this.model.get("lon") + "----" + this.model.get("lat"));
                } else {
                    this.collection.getLocation({
                        addr: cityArray[0].name
                    });
                    this.$el.find('#dropdown-city').attr("disabled", "disabled");
                    this.$el.find('#dropdown-city .cur-value').html(cityArray[0].name);
                    this.cityId = cityArray[0].value;
                }
            } else {
               return
            }
        },

        onGetCountryByContinent: function(res) {
            var nameList = [];
            _.each(res.rows, function(el, index, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            });
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-country').get(0),
                panelID: this.$el.find('#dropdown-country').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: nameList,
                callback: function(data) {
                    this.$el.find('#dropdown-country .cur-value').html(data.name);
                    this.collection.getOperationByCountry({
                        id: data.value
                    })
                }.bind(this)
            });
            if (this.isEdit || this.isChargeEdit) {
                this.$el.find("#dropdown-country").attr("disabled","disabled");
                this.$el.find(".dropdown-country .cur-value").html(this.model.get("countryName"));
                this.collection.getOperationByCountry({
                        id: this.model.get("countryId")
                    })
                    //this.$el.find("#dropdown-country").prop("disabled", true)
            } else {
                this.$el.find('#dropdown-country .cur-value').html(nameList[0].name);
                this.collection.getOperationByCountry({
                    id: nameList[0].value
                });
            }
        },

        onGetAllCity: function(res) {
            var cityArray = [];
            res = _.uniq(res);
            _.each(res, function(el, index, list) {
                cityArray.push({
                    name: el,
                    value: el,
                    isDisplay: false
                })
            }.bind(this))
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-city').get(0),
                panelID: this.$el.find('#dropdown-city').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: true,
                onOk: function() {},
                data: cityArray,
                callback: function(data) {
                    this.$el.find('#dropdown-city .cur-value').html(data.name);
                    this.$el.find('#input-longitude-latitude').val("查找中...");
                    this.$el.find('#dropdown-city').attr("disabled", "disabled");
                    this.collection.getLocation({
                        addr: data.value
                    })
                }.bind(this)
            });
            this.$el.find('#input-longitude-latitude').val("查找中...");
            this.$el.find('#dropdown-city').attr("disabled", "disabled");
            this.collection.getLocation({
                addr: "北京"
            })
        },

        onGetLocation: function(res) {
            if (typeof res !== "string" && res.status !== 200) {
                this.$el.find('#input-longitude-latitude').val("没有查到该城市的经纬度，请自己谷歌百度后填写！");
                this.$el.find('#input-longitude-latitude').removeAttr("readonly");
            } else {
                this.$el.find('#input-longitude-latitude').val(res);
                this.$el.find('#input-longitude-latitude').attr("readonly", true);
            }
            this.$el.find('#dropdown-city').removeAttr("disabled");
        },
        //免费带宽开始计费日期
        initFreeStartTime:function(){
            var startVal = null,
                endVal = null;
            if (this.args.freeStartTime)
                startVal = new Date(this.args.freeStartTime).format("yyyy/MM/dd");
            var startOption = {
                lang: 'ch',
                timepicker: false,
                scrollInput: false,
                format: 'Y/m/d',
                value: startVal,
                onChangeDateTime: function() {
                    this.args.freeStartTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#free-start-time").datetimepicker(startOption);
        },
        //免费带宽结束时间
        initFreeEndTime:function(){
            var startVal = null,
                endVal = null;
            if (this.args.freeEndTime)
                startVal = new Date(this.args.freeEndTime).format("yyyy/MM/dd");
            var startOption = {
                lang: 'ch',
                timepicker: false,
                scrollInput: false,
                format: 'Y/m/d',
                value: startVal,
                onChangeDateTime: function() {
                    this.args.freeEndTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#free-end-time").datetimepicker(startOption);
        },
        initChargeDatePicker: function() {
            var startVal = null,
                endVal = null;
            if (this.args.startChargingTime)
                startVal = new Date(this.args.startChargingTime).format("yyyy/MM/dd");
            var startOption = {
                lang: 'ch',
                timepicker: false,
                scrollInput: false,
                format: 'Y/m/d',
                value: startVal,
                onChangeDateTime: function() {
                    this.args.startChargingTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#input-start").datetimepicker(startOption);
        },

        onGetError: function(error) {
            if (error && error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        destroy: function() {
            //清除一些绑定什么的
            this.$el.find(".save").off("click");
            this.$el.find(".cancel").off("click");
            this.$el.remove();
        },

        hide: function() {
            this.destroy();
        },

        show: function() {
            this.target.show();
        },
        render: function(target) {
            this.target = target;
            this.$el.appendTo(target);
            this.show();
        }
    });

    return AddOrEditNodeView;
});