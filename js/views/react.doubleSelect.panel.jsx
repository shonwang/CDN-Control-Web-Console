define("react.doubleSelect.panel", ['require', 'exports'],
    function(require, exports) {
        var PanelGroup = ReactBootstrap.PanelGroup,
            Panel = ReactBootstrap.Panel,
            Button = ReactBootstrap.Button,
            Table = ReactBootstrap.Table,
            Col = ReactBootstrap.Col,
            FormControl = ReactBootstrap.FormControl,
            Radio = ReactBootstrap.Radio,
            FormGroup = ReactBootstrap.FormGroup,
            ControlLabel = ReactBootstrap.ControlLabel;

        var ReactLoading = React.createBackboneClass({
            render: function(){
                return (     
                    <div className="loader">
                        <div className="loader-inner pacman">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                )
            }
        });

        var ReactSelectedRow = React.createBackboneClass({

            handleClickDelete: function(event){
                this.props.onClickDeleteCallback && this.props.onClickDeleteCallback(event.target.id)
            },

            onClickMainDomain: function(event){
                this.props.onClickRadioCallback && this.props.onClickRadioCallback(event.target.id)
            },

            render: function() {
                var tr = (
                        <tr>
                            <td>
                                <Radio name="radioGroup" onChange={this.onClickMainDomain} id={this.props.domain}>{ this.props.domain }</Radio>
                            </td>
                            <td><a href="javascript:void(0)" onClick={this.handleClickDelete} id={this.props.domain}>删除</a></td>
                        </tr>
                    );
                if (this.props.mainDomain === this.props.domain) {
                    tr = (
                        <tr>
                            <td>
                                <Radio name="radioGroup" onChange={this.onClickMainDomain} id={this.props.domain} checked>{ this.props.domain }</Radio>
                            </td>
                            <td><span className="label label-success">主域名</span></td>
                        </tr>
                    );
                }

                return tr
            }
        });

        var ReactSearchRow = React.createBackboneClass({

            handleClickTr: function(event){
                this.props.onClickItemCallback && this.props.onClickItemCallback(event.target.innerHTML)
            },

            render: function() {
                return (
                    <tr onClick={this.handleClickTr}>
                        <td>{ this.props.domain }</td>
                    </tr>
                );
            }
        });

        var ReactDoubleSelect = React.createBackboneClass({

                componentDidMount: function() {},

                componentWillUnmount: function() {},

                getInitialState: function () {
                    var defaultState = {
                        keyword: "",
                        mainDomain: this.props.mainDomain || "",
                        selected: this.props.selected || [], 
                        search: [],
                        isLoading: false
                    }

                    return defaultState;
                },

                onClickSearch: function () {
                    if (!this.state.keyword) return;

                    require(['setupChannelManage.model'], function(SetupChannelManageModel){
                        this.mySetupChannelManageModel = new SetupChannelManageModel();
                        this.mySetupChannelManageModel.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
                        this.mySetupChannelManageModel.on("get.channel.error", $.proxy(this.onGetError, this));
                        this.mySetupChannelManageModel.queryChannel({
                            "domain": this.state.keyword,
                            "currentPage": 1,
                            "pageSize": 99999
                        })

                        this.setState({
                            isLoading: true
                        })

                    }.bind(this)); 
                },

                onChannelListSuccess: function(){
                    var tempArray = this.mySetupChannelManageModel.map(function(model){
                        return model.get("domain");
                    }.bind(this))

                    this.setState({
                        search: tempArray,
                        isLoading: false
                    })
                },

                onClickSearchItem: function(domain){
                    var temp = this.state.selected;
                    temp.push(domain);
                    temp = _.uniq(temp);
                    this.setState({
                        selected: temp,
                    })
                    this.props.onChangeSharedDomain&&this.props.onChangeSharedDomain(temp);
                },

                onClickSelectAll: function(){
                    var temp = this.state.selected;
                    _.each(this.state.search, function(domain){
                        temp.push(domain);
                    }.bind(this))
                    temp = _.uniq(temp);
                    this.setState({
                        selected: temp,
                    })
                    this.props.onChangeSharedDomain&&this.props.onChangeSharedDomain(temp);
                },

                onChangeInput: function(event){
                    var value = event.target.value.trim();
                    this.setState({
                        keyword: value
                    })
                },

                onKeyupInput: function(e){
                    if (e.keyCode == 13) this.onClickSearch();
                    if (this.state.keyword === "") {
                        this.setState({
                            search: []
                        })
                    }
                },

                onClickMainDomain: function(domain){
                    this.setState({
                        mainDomain: domain
                    })

                    this.props.onChangeMainDomain&&this.props.onChangeMainDomain(domain)
                },

                onClickSelectDelete: function(domain){
                    var temp = _.without(this.state.selected, domain);
                    this.setState({
                        selected: temp
                    })
                    this.props.onChangeSharedDomain&&this.props.onChangeSharedDomain(temp);
                },

                onClickClearAll: function(){
                    var temp = _.filter(this.state.selected, function(domain){
                        return this.state.mainDomain === domain
                    }.bind(this))

                    this.setState({
                        selected: temp
                    })
                    this.props.onChangeSharedDomain&&this.props.onChangeSharedDomain(temp);
                },

                render: function() {
                    var header = (
                         <div>
                            <FormGroup style={{marginBottom: 0}}>
                                <Col sm={9}>
                                    <FormControl type="text" placeholder="搜索域名" bsSize="small" 
                                                 value={this.state.keyword} onChange={this.onChangeInput} onKeyUp={this.onKeyupInput}/>
                                </Col>
                                <Col sm={2}>
                                    <Button bsStyle="primary" onClick={this.onClickSearch} bsSize="small">查询</Button>
                                </Col>
                            </FormGroup>
                        </div>
                    );

                    var empty = (
                            <div className="empty-ctn">
                                <ReactBootstrap.Image src="images/404.png" responsive style={{margin:"0 auto"}}/>
                                <p className="text-muted text-center">暂无数据</p>
                            </div>
                        );

                    var searchRows = this.state.search.map(function(domain, index){
                        return (
                                <ReactSearchRow key={index} domain={domain} onClickItemCallback={this.onClickSearchItem}/>
                            );
                    }.bind(this))

                    var searchTable = (
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th>域名</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchRows}
                                </tbody>
                            </Table>
                        );

                    if (searchRows.length === 0 && !this.state.isLoading) {
                        searchTable = empty;
                    } else if (this.state.isLoading){
                        searchTable = <ReactLoading />
                    }

                    var selectedRows = this.state.selected.map(function(domain, index){
                        return (
                                <ReactSelectedRow key={index} domain={domain} mainDomain={this.state.mainDomain}
                                 onClickDeleteCallback={this.onClickSelectDelete}
                                 onClickRadioCallback={this.onClickMainDomain}/>
                            );
                    }.bind(this))

                    var selectedTable = (
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th>设置主域名</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedRows}
                                </tbody>
                            </Table>
                        );

                    if (selectedRows.length === 0) {
                        selectedTable = empty;
                    } 

                    var reactDoubleSelect = (
                        <div className="row">
                            <div className="col-md-6">
                                <Panel header={header} style={{maxHeight: "600px", "overflow": "auto"}}>
                                    {searchTable}
                                </Panel>
                                <Button bsStyle="success" onClick={this.onClickSelectAll}>全部选择</Button>
                            </div>
                            <div className="col-md-6">
                                <Panel header="已选域名" style={{maxHeight: "600px", "overflow": "auto"}}>
                                    {selectedTable}
                                </Panel>
                                <Button bsStyle="danger" onClick={this.onClickClearAll}>全部清空</Button>
                            </div>
                        </div>
                    );

                    return reactDoubleSelect

                }
            });

        return ReactDoubleSelect;
    });