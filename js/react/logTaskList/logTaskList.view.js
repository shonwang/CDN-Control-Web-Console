'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("logTaskList.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], function (require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

    var Layout = Antd.Layout,
        Content = Layout.Content,
        Breadcrumb = Antd.Breadcrumb,
        Button = Antd.Button,
        Input = Antd.Input,
        InputNumber = Antd.InputNumber,
        Form = Antd.Form,
        FormItem = Form.Item,
        Table = Antd.Table,
        Alert = Antd.Alert,
        Icon = Antd.Icon,
        Spin = Antd.Spin,
        Tooltip = Antd.Tooltip,
        Col = Antd.Col,
        Row = Antd.Row,
        message = Antd.message,
        Modal = Antd.Modal,
        Tag = Antd.Tag,
        confirm = Modal.confirm;

    var LogTaskListTable = function (_React$Component) {
        _inherits(LogTaskListTable, _React$Component);

        function LogTaskListTable(props, context) {
            _classCallCheck(this, LogTaskListTable);

            var _this = _possibleConstructorReturn(this, (LogTaskListTable.__proto__ || Object.getPrototypeOf(LogTaskListTable)).call(this, props));

            _this.onChangePage = _this.onChangePage.bind(_this);
            _this.handleStopClick = _this.handleStopClick.bind(_this);
            _this.handleDeleteClick = _this.handleDeleteClick.bind(_this);

            _this.state = {
                data: [],
                isError: false,
                isFetching: true
            };
            return _this;
        }

        _createClass(LogTaskListTable, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                collection.on("get.taskList.success", $.proxy(this.onTaskListSuccess, this));
                collection.on("get.taskList.error", $.proxy(this.onGetError, this));
                collection.on("fetching", $.proxy(this.onFetchingTaskList, this));
                collection.trigger("fetching", queryCondition);
                collection.on("delete.task.success", $.proxy(this.onGetOperateSuccess, this, "删除"));
                collection.on("delete.task.error", $.proxy(this.onOperateError, this));
                collection.on("stop.task.success", $.proxy(this.onGetOperateSuccess, this, "停止"));
                collection.on("stop.task.error", $.proxy(this.onOperateError, this));
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var collection = this.props.ltProps.collection;
                collection.off("get.taskList.success");
                collection.off("get.taskList.error");
                collection.off("fetching");
                collection.off("delete.task.success");
                collection.off("delete.task.error");
                collection.off("stop.task.success");
                collection.off("stop.task.error");
            }
        }, {
            key: 'onCheckTplIsUsedSuccess',
            value: function onCheckTplIsUsedSuccess(res) {
                if (res.used) message.warning('有' + res.taskCount + '个任务正在使用此模板，请先停掉任务，再删除！', 5);
            }
        }, {
            key: 'onGetOperateSuccess',
            value: function onGetOperateSuccess(msg) {
                Utility.alerts(msg + "成功!", "success", 2000);
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;

                collection.trigger("fetching", queryCondition);
            }
        }, {
            key: 'onOperateError',
            value: function onOperateError(error) {
                if (error && error.message) Utility.alerts(error.message);else if (error && error.Error && error.Error.Message) Utility.alerts(error.Error.Message);else Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }
        }, {
            key: 'onFetchingTaskList',
            value: function onFetchingTaskList(queryCondition) {
                var collection = this.props.ltProps.collection;
                this.setState({
                    isFetching: true
                });
                collection.getTaskList(queryCondition);
            }
        }, {
            key: 'onTaskListSuccess',
            value: function onTaskListSuccess() {
                var data = [];
                this.props.ltProps.collection.each(function (model) {
                    var obj = Object.assign({}, model.attributes);
                    data.push(obj);
                });
                this.setState({
                    data: data,
                    isFetching: false,
                    isError: false
                });
            }
        }, {
            key: 'onChangePage',
            value: function onChangePage(page, pageSize) {
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                queryCondition.page = page;
                queryCondition.size = pageSize;
                collection.trigger("fetching", queryCondition);
            }
        }, {
            key: 'handleDeleteClick',
            value: function handleDeleteClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                var model = _.find(this.state.data, function (obj) {
                    return obj.id == id;
                }.bind(this));
                if (model.taskStatus == "RUNNING") {
                    message.warning('请先停掉任务，再删除！', 5);
                    return;
                }
                confirm({
                    title: '你确定要删除吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '算了，不删了',
                    onOk: function () {
                        var ltProps = this.props.ltProps;
                        var collection = ltProps.collection;
                        collection.deleteTask({ id: id });
                    }.bind(this)
                });
            }
        }, {
            key: 'handleStopClick',
            value: function handleStopClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                confirm({
                    title: '你确定要停止吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '算了，不停了',
                    onOk: function () {
                        var ltProps = this.props.ltProps;
                        var collection = ltProps.collection;
                        collection.stopTask({ id: id });
                    }.bind(this)
                });
            }
        }, {
            key: 'handleViewClick',
            value: function handleViewClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = _.find(this.state.data, function (obj) {
                    return obj.id == id;
                }.bind(this));
                var onClickViewCallback = this.props.ltProps.onClickViewCallback;
                onClickViewCallback && onClickViewCallback(model);
            }
        }, {
            key: 'onGetError',
            value: function onGetError(error) {
                var msgDes = "服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！";
                if (error && error.message) msgDes = error.message;else if (error && error.Error && error.Error.Message) msgDes = error.Error.Message;

                this.errorView = React.createElement(Alert, {
                    message: '\u51FA\u9519\u4E86',
                    description: msgDes,
                    type: 'error',
                    showIcon: true
                });

                this.setState({
                    isError: true,
                    isFetching: false
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var _this2 = this;

                if (this.state.isError) {
                    return this.errorView || React.createElement(Alert, {
                        message: '\u51FA\u9519\u4E86',
                        type: 'error',
                        showIcon: true
                    });
                }

                var columns = [{
                    title: '任务名称',
                    dataIndex: 'name',
                    key: 'name'
                }, {
                    title: '客户ID',
                    dataIndex: 'accountId',
                    key: 'accountId'
                }, {
                    title: '模板名称',
                    dataIndex: 'templateName',
                    key: 'templateName'
                }, {
                    title: '回传地址',
                    dataIndex: 'backUrl',
                    key: 'backUrl'
                }, {
                    title: '任务启动时间',
                    dataIndex: 'createTimeFormated',
                    key: 'createTimeFormated'
                }, {
                    title: '任务状态',
                    dataIndex: 'taskStatus',
                    key: 'taskStatus',
                    render: function render(text, record) {
                        var tag = null;
                        if (record.taskStatus == "STOPPED") tag = React.createElement(
                            Tag,
                            { color: "red" },
                            '\u5DF2\u505C\u6B62'
                        );else if (record.taskStatus == "RUNNING") tag = React.createElement(
                            Tag,
                            { color: "green" },
                            '\u8FD0\u884C\u4E2D'
                        );
                        return tag;
                    }
                }, {
                    title: '创建者',
                    dataIndex: 'creator',
                    key: 'creator'
                }, {
                    title: '操作',
                    dataIndex: '',
                    key: 'action',
                    render: function render(text, record) {
                        var detailButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "查看详情" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: function onClick(e) {
                                        return _this2.handleViewClick(e);
                                    } },
                                React.createElement(Icon, { type: 'profile' })
                            )
                        );
                        var deleteButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "删除" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: function onClick(e) {
                                        return _this2.handleDeleteClick(e);
                                    } },
                                React.createElement(Icon, { type: 'delete' })
                            )
                        );
                        var stopButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "停止" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: function onClick(e) {
                                        return _this2.handleStopClick(e);
                                    } },
                                React.createElement(Icon, { type: 'poweroff' })
                            )
                        );
                        var buttonGroup = "";
                        if (record.taskStatus == "RUNNING") {
                            buttonGroup = React.createElement(
                                'div',
                                null,
                                detailButton,
                                React.createElement('span', { className: 'ant-divider' }),
                                stopButton,
                                React.createElement('span', { className: 'ant-divider' }),
                                deleteButton
                            );
                        } else {
                            buttonGroup = React.createElement(
                                'div',
                                null,
                                detailButton,
                                React.createElement('span', { className: 'ant-divider' }),
                                deleteButton
                            );
                        }
                        return buttonGroup;
                    }
                }];
                var ltProps = this.props.ltProps;
                var pagination = {
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: function showTotal(total) {
                        return 'Total ' + total + ' items';
                    },
                    current: ltProps.queryCondition.page,
                    total: ltProps.collection.total,
                    onChange: this.onChangePage,
                    onShowSizeChange: this.onChangePage
                };

                return React.createElement(Table, { rowKey: 'id',
                    dataSource: this.state.data,
                    loading: this.state.isFetching,
                    columns: columns,
                    pagination: pagination });
            }
        }]);

        return LogTaskListTable;
    }(React.Component);

    var SearchForm = function (_React$Component2) {
        _inherits(SearchForm, _React$Component2);

        function SearchForm(props, context) {
            _classCallCheck(this, SearchForm);

            var _this3 = _possibleConstructorReturn(this, (SearchForm.__proto__ || Object.getPrototypeOf(SearchForm)).call(this, props));

            _this3.onClickAddButton = _this3.onClickAddButton.bind(_this3);
            _this3.handleSubmit = _this3.handleSubmit.bind(_this3);
            _this3.state = {};
            return _this3;
        }

        _createClass(SearchForm, [{
            key: 'handleSubmit',
            value: function handleSubmit(e) {
                e && e.preventDefault();
                var validateFields = this.props.form.validateFields;


                validateFields(["accountId"], function (err, vals) {
                    if (!err) {
                        var fieldsValue = this.props.form.getFieldsValue(),
                            ltProps = this.props.ltProps;
                        var collection = ltProps.collection,
                            queryCondition = ltProps.queryCondition;
                        queryCondition.name = fieldsValue.name || null;
                        //queryCondition.domain = fieldsValue.domain || null;
                        queryCondition.templateName = fieldsValue.templateName || null;
                        queryCondition.accountId = fieldsValue.accountId || null;
                        queryCondition.backUrl = fieldsValue.backUrl || null;
                        console.log(queryCondition);
                        collection.trigger("fetching", queryCondition);
                    }
                }.bind(this));
            }
        }, {
            key: 'onClickAddButton',
            value: function onClickAddButton() {
                var onClickAddCallback = this.props.ltProps.onClickAddCallback;
                onClickAddCallback && onClickAddCallback();
            }
        }, {
            key: 'onClickResetButton',
            value: function onClickResetButton() {
                var setFieldsValue = this.props.form.setFieldsValue;

                setFieldsValue({ "name": null });
                setFieldsValue({ "domain": null });
                setFieldsValue({ "templateName": null });
                setFieldsValue({ "accountId": null });
                setFieldsValue({ "backUrl": null });
                this.handleSubmit();
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
                                _extends({}, formItemLayout, { label: "任务名称" }),
                                getFieldDecorator('name')(React.createElement(Input, null))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 8, style: { display: "none" } },
                            React.createElement(
                                FormItem,
                                _extends({}, formItemLayout, { label: "域名" }),
                                getFieldDecorator('domain')(React.createElement(Input, null))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 8 },
                            React.createElement(
                                FormItem,
                                _extends({}, formItemLayout, { label: "模版名称" }),
                                getFieldDecorator('templateName')(React.createElement(Input, null))
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
                                _extends({}, formItemLayout, { label: "客户ID" }),
                                getFieldDecorator('accountId', {
                                    rules: [{ pattern: /^[0-9]+$/, message: '客户ID只能输入数字!' }]
                                })(React.createElement(Input, null))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 8 },
                            React.createElement(
                                FormItem,
                                _extends({}, formItemLayout, { label: "回传地址" }),
                                getFieldDecorator('backUrl')(React.createElement(Input, null))
                            )
                        ),
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
                                    { style: { marginLeft: 8 }, icon: 'plus', onClick: this.onClickAddButton },
                                    '\u65B0\u5EFA'
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

                return HorizontalForm;
            }
        }]);

        return SearchForm;
    }(React.Component);

    var LogTaskListManageList = function (_React$Component3) {
        _inherits(LogTaskListManageList, _React$Component3);

        function LogTaskListManageList(props, context) {
            _classCallCheck(this, LogTaskListManageList);

            var _this4 = _possibleConstructorReturn(this, (LogTaskListManageList.__proto__ || Object.getPrototypeOf(LogTaskListManageList)).call(this, props));

            _this4.state = {
                curViewsMark: "list", // list: 列表界面，add: 新建，edit: 编辑
                breadcrumbTxt: ["日志管理", "任务管理"]
            };
            return _this4;
        }

        _createClass(LogTaskListManageList, [{
            key: 'componentDidMount',
            value: function componentDidMount() {}
        }, {
            key: 'onClickAddCallback',
            value: function onClickAddCallback() {
                require(['logTaskList.edit.view'], function (LogTaskListManageView) {
                    this.curView = React.createElement(LogTaskListManageView, { ltProps: this.ltProps, isEdit: false });
                    this.setState({
                        curViewsMark: "add",
                        breadcrumbTxt: ["任务管理", "新建"]
                    });
                }.bind(this));
            }
        }, {
            key: 'onClickEditCallback',
            value: function onClickEditCallback(model) {
                require(['logTaskList.edit.view'], function (LogTaskListManageView) {
                    this.curView = React.createElement(LogTaskListManageView, { ltProps: this.ltProps, model: model, isEdit: true });
                    this.setState({
                        curViewsMark: "edit",
                        breadcrumbTxt: ["任务管理", "编辑"]
                    });
                }.bind(this));
            }
        }, {
            key: 'onClickViewCallback',
            value: function onClickViewCallback(model, backTarget) {
                require(['logTaskList.edit.view'], function (LogTaskListManageView) {
                    this.curView = React.createElement(LogTaskListManageView, { ltProps: this.ltProps, model: model, isEdit: true, isView: true });
                    this.setState({
                        curViewsMark: "view",
                        breadcrumbTxt: ["任务管理", "查看"]
                    });
                }.bind(this));
            }
        }, {
            key: 'onClickCancelCallback',
            value: function onClickCancelCallback() {
                this.setState({
                    curViewsMark: "list",
                    breadcrumbTxt: ["日志管理", "任务管理"]
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var WrappedSearchForm = Form.create()(SearchForm);

                this.queryCondition = {
                    "name": null,
                    //"domain": null,
                    "templateName": null,
                    "accountId": null,
                    "backUrl": null,
                    "page": 1,
                    "size": 10
                };

                this.ltProps = {
                    collection: this.props.collection,
                    queryCondition: this.queryCondition,
                    onClickAddCallback: $.proxy(this.onClickAddCallback, this),
                    onClickEditCallback: $.proxy(this.onClickEditCallback, this),
                    onClickCancelCallback: $.proxy(this.onClickCancelCallback, this),
                    onClickViewCallback: $.proxy(this.onClickViewCallback, this)
                };

                var curView = null;
                if (this.state.curViewsMark == "list") {
                    curView = React.createElement(
                        'div',
                        null,
                        React.createElement(WrappedSearchForm, { ltProps: this.ltProps }),
                        React.createElement('hr', null),
                        React.createElement(LogTaskListTable, { ltProps: this.ltProps })
                    );
                } else if (this.state.curViewsMark == "add" || this.state.curViewsMark == "edit" || this.state.curViewsMark == "view") {
                    curView = this.curView;
                }

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
                            curView
                        )
                    )
                );
            }
        }]);

        return LogTaskListManageList;
    }(React.Component);

    var LogTaskListManageView = BaseView.extend({
        initialize: function initialize(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template('<div class="log-manage"></div>')());

            var logTaskListFactory = React.createFactory(LogTaskListManageList);
            var logTaskList = logTaskListFactory({
                collection: this.collection
            });
            ReactDOM.render(logTaskList, this.$el.get(0));
        }
    });
    return LogTaskListManageView;
});
