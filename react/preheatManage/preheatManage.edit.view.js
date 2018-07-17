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
                    uploading: false,
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
            }

            componentWillUnmount() {}

            onGetNodeListSuccess(res) {
                this.props.preHeatProps.nodeList = res
                this.setState({
                    isLoadingNodesList: false
                });
            }

            onGetNodeListError(error) {
                var msg = error ? error.message : "获取节点信息失败!";
                Utility.alerts(msg);
            }

            handleSubmit(e) {
                e.preventDefault();
                this.props.form.validateFields((err, vals) => {
                    if (!err) {}
                })
            }

            onClickCancel() {
                var onClickCancelCallback = this.props.preHeatProps.onClickCancelCallback;
                onClickCancelCallback&&onClickCancelCallback();
            }

            onUploadFile (e) {
                console.log('Upload event:', e);
                if (Array.isArray(e)) {
                    return e;
                }
                return e && e.fileList;
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
                    action: '//jsonplaceholder.typicode.com/posts/',
                    onRemove: (file) => {
                        var fileList = getFieldValue("fileList");
                            const index = fileList.indexOf(file);
                            const newFileList = fileList.slice();
                            newFileList.splice(index, 1);
                        setFieldsValue({
                            fileList: newFileList
                        });
                        console.log(this.props.form.getFieldsValue())
                    },
                    beforeUpload: (file) => {
                        console.log(this.props.form.getFieldsValue())
                        var fileList = getFieldValue("fileList"),
                            newFileList = [...fileList, file];
                        setFieldsValue({
                            fileList: newFileList
                        });
                        return false;
                    },
                    multiple: true
                };

                if (this.props.isEdit) {
                    taskNameView = (
                        <div>
                            <FormItem {...formItemLayout} label="任务名称" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{model.taskName}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热域名" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{model.preloadFilePath}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热文件" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{model.preloadFilePath}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热文件数目" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{model.preloadUrlCount}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="起止时间">
                                <span className="ant-form-text">{model.startTime}~{model.endTime}</span>
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
                                        rules: [{ type: "array", required: true, message: '请上传预热文件!' }],
                                    })(
                                        <Upload.Dragger {...uploadProps}>
                                            <p className="ant-upload-drag-icon">
                                                <Icon type="inbox" />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                                        </Upload.Dragger>
                                    )}
                                </div>
                            </FormItem>
                            <FormItem {...formItemLayout} label="起止时间">
                                {getFieldDecorator('range-time-picker', {
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
                            index: nodesList.length + 1,
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
                    dataIndex: 'progress ',
                    key: 'progress ',
                    render: (text, record) => (text || "-")
                },{
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (text, record) => (text || "-")
                },{
                    title: '成功率',
                    dataIndex: 'successRate',
                    key: 'successRate',
                    render: (text, record) => (text || "-")
                },{
                    title: '执行时间',
                    dataIndex: 'timeWidth',
                    key: 'timeWidth',
                    render: (text, record) => {
                        return <List size="small" dataSource={record.timeWidth} renderItem={item => (<List.Item>{item.startTime}~{item.endTime}</List.Item>)} />
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
                                        initialValue: curEditNode.opType || 100,
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
                            startTime: getFieldsValue().selectStartTime.format(format),
                            endTime: getFieldsValue().selectEndTime.format(format),
                            bandwidth: getFieldsValue().inputBand
                        }
                        this.setState({
                            timeBandList: [...timeBandList, newTimeBand],
                            timeModalVisible: false
                        });
                    } else if (!err && isEditTime) {
                        _.each(timeBandList, (el)=>{
                            if (el.id == curEditTime.id) {
                                el.startTime = getFieldsValue().selectStartTime.format(format);
                                el.endTime = getFieldsValue().selectEndTime.format(format);
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
                      selectStartTime = model.startTime,
                      selectEndTime = model.endTime;
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
                                return obj.id !== id
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
                    dataIndex: 'startTime',
                    key: 'startTime',
                    render: (text, record) => (text + "~" + record.endTime)
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
                                    initialValue: curEditTime.opType || 100,
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