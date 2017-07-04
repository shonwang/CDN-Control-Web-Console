define("nodeManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var IspTemplateView = Backbone.View.extend({
        initialize:function(options){
            this.operatorList = options.operatorList;
            this.operatorListArrToObj();
            this.ispIndex = options.index;//编辑的时候，需要用到ispIndex
            this.model = options.model;
            var args = options.args || {};
            this.isEdit = options.isEdit || false;
            this.isMultiwire = options.isMultiwire || false;//是否是多线
            if (this.isEdit) {
                this.args = {
                    "index":this.ispIndex,
                    "isMultiwire":this.isMultiwire,
                    "operatorId":args.operatorId || 1,//运营商
                    "chargingType": args.chargingType || 1,//计费方式
                    "minBandwidth": args.minBandwidth || '',//保底带宽
                    "maxBandwidth": args.maxBandwidth || '',//上联带宽
                    "maxBandwidthThreshold":args.maxBandwidthThreshold || '',//上联带宽阈值
                    "minBandwidthThreshold":args.minBandwidthThreshold || '',//保低带宽阈值
                    "unitPrice": args.unitPrice || '',//成本权值
                    "inZabName": args.inZabName || '',//入口带宽zabbix名称
                    "outZabName": args.outZabName || '',//出口带宽zabbix名称
                    //"startChargingTime": args.startChargingTime || '',//开始计费日期
                    //"rsNodeCorpDtos":args.rsNodeCorpDtos  || ''                 //单项添加不需要此项
               }

            } else {
                this.args = {
                    "index":this.ispIndex || null,
                    "isMultiwire":this.isMultiwire,
                    "operatorId":1,//运营商
                    "chargingType": 1,//计费方式
                    "minBandwidth": '',//保底带宽
                    "maxBandwidth": '',//上联带宽
                    "maxBandwidthThreshold":'',//上联带宽阈值
                    "minBandwidthThreshold":'',//保低带宽阈值
                    "unitPrice": '',//成本权值
                    "inZabName": '',//入口带宽zabbix名称
                    "outZabName": '',//出口带宽zabbix名称
                    //"startChargingTime": '',//开始计费日期
                    //"rsNodeCorpDtos":[]//单项添加不需要此项
                };
            }
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.isp.html'])({data:this.args}));
            this.setDropDownList();
            //this.initChargeDatePicker();
            if(this.isMultiwire){
                this.setOperatorDorpDownList();
            }
        },

        setOperatorDorpDownList:function(){
            var operatorList = this.operatorList;
            Utility.initDropMenu(this.$el.find(".dropdown-ispList"), operatorList, function(value) {
                this.args.operatorId = parseInt(value);
            }.bind(this));
            if (this.isEdit) {
                var defaultValue = _.find(operatorList, function(object) {
                    return object.value === this.args.operatorId;
                }.bind(this));
                this.$el.find(".dropdown-ispList .cur-value").html(defaultValue.name)
            } else {
                this.$el.find(".dropdown-ispList .cur-value").html(operatorList[0].name)
            }    
        },

        operatorListArrToObj:function(){
            var arr = this.operatorList;
            var obj = {};
            for(var i=0;i<arr.length;i++){
                obj[arr[i]["value"]]=arr[i]["name"];
            }
            obj["9"] && delete obj["9"];
            this.operatorListObj = obj;
            this.reBuildOperatorList();
        },

        reBuildOperatorList:function(){
            var operatorListObj = this.operatorListObj;
            var arr=[];
            for(var item in operatorListObj){
                arr.push({
                    name:operatorListObj[item],
                    value:parseInt(item)
                });
            }
            this.operatorList = arr;
        },

        setDropDownList:function(){
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
                }
                // {name: "免费", value: 0}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-charging"), nameList, function(value) {
                this.args.chargingType = parseInt(value);
            }.bind(this));

            if (this.isEdit) {
                var defaultValue = _.find(nameList, function(object) {
                    return object.value === this.args.chargingType
                }.bind(this));
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
                    //this.args.startChargingTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#input-start").datetimepicker(startOption);
        },

        getArgs:function(){
            //var enName = this.$el.find("#input-english").val().replace(/\s+/g, ""),
                //chName = this.$el.find("#input-name").val().replace(/\s+/g, ""),
                var maxBandwidthThreshold = this.$el.find("#input-threshold").val(),//上联带宽阈值
                minBandwidthThreshold = this.$el.find("#input-minthreshold").val(),//保底带宽阈值
                maxBandwidth = this.$el.find("#input-maxbandwidth").val(),//上联带宽
                minBandwidth = this.$el.find("#input-minbandwidth").val(),//保底带宽
                unitPrice = this.$el.find("#input-unitprice").val(),//成本权值
                //longitudeLatitude = this.$el.find('#input-longitude-latitude').val(),
                outzabname = this.$el.find('#input-outzabname').val().replace(/\s+/g, ""),//出口带宽zabbix名称
                inzabname = this.$el.find("#input-inzabname").val().replace(/\s+/g, ""),//入口带宽zabbix名称
                re = /^\d+$/,
                outzabnameRe = /^[0-9A-Za-z\-\[\]\_]+$/,
                letterRe = /[A-Za-z]+/,
                reLocation = /^\d+(\.\d+)?----\d+(\.\d+)?$/;

            
            if (!re.test(maxBandwidth) || !re.test(minBandwidth)) {
                alert("上联带宽和保底带宽只能填入数字！");
                return false;
            }
            if (parseInt(maxBandwidth) > 100000000 || parseInt(maxBandwidth) < 0) {
                alert("上联带宽：0-100000000（0-100T，单位转换按1000算）");
                return false;
            }
            if (parseInt(minBandwidth) > 100000000 || parseInt(minBandwidth) < 0) {
                alert("保底带宽：0-100000000（0-100T，单位转换按1000算）");
                return false;
            }
            if (parseInt(maxBandwidth) < parseInt(minBandwidth)) {
                alert("上联带宽不能小于保底带宽！");
                return false;
            }
            if (!re.test(maxBandwidthThreshold) || !re.test(minBandwidthThreshold)) {
                alert("上联带宽阈值和保底带宽阈值只能填入数字！");
                return false;
            }
            if (parseInt(maxBandwidthThreshold) < 0 || parseInt(maxBandwidthThreshold) > parseInt(maxBandwidth)) {
                alert("上联带宽阈值：0-上联带宽");
                return false;
            }
            if (parseInt(minBandwidthThreshold) < 0 || parseInt(minBandwidthThreshold) > parseInt(maxBandwidth)) {
                alert("保底带宽阈值：0-上联带宽");
                return false;
            }
            if (!re.test(unitPrice)) {
                alert("成本权值只能填入数字！");
                return false;
            }
            if (parseInt(unitPrice) > 2147483647 || parseInt(unitPrice) < 0) {
                alert("成本权值不能小于0且大于长整型的最大值");
                return false;
            }
            if (!outzabnameRe.test(outzabname) || outzabname.indexOf("-") === -1 ||
                outzabname.indexOf("_") === -1 || outzabname.indexOf("[") === -1 ||
                outzabname.indexOf("]") === -1 || !letterRe.test(outzabname)) {
                alert("zabbix出口带宽英文、“-”、“_”、“[”、“]”为必填项，数字为可填项，即组合可包含数字，也可不包含数字");
                return false;
            }

            this.args.minBandwidth = minBandwidth;
            this.args.maxBandwidth = maxBandwidth;
            this.args.maxBandwidthThreshold = maxBandwidthThreshold;
            this.args.minBandwidthThreshold = minBandwidthThreshold;
            this.args.unitPrice = unitPrice;
            this.args.inZabName = inzabname;
            this.args.outZabName =outzabname;


            return this.args;
        },

        destroy:function(){
            this.$el.remove();
        },

        render:function(target){
            this.$el.appendTo(target);
        }
    });    


    var MultiwireTemplateView = Backbone.View.extend({
        initialize:function(options){
            this.operatorList = options.operatorList;
            this.operatorListArrToObj();
            var args = options.args;
            this.model = options.model;
            this.isEdit = options.isEdit || false;
            this.isMultiwire = true;
            if (this.isEdit) {
                this.args = {
                    isMultiwire : true,
                    "rsNodeCorpDtos":args.rsNodeCorpDtos || []//为了兼容老版库里没有数据的情况
                }
            } else {
                this.args = {
                    isMultiwire : true,
                    "rsNodeCorpDtos":[]
                };
            }
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.ispMultiwire.html'])({data:this.args}));   
            this.$el.find(".addIsp").on("click",$.proxy(this.onAddIspClick,this));
            this.setRsNodeCorpDtosList();
        },
        setRsNodeCorpDtosList:function(){
            var rsNodeCorpDtos = this.args.rsNodeCorpDtos;
            var obj = {};
            for(var i=0;i<rsNodeCorpDtos.length;i++){
                obj[i]=rsNodeCorpDtos[i];
            }
            this.rsNodeCorpDtosList = obj;
            this.setRsNodeCorpDtosTbody();
        },

        formatRsNodeCorpDtosList:function(){
            var rsNodeCorpDtosList = this.rsNodeCorpDtosList;
            var arr=[];
            for(var i in rsNodeCorpDtosList){
                arr.push(parseInt(i));
            }

            arr.sort(function(a,b){
                return a-b;
            });

            var newRsNodeCorpDtosList=[];
            for(var i=0;i<arr.length;i++){
                newRsNodeCorpDtosList.push(rsNodeCorpDtosList[arr[i]]);
            }

            var obj={};
            for(var i=0;i<newRsNodeCorpDtosList.length;i++){
                obj[i]=newRsNodeCorpDtosList[i];
            }
            this.rsNodeCorpDtosList = obj;
            this.totalRsNodeCorpDtosListLength=newRsNodeCorpDtosList.length;
            return newRsNodeCorpDtosList;
        },

        chargingNameList:{
            1: "95峰值",
            2: "包端口",
            3: "峰值",
            4: "第三峰",
        },

        setRsNodeCorpDtosTbody:function(){
            var chargingNameList = this.chargingNameList;
            var obj = this.formatRsNodeCorpDtosList();
            _.each(obj,function(item){
                item.chargingTypeName = chargingNameList[item.chargingType];
                item.operatorName = item.operatorId && this.operatorListObj[item.operatorId] || "---";
            }.bind(this));
            var rsNodeCorpDtosList = $(_.template(template['tpl/nodeManage/nodeManage.ispTbody.html'])({data:obj}));
            if(obj && obj.length==0){
                this.$el.find(".isp-table tbody").html('<tr><td colspan="11" class="text-center">请添加运营商信息!</td></tr>');
            }
            else{
                this.$el.find(".isp-table tbody").html(rsNodeCorpDtosList);
            }            
            rsNodeCorpDtosList.find(".rsNodeCorpDtos-modify").click($.proxy(this.toModify,this));
            rsNodeCorpDtosList.find(".rsNodeCorpDtos-delete").click($.proxy(this.toDelete,this));
        },

        toModify:function(event){
            var rsNodeCorpDtosList = this.formatRsNodeCorpDtosList();
            var eventTarget = event.srcElement || event.target;
            var id = parseInt($(eventTarget).attr("data-id"));
            var _data = rsNodeCorpDtosList[id];
            if (this.addIspPopup) $("#" + this.addIspPopup.modalId).remove();
            var ispTemplateView = new IspTemplateView({
                index:id,
                operatorList: this.operatorList,
                args:_data,
                isEdit:true,
                isMultiwire:true
            });
            var options = {
                title: "编辑运营商",
                body: ispTemplateView,
                backdrop: 'static',
                type: 2,
                width:800,
                height:800,
                bg:true,
                onOKCallback: function() {
                    var result = ispTemplateView.getArgs();
                    if(!result){
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

        toDelete:function(event){
            var target = event.target || event.srcElement;
            var id = $(target).attr("data-id");
            var rsNodeCorpDtosList=this.rsNodeCorpDtosList;
            delete rsNodeCorpDtosList[id];
            this.setRsNodeCorpDtosTbody();            
        },

        onAddIspClick:function(){

            var rsNodeCorpDtosList = this.formatRsNodeCorpDtosList();
            var index = rsNodeCorpDtosList.length;

            if (this.addIspPopup) $("#" + this.addIspPopup.modalId).remove();
            var ispTemplateView = new IspTemplateView({
                operatorList: this.operatorList,
                args:null,
                isEdit:false,
                isMultiwire:true
            });
            var options = {
                title: "添加运营商",
                body: ispTemplateView,
                backdrop: 'static',
                type: 2,
                width:800,
                height:800,
                bg:true,
                onOKCallback: function() {
                    var result = ispTemplateView.getArgs();
                    if(!result){
                        return false;
                    }
                    this.rsNodeCorpDtosList[index] = result;
                    this.setRsNodeCorpDtosTbody();
                    this.addIspPopup.$el.modal("hide");
                }.bind(this)
            }
            this.addIspPopup = new Modal(options);        
        },

        operatorListArrToObj:function(){
            var arr = this.operatorList;
            var obj = {};
            for(var i=0;i<arr.length;i++){
                obj[arr[i]["value"]]=arr[i]["name"];
            }
            obj["9"] && delete obj["9"];
            this.operatorListObj = obj;
            this.reBuildOperatorList();
        },

        reBuildOperatorList:function(){
            var operatorListObj = this.operatorListObj;
            var arr=[];
            for(var item in operatorListObj){
                arr.push({
                    name:operatorListObj[item],
                    value:parseInt(item)
                });
            }
            this.operatorList = arr;
        },

        destroy:function(){
            this.$el.remove();
        },

        getArgs:function(){
            this.args.rsNodeCorpDtos = this.formatRsNodeCorpDtosList();
            if(this.args.rsNodeCorpDtos.length == 0){
                alert("请添加运营商!");
                return false;
            }
            return this.args;
        },

        render:function(target){
            this.$el.appendTo(target);
        }
    });

    var NodeTips = Backbone.View.extend({
        initialize:function(options){
            this.type = options.type;//type=1:暂停操作 type=2 查看详情,不可编辑
            this.model = options.model;
            this.args = {
                opRemark:''
            };
            var obj={
                type:options.type,
                name:this.model.attributes.name || "---",
                chName:this.model.attributes.chName || "---",
                operator:this.model.attributes.operator || "---",
                updateTime:this.model.attributes.updateTimeFormated || "---",
                opRemark:this.model.attributes.opRemark || "---",
                placeHolder:options.placeHolder || "请输入暂停原因"
            };
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.tips.html'])({data:obj}));
            this.$el.find("#stop-reason").on("focus",$.proxy(this.onFocus,this));
        },
        
        onFocus:function(){
            this.$el.find("#stop-reason").css("-webkit-animation-name","");
            this.$el.find("#stop-reason").removeClass("error-tip-input");
        },

        getArgs:function(){
            var opRemark = this.$el.find("#stop-reason").val().trim();
            if(!opRemark){
                this.$el.find("#stop-reason").addClass("error-tip-input");
                this.$el.find("#stop-reason").css("-webkit-animation-name","error-tip-input");
                return false;
            }
            this.args.opRemark = opRemark;
            return this.args;
        },

        render:function(target){
            this.$el.appendTo(target);
        }
    });
    var DispGroupInfoView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;

            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.dispGroup.html'])({}));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.off("get.assocateDispGroups.success");
            this.collection.off("get.assocateDispGroups.error");
            this.collection.on("get.assocateDispGroups.success", $.proxy(this.onGetDispConfigSuccess, this));
            this.collection.on("get.assocateDispGroups.error", $.proxy(this.onGetError, this));

            this.collection.getAssocateDispGroups({
                nodeId: this.model.get("id")
            });
            this.initSearchTypeDropList();
        },

        initSearchTypeDropList: function() {
            var searchArray = [{
                    name: "按名称",
                    value: "1"
                }, {
                    name: "按备注",
                    value: "2"
                }],
                rootNode = this.$el.find(".disp-filter-drop");
            Utility.initDropMenu(rootNode, searchArray, function(value) {
                this.curSearchType = value;
                this.onKeyupDispListFilter();
            }.bind(this));
            this.curSearchType = "1";
        },

        onKeyupDispListFilter: function() {
            if (!this.channelList || this.channelList.length === 0) return;
            var keyWord = this.$el.find("#disp-filter").val();

            _.each(this.channelList, function(model, index, list) {
                if (keyWord === "") {
                    model.isDisplay = true;
                } else if (this.curSearchType == "1") {
                    if (model.dispDomain.indexOf(keyWord) > -1)
                        model.isDisplay = true;
                    else
                        model.isDisplay = false;
                } else if (this.curSearchType == "2") {
                    if (model.remark.indexOf(keyWord) > -1)
                        model.isDisplay = true;
                    else
                        model.isDisplay = false;
                }
            }.bind(this));
            this.initTable();
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetDispConfigSuccess: function(res) {
            this.channelList = res;
            var count = 0;
            this.isCheckedAll = false;
            _.each(this.channelList, function(el, index, list) {
                if (el.associated === 0) el.isChecked = false;
                if (el.associated === 1) {
                    el.isChecked = true;
                    count = count + 1
                }
                el.isDisplay = true;
                if (el.status === 0) el.statusName = '<span class="label label-danger">已停止</span>';
                if (el.status === 1) el.statusName = '<span class="label label-success">运行中</span>';
                if (el.isInserive === 0) el.isInseriveName = '<span class="label label-danger">未服务</span>';
                if (el.isInserive === 1) el.isInseriveName = '<span class="label label-success">服务中</span>';
                if (el.priority == 1) el.priorityName = '成本优先';
                if (el.priority == 2) el.priorityName = '质量优先';
                if (el.priority == 3) el.priorityName = '兼顾成本与质量';
            }.bind(this))

            if (count === this.channelList.length) this.isCheckedAll = true
            this.initTable();
            this.$el.find("#disp-filter").val("")
            this.$el.find("#disp-filter").off("keyup");
            this.$el.find("#disp-filter").on("keyup", $.proxy(this.onKeyupDispListFilter, this));
        },

        initTable: function() {
            this.table = $(_.template(template['tpl/nodeManage/nodeManage.dispGroup.table.html'])({
                data: this.channelList,
                isCheckedAll: this.isCheckedAll
            }));
            if (this.channelList.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            this.table.find("tbody .remark").tooltip({
                animation: false,
                "placement": "top",
                "html": true,
                "title": function() {
                    return $(this).attr("remark")
                },
                "trigger": "hover"
            })
        },

        onItemCheckedUpdated: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var selectedObj = _.find(this.channelList, function(object) {
                return object.dispId === parseInt(id)
            }.bind(this));

            selectedObj.isChecked = eventTarget.checked

            var checkedList = this.channelList.filter(function(object) {
                return object.isChecked === true;
            })
            if (checkedList.length === this.channelList.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.channelList.length)
                this.table.find("thead input").get(0).checked = false;
        },

        onAllCheckedUpdated: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.table.find("tbody tr").find("input").each(function(index, node) {
                if (!$(node).prop("disabled")) {
                    $(node).prop("checked", eventTarget.checked);
                    this.channelList[index].isChecked = eventTarget.checked
                }
            }.bind(this))
        },

        getArgs: function() {
            var checkedList = this.channelList.filter(function(object) {
                return object.isChecked === true;
            })
            if (checkedList.length === 0) return false;
            _.each(checkedList, function(el, inx, list) {
                el.associated = el.isChecked ? 1 : 0;
                delete el.priorityName
                delete el.statusName
                delete el.isInseriveName
            }.bind(this))
            return checkedList
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
                    "inZabName": this.model.get("inZabName"),
                    "outZabName": this.model.get("outZabName"),
                    "remark": this.model.get("remark"),
                    "operatorId": this.model.get("operatorId"),
                    "operatorName": this.model.get("operatorName"),
                    "startChargingTime": this.model.get("startChargingTime"),
                    "rsNodeCorpDtos":this.model.get("rsNodeCorpDtos")
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
                    "inZabName": "",
                    "outZabName": "",
                    "remark": "",
                    "operatorId": "",
                    "operatorName": "",
                    "startChargingTime": new Date().valueOf(),
                    "rsNodeCorpDtos":[]
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
            this.collection.on("get.location.error", $.proxy(this.onGetLocation, this));

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

            this.$el.find(".save").on("click",$.proxy(this.onSaveClick,this));
            this.$el.find(".cancel").on("click",$.proxy(this.onCancelClick,this));

            this.initDropList(options.list);
            this.initChargeDatePicker();
        },

        onSaveClick:function(){
            var args = this.getArgs();
            if(!args){
                return false;
            }
            this.onOKCallback && this.onOKCallback();
            this.hide();
            this.showParentList();
        },

        onCancelClick:function(){
            this.destroy();
            this.showParentList();
        },

        getArgs: function() {
            var enName = this.$el.find("#input-english").val().replace(/\s+/g, ""),
                chName = this.$el.find("#input-name").val().replace(/\s+/g, ""),
                //maxBandwidthThreshold = this.$el.find("#input-threshold").val(),
                //minBandwidthThreshold = this.$el.find("#input-minthreshold").val(),
                //maxBandwidth = this.$el.find("#input-maxbandwidth").val(),
                //minBandwidth = this.$el.find("#input-minbandwidth").val(),
                //unitPrice = this.$el.find("#input-unitprice").val(),
                longitudeLatitude = this.$el.find('#input-longitude-latitude').val(),
                //outzabname = this.$el.find('#input-outzabname').val().replace(/\s+/g, ""),
                //inzabname = this.$el.find("#input-inzabname").val().replace(/\s+/g, ""),
                re = /^\d+$/,
                outzabnameRe = /^[0-9A-Za-z\-\[\]\_]+$/,
                letterRe = /[A-Za-z]+/,
                reLocation = /^\d+(\.\d+)?----\d+(\.\d+)?$/;
            if (!reLocation.test(longitudeLatitude)) {
                alert("需要填写正确的经纬度，否则该节点无法在地图中展示！比如：108.953098----34.2778");
                return
            }
            if (!enName || !chName) {
                alert("节点名称和英文名称都要填写！");
                return;
            }
            /*
            if (!re.test(maxBandwidth) || !re.test(minBandwidth)) {
                alert("上联带宽和保底带宽只能填入数字！");
                return;
            }
            if (parseInt(maxBandwidth) > 100000000 || parseInt(maxBandwidth) < 0) {
                alert("上联带宽：0-100000000（0-100T，单位转换按1000算）");
                return;
            }
            if (parseInt(minBandwidth) > 100000000 || parseInt(minBandwidth) < 0) {
                alert("保底带宽：0-100000000（0-100T，单位转换按1000算）");
                return;
            }
            if (parseInt(maxBandwidth) < parseInt(minBandwidth)) {
                alert("上联带宽不能小于保底带宽！");
                return;
            }
            if (!re.test(maxBandwidthThreshold) || !re.test(minBandwidthThreshold)) {
                alert("上联带宽阈值和保底带宽阈值只能填入数字！");
                return;
            }
            if (parseInt(maxBandwidthThreshold) < 0 || parseInt(maxBandwidthThreshold) > parseInt(maxBandwidth)) {
                alert("上联带宽阈值：0-上联带宽");
                return;
            }
            if (parseInt(minBandwidthThreshold) < 0 || parseInt(minBandwidthThreshold) > parseInt(maxBandwidth)) {
                alert("保底带宽阈值：0-上联带宽");
                return;
            }
            if (!re.test(unitPrice)) {
                alert("成本权值只能填入数字！");
                return;
            }
            if (parseInt(unitPrice) > 2147483647 || parseInt(unitPrice) < 0) {
                alert("成本权值不能小于0且大于长整型的最大值");
                return;
            }
            
            if (!outzabnameRe.test(outzabname) || outzabname.indexOf("-") === -1 ||
                outzabname.indexOf("_") === -1 || outzabname.indexOf("[") === -1 ||
                outzabname.indexOf("]") === -1 || !letterRe.test(outzabname)) {
                alert("zabbix出口带宽英文、“-”、“_”、“[”、“]”为必填项，数字为可填项，即组合可包含数字，也可不包含数字");
                return;
            }
            */
            var ispTempalteData = this.ispTemplate.getArgs();
            if(!ispTempalteData){
                return false;
            }
            var maxBandwidthThreshold = ispTempalteData.maxBandwidthThreshold || null;
            var minBandwidthThreshold = ispTempalteData.minBandwidthThreshold || null;
            var maxBandwidth = ispTempalteData.maxBandwidth || null;
            var minBandwidth = ispTempalteData.minBandwidth || null;
            var unitPrice = ispTempalteData.unitPrice || null;
            var outZabName = ispTempalteData.outZabName || null;
            var inZabName = ispTempalteData.inZabName || null;
            var rsNodeCorpDtos = ispTempalteData.rsNodeCorpDtos || null;
            var startChargingTime = ispTempalteData.startChargingTime || null;
            var chargingType = ispTempalteData.chargingType || null;
            var args = {
                "id": this.model ? this.model.get("id") : 0,
                "name": this.$el.find("#input-english").val().replace(/\s+/g, ""),
                "chName": this.$el.find("#input-name").val().replace(/\s+/g, ""),
                "operatorId": this.operatorId,
                "operatorName": this.operatorName,
                //"minBandwidth": this.$el.find("#input-minbandwidth").val(),
                //"maxBandwidth": this.$el.find("#input-maxbandwidth").val(),
                //"maxBandwidthThreshold": this.$el.find("#input-threshold").val(),
                //"minBandwidthThreshold": this.$el.find("#input-minthreshold").val(),
               // "unitPrice": this.$el.find("#input-unitprice").val(),
                //"inZabName": this.$el.find("#input-inzabname").val().replace(/\s+/g, ""),
                //"outZabName": this.$el.find("#input-outzabname").val().replace(/\s+/g, ""),
                "remark": this.$el.find("#textarea-comment").val(),
                "startChargingTime": this.args.startChargingTime,
                //"chargingType": this.args.chargingType,

                "minBandwidth":minBandwidth,
                "maxBandwidth":maxBandwidth,
                "maxBandwidthThreshold": maxBandwidthThreshold,
                "minBandwidthThreshold": minBandwidthThreshold,
                "unitPrice": unitPrice,
                "inZabName":inZabName ,
                "outZabName":outZabName,
                //"startChargingTime": startChargingTime,
                "chargingType":chargingType,
                "rsNodeCorpDtos":this.operatorId == 9 ? rsNodeCorpDtos : [],
                "cityId": this.cityId,
                "lon": this.$el.find('#input-longitude-latitude').val().split("----")[0],
                "lat": this.$el.find('#input-longitude-latitude').val().split("----")[1]
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
            if (this.isEdit) {
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

        setIspTemplate:function(){
            var isEdit = this.isEdit;
            var operatorId = this.operatorId;
            var args = this.args;
            if(this.ispTemplate){
                this.ispTemplate.destroy();
                this.ispTemplate = null;
            }
            
            if(operatorId==9){
                //加载运营商为多线的模板
                this.ispTemplate = new MultiwireTemplateView({
                    operatorList:this.operatorList,
                    isEdit:isEdit,
                    args:args
                });
            }
            else{
                //加载单个运营商模板
                this.ispTemplate = new IspTemplateView({
                    operatorList:this.operatorList,
                    isEdit:isEdit,
                    args:args
                });
            }

            this.ispTemplate.render(this.$el.find("#isp-template"));
        },

        initDropList: function(list) {
            /*
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
                }
                // {name: "免费", value: 0}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-charging"), nameList, function(value) {
                this.args.chargingType = parseInt(value);
            }.bind(this));

            if (this.isEdit) {
                var defaultValue = _.find(nameList, function(object) {
                    return object.value === this.model.attributes.chargingType
                }.bind(this));
                this.$el.find(".dropdown-charging .cur-value").html(defaultValue.name)
            } else {
                this.$el.find(".dropdown-charging .cur-value").html(nameList[0].name)
            }
            */
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

            if (this.isEdit) {
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

            if (this.isEdit) {
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
            if (this.isEdit) {
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
            if (this.isEdit) {
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
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },
        
        destroy:function(){
            //清除一些绑定什么的
            this.$el.find(".save").off("click");
            this.$el.find(".cancel").off("click");
            this.$el.remove();
        },

        hide:function(){
            this.destroy();
        },

        show:function(){
            this.target.show();
        },
        render: function(target) {
            this.target = target;
            this.$el.appendTo(target);
            this.show();
        }
    });

    var NodeManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;

            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.html'])());

            this.initNodeDropMenu();

            this.collection.on("get.node.success", $.proxy(this.onNodeListSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            this.collection.on("add.node.success", function() {
                alert("添加成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.node.error", $.proxy(this.onGetError, this));
            this.collection.on("update.node.success", function() {
                alert("编辑成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.node.error", $.proxy(this.onGetError, this));
            this.collection.on("delete.node.success", function() {
                alert("删除成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("delete.node.error", $.proxy(this.onGetError, this));
            this.collection.on("update.node.status.success", function() {
                alert("操作成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.node.status.error", $.proxy(this.onGetError, this));
            this.collection.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));

            this.collection.on("operate.node.success", $.proxy(this.onOperateNodeSuccess, this));
            this.collection.on("operate.node.error", function(res) {
                this.disablePopup && this.disablePopup.$el.modal('hide');
                this.onGetError(res)
            }.bind(this));

            this.collection.on("add.assocateDispGroups.success", function() {
                alert("操作成功！")
            }.bind(this));
            this.collection.on("add.assocateDispGroups.error", $.proxy(this.onGetError, this));

            if (AUTH_OBJ.CreateNode)
                this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
            else
                this.$el.find(".opt-ctn .create").remove();
            if (AUTH_OBJ.QueryNode) {
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                this.enterKeyBindQuery();
            } else {
                this.$el.find(".opt-ctn .query").remove();
            }
            if (AUTH_OBJ.EnableorPauseNode)
                this.$el.find(".opt-ctn .multi-play").on("click", $.proxy(this.onClickMultiPlay, this));
            else
                this.$el.find(".opt-ctn .multi-play").remove();
            this.$el.find(".opt-ctn .multi-stop").on("click", $.proxy(this.onClickMultiStop, this));
            this.$el.find(".opt-ctn .multi-delete").on("click", $.proxy(this.onClickMultiDelete, this));

            this.queryArgs = {
                "page": 1,
                "count": 10,
                "chname": null, //节点名称
                "operator": null, //运营商id
                "status": null //节点状态
            }
            this.onClickQueryButton();
        },

        enterKeyBindQuery: function() {
            $(document).on('keydown', function(e) {
                if (e.keyCode == 13) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onNodeListSuccess: function() {
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function() {
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.chname = this.$el.find("#input-name").val().trim() || null;
            this.collection.getNodeList(this.queryArgs);
        },

        /*onClickCreate: function() {
            if (this.addNodePopup) $("#" + this.addNodePopup.modalId).remove();

            var addNodeView = new AddOrEditNodeView({
                collection: this.collection,
                list: this.operatorList
            });
            var options = {
                title: "添加节点",
                body: addNodeView,
                backdrop: 'static',
                type: 2,
                onOKCallback: function() {
                    var options = addNodeView.getArgs();
                    if (!options) return;
                    this.collection.addNode(options)
                    this.addNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function() {
                    if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.addNodePopup = new Modal(options);
            if (!AUTH_OBJ.ApplyCreateNode) this.addNodePopup.$el.find(".modal-footer .btn-primary").remove();
        },*/

        onClickCreate: function() {
            this.hideList();
            if(this.addNodeView){
                this.addNodeView.destroy();
                this.addNodeView = null;
            }
            this.addNodeView = new AddOrEditNodeView({
                collection: this.collection,
                operatorList:this.operatorList,
                showList:function(){
                    this.showList();
                }.bind(this),
                onHiddenCallback:function(){
                    this.showList();
                    if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                }.bind(this),
                onOKCallback:function(){
                    var options = this.addNodeView.getArgs();
                    if (!options) return;
                    this.collection.addNode(options);
                    this.showList();
                    if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                }.bind(this)
            });
            this.addNodeView.render(this.$el.find(".node-manage-add-edit-pannel"));
            if (!AUTH_OBJ.ApplyCreateNode) addNodeView.$el.find(".btn-primary").remove();

        },
         
        showList:function(){
            this.$el.find(".node-manage-list-pannel").show();
        },
        
        hideList:function(){
            this.$el.find(".node-manage-list-pannel").hide();
        },

        nameList : {
            1: "95峰值",
            2: "包端口",
            3: "峰值",
            4: "第三峰"
        },

        initTable: function() {
            var nameList = this.nameList;
            this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");
            _.each(this.collection.models,function(item){
                var _rsNodeCorpDtos = item.attributes.rsNodeCorpDtos && item.attributes.rsNodeCorpDtos.length > 0 && item.attributes.rsNodeCorpDtos || null;
                if(_rsNodeCorpDtos){
                    _.each(_rsNodeCorpDtos,function(i){
                        i.chargingTypeName = nameList[i.chargingType];
                    })
                }
            })
            console.log(this.collection.models);
            this.table = $(_.template(template['tpl/nodeManage/nodeManage.table.html'])({
                data: this.collection.models,
                permission: AUTH_OBJ
            }));
            if (this.collection.models.length !== 0) {
                this.$el.find(".table-ctn").html(this.table[0]);
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .node-name").on("click", $.proxy(this.onClickItemNodeName, this));
                if (AUTH_OBJ.DeleteNode)
                    this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                else
                    this.table.find("tbody .delete").remove();
                this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
                this.table.find("tbody .hangup").on("click", $.proxy(this.onClickItemHangup, this));
                this.table.find("tbody .operateDetail").on("click", $.proxy(this.onClickDetail, this));
                this.table.find("tbody .stop").on("click", $.proxy(this.onClickItemStop, this));
                this.table.find("tbody .disp-info").on("click", $.proxy(this.onClickDispGroupInfo, this));

                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickDispGroupInfo: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.dispGroupPopup) $("#" + this.dispGroupPopup.modalId).remove();

            var dispGroupInfoView = new DispGroupInfoView({
                collection: this.collection,
                model: model,
                isEdit: true
            });
            var options = {
                title: model.get("chName") + "关联调度组信息",
                body: dispGroupInfoView,
                backdrop: 'static',
                type: 2,
                width: 800,
                height: 500,
                onOKCallback: function() {
                    var options = dispGroupInfoView.getArgs();
                    if (!options) return;
                    this.collection.addAssocateDispGroups(options, model.get("id"))
                    this.dispGroupPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function() {
                    this.enterKeyBindQuery();
                }.bind(this)
            }
            this.dispGroupPopup = new Modal(options);
            if (!AUTH_OBJ.NodeAssociatetoGslbGroup)
                this.dispGroupPopup.$el.find(".btn-primary").remove();
        },

        onClickItemNodeName: function(event) {
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id"),
                model = this.collection.get(id),
                args = {
                    nodeId: id,
                    chName: model.get("chName")
                }
            window.location.hash = "#/deviceManage/" + JSON.stringify(args)
        },
        /*
        onClickItemEdit: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.editNodePopup) $("#" + this.editNodePopup.modalId).remove();

            var editNodeView = new AddOrEditNodeView({
                collection: this.collection,
                model: model,
                isEdit: true,
                list: this.operatorList
            });
            var options = {
                title: "编辑节点",
                body: editNodeView,
                backdrop: 'static',
                type: 2,
                onOKCallback: function() {
                    var options = editNodeView.getArgs();
                    if (!options) return;
                    var args = _.extend(model.attributes, options)
                    this.collection.updateNode(args)
                    this.editNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function() {
                    if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.editNodePopup = new Modal(options);
            if (!AUTH_OBJ.ApplyEditNode)
                this.editNodePopup.$el.find(".modal-footer .btn-primary").remove();
        },*/

        onClickItemEdit: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);


            this.hideList();
            if(this.editNodeView){
                this.editNodeView.destroy();
                this.editNodeView = null;
            }
            this.editNodeView = new AddOrEditNodeView({
                collection: this.collection,
                model:model,
                isEdit:true,
                operatorList:this.operatorList,
                showList:function(){
                    //show当前列表
                    this.showList();
                }.bind(this),
                onHiddenCallback:function(){
                    this.showList();
                    if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                }.bind(this),
                onOKCallback:function(){
                    var options = this.editNodeView.getArgs();
                    if (!options) return;
                    this.collection.updateNode(options);
                    this.showList();
                    if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                }.bind(this)
            });
            this.editNodeView.render(this.$el.find(".node-manage-add-edit-pannel"));
            if (!AUTH_OBJ.ApplyCreateNode) this.editNodeView.$el.find(".btn-primary").remove();
        },

        onClickItemDelete: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);


            if (this.deleteNodeTipsPopup) $("#" + this.deleteNodeTipsPopup.modalId).remove();
            var deleteNodeTips = new NodeTips({
                type:1,
                model:model,
                placeHolder:"请输入删除的原因,并请您谨慎操作，一旦删除，不可恢复"
            });
            var options = {
                title: "你确定要删除节点<span class='text-danger'>" + model.attributes.name + "</span>吗？删除后将不可恢复, 请谨慎操作！",
                body: deleteNodeTips,
                backdrop: 'static',
                type: 2,
                onOKCallback: function() {
                    var options = deleteNodeTips.getArgs();
                    if (!options) return;
                    this.collection.deleteNode({
                        id: parseInt(id),
                        opRemark:options.opRemark
                    })
                    this.deleteNodeTipsPopup.$el.modal("hide");                 
                }.bind(this)
            }
            this.deleteNodeTipsPopup = new Modal(options);
            /*
            return false;
            if (this.confirmDelete) $("#" + this.confirmDelete.modalId).remove();
            var opt = {
                message: "你确定要删除节点<span class='text-danger'>" + model.attributes.name + "</span>吗？删除后将不可恢复, 请谨慎操作！",
                type: "alert-info"
            }
            var options = {
                title: "提示",
                body: _.template(template['tpl/alert.message.html'])({
                    data: opt
                }),
                backdrop: 'static',
                type: 2,
                onOKCallback: function() {
                    this.confirmDelete.$el.modal("hide");
                    var result = confirm("你真的确定要删除节点" + model.attributes.name + "吗？");
                    if (!result) return;
                    this.collection.deleteNode({
                        id: parseInt(id)
                    })
                }.bind(this),
                onHiddenCallback: function() {}.bind(this)
            }
            this.confirmDelete = new Modal(options);
            */
        },

        onClickItemPlay: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            //this.collection.updateNodeStatus({ids:[parseInt(id)], status:1})
            this.collection.operateNode({
                opRemark:'',
                nodeId: id,
                operator: 1,
                t: new Date().valueOf()
            })
        },

        onClickMultiPlay: function(event) {
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list) {
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            this.collection.updateNodeStatus({
                ids: ids,
                status: 1
            })
        },

        onClickItemHangup: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var result = confirm("你确定要挂起节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({
                ids: [parseInt(id)],
                status: 2
            })
        },

    
        onClickDetail:function(event){
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            if (this.detailTipsPopup) $("#" + this.detailTipsPopup.modalId).remove();
            var detailTipsView = new NodeTips({
                type:2,
                model:model
            });
            var options = {
                title: "操作说明",
                body: detailTipsView,
                backdrop: 'static',
                type: 1,
                onHiddenCallback: function() {
                    
                }.bind(this)
            }
            this.nodeTipsPopup = new Modal(options);
            
        },

        onClickItemStop: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);
            if (this.nodeTipsPopup) $("#" + this.nodeTipsPopup.modalId).remove();

            var stopNodeView = new NodeTips({
                type:1,
                model:model
            });
            var options = {
                title: "暂停节点操作",
                body: stopNodeView,
                backdrop: 'static',
                type: 2,
                onOKCallback: function() {
                    var options = stopNodeView.getArgs();
                    if (!options) return;
                    this.currentPauseNodeId = id;
                    this.collection.operateNode({
                        opRemark:options.opRemark,
                        nodeId: id,
                        operator: -1,
                        t: new Date().valueOf()
                    })
                    this.nodeTipsPopup.$el.modal("hide");
                    this.showDisablePopup("服务端正在努力暂停中...")
                }.bind(this),
                onHiddenCallback: function() {
                    
                }.bind(this)
            }
            this.nodeTipsPopup = new Modal(options);
            /*

            

            var result = confirm("你确定要暂停节点吗？")
            if (!result) return

            this.currentPauseNodeId = id;
            this.collection.operateNode({
                nodeId: id,
                operator: -1,
                t: new Date().valueOf()
            })
            this.showDisablePopup("服务端正在努力暂停中...")*/
                // require(["dispSuggesttion.view", "dispSuggesttion.model"], function(DispSuggesttionViews, DispSuggesttionModel){
                //     this.onRequireDispSuggesttionModule(DispSuggesttionViews, DispSuggesttionModel, id)
                // }.bind(this))        
        },

        onOperateNodeSuccess: function(res) {
            this.disablePopup && this.disablePopup.$el.modal('hide');
            if (res.msg == "1" && res.status === 200) {
                alert("操作成功！")
                this.onClickQueryButton();
            } else if (res.msg == "-1" && res.status === 200) {
                require(["dispSuggesttion.view", "dispSuggesttion.model"], function(DispSuggesttionViews, DispSuggesttionModel) {
                    this.onRequireDispSuggesttionModule(DispSuggesttionViews, DispSuggesttionModel, this.currentPauseNodeId)
                }.bind(this))
            } else {
                alert("操作失败！")
                this.onClickQueryButton();
            }
        },

        onRequireDispSuggesttionModule: function(DispSuggesttionViews, DispSuggesttionModel, nodeId) { //
            if (!this.dispSuggesttionFailModel)
                this.dispSuggesttionFailModel = new DispSuggesttionModel();
            this.hide();
            var options = {
                nodeId: nodeId,
                collection: this.dispSuggesttionFailModel,
                backCallback: $.proxy(this.backFromDispSuggesttion, this)
            };
            this.dispSuggesttionView = new DispSuggesttionViews.DispSuggesttionView(options);
            this.dispSuggesttionView.render($('.ksc-content'));
        },

        backFromDispSuggesttion: function() {
            this.dispSuggesttionView.remove();
            this.dispSuggesttionView = null;
            this.dispSuggesttionFailModel = null;
            this.update();
        },

        onClickMultiStop: function(event) {
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list) {
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            var result = confirm("你确定要批量关闭选择的节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({
                ids: ids,
                status: 3
            })
        },

        onClickMultiDelete: function(event) {
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list) {
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            var result = confirm("你确定要批量删除选择的节点吗？")
            if (!result) return
            alert(ids.join(",") + "。接口不支持，臣妾做不到啊！");
        },

        initPaginator: function() {
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total / this.queryArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function(num, type) {
                    if (type !== "init") {
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.count;
                        this.collection.getNodeList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function() {
            var statusArray = [{
                    name: "全部",
                    value: "All"
                }, {
                    name: "运行",
                    value: 1
                }, {
                    name: "挂起",
                    value: 2
                }, {
                    name: "暂停",
                    value: 4
                },{
                    name: "关闭",
                    value: 3
                }],
                rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value) {
                if (value !== "All")
                    this.queryArgs.status = parseInt(value);
                else
                    this.queryArgs.status = null;
            }.bind(this));

            var pageNum = [{
                name: "10条",
                value: 10
            }, {
                name: "20条",
                value: 20
            }, {
                name: "50条",
                value: 50
            }, {
                name: "100条",
                value: 100
            }]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value) {
                this.queryArgs.count = value;
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));

            this.collection.getOperatorList();
        },

        onGetOperatorSuccess: function(res) {
            this.operatorList = res.rows;
            var nameList = [{
                name: "全部",
                value: "All"
            }];
            _.each(res.rows, function(el, index, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), nameList, function(value) {
                if (value !== "All")
                    this.queryArgs.operator = parseInt(value)
                else
                    this.queryArgs.operator = null;
            }.bind(this));
        },

        onItemCheckedUpdated: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");
            var model = this.collection.get(id);
            model.set("isChecked", eventTarget.checked)

            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            if (checkedList.length === this.collection.models.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.collection.models.length)
                this.table.find("thead input").get(0).checked = false;
            if (checkedList.length === 0) {
                this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");
            } else {
                this.$el.find(".opt-ctn .multi-delete").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").removeAttr("disabled", "disabled");
            }
        },

        onAllCheckedUpdated: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model) {
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
            if (eventTarget.checked) {
                this.$el.find(".opt-ctn .multi-delete").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            }
        },

        showDisablePopup: function(msg) {
            if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
            var options = {
                title: "警告",
                body: '<div class="alert alert-danger"><strong>' + msg + '</strong></div>',
                backdrop: 'static',
                type: 0,
            }
            this.disablePopup = new Modal(options);
            this.disablePopup.$el.find(".close").remove();
        },

        hide: function() {
            if (this.dispSuggesttionView) {
                this.dispSuggesttionView.remove();
                this.dispSuggesttionView = null;
                this.dispSuggesttionFailModel = null;
            }
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function() {
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(this.target);
        },

        render: function(target) {
            this.$el.appendTo(target)
            this.target = target
        }
    });

    return NodeManageView;
});