'use strict';

define("preheatManage.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], function (require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

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

        componentDidMount: function componentDidMount() {},

        handleSubmit: function handleSubmit(e) {
            e.preventDefault();
            console.log(this.props);
        },

        render: function render() {
            console.log(Select);
            var HorizontalForm = React.createElement(
                Form,
                { layout: 'inline', onSubmit: this.handleSubmit },
                React.createElement(
                    FormItem,
                    { label: "名称" },
                    React.createElement(Input, null)
                ),
                React.createElement(
                    FormItem,
                    { label: '\u72B6\u6001' },
                    React.createElement(
                        Select,
                        { defaultValue: '1' },
                        React.createElement(
                            Option,
                            { value: '1' },
                            'Option 1'
                        ),
                        React.createElement(
                            Option,
                            { value: '2' },
                            'Option 2'
                        ),
                        React.createElement(
                            Option,
                            { value: '3' },
                            'Option 3'
                        )
                    )
                ),
                React.createElement(
                    FormItem,
                    { label: "节点" },
                    React.createElement(Input, null)
                ),
                React.createElement(
                    FormItem,
                    null,
                    React.createElement(
                        Button,
                        { type: 'primary', htmlType: 'submit', icon: 'search' },
                        '\u67E5\u8BE2'
                    ),
                    React.createElement(
                        Button,
                        { style: { marginLeft: 8 }, icon: 'plus' },
                        '\u65B0\u5EFA'
                    )
                )
            );

            return HorizontalForm;
        }
    });

    var PreHeatManageList = React.createBackboneClass({

        render: function render() {
            var WrappedSearchForm = Form.create()(SearchForm);

            return React.createElement(
                Layout,
                null,
                React.createElement(
                    Content,
                    null,
                    React.createElement(
                        Breadcrumb,
                        { style: { margin: '16px 0' } },
                        React.createElement(
                            Breadcrumb.Item,
                            null,
                            '\u9884\u70ED\u5237\u65B0\u76F8\u5173'
                        ),
                        React.createElement(
                            Breadcrumb.Item,
                            null,
                            '\u9884\u70ED\u7BA1\u7406'
                        )
                    ),
                    React.createElement(
                        'div',
                        { style: { background: '#fff', padding: 24, minHeight: 280 } },
                        React.createElement(WrappedSearchForm, { collection: this.props.collection })
                    )
                )
            );
        }
    });

    var PreheatManageView = BaseView.extend({
        initialize: function initialize(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template('<div class="preheat-manage fadeInLeft animated"></div>')());

            var preHeatManageListFac = React.createFactory(PreHeatManageList);
            var preHeatManageList = preHeatManageListFac({
                collection: this.collection
            });
            ReactDOM.render(preHeatManageList, this.$el.get(0));
        }
    });
    return PreheatManageView;
});
