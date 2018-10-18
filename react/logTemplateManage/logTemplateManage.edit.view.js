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
            Icon = Antd.Icon,
            Tooltip = Antd.Tooltip,
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
                this.convertEnumToShowStr = this.convertEnumToShowStr.bind(this);
                this.getFieldExample = this.getFieldExample.bind(this);
                this.validateFieldSeparatorCusValue = this.validateFieldSeparatorCusValue.bind(this);

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

                    dataSourceOriginFieldTag: []
                };
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
                collection.on("add.template.success", $.proxy(this.onSubmitSuccess, this));
                collection.on("add.template.error", $.proxy(this.onGetError, this));
                require(['logTemplateManage.field.model'],function(LogTplManageOriginField){
                    this.logTplManageOriginField = LogTplManageOriginField
                    var originFieldTagArray = LogTplManageOriginField.map((el, index) => {
                            return (<Option key={el.id}>{el.field}</Option>)
                        })
                    this.setState({
                        dataSourceOriginFieldTag: originFieldTagArray
                    });
                }.bind(this));   
            }

            componentWillUnmount() {
                const collection = this.props.ltProps.collection;
                collection.off("add.template.success");
                collection.off("add.template.error");
                if (this.props.isEdit) {   
                    collection.off("template.detail.success");
                    collection.off("template.detail.error");
                }   
            }

            onGetTplDetailSuccess(res) {
                this.groupId = res.groupId;
                this.originCreateTime = res.originCreateTime;
                if (res.fieldSeparator != "\t" &&
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

            convertEnumToShowStr() {
                const { productType, backType, fieldSeparator, 
                        fieldSeparatorCusValue } = this.state;
                const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];

                var dataForShow = {
                    productType: "", 
                    backType: "", 
                    fieldSeparator: ""
                }; 

                if (productType == "DOWNLOAD") {
                    dataForShow.productType = "下载"
                } else if (productType == "LIVE") {
                    dataForShow.productType = "直播"
                }
                if (backType == "CENTER") {
                    dataForShow.backType = "中心回传"
                } else if (backType == "EDGE") {
                    dataForShow.backType = "边缘回传"
                }
                if (fieldSeparator == "custom") {
                    dataForShow.fieldSeparator = fieldSeparatorCusValue
                } else {
                    dataForShow.fieldSeparator = fieldSeparator
                }

                return dataForShow
            }

            renderBaseInfoView(formItemLayout) {
                const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form;
                var baseInfoView = null; 
                // backType的取值类型 DOWNLOAD（下载）LIVE（直播） 
                // backType的取值类型 CENTER（中心回传） EDGE（边缘回传）
                if (this.props.isView) {
                    var dataForShow = this.convertEnumToShowStr()
                    baseInfoView = (
                        <div>
                            <FormItem {...formItemLayout} label="模板名称" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{this.state.name}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="产品线标识" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{dataForShow.productType}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="回传方式" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{dataForShow.backType}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="字段间隔符设置" style={{marginBottom: "0px"}}>
                                <span className="ant-form-text">{dataForShow.fieldSeparator}</span>
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
                                            { max: 64, message: '模板名称定长64个字符!' }
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
                                    <Select style={{ width: 200 }} disabled={this.props.isEdit}>
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
                                                <Option value="\t">tab</Option>
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
                                            rules: [
                                                { validator: this.validateFieldSeparatorCusValue },
                                            ],
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

            validateFieldSeparatorCusValue(rule, value, callback) {
                const { getFieldsValue } = this.props.form;
                const fieldSeparator = getFieldsValue().fieldSeparator
                if (fieldSeparator == "custom" && value == ""){
                    callback('请输入自定义字段间隔符!');
                } else {
                    callback();
                }
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
                    key: 'valueType',
                    render: (text, record) => {
                        var tag = null;
                        if (record.valueType == "ORIGINAL_VALUE")
                            tag = "原值"
                        else if (record.valueType == "FIXED_VALUE")
                            tag = "固定值"
                        else if (record.valueType == "PREFIX_VALUE")
                            tag = "前缀"
                        else if (record.valueType == "SUFFIX_VALUE")
                            tag = "后缀"
                        else if (record.valueType == "PREFIX_AND_SUFFIX_VALUE")
                            tag = "前后缀"
                        return tag
                    }
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
                                <a href="javascript:void(0)" id={record.id} onClick={$.proxy(this.onClickDeleteField, this)}>
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
                            <Modal title={'导出字段'} width={800}
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
                let newField = null, fieldObj;
                validateFields(["originFieldTag", "exportFieldTag", "exportFieldName", "exportFieldType", "valueType", "param"], (err, vals) => {
                    console.log("点击OK时的字段：", vals)
                    if (!err && !isEditField) {
                        fieldObj = _.find(this.logTplManageOriginField, (el)=>{
                            return el.id == vals.originFieldTag
                        })
                        newField = {
                            order: templateFieldList.length + 1,
                            id: Utility.randomStr(8),
                            originFieldTag: fieldObj.field,
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
                        fieldObj = _.find(this.logTplManageOriginField, (el)=>{
                            return (el.id == vals.originFieldTag) || (el.field == vals.originFieldTag)
                        })
                        _.find(templateFieldList, (el) => {
                            if (el.id == curEditField.id) {
                                el.originFieldTag = fieldObj.field,
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

            onClickDeleteField(event) {
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
                                    style={{ width: 300 }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onChange={$.proxy(this.onOriginFieldTagChange, this)}
                                >
                                {this.state.dataSourceOriginFieldTag}
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
                                    <Option value="string">string</Option>
                                    <Option value="int">int</Option>
                                    <Option value="double">double</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="赋值类型">
                            {getFieldDecorator('valueType', {
                                initialValue: curEditField.valueType || "",
                                rules: [{ required: true, message: '请选择赋值类型!' }]
                            })(
                                <Select style={{ width: 200 }} onChange={$.proxy(this.onValueTypeChange, this)}>
                                    <Option value="">请选择</Option> 
                                    <Option value="ORIGINAL_VALUE">原值</Option>
                                    <Option value="FIXED_VALUE">固定值</Option>
                                    <Option value="PREFIX_VALUE">前缀</Option>
                                    <Option value="SUFFIX_VALUE">后缀</Option>
                                    <Option value="PREFIX_AND_SUFFIX_VALUE">前后缀(请以","分割)</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="赋值参数" hasFeedback>
                            {getFieldDecorator('param', {
                                    initialValue: curEditField.param || "",
                                    rules: [{ required: true, message: '请输入赋值参数!' }],
                                })(
                                <Input onChange={$.proxy(this.onParamChange, this)}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="样例">
                            <Alert message={curEditField.example || ""} type="success" style={{minHeight:"40px"}}/>
                        </FormItem>
                    </Form>
                );

                return addEditNodesView;
            }

            getFieldExample(originField, valueType, param) {
                var example = "", prefix, suffix;
                if (valueType && param && originField) {
                    if (valueType == "ORIGINAL_VALUE") {
                        example = "${" + originField + "}"
                    } else if (valueType == "FIXED_VALUE") {
                        example = param
                    } else if (valueType == "PREFIX_VALUE") {
                        example = param + "${" + originField + "}"
                    } else if (valueType == "SUFFIX_VALUE") {
                        example = "${" + originField + "}" + param
                    } else if (valueType == "PREFIX_AND_SUFFIX_VALUE") {
                        prefix = param.split(",")[0]
                        suffix = param.split(",")[1]
                        example = prefix + "${" + originField + "}" + suffix
                    }
                }
                return example
            }

            onOriginFieldTagChange(value) {
                const { setFieldsValue, getFieldsValue } = this.props.form;
                var fieldObj, 
                    curEditField = this.state.curEditField,
                    fieldFormObj = getFieldsValue(),
                    valueType = fieldFormObj.valueType, 
                    param = fieldFormObj.param;

                if (value) {
                    fieldObj = _.find(this.logTplManageOriginField, (el)=>{
                        return el.id == value
                    })
                    setFieldsValue({"exportFieldType": fieldObj.type})
                    curEditField.originFieldName = fieldObj.name
                    curEditField.example = this.getFieldExample(fieldObj.field, valueType, param);
                } else {
                    setFieldsValue({"exportFieldType": ""})
                    curEditField.originFieldName = "";
                    curEditField.example = "";
                }

                this.setState({
                    curEditField: curEditField
                });
            }

            onParamChange(e) {
                const { setFieldsValue, getFieldsValue } = this.props.form;
                var curEditField = this.state.curEditField,
                    fieldFormObj = getFieldsValue(),
                    valueType = fieldFormObj.valueType, 
                    param = e.target.value,
                    originFieldTag = fieldFormObj.originFieldTag,
                    fieldObj = _.find(this.logTplManageOriginField, (el)=>{
                        return (el.id == originFieldTag) || (el.field == originFieldTag)
                    })
                curEditField.example = this.getFieldExample(fieldObj.field, valueType, param);

                this.setState({
                    curEditField: curEditField
                });
            }

            onValueTypeChange(value) {
                const { setFieldsValue, getFieldsValue } = this.props.form;
                var curEditField = this.state.curEditField,
                    fieldFormObj = getFieldsValue(),
                    valueType = value, 
                    param = fieldFormObj.param,
                    originFieldTag = fieldFormObj.originFieldTag,
                    fieldObj = _.find(this.logTplManageOriginField, (el)=>{
                        return (el.id == originFieldTag) || (el.field == originFieldTag)
                    })
                curEditField.example = this.getFieldExample(fieldObj.field, valueType, param);

                this.setState({
                    curEditField: curEditField
                });
            }                          

            onSubmitSuccess (){
                Utility.alerts("保存成功，并发送邮件给日志管理小组发布，请尽快和小组成员联系", "success", 2000);
                this.onClickCancel();
            }

            handleSubmit(e) {
                e.preventDefault();
                const { resetFields, validateFields } = this.props.form;
                resetFields("templateFieldList")
                var checkArray = ["name", "productType", "backType", "fieldSeparator", "fieldSeparatorCusValue", 'lineBreak', 'templateFieldList'];
                if (this.props.isEdit) {
                    checkArray = ["productType", "backType", "fieldSeparator", "fieldSeparatorCusValue", 'lineBreak', "templateFieldList"];
                }
                validateFields(checkArray, function(err, vals) {
                    var postParam, model = this.props.model;
                    const collection = this.props.ltProps.collection;
                    if (!err) {
                        postParam = {
                            name: vals.name || this.state.name,
                            productType: vals.productType,
                            backType: vals.backType,
                            fieldSeparator: vals.fieldSeparator == "custom" ? vals.fieldSeparatorCusValue : vals.fieldSeparator,
                            lineBreak: vals.lineBreak,                    
                            templateFieldList: this.state.templateFieldList,
                        }
                        if (this.props.isEdit) {
                            postParam.groupId = this.groupId,
                            postParam.originCreateTime = this.originCreateTime
                        }
                        collection.addTemplate(postParam);
                        console.log(vals)
                    }
                }.bind(this))
            }

            onClickCancel() {
                const onClickCancelCallback = this.props.ltProps.onClickCancelCallback,
                      onClickHistoryCallback = this.props.ltProps.onClickHistoryCallback;

                if (this.props.backTarget != "history")
                    onClickCancelCallback&&onClickCancelCallback();
                else
                    onClickHistoryCallback&&onClickHistoryCallback({groupId: this.groupId});
            }

            onGetError (error){
                if (error && error.message)
                    Utility.alerts(error.message);
                else if (error && error.Error && error.Error.Message)
                    Utility.alerts(error.Error.Message);
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