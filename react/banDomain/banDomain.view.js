define("banDomain.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], 
    function(require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

        var Layout = Antd.Layout,
            Content = Layout.Content,
            Breadcrumb = Antd.Breadcrumb,
            Button = Antd.Button,
            Input = Antd.Input,
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
            DatePicker = Antd.DatePicker,
            RangePicker = DatePicker.RangePicker,
            confirm = Modal.confirm,
            Select = Antd.Select, 
            Option = Select.Option;

        class BanDomainManageTable extends React.Component {
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

        class BanDomainManageList extends React.Component {
            constructor(props, context) {
                super(props);
                this.handleSubmit = this.handleSubmit.bind(this);
                this.state = {
                    modalVisible: false
                }

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
                    queryCondition: this.queryCondition
                }
            }

            componentDidMount(){}

            handleSubmit(e){
                e&&e.preventDefault();
                const { validateFields } = this.props.form;

                validateFields(["accountId"], function(err, vals) {
                    if (!err) {
                        var fieldsValue = this.props.form.getFieldsValue();
                        var collection = this.props.collection,
                            queryCondition = this.queryCondition;
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
                this.setState({
                    modalVisible: true
                })
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

            renderAddDomainView() {
                const { getFieldDecorator } = this.props.form;
                // const formItemLayout = {
                //     labelCol: { span: 6 },
                //     wrapperCol: { span: 12 }
                // };
                var HorizontalForm = (
                    <Form>
                        <FormItem label={"域名"} require={true}>
                            {getFieldDecorator('domain',{
                                    rules: [
                                        { validator: $.proxy(this.validateDomainList, this) },
                                    ],
                                })(
                                <Input.TextArea rows={4} />
                            )}
                        </FormItem>
                        <FormItem label={"备注"}>
                            {getFieldDecorator('remark',{
                                    rules: [
                                        { max: 300, message: '备注文本域用于录入备注信息，长度不大于300个字符' },
                                    ],
                                })(
                                <Input.TextArea rows={4} />
                            )}
                        </FormItem>
                    </Form>
                );
                return HorizontalForm
            }

            validateDomainList(rule, value, callback) {
                var domainArray = null, count = 0;
                if (value.indexOf("\n") > -1) {
                    domainArray = value.split("\n");
                    if (domainArray.length > 50) {
                        callback("每次最多录入50条");
                        return;
                    }
                    for(var i = 0; i < domainArray.length; i++) {
                        if (!Utility.isDomain(domainArray[i])){
                            if (domainArray[i] != "")
                                callback("第" + (i + 1) + "行域名输入有误");
                            else
                                callback("第" + (i + 1) + "行没有输入任何字符，请输入正确的域名否则不要换行");
                            break;
                        }  else {
                            count = count + 1
                        }
                    }
                    if (count == domainArray.length) {
                        callback();
                    }
                } else if (Utility.isDomain(value)){
                    callback();
                } else {
                    callback("请输入正确的域名");
                }
            }

            handleModalOk() {
                this.setState({
                    modalVisible: false
                })
            }

            handleModalCancel() {
                this.setState({
                    modalVisible: false
                })
            }

            render(){
                const { getFieldDecorator } = this.props.form;
                var AddForm = this.renderAddDomainView();

                var SearchForm = (
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem label={"域名"}>
                            {getFieldDecorator('name')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label={"客户ID"}>
                            {getFieldDecorator('accountId',{
                                    rules: [
                                        { pattern: /^[0-9]+$/, message: '客户ID只能输入数字!' },
                                    ],
                                })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label={"客户名称"}>
                            {getFieldDecorator('templateName')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label={"时间"}>
                            {getFieldDecorator('rangeTimePicker')(
                                <RangePicker showTime={{ format: 'HH:mm', minuteStep: 30 }} 
                                            format="YYYY/MM/DD HH:mm" 
                                            disabledDate={this.disabledDate}
                                            disabledTime={this.disabledTime} />
                            )}
                        </FormItem>
                        <FormItem label={"业务类型"}>
                            {getFieldDecorator('backUrl',{
                                initialValue: 0,
                            })(
                                <Select style={{ width: 120 }}>
                                    <Option value={0}>全部</Option>
                                    <Option value={1}>点播</Option>
                                    <Option value={2}>下载</Option>
                                    <Option value={3}>流媒体直播</Option>
                                    <Option value={4}>页面小文件</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={"状态"}>
                            {getFieldDecorator('backUrl1',{
                                initialValue: 0,
                            })(
                                <Select style={{ width: 120 }}>
                                    <Option value={0}>全部</Option>
                                    <Option value={1}>等待封禁</Option>
                                    <Option value={2}>已封禁</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" icon="search">查询</Button>
                            <Button style={{ marginLeft: 8 }} icon="plus" onClick={$.proxy(this.onClickAddButton, this)}>新增域名封禁</Button>
                            <Button style={{ marginLeft: 8,display:"none" }} icon="reload" onClick={$.proxy(this.onClickResetButton, this)}>重置</Button>
                            <Modal title={'新增域名封禁'}
                                   destroyOnClose={true}
                                   visible={this.state.modalVisible}
                                   onOk={$.proxy(this.handleModalOk, this)}
                                   onCancel={$.proxy(this.handleModalCancel, this)}>
                                   {AddForm}
                            </Modal>
                        </FormItem>
                    </Form>
                );

                return (     
                    <Layout>
                        <Content>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>{"域名设置"}</Breadcrumb.Item>
                                <Breadcrumb.Item>{"域名封禁"}</Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                                {SearchForm}
                                <hr />
                                <BanDomainManageTable ltProps={this.ltProps} />
                            </div>
                        </Content>
                    </Layout>
                )
            }
        }

        var WrappedSearchForm = Form.create()(BanDomainManageList);

        var BanDomainManageView = BaseView.extend({
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template('<div class="log-manage"></div>')());

                var banDomainListFactory = React.createFactory(WrappedSearchForm);
                var banDomainList = banDomainListFactory({
                    collection: this.collection
                });
                ReactDOM.render(banDomainList, this.$el.get(0));
            }
        })
        return BanDomainManageView;
    }
);