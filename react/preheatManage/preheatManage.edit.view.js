define("preheatManage.edit.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone'], 
    function(require, exports, template, BaseView, Utility, Antd, React) {

        var Button = Antd.Button,
            Input = Antd.Input,
            Form = Antd.Form,
            FormItem = Form.Item,
            Select = Antd.Select,
            Option = Select.Option,
            AutoComplete = Antd.AutoComplete,
            Table = Antd.Table,
            Alert = Antd.Alert,
            Tag = Antd.Tag,
            Popover = Antd.Popover,
            Badge = Antd.Badge,
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
                this.handleSubmit = this.handleSubmit.bind(this);
                this.state = {
                    fileList: [],
                    uploading: false
                };
            }

            componentDidMount() {}

            componentWillUnmount() {}

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

            renderTaskNameView(formItemLayout) {
                const { getFieldDecorator, setFieldsValue, getFieldValue} = this.props.form;
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
                            <FormItem {...formItemLayout} label="任务名称">
                                {getFieldDecorator('taskName', {
                                        rules: [{ required: true, message: '请输入任务名称!' }],
                                    })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="预热域名">
                                {getFieldDecorator('taskDomain', {
                                        rules: [{ required: true, message: '请输入预热域名!' }],
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

            render() {
                const { getFieldDecorator } = this.props.form;
                const formItemLayout = {
                  labelCol: { span: 6 },
                  wrapperCol: { span: 14 },
                };

                var taskNameView = this.renderTaskNameView(formItemLayout);


                var preheatNodesView = (
                    <div>
                        <FormItem {...formItemLayout} label="预热节点">
                            <Button icon="plus" size={'small'}>添加</Button>
                            <Table />
                        </FormItem>
                    </div>
                )
                var timeBandView = (
                    <div>
                        <FormItem {...formItemLayout} label="分时带宽">
                            <Button icon="plus" size={'small'}>添加</Button>
                            <Table />
                        </FormItem>
                    </div>
                )  
                return (
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
                );
            }
        }

        const PreheatManageEditView = Form.create()(PreheatManageEditForm);    
        return PreheatManageEditView;
    }
);