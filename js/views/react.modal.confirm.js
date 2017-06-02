define("react.modal.confirm", ['require', 'exports'],
    function(require, exports) {
        var Modal = ReactBootstrap.Modal,
            Button = ReactBootstrap.Button;

    var ReactModalConfirm = React.createBackboneClass({

            componentDidMount: function() {},

            componentWillUnmount: function() {},

            getInitialState: function () {
                return { showModal: this.props.showModal};
            },

            close: function () {
                this.setState({ showModal: false });
            },

            open: function () {
                this.setState({ showModal: true });
            },

            onClickSure: function(event){
                this.close();
                this.props.callback&&this.props.callback(event);
            },

            render: function() {
                var reactModalConfirm = (
                            React.createElement(Modal, {show: this.state.showModal, onHide: this.close, backdrop: this.props.backdrop}, 
                                React.createElement(Modal.Header, null, 
                                    React.createElement(Modal.Title, null, "请确认")
                                ), 
                                React.createElement(Modal.Body, null, React.createElement("span", {className: "glyphicon glyphicon-question-sign"}), this.props.message), 
                                React.createElement(Modal.Footer, null, 
                                    React.createElement(Button, {bsStyle: "primary", onClick: this.onClickSure}, "确定"), 
                                    React.createElement(Button, {onClick: this.close}, "取消")
                                )
                            )
                        );

                return reactModalConfirm

            }
        });

        return ReactModalConfirm;
    });