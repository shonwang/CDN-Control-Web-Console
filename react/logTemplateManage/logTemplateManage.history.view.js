define("logTemplateManage.history.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], 
    function(require, exports, template, BaseView, Utility, Antd, React, moment) {

        var Button = Antd.Button,
            Input = Antd.Input,
            Form = Antd.Form,
            Spin = Antd.Spin ,
            FormItem = Form.Item,
            Modal = Antd.Modal,
            Table = Antd.Table,
            Tag = Antd.Tag,
            Icon = Antd.Icon,
            Tooltip = Antd.Tooltip,
            Alert = Antd.Alert,
            confirm = Modal.confirm;

        class LogTplHistoryView extends React.Component {
           constructor(props, context) {
                super(props);
                this.onClickCancel = this.onClickCancel.bind(this);
                this.handlePublishClick = this.handlePublishClick.bind(this);
                
                this.state = {
                    data: [],
                    isError: false,
                    isFetching: true,
                    modalVisible: false,
                    //confirmLoading: false,
                    comment: "",
                    validateStatus: "",//'success', 'warning', 'error', 'validating'。
                    help: ""
                };
            }

            componentDidMount() {
                var ltProps = this.props.ltProps;
                var collection = ltProps.collection;
                collection.on("template.history.success", $.proxy(this.onTemplateHistoryListSuccess, this));
                collection.on("template.history.error", $.proxy(this.onGetError, this));
                collection.on("fetching.history", $.proxy(this.onFetchingTplHistoryList, this));   
                collection.trigger("fetching.history");
                collection.on("publish.template.success", $.proxy(this.onGetOperateSuccess, this, "发布"));
                collection.on("publish.template.error", $.proxy(this.onOperateError, this));
            }

            componentWillUnmount() {
                var collection = this.props.ltProps.collection;
                collection.off("template.history.success");
                collection.off("template.history.error");
                collection.off("fetching.history");
                collection.off("publish.template.success");
                collection.off("publish.template.error"); 
            }

            onGetOperateSuccess(msg){
                Utility.alerts(msg + "成功!", "success", 2000);
                const ltProps = this.props.ltProps;
                const { collection } = ltProps;
                collection.trigger("fetching.history");
            }

            onOperateError(error){
                if (error && error.message)
                    Utility.alerts(error.message);
                else if (error && error.Error && error.Error.Message)
                    Utility.alerts(error.Error.Message);
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }

            onFetchingTplHistoryList(){
                var collection = this.props.ltProps.collection,
                    model = this.props.model
                this.setState({
                    isFetching: true
                })
                collection.getTplHistoryList({groupId:model.groupId})
            }

            onTemplateHistoryListSuccess(data) {
                this.setState({
                    data: data,
                    isFetching: false
                })
            }

            handlePublishClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                this.curPublishId = id;
                this.setState({
                    modalVisible: true
                })
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
                onClickViewCallback&&onClickViewCallback(model, "history")
            }

            onClickCancel() {
                const onClickCancelCallback = this.props.ltProps.onClickCancelCallback;
                onClickCancelCallback&&onClickCancelCallback();
            }

            onGetError(error) {
                var msgDes = "服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！"
                if (error && error.message)
                    msgDes = error.message;
                else if (error && error.Error && error.Error.Message)
                    msgDes = error.Error.Message;

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

            handleModalOk() {
                if (this.state.comment == "") {
                    this.setState({
                        validateStatus: "error",
                        help: "请输入备注!"
                    })
                    return;
                } else {
                    this.setState({
                        validateStatus: "success",
                        help: "",
                        //confirmLoading: true
                    })
                }
                const ltProps = this.props.ltProps;
                const { collection } = ltProps;
                collection.publishTemplate({
                    id: this.curPublishId,
                    comment: this.state.comment
                })
                this.setState({
                    modalVisible: false
                })
            }

            handleModalCancel() {
                this.setState({
                    modalVisible: false
                })
            }

            handleTextAreaChange(e) {
                this.setState({
                    comment: e.target.value
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
                    title: '版本号',
                    dataIndex: 'id',
                    key: 'id'
                },{
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    render: (text, record) => (new Date(record.createTime).format("yyyy/MM/dd hh:mm:ss"))
                },{
                    title: '修改时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                    render: (text, record) => (new Date(record.updateTime).format("yyyy/MM/dd hh:mm:ss"))
                },{
                    title: '备注',
                    dataIndex: 'comment',
                    key: 'comment'
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
                        var publishButton = (
                            <Tooltip placement="bottom" title={"发布"}>
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handlePublishClick(e)}>
                                    <Icon type="to-top" />
                                </a>
                            </Tooltip>
                        )
                        var buttonGroup = "";
                        if (record.enable) {
                            buttonGroup = (
                                <div>
                                    {detailButton}
                                    <span className="ant-divider" />
                                    <Tag color={"green"}>正在使用</Tag>
                                </div>
                            )
                        } else if (AUTH_OBJ.CheckLogList){
                            buttonGroup = (
                                <div>
                                    {detailButton}
                                    <span className="ant-divider" />
                                    {publishButton}
                                </div>
                            )
                        } else {
                            buttonGroup = (
                                <div>
                                    {detailButton}
                                </div>
                            )
                        }
                        return buttonGroup
                    },
                }];

                return ( 
                            <div>
                                <Button onClick={this.onClickCancel} style={{marginLeft: "10px"}}>返回</Button>
                                <hr/>
                                <Table rowKey="id" 
                                    dataSource={this.state.data} 
                                    loading={this.state.isFetching} 
                                    columns={columns}
                                    pagination={false}
                                    rowClassName={
                                        (record, index) => {
                                            if (record.enable) {
                                                return "ant-alert-error"
                                            }
                                            return ""
                                        }
                                    }/>
                                    <Modal title={'发布'}
                                           destroyOnClose={true}
                                           confirmLoading={this.state.confirmLoading}
                                           visible={this.state.modalVisible}
                                           onOk={$.proxy(this.handleModalOk, this)}
                                           onCancel={$.proxy(this.handleModalCancel, this)}>
                                            <Form>
                                                <FormItem style={{marginBottom: "0px"}}>
                                                    <span className="ant-form-text">你确定要发布吗？</span>
                                                </FormItem>
                                                <FormItem label="备注" required={true} validateStatus={this.state.validateStatus} help={this.state.help}>
                                                    <Input.TextArea onChange={$.proxy(this.handleTextAreaChange, this)}/>
                                                </FormItem>
                                            </Form>
                                    </Modal>
                            </div>
                        )
            }
        }

        return LogTplHistoryView;
    }
);