'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("netRateLimiting.edit.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], function (require, exports, template, BaseView, Utility, Antd, React, moment) {

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
        InputNumber = Antd.InputNumber,
        Switch = Antd.Switch,
        confirm = Modal.confirm;

    var NetRateLimitingEditForm = function (_React$Component) {
        _inherits(NetRateLimitingEditForm, _React$Component);

        function NetRateLimitingEditForm(props, context) {
            _classCallCheck(this, NetRateLimitingEditForm);

            var _this = _possibleConstructorReturn(this, (NetRateLimitingEditForm.__proto__ || Object.getPrototypeOf(NetRateLimitingEditForm)).call(this, props));

            _this.onClickCancel = _this.onClickCancel.bind(_this);
            _this.renderBaseInfoView = _this.renderBaseInfoView.bind(_this);
            _this.renderFieldTableView = _this.renderFieldTableView.bind(_this);
            _this.handleSubmit = _this.handleSubmit.bind(_this);

            _this.state = {
                currentSubType: -1,
                origins: [],
                quotaUnits: "",
                totalQuota: "",
                advanceStrategy: [],
                defaultStrategy: {},
                isAdvance: false,

                isLoadingDetail: props.isEdit ? true : false,
                fieldModalVisible: false,
                isEditField: false,
                curEditField: {},

                dataSourceDomains: []
            };
            return _this;
        }

        _createClass(NetRateLimitingEditForm, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var limitProps = this.props.limitProps,
                    collection = limitProps.collection;
                collection.on("get.domain.success", $.proxy(this.onGetDomainSuccess, this));
                collection.on("get.domain.error", $.proxy(this.onGetError, this));
                if (this.props.isEdit) {
                    var model = this.props.model;
                    collection.on("get.detail.success", $.proxy(this.onGetDetailSuccess, this));
                    collection.on("get.detail.error", $.proxy(this.onGetError, this));
                    collection.getLimitRateDetailByGroupId({ groupId: model.id });
                } else {
                    collection.getDomainsBySubType({
                        userId: this.props.limitProps.userInfo.uid,
                        //groupId: this.props.model.id,
                        subType: this.state.currentSubType
                    });
                }
                collection.on("update.detail.success", $.proxy(this.onSubmitSuccess, this));
                collection.on("update.detail.error", $.proxy(this.onGetError, this));
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var collection = this.props.limitProps.collection;
                collection.off("update.detail.success");
                collection.off("update.detail.error");
                collection.off("get.domain.success");
                collection.off("get.domain.error");
                if (this.props.isEdit) {
                    collection.off("get.detail.success");
                    collection.off("get.detail.error");
                }
            }
        }, {
            key: 'onGetDetailSuccess',
            value: function onGetDetailSuccess(res) {
                var defaultStrategy = res.strategys.shift(),
                    advanceStrategy = res.strategys,
                    origins = [];

                _.each(res.origins, function (el) {
                    origins.push(el.originId + "");
                }.bind(this));

                this.setState({
                    currentSubType: res.currentSubType,
                    origins: origins,
                    quotaUnits: res.group.quotaUnits,
                    totalQuota: res.group.totalQuota,
                    advanceStrategy: advanceStrategy,
                    defaultStrategy: defaultStrategy,
                    isAdvance: res.advancedConf == 1 ? true : false //advanceStrategy.length > 0 ? true : false
                });

                var collection = this.props.limitProps.collection;
                collection.getDomainsBySubType({
                    userId: this.props.limitProps.userInfo.uid,
                    groupId: this.props.model.id,
                    subType: this.state.currentSubType
                });
            }
        }, {
            key: 'onGetDomainSuccess',
            value: function onGetDomainSuccess(res) {
                var domainArray = res.origins.map(function (el) {
                    return React.createElement(
                        Option,
                        { key: el.originId + "" },
                        el.domain
                    );
                });

                this.setState({
                    dataSourceDomains: domainArray,
                    isLoadingDetail: false
                });
            }
        }, {
            key: 'onCurrentSubTypeChange',
            value: function onCurrentSubTypeChange(value) {
                var _props$form = this.props.form,
                    setFieldsValue = _props$form.setFieldsValue,
                    getFieldsValue = _props$form.getFieldsValue;

                setFieldsValue({ "origins": [] });
                this.setState({
                    dataSourceDomains: []
                });
                var collection = this.props.limitProps.collection;
                if (this.props.isEdit) {
                    collection.getDomainsBySubType({
                        userId: this.props.limitProps.userInfo.uid,
                        groupId: this.props.model.id,
                        subType: value
                    });
                } else {
                    collection.getDomainsBySubType({
                        userId: this.props.limitProps.userInfo.uid,
                        subType: value
                    });
                }
            }
        }, {
            key: 'onStrategyModeChange',
            value: function onStrategyModeChange(value) {
                var resetFields = this.props.form.resetFields;

                var defaultStrategy = this.state.defaultStrategy;
                defaultStrategy.currentMode = value;
                this.setState({
                    defaultStrategy: defaultStrategy
                });
                resetFields("strategyLimit");
                resetFields("strategyCode");
                resetFields("strategyOrigin");
            }
        }, {
            key: 'onAdvanceStrategyModeChange',
            value: function onAdvanceStrategyModeChange(value) {
                var resetFields = this.props.form.resetFields;

                var curEditField = this.state.curEditField;
                curEditField.currentMode = value;
                this.setState({
                    curEditField: curEditField
                });
                resetFields("advanceStrategyLimit");
                resetFields("advanceStrategyCode");
                resetFields("advanceStrategyOrigin");
            }
        }, {
            key: 'validateStrategyLimit',
            value: function validateStrategyLimit(rule, value, callback) {
                var currentMode = this.state.defaultStrategy.currentMode;
                if (currentMode == 3 && !value || value == 0) {
                    if (value === 0) {
                        callback();
                    } else {
                        callback('请输入自定义限速！');
                    }
                } else {
                    callback();
                }
            }
        }, {
            key: 'validateStrategyCode',
            value: function validateStrategyCode(rule, value, callback) {
                var currentMode = this.state.defaultStrategy.currentMode;
                if (currentMode == 2 && !value) {
                    if (value === 0) {
                        callback();
                    } else {
                        callback('请输入自定义状态码！');
                    }
                } else {
                    callback();
                }
            }
        }, {
            key: 'validateStrategyOrigin',
            value: function validateStrategyOrigin(rule, value, callback) {
                var currentMode = this.state.defaultStrategy.currentMode;
                if (currentMode == 1 && value && Utility.isDomain(value)) {
                    callback();
                } else if (currentMode == 1 && value && Utility.isIP(value)) {
                    callback();
                } else if (currentMode == 1) {
                    callback('请输入正确的自定义回源！');
                } else {
                    callback();
                }
            }
        }, {
            key: 'validateAdvanceStrategyLimit',
            value: function validateAdvanceStrategyLimit(rule, value, callback) {
                var currentMode = this.state.curEditField.currentMode;
                if (currentMode == 3 && !value || value == 0) {
                    if (value === 0) {
                        callback();
                    } else {
                        callback('请输入自定义限速！');
                    }
                } else {
                    callback();
                }
            }
        }, {
            key: 'validateAdvanceStrategyCode',
            value: function validateAdvanceStrategyCode(rule, value, callback) {
                var currentMode = this.state.curEditField.currentMode;
                if (currentMode == 2 && !value) {
                    if (value === 0) {
                        callback();
                    } else {
                        callback('请输入自定义状态码！');
                    }
                } else {
                    callback();
                }
            }
        }, {
            key: 'validateAdvanceStrategyOrigin',
            value: function validateAdvanceStrategyOrigin(rule, value, callback) {
                var currentMode = this.state.curEditField.currentMode;
                if (currentMode == 1 && value && Utility.isDomain(value)) {
                    callback();
                } else if (currentMode == 1 && value && Utility.isIP(value)) {
                    callback();
                } else if (currentMode == 1) {
                    callback('请输入正确的自定义回源！');
                } else {
                    callback();
                }
            }
        }, {
            key: 'onAdvanceButtonChange',
            value: function onAdvanceButtonChange(checked) {
                this.setState({
                    isAdvance: checked
                });
            }
        }, {
            key: 'renderBaseInfoView',
            value: function renderBaseInfoView(formItemLayout) {
                var _props$form2 = this.props.form,
                    getFieldDecorator = _props$form2.getFieldDecorator,
                    setFieldsValue = _props$form2.setFieldsValue,
                    getFieldValue = _props$form2.getFieldValue;

                var baseInfoView = null;

                baseInfoView = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u9650\u901F\u57DF\u540D', required: true }),
                        React.createElement(
                            Col,
                            { span: 8 },
                            React.createElement(
                                FormItem,
                                null,
                                getFieldDecorator('currentSubType', {
                                    initialValue: this.state.currentSubType + "",
                                    rules: [{ required: true, message: '请选择字段间隔符!' }]
                                })(React.createElement(
                                    Select,
                                    { style: { width: 150 }, onChange: $.proxy(this.onCurrentSubTypeChange, this) },
                                    React.createElement(
                                        Option,
                                        { value: '-1' },
                                        '\u5168\u90E8\u7C7B\u578B'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: '1' },
                                        '\u97F3\u89C6\u9891\u70B9\u64AD'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: '2', style: { display: "none" } },
                                        '\u6D41\u5A92\u4F53\u76F4\u64AD'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: '3', style: { display: "none" } },
                                        '\u76F4\u64AD\u63A8\u6D41\u52A0\u901F'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: '4' },
                                        '\u5927\u6587\u4EF6\u4E0B\u8F7D'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: '5' },
                                        '\u56FE\u7247\u5C0F\u6587\u4EF6'
                                    )
                                ))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 12 },
                            React.createElement(
                                FormItem,
                                null,
                                getFieldDecorator('origins', {
                                    initialValue: this.state.origins,
                                    rules: [{ type: "array", required: true, message: '请选择域名!' }]
                                })(React.createElement(
                                    Select,
                                    { mode: 'multiple', allowClear: true,
                                        placeholder: '请选择',
                                        maxTagCount: 1,
                                        notFoundContent: React.createElement(Spin, { size: 'small' }),
                                        optionFilterProp: 'children',
                                        filterOption: function filterOption(input, option) {
                                            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                        } },
                                    this.state.dataSourceDomains
                                ))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 4 },
                            React.createElement(
                                FormItem,
                                null,
                                React.createElement(
                                    'span',
                                    { style: { marginLeft: "10px" } },
                                    '\u5171',
                                    this.state.dataSourceDomains.length,
                                    '\u4E2A\u57DF\u540D'
                                )
                            )
                        )
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u9650\u901F\u9608\u503C', required: true }),
                        React.createElement(
                            Col,
                            { span: 8 },
                            React.createElement(
                                FormItem,
                                null,
                                getFieldDecorator('totalQuota', {
                                    initialValue: this.state.totalQuota,
                                    rules: [{ required: true, message: '请输入限速阈值!' }]
                                })(React.createElement(InputNumber, { style: { width: 150 } }))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 12 },
                            React.createElement(
                                FormItem,
                                null,
                                getFieldDecorator('quotaUnits', {
                                    initialValue: this.state.quotaUnits,
                                    rules: [{ required: true, message: '请选择限速阈值单位!' }]
                                })(React.createElement(
                                    Select,
                                    { style: { width: 150 } },
                                    React.createElement(
                                        Option,
                                        { value: '' },
                                        '\u8BF7\u9009\u62E9'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: 'Gbps' },
                                        'Gbps'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: 'Mbps' },
                                        'Mbps'
                                    )
                                ))
                            )
                        )
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u8D85\u989D\u7B56\u7565', required: true }),
                        React.createElement(
                            Col,
                            { span: 8 },
                            React.createElement(
                                FormItem,
                                null,
                                getFieldDecorator('defaultStrategyMode', {
                                    initialValue: this.state.defaultStrategy.currentMode ? this.state.defaultStrategy.currentMode + "" : "",
                                    rules: [{ required: true, message: '请选择超额策略!' }]
                                })(React.createElement(
                                    Select,
                                    { style: { width: 150 }, onChange: $.proxy(this.onStrategyModeChange, this) },
                                    React.createElement(
                                        Option,
                                        { value: '' },
                                        '\u8BF7\u9009\u62E9'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: '1' },
                                        '\u81EA\u5B9A\u4E49\u56DE\u6E90'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: '3' },
                                        '\u81EA\u5B9A\u4E49\u9650\u901F'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: '2' },
                                        '\u81EA\u5B9A\u4E49\u72B6\u6001\u7801'
                                    )
                                ))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 12 },
                            React.createElement(
                                FormItem,
                                { style: { display: this.state.defaultStrategy.currentMode == 3 ? "list-item" : "none" } },
                                getFieldDecorator('strategyLimit', {
                                    initialValue: parseInt(this.state.defaultStrategy.currentValue) || 2000,
                                    rules: [{ validator: $.proxy(this.validateStrategyLimit, this) }]
                                })(React.createElement(InputNumber, { style: { width: 150 }, min: 2000 })),
                                React.createElement(
                                    'span',
                                    { style: { marginLeft: "10px" } },
                                    'Kbps'
                                )
                            ),
                            React.createElement(
                                FormItem,
                                { style: { display: this.state.defaultStrategy.currentMode == 2 ? "list-item" : "none" } },
                                getFieldDecorator('strategyCode', {
                                    initialValue: parseInt(this.state.defaultStrategy.currentValue) || 404,
                                    rules: [{ validator: $.proxy(this.validateStrategyCode, this) }]
                                })(React.createElement(InputNumber, { style: { width: 150 } }))
                            ),
                            React.createElement(
                                FormItem,
                                { style: { display: this.state.defaultStrategy.currentMode == 1 ? "list-item" : "none" } },
                                getFieldDecorator('strategyOrigin', {
                                    initialValue: this.state.defaultStrategy.currentValue,
                                    rules: [{ validator: $.proxy(this.validateStrategyOrigin, this) }]
                                })(React.createElement(Input, null))
                            )
                        )
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u9AD8\u7EA7' }),
                        React.createElement(Switch, { checked: this.state.isAdvance, onChange: $.proxy(this.onAdvanceButtonChange, this) })
                    )
                );

                return baseInfoView;
            }
        }, {
            key: 'renderFieldTableView',
            value: function renderFieldTableView(formItemLayout) {
                var _this2 = this;

                var getFieldDecorator = this.props.form.getFieldDecorator;
                var _state = this.state,
                    advanceStrategy = _state.advanceStrategy,
                    fieldModalVisible = _state.fieldModalVisible,
                    curEditField = _state.curEditField;

                var fieldListView = "";
                var _props = this.props,
                    isView = _props.isView,
                    isEdit = _props.isEdit;

                var columns = [{
                    title: '文件类型',
                    dataIndex: 'fileType',
                    key: 'fileType'
                }, {
                    title: '超额策略',
                    dataIndex: 'currentValue',
                    key: 'currentValue',
                    render: function render(text, record) {
                        var tag = null;
                        if (record.currentMode == 1) tag = "自定义回源: " + text;else if (record.currentMode == 2) tag = "自定义状态码: " + text;else if (record.currentMode == 3) tag = "自定义限速: " + text + "Kbps";
                        return tag;
                    }
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
                        var buttonGroup = React.createElement(
                            'div',
                            null,
                            editButton,
                            React.createElement('span', { className: 'ant-divider' }),
                            deleteButton
                        );
                        return buttonGroup;
                    }
                }];

                var addEditFieldView = "",
                    addButton = "";

                addEditFieldView = this.renderAddEditFieldView(formItemLayout); // <div style={{textAlign: "center"}}><Spin /></div>
                addButton = React.createElement(
                    Button,
                    { icon: 'plus', size: 'small', onClick: $.proxy(this.onClickAddField, this) },
                    '\u65B0\u589E'
                );

                fieldListView = React.createElement(
                    'div',
                    { style: { display: this.state.isAdvance ? "list-item" : "none" } },
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u65B0\u589E' }),
                        addButton
                    ),
                    React.createElement(
                        FormItem,
                        { wrapperCol: { span: 16, offset: 4 } },
                        React.createElement(Table, { rowKey: 'id', columns: columns, pagination: false, size: 'small', dataSource: advanceStrategy }),
                        React.createElement(
                            Modal,
                            { title: '新增策略', width: 800,
                                destroyOnClose: true,
                                visible: fieldModalVisible,
                                onOk: $.proxy(this.handleFieldOk, this),
                                onCancel: $.proxy(this.handleModalCancel, this) },
                            addEditFieldView
                        )
                    )
                );

                return fieldListView;
            }
        }, {
            key: 'onClickAddField',
            value: function onClickAddField(event) {
                this.setState({
                    isEditField: false,
                    curEditField: {
                        currentMode: 1
                    },
                    fieldModalVisible: true
                });
            }
        }, {
            key: 'handleFieldOk',
            value: function handleFieldOk(e) {
                var _this3 = this;

                e.preventDefault();
                var _state2 = this.state,
                    advanceStrategy = _state2.advanceStrategy,
                    isEditField = _state2.isEditField,
                    curEditField = _state2.curEditField;
                var _props$form3 = this.props.form,
                    getFieldsValue = _props$form3.getFieldsValue,
                    validateFields = _props$form3.validateFields,
                    resetFields = _props$form3.resetFields;

                var newField = null,
                    fieldObj = void 0;
                validateFields(["fileType", "advanceStrategyMode", "advanceStrategyLimit", "advanceStrategyCode", "advanceStrategyOrigin"], function (err, vals) {
                    if (!err && !isEditField) {
                        var typeStr = "",
                            repeatType = [];
                        _.each(advanceStrategy, function (el) {
                            typeStr = typeStr + el.fileType;
                        });
                        _.each(vals.fileType, function (el) {
                            if (typeStr.indexOf(el) > -1) {
                                repeatType.push(el);
                            }
                        });
                        if (repeatType.length > 0) {
                            Utility.alerts(repeatType.join(",") + "已经添加过了！");
                            return;
                        }
                        var currentValue;
                        if (vals.advanceStrategyMode == 1) {
                            currentValue = vals.advanceStrategyOrigin;
                        } else if (vals.advanceStrategyMode == 2) {
                            currentValue = vals.advanceStrategyCode;
                        } else if (vals.advanceStrategyMode == 3) {
                            currentValue = vals.advanceStrategyLimit;
                        }
                        newField = {
                            id: new Date().valueOf(),
                            fileType: vals.fileType.join(","),
                            currentMode: vals.advanceStrategyMode,
                            currentValue: currentValue
                        };
                        _this3.setState({
                            advanceStrategy: [].concat(_toConsumableArray(advanceStrategy), [newField]),
                            fieldModalVisible: false
                        });
                    } else if (!err && isEditField) {
                        if (vals.advanceStrategyMode == 1) {
                            currentValue = vals.advanceStrategyOrigin;
                        } else if (vals.advanceStrategyMode == 2) {
                            currentValue = vals.advanceStrategyCode;
                        } else if (vals.advanceStrategyMode == 3) {
                            currentValue = vals.advanceStrategyLimit;
                        }
                        _.find(advanceStrategy, function (el) {
                            if (el.id == curEditField.id) {
                                el.fileType = vals.fileType.join(",");
                                el.currentMode = vals.advanceStrategyMode;
                                el.currentValue = currentValue;
                            }
                        });

                        _this3.setState({
                            advanceStrategy: [].concat(_toConsumableArray(advanceStrategy)),
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
                var model = _.find(this.state.advanceStrategy, function (obj) {
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
                        var list = _.filter(this.state.advanceStrategy, function (obj) {
                            return obj.id != id;
                        }.bind(this));
                        this.setState({
                            advanceStrategy: list
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
                        _extends({}, formItemLayout, { label: '\u6587\u4EF6\u7C7B\u578B' }),
                        getFieldDecorator('fileType', {
                            initialValue: this.state.curEditField.fileType && this.state.curEditField.fileType.split(","),
                            rules: [{ type: "array", required: true, message: '请输入文件类型!' }]
                        })(React.createElement(Select, { mode: 'tags', allowClear: true,
                            notFoundContent: "请输入文件类型, 可以配置多个",
                            filterOption: false }))
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u8D85\u989D\u7B56\u7565', required: true }),
                        React.createElement(
                            Col,
                            { span: 8 },
                            React.createElement(
                                FormItem,
                                null,
                                getFieldDecorator('advanceStrategyMode', {
                                    initialValue: this.state.curEditField.currentMode + "",
                                    rules: [{ required: true, message: '请选择超额策略!' }]
                                })(React.createElement(
                                    Select,
                                    { style: { width: 150 }, onChange: $.proxy(this.onAdvanceStrategyModeChange, this) },
                                    React.createElement(
                                        Option,
                                        { value: '1' },
                                        '\u81EA\u5B9A\u4E49\u56DE\u6E90'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: '3' },
                                        '\u81EA\u5B9A\u4E49\u9650\u901F'
                                    ),
                                    React.createElement(
                                        Option,
                                        { value: '2' },
                                        '\u81EA\u5B9A\u4E49\u72B6\u6001\u7801'
                                    )
                                ))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 12 },
                            React.createElement(
                                FormItem,
                                { style: { display: this.state.curEditField.currentMode == 3 ? "list-item" : "none" } },
                                getFieldDecorator('advanceStrategyLimit', {
                                    initialValue: parseInt(this.state.curEditField.currentValue) || 2000,
                                    rules: [{ validator: $.proxy(this.validateAdvanceStrategyLimit, this) }]
                                })(React.createElement(InputNumber, { style: { width: 200 }, min: 2000 }))
                            ),
                            React.createElement(
                                FormItem,
                                { style: { display: this.state.curEditField.currentMode == 2 ? "list-item" : "none" } },
                                getFieldDecorator('advanceStrategyCode', {
                                    initialValue: parseInt(this.state.curEditField.currentValue) || 404,
                                    rules: [{ validator: $.proxy(this.validateAdvanceStrategyCode, this) }]
                                })(React.createElement(InputNumber, { style: { width: 200 } }))
                            ),
                            React.createElement(
                                FormItem,
                                { style: { display: this.state.curEditField.currentMode == 1 ? "list-item" : "none" } },
                                getFieldDecorator('advanceStrategyOrigin', {
                                    initialValue: this.state.curEditField.currentValue,
                                    rules: [{ validator: $.proxy(this.validateAdvanceStrategyOrigin, this) }]
                                })(React.createElement(Input, { style: { width: 200 } }))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 4 },
                            React.createElement(
                                FormItem,
                                { style: { display: this.state.curEditField.currentMode == 3 ? "list-item" : "none" } },
                                React.createElement(
                                    'span',
                                    { style: { marginLeft: "10px" } },
                                    'Kbps'
                                )
                            )
                        )
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
                var validateFields = this.props.form.validateFields;

                var checkArray = ["currentSubType", "origins", "totalQuota", "quotaUnits", "defaultStrategyMode", 'strategyLimit', 'strategyCode', 'strategyOrigin'];
                validateFields(checkArray, function (err, vals) {
                    var _this4 = this;

                    var postParam,
                        model = this.props.model;
                    var collection = this.props.limitProps.collection;
                    if (!err) {
                        console.log(vals);
                        var origins = vals.origins.map(function (el) {
                            return {
                                "originId": parseInt(el),
                                "userId": _this4.props.limitProps.userInfo.uid
                            };
                        });
                        var currentValue;
                        if (vals.defaultStrategyMode == 1) {
                            currentValue = vals.strategyOrigin;
                        } else if (vals.defaultStrategyMode == 2) {
                            currentValue = vals.strategyCode;
                        } else if (vals.defaultStrategyMode == 3) {
                            currentValue = vals.strategyLimit;
                        }
                        var strategys = [],
                            defaultSg = {
                            fileType: "default",
                            currentMode: parseInt(vals.defaultStrategyMode),
                            currentValue: currentValue
                        };

                        strategys.push(defaultSg);
                        _.each(this.state.advanceStrategy, function (el) {
                            el.currentMode = parseInt(el.currentMode);
                            strategys.push(el);
                        });

                        postParam = {
                            "group": {
                                "quotaUnits": vals.quotaUnits,
                                "totalQuota": vals.totalQuota,
                                "userId": this.props.limitProps.userInfo.uid
                            },
                            "origins": origins,
                            "strategys": strategys,
                            "advancedConf": this.state.isAdvance ? 1 : 0
                        };

                        if (this.props.isEdit) {
                            postParam.group.id = this.props.model.id;
                            collection.updateLimitRateConf(postParam);
                        } else {
                            collection.addLimitRateConf(postParam);
                        }
                        console.log(postParam);
                    }
                }.bind(this));
            }
        }, {
            key: 'onClickCancel',
            value: function onClickCancel() {
                var onClickCancelCallback = this.props.limitProps.onClickCancelCallback,
                    onClickHistoryCallback = this.props.limitProps.onClickHistoryCallback;

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
                    labelCol: { span: 4 },
                    wrapperCol: { span: 16 }
                };
                var baseInfoView = this.renderBaseInfoView(formItemLayout);
                var fieldListView = this.renderFieldTableView(formItemLayout);
                var saveButton = null,
                    editView = null;
                if (!this.props.isView) saveButton = React.createElement(
                    Button,
                    { type: 'primary', htmlType: 'submit' },
                    '\u4FDD\u5B58'
                );

                if (this.state.isLoadingDetail) {
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
                            fieldListView,
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

        return NetRateLimitingEditForm;
    }(React.Component);

    var NetRateLimitingEditView = Form.create()(NetRateLimitingEditForm);
    return NetRateLimitingEditView;
});
