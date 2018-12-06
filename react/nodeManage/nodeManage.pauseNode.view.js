define("nodeManage.pauseNode.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], 
    function(require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {
        
        var Form = Antd.Form,
            FormItem = Form.Item,
            Radio = Antd.Radio;

        class PauseNodeForm extends React.Component {

            constructor(props, context) {
                super(props);
                let model = this.props.model;

                this.state = {
                    chName: model.get("chName"),
                    status: model.get("status"),
                    operaterArray: this.props.operaterArray
                }
            }

            onNodeStatusChange(e) {
                if (e.target.value == 4) {
                    _.each(this.state.operaterArray, (el)=>{
                        el.status = 2
                    })
                    this.setState({
                        status: e.target.value,
                        operaterArray: [...this.state.operaterArray]
                    });
                } else {
                    _.each(this.state.operaterArray, (el)=>{
                        el.status = 1
                    })
                    this.setState({
                        status: e.target.value,
                        operaterArray: [...this.state.operaterArray]
                    });
                }
                var stateObj = Object.assign({}, this.state)
                stateObj.status = e.target.value
                this.props.collection.trigger("op.action.change", stateObj)
            }

            onOperStatusChange(id, e) {
                _.each(this.state.operaterArray, (el)=>{
                    if (el.id == id) {
                        el.status = e.target.value
                    }
                })
                var stateObj = Object.assign({}, this.state)
                var pauseOp = _.filter(this.state.operaterArray, (el)=>{
                    return el.status == 2
                })

                if (pauseOp.length == this.state.operaterArray.length) {
                    this.setState({
                        status: 4,
                        operaterArray: [...this.state.operaterArray]
                    })
                    stateObj.status = 4;
                } else {
                    this.setState({
                        operaterArray: [...this.state.operaterArray]
                    })
                }

                this.props.collection.trigger("op.action.change", stateObj)
            }

            render(){
                const formItemLayout = {
                  labelCol: { span: 6 },
                  wrapperCol: { span: 12 },
                };

                let operaterFormItem = _.map(this.state.operaterArray, function(el){
                    return (<FormItem {...formItemLayout} label={el.operatorName} style={{marginBottom: 0}} key={el.id}>
                                <Radio.Group onChange={$.proxy(this.onOperStatusChange, this, el.id)} value={el.status}>
                                    <Radio value={2}>暂停</Radio>
                                    <Radio value={1} disabled={this.state.status == 4 ? true : false}>运行</Radio>
                                </Radio.Group>
                            </FormItem>)
                }.bind(this))

                var HorizontalForm = (
                    <Form>
                        <FormItem {...formItemLayout} label="节点名称" style={{marginBottom: 0}}>
                            <span className="ant-form-text">{this.state.chName}</span>
                        </FormItem>
                        <FormItem {...formItemLayout} label="节点状态">
                            <Radio.Group onChange={$.proxy(this.onNodeStatusChange, this)} value={this.state.status}>
                                <Radio value={1} disabled={this.props.model.get("status") == 2 ? true : false}>运行</Radio>
                                <Radio value={4}>暂停</Radio>
                                <Radio value={2} disabled={true}>挂起</Radio>
                            </Radio.Group>
                        </FormItem>
                        <FormItem {...formItemLayout} label="线路类型" style={{marginBottom: 0}}>
                            <span className="ant-form-text">多线</span>
                        </FormItem>
                        {operaterFormItem}
                    </Form>
                );

                return HorizontalForm
            }
        }

        var PauseNodeFormView = BaseView.extend({
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template('<div class="pause-node"></div>')());

                var model = this.options.model

                this.operaterArray = [];
                _.each(model.get("rsNodeCorpDtos"), (el) =>{
                    this.operaterArray.push({
                        id: el.id,
                        operatorId: el.operatorId,
                        operatorName: el.operatorName,
                        status: el.status
                    })
                })
                this.nodeStatus = model.get("status");
                this.collection.on("op.action.change", $.proxy(this.onOpActionChange, this))

                var pauseNodeFormFactory = React.createFactory(PauseNodeForm);
                var pauseNodeForm = pauseNodeFormFactory({
                    collection: this.collection,
                    model: model,
                    operaterArray: this.operaterArray
                });
                ReactDOM.render(pauseNodeForm, this.$el.get(0));
            },

            onOpActionChange: function(stateObj){
                this.operaterArray = stateObj.operaterArray;
                this.nodeStatus = stateObj.status;
            },

            getStatus: function(){
                var statusObj = null, operatorIdArray = [];
                if (this.nodeStatus == 4) {
                    operatorIdArray = _.map(this.operaterArray, function(el){
                        return el.operatorId
                    }.bind(this))
                    statusObj = {
                        nodeId: this.options.model.get("id"),
                        operator: -1,
                        operatorIds: operatorIdArray.join(",")
                    }
                } else if (this.nodeStatus == 1){
                    _.each(this.operaterArray, function(el){
                        if (el.status == 1) {
                            operatorIdArray.push(el.operatorId)
                        }
                    }.bind(this))
                    statusObj = {
                        nodeId: this.options.model.get("id"),
                        operator: 1,
                        operatorIds: operatorIdArray.join(",")
                    }
                }
                return statusObj;
            }
        })

        return PauseNodeFormView;
    })