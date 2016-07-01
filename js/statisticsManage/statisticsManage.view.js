define("statisticsManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var TabStatisticsManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.type = options.type;

            this.$el = $(_.template(template['tpl/statisticsManage/statisticsManage.download.html'])());
            this.$el.find(".charts-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.threeTimeNode = this.$el.find(".three-time");
            this.threeTimeNode.find(".btn-default").on("click",  $.proxy(this.onClickSpecificTime, this));

            if (AUTH_OBJ.QueryCustomerBandwidth)
                this.$el.find(".query").on("click",  $.proxy(this.onClickApplyButton, this));
            else
                this.$el.find(".query").remove()

            this.initCalendar();

            this.collection.on("get.client.success", $.proxy(this.onGetAllCustomer, this));
            this.collection.on("get.client.error", $.proxy(this.onGetError, this));
            this.collection.getAllClient({type:this.type});

            this.collection.on("get.domain.success", $.proxy(this.onGetAllDomain, this));
            this.collection.on("get.domain.error", $.proxy(this.onGetError, this));

            this.collection.on("get.bandInfo.success", $.proxy(this.initCharts, this));
            this.collection.on("get.bandInfo.error", $.proxy(this.onGetError, this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onClickApplyButton: function(){
            if (this.chart) {
                this.chart.dispose();
                this.chart = null;
            }
            this.$el.find(".charts-ctn").html(_.template(template['tpl/loading.html'])({}));
            if (!this.startTime) this.startTime = new Date().format("yyyyMMdd") + "0000";
            if (!this.endTime) this.endTime = new Date().format("yyyyMMddhhmm");
            var args = {
                //clientName: this.clientName,
                userid: this.userId,
                domain: this.checkedDomain,
                startTime: this.startTime,
                endTime: this.endTime,
                type: this.type
            }
            this.collection.getBandInfo(args)
        },

        initCalendar: function(tpl,tplindex){
            var startOption = {
                lang:'ch',
                maxDate: new Date().format("yyyy/MM/dd"),
                // maxTime  : new Date().format("yyyy/MM/dd hh:mm"),
                value: new Date().format("yyyy/MM/dd") + " 00:00",
                //closeOnWithoutClick : false,
                timepicker: false,
                scrollInput: false,
                onChangeDateTime: function(){
                    var startTime = new Date(arguments[0]);
                    this.startTime = startTime.format("yyyyMMddhhmm");
                }.bind(this)
            };
            this.$el.find('#starttime').datetimepicker(startOption);

            var endOption = {
                lang:'ch',
                maxDate: new Date().format("yyyy/MM/dd"),
                // maxTime  : new Date().format("yyyy/MM/dd hh:mm"),
                value: new Date().format("yyyy/MM/dd hh:mm"),
                //closeOnWithoutClick : false,
                timepicker: false, 
                scrollInput: false,
                onChangeDateTime: function(){
                    var endTime = new Date(arguments[0]);
                    if (endTime.format("yyyyMMdd") === new Date().format("yyyyMMdd")){
                        this.endTime = endTime.format("yyyyMMddhhmm");
                    } else {
                        this.endTime = endTime.format("yyyyMMdd") + "2359";
                        this.$el.find('#endtime').val(endTime.format("yyyy/MM/dd") + " 23:59")
                    }
                }.bind(this)
            };
            this.$el.find('#endtime').datetimepicker(endOption);
        },

        onClickSpecificTime: function(event){
            this.threeTimeNode.find(".btn-default").removeClass("active");
            var eventTarget = event.srcElement || event.target;
            $(eventTarget).addClass("active");
            if ($(eventTarget).hasClass("day")){
                var startTime = new Date(), endTime = new Date();
                this.startTime = startTime.format("yyyyMMdd") + "0000";
                this.endTime   = endTime.format("yyyyMMddhhmm");
            }
            if ($(eventTarget).hasClass("month")){
                var timeDiff = new Date().valueOf() - 1000 * 60 * 60 * 24 * 30,
                    startTime = new Date(timeDiff),
                    endTime   = new Date();

                this.startTime = startTime.format("yyyyMMdd") + "0000";
                this.endTime   = endTime.format("yyyyMMddhhmm");
            }
            if ($(eventTarget).hasClass("week")){
                var timeDiff = new Date().valueOf() - 1000 * 60 * 60 * 24 * 6,
                    startTime = new Date(timeDiff),
                    endTime   = new Date();
                this.startTime = startTime.format("yyyyMMdd") + "0000";
                this.endTime   = endTime.format("yyyyMMddhhmm");
            }
            this.$el.find('#endtime').val(endTime.format("yyyy/MM/dd hh:mm"));
            this.$el.find('#starttime').val(startTime.format("yyyy/MM/dd") + " 00:00");
            this.onClickApplyButton();
        },

        onGetAllDomain: function(res){
            this.checkedDomain = res.join(";")
            var cityArray = [];
            _.each(res, function(el, index, list){
                cityArray.push({name:el, value: el})
            }.bind(this))
            if (this.searchSelect) this.searchSelect.destroy();
            this.searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-domain').get(0),
                panelID: this.$el.find('#dropdown-domain').get(0),
                isSingle: false,
                openSearch: true,
                selectWidth: 400,
                isDataVisible: false,
                defaultChecked: true,
                onOk: function(data){
                    var temp = [];
                    _.each(data, function(el, key, list){
                        temp.push(el.name)
                    }.bind(this))
                    this.checkedDomain = temp.join(";")
                }.bind(this),
                data: cityArray,
                callback: function(data) {
                    this.checkedDomain = data.join(";")
                    this.$el.find("#dropdown-domain .cur-value").html("选中域名个数：" + data.length + "/" + res.length)
                }.bind(this)
            });
            this.$el.find("#dropdown-domain .cur-value").html("选中域名个数：" + res.length + "/" + res.length);
            this.onClickApplyButton();
        },

        onGetAllCustomer: function(res){
            var nameList = [];
            _.each(res, function(el, index, list){
                nameList.push({name: el.userid + "-" +el.clientName, value:el.userid})
            });

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-customer').get(0),
                panelID: this.$el.find('#dropdown-customer').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 550,
                onOk: function(){},
                data: nameList,
                callback: function(data) {
                    this.clientName = data.name;
                    this.userId = data.value;
                    this.collection.getDomain({userid: data.value, type: this.type});
                    this.$el.find("#dropdown-customer .cur-value").html(this.clientName)
                }.bind(this)
            });
            this.$el.find("#dropdown-customer .cur-value").html(res[0].userid + "-" +res[0].clientName)
            this.collection.getDomain({userid: res[0].userid, type: this.type});
            this.clientName = res[0].userid + "-" +res[0].clientName;
            this.userId = res[0].userid;
        },

        initCharts: function(res){
            try{
                this.bandInfo = JSON.parse(res.calculateBandwidth.bandwidth)
                console.log(this.bandInfo)
                if (this.bandInfo.length === 0 || this.checkedDomain === ""){
                    this.$el.find(".charts-ctn").html(_.template(template['tpl/empty-2.html'])({data:{message: "汪伟在胸口摸索了一翻，但是却没有找到数据！"}}));
                    return
                }
                var timeData = [], domainData, bandwidthData = [], flowData = [];
                domainData = this.bandInfo[0];
                for (var i = 0; i < domainData.data.length; i++){
                    var tempObj = domainData.data[i];
                    timeData.push(tempObj.time * 1000)
                    var bandwidthCount = 0, flowCount = 0
                    for (var k = 0; k < this.bandInfo.length; k++){
                        bandwidthCount = bandwidthCount + parseFloat(this.bandInfo[k].data[i].bandwidth);
                        flowCount = flowCount + parseFloat(this.bandInfo[k].data[i].flow);
                    }
                    bandwidthData.push(bandwidthCount);
                    flowData.push(flowCount)
                }

                option = {
                    title: {
                        text: this.clientName,
                        subtext: '按产品要求，数据按1024转换, 带宽单位最大到Tbps，流量单位最大到TB',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            var str = "";
                            if (params[0].seriesName !== "流量")
                                str =  Utility.handlerToBps1024(params[0].value)
                            else
                                str = Utility.handlerToB1024(params[0].value)
                            return new Date(params[0].name).format("yyyy/MM/dd hh:mm") + '<br/>'
                                + params[0].seriesName + ' : ' + str;
                        },
                        axisPointer: {
                            animation: false
                        }
                    },
                    legend: {
                        data:['带宽', '流量'],
                        x: 'left'
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: 0,
                            end: 100,
                            xAxisIndex: [0, 1],
                            labelFormatter: function(value){
                                return new Date(timeData[value]).format("MM/dd hh:mm")
                            }
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            start: 0,
                            end: 100,
                            xAxisIndex: [0, 1],
                            labelFormatter: function(value){
                                return new Date(value).format("MM/dd hh:mm")
                            }
                        }
                    ],
                    grid: [{
                        left: 100,
                        right: 50,
                        height: '37%'
                    },
                    {
                        left: 100,
                        right: 50,
                        top: '53%',
                        height: '37%'
                    }],
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            axisLine: {onZero: true},
                            data: timeData,
                            axisLabel: {
                                formatter: function(value){
                                    return new Date(value).format("MM/dd hh:mm")
                                }
                            }
                        },
                        {
                            gridIndex: 1,
                            type : 'category',
                            boundaryGap : false,
                            axisLine: {onZero: true},
                            data: timeData,
                            axisLabel: {
                                formatter: function(value){
                                    return new Date(value).format("MM/dd hh:mm")
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name: "带宽",
                            axisLabel: {
                                formatter: Utility.handlerToBps1024
                            }
                        },
                        {
                            gridIndex: 1,
                            type : 'value',
                            name: "流量",
                            axisLabel: {
                                formatter: Utility.handlerToB1024
                            }
                        }
                    ],
                    series : [
                        {
                            name:'带宽',
                            type:'line',
                            symbolSize: 8,
                            hoverAnimation: false,
                            data: bandwidthData
                        },
                        {
                            name:'流量',
                            type:'line',
                            symbolSize: 8,
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            hoverAnimation: false,
                            data: flowData
                        }
                    ]
                };
                this.$el.find(".charts-ctn").html('<div class="chart" style="width: 100%;height:768px;"></div>');
                this.chart = echarts.init(this.$el.find(".chart").get(0));
                this.chart.setOption(option);
            } catch (e){
                alert("数据中心返回数据的JSON格式有误！")
            }
        },

        onResizeChart: function(){
            if (!this.chart) return;
            this.chart.resize();
        },

        remove: function(){
            this.$el.find('#starttime').datetimepicker("destroy");
            this.$el.find('#endtime').datetimepicker("destroy");
            this.$el.remove();
        },

        hide: function() {
            this.$el.hide();
        },

        update: function() {
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target);
            $(window).on('resize', $.proxy(this.onResizeChart, this));
        }
    });

    var StatisticsManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.liveCollection = options.liveCollection;

            this.$el = $(_.template(template['tpl/statisticsManage/statisticsManage.html'])({permission: AUTH_OBJ}));

            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(this.onShownTab, this));

            if (AUTH_OBJ.DownloadAccelerate){
                this.downloadStatisticsManageView = new TabStatisticsManageView({
                    collection: this.collection,
                    type: 1 //下载
                })
            }
        },

        onShownTab: function (e) {
            var eventTarget = e.target; // newly activated tab
            var id = $(eventTarget).attr("data-target");
            relatedID = $(e.relatedTarget).attr("data-target");
            switch(id){
                case "#valuable-customer-download":
                    this.currentTab = "#valuable-customer-download";
                    if (this.downloadStatisticsManageView)
                        this.downloadStatisticsManageView.onResizeChart();
                break;
                case "#valuable-customer-live":
                    this.currentTab = "#valuable-customer-live";
                    if(this.liveStatisticsManageView) {
                        this.liveStatisticsManageView.onResizeChart();
                        return;
                    }
                    this.liveStatisticsManageView = new TabStatisticsManageView({
                        collection: this.liveCollection,
                        type: 2 //直播
                    })
                    this.liveStatisticsManageView.render(this.$el.find("#valuable-customer-live"))
                break;
            }
        },

        remove: function(){
            if(this.downloadStatisticsManageView) this.downloadStatisticsManageView.remove();
            if(this.liveStatisticsManageView) this.liveStatisticsManageView.remove();
            this.$el.remove();
            this.collection.off();
            this.liveCollection.off();
        },

        hide: function() {
            this.$el.hide();
        },

        update: function() {
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target);
            if (AUTH_OBJ.DownloadAccelerate) 
                this.downloadStatisticsManageView.render(this.$el.find("#valuable-customer-download"))
            else if (AUTH_OBJ.LiveAccelerate) 
                this.$el.find('a[href="#valuable-customer-live"]').click();
        }
    });

    return StatisticsManageView;
});