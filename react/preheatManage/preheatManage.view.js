define("preheatManage.view", ['require','exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], 
    function(require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

        var Layout = Antd.Layout,
            Content = Layout.Content,
            Breadcrumb = Antd.Breadcrumb,
            Button = Antd.Button,
            Input = Antd.Input,
            Form = Antd.Form,
            FormItem = Form.Item,
            Select = Antd.Select,
            Option = Select.Option;

        var SearchForm = React.createBackboneClass({

            componentDidMount: function(){},

            handleSubmit: function(e){
                e.preventDefault();
                console.log(this.props)
            },

            render: function(){
                console.log(Select)
                var HorizontalForm = (
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem label={"名称"}>
                            <Input />
                        </FormItem>
                        <FormItem label="状态">
                            <Select defaultValue="1">
                                <Option value="1">Option 1</Option>
                                <Option value="2">Option 2</Option>
                                <Option value="3">Option 3</Option>
                            </Select>
                        </FormItem>
                        <FormItem label={"节点"}>
                            <Input />
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" icon="search">查询</Button>
                            <Button style={{ marginLeft: 8 }} icon="plus">新建</Button>
                        </FormItem>
                    </Form>
                );

                return HorizontalForm
            }
        });

        var PreHeatManageList = React.createBackboneClass({

            render: function(){
                var WrappedSearchForm = Form.create()(SearchForm);

                return (     
                    <Layout>
                        <Content>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>预热刷新相关</Breadcrumb.Item>
                                <Breadcrumb.Item>预热管理</Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                                <WrappedSearchForm collection={this.props.collection} />
                            </div>
                        </Content>
                    </Layout>
                )
            }
        });

        var PreheatManageView = BaseView.extend({
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template('<div class="preheat-manage fadeInLeft animated"></div>')());

                var preHeatManageListFac = React.createFactory(PreHeatManageList);
                var preHeatManageList = preHeatManageListFac({
                    collection: this.collection
                });
                ReactDOM.render(preHeatManageList, this.$el.get(0));
            }
        })
        return PreheatManageView;
    }
);