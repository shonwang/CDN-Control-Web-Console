define("logTaskStatistics.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom", "moment"], 
    function(require, exports, template, BaseView, Utility, Antd, React, ReactDOM, moment) {

        var Layout = Antd.Layout,
            Content = Layout.Content,
            Breadcrumb = Antd.Breadcrumb,
            Button = Antd.Button,
            Input = Antd.Input,
            Form = Antd.Form,
            FormItem = Form.Item,
            Alert = Antd.Alert,
            Icon = Antd.Icon,
            Spin = Antd.Spin,
            Col = Antd.Col,
            Row = Antd.Row,
            Select = Antd.Select,
            AutoComplete = Antd.AutoComplete,
            Select = Antd.Select,
            DatePicker = Antd.DatePicker,
            RangePicker = DatePicker.RangePicker,
            Option = Select.Option; 

        class SearchForm extends React.Component {

            constructor(props, context) {
                super(props);
                this.handleSubmit = this.handleSubmit.bind(this);
                this.state = {
                    dataSourceUserId: [],
                    dataSourceDomains: [],
                    dataSourceTaskName: [],
                    isLoadingUserId: true
                }
                this.userIdList = [];
            }

            componentDidMount() {
                var ltProps = this.props.ltProps,
                collection = ltProps.collection;
                require(['customerSetup.model'],function(CustomerSetupModel){
                    var customerSetup = new CustomerSetupModel();
                    customerSetup.on("get.user.success", $.proxy(this.onGetUserListSuccess, this))
                    customerSetup.on("get.user.error", $.proxy(this.onGetError, this))
                    customerSetup.queryChannel({currentPage: 1,pageSize: 99999});
                }.bind(this));
            }

            componentWillUnmount() {
                const collection = this.props.ltProps.collection;
                collection.off("statistics.chart2.200.success")
                collection.off("statistics.chart1.success")
                collection.off("statistics.chart2.not200.success")
            }

            onGetUserListSuccess(res) {
                _.each(res.data, function(el){
                    this.userIdList.push(el.userId)
                }.bind(this))

                this.setState({
                    isLoadingUserId: false,
                });

                var ltProps = this.props.ltProps,
                collection = ltProps.collection;
                collection.on("statistics.chart2.200.success", $.proxy(this.onGetChart2Data200, this));
                collection.on("statistics.chart1.success", $.proxy(this.onGetChart1Data, this));
                collection.on("statistics.chart2.not200.success", $.proxy(this.onGetChart2DataNot200, this));
            }

            onGetChart1Data(res) {
                this.chart1Data = res;
                var ltProps = this.props.ltProps,
                collection = ltProps.collection;
                this.queryCondition.status200 = true;
                collection.getTaskStatistics(this.queryCondition)
            }

            onGetChart2Data200(res) {
                this.chart2Data200 = res;
                var ltProps = this.props.ltProps,
                collection = ltProps.collection;
                this.queryCondition.status200 = false;
                collection.getTaskStatistics(this.queryCondition)
            }

            onGetChart2DataNot200(res) {
                this.chart2DataNot200 = res;
                this.queryCondition.status200 = null;
                var ltProps = this.props.ltProps,
                collection = ltProps.collection;
                var timeDataChart1 = [], 
                    countDataChart1 = [], 
                    timeDataChart2 = [],
                    count200DataChart2 = [],
                    countNot200DataChart2 = [];
                _.each(this.chart1Data, function(el){
                    timeDataChart1.push(el.logTimestamp);
                    countDataChart1.push(el.count)
                })
                _.each(this.chart2Data200, function(el){
                    timeDataChart2.push(el.logTimestamp);
                    count200DataChart2.push(el.count)
                })
                _.each(this.chart2DataNot200, function(el){
                    countNot200DataChart2.push(el.count)
                })

                collection.trigger("get.chartData.success", timeDataChart1, countDataChart1, timeDataChart2, count200DataChart2, countNot200DataChart2);
            }

            handleSubmit(e){
                e&&e.preventDefault();
                const { getFieldsValue, validateFields} = this.props.form;
                var fieldsValue = getFieldsValue(),
                    ltProps = this.props.ltProps,
                    collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                validateFields(["userId", "rangeTimePicker"], function(err, vals) {
                    if (!err) {
                        queryCondition.userId = vals.userId || null;
                        if (fieldsValue.rangeTimePicker) {
                            queryCondition.startTime = vals.rangeTimePicker[0].valueOf();
                            queryCondition.endTime = vals.rangeTimePicker[1].valueOf();
                        } else {
                            queryCondition.startTime = null;
                            queryCondition.endTime = null;
                        }
                        queryCondition.taskName = fieldsValue.taskName || null;
                        queryCondition.domains = fieldsValue.domains || null;

                        // queryCondition.userId = "yy_custom"
                        this.queryCondition = queryCondition
                        collection.getTaskStatistics(queryCondition)
                        collection.trigger("fetching")
                    }
                }.bind(this))
            }

            onClickResetButton() {
                const { setFieldsValue } = this.props.form;
                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                setFieldsValue({"userId": ""})
                setFieldsValue({"domains": []})
                setFieldsValue({"taskName": ""})
                setFieldsValue({"rangeTimePicker": null})
                collection.trigger("reset.chart")
            }

            handleUserIdSearch(value) {
                if (value.length < 3) return;
                var IdArray = [], userIdList = this.userIdList;
                if (value && userIdList) {
                    IdArray = _.filter(userIdList, function(el){
                        var id = el + ""
                        return id.indexOf(value) > -1
                    }.bind(this)).map((el) => {
                        el = el + ""
                        return <Option key={el}>{el}</Option>;
                    })
                }

                this.setState({
                    dataSourceUserId: IdArray
                });
            }

            onAccountIdChange(value) {
                const { setFieldsValue, getFieldsValue } = this.props.form;
                setFieldsValue({"domains": []})
                this.setState({
                    dataSourceDomains: []
                })

                if (value) {
                    require(['domainList.model'],function(DomainListModel){
                        var domainListModel = new DomainListModel();
                        domainListModel.on("query.domain.success", $.proxy(this.onGetDomainListSuccess, this))
                        domainListModel.on("query.domain.error", $.proxy(this.onGetError, this))
                        domainListModel.getDomainInfoList({
                            currentPage: 1,
                            pageSize: 99999,
                            userId: parseInt(value)
                        });
                    }.bind(this));
                    // require(['statisticsManage.model'],function(DomainListModel){
                    //     var domainListModel = new DomainListModel();
                    //     domainListModel.on("get.domain.success", $.proxy(this.onGetDomainListSuccess, this))
                    //     domainListModel.on("get.domain.error", $.proxy(this.onGetError, this))
                    //     domainListModel.getDomain({
                    //         userid: value
                    //     });
                    // }.bind(this));
                }
            }

            onGetDomainListSuccess(res) {
                var domainArray = res.data.map((el) => {
                        return <Option key={el.originDomain.domain}>{el.originDomain.domain}</Option>;
                        //return <Option key={el}>{el}</Option>;
                    })
                this.setState({
                    dataSourceDomains: domainArray
                })
            }

            onGetError (error){
                if (error && error.message)
                    Utility.alerts(error.message);
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }

            disabledDate(current) {
                return current && current < moment().add(-90,'day')
            }

            render(){
                const { getFieldDecorator } = this.props.form;
                const { dataSource } = this.state;
                const ltProps = this.props.ltProps;
                const formItemLayout = {
                  labelCol: { span: 6 },
                  wrapperCol: { span: 12 },
                };

                var HorizontalForm = (
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label="客户ID">
                                    {getFieldDecorator('userId', {
                                        initialValue: "",
                                        rules: [{ required: true, message: '请输入客户ID!' }]
                                    })(
                                        <AutoComplete
                                            style={{ width: 250 }}
                                            onBlur={$.proxy(this.onAccountIdChange, this)}
                                            onSearch={$.proxy(this.handleUserIdSearch, this)}>
                                            {this.state.dataSourceUserId}
                                        </AutoComplete>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...formItemLayout} label={"域名"}>
                                    {getFieldDecorator('domains', {
                                        initialValue: [],
                                    })(
                                        <Select mode="multiple" allowClear={true} style={{ width: 300 }}
                                            placeholder={'请选择'}
                                            maxTagCount={1}
                                            notFoundContent={<Spin size="small" />} 
                                            filterOption={false} >
                                            {this.state.dataSourceDomains}       
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...formItemLayout} label={"任务名称"}>
                                    {getFieldDecorator('taskName', {
                                        initialValue: "",
                                    })(
                                        <Select
                                            showSearch
                                            allowClear={true}
                                            style={{ width: 200 }}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        {this.state.dataSourceTaskName}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={"时间"}>
                                    {getFieldDecorator('rangeTimePicker', {
                                            rules: [{ type: 'array', required: true, message: '请选择起止时间！' }],
                                        })(
                                        <RangePicker showTime={{ format: 'HH:mm', minuteStep: 30 }} 
                                                    format="YYYY/MM/DD HH:mm" 
                                                    disabledDate={this.disabledDate}
                                                    disabledTime={this.disabledTime} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={2}></Col>
                            <Col span={8}>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" icon="search">查询</Button>
                                    <Button style={{ marginLeft: 8 }} icon="reload" onClick={$.proxy(this.onClickResetButton, this)}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                );

                var SearchFormView = null;
                if (this.state.isLoadingUserId)
                    SearchFormView = (<div style={{textAlign: "center"}}><Spin /></div>)
                else
                    SearchFormView = HorizontalForm;
                return SearchFormView
            }
        }

        var WrappedSearchForm = Form.create()(SearchForm);

        class LogTaskStatisticsChart extends React.Component {
            constructor(props, context) {
                super(props);
                this.state = {
                    breadcrumbTxt: ["日志管理", "任务统计"]
                }
            }

            render(){
                this.queryCondition = {
                    "taskName": null,
                    "domain": null,
                    "userId": null,
                    "startTime": null,
                    "endTime": null,
                    "status200": null
                }

                this.ltProps = {
                    collection: this.props.collection,
                    queryCondition: this.queryCondition
                }

                return (     
                    <Layout>
                        <Content>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>{this.state.breadcrumbTxt[0]}</Breadcrumb.Item>
                                <Breadcrumb.Item>{this.state.breadcrumbTxt[1]}</Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                                <WrappedSearchForm ltProps={this.ltProps} />
                                <hr/>
                                <div className="charts-container">
                                    <div className="row">
                                      <div className="col-md-6 chart1-ctn"></div>
                                      <div className="col-md-6 chart2-ctn"></div>
                                    </div>
                                </div>
                            </div>
                        </Content>
                    </Layout>
                )
            }
        }

        var LogTaskStatisticsView = BaseView.extend({
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template('<div class="log-manage"></div>')());

                this.collection.on("fetching", $.proxy(this.onSearch, this));
                this.collection.on("get.chartData.success", $.proxy(this.initChart1, this));
                this.collection.on("statistics.chart.error", $.proxy(this.onGetError, this));
                this.collection.on("reset.chart", $.proxy(this.onResetChart, this))

                var logTaskListFactory = React.createFactory(LogTaskStatisticsChart);
                var logTaskList = logTaskListFactory({
                    collection: this.collection
                });
                ReactDOM.render(logTaskList, this.$el.get(0));
            },

            onSearch: function(res) {
                this.$el.find(".chart1-ctn").html(_.template(template['tpl/loading.html'])({}))
                this.$el.find(".chart2-ctn").html(_.template(template['tpl/loading.html'])({}))
            },

            onResetChart: function() {
                if(this.chart1){
                    this.chart1.dispose();
                    this.chart1 = null;
                }
                if(this.chart2){
                    this.chart2.dispose();
                    this.chart2 = null;
                }
                this.$el.find(".chart1-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "No Data"
                    }
                }));
                this.$el.find(".chart2-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "No Data"
                    }
                }));
            },

            initChart1: function(timeDataChart1, countDataChart1, timeDataChart2, count200DataChart2, countNot200DataChart2){
                var option = {
                    title: {
                        text: '---',
                        show: false
                    },
                    backgroundColor: "#fcfcfc",
                    color: ["#56aff0"],
                    tooltip: {
                        backgroundColor: "#fff",
                        borderColor: "#bfbfbf",
                        borderWidth: 1,
                        extraCssText: 'box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3)',
                        textStyle: {
                            color: "#000"
                        },
                        trigger: 'axis',
                        formatter:function(param){
                            var arr=[];
                            arr.push('<div>时间：'+new Date(param[0].name).format("yyyy年MM月dd日 hh:mm")+'</div>');
                            arr.push('<div class="tooltip-content-value">总日指数：'+ param[0].value +'</div>');
                            return arr.join('');
                        }
                    },
                    legend: {
                        data: '---',
                        top: 10,
                    },
                    toolbox: {
                        show: false
                    },
                    grid: {
                        left: '50',
                        right: '50',
                        top: "50",
                        containLabel: true,
                        borderColor: "#ccc",
                        show: true,
                        borderWidth: 1
                    },
                    xAxis: [{
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#ccc",
                                type: "solid"
                            }
                        },
                        type: 'category',
                        boundaryGap: false,
                        data: timeDataChart1,
                        axisTick: {
                            show: true
                        },
                        splitLine: {
                            show: true
                        },
                        axisLabel: {
                            formatter: function(value) {
                                return new Date(value).format("MM/dd hh:mm")
                            },
                            textStyle: {
                                color: "#000"
                            }
                        }
                    }],
                    yAxis: [{
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#ccc",
                                type: "solid"
                            }
                        },
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: true
                        },
                        axisLabel: {
                            textStyle: {
                                color: "#000"
                            }
                        }
                    }],
                    dataZoom: {
                        show: true,
                        start: 0,
                        labelFormatter: function(value) {
                            return new Date(timeDataChart1[value]).format("MM/dd\nhh:mm")
                        }
                    },
                    series: [{
                        name: "",
                        type: 'line',
                        data: countDataChart1,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default',
                                    color: 'rgba(40,154,244,0.5)'
                                }
                            }
                        }
                    }]
                };
                this.$el.find(".chart1-ctn").html('<div class="chart1" style="width: 100%;height:500px;"></div>');
                if(this.chart1){
                    this.chart1.dispose();
                    this.chart1 = null;
                }
                this.chart1 = echarts.init(this.$el.find(".chart1").get(0));
                this.chart1.setOption(option);

                this.initChart2(timeDataChart2, count200DataChart2, countNot200DataChart2);
            },

            initChart2: function(timeDataChart2, count200DataChart2, countNot200DataChart2){
                var option = {
                        title: {
                            show:false
                        },
                        backgroundColor:"#fcfcfc",
                        color:["#289af4", "#f64686"],
                        tooltip : {
                            backgroundColor:"#fff",
                            borderColor:"#bfbfbf",
                            borderWidth:1,
                            extraCssText: 'box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3)',
                            textStyle:{
                                color:"#000"
                            },
                            trigger: 'axis',
                            formatter:function(params){
                                var arr=[];
                                var time = new Date(params[0].name).format("yyyy/MM/dd hh:mm");
                                arr.push('<div>'+time+'</div>');
                                for(var i=0;i<params.length;i++){
                                    var _name=params[i].seriesName;
                                    var value=params[i].value;
                                    arr.push('<div class="tooltip-content-value">'+_name+"："+ value +'</div>');
                                }
                                return arr.join('');
                            }
                        },
                        legend: {
                            data:["200", "非200"],
                            top:10
                        },
                        toolbox: {
                            show:false
                        },
                        grid: {
                            left: '50',
                            right: '50',
                            top:"50",
                            containLabel: true,
                            borderColor:"#ccc",
                            show:true,
                            borderWidth:1
                        },
                        dataZoom: {
                            show: true,
                            start: 0,
                            labelFormatter: function(value) {
                                return new Date(timeDataChart2[value]).format("MM/dd\nhh:mm")
                            }
                        },
                        xAxis : [
                            {
                                axisLine:{
                                    show:true,
                                    lineStyle:{
                                        color:"#ccc",
                                        type:"solid"
                                    }
                                },
                                type : 'category',
                                boundaryGap : false,
                                data : timeDataChart2,
                                axisTick: {show:true},
                                splitLine:{
                                    show:true
                                },
                                axisLabel:{
                                    formatter: function(value){
                                        return new Date(value).format("MM/dd hh:mm")
                                    },
                                    textStyle:{
                                        color:"#000"
                                    }
                                }
                            }
                        ],
                        yAxis : [
                            {
                                axisLine:{
                                    show:true,
                                    lineStyle:{
                                        color:"#ccc",
                                        type:"solid"
                                    }
                                },
                                type : 'value',
                                axisTick: {show:false},
                                splitLine:{
                                    show:true
                                },
                                axisLabel:{
                                    textStyle:{
                                        color:"#000"
                                    }
                                }
                            }
                        ],
                        series : [
                            {
                                data:count200DataChart2,
                                type:"line",
                                name:"200"
                            },{
                                data:countNot200DataChart2,
                                type:"line",
                                name:"非200"
                            },
                        ]
                };
                this.$el.find(".chart2-ctn").html('<div class="chart2" style="width: 100%;height:500px;"></div>');
                if(this.chart2){
                    this.chart2.dispose();
                    this.chart2 = null;
                }
                this.chart2 = echarts.init(this.$el.find(".chart2").get(0));
                this.chart2.setOption(option);
            },

            onResizeChart: function(){
                if (this.chart1)
                    this.chart1.resize();
                if (this.chart2)
                    this.chart2.resize();
            },

            render: function(target) {
                this.$el.appendTo(target);
                $(window).on('resize', $.proxy(this.onResizeChart, this));
            }
        })
        return LogTaskStatisticsView;
    }
);