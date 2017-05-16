define("clientStatistics.view", ['require', 'exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var TabClientStatisticsView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.type = options.type;

            this.$el = $(_.template(template['tpl/clientStatistics/clientStatistics.download.html'])());
            this.$el.find(".charts-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.threeTimeNode = this.$el.find(".three-time");
            this.threeTimeNode.find(".btn-default").on("click",  $.proxy(this.onClickSpecificTime, this));

            if (AUTH_OBJ.QueryKACustomerBandwidth)
                this.$el.find(".query").on("click",  $.proxy(this.onClickApplyButton, this));
            else
                this.$el.find(".query").remove();

            this.collection.on("get.domainBand.success", $.proxy(this.initCharts, this));
            this.collection.on("get.domainBand.error", $.proxy(this.onGetError, this));

            this.start = 0;
            this.end = 29;
            this.isLoading = false;
            this.chartArray = [];
            this.initCalendar();
        },

        onGetError: function(error){
            this.isLoading = false;
            this.$el.find(".charts-ctn .loader").remove();
            if (error&&error.message){
                if (error.message.indexOf("没有数据") > -1)
                    this.onNoData(error.message)
                else
                    alert(error.message)
            } else {
                alert("网络阻塞，请刷新重试！")
            }
        },

        onNoData: function(msg){
            var alert = this.$el.find(".charts-ctn .alert-info").get(0);
            if (alert) {
                $(alert).find("strong").html("真的没有数据了！")
                return
            }
            var message = {
                isClose: false,
                type: "alert-info",
                message: msg
            }
            $(_.template(template['tpl/alert.message.html'])({data: message})).appendTo(this.$el.find(".charts-ctn"));
        },

        onClickApplyButton: function(){
            if (this.isLoading) return
            if (this.chartArray&&this.chartArray.length !== 0) {
                for(var i = 0; i < this.chartArray.length; i++){
                    this.chartArray[i].dispose();
                }
                this.chartArray = [];
            }
            this.$el.find(".charts-ctn").html(_.template(template['tpl/loading.html'])({}));
            if (!this.startTime) this.startTime = new Date().format("yyyyMMdd") + "0000";
            if (!this.endTime) this.endTime = new Date().format("yyyyMMddhhmm");
            this.start = 0;
            this.end = 29;
            var args = {
                start: this.start,
                end: this.end,
                startTime: this.startTime,
                endTime: this.endTime,
                type: this.type
            }
            this.collection.getDomainBandInfo(args)
            this.isLoading = true;
        },

        appendToCharts: function(){
            if (this.isLoading) return
            this.start = this.end + 1;
            this.end = this.end + 10;
            var alert = this.$el.find(".charts-ctn .alert-info").get(0);
            if (!alert) $(_.template(template['tpl/loading.html'])({})).appendTo(this.$el.find(".charts-ctn"));
            if (!this.startTime) this.startTime = new Date().format("yyyyMMdd") + "0000";
            if (!this.endTime) this.endTime = new Date().format("yyyyMMddhhmm");
            var args = {
                start: this.start,
                end: this.end,
                startTime: this.startTime,
                endTime: this.endTime,
                type: this.type
            }
            this.collection.getDomainBandInfo(args)
            this.isLoading = true;
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
            this.onClickApplyButton();
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
            this.$el.find(".charts-ctn .alert-info").remove();
            this.$el.find(".charts-ctn .loader").remove();
            // try{
                for (var i = 0; i < res.length; i++){
                    var domainArray = res[i];
                    var timeData = [], bandwidthData = [], damainNameArray = [], domainObj, preDomainObj;
                    for (var k = 0; k < domainArray.length; k++){
                        domainObj = JSON.parse(domainArray[k].calculateBandwidthResult.calculateBandwidth.bandwidth)[0];
                        if (domainArray[k].clientName === "" && domainObj) domainArray[k].clientName = "未知用户";
                        damainNameArray.push(domainArray[k].calculateBandwidthResult.calculateBandwidth.userId + "-" + domainArray[k].clientName);

                        if (k > 0) preDomainObj = JSON.parse(domainArray[k-1].calculateBandwidthResult.calculateBandwidth.bandwidth)[0];

                        var data = [];

                        if (domainObj){
                            if (preDomainObj && domainObj.data.length >= timeData.length) timeData = [];
                            for (var m = 0; m < domainObj.data.length; m++){
                                data.push(domainObj.data[m].bandwidth);
                                var tempTime = domainObj.data[m].time * 1000;
                                if (preDomainObj && domainObj.data.length >= timeData.length) timeData.push(tempTime);
                                if (!preDomainObj) timeData.push(tempTime);
                            }
                        } 
                        var seriesObj = {
                            name: domainArray[k].calculateBandwidthResult.calculateBandwidth.userId + "-" + domainArray[k].clientName,
                            type: 'line',
                            data: data
                        };
                        bandwidthData.push(seriesObj)
                    }

                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            formatter: function (params) {
                                var timeString = new Date(params[0].name).format("yyyy/MM/dd hh:mm"), message = '';
                                for (var n = 0; n < params.length; n++){
                                    message = message + params[n].seriesName + ": " + Utility.handlerToBps1024(params[n].data) + "<br>"
                                }
                                return timeString + "<br>" + message;
                            },
                        },
                        legend: {
                            data: damainNameArray,
                            bottom: "50px"
                            //orient: "vertical",
                            //top: "50px"
                        },
                        dataZoom: [
                            {
                                show: true,
                                realtime: true,
                                start: 0,
                                end: 100,
                                xAxisIndex: [0],
                                bottom: '25%',
                                showDetail: false,
                                labelFormatter: function(){
                                    return new Date(timeData[value]).format("MM/dd hh:mm")
                                }
                            }
                        ],
                        grid: {
                            left: '3%',
                            // right: '20%',
                            bottom: '32%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: timeData,
                            axisLabel: {
                                formatter: function(value){
                                    return new Date(value).format("MM/dd hh:mm")
                                }
                            }
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                formatter: Utility.handlerToBps1024
                            }
                        },
                        series: bandwidthData
                    };
                    if (this.start === 0 && i === 0) {
                        option.title = {
                            text: "Top100", 
                            subtext: '数据按1024转换, 带宽单位最大到Tbps，流量单位最大到TB',
                            x: 'center'
                        };
                    }
                    var randomId = Utility.randomStr(8)
                    var tpl = '<div class="chart" style="width: 100%;height:500px;" id="' + randomId + '"></div><hr>'
                    $(tpl).appendTo(this.$el.find(".charts-ctn"));
                    var chart = echarts.init(this.$el.find(".charts-ctn #" + randomId).get(0));
                    chart.setOption(option);
                    this.chartArray.push(chart)
                }
            // } catch (e){
            //     alert("数据中心返回数据的JSON格式有误！")
            // }
            this.onResizeChart();
            this.isLoading = false;
        },

        onScrollToBottom: function(){
            var hh = document.documentElement.clientHeight,
                scrollTop = document.body.scrollTop,
                scrollHHeight = document.body.scrollHeight;
            // console.log("clientHeight: " + hh);
            // console.log("scrollTop: " + scrollTop);
            // console.log("scrollHeight: " + scrollHHeight);
            if (scrollHHeight - (hh + scrollTop) < 20) {
                this.appendToCharts();
            }
        },

        onResizeChart: function(){
            if (!this.chartArray || this.chartArray.length === 0) return;
            for(var i = 0; i < this.chartArray.length; i++){
                this.chartArray[i].resize();
            }
        },

        remove: function(){
            this.$el.find('#starttime').datetimepicker("destroy");
            this.$el.find('#endtime').datetimepicker("destroy");
            $(window).off('resize', $.proxy(this.onResizeChart, this));
            this.offDocumentScroll();
            this.$el.remove();
        },

        onDocumentScroll: function(){
            $(document).on("scroll", $.proxy(this.onScrollToBottom, this));
        },

        offDocumentScroll: function(){
            $(document).off("scroll", $.proxy(this.onScrollToBottom, this));
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
            this.onDocumentScroll();
        }
    });

    var ClientStatisticsView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.liveCollection = options.liveCollection;

            this.$el = $(_.template(template['tpl/clientStatistics/clientStatistics.html'])());

            this.downloadClientStatisticsView = new TabClientStatisticsView({
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
                case "#valuable-client-download":
                    this.currentTab = "#valuable-client-download";
                    if(this.liveClientStatisticsView)
                        this.liveClientStatisticsView.offDocumentScroll();
                    this.downloadClientStatisticsView.onDocumentScroll();
                    this.downloadClientStatisticsView.onResizeChart();
                break;
                case "#valuable-client-live":
                    this.currentTab = "#valuable-client-live";
                    if(this.downloadClientStatisticsView)
                        this.downloadClientStatisticsView.offDocumentScroll();
                    if(this.liveClientStatisticsView){
                        this.liveClientStatisticsView.onDocumentScroll();
                        this.liveClientStatisticsView.onResizeChart();
                        return;
                    };
                    this.liveClientStatisticsView = new TabClientStatisticsView({
                        collection: this.liveCollection,
                        type: 2 //直播
                    })
                    this.liveClientStatisticsView.render(this.$el.find("#valuable-client-live"))
                break;
            }
        },

        remove: function(){
            if(this.downloadClientStatisticsView) this.downloadClientStatisticsView.remove();
            if(this.liveClientStatisticsView) this.liveClientStatisticsView.remove();
            this.$el.remove();
            this.collection.off();
            this.liveCollection.off();
        },

        hide: function() {
            this.$el.hide();
        },

        update: function(target) {
            this.collection.off();
            this.collection.reset();
            this.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target);
            this.downloadClientStatisticsView.render(this.$el.find("#valuable-client-download"))
        }
    });

    return ClientStatisticsView;
});