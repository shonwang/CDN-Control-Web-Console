'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("logTemplateManage.edit.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], function (require, exports, template, BaseView, Utility, Antd, React, moment) {

    var Button = Antd.Button,
        Input = Antd.Input,
        Form = Antd.Form,
        Spin = Antd.Spin,
        FormItem = Form.Item,
        Select = Antd.Select,
        Option = Select.Option,
        Modal = Antd.Modal,
        Table = Antd.Table,
        InputNumber = Antd.InputNumber,
        Tag = Antd.Tag,
        Icon = Antd.Icon,
        Tooltip = Antd.Tooltip,
        Upload = Antd.Upload,
        List = Antd.List,
        DatePicker = Antd.DatePicker,
        TimePicker = Antd.TimePicker,
        RangePicker = DatePicker.RangePicker,
        Col = Antd.Col,
        Alert = Antd.Alert,
        confirm = Modal.confirm;

    var LogTplManageEditForm = function (_React$Component) {
        _inherits(LogTplManageEditForm, _React$Component);

        function LogTplManageEditForm(props, context) {
            _classCallCheck(this, LogTplManageEditForm);

            var _this = _possibleConstructorReturn(this, (LogTplManageEditForm.__proto__ || Object.getPrototypeOf(LogTplManageEditForm)).call(this, props));

            _this.onClickCancel = _this.onClickCancel.bind(_this);
            _this.renderBaseInfoView = _this.renderBaseInfoView.bind(_this);
            _this.renderExportFieldTableView = _this.renderExportFieldTableView.bind(_this);
            _this.validateTemplateFieldList = _this.validateTemplateFieldList.bind(_this);
            _this.handleSubmit = _this.handleSubmit.bind(_this);

            _this.state = {
                name: "",
                productType: "",
                backType: "",
                fieldSeparator: "",
                lineBreak: "",
                templateFieldList: [],
                isLoadingTplDetail: props.isEdit ? true : false,
                fieldSeparatorCusValue: "",
                fieldSepCusValueVisible: "none",
                fieldModalVisible: false,
                isEditField: false,
                curEditField: {}

                // //分时带宽
                // timeBandList: [],
                // timeModalVisible: false,
                // isEditTime: false,
                // curEditTime: {},
            };

            moment.locale("zh");
            return _this;
        }

        _createClass(LogTplManageEditForm, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                if (this.props.isEdit) {
                    var model = this.props.model;
                    collection.on("template.detail.success", $.proxy(this.onGetTplDetailSuccess, this));
                    collection.on("template.detail.error", $.proxy(this.onGetError, this));
                    collection.getTemplateDetail({ id: model.id });
                }
                // collection.on("refresh.commit.success", $.proxy(this.onSubmitSuccess, this));
                // collection.on("refresh.commit.error", $.proxy(this.onGetError, this));     
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var collection = this.props.ltProps.collection;
                // collection.off("refresh.commit.success");
                // collection.off("refresh.commit.error");
                if (this.props.isEdit) {
                    collection.off("template.detail.success");
                    collection.off("template.detail.error");
                }
            }
        }, {
            key: 'onGetTplDetailSuccess',
            value: function onGetTplDetailSuccess(res) {
                if (res.fieldSeparator != "    " && res.fieldSeparator != " " && res.fieldSeparator != "|") {
                    res.fieldSeparatorCusValue = res.fieldSeparator;
                    res.fieldSeparator = "custom";
                }
                _.each(res.templateFieldList, function (el) {
                    el.id = Utility.randomStr(8);
                });
                this.setState({
                    name: res.name,
                    productType: res.productType,
                    backType: res.backType,
                    fieldSeparator: res.fieldSeparator,
                    fieldSeparatorCusValue: res.fieldSeparatorCusValue,
                    fieldSepCusValueVisible: res.fieldSeparator == "custom" ? "inline-block" : "none",
                    lineBreak: res.lineBreak,
                    templateFieldList: res.templateFieldList,
                    isLoadingTplDetail: false
                });
            }
        }, {
            key: 'renderBaseInfoView',
            value: function renderBaseInfoView(formItemLayout) {
                var _props$form = this.props.form,
                    getFieldDecorator = _props$form.getFieldDecorator,
                    setFieldsValue = _props$form.setFieldsValue,
                    getFieldValue = _props$form.getFieldValue;

                var baseInfoView = null,
                    model = this.props.model;
                // productType的取值类型 DOWNLOAD（下载）LIVE（直播） 
                // backType的取值类型 CENTER（中心回传） EDGE（边缘回传）
                if (this.props.isView) {
                    baseInfoView = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u6A21\u677F\u540D\u79F0', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                this.state.name
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u4EA7\u54C1\u7EBF\u6807\u8BC6', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                this.state.productType
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u56DE\u4F20\u65B9\u5F0F', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                this.state.backType
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u5B57\u6BB5\u95F4\u9694\u7B26\u8BBE\u7F6E', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                this.state.fieldSeparator
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u6362\u884C\u7B26\u8BBE\u7F6E', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                this.state.lineBreak
                            )
                        )
                    );
                } else {
                    baseInfoView = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u6A21\u677F\u540D\u79F0', hasFeedback: true }),
                            getFieldDecorator('name', {
                                initialValue: this.state.name,
                                validateFirst: true,
                                rules: [{ required: true, message: '请输入模板名称!' }, { pattern: /^[0-9A-Za-z\_]+$/, message: '模板名称只能输入英文数字下划线!' }]
                            })(React.createElement(Input, { disabled: this.props.isEdit }))
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u4EA7\u54C1\u7EBF\u6807\u8BC6' }),
                            getFieldDecorator('productType', {
                                initialValue: this.state.productType,
                                rules: [{ required: true, message: '请选择产品线标识!' }]
                            })(React.createElement(
                                Select,
                                { style: { width: 200 } },
                                React.createElement(
                                    Option,
                                    { value: '' },
                                    '\u8BF7\u9009\u62E9'
                                ),
                                React.createElement(
                                    Option,
                                    { value: 'LIVE' },
                                    '\u76F4\u64AD'
                                ),
                                React.createElement(
                                    Option,
                                    { value: 'DOWNLOAD' },
                                    '\u70B9\u64AD'
                                )
                            ))
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: React.createElement(
                                    'span',
                                    null,
                                    '\u56DE\u4F20\u65B9\u5F0F\xA0',
                                    React.createElement(
                                        Tooltip,
                                        { title: '\u8BF4\u660E\uFF1A\u8FB9\u7F18\u56DE\u4F20\uFF0C\u4FDD\u8BC1\u7528\u6237\u7684\u9AD8SLA\uFF1B\u8FB9\u7F18\u56DE\u4F20\u4FDD\u8BC1\u7528\u6237\u7684\u5B9E\u65F6\u6027\u3002\u53EF\u6839\u636E\u7528\u6237\u7684\u9700\u8981\u9009\u62E9\u5408\u9002\u7684\u56DE\u4F20\u65B9\u5F0F' },
                                        React.createElement(Icon, { type: 'question-circle-o' })
                                    )
                                ) }),
                            getFieldDecorator('backType', {
                                initialValue: this.state.backType,
                                rules: [{ required: true, message: '请选择回传方式!' }]
                            })(React.createElement(
                                Select,
                                { style: { width: 200 } },
                                React.createElement(
                                    Option,
                                    { value: '' },
                                    '\u8BF7\u9009\u62E9'
                                ),
                                React.createElement(
                                    Option,
                                    { value: 'CENTER' },
                                    '\u4E2D\u5FC3\u56DE\u4F20'
                                ),
                                React.createElement(
                                    Option,
                                    { value: 'EDGE' },
                                    '\u8FB9\u7F18\u56DE\u4F20'
                                )
                            ))
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u5B57\u6BB5\u95F4\u9694\u7B26\u8BBE\u7F6E', required: true }),
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    null,
                                    getFieldDecorator('fieldSeparator', {
                                        initialValue: this.state.fieldSeparator,
                                        rules: [{ required: true, message: '请选择字段间隔符!' }]
                                    })(React.createElement(
                                        Select,
                                        { style: { width: 200 }, onChange: $.proxy(this.onfieldSeparatorChange, this) },
                                        React.createElement(
                                            Option,
                                            { value: '' },
                                            '\u8BF7\u9009\u62E9'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: '    ' },
                                            'tab'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: ' ' },
                                            '\u7A7A\u683C'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: '|' },
                                            '|'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'custom' },
                                            '\u81EA\u5B9A\u4E49'
                                        )
                                    ))
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 12, style: { display: this.state.fieldSepCusValueVisible } },
                                React.createElement(
                                    FormItem,
                                    null,
                                    getFieldDecorator('fieldSeparatorCusValue', {
                                        initialValue: this.state.fieldSeparatorCusValue,
                                        rules: [{ required: true, message: '请输入自定义字段间隔符!' }]
                                    })(React.createElement(Input, { style: { width: 200 },
                                        onChange: $.proxy(this.onfieldSeparatorCusValueChange, this) }))
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u6362\u884C\u7B26\u8BBE\u7F6E', hasFeedback: true }),
                            getFieldDecorator('lineBreak', {
                                initialValue: this.state.lineBreak,
                                rules: [{
                                    required: true, message: '请输入换行符!' }, {}]
                            })(React.createElement(Input, null))
                        )
                    );
                }

                return baseInfoView;
            }
        }, {
            key: 'onfieldSeparatorChange',
            value: function onfieldSeparatorChange(value, option) {
                var setFieldsValue = this.props.form.setFieldsValue;

                if (value == "custom") {
                    this.setState({
                        fieldSepCusValueVisible: "inline-block"
                    });
                } else {
                    this.setState({
                        fieldSepCusValueVisible: "none"
                    });
                    setFieldsValue({ "fieldSeparatorCusValue": this.state.fieldSeparatorCusValue });
                }
            }
        }, {
            key: 'onfieldSeparatorCusValueChange',
            value: function onfieldSeparatorCusValueChange(event) {
                var value = event.target.value;
                if (value != "") {
                    this.setState({
                        fieldSeparatorCusValue: value
                    });
                }
            }
        }, {
            key: 'renderExportFieldTableView',
            value: function renderExportFieldTableView(formItemLayout) {
                var _this2 = this,
                    _React$createElement;

                var getFieldDecorator = this.props.form.getFieldDecorator;
                var _state = this.state,
                    templateFieldList = _state.templateFieldList,
                    fieldModalVisible = _state.fieldModalVisible,
                    curEditField = _state.curEditField;

                var exportFieldListView = "";
                var _props = this.props,
                    isView = _props.isView,
                    isEdit = _props.isEdit;

                var columns = [{
                    title: '序号',
                    dataIndex: 'order',
                    key: 'order'
                }, {
                    title: '原字段标识',
                    dataIndex: 'originFieldTag',
                    key: 'originFieldTag'
                }, {
                    title: '原字段名称',
                    dataIndex: 'originFieldName',
                    key: 'originFieldName'
                }, {
                    title: '导出字段标识',
                    dataIndex: 'exportFieldTag',
                    key: 'exportFieldTag'
                }, {
                    title: '导出字段名称',
                    dataIndex: 'exportFieldName',
                    key: 'exportFieldName'
                }, {
                    title: '导出数据类型',
                    dataIndex: 'exportFieldType',
                    key: 'exportFieldType'
                }, {
                    title: '赋值类型',
                    dataIndex: 'valueType',
                    key: 'valueType'
                }, {
                    title: '赋值参数',
                    dataIndex: 'param',
                    key: 'param'
                }, {
                    title: '样例',
                    dataIndex: 'example',
                    key: 'example'
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
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this2.onClickEditField, _this2) },
                                React.createElement(Icon, { type: 'edit' })
                            )
                        );
                        var deleteButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "删除" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this2.onClickDeleteNode, _this2) },
                                React.createElement(Icon, { type: 'delete' })
                            )
                        );
                        var buttonGroup = null;
                        if (isView && isEdit) {
                            buttonGroup = "-";
                        } else {
                            buttonGroup = React.createElement(
                                'div',
                                null,
                                editButton,
                                React.createElement('span', { className: 'ant-divider' }),
                                deleteButton
                            );
                        }
                        return buttonGroup;
                    }
                }];

                var addEditFieldView = "",
                    addButton = "";

                if (!this.props.isView) {
                    addEditFieldView = this.renderAddEditFieldView(formItemLayout); //<div style={{textAlign: "center"}}><Spin /></div>
                    addButton = React.createElement(
                        Button,
                        { icon: 'plus', size: 'small', onClick: $.proxy(this.onClickAddField, this) },
                        '\u65B0\u589E'
                    );
                }

                exportFieldListView = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u5BFC\u51FA\u5B57\u6BB5\u5217\u8868', required: true }),
                        addButton
                    ),
                    React.createElement(
                        FormItem,
                        { wrapperCol: { span: 24 } },
                        getFieldDecorator('templateFieldList', {
                            rules: [{ validator: this.validateTemplateFieldList }]
                        })(React.createElement(Table, { rowKey: 'order', columns: columns, pagination: false, size: 'small', dataSource: templateFieldList })),
                        React.createElement(
                            Modal,
                            (_React$createElement = { title: '导出字段', destroyOnClose: true, width: 800
                            }, _defineProperty(_React$createElement, 'destroyOnClose', true), _defineProperty(_React$createElement, 'visible', fieldModalVisible), _defineProperty(_React$createElement, 'onOk', $.proxy(this.handleFieldOk, this)), _defineProperty(_React$createElement, 'onCancel', $.proxy(this.handleModalCancel, this)), _React$createElement),
                            addEditFieldView
                        )
                    )
                );

                return exportFieldListView;
            }
        }, {
            key: 'validateTemplateFieldList',
            value: function validateTemplateFieldList(rule, value, callback) {
                if (this.state.templateFieldList.length != 0) {
                    callback();
                } else {
                    callback('请添加导出字段列表！');
                }
            }
        }, {
            key: 'onClickAddField',
            value: function onClickAddField(event) {
                this.setState({
                    isEditField: false,
                    curEditField: {},
                    fieldModalVisible: true
                });
            }
        }, {
            key: 'handleFieldOk',
            value: function handleFieldOk(e) {
                // "order": 1,
                // "originFieldTag": "log_type",
                // "originFieldName": "日志类型",
                // "exportFieldTag": "log_type",
                // "exportFieldName": "导出日志类型",
                // "exportFieldType": "string",
                // "valueType": "ORIGINAL_VALUE",
                // "param": "参数",
                // "example": "${log_type}"
                e.preventDefault();
                var _state2 = this.state,
                    templateFieldList = _state2.templateFieldList,
                    isEditField = _state2.isEditField,
                    curEditField = _state2.curEditField;
                var _props$form2 = this.props.form,
                    getFieldsValue = _props$form2.getFieldsValue,
                    validateFields = _props$form2.validateFields,
                    resetFields = _props$form2.resetFields;

                var newField = null;
                validateFields(["originFieldTag", "exportFieldTag", "exportFieldName", "exportFieldType", "valueType", "param"], function (err, vals) {
                    console.log(vals);
                    console.log(getFieldsValue());
                    // if (!err && !isEditField) {
                    //     newField = {
                    //         order: nodesList.length + 1,
                    //         id: Utility.randomStr(8),
                    //     }
                    //     this.setState({
                    //         templateFieldList: [...templateFieldList, newField],
                    //         fieldModalVisible: false
                    //     });
                    // } else if (!err && isEditField) {
                    //     _.find(templateFieldList, (el) => {
                    //         if (el.id == curEditNode.id) {

                    //         }
                    //     })

                    //     this.setState({
                    //         templateFieldList: [...templateFieldList],
                    //         fieldModalVisible: false
                    //     });
                    // }
                });
            }
        }, {
            key: 'handleModalCancel',
            value: function handleModalCancel() {
                this.setState({
                    fieldModalVisible: false
                });
            }
        }, {
            key: 'onClickEditField',
            value: function onClickEditField(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = _.find(this.state.templateFieldList, function (obj) {
                    return obj.id == id;
                }.bind(this));
                this.setState({
                    fieldModalVisible: true,
                    isEditField: true,
                    curEditField: model
                });
            }
        }, {
            key: 'onClickDeleteNode',
            value: function onClickDeleteNode(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                confirm({
                    title: '你确定要删除吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '算了，不删了',
                    onOk: function () {
                        var list = _.filter(this.state.templateFieldList, function (obj) {
                            return obj.id !== id;
                        }.bind(this));
                        _.each(list, function (el, index) {
                            el.order = index + 1;
                        });
                        this.setState({
                            templateFieldList: list
                        });
                    }.bind(this)
                });
            }
        }, {
            key: 'renderAddEditFieldView',
            value: function renderAddEditFieldView(formItemLayout) {
                var getFieldDecorator = this.props.form.getFieldDecorator;
                var _state3 = this.state,
                    curEditField = _state3.curEditField,
                    isEditField = _state3.isEditField;

                var addEditNodesView = "";
                addEditNodesView = React.createElement(
                    Form,
                    null,
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u539F\u5B57\u6BB5\u6807\u8BC6' }),
                        getFieldDecorator('originFieldTag', {
                            initialValue: curEditField.originFieldTag || "",
                            rules: [{ required: true, message: '请选择原字段标识!' }]
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
                            React.createElement(
                                Option,
                                { value: 'jack' },
                                'Jack'
                            ),
                            React.createElement(
                                Option,
                                { value: 'lucy' },
                                'Lucy'
                            ),
                            React.createElement(
                                Option,
                                { value: 'tom' },
                                'Tom'
                            )
                        ))
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u539F\u5B57\u6BB5\u540D\u79F0' }),
                        React.createElement(
                            'span',
                            { className: 'ant-form-text' },
                            curEditField.originFieldName || ""
                        )
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u5BFC\u51FA\u5B57\u6BB5\u6807\u8BC6', hasFeedback: true }),
                        getFieldDecorator('exportFieldTag', {
                            initialValue: curEditField.exportFieldTag || "",
                            rules: [{ required: true, message: '请输入导出字段标识!' }]
                        })(React.createElement(Input, null))
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u5BFC\u51FA\u5B57\u6BB5\u540D\u79F0', hasFeedback: true }),
                        getFieldDecorator('exportFieldName', {
                            initialValue: curEditField.exportFieldName || "",
                            rules: [{ required: true, message: '请输入导出字段名称!' }]
                        })(React.createElement(Input, null))
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u5BFC\u51FA\u6570\u636E\u7C7B\u578B' }),
                        getFieldDecorator('exportFieldType', {
                            initialValue: curEditField.exportFieldType || "",
                            rules: [{ required: true, message: '请选择原字段标识!' }]
                        })(React.createElement(
                            Select,
                            { style: { width: 200 } },
                            React.createElement(
                                Option,
                                { value: '' },
                                '\u8BF7\u9009\u62E9'
                            ),
                            React.createElement(
                                Option,
                                { value: 'LIVE' },
                                '\u76F4\u64AD'
                            ),
                            React.createElement(
                                Option,
                                { value: 'DOWNLOAD' },
                                '\u70B9\u64AD'
                            )
                        ))
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u8D4B\u503C\u7C7B\u578B' }),
                        getFieldDecorator('valueType', {
                            initialValue: curEditField.valueType || "",
                            rules: [{ required: true, message: '请选择赋值类型!' }]
                        })(React.createElement(
                            Select,
                            { style: { width: 200 } },
                            React.createElement(
                                Option,
                                { value: '' },
                                '\u8BF7\u9009\u62E9'
                            ),
                            React.createElement(
                                Option,
                                { value: 'LIVE' },
                                '\u76F4\u64AD'
                            ),
                            React.createElement(
                                Option,
                                { value: 'DOWNLOAD' },
                                '\u70B9\u64AD'
                            )
                        ))
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u8D4B\u503C\u53C2\u6570', hasFeedback: true }),
                        getFieldDecorator('param', {
                            initialValue: curEditField.param || "",
                            rules: [{ required: true, message: '请输入赋值参数!' }]
                        })(React.createElement(Input, null))
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u6837\u4F8B' }),
                        React.createElement(Alert, { message: curEditField.example || "", type: 'success', style: { minHeight: "40px" } })
                    )
                );

                return addEditNodesView;
            }
        }, {
            key: 'onSubmitSuccess',
            value: function onSubmitSuccess() {
                Utility.alerts("保存成功！", "success", 2000);
                this.onClickCancel();
            }
        }, {
            key: 'handleSubmit',
            value: function handleSubmit(e) {
                e.preventDefault();
                var _props$form3 = this.props.form,
                    resetFields = _props$form3.resetFields,
                    validateFields = _props$form3.validateFields;

                resetFields("nodesList");
                var checkArray = ["taskName", "taskDomain", "rangeTimePicker", "nodesList", "fileList"];
                if (this.props.isEdit) {
                    checkArray = ["nodesList"];
                }
                validateFields(checkArray, function (err, vals) {
                    var _this3 = this;

                    var postParam,
                        postNodesList = [],
                        model = this.props.model;
                    var collection = this.props.ltProps.collection;
                    if (!err) {
                        _.each(this.state.nodesList, function (node) {
                            var postNode = {
                                id: node.id,
                                sortnum: node.sortnum,
                                nodes: node.nodeNameArray.join(";")
                            },
                                timeWidthList = [];

                            if (!_this3.props.isEdit) delete postNode.id;

                            _.each(node.timeWidth, function (time) {
                                var timeObj = {
                                    bandwidth: time.bandwidth,
                                    batchEndTime: moment(time.batchEndTime, 'HH:mm').valueOf(),
                                    id: time.id,
                                    batchStartTime: moment(time.batchStartTime, 'HH:mm').valueOf()
                                };
                                if (!_this3.props.isEdit) delete timeObj.id;

                                timeWidthList.push(timeObj);
                            });
                            postNode.timeWidth = timeWidthList;
                            postNodesList.push(postNode);
                        });

                        if (!this.props.isEdit) {
                            postParam = {
                                taskName: vals.taskName,
                                preloadChannel: vals.taskDomain,
                                preloadFilePath: this.state.preloadFilePath,
                                preloadUrlCount: this.state.preloadUrlCount,
                                startTime: vals.rangeTimePicker[0].valueOf(),
                                endTime: vals.rangeTimePicker[1].valueOf(),
                                batchTimeBandwidth: postNodesList,
                                committer: $(".user-name").html()
                            };
                            console.log(postParam);
                            collection.commitTask(postParam);
                        } else {

                            postParam = {
                                taskId: model.id,
                                batchTimeBandwidth: postNodesList
                            };
                            console.log(postParam);
                            collection.taskModify(postParam);
                        }
                    }
                }.bind(this));
            }
        }, {
            key: 'onClickCancel',
            value: function onClickCancel() {
                var onClickCancelCallback = this.props.ltProps.onClickCancelCallback;
                onClickCancelCallback && onClickCancelCallback();
            }
        }, {
            key: 'handleTimeCancel',
            value: function handleTimeCancel() {
                this.setState({
                    timeModalVisible: false
                });
            }
        }, {
            key: 'handleNodeSearch',
            value: function handleNodeSearch(value) {
                var ltProps = this.props.ltProps;
                var nodeArray = [],
                    nodeList = ltProps.nodeList;
                if (value && nodeList) {
                    nodeArray = _.filter(nodeList, function (el) {
                        return el.name.indexOf(value) > -1 || el.chName.indexOf(value) > -1;
                    }.bind(this)).map(function (el) {
                        return React.createElement(
                            Option,
                            { key: el.name },
                            el.name
                        );
                    });
                }

                this.setState({
                    nodeDataSource: nodeArray
                });
            }
        }, {
            key: 'onClickAddTime',
            value: function onClickAddTime(event) {
                this.setState({
                    isEditTime: false,
                    curEditTime: {},
                    timeModalVisible: true
                });
            }
        }, {
            key: 'handleTimeOk',
            value: function handleTimeOk(e) {
                var _this4 = this;

                e.preventDefault();
                var _state4 = this.state,
                    timeBandList = _state4.timeBandList,
                    isEditTime = _state4.isEditTime,
                    curEditTime = _state4.curEditTime;
                var _props$form4 = this.props.form,
                    getFieldsValue = _props$form4.getFieldsValue,
                    validateFields = _props$form4.validateFields,
                    resetFields = _props$form4.resetFields;

                var newTimeBand = null;
                validateFields(["selectStartTime", "selectEndTime", "inputBand"], function (err, vals) {
                    var format = 'HH:mm';
                    if (!err && !isEditTime) {
                        console.log(getFieldsValue());
                        newTimeBand = {
                            id: Utility.randomStr(8),
                            batchStartTime: getFieldsValue().selectStartTime.format(format),
                            batchEndTime: getFieldsValue().selectEndTime.format(format),
                            bandwidth: getFieldsValue().inputBand
                        };
                        _this4.setState({
                            timeBandList: [].concat(_toConsumableArray(timeBandList), [newTimeBand]),
                            timeModalVisible: false
                        });
                    } else if (!err && isEditTime) {
                        _.each(timeBandList, function (el) {
                            if (el.id == curEditTime.id) {
                                el.batchStartTime = getFieldsValue().selectStartTime.format(format);
                                el.batchEndTime = getFieldsValue().selectEndTime.format(format);
                                el.bandwidth = getFieldsValue().inputBand;
                            }
                        });
                        _this4.setState({
                            timeBandList: [].concat(_toConsumableArray(timeBandList)),
                            timeModalVisible: false
                        });
                    }
                });
            }
        }, {
            key: 'handleEditTimeClick',
            value: function handleEditTimeClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = _.find(this.state.timeBandList, function (obj) {
                    return obj.id == id;
                }.bind(this));
                var format = 'HH:mm',
                    selectStartTime = model.batchStartTime,
                    selectEndTime = model.batchEndTime;
                this.setState({
                    timeModalVisible: true,
                    isEditTime: true,
                    curEditTime: {
                        selectStartTime: moment(selectStartTime, format),
                        selectEndTime: moment(selectEndTime, format),
                        bandwidth: model.bandwidth,
                        id: model.id
                    }
                });
            }
        }, {
            key: 'handleDeleteTimeClick',
            value: function handleDeleteTimeClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                confirm({
                    title: '你确定要删除吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '算了，不删了',
                    onOk: function () {
                        var list = _.filter(this.state.timeBandList, function (obj) {
                            return obj.id != id;
                        }.bind(this));
                        this.setState({
                            timeBandList: list
                        });
                    }.bind(this)
                });
            }
        }, {
            key: 'renderTimeBandTableView',
            value: function renderTimeBandTableView(formItemLayout) {
                var _this5 = this,
                    _React$createElement2;

                var getFieldDecorator = this.props.form.getFieldDecorator;
                var _state5 = this.state,
                    timeModalVisible = _state5.timeModalVisible,
                    curEditTime = _state5.curEditTime;

                var timeBandView = "",
                    model = this.props.model;
                var columns = [{
                    title: '执行时间',
                    dataIndex: 'batchStartTime',
                    key: 'batchStartTime',
                    render: function render(text, record) {
                        return text + "~" + record.batchEndTime;
                    }
                }, {
                    title: '回源带宽',
                    dataIndex: 'bandwidth',
                    key: 'bandwidth',
                    render: function render(text, record) {
                        return text + "M";
                    }
                }, {
                    title: '操作',
                    dataIndex: 'id',
                    key: 'action',
                    render: function render(text, record) {
                        var editButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "编辑" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this5.handleEditTimeClick, _this5) },
                                React.createElement(Icon, { type: 'edit' })
                            )
                        );
                        var deleteButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "删除" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this5.handleDeleteTimeClick, _this5) },
                                React.createElement(Icon, { type: 'delete' })
                            )
                        );
                        var buttonGroup;
                        buttonGroup = React.createElement(
                            'div',
                            null,
                            editButton,
                            React.createElement('span', { className: 'ant-divider' }),
                            deleteButton
                        );
                        return buttonGroup;
                    }
                }];

                var format = 'HH:mm';

                var addEditTimeView = React.createElement(
                    Form,
                    null,
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u6267\u884C\u65F6\u95F4', required: true }),
                        React.createElement(
                            Col,
                            { span: 11 },
                            React.createElement(
                                FormItem,
                                null,
                                getFieldDecorator('selectStartTime', {
                                    rules: [{ required: true, message: '请选择开始时间!' }],
                                    initialValue: curEditTime.selectStartTime || moment('00:00', format)
                                })(React.createElement(TimePicker, { format: format, minuteStep: 1 }))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 2 },
                            React.createElement(
                                'span',
                                { style: { display: 'inline-block', width: '100%', textAlign: 'center' } },
                                '-'
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 11 },
                            React.createElement(
                                FormItem,
                                null,
                                getFieldDecorator('selectEndTime', {
                                    rules: [{ required: true, message: '请选择结束时间!' }],
                                    initialValue: curEditTime.selectEndTime || moment('23:59', format)
                                })(React.createElement(TimePicker, { format: format, minuteStep: 1 }))
                            )
                        )
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u56DE\u6E90\u5E26\u5BBD' }),
                        getFieldDecorator('inputBand', {
                            initialValue: curEditTime.bandwidth || 100,
                            rules: [{ required: true, message: '请输入带宽!' }]
                        })(React.createElement(InputNumber, null)),
                        React.createElement(
                            'span',
                            { style: { marginLeft: "10px" } },
                            'M'
                        )
                    )
                );

                timeBandView = React.createElement(
                    FormItem,
                    _extends({}, formItemLayout, { label: '\u5206\u65F6\u4EFB\u52A1', required: true }),
                    React.createElement(
                        Button,
                        { icon: 'plus', size: 'small', onClick: $.proxy(this.onClickAddTime, this) },
                        '\u65B0\u5EFA\u5206\u65F6\u4EFB\u52A1'
                    ),
                    React.createElement(Alert, { style: { marginBottom: '10px' }, message: '\u4EC5\u5728\u6DFB\u52A0\u7684\u5206\u65F6\u4EFB\u52A1\u65F6\u95F4\u6BB5\u5185\u8FDB\u884C\u9884\u70ED', type: 'info', showIcon: true }),
                    getFieldDecorator('timeBand', {
                        rules: [{ validator: this.validateTimeBand }]
                    })(React.createElement(Table, { rowKey: 'id', columns: columns, pagination: false, size: 'small', dataSource: this.state.timeBandList })),
                    React.createElement(
                        Modal,
                        (_React$createElement2 = { title: '分时任务', destroyOnClose: true
                        }, _defineProperty(_React$createElement2, 'destroyOnClose', true), _defineProperty(_React$createElement2, 'visible', timeModalVisible), _defineProperty(_React$createElement2, 'onOk', $.proxy(this.handleTimeOk, this)), _defineProperty(_React$createElement2, 'onCancel', $.proxy(this.handleTimeCancel, this)), _React$createElement2),
                        addEditTimeView
                    )
                );

                return timeBandView;
            }
        }, {
            key: 'disabledDate',
            value: function disabledDate(current) {
                return current && current < moment().add(-1, 'day');
            }
        }, {
            key: 'disabledTime',
            value: function disabledTime(type) {
                function range(start, end) {
                    var result = [];
                    for (var i = start; i < end; i++) {
                        result.push(i);
                    }
                    return result;
                }

                if (type === 'start') {
                    return {
                        disabledHours: function disabledHours() {
                            return range(0, moment().hour() + 1);
                        }
                    };
                }
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

                var formItemLayout = {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 12 }
                };
                var baseInfoView = this.renderBaseInfoView(formItemLayout);
                var exportFieldListView = this.renderExportFieldTableView(formItemLayout);
                var saveButton = null,
                    editView = null;
                if (!this.props.isView) saveButton = React.createElement(
                    Button,
                    { type: 'primary', htmlType: 'submit' },
                    '\u4FDD\u5B58'
                );

                if (this.state.isLoadingTplDetail) {
                    editView = React.createElement(
                        'div',
                        { style: { textAlign: "center" } },
                        React.createElement(Spin, null)
                    );
                } else {
                    editView = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            Form,
                            { onSubmit: this.handleSubmit },
                            baseInfoView,
                            exportFieldListView,
                            React.createElement(
                                FormItem,
                                { wrapperCol: { span: 12, offset: 6 } },
                                saveButton,
                                React.createElement(
                                    Button,
                                    { onClick: this.onClickCancel, style: { marginLeft: "10px" } },
                                    '\u53D6\u6D88'
                                )
                            )
                        )
                    );
                }

                return editView;
            }
        }]);

        return LogTplManageEditForm;
    }(React.Component);

    var LogTplManageEditView = Form.create()(LogTplManageEditForm);
    return LogTplManageEditView;
});
