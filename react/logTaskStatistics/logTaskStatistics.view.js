define("logTaskStatistics.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], 
    function(require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

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

            onGetUserListSuccess(res) {
                _.each(res.data, function(el){
                    this.userIdList.push(el.userId)
                }.bind(this))

                this.setState({
                    isLoadingUserId: false,
                });
            }

            handleSubmit(e){
                e&&e.preventDefault();
                const { getFieldsValue, validateFields} = this.props.form;
                var fieldsValue = getFieldsValue(),
                    ltProps = this.props.ltProps,
                    collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                validateFields(["accountId", "rangeTimePicker"], (err, vals) => {
                    queryCondition.accountId = vals.accountId || null;
                    if (fieldsValue.rangeTimePicker) {
                        queryCondition.startTime = vals.rangeTimePicker[0].valueOf();
                        queryCondition.endTime = vals.rangeTimePicker[1].valueOf();
                    } else {
                        queryCondition.startTime = null;
                        queryCondition.endTime = null;
                    }
                    queryCondition.taskName = fieldsValue.taskName || null;
                    queryCondition.domains = fieldsValue.domains || null;
                    console.log(queryCondition)
                    collection.trigger("fetching", queryCondition)
                })
            }

            onClickResetButton() {
                const { setFieldsValue } = this.props.form;
                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                setFieldsValue({"accountId": ""})
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
                            userId: value
                        });
                    }.bind(this));
                }
            }

            onGetDomainListSuccess(res) {
                var domainArray = res.data.map((el) => {
                        return <Option key={el.originDomain.domain}>{el.originDomain.domain}</Option>;
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
                                    {getFieldDecorator('accountId', {
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
                    "domains": null,
                    "accountId": null,
                    "startTime": null,
                    "endTime": null
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
                this.collection.on("get.chartData.success", $.proxy(this.initCharts, this));
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

            initCharts: function(res){
                if (!res) {
                    this.onResetChart();
                    return
                }
                var option = {
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line'
                    }]
                };
                this.$el.find(".chart1-ctn").html('<div class="chart1" style="width: 100%;height:500px;"></div>');
                this.$el.find(".chart2-ctn").html('<div class="chart2" style="width: 100%;height:500px;"></div>');
                this.chart1 = echarts.init(this.$el.find(".chart1").get(0));
                this.chart2 = echarts.init(this.$el.find(".chart2").get(0));
                this.chart1.setOption(option);
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