'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("preheatManage.edit.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone'], function (require, exports, template, BaseView, Utility, Antd, React) {

    var Button = Antd.Button,
        Input = Antd.Input,
        Form = Antd.Form,
        FormItem = Form.Item,
        Select = Antd.Select,
        Option = Select.Option,
        AutoComplete = Antd.AutoComplete,
        Table = Antd.Table,
        Alert = Antd.Alert,
        Tag = Antd.Tag,
        Popover = Antd.Popover,
        Badge = Antd.Badge,
        Icon = Antd.Icon,
        Tooltip = Antd.Tooltip,
        Upload = Antd.Upload,
        List = Antd.List,
        DatePicker = Antd.DatePicker,
        TimePicker = Antd.TimePicker,
        RangePicker = DatePicker.RangePicker;

    var PreheatManageEditForm = function (_React$Component) {
        _inherits(PreheatManageEditForm, _React$Component);

        function PreheatManageEditForm(props, context) {
            _classCallCheck(this, PreheatManageEditForm);

            var _this = _possibleConstructorReturn(this, (PreheatManageEditForm.__proto__ || Object.getPrototypeOf(PreheatManageEditForm)).call(this, props));

            _this.onClickCancel = _this.onClickCancel.bind(_this);
            _this.renderTaskNameView = _this.renderTaskNameView.bind(_this);
            _this.handleSubmit = _this.handleSubmit.bind(_this);
            _this.state = {
                fileList: [],
                uploading: false
            };
            return _this;
        }

        _createClass(PreheatManageEditForm, [{
            key: 'componentDidMount',
            value: function componentDidMount() {}
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {}
        }, {
            key: 'handleSubmit',
            value: function handleSubmit(e) {
                e.preventDefault();
                this.props.form.validateFields(function (err, vals) {
                    if (!err) {}
                });
            }
        }, {
            key: 'onClickCancel',
            value: function onClickCancel() {
                var onClickCancelCallback = this.props.preHeatProps.onClickCancelCallback;
                onClickCancelCallback && onClickCancelCallback();
            }
        }, {
            key: 'onUploadFile',
            value: function onUploadFile(e) {
                console.log('Upload event:', e);
                if (Array.isArray(e)) {
                    return e;
                }
                return e && e.fileList;
            }
        }, {
            key: 'renderTaskNameView',
            value: function renderTaskNameView(formItemLayout) {
                var _this2 = this;

                var _props$form = this.props.form,
                    getFieldDecorator = _props$form.getFieldDecorator,
                    setFieldsValue = _props$form.setFieldsValue,
                    getFieldValue = _props$form.getFieldValue;

                var taskNameView = "",
                    model = this.props.model;

                var files = ['Racing car sprays burning fuel into crowd.', 'Japanese princess to wed commoner.', 'Australian walks 100km after outback crash.', 'Man charged over missing wedding girl.', 'Los Angeles battles huge wildfires.'];

                var uploadProps = {
                    action: '//jsonplaceholder.typicode.com/posts/',
                    onRemove: function onRemove(file) {
                        var fileList = getFieldValue("fileList");
                        var index = fileList.indexOf(file);
                        var newFileList = fileList.slice();
                        newFileList.splice(index, 1);
                        setFieldsValue({
                            fileList: newFileList
                        });

                        console.log(_this2.props.form.getFieldsValue());
                    },
                    beforeUpload: function beforeUpload(file) {
                        var fileList = getFieldValue("fileList"),
                            newFileList = [].concat(_toConsumableArray(fileList), [file]);
                        setFieldsValue({
                            fileList: newFileList
                        });
                        return false;
                    },
                    multiple: true
                };

                if (this.props.isEdit) {
                    taskNameView = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u4EFB\u52A1\u540D\u79F0', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                model.name
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u57DF\u540D', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                model.name
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u6587\u4EF6' }),
                            React.createElement(List, { size: 'small', dataSource: files, renderItem: function renderItem(item) {
                                    return React.createElement(
                                        List.Item,
                                        null,
                                        item
                                    );
                                } })
                        )
                    );
                } else {
                    taskNameView = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u4EFB\u52A1\u540D\u79F0' }),
                            getFieldDecorator('taskName', {
                                rules: [{ required: true, message: '请输入任务名称!' }]
                            })(React.createElement(Input, null))
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u57DF\u540D' }),
                            getFieldDecorator('taskDomain', {
                                rules: [{ required: true, message: '请输入预热域名!' }]
                            })(React.createElement(Input, null))
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u6587\u4EF6' }),
                            React.createElement(
                                'div',
                                { className: 'dropbox' },
                                getFieldDecorator('fileList', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: $.proxy(this.onUploadFile, this),
                                    initialValue: this.state.fileList,
                                    rules: [{ type: "array", required: true, message: '请选择预热文件!' }]
                                })(React.createElement(
                                    Upload.Dragger,
                                    uploadProps,
                                    React.createElement(
                                        'p',
                                        { className: 'ant-upload-drag-icon' },
                                        React.createElement(Icon, { type: 'inbox' })
                                    ),
                                    React.createElement(
                                        'p',
                                        { className: 'ant-upload-text' },
                                        'Click or drag file to this area to upload'
                                    ),
                                    React.createElement(
                                        'p',
                                        { className: 'ant-upload-hint' },
                                        'Support for a single or bulk upload.'
                                    )
                                ))
                            )
                        )
                    );
                }

                return taskNameView;
            }
        }, {
            key: 'render',
            value: function render() {
                var getFieldDecorator = this.props.form.getFieldDecorator;

                var formItemLayout = {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 14 }
                };

                var taskNameView = this.renderTaskNameView(formItemLayout);

                var preheatNodesView = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u9884\u70ED\u8282\u70B9' }),
                        React.createElement(
                            Button,
                            { icon: 'plus', size: 'small' },
                            '\u6DFB\u52A0'
                        ),
                        React.createElement(Table, null)
                    )
                );
                var timeBandView = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u5206\u65F6\u5E26\u5BBD' }),
                        React.createElement(
                            Button,
                            { icon: 'plus', size: 'small' },
                            '\u6DFB\u52A0'
                        ),
                        React.createElement(Table, null)
                    )
                );
                return React.createElement(
                    Form,
                    { onSubmit: this.handleSubmit },
                    taskNameView,
                    preheatNodesView,
                    timeBandView,
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u8D77\u6B62\u65F6\u95F4' }),
                        getFieldDecorator('range-time-picker', {
                            rules: [{ type: 'array', required: true, message: 'Please select time!' }]
                        })(React.createElement(RangePicker, { showTime: true, format: 'YYYY-MM-DD HH:mm:ss' }))
                    ),
                    React.createElement(
                        FormItem,
                        { wrapperCol: { span: 12, offset: 6 } },
                        React.createElement(
                            Button,
                            { type: 'primary', htmlType: 'submit' },
                            '\u4FDD\u5B58'
                        ),
                        React.createElement(
                            Button,
                            { onClick: this.onClickCancel, style: { marginLeft: "10px" } },
                            '\u53D6\u6D88'
                        )
                    )
                );
            }
        }]);

        return PreheatManageEditForm;
    }(React.Component);

    var PreheatManageEditView = Form.create()(PreheatManageEditForm);
    return PreheatManageEditView;
});
