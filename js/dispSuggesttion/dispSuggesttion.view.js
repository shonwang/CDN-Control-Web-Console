define("dispSuggesttion.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var QueryMultiView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/dispSuggesttion/dispSuggesttion.queryMulti.html'])());
        },

        getArgs: function(){
            var queryKey = this.$el.find("#textarea-content").val();
            return queryKey;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var ChartView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.selectNode = options.selectedNode;

            this.$el = $(_.template(template['tpl/dispSuggesttion/dispSuggesttion.chart.html'])());
            this.$el.find(".charts-ctn").html(_.template(template['tpl/loading.html'])({}));

            setTimeout(function(){
                this.initChart();
            }.bind(this), 1000)
        },

        initChart: function(){
            var base = +new Date(1968, 9, 3);
            var oneDay = 24 * 3600 * 1000;
            var date = [];

            var data = [Math.random() * 300];

            for (var i = 1; i < 20000; i++) {
                var now = new Date(base += oneDay);
                date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
                data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
            }

            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                title: {
                    left: 'center',
                    text: this.selectNode["node.chName"],
                },
                legend: {
                    top: 'bottom',
                    data:['意向']
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: date
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%']
                },
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100,
                    xAxisIndex: [0],
                    showDetail: false,
                    labelFormatter: function(value){
                        return new Date(timeData[value]).format("MM/dd hh:mm")
                    }
                }],
                grid: {
                    bottom: '15%',
                    containLabel: true
                },
                series: [
                    {
                        name:'模拟数据',
                        type:'line',
                        smooth:true,
                        symbol: 'none',
                        sampling: 'average',
                        itemStyle: {
                            normal: {
                                color: 'rgb(255, 70, 131)'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(255, 158, 68)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(255, 70, 131)'
                                }])
                            }
                        },
                        data: data
                    }
                ]
            };
            this.$el.find(".charts-ctn").html('<div class="chart" style="width: 100%;height:300px;"></div>');
            this.chart = echarts.init(this.$el.find(".chart").get(0));
            this.chart.setOption(option);
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var SelectNodeView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;
            this.regionId   = options.regionId;
            this.groupId    = options.groupId;
            this.isEdit     = options.isEdit;
            this.isShowChart= options.isShowChart;

            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.html'])({}));
            this.$el.find(".node-list").html(_.template(template['tpl/loading.html'])({}));
            this.nodeList = [];

            this.collection.off("get.regionNode.success");
            this.collection.off("get.regionNode.error");
            this.collection.off("get.allDnsRecord.success");
            this.collection.off("get.regionOtherNode.error");

            this.collection.on("get.regionNode.success", $.proxy(this.onGetNodeListSuccess, this));
            this.collection.on("get.regionNode.error", $.proxy(this.onGetError, this));
            this.collection.on("get.regionOtherNode.success", $.proxy(this.onGetOtherNodeSuccess, this));
            this.collection.on("get.regionOtherNode.error", $.proxy(this.onGetError, this));

            if (AUTH_OBJ.ShowMoreNode)
                this.$el.find(".more").on("click", $.proxy(this.onClickMoreButton, this));
            else
                this.$el.find(".more").remove();

            this.args = {
                regionId: this.regionId,
                groupId : this.isEdit ? this.model.get("dispGroup.id") : this.groupId
            }

            this.collection.getRegionNodeList(this.args);

            this.$el.find("#node-list-filter").on("keyup", $.proxy(this.onKeyupNodeListFilter, this));
        },

        onKeyupNodeListFilter: function() {
            if (!this.nodeList || this.nodeList.length === 0) return;
            var keyWord = this.$el.find("#node-list-filter").val();
            _.each(this.nodeList, function(el, index, ls) {
                if (keyWord === ""){
                    el.isDisplay = true;
                } else {
                    var nodeString = "(" + el["node.minBandwidth"] + "/" + el["node.maxBandwidth"] + ")L" + el["cover.crossLevel"]
                    if (el["node.chName"].indexOf(keyWord) > -1 || nodeString.indexOf(keyWord) > -1)
                        el.isDisplay = true;
                    else
                        el.isDisplay = false;
                }
            });
            this.initList();
        },

        onClickMoreButton: function(){
            this.$el.find(".more").hide();
            this.$el.find(".node-list").html(_.template(template['tpl/loading.html'])());
            this.collection.getRegionOtherNodeList(this.args)
        },

        onGetOtherNodeSuccess: function(res){
            _.each(res.rows, function(element, index, list){
                var temp = {};
                _.each(element, function(el, key, ls){
                    _.each(el, function(el1, key1, ls1){
                        temp[key + "." + key1] = el1
                    }.bind(this))
                }.bind(this))
                temp.isDisplay = true;
                temp.isChecked = false;
                if (temp["node.id"] === this.model.get("node.id")) temp.isChecked = true;
                this.nodeList.push(temp);
            }.bind(this))

            if (this.nodeList.length === 0){
                this.$el.find("#node-list-filter").hide();
                this.$el.find(".node-list").html(_.template(template['tpl/empty.html'])());
                return;
            } else {
                this.$el.find("#node-list-filter").show()
            }

            this.initList();
        },

        onGetNodeListSuccess: function(res){
            if (res.rows.length === 0){
                this.$el.find("#node-list-filter").hide();
                this.$el.find(".node-list").html(_.template(template['tpl/empty.html'])());
                return;
            } else {
                this.$el.find("#node-list-filter").show();
            }
            _.each(res.rows, function(element, index, list){
                var temp = {};
                _.each(element, function(el, key, ls){
                    _.each(el, function(el1, key1, ls1){
                        temp[key + "." + key1] = el1
                    }.bind(this))
                }.bind(this))
                temp.isDisplay = true;
                temp.isChecked = false;
                if (temp["node.id"] === this.model.get("node.id")) temp.isChecked = true;
                this.nodeList.push(temp);
            }.bind(this))

            this.nodeList[this.nodeList.length - 1].line = true
                
            this.initList();
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var selectedObj = _.find(this.nodeList, function(object){
                return object["node.id"] === parseInt(id)
            }.bind(this));
            if (this.isEdit){
                var oldCheckObj = _.find(this.nodeList, function(object){
                    return object["isChecked"] === true;
                }.bind(this));
                if (oldCheckObj) oldCheckObj.isChecked = false;
            }
            selectedObj.isChecked = eventTarget.checked;
            this.curCheckedId = selectedObj["node.id"];
        },

        initList: function(){
            if (this.isEdit){
                this.list = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.list.html'])({
                    data: this.nodeList, 
                    nodeId: this.curCheckedId || this.model.get("node.id"),
                    isShowChart: this.isShowChart
                }));
            } else {
                this.list = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.checklist.html'])({
                    data: this.nodeList, 
                    nodeId: this.model.get("node.id"),
                    isShowChart: this.isShowChart
                }));
            }
            this.$el.find(".node-list").html(this.list[0]);
            this.list.find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.list.find(".chart").on("click", $.proxy(this.onClickViewChart, this));
        },

        onClickViewChart: function(event){
            this.rootNode.modal("hide");
            var eventTarget = event.srcElement || event.target, id;
                id = $(eventTarget).attr("id");
            var clickNode = _.find(this.nodeList, function(object) {
                return object["node.id"] === parseInt(id)
            })
            if (this.chartPopup) $("#" + this.chartPopup.modalId).remove();

            var aChartView = new ChartView({
                collection: this.collection, 
                selectedNode : clickNode
            });

            var options = {
                title:"节点带宽数据展示",
                body : aChartView,
                backdrop : 'static',
                type     : 1,
                height   : 500,
                width    : 800,
                onHiddenCallback: function(){
                    this.rootNode.modal("show");
                }.bind(this)
            }
            this.chartPopup = new Modal(options);
        },

        getArgs: function(){
            //var checkedNodes = this.$el.find(".node-list input:checked"), checkedNodeIds = [];
            var checkedNodes = _.filter(this.nodeList, function(object) {
                return object["isChecked"] === true
            }), checkedNodeIds = [];
            if (checkedNodes.length === 0) {
                alert("至少选择一个再点确定！")
                return false;
            }
            for (var i = 0; i < checkedNodes.length; i++){
                //var tempId = parseInt($(checkedNodes[i]).attr("id"));
                var tempId = checkedNodes[i]["node.id"];
                checkedNodeIds.push(tempId)
            }
            var selectedNodes = [];
            for (var k = 0; k < checkedNodeIds.length; k++){
                var aSelectedNodeArray = _.filter(this.nodeList ,function(obj) {
                    return obj["node.id"] === checkedNodeIds[k];
                })
                var aSelectedNode = aSelectedNodeArray[0];
                var nodeChName       = aSelectedNode["node.chName"],
                    nodeMinBandwidth = aSelectedNode["node.minBandwidth"],
                    nodeMaxBandwidth = aSelectedNode["node.maxBandwidth"],
                    crossLevel       = aSelectedNode["cover.crossLevel"];
                var nodeString = nodeChName + "(" + nodeMinBandwidth + "/" + nodeMaxBandwidth + ")L" + crossLevel;
                aSelectedNode.nodeString = nodeString;
                aSelectedNode.id = aSelectedNode["node.id"];
                selectedNodes.push(aSelectedNode)
            }
            return selectedNodes
        },

        onGetError: function(error){
            this.$el.find("#node-list-filter").hide();
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target, rootNode) {
            this.$el.appendTo(target);
            this.rootNode = rootNode;
        }
    });
    
    var DispSuggesttionView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.nodeId = options.nodeId;
            this.collection = options.collection;
            this.backCallback = options.backCallback;

            this.$el = $(_.template(template['tpl/dispSuggesttion/dispSuggesttion.html'])({}));
            //this.$el.find(".node-table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.on("get.dispConfig.success", $.proxy(this.onDispConfigListSuccess, this));
            this.collection.on("get.dispConfig.error", $.proxy(this.onGetError, this));

            this.collection.on("dispDns.success", function(){
                this.disablePopup.$el.modal('hide');
                alert("下发成功！")
            }.bind(this));
            this.collection.on("dispDns.error", function(res){
                this.disablePopup.$el.modal('hide');
                this.onGetError(res)
            }.bind(this));
            
            this.$el.find(".opt-ctn .back").on("click", $.proxy(this.onClickBack, this));
            this.$el.find(".opt-ctn .giveup").on("click", $.proxy(this.onClickBack, this));
            this.$el.find(".opt-ctn .sending").on("click", $.proxy(this.onClickSending, this));
            
            // this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            // this.$el.find(".opt-ctn .query-multi").on("click", $.proxy(this.onClickQueryMultiButton, this));
            // this.enterKeyBindQuery();

            this.$el.find(".opt-ctn .show-node-change").on("click", $.proxy(this.onClickShowRemark, this));
            this.$el.find(".opt-ctn .hide-node-change").on("click", $.proxy(this.onClickHideRemark, this));

            this.initNodeChangeTable();
            this.onDispConfigListSuccess();

            if (this.nodeId) this.collection.getDisconfAdvice({nodeId: this.nodeId})
        },

        onClickBack: function(){
            var result = confirm("是否确定放弃此次操作？");
            if (!result) return;
            this.backCallback && this.backCallback();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onClickShowRemark: function(){
            this.$el.find(".hide-node-change").show();
            this.$el.find(".show-node-change").hide();
            this.$el.find(".content-ctn").slideDown(200);
        },

        onClickHideRemark: function(){
            this.$el.find(".hide-node-change").hide();
            this.$el.find(".show-node-change").show();
            this.$el.find(".content-ctn").slideUp(200);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onDispConfigListSuccess: function(){
            var tempData = {
                "failedAdvice": [{
                    "region": {
                        "id": 1,
                        "name": "全网默认111",
                        "operaterId": -1,
                        "sortKey": 0,
                        "maxBandWidth": 10.0,
                        "failedReason": "你太帅"
                    },
                    "list": [
                    {
                        "config": {
                            "id": 158,
                            "nodeId": 160,
                            "regionLineId": 1,
                            "dispGroupId": 83,
                            "bandwidth": 100.0,
                            "type": 1
                        },
                        "dispGroup": {
                            "id": 83,
                            "dispDomain": "xlf-test-0802-copywrong6",
                            "crossLevel": 0,
                            "priority": 3,
                            "resolveIpType": 104,
                            "ttl": 398,
                            "status": 1,
                            "version": 42,
                            "updateTime": 1472527656000,
                            "remark": "testtetstset"
                        },
                        "node": {
                            "id": 160,
                            "name": "xlf-test-node-0802-1",
                            "chName": "xlf-test-node-0802-1",
                            "minBandwidth": 1000.0,
                            "maxBandwidth": 1000.0,
                            "maxBandwidthThreshold": 1000.0,
                            "minBandwidthThreshold": 1000.0,
                            "unitPrice": 11.00,
                            "chargingType": 1,
                            "status": 1,
                            "createTime": 1470144573000,
                            "inZabName": "test",
                            "outZabName": "-test_[]",
                            "remark": "",
                            "operatorId": 15,
                            "startChargingTime": 1470144483000,
                            "lon": "113.42206",
                            "lat": "22.545178",
                            "cityId": 855
                        },
                        "cover": {
                            "id": 1473043360653,
                            "nodeId": 160,
                            "regionLineId": 1,
                            "crossLevel": 9,
                            "remark": null
                        },
                        "dispConfIpInfo": {
                            "maxNum": 6,
                            "currNum": 2,
                            "pauseNum": 0
                        },
                        "type": 0
                    }, 
                    {
                        "config": {
                            "id": 159,
                            "nodeId": 161,
                            "regionLineId": 1,
                            "dispGroupId": 83,
                            "bandwidth": 100.0,
                            "type": 1
                        },
                        "dispGroup": {
                            "id": 83,
                            "dispDomain": "xlf-test-0802-copywrong5",
                            "crossLevel": 0,
                            "priority": 3,
                            "resolveIpType": 104,
                            "ttl": 398,
                            "status": 1,
                            "version": 42,
                            "updateTime": 1472527656000,
                            "remark": "testtetstset"
                        },
                        "node": {
                            "id": 161,
                            "name": "xlf-test-node-0802-2",
                            "chName": "xlf-test-node-0802-3",
                            "minBandwidth": 10000.0,
                            "maxBandwidth": 10000.0,
                            "maxBandwidthThreshold": 1000.0,
                            "minBandwidthThreshold": 1000.0,
                            "unitPrice": 1111.00,
                            "chargingType": 1,
                            "status": 1,
                            "createTime": 1470210152000,
                            "inZabName": "-test_[]",
                            "outZabName": "-test_[]",
                            "remark": "",
                            "operatorId": 7,
                            "startChargingTime": 1471881600000,
                            "lon": "108.953098",
                            "lat": "34.2778",
                            "cityId": 871
                        },
                        "cover": {
                            "id": 1473043360653,
                            "nodeId": 161,
                            "regionLineId": 1,
                            "crossLevel": 9,
                            "remark": null
                        },
                        "dispConfIpInfo": {
                            "maxNum": 6,
                            "currNum": 5,
                            "pauseNum": 0,
                            "adviceChangeNum": "-5",
                        },
                        "type": 1,
                        "nodeChangeType": 2
                    }]
                }],
                "successAdvice": [{
                    "region": {
                        "id": 2,
                        "name": "全网默认",
                        "operaterId": -1,
                        "sortKey": 0,
                        "maxBandWidth": 10.0,
                        "failedReason": "你太帅"
                    },
                    "list": [{
                        "config": {
                            "id": 158,
                            "nodeId": 160,
                            "regionLineId": 1,
                            "dispGroupId": 83,
                            "bandwidth": 100.0,
                            "type": 1
                        },
                        "dispGroup": {
                            "id": 83,
                            "dispDomain": "xlf-test-0802-fghdvdgf5",
                            "crossLevel": 0,
                            "priority": 3,
                            "resolveIpType": 104,
                            "ttl": 398,
                            "status": 1,
                            "version": 42,
                            "updateTime": 1472527656000,
                            "remark": "testtetstset"
                        },
                        "node": {
                            "id": 163,
                            "name": "xlf-test-node-0802-1",
                            "chName": "xlf-test-node-0802-1",
                            "minBandwidth": 1000.0,
                            "maxBandwidth": 1000.0,
                            "maxBandwidthThreshold": 1000.0,
                            "minBandwidthThreshold": 1000.0,
                            "unitPrice": 11.00,
                            "chargingType": 1,
                            "status": 1,
                            "createTime": 1470144573000,
                            "inZabName": "test",
                            "outZabName": "-test_[]",
                            "remark": "",
                            "operatorId": 15,
                            "startChargingTime": 1470144483000,
                            "lon": "113.42206",
                            "lat": "22.545178",
                            "cityId": 855
                        },
                        "cover": {
                            "id": 1473043360653,
                            "nodeId": 160,
                            "regionLineId": 1,
                            "crossLevel": 9,
                            "remark": null
                        },
                        "dispConfIpInfo": {
                            "maxNum": 6,
                            "currNum": 2,
                            "pauseNum": 0
                        },
                        "type": 0
                    }, {
                        "config": {
                            "id": 159,
                            "nodeId": 161,
                            "regionLineId": 1,
                            "dispGroupId": 83,
                            "bandwidth": 100.0,
                            "type": 1
                        },
                        "dispGroup": {
                            "id": 83,
                            "dispDomain": "xlf-testsdfsdfcgfhfg9",
                            "crossLevel": 0,
                            "priority": 3,
                            "resolveIpType": 104,
                            "ttl": 398,
                            "status": 1,
                            "version": 42,
                            "updateTime": 1472527656000,
                            "remark": "testtetstset"
                        },
                        "node": {
                            "id": 164,
                            "name": "xlf-test-node-0802-2",
                            "chName": "xlf-test-node-0802-3",
                            "minBandwidth": 10000.0,
                            "maxBandwidth": 10000.0,
                            "maxBandwidthThreshold": 1000.0,
                            "minBandwidthThreshold": 1000.0,
                            "unitPrice": 1111.00,
                            "chargingType": 1,
                            "status": 1,
                            "createTime": 1470210152000,
                            "inZabName": "-test_[]",
                            "outZabName": "-test_[]",
                            "remark": "",
                            "operatorId": 7,
                            "startChargingTime": 1471881600000,
                            "lon": "108.953098",
                            "lat": "34.2778",
                            "cityId": 871
                        },
                        "cover": {
                            "id": 1473043360653,
                            "nodeId": 161,
                            "regionLineId": 1,
                            "crossLevel": 9,
                            "remark": null
                        },
                        "dispConfIpInfo": {
                            "maxNum": 6,
                            "currNum": 5,
                            "pauseNum": 1,
                            "adviceChangeNum": "-5",
                        },
                        "type": 1,
                        "nodeChangeType": 1
                    }]
                }]
            }
            _.each(tempData.failedAdvice, function(element, index, list){
                var temp = {}, tempList = [];
                _.each(element, function(el, key, ls){
                    if (key === "region"){
                        _.each(el, function(el1, key1, ls1){
                            temp[key + "." + key1] = el1
                        }.bind(this))
                    }
                    if (key === "list"){
                        var tempObj = {}
                        _.each(el, function(el2, key2, ls2){
                            _.each(el2, function(el3, key3, ls3){
                                if (key3 === "type") tempObj.type = el3;
                                if (key3 === "nodeChangeType") tempObj.nodeChangeType = el3;
                                _.each(el3, function(el4, key4, ls4){
                                    var tempKey = key3 + "." + key4
                                    tempObj[tempKey] = el4
                                    if (tempKey === "dispGroup.dispDomain" && !temp['dispGroup.dispDomain'])
                                        temp['dispGroup.dispDomain'] = el4
                                    if (tempKey === "dispGroup.id" && !temp['dispGroup.id'])
                                        temp['dispGroup.id'] = el4
                                    if (tempKey === "dispGroup.ttl" && !temp['dispGroup.ttl'])
                                        temp['dispGroup.ttl'] = el4
                                }.bind(this))
                            }.bind(this))
                            tempObj.isDisplay = true;
                            tempList.push(new this.collection.model(tempObj))
                        }.bind(this))
                        temp.listFormated = tempList;
                    }
                }.bind(this))
                temp.isDisplay = true;
                temp.isFailed = true;
                temp.isSkip = false;
                this.collection.push(new this.collection.model(temp));
            }.bind(this))
            this.failedNum = tempData.failedAdvice.length;
            _.each(tempData.successAdvice, function(element, index, list){
                var temp = {}, tempList = [];
                _.each(element, function(el, key, ls){
                    if (key === "region"){
                        _.each(el, function(el1, key1, ls1){
                            temp[key + "." + key1] = el1
                        }.bind(this))
                    }
                    if (key === "list"){
                        var tempObj = {}
                        _.each(el, function(el2, key2, ls2){
                            _.each(el2, function(el3, key3, ls3){
                                if (key3 === "type") tempObj.type = el3;
                                if (key3 === "nodeChangeType") tempObj.nodeChangeType = el3;
                                _.each(el3, function(el4, key4, ls4){
                                    var tempKey = key3 + "." + key4
                                    tempObj[tempKey] = el4
                                    if (tempKey === "dispGroup.dispDomain" && !temp['dispGroup.dispDomain'])
                                        temp['dispGroup.dispDomain'] = el4
                                    if (tempKey === "dispGroup.id" && !temp['dispGroup.id'])
                                        temp['dispGroup.id'] = el4
                                    if (tempKey === "dispGroup.ttl" && !temp['dispGroup.ttl'])
                                        temp['dispGroup.ttl'] = el4
                                }.bind(this))
                            }.bind(this))
                            tempObj.isDisplay = true;
                            tempList.push(new this.collection.model(tempObj))
                        }.bind(this))
                        temp.listFormated = tempList;
                    }
                }.bind(this))
                temp.isDisplay = true;
                temp.isFailed = false;
                temp.isSkip = false;
                this.collection.push(new this.collection.model(temp));
            }.bind(this))
            this.successNum = tempData.successAdvice.length;

            this.$el.find(".opt-ctn .sending").show();

            this.initDispConfigDropMenu();

            this.initTable();
            this.initSuccessTable();
            this.$el.find("#disp-config-filter").val("");
            this.$el.find("#disp-config-filter").off("keyup");
            this.$el.find("#disp-config-filter").on("keyup", $.proxy(this.onKeyupDispConfigListFilter, this));
        },

        initNodeChangeTable: function(){
            var data = [{
                nodeId: 1,
                nodeName: "节点名称",
                bandwidthBefore: "10G",//变更前带宽
                bandwidthAfter: "100G",//变更后带宽
                bandwidthFlag: true,// true:升高 false:下降
                changeBeforeRate: "75%",//变更前利用率
                changeAfterRate: "10%",//变更后利用率
                changeRateFlag: false//true:升高 false:下降
            }]

            this.nodeTable = $(_.template(template['tpl/dispSuggesttion/dispSuggesttion.node.table.html'])({
                data: data
            }));

            if (data === 0)
                this.$el.find(".node-table-ctn").html(_.template(template['tpl/empty.html'])());
            else
                this.$el.find(".node-table-ctn").html(this.nodeTable[0]);
        },

        initDispConfigDropMenu: function(){
            var searchArray = [
                {name: "按调度组", value: "3"},
                {name: "按区域", value: "1"},
                {name: "按节点", value: "2"}
            ],
            rootNode = this.$el.find(".disp-config-filter-drop");
            Utility.initDropMenu(rootNode, searchArray, function(value){
                this.curSearchType = value;
                this.onKeyupDispConfigListFilter();
            }.bind(this));
            this.curSearchType = "3";
        },

        onKeyupDispConfigListFilter: function() {
            if (!this.collection.models || this.collection.models.length === 0) return;
            var keyWord = this.$el.find("#disp-config-filter").val();
                        
            _.each(this.collection.models, function(model, index, list) {
                if (keyWord === ""){
                    model.set("isDisplay", true);
                    _.each(model.get("listFormated"), function(modelL3, indexL3, listL3) {
                        modelL3.set("isDisplay", true);
                    })
                } else if (this.curSearchType == "1"){
                    if (model.get("region.name").indexOf(keyWord) > -1){
                        model.set("isDisplay", true);
                    } else {
                        model.set("isDisplay", false);
                    }
                    _.each(model.get("listFormated"), function(modelL4, indexL4, listL4) {
                        modelL4.set("isDisplay", true);
                    })
                } else if (this.curSearchType == "2"){
                    model.set("isDisplay", false);
                    _.each(model.get("listFormated"), function(modelL2, indexL2, listL2) {
                        if (modelL2.get("node.chName") && modelL2.get("node.chName").indexOf(keyWord) > -1){
                            modelL2.set("isDisplay", true);
                            model.set("isDisplay", true);
                        } else {
                            modelL2.set("isDisplay", false);
                        }
                    })
                } else if (this.curSearchType == "3"){
                    if (model.get("dispGroup.dispDomain").indexOf(keyWord) > -1){
                        model.set("isDisplay", true);
                    } else {
                        model.set("isDisplay", false);
                    }
                    _.each(model.get("listFormated"), function(modelL4, indexL4, listL4) {
                        modelL4.set("isDisplay", true);
                    })
                }
            }.bind(this));
            this.initTable();
            this.initSuccessTable();
        },

        onClickQueryButton: function(){
            this.$el.find(".fail-table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.queryArgs = {
                page : 1,
                count: 999999,
                groupId: this.$el.find("#input-disp-group").val()
            }
            this.collection.getDispConfigList(this.queryArgs);
        },

        onClickQueryMultiButton: function(event){
            if (this.queryDetailPopup) $("#" + this.queryDetailPopup.modalId).remove();

            var detailView = new QueryMultiView({
                collection: this.collection
            });
            var options = {
                title: "查询调度组",
                body : detailView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = detailView.getArgs();
                    // this.queryArgs.ips = options;
                    // this.isMultiIPSearch = true;
                    // this.currentPage = 1;
                    // this.onStartQueryButton();
                    this.queryDetailPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){this.enterKeyBindQuery();}.bind(this)
            }
            this.queryDetailPopup = new Modal(options);
        },

        onClickSending: function(){
            var failedAndNotSkipList = this.collection.filter(function(obj){
                return obj.get("isFailed") && !obj.get("isSkip")
            }.bind(this))

            var regionsIpNumSum = {};
            _.each(failedAndNotSkipList, function(regionObj, index, list){
                var regionName = regionObj.get('region.name')
                regionsIpNumSum[regionName] = 0;
                _.each(regionObj.get('listFormated'), function(el, key, ls){
                    regionsIpNumSum[regionName] = regionsIpNumSum[regionName] + el.get("dispConfIpInfo.currNum");
                }.bind(this))
            }.bind(this))

            console.log(regionsIpNumSum)
            var ipZeroRegionName = [];
            _.each(regionsIpNumSum, function(el, key, ls){
                if (el === 0) ipZeroRegionName.push(key);
            }.bind(this))

            if (ipZeroRegionName.length > 0)
                alert("调度失败的<span class='text-danger'>" + ipZeroRegionName.join(",")+ "</span>区域当前没有服务节点，请设置服务节点后进行下发!")
            else
                this.onSureSending()
        },

        getSendData: function(){
            var failedAndCheckedList = this.collection.filter(function(obj){
                return (obj.get("isFailed") && !obj.get("isSkip")) || obj.get("isChecked")
            }.bind(this))

            console.log(failedAndCheckedList)

            // var tempArray = [];

            // _.each(this.collection.models, function(el, index, list){
            //     _.each(el.get("listFormated"), function(el1, index1, list1){
            //         var tempObj =  {
            //           "dgroupId" : el1.get("dispGroup.id") || this.queryArgs.groupId,
            //           "nodeId"   : el1.get("node.id"),
            //           "regionId" : el.get("region.id"),
            //           "ttl"      : el.get("dispGroup.ttl"),
            //           "ipNum"    : el1.get("dispConfIpInfo.currNum"),
            //         };
            //         tempArray.push(tempObj)
            //     }.bind(this))
            // }.bind(this))
            // var args = {
            //     groupId : this.queryArgs.groupId,
            //     list    : tempArray
            // }
            // return args;
        },

        onSureSending: function(){
            var args = this.getSendData();
            //this.collection.dispDns(args)
            this.showDisablePopup("下发中，请耐心等待...")
        },

        showDisablePopup: function(msg) {
            if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
            var options = {
                title    : "警告",
                body     : '<div class="alert alert-danger"><strong>' + msg +'</strong></div>',
                backdrop : 'static',
                type     : 0,
            }
            this.disablePopup = new Modal(options);
            this.disablePopup.$el.find(".close").remove();
        },

        initTable: function(){
            this.failedArray = [];
            for (var i = 0; i < this.failedNum; i++)
                this.failedArray.push(this.collection.models[i])
            this.table = $(_.template(template['tpl/dispSuggesttion/dispSuggesttion.table.html'])({
                data: this.failedArray,
                isFailed: true
            }));

            if (this.failedArray.length === 0){
                this.$el.find(".fail-table-ctn").html(_.template(template['tpl/empty.html'])());
                this.$el.find(".opt-ctn .sending").hide();
            } else {
                this.$el.find(".fail-table-ctn").html(this.table[0]);
                this.$el.find(".opt-ctn .sending").show(); 
            }

            this.nodesEl = this.table.find("tbody .nodes .edit")
            this.nodesEl.on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .nodes .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.table.find("tbody .nodes .weight").on("keyup", $.proxy(this.onKeyupItemWeightInput, this));
            this.table.find("tbody .nodes .weight").on("blur", $.proxy(this.onBlurItemWeightInput, this));
            this.table.find("tbody .nodes .node-string").on("click", $.proxy(this.onClickNodeString, this));
            this.table.find("tbody .nodes .weight").on("click", $.proxy(this.onClickItemWeightInput, this));

            this.table.find("tbody .add").on("click", $.proxy(this.onClickItemAdd, this));
            this.table.find("tbody .skip").on("click", $.proxy(this.onClickItemSkip, this));

            // this.table.find("tbody tr").find("input[type='checkbox']").on("click", $.proxy(this.onItemCheckedUpdated, this));
            // this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var model = this.collection.get(id);
            model.set("isChecked", eventTarget.checked)

            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") && model.get("isFailed");
            })
            if (checkedList.length === this.failedNum)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.failedNum)
                this.table.find("thead input").get(0).checked = false;
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                if (model.get("isFailed"))
                    model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
            //this.successTable.find("tbody tr").find("input").prop("checked", eventTarget.checked);
        },

        initSuccessTable: function(){
            this.successArray = [];
            for (var i = this.failedNum; i < this.collection.models.length; i++)
                this.successArray.push(this.collection.models[i])
            this.successTable = $(_.template(template['tpl/dispSuggesttion/dispSuggesttion.table.html'])({
                data: this.successArray,
                isFailed: false
            }));

            if (this.successArray.length === 0){
                this.$el.find(".success-table-ctn").html(_.template(template['tpl/empty.html'])());
                this.$el.find(".opt-ctn .sending").hide();
            } else {
                this.$el.find(".success-table-ctn").html(this.successTable[0]);
                this.$el.find(".opt-ctn .sending").show(); 
            }

            this.nodesEl = this.successTable.find("tbody .nodes .edit")
            this.nodesEl.on("click", $.proxy(this.onClickItemEdit, this));
            this.successTable.find("tbody .nodes .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.successTable.find("tbody .nodes .weight").on("keyup", $.proxy(this.onKeyupItemWeightInput, this));
            this.successTable.find("tbody .nodes .weight").on("blur", $.proxy(this.onBlurItemWeightInput, this));
            this.successTable.find("tbody .nodes .node-string").on("click", $.proxy(this.onClickNodeString, this));
            this.successTable.find("tbody .nodes .weight").on("click", $.proxy(this.onClickItemWeightInput, this));

            this.successTable.find("tbody .add").on("click", $.proxy(this.onClickItemAdd, this));
            //this.successTable.find("tbody .adjust").on("click", $.proxy(this.onClickItemAdjust, this));

            this.successTable.find("tbody tr").find("input[type='checkbox']").on("click", $.proxy(this.onSuccessItemCheckedUpdated, this));
            this.successTable.find("thead input").on("click", $.proxy(this.onSuccessAllCheckedUpdated, this));
        },

        onSuccessItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var model = this.collection.get(id);
            model.set("isChecked", eventTarget.checked)

            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") && !model.get("isFailed");
            })
            if (checkedList.length === this.successNum)
                this.successTable.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.successNum)
                this.successTable.find("thead input").get(0).checked = false;
        },

        onSuccessAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                if (!model.get("isFailed"))
                    model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.successTable.find("tbody tr").find("input").prop("checked", eventTarget.checked);
        },

        onClickNodeString: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId, value;
            value    = $(eventTarget).val();
            id       = $(eventTarget).attr("id");
            regionId = $(eventTarget).attr("region-id");
            var model = this.collection.get(regionId),
                list = model.get("listFormated");
            var selectedNode = _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })
            if (this.chartPopup) $("#" + this.chartPopup.modalId).remove();

            var aChartView = new ChartView({
                collection: this.collection, 
                selectedNode : selectedNode[0].attributes
            });

            var options = {
                title:"节点带宽数据展示",
                body : aChartView,
                backdrop : 'static',
                type     : 1,
                height   : 500,
                width    : 800,
                onHiddenCallback: function(){}.bind(this)
            }
            this.chartPopup = new Modal(options);
        },

        onKeyupItemWeightInput: function(event){
            var eventTarget = event.srcElement || event.target,
                value = $(eventTarget).val(),
                maxValue = $(eventTarget).attr("max"),
                re = /^\d+$/;
            if (!re.test(value)){
                $(eventTarget).val("1");
                return
            }
            if (parseInt(value) > parseInt(maxValue)){
                $(eventTarget).val("1")
            }
        },

        onBlurItemWeightInput: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId, value;
            value    = $(eventTarget).val();
            id       = $(eventTarget).attr("id");
            regionId = $(eventTarget).attr("region-id");
            var model = this.collection.get(regionId),
                list = model.get("listFormated");
            var selectedNode = _.filter(list ,function(obj) {
                return obj.get("id") === parseInt(id);
            })
            selectedNode[0].set("dispConfIpInfo.currNum", parseInt(value))
        },

        onClickItemWeightInput: function(event){
            var eventTarget = event.srcElement || event.target;
            $(eventTarget).focus();
        },

        onClickItemSkip: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var result = confirm("该区域当前没有服务节点，强制跳过将导致该区域使用上一级（默认）的调度策略！你真的想强制跳过吗？")
            if (!result) return;
            model.set("isSkip", true);
            $(eventTarget).off();
            $(eventTarget).html("已强制跳过")
        },

        onClickItemAdd: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), list = model.get("listFormated");

            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

            var selectNodeView = new SelectNodeView({
                collection: this.collection, 
                model     : model,
                groupId   : model.get('dispGroup.id'),
                regionId  : id,
                isEdit    : false,
                isShowChart: true
            });

            var options = {
                title:"选择节点",
                body : selectNodeView,
                backdrop : 'static',
                type     : 2,
                height   : 500,
                onOKCallback:  function(){
                    var options = selectNodeView.getArgs();
                    if (!options) return;
                    for (var k = 0; k < options.length; k++){
                        options[k]['dispGroup.id'] = model.get('dispGroup.id');
                        for (var i = 0; i < list.length; i++){
                            if (list[i].get("id") === parseInt(options[k]["node.id"])) options.splice(k, 1);
                            if (options.length === 0) {
                                alert("你选择的节点已经添加过了！")
                                this.selectNodePopup.$el.modal("hide");
                                return;
                            }
                        }
                    }
                    for(var m = 0; m < options.length; m++){
                        options[m].nodeChangeType = 2;
                        options[m].type = 1;
                        model.get("listFormated").push(new this.collection.model(options[m]))
                    }
                    this.collection.trigger("get.dispConfig.success")
                    this.selectNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.selectNodePopup = new Modal(options);
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id       = eventTarget.attr("id");
                regionId = eventTarget.attr("region-id");
            } else {
                id       = $(eventTarget).attr("id");
                regionId = $(eventTarget).attr("region-id");
            }
            var model = this.collection.get(regionId),
                list = model.get("listFormated");
            var selectedNode = _.filter(list ,function(obj) {
                return obj.get("id") === parseInt(id);
            })

            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

            var selectNodeView = new SelectNodeView({
                collection: this.collection, 
                model     : selectedNode[0],
                regionId  : regionId,
                isEdit    : true,
                isShowChart: true
            });

            var options = {
                title:"选择节点",
                body : selectNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = selectNodeView.getArgs();
                    if (!options) return;
                    var result = confirm("你确定要修改节点吗？")
                    if (!result) return;
                    for (var i = 0; i < list.length; i++){
                        if (list[i].get("id") === parseInt(options[0]["node.id"])){
                            alert("你选择的节点已经添加过了！")
                            this.selectNodePopup.$el.modal("hide");
                            return;
                        }
                    }
                    for (var k = 0; k < list.length; k++){
                        if (list[k].get("id") === parseInt(id)){
                            options[0]["dispConfIpInfo.adviceChangeNum"] = options[0]["dispConfIpInfo.currNum"] - selectedNode[0].get("dispConfIpInfo.currNum");
                            if (options[0]["dispConfIpInfo.adviceChangeNum"] > 0) 
                                options[0]["dispConfIpInfo.adviceChangeNum"] = "+" + options[0]["dispConfIpInfo.adviceChangeNum"];
                            var changeEl = list[k];
                            _.each(options[0], function(el, key, list){
                                changeEl.set(key, el)
                            }.bind(this))
                            list[k].set("nodeChangeType", 1);
                            break;
                        }
                    }
                    model.set("listFormated", list);
                    this.collection.trigger("get.dispConfig.success")
                    this.selectNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){this.enterKeyBindQuery();}.bind(this)
            }
            this.selectNodePopup = new Modal(options);
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id       = eventTarget.attr("id");
                regionId = eventTarget.attr("region-id");
            } else {
                id       = $(eventTarget).attr("id");
                regionId = $(eventTarget).attr("region-id");
            }
            var model = this.collection.get(regionId),
                list = model.get("listFormated");
            var selectedNode = _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })

            var result = confirm("你确定要删除节点 " + selectedNode[0].get("node.chName") + " 吗？")
            if (!result) return;
            _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })
            for (var i = 0; i < list.length; i++){
                if (list[i]["id"] === parseInt(id)){
                    list.splice(i, 1);
                    break;
                }
            }
            this.collection.get(regionId).set("listFormated", list);
            this.collection.trigger("get.dispConfig.success")
        },

        remove: function(){
            if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();
            this.disablePopup = null;
            this.selectNodePopup = null;
            this.collection.off();
            this.$el.remove();
            $(document).off('keydown');
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
            this.collection.getDispGroupList();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    exports.SelectNodeView = SelectNodeView;
    exports.DispSuggesttionView = DispSuggesttionView
});