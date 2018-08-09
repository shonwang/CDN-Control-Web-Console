define("preheatManage.edit.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], 
    function(require, exports, template, BaseView, Utility, Antd, React, moment) {

        var Button = Antd.Button,
            Input = Antd.Input,
            Form = Antd.Form,
            Spin = Antd.Spin ,
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

        class PreheatManageEditForm extends React.Component {
            constructor(props, context) {
                super(props);
                this.onClickCancel = this.onClickCancel.bind(this);
                this.renderTaskNameView = this.renderTaskNameView.bind(this);
                this.renderNodesTableView = this.renderNodesTableView.bind(this);
                this.renderTimeBandTableView = this.renderTimeBandTableView.bind(this);
                this.validateTimeBand = this.validateTimeBand.bind(this);
                this.validateNodesList = this.validateNodesList.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);

                this.state = {
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
                    curEditTime: {},
                };

                if (props.isEdit) {
                    this.state.nodesList = props.model.batchTimeBandwidth
                }

                this.isUploadDone = false;
                moment.locale("zh");
            }

            componentDidMount() {
                var preHeatProps = this.props.preHeatProps,
                nodeList = preHeatProps.nodeList;
                if (nodeList.length == 0) {
                    require(['nodeManage.model'],function(NodeManageModel){
                        var nodeManageModel = new NodeManageModel();
                        nodeManageModel.on("get.node.success", $.proxy(this.onGetNodeListSuccess, this))
                        nodeManageModel.on("get.node.error", $.proxy(this.onGetNodeListError, this))
                        nodeManageModel.getNodeList({page: 1,count: 9999});
                        this.setState({
                            isLoadingNodesList: true
                        });
                    }.bind(this));
                }
                const collection = this.props.preHeatProps.collection;
                collection.on("refresh.commit.success", $.proxy(this.onSubmitSuccess, this));
                collection.on("refresh.commit.error", $.proxy(this.onGetError, this));     
            }

            componentWillUnmount() {
                const collection = this.props.preHeatProps.collection;
                collection.off("refresh.commit.success");
                collection.off("refresh.commit.error");   
           
            }

            onGetNodeListSuccess(res) {
                this.props.preHeatProps.nodeList = res
                this.setState({
                    isLoadingNodesList: false
                });
            }

            onGetError (error){
                if (error && error.message)
                    Utility.alerts(error.message);
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }

            onSubmitSuccess (){
                Utility.alerts("保存成功！", "success", 2000);
                this.onClickCancel();
            }

            onGetNodeListError(error) {
                var msg = error ? error.message : "获取节点信息失败!";
                Utility.alerts(msg);
            }

            handleSubmit(e) {
                e.preventDefault();
                const { resetFields, validateFields } = this.props.form;
                resetFields("nodesList")
                var checkArray = ["taskName", "taskDomain", "rangeTimePicker", "nodesList", "fileList"];
                if (this.props.isEdit) {
                    checkArray = ["nodesList"];
                }
                validateFields(checkArray, function(err, vals) {
                    var postParam, postNodesList = [], model = this.props.model;
                    const collection = this.props.preHeatProps.collection;
                    if (!err) {
                        _.each(this.state.nodesList, (node) => {
                            var postNode = {
                                id: node.id,
                                sortnum: node.sortnum,
                                nodes: node.nodeNameArray.join(";"),
                            }, timeWidthList = [];

                            if (!this.props.isEdit) delete postNode.id;

                            _.each(node.timeWidth, (time) => {
                                var timeObj = {
                                    bandwidth: time.bandwidth,
                                    batchEndTime: moment(time.batchEndTime, 'HH:mm').valueOf(),
                                    id: time.id,
                                    batchStartTime: moment(time.batchStartTime, 'HH:mm').valueOf()
                                }
                                if (!this.props.isEdit) delete timeObj.id;

                                timeWidthList.push(timeObj)
                            })
                            postNode.timeWidth = timeWidthList;
                            postNodesList.push(postNode)
                        })

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
                            }
                            console.log(postParam)
                            collection.commitTask(postParam);
                        } else {

                            postParam = {
                                taskId: model.id,
                                batchTimeBandwidth: postNodesList
                            }
                            console.log(postParam)
                            collection.taskModify(postParam);
                        }
                    }
                }.bind(this))
            }

            onClickCancel() {
                const onClickCancelCallback = this.props.preHeatProps.onClickCancelCallback;
                onClickCancelCallback&&onClickCancelCallback();
            }

            onUploadFile (e) {
                console.log('Upload event:', e);
                if (e.fileList.length > 1) {
                    return []
                }
                if (e) {
                    if (e.file.status == "error") {
                        this.onGetError(e.file.response)
                    } else if (e.file.status == "done"){
                        Utility.alerts("上传成功！", "success", 2000);
                        var res = e.file.response
                        this.setState({
                            preloadUrlCount: res.preloadUrlCount,
                            preloadFilePath: res.preloadFilePath
                        })
                    }
                    if (!this.state.disabledUpload) {
                        this.setState({
                            disabledUpload: true
                        });
                    }

                }
                return e.fileList;
            }

            validateDomain (rule, value, callback) {
                if (value&&Utility.isDomain(value)) {
                    callback();
                } else {
                    callback('请输入正确的域名！');
                }
            }

            validateNodesList (rule, value, callback) {
                if (this.state.nodesList.length != 0) {
                    callback();
                } else {
                    callback('请添加预热节点！');
                }
            }

            validateTimeBand (rule, value, callback) {
                if (this.state.timeBandList.length != 0) {
                    callback();
                } else {
                    callback('请添加分时分时任务！');
                }
            }

            renderTaskNameView(formItemLayout) {
                const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form;
                var taskNameView = "", model = this.props.model;

                const uploadProps = {
                    action: BASE_URL + "/refresh/task/upload",
                    onRemove: (file) => {
                        var fileList = getFieldValue("fileList");
                        const index = fileList.indexOf(file);
                        const newFileList = fileList.slice();
                        newFileList.splice(index, 1);
                        setFieldsValue({
                            fileList: newFileList
                        });
                        this.setState({
                            disabledUpload: false
                        });
                    },
                    beforeUpload: (file, fileList) => {
                        if (fileList.length > 1) {
                            return false
                        }
                    },
                    multiple: false,
                    disabled: this.state.disabledUpload
                };

                if (this.props.isEdit) {
                    taskNameView = (
                        <div>
                            <FormItem {...formItemLayout} label="任务名称" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{model.taskName}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热域名" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{model.channel}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热文件" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{model.preloadFilePath}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热文件数目" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{model.preloadUrlCount}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="起止时间">
                                <span className="ant-form-text">{model.startTimeFormated}~{model.endTimeFormated}</span>
                            </FormItem>
                        </div>
                    )
                } else {
                    taskNameView = (
                        <div>
                            <FormItem {...formItemLayout} label="任务名称" hasFeedback>
                                {getFieldDecorator('taskName', {
                                        rules: [{ required: true, message: '请输入任务名称!' }],
                                    })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热域名" hasFeedback>
                                {getFieldDecorator('taskDomain', {
                                        validateFirst: true,
                                        rules: [{ 
                                            required: true, message: '请输入预热域名!' }, {
                                            validator: this.validateDomain,
                                        }],
                                    })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热文件">
                                <div className="dropbox">
                                    {getFieldDecorator('fileList', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: $.proxy(this.onUploadFile, this),
                                        initialValue: this.state.fileList,
                                        rules: [{ type: "array", required: true, message: '请上传预热文件，只能上传一个!' }],
                                    })(
                                        <Upload.Dragger {...uploadProps}>
                                            <p className="ant-upload-drag-icon">
                                                <Icon type="inbox" />
                                            </p>
                                            <p className="ant-upload-text">支持点击或拖拽到框里上传</p>
                                            <p className="ant-upload-hint">只能上传一个文件</p>
                                        </Upload.Dragger>
                                    )}
                                </div>
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热文件数目" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{this.state.preloadUrlCount}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="起止时间">
                                {getFieldDecorator('rangeTimePicker', {
                                        rules: [{ type: 'array', required: true, message: '请选择起止时间！' }],
                                    })(
                                    <RangePicker showTime={{ format: 'HH:mm', minuteStep: 30 }} 
                                                format="YYYY/MM/DD HH:mm" 
                                                disabledDate={this.disabledDate}
                                                disabledTime={this.disabledTime} />
                                )}
                            </FormItem>
                        </div>
                    )
                }

                return taskNameView
            }

            handleCancel (){
                this.setState({
                    nodeModalVisible: false
                });
            }

            handleTimeCancel (){
                this.setState({
                    timeModalVisible: false
                });
            }

            onClickAddNodes (event) {
                this.setState({
                    isEditNode:false,
                    curEditNode: {},
                    nodeModalVisible: true,
                    timeBandList: []
                });
            }

            handleNodeOk (e){
                e.preventDefault();
                const { nodesList, isEditNode, curEditNode, timeBandList} = this.state;
                const { getFieldsValue, validateFields, resetFields } = this.props.form;
                let newNodes = null;
                resetFields("timeBand")
                validateFields(["selectNodes", "inputOriginBand", "timeBand"], (err, vals) => {
                    if (!err && !isEditNode) {
                        newNodes = {
                            sortnum: nodesList.length + 1,
                            id: Utility.randomStr(8),
                            nodeNameArray: getFieldsValue().selectNodes,
                            timeWidth: [...timeBandList]
                        }
                        this.setState({
                            nodesList: [...nodesList, newNodes],
                            nodeModalVisible: false
                        });
                    } else if (!err && isEditNode) {
                        _.find(nodesList, (el) => {
                            if (el.id == curEditNode.id) {
                                el.nodeNameArray = getFieldsValue().selectNodes,
                                el.timeWidth = [...timeBandList]
                            }
                        })

                        this.setState({
                            nodesList: [...nodesList],
                            nodeModalVisible: false
                        });
                    }
                })
            }

            handleNodeSearch (value) {
                var preHeatProps = this.props.preHeatProps;
                var nodeArray = [], nodeList = preHeatProps.nodeList;
                if (value && nodeList) {
                    nodeArray = _.filter(nodeList, function(el){
                        return el.name.indexOf(value) > -1 || el.chName.indexOf(value) > -1
                    }.bind(this)).map((el) => {
                        return <Option key={el.name}>{el.name}</Option>;
                    })
                }

                this.setState({
                    nodeDataSource: nodeArray
                });
            }

            onClickEditNode(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = _.find(this.state.nodesList, function(obj){
                        return obj.id == id
                    }.bind(this))

                this.setState({
                    nodeModalVisible: true,
                    isEditNode: true,
                    curEditNode: model,
                    timeBandList: model.timeWidth
                });
            }

            onClickDeleteNode(event) {
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
                        var list = _.filter(this.state.nodesList, function(obj){
                                return obj.id !== id
                            }.bind(this))
                        _.each(list, (el, index)=>{
                            el.sortnum = index + 1
                        })
                        this.setState({
                            nodesList: list
                        })
                    }.bind(this)
                  });
            }  

            renderNodesTableView(formItemLayout) {
                const { getFieldDecorator } = this.props.form;
                const { nodesList, nodeModalVisible, nodeDataSource, curEditNode } = this.state;
                var preheatNodesView = "";
                const { isView, isEdit } = this.props;
                var  columns = [{
                    title: '批次',
                    dataIndex: 'sortnum',
                    key: 'sortnum',
                },{
                    title: '预热节点',
                    dataIndex: 'nodeNameArray',
                    key: 'nodeNameArray',
                    width: 300,
                    render: (text, record) => {
                        const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
                        let content = [];
                        let random;
                        for(var i = 0; i < record.nodeNameArray.length; i++) {
                            random = Math.floor(Math.random() * colors.length)
                            content.push((<Tag color={colors[random]} key={i} style={{marginBottom: '5px'}}>{record.nodeNameArray[i]}</Tag>))
                        }
                        return content
                    }
                },{
                    title: '进度',
                    dataIndex: 'successed ',
                    key: 'successed ',
                    render: (text, record) => {
                        if (record.successed != undefined && 
                            record.failed != undefined) {
                            var total = record.successed + record.failed;
                            return total;
                        } else {
                            return "-"
                        }
                    }
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
                    dataIndex: 'failed',
                    key: 'failed',
                    render: (text, record) => {
                        if (record.successed != undefined && 
                            record.failed != undefined) {
                            var total = record.successed + record.failed;
                            if (total != 0){
                                return record.successed / total * 100 + "%"
                            } else {
                                return "0" 
                            }
                        } else {
                            return "-"
                        }
                    }
                },{
                    title: '执行时间',
                    dataIndex: 'timeWidth',
                    key: 'timeWidth',
                    render: (text, record) => {
                        return <List size="small" dataSource={record.timeWidth} 
                                renderItem={(item) => {
                                    return <List.Item>{item.batchStartTime}~{item.batchEndTime}</List.Item>
                                }} />
                    }
                },{
                    title: '回源带宽',
                    dataIndex: 'bandwidth',
                    key: 'bandwidth',
                    render: (text, record) => {
                        return <List size="small" dataSource={record.timeWidth} renderItem={item => (<List.Item>{item.bandwidth}M</List.Item>)} />
                    }
                },{
                    title: '操作',
                    dataIndex: 'id',
                    key: 'action',
                    render: (text, record) => {
                        var editButton = (
                            <Tooltip placement="bottom" title={"编辑"}>
                                <a href="javascript:void(0)" id={record.id} onClick={$.proxy(this.onClickEditNode, this)}>
                                    <Icon type="edit" />
                                </a>
                            </Tooltip>
                        );
                        var deleteButton = (
                            <Tooltip placement="bottom" title={"删除"}>
                                <a href="javascript:void(0)" id={record.id} onClick={$.proxy(this.onClickDeleteNode, this)}>
                                    <Icon type="delete" />
                                </a>
                            </Tooltip>
                        );
                        var buttonGroup = null;
                        if (isView && isEdit) {
                            buttonGroup = "-"
                        } else if (!isEdit) {
                            buttonGroup = (
                                <div>
                                    {editButton}
                                    <span className="ant-divider" />
                                    {deleteButton}
                                </div>
                            )
                        } else if (isEdit){
                            buttonGroup = editButton;
                        }
                        return buttonGroup
                    },
                }];

                var addEditNodesView = null, addButton = null;
                const timeBandView = this.renderTimeBandTableView(formItemLayout);

                if (this.state.isLoadingNodesList) {
                    addEditNodesView =  <div style={{textAlign: "center"}}><Spin /></div>
                } else {
                    addEditNodesView = (
                        <Form>
                            <FormItem {...formItemLayout} label="预热节点">
                                {getFieldDecorator('selectNodes', {
                                        initialValue: curEditNode.nodeNameArray || [],
                                        rules: [{ type: "array", required: true, message: '请选择预热节点!' }],
                                    })(
                                    <Select mode="multiple" allowClear={true}
                                            disabled={this.props.isEdit}
                                            notFoundContent={'请输入节点关键字'}
                                            filterOption={false}
                                            onSearch={$.proxy(this.handleNodeSearch, this)} >
                                        {nodeDataSource}         
                                    </Select>
                                )}
                            </FormItem>
                            {timeBandView}
                            <FormItem {...formItemLayout} label="分时任务" style={{display:"none"}}>
                                <Button icon="plus" size={'small'} onClick={$.proxy(this.onClickAddNodes, this)}>新建分时任务</Button>
                                {getFieldDecorator('inputOriginBand', {
                                        initialValue: curEditNode.bandwidth || 100,
                                        rules: [{ required: true, message: '请输入回源带宽!' }],
                                    })(
                                    <InputNumber/>
                                )}
                                <span style={{marginLeft: "10px"}}>M</span>
                            </FormItem>
                        </Form>
                    );
                }

                if (!this.props.isEdit) {
                    addButton = (<Button icon="plus" size={'small'} onClick={$.proxy(this.onClickAddNodes, this)}>新建预热批次</Button>)
                } 

                preheatNodesView = (
                    <FormItem {...formItemLayout} label="预热批次" required={true}>
                        {addButton}
                        <Alert style={{ marginBottom: '10px' }} message="预热任务遵循预热批次自动执行" type="info" showIcon />
                        {getFieldDecorator('nodesList', {
                            rules: [{ validator: this.validateNodesList }],
                        })(
                            <Table rowKey="id" columns={columns} pagination={false} size="small" dataSource={nodesList} />
                        )}
                        <Modal title={'预热批次'} destroyOnClose={true} width={800}
                               destroyOnClose={true}
                               visible={nodeModalVisible}
                               onOk={$.proxy(this.handleNodeOk, this)}
                               onCancel={$.proxy(this.handleCancel, this)}>
                               {addEditNodesView}
                        </Modal>
                    </FormItem>
                )

                return preheatNodesView;
            }

            onClickAddTime (event) {
                this.setState({
                    isEditTime: false,
                    curEditTime: {},
                    timeModalVisible: true
                });
            }

            handleTimeOk (e){
                e.preventDefault();
                const { timeBandList, isEditTime, curEditTime} = this.state;
                const { getFieldsValue, validateFields, resetFields } = this.props.form;
                let newTimeBand = null;
                validateFields(["selectStartTime","selectEndTime", "inputBand"], (err, vals) => {
                    const format = 'HH:mm';
                    if (!err && !isEditTime) {
                        console.log(getFieldsValue())
                        newTimeBand = {
                            id: Utility.randomStr(8),
                            batchStartTime: getFieldsValue().selectStartTime.format(format),
                            batchEndTime: getFieldsValue().selectEndTime.format(format),
                            bandwidth: getFieldsValue().inputBand
                        }
                        this.setState({
                            timeBandList: [...timeBandList, newTimeBand],
                            timeModalVisible: false
                        });
                    } else if (!err && isEditTime) {
                        _.each(timeBandList, (el)=>{
                            if (el.id == curEditTime.id) {
                                el.batchStartTime = getFieldsValue().selectStartTime.format(format);
                                el.batchEndTime = getFieldsValue().selectEndTime.format(format);
                                el.bandwidth = getFieldsValue().inputBand
                            }
                        })
                        this.setState({
                            timeBandList: [...timeBandList],
                            timeModalVisible: false
                        });
                    }
                })
            }

            handleEditTimeClick (event){
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = _.find(this.state.timeBandList, function(obj){
                        return obj.id == id
                    }.bind(this))
                const format = 'HH:mm',
                      selectStartTime = model.batchStartTime,
                      selectEndTime = model.batchEndTime;
                this.setState({
                    timeModalVisible: true,
                    isEditTime: true,
                    curEditTime: {
                        selectStartTime:moment(selectStartTime, format), 
                        selectEndTime: moment(selectEndTime, format), 
                        bandwidth: model.bandwidth,
                        id: model.id
                    }
                });
            }

            handleDeleteTimeClick (event){
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
                        var list = _.filter(this.state.timeBandList, function(obj){
                                return obj.id != id
                            }.bind(this))
                        this.setState({
                            timeBandList: list
                        })
                    }.bind(this)
                  });
            }

            renderTimeBandTableView(formItemLayout) {
                const { getFieldDecorator } = this.props.form;
                const { timeModalVisible, curEditTime } = this.state;
                var timeBandView = "", model = this.props.model;
                var  columns = [{
                    title: '执行时间',
                    dataIndex: 'batchStartTime',
                    key: 'batchStartTime',
                    render: (text, record) => (text + "~" + record.batchEndTime)
                },{
                    title: '回源带宽',
                    dataIndex: 'bandwidth',
                    key: 'bandwidth',
                    render: (text, record) => (text + "M")
                }, {
                    title: '操作',
                    dataIndex: 'id',
                    key: 'action',
                    render: (text, record) => {
                        var editButton = (
                            <Tooltip placement="bottom" title={"编辑"}>
                                <a href="javascript:void(0)" id={record.id} onClick={$.proxy(this.handleEditTimeClick, this)}>
                                    <Icon type="edit" />
                                </a>
                            </Tooltip>
                        );
                        var deleteButton = (
                            <Tooltip placement="bottom" title={"删除"}>
                                <a href="javascript:void(0)" id={record.id} onClick={$.proxy(this.handleDeleteTimeClick, this)}>
                                    <Icon type="delete" />
                                </a>
                            </Tooltip>
                        );
                        var buttonGroup;
                        buttonGroup = (
                            <div>
                                {editButton}
                                <span className="ant-divider" />
                                {deleteButton}
                            </div>
                        )
                        return buttonGroup
                    },
                }];

                const format = 'HH:mm';

                const addEditTimeView = (
                    <Form>                            
                        <FormItem {...formItemLayout} label="执行时间" required={true}>
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator('selectStartTime', {
                                            rules: [{ required: true, message: '请选择开始时间!' }],
                                            initialValue: curEditTime.selectStartTime || moment('00:00', format)
                                        })(
                                            <TimePicker format={format} minuteStep={1} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                -
                                </span>
                            </Col>
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator('selectEndTime', {
                                            rules: [{ required: true, message: '请选择结束时间!' }],
                                            initialValue: curEditTime.selectEndTime  || moment('23:59', format)
                                        })(
                                            <TimePicker  format={format} minuteStep={1} />
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem> 
                        <FormItem {...formItemLayout} label="回源带宽">
                            {getFieldDecorator('inputBand', {
                                    initialValue: curEditTime.bandwidth || 100,
                                    rules: [{ required: true, message: '请输入带宽!' }],
                                })(
                                <InputNumber/>
                            )}
                            <span style={{marginLeft: "10px"}}>M</span>
                        </FormItem>
                    </Form>
                );

                timeBandView = (
                    <FormItem {...formItemLayout} label="分时任务" required={true}>
                        <Button icon="plus" size={'small'} onClick={$.proxy(this.onClickAddTime, this)}>新建分时任务</Button>
                        <Alert style={{ marginBottom: '10px' }} message="仅在添加的分时任务时间段内进行预热" type="info" showIcon />
                        {getFieldDecorator('timeBand', {
                            rules: [{ validator: this.validateTimeBand }],
                        })(
                            <Table rowKey="id" columns={columns} pagination={false} size="small" dataSource={this.state.timeBandList} />
                        )}
                        <Modal title={'分时任务'} destroyOnClose={true}
                               destroyOnClose={true}
                               visible={timeModalVisible}
                               onOk={$.proxy(this.handleTimeOk, this)}
                               onCancel={$.proxy(this.handleTimeCancel, this)}>
                               {addEditTimeView}
                        </Modal>
                    </FormItem>
                )

                return timeBandView;
            }

            disabledDate(current) {
                return current && current < moment().add(-1,'day')
            }

            disabledTime(type) {
                function range(start, end) {
                    const result = [];
                        for (let i = start; i < end; i++) {
                            result.push(i);
                        }
                    return result;
                }

                if (type === 'start') {
                    return {
                        disabledHours: () => range(0, moment().hour() + 1)
                    }
                }
            }

            render() {
                const { getFieldDecorator } = this.props.form;
                const formItemLayout = {
                  labelCol: { span: 4 },
                  wrapperCol: { span: 16 },
                };
                const taskNameView = this.renderTaskNameView(formItemLayout);
                const preheatNodesView = this.renderNodesTableView(formItemLayout);
                let saveButton = null;
                if (!this.props.isView)
                    saveButton = (<Button type="primary" htmlType="submit">保存</Button>)

                return (
                    <div>
                        <Form onSubmit={this.handleSubmit}>
                            {taskNameView}
                            {preheatNodesView}
                            <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                                {saveButton}
                                <Button onClick={this.onClickCancel} style={{marginLeft: "10px"}}>取消</Button>
                            </FormItem>
                        </Form>
                    </div>
                );
            }
        }

        const PreheatManageEditView = Form.create()(PreheatManageEditForm);    
        return PreheatManageEditView;
    }
);