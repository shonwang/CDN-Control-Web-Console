define("domainStatistics.view", ['require', 'exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var TabDomainStatisticsView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.type = options.type;

            this.$el = $(_.template(template['tpl/domainStatistics/domainStatistics.download.html'])());
            this.$el.find(".charts-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.threeTimeNode = this.$el.find(".three-time");
            this.threeTimeNode.find(".btn-default").on("click",  $.proxy(this.onClickSpecificTime, this));
            this.$el.find(".query").on("click",  $.proxy(this.onClickApplyButton, this));
            this.initCalendar();
            setTimeout(function(){
                this.initCharts(); 
                $(document).on("scroll", function(){
                    var hh = document.documentElement.clientHeight,
                        scrollTop = document.body.scrollTop,
                        scrollHHeight = document.body.scrollHeight;
                    console.log("height:", hh)
                    console.log("scrollTop:", scrollTop)
                    console.log("scrollHeight:", scrollHHeight)

                    if (hh + scrollTop === scrollHHeight) {
                        console.log("到底")
                    }
                }.bind(this)) 
            }.bind(this), 1000)
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onClickApplyButton: function(){
            if (this.chartArray.length !== 0) {
                for(var i = 0; i < this.chartArray.length; i++){
                    this.chartArray[i].dispose();
                }
                this.chartArray = null;
            }
            this.$el.find(".charts-ctn").html(_.template(template['tpl/loading.html'])({}));
            if (!this.startTime) this.startTime = new Date().format("yyyyMMdd") + "0000";
            if (!this.endTime) this.endTime = new Date().format("yyyyMMddhhmm");
            var args = {
                clientName: this.clientName,
                domain: this.checkedDomain,
                startTime: this.startTime,
                endTime: this.endTime,
                type: this.type
            }
            //this.collection.getBandInfo(args)
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
                var timeDiff = new Date().valueOf() - 1000 * 60 * 60 * 24 * 15,
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

        initCharts: function(res){
            // this.bandInfo = JSON.parse(res.calculateBandwidth.bandwidth)
            // console.log(this.bandInfo)
            // if (this.bandInfo.length === 0 || this.checkedDomain === ""){
            //     this.$el.find(".charts-ctn").html(_.template(template['tpl/empty-2.html'])({data:{message: "汪伟在胸口摸索了一翻，但是却没有找到数据！"}}));
            //     return
            // }
            // var timeData = [], domainData, bandwidthData = [], flowData = [];
            // domainData = this.bandInfo[0];
            // for (var i = 0; i < domainData.data.length; i++){
            //     var tempObj = domainData.data[i];
            //     timeData.push(tempObj.time * 1000)
            //     var bandwidthCount = 0, flowCount = 0
            //     for (var k = 0; k < this.bandInfo.length; k++){
            //         bandwidthCount = bandwidthCount + parseFloat(this.bandInfo[k].data[i].bandwidth);
            //         flowCount = flowCount + parseFloat(this.bandInfo[k].data[i].flow);
            //     }
            //     bandwidthData.push(bandwidthCount);
            //     flowData.push(flowCount)
            // }

            // option = {
            //     title: {
            //         text: this.clientName,
            //         subtext: '按产品要求，数据按1000转换, 带宽单位最大到MB，流量单位最大到GB',
            //         x: 'center'
            //     },
            //     tooltip: {
            //         trigger: 'axis',
            //         formatter: function (params) {
            //             var str = "";
            //             if (params[0].seriesName !== "流量")
            //                 str =  Utility.handlerToBps(params[0].value)
            //             else
            //                 str = Utility.handlerToB(params[0].value)
            //             return new Date(params[0].name).format("yyyy/MM/dd hh:mm") + '<br/>'
            //                 + params[0].seriesName + ' : ' + str;
            //         },
            //         axisPointer: {
            //             animation: false
            //         }
            //     },
            //     legend: {
            //         data:['带宽', '流量'],
            //         x: 'left'
            //     },
            //     dataZoom: [
            //         {
            //             show: true,
            //             realtime: true,
            //             start: 30,
            //             end: 70,
            //             xAxisIndex: [0, 1],
            //             labelFormatter: function(value){
            //                 return new Date(value).format("MM/dd hh:mm")
            //             }
            //         },
            //         {
            //             type: 'inside',
            //             realtime: true,
            //             start: 30,
            //             end: 70,
            //             xAxisIndex: [0, 1],
            //             labelFormatter: function(value){
            //                 return new Date(value).format("MM/dd hh:mm")
            //             }
            //         }
            //     ],
            //     grid: [{
            //         left: 100,
            //         right: 50,
            //         height: '37%'
            //     },
            //     {
            //         left: 100,
            //         right: 50,
            //         top: '53%',
            //         height: '37%'
            //     }],
            //     xAxis : [
            //         {
            //             type : 'category',
            //             boundaryGap : false,
            //             axisLine: {onZero: true},
            //             data: timeData,
            //             axisLabel: {
            //                 formatter: function(value){
            //                     return new Date(value).format("MM/dd hh:mm")
            //                 }
            //             }
            //         },
            //         {
            //             gridIndex: 1,
            //             type : 'category',
            //             boundaryGap : false,
            //             axisLine: {onZero: true},
            //             data: timeData,
            //             axisLabel: {
            //                 formatter: function(value){
            //                     return new Date(value).format("MM/dd hh:mm")
            //                 }
            //             }
            //         }
            //     ],
            //     yAxis : [
            //         {
            //             type : 'value',
            //             name: "带宽",
            //             axisLabel: {
            //                 formatter: Utility.handlerToBps
            //             }
            //         },
            //         {
            //             gridIndex: 1,
            //             type : 'value',
            //             name: "流量",
            //             axisLabel: {
            //                 formatter: Utility.handlerToB
            //             }
            //         }
            //     ],
            //     series : [
            //         {
            //             name:'带宽',
            //             type:'line',
            //             symbolSize: 8,
            //             hoverAnimation: false,
            //             data: bandwidthData
            //         },
            //         {
            //             name:'流量',
            //             type:'line',
            //             symbolSize: 8,
            //             xAxisIndex: 1,
            //             yAxisIndex: 1,
            //             hoverAnimation: false,
            //             data: flowData
            //         }
            //     ]
            // };

            this.chartArray = [];
            this.$el.find(".charts-ctn").html("");
            for (var i = 0; i < 10; i++){
                var option = {
                    title: {
                        text: i + 1, 
                        subtext: '按产品要求，数据按1000转换, 带宽单位最大到MB，流量单位最大到GB',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['yinyuetai.hdllive.ks-cdn.com','联盟广告','视频广告','直接访问','搜索引擎1111'],
                        orient: "vertical",
                        right: "right",
                        top: "50px"
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: 30,
                            end: 70,
                            xAxisIndex: [0],
                            // labelFormatter: function(value){
                            //     return new Date(value).format("MM/dd hh:mm")
                            // }
                        },
                        // {
                        //     type: 'inside',
                        //     realtime: true,
                        //     start: 30,
                        //     end: 70,
                        //     xAxisIndex: [0],
                        //     labelFormatter: function(value){
                        //         return new Date(value).format("MM/dd hh:mm")
                        //     }
                        // }
                    ],
                    grid: {
                        left: '3%',
                        right: '20%',
                        bottom: '15%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一','周二','周三','周四','周五','周六','周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'yinyuetai.hdllive.ks-cdn.com',
                            type:'line',
                            stack: '总量',
                            data:[120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name:'联盟广告',
                            type:'line',
                            stack: '总量',
                            data:[220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name:'视频广告',
                            type:'line',
                            stack: '总量',
                            data:[150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name:'直接访问',
                            type:'line',
                            stack: '总量',
                            data:[320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name:'搜索引擎1111',
                            type:'line',
                            stack: '总量',
                            data:[820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                };
                var tpl = '<div class="chart" style="width: 100%;height:350px;" id="' + i + '"></div>'
                $(tpl).appendTo(this.$el.find(".charts-ctn"));
                var chart = echarts.init(this.$el.find(".charts-ctn #" + i).get(0));
                chart.setOption(option);
                this.chartArray.push(chart)
            }

            this.onResizeChart();
        },

        onResizeChart: function(){
            if (this.chartArray.length === 0) return;
            for(var i = 0; i < this.chartArray.length; i++){
                this.chartArray[i].resize();
            }
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

    var DomainStatisticsView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.liveCollection = options.liveCollection;

            this.$el = $(_.template(template['tpl/domainStatistics/domainStatistics.html'])());

            this.downloadDomainStatisticsView = new TabDomainStatisticsView({
                collection: this.collection,
                type: 1 //下载
            })

            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(this.onShownTab, this));
        },

        onShownTab: function (e) {
            var eventTarget = e.target; // newly activated tab
            var id = $(eventTarget).attr("data-target");
            relatedID = $(e.relatedTarget).attr("data-target");
            switch(id){
                case "#valuable-customer-download":
                    this.currentTab = "#valuable-customer-download";
                break;
                case "#valuable-customer-live":
                    this.currentTab = "#valuable-customer-live";
                    if(this.liveDomainStatisticsView) return;
                    this.liveDomainStatisticsView = new TabDomainStatisticsView({
                        collection: this.liveCollection,
                        type: 2 //直播
                    })
                    this.liveDomainStatisticsView.render(this.$el.find("#valuable-customer-live"))
                break;
            }
        },

        remove: function(){
            if(this.downloadDomainStatisticsView) this.downloadDomainStatisticsView.remove();
            if(this.liveDomainStatisticsView) this.liveDomainStatisticsView.remove();
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
            this.downloadDomainStatisticsView.render(this.$el.find("#valuable-customer-download"))
        }
    });

    return DomainStatisticsView;
});