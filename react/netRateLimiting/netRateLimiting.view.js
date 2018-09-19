define("netRateLimiting.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], 
    function(require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {
        
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

        class LimitGroupTable extends React.Component {
            constructor(props, context) {
                super(props);
                //this.onChangePage = this.onChangePage.bind(this);
                this.handleEditClick = this.handleEditClick.bind(this);
                this.handleDeleteClick = this.handleDeleteClick.bind(this);
                this.onGetAllLimitRateGroupSuccess = this.onGetAllLimitRateGroupSuccess.bind(this);
                this.state = {
                    data: [],
                    isError: false,
                    isFetching: true
                };
            }

            componentDidMount() {
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

            componentWillUnmount() {
                var collection = this.props.limitProps.collection;
                collection.off("get.allLimit.success");
                collection.off("get.allLimit.error");
                collection.off("fetching");
                collection.off("delete.limit.success");
                collection.off("delete.limit.error");   
            }

            onGetOperateSuccess(msg){
                Utility.alerts(msg + "成功!", "success", 2000);
                const limitProps = this.props.limitProps;
                const { collection, queryCondition } = limitProps;
                collection.trigger("fetching", queryCondition);
            }

            onOperateError(error){
                if (error && error.message)
                    Utility.alerts(error.message);
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }

            onFetchinAllLimitRateGroup(queryCondition){
                var collection = this.props.limitProps.collection;
                this.setState({
                    isFetching: true
                })
                //collection.gettAllLimitRateGroup(queryCondition)

                this.onGetAllLimitRateGroupSuccess();
            }

            onGetAllLimitRateGroupSuccess() {
                //var data = [];

                var data = [{
                    "id": 19,
                    "quotaUnits": "Gbps",
                    "totalQuota": 100,
                    "userId": 1241,
                    "applicationType": 1,
                    "creater": "1234",
                    "createTime": 1537152256000,
                    "updateTime": 1537152820000,
                    "source": 2,
                    "remark": "",
                    "lastModifier": "",
                    "defaultMode": 1,
                    "defaultModeString": null,
                    "active": "-1",
                    "domainCount": 1,
                    "domains": [
                        "jiasutest1.ksyunacc.com"
                    ]
                }]

                this.setState({
                    data: data,
                    isFetching: false
                })
            }

            onChangePage(page, pageSize){
                var limitProps = this.props.limitProps;
                var collection = limitProps.collection,
                    queryCondition = limitProps.queryCondition;
                queryCondition.pageNo = page;
                queryCondition.pageSize = pageSize;
                collection.trigger("fetching", queryCondition);
            }

            handleDeleteClick(event) {
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
                    onOk: function(){
                        var limitProps = this.props.limitProps,
                            collection = limitProps.collection;
                        collection.delLimitRateByGroupId({groupId: id})
                    }.bind(this)
                });
            }

            handleEditClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = _.find(this.state.data, function(obj){
                        return obj.id == id
                    }.bind(this))
                var onClickEditCallback = this.props.limitProps.onClickEditCallback;
                onClickEditCallback&&onClickEditCallback(model)
            }

            onGetError(error) {
                var msgDes = "服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！"
                if (error && error.message)
                    msgDes = error.message;

                this.setState({
                    isError: true,
                    isFetching: false
                })

                this.errorView = (
                    <Alert
                        message="出错了"
                        description={msgDes}
                        type="error"
                        showIcon
                    />
                );
            }

            render() {
                if (this.state.isError) {
                    return this.errorView || (
                        <Alert
                            message="出错了"
                            type="error"
                            showIcon
                        />
                    );
                }
                const columns = [{
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id'
                },{
                    title: '限速域名',
                    dataIndex: 'domains',
                    key: 'domains',
                    render: (text, record) => {
                        const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
                        let content, temp = [];
                        let random, domainsArray = record.domains;
                        for(var i = 0; i < domainsArray.length; i++) {
                            random = Math.floor(Math.random() * colors.length)
                            temp.push((<Tag color={colors[random]} key={i} style={{marginBottom: '5px'}}>{domainsArray[i]}</Tag>))
                        }
                        content = <div>{temp}</div>
                        return (
                            <div>
                                <span>{domainsArray[0]}...</span>
                                <span>
                                    <Popover content={content} title="域名详情" trigger="click" placement="right" overlayStyle={{width: '300px'}}>
                                        <a href="javascript:void(0)" id={record.id}>more</a>
                                    </Popover>
                                </span>
                            </div>)
                    }
                },{
                    title: '域名个数',
                    dataIndex: 'domainCount',
                    key: 'domainCount',
                },{
                    title: '阈值',
                    dataIndex: 'totalQuota',
                    key: 'totalQuota',
                    render: (text, record) => {
                        return record.totalQuota + record.quotaUnits
                    }
                },{
                    title: '超额策略',
                    dataIndex: 'defaultModeString',
                    key: 'defaultModeString',
                },{
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    render: (text, record) => {
                        return new Date(record.createTime).format("yyyy/MM/dd hh:mm:ss")
                    }
                },{
                    title: '操作',
                    dataIndex: '',
                    key: 'action',
                    render: (text, record) => {
                        var editButton = (
                            <Tooltip placement="bottom" title={"编辑"}>
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleEditClick(e)}>
                                    <Icon type="edit" />
                                </a>
                            </Tooltip>
                        );
                        var deleteButton = (
                            <Tooltip placement="bottom" title={"删除"}>
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleDeleteClick(e)}>
                                    <Icon type="delete" />
                                </a>
                            </Tooltip>
                        )
                        var buttonGroup = (
                                <div>
                                    {editButton}
                                    <span className="ant-divider" />
                                    {deleteButton}
                                </div>
                            )
                        return buttonGroup
                    },
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

                return ( <Table rowKey="id" 
                                dataSource={this.state.data} 
                                loading={this.state.isFetching} 
                                columns={columns}
                                pagination = {false} /> )
            }
        }   

        var NetRateLimitingList = React.createClass({
            componentDidMount: function(){
            },

            getInitialState: function () {
                var defaultState = {
                    nodeList: [],
                    curViewsMark: "list",// list: 列表界面，add: 新建，edit: 编辑
                    breadcrumbTxt: ["客户配置管理", "全局限速"]
                }
                return defaultState;
            },

            onClickAddCallback: function(){
                require(['preheatManage.edit.view'],function(PreheatManageEditView){
                    this.curView = (<PreheatManageEditView limitProps={this.limitProps} isEdit={false} />);
                    this.setState({
                        curViewsMark: "add",
                        breadcrumbTxt: ["全局限速", "新建"]
                    })
                }.bind(this));
            },

            onClickEditCallback: function(model){
                require(['preheatManage.edit.view'],function(PreheatManageEditView){
                    this.curView = (<PreheatManageEditView limitProps={this.limitProps} model={model} isEdit={true} />);
                    this.setState({
                        curViewsMark: "edit",
                        breadcrumbTxt: ["全局限速", "编辑"]
                    })
                }.bind(this));
            },

            onClickCancelCallback: function(){
                this.setState({
                    curViewsMark: "list",
                    breadcrumbTxt: ["客户配置管理", "全局限速"]
                })
            },

            render: function(){
                this.queryCondition = {
                    "userId": null
                }

                this.limitProps = {
                    collection: this.props.collection,
                    queryCondition: this.queryCondition,
                    onClickAddCallback: $.proxy(this.onClickAddCallback, this),
                    onClickEditCallback: $.proxy(this.onClickEditCallback, this),
                    onClickCancelCallback: $.proxy(this.onClickCancelCallback, this)
                }

                var curView = null;
                if (this.state.curViewsMark == "list") {
                    curView = (
                        <div>
                            <Button icon="plus" onClick={this.onClickAddButton}>新建</Button>
                            <hr />    
                            <LimitGroupTable limitProps={this.limitProps} />
                        </div>
                    )
                } else if (this.state.curViewsMark == "add" ||
                           this.state.curViewsMark == "edit") {
                    curView = this.curView;
                }

                return (     
                    <Layout>
                        <Content>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>{this.state.breadcrumbTxt[0]}</Breadcrumb.Item>
                                <Breadcrumb.Item>{this.state.breadcrumbTxt[1]}</Breadcrumb.Item>
                            </Breadcrumb>
                            <div className="opt-ctn well"></div>
                            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                                {curView}
                            </div>
                        </Content>
                    </Layout>
                )
            }
        });

        var NetRateLimitingView = BaseView.extend({

            initialize: function(options) {
                this.collection = options.collection;
                this.options = options;

                this.$el = $(_.template('<div class="net-rate-limiting"><div class="list"></div></div>')());

                var clientInfo = JSON.parse(options.query);
                this.userInfo = {
                    clientName: clientInfo.clientName,
                    uid: clientInfo.uid
                }

                var NetRateLimitingListFac = React.createFactory(NetRateLimitingList);
                var netRateLimitingList = NetRateLimitingListFac({
                    collection: this.collection
                });
                ReactDOM.render(netRateLimitingList, this.$el.find(".list").get(0));

                this.optHeader = $(_.template(template['tpl/customerSetup/customerSetup.header.html'])({
                    data: this.userInfo
                }));
                this.optHeader.appendTo(this.$el.find(".opt-ctn"));                
            }
        });
        return NetRateLimitingView;
    });