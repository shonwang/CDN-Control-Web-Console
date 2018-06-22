define("preheatManage.edit.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone'], 
    function(require, exports, template, BaseView, Utility, Antd, React) {

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
            RangePicker = DatePicker.RangePicker; 

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
                    //预热节点
                    isLoadingNodesList: false,
                    nodesList: [],
                    nodeModalVisible: false,
                    nodeDataSource: [],
                    //分时带宽
                    timeBandList: [],
                };
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
                    callback('请输入添加预热节点！');
                }
            }

            validateTimeBand (rule, value, callback) {
                if (this.state.timeBandList.length != 0) {
                    callback();
                } else {
                    callback('请输入添加分时带宽！');
                }
            }

            onClickAddNodes (event) {
                this.setState({
                    nodeModalVisible: true
                });
            }

            handleNodeOk (e){
                e.preventDefault();
                const { nodesList } = this.state;
                const { getFieldsValue, validateFields } = this.props.form;
                let newNodes = null;
                validateFields(["selectNodes", "inputOriginBand"], (err, vals) => {
                    if (!err) {
                        console.log(getFieldsValue())
                        newNodes = {
                            index: nodesList.length + 1,
                            id: Utility.randomStr(8),
                            nodeName: getFieldsValue().selectNodes,
                            opType: getFieldsValue().inputOriginBand
                        }
                        this.setState({
                            nodesList: [...nodesList, newNodes],
                            nodeModalVisible: false
                        });
                    }
                })
            }

            handleCancel (){
                this.setState({
                    nodeModalVisible: false
                });
            }

            handleNodeSearch (value) {
                var preHeatProps = this.props.preHeatProps;
                var nodeArray = [], nodeList = preHeatProps.nodeList;
                if (value && nodeList) {
                    nodeArray = _.filter(nodeList, function(el){
                        return el.name.indexOf(value) > -1 || el.chName.indexOf(value) > -1
                    }.bind(this)).map((el) => {
                        return <Option key={el.id}>{el.chName}</Option>;
                    })
                }

                this.setState({
                    nodeDataSource: nodeArray
                });
            } 

            renderTaskNameView(formItemLayout) {
                const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form;
                var taskNameView = "", model = this.props.model;

                var files = [
                  'Racing car sprays burning fuel into crowd.',
                  'Japanese princess to wed commoner.',
                  'Australian walks 100km after outback crash.',
                  'Man charged over missing wedding girl.',
                  'Los Angeles battles huge wildfires.',
                ];

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
                                <span className="ant-form-text">{model.name}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热域名" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{model.name}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热文件">
                                <List size="small" dataSource={files} renderItem={item => (<List.Item>{item}</List.Item>)} />
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
                        </div>
                    )
                }

                return taskNameView
            }

            renderNodesTableView(formItemLayout) {
                const { getFieldDecorator } = this.props.form;
                const { nodesList, nodeModalVisible, nodeDataSource } = this.state;
                var preheatNodesView = "", model = this.props.model;
                var  columns = [{
                    title: '批次',
                    dataIndex: 'index',
                    key: 'index',
                },{
                    title: '预热节点',
                    dataIndex: 'nodeName',
                    key: 'nodeName',
                    render: (text, record) => {
                        const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
                        let content = [];
                        let random;
                        for(var i = 0; i < record.nodeName.length; i++) {
                            random = Math.floor(Math.random() * colors.length)
                            content.push((<Tag color={colors[random]} key={i} style={{marginBottom: '5px'}}>{record.nodeName[i].label}</Tag>))
                        }
                        return content
                    }
                },{
                    title: '回源带宽',
                    dataIndex: 'opType',
                    key: 'opType',
                    render: (text, record) => (text + "M")
                },{
                    title: '操作',
                    dataIndex: 'id',
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
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleEditClick(e)}>
                                    <Icon type="delete" />
                                </a>
                            </Tooltip>
                        );
                        var buttonGroup;
                        // if (record.status == 2) {
                        //     buttonGroup = (<div>{playButton}</div>)
                        // } else if (record.status == 1) {
                            buttonGroup = (
                                <div>
                                    {editButton}
                                    <span className="ant-divider" />
                                    {deleteButton}
                                </div>
                            )
                        // }
                        return buttonGroup
                    },
                }];

                var addEditNodesView = null;

                if (this.state.isLoadingNodesList) {
                    addEditNodesView =  <div style={{textAlign: "center"}}><Spin /></div>
                } else {
                    addEditNodesView = (
                        <Form>
                            <FormItem {...formItemLayout} label="预热节点">
                                {getFieldDecorator('selectNodes', {
                                        rules: [{ type: "array", required: true, message: '请选择预热节点!' }],
                                    })(
                                    <Select mode="multiple" allowClear={true} style={{}}
                                            labelInValue
                                            notFoundContent={'请输入节点关键字'}
                                            filterOption={false}
                                            onSearch={$.proxy(this.handleNodeSearch, this)} >
                                        {nodeDataSource}         
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="回源带宽">
                                {getFieldDecorator('inputOriginBand', {
                                        initialValue: 100,
                                        rules: [{ required: true, message: '请输入回源带宽!' }],
                                    })(
                                    <InputNumber/>
                                )}
                                <span style={{marginLeft: "10px"}}>M</span>
                            </FormItem>
                        </Form>
                    );
                }

                preheatNodesView = (
                    <FormItem {...formItemLayout} label="预热节点" required={true}>
                        <Button icon="plus" size={'small'} type="primary" onClick={$.proxy(this.onClickAddNodes, this)}>添加</Button>
                        {getFieldDecorator('nodesList', {
                            rules: [{ validator: this.validateNodesList }],
                        })(
                            <Table rowKey="id" columns={columns} pagination={false} size="small" dataSource={nodesList} />
                        )}
                        <Modal title={nodesList.length === 0 ? '添加预热节点' : '编辑预热节点'}
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

            renderTimeBandTableView(formItemLayout) {
                const { getFieldDecorator } = this.props.form;
                var timeBandView = "", model = this.props.model;
                var  columns = [{
                    title: '时间',
                    dataIndex: 'time',
                    key: 'time',
                },{
                    title: '带宽',
                    dataIndex: 'opType',
                    key: 'opType',
                }, {
                    title: '操作',
                    dataIndex: 'id',
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
                                <a href="javascript:void(0)" id={record.id} onClick={(e) => this.handleEditClick(e)}>
                                    <Icon type="delete" />
                                </a>
                            </Tooltip>
                        );
                        var buttonGroup;
                        // if (record.status == 2) {
                        //     buttonGroup = (<div>{playButton}</div>)
                        // } else if (record.status == 1) {
                            buttonGroup = (
                                <div>
                                    {editButton}
                                    <span className="ant-divider" />
                                    {deleteButton}
                                </div>
                            )
                        // }
                        return buttonGroup
                    },
                }];

                timeBandView = (
                    <FormItem {...formItemLayout} label="分时带宽" required={true}>
                        <Button icon="plus" size={'small'} type="primary" onClick={this.onClickTimeBand}>添加</Button>
                        {getFieldDecorator('timeBand', {
                            rules: [{ validator: this.validateTimeBand }],
                        })(
                            <Table columns={columns} pagination={false} size="small" dataSource={this.state.timeBandList} />
                        )}
                    </FormItem>
                )

                return timeBandView;
            }

            render() {
                const { getFieldDecorator } = this.props.form;
                const formItemLayout = {
                  labelCol: { span: 6 },
                  wrapperCol: { span: 14 },
                };
                const taskNameView = this.renderTaskNameView(formItemLayout);
                const preheatNodesView = this.renderNodesTableView(formItemLayout);
                const timeBandView = this.renderTimeBandTableView(formItemLayout);

                return (
                    <div>
                        <Form onSubmit={this.handleSubmit}>
                            {taskNameView}
                            {preheatNodesView}
                            {timeBandView}
                            <FormItem {...formItemLayout} label="起止时间">
                                {getFieldDecorator('range-time-picker', {
                                        rules: [{ type: 'array', required: true, message: '请选择起止时间！' }],
                                    })(
                                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                )}
                            </FormItem>
                            <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                                <Button type="primary" htmlType="submit">保存</Button>
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