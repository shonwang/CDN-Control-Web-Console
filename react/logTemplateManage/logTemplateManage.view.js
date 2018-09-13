define("logTemplateManage.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], 
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
            DatePicker = Antd.DatePicker,
            TimePicker = Antd.TimePicker,
            RangePicker = DatePicker.RangePicker,
            message = Antd.message,
            Modal = Antd.Modal,
            confirm = Modal.confirm,
            Tag = Antd.Tag;

        class LogTemplateTable extends React.Component {
            constructor(props, context) {
                super(props);
                this.onChangePage = this.onChangePage.bind(this);
                this.handleEditClick = this.handleEditClick.bind(this);
                this.handleDeleteClick = this.handleDeleteClick.bind(this);
                this.handleHistoryClick = this.handleHistoryClick.bind(this);
                
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
                collection.on("get.templateList.success", $.proxy(this.onTemplateListSuccess, this));
                collection.on("get.templateList.error", $.proxy(this.onGetError, this));
                collection.on("fetching", $.proxy(this.onFetchingTemplateList, this));   
                collection.trigger("fetching", queryCondition);
                collection.on("template.used.success", $.proxy(this.onCheckTplIsUsedSuccess, this));
                collection.on("template.used.error", $.proxy(this.onOperateError, this));
                collection.on("delete.template.success", $.proxy(this.onGetOperateSuccess, this, "删除"));
                collection.on("delete.template.error", $.proxy(this.onOperateError, this));
            }

            componentWillUnmount() {
                var collection = this.props.ltProps.collection;
                collection.off("get.templateList.success");
                collection.off("get.templateList.error");
                collection.off("fetching");
                collection.off("template.used.success");
                collection.off("template.used.error");
                collection.off("delete.template.success");
                collection.off("delete.template.error");    
            }

            onCheckTplIsUsedSuccess (res) {
                var collection = this.props.ltProps.collection;
                if (res.used) {
                    message.warning('有' + res.taskCount + '个任务正在使用此模板，请先停掉任务，再删除！', 5);
                } else {
                    confirm({
                        title: '你确定要删除吗？',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '算了，不删了',
                        onOk: function(){
                            collection.deleteTemplate({groupId: this.curDeleteGroupId})
                        }.bind(this)
                    });
                }
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
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }

            onFetchingTemplateList(queryCondition){
                var collection = this.props.ltProps.collection;
                this.setState({
                    isFetching: true
                })
                collection.getTemplateList(queryCondition)
            }

            onTemplateListSuccess() {
                var data = [];
                this.props.ltProps.collection.each((model) => {
                    var obj = Object.assign({}, model.attributes);
                    data.push(obj)
                })
                this.setState({
                    data: data,
                    isFetching: false
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

            handleHistoryClick(event) {
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
                var onClickHistoryCallback = this.props.ltProps.onClickHistoryCallback;
                onClickHistoryCallback&&onClickHistoryCallback(model)
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
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection;
                collection.isTemplateUsed({groupId: id});
                this.curDeleteGroupId = id;
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
                var onClickEditCallback = this.props.ltProps.onClickEditCallback;
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
                var onClickViewCallback = this.props.ltProps.onClickViewCallback;
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
                    title: '模版ID',
                    dataIndex: 'id',
                    key: 'id'
                },{
                    title: '模版名称',
                    dataIndex: 'name',
                    key: 'name'
                },{
                    title: '产品线标识',
                    dataIndex: 'productType',
                    key: 'productType',
                    render: (text, record) => {
                        var tag = null;
                        if (record.productType == 'LIVE')
                            tag = (<Tag color={"green"}>直播</Tag>)
                        else if (record.status == 'DOWNLOAD')
                            tag = (<Tag color={"blue"}>下载</Tag>)
                        else
                            tag = (<Tag color={"red"}>未知</Tag>)
                        return tag
                    }
                },{
                    title: '创建人',
                    dataIndex: 'creator',
                    key: 'creator'
                },{
                    title: '创建时间',
                    dataIndex: 'createTimeFormated',
                    key: 'createTimeFormated'
                },{
                    title: '修改时间',
                    dataIndex: 'updateTimeFormated',
                    key: 'updateTimeFormated'
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
                        var detailButton = (
                            <Tooltip placement="bottom" title={"查看详情"}>
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleViewClick(e)}>
                                    <Icon type="profile" />
                                </a>
                            </Tooltip>
                        );
                        var deleteButton = (
                            <Tooltip placement="bottom" title={"删除"}>
                                <a href="javascript:void(0)" id={record.groupId} onClick={(e) => this.handleDeleteClick(e)}>
                                    <Icon type="delete" />
                                </a>
                            </Tooltip>
                        )
                        var historyButton = (
                            <Tooltip placement="bottom" title={"历史记录"}>
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleHistoryClick(e)}>
                                    <Icon type="clock-circle" />
                                </a>
                            </Tooltip>
                        )
                        var buttonGroup = (
                                <div>
                                    {editButton}
                                    <span className="ant-divider" />
                                    {detailButton}
                                    <span className="ant-divider" />
                                    {deleteButton}
                                    <span className="ant-divider" />
                                    {historyButton}
                                </div>
                            )
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
                e.preventDefault();
                var fieldsValue = this.props.form.getFieldsValue(),
                    ltProps = this.props.ltProps;
                var collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                queryCondition.name = fieldsValue.templateName || null;
                if (fieldsValue.time) {
                    queryCondition.startTime = fieldsValue.time[0].valueOf();
                    queryCondition.endTime = fieldsValue.time[1].valueOf();
                } else {
                    queryCondition.startTime = null;
                    queryCondition.endTime = null;
                }
                console.log(queryCondition)
                collection.trigger("fetching", queryCondition)
            }

            onClickAddButton(){
                var onClickAddCallback = this.props.ltProps.onClickAddCallback;
                onClickAddCallback&&onClickAddCallback()
            }

            render(){
                const { getFieldDecorator } = this.props.form;
                const { dataSource } = this.state;
                const ltProps = this.props.ltProps;

                var HorizontalForm = (
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem label={"模版名称"}>
                            {getFieldDecorator('templateName')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="时间">
                            {getFieldDecorator('time')(
                                <RangePicker showTime={{ format: 'HH:mm', minuteStep: 30 }} 
                                            format="YYYY/MM/DD HH:mm" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" icon="search">查询</Button>
                            <Button style={{ marginLeft: 8 }} icon="plus" onClick={this.onClickAddButton}>新建</Button>
                        </FormItem>
                    </Form>
                );

                return HorizontalForm
            }
        }

        class LogTemplateManageList extends React.Component {
            constructor(props, context) {
                super(props);
                this.state = {
                    curViewsMark: "list",// list: 列表界面，add: 新建，edit: 编辑
                    breadcrumbTxt: ["日志管理", "模版管理"]
                }
            }

            componentDidMount(){}

            onClickAddCallback(){
                require(['logTemplateManage.edit.view'], function(LogTemplateManageView){
                    this.curView = (<LogTemplateManageView ltProps={this.ltProps} isEdit={false} />);
                    this.setState({
                        curViewsMark: "add",
                        breadcrumbTxt: ["模版管理", "新建"]
                    })
                }.bind(this));
            }

            onClickEditCallback(model){
                require(['logTemplateManage.edit.view'], function(LogTemplateManageView){
                    this.curView = (<LogTemplateManageView ltProps={this.ltProps} model={model} isEdit={true} />);
                    this.setState({
                        curViewsMark: "edit",
                        breadcrumbTxt: ["模版管理", "编辑"]
                    })
                }.bind(this));
            }

            onClickViewCallback(model, backTarget){
                require(['logTemplateManage.edit.view'], function(LogTemplateManageView){
                    this.curView = (<LogTemplateManageView ltProps={this.ltProps} model={model} isEdit={true} isView={true} backTarget={backTarget}/>);
                    this.setState({
                        curViewsMark: "view",
                        breadcrumbTxt: ["模版管理", "查看"]
                    })
                }.bind(this));
            }

            onClickCancelCallback(){
                this.setState({
                    curViewsMark: "list",
                    breadcrumbTxt: ["日志管理", "模版管理"]
                })
            }

            onClickHistoryCallback(model){
                require(['logTemplateManage.history.view'],function(LogTemplateManageView){
                    this.curView = (<LogTemplateManageView ltProps={this.ltProps} model={model} isEdit={true} />);
                    this.setState({
                        curViewsMark: "history",
                        breadcrumbTxt: ["模版管理", "历史记录"]
                    })
                }.bind(this));
            }

            render(){
                var WrappedSearchForm = Form.create()(SearchForm);

                this.queryCondition = {
                    "name": null,
                    "startTime": null,
                    "endTime": null,
                    "page": 1,
                    "size": 10,
                }

                this.ltProps = {
                    collection: this.props.collection,
                    queryCondition: this.queryCondition,
                    onClickAddCallback: $.proxy(this.onClickAddCallback, this),
                    onClickEditCallback: $.proxy(this.onClickEditCallback, this),
                    onClickCancelCallback: $.proxy(this.onClickCancelCallback, this),
                    onClickViewCallback: $.proxy(this.onClickViewCallback, this),
                    onClickHistoryCallback: $.proxy(this.onClickHistoryCallback, this)
                }

                var curView = null;
                if (this.state.curViewsMark == "list") {
                    curView = (
                        <div>
                            <WrappedSearchForm ltProps={this.ltProps} />
                            <hr/>
                            <LogTemplateTable ltProps={this.ltProps} />
                        </div>
                    )
                } else if (this.state.curViewsMark == "add" ||
                           this.state.curViewsMark == "edit" ||
                           this.state.curViewsMark == "view" ||
                           this.state.curViewsMark == "history" ) {
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

        var LogTemplateManageView = BaseView.extend({
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template('<div class="log-manage"></div>')());

                var logTemplateListFactory = React.createFactory(LogTemplateManageList);
                var logTemplateList = logTemplateListFactory({
                    collection: this.collection
                });
                ReactDOM.render(logTemplateList, this.$el.get(0));
            }
        })
        return LogTemplateManageView;
    }
);