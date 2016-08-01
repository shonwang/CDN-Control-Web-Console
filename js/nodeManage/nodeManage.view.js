define("nodeManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DispGroupInfoView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.dispGroup.html'])({}));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.off("get.assocateDispGroups.success");
            this.collection.off("get.assocateDispGroups.error");
            this.collection.on("get.assocateDispGroups.success", $.proxy(this.onGetDispConfigSuccess, this));
            this.collection.on("get.assocateDispGroups.error", $.proxy(this.onGetError, this));

            this.collection.getAssocateDispGroups({nodeId: this.model.get("id")});
            this.initSearchTypeDropList();
        },

        initSearchTypeDropList: function(){
            var searchArray = [
                {name: "按名称", value: "1"},
                {name: "按备注", value: "2"}
            ],
            rootNode = this.$el.find(".disp-filter-drop");
            Utility.initDropMenu(rootNode, searchArray, function(value){
                this.curSearchType = value;
                this.onKeyupDispListFilter();
            }.bind(this));
            this.curSearchType = "1";
        },

        onKeyupDispListFilter: function() {
            if (!this.channelList || this.channelList.length === 0) return;
            var keyWord = this.$el.find("#disp-filter").val();
                        
            _.each(this.channelList, function(model, index, list) {
                if (keyWord === ""){
                    model.isDisplay = true;
                } else if (this.curSearchType == "1"){
                    if (model.dispDomain.indexOf(keyWord) > -1)
                        model.isDisplay = true;
                    else
                        model.isDisplay = false;
                } else if (this.curSearchType == "2"){
                    if (model.remark.indexOf(keyWord) > -1)
                        model.isDisplay = true;
                    else
                        model.isDisplay = false;
                }
            }.bind(this));
            this.initTable();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetDispConfigSuccess: function(res){
            this.channelList = res;
            var count = 0; this.isCheckedAll = false;
            _.each(this.channelList, function(el, index, list){
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

        initTable: function(){
            this.table = $(_.template(template['tpl/nodeManage/nodeManage.dispGroup.table.html'])({data: this.channelList, isCheckedAll: this.isCheckedAll}));
            if (this.channelList.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            this.table.find("tbody .remark").tooltip({
                animation  : false,
                "placement": "top", 
                "html"     : true,
                "title"  : function(){return $(this).attr("remark")}, 
                "trigger"  : "hover"
            })
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var selectedObj = _.find(this.channelList, function(object){
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

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.table.find("tbody tr").find("input").each(function(index, node){
                if (!$(node).prop("disabled")){
                    $(node).prop("checked", eventTarget.checked);
                    this.channelList[index].isChecked = eventTarget.checked
                }
            }.bind(this))
        },

        getArgs: function(){
            var checkedList = this.channelList.filter(function(object) {
                return object.isChecked === true;
            })
            if (checkedList.length === 0) return false;
            _.each(checkedList, function(el, inx, list){
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
            this.isEdit     = options.isEdit;
            this.model      = options.model;

            if (this.isEdit){
                this.args = {
                    "id"                 : this.model.get("id"),
                    "name"               : this.model.get("name"),
                    "chName"             : this.model.get("chName"),
                    //"ChargingRegion"     : this.model.get("ChargingRegion"),
                    "operator"           : this.model.get("operator"),
                    "chargingType"       : this.model.get("chargingType"),
                    "minBandwidth"       : this.model.get("minBandwidth"),
                    "maxBandwidth"       : this.model.get("maxBandwidth"),
                    "maxBandwidthThreshold" : this.model.get("maxBandwidthThreshold"),
                    "minBandwidthThreshold" : this.model.get("minBandwidthThreshold"),
                    "unitPrice"          : this.model.get("unitPrice"),
                    "inZabName"          : this.model.get("inZabName"),
                    "outZabName"         : this.model.get("outZabName"),
                    "remark"             : this.model.get("remark"),
                    "operatorId"         : this.model.get("operatorId"),
                    "operatorName"       : this.model.get("operatorName"),
                    "startChargingTime"  : this.model.get("startChargingTime")
                }
            } else {
                this.args = {
                    "id"                 : 0,
                    "name"               : "",
                    "chName"             : "",
                    "operator"           : "",
                    //"ChargingRegion"     : "",
                    "chargingType"       : 1 ,
                    "minBandwidth"       : "",
                    "maxBandwidth"       : "",
                    "maxBandwidthThreshold" : "",
                    "minBandwidthThreshold" : "",
                    "unitPrice"          : "",
                    "inZabName"          : "",
                    "outZabName"         : "",
                    "remark"             : "",
                    "operatorId"         : "",
                    "operatorName"       : "",
                    "startChargingTime"  : new Date().valueOf()
                }
            }

            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.add&edit.html'])({data: this.args}));

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

            this.initDropList(options.list);
            this.initChargeDatePicker();
        },

        getArgs: function(){
            var enName = this.$el.find("#input-english").val().replace(/\s+/g, ""),
                chName = this.$el.find("#input-name").val().replace(/\s+/g, ""),
                maxBandwidthThreshold = this.$el.find("#input-threshold").val(),
                minBandwidthThreshold = this.$el.find("#input-minthreshold").val(),
                maxBandwidth = this.$el.find("#input-maxbandwidth").val(),
                minBandwidth = this.$el.find("#input-minbandwidth").val(),
                unitPrice = this.$el.find("#input-unitprice").val(),
                longitudeLatitude = this.$el.find('#input-longitude-latitude').val(),
                outzabname = this.$el.find('#input-outzabname').val().replace(/\s+/g, ""),
                //inzabname = this.$el.find("#input-inzabname").val().replace(/\s+/g, ""),
                re = /^\d+$/,
                outzabnameRe = /^[0-9A-Za-z\-\[\]\_]+$/,
                letterRe = /[A-Za-z]+/,
                reLocation = /^\d+(\.\d+)?----\d+(\.\d+)?$/;
            // if (!reLocation.test(longitudeLatitude)){
            //     alert("您需要填写正确的经纬度，否则该节点无法在地图中展示！");
            //     return
            // }
            if (!enName || !chName){
                alert("节点名称和英文名称都要填写！");
                return;
            }
            if (!re.test(maxBandwidth) || !re.test(minBandwidth)){
                alert("上联带宽和保底带宽只能填入数字！");
                return;
            }
            if (parseInt(maxBandwidth) > 100000000 || parseInt(maxBandwidth) < 0){
                alert("上联带宽：0-100000000（0-100T，单位转换按1000算）");
                return; 
            }
            if (parseInt(minBandwidth) > 100000000 || parseInt(minBandwidth) < 0){
                alert("保底带宽：0-100000000（0-100T，单位转换按1000算）");
                return; 
            }
            if (parseInt(maxBandwidth) < parseInt(minBandwidth)){
                alert("上联带宽不能小于保底带宽！");
                return;
            }
            if (!re.test(maxBandwidthThreshold) || !re.test(minBandwidthThreshold)){
                alert("上联带宽阈值和保底带宽阈值只能填入数字！");
                return;
            }
            if (parseInt(maxBandwidthThreshold) < 0 || parseInt(maxBandwidthThreshold) > parseInt(maxBandwidth)){
                alert("上联带宽阈值：0-上联带宽");
                return;
            }
            if (parseInt(minBandwidthThreshold) < 0 || parseInt(minBandwidthThreshold) > parseInt(maxBandwidth)){
                alert("保底带宽阈值：0-上联带宽");
                return;
            }
            if (!re.test(unitPrice)){
                alert("成本权值只能填入数字！");
                return;
            }
            if (parseInt(unitPrice) > 2147483647 || parseInt(unitPrice) < 0){
                alert("成本权值不能小于0且大于长整型的最大值");
                return; 
            }
            if (!outzabnameRe.test(outzabname) || outzabname.indexOf("-") === -1 || 
                outzabname.indexOf("_") === -1 || outzabname.indexOf("[") === -1 ||
                outzabname.indexOf("]") === -1 || !letterRe.test(outzabname)){
                alert("zabbix出口带宽英文、“-”、“_”、“[”、“]”为必填项，数字为可填项，即组合可包含数字，也可不包含数字");
                return; 
            }
            var args = {
                "id"                 : this.model ? this.model.get("id") : 0,
                "name"               : this.$el.find("#input-english").val().replace(/\s+/g, ""),
                "chName"             : this.$el.find("#input-name").val().replace(/\s+/g, ""),
                "operatorId"         : this.operatorId,
                "operatorName"       : this.operatorName,
                "minBandwidth"       : this.$el.find("#input-minbandwidth").val(),
                "maxBandwidth"       : this.$el.find("#input-maxbandwidth").val(),
                "maxBandwidthThreshold" : this.$el.find("#input-threshold").val(),
                "minBandwidthThreshold" : this.$el.find("#input-minthreshold").val(),
                "unitPrice"          : this.$el.find("#input-unitprice").val(),
                "inZabName"          : this.$el.find("#input-inzabname").val().replace(/\s+/g, ""),
                "outZabName"         : this.$el.find("#input-outzabname").val().replace(/\s+/g, ""),
                "remark"             : this.$el.find("#textarea-comment").val(),
                "startChargingTime"  : this.args.startChargingTime,
                "chargingType"       : this.args.chargingType
            }
            return args;
        },

        onGetOperatorSuccess: function(res){
            var nameList = [];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), nameList, function(value){
                this.operatorId = value;
            }.bind(this));
            if (this.isEdit){
                var defaultValue = _.find(nameList, function(object){
                    return object.value === this.model.attributes.operatorId
                }.bind(this));

                this.$el.find(".dropdown-operator .cur-value").html(defaultValue.name)
                this.operatorId = defaultValue.value;
                this.operatorName = defaultValue.name;
            } else {
                this.$el.find(".dropdown-operator .cur-value").html(nameList[0].name);
                this.operatorId = nameList[0].value;
                this.operatorName = nameList[0].name;
            }
        },

        initDropList: function(list){
            var nameList = [
                {name: "95峰值", value: 1}
                // {name: "免费", value: 0}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-charging"), nameList, function(value){
                this.args.chargingType = parseInt(value);
            }.bind(this));

            if (this.isEdit){
                var defaultValue = _.find(nameList, function(object){
                    return object.value === this.model.attributes.chargingType
                }.bind(this));
                this.$el.find(".dropdown-charging .cur-value").html(defaultValue.name)
            } else {
                this.$el.find(".dropdown-charging .cur-value").html(nameList[0].name)
            }

            this.collection.getAllContinent();
            this.collection.getAllProvince();
            //this.collection.getAllCity();
        },

        onGetAllContinent: function(list){
            var nameList = [];
            _.each(list.rows, function(el, inx, list){
                nameList.push({name: el.name, value: el.id})
            }.bind(this))
            Utility.initDropMenu(this.$el.find(".dropdown-continent"), nameList, function(value){
                this.collection.getCountryByContinent({id: value})
            }.bind(this));

            if (this.isEdit){
                this.$el.find(".dropdown-continent .cur-value").html(this.model.get("continentName"));
                this.collection.getCountryByContinent({id: this.model.get("continentId")})
                //this.$el.find("#dropdown-continent").prop("disabled", true)
            } else {
                this.$el.find(".dropdown-continent .cur-value").html(nameList[0].name);
                this.collection.getCountryByContinent({id: nameList[0].value})
            }
        },

        onGetAllProvince: function(list){
            var nameList = [];
            _.each(list, function(el, inx, list){
                nameList.push({name: el.name, value: el.id})
            }.bind(this))

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-province').get(0),
                panelID: this.$el.find('#dropdown-province').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function(){},
                data: nameList,
                callback: function(data) {
                    this.$el.find('#dropdown-province .cur-value').html(data.name);
                    this.collection.getAllCityAndBigArea({provId: data.value})
                }.bind(this)
            });

            if (this.isEdit){
                // this.$el.find(".dropdown-country .cur-value").html(this.model.get("countryName"));
                // this.collection.getOperationByCountry({id: this.model.get("countryId")})
            } else {
                this.$el.find("#dropdown-province .cur-value").html(nameList[0].name);
                this.collection.getAllCityAndBigArea({provId: nameList[0].value})
            }
        },

        onGetAllCityAndBigArea: function(res){
            var area = res.cityProvArea.name,
                list = res.list;

            var cityArray = [];
            _.each(list, function(el, index, list){
                cityArray.push({name:el.name, value: el.id, isDisplay: true})
            }.bind(this))
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-city').get(0),
                panelID: this.$el.find('#dropdown-city').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: true,
                onOk: function(){},
                data: cityArray,
                callback: function(data) {
                    this.$el.find('#dropdown-city .cur-value').html(data.name);
                    this.$el.find('#input-longitude-latitude').val("查找中...");
                    this.$el.find('#dropdown-city').attr("disabled", "disabled");
                    this.collection.getLocation({addr: data.name})
                }.bind(this)
            });
            if (this.isEdit){
                // this.$el.find(".dropdown-country .cur-value").html(this.model.get("countryName"));
                // this.collection.getOperationByCountry({id: this.model.get("countryId")})
            } else {
                this.$el.find('#input-longitude-latitude').val("查找中...");
                this.$el.find('#dropdown-city').attr("disabled", "disabled");
                this.collection.getLocation({addr: cityArray[0].name});
                this.$el.find('#dropdown-city .cur-value').html(cityArray[0].name);
                this.$el.find('#dropdown-region .cur-value').html(area);   
            }
        },

        onGetCountryByContinent: function(res){
            var nameList = [];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.name, value:el.id})
            });
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-country').get(0),
                panelID: this.$el.find('#dropdown-country').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function(){},
                data: nameList,
                callback: function(data) {
                    this.$el.find('#dropdown-country .cur-value').html(data.name);
                    this.collection.getOperationByCountry({id: data.value})
                }.bind(this)
            });
            if (this.isEdit){
                this.$el.find(".dropdown-country .cur-value").html(this.model.get("countryName"));
                this.collection.getOperationByCountry({id: this.model.get("countryId")})
                //this.$el.find("#dropdown-country").prop("disabled", true)
            } else {
                this.$el.find('#dropdown-country .cur-value').html(nameList[0].name);
                this.collection.getOperationByCountry({id: nameList[0].value});
            }
        },

        onGetAllCity: function(res){
            var cityArray = [];
            res = _.uniq(res);
            _.each(res, function(el, index, list){
                cityArray.push({name:el, value: el, isDisplay: false})
            }.bind(this))
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-city').get(0),
                panelID: this.$el.find('#dropdown-city').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: true,
                onOk: function(){},
                data: cityArray,
                callback: function(data) {
                    this.$el.find('#dropdown-city .cur-value').html(data.name);
                    this.$el.find('#input-longitude-latitude').val("查找中...");
                    this.$el.find('#dropdown-city').attr("disabled", "disabled");
                    this.collection.getLocation({addr: data.value})
                }.bind(this)
            });
            this.$el.find('#input-longitude-latitude').val("查找中...");
            this.$el.find('#dropdown-city').attr("disabled", "disabled");
            this.collection.getLocation({addr: "北京"})
        },

        onGetLocation: function(res){
            if (typeof res !== "string" && res.status !== 200){
                this.$el.find('#input-longitude-latitude').val("没有查到该城市的经纬度，请自己谷歌百度后填写！");
                this.$el.find('#input-longitude-latitude').removeAttr("readonly");
            } else {
                this.$el.find('#input-longitude-latitude').val(res);
                this.$el.find('#input-longitude-latitude').attr("readonly", true);
            }
            this.$el.find('#dropdown-city').removeAttr("disabled");
        },

        initChargeDatePicker: function(){
            var startVal = null, endVal = null;
            if (this.args.startChargingTime)
                startVal = new Date(this.args.startChargingTime).format("yyyy/MM/dd");
            var startOption = {
                lang:'ch',
                timepicker: false,
                scrollInput: false,
                format:'Y/m/d', 
                value: startVal, 
                onChangeDateTime: function(){
                    this.args.startChargingTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#input-start").datetimepicker(startOption);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var NodeManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.html'])());

            this.initNodeDropMenu();

            this.collection.on("get.node.success", $.proxy(this.onNodeListSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            this.collection.on("add.node.success", function(){
                alert("添加成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.node.error", $.proxy(this.onGetError, this));
            this.collection.on("update.node.success", function(){
                alert("编辑成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.node.error", $.proxy(this.onGetError, this));
            this.collection.on("delete.node.success", function(){
                alert("删除成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("delete.node.error", $.proxy(this.onGetError, this));
            this.collection.on("update.node.status.success", function(){
                alert("操作成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.node.status.error", $.proxy(this.onGetError, this));
            this.collection.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));

            this.collection.on("add.assocateDispGroups.success", function(){
                alert("操作成功！")
            }.bind(this));
            this.collection.on("add.assocateDispGroups.error", $.proxy(this.onGetError, this));

            if (AUTH_OBJ.CreateNode)
                this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
            else
                this.$el.find(".opt-ctn .create").remove();
            if (AUTH_OBJ.QueryNode){
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
                "page"    : 1,
                "count"   : 10,
                "chname"  : null,//节点名称
                "operator": null,//运营商id
                "status"  : null//节点状态
            }
            this.onClickQueryButton();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    e.stopPropagation();
                    e.preventDefault();
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onNodeListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.chname = this.$el.find("#input-name").val() || null;
            this.collection.getNodeList(this.queryArgs);
        },

        onClickCreate: function(){
            if (this.addNodePopup) $("#" + this.addNodePopup.modalId).remove();

            var addNodeView = new AddOrEditNodeView({
                collection: this.collection,
                list      : this.operatorList
            });
            var options = {
                title:"添加节点",
                body : addNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = addNodeView.getArgs();
                    if (!options) return;
                    this.collection.addNode(options)
                    this.addNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.addNodePopup = new Modal(options);
            if (!AUTH_OBJ.ApplyCreateNode) this.addNodePopup.$el.find(".modal-footer .btn-primary").remove();
        },

        initTable: function(){
            this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");

            this.table = $(_.template(template['tpl/nodeManage/nodeManage.table.html'])({data: this.collection.models, permission:AUTH_OBJ}));
            if (this.collection.models.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .node-name").on("click", $.proxy(this.onClickItemNodeName, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
                this.table.find("tbody .hangup").on("click", $.proxy(this.onClickItemHangup, this));
                this.table.find("tbody .stop").on("click", $.proxy(this.onClickItemStop, this));
                this.table.find("tbody .disp-info").on("click", $.proxy(this.onClickDispGroupInfo, this));

                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickDispGroupInfo: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.dispGroupPopup) $("#" + this.dispGroupPopup.modalId).remove();

            var dispGroupInfoView = new DispGroupInfoView({
                collection: this.collection, 
                model     : model,
                isEdit    : true
            });
            var options = {
                title: model.get("chName") + "关联调度组信息",
                body : dispGroupInfoView,
                backdrop : 'static',
                type     : 2,
                width: 800,
                height: 500,
                onOKCallback:  function(){
                    var options = dispGroupInfoView.getArgs();
                    if (!options) return;
                    this.collection.addAssocateDispGroups(options, model.get("id"))
                    this.dispGroupPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    this.enterKeyBindQuery();
                }.bind(this)
            }
            this.dispGroupPopup = new Modal(options);
            if (!AUTH_OBJ.NodeAssociatetoGslbGroup)
                this.dispGroupPopup.$el.find(".btn-primary").remove();
        },

        onClickItemNodeName: function(event){
            var eventTarget = event.srcElement || event.target, 
                id = $(eventTarget).attr("id"),
                model = this.collection.get(id),
                args = {
                    nodeId: id,
                    chName: model.get("chName")
                }
            window.location.hash = "#/deviceManage/" + JSON.stringify(args)
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.editNodePopup) $("#" + this.editNodePopup.modalId).remove();

            var editNodeView = new AddOrEditNodeView({
                collection: this.collection, 
                model     : model,
                isEdit    : true,
                list      : this.operatorList
            });
            var options = {
                title:"编辑节点",
                body : editNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = editNodeView.getArgs();
                    if (!options) return;
                    var args = _.extend(model.attributes, options)
                    this.collection.updateNode(args)
                    this.editNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.editNodePopup = new Modal(options);
            if (!AUTH_OBJ.ApplyEditNode)
                this.editNodePopup.$el.find(".modal-footer .btn-primary").remove();
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var result = confirm("你确定要删除节点" + model.attributes.name + "吗");
            if (!result) return;
            this.collection.deleteNode({id:parseInt(id)})
        },

        onClickItemPlay: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            this.collection.updateNodeStatus({ids:[parseInt(id)], status:1})
        },

        onClickMultiPlay: function(event){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list){
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            this.collection.updateNodeStatus({ids:ids, status:1})
        },

        onClickItemHangup: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var result = confirm("你确定要挂起节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({ids:[parseInt(id)], status:2})
        },

        onClickItemStop: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var result = confirm("你确定要关闭节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({ids:[parseInt(id)], status:3})
        },

        onClickMultiStop : function(event){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list){
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            var result = confirm("你确定要批量关闭选择的节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({ids:ids, status:3})
        },

        onClickMultiDelete: function(event){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list){
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            var result = confirm("你确定要批量删除选择的节点吗？")
            if (!result) return
            alert(ids.join(",") + "。接口不支持，臣妾做不到啊！");
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
                        this.collection.getNodeList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name: "运行中", value: 1},
                {name: "挂起", value: 2},
                {name: "已关闭", value: 3}
            ],
            rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                if (value !== "All")
                    this.queryArgs.status = parseInt(value);
                else
                    this.queryArgs.status = null;
            }.bind(this));

            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.count = value;
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));

            this.collection.getOperatorList();
        },

        onGetOperatorSuccess: function(res){
            this.operatorList = res
            var nameList = [{name: "全部", value: "All"}];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), nameList, function(value){
                if (value !== "All")
                    this.queryArgs.operator = parseInt(value)
                else
                    this.queryArgs.operator = null;
            }.bind(this));
        },

        onItemCheckedUpdated: function(event){
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

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
            if (eventTarget.checked){
                this.$el.find(".opt-ctn .multi-delete").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").removeAttr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".opt-ctn .multi-delete").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-stop").attr("disabled", "disabled");
                this.$el.find(".opt-ctn .multi-play").attr("disabled", "disabled");
            }
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            if (AUTH_OBJ.QueryNode) this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return NodeManageView;
});