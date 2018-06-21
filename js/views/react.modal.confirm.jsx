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

            createMarkup: function(){
                 return {__html: this.props.message}; 
            },

            render: function() {
                var reactModalConfirm = (
                            <Modal show={this.state.showModal} onHide={this.close} backdrop={this.props.backdrop}>
                                <Modal.Header>
                                    <Modal.Title>请确认</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <span className="glyphicon glyphicon-question-sign"></span>
                                    <span dangerouslySetInnerHTML={this.createMarkup()} />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button bsStyle="primary" onClick={this.onClickSure}>确定</Button>
                                    <Button onClick={this.close}>取消</Button>
                                </Modal.Footer>
                            </Modal>
                        );

                return reactModalConfirm

            }
        });

        return ReactModalConfirm;
    });