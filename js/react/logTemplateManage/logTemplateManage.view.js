'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("logTemplateManage.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], function (require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

    var Layout = Antd.Layout,
        Content = Layout.Content,
        Breadcrumb = Antd.Breadcrumb,
        Button = Antd.Button,
        Input = Antd.Input,
        Form = Antd.Form,
        FormItem = Form.Item,
        Table = Antd.Table,
        Alert = Antd.Alert,
        Icon = Antd.Icon,
        Spin = Antd.Spin,
        Tooltip = Antd.Tooltip,
        DatePicker = Antd.DatePicker,
        TimePicker = Antd.TimePicker,
        RangePicker = DatePicker.RangePicker,
        message = Antd.message,
        Modal = Antd.Modal,
        confirm = Modal.confirm,
        Tag = Antd.Tag;

    var LogTemplateTable = function (_React$Component) {
        _inherits(LogTemplateTable, _React$Component);

        function LogTemplateTable(props, context) {
            _classCallCheck(this, LogTemplateTable);

            var _this = _possibleConstructorReturn(this, (LogTemplateTable.__proto__ || Object.getPrototypeOf(LogTemplateTable)).call(this, props));

            _this.onChangePage = _this.onChangePage.bind(_this);
            _this.handleEditClick = _this.handleEditClick.bind(_this);
            _this.handleDeleteClick = _this.handleDeleteClick.bind(_this);
            _this.handleHistoryClick = _this.handleHistoryClick.bind(_this);

            _this.state = {
                data: [],
                isError: false,
                isFetching: true
            };
            return _this;
        }

        _createClass(LogTemplateTable, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                collection.on("get.templateList.success", $.proxy(this.onTemplateListSuccess, this));
                collection.on("get.templateList.error", $.proxy(this.onGetError, this));
                collection.on("fetching", $.proxy(this.onFetchingTemplateList, this));
                collection.trigger("fetching", queryCondition);
                collection.on("template.used.success", $.proxy(this.onCheckTplIsUsedSuccess, this));
                collection.on("template.used.error", $.proxy(this.onOperateError, this));
                collection.on("delete.template.success", $.proxy(this.onGetOperateSuccess, this, "删除"));
                collection.on("delete.template.error", $.proxy(this.onOperateError, this));
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var collection = this.props.ltProps.collection;
                collection.off("get.templateList.success");
                collection.off("get.templateList.error");
                collection.off("fetching");
                collection.off("template.used.success");
                collection.off("template.used.error");
                collection.off("delete.template.success");
                collection.off("delete.template.error");
            }
        }, {
            key: 'onCheckTplIsUsedSuccess',
            value: function onCheckTplIsUsedSuccess(res) {
                var collection = this.props.ltProps.collection;
                if (res.used) {
                    message.warning('有' + res.taskCount + '个任务正在使用此模板，请先停掉任务，再删除！', 5);
                } else {
                    confirm({
                        title: '你确定要删除吗？',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '算了，不删了',
                        onOk: function () {
                            collection.deleteTemplate({ groupId: this.curDeleteGroupId });
                        }.bind(this)
                    });
                }
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
            key: 'onFetchingTemplateList',
            value: function onFetchingTemplateList(queryCondition) {
                var collection = this.props.ltProps.collection;
                this.setState({
                    isFetching: true
                });
                collection.getTemplateList(queryCondition);
            }
        }, {
            key: 'onTemplateListSuccess',
            value: function onTemplateListSuccess() {
                var data = [];
                this.props.ltProps.collection.each(function (model) {
                    var obj = Object.assign({}, model.attributes);
                    data.push(obj);
                });
                this.setState({
                    data: data,
                    isFetching: false
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
            key: 'handleHistoryClick',
            value: function handleHistoryClick(event) {
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
                var onClickHistoryCallback = this.props.ltProps.onClickHistoryCallback;
                onClickHistoryCallback && onClickHistoryCallback(model);
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
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection;
                collection.isTemplateUsed({ groupId: id });
                this.curDeleteGroupId = id;
            }
        }, {
            key: 'handleEditClick',
            value: function handleEditClick(event) {
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
                var onClickEditCallback = this.props.ltProps.onClickEditCallback;
                onClickEditCallback && onClickEditCallback(model);
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

                this.setState({
                    isError: true,
                    isFetching: false
                });

                this.errorView = React.createElement(Alert, {
                    message: '\u51FA\u9519\u4E86',
                    description: msgDes,
                    type: 'error',
                    showIcon: true
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
                    title: '模版ID',
                    dataIndex: 'id',
                    key: 'id'
                }, {
                    title: '模版名称',
                    dataIndex: 'name',
                    key: 'name'
                }, {
                    title: '产品线标识',
                    dataIndex: 'productType',
                    key: 'productType',
                    render: function render(text, record) {
                        var tag = null;
                        if (record.productType == 'LIVE') tag = React.createElement(
                            Tag,
                            { color: "green" },
                            '\u76F4\u64AD'
                        );else if (record.productType == 'DOWNLOAD') tag = React.createElement(
                            Tag,
                            { color: "blue" },
                            '\u4E0B\u8F7D'
                        );else tag = React.createElement(
                            Tag,
                            { color: "red" },
                            '\u672A\u77E5'
                        );
                        return tag;
                    }
                }, {
                    title: '创建人',
                    dataIndex: 'creator',
                    key: 'creator'
                }, {
                    title: '创建时间',
                    dataIndex: 'createTimeFormated',
                    key: 'createTimeFormated'
                }, {
                    title: '修改时间',
                    dataIndex: 'updateTimeFormated',
                    key: 'updateTimeFormated'
                }, {
                    title: '操作',
                    dataIndex: '',
                    key: 'action',
                    render: function render(text, record) {
                        var editButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "编辑" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: function onClick(e) {
                                        return _this2.handleEditClick(e);
                                    } },
                                React.createElement(Icon, { type: 'edit' })
                            )
                        );
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
                                { href: 'javascript:void(0)', id: record.groupId, onClick: function onClick(e) {
                                        return _this2.handleDeleteClick(e);
                                    } },
                                React.createElement(Icon, { type: 'delete' })
                            )
                        );
                        var historyButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "历史记录" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: function onClick(e) {
                                        return _this2.handleHistoryClick(e);
                                    } },
                                React.createElement(Icon, { type: 'clock-circle' })
                            )
                        );
                        var buttonGroup = React.createElement(
                            'div',
                            null,
                            editButton,
                            React.createElement('span', { className: 'ant-divider' }),
                            detailButton,
                            React.createElement('span', { className: 'ant-divider' }),
                            deleteButton,
                            React.createElement('span', { className: 'ant-divider' }),
                            historyButton
                        );
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

        return LogTemplateTable;
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
                e.preventDefault();
                var fieldsValue = this.props.form.getFieldsValue(),
                    ltProps = this.props.ltProps;
                var collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                queryCondition.name = fieldsValue.templateName || null;
                if (fieldsValue.time) {
                    queryCondition.startTime = fieldsValue.time[0].valueOf();
                    queryCondition.endTime = fieldsValue.time[1].valueOf();
                } else {
                    queryCondition.startTime = null;
                    queryCondition.endTime = null;
                }
                console.log(queryCondition);
                collection.trigger("fetching", queryCondition);
            }
        }, {
            key: 'onClickAddButton',
            value: function onClickAddButton() {
                var onClickAddCallback = this.props.ltProps.onClickAddCallback;
                onClickAddCallback && onClickAddCallback();
            }
        }, {
            key: 'render',
            value: function render() {
                var getFieldDecorator = this.props.form.getFieldDecorator;
                var dataSource = this.state.dataSource;

                var ltProps = this.props.ltProps;

                var HorizontalForm = React.createElement(
                    Form,
                    { layout: 'inline', onSubmit: this.handleSubmit },
                    React.createElement(
                        FormItem,
                        { label: "模版名称" },
                        getFieldDecorator('templateName')(React.createElement(Input, null))
                    ),
                    React.createElement(
                        FormItem,
                        { label: '\u65F6\u95F4' },
                        getFieldDecorator('time')(React.createElement(RangePicker, { showTime: { format: 'HH:mm', minuteStep: 30 },
                            format: 'YYYY/MM/DD HH:mm' }))
                    ),
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
                        )
                    )
                );

                return HorizontalForm;
            }
        }]);

        return SearchForm;
    }(React.Component);

    var LogTemplateManageList = function (_React$Component3) {
        _inherits(LogTemplateManageList, _React$Component3);

        function LogTemplateManageList(props, context) {
            _classCallCheck(this, LogTemplateManageList);

            var _this4 = _possibleConstructorReturn(this, (LogTemplateManageList.__proto__ || Object.getPrototypeOf(LogTemplateManageList)).call(this, props));

            _this4.state = {
                curViewsMark: "list", // list: 列表界面，add: 新建，edit: 编辑
                breadcrumbTxt: ["日志管理", "模版管理"]
            };
            return _this4;
        }

        _createClass(LogTemplateManageList, [{
            key: 'componentDidMount',
            value: function componentDidMount() {}
        }, {
            key: 'onClickAddCallback',
            value: function onClickAddCallback() {
                require(['logTemplateManage.edit.view'], function (LogTemplateManageView) {
                    this.curView = React.createElement(LogTemplateManageView, { ltProps: this.ltProps, isEdit: false });
                    this.setState({
                        curViewsMark: "add",
                        breadcrumbTxt: ["模版管理", "新建"]
                    });
                }.bind(this));
            }
        }, {
            key: 'onClickEditCallback',
            value: function onClickEditCallback(model) {
                require(['logTemplateManage.edit.view'], function (LogTemplateManageView) {
                    this.curView = React.createElement(LogTemplateManageView, { ltProps: this.ltProps, model: model, isEdit: true });
                    this.setState({
                        curViewsMark: "edit",
                        breadcrumbTxt: ["模版管理", "编辑"]
                    });
                }.bind(this));
            }
        }, {
            key: 'onClickViewCallback',
            value: function onClickViewCallback(model, backTarget) {
                require(['logTemplateManage.edit.view'], function (LogTemplateManageView) {
                    this.curView = React.createElement(LogTemplateManageView, { ltProps: this.ltProps, model: model, isEdit: true, isView: true, backTarget: backTarget });
                    this.setState({
                        curViewsMark: "view",
                        breadcrumbTxt: ["模版管理", "查看"]
                    });
                }.bind(this));
            }
        }, {
            key: 'onClickCancelCallback',
            value: function onClickCancelCallback() {
                this.setState({
                    curViewsMark: "list",
                    breadcrumbTxt: ["日志管理", "模版管理"]
                });
            }
        }, {
            key: 'onClickHistoryCallback',
            value: function onClickHistoryCallback(model) {
                require(['logTemplateManage.history.view'], function (LogTemplateManageView) {
                    this.curView = React.createElement(LogTemplateManageView, { ltProps: this.ltProps, model: model, isEdit: true });
                    this.setState({
                        curViewsMark: "history",
                        breadcrumbTxt: ["模版管理", "历史记录"]
                    });
                }.bind(this));
            }
        }, {
            key: 'render',
            value: function render() {
                var WrappedSearchForm = Form.create()(SearchForm);

                this.queryCondition = {
                    "name": null,
                    "startTime": null,
                    "endTime": null,
                    "page": 1,
                    "size": 10
                };

                this.ltProps = {
                    collection: this.props.collection,
                    queryCondition: this.queryCondition,
                    onClickAddCallback: $.proxy(this.onClickAddCallback, this),
                    onClickEditCallback: $.proxy(this.onClickEditCallback, this),
                    onClickCancelCallback: $.proxy(this.onClickCancelCallback, this),
                    onClickViewCallback: $.proxy(this.onClickViewCallback, this),
                    onClickHistoryCallback: $.proxy(this.onClickHistoryCallback, this)
                };

                var curView = null;
                if (this.state.curViewsMark == "list") {
                    curView = React.createElement(
                        'div',
                        null,
                        React.createElement(WrappedSearchForm, { ltProps: this.ltProps }),
                        React.createElement('hr', null),
                        React.createElement(LogTemplateTable, { ltProps: this.ltProps })
                    );
                } else if (this.state.curViewsMark == "add" || this.state.curViewsMark == "edit" || this.state.curViewsMark == "view" || this.state.curViewsMark == "history") {
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

        return LogTemplateManageList;
    }(React.Component);

    var LogTemplateManageView = BaseView.extend({
        initialize: function initialize(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template('<div class="log-manage"></div>')());

            var logTemplateListFactory = React.createFactory(LogTemplateManageList);
            var logTemplateList = logTemplateListFactory({
                collection: this.collection
            });
            ReactDOM.render(logTemplateList, this.$el.get(0));
        }
    });
    return LogTemplateManageView;
});
