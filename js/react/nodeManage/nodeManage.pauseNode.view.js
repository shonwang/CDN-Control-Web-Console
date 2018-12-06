'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("nodeManage.pauseNode.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "react-dom"], function (require, exports, template, BaseView, Utility, Antd, React, ReactDOM) {

    var Form = Antd.Form,
        FormItem = Form.Item,
        Radio = Antd.Radio;

    var PauseNodeForm = function (_React$Component) {
        _inherits(PauseNodeForm, _React$Component);

        function PauseNodeForm(props, context) {
            _classCallCheck(this, PauseNodeForm);

            var _this = _possibleConstructorReturn(this, (PauseNodeForm.__proto__ || Object.getPrototypeOf(PauseNodeForm)).call(this, props));

            var model = _this.props.model;

            _this.state = {
                chName: model.get("chName"),
                status: model.get("status"),
                operaterArray: _this.props.operaterArray
            };
            return _this;
        }

        _createClass(PauseNodeForm, [{
            key: 'onNodeStatusChange',
            value: function onNodeStatusChange(e) {
                if (e.target.value == 4) {
                    _.each(this.state.operaterArray, function (el) {
                        el.status = 2;
                    });
                    this.setState({
                        status: e.target.value,
                        operaterArray: [].concat(_toConsumableArray(this.state.operaterArray))
                    });
                } else {
                    _.each(this.state.operaterArray, function (el) {
                        el.status = 1;
                    });
                    this.setState({
                        status: e.target.value,
                        operaterArray: [].concat(_toConsumableArray(this.state.operaterArray))
                    });
                }
                var stateObj = Object.assign({}, this.state);
                stateObj.status = e.target.value;
                this.props.collection.trigger("op.action.change", stateObj);
            }
        }, {
            key: 'onOperStatusChange',
            value: function onOperStatusChange(id, e) {
                _.each(this.state.operaterArray, function (el) {
                    if (el.id == id) {
                        el.status = e.target.value;
                    }
                });
                var stateObj = Object.assign({}, this.state);
                var pauseOp = _.filter(this.state.operaterArray, function (el) {
                    return el.status == 2;
                });

                if (pauseOp.length == this.state.operaterArray.length) {
                    this.setState({
                        status: 4,
                        operaterArray: [].concat(_toConsumableArray(this.state.operaterArray))
                    });
                    stateObj.status = 4;
                } else {
                    this.setState({
                        operaterArray: [].concat(_toConsumableArray(this.state.operaterArray))
                    });
                }

                this.props.collection.trigger("op.action.change", stateObj);
            }
        }, {
            key: 'render',
            value: function render() {
                var formItemLayout = {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 12 }
                };

                var operaterFormItem = _.map(this.state.operaterArray, function (el) {
                    return React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: el.operatorName, style: { marginBottom: 0 }, key: el.id }),
                        React.createElement(
                            Radio.Group,
                            { onChange: $.proxy(this.onOperStatusChange, this, el.id), value: el.status },
                            React.createElement(
                                Radio,
                                { value: 2 },
                                '\u6682\u505C'
                            ),
                            React.createElement(
                                Radio,
                                { value: 1, disabled: this.state.status == 4 ? true : false },
                                '\u8FD0\u884C'
                            )
                        )
                    );
                }.bind(this));

                var HorizontalForm = React.createElement(
                    Form,
                    null,
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u8282\u70B9\u540D\u79F0', style: { marginBottom: 0 } }),
                        React.createElement(
                            'span',
                            { className: 'ant-form-text' },
                            this.state.chName
                        )
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u8282\u70B9\u72B6\u6001' }),
                        React.createElement(
                            Radio.Group,
                            { onChange: $.proxy(this.onNodeStatusChange, this), value: this.state.status },
                            React.createElement(
                                Radio,
                                { value: 1, disabled: this.props.model.get("status") == 2 ? true : false },
                                '\u8FD0\u884C'
                            ),
                            React.createElement(
                                Radio,
                                { value: 4 },
                                '\u6682\u505C'
                            ),
                            React.createElement(
                                Radio,
                                { value: 2, disabled: true },
                                '\u6302\u8D77'
                            )
                        )
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u7EBF\u8DEF\u7C7B\u578B', style: { marginBottom: 0 } }),
                        React.createElement(
                            'span',
                            { className: 'ant-form-text' },
                            '\u591A\u7EBF'
                        )
                    ),
                    operaterFormItem
                );

                return HorizontalForm;
            }
        }]);

        return PauseNodeForm;
    }(React.Component);

    var PauseNodeFormView = BaseView.extend({
        initialize: function initialize(options) {
            var _this2 = this;

            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template('<div class="pause-node"></div>')());

            var model = this.options.model;

            this.operaterArray = [];
            _.each(model.get("rsNodeCorpDtos"), function (el) {
                _this2.operaterArray.push({
                    id: el.id,
                    operatorId: el.operatorId,
                    operatorName: el.operatorName,
                    status: el.status
                });
            });
            this.nodeStatus = model.get("status");
            this.collection.on("op.action.change", $.proxy(this.onOpActionChange, this));

            var pauseNodeFormFactory = React.createFactory(PauseNodeForm);
            var pauseNodeForm = pauseNodeFormFactory({
                collection: this.collection,
                model: model,
                operaterArray: this.operaterArray
            });
            ReactDOM.render(pauseNodeForm, this.$el.get(0));
        },

        onOpActionChange: function onOpActionChange(stateObj) {
            this.operaterArray = stateObj.operaterArray;
            this.nodeStatus = stateObj.status;
        },

        getStatus: function getStatus() {
            var statusObj = null,
                operatorIdArray = [];
            if (this.nodeStatus == 4) {
                operatorIdArray = _.map(this.operaterArray, function (el) {
                    return el.operatorId;
                }.bind(this));
                statusObj = {
                    nodeId: this.options.model.get("id"),
                    operator: -1,
                    operatorIds: operatorIdArray.join(",")
                };
            } else if (this.nodeStatus == 1) {
                _.each(this.operaterArray, function (el) {
                    if (el.status == 1) {
                        operatorIdArray.push(el.operatorId);
                    }
                }.bind(this));
                statusObj = {
                    nodeId: this.options.model.get("id"),
                    operator: 1,
                    operatorIds: operatorIdArray.join(",")
                };
            }
            return statusObj;
        }
    });

    return PauseNodeFormView;
});
