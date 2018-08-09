'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("preheatManage.edit.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], function (require, exports, template, BaseView, Utility, Antd, React, moment) {

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

    var PreheatManageEditForm = function (_React$Component) {
        _inherits(PreheatManageEditForm, _React$Component);

        function PreheatManageEditForm(props, context) {
            _classCallCheck(this, PreheatManageEditForm);

            var _this = _possibleConstructorReturn(this, (PreheatManageEditForm.__proto__ || Object.getPrototypeOf(PreheatManageEditForm)).call(this, props));

            _this.onClickCancel = _this.onClickCancel.bind(_this);
            _this.renderTaskNameView = _this.renderTaskNameView.bind(_this);
            _this.renderNodesTableView = _this.renderNodesTableView.bind(_this);
            _this.renderTimeBandTableView = _this.renderTimeBandTableView.bind(_this);
            _this.validateTimeBand = _this.validateTimeBand.bind(_this);
            _this.validateNodesList = _this.validateNodesList.bind(_this);
            _this.handleSubmit = _this.handleSubmit.bind(_this);

            _this.state = {
                //上传
                fileList: [],
                disabledUpload: false,
                preloadUrlCount: 0,
                preloadFilePath: "",
                //预热批次
                isLoadingNodesList: false,
                nodesList: [],
                nodeModalVisible: false,
                nodeDataSource: [],
                isEditNode: false,
                curEditNode: {},
                //分时带宽
                timeBandList: [],
                timeModalVisible: false,
                isEditTime: false,
                curEditTime: {}
            };

            if (props.isEdit) {
                _this.state.nodesList = props.model.batchTimeBandwidth;
            }

            _this.isUploadDone = false;
            moment.locale("zh");
            return _this;
        }

        _createClass(PreheatManageEditForm, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var preHeatProps = this.props.preHeatProps,
                    nodeList = preHeatProps.nodeList;
                if (nodeList.length == 0) {
                    require(['nodeManage.model'], function (NodeManageModel) {
                        var nodeManageModel = new NodeManageModel();
                        nodeManageModel.on("get.node.success", $.proxy(this.onGetNodeListSuccess, this));
                        nodeManageModel.on("get.node.error", $.proxy(this.onGetNodeListError, this));
                        nodeManageModel.getNodeList({ page: 1, count: 9999 });
                        this.setState({
                            isLoadingNodesList: true
                        });
                    }.bind(this));
                }
                var collection = this.props.preHeatProps.collection;
                collection.on("refresh.commit.success", $.proxy(this.onSubmitSuccess, this));
                collection.on("refresh.commit.error", $.proxy(this.onGetError, this));
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var collection = this.props.preHeatProps.collection;
                collection.off("refresh.commit.success");
                collection.off("refresh.commit.error");
            }
        }, {
            key: 'onGetNodeListSuccess',
            value: function onGetNodeListSuccess(res) {
                this.props.preHeatProps.nodeList = res;
                this.setState({
                    isLoadingNodesList: false
                });
            }
        }, {
            key: 'onGetError',
            value: function onGetError(error) {
                if (error && error.message) Utility.alerts(error.message);else Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }
        }, {
            key: 'onSubmitSuccess',
            value: function onSubmitSuccess() {
                Utility.alerts("保存成功！", "success", 2000);
                this.onClickCancel();
            }
        }, {
            key: 'onGetNodeListError',
            value: function onGetNodeListError(error) {
                var msg = error ? error.message : "获取节点信息失败!";
                Utility.alerts(msg);
            }
        }, {
            key: 'handleSubmit',
            value: function handleSubmit(e) {
                e.preventDefault();
                var _props$form = this.props.form,
                    resetFields = _props$form.resetFields,
                    validateFields = _props$form.validateFields;

                resetFields("nodesList");
                var checkArray = ["taskName", "taskDomain", "rangeTimePicker", "nodesList", "fileList"];
                if (this.props.isEdit) {
                    checkArray = ["nodesList"];
                }
                validateFields(checkArray, function (err, vals) {
                    var _this2 = this;

                    var postParam,
                        postNodesList = [],
                        model = this.props.model;
                    var collection = this.props.preHeatProps.collection;
                    if (!err) {
                        _.each(this.state.nodesList, function (node) {
                            var postNode = {
                                id: node.id,
                                sortnum: node.sortnum,
                                nodes: node.nodeNameArray.join(";")
                            },
                                timeWidthList = [];

                            if (!_this2.props.isEdit) delete postNode.id;

                            _.each(node.timeWidth, function (time) {
                                var timeObj = {
                                    bandwidth: time.bandwidth,
                                    batchEndTime: moment(time.batchEndTime, 'HH:mm').valueOf(),
                                    id: time.id,
                                    batchStartTime: moment(time.batchStartTime, 'HH:mm').valueOf()
                                };
                                if (!_this2.props.isEdit) delete timeObj.id;

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
                var onClickCancelCallback = this.props.preHeatProps.onClickCancelCallback;
                onClickCancelCallback && onClickCancelCallback();
            }
        }, {
            key: 'onUploadFile',
            value: function onUploadFile(e) {
                console.log('Upload event:', e);
                if (e.fileList.length > 1) {
                    return [];
                }
                if (e) {
                    if (e.file.status == "error") {
                        this.onGetError(e.file.response);
                    } else if (e.file.status == "done") {
                        Utility.alerts("上传成功！", "success", 2000);
                        var res = e.file.response;
                        this.setState({
                            preloadUrlCount: res.preloadUrlCount,
                            preloadFilePath: res.preloadFilePath
                        });
                    }
                    if (!this.state.disabledUpload) {
                        this.setState({
                            disabledUpload: true
                        });
                    }
                }
                return e.fileList;
            }
        }, {
            key: 'validateDomain',
            value: function validateDomain(rule, value, callback) {
                if (value && Utility.isDomain(value)) {
                    callback();
                } else {
                    callback('请输入正确的域名！');
                }
            }
        }, {
            key: 'validateNodesList',
            value: function validateNodesList(rule, value, callback) {
                if (this.state.nodesList.length != 0) {
                    callback();
                } else {
                    callback('请添加预热节点！');
                }
            }
        }, {
            key: 'validateTimeBand',
            value: function validateTimeBand(rule, value, callback) {
                if (this.state.timeBandList.length != 0) {
                    callback();
                } else {
                    callback('请添加分时分时任务！');
                }
            }
        }, {
            key: 'renderTaskNameView',
            value: function renderTaskNameView(formItemLayout) {
                var _this3 = this;

                var _props$form2 = this.props.form,
                    getFieldDecorator = _props$form2.getFieldDecorator,
                    setFieldsValue = _props$form2.setFieldsValue,
                    getFieldValue = _props$form2.getFieldValue;

                var taskNameView = "",
                    model = this.props.model;

                var uploadProps = {
                    action: BASE_URL + "/refresh/task/upload",
                    onRemove: function onRemove(file) {
                        var fileList = getFieldValue("fileList");
                        var index = fileList.indexOf(file);
                        var newFileList = fileList.slice();
                        newFileList.splice(index, 1);
                        setFieldsValue({
                            fileList: newFileList
                        });
                        _this3.setState({
                            disabledUpload: false
                        });
                    },
                    beforeUpload: function beforeUpload(file, fileList) {
                        if (fileList.length > 1) {
                            return false;
                        }
                    },
                    multiple: false,
                    disabled: this.state.disabledUpload
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
                                model.taskName
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u57DF\u540D', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                model.channel
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u6587\u4EF6', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                model.preloadFilePath
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u6587\u4EF6\u6570\u76EE', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                model.preloadUrlCount
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u8D77\u6B62\u65F6\u95F4' }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                model.startTimeFormated,
                                '~',
                                model.endTimeFormated
                            )
                        )
                    );
                } else {
                    taskNameView = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u4EFB\u52A1\u540D\u79F0', hasFeedback: true }),
                            getFieldDecorator('taskName', {
                                rules: [{ required: true, message: '请输入任务名称!' }]
                            })(React.createElement(Input, null))
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u57DF\u540D', hasFeedback: true }),
                            getFieldDecorator('taskDomain', {
                                validateFirst: true,
                                rules: [{
                                    required: true, message: '请输入预热域名!' }, {
                                    validator: this.validateDomain
                                }]
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
                                    rules: [{ type: "array", required: true, message: '请上传预热文件，只能上传一个!' }]
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
                                        '\u652F\u6301\u70B9\u51FB\u6216\u62D6\u62FD\u5230\u6846\u91CC\u4E0A\u4F20'
                                    ),
                                    React.createElement(
                                        'p',
                                        { className: 'ant-upload-hint' },
                                        '\u53EA\u80FD\u4E0A\u4F20\u4E00\u4E2A\u6587\u4EF6'
                                    )
                                ))
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u6587\u4EF6\u6570\u76EE', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                this.state.preloadUrlCount
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u8D77\u6B62\u65F6\u95F4' }),
                            getFieldDecorator('rangeTimePicker', {
                                rules: [{ type: 'array', required: true, message: '请选择起止时间！' }]
                            })(React.createElement(RangePicker, { showTime: { format: 'HH:mm', minuteStep: 30 },
                                format: 'YYYY/MM/DD HH:mm',
                                disabledDate: this.disabledDate,
                                disabledTime: this.disabledTime }))
                        )
                    );
                }

                return taskNameView;
            }
        }, {
            key: 'handleCancel',
            value: function handleCancel() {
                this.setState({
                    nodeModalVisible: false
                });
            }
        }, {
            key: 'handleTimeCancel',
            value: function handleTimeCancel() {
                this.setState({
                    timeModalVisible: false
                });
            }
        }, {
            key: 'onClickAddNodes',
            value: function onClickAddNodes(event) {
                this.setState({
                    isEditNode: false,
                    curEditNode: {},
                    nodeModalVisible: true,
                    timeBandList: []
                });
            }
        }, {
            key: 'handleNodeOk',
            value: function handleNodeOk(e) {
                var _this4 = this;

                e.preventDefault();
                var _state = this.state,
                    nodesList = _state.nodesList,
                    isEditNode = _state.isEditNode,
                    curEditNode = _state.curEditNode,
                    timeBandList = _state.timeBandList;
                var _props$form3 = this.props.form,
                    getFieldsValue = _props$form3.getFieldsValue,
                    validateFields = _props$form3.validateFields,
                    resetFields = _props$form3.resetFields;

                var newNodes = null;
                resetFields("timeBand");
                validateFields(["selectNodes", "inputOriginBand", "timeBand"], function (err, vals) {
                    if (!err && !isEditNode) {
                        newNodes = {
                            sortnum: nodesList.length + 1,
                            id: Utility.randomStr(8),
                            nodeNameArray: getFieldsValue().selectNodes,
                            timeWidth: [].concat(_toConsumableArray(timeBandList))
                        };
                        _this4.setState({
                            nodesList: [].concat(_toConsumableArray(nodesList), [newNodes]),
                            nodeModalVisible: false
                        });
                    } else if (!err && isEditNode) {
                        _.find(nodesList, function (el) {
                            if (el.id == curEditNode.id) {
                                el.nodeNameArray = getFieldsValue().selectNodes, el.timeWidth = [].concat(_toConsumableArray(timeBandList));
                            }
                        });

                        _this4.setState({
                            nodesList: [].concat(_toConsumableArray(nodesList)),
                            nodeModalVisible: false
                        });
                    }
                });
            }
        }, {
            key: 'handleNodeSearch',
            value: function handleNodeSearch(value) {
                var preHeatProps = this.props.preHeatProps;
                var nodeArray = [],
                    nodeList = preHeatProps.nodeList;
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
            key: 'onClickEditNode',
            value: function onClickEditNode(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = _.find(this.state.nodesList, function (obj) {
                    return obj.id == id;
                }.bind(this));

                this.setState({
                    nodeModalVisible: true,
                    isEditNode: true,
                    curEditNode: model,
                    timeBandList: model.timeWidth
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
                        var list = _.filter(this.state.nodesList, function (obj) {
                            return obj.id !== id;
                        }.bind(this));
                        _.each(list, function (el, index) {
                            el.sortnum = index + 1;
                        });
                        this.setState({
                            nodesList: list
                        });
                    }.bind(this)
                });
            }
        }, {
            key: 'renderNodesTableView',
            value: function renderNodesTableView(formItemLayout) {
                var _this5 = this,
                    _React$createElement;

                var getFieldDecorator = this.props.form.getFieldDecorator;
                var _state2 = this.state,
                    nodesList = _state2.nodesList,
                    nodeModalVisible = _state2.nodeModalVisible,
                    nodeDataSource = _state2.nodeDataSource,
                    curEditNode = _state2.curEditNode;

                var preheatNodesView = "";
                var _props = this.props,
                    isView = _props.isView,
                    isEdit = _props.isEdit;

                var columns = [{
                    title: '批次',
                    dataIndex: 'sortnum',
                    key: 'sortnum'
                }, {
                    title: '预热节点',
                    dataIndex: 'nodeNameArray',
                    key: 'nodeNameArray',
                    width: 300,
                    render: function render(text, record) {
                        var colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
                        var content = [];
                        var random = void 0;
                        for (var i = 0; i < record.nodeNameArray.length; i++) {
                            random = Math.floor(Math.random() * colors.length);
                            content.push(React.createElement(
                                Tag,
                                { color: colors[random], key: i, style: { marginBottom: '5px' } },
                                record.nodeNameArray[i]
                            ));
                        }
                        return content;
                    }
                }, {
                    title: '进度',
                    dataIndex: 'successed ',
                    key: 'successed ',
                    render: function render(text, record) {
                        if (record.successed != undefined && record.failed != undefined) {
                            var total = record.successed + record.failed;
                            return total;
                        } else {
                            return "-";
                        }
                    }
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: function render(text, record) {
                        var tag = null;
                        if (record.status == 3) tag = React.createElement(
                            Tag,
                            { color: "red" },
                            '\u5DF2\u6682\u505C'
                        );else if (record.status == 2) tag = React.createElement(
                            Tag,
                            { color: "green" },
                            '\u5DF2\u5B8C\u6210'
                        );else if (record.status == 0) tag = React.createElement(
                            Tag,
                            { color: "blue" },
                            '\u5F85\u9884\u70ED'
                        );else if (record.status == 1) tag = React.createElement(
                            Tag,
                            { color: "orange" },
                            '\u9884\u70ED\u4E2D'
                        );else if (record.status == 4) tag = React.createElement(
                            Tag,
                            { color: "purple" },
                            '\u6682\u505C\u4E2D'
                        );
                        return tag;
                    }
                }, {
                    title: '成功率',
                    dataIndex: 'failed',
                    key: 'failed',
                    render: function render(text, record) {
                        if (record.successed != undefined && record.failed != undefined) {
                            var total = record.successed + record.failed;
                            if (total != 0) {
                                return record.successed / total * 100 + "%";
                            } else {
                                return "0";
                            }
                        } else {
                            return "-";
                        }
                    }
                }, {
                    title: '执行时间',
                    dataIndex: 'timeWidth',
                    key: 'timeWidth',
                    render: function render(text, record) {
                        return React.createElement(List, { size: 'small', dataSource: record.timeWidth,
                            renderItem: function renderItem(item) {
                                return React.createElement(
                                    List.Item,
                                    null,
                                    item.batchStartTime,
                                    '~',
                                    item.batchEndTime
                                );
                            } });
                    }
                }, {
                    title: '回源带宽',
                    dataIndex: 'bandwidth',
                    key: 'bandwidth',
                    render: function render(text, record) {
                        return React.createElement(List, { size: 'small', dataSource: record.timeWidth, renderItem: function renderItem(item) {
                                return React.createElement(
                                    List.Item,
                                    null,
                                    item.bandwidth,
                                    'M'
                                );
                            } });
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
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this5.onClickEditNode, _this5) },
                                React.createElement(Icon, { type: 'edit' })
                            )
                        );
                        var deleteButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "删除" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this5.onClickDeleteNode, _this5) },
                                React.createElement(Icon, { type: 'delete' })
                            )
                        );
                        var buttonGroup = null;
                        if (isView && isEdit) {
                            buttonGroup = "-";
                        } else if (!isEdit) {
                            buttonGroup = React.createElement(
                                'div',
                                null,
                                editButton,
                                React.createElement('span', { className: 'ant-divider' }),
                                deleteButton
                            );
                        } else if (isEdit) {
                            buttonGroup = editButton;
                        }
                        return buttonGroup;
                    }
                }];

                var addEditNodesView = null,
                    addButton = null;
                var timeBandView = this.renderTimeBandTableView(formItemLayout);

                if (this.state.isLoadingNodesList) {
                    addEditNodesView = React.createElement(
                        'div',
                        { style: { textAlign: "center" } },
                        React.createElement(Spin, null)
                    );
                } else {
                    addEditNodesView = React.createElement(
                        Form,
                        null,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u8282\u70B9' }),
                            getFieldDecorator('selectNodes', {
                                initialValue: curEditNode.nodeNameArray || [],
                                rules: [{ type: "array", required: true, message: '请选择预热节点!' }]
                            })(React.createElement(
                                Select,
                                { mode: 'multiple', allowClear: true,
                                    disabled: this.props.isEdit,
                                    notFoundContent: '请输入节点关键字',
                                    filterOption: false,
                                    onSearch: $.proxy(this.handleNodeSearch, this) },
                                nodeDataSource
                            ))
                        ),
                        timeBandView,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u5206\u65F6\u4EFB\u52A1', style: { display: "none" } }),
                            React.createElement(
                                Button,
                                { icon: 'plus', size: 'small', onClick: $.proxy(this.onClickAddNodes, this) },
                                '\u65B0\u5EFA\u5206\u65F6\u4EFB\u52A1'
                            ),
                            getFieldDecorator('inputOriginBand', {
                                initialValue: curEditNode.bandwidth || 100,
                                rules: [{ required: true, message: '请输入回源带宽!' }]
                            })(React.createElement(InputNumber, null)),
                            React.createElement(
                                'span',
                                { style: { marginLeft: "10px" } },
                                'M'
                            )
                        )
                    );
                }

                if (!this.props.isEdit) {
                    addButton = React.createElement(
                        Button,
                        { icon: 'plus', size: 'small', onClick: $.proxy(this.onClickAddNodes, this) },
                        '\u65B0\u5EFA\u9884\u70ED\u6279\u6B21'
                    );
                }

                preheatNodesView = React.createElement(
                    FormItem,
                    _extends({}, formItemLayout, { label: '\u9884\u70ED\u6279\u6B21', required: true }),
                    addButton,
                    React.createElement(Alert, { style: { marginBottom: '10px' }, message: '\u9884\u70ED\u4EFB\u52A1\u9075\u5FAA\u9884\u70ED\u6279\u6B21\u81EA\u52A8\u6267\u884C', type: 'info', showIcon: true }),
                    getFieldDecorator('nodesList', {
                        rules: [{ validator: this.validateNodesList }]
                    })(React.createElement(Table, { rowKey: 'id', columns: columns, pagination: false, size: 'small', dataSource: nodesList })),
                    React.createElement(
                        Modal,
                        (_React$createElement = { title: '预热批次', destroyOnClose: true, width: 800
                        }, _defineProperty(_React$createElement, 'destroyOnClose', true), _defineProperty(_React$createElement, 'visible', nodeModalVisible), _defineProperty(_React$createElement, 'onOk', $.proxy(this.handleNodeOk, this)), _defineProperty(_React$createElement, 'onCancel', $.proxy(this.handleCancel, this)), _React$createElement),
                        addEditNodesView
                    )
                );

                return preheatNodesView;
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
                var _this6 = this;

                e.preventDefault();
                var _state3 = this.state,
                    timeBandList = _state3.timeBandList,
                    isEditTime = _state3.isEditTime,
                    curEditTime = _state3.curEditTime;
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
                        _this6.setState({
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
                        _this6.setState({
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
                        console.log("...");
                        var list = _.filter(this.state.timeBandList, function (obj) {
                            return obj.id != id;
                        }.bind(this));
                        console.log(list);
                        this.setState({
                            timeBandList: list
                        });
                    }.bind(this)
                });
            }
        }, {
            key: 'renderTimeBandTableView',
            value: function renderTimeBandTableView(formItemLayout) {
                var _this7 = this,
                    _React$createElement2;

                var getFieldDecorator = this.props.form.getFieldDecorator;
                var _state4 = this.state,
                    timeModalVisible = _state4.timeModalVisible,
                    curEditTime = _state4.curEditTime;

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
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this7.handleEditTimeClick, _this7) },
                                React.createElement(Icon, { type: 'edit' })
                            )
                        );
                        var deleteButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "删除" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this7.handleDeleteTimeClick, _this7) },
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
            key: 'render',
            value: function render() {
                var getFieldDecorator = this.props.form.getFieldDecorator;

                var formItemLayout = {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 16 }
                };
                var taskNameView = this.renderTaskNameView(formItemLayout);
                var preheatNodesView = this.renderNodesTableView(formItemLayout);
                var saveButton = null;
                if (!this.props.isView) saveButton = React.createElement(
                    Button,
                    { type: 'primary', htmlType: 'submit' },
                    '\u4FDD\u5B58'
                );

                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Form,
                        { onSubmit: this.handleSubmit },
                        taskNameView,
                        preheatNodesView,
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
        }]);

        return PreheatManageEditForm;
    }(React.Component);

    var PreheatManageEditView = Form.create()(PreheatManageEditForm);
    return PreheatManageEditView;
});
