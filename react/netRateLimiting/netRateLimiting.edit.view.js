define("netRateLimiting.edit.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], 
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
            InputNumber = Antd.InputNumber,
            Switch = Antd.Switch, 
            confirm = Modal.confirm;

        class NetRateLimitingEditForm extends React.Component {
            constructor(props, context) {
                super(props);
                this.onClickCancel = this.onClickCancel.bind(this);
                this.renderBaseInfoView = this.renderBaseInfoView.bind(this);
                this.renderFieldTableView = this.renderFieldTableView.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);

                this.state = {
                    currentSubType: -1,
                    origins: [],
                    quotaUnits: "",
                    totalQuota: "",               
                    advanceStrategy: [],
                    defaultStrategy: {},
                    isAdvance: false,

                    isLoadingDetail: props.isEdit ? true : false,
                    fieldModalVisible: false,
                    isEditField: false,
                    curEditField: {},

                    dataSourceDomains: []
                };
            }

            componentDidMount() {
                var limitProps = this.props.limitProps,
                collection = limitProps.collection;
                collection.on("get.domain.success", $.proxy(this.onGetDomainSuccess, this))
                collection.on("get.domain.error", $.proxy(this.onGetError, this))
                if (this.props.isEdit) {
                    var model = this.props.model;
                    collection.on("get.detail.success", $.proxy(this.onGetDetailSuccess, this))
                    collection.on("get.detail.error", $.proxy(this.onGetError, this))
                    collection.getLimitRateDetailByGroupId({groupId: model.id});
                } else {
                    collection.getDomainsBySubType({
                        userId: this.props.limitProps.userInfo.uid,
                        //groupId: this.props.model.id,
                        subType: this.state.currentSubType
                    })
                }
                collection.on("update.detail.success", $.proxy(this.onSubmitSuccess, this));
                collection.on("update.detail.error", $.proxy(this.onGetError, this));
            }

            componentWillUnmount() {
                const collection = this.props.limitProps.collection;
                collection.off("update.detail.success");
                collection.off("update.detail.error");
                collection.off("get.domain.success");
                collection.off("get.domain.error");
                if (this.props.isEdit) {   
                    collection.off("get.detail.success");
                    collection.off("get.detail.error");
                }   
            }

            onGetDetailSuccess(res) {
                var defaultStrategy = res.strategys.shift(), 
                    advanceStrategy = res.strategys,
                    origins = [];

                _.each(res.origins, function(el){
                    origins.push(el.originId + "")
                }.bind(this))

                this.setState({
                    currentSubType: res.currentSubType,
                    origins: origins,
                    quotaUnits: res.group.quotaUnits,
                    totalQuota: res.group.totalQuota,               
                    advanceStrategy: advanceStrategy,
                    defaultStrategy: defaultStrategy,
                    isAdvance:  advanceStrategy.length > 0 ? true : false
                });

                var collection = this.props.limitProps.collection;
                collection.getDomainsBySubType({
                    userId: this.props.limitProps.userInfo.uid,
                    groupId: this.props.model.id,
                    subType: this.state.currentSubType
                })
            }

            onGetDomainSuccess(res) {
                var domainArray = res.origins.map((el) => {
                        return <Option key={el.originId + ""}>{el.domain}</Option>;
                    });

                this.setState({
                    dataSourceDomains: domainArray,
                    isLoadingDetail: false
                })
            }

            onCurrentSubTypeChange(value) {
                const { setFieldsValue, getFieldsValue } = this.props.form;
                setFieldsValue({"origins": []})
                this.setState({
                    dataSourceDomains: []
                })
                var collection = this.props.limitProps.collection;
                if (this.props.isEdit) {
                    collection.getDomainsBySubType({
                        userId: this.props.limitProps.userInfo.uid,
                        groupId: this.props.model.id,
                        subType: value
                    })
                } else {
                    collection.getDomainsBySubType({
                        userId: this.props.limitProps.userInfo.uid,
                        subType: value
                    })
                }
            }

            onStrategyModeChange(value) {
                const { resetFields } = this.props.form;
                var defaultStrategy = this.state.defaultStrategy;
                defaultStrategy.currentMode = value;
                this.setState({
                    defaultStrategy: defaultStrategy
                });
                resetFields("strategyLimit")
                resetFields("strategyCode")
                resetFields("strategyOrigin")
             }

            onAdvanceStrategyModeChange(value){
                const { resetFields } = this.props.form;
                var curEditField = this.state.curEditField;
                curEditField.currentMode = value;
                this.setState({
                    curEditField: curEditField
                });
                resetFields("advanceStrategyLimit")
                resetFields("advanceStrategyCode")
                resetFields("advanceStrategyOrigin")
            }

            validateStrategyLimit(rule, value, callback) {
                const  currentMode = this.state.defaultStrategy.currentMode;
                if ((currentMode == 3 && !value) || (value == 0)) {
                    if (value === 0) {
                        callback();
                    } else {
                        callback('请输入自定义限速！');
                    }
                } else {
                    callback();
                }
            }

            validateStrategyCode(rule, value, callback) {
                const  currentMode = this.state.defaultStrategy.currentMode;
                if (currentMode == 2 && !value) {
                    if (value === 0) {
                        callback();
                    } else {
                        callback('请输入自定义状态码！');
                    }
                } else {
                    callback();
                }
            }

            validateStrategyOrigin(rule, value, callback) {
                const  currentMode = this.state.defaultStrategy.currentMode;
                if (currentMode == 1 && value && Utility.isDomain(value)) {
                    callback();
                } else if (currentMode == 1 && value && Utility.isIP(value)) {
                    callback();
                } else if (currentMode == 1) {
                    console.log(value)
                    callback('请输入正确的自定义回源！')
                } else {
                    callback();
                }
            }

            validateAdvanceStrategyLimit(rule, value, callback) {
                const  currentMode = this.state.curEditField.currentMode;
                if ((currentMode == 3 && !value) || (value == 0)) {
                    if (value === 0) {
                        callback();
                    } else {
                        callback('请输入自定义限速！');
                    }
                } else {
                    callback();
                }
            }

            validateAdvanceStrategyCode(rule, value, callback) {
                const  currentMode = this.state.curEditField.currentMode;
                if (currentMode == 2 && !value) {
                    if (value === 0) {
                        callback();
                    } else {
                        callback('请输入自定义状态码！');
                    }
                } else {
                    callback();
                }
            }

            validateAdvanceStrategyOrigin(rule, value, callback) {
                const  currentMode = this.state.curEditField.currentMode;
                if (currentMode == 1 && value && Utility.isDomain(value)) {
                    callback();
                } else if (currentMode == 1 && value && Utility.isIP(value)) {
                    callback();
                } else if (currentMode == 1) {
                    callback('请输入正确的自定义回源！')
                } else {
                    callback();
                }
            }

            onAdvanceButtonChange(checked) {
                this.setState({
                    isAdvance: checked
                });
            }

            renderBaseInfoView(formItemLayout) {
                const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form;
                var baseInfoView = null; 

                baseInfoView = (
                    <div>
                        <FormItem {...formItemLayout} label="限速域名" required={true}>
                            <Col span={8}>
                                <FormItem>
                                    {getFieldDecorator('currentSubType', {
                                        initialValue: this.state.currentSubType + "",
                                        rules: [{ required: true, message: '请选择字段间隔符!' }],
                                    })(
                                        <Select style={{ width: 150 }} onChange={$.proxy(this.onCurrentSubTypeChange, this)}>
                                            <Option value="-1">全部类型</Option>
                                            <Option value="1">音视频点播</Option>
                                            <Option value="2" style={{display:"none"}}>流媒体直播</Option>
                                            <Option value="3" style={{display:"none"}}>直播推流加速</Option>
                                            <Option value="4">大文件下载</Option>
                                            <Option value="5">图片小文件</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem>
                                    {getFieldDecorator('origins', {
                                        initialValue: this.state.origins,
                                        rules: [
                                            { type:"array", required: true, message: '请选择域名!' },
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
                            <Col span={4} >
                                <FormItem>
                                    <span style={{marginLeft: "10px"}}>共{this.state.dataSourceDomains.length}个域名</span>
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label="限速阈值" required={true}>
                            <Col span={8}>
                                <FormItem>
                                    {getFieldDecorator('totalQuota', {
                                            initialValue: this.state.totalQuota,
                                            rules: [{ required: true, message: '请输入限速阈值!' }],
                                        })(
                                        <InputNumber style={{ width: 150 }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem>
                                    {getFieldDecorator('quotaUnits', {
                                        initialValue: this.state.quotaUnits,
                                        rules: [
                                            { required: true, message: '请选择限速阈值单位!' },
                                        ],
                                    })(
                                        <Select style={{ width: 150 }}>
                                            <Option value="">请选择</Option>
                                            <Option value="Gbps">Gbps</Option>
                                            <Option value="Mbps">Mbps</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label="超额策略" required={true}>
                            <Col span={8}>
                                <FormItem>
                                    {getFieldDecorator('defaultStrategyMode', {
                                        initialValue: this.state.defaultStrategy.currentMode ? this.state.defaultStrategy.currentMode + "" : "",
                                        rules: [{ required: true, message: '请选择超额策略!' }],
                                    })(
                                        <Select style={{ width: 150 }} onChange={$.proxy(this.onStrategyModeChange, this)}>
                                            <Option value="">请选择</Option>
                                            <Option value="1">自定义回源</Option>
                                            <Option value="3">自定义限速</Option>
                                            <Option value="2">自定义状态码</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem style={{display: this.state.defaultStrategy.currentMode == 3 ? "list-item" : "none"}}>
                                    {getFieldDecorator('strategyLimit', {
                                            initialValue: parseInt(this.state.defaultStrategy.currentValue) || 2000,
                                            rules: [
                                                { validator: $.proxy(this.validateStrategyLimit, this) },
                                            ],
                                        })(
                                        <InputNumber style={{ width: 150 }} min={2000}/>
                                    )}
                                    <span style={{marginLeft: "10px"}}>kbps</span>
                                </FormItem>
                                <FormItem style={{display: this.state.defaultStrategy.currentMode == 2 ? "list-item" : "none"}}>
                                    {getFieldDecorator('strategyCode', {
                                            initialValue: parseInt(this.state.defaultStrategy.currentValue) || 404,
                                            rules: [
                                                { validator: $.proxy(this.validateStrategyCode, this) },
                                            ],
                                        })(
                                        <InputNumber style={{ width: 150 }} />
                                    )}
                                </FormItem>
                                <FormItem style={{display: this.state.defaultStrategy.currentMode == 1 ? "list-item" : "none"}}>
                                    {getFieldDecorator('strategyOrigin', {
                                            initialValue: this.state.defaultStrategy.currentValue,
                                            rules: [
                                                { validator: $.proxy(this.validateStrategyOrigin, this) },
                                            ],
                                        })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label="高级">
                            <Switch checked={this.state.isAdvance} onChange={$.proxy(this.onAdvanceButtonChange, this)} />
                        </FormItem>
                    </div>
                )

                return baseInfoView
            }

            renderFieldTableView(formItemLayout) {
                const { getFieldDecorator } = this.props.form;
                const { advanceStrategy, fieldModalVisible, curEditField } = this.state;
                var fieldListView = "";
                const { isView, isEdit } = this.props;
                var  columns = [{
                    title: '文件类型',
                    dataIndex: 'fileType',
                    key: 'fileType'
                },{
                    title: '超额策略',
                    dataIndex: 'currentValue',
                    key: 'currentValue',
                    render: (text, record) => {
                        var tag = null;
                        if (record.currentMode == 1)
                            tag = "自定义回源: " + text
                        else if (record.currentMode == 2)
                            tag = "自定义状态码: " + text
                        else if (record.currentMode == 3)
                            tag = "自定义限速: " + text + "kbps"
                        return tag
                    }
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
                        var buttonGroup = (
                                <div>
                                    {editButton}
                                    <span className="ant-divider" />
                                    {deleteButton}
                                </div>
                            )
                        return buttonGroup
                    },
                }];

                var addEditFieldView = "", addButton = "";

                addEditFieldView = this.renderAddEditFieldView(formItemLayout)// <div style={{textAlign: "center"}}><Spin /></div>
                addButton = (<Button icon="plus" size={'small'} onClick={$.proxy(this.onClickAddField, this)}>新增</Button>)

                fieldListView = (
                    <div style={{display: this.state.isAdvance ? "list-item" : "none"}}>
                        <FormItem {...formItemLayout} label="新增">
                            {addButton}
                        </FormItem>
                        <FormItem wrapperCol={{ span: 16, offset: 4}}>
                            <Table rowKey="id" columns={columns} pagination={false} size="small" dataSource={advanceStrategy} />
                            <Modal title={'新增策略'} width={800}
                                   destroyOnClose={true}
                                   visible={fieldModalVisible}
                                   onOk={$.proxy(this.handleFieldOk, this)}
                                   onCancel={$.proxy(this.handleModalCancel, this)}>
                                   {addEditFieldView}
                            </Modal>
                        </FormItem>
                    </div>
                )

                return fieldListView;
            }

            onClickAddField (event) {
                this.setState({
                    isEditField:false,
                    curEditField: {
                        currentMode: 1
                    },
                    fieldModalVisible: true,
                });
            }

            handleFieldOk (e){
                e.preventDefault();
                const { advanceStrategy, isEditField, curEditField } = this.state;
                const { getFieldsValue, validateFields, resetFields } = this.props.form;
                let newField = null, fieldObj;
                validateFields(["fileType", "advanceStrategyMode", "advanceStrategyLimit", "advanceStrategyCode", "advanceStrategyOrigin"], (err, vals) => {
                    if (!err && !isEditField) {
                        console.log(vals)
                        var currentValue;
                        if (vals.advanceStrategyMode == 1) {
                            currentValue = vals.advanceStrategyOrigin
                        } else if (vals.advanceStrategyMode == 2) {
                            currentValue = vals.advanceStrategyCode
                        } else if (vals.advanceStrategyMode == 3) {
                            currentValue = vals.advanceStrategyLimit
                        }
                        newField = {
                            id: new Date().valueOf(),
                            fileType: vals.fileType.join(","),
                            currentMode: vals.advanceStrategyMode,
                            currentValue: currentValue
                        }
                        this.setState({
                            advanceStrategy: [...advanceStrategy, newField],
                            fieldModalVisible: false
                        });
                    } else if (!err && isEditField) {
                        if (vals.advanceStrategyMode == 1) {
                            currentValue = vals.advanceStrategyOrigin
                        } else if (vals.advanceStrategyMode == 2) {
                            currentValue = vals.advanceStrategyCode
                        } else if (vals.advanceStrategyMode == 3) {
                            currentValue = vals.advanceStrategyLimit
                        }
                        _.find(advanceStrategy, (el) => {
                            if (el.id == curEditField.id) {
                                el.fileType = vals.fileType.join(",")
                                el.currentMode = vals.advanceStrategyMode
                                el.currentValue = currentValue
                            }
                        })

                        this.setState({
                            advanceStrategy: [...advanceStrategy],
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
                var model = _.find(this.state.advanceStrategy, function(obj){
                        return obj.id == id
                    }.bind(this))

                if (typeof model.fileType == "string")
                    model.fileType = model.fileType.split(",")
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
                        var list = _.filter(this.state.advanceStrategy, function(obj){
                                return obj.id !== id
                            }.bind(this))
                        this.setState({
                            advanceStrategy: list
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
                        <FormItem {...formItemLayout} label="文件类型">
                            {getFieldDecorator('fileType', {
                                    initialValue: this.state.curEditField.fileType,
                                    rules: [
                                        { type: "array", required: true, message: '请输入文件类型!' },
                                    ],
                                })(
                                    <Select mode="tags" allowClear={true}
                                            notFoundContent={"请输入文件类型, 可以配置多个"} 
                                            filterOption={false} >  
                                    </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="超额策略" required={true}>
                            <Col span={8}>
                                <FormItem>
                                    {getFieldDecorator('advanceStrategyMode', {
                                        initialValue: this.state.curEditField.currentMode + "",
                                        rules: [{ required: true, message: '请选择超额策略!' }],
                                    })(
                                        <Select style={{ width: 150 }} onChange={$.proxy(this.onAdvanceStrategyModeChange, this)}>
                                            <Option value="1">自定义回源</Option>
                                            <Option value="3">自定义限速</Option>
                                            <Option value="2">自定义状态码</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem style={{display: this.state.curEditField.currentMode == 3 ? "list-item" : "none"}}>
                                    {getFieldDecorator('advanceStrategyLimit', {
                                            initialValue: parseInt(this.state.curEditField.currentValue) || 2000,
                                            rules: [
                                                { validator: $.proxy(this.validateAdvanceStrategyLimit, this) },
                                            ],
                                        })(
                                        <InputNumber style={{ width: 200 }} min={2000}/>
                                    )}
                                </FormItem>
                                <FormItem style={{display: this.state.curEditField.currentMode == 2 ? "list-item" : "none"}}>
                                    {getFieldDecorator('advanceStrategyCode', {
                                            initialValue: parseInt(this.state.curEditField.currentValue) || 404,
                                            rules: [
                                                { validator: $.proxy(this.validateAdvanceStrategyCode, this) },
                                            ],
                                        })(
                                        <InputNumber style={{ width: 200 }} />
                                    )}
                                </FormItem>
                                <FormItem style={{display: this.state.curEditField.currentMode == 1 ? "list-item" : "none"}}>
                                    {getFieldDecorator('advanceStrategyOrigin', {
                                            initialValue: this.state.curEditField.currentValue,
                                            rules: [
                                                { validator: $.proxy(this.validateAdvanceStrategyOrigin, this) },
                                            ],
                                        })(
                                        <Input style= {{ width: 200 }} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={4} >
                                <FormItem style={{display: this.state.curEditField.currentMode == 3 ? "list-item" : "none"}}>
                                    <span style={{marginLeft: "10px"}}>kbps</span>
                                </FormItem>
                            </Col>
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
                const { validateFields } = this.props.form;
                var checkArray = ["currentSubType", "origins", "totalQuota", "quotaUnits", "defaultStrategyMode", 'strategyLimit', 'strategyCode', 'strategyOrigin'];
                validateFields(checkArray, function(err, vals) {
                    var postParam, model = this.props.model;
                    const collection = this.props.limitProps.collection;
                    if (!err) {
                        console.log(vals)
                        var origins = vals.origins.map((el) => {
                            return {
                                "originId": parseInt(el),
                                "userId": this.props.limitProps.userInfo.uid
                            }
                        })
                        var currentValue;
                        if (vals.defaultStrategyMode == 1) {
                            currentValue = vals.strategyOrigin
                        } else if (vals.defaultStrategyMode == 2) {
                            currentValue = vals.strategyCode
                        } else if (vals.defaultStrategyMode == 3) {
                            currentValue = vals.strategyLimit
                        }
                        var strategys = [], defaultSg = {
                            fileType: "default",
                            currentMode: parseInt(vals.defaultStrategyMode),
                            currentValue: currentValue
                        };

                        strategys.push(defaultSg)
                        _.each(this.state.advanceStrategy, (el) => {
                            el.currentMode = parseInt(el.currentMode)
                            strategys.push(el)
                        })

                        postParam = {
                            "group": {
                                "quotaUnits": vals.quotaUnits,
                                "totalQuota": vals.totalQuota,
                                "userId": this.props.limitProps.userInfo.uid
                            },
                            "origins": origins,
                            "strategys": strategys
                        }

                        if (this.props.isEdit) {
                            postParam.group.id = this.props.model.id
                            collection.updateLimitRateConf(postParam)
                        } else {
                            collection.addLimitRateConf(postParam)
                        }
                        console.log(postParam)

                    }
                }.bind(this))
            }

            onClickCancel() {
                const onClickCancelCallback = this.props.limitProps.onClickCancelCallback,
                      onClickHistoryCallback = this.props.limitProps.onClickHistoryCallback;

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
                  labelCol: { span: 4 },
                  wrapperCol: { span: 16 },
                };
                const baseInfoView = this.renderBaseInfoView(formItemLayout);
                const fieldListView = this.renderFieldTableView(formItemLayout);
                let saveButton = null, editView = null;
                if (!this.props.isView)
                    saveButton = (<Button type="primary" htmlType="submit">保存</Button>)

                if (this.state.isLoadingDetail) {
                    editView =  <div style={{textAlign: "center"}}><Spin /></div>
                } else { 
                    editView = (
                        <div>
                            <Form onSubmit={this.handleSubmit}>
                                {baseInfoView}
                                {fieldListView}
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

        const NetRateLimitingEditView = Form.create()(NetRateLimitingEditForm);    
        return NetRateLimitingEditView;
    }
);