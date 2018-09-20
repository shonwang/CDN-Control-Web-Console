'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("logTaskList.edit.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], function (require, exports, template, BaseView, Utility, Antd, React, moment) {

    var Button = Antd.Button,
        Input = Antd.Input,
        InputNumber = Antd.InputNumber,
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
        confirm = Modal.confirm,
        Popover = Antd.Popover,
        Tag = Antd.Tag,
        AutoComplete = Antd.AutoComplete;

    var logTaskListEditForm = function (_React$Component) {
        _inherits(logTaskListEditForm, _React$Component);

        function logTaskListEditForm(props, context) {
            var _this$state;

            _classCallCheck(this, logTaskListEditForm);

            var _this = _possibleConstructorReturn(this, (logTaskListEditForm.__proto__ || Object.getPrototypeOf(logTaskListEditForm)).call(this, props));

            _this.onClickCancel = _this.onClickCancel.bind(_this);
            _this.renderBaseInfoView = _this.renderBaseInfoView.bind(_this);
            _this.renderConditionTableView = _this.renderConditionTableView.bind(_this);
            _this.validateTemplateFieldList = _this.validateTemplateFieldList.bind(_this);
            _this.validateBackGetLogName = _this.validateBackGetLogName.bind(_this);
            _this.validateDomains = _this.validateDomains.bind(_this);
            _this.handleSubmit = _this.handleSubmit.bind(_this);
            _this.convertEnumToShowStr = _this.convertEnumToShowStr.bind(_this);

            _this.state = (_this$state = {
                name: "", //"任务名称",
                templateName: "", //"模板名称",
                accountId: "",
                domainType: "FULLSCALE", //DomainType 域名类型 FUULLSCALE（全量域名） CUSTOM（自定义域名）
                domains: [],
                backUrl: "",
                productType: "",

                backMethod: "", //回传方法
                senderType: "",
                backGetLogName: ""
            }, _defineProperty(_this$state, 'senderType', ""), _defineProperty(_this$state, 'batchCount', 100), _defineProperty(_this$state, 'batchInterval', 60), _defineProperty(_this$state, 'logRange', ""), _defineProperty(_this$state, 'compressMode', ""), _defineProperty(_this$state, 'userAgent', ""), _defineProperty(_this$state, 'tokenKey', ""), _defineProperty(_this$state, 'taskTokenType', "KEY_FIRST"), _defineProperty(_this$state, 'taskTokenTimeType', ""), _defineProperty(_this$state, 'taskConditionList', []), _defineProperty(_this$state, 'dataSourceUserId', []), _defineProperty(_this$state, 'dataSourceTemplateName', []), _defineProperty(_this$state, 'dataSourceDomains', []), _defineProperty(_this$state, 'dataSourceOriginFieldTag', []), _defineProperty(_this$state, 'domainsVisible', "none"), _defineProperty(_this$state, 'backGetLogNameVisible', "none"), _defineProperty(_this$state, 'senderTypeVisible', "none"), _defineProperty(_this$state, 'isLoadingTplDetail', true), _defineProperty(_this$state, 'fieldModalVisible', false), _defineProperty(_this$state, 'isEditField', false), _defineProperty(_this$state, 'curEditField', {}), _this$state);

            _this.userIdList = [];
            return _this;
        }

        _createClass(logTaskListEditForm, [{
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
                collection.on("template.selectList.success", $.proxy(this.onGetTplByProductTypeSuccess, this));
                collection.on("template.selectList.error", $.proxy(this.onGetError, this));
                collection.on("add.task.success", $.proxy(this.onSubmitSuccess, this));
                collection.on("add.task.error", $.proxy(this.onGetError, this));
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
                if (this.props.isEdit) {
                    collection.off("task.detail.success");
                    collection.off("task.detail.error");
                }
                collection.off("template.selectList.success");
                collection.off("template.selectList.error");
                collection.off("add.task.success");
                collection.off("add.task.error");
            }
        }, {
            key: 'onGetUserListSuccess',
            value: function onGetUserListSuccess(res) {
                _.each(res.data, function (el) {
                    this.userIdList.push(el.userId);
                }.bind(this));

                var ltProps = this.props.ltProps,
                    collection = ltProps.collection;
                var model = this.props.model;
                if (this.props.isEdit) {
                    collection.on("task.detail.success", $.proxy(this.onGetTaskDetailSuccess, this));
                    collection.on("task.detail.error", $.proxy(this.onGetError, this));
                    collection.getTaskDetail({ id: model.id });
                } else {
                    this.setState({
                        isLoadingTplDetail: false
                    });
                }
            }
        }, {
            key: 'onSubmitSuccess',
            value: function onSubmitSuccess() {
                Utility.alerts("保存成功！", "success", 2000);
                this.onClickCancel();
            }
        }, {
            key: 'onGetTaskDetailSuccess',
            value: function onGetTaskDetailSuccess(res) {
                var _setState;

                this.groupId = res.groupId;
                this.originCreateTime = res.originCreateTime;

                _.each(res.taskConditionList, function (el) {
                    el.id = Utility.randomStr(8);
                });
                this.setState((_setState = {
                    name: res.name,
                    templateName: res.templateName,
                    accountId: res.accountId,
                    domainType: res.domainType,
                    domains: res.domains,
                    backUrl: res.backUrl,
                    productType: res.productType,

                    backMethod: res.taskFieldJson.backMethod,
                    senderType: res.taskFieldJson.senderType,
                    backGetLogName: res.taskFieldJson.backGetLogName
                }, _defineProperty(_setState, 'senderType', res.taskFieldJson.senderType), _defineProperty(_setState, 'batchCount', res.taskFieldJson.batchCount), _defineProperty(_setState, 'batchInterval', res.taskFieldJson.batchInterval), _defineProperty(_setState, 'logRange', res.taskFieldJson.logRange), _defineProperty(_setState, 'compressMode', res.taskFieldJson.compressMode), _defineProperty(_setState, 'userAgent', res.taskFieldJson.userAgent), _defineProperty(_setState, 'tokenKey', res.taskFieldJson.tokenKey), _defineProperty(_setState, 'taskTokenType', res.taskFieldJson.taskTokenType), _defineProperty(_setState, 'taskTokenTimeType', res.taskFieldJson.taskTokenTimeType), _defineProperty(_setState, 'taskConditionList', res.taskFieldJson.taskConditionList), _defineProperty(_setState, 'isLoadingTplDetail', false), _setState));
            }
        }, {
            key: 'convertEnumToShowStr',
            value: function convertEnumToShowStr() {
                var _state = this.state,
                    taskTokenTimeType = _state.taskTokenTimeType,
                    taskTokenType = _state.taskTokenType,
                    backMethod = _state.backMethod,
                    tokenKey = _state.tokenKey,
                    backGetLogName = _state.backGetLogName,
                    senderType = _state.senderType,
                    domainType = _state.domainType,
                    domains = _state.domains,
                    logRange = _state.logRange,
                    compressMode = _state.compressMode;

                var colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];

                var dataForShow = {
                    token: "",
                    taskTokenTimeType: "",
                    backGetLogName: "",
                    senderType: "",
                    domainType: "",
                    domainContent: "全量域名",
                    logRange: "",
                    compressMode: ""
                };
                if (taskTokenTimeType == "WITH_CROSS") {
                    dataForShow.taskTokenTimeType = "yyyy-MM-dd";
                } else if (taskTokenTimeType == "NO_CROSS") {
                    dataForShow.taskTokenTimeType = "yyyyMMdd";
                }
                if (taskTokenType == "KEY_FIRST") {
                    dataForShow.token = "方式一：md5({key:" + tokenKey + "}{time:" + dataForShow.taskTokenTimeType + "})";
                } else if (taskTokenType == "KEY_LAST ") {
                    dataForShow.token = "方式一：md5({time:" + dataForShow.taskTokenTimeType + "}{key:" + tokenKey + "})";
                }
                if (backMethod == "GET") {
                    dataForShow.backGetLogName = ", 参数名称：" + backGetLogName;
                } else if (backMethod == "POST" && senderType == "TEXT") {
                    dataForShow.backGetLogName = ", 是否以数组形式回传：否";
                } else if (backMethod == "POST" && senderType == "ARRAY") {
                    dataForShow.backGetLogName = ", 是否以数组形式回传：是";
                }
                if (domainType == "FULLSCALE") {
                    dataForShow.domainType = "全量域名";
                } else if (domainType == "CUSTOM") {
                    dataForShow.domainType = "自定义域名";
                    if (domains) {
                        dataForShow.domainContent = domains.map(function (el, index) {
                            var random = Math.floor(Math.random() * colors.length);
                            return React.createElement(
                                Tag,
                                { color: colors[random], key: index, style: { marginBottom: '5px' } },
                                el
                            );
                        });
                    }
                }
                if (logRange == "EDGE") {
                    dataForShow.logRange = "边缘";
                } else if (logRange == "EDGE_AND_UPPER") {
                    dataForShow.logRange = "边缘+上层";
                }
                if (compressMode == "TEXT") {
                    dataForShow.compressMode = "文本";
                } else if (compressMode == "LZ4") {
                    dataForShow.compressMode = "lz4";
                } else if (compressMode == "GZ") {
                    dataForShow.compressMode = "gzip";
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

                var baseInfoView = null,
                    dataShow = this.convertEnumToShowStr(),
                    wrapperCol204 = { span: 22, offset: 2 },
                    wrapperCol22 = { span: 20 },
                    tokenTypeTxt1 = "md5({key: TOKEN KEY}{time: TOKEN 日期})",
                    tokenTypeTxt2 = "md5({time: TOKEN 日期}{key: TOKEN KEY})";
                if (this.props.isView) {
                    baseInfoView = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol204 },
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u4EFB\u52A1\u540D\u79F0' }),
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        this.state.name
                                    )
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u5BA2\u6237ID' }),
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        this.state.accountId
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol204 },
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u4EA7\u54C1\u7EBF' }),
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        this.state.productType
                                    )
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u6A21\u7248\u540D\u79F0' }),
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        this.state.templateName
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol204 },
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u57DF\u540D\u6807\u8BC6' }),
                                    React.createElement(
                                        Popover,
                                        { content: dataShow.domainContent, trigger: 'click', placement: 'bottom' },
                                        React.createElement(
                                            Tag,
                                            { color: "green" },
                                            dataShow.domainType
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u56DE\u4F20\u5730\u5740' }),
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        this.state.backUrl
                                    )
                                )
                            )
                        ),
                        React.createElement('hr', null),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol204 },
                            React.createElement(
                                Col,
                                { span: 24 },
                                React.createElement(
                                    FormItem,
                                    { labelCol: { span: 4 }, wrapperCol: { span: 20 }, label: '\u56DE\u4F20\u65B9\u6CD5' },
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        this.state.backMethod,
                                        dataShow.backGetLogName
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol204 },
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u591A\u6761\u53D1\u9001\u4E0A\u9650' }),
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        this.state.batchCount
                                    )
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    { labelCol: { span: 16 }, wrapperCol: { span: 8 }, label: '\u5355\u6279\u6B21\u6700\u5927\u5EF6\u8FDF\u53D1\u9001\u65F6\u95F4' },
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        this.state.batchInterval
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol204 },
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u65E5\u5FD7\u53D1\u9001\u8303\u56F4' }),
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        dataShow.logRange
                                    )
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u538B\u7F29\u65B9\u5F0F' }),
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        dataShow.compressMode
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol204 },
                            React.createElement(
                                Col,
                                { span: 8 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: 'User-Agent' }),
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        this.state.userAgent
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol204 },
                            React.createElement(
                                Col,
                                { span: 24 },
                                React.createElement(
                                    FormItem,
                                    { labelCol: { span: 4 }, wrapperCol: { span: 20 }, label: 'token' },
                                    React.createElement(
                                        'span',
                                        { className: 'ant-form-text' },
                                        dataShow.token
                                    )
                                )
                            )
                        )
                    );
                } else {
                    baseInfoView = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol22 },
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u4EFB\u52A1\u540D\u79F0', hasFeedback: true }),
                                    getFieldDecorator('name', {
                                        initialValue: this.state.name,
                                        validateFirst: true,
                                        rules: [{ required: true, message: '请输入任务名称!' }]
                                    })(React.createElement(Input, { disabled: this.props.isEdit }))
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u5BA2\u6237ID' }),
                                    getFieldDecorator('accountId', {
                                        initialValue: this.state.accountId,
                                        rules: [{ required: true, message: '请输入客户ID!' }]
                                    })(React.createElement(
                                        AutoComplete,
                                        {
                                            style: { width: 200 },
                                            onBlur: $.proxy(this.onAccountIdChange, this),
                                            onSearch: $.proxy(this.handleUserIdSearch, this) },
                                        this.state.dataSourceUserId
                                    ))
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol22 },
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u4EA7\u54C1\u7EBF' }),
                                    getFieldDecorator('productType', {
                                        initialValue: this.state.productType,
                                        rules: [{ required: true, message: '请选择产品线!' }]
                                    })(React.createElement(
                                        Select,
                                        { style: { width: 200 }, onChange: $.proxy(this.onProductTypeChange, this) },
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
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u6A21\u7248\u540D\u79F0' }),
                                    getFieldDecorator('templateName', {
                                        initialValue: this.state.templateName,
                                        rules: [{ required: true, message: '请输入模版名称!' }]
                                    })(React.createElement(
                                        Select,
                                        { style: { width: 200 }, labelInValue: true },
                                        React.createElement(
                                            Option,
                                            { value: '' },
                                            '\u8BF7\u9009\u62E9'
                                        ),
                                        this.state.dataSourceTemplateName
                                    ))
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol22 },
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: React.createElement(
                                            'span',
                                            null,
                                            '\u57DF\u540D\u6807\u8BC6\xA0',
                                            React.createElement(
                                                Tooltip,
                                                { title: '\u8BF4\u660E\uFF1A\uFF081\uFF09\u9009\u62E9\u5168\u91CF\u57DF\u540D\u6807\u8BC6\u540E\uFF0C\u7CFB\u7EDF\u53EF\u901A\u8FC7\u5BA2\u6237ID\u5173\u8054\u51FA\u8BE5\u5BA2\u6237\u7684\u5168\u91CF\u57DF\u540D\uFF0C\u5E76\u540C\u6B65\u589E\u51CF\u57DF\uFF0C\u6BCF\u6B21\u57DF\u540D\u53D8\u5316\u65E0\u9700\u518D\u6B21\u66F4\u6539\u65E5\u5FD7\u7684\u914D\u7F6E\uFF082\uFF09\u9009\u62E9\u53EF\u914D\u7F6E\u57DF\u540D\u540E\uFF0C\u9700\u8981\u7EE7\u7EED\u914D\u7F6E\u5BA2\u6237\u56DE\u4F20\u57DF\u540D\uFF0C\u4E14\u540E\u7EED\u53EF\u66F4\u6539' },
                                                React.createElement(Icon, { type: 'question-circle-o' })
                                            )
                                        ) }),
                                    getFieldDecorator('domainType', {
                                        initialValue: this.state.domainType,
                                        rules: [{ required: true, message: '请选择域名标识!' }]
                                    })(React.createElement(
                                        Select,
                                        { style: { width: 200 }, onChange: $.proxy(this.onDomainTypeChange, this) },
                                        React.createElement(
                                            Option,
                                            { value: '' },
                                            '\u8BF7\u9009\u62E9'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'FULLSCALE' },
                                            '\u5168\u91CF\u57DF\u540D'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'CUSTOM' },
                                            '\u81EA\u5B9A\u4E49\u57DF\u540D'
                                        )
                                    ))
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u5BA2\u6237\u56DE\u4F20\u57DF\u540D\u8BBE\u7F6E', required: true, style: { display: this.state.domainsVisible } }),
                                    getFieldDecorator('domains', {
                                        initialValue: this.state.domains,
                                        rules: [{ validator: this.validateDomains }]
                                    })(React.createElement(
                                        Select,
                                        { mode: 'multiple', allowClear: true,
                                            placeholder: '请选择',
                                            maxTagCount: 1,
                                            notFoundContent: React.createElement(Spin, { size: 'small' }),
                                            filterOption: false },
                                        this.state.dataSourceDomains
                                    ))
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol22 },
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: '\u56DE\u4F20\u5730\u5740', hasFeedback: true }),
                                    getFieldDecorator('backUrl', {
                                        initialValue: this.state.name,
                                        validateFirst: true,
                                        rules: [{ required: true, message: '请输入回传地址!' }]
                                    })(React.createElement(Input, { style: { width: "600px" } }))
                                )
                            )
                        ),
                        React.createElement('hr', null),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol22 },
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: "回传方法" }),
                                    getFieldDecorator('backMethod', {
                                        initialValue: this.state.backMethod,
                                        rules: [{ required: true, message: '请选择回传方法!' }]
                                    })(React.createElement(
                                        Select,
                                        { style: { width: 200 }, onChange: $.proxy(this.onBackMethodChange, this) },
                                        React.createElement(
                                            Option,
                                            { value: '' },
                                            '\u8BF7\u9009\u62E9'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'GET' },
                                            'GET'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'POST' },
                                            'POST'
                                        )
                                    ))
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: React.createElement(
                                            'span',
                                            null,
                                            '\u53C2\u6570\u540D\xA0',
                                            React.createElement(
                                                Tooltip,
                                                { title: '\u56DE\u4F20\u65B9\u5F0F\u9009\u62E9Get\u65F6\uFF0C\u9700\u8981\u8BBE\u7F6E\u53C2\u6570\u540D\uFF0C\u6BD4\u5982log=****' },
                                                React.createElement(Icon, { type: 'question-circle-o' })
                                            )
                                        ), required: true, style: { display: this.state.backGetLogNameVisible } }),
                                    getFieldDecorator('backGetLogName', {
                                        initialValue: this.state.backGetLogName,
                                        rules: [{ validator: this.validateBackGetLogName }]
                                    })(React.createElement(Input, null))
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: "是否以数组形式回传",
                                        required: true,
                                        style: { display: this.state.senderTypeVisible } }),
                                    getFieldDecorator('senderType', {
                                        initialValue: this.state.senderType,
                                        rules: [{ validator: $.proxy(this.validateSendType, this) }]
                                    })(React.createElement(
                                        Select,
                                        { style: { width: 200 }, onChange: $.proxy(this.onDomainTypeChange, this) },
                                        React.createElement(
                                            Option,
                                            { value: '' },
                                            '\u8BF7\u9009\u62E9'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'TEXT' },
                                            '\u5426'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'ARRAY' },
                                            '\u662F'
                                        )
                                    ))
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol22 },
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: React.createElement(
                                            'span',
                                            null,
                                            '\u591A\u6761\u53D1\u9001\u4E0A\u9650\xA0',
                                            React.createElement(
                                                Tooltip,
                                                { title: '\u6700\u5927\u53D1\u9001\u4E0A\u96501000\u6761' },
                                                React.createElement(Icon, { type: 'question-circle-o' })
                                            )
                                        ) }),
                                    getFieldDecorator('batchCount', {
                                        initialValue: this.state.batchCount,
                                        rules: [{ required: true, message: '请输入多条发送上限!' }]
                                    })(React.createElement(InputNumber, { min: 1, max: 1000 }))
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: React.createElement(
                                            'span',
                                            null,
                                            '\u5355\u6279\u6B21\u6700\u5927\u5EF6\u8FDF\u53D1\u9001\u65F6\u95F4\xA0',
                                            React.createElement(
                                                Tooltip,
                                                { title: '\u8BE5\u914D\u7F6E\u4E0E\u591A\u6761\u53D1\u9001\u4E0A\u9650\u6EE1\u8DB3\u4E00\u4E2A\u5373\u53D1\u9001' },
                                                React.createElement(Icon, { type: 'question-circle-o' })
                                            )
                                        ) }),
                                    getFieldDecorator('batchInterval', {
                                        initialValue: this.state.batchInterval,
                                        rules: [{ required: true, message: '请输入单批次最大延迟发送时间!' }]
                                    })(React.createElement(InputNumber, null)),
                                    React.createElement(
                                        'span',
                                        { style: { marginLeft: "10px" } },
                                        'S'
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol22 },
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: "日志发送范围" }),
                                    getFieldDecorator('logRange', {
                                        initialValue: this.state.logRange,
                                        rules: [{ required: true, message: '请选择日志发送范围!' }]
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
                                            { value: 'EDGE' },
                                            '\u8FB9\u7F18'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'EDGE_AND_UPPER' },
                                            '\u8FB9\u7F18+\u4E0A\u5C42'
                                        )
                                    ))
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: "压缩方式" }),
                                    getFieldDecorator('compressMode', {
                                        initialValue: this.state.compressMode,
                                        rules: [{ required: true, message: '请选择压缩方式!' }]
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
                                            { value: 'TEXT' },
                                            '\u6587\u672C'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'LZ4' },
                                            'lz4'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'GZ' },
                                            'gzip'
                                        )
                                    ))
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol22 },
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: 'User-Agent' }),
                                    getFieldDecorator('userAgent', {
                                        initialValue: this.state.userAgent,
                                        rules: [{ required: true, message: '请输入User-Agent!' }]
                                    })(React.createElement(Input, null))
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol22 },
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: React.createElement(
                                            'span',
                                            null,
                                            'TOKEN\u7C7B\u578B\xA0',
                                            React.createElement(
                                                Tooltip,
                                                { title: '\uFF081\uFF09token\u4E3A32\u5B57\u8282\u957F\u5EA6\u9274\u6743\u4E32;\uFF082\uFF09id\u4E3A8\u5B57\u8282\u957F\u5EA6\u5B57\u7B26\u4E32\uFF0C\u6BCF\u6B21\u8BF7\u6C42\u5206\u914D\u4E0D\u540Cid\uFF0C\u7528\u4E8E\u533A\u5206\u4E0D\u540C\u8BF7\u6C42\uFF1B\uFF083\uFF09cdnkey\u4E3A\u5206\u914D\u7ED9cdn\u5382\u5546\u7684\u5BC6\u94A5\uFF1B\uFF084\uFF09time\u4E3A\u65F6\u95F4\u6233\uFF0C\u5305\u542B\u4E09\u79CD\u683C\u5F0F\uFF1AUNIX\u65F6\u95F4\u6233\uFF0C2018-05-08 14:00:00\uFF0C 20180508141156' },
                                                React.createElement(Icon, { type: 'question-circle-o' })
                                            )
                                        ) }),
                                    getFieldDecorator('taskTokenType', {
                                        initialValue: this.state.taskTokenType,
                                        rules: [{ required: true, message: '请选择域名标识!' }]
                                    })(React.createElement(
                                        Select,
                                        { style: { width: 500 } },
                                        React.createElement(
                                            Option,
                                            { value: 'KEY_FIRST' },
                                            '\u65B9\u5F0F\u4E00\uFF1AKEY\u5728\u524D\u65F6\u95F4\u5728\u540E ',
                                            tokenTypeTxt1
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'KEY_LAST' },
                                            '\u65B9\u5F0F\u4E8C\uFF1AKEY\u5728\u540E\u65F6\u95F4\u5728\u524D ',
                                            tokenTypeTxt2
                                        )
                                    ))
                                )
                            )
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: wrapperCol22 },
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: 'TOKEN KEY' }),
                                    getFieldDecorator('tokenKey', {
                                        initialValue: this.state.tokenKey,
                                        rules: [{ required: true, message: '请输入TOKEN KEY!' }]
                                    })(React.createElement(Input, null))
                                )
                            ),
                            React.createElement(
                                Col,
                                { span: 12 },
                                React.createElement(
                                    FormItem,
                                    _extends({}, formItemLayout, { label: "TOKEN日期类型" }),
                                    getFieldDecorator('taskTokenTimeType', {
                                        initialValue: this.state.taskTokenTimeType,
                                        rules: [{ required: true, message: '请选择TOKEN日期类型!' }]
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
                                            { value: 'WITH_CROSS' },
                                            'yyyy-MM-dd'
                                        ),
                                        React.createElement(
                                            Option,
                                            { value: 'NO_CROSS' },
                                            'yyyyMMdd'
                                        )
                                    ))
                                )
                            )
                        )
                    );
                }

                return baseInfoView;
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
            key: 'onProductTypeChange',
            value: function onProductTypeChange(value) {
                var _props$form2 = this.props.form,
                    setFieldsValue = _props$form2.setFieldsValue,
                    getFieldsValue = _props$form2.getFieldsValue;

                setFieldsValue({ "templateName": "" });
                this.setState({
                    dataSourceTemplateName: []
                });
                var ltProps = this.props.ltProps,
                    collection = ltProps.collection,
                    applicationType = "",
                    accountId = getFieldsValue().accountId;
                if (value) {
                    collection.getTemplateByProductType({ productType: value });
                    if (accountId) {
                        applicationType = value == "LIVE" ? 203 : 202;
                        require(['domainList.model'], function (DomainListModel) {
                            var domainListModel = new DomainListModel();
                            domainListModel.on("query.domain.success", $.proxy(this.onGetDomainListSuccess, this));
                            domainListModel.on("query.domain.error", $.proxy(this.onGetError, this));
                            domainListModel.getDomainInfoList({
                                currentPage: 1,
                                applicationType: applicationType,
                                pageSize: 99999,
                                userId: accountId
                            });
                        }.bind(this));
                    }
                }
            }
        }, {
            key: 'onGetTplByProductTypeSuccess',
            value: function onGetTplByProductTypeSuccess(res) {
                var tplArray = res.map(function (el) {
                    return React.createElement(
                        Option,
                        { key: el.groupId },
                        el.name
                    );
                });
                this.setState({
                    dataSourceTemplateName: tplArray
                });
            }
        }, {
            key: 'onAccountIdChange',
            value: function onAccountIdChange(value) {
                var _props$form3 = this.props.form,
                    setFieldsValue = _props$form3.setFieldsValue,
                    getFieldsValue = _props$form3.getFieldsValue;

                setFieldsValue({ "domains": [] });
                this.setState({
                    dataSourceDomains: []
                });
                var productType = getFieldsValue().productType,
                    applicationType = productType == "LIVE" ? 203 : 202;

                if (!productType) applicationType = null;

                if (value) {
                    require(['domainList.model'], function (DomainListModel) {
                        var domainListModel = new DomainListModel();
                        domainListModel.on("query.domain.success", $.proxy(this.onGetDomainListSuccess, this));
                        domainListModel.on("query.domain.error", $.proxy(this.onGetError, this));
                        domainListModel.getDomainInfoList({
                            currentPage: 1,
                            applicationType: applicationType,
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
            key: 'onDomainTypeChange',
            value: function onDomainTypeChange(value) {
                if (value == "CUSTOM") {
                    this.setState({
                        domainsVisible: "list-item"
                    });
                } else {
                    this.setState({
                        domainsVisible: "none"
                    });
                }
            }
        }, {
            key: 'onBackMethodChange',
            value: function onBackMethodChange(value) {
                var resetFields = this.props.form.resetFields;

                if (value == "GET") {
                    this.setState({
                        backGetLogNameVisible: "list-item",
                        senderTypeVisible: "none"
                    });
                } else if (value == "POST") {
                    this.setState({
                        backGetLogNameVisible: "none",
                        senderTypeVisible: "list-item"
                    });
                } else {
                    this.setState({
                        backGetLogNameVisible: "none",
                        senderTypeVisible: "none"
                    });
                }
                resetFields("backGetLogName");
                resetFields("senderType");
            }
        }, {
            key: 'renderConditionTableView',
            value: function renderConditionTableView(formItemLayout) {
                var _this2 = this;

                var getFieldDecorator = this.props.form.getFieldDecorator;
                var _state2 = this.state,
                    taskConditionList = _state2.taskConditionList,
                    fieldModalVisible = _state2.fieldModalVisible,
                    curEditField = _state2.curEditField;

                var conditionListView = "";
                var _props = this.props,
                    isView = _props.isView,
                    isEdit = _props.isEdit;

                var columns = [{
                    title: '原字段标识',
                    dataIndex: 'originTag',
                    key: 'originTag'
                }, {
                    title: '关系',
                    dataIndex: 'conditionType',
                    key: 'conditionType',
                    render: function render(text, record) {
                        var tag = null;
                        if (record.conditionType == "NE") tag = React.createElement(
                            Tag,
                            { color: "red" },
                            '\u4E0D\u76F8\u7B49'
                        );else if (record.conditionType == "EQ") tag = React.createElement(
                            Tag,
                            { color: "green" },
                            '\u76F8\u7B49'
                        );else if (record.conditionType == "IN") tag = React.createElement(
                            Tag,
                            { color: "blue" },
                            '\u5305\u542B'
                        );else if (record.conditionType == "NIN") tag = React.createElement(
                            Tag,
                            { color: "orange" },
                            '\u4E0D\u5305\u542B'
                        );
                        return tag;
                    }
                }, {
                    title: '值',
                    dataIndex: 'value',
                    key: 'value'
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
                    addEditFieldView = this.renderAddEditFieldView({
                        labelCol: { span: 6 },
                        wrapperCol: { span: 12 }
                    });
                    addButton = React.createElement(
                        Button,
                        { icon: 'plus', size: 'small', onClick: $.proxy(this.onClickAddField, this) },
                        '\u65B0\u589E'
                    );
                }
                conditionListView = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        FormItem,
                        { labelCol: { span: 5 }, wrapperCol: { span: 12 }, label: '\u6761\u4EF6\u9650\u5236' },
                        addButton
                    ),
                    React.createElement(
                        FormItem,
                        { wrapperCol: { span: 16, offset: 4 } },
                        getFieldDecorator('taskConditionList', {
                            rules: [{ validator: this.validateTemplateFieldList }]
                        })(React.createElement(Table, { rowKey: 'id', columns: columns, pagination: false, size: 'small', dataSource: taskConditionList })),
                        React.createElement(
                            Modal,
                            { title: '条件限制',
                                destroyOnClose: true,
                                visible: fieldModalVisible,
                                onOk: $.proxy(this.handleFieldOk, this),
                                onCancel: $.proxy(this.handleModalCancel, this) },
                            addEditFieldView
                        )
                    )
                );

                return conditionListView;
            }
        }, {
            key: 'validateTemplateFieldList',
            value: function validateTemplateFieldList(rule, value, callback) {
                //if (this.state.taskConditionList.length != 0) {
                callback();
                // } else {
                //     callback('请添加条件限制！');
                // }
            }
        }, {
            key: 'validateBackGetLogName',
            value: function validateBackGetLogName(rule, value, callback) {
                var getFieldsValue = this.props.form.getFieldsValue;

                var backMethod = getFieldsValue().backMethod;
                if (backMethod == "GET" && value == "") {
                    callback('请添加参数名称！');
                } else {
                    callback();
                }
            }
        }, {
            key: 'validateSendType',
            value: function validateSendType(rule, value, callback) {
                var getFieldsValue = this.props.form.getFieldsValue;

                var backMethod = getFieldsValue().backMethod;
                if (backMethod == "POST" && value == "") {
                    callback('请选择是否以数组形式回传！');
                } else {
                    callback();
                }
            }
        }, {
            key: 'validateDomains',
            value: function validateDomains(rule, value, callback) {
                var getFieldsValue = this.props.form.getFieldsValue;

                var domainType = getFieldsValue().domainType;
                if (domainType == "CUSTOM" && value.length == 0) {
                    callback('请选择域名！');
                } else {
                    callback();
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

                e.preventDefault();
                var _state3 = this.state,
                    taskConditionList = _state3.taskConditionList,
                    isEditField = _state3.isEditField,
                    curEditField = _state3.curEditField;
                var _props$form4 = this.props.form,
                    getFieldsValue = _props$form4.getFieldsValue,
                    validateFields = _props$form4.validateFields,
                    resetFields = _props$form4.resetFields;

                var newField = null,
                    fieldObj = void 0;
                validateFields(["originTag", "conditionType", "value"], function (err, vals) {
                    if (!err && !isEditField) {
                        fieldObj = _.find(_this3.logTplManageOriginField, function (el) {
                            return el.id == vals.originTag;
                        });
                        newField = {
                            id: Utility.randomStr(8),
                            originTag: fieldObj.field,
                            conditionType: vals.conditionType,
                            value: vals.value
                        };
                        _this3.setState({
                            taskConditionList: [].concat(_toConsumableArray(taskConditionList), [newField]),
                            fieldModalVisible: false
                        });
                    } else if (!err && isEditField) {
                        fieldObj = _.find(_this3.logTplManageOriginField, function (el) {
                            return el.id == vals.originTag;
                        });
                        _.find(taskConditionList, function (el) {
                            if (el.id == curEditField.id) {
                                el.originTag = fieldObj.field;
                                el.conditionType = vals.conditionType;
                                el.value = vals.value;
                            }
                        });

                        _this3.setState({
                            taskConditionList: [].concat(_toConsumableArray(taskConditionList)),
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
                var model = _.find(this.state.taskConditionList, function (obj) {
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
                        var list = _.filter(this.state.taskConditionList, function (obj) {
                            return obj.id !== id;
                        }.bind(this));
                        this.setState({
                            taskConditionList: list
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
                        getFieldDecorator('originTag', {
                            initialValue: curEditField.originTag || "",
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
                            this.state.dataSourceOriginFieldTag
                        ))
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u5173\u7CFB' }),
                        getFieldDecorator('conditionType', {
                            initialValue: curEditField.conditionType || "",
                            rules: [{ required: true, message: '请选择关系!' }]
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
                                { value: 'NE' },
                                '\u4E0D\u76F8\u7B49'
                            ),
                            React.createElement(
                                Option,
                                { value: 'EQ' },
                                '\u76F8\u7B49'
                            ),
                            React.createElement(
                                Option,
                                { value: 'IN' },
                                '\u5305\u542B'
                            ),
                            React.createElement(
                                Option,
                                { value: 'NIN' },
                                '\u4E0D\u5305\u542B'
                            )
                        ))
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u503C', hasFeedback: true }),
                        getFieldDecorator('value', {
                            initialValue: curEditField.value || "",
                            rules: [{ required: true, message: '请输入值!' }]
                        })(React.createElement(Input, null))
                    )
                );

                return addEditNodesView;
            }
        }, {
            key: 'handleSubmit',
            value: function handleSubmit(e) {
                e.preventDefault();
                var _props$form5 = this.props.form,
                    resetFields = _props$form5.resetFields,
                    validateFields = _props$form5.validateFields;
                //resetFields("taskConditionList")

                var checkArray = ["accountId", "backGetLogName", "senderType", "backMethod", "backUrl", "batchCount", "batchInterval", "compressMode", "domainType", "domains", "logRange", "name", "productType", "taskTokenTimeType", "taskTokenType", "templateName", "tokenKey", "userAgent"];
                validateFields(checkArray, function (err, vals) {
                    var postParam,
                        taskFieldJson,
                        model = this.props.model;
                    var collection = this.props.ltProps.collection;
                    console.log(vals);
                    if (!err) {
                        taskFieldJson = {
                            "backMethod": vals.backMethod,
                            "backGetLogName": vals.backGetLogName,
                            "senderType": vals.senderType == "" ? null : vals.senderType,
                            "batchCount": vals.batchCount,
                            "batchInterval": vals.batchInterval,
                            "logRange": vals.logRange,
                            "compressMode": vals.compressMode,
                            "userAgent": vals.userAgent,
                            "tokenKey": vals.tokenKey,
                            "taskTokenType": vals.taskTokenType,
                            "taskTokenTimeType": vals.taskTokenTimeType
                        };
                        postParam = {
                            accountId: vals.accountId,
                            backUrl: vals.backUrl,
                            domainType: vals.domainType,
                            domains: vals.domains,
                            name: vals.name,
                            productType: vals.productType,
                            groupId: vals.templateName.key,
                            templateName: vals.templateName.label, //{key: "22991kskd91", label: "测试模板"}
                            taskFieldJson: taskFieldJson,
                            taskConditionList: this.state.taskConditionList
                        };
                        collection.addTask(postParam);
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
                    labelCol: { span: 12 },
                    wrapperCol: { span: 12 }
                };
                var baseInfoView = this.renderBaseInfoView(formItemLayout);
                var conditionListView = this.renderConditionTableView(formItemLayout);
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
                            conditionListView,
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

        return logTaskListEditForm;
    }(React.Component);

    var logTaskListEditView = Form.create()(logTaskListEditForm);
    return logTaskListEditView;
});
