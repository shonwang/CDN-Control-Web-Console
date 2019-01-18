define("banDomain.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom", "moment"], 
    function(require, exports, template, BaseView, Utility, Antd, React, ReactDOM, moment) {

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
            message = Antd.message,
            Modal = Antd.Modal,
            Tag = Antd.Tag,
            DatePicker = Antd.DatePicker,
            RangePicker = DatePicker.RangePicker,
            confirm = Modal.confirm,
            Select = Antd.Select, 
            Option = Select.Option,
            Menu = Antd.Menu,
            Dropdown = Antd.Dropdown,
            Timeline = Antd.Timeline,
            LocaleProvider = Antd.LocaleProvider,
            locales = Antd.locales;
            moment.locale('zh-cn');

        class BanDomainManageTable extends React.Component {
            constructor(props, context) {
                super(props);
                this.onChangePage = this.onChangePage.bind(this);
                this.handleBanClick = this.handleBanClick.bind(this);
                this.handleRelieveClick = this.handleRelieveClick.bind(this);
                this.handleOpRecordClick = this.handleOpRecordClick.bind(this);
                
                this.state = {
                    data: [],
                    isError: false,
                    isFetching: true,
                    modalVisible: false,
                    recordModalVisible: false,
                    isOpRecordFetching: true,
                    warnTime: moment().add(1,'day')
                };

                this.opRecordView = (<Spin />);
            }

            componentDidMount() {
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection,
                    queryCondition = ltProps.queryCondition;
                collection.on("get.taskList.success", $.proxy(this.onTaskListSuccess, this));
                collection.on("get.taskList.error", $.proxy(this.onGetError, this));
                collection.on("fetching", $.proxy(this.onFetchingTaskList, this));   
                collection.trigger("fetching", queryCondition);
                collection.on("task.detail.success", $.proxy(this.onGetOpDetailSuccess, this));
                collection.on("task.detail.error", $.proxy(this.onOperateError, this));
                collection.on("delete.task.success", $.proxy(this.onGetOperateSuccess, this, "解封"));
                collection.on("delete.task.error", $.proxy(this.onOperateError, this));
                collection.on("reminder.domain.success", $.proxy(this.onGetOperateSuccess, this, "不再提醒设置成功"));
                collection.on("reminder.domain.error", $.proxy(this.onOperateError, this));
            }

            componentWillUnmount() {
                var collection = this.props.ltProps.collection;
                collection.off("get.taskList.success");
                collection.off("get.taskList.error");
                collection.off("fetching");
                collection.off("task.detail.success");
                collection.off("task.detail.error");
                collection.off("add.task.success");
                collection.off("delete.task.success");
                collection.off("delete.task.error");
                collection.off("reminder.domain.success");
                collection.off("reminder.domain.error");    
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

            handleOpRecordClick(id) {
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection;

                collection.getTaskDetail({
                    originId: id
                });
                this.setState({
                    recordModalVisible: true,
                    isOpRecordFetching: true
                })
            }

            onGetOpDetailSuccess(res){
                if (res&&res.log){
                    let items = res.log.map(function(el, index){
                        return ( <Timeline.Item key={index}>{el}</Timeline.Item> )
                    })
                    this.opRecordView = (<Timeline>{items}</Timeline>)
                    this.setState({
                        isOpRecordFetching: false
                    })
                }
            }

            handleRelieveClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                confirm({
                    title: '你确定要解封吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: function(){
                        var ltProps = this.props.ltProps;
                        var collection = ltProps.collection;
                        collection.deleteTask({
                            "originId": id,
                        });
                    }.bind(this)
                  });
            }

            handleBanClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                var model = _.find(this.state.data, function(obj){
                        return obj.id == id
                    }.bind(this))
                confirm({
                    title: '你确定要封禁吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: function(){
                        var ltProps = this.props.ltProps;
                        var collection = ltProps.collection;
                        collection.addTask({
                            "domains": model.domain,
                        });
                    }.bind(this)
                  });
            }

            handleMenuClick(obj) {
                if (obj.key == 1) {
                    this.handleNoAlertViewClick(obj.item.props.id)
                } else if (obj.key == 2) {
                    this.handleOpRecordClick(obj.item.props.id)
                }
            }

            handleNoAlertViewClick(id) {
                this.curModel = _.find(this.state.data, function(obj){
                        return obj.id == id
                    }.bind(this))
                this.setState({
                    modalVisible: true,
                    warnTime: this.curModel.warnTime ? moment(this.curModel.warnTime) : moment().add(1,'day')
                })
            }

            onClickDays(days) {
                const { setFieldsValue } = this.props.form;
                let warnTime = moment().add(days, 'days');
                setFieldsValue({"warnTime": warnTime})
            }

            disabledDate(current) {
                return current && (current < moment().add(-1,'day') || current > moment().add(31,'day'))
            }

            renderNoAlertView() {
                const { getFieldDecorator } = this.props.form;
                const formItemLayout = {
                  labelCol: { span: 6 },
                  wrapperCol: { span: 14 },
                };
                let view = (
                        <Form>
                            <FormItem {...formItemLayout} label={"现在是"} style={{display:"none"}}>
                                <span className="ant-form-text">{new Date().format("yyyy/MM/dd hh:mm:ss")}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="快速选择">
                                <Button.Group>
                                    <Button onClick={$.proxy(this.onClickDays, this, 3)}>近三天</Button>
                                    <Button onClick={$.proxy(this.onClickDays, this, 7)}>近七天</Button>
                                    <Button onClick={$.proxy(this.onClickDays, this, 30)}>近三十天</Button>
                                </Button.Group>
                            </FormItem>
                            <FormItem {...formItemLayout} label={"自定义"}>
                                {getFieldDecorator('warnTime', {
                                    initialValue: this.state.warnTime
                                })(
                                    <DatePicker showTime={{ format: 'HH:mm:ss', minuteStep: 1 }} 
                                                format="YYYY/MM/DD HH:mm:ss"
                                                disabledDate={this.disabledDate} 
                                                style={{width:"200px"}} />
                                )}
                            </FormItem>
                        </Form>  
                    )

                return view
            }

            handleModalOk() {
                const { validateFields } = this.props.form;
                
                validateFields(["warnTime"], function(err, vals) {
                    if (!err) {
                        var collection = this.props.ltProps.collection;
                        collection.reminderDomain({
                            "domain": this.curModel.domain,
                            "remaindTime": vals.warnTime.valueOf()
                        })
                        this.setState({
                            modalVisible: false
                        })
                    }
                }.bind(this))
            }

            handleModalRecordCancel() {
                this.setState({
                    recordModalVisible: false
                })
            }

            handleModalCancel() {
                this.setState({
                    modalVisible: false
                })
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
                    title: '域名',
                    dataIndex: 'domain',
                    key: 'domain',
                    fixed: 'left',
                    width: 200,
                },{
                    title: '客户名称',
                    dataIndex: 'companyName',
                    key: 'companyName'
                },{
                    title: '封禁来源',
                    dataIndex: 'comeFrom',
                    key: 'comeFrom',
                    render: (text, record) => {
                        let val = "-";
                        if (text == 1) {
                            val = "中控"
                        } else if (text == 2) {
                            val = "API"
                        } else if (text == 3) {
                            val = "系统扫描"
                        }
                        return val
                    }
                },{
                    title: '任务状态',
                    dataIndex: 'blockStatus',
                    key: 'blockStatus',
                    render: (text, record) => {
                        var tag = null;
                        if (record.blockStatus == 2)
                            tag = (<Tag color={"red"}>已封禁</Tag>)
                        else if (record.blockStatus == 5)
                            tag = <Tag color={"green"}>未封禁</Tag>
                        return tag
                    }
                },{
                    title: '操作人',
                    dataIndex: 'operator',
                    key: 'operator'
                },{
                    title: '提醒时间',
                    dataIndex: 'warnTime',
                    key: 'warnTime',
                    render: (text, record) => {
                        var str = "未设置"
                        if (text)
                            str = new Date(text).format("yyyy/MM/dd hh:mm:ss")
                        return str
                    }
                },{
                    title: '最后修改时间',
                    dataIndex: 'operateTime',
                    key: 'operateTime',
                    render: (text, record) => (new Date(text).format("yyyy/MM/dd hh:mm:ss"))
                },{
                    title: '操作',
                    dataIndex: '',
                    key: 'action',
                    fixed: 'right',
                    width: 200,
                    render: (text, record) => {
                        let noAlertButton = (
                                <Button size={"small"} id={record.id} onClick={(e) => this.handleNoAlertViewClick(e)}>不再提醒</Button>
                        );
                        let opRecordButton = (
                                <Button size={"small"} id={record.id} onClick={(e) => this.handleOpRecordClick(e)}>操作记录</Button>
                        )
                        let relieveButton = (
                                <Button type="primary" size={"small"} id={record.id} onClick={(e) => this.handleRelieveClick(e)}>解封</Button>
                        );
                        let banButton = (
                                <Button type="danger" size={"small"} id={record.id} onClick={(e) => this.handleBanClick(e)}>封禁</Button>
                        );
                        let menu = (
                            <Menu onClick={$.proxy(this.handleMenuClick, this)}>
                                <Menu.Item key="1" id={record.id}>不再提醒</Menu.Item>
                                <Menu.Item key="2" id={record.id}>操作记录</Menu.Item>
                            </Menu>
                        );

                        let buttonGroup = "";
                        if (record.blockStatus == 1){
                            buttonGroup = (
                                <div>
                                    {banButton}
                                    <span className="ant-divider" />
                                    <Dropdown overlay={menu}>
                                        <Button size={"small"}>更多操作<Icon type="down"/></Button>
                                    </Dropdown>
                                </div>
                            )
                        } else if (record.blockStatus == 2) {
                            menu = (
                                <Menu onClick={$.proxy(this.handleMenuClick, this)}>
                                    <Menu.Item key="2" id={record.id}>操作记录</Menu.Item>
                                </Menu>
                            );
                            buttonGroup = (
                                <div>
                                    {relieveButton}
                                    <span className="ant-divider" />
                                    <Dropdown overlay={menu}>
                                        <Button size={"small"}>更多操作<Icon type="down"/></Button>
                                    </Dropdown>
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

                let noAlertView = this.renderNoAlertView()

                return (<div> 
                            <Table rowKey="id" 
                                    dataSource={this.state.data} 
                                    loading={this.state.isFetching} 
                                    columns={columns}
                                    scroll={{ x: 1500 }} 
                                    pagination = {pagination} />
                            <Modal title={'选择近期不再提醒封禁'}
                                   destroyOnClose={true}
                                   visible={this.state.modalVisible}
                                   onOk={$.proxy(this.handleModalOk, this)}
                                   onCancel={$.proxy(this.handleModalCancel, this)}>
                                   {noAlertView}
                            </Modal>
                            <Modal title={'操作记录'}
                                   destroyOnClose={true}
                                   visible={this.state.recordModalVisible}
                                   footer={null}
                                   onCancel={$.proxy(this.handleModalRecordCancel, this)}>
                                   {this.opRecordView}
                            </Modal>
                        </div> )
            }
        }

        var WrappedBanDomainManageTable = Form.create()(BanDomainManageTable);    

        class BanDomainManageList extends React.Component {
            constructor(props, context) {
                super(props);
                this.handleSubmit = this.handleSubmit.bind(this);
                this.state = {
                    modalVisible: false
                }

                this.queryCondition = {
                    "domains": null,
                    "userId": null,
                    "companyName": null,
                    "subType": null,
                    "blockStatus": null,
                    "startTime": null,
                    "endTime": null,
                    "page": 1,
                    "size": 10
                }

                this.ltProps = {
                    collection: this.props.collection,
                    queryCondition: this.queryCondition
                }

                console.log(Antd)
            }

            componentDidMount() {
                const collection = this.props.collection;
                collection.on("add.task.success", $.proxy(this.onSaveSuccess, this))
                collection.on("add.task.error", $.proxy(this.onSaveError, this))
            }

            componentWillUnmount() {
                const collection = this.props.collection;
                collection.off("add.task.success")
                collection.off("add.task.error")
            }

            onSaveSuccess(){
                Utility.alerts("添加封禁成功！", "success", 2000);
                this.setState({
                    modalVisible: false,
                    loading: false
                })
                this.handleSubmit()
            }

            onSaveError(error) {
                if (error && error.message)
                    Utility.alerts(error.message);
                else if (error && error.Error && error.Error.Message)
                    Utility.alerts(error.Error.Message);
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
                this.setState({
                    loading: false
                })
            }

            handleSubmit(e){
                e&&e.preventDefault();
                const { validateFields } = this.props.form;

                validateFields([], function(err, vals) {
                    if (!err) {
                        var fieldsValue = this.props.form.getFieldsValue();
                        var collection = this.props.collection,
                            queryCondition = this.queryCondition;
                        queryCondition.domains = fieldsValue.domainName || null;
                        queryCondition.userId = fieldsValue.userId || null;
                        queryCondition.companyName = fieldsValue.companyName || null;
                        queryCondition.subType = fieldsValue.subType || null;
                        queryCondition.blockStatus = fieldsValue.blockStatus || null;
                        if (fieldsValue.rangeTimePicker && fieldsValue.rangeTimePicker.length > 1) {
                            queryCondition.startTime = fieldsValue.rangeTimePicker[0].valueOf();
                            queryCondition.endTime = fieldsValue.rangeTimePicker[1].valueOf();
                        } else {
                            queryCondition.startTime = null;
                            queryCondition.endTime = null;
                        }
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
                setFieldsValue({"domainName": null})
                setFieldsValue({"userId": null})
                setFieldsValue({"companyName": null})
                setFieldsValue({"subType": null})
                setFieldsValue({"blockStatus": null})
                setFieldsValue({"rangeTimePicker": null})
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
                if (value&&value.indexOf("\n") > -1) {
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
                } else if (value&&Utility.isDomain(value)){
                    callback();
                } else {
                    callback("请输入正确的域名");
                }
            }

            handleModalOk() {
                const { validateFields } = this.props.form;

                validateFields(["domain", "remark"], function(err, vals) {
                    if (!err) {
                        var fieldsValue = this.props.form.getFieldsValue();
                        var collection = this.props.collection;
                        collection.addTask({
                            "domains": vals.domain,
                            "remark": vals.remark
                        })
                    }
                }.bind(this))
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
                            {getFieldDecorator('domainName')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label={"客户ID"}>
                            {getFieldDecorator('userId')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label={"客户名称"}>
                            {getFieldDecorator('subType')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label={"时间"}>
                            {getFieldDecorator('rangeTimePicker')(
                                <RangePicker showTime={{ format: 'HH:mm', minuteStep: 30 }} 
                                            format="YYYY/MM/DD HH:mm" />
                            )}
                        </FormItem>
                        <FormItem label={"业务类型"}>
                            {getFieldDecorator('companyName',{
                                initialValue: null,
                            })(
                                <Select style={{ width: 120 }}>
                                    <Option value={null}>全部</Option>
                                    <Option value={1}>视音频点播</Option>
                                    <Option value={2}>直播拉流</Option>
                                    <Option value={3}>直播上行</Option>
                                    <Option value={4}>大文件下载</Option>
                                    <Option value={5}>页面小文件</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={"状态"}>
                            {getFieldDecorator('blockStatus',{
                                initialValue: null,
                            })(
                                <Select style={{ width: 120 }}>
                                    <Option value={null}>全部</Option>
                                    <Option value={5}>未封禁</Option>
                                    <Option value={2}>已封禁</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" icon="search">查询</Button>
                            <Button style={{ marginLeft: 8 }} icon="reload" onClick={$.proxy(this.onClickResetButton, this)}>重置</Button>
                            <Button style={{ marginLeft: 8 }} icon="plus" onClick={$.proxy(this.onClickAddButton, this)}>新增域名封禁</Button>
                            <Modal title={'新增域名封禁'}
                                   destroyOnClose={true}
                                   visible={this.state.modalVisible}
                                   onOk={$.proxy(this.handleModalOk, this)}
                                   confirmLoading={this.state.loading}
                                   onCancel={$.proxy(this.handleModalCancel, this)}>
                                   {AddForm}
                            </Modal>
                        </FormItem>
                    </Form>
                );

                return (  
                    <LocaleProvider locale={locales.zh_CN}>
                        <Layout>
                            <Content>
                                <Breadcrumb style={{ margin: '16px 0' }}>
                                    <Breadcrumb.Item>{"域名设置"}</Breadcrumb.Item>
                                    <Breadcrumb.Item>{"域名封禁"}</Breadcrumb.Item>
                                </Breadcrumb>
                                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                                    {SearchForm}
                                    <hr />
                                    <WrappedBanDomainManageTable ltProps={this.ltProps} />
                                </div>
                            </Content>
                        </Layout>
                    </LocaleProvider>
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