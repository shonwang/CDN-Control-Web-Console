'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("netRateLimiting.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], function (require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

    var Layout = Antd.Layout,
        Content = Layout.Content,
        Breadcrumb = Antd.Breadcrumb,
        Button = Antd.Button,
        Table = Antd.Table,
        Tag = Antd.Tag,
        Popover = Antd.Popover,
        Modal = Antd.Modal,
        Icon = Antd.Icon,
        Spin = Antd.Spin,
        Alert = Antd.Alert,
        Tooltip = Antd.Tooltip,
        confirm = Modal.confirm;

    var LimitGroupTable = function (_React$Component) {
        _inherits(LimitGroupTable, _React$Component);

        function LimitGroupTable(props, context) {
            _classCallCheck(this, LimitGroupTable);

            //this.onChangePage = this.onChangePage.bind(this);
            var _this = _possibleConstructorReturn(this, (LimitGroupTable.__proto__ || Object.getPrototypeOf(LimitGroupTable)).call(this, props));

            _this.handleEditClick = _this.handleEditClick.bind(_this);
            _this.handleDeleteClick = _this.handleDeleteClick.bind(_this);

            _this.state = {
                data: [],
                isError: false,
                isFetching: true
            };
            return _this;
        }

        _createClass(LimitGroupTable, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var limitProps = this.props.limitProps;
                var collection = limitProps.collection,
                    queryCondition = limitProps.queryCondition;
                collection.on("get.allLimit.success", $.proxy(this.onGetAllLimitRateGroupSuccess, this));
                collection.on("get.allLimit.error", $.proxy(this.onGetError, this));
                collection.on("fetching", $.proxy(this.onFetchinAllLimitRateGroup, this));
                collection.trigger("fetching", queryCondition);
                collection.on("delete.limit.success", $.proxy(this.onGetOperateSuccess, this, "删除"));
                collection.on("delete.limit.error", $.proxy(this.onOperateError, this));
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var collection = this.props.limitProps.collection;
                collection.off("get.allLimit.success");
                collection.off("get.allLimit.error");
                collection.off("fetching");
                collection.off("delete.limit.success");
                collection.off("delete.limit.error");
            }
        }, {
            key: 'onGetOperateSuccess',
            value: function onGetOperateSuccess(msg) {
                Utility.alerts(msg + "成功!", "success", 2000);
                var limitProps = this.props.limitProps;
                var collection = limitProps.collection,
                    queryCondition = limitProps.queryCondition;

                collection.trigger("fetching", queryCondition);
            }
        }, {
            key: 'onOperateError',
            value: function onOperateError(error) {
                if (error && error.message) Utility.alerts(error.message);else Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }
        }, {
            key: 'onFetchinAllLimitRateGroup',
            value: function onFetchinAllLimitRateGroup(queryCondition) {
                var collection = this.props.limitProps.collection;
                this.setState({
                    isFetching: true
                });
                collection.gettAllLimitRateGroup(queryCondition);

                //this.onGetAllLimitRateGroupSuccess();
            }
        }, {
            key: 'onGetAllLimitRateGroupSuccess',
            value: function onGetAllLimitRateGroupSuccess(data) {
                //var data = [];

                // var data = [{
                //     "id": 19,
                //     "quotaUnits": "Gbps",
                //     "totalQuota": 100,
                //     "userId": 1241,
                //     "applicationType": 1,
                //     "creater": "1234",
                //     "createTime": 1537152256000,
                //     "updateTime": 1537152820000,
                //     "source": 2,
                //     "remark": "",
                //     "lastModifier": "",
                //     "defaultMode": 1,
                //     "defaultModeString": null,
                //     "active": "-1",
                //     "domainCount": 1,
                //     "domains": [
                //         "jiasutest1.ksyunacc.com"
                //     ]
                // }]

                this.setState({
                    data: data,
                    isFetching: false
                });
            }
        }, {
            key: 'onChangePage',
            value: function onChangePage(page, pageSize) {
                var limitProps = this.props.limitProps;
                var collection = limitProps.collection,
                    queryCondition = limitProps.queryCondition;
                queryCondition.pageNo = page;
                queryCondition.pageSize = pageSize;
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
                confirm({
                    title: '你确定要删除吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '算了，不删了',
                    onOk: function () {
                        var limitProps = this.props.limitProps,
                            collection = limitProps.collection;
                        collection.delLimitRateByGroupId({ groupId: id });
                    }.bind(this)
                });
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
                var onClickEditCallback = this.props.limitProps.onClickEditCallback;
                onClickEditCallback && onClickEditCallback(model);
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
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id'
                }, {
                    title: '限速域名',
                    dataIndex: 'domains',
                    key: 'domains',
                    render: function render(text, record) {
                        var colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
                        var content = void 0,
                            temp = [];
                        var random = void 0,
                            domainsArray = record.domains;
                        for (var i = 0; i < domainsArray.length; i++) {
                            random = Math.floor(Math.random() * colors.length);
                            temp.push(React.createElement(
                                Tag,
                                { color: colors[random], key: i, style: { marginBottom: '5px' } },
                                domainsArray[i]
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
                                domainsArray[0],
                                '...'
                            ),
                            React.createElement(
                                'span',
                                null,
                                React.createElement(
                                    Popover,
                                    { content: content, title: '\u57DF\u540D\u8BE6\u60C5', trigger: 'click', placement: 'right', overlayStyle: { width: '300px' } },
                                    React.createElement(
                                        'a',
                                        { href: 'javascript:void(0)', id: record.id },
                                        'more'
                                    )
                                )
                            )
                        );
                    }
                }, {
                    title: '域名个数',
                    dataIndex: 'domainCount',
                    key: 'domainCount'
                }, {
                    title: '阈值',
                    dataIndex: 'totalQuota',
                    key: 'totalQuota',
                    render: function render(text, record) {
                        return record.totalQuota + record.quotaUnits;
                    }
                }, {
                    title: '超额策略',
                    dataIndex: 'defaultModeString',
                    key: 'defaultModeString'
                }, {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    render: function render(text, record) {
                        return new Date(record.createTime).format("yyyy/MM/dd hh:mm:ss");
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
                                { href: 'javascript:void(0)', id: record.id, onClick: function onClick(e) {
                                        return _this2.handleEditClick(e);
                                    } },
                                React.createElement(Icon, { type: 'edit' })
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
                // var limitProps = this.props.limitProps;
                // var pagination = {
                //     showSizeChanger: true,
                //     showQuickJumper: true,
                //         showTotal: function showTotal(total) {
                //         return 'Total '+ total + ' items';
                //     },
                //     current: limitProps.queryCondition.pageNo,
                //     total: limitProps.collection.total,
                //     onChange: this.onChangePage,
                //     onShowSizeChange: this.onChangePage
                // }

                return React.createElement(Table, { rowKey: 'id',
                    dataSource: this.state.data,
                    loading: this.state.isFetching,
                    columns: columns,
                    pagination: false });
            }
        }]);

        return LimitGroupTable;
    }(React.Component);

    var NetRateLimitingList = React.createClass({
        displayName: 'NetRateLimitingList',

        componentDidMount: function componentDidMount() {},

        getInitialState: function getInitialState() {
            var defaultState = {
                curViewsMark: "list", // list: 列表界面，add: 新建，edit: 编辑
                breadcrumbTxt: ["客户配置管理", "全局限速"]
            };
            return defaultState;
        },

        onClickAddCallback: function onClickAddCallback() {
            require(['netRateLimiting.edit.view'], function (NetRateLimitingEditView) {
                this.curView = React.createElement(NetRateLimitingEditView, { limitProps: this.limitProps, isEdit: false });
                this.setState({
                    curViewsMark: "add",
                    breadcrumbTxt: ["全局限速", "新建"]
                });
            }.bind(this));
        },

        onClickEditCallback: function onClickEditCallback(model) {
            require(['netRateLimiting.edit.view'], function (NetRateLimitingEditView) {
                this.curView = React.createElement(NetRateLimitingEditView, { limitProps: this.limitProps, model: model, isEdit: true });
                this.setState({
                    curViewsMark: "edit",
                    breadcrumbTxt: ["全局限速", "编辑"]
                });
            }.bind(this));
        },

        onClickCancelCallback: function onClickCancelCallback() {
            this.setState({
                curViewsMark: "list",
                breadcrumbTxt: ["客户配置管理", "全局限速"]
            });
        },

        render: function render() {
            this.queryCondition = {
                "userId": this.props.userInfo.uid
            };

            this.limitProps = {
                collection: this.props.collection,
                userInfo: this.props.userInfo,
                queryCondition: this.queryCondition,
                onClickAddCallback: $.proxy(this.onClickAddCallback, this),
                onClickEditCallback: $.proxy(this.onClickEditCallback, this),
                onClickCancelCallback: $.proxy(this.onClickCancelCallback, this)
            };

            var curView = null;
            if (this.state.curViewsMark == "list") {
                curView = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Button,
                        { icon: 'plus', onClick: this.onClickAddButton },
                        '\u65B0\u5EFA'
                    ),
                    React.createElement('hr', null),
                    React.createElement(LimitGroupTable, { limitProps: this.limitProps })
                );
            } else if (this.state.curViewsMark == "add" || this.state.curViewsMark == "edit") {
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
                    React.createElement('div', { className: 'opt-ctn well' }),
                    React.createElement(
                        'div',
                        { style: { background: '#fff', padding: 24, minHeight: 280 } },
                        curView
                    )
                )
            );
        }
    });

    var NetRateLimitingView = BaseView.extend({

        initialize: function initialize(options) {
            this.collection = options.collection;
            this.options = options;

            this.$el = $(_.template('<div class="net-rate-limiting"><div class="list"></div></div>')());

            var clientInfo = JSON.parse(options.query);
            this.userInfo = {
                clientName: clientInfo.clientName,
                uid: clientInfo.uid
            };

            var NetRateLimitingListFac = React.createFactory(NetRateLimitingList);
            var netRateLimitingList = NetRateLimitingListFac({
                collection: this.collection,
                userInfo: this.userInfo
            });
            ReactDOM.render(netRateLimitingList, this.$el.find(".list").get(0));

            this.optHeader = $(_.template(template['tpl/customerSetup/customerSetup.header.html'])({
                data: this.userInfo
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));
        },

        update: function update(query, target) {
            this.options.query = query;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        }
    });
    return NetRateLimitingView;
});
