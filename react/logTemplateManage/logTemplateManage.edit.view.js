define("logTemplateManage.edit.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], 
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

        class LogTplManageEditForm extends React.Component {
            constructor(props, context) {
                super(props);
                this.onClickCancel = this.onClickCancel.bind(this);
                this.renderBaseInfoView = this.renderBaseInfoView.bind(this);
                this.renderExportFieldTableView = this.renderExportFieldTableView.bind(this);
                this.validateTemplateFieldList = this.validateTemplateFieldList.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);

                this.state = {
                    name: "",
                    productType: "",
                    backType: "",
                    fieldSeparator: "",
                    lineBreak: "",                    
                    templateFieldList: [],
                    isLoadingTplDetail: props.isEdit ? true : false,
                    fieldSeparatorCusValue: "",
                    fieldSepCusValueVisible: "none",
                    fieldModalVisible: false,
                    isEditField: false,
                    curEditField: {},


                    // //分时带宽
                    // timeBandList: [],
                    // timeModalVisible: false,
                    // isEditTime: false,
                    // curEditTime: {},
                };

                moment.locale("zh");
            }

            componentDidMount() {
                var ltProps = this.props.ltProps,
                collection = ltProps.collection;
                if (this.props.isEdit) {
                    var model = this.props.model;
                    collection.on("template.detail.success", $.proxy(this.onGetTplDetailSuccess, this))
                    collection.on("template.detail.error", $.proxy(this.onGetError, this))
                    collection.getTemplateDetail({id: model.id});
                }
                // collection.on("refresh.commit.success", $.proxy(this.onSubmitSuccess, this));
                // collection.on("refresh.commit.error", $.proxy(this.onGetError, this));     
            }

            componentWillUnmount() {
                const collection = this.props.ltProps.collection;
                // collection.off("refresh.commit.success");
                // collection.off("refresh.commit.error");
                if (this.props.isEdit) {   
                    collection.off("template.detail.success");
                    collection.off("template.detail.error");
                }   
            }

            onGetTplDetailSuccess(res) {
                if (res.fieldSeparator != "    " &&
                    res.fieldSeparator != " " &&
                    res.fieldSeparator != "|") {
                    res.fieldSeparatorCusValue = res.fieldSeparator;
                    res.fieldSeparator = "custom";
                }
                _.each(res.templateFieldList, (el) => {
                    el.id = Utility.randomStr(8)
                })
                this.setState({
                    name: res.name,
                    productType: res.productType,
                    backType: res.backType,
                    fieldSeparator: res.fieldSeparator,
                    fieldSeparatorCusValue: res.fieldSeparatorCusValue,
                    fieldSepCusValueVisible: res.fieldSeparator == "custom" ? "inline-block": "none",
                    lineBreak: res.lineBreak,                    
                    templateFieldList: res.templateFieldList,
                    isLoadingTplDetail: false,
                });
            }

            renderBaseInfoView(formItemLayout) {
                const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form;
                var baseInfoView = null, model = this.props.model; 
                // productType的取值类型 DOWNLOAD（下载）LIVE（直播） 
                // backType的取值类型 CENTER（中心回传） EDGE（边缘回传）
                if (this.props.isView) {
                    baseInfoView = (
                        <div>
                            <FormItem {...formItemLayout} label="模板名称" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{this.state.name}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="产品线标识" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{this.state.productType}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="回传方式" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{this.state.backType}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="字段间隔符设置" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{this.state.fieldSeparator}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="换行符设置" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{this.state.lineBreak}</span>
                            </FormItem>
                        </div>
                    )
                } else {
                    baseInfoView = (
                        <div>
                            <FormItem {...formItemLayout} label="模板名称" hasFeedback>
                                {getFieldDecorator('name', {
                                        initialValue: this.state.name,
                                        validateFirst: true,
                                        rules: [
                                            { required: true, message: '请输入模板名称!' },
                                            { pattern: /^[0-9A-Za-z\_]+$/, message: '模板名称只能输入英文数字下划线!' },
                                        ],
                                    })(
                                    <Input disabled={this.props.isEdit}/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="产品线标识">
                                {getFieldDecorator('productType', {
                                    initialValue: this.state.productType,
                                    rules: [{ required: true, message: '请选择产品线标识!' }]
                                })(
                                    <Select style={{ width: 200 }}>
                                        <Option value="">请选择</Option> 
                                        <Option value="LIVE">直播</Option>
                                        <Option value="DOWNLOAD">点播</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={(
                                    <span>
                                        回传方式&nbsp;
                                        <Tooltip title="说明：边缘回传，保证用户的高SLA；边缘回传保证用户的实时性。可根据用户的需要选择合适的回传方式">
                                            <Icon type="question-circle-o" />
                                        </Tooltip>
                                    </span>
                                )}>
                                {getFieldDecorator('backType', {
                                    initialValue: this.state.backType,
                                    rules: [{ required: true, message: '请选择回传方式!' }],
                                })(
                                    <Select style={{ width: 200 }}>
                                        <Option value="">请选择</Option> 
                                        <Option value="CENTER">中心回传</Option>
                                        <Option value="EDGE">边缘回传</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="字段间隔符设置" required={true}>
                                <Col span={12}>
                                    <FormItem>
                                        {getFieldDecorator('fieldSeparator', {
                                            initialValue: this.state.fieldSeparator,
                                            rules: [{ required: true, message: '请选择字段间隔符!' }],
                                        })(
                                            <Select style={{ width: 200 }} onChange={$.proxy(this.onfieldSeparatorChange, this)}>
                                                <Option value="">请选择</Option>
                                                <Option value="    ">tab</Option>
                                                <Option value=" ">空格</Option>
                                                <Option value="|">|</Option>
                                                <Option value="custom">自定义</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12} style={{ display: this.state.fieldSepCusValueVisible}} >
                                    <FormItem>
                                        {getFieldDecorator('fieldSeparatorCusValue', {
                                            initialValue: this.state.fieldSeparatorCusValue,
                                            rules: [{ required: true, message: '请输入自定义字段间隔符!' }],
                                        })(
                                            <Input style={{ width: 200}}
                                                   onChange={$.proxy(this.onfieldSeparatorCusValueChange, this)}/>
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayout} label="换行符设置" hasFeedback>
                                {getFieldDecorator('lineBreak', {
                                        initialValue: this.state.lineBreak,
                                        rules: [{ 
                                            required: true, message: '请输入换行符!' }, {
                                        }],
                                    })(
                                    <Input />
                                )}
                            </FormItem>
                        </div>
                    )
                }

                return baseInfoView
            }

            onfieldSeparatorChange(value, option) {
                const { setFieldsValue } = this.props.form;
                if (value == "custom") {
                    this.setState({
                        fieldSepCusValueVisible: "inline-block"
                    })
                } else {
                    this.setState({
                        fieldSepCusValueVisible: "none"
                    })
                    setFieldsValue({"fieldSeparatorCusValue": this.state.fieldSeparatorCusValue})
                }
            }

            onfieldSeparatorCusValueChange(event) {
                var value = event.target.value
                if (value != "") {
                    this.setState({
                        fieldSeparatorCusValue: value
                    })
                }
            }

            renderExportFieldTableView(formItemLayout) {
                const { getFieldDecorator } = this.props.form;
                const { templateFieldList, fieldModalVisible, curEditField } = this.state;
                var exportFieldListView = "";
                const { isView, isEdit } = this.props;
                var  columns = [{
                    title: '序号',
                    dataIndex: 'order',
                    key: 'order'
                },{
                    title: '原字段标识',
                    dataIndex: 'originFieldTag',
                    key: 'originFieldTag'
                },{
                    title: '原字段名称',
                    dataIndex: 'originFieldName',
                    key: 'originFieldName'
                },{
                    title: '导出字段标识',
                    dataIndex: 'exportFieldTag',
                    key: 'exportFieldTag'
                },{
                    title: '导出字段名称',
                    dataIndex: 'exportFieldName',
                    key: 'exportFieldName'
                },{
                    title: '导出数据类型',
                    dataIndex: 'exportFieldType',
                    key: 'exportFieldType',
                },{
                    title: '赋值类型',
                    dataIndex: 'valueType',
                    key: 'valueType'
                },{
                    title: '赋值参数',
                    dataIndex: 'param',
                    key: 'param'
                },{
                    title: '样例',
                    dataIndex: 'example',
                    key: 'example'
                },{
                    title: '操作',
                    dataIndex: '',
                    key: 'action',
                    render: (text, record) => {
                        var editButton = (
                            <Tooltip placement="bottom" title={"编辑"}>
                                <a href="javascript:void(0)" id={record.id} onClick={$.proxy(this.onClickEditField, this)}>
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
                        } else {
                            buttonGroup = (
                                <div>
                                    {editButton}
                                    <span className="ant-divider" />
                                    {deleteButton}
                                </div>
                            )
                        } 
                        return buttonGroup
                    },
                }];

                var addEditFieldView = "", addButton = "";

                if (!this.props.isView){
                    addEditFieldView =  this.renderAddEditFieldView(formItemLayout)//<div style={{textAlign: "center"}}><Spin /></div>
                    addButton = (<Button icon="plus" size={'small'} onClick={$.proxy(this.onClickAddField, this)}>新增</Button>)
                }

                exportFieldListView = (
                    <div>
                        <FormItem {...formItemLayout} label="导出字段列表" required={true}>
                            {addButton}
                        </FormItem>
                        <FormItem wrapperCol={{ span: 24 }}>
                            {getFieldDecorator('templateFieldList', {
                                rules: [{ validator: this.validateTemplateFieldList }],
                            })(
                                <Table rowKey="order" columns={columns} pagination={false} size="small" dataSource={templateFieldList} />
                            )}
                            <Modal title={'导出字段'} destroyOnClose={true} width={800}
                                   destroyOnClose={true}
                                   visible={fieldModalVisible}
                                   onOk={$.proxy(this.handleFieldOk, this)}
                                   onCancel={$.proxy(this.handleModalCancel, this)}>
                                   {addEditFieldView}
                            </Modal>
                        </FormItem>
                    </div>
                )

                return exportFieldListView;
            }

            validateTemplateFieldList (rule, value, callback) {
                if (this.state.templateFieldList.length != 0) {
                    callback();
                } else {
                    callback('请添加导出字段列表！');
                }
            }

            onClickAddField (event) {
                this.setState({
                    isEditField:false,
                    curEditField: {},
                    fieldModalVisible: true,
                });
            }

            handleFieldOk (e){
                // "order": 1,
                // "originFieldTag": "log_type",
                // "originFieldName": "日志类型",
                // "exportFieldTag": "log_type",
                // "exportFieldName": "导出日志类型",
                // "exportFieldType": "string",
                // "valueType": "ORIGINAL_VALUE",
                // "param": "参数",
                // "example": "${log_type}"
                e.preventDefault();
                const { templateFieldList, isEditField, curEditField } = this.state;
                const { getFieldsValue, validateFields, resetFields } = this.props.form;
                let newField = null;
                validateFields(["originFieldTag", "exportFieldTag", "exportFieldName", "exportFieldType", "valueType", "param"], (err, vals) => {
                    console.log(vals)
                    console.log(getFieldsValue())
                    if (!err && !isEditField) {
                        newField = {
                            order: templateFieldList.length + 1,
                            id: Utility.randomStr(8),
                            originFieldTag: vals.originFieldTag,
                            originFieldName: curEditField.originFieldName,
                            exportFieldTag: vals.exportFieldTag,
                            exportFieldName: vals.exportFieldName,
                            exportFieldType: vals.exportFieldType,
                            valueType: vals.valueType,
                            param: vals.param,
                            example: curEditField.example
                        }
                        this.setState({
                            templateFieldList: [...templateFieldList, newField],
                            fieldModalVisible: false
                        });
                    } else if (!err && isEditField) {
                        _.find(templateFieldList, (el) => {
                            if (el.id == curEditNode.id) {
                                el.originFieldTag = vals.originFieldTag,
                                el.originFieldName = curEditField.originFieldName,
                                el.exportFieldTag = vals.exportFieldTag,
                                el.exportFieldName = vals.exportFieldName,
                                el.exportFieldType = vals.exportFieldType,
                                el.valueType = vals.valueType,
                                el.param = vals.param,
                                el.example = curEditField.example
                            }
                        })

                        this.setState({
                            templateFieldList: [...templateFieldList],
                            fieldModalVisible: false
                        });
                    }
                })
            }

            handleModalCancel (){
                this.setState({
                    fieldModalVisible: false
                });
            }

            onClickEditField(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = _.find(this.state.templateFieldList, function(obj){
                        return obj.id == id
                    }.bind(this))
                this.setState({
                    fieldModalVisible: true,
                    isEditField: true,
                    curEditField: model
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
                        var list = _.filter(this.state.templateFieldList, function(obj){
                                return obj.id !== id
                            }.bind(this))
                        _.each(list, (el, index)=>{
                            el.order = index + 1
                        })
                        this.setState({
                            templateFieldList: list
                        })
                    }.bind(this)
                  });
            }

            renderAddEditFieldView(formItemLayout) {
                const { getFieldDecorator } = this.props.form;
                const { curEditField, isEditField} = this.state;
                var addEditNodesView = "";
                addEditNodesView = (
                    <Form>
                        <FormItem {...formItemLayout} label="原字段标识">
                            {getFieldDecorator('originFieldTag', {
                                initialValue: curEditField.originFieldTag || "",
                                rules: [{ required: true, message: '请选择原字段标识!' }]
                            })(
                                <Select
                                    showSearch
                                    allowClear={true}
                                    style={{ width: 200 }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="tom">Tom</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="原字段名称">
                            <span className="ant-form-text">{curEditField.originFieldName || ""}</span>
                        </FormItem>
                        <FormItem {...formItemLayout} label="导出字段标识" hasFeedback>
                            {getFieldDecorator('exportFieldTag', {
                                    initialValue: curEditField.exportFieldTag || "",
                                    rules: [{ required: true, message: '请输入导出字段标识!' }],
                                })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="导出字段名称" hasFeedback>
                            {getFieldDecorator('exportFieldName', {
                                    initialValue: curEditField.exportFieldName || "",
                                    rules: [{ required: true, message: '请输入导出字段名称!' }],
                                })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="导出数据类型">
                            {getFieldDecorator('exportFieldType', {
                                initialValue: curEditField.exportFieldType || "",
                                rules: [{ required: true, message: '请选择原字段标识!' }]
                            })(
                                <Select style={{ width: 200 }}>
                                    <Option value="">请选择</Option> 
                                    <Option value="LIVE">直播</Option>
                                    <Option value="DOWNLOAD">点播</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="赋值类型">
                            {getFieldDecorator('valueType', {
                                initialValue: curEditField.valueType || "",
                                rules: [{ required: true, message: '请选择赋值类型!' }]
                            })(
                                <Select style={{ width: 200 }}>
                                    <Option value="">请选择</Option> 
                                    <Option value="LIVE">直播</Option>
                                    <Option value="DOWNLOAD">点播</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="赋值参数" hasFeedback>
                            {getFieldDecorator('param', {
                                    initialValue: curEditField.param || "",
                                    rules: [{ required: true, message: '请输入赋值参数!' }],
                                })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="样例">
                            <Alert message={curEditField.example || ""} type="success" style={{minHeight:"40px"}}/>
                        </FormItem>
                    </Form>
                );

                return addEditNodesView;
            }                          

            onSubmitSuccess (){
                Utility.alerts("保存成功！", "success", 2000);
                this.onClickCancel();
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
                    const collection = this.props.ltProps.collection;
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
                const onClickCancelCallback = this.props.ltProps.onClickCancelCallback;
                onClickCancelCallback&&onClickCancelCallback();
            }

            handleTimeCancel (){
                this.setState({
                    timeModalVisible: false
                });
            }

            handleNodeSearch (value) {
                var ltProps = this.props.ltProps;
                var nodeArray = [], nodeList = ltProps.nodeList;
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

            onGetError (error){
                if (error && error.message)
                    Utility.alerts(error.message);
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！");
            }

            render() {
                const { getFieldDecorator } = this.props.form;
                const formItemLayout = {
                  labelCol: { span: 6 },
                  wrapperCol: { span: 12 },
                };
                const baseInfoView = this.renderBaseInfoView(formItemLayout);
                const exportFieldListView = this.renderExportFieldTableView(formItemLayout);
                let saveButton = null, editView = null;
                if (!this.props.isView)
                    saveButton = (<Button type="primary" htmlType="submit">保存</Button>)

                if (this.state.isLoadingTplDetail) {
                    editView =  <div style={{textAlign: "center"}}><Spin /></div>
                } else { 
                    editView = (
                        <div>
                            <Form onSubmit={this.handleSubmit}>
                                {baseInfoView}
                                {exportFieldListView}
                                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                                    {saveButton}
                                    <Button onClick={this.onClickCancel} style={{marginLeft: "10px"}}>取消</Button>
                                </FormItem>
                            </Form>
                        </div>
                    );
                }

                return editView
            }
        }

        const LogTplManageEditView = Form.create()(LogTplManageEditForm);    
        return LogTplManageEditView;
    }
);