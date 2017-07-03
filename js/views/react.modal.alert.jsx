define("react.modal.alert", ['require', 'exports'],
    function(require, exports) {
        var Modal = ReactBootstrap.Modal,
            Alert = ReactBootstrap.Alert;

    var ReactModalAlert = React.createBackboneClass({

            componentDidMount: function() {
                var timeout = parseInt(this.props.timeout);
                if (timeout < 0) return;
                this.timerID = setTimeout(function(){
                    this.setState({ showModal: false });
                }.bind(this), timeout);
            },

            componentWillUnmount: function() {
                clearInterval(this.timerID);
            },

            getInitialState: function () {
                return { showModal: this.props.showModal};
            },

            close: function () {
                this.setState({ showModal: false });
                clearInterval(this.timerID);
            },

            open: function () {
                this.setState({ showModal: true });
            },

            createMarkup: function(){
                 return {__html: this.props.message}; 
            },

            render: function() {
                var reactModalAlert = (
                            <Modal show={this.state.showModal} onHide={this.close} backdrop={this.props.backdrop}>
                                <Alert bsStyle={this.props.type} onDismiss={this.close} style={{marginBottom: 0}}>
                                    <strong className="glyphicon glyphicon-info-sign"></strong>
                                    <span dangerouslySetInnerHTML={this.createMarkup()} />
                                </Alert>
                            </Modal>
                        );

                return reactModalAlert

            }
        });

        return ReactModalAlert;
    });