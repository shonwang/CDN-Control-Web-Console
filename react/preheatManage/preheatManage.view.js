define("preheatManage.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], 
    function(require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

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

        class PreHeatTable extends React.Component {
            constructor(props, context) {
                super(props);
                this.onChangePage = this.onChangePage.bind(this);
                this.handleEditClick = this.handleEditClick.bind(this);
                this.handlePauseClick = this.handlePauseClick.bind(this);
                this.handleRestartClick = this.handleRestartClick.bind(this);
                this.state = {
                    data: [],
                    isError: false,
                    isFetching: true
                };
            }

            componentDidMount() {
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

            componentWillUnmount() {
                var collection = this.props.preHeatProps.collection;
                collection.off("get.preheat.success");
                collection.off("get.preheat.error");
                collection.off("fetching");
                collection.off("refresh.pause.success");
                collection.off("refresh.pause.error");
                collection.off("refresh.restart.success");
                collection.off("refresh.restart.error");    
            }

            onGetOperateSuccess(msg){
                Utility.alerts(msg + "成功!", "success", 2000);
                const preHeatProps = this.props.preHeatProps;
                const { collection, queryCondition } = preHeatProps;
                collection.trigger("fetching", queryCondition);
            }

            onOperateError(error){
                if (error && error.message)
                    Utility.alerts(error.message);
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }

            onFetchingPreHeatList(queryCondition){
                var collection = this.props.preHeatProps.collection;
                this.setState({
                    isFetching: true
                })
                collection.getPreheatList(queryCondition)
            }

            onGetPreHeatListSuccess() {
                var data = [];
                this.props.preHeatProps.collection.each((model) => {
                    var obj = Object.assign({}, model.attributes),
                        nodeName = [];
                    _.each(obj.batchTimeBandwidth, (batch)=>{
                        batch.nodeNameArray = batch.nodes.split(";");
                        nodeName = nodeName.concat(batch.nodeNameArray);
                    })
                    obj.nodeName = nodeName;
                    data.push(obj)
                })
                console.log(data)
                this.setState({
                    data: data,
                    isFetching: false
                })
            }

            onChangePage(page, pageSize){
                var preHeatProps = this.props.preHeatProps;
                var collection = preHeatProps.collection,
                    queryCondition = preHeatProps.queryCondition;
                queryCondition.pageNo = page;
                queryCondition.pageSize = pageSize;
                collection.trigger("fetching", queryCondition);
            }

            handlePauseClick(event) {
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
                collection.taskPause({taskId: id});
            }

            handleRestartClick(event) {
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
                collection.taskRestart({taskId: id});
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
                var onClickEditCallback = this.props.preHeatProps.onClickEditCallback;
                onClickEditCallback&&onClickEditCallback(model)
            }

            handleViewClick(event) {
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
                var onClickViewCallback = this.props.preHeatProps.onClickViewCallback;
                onClickViewCallback&&onClickViewCallback(model)
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
                    title: '名称',
                    dataIndex: 'taskName',
                    key: 'taskName',
                    fixed: 'left',
                    width: 200,
                    render: (text, record) => {
                        return  (
                                <Tooltip placement="bottom" title={"查看详情"}>
                                    <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleViewClick(e)}>
                                        {text}
                                    </a>
                                </Tooltip>
                            )
                    }
                },{
                    title: '回源带宽',
                    dataIndex: 'currentBandwidth',
                    key: 'currentBandwidth',
                },{
                    title: '预热节点',
                    dataIndex: 'nodeName',
                    key: 'nodeName',
                    render: (text, record) => {
                        const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
                        let content, temp = [];
                        let random, nodeNameArray = record.currentNodes.split(";");
                        for(var i = 0; i < nodeNameArray.length; i++) {
                            random = Math.floor(Math.random() * colors.length)
                            temp.push((<Tag color={colors[random]} key={i} style={{marginBottom: '5px'}}>{nodeNameArray[i]}</Tag>))
                        }
                        content = <div>{temp}</div>
                        return (
                            <div>
                                <span>{nodeNameArray[0]}...</span>
                                <span>
                                    <Popover content={content} title="节点详情" trigger="click" placement="right" overlayStyle={{width: '300px'}}>
                                        <Badge count={nodeNameArray.length} style={{ backgroundColor: '#52c41a' }}>
                                            <a href="javascript:void(0)" id={record.id}>more</a>
                                        </Badge>
                                    </Popover>
                                </span>
                            </div>)
                    }
                },{
                    title: '文件数',
                    dataIndex: 'preloadUrlCount',
                    key: 'preloadUrlCount',
                },{
                    title: '当前预热批次',
                    dataIndex: 'currentBatch',
                    key: 'currentBatch',
                    render: (text, record) => (text + "/" + record.batchTimeBandwidth.length)
                },{
                    title: '进度',
                    dataIndex: 'progress',
                    key: 'progress',
                },{
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (text, record) => {
                        var tag = null;
                        if (record.status == 3)
                            tag = (<Tag color={"red"}>已暂停</Tag>)
                        else if (record.status == 2)
                            tag = <Tag color={"green"}>已完成</Tag>
                        else if (record.status == 0)
                            tag = <Tag color={"blue"}>待预热</Tag>
                        else if (record.status == 1)
                            tag = <Tag color={"orange"}>预热中</Tag>
                        else if (record.status == 4)
                            tag = <Tag color={"purple"}>暂停中</Tag>
                        return tag
                    }
                },{
                    title: '成功率',
                    dataIndex: 'successRate',
                    key: 'successRate',
                    render: (text, record) => (text * 100 + "%")
                },{
                    title: '创建人',
                    dataIndex: 'committer',
                    key: 'committer',
                },{
                    title: '创建时间',
                    dataIndex: 'commitTimeFormated',
                    key: 'commitTimeFormated',
                },{
                    title: '操作',
                    dataIndex: 'id',
                    key: 'action',
                    fixed: 'right',
                    width: 100,
                    render: (text, record) => {
                        var editButton = (
                            <Tooltip placement="bottom" title={"编辑"}>
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleEditClick(e)}>
                                    <Icon type="edit" />
                                </a>
                            </Tooltip>
                        );
                        var playButton = (
                            <Tooltip placement="bottom" title={"开启"}>
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleRestartClick(e)}>
                                    <Icon type="play-circle-o" />
                                </a>
                            </Tooltip>
                        );
                        var pauseButton = (
                            <Tooltip placement="bottom" title={"暂停"}>
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handlePauseClick(e)}>
                                    <Icon type="pause-circle-o" />
                                </a>
                            </Tooltip>
                        )
                        var buttonGroup;
                        if (record.status == 3) {
                            buttonGroup = (
                                <div>
                                    {editButton}
                                    <span className="ant-divider" />
                                    {playButton}
                                </div>
                            )
                        } else if (record.status == 1 || record.status == 0) {
                            buttonGroup = (<div>{pauseButton}</div>)
                        }
                        return buttonGroup
                    },
                }];
                var preHeatProps = this.props.preHeatProps;
                var pagination = {
                    showSizeChanger: true,
                    showQuickJumper: true,
                        showTotal: function showTotal(total) {
                        return 'Total '+ total + ' items';
                    },
                    current: preHeatProps.queryCondition.pageNo,
                    total: preHeatProps.collection.total,
                    onChange: this.onChangePage,
                    onShowSizeChange: this.onChangePage
                }

                return ( <Table rowKey="id" 
                                dataSource={this.state.data} 
                                loading={this.state.isFetching} 
                                columns={columns}
                                scroll={{ x: 1500 }} 
                                pagination = {pagination} /> )
            }
        }    

        var SearchForm = React.createClass({

            getInitialState: function () {
                var defaultState = {
                    dataSource: []
                }
                return defaultState;
            },

            handleSearch: function (value){
                var preHeatProps = this.props.preHeatProps;
                var nodeArray = [], nodeList = preHeatProps.nodeList;
                if (value && nodeList) {
                    nodeArray = _.filter(nodeList, function(el){
                        return el.name.indexOf(value) > -1 || el.chName.indexOf(value) > -1
                    }.bind(this)).map((el) => {
                        return <Option key={el.id}>{el.name}</Option>;
                    })
                }

                this.setState({
                    dataSource: nodeArray
                });
            },

            handleSubmit: function(e){
                e.preventDefault();
                var fieldsValue = this.props.form.getFieldsValue(),
                    preHeatProps = this.props.preHeatProps;
                var collection = preHeatProps.collection,
                    queryCondition = preHeatProps.queryCondition,
                    nodes = [];
                if (fieldsValue.nodeNames && fieldsValue.nodeNames.length > 0) {
                    _.each(fieldsValue.nodeNames, (el)=>{
                        nodes.push(el.label)
                    })
                    nodes = nodes.join(";")
                } else {
                    nodes = null;
                }    
                queryCondition.taskName = fieldsValue.preheatNames || null;
                queryCondition.nodes = nodes;
                queryCondition.status = fieldsValue.preheatStatus == "all" ? null : parseInt(fieldsValue.preheatStatus);
                collection.trigger("fetching", queryCondition)
            },

            onClickAddButton: function(){
                var onClickAddCallback = this.props.preHeatProps.onClickAddCallback;
                onClickAddCallback&&onClickAddCallback()
            },

            render: function(){
                const { getFieldDecorator } = this.props.form;
                const { dataSource } = this.state;
                const preHeatProps = this.props.preHeatProps;
                const nodeList = preHeatProps.nodeList;
                //0:待预热 1:预热中 2:已完成 3:已暂停 4：暂停中
                var HorizontalForm = (
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem label={"名称"}>
                            {getFieldDecorator('preheatNames')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label={"节点"}>
                            {getFieldDecorator('nodeNames')(
                                <Select mode="multiple" allowClear={true} 
                                        style={{ width: 300 }} 
                                        labelInValue
                                        notFoundContent={nodeList.length == 0 ? <Spin size="small" /> : '请输入节点关键字'}
                                        filterOption={false}
                                        onSearch={$.proxy(this.handleSearch, this)} >
                                    {dataSource}         
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="状态">
                            {getFieldDecorator('preheatStatus', {
                                "initialValue": "all"
                            })(
                                <Select>
                                    <Option value="all">全部</Option>
                                    <Option value="0">待预热</Option>
                                    <Option value="1">预热中</Option>
                                    <Option value="3">已暂停</Option>
                                    <Option value="4">暂停中</Option>
                                    <Option value="2">已完成</Option>
                                </Select>)}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" icon="search">查询</Button>
                            <Button style={{ marginLeft: 8 }} icon="plus" onClick={this.onClickAddButton}>新建</Button>
                        </FormItem>
                    </Form>
                );

                return HorizontalForm
            }
        });

        var PreHeatManageList = React.createClass({
            componentDidMount: function(){
                require(['nodeManage.model'],function(NodeManageModel){
                    var nodeManageModel = new NodeManageModel();
                    nodeManageModel.on("get.node.success", $.proxy(this.onGetNodeListSuccess, this))
                    nodeManageModel.on("get.node.error", $.proxy(this.onGetNodeListError, this))
                    nodeManageModel.getNodeList({page: 1,count: 9999});
                }.bind(this));
            },

            getInitialState: function () {
                var defaultState = {
                    nodeList: [],
                    curViewsMark: "list",// list: 列表界面，add: 新建，edit: 编辑
                    breadcrumbTxt: ["预热刷新", "预热管理"]
                }
                return defaultState;
            },

            onGetNodeListSuccess: function(res){
                this.setState({
                    nodeList: res
                })
            },

            onGetNodeListError: function(error){
                var msg = error ? error.message : "获取节点信息失败!"
                Utility.alerts(msg);
                this.setState({
                    nodeList: []
                })
            },

            onClickAddCallback: function(){
                require(['preheatManage.edit.view'],function(PreheatManageEditView){
                    this.curView = (<PreheatManageEditView preHeatProps={this.preHeatProps} isEdit={false} />);
                    this.setState({
                        curViewsMark: "add",
                        breadcrumbTxt: ["预热管理", "新建"]
                    })
                }.bind(this));
            },

            onClickEditCallback: function(model){
                require(['preheatManage.edit.view'],function(PreheatManageEditView){
                    this.curView = (<PreheatManageEditView preHeatProps={this.preHeatProps} model={model} isEdit={true} />);
                    this.setState({
                        curViewsMark: "edit",
                        breadcrumbTxt: ["预热管理", "编辑"]
                    })
                }.bind(this));
            },

            onClickViewCallback: function(model){
                require(['preheatManage.edit.view'],function(PreheatManageEditView){
                    this.curView = (<PreheatManageEditView preHeatProps={this.preHeatProps} model={model} isEdit={true} isView={true} />);
                    this.setState({
                        curViewsMark: "view",
                        breadcrumbTxt: ["预热管理", "查看"]
                    })
                }.bind(this));
            },

            onClickCancelCallback: function(){
                this.setState({
                    curViewsMark: "list",
                    breadcrumbTxt: ["预热刷新", "预热管理"]
                })
            },

            render: function(){
                var WrappedSearchForm = Form.create()(SearchForm);

                this.queryCondition = {
                    "taskName": null,
                    "status": null,
                    "nodes": null,
                    "pageNo": 1,
                    "pageSize": 10
                }

                this.preHeatProps = {
                    collection: this.props.collection,
                    queryCondition: this.queryCondition,
                    nodeList: this.state.nodeList,
                    onClickAddCallback: $.proxy(this.onClickAddCallback, this),
                    onClickEditCallback: $.proxy(this.onClickEditCallback, this),
                    onClickCancelCallback: $.proxy(this.onClickCancelCallback, this),
                    onClickViewCallback: $.proxy(this.onClickViewCallback, this)
                }

                var curView = null;
                if (this.state.curViewsMark == "list") {
                    curView = (
                        <div>
                            <WrappedSearchForm preHeatProps={this.preHeatProps} />
                            <hr/>
                            <Alert style={{ marginBottom: '20px' }} message="回源带宽、预热节点、进度展示当前执行批次信息，文件数、状态、成功率为当前任务整体信息" type="info" showIcon />
                            <PreHeatTable preHeatProps={this.preHeatProps} />
                        </div>
                    )
                } else if (this.state.curViewsMark == "add" ||
                           this.state.curViewsMark == "edit" ||
                           this.state.curViewsMark == "view" ) {
                    curView = this.curView;
                }

                return (     
                    <Layout>
                        <Content>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>{this.state.breadcrumbTxt[0]}</Breadcrumb.Item>
                                <Breadcrumb.Item>{this.state.breadcrumbTxt[1]}</Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                                {curView}
                            </div>
                        </Content>
                    </Layout>
                )
            }
        });

        var PreheatManageView = BaseView.extend({
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template('<div class="preheat-manage"></div>')());

                var preHeatManageListFac = React.createFactory(PreHeatManageList);
                var preHeatManageList = preHeatManageListFac({
                    collection: this.collection
                });
                ReactDOM.render(preHeatManageList, this.$el.get(0));
            }
        })
        return PreheatManageView;
    }
);