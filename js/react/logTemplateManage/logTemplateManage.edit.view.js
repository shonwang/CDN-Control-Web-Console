'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
        Icon = Antd.Icon,
        Tooltip = Antd.Tooltip,
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
            _this.convertEnumToShowStr = _this.convertEnumToShowStr.bind(_this);
            _this.getFieldExample = _this.getFieldExample.bind(_this);
            _this.validateFieldSeparatorCusValue = _this.validateFieldSeparatorCusValue.bind(_this);

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
                curEditField: {},

                dataSourceOriginFieldTag: []
            };
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
                collection.on("add.template.success", $.proxy(this.onSubmitSuccess, this));
                collection.on("add.template.error", $.proxy(this.onGetError, this));
                require(['logTemplateManage.field.model'], function (LogTplManageOriginField) {
                    this.logTplManageOriginField = LogTplManageOriginField;
                    var originFieldTagArray = LogTplManageOriginField.map(function (el, index) {
                        return React.createElement(
                            Option,
                            { key: el.id },
                            el.field
                        );
                    });
                    this.setState({
                        dataSourceOriginFieldTag: originFieldTagArray
                    });
                }.bind(this));
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var collection = this.props.ltProps.collection;
                collection.off("add.template.success");
                collection.off("add.template.error");
                if (this.props.isEdit) {
                    collection.off("template.detail.success");
                    collection.off("template.detail.error");
                }
            }
        }, {
            key: 'onGetTplDetailSuccess',
            value: function onGetTplDetailSuccess(res) {
                this.groupId = res.groupId;
                this.originCreateTime = res.originCreateTime;
                if (res.fieldSeparator != "\t" && res.fieldSeparator != " " && res.fieldSeparator != "|") {
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
            key: 'convertEnumToShowStr',
            value: function convertEnumToShowStr() {
                var _state = this.state,
                    productType = _state.productType,
                    backType = _state.backType,
                    fieldSeparator = _state.fieldSeparator,
                    fieldSeparatorCusValue = _state.fieldSeparatorCusValue;

                var colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];

                var dataForShow = {
                    productType: "",
                    backType: "",
                    fieldSeparator: ""
                };

                if (productType == "DOWNLOAD") {
                    dataForShow.productType = "下载";
                } else if (productType == "LIVE") {
                    dataForShow.productType = "直播";
                }
                if (backType == "CENTER") {
                    dataForShow.backType = "中心回传";
                } else if (backType == "EDGE") {
                    dataForShow.backType = "边缘回传";
                }
                if (fieldSeparator == "custom") {
                    dataForShow.fieldSeparator = fieldSeparatorCusValue;
                } else {
                    dataForShow.fieldSeparator = fieldSeparator;
                }

                return dataForShow;
            }
        }, {
            key: 'renderBaseInfoView',
            value: function renderBaseInfoView(formItemLayout) {
                var _props$form = this.props.form,
                    getFieldDecorator = _props$form.getFieldDecorator,
                    setFieldsValue = _props$form.setFieldsValue,
                    getFieldValue = _props$form.getFieldValue;

                var baseInfoView = null;
                // backType的取值类型 DOWNLOAD（下载）LIVE（直播） 
                // backType的取值类型 CENTER（中心回传） EDGE（边缘回传）
                if (this.props.isView) {
                    var dataForShow = this.convertEnumToShowStr();
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
                                dataForShow.productType
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u56DE\u4F20\u65B9\u5F0F', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                dataForShow.backType
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u5B57\u6BB5\u95F4\u9694\u7B26\u8BBE\u7F6E', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                dataForShow.fieldSeparator
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
                                rules: [{ required: true, message: '请输入模板名称!' }, { pattern: /^[0-9A-Za-z\_]+$/, message: '模板名称只能输入英文数字下划线!' }, { max: 64, message: '模板名称定长64个字符!' }]
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
                                { style: { width: 200 }, disabled: this.props.isEdit },
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
                                            { value: '\\t' },
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
                                        rules: [{ validator: this.validateFieldSeparatorCusValue }]
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
            key: 'validateFieldSeparatorCusValue',
            value: function validateFieldSeparatorCusValue(rule, value, callback) {
                var getFieldsValue = this.props.form.getFieldsValue;

                var fieldSeparator = getFieldsValue().fieldSeparator;
                if (fieldSeparator == "custom" && value == "") {
                    callback('请输入自定义字段间隔符!');
                } else {
                    callback();
                }
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
                var _this2 = this;

                var getFieldDecorator = this.props.form.getFieldDecorator;
                var _state2 = this.state,
                    templateFieldList = _state2.templateFieldList,
                    fieldModalVisible = _state2.fieldModalVisible,
                    curEditField = _state2.curEditField;

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
                    key: 'valueType',
                    render: function render(text, record) {
                        var tag = null;
                        if (record.valueType == "ORIGINAL_VALUE") tag = "原值";else if (record.valueType == "FIXED_VALUE") tag = "固定值";else if (record.valueType == "PREFIX_VALUE") tag = "前缀";else if (record.valueType == "SUFFIX_VALUE") tag = "后缀";else if (record.valueType == "PREFIX_AND_SUFFIX_VALUE") tag = "前后缀";
                        return tag;
                    }
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
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this2.onClickDeleteField, _this2) },
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
                            { title: '导出字段', width: 800,
                                destroyOnClose: true,
                                visible: fieldModalVisible,
                                onOk: $.proxy(this.handleFieldOk, this),
                                onCancel: $.proxy(this.handleModalCancel, this) },
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
                var _this3 = this;

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
                var _state3 = this.state,
                    templateFieldList = _state3.templateFieldList,
                    isEditField = _state3.isEditField,
                    curEditField = _state3.curEditField;
                var _props$form2 = this.props.form,
                    getFieldsValue = _props$form2.getFieldsValue,
                    validateFields = _props$form2.validateFields,
                    resetFields = _props$form2.resetFields;

                var newField = null,
                    fieldObj = void 0;
                validateFields(["originFieldTag", "exportFieldTag", "exportFieldName", "exportFieldType", "valueType", "param"], function (err, vals) {
                    console.log("点击OK时的字段：", vals);
                    if (!err && !isEditField) {
                        fieldObj = _.find(_this3.logTplManageOriginField, function (el) {
                            return el.id == vals.originFieldTag;
                        });
                        newField = {
                            order: templateFieldList.length + 1,
                            id: Utility.randomStr(8),
                            originFieldTag: fieldObj.field,
                            originFieldName: curEditField.originFieldName,
                            exportFieldTag: vals.exportFieldTag,
                            exportFieldName: vals.exportFieldName,
                            exportFieldType: vals.exportFieldType,
                            valueType: vals.valueType,
                            param: vals.param,
                            example: curEditField.example
                        };
                        _this3.setState({
                            templateFieldList: [].concat(_toConsumableArray(templateFieldList), [newField]),
                            fieldModalVisible: false
                        });
                    } else if (!err && isEditField) {
                        fieldObj = _.find(_this3.logTplManageOriginField, function (el) {
                            return el.id == vals.originFieldTag || el.field == vals.originFieldTag;
                        });
                        _.find(templateFieldList, function (el) {
                            if (el.id == curEditField.id) {
                                el.originFieldTag = fieldObj.field, el.originFieldName = curEditField.originFieldName, el.exportFieldTag = vals.exportFieldTag, el.exportFieldName = vals.exportFieldName, el.exportFieldType = vals.exportFieldType, el.valueType = vals.valueType, el.param = vals.param, el.example = curEditField.example;
                            }
                        });

                        _this3.setState({
                            templateFieldList: [].concat(_toConsumableArray(templateFieldList)),
                            fieldModalVisible: false
                        });
                    }
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
            key: 'onClickDeleteField',
            value: function onClickDeleteField(event) {
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
                var _state4 = this.state,
                    curEditField = _state4.curEditField,
                    isEditField = _state4.isEditField;

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
                                style: { width: 300 },
                                optionFilterProp: 'children',
                                filterOption: function filterOption(input, option) {
                                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                },
                                onChange: $.proxy(this.onOriginFieldTagChange, this)
                            },
                            this.state.dataSourceOriginFieldTag
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
                                { value: 'string' },
                                'string'
                            ),
                            React.createElement(
                                Option,
                                { value: 'int' },
                                'int'
                            ),
                            React.createElement(
                                Option,
                                { value: 'double' },
                                'double'
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
                            { style: { width: 200 }, onChange: $.proxy(this.onValueTypeChange, this) },
                            React.createElement(
                                Option,
                                { value: '' },
                                '\u8BF7\u9009\u62E9'
                            ),
                            React.createElement(
                                Option,
                                { value: 'ORIGINAL_VALUE' },
                                '\u539F\u503C'
                            ),
                            React.createElement(
                                Option,
                                { value: 'FIXED_VALUE' },
                                '\u56FA\u5B9A\u503C'
                            ),
                            React.createElement(
                                Option,
                                { value: 'PREFIX_VALUE' },
                                '\u524D\u7F00'
                            ),
                            React.createElement(
                                Option,
                                { value: 'SUFFIX_VALUE' },
                                '\u540E\u7F00'
                            ),
                            React.createElement(
                                Option,
                                { value: 'PREFIX_AND_SUFFIX_VALUE' },
                                '\u524D\u540E\u7F00(\u8BF7\u4EE5","\u5206\u5272)'
                            )
                        ))
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u8D4B\u503C\u53C2\u6570', hasFeedback: true }),
                        getFieldDecorator('param', {
                            initialValue: curEditField.param || "",
                            rules: [{ required: true, message: '请输入赋值参数!' }]
                        })(React.createElement(Input, { onChange: $.proxy(this.onParamChange, this) }))
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
            key: 'getFieldExample',
            value: function getFieldExample(originField, valueType, param) {
                var example = "",
                    prefix,
                    suffix;
                if (valueType && param && originField) {
                    if (valueType == "ORIGINAL_VALUE") {
                        example = "${" + originField + "}";
                    } else if (valueType == "FIXED_VALUE") {
                        example = param;
                    } else if (valueType == "PREFIX_VALUE") {
                        example = param + "${" + originField + "}";
                    } else if (valueType == "SUFFIX_VALUE") {
                        example = "${" + originField + "}" + param;
                    } else if (valueType == "PREFIX_AND_SUFFIX_VALUE") {
                        prefix = param.split(",")[0];
                        suffix = param.split(",")[1];
                        example = prefix + "${" + originField + "}" + suffix;
                    }
                }
                return example;
            }
        }, {
            key: 'onOriginFieldTagChange',
            value: function onOriginFieldTagChange(value) {
                var _props$form3 = this.props.form,
                    setFieldsValue = _props$form3.setFieldsValue,
                    getFieldsValue = _props$form3.getFieldsValue;

                var fieldObj,
                    curEditField = this.state.curEditField,
                    fieldFormObj = getFieldsValue(),
                    valueType = fieldFormObj.valueType,
                    param = fieldFormObj.param;

                if (value) {
                    fieldObj = _.find(this.logTplManageOriginField, function (el) {
                        return el.id == value;
                    });
                    setFieldsValue({ "exportFieldType": fieldObj.type });
                    curEditField.originFieldName = fieldObj.name;
                    curEditField.example = this.getFieldExample(fieldObj.field, valueType, param);
                } else {
                    setFieldsValue({ "exportFieldType": "" });
                    curEditField.originFieldName = "";
                    curEditField.example = "";
                }

                this.setState({
                    curEditField: curEditField
                });
            }
        }, {
            key: 'onParamChange',
            value: function onParamChange(e) {
                var _props$form4 = this.props.form,
                    setFieldsValue = _props$form4.setFieldsValue,
                    getFieldsValue = _props$form4.getFieldsValue;

                var curEditField = this.state.curEditField,
                    fieldFormObj = getFieldsValue(),
                    valueType = fieldFormObj.valueType,
                    param = e.target.value,
                    originFieldTag = fieldFormObj.originFieldTag,
                    fieldObj = _.find(this.logTplManageOriginField, function (el) {
                    return el.id == originFieldTag;
                });
                curEditField.example = this.getFieldExample(fieldObj.field, valueType, param);

                this.setState({
                    curEditField: curEditField
                });
            }
        }, {
            key: 'onValueTypeChange',
            value: function onValueTypeChange(value) {
                var _props$form5 = this.props.form,
                    setFieldsValue = _props$form5.setFieldsValue,
                    getFieldsValue = _props$form5.getFieldsValue;

                var curEditField = this.state.curEditField,
                    fieldFormObj = getFieldsValue(),
                    valueType = value,
                    param = fieldFormObj.param,
                    originFieldTag = fieldFormObj.originFieldTag,
                    fieldObj = _.find(this.logTplManageOriginField, function (el) {
                    return el.id == originFieldTag || el.field == originFieldTag;
                });
                curEditField.example = this.getFieldExample(fieldObj.field, valueType, param);

                this.setState({
                    curEditField: curEditField
                });
            }
        }, {
            key: 'onSubmitSuccess',
            value: function onSubmitSuccess() {
                Utility.alerts("保存成功，并发送邮件给日志管理小组发布，请尽快和小组成员联系", "success", 2000);
                this.onClickCancel();
            }
        }, {
            key: 'handleSubmit',
            value: function handleSubmit(e) {
                e.preventDefault();
                var _props$form6 = this.props.form,
                    resetFields = _props$form6.resetFields,
                    validateFields = _props$form6.validateFields;

                resetFields("templateFieldList");
                var checkArray = ["name", "productType", "backType", "fieldSeparator", "fieldSeparatorCusValue", 'lineBreak', 'templateFieldList'];
                if (this.props.isEdit) {
                    checkArray = ["productType", "backType", "fieldSeparator", "fieldSeparatorCusValue", 'lineBreak', "templateFieldList"];
                }
                validateFields(checkArray, function (err, vals) {
                    var postParam,
                        model = this.props.model;
                    var collection = this.props.ltProps.collection;
                    if (!err) {
                        postParam = {
                            name: vals.name || this.state.name,
                            productType: vals.productType,
                            backType: vals.backType,
                            fieldSeparator: vals.fieldSeparator == "custom" ? vals.fieldSeparatorCusValue : vals.fieldSeparator,
                            lineBreak: vals.lineBreak,
                            templateFieldList: this.state.templateFieldList
                        };
                        if (this.props.isEdit) {
                            postParam.groupId = this.groupId, postParam.originCreateTime = this.originCreateTime;
                        }
                        collection.addTemplate(postParam);
                        console.log(vals);
                    }
                }.bind(this));
            }
        }, {
            key: 'onClickCancel',
            value: function onClickCancel() {
                var onClickCancelCallback = this.props.ltProps.onClickCancelCallback,
                    onClickHistoryCallback = this.props.ltProps.onClickHistoryCallback;

                if (this.props.backTarget != "history") onClickCancelCallback && onClickCancelCallback();else onClickHistoryCallback && onClickHistoryCallback({ groupId: this.groupId });
            }
        }, {
            key: 'onGetError',
            value: function onGetError(error) {
                if (error && error.message) Utility.alerts(error.message);else if (error && error.Error && error.Error.Message) Utility.alerts(error.Error.Message);else Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
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
