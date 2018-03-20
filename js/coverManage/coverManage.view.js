define("coverManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var CoverManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.nodeCollection = options.nodeCollection;
            this.$el = $(_.template(template['tpl/coverManage/coverManage.html'])({permission: AUTH_OBJ}));
            this.$el.find(".map-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.on("get.map.success", $.proxy(this.onNodeListSuccess, this));
            this.collection.on("get.map.error", $.proxy(this.onGetError, this));
            this.nodeCollection.on("get.operator.success", $.proxy(this.initNodeDropMenu, this));
            this.nodeCollection.on("get.operator.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            if (AUTH_OBJ.FullScreen){
                this.$el.find(".opt-ctn .fullscreen").on("click", $.proxy(this.onLaunchFullScreen, this));
                $(document).on('keyup', $.proxy(this.onKeyupFullscreen, this));
            } else {
                this.$el.find(".opt-ctn .fullscreen").remove();
            }

            if (AUTH_OBJ.ShoworHideCoverrelateds){
                this.$el.find(".opt-ctn .show-relation").on("click", $.proxy(this.onClickShowRelation, this));   
                this.$el.find(".opt-ctn .hide-relation").on("click", $.proxy(this.onClickHideRelation, this));
            } else {
                this.$el.find(".opt-ctn .show-relation").remove();
                this.$el.find(".opt-ctn .hide-relation").remove();
            }
            if (AUTH_OBJ.ChoosetheShowWay){
                this.$el.find(".opt-ctn .node-region").on("click", $.proxy(this.onClickNode2Region, this));   
                this.$el.find(".opt-ctn .region-node").on("click", $.proxy(this.onClickRegion2Node, this));
            } else {
                this.$el.find(".opt-ctn .node-region").remove();
                this.$el.find(".opt-ctn .region-node").remove();
            }

            if (AUTH_OBJ.DomesticMaporInternationalMap){
                this.$el.find(".opt-ctn .global").on("click", $.proxy(this.onClickGlobal, this));   
                this.$el.find(".opt-ctn .china").on("click", $.proxy(this.onClickChina, this));
            } else {
                this.$el.find(".opt-ctn .global").remove();
                this.$el.find(".opt-ctn .global").remove();
            }  

            this.isPaused = false;
            this.isShowNodeRegion = true;
            this.isGlobal = false;
            this.operatorId = null;

            //this.mapDataTimer = setInterval($.proxy(this.onClickQueryButton, this), 63000);
            this.onClickQueryButton();
            this.nodeCollection.getOperatorList();
        },

        onClickGlobal: function(){
            this.isGlobal = true;
            this.onNodeListSuccess(this.mapAllData);
            this.$el.find(".opt-ctn .global").hide();
            this.$el.find(".opt-ctn .china").show();
        },

        onClickChina: function(){
            this.isGlobal = false;
            this.onNodeListSuccess(this.mapAllData);
            this.$el.find(".opt-ctn .global").show();
            this.$el.find(".opt-ctn .china").hide();
        },

        onClickNode2Region: function(){
            this.$el.find(".opt-ctn .node-region").hide();
            this.$el.find(".opt-ctn .region-node").show();
        },

        onClickRegion2Node: function(){
            this.$el.find(".opt-ctn .region-node").hide();
            this.$el.find(".opt-ctn .node-region").show();
        },

        onClickShowRelation: function(){
            this.isShowNodeRegion = true;
            this.onNodeListSuccess(this.mapAllData);
            this.$el.find(".opt-ctn .show-relation").hide();
            this.$el.find(".opt-ctn .hide-relation").show();
            this.$el.find(".opt-ctn .node-region").removeAttr("disabled");
            this.$el.find(".opt-ctn .region-node").removeAttr("disabled");
        },

        onClickHideRelation: function(){
            this.isShowNodeRegion = false;
            this.onNodeListSuccess(this.mapAllData);
            this.$el.find(".opt-ctn .hide-relation").hide();
            this.$el.find(".opt-ctn .show-relation").show();
            this.$el.find(".opt-ctn .node-region").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .region-node").attr("disabled", "disabled");
        },

        onLaunchFullScreen: function(){
            Utility.launchFullscreen(this.$el.find(".cover-ctn").get(0));
            var height = window.screen.height;
            this.$el.find(".map-ctn").css("height", height + 'px');
            this.$el.find(".cover-detail-ctn").css("height", height + 'px');
            this.$el.find(".node-list-ctn").css("height", height + 'px');
        },

        onKeyupFullscreen: function(event){
            event.stopPropagation();
            event.preventDefault();
            if (event.keyCode == 27 || event.keyCode == 122){
                this.$el.find(".map-ctn").css("height", '768px');
                this.$el.find(".cover-detail-ctn").css("height", '768px');
                this.$el.find(".node-list-ctn").css("height", '768px');
                this.onResizeChart();
            }
        },

        onGetError: function(error){
            this.isGettingMapData = false;
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            if (this.timer) clearInterval(this.timer);
            if (this.mapDataTimer) clearInterval(this.mapDataTimer);
        },

        onNodeListSuccess: function(res){
            this.mapAllData = res;
            this.$el.find(".last-update-time").html(new Date().format("yyyy/MM/dd hh:mm"))
            this.isGettingMapData = false;
            this.mapType = 'china';
            if (this.isGlobal) this.mapType = "world"
            var legendList = [], points = [], legendObjList = [],
                series = [
                    {
                        name: '全国',
                        type: 'map',
                        roam: true,
                        hoverable: false,
                        mapType: this.mapType,
                        itemStyle:{
                            normal:{
                                borderColor:'#fff',
                                borderWidth: 0.5,
                                areaStyle:{
                                    color: '#15A892'
                                },
                                label:{
                                    show: this.isGlobal ? false : true,
                                    textStyle: {
                                        color: '#333'
                                    }
                                }
                            }
                        },
                        data:[],
                        markPoint : {
                              symbolSize: 5,       // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
                              itemStyle: {
                                  normal: {
                                      borderColor: '#fff',
                                      borderWidth: 1,            // 标注边线线宽，单位px，默认为1
                                      label: {
                                          show: false,
                                          position:'top'
                                      },
                                      color: "#1e90ff"
                                  },
                                  emphasis: {
                                      borderColor: '#1e90ff',
                                      borderWidth: 4,
                                      label: {
                                          show: false
                                      },
                                      color: "red"
                                  }
                              },
                              data : []
                          },
                        markLine : {
                            smooth:true,
                            // effect : {
                            //     show: true,
                            //     scaleSize: 1,
                            //     period: 30,
                            //     color: '#fff',
                            //     shadowBlur: 10
                            // },
                            itemStyle : {
                                normal: {
                                    borderWidth:1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    },
                                    borderColor:'rgba(30,144,255, 0.8)'
                                }
                            },
                            // symbol: ['none', 'circle'],  
                            // symbolSize : 1,
                            // itemStyle : {
                            //     normal: {
                            //         color:'#fff',
                            //         borderWidth:1,
                            //         borderColor:'rgba(30,144,255,0.5)'
                            //     }
                            // },
                            data : [],
                        },
                        geoCoord: res.geoCoord
                    },
                    // {
                    //     name: 'alert',
                    //     type: 'map',
                    //     mapType: this.mapType,
                    //     data:[],
                    //     markPoint : {
                    //         symbol:'emptyCircle',
                    //         symbolSize : 15,
                    //         effect : {
                    //             show: true,
                    //             shadowBlur : 0
                    //         },
                    //         itemStyle:{
                    //             normal:{
                    //                 label:{show:false}
                    //             }
                    //         },
                    //         data : [
                    //             {name: "太原联通节点", value: 1000},
                    //             {name: "石家庄移动节点", value: 1000}
                    //         ]
                    //     }
                    // }
                ],
                allLine = [];

            _.each(res.relation, function(el, key, list){
                legendList.push(el.name);
                legendObjList.push({name:el.name, info:el.info});
                points.push({name: el.name, value: 0})
                var mapTemp = {
                        name: '',
                        type: 'map',
                        mapType: this.mapType,
                        data:[],
                        markLine : {
                            smooth:true,
                            effect : {
                                show: true,
                                scaleSize: 0.5,
                                period: 60,
                                color: '#fff',
                                shadowBlur: 5
                            },
                            itemStyle : {
                                normal: {
                                    borderWidth:1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data : []
                        },
                        markPoint : {
                            symbol: "none",//'emptyCircle',
                            // symbolSize : function (v){
                            //     return 10 + v/10
                            // },
                            // effect : {
                            //     show: true,
                            //     shadowBlur : 0
                            // },
                            // itemStyle:{
                            //     normal:{
                            //         label:{show:false}
                            //     },
                            //     emphasis: {
                            //         label:{position:'top'}
                            //     }
                            // },
                            data : []
                        }
                };
                mapTemp.name = el.name

                var dataFormated = [];
                _.each(el.data, function(element, key, list){
                    var temp = [];
                    temp.push(element.node);
                    temp.push(element.region);
                    dataFormated.push(temp)
                })

                mapTemp.markLine.data = dataFormated;

                var tempPoints = [];
                _.each(dataFormated, function(subEl, index, list){
                    tempPoints.push({name: subEl[1].name, value: subEl[1].value})
                    var tempArray = [];
                    tempArray.push({name: subEl[0].name}, {name: subEl[1].name})
                    allLine.push(tempArray);
                })

                mapTemp.markPoint.data = tempPoints;
                if (this.isShowNodeRegion) series.push(mapTemp)
            }.bind(this))

            //series[0].markLine.data = allLine;
            series[0].markPoint.data = points;
            this.legendObjList = legendObjList;

            this.initMap(legendList, series);
        },

        initMap: function(legendList, series){
            var selectedObj = {};
            _.each(legendList, function(el, index, ls) {
                if (index === 0)
                    selectedObj[el] = true;
                else
                    selectedObj[el] = false;
            })
            var splitList = [
                {start: 1000, label: "报警"},
                {start: 4, end: 4, label: 'L4'},
                {start: 3, end: 3, label: 'L3'},
                {start: 2, end: 2, label: 'L2'},
                {start: 1, end: 1, label: 'L1'},
                {start: 0, end: 0, label: 'L0'}
            ];
            var dataRangeColor = ['maroon', '#ff3333', 'orange', "yellow", 'lime', 'aqua']
            if (!this.isShowNodeRegion){
                splitList = [
                    {start: 1000, label: "报警"}
                ];
                dataRangeColor = ['maroon'];
            }
            var option = {
                backgroundColor: '#eee',
                color: ['gold','aqua','lime'],
                title : {
                    text: '',
                    subtext:'',
                    x:'center',
                    textStyle : {
                        color: '#fff'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: function(param){
                        var str = param[1];
                        if (param[1].indexOf("节点") > -1 && param[1].indexOf(">") === -1){
                            var node = _.find(this.mapAllData.relation, function(obj){
                                return obj.name === param[1];
                            }.bind(this))
                            str = param[1] + "<br>" +
                                  "上联带宽：<br>" +  
                                  "保底带宽：<br>" + 
                                  "实时带宽：" 
                        }
                        return str;
                    }.bind(this)
                },
                legend: {
                    show: false,
                    orient: 'horizontal',
                    x:'left',
                    y:'bottom',
                    data: legendList, //节点列表
                    selectedMode: 'single',
                    selected:selectedObj,
                    textStyle : {
                        color: '#fff'
                    }
                },
                toolbox: {
                    show : false,
                },
                dataRange: {
                    x:'left',
                    y:'top',
                    splitList: splitList,
                    color: dataRangeColor,
                    textStyle:{
                        color:'#000'
                    }
                },
                series : series
            };
            if (this.chart) this.chart.dispose();
            this.chart = echarts.init(this.$el.find(".map-ctn")[0]);
            this.chart.setOption(option);
            this.chart.on(echarts.config.EVENT.CLICK, function (){
                var obj = arguments[0]
                if (obj.name.indexOf("节点") > -1 && obj.name.indexOf(">") == -1){
                    var legend = this.chart.chart['map'].component.legend;
                    legend.setSelected(obj.name)

                    var id = 0
                    _.each(legendList, function(el, index, ls){
                        if (el === obj.name) id = index;
                    }.bind(this));

                    this.curNum = id;
                    this.$el.find(".node-list-ctn button").removeClass("active");
                    this.$el.find(".node-list-ctn").find('button[id="' + this.curNum +'"]').addClass("active");
                    this.renderNodeInfo();
                    if (!this.isPaused) this.$el.find(".opt-ctn .pause").click();
                }
            }.bind(this));

            this.$el.find(".node-list-ctn").html(_.template(template['tpl/coverManage/coverManage.nodelist.html'])({data: legendList}));

            this.$el.find(".node-list-ctn button").on("click", function(event){
                var eventTarget = event.srcElement || event.target, id;
                id = $(eventTarget).attr("id");

                this.$el.find(".node-list-ctn button").removeClass("active");
                $(eventTarget).addClass("active")

                var legend = this.chart.chart['map'].component.legend;
                legend.setSelected(legendList[parseInt(id)])

                this.curNum = parseInt(id);
                this.renderNodeInfo();
                if (!this.isPaused) this.$el.find(".opt-ctn .pause").click();
            }.bind(this))
            this.initTimer();
        },

        initTimer: function(argument) {
            $(window).off('resize', $.proxy(this.onResizeChart, this));
            $(window).on('resize', $.proxy(this.onResizeChart, this));

            if (AUTH_OBJ.AutoPlayorNot){
                this.$el.find(".opt-ctn .play").off();
                this.$el.find(".opt-ctn .play").on("click", function(){
                    this.isPaused = false;
                    if (this.timer) clearInterval(this.timer);
                    this.timer = setInterval($.proxy(this.setNodeDetail, this), 20000);
                    this.$el.find(".opt-ctn .pause").show();
                    this.$el.find(".opt-ctn .play").hide();
                }.bind(this));

                this.$el.find(".opt-ctn .pause").off();
                this.$el.find(".opt-ctn .pause").on("click", function(){
                    this.isPaused = true
                    if (this.timer) clearInterval(this.timer);
                    this.$el.find(".opt-ctn .pause").hide();
                    this.$el.find(".opt-ctn .play").show();
                }.bind(this));
            } else {
                this.$el.find(".opt-ctn .play").remove();
                this.$el.find(".opt-ctn .pause").remove();
            }

            this.$el.find(".opt-ctn #input-node-search").val("");
            this.$el.find(".opt-ctn #input-node-search").off();
            this.$el.find(".opt-ctn #input-node-search").on("keyup", $.proxy(this.onKeyupSearchNode, this));
            this.$el.find(".opt-ctn #input-node-search").on("keydown", function(e){
                if(e.keyCode == 13){
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            if(!this.curNum) this.curNum = 0;
            this.$el.find(".node-list-ctn").find('button[id="' + this.curNum + '"]').click();
            this.curNum = this.curNum + 1;
            //this.$el.find(".opt-ctn .play").click();
        },

        onKeyupSearchNode: function(event) {
            this.$el.find(".opt-ctn .pause").click()
            var keyWord = this.$el.find(".opt-ctn #input-node-search").val(),
                nodeElements = this.$el.find(".node-list-ctn .btn");
            if (event.keyCode !== 13){
                _.each(nodeElements, function(el, key, ls){
                    if (keyWord === ""){
                        $(el).show();
                    } else if ($(el).html().indexOf(keyWord) > -1){
                        $(el).show();
                    } else {
                        $(el).hide();
                    }
                })
            }
        },

        onResizeChart: function(){
            if (!this.chart) return;
            this.chart.resize();
            this.chart.refresh();
        },

        renderNodeInfo: function(){
            if (this.nodeDetail) this.nodeDetail.remove();
            this.nodeDetail = $(_.template(template['tpl/coverManage/coverManage.nodeinfo.html'])({data: this.legendObjList[this.curNum]}));
            this.nodeDetail.addClass("zoomIn animated");
            this.$el.find(".map-detail-ctn").html("");
            this.nodeDetail.appendTo(this.$el.find(".map-detail-ctn"))
        },

        setNodeDetail: function(){
            if (this.isGettingMapData) return;
            async.series([
                function(callback){
                    this.nodeDetail.addClass("zoomOut animated");
                    callback()
                }.bind(this),
                function(callback){
                    setTimeout(function(){
                        this.renderNodeInfo();
                        var legend = this.chart.chart['map'].component.legend;
                        legend.setSelected(this.legendObjList[this.curNum].name)
                        this.$el.find(".node-list-ctn button").removeClass("active");
                        this.$el.find(".node-list-ctn").find('button[id="' + this.curNum +'"]').addClass("active");
                        callback()
                    }.bind(this), 500)
                }.bind(this),                
                function(callback){
                    setTimeout(function(){
                        this.nodeDetail.removeClass("zoomIn animated");
                        this.curNum = this.curNum + 1;
                        if (this.curNum >= this.legendObjList.length)
                            this.curNum = 0;
                        callback()
                    }.bind(this), 500)
                }.bind(this)]
            );        
        },

        onClickQueryButton: function(){
            this.isGettingMapData = true;
            this.collection.getMapData({operatorId: this.operatorId});
        },

        initNodeDropMenu: function(res){
            this.operatorList = res
            var nameList = [{name: "全部", value: "All"}];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operation"), nameList, function(value){
                if (value === "all")
                    this.operatorId = null
                else
                    this.operatorId = parseInt(value)
                var keyWord = this.$el.find(".opt-ctn #input-node-search").val();
                if (keyWord) this.$el.find(".opt-ctn #input-node-search").val("");
                this.onClickQueryButton();
            }.bind(this));
        },

        hide: function(){
            this.$el.hide();
            if (this.mapDataTimer) clearInterval(this.mapDataTimer);
            this.$el.find(".opt-ctn .pause").click();
        },

        update: function(){
            this.$el.show();
            this.$el.find(".opt-ctn .play").click();
            if (this.mapDataTimer) clearInterval(this.mapDataTimer);
            //this.mapDataTimer = setInterval($.proxy(this.onClickQueryButton, this), 33000);
        },

        render: function(target) {
            this.$el.appendTo(target);
        },

        initMapTest: function(){
            var option = {
                backgroundColor: '#1b1b1b',
                color: ['gold','aqua','lime'],
                title : {
                    text: '',
                    subtext:'数据纯属虚构',
                    x:'center',
                    textStyle : {
                        color: '#fff'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: '{b}'
                },
                legend: {
                    show: false,
                    orient: 'horizontal',
                    x:'left',
                    y:'bottom',
                    data: ['北京 Top10', '上海 Top10', '广州 Top10'],
                    selectedMode: 'single',
                    selected:{
                        '上海 Top10' : false,
                        '广州 Top10' : false
                    },
                    textStyle : {
                        color: '#fff'
                    }
                },
                toolbox: {
                    show : false,
                },
                dataRange: {
                    x:'left',
                    y:'top',
                    min : 0,
                    max : 4,
                    calculable : true,
                    color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
                    textStyle:{
                        color:'#fff'
                    }
                },
                series : [
                    {
                        name: '全国',
                        type: 'map',
                        roam: true,
                        hoverable: true,
                        mapType: 'china',
                        itemStyle:{
                            normal:{
                                borderColor:'rgba(100,149,237,1)',
                                borderWidth:1,
                                areaStyle:{
                                    color: '#1b1b1b'
                                }
                            }
                        },
                        data:[],
                        markLine : {
                            smooth:true,
                            symbol: ['none', 'circle'],  
                            symbolSize : 1,
                            itemStyle : {
                                normal: {
                                    color:'#fff',
                                    borderWidth:1,
                                    borderColor:'rgba(30,144,255,0.5)'
                                }
                            },
                            data : [
                                [{name:'北京'},{name:'包头'}],
                                [{name:'北京'},{name:'北海'}],
                                [{name:'北京'},{name:'广州'}],
                                [{name:'北京'},{name:'郑州'}],
                                [{name:'北京'},{name:'长春'}],
                                [{name:'北京'},{name:'长治'}],
                                [{name:'北京'},{name:'重庆'}],
                                [{name:'北京'},{name:'长沙'}],
                                [{name:'北京'},{name:'成都'}],
                                [{name:'北京'},{name:'常州'}],
                                [{name:'北京'},{name:'丹东'}],
                                [{name:'北京'},{name:'大连'}],
                                [{name:'北京'},{name:'东营'}],
                                [{name:'北京'},{name:'延安'}],
                                [{name:'北京'},{name:'福州'}],
                                [{name:'北京'},{name:'海口'}],
                                [{name:'北京'},{name:'呼和浩特'}],
                                [{name:'北京'},{name:'合肥'}],
                                [{name:'北京'},{name:'杭州'}],
                                [{name:'北京'},{name:'哈尔滨'}],
                                [{name:'北京'},{name:'舟山'}],
                                [{name:'北京'},{name:'银川'}],
                                [{name:'北京'},{name:'衢州'}],
                                [{name:'北京'},{name:'南昌'}],
                                [{name:'北京'},{name:'昆明'}],
                                [{name:'北京'},{name:'贵阳'}],
                                [{name:'北京'},{name:'兰州'}],
                                [{name:'北京'},{name:'拉萨'}],
                                [{name:'北京'},{name:'连云港'}],
                                [{name:'北京'},{name:'临沂'}],
                                [{name:'北京'},{name:'柳州'}],
                                [{name:'北京'},{name:'宁波'}],
                                [{name:'北京'},{name:'南京'}],
                                [{name:'北京'},{name:'南宁'}],
                                [{name:'北京'},{name:'南通'}],
                                [{name:'北京'},{name:'上海'}],
                                [{name:'北京'},{name:'沈阳'}],
                                [{name:'北京'},{name:'西安'}],
                                [{name:'北京'},{name:'汕头'}],
                                [{name:'北京'},{name:'深圳'}],
                                [{name:'北京'},{name:'青岛'}],
                                [{name:'北京'},{name:'济南'}],
                                [{name:'北京'},{name:'太原'}],
                                [{name:'北京'},{name:'乌鲁木齐'}],
                                [{name:'北京'},{name:'潍坊'}],
                                [{name:'北京'},{name:'威海'}],
                                [{name:'北京'},{name:'温州'}],
                                [{name:'北京'},{name:'武汉'}],
                                [{name:'北京'},{name:'无锡'}],
                                [{name:'北京'},{name:'厦门'}],
                                [{name:'北京'},{name:'西宁'}],
                                [{name:'北京'},{name:'徐州'}],
                                [{name:'北京'},{name:'烟台'}],
                                [{name:'北京'},{name:'盐城'}],
                                [{name:'北京'},{name:'珠海'}],
                                [{name:'上海'},{name:'包头'}],
                                [{name:'上海'},{name:'北海'}],
                                [{name:'上海'},{name:'广州'}],
                                [{name:'上海'},{name:'郑州'}],
                                [{name:'上海'},{name:'长春'}],
                                [{name:'上海'},{name:'重庆'}],
                                [{name:'上海'},{name:'长沙'}],
                                [{name:'上海'},{name:'成都'}],
                                [{name:'上海'},{name:'丹东'}],
                                [{name:'上海'},{name:'大连'}],
                                [{name:'上海'},{name:'福州'}],
                                [{name:'上海'},{name:'海口'}],
                                [{name:'上海'},{name:'呼和浩特'}],
                                [{name:'上海'},{name:'合肥'}],
                                [{name:'上海'},{name:'哈尔滨'}],
                                [{name:'上海'},{name:'舟山'}],
                                [{name:'上海'},{name:'银川'}],
                                [{name:'上海'},{name:'南昌'}],
                                [{name:'上海'},{name:'昆明'}],
                                [{name:'上海'},{name:'贵阳'}],
                                [{name:'上海'},{name:'兰州'}],
                                [{name:'上海'},{name:'拉萨'}],
                                [{name:'上海'},{name:'连云港'}],
                                [{name:'上海'},{name:'临沂'}],
                                [{name:'上海'},{name:'柳州'}],
                                [{name:'上海'},{name:'宁波'}],
                                [{name:'上海'},{name:'南宁'}],
                                [{name:'上海'},{name:'北京'}],
                                [{name:'上海'},{name:'沈阳'}],
                                [{name:'上海'},{name:'秦皇岛'}],
                                [{name:'上海'},{name:'西安'}],
                                [{name:'上海'},{name:'石家庄'}],
                                [{name:'上海'},{name:'汕头'}],
                                [{name:'上海'},{name:'深圳'}],
                                [{name:'上海'},{name:'青岛'}],
                                [{name:'上海'},{name:'济南'}],
                                [{name:'上海'},{name:'天津'}],
                                [{name:'上海'},{name:'太原'}],
                                [{name:'上海'},{name:'乌鲁木齐'}],
                                [{name:'上海'},{name:'潍坊'}],
                                [{name:'上海'},{name:'威海'}],
                                [{name:'上海'},{name:'温州'}],
                                [{name:'上海'},{name:'武汉'}],
                                [{name:'上海'},{name:'厦门'}],
                                [{name:'上海'},{name:'西宁'}],
                                [{name:'上海'},{name:'徐州'}],
                                [{name:'上海'},{name:'烟台'}],
                                [{name:'上海'},{name:'珠海'}],
                                [{name:'广州'},{name:'北海'}],
                                [{name:'广州'},{name:'郑州'}],
                                [{name:'广州'},{name:'长春'}],
                                [{name:'广州'},{name:'重庆'}],
                                [{name:'广州'},{name:'长沙'}],
                                [{name:'广州'},{name:'成都'}],
                                [{name:'广州'},{name:'常州'}],
                                [{name:'广州'},{name:'大连'}],
                                [{name:'广州'},{name:'福州'}],
                                [{name:'广州'},{name:'海口'}],
                                [{name:'广州'},{name:'呼和浩特'}],
                                [{name:'广州'},{name:'合肥'}],
                                [{name:'广州'},{name:'杭州'}],
                                [{name:'广州'},{name:'哈尔滨'}],
                                [{name:'广州'},{name:'舟山'}],
                                [{name:'广州'},{name:'银川'}],
                                [{name:'广州'},{name:'南昌'}],
                                [{name:'广州'},{name:'昆明'}],
                                [{name:'广州'},{name:'贵阳'}],
                                [{name:'广州'},{name:'兰州'}],
                                [{name:'广州'},{name:'拉萨'}],
                                [{name:'广州'},{name:'连云港'}],
                                [{name:'广州'},{name:'临沂'}],
                                [{name:'广州'},{name:'柳州'}],
                                [{name:'广州'},{name:'宁波'}],
                                [{name:'广州'},{name:'南京'}],
                                [{name:'广州'},{name:'南宁'}],
                                [{name:'广州'},{name:'南通'}],
                                [{name:'广州'},{name:'北京'}],
                                [{name:'广州'},{name:'上海'}],
                                [{name:'广州'},{name:'沈阳'}],
                                [{name:'广州'},{name:'西安'}],
                                [{name:'广州'},{name:'石家庄'}],
                                [{name:'广州'},{name:'汕头'}],
                                [{name:'广州'},{name:'青岛'}],
                                [{name:'广州'},{name:'济南'}],
                                [{name:'广州'},{name:'天津'}],
                                [{name:'广州'},{name:'太原'}],
                                [{name:'广州'},{name:'乌鲁木齐'}],
                                [{name:'广州'},{name:'温州'}],
                                [{name:'广州'},{name:'武汉'}],
                                [{name:'广州'},{name:'无锡'}],
                                [{name:'广州'},{name:'厦门'}],
                                [{name:'广州'},{name:'西宁'}],
                                [{name:'广州'},{name:'徐州'}],
                                [{name:'广州'},{name:'烟台'}],
                                [{name:'广州'},{name:'盐城'}]
                            ],
                        },
                        geoCoord: {
                            '上海': [121.4648,31.2891],
                            '东莞': [113.8953,22.901],
                            '东营': [118.7073,37.5513],
                            '中山': [113.4229,22.478],
                            '临汾': [111.4783,36.1615],
                            '临沂': [118.3118,35.2936],
                            '丹东': [124.541,40.4242],
                            '丽水': [119.5642,28.1854],
                            '乌鲁木齐': [87.9236,43.5883],
                            '佛山': [112.8955,23.1097],
                            '保定': [115.0488,39.0948],
                            '兰州': [103.5901,36.3043],
                            '包头': [110.3467,41.4899],
                            '北京': [116.4551,40.2539],
                            '北海': [109.314,21.6211],
                            '南京': [118.8062,31.9208],
                            '南宁': [108.479,23.1152],
                            '南昌': [116.0046,28.6633],
                            '南通': [121.1023,32.1625],
                            '厦门': [118.1689,24.6478],
                            '台州': [121.1353,28.6688],
                            '合肥': [117.29,32.0581],
                            '呼和浩特': [111.4124,40.4901],
                            '咸阳': [108.4131,34.8706],
                            '哈尔滨': [127.9688,45.368],
                            '唐山': [118.4766,39.6826],
                            '嘉兴': [120.9155,30.6354],
                            '大同': [113.7854,39.8035],
                            '大连': [122.2229,39.4409],
                            '天津': [117.4219,39.4189],
                            '太原': [112.3352,37.9413],
                            '威海': [121.9482,37.1393],
                            '宁波': [121.5967,29.6466],
                            '宝鸡': [107.1826,34.3433],
                            '宿迁': [118.5535,33.7775],
                            '常州': [119.4543,31.5582],
                            '广州': [113.5107,23.2196],
                            '广州节点': [113.5107,23.2196],
                            '廊坊': [116.521,39.0509],
                            '延安': [109.1052,36.4252],
                            '张家口': [115.1477,40.8527],
                            '徐州': [117.5208,34.3268],
                            '德州': [116.6858,37.2107],
                            '惠州': [114.6204,23.1647],
                            '成都': [103.9526,30.7617],
                            '扬州': [119.4653,32.8162],
                            '承德': [117.5757,41.4075],
                            '拉萨': [91.1865,30.1465],
                            '无锡': [120.3442,31.5527],
                            '日照': [119.2786,35.5023],
                            '昆明': [102.9199,25.4663],
                            '杭州': [119.5313,29.8773],
                            '枣庄': [117.323,34.8926],
                            '柳州': [109.3799,24.9774],
                            '株洲': [113.5327,27.0319],
                            '武汉': [114.3896,30.6628],
                            '汕头': [117.1692,23.3405],
                            '江门': [112.6318,22.1484],
                            '沈阳': [123.1238,42.1216],
                            '沧州': [116.8286,38.2104],
                            '河源': [114.917,23.9722],
                            '泉州': [118.3228,25.1147],
                            '泰安': [117.0264,36.0516],
                            '泰州': [120.0586,32.5525],
                            '济南': [117.1582,36.8701],
                            '济宁': [116.8286,35.3375],
                            '海口': [110.3893,19.8516],
                            '淄博': [118.0371,36.6064],
                            '淮安': [118.927,33.4039],
                            '深圳': [114.5435,22.5439],
                            '清远': [112.9175,24.3292],
                            '温州': [120.498,27.8119],
                            '渭南': [109.7864,35.0299],
                            '湖州': [119.8608,30.7782],
                            '湘潭': [112.5439,27.7075],
                            '滨州': [117.8174,37.4963],
                            '潍坊': [119.0918,36.524],
                            '烟台': [120.7397,37.5128],
                            '玉溪': [101.9312,23.8898],
                            '珠海': [113.7305,22.1155],
                            '盐城': [120.2234,33.5577],
                            '盘锦': [121.9482,41.0449],
                            '石家庄': [114.4995,38.1006],
                            '福州': [119.4543,25.9222],
                            '秦皇岛': [119.2126,40.0232],
                            '绍兴': [120.564,29.7565],
                            '聊城': [115.9167,36.4032],
                            '肇庆': [112.1265,23.5822],
                            '舟山': [122.2559,30.2234],
                            '苏州': [120.6519,31.3989],
                            '莱芜': [117.6526,36.2714],
                            '菏泽': [115.6201,35.2057],
                            '营口': [122.4316,40.4297],
                            '葫芦岛': [120.1575,40.578],
                            '衡水': [115.8838,37.7161],
                            '衢州': [118.6853,28.8666],
                            '西宁': [101.4038,36.8207],
                            '西安': [109.1162,34.2004],
                            '贵阳': [106.6992,26.7682],
                            '连云港': [119.1248,34.552],
                            '邢台': [114.8071,37.2821],
                            '邯郸': [114.4775,36.535],
                            '郑州': [113.4668,34.6234],
                            '鄂尔多斯': [108.9734,39.2487],
                            '重庆': [107.7539,30.1904],
                            '金华': [120.0037,29.1028],
                            '铜川': [109.0393,35.1947],
                            '银川': [106.3586,38.1775],
                            '镇江': [119.4763,31.9702],
                            '长春': [125.8154,44.2584],
                            '长沙': [113.0823,28.2568],
                            '长治': [112.8625,36.4746],
                            '阳泉': [113.4778,38.0951],
                            '青岛': [120.4651,36.3373],
                            '韶关': [113.7964,24.7028]
                        }
                    },
                    {
                        name: '北京 Top10',
                        type: 'map',
                        mapType: 'china',
                        data:[],
                        markLine : {
                            smooth:true,
                            effect : {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle : {
                                normal: {
                                    borderWidth:1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data : [
                                [{name:'北京'}, {name:'上海',value:95}],
                                [{name:'北京'}, {name:'广州',value:90}],
                                [{name:'北京'}, {name:'大连',value:80}],
                                [{name:'北京'}, {name:'南宁',value:70}],
                                [{name:'北京'}, {name:'南昌',value:60}],
                                [{name:'北京'}, {name:'拉萨',value:50}],
                                [{name:'北京'}, {name:'长春',value:40}],
                                [{name:'北京'}, {name:'包头',value:30}],
                                [{name:'北京'}, {name:'重庆',value:20}],
                                [{name:'北京'}, {name:'常州',value:10}]
                            ]
                        },
                        markPoint : {
                            symbol:'emptyCircle',
                            symbolSize : function (v){
                                return 10 + v/10
                            },
                            effect : {
                                show: true,
                                shadowBlur : 0
                            },
                            itemStyle:{
                                normal:{
                                    label:{show:false}
                                },
                                emphasis: {
                                    label:{position:'top'}
                                }
                            },
                            data : [
                                {name:'上海',value:95},
                                {name:'广州',value:90},
                                {name:'大连',value:80},
                                {name:'南宁',value:70},
                                {name:'南昌',value:60},
                                {name:'拉萨',value:50},
                                {name:'长春',value:40},
                                {name:'包头',value:30},
                                {name:'重庆',value:20},
                                {name:'常州',value:10}
                            ]
                        }
                    },
                    {
                        name: '上海 Top10',
                        type: 'map',
                        mapType: 'china',
                        data:[],
                        markLine : {
                            smooth:true,
                            effect : {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle : {
                                normal: {
                                    borderWidth:1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data : [
                                [{name:'上海'},{name:'包头',value:95}],
                                [{name:'上海'},{name:'昆明',value:90}],
                                [{name:'上海'},{name:'广州',value:80}],
                                [{name:'上海'},{name:'郑州',value:70}],
                                [{name:'上海'},{name:'长春',value:60}],
                                [{name:'上海'},{name:'重庆',value:50}],
                                [{name:'上海'},{name:'长沙',value:40}],
                                [{name:'上海'},{name:'北京',value:30}],
                                [{name:'上海'},{name:'丹东',value:20}],
                                [{name:'上海'},{name:'大连',value:10}]
                            ]
                        },
                        markPoint : {
                            symbol:'emptyCircle',
                            symbolSize : function (v){
                                return 10 + v/10
                            },
                            effect : {
                                show: true,
                                shadowBlur : 0
                            },
                            itemStyle:{
                                normal:{
                                    label:{show:false}
                                },
                                emphasis: {
                                    label:{position:'top'}
                                }
                            },
                            data : [
                                {name:'包头',value:95},
                                {name:'昆明',value:90},
                                {name:'广州',value:80},
                                {name:'郑州',value:70},
                                {name:'长春',value:60},
                                {name:'重庆',value:50},
                                {name:'长沙',value:40},
                                {name:'北京',value:30},
                                {name:'丹东',value:20},
                                {name:'大连',value:10}
                            ]
                        }
                    },
                    {
                        name: '广州 Top10',
                        type: 'map',
                        mapType: 'china',
                        data:[],
                        markLine : {
                            smooth:true,
                            effect : {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle : {
                                normal: {
                                    borderWidth:1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data : [
                                [{name:'广州'},{name:'福州',value:95}],
                                [{name:'广州'},{name:'太原',value:90}],
                                [{name:'广州'},{name:'长春',value:80}],
                                [{name:'广州'},{name:'重庆',value:70}],
                                [{name:'广州'},{name:'西安',value:60}],
                                [{name:'广州'},{name:'成都',value:50}],
                                [{name:'广州'},{name:'常州',value:40}],
                                [{name:'广州'},{name:'北京',value:30}],
                                [{name:'广州'},{name:'北海',value:20}],
                                [{name:'广州'},{name:'海口',value:10}],
                                [{name:'广州节点'},{name:'海口',value:10}]
                            ]
                        },
                        markPoint : {
                            symbol:'emptyCircle',
                            symbolSize : function (v){
                                return 10 + v/10
                            },
                            effect : {
                                show: true,
                                shadowBlur : 0
                            },
                            itemStyle:{
                                normal:{
                                    label:{show:false}
                                },
                                emphasis: {
                                    label:{position:'top'}
                                }
                            },
                            data : [
                                {name:'福州',value:95},
                                {name:'太原',value:90},
                                {name:'长春',value:80},
                                {name:'重庆',value:70},
                                {name:'西安',value:60},
                                {name:'成都',value:50},
                                {name:'常州',value:40},
                                {name:'北京',value:30},
                                {name:'北海',value:20},
                                {name:'海口',value:10}
                            ]
                        }
                    }
                ]
            };

            this.chart = echarts.init(this.$el.find(".map-ctn")[0]);
            this.chart.setOption(option);
            this.chart.on(echarts.config.EVENT.CLICK, function (){
                console.log(arguments)
            })

            var legend = this.chart.chart['map'].component.legend;
            legend.setSelected('广州 Top10')
        },
    });

    return CoverManageView;
});