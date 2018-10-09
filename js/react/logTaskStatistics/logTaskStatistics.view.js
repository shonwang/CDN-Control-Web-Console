'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("logTaskStatistics.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom", "moment"], function (require, exports, template, BaseView, Utility, Antd, React, ReactDOM, moment) {

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

    var SearchForm = function (_React$Component) {
        _inherits(SearchForm, _React$Component);

        function SearchForm(props, context) {
            _classCallCheck(this, SearchForm);

            var _this = _possibleConstructorReturn(this, (SearchForm.__proto__ || Object.getPrototypeOf(SearchForm)).call(this, props));

            _this.handleSubmit = _this.handleSubmit.bind(_this);
            _this.state = {
                dataSourceUserId: [],
                dataSourceDomains: [],
                dataSourceTaskName: [],
                isLoadingUserId: true
            };
            _this.userIdList = [];
            return _this;
        }

        _createClass(SearchForm, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                require(['customerSetup.model'], function (CustomerSetupModel) {
                    var customerSetup = new CustomerSetupModel();
                    customerSetup.on("get.user.success", $.proxy(this.onGetUserListSuccess, this));
                    customerSetup.on("get.user.error", $.proxy(this.onGetError, this));
                    customerSetup.queryChannel({ currentPage: 1, pageSize: 99999 });
                }.bind(this));
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var collection = this.props.ltProps.collection;
                collection.off("statistics.chart2.200.success");
                collection.off("statistics.chart1.success");
                collection.off("statistics.chart2.not200.success");
            }
        }, {
            key: 'onGetUserListSuccess',
            value: function onGetUserListSuccess(res) {
                _.each(res.data, function (el) {
                    this.userIdList.push(el.userId);
                }.bind(this));

                this.setState({
                    isLoadingUserId: false
                });

                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                collection.on("statistics.chart2.200.success", $.proxy(this.onGetChart2Data200, this));
                collection.on("statistics.chart1.success", $.proxy(this.onGetChart1Data, this));
                collection.on("statistics.chart2.not200.success", $.proxy(this.onGetChart2DataNot200, this));
            }
        }, {
            key: 'onGetChart1Data',
            value: function onGetChart1Data(res) {
                this.chart1Data = res;
                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                this.queryCondition.status200 = true;
                collection.getTaskStatistics(this.queryCondition);
            }
        }, {
            key: 'onGetChart2Data200',
            value: function onGetChart2Data200(res) {
                this.chart2Data200 = res;
                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                this.queryCondition.status200 = false;
                collection.getTaskStatistics(this.queryCondition);
            }
        }, {
            key: 'onGetChart2DataNot200',
            value: function onGetChart2DataNot200(res) {
                this.chart2DataNot200 = res;
                this.queryCondition.status200 = null;
                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                var timeDataChart1 = [],
                    countDataChart1 = [],
                    timeDataChart2 = [],
                    count200DataChart2 = [],
                    countNot200DataChart2 = [];
                _.each(this.chart1Data, function (el) {
                    timeDataChart1.push(el.logTimestamp);
                    countDataChart1.push(el.count);
                });
                _.each(this.chart2Data200, function (el) {
                    timeDataChart2.push(el.logTimestamp);
                    count200DataChart2.push(el.count);
                });
                _.each(this.chart2DataNot200, function (el) {
                    countNot200DataChart2.push(el.count);
                });

                collection.trigger("get.chartData.success", timeDataChart1, countDataChart1, timeDataChart2, count200DataChart2, countNot200DataChart2);
            }
        }, {
            key: 'handleSubmit',
            value: function handleSubmit(e) {
                e && e.preventDefault();
                var _props$form = this.props.form,
                    getFieldsValue = _props$form.getFieldsValue,
                    validateFields = _props$form.validateFields;

                var fieldsValue = getFieldsValue(),
                    ltProps = this.props.ltProps,
                    collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                validateFields(["userId", "rangeTimePicker"], function (err, vals) {
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
                        this.queryCondition = queryCondition;
                        collection.getTaskStatistics(queryCondition);
                        collection.trigger("fetching");
                    }
                }.bind(this));
            }
        }, {
            key: 'onClickResetButton',
            value: function onClickResetButton() {
                var setFieldsValue = this.props.form.setFieldsValue;

                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                setFieldsValue({ "userId": "" });
                setFieldsValue({ "domains": [] });
                setFieldsValue({ "taskName": "" });
                setFieldsValue({ "rangeTimePicker": null });
                collection.trigger("reset.chart");
            }
        }, {
            key: 'handleUserIdSearch',
            value: function handleUserIdSearch(value) {
                if (value.length < 3) return;
                var IdArray = [],
                    userIdList = this.userIdList;
                if (value && userIdList) {
                    IdArray = _.filter(userIdList, function (el) {
                        var id = el + "";
                        return id.indexOf(value) > -1;
                    }.bind(this)).map(function (el) {
                        el = el + "";
                        return React.createElement(
                            Option,
                            { key: el },
                            el
                        );
                    });
                }

                this.setState({
                    dataSourceUserId: IdArray
                });
            }
        }, {
            key: 'onAccountIdChange',
            value: function onAccountIdChange(value) {
                var _props$form2 = this.props.form,
                    setFieldsValue = _props$form2.setFieldsValue,
                    getFieldsValue = _props$form2.getFieldsValue;

                setFieldsValue({ "domains": [] });
                this.setState({
                    dataSourceDomains: []
                });

                if (value) {
                    require(['domainList.model'], function (DomainListModel) {
                        var domainListModel = new DomainListModel();
                        domainListModel.on("query.domain.success", $.proxy(this.onGetDomainListSuccess, this));
                        domainListModel.on("query.domain.error", $.proxy(this.onGetError, this));
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
        }, {
            key: 'onGetDomainListSuccess',
            value: function onGetDomainListSuccess(res) {
                var domainArray = res.data.map(function (el) {
                    return React.createElement(
                        Option,
                        { key: el.originDomain.domain },
                        el.originDomain.domain
                    );
                    //return <Option key={el}>{el}</Option>;
                });
                this.setState({
                    dataSourceDomains: domainArray
                });
            }
        }, {
            key: 'onGetError',
            value: function onGetError(error) {
                if (error && error.message) Utility.alerts(error.message);else Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }
        }, {
            key: 'disabledDate',
            value: function disabledDate(current) {
                return current && current < moment().add(-90, 'day');
            }
        }, {
            key: 'render',
            value: function render() {
                var getFieldDecorator = this.props.form.getFieldDecorator;
                var dataSource = this.state.dataSource;

                var ltProps = this.props.ltProps;
                var formItemLayout = {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 12 }
                };

                var HorizontalForm = React.createElement(
                    Form,
                    { onSubmit: this.handleSubmit },
                    React.createElement(
                        Row,
                        null,
                        React.createElement(
                            Col,
                            { span: 8 },
                            React.createElement(
                                FormItem,
                                _extends({}, formItemLayout, { label: '\u5BA2\u6237ID' }),
                                getFieldDecorator('userId', {
                                    initialValue: "",
                                    rules: [{ required: true, message: '请输入客户ID!' }]
                                })(React.createElement(
                                    AutoComplete,
                                    {
                                        style: { width: 250 },
                                        onBlur: $.proxy(this.onAccountIdChange, this),
                                        onSearch: $.proxy(this.handleUserIdSearch, this) },
                                    this.state.dataSourceUserId
                                ))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 10 },
                            React.createElement(
                                FormItem,
                                _extends({}, formItemLayout, { label: "域名" }),
                                getFieldDecorator('domains', {
                                    initialValue: []
                                })(React.createElement(
                                    Select,
                                    { mode: 'multiple', allowClear: true, style: { width: 300 },
                                        placeholder: '请选择',
                                        maxTagCount: 1,
                                        notFoundContent: React.createElement(Spin, { size: 'small' }),
                                        filterOption: false },
                                    this.state.dataSourceDomains
                                ))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 6 },
                            React.createElement(
                                FormItem,
                                _extends({}, formItemLayout, { label: "任务名称" }),
                                getFieldDecorator('taskName', {
                                    initialValue: ""
                                })(React.createElement(
                                    Select,
                                    {
                                        showSearch: true,
                                        allowClear: true,
                                        style: { width: 200 },
                                        optionFilterProp: 'children',
                                        filterOption: function filterOption(input, option) {
                                            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                        }
                                    },
                                    this.state.dataSourceTaskName
                                ))
                            )
                        )
                    ),
                    React.createElement(
                        Row,
                        null,
                        React.createElement(
                            Col,
                            { span: 8 },
                            React.createElement(
                                FormItem,
                                _extends({}, formItemLayout, { label: "时间" }),
                                getFieldDecorator('rangeTimePicker', {
                                    rules: [{ type: 'array', required: true, message: '请选择起止时间！' }]
                                })(React.createElement(RangePicker, { showTime: { format: 'HH:mm', minuteStep: 30 },
                                    format: 'YYYY/MM/DD HH:mm',
                                    disabledDate: this.disabledDate,
                                    disabledTime: this.disabledTime }))
                            )
                        ),
                        React.createElement(Col, { span: 2 }),
                        React.createElement(
                            Col,
                            { span: 8 },
                            React.createElement(
                                FormItem,
                                null,
                                React.createElement(
                                    Button,
                                    { type: 'primary', htmlType: 'submit', icon: 'search' },
                                    '\u67E5\u8BE2'
                                ),
                                React.createElement(
                                    Button,
                                    { style: { marginLeft: 8 }, icon: 'reload', onClick: $.proxy(this.onClickResetButton, this) },
                                    '\u91CD\u7F6E'
                                )
                            )
                        )
                    )
                );

                var SearchFormView = null;
                if (this.state.isLoadingUserId) SearchFormView = React.createElement(
                    'div',
                    { style: { textAlign: "center" } },
                    React.createElement(Spin, null)
                );else SearchFormView = HorizontalForm;
                return SearchFormView;
            }
        }]);

        return SearchForm;
    }(React.Component);

    var WrappedSearchForm = Form.create()(SearchForm);

    var LogTaskStatisticsChart = function (_React$Component2) {
        _inherits(LogTaskStatisticsChart, _React$Component2);

        function LogTaskStatisticsChart(props, context) {
            _classCallCheck(this, LogTaskStatisticsChart);

            var _this2 = _possibleConstructorReturn(this, (LogTaskStatisticsChart.__proto__ || Object.getPrototypeOf(LogTaskStatisticsChart)).call(this, props));

            _this2.state = {
                breadcrumbTxt: ["日志管理", "任务统计"]
            };
            return _this2;
        }

        _createClass(LogTaskStatisticsChart, [{
            key: 'render',
            value: function render() {
                this.queryCondition = {
                    "taskName": null,
                    "domain": null,
                    "userId": null,
                    "startTime": null,
                    "endTime": null,
                    "status200": null
                };

                this.ltProps = {
                    collection: this.props.collection,
                    queryCondition: this.queryCondition
                };

                return React.createElement(
                    Layout,
                    null,
                    React.createElement(
                        Content,
                        null,
                        React.createElement(
                            Breadcrumb,
                            { style: { margin: '16px 0' } },
                            React.createElement(
                                Breadcrumb.Item,
                                null,
                                this.state.breadcrumbTxt[0]
                            ),
                            React.createElement(
                                Breadcrumb.Item,
                                null,
                                this.state.breadcrumbTxt[1]
                            )
                        ),
                        React.createElement(
                            'div',
                            { style: { background: '#fff', padding: 24, minHeight: 280 } },
                            React.createElement(WrappedSearchForm, { ltProps: this.ltProps }),
                            React.createElement('hr', null),
                            React.createElement(
                                'div',
                                { className: 'charts-container' },
                                React.createElement(
                                    'div',
                                    { className: 'row' },
                                    React.createElement('div', { className: 'col-md-6 chart1-ctn' }),
                                    React.createElement('div', { className: 'col-md-6 chart2-ctn' })
                                )
                            )
                        )
                    )
                );
            }
        }]);

        return LogTaskStatisticsChart;
    }(React.Component);

    var LogTaskStatisticsView = BaseView.extend({
        initialize: function initialize(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template('<div class="log-manage"></div>')());

            this.collection.on("fetching", $.proxy(this.onSearch, this));
            this.collection.on("get.chartData.success", $.proxy(this.initChart1, this));
            this.collection.on("statistics.chart.error", $.proxy(this.onGetError, this));
            this.collection.on("reset.chart", $.proxy(this.onResetChart, this));

            var logTaskListFactory = React.createFactory(LogTaskStatisticsChart);
            var logTaskList = logTaskListFactory({
                collection: this.collection
            });
            ReactDOM.render(logTaskList, this.$el.get(0));
        },

        onSearch: function onSearch(res) {
            this.$el.find(".chart1-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".chart2-ctn").html(_.template(template['tpl/loading.html'])({}));
        },

        onResetChart: function onResetChart() {
            if (this.chart1) {
                this.chart1.dispose();
                this.chart1 = null;
            }
            if (this.chart2) {
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

        initChart1: function initChart1(timeDataChart1, countDataChart1, timeDataChart2, count200DataChart2, countNot200DataChart2) {
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
                    formatter: function formatter(param) {
                        var arr = [];
                        arr.push('<div>时间：' + new Date(param[0].name).format("yyyy年MM月dd日 hh:mm") + '</div>');
                        arr.push('<div class="tooltip-content-value">总日指数：' + param[0].value + '</div>');
                        return arr.join('');
                    }
                },
                legend: {
                    data: '---',
                    top: 10
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
                        formatter: function formatter(value) {
                            return new Date(value).format("MM/dd hh:mm");
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
                    labelFormatter: function labelFormatter(value) {
                        return new Date(timeDataChart1[value]).format("MM/dd\nhh:mm");
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
            if (this.chart1) {
                this.chart1.dispose();
                this.chart1 = null;
            }
            this.chart1 = echarts.init(this.$el.find(".chart1").get(0));
            this.chart1.setOption(option);

            this.initChart2(timeDataChart2, count200DataChart2, countNot200DataChart2);
        },

        initChart2: function initChart2(timeDataChart2, count200DataChart2, countNot200DataChart2) {
            var option = {
                title: {
                    show: false
                },
                backgroundColor: "#fcfcfc",
                color: ["#289af4", "#f64686"],
                tooltip: {
                    backgroundColor: "#fff",
                    borderColor: "#bfbfbf",
                    borderWidth: 1,
                    extraCssText: 'box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3)',
                    textStyle: {
                        color: "#000"
                    },
                    trigger: 'axis',
                    formatter: function formatter(params) {
                        var arr = [];
                        var time = new Date(params[0].name).format("yyyy/MM/dd hh:mm");
                        arr.push('<div>' + time + '</div>');
                        for (var i = 0; i < params.length; i++) {
                            var _name = params[i].seriesName;
                            var value = params[i].value;
                            arr.push('<div class="tooltip-content-value">' + _name + "：" + value + '</div>');
                        }
                        return arr.join('');
                    }
                },
                legend: {
                    data: ["200", "非200"],
                    top: 10
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
                dataZoom: {
                    show: true,
                    start: 0,
                    labelFormatter: function labelFormatter(value) {
                        return new Date(timeDataChart2[value]).format("MM/dd\nhh:mm");
                    }
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
                    data: timeDataChart2,
                    axisTick: { show: true },
                    splitLine: {
                        show: true
                    },
                    axisLabel: {
                        formatter: function formatter(value) {
                            return new Date(value).format("MM/dd hh:mm");
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
                    axisTick: { show: false },
                    splitLine: {
                        show: true
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#000"
                        }
                    }
                }],
                series: [{
                    data: count200DataChart2,
                    type: "line",
                    name: "200"
                }, {
                    data: countNot200DataChart2,
                    type: "line",
                    name: "非200"
                }]
            };
            this.$el.find(".chart2-ctn").html('<div class="chart2" style="width: 100%;height:500px;"></div>');
            if (this.chart2) {
                this.chart2.dispose();
                this.chart2 = null;
            }
            this.chart2 = echarts.init(this.$el.find(".chart2").get(0));
            this.chart2.setOption(option);
        },

        onResizeChart: function onResizeChart() {
            if (this.chart1) this.chart1.resize();
            if (this.chart2) this.chart2.resize();
        },

        render: function render(target) {
            this.$el.appendTo(target);
            $(window).on('resize', $.proxy(this.onResizeChart, this));
        }
    });
    return LogTaskStatisticsView;
});
