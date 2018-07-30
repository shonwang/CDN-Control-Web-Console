'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("preheatManage.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], function (require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

    var Layout = Antd.Layout,
        Content = Layout.Content,
        Breadcrumb = Antd.Breadcrumb,
        Button = Antd.Button,
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
        Spin = Antd.Spin,
        Tooltip = Antd.Tooltip;

    var PreHeatTable = function (_React$Component) {
        _inherits(PreHeatTable, _React$Component);

        function PreHeatTable(props, context) {
            _classCallCheck(this, PreHeatTable);

            var _this = _possibleConstructorReturn(this, (PreHeatTable.__proto__ || Object.getPrototypeOf(PreHeatTable)).call(this, props));

            _this.onChangePage = _this.onChangePage.bind(_this);
            _this.handleEditClick = _this.handleEditClick.bind(_this);
            _this.handlePauseClick = _this.handlePauseClick.bind(_this);
            _this.handleRestartClick = _this.handleRestartClick.bind(_this);
            _this.state = {
                data: [],
                isError: false,
                isFetching: true
            };
            return _this;
        }

        _createClass(PreHeatTable, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var preHeatProps = this.props.preHeatProps;
                var collection = preHeatProps.collection,
                    queryCondition = preHeatProps.queryCondition;
                collection.on("get.preheat.success", $.proxy(this.onGetPreHeatListSuccess, this));
                collection.on("get.preheat.error", $.proxy(this.onGetError, this));
                collection.on("fetching", $.proxy(this.onFetchingPreHeatList, this));
                collection.trigger("fetching", queryCondition);
                collection.on("refresh.pause.success", $.proxy(this.onGetOperateSuccess, this, "暂停"));
                collection.on("refresh.pause.error", $.proxy(this.onOperateError, this));
                collection.on("refresh.restart.success", $.proxy(this.onGetOperateSuccess, this, "开启"));
                collection.on("refresh.restart.error", $.proxy(this.onOperateError, this));
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var collection = this.props.preHeatProps.collection;
                collection.off("get.preheat.success");
                collection.off("get.preheat.error");
                collection.off("fetching");
                collection.off("refresh.pause.success");
                collection.off("refresh.pause.error");
                collection.off("refresh.restart.success");
                collection.off("refresh.restart.error");
            }
        }, {
            key: 'onGetOperateSuccess',
            value: function onGetOperateSuccess(msg) {
                Utility.alerts(msg + "成功!", "success", 2000);
                var preHeatProps = this.props.preHeatProps;
                var collection = preHeatProps.collection,
                    queryCondition = preHeatProps.queryCondition;

                collection.trigger("fetching", queryCondition);
            }
        }, {
            key: 'onOperateError',
            value: function onOperateError(error) {
                if (error && error.message) Utility.alerts(error.message);else Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }
        }, {
            key: 'onFetchingPreHeatList',
            value: function onFetchingPreHeatList(queryCondition) {
                var collection = this.props.preHeatProps.collection;
                this.setState({
                    isFetching: true
                });
                collection.getPreheatList(queryCondition);
            }
        }, {
            key: 'onGetPreHeatListSuccess',
            value: function onGetPreHeatListSuccess() {
                var data = [];
                this.props.preHeatProps.collection.each(function (model) {
                    var obj = Object.assign({}, model.attributes),
                        nodeName = [];
                    _.each(obj.batchTimeBandwidth, function (batch) {
                        batch.nodeNameArray = batch.nodes.split(";");
                        nodeName = nodeName.concat(batch.nodeNameArray);
                    });
                    obj.nodeName = nodeName;
                    data.push(obj);
                });
                console.log(data);
                this.setState({
                    data: data,
                    isFetching: false
                });
            }
        }, {
            key: 'onChangePage',
            value: function onChangePage(page, pageSize) {
                var preHeatProps = this.props.preHeatProps;
                var collection = preHeatProps.collection,
                    queryCondition = preHeatProps.queryCondition;
                queryCondition.pageNo = page;
                queryCondition.pageSize = pageSize;
                collection.trigger("fetching", queryCondition);
            }
        }, {
            key: 'handlePauseClick',
            value: function handlePauseClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var preHeatProps = this.props.preHeatProps;
                var collection = preHeatProps.collection;
                collection.taskPause({ taskId: id });
            }
        }, {
            key: 'handleRestartClick',
            value: function handleRestartClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var preHeatProps = this.props.preHeatProps;
                var collection = preHeatProps.collection;
                collection.taskRestart({ taskId: id });
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
                var onClickEditCallback = this.props.preHeatProps.onClickEditCallback;
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
                var onClickViewCallback = this.props.preHeatProps.onClickViewCallback;
                onClickViewCallback && onClickViewCallback(model);
            }
        }, {
            key: 'onGetError',
            value: function onGetError(error) {
                var msgDes = "服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！";
                if (error && error.message) msgDes = error.message;

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
                    title: '名称',
                    dataIndex: 'taskName',
                    key: 'taskName',
                    fixed: 'left',
                    width: 200,
                    render: function render(text, record) {
                        return React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "查看详情" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: function onClick(e) {
                                        return _this2.handleViewClick(e);
                                    } },
                                text
                            )
                        );
                    }
                }, {
                    title: '回源带宽',
                    dataIndex: 'currentBandwidth',
                    key: 'currentBandwidth'
                }, {
                    title: '预热节点',
                    dataIndex: 'nodeName',
                    key: 'nodeName',
                    render: function render(text, record) {
                        var colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
                        var content = void 0,
                            temp = [];
                        var random = void 0,
                            nodeNameArray = record.currentNodes.split(";");
                        for (var i = 0; i < nodeNameArray.length; i++) {
                            random = Math.floor(Math.random() * colors.length);
                            temp.push(React.createElement(
                                Tag,
                                { color: colors[random], key: i, style: { marginBottom: '5px' } },
                                nodeNameArray[i]
                            ));
                        }
                        content = React.createElement(
                            'div',
                            null,
                            temp
                        );
                        return React.createElement(
                            'div',
                            null,
                            React.createElement(
                                'span',
                                null,
                                nodeNameArray[0],
                                '...'
                            ),
                            React.createElement(
                                'span',
                                null,
                                React.createElement(
                                    Popover,
                                    { content: content, title: '\u8282\u70B9\u8BE6\u60C5', trigger: 'click', placement: 'right', overlayStyle: { width: '300px' } },
                                    React.createElement(
                                        Badge,
                                        { count: nodeNameArray.length, style: { backgroundColor: '#52c41a' } },
                                        React.createElement(
                                            'a',
                                            { href: 'javascript:void(0)', id: record.id },
                                            'more'
                                        )
                                    )
                                )
                            )
                        );
                    }
                }, {
                    title: '文件数',
                    dataIndex: 'preloadUrlCount',
                    key: 'preloadUrlCount'
                }, {
                    title: '当前预热批次',
                    dataIndex: 'currentBatch',
                    key: 'currentBatch',
                    render: function render(text, record) {
                        return text + "/" + record.batchTimeBandwidth.length;
                    }
                }, {
                    title: '进度',
                    dataIndex: 'progress',
                    key: 'progress'
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
                    dataIndex: 'successRate',
                    key: 'successRate'
                }, {
                    title: '创建人',
                    dataIndex: 'committer',
                    key: 'committer'
                }, {
                    title: '创建时间',
                    dataIndex: 'commitTimeFormated',
                    key: 'commitTimeFormated'
                }, {
                    title: '操作',
                    dataIndex: 'id',
                    key: 'action',
                    fixed: 'right',
                    width: 100,
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
                        var playButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "开启" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: function onClick(e) {
                                        return _this2.handleRestartClick(e);
                                    } },
                                React.createElement(Icon, { type: 'play-circle-o' })
                            )
                        );
                        var pauseButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "暂停" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: function onClick(e) {
                                        return _this2.handlePauseClick(e);
                                    } },
                                React.createElement(Icon, { type: 'pause-circle-o' })
                            )
                        );
                        var buttonGroup;
                        if (record.status == 3) {
                            buttonGroup = React.createElement(
                                'div',
                                null,
                                editButton,
                                React.createElement('span', { className: 'ant-divider' }),
                                playButton
                            );
                        } else if (record.status == 1 || record.status == 0) {
                            buttonGroup = React.createElement(
                                'div',
                                null,
                                pauseButton
                            );
                        }
                        return buttonGroup;
                    }
                }];
                var preHeatProps = this.props.preHeatProps;
                var pagination = {
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: function showTotal(total) {
                        return 'Total ' + total + ' items';
                    },
                    current: preHeatProps.queryCondition.pageNo,
                    total: preHeatProps.collection.total,
                    onChange: this.onChangePage,
                    onShowSizeChange: this.onChangePage
                };

                return React.createElement(Table, { rowKey: 'id',
                    dataSource: this.state.data,
                    loading: this.state.isFetching,
                    columns: columns,
                    scroll: { x: 1500 },
                    pagination: pagination });
            }
        }]);

        return PreHeatTable;
    }(React.Component);

    var SearchForm = React.createClass({
        displayName: 'SearchForm',


        getInitialState: function getInitialState() {
            var defaultState = {
                dataSource: []
            };
            return defaultState;
        },

        handleSearch: function handleSearch(value) {
            var preHeatProps = this.props.preHeatProps;
            var nodeArray = [],
                nodeList = preHeatProps.nodeList;
            if (value && nodeList) {
                nodeArray = _.filter(nodeList, function (el) {
                    return el.name.indexOf(value) > -1 || el.chName.indexOf(value) > -1;
                }.bind(this)).map(function (el) {
                    return React.createElement(
                        Option,
                        { key: el.id },
                        el.name
                    );
                });
            }

            this.setState({
                dataSource: nodeArray
            });
        },

        handleSubmit: function handleSubmit(e) {
            e.preventDefault();
            var fieldsValue = this.props.form.getFieldsValue(),
                preHeatProps = this.props.preHeatProps;
            var collection = preHeatProps.collection,
                queryCondition = preHeatProps.queryCondition,
                nodes = [];
            if (fieldsValue.nodeNames && fieldsValue.nodeNames.length > 0) {
                _.each(fieldsValue.nodeNames, function (el) {
                    nodes.push(el.label);
                });
                nodes = nodes.join(";");
            } else {
                nodes = null;
            }
            queryCondition.taskName = fieldsValue.preheatNames || null;
            queryCondition.nodes = nodes;
            queryCondition.status = fieldsValue.preheatStatus == "all" ? null : parseInt(fieldsValue.preheatStatus);
            collection.trigger("fetching", queryCondition);
        },

        onClickAddButton: function onClickAddButton() {
            var onClickAddCallback = this.props.preHeatProps.onClickAddCallback;
            onClickAddCallback && onClickAddCallback();
        },

        render: function render() {
            var getFieldDecorator = this.props.form.getFieldDecorator;
            var dataSource = this.state.dataSource;

            var preHeatProps = this.props.preHeatProps;
            var nodeList = preHeatProps.nodeList;
            //0:待预热 1:预热中 2:已完成 3:已暂停 4：暂停中
            var HorizontalForm = React.createElement(
                Form,
                { layout: 'inline', onSubmit: this.handleSubmit },
                React.createElement(
                    FormItem,
                    { label: "名称" },
                    getFieldDecorator('preheatNames')(React.createElement(Input, null))
                ),
                React.createElement(
                    FormItem,
                    { label: "节点" },
                    getFieldDecorator('nodeNames')(React.createElement(
                        Select,
                        { mode: 'multiple', allowClear: true,
                            style: { width: 300 },
                            labelInValue: true,
                            notFoundContent: nodeList.length == 0 ? React.createElement(Spin, { size: 'small' }) : '请输入节点关键字',
                            filterOption: false,
                            onSearch: $.proxy(this.handleSearch, this) },
                        dataSource
                    ))
                ),
                React.createElement(
                    FormItem,
                    { label: '\u72B6\u6001' },
                    getFieldDecorator('preheatStatus', {
                        "initialValue": "all"
                    })(React.createElement(
                        Select,
                        null,
                        React.createElement(
                            Option,
                            { value: 'all' },
                            '\u5168\u90E8'
                        ),
                        React.createElement(
                            Option,
                            { value: '0' },
                            '\u5F85\u9884\u70ED'
                        ),
                        React.createElement(
                            Option,
                            { value: '1' },
                            '\u9884\u70ED\u4E2D'
                        ),
                        React.createElement(
                            Option,
                            { value: '3' },
                            '\u5DF2\u6682\u505C'
                        ),
                        React.createElement(
                            Option,
                            { value: '4' },
                            '\u6682\u505C\u4E2D'
                        ),
                        React.createElement(
                            Option,
                            { value: '2' },
                            '\u5DF2\u5B8C\u6210'
                        )
                    ))
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
    });

    var PreHeatManageList = React.createClass({
        displayName: 'PreHeatManageList',

        componentDidMount: function componentDidMount() {
            require(['nodeManage.model'], function (NodeManageModel) {
                var nodeManageModel = new NodeManageModel();
                nodeManageModel.on("get.node.success", $.proxy(this.onGetNodeListSuccess, this));
                nodeManageModel.on("get.node.error", $.proxy(this.onGetNodeListError, this));
                nodeManageModel.getNodeList({ page: 1, count: 9999 });
            }.bind(this));
        },

        getInitialState: function getInitialState() {
            var defaultState = {
                nodeList: [],
                curViewsMark: "list", // list: 列表界面，add: 新建，edit: 编辑
                breadcrumbTxt: ["预热刷新", "预热管理"]
            };
            return defaultState;
        },

        onGetNodeListSuccess: function onGetNodeListSuccess(res) {
            this.setState({
                nodeList: res
            });
        },

        onGetNodeListError: function onGetNodeListError(error) {
            var msg = error ? error.message : "获取节点信息失败!";
            Utility.alerts(msg);
            this.setState({
                nodeList: []
            });
        },

        onClickAddCallback: function onClickAddCallback() {
            require(['preheatManage.edit.view'], function (PreheatManageEditView) {
                this.curView = React.createElement(PreheatManageEditView, { preHeatProps: this.preHeatProps, isEdit: false });
                this.setState({
                    curViewsMark: "add",
                    breadcrumbTxt: ["预热管理", "新建"]
                });
            }.bind(this));
        },

        onClickEditCallback: function onClickEditCallback(model) {
            require(['preheatManage.edit.view'], function (PreheatManageEditView) {
                this.curView = React.createElement(PreheatManageEditView, { preHeatProps: this.preHeatProps, model: model, isEdit: true });
                this.setState({
                    curViewsMark: "edit",
                    breadcrumbTxt: ["预热管理", "编辑"]
                });
            }.bind(this));
        },

        onClickViewCallback: function onClickViewCallback(model) {
            require(['preheatManage.edit.view'], function (PreheatManageEditView) {
                this.curView = React.createElement(PreheatManageEditView, { preHeatProps: this.preHeatProps, model: model, isEdit: true, isView: true });
                this.setState({
                    curViewsMark: "view",
                    breadcrumbTxt: ["预热管理", "查看"]
                });
            }.bind(this));
        },

        onClickCancelCallback: function onClickCancelCallback() {
            this.setState({
                curViewsMark: "list",
                breadcrumbTxt: ["预热刷新", "预热管理"]
            });
        },

        render: function render() {
            var WrappedSearchForm = Form.create()(SearchForm);

            this.queryCondition = {
                "taskName": null,
                "status": null,
                "nodes": null,
                "pageNo": 1,
                "pageSize": 10
            };

            this.preHeatProps = {
                collection: this.props.collection,
                queryCondition: this.queryCondition,
                nodeList: this.state.nodeList,
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
                    React.createElement(WrappedSearchForm, { preHeatProps: this.preHeatProps }),
                    React.createElement('hr', null),
                    React.createElement(Alert, { style: { marginBottom: '20px' }, message: '\u56DE\u6E90\u5E26\u5BBD\u3001\u9884\u70ED\u8282\u70B9\u3001\u8FDB\u5EA6\u5C55\u793A\u5F53\u524D\u6267\u884C\u6279\u6B21\u4FE1\u606F\uFF0C\u6587\u4EF6\u6570\u3001\u72B6\u6001\u3001\u6210\u529F\u7387\u4E3A\u5F53\u524D\u4EFB\u52A1\u6574\u4F53\u4FE1\u606F', type: 'info', showIcon: true }),
                    React.createElement(PreHeatTable, { preHeatProps: this.preHeatProps })
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
    });

    var PreheatManageView = BaseView.extend({
        initialize: function initialize(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template('<div class="preheat-manage"></div>')());

            var preHeatManageListFac = React.createFactory(PreHeatManageList);
            var preHeatManageList = preHeatManageListFac({
                collection: this.collection
            });
            ReactDOM.render(preHeatManageList, this.$el.get(0));
        }
    });
    return PreheatManageView;
});
