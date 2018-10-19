'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("logTemplateManage.history.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], function (require, exports, template, BaseView, Utility, Antd, React, moment) {

    var Button = Antd.Button,
        Input = Antd.Input,
        Form = Antd.Form,
        Spin = Antd.Spin,
        FormItem = Form.Item,
        Modal = Antd.Modal,
        Table = Antd.Table,
        Tag = Antd.Tag,
        Icon = Antd.Icon,
        Tooltip = Antd.Tooltip,
        Alert = Antd.Alert,
        confirm = Modal.confirm;

    var LogTplHistoryView = function (_React$Component) {
        _inherits(LogTplHistoryView, _React$Component);

        function LogTplHistoryView(props, context) {
            _classCallCheck(this, LogTplHistoryView);

            var _this = _possibleConstructorReturn(this, (LogTplHistoryView.__proto__ || Object.getPrototypeOf(LogTplHistoryView)).call(this, props));

            _this.onClickCancel = _this.onClickCancel.bind(_this);
            _this.handlePublishClick = _this.handlePublishClick.bind(_this);

            _this.state = {
                data: [],
                isError: false,
                isFetching: true,
                modalVisible: false,
                //confirmLoading: false,
                comment: "",
                validateStatus: "", //'success', 'warning', 'error', 'validating'。
                help: ""
            };
            return _this;
        }

        _createClass(LogTplHistoryView, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection;
                collection.on("template.history.success", $.proxy(this.onTemplateHistoryListSuccess, this));
                collection.on("template.history.error", $.proxy(this.onGetError, this));
                collection.on("fetching.history", $.proxy(this.onFetchingTplHistoryList, this));
                collection.trigger("fetching.history");
                collection.on("publish.template.success", $.proxy(this.onGetOperateSuccess, this, "发布"));
                collection.on("publish.template.error", $.proxy(this.onOperateError, this));
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var collection = this.props.ltProps.collection;
                collection.off("template.history.success");
                collection.off("template.history.error");
                collection.off("fetching.history");
                collection.off("publish.template.success");
                collection.off("publish.template.error");
            }
        }, {
            key: 'onGetOperateSuccess',
            value: function onGetOperateSuccess(msg) {
                Utility.alerts(msg + "成功!", "success", 2000);
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection;

                collection.trigger("fetching.history");
            }
        }, {
            key: 'onOperateError',
            value: function onOperateError(error) {
                if (error && error.message) Utility.alerts(error.message);else if (error && error.Error && error.Error.Message) Utility.alerts(error.Error.Message);else Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }
        }, {
            key: 'onFetchingTplHistoryList',
            value: function onFetchingTplHistoryList() {
                var collection = this.props.ltProps.collection,
                    model = this.props.model;
                this.setState({
                    isFetching: true
                });
                collection.getTplHistoryList({ groupId: model.groupId });
            }
        }, {
            key: 'onTemplateHistoryListSuccess',
            value: function onTemplateHistoryListSuccess(data) {
                this.setState({
                    data: data,
                    isFetching: false
                });
            }
        }, {
            key: 'handlePublishClick',
            value: function handlePublishClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                this.curPublishId = id;
                this.setState({
                    modalVisible: true
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
                onClickViewCallback && onClickViewCallback(model, "history");
            }
        }, {
            key: 'onClickCancel',
            value: function onClickCancel() {
                var onClickCancelCallback = this.props.ltProps.onClickCancelCallback;
                onClickCancelCallback && onClickCancelCallback();
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
            key: 'handleModalOk',
            value: function handleModalOk() {
                if (this.state.comment == "") {
                    this.setState({
                        validateStatus: "error",
                        help: "请输入备注!"
                    });
                    return;
                } else {
                    this.setState({
                        validateStatus: "success",
                        help: ""
                        //confirmLoading: true
                    });
                }
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection;

                collection.publishTemplate({
                    id: this.curPublishId,
                    comment: this.state.comment
                });
                this.setState({
                    modalVisible: false
                });
            }
        }, {
            key: 'handleModalCancel',
            value: function handleModalCancel() {
                this.setState({
                    modalVisible: false
                });
            }
        }, {
            key: 'handleTextAreaChange',
            value: function handleTextAreaChange(e) {
                this.setState({
                    comment: e.target.value
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
                    title: '版本号',
                    dataIndex: 'id',
                    key: 'id'
                }, {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    render: function render(text, record) {
                        return new Date(record.createTime).format("yyyy/MM/dd hh:mm:ss");
                    }
                }, {
                    title: '修改时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                    render: function render(text, record) {
                        return new Date(record.updateTime).format("yyyy/MM/dd hh:mm:ss");
                    }
                }, {
                    title: '备注',
                    dataIndex: 'comment',
                    key: 'comment'
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
                        var publishButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "发布" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: function onClick(e) {
                                        return _this2.handlePublishClick(e);
                                    } },
                                React.createElement(Icon, { type: 'to-top' })
                            )
                        );
                        var buttonGroup = "";
                        if (record.enable) {
                            buttonGroup = React.createElement(
                                'div',
                                null,
                                detailButton,
                                React.createElement('span', { className: 'ant-divider' }),
                                React.createElement(
                                    Tag,
                                    { color: "green" },
                                    '\u6B63\u5728\u4F7F\u7528'
                                )
                            );
                        } else if (AUTH_OBJ.CheckLogList) {
                            buttonGroup = React.createElement(
                                'div',
                                null,
                                detailButton,
                                React.createElement('span', { className: 'ant-divider' }),
                                publishButton
                            );
                        } else {
                            buttonGroup = React.createElement(
                                'div',
                                null,
                                detailButton
                            );
                        }
                        return buttonGroup;
                    }
                }];

                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Button,
                        { onClick: this.onClickCancel, style: { marginLeft: "10px" } },
                        '\u8FD4\u56DE'
                    ),
                    React.createElement('hr', null),
                    React.createElement(Table, { rowKey: 'id',
                        dataSource: this.state.data,
                        loading: this.state.isFetching,
                        columns: columns,
                        pagination: false,
                        rowClassName: function rowClassName(record, index) {
                            if (record.enable) {
                                return "ant-alert-error";
                            }
                            return "";
                        } }),
                    React.createElement(
                        Modal,
                        { title: '发布',
                            destroyOnClose: true,
                            confirmLoading: this.state.confirmLoading,
                            visible: this.state.modalVisible,
                            onOk: $.proxy(this.handleModalOk, this),
                            onCancel: $.proxy(this.handleModalCancel, this) },
                        React.createElement(
                            Form,
                            null,
                            React.createElement(
                                FormItem,
                                { style: { marginBottom: "0px" } },
                                React.createElement(
                                    'span',
                                    { className: 'ant-form-text' },
                                    '\u4F60\u786E\u5B9A\u8981\u53D1\u5E03\u5417\uFF1F'
                                )
                            ),
                            React.createElement(
                                FormItem,
                                { label: '\u5907\u6CE8', required: true, validateStatus: this.state.validateStatus, help: this.state.help },
                                React.createElement(Input.TextArea, { onChange: $.proxy(this.handleTextAreaChange, this) })
                            )
                        )
                    )
                );
            }
        }]);

        return LogTplHistoryView;
    }(React.Component);

    return LogTplHistoryView;
});
