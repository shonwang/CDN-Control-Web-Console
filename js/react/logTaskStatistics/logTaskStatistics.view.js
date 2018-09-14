'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("logTaskStatistics.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], function (require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

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
            key: 'onGetUserListSuccess',
            value: function onGetUserListSuccess(res) {
                _.each(res.data, function (el) {
                    this.userIdList.push(el.userId);
                }.bind(this));

                this.setState({
                    isLoadingUserId: false
                });
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
                validateFields(["accountId", "rangeTimePicker"], function (err, vals) {
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
                    console.log(queryCondition);
                    collection.trigger("fetching", queryCondition);
                });
            }
        }, {
            key: 'onClickResetButton',
            value: function onClickResetButton() {
                var setFieldsValue = this.props.form.setFieldsValue;

                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                setFieldsValue({ "accountId": "" });
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
                            userId: value
                        });
                    }.bind(this));
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
                                getFieldDecorator('accountId', {
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
                    "domains": null,
                    "accountId": null,
                    "startTime": null,
                    "endTime": null
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
            this.collection.on("get.chartData.success", $.proxy(this.initCharts, this));
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

        initCharts: function initCharts(res) {
            if (!res) {
                this.onResetChart();
                return;
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
