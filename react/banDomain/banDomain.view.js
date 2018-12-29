define("banDomain.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], 
    function(require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

        var Layout = Antd.Layout,
            Content = Layout.Content,
            Breadcrumb = Antd.Breadcrumb,
            Button = Antd.Button,
            Input = Antd.Input,
            InputNumber = Antd.InputNumber,
            Form = Antd.Form,
            FormItem = Form.Item,
            Table = Antd.Table,
            Alert = Antd.Alert,
            Icon = Antd.Icon,
            Spin = Antd.Spin,
            Tooltip = Antd.Tooltip,
            Col = Antd.Col,
            Row = Antd.Row,
            message = Antd.message,
            Modal = Antd.Modal,
            Tag = Antd.Tag,
            confirm = Modal.confirm;

        class LogTaskListTable extends React.Component {
            constructor(props, context) {
                super(props);
                this.onChangePage = this.onChangePage.bind(this);
                this.handleStopClick = this.handleStopClick.bind(this);
                this.handleDeleteClick = this.handleDeleteClick.bind(this);
                
                this.state = {
                    data: [],
                    isError: false,
                    isFetching: true
                };
            }

            componentDidMount() {
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                collection.on("get.taskList.success", $.proxy(this.onTaskListSuccess, this));
                collection.on("get.taskList.error", $.proxy(this.onGetError, this));
                collection.on("fetching", $.proxy(this.onFetchingTaskList, this));   
                collection.trigger("fetching", queryCondition);
                collection.on("delete.task.success", $.proxy(this.onGetOperateSuccess, this, "删除"));
                collection.on("delete.task.error", $.proxy(this.onOperateError, this));
                collection.on("stop.task.success", $.proxy(this.onGetOperateSuccess, this, "停止"));
                collection.on("stop.task.error", $.proxy(this.onOperateError, this));
            }

            componentWillUnmount() {
                var collection = this.props.ltProps.collection;
                collection.off("get.taskList.success");
                collection.off("get.taskList.error");
                collection.off("fetching");
                collection.off("delete.task.success");
                collection.off("delete.task.error");
                collection.off("stop.task.success");
                collection.off("stop.task.error");    
            }

            onCheckTplIsUsedSuccess (res) {
                if (res.used)
                    message.warning('有' + res.taskCount + '个任务正在使用此模板，请先停掉任务，再删除！', 5);
            }

            onGetOperateSuccess(msg){
                Utility.alerts(msg + "成功!", "success", 2000);
                const ltProps = this.props.ltProps;
                const { collection, queryCondition } = ltProps;
                collection.trigger("fetching", queryCondition);
            }

            onOperateError(error){
                if (error && error.message)
                    Utility.alerts(error.message);
                else if (error && error.Error && error.Error.Message)
                    Utility.alerts(error.Error.Message);
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }

            onFetchingTaskList(queryCondition){
                var collection = this.props.ltProps.collection;
                this.setState({
                    isFetching: true
                })
                collection.getTaskList(queryCondition)
            }

            onTaskListSuccess() {
                var data = [];
                this.props.ltProps.collection.each((model) => {
                    var obj = Object.assign({}, model.attributes);
                    data.push(obj)
                })
                this.setState({
                    data: data,
                    isFetching: false,
                    isError: false
                })
            }

            onChangePage(page, pageSize){
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                queryCondition.page = page;
                queryCondition.size = pageSize;
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

                var model = _.find(this.state.data, function(obj){
                        return obj.id == id
                }.bind(this))
                if (model.taskStatus == "RUNNING") {
                    message.warning('请先停掉任务，再删除！', 5);
                    return;
                }
                confirm({
                    title: '你确定要删除吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '算了，不删了',
                    onOk: function(){
                        var ltProps = this.props.ltProps;
                        var collection = ltProps.collection;
                        collection.deleteTask({id: id});
                    }.bind(this)
                  });
            }

            handleStopClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                confirm({
                    title: '你确定要停止吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '算了，不停了',
                    onOk: function(){
                        var ltProps = this.props.ltProps;
                        var collection = ltProps.collection;
                        collection.stopTask({id: id});
                    }.bind(this)
                  });
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
                var onClickViewCallback = this.props.ltProps.onClickViewCallback;
                onClickViewCallback&&onClickViewCallback(model)
            }

            onGetError(error) {
                var msgDes = "服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！"
                if (error && error.message)
                    msgDes = error.message;
                else if (error && error.Error && error.Error.Message)
                    msgDes = error.Error.Message;

                this.errorView = (
                    <Alert
                        message="出错了"
                        description={msgDes}
                        type="error"
                        showIcon
                    />
                );

                this.setState({
                    isError: true,
                    isFetching: false
                })
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
                    title: '任务名称',
                    dataIndex: 'name',
                    key: 'name'
                },{
                    title: '客户ID',
                    dataIndex: 'accountId',
                    key: 'accountId'
                },{
                    title: '模板名称',
                    dataIndex: 'templateName',
                    key: 'templateName'
                },{
                    title: '回传地址',
                    dataIndex: 'backUrl',
                    key: 'backUrl'
                },{
                    title: '任务启动时间',
                    dataIndex: 'createTimeFormated',
                    key: 'createTimeFormated'
                },{
                    title: '任务状态',
                    dataIndex: 'taskStatus',
                    key: 'taskStatus',
                    render: (text, record) => {
                        var tag = null;
                        if (record.taskStatus == "STOPPED")
                            tag = (<Tag color={"red"}>已停止</Tag>)
                        else if (record.taskStatus == "RUNNING")
                            tag = <Tag color={"green"}>运行中</Tag>
                        return tag
                    }
                },{
                    title: '创建者',
                    dataIndex: 'creator',
                    key: 'creator'
                },{
                    title: '操作',
                    dataIndex: '',
                    key: 'action',
                    render: (text, record) => {
                        var detailButton = (
                            <Tooltip placement="bottom" title={"查看详情"}>
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleViewClick(e)}>
                                    <Icon type="profile" />
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
                        var stopButton = (
                            <Tooltip placement="bottom" title={"停止"}>
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleStopClick(e)}>
                                    <Icon type="poweroff" />
                                </a>
                            </Tooltip>
                        );
                        var buttonGroup = "";
                        if (record.taskStatus == "RUNNING"){
                            buttonGroup = (
                                <div>
                                    {detailButton}
                                    <span className="ant-divider" />
                                    {stopButton}
                                    <span className="ant-divider" />
                                    {deleteButton}
                                </div>
                            )
                        } else {
                            buttonGroup = (
                                <div>
                                    {detailButton}
                                    <span className="ant-divider" />
                                    {deleteButton}
                                </div>
                            )
                        }
                        return buttonGroup
                    },
                }];
                var ltProps = this.props.ltProps;
                var pagination = {
                    showSizeChanger: true,
                    showQuickJumper: true,
                        showTotal: function showTotal(total) {
                        return 'Total '+ total + ' items';
                    },
                    current: ltProps.queryCondition.page,
                    total: ltProps.collection.total,
                    onChange: this.onChangePage,
                    onShowSizeChange: this.onChangePage
                }

                return ( <Table rowKey="id" 
                                dataSource={this.state.data} 
                                loading={this.state.isFetching} 
                                columns={columns}
                                pagination = {pagination} /> )
            }
        }    

        class SearchForm extends React.Component {

            constructor(props, context) {
                super(props);
                this.onClickAddButton = this.onClickAddButton.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
                this.state = {}
            }

            handleSubmit(e){
                e&&e.preventDefault();
                const { validateFields } = this.props.form;

                validateFields(["accountId"], function(err, vals) {
                    if (!err) {
                        var fieldsValue = this.props.form.getFieldsValue(),
                            ltProps = this.props.ltProps;
                        var collection = ltProps.collection,
                            queryCondition = ltProps.queryCondition;
                        queryCondition.name = fieldsValue.name || null;
                        //queryCondition.domain = fieldsValue.domain || null;
                        queryCondition.templateName = fieldsValue.templateName || null;
                        queryCondition.accountId = fieldsValue.accountId || null;
                        queryCondition.backUrl = fieldsValue.backUrl || null;
                        console.log(queryCondition)
                        collection.trigger("fetching", queryCondition)
                    }
                }.bind(this))
            }

            onClickAddButton(){
                var onClickAddCallback = this.props.ltProps.onClickAddCallback;
                onClickAddCallback&&onClickAddCallback()
            }

            onClickResetButton() {
                const { setFieldsValue } = this.props.form;
                setFieldsValue({"name": null})
                setFieldsValue({"domain": null})
                setFieldsValue({"templateName": null})
                setFieldsValue({"accountId": null})
                setFieldsValue({"backUrl": null})
                this.handleSubmit();
            }

            render(){
                const { getFieldDecorator } = this.props.form;
                const { dataSource } = this.state;
                const ltProps = this.props.ltProps;
                const formItemLayout = {
                  labelCol: { span: 6 },
                  wrapperCol: { span: 12 },
                };

                var HorizontalForm = (
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={"任务名称"}>
                                    {getFieldDecorator('name')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} style={{display:"none"}}>
                                <FormItem {...formItemLayout} label={"域名"}>
                                    {getFieldDecorator('domain')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={"模版名称"}>
                                    {getFieldDecorator('templateName')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={"客户ID"}>
                                    {getFieldDecorator('accountId',{
                                            rules: [
                                                { pattern: /^[0-9]+$/, message: '客户ID只能输入数字!' },
                                            ],
                                        })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={"回传地址"}>
                                    {getFieldDecorator('backUrl')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" icon="search">查询</Button>
                                    <Button style={{ marginLeft: 8 }} icon="plus" onClick={this.onClickAddButton}>新建</Button>
                                    <Button style={{ marginLeft: 8 }} icon="reload" onClick={$.proxy(this.onClickResetButton, this)}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                );

                return HorizontalForm
            }
        }

        class LogTaskListManageList extends React.Component {
            constructor(props, context) {
                super(props);
                this.state = {
                    curViewsMark: "list",// list: 列表界面，add: 新建，edit: 编辑
                    breadcrumbTxt: ["日志管理", "任务管理"]
                }
            }

            componentDidMount(){}

            onClickAddCallback(){
                require(['logTaskList.edit.view'], function(LogTaskListManageView){
                    this.curView = (<LogTaskListManageView ltProps={this.ltProps} isEdit={false} />);
                    this.setState({
                        curViewsMark: "add",
                        breadcrumbTxt: ["任务管理", "新建"]
                    })
                }.bind(this));
            }

            onClickEditCallback(model){
                require(['logTaskList.edit.view'], function(LogTaskListManageView){
                    this.curView = (<LogTaskListManageView ltProps={this.ltProps} model={model} isEdit={true} />);
                    this.setState({
                        curViewsMark: "edit",
                        breadcrumbTxt: ["任务管理", "编辑"]
                    })
                }.bind(this));
            }

            onClickViewCallback(model, backTarget){
                require(['logTaskList.edit.view'], function(LogTaskListManageView){
                    this.curView = (<LogTaskListManageView ltProps={this.ltProps} model={model} isEdit={true} isView={true}/>);
                    this.setState({
                        curViewsMark: "view",
                        breadcrumbTxt: ["任务管理", "查看"]
                    })
                }.bind(this));
            }

            onClickCancelCallback(){
                this.setState({
                    curViewsMark: "list",
                    breadcrumbTxt: ["日志管理", "任务管理"]
                })
            }

            render(){
                var WrappedSearchForm = Form.create()(SearchForm);

                this.queryCondition = {
                    "name": null,
                    //"domain": null,
                    "templateName": null,
                    "accountId": null,
                    "backUrl": null,
                    "page": 1,
                    "size": 10,
                }

                this.ltProps = {
                    collection: this.props.collection,
                    queryCondition: this.queryCondition,
                    onClickAddCallback: $.proxy(this.onClickAddCallback, this),
                    onClickEditCallback: $.proxy(this.onClickEditCallback, this),
                    onClickCancelCallback: $.proxy(this.onClickCancelCallback, this),
                    onClickViewCallback: $.proxy(this.onClickViewCallback, this)
                }

                var curView = null;
                if (this.state.curViewsMark == "list") {
                    curView = (
                        <div>
                            <WrappedSearchForm ltProps={this.ltProps} />
                            <hr/>
                            <LogTaskListTable ltProps={this.ltProps} />
                        </div>
                    )
                } else if (this.state.curViewsMark == "add" ||
                           this.state.curViewsMark == "edit" ||
                           this.state.curViewsMark == "view") {
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
        }

        var BanDomainManageView = BaseView.extend({
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template('<div class="log-manage"></div>')());

                var banDomainListFactory = React.createFactory(BanDomainManageList);
                var banDomainList = banDomainListFactory({
                    collection: this.collection
                });
                ReactDOM.render(banDomainList, this.$el.get(0));
            }
        })
        return BanDomainManageView;
    }
);