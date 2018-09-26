define("logTaskList.edit.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], 
    function(require, exports, template, BaseView, Utility, Antd, React, moment) {

        var Button = Antd.Button,
            Input = Antd.Input,
            InputNumber = Antd.InputNumber,
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
            confirm = Modal.confirm,
            Popover = Antd.Popover,
            Tag = Antd.Tag,
            AutoComplete = Antd.AutoComplete;

        class logTaskListEditForm extends React.Component {
            constructor(props, context) {
                super(props);
                this.onClickCancel = this.onClickCancel.bind(this);
                this.renderBaseInfoView = this.renderBaseInfoView.bind(this);
                this.renderConditionTableView = this.renderConditionTableView.bind(this);
                this.validateTemplateFieldList = this.validateTemplateFieldList.bind(this);
                this.validateBackGetLogName = this.validateBackGetLogName.bind(this);
                this.validateDomains = this.validateDomains.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
                this.convertEnumToShowStr = this.convertEnumToShowStr.bind(this);

                this.state = {
                    name: "",//"任务名称",
                    templateName: "",//"模板名称",
                    accountId: "",
                    domainType: "FULLSCALE", //DomainType 域名类型 FUULLSCALE（全量域名） CUSTOM（自定义域名）
                    domains: [],
                    backUrl: "",
                    productType: "",

                    backMethod: "", //回传方法
                    senderType: "", 
                    backGetLogName: "",
                    senderType: "",
                    batchCount: 100, //多条发送上限
                    batchInterval: 60, //单批次最大延迟发送时间
                    logRange: "", //日志范围  EDGE（边缘） EDGE_AND_UPPER （边缘+上层）
                    compressMode: "", //压缩方式 TEXT（txt） LZ4（lz4）  GZ（gzip）
                    userAgent: "",
                    tokenKey: "",
                    taskTokenType: "KEY_FIRST", //任务TOKEN类型   KEY_FIRST （key在前时间在后） KEY_LAST （key在后时间在前）
                    taskTokenTimeType: "", //任务TOKEN日期类型 WITH_CROSS（有横线 例如 2010-08-12） NO_CROSS （无横线 例如 20100812）
                    taskConditionList: [],

                    dataSourceUserId: [],
                    dataSourceTemplateName: [],
                    dataSourceDomains: [],
                    dataSourceOriginFieldTag: [],
                    domainsVisible: "none",
                    backGetLogNameVisible: "none",
                    senderTypeVisible: "none",

                    isLoadingTplDetail: true,
                    fieldModalVisible: false,
                    isEditField: false,
                    curEditField: {}
                };

                this.userIdList = [];
            }

            componentDidMount() {
                var ltProps = this.props.ltProps,
                collection = ltProps.collection;
                require(['customerSetup.model'],function(CustomerSetupModel){
                    var customerSetup = new CustomerSetupModel();
                    customerSetup.on("get.user.success", $.proxy(this.onGetUserListSuccess, this))
                    customerSetup.on("get.user.error", $.proxy(this.onGetError, this))
                    customerSetup.queryChannel({currentPage: 1,pageSize: 99999});
                }.bind(this));
                collection.on("template.selectList.success", $.proxy(this.onGetTplByProductTypeSuccess, this))
                collection.on("template.selectList.error", $.proxy(this.onGetError, this))
                collection.on("add.task.success", $.proxy(this.onSubmitSuccess, this))
                collection.on("add.task.error", $.proxy(this.onGetError, this))
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
                if (this.props.isEdit) {   
                    collection.off("task.detail.success");
                    collection.off("task.detail.error");
                }
                collection.off("template.selectList.success")
                collection.off("template.selectList.error")
                collection.off("add.task.success")
                collection.off("add.task.error")
            }

            onGetUserListSuccess(res) {
                _.each(res.data, function(el){
                    this.userIdList.push(el.userId)
                }.bind(this))

                var ltProps = this.props.ltProps,
                collection = ltProps.collection;
                var model = this.props.model;
                if (this.props.isEdit) {
                    collection.on("task.detail.success", $.proxy(this.onGetTaskDetailSuccess, this))
                    collection.on("task.detail.error", $.proxy(this.onGetError, this))
                    collection.getTaskDetail({id: model.id});
                } else {
                    this.setState({
                        isLoadingTplDetail: false,
                    });
                }
            }

            onSubmitSuccess (){
                Utility.alerts("保存成功！", "success", 2000);
                this.onClickCancel();
            }

            onGetTaskDetailSuccess(res) {
                this.groupId = res.groupId;
                this.originCreateTime = res.originCreateTime;

                _.each(res.taskConditionList, (el) => {
                    el.id = Utility.randomStr(8)
                })
                this.setState({
                    name: res.name,
                    templateName: res.templateName,
                    accountId: res.accountId,
                    domainType: res.domainType,
                    domains: res.domains,
                    backUrl: res.backUrl,
                    productType: res.productType,

                    backMethod: res.taskFieldJson.backMethod,
                    senderType: res.taskFieldJson.senderType, 
                    backGetLogName: res.taskFieldJson.backGetLogName,
                    senderType: res.taskFieldJson.senderType,
                    batchCount: res.taskFieldJson.batchCount, 
                    batchInterval: res.taskFieldJson.batchInterval,
                    logRange: res.taskFieldJson.logRange,
                    compressMode: res.taskFieldJson.compressMode,
                    userAgent: res.taskFieldJson.userAgent,
                    tokenKey: res.taskFieldJson.tokenKey,
                    taskTokenType: res.taskFieldJson.taskTokenType, 
                    taskTokenTimeType: res.taskFieldJson.taskTokenTimeType,
                    taskConditionList: res.taskFieldJson.taskConditionList,

                    isLoadingTplDetail: false,
                });
            }

            convertEnumToShowStr() {
                const { taskTokenTimeType, taskTokenType, backMethod, 
                        tokenKey, backGetLogName, senderType, domainType, domains,
                        logRange, compressMode } = this.state;
                const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];

                var dataForShow = {
                    token: "", 
                    taskTokenTimeType: "", 
                    backGetLogName: "", 
                    senderType: "",
                    domainType: "", 
                    domainContent: "全量域名", 
                    logRange: "", 
                    compressMode: ""
                };
                if (taskTokenTimeType == "WITH_CROSS") {
                    dataForShow.taskTokenTimeType = "yyyy-MM-dd"
                } else if (taskTokenTimeType == "NO_CROSS") {
                    dataForShow.taskTokenTimeType = "yyyyMMdd"
                }
                if (taskTokenType == "KEY_FIRST") {
                    dataForShow.token = "方式一：md5({key:" + tokenKey + "}{time:" + dataForShow.taskTokenTimeType + "})"
                } else if (taskTokenType == "KEY_LAST ") {
                    dataForShow.token = "方式一：md5({time:" + dataForShow.taskTokenTimeType + "}{key:" + tokenKey + "})"
                }
                if (backMethod == "GET") {
                    dataForShow.backGetLogName = ", 参数名称：" + backGetLogName
                } else if (backMethod == "POST" && senderType == "TEXT") {
                    dataForShow.backGetLogName = ", 是否以数组形式回传：否"
                } else if (backMethod == "POST" && senderType == "ARRAY") {
                    dataForShow.backGetLogName = ", 是否以数组形式回传：是"
                } 
                if (domainType == "FULLSCALE") {
                    dataForShow.domainType = "全量域名";
                } else if (domainType == "CUSTOM") {
                    dataForShow.domainType = "自定义域名";
                    if (domains) {
                        dataForShow.domainContent = domains.map((el, index) => {
                            var random = Math.floor(Math.random() * colors.length)
                            return (<Tag color={colors[random]} key={index} style={{marginBottom: '5px'}}>{el}</Tag>)
                        })
                    }
                }
                if (logRange == "EDGE") {
                    dataForShow.logRange = "边缘"
                } else if (logRange == "EDGE_AND_UPPER") {
                    dataForShow.logRange = "边缘+上层"
                }
                if (compressMode == "TEXT") {
                    dataForShow.compressMode = "txt"
                } else if (compressMode == "LZ4") {
                    dataForShow.compressMode = "lz4"
                } else if (compressMode == "GZ") {
                    dataForShow.compressMode = "gzip"
                }
                return dataForShow
            }

            renderBaseInfoView(formItemLayout) {
                const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form;
                var baseInfoView = null, dataShow = this.convertEnumToShowStr(), 
                    wrapperCol204 = { span: 22, offset: 2 }, wrapperCol22= { span: 20 }, 
                    tokenTypeTxt1 = "md5({key: TOKEN KEY}{time: TOKEN 日期})",
                    tokenTypeTxt2 = "md5({time: TOKEN 日期}{key: TOKEN KEY})";
                if (this.props.isView) {
                    baseInfoView = (
                        <div>
                            <FormItem wrapperCol={wrapperCol204}>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="任务名称">
                                        <span className="ant-form-text">{this.state.name}</span>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="客户ID">
                                        <span className="ant-form-text">{this.state.accountId}</span>
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol204}>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="产品线">
                                        <span className="ant-form-text">{this.state.productType}</span>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="模版名称">
                                        <span className="ant-form-text">{this.state.templateName}</span>
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol204}>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="域名标识">
                                        <Popover content={dataShow.domainContent} trigger="click" placement="bottom">
                                            <Tag color={"green"}>{dataShow.domainType}</Tag>
                                        </Popover>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="回传地址">
                                        <span className="ant-form-text">{this.state.backUrl}</span>
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <hr />
                            <FormItem wrapperCol={wrapperCol204}>
                                <Col span={24}>
                                    <FormItem labelCol= {{ span: 4 }} wrapperCol={{ span: 20 }} label="回传方法">
                                        <span className="ant-form-text">{this.state.backMethod}{dataShow.backGetLogName}</span>
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol204}>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="多条发送上限">
                                        <span className="ant-form-text">{this.state.batchCount}</span>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label="单批次最大延迟发送时间">
                                        <span className="ant-form-text">{this.state.batchInterval}s</span>
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol204}>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="日志发送范围">
                                        <span className="ant-form-text">{dataShow.logRange}</span>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="压缩方式">
                                        <span className="ant-form-text">{dataShow.compressMode}</span>
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol204}>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="User-Agent">
                                        <span className="ant-form-text">{this.state.userAgent}</span>
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol204}>
                                <Col span={24}>
                                    <FormItem labelCol = {{ span: 4 }} wrapperCol={{ span: 20 }} label="token">
                                        <span className="ant-form-text">{dataShow.token}</span>
                                    </FormItem>
                                </Col>
                            </FormItem>
                        </div>
                    )
                } else {
                    baseInfoView = (
                        <div>
                            <FormItem wrapperCol={wrapperCol22}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="任务名称" hasFeedback>
                                        {getFieldDecorator('name', {
                                                initialValue: this.state.name,
                                                validateFirst: true,
                                                rules: [
                                                    { required: true, message: '请输入任务名称!' },
                                                    //{ pattern: /^[0-9A-Za-z\_]+$/, message: '任务名称只能输入英文数字下划线!' },
                                                ],
                                            })(
                                            <Input disabled={this.props.isEdit}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="客户ID">
                                        {getFieldDecorator('accountId', {
                                            initialValue: this.state.accountId,
                                            rules: [{ required: true, message: '请输入客户ID!' }]
                                        })(
                                            <AutoComplete
                                                style={{ width: 200 }}
                                                onBlur={$.proxy(this.onAccountIdChange, this)}
                                                onSearch={$.proxy(this.handleUserIdSearch, this)}>
                                            {this.state.dataSourceUserId}
                                            </AutoComplete>
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol22}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="产品线">
                                        {getFieldDecorator('productType', {
                                            initialValue: this.state.productType,
                                            rules: [{ required: true, message: '请选择产品线!' }]
                                        })(
                                            <Select style={{ width: 200 }} onChange={$.proxy(this.onProductTypeChange, this)}>
                                                <Option value="">请选择</Option> 
                                                <Option value="LIVE">直播</Option>
                                                <Option value="DOWNLOAD">点播</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                     <FormItem {...formItemLayout} label="模版名称">
                                        {getFieldDecorator('templateName', {
                                            initialValue: this.state.templateName,
                                            rules: [{ required: true, message: '请输入模版名称!' }]
                                        })(
                                            <Select style={{ width: 200 }} labelInValue>
                                               {this.state.dataSourceTemplateName}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol22}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={(
                                        <span>
                                            域名标识&nbsp;
                                            <Tooltip title="说明：（1）选择全量域名标识后，系统可通过客户ID关联出该客户的全量域名，并同步增减域，每次域名变化无需再次更改日志的配置（2）选择可配置域名后，需要继续配置客户回传域名，且后续可更改">
                                                <Icon type="question-circle-o" />
                                            </Tooltip>
                                        </span>
                                    )}>
                                        {getFieldDecorator('domainType', {
                                            initialValue: this.state.domainType,
                                            rules: [{ required: true, message: '请选择域名标识!' }]
                                        })(
                                            <Select style={{ width: 200 }} onChange={$.proxy(this.onDomainTypeChange, this)}>
                                                <Option value="">请选择</Option> 
                                                <Option value="FULLSCALE">全量域名</Option>
                                                <Option value="CUSTOM">自定义域名</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="客户回传域名设置" required={true} style={{display: this.state.domainsVisible}}>
                                        {getFieldDecorator('domains', {
                                            initialValue: this.state.domains,
                                            rules: [
                                                { validator: this.validateDomains },
                                            ],
                                        })(
                                            <Select mode="multiple" allowClear={true}
                                                    placeholder={'请选择'}
                                                    maxTagCount={1}
                                                    notFoundContent={<Spin size="small" />} 
                                                    filterOption={false} >
                                                    {this.state.dataSourceDomains}       
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem style={{display: this.state.domainsVisible}}>
                                        <span style={{marginLeft: "10px"}}>共{this.state.dataSourceDomains.length}个域名</span>
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol22}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="回传地址" hasFeedback>
                                        {getFieldDecorator('backUrl', {
                                                initialValue: this.state.name,
                                                validateFirst: true,
                                                rules: [
                                                    { required: true, message: '请输入回传地址!' },
                                                    //{ pattern: /^[0-9A-Za-z\_]+$/, message: '任务名称只能输入英文数字下划线!' },
                                                ],
                                            })(
                                            <Input style={{width: "600px"}}/>
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <hr />
                            <FormItem wrapperCol={wrapperCol22}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={"回传方法"}>
                                        {getFieldDecorator('backMethod', {
                                            initialValue: this.state.backMethod,
                                            rules: [{ required: true, message: '请选择回传方法!' }]
                                        })(
                                            <Select style={{ width: 200 }} onChange={$.proxy(this.onBackMethodChange, this)}>
                                                <Option value="">请选择</Option>  
                                                <Option value="GET">GET</Option>
                                                <Option value="POST">POST</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={(
                                        <span>
                                            参数名&nbsp;
                                            <Tooltip title="回传方式选择Get时，需要设置参数名，比如log=****">
                                                <Icon type="question-circle-o" />
                                            </Tooltip>
                                        </span>
                                    )} required={true} style={{display: this.state.backGetLogNameVisible}}>
                                        {getFieldDecorator('backGetLogName', {
                                            initialValue: this.state.backGetLogName,
                                            rules: [
                                                { validator: this.validateBackGetLogName },
                                            ],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={"是否以数组形式回传"} 
                                        required={true} 
                                        style={{display: this.state.senderTypeVisible}}>
                                        {getFieldDecorator('senderType', {
                                            initialValue: this.state.senderType,
                                            rules: [
                                                { validator: $.proxy(this.validateSendType, this) },
                                            ],
                                        })(
                                            <Select style={{ width: 200 }} onChange={$.proxy(this.onDomainTypeChange, this)}>
                                                <Option value="">请选择</Option> 
                                                <Option value="TEXT">否</Option>
                                                <Option value="ARRAY">是</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol22}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={(
                                        <span>
                                            多条发送上限&nbsp;
                                            <Tooltip title="最大发送上限1000条">
                                                <Icon type="question-circle-o" />
                                            </Tooltip>
                                        </span>
                                    )}>
                                        {getFieldDecorator('batchCount', {
                                            initialValue: this.state.batchCount,
                                            rules: [
                                                { required: true, message: '请输入多条发送上限!' },
                                            ],
                                        })(
                                            <InputNumber min={1} max={1000}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={(
                                        <span>
                                            单批次最大延迟发送时间&nbsp;
                                            <Tooltip title="该配置与多条发送上限满足一个即发送">
                                                <Icon type="question-circle-o" />
                                            </Tooltip>
                                        </span>
                                    )}>
                                        {getFieldDecorator('batchInterval', {
                                            initialValue: this.state.batchInterval,
                                            rules: [
                                                { required: true, message: '请输入单批次最大延迟发送时间!' }
                                            ],
                                        })(
                                            <InputNumber/>
                                        )}
                                        <span style={{marginLeft: "10px"}}>S</span>
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol22}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={"日志发送范围"}>
                                        {getFieldDecorator('logRange', {
                                            initialValue: this.state.logRange,
                                            rules: [{ required: true, message: '请选择日志发送范围!' }]
                                        })(
                                            <Select style={{ width: 200 }}>
                                                <Option value="">请选择</Option>  
                                                <Option value="EDGE">边缘</Option>
                                                <Option value="EDGE_AND_UPPER">边缘+上层</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={"压缩方式"}>
                                        {getFieldDecorator('compressMode', {
                                            initialValue: this.state.compressMode,
                                            rules: [{ required: true, message: '请选择压缩方式!' }]
                                        })(
                                            <Select style={{ width: 200 }}>
                                                <Option value="">请选择</Option>  
                                                <Option value="TEXT">txt</Option>
                                                <Option value="LZ4">lz4</Option>
                                                <Option value="GZ">gzip</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol22}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="User-Agent">
                                        {getFieldDecorator('userAgent', {
                                            initialValue: this.state.userAgent,
                                            rules: [
                                                { required: true, message: '请输入User-Agent!' },
                                            ],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol22}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={(
                                        <span>
                                            TOKEN类型&nbsp;
                                            <Tooltip title="（1）token为32字节长度鉴权串;（2）id为8字节长度字符串，每次请求分配不同id，用于区分不同请求；（3）cdnkey为分配给cdn厂商的密钥；（4）time为时间戳，包含三种格式：UNIX时间戳，2018-05-08 14:00:00， 20180508141156">
                                                <Icon type="question-circle-o" />
                                            </Tooltip>
                                        </span>
                                    )}>
                                        {getFieldDecorator('taskTokenType', {
                                            initialValue: this.state.taskTokenType,
                                            rules: [{ required: true, message: '请选择域名标识!' }]
                                        })(
                                            <Select style={{ width: 500 }}>
                                                <Option value="KEY_FIRST">方式一：KEY在前时间在后 {tokenTypeTxt1}</Option>
                                                <Option value="KEY_LAST">方式二：KEY在后时间在前 {tokenTypeTxt2}</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <FormItem wrapperCol={wrapperCol22}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="TOKEN KEY">
                                        {getFieldDecorator('tokenKey', {
                                            initialValue: this.state.tokenKey,
                                            rules: [
                                                { required: true, message: '请输入TOKEN KEY!' },
                                            ],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={"TOKEN日期类型"}>
                                        {getFieldDecorator('taskTokenTimeType', {
                                            initialValue: this.state.taskTokenTimeType,
                                            rules: [{ required: true, message: '请选择TOKEN日期类型!' }]
                                        })(
                                            <Select style={{ width: 200 }}>
                                                <Option value="">请选择</Option>
                                                <Option value="WITH_CROSS">yyyy-MM-dd</Option>
                                                <Option value="NO_CROSS">yyyyMMdd</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                        </div>
                    )
                }

                return baseInfoView
            }

            handleUserIdSearch(value) {
                if (value.length < 3) return;
                var IdArray = [], userIdList = this.userIdList;
                if (value && userIdList) {
                    IdArray = _.filter(userIdList, function(el){
                        var id = el + ""
                        return id.indexOf(value) > -1
                    }.bind(this)).map((el) => {
                        el = el + ""
                        return <Option key={el}>{el}</Option>;
                    })
                }

                this.setState({
                    dataSourceUserId: IdArray
                });
            }

            onProductTypeChange(value) {
                const { setFieldsValue, getFieldsValue } = this.props.form;
                setFieldsValue({"templateName": ""})
                this.setState({
                    dataSourceTemplateName: []
                })
                var ltProps = this.props.ltProps,
                collection = ltProps.collection,
                applicationType = "", 
                accountId = getFieldsValue().accountId;
                if (value) {
                    collection.getTemplateByProductType({productType: value});
                    if (accountId) {
                        applicationType = value == "LIVE" ? 203 : 202
                        require(['domainList.model'],function(DomainListModel){
                            var domainListModel = new DomainListModel();
                            domainListModel.on("query.domain.success", $.proxy(this.onGetDomainListSuccess, this))
                            domainListModel.on("query.domain.error", $.proxy(this.onGetError, this))
                            domainListModel.getDomainInfoList({
                                currentPage: 1,
                                applicationType: applicationType,
                                pageSize: 99999,
                                userId: accountId
                            });
                        }.bind(this));
                    }
                }
            }

            onGetTplByProductTypeSuccess(res) {
                var tplArray = res.map((el) => {
                        return <Option key={el.groupId}>{el.name}</Option>;
                    })
                this.setState({
                    dataSourceTemplateName: tplArray
                })
            }

            onAccountIdChange(value) {
                const { setFieldsValue, getFieldsValue } = this.props.form;
                setFieldsValue({"domains": []})
                this.setState({
                    dataSourceDomains: []
                })
                var productType = getFieldsValue().productType,
                    applicationType = productType == "LIVE" ? 203 : 202

                if (!productType) applicationType = null;

                if (value) {
                    require(['domainList.model'],function(DomainListModel){
                        var domainListModel = new DomainListModel();
                        domainListModel.on("query.domain.success", $.proxy(this.onGetDomainListSuccess, this))
                        domainListModel.on("query.domain.error", $.proxy(this.onGetError, this))
                        domainListModel.getDomainInfoList({
                            currentPage: 1,
                            applicationType: applicationType,
                            pageSize: 99999,
                            userId: value
                        });
                    }.bind(this));
                }
            }

            onGetDomainListSuccess(res) {
                var domainArray = res.data.map((el) => {
                        return <Option key={el.originDomain.domain}>{el.originDomain.domain}</Option>;
                    })
                this.setState({
                    dataSourceDomains: domainArray
                })
            }

            onDomainTypeChange(value) {
                if (value == "CUSTOM") {
                    this.setState({
                        domainsVisible: "list-item"
                    })
                } else {
                    this.setState({
                        domainsVisible: "none"
                    })
                }
            }

            onBackMethodChange(value) {
                const { resetFields } = this.props.form;
                if (value == "GET") {
                    this.setState({
                        backGetLogNameVisible: "list-item",
                        senderTypeVisible: "none"
                    })
                } else if (value == "POST"){
                    this.setState({
                        backGetLogNameVisible: "none",
                        senderTypeVisible: "list-item"
                    })
                } else {
                    this.setState({
                        backGetLogNameVisible: "none",
                        senderTypeVisible: "none"
                    })
                }
                resetFields("backGetLogName")
                resetFields("senderType")
            }

            renderConditionTableView(formItemLayout) {
                const { getFieldDecorator } = this.props.form;
                const { taskConditionList, fieldModalVisible, curEditField } = this.state;
                var conditionListView = "";
                const { isView, isEdit } = this.props;
                var  columns = [{
                    title: '原字段标识',
                    dataIndex: 'originTag',
                    key: 'originTag'
                },{
                    title: '关系',
                    dataIndex: 'conditionType',
                    key: 'conditionType',
                    render: (text, record) => {
                        var tag = null;
                        if (record.conditionType == "NE")
                            tag = (<Tag color={"red"}>不相等</Tag>)
                        else if (record.conditionType == "EQ")
                            tag = <Tag color={"green"}>相等</Tag>
                        else if (record.conditionType == "IN")
                            tag = <Tag color={"blue"}>包含</Tag>
                        else if (record.conditionType == "NIN")
                            tag = <Tag color={"orange"}>不包含</Tag>
                        return tag
                    }
                },{
                    title: '值',
                    dataIndex: 'value',
                    key: 'value'
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
                    addEditFieldView =  this.renderAddEditFieldView({
                      labelCol: { span: 6 },
                      wrapperCol: { span: 12 },
                    })
                    addButton = (<Button icon="plus" size={'small'} onClick={$.proxy(this.onClickAddField, this)}>新增</Button>)
                }
                conditionListView = (
                    <div>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label="条件限制">
                            {addButton}
                        </FormItem>
                        <FormItem wrapperCol={{ span: 16, offset: 4}}>
                            {getFieldDecorator('taskConditionList', {
                                rules: [
                                   { validator: this.validateTemplateFieldList }
                                ],
                            })(
                                <Table rowKey="id" columns={columns} pagination={false} size="small" dataSource={taskConditionList} />
                            )}
                            <Modal title={'条件限制'}
                                   destroyOnClose={true}
                                   visible={fieldModalVisible}
                                   onOk={$.proxy(this.handleFieldOk, this)}
                                   onCancel={$.proxy(this.handleModalCancel, this)}>
                                   {addEditFieldView}
                            </Modal>
                        </FormItem>
                    </div>
                )

                return conditionListView;
            }

            validateTemplateFieldList (rule, value, callback) {
                //if (this.state.taskConditionList.length != 0) {
                    callback();
                // } else {
                //     callback('请添加条件限制！');
                // }
            }

            validateBackGetLogName (rule, value, callback) {
                const { getFieldsValue } = this.props.form;
                const backMethod = getFieldsValue().backMethod
                if (backMethod == "GET" && value == ""){
                    callback('请添加参数名称！');
                } else {
                    callback();
                }
            }

            validateSendType (rule, value, callback) {
                const { getFieldsValue } = this.props.form;
                const backMethod = getFieldsValue().backMethod
                if (backMethod == "POST" && value == ""){
                    callback('请选择是否以数组形式回传！');
                } else {
                    callback();
                }
            }

            validateDomains(rule, value, callback) {
                const { getFieldsValue } = this.props.form;
                const domainType = getFieldsValue().domainType
                if (domainType == "CUSTOM" && value.length == 0){
                    callback('请选择域名！');
                } else {
                    callback();
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
                e.preventDefault();
                const { taskConditionList, isEditField, curEditField } = this.state;
                const { getFieldsValue, validateFields, resetFields } = this.props.form;
                let newField = null, fieldObj;
                validateFields(["originTag", "conditionType", "value"], (err, vals) => {
                    if (!err && !isEditField) {
                        fieldObj = _.find(this.logTplManageOriginField, (el)=>{
                            return el.id == vals.originTag
                        })
                        newField = {
                            id: Utility.randomStr(8),
                            originTag: fieldObj.field,
                            conditionType: vals.conditionType,
                            value: vals.value
                        }
                        this.setState({
                            taskConditionList: [...taskConditionList, newField],
                            fieldModalVisible: false
                        });
                    } else if (!err && isEditField) {
                        fieldObj = _.find(this.logTplManageOriginField, (el)=>{
                            return (el.id == vals.originTag) || (el.field == vals.originTag)
                        })
                        _.find(taskConditionList, (el) => {
                            if (el.id == curEditField.id) {
                                el.originTag = fieldObj.field
                                el.conditionType = vals.conditionType
                                el.value = vals.value
                            }
                        })

                        this.setState({
                            taskConditionList: [...taskConditionList],
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
                var model = _.find(this.state.taskConditionList, function(obj){
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
                        var list = _.filter(this.state.taskConditionList, function(obj){
                                return obj.id !== id
                            }.bind(this))
                        this.setState({
                            taskConditionList: list
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
                            {getFieldDecorator('originTag', {
                                initialValue: curEditField.originTag || "",
                                rules: [{ required: true, message: '请选择原字段标识!' }]
                            })(
                                <Select
                                    showSearch
                                    allowClear={true}
                                    style={{ width: 200 }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                {this.state.dataSourceOriginFieldTag}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="关系">
                            {getFieldDecorator('conditionType', {
                                initialValue: curEditField.conditionType || "",
                                rules: [{ required: true, message: '请选择关系!' }]
                            })(
                                <Select style={{ width: 200 }}>
                                    <Option value="">请选择</Option> 
                                    <Option value="NE">不相等</Option>
                                    <Option value="EQ">相等</Option>
                                    <Option value="IN">包含</Option>
                                    <Option value="NIN">不包含</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="值" hasFeedback>
                            {getFieldDecorator('value', {
                                    initialValue: curEditField.value || "",
                                    rules: [{ required: true, message: '请输入值!' }],
                                })(
                                <Input />
                            )}
                        </FormItem>
                    </Form>
                );

                return addEditNodesView;
            }                          

            handleSubmit(e) {
                e.preventDefault();
                const { resetFields, validateFields } = this.props.form;
                //resetFields("taskConditionList")
                var checkArray = [
                    "accountId",
                    "backGetLogName",
                    "senderType",
                    "backMethod",
                    "backUrl",
                    "batchCount",
                    "batchInterval",
                    "compressMode",
                    "domainType",
                    "domains",
                    "logRange",
                    "name",
                    "productType",
                    "taskTokenTimeType",
                    "taskTokenType",
                    "templateName",
                    "tokenKey",
                    "userAgent"
                ]
                validateFields(checkArray, function(err, vals) {
                    var postParam, taskFieldJson, model = this.props.model;
                    const collection = this.props.ltProps.collection;
                    console.log(vals)
                    if (!err) {
                        taskFieldJson = {
                            "backMethod": vals.backMethod,
                            "backGetLogName": vals.backGetLogName,
                            "senderType": vals.senderType == "" ? null : vals.senderType,
                            "batchCount": vals.batchCount,
                            "batchInterval": vals.batchInterval,
                            "logRange": vals.logRange,
                            "compressMode": vals.compressMode,
                            "userAgent": vals.userAgent,
                            "tokenKey": vals.tokenKey,
                            "taskTokenType": vals.taskTokenType,
                            "taskTokenTimeType": vals.taskTokenTimeType
                        }
                        postParam = {
                            accountId:vals.accountId,
                            backUrl:vals.backUrl,
                            domainType:vals.domainType,
                            domains:vals.domains,
                            name:vals.name,
                            productType:vals.productType,
                            groupId: vals.templateName.key,
                            templateName: vals.templateName.label,//{key: "22991kskd91", label: "测试模板"}
                            taskFieldJson: taskFieldJson,
                            taskConditionList: this.state.taskConditionList,
                        }
                        collection.addTask(postParam);
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
                  labelCol: { span: 12 },
                  wrapperCol: { span: 12 },
                };
                const baseInfoView = this.renderBaseInfoView(formItemLayout);
                const conditionListView = this.renderConditionTableView(formItemLayout);
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
                                {conditionListView}
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

        const logTaskListEditView = Form.create()(logTaskListEditForm);    
        return logTaskListEditView;
    }
);