define("react.doubleSelect.panel", ['require', 'exports', 'react.backbone', 'react-bootstrap'],
    function(require, exports, React, ReactBootstrap) {
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
                    React.createElement("div", {className: "loader"}, 
                        React.createElement("div", {className: "loader-inner pacman"}, 
                            React.createElement("div", null), 
                            React.createElement("div", null), 
                            React.createElement("div", null), 
                            React.createElement("div", null), 
                            React.createElement("div", null)
                        )
                    )
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
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                React.createElement(Radio, {name: "radioGroup", onChange: this.onClickMainDomain, id: this.props.domain},  this.props.domain)
                            ), 
                            React.createElement("td", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleClickDelete, id: this.props.domain}, "删除"))
                        )
                    );
                if (this.props.mainDomain === this.props.domain) {
                    tr = (
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                React.createElement(Radio, {name: "radioGroup", onChange: this.onClickMainDomain, id: this.props.domain, checked: true},  this.props.domain)
                            ), 
                            React.createElement("td", null, React.createElement("span", {className: "label label-success"}, "主域名"))
                        )
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
                    React.createElement("tr", {onClick: this.handleClickTr}, 
                        React.createElement("td", null,  this.props.domain)
                    )
                );
            }
        });

        var ReactDoubleSelect = React.createBackboneClass({

                componentDidMount: function() {
                    var collection = this.getCollection()
                    collection.on("get.domain.success", $.proxy(this.onChannelListSuccess, this));
                    collection.on("get.domain.error", $.proxy(this.onGetError, this));                    
                },

                componentWillUnmount: function() {
                    var collection = this.getCollection()
                    collection.off("get.domain.success");
                    collection.off("get.domain.error");   
                },

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

                    var collection = this.getCollection();
                    collection.getDomains({
                        "domain": this.state.keyword,
                        "isCustom": true,
                        "type": 202
                    })

                    this.setState({
                        isLoading: true
                    })

                },

                onChannelListSuccess: function(res){
                    this.setState({
                        search: res,
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
                         React.createElement("div", null, 
                            React.createElement(FormGroup, {style: {marginBottom: 0}}, 
                                React.createElement(Col, {sm: 9}, 
                                    React.createElement(FormControl, {type: "text", placeholder: "搜索域名", bsSize: "small", 
                                                 value: this.state.keyword, onChange: this.onChangeInput, onKeyUp: this.onKeyupInput})
                                ), 
                                React.createElement(Col, {sm: 2}, 
                                    React.createElement(Button, {bsStyle: "primary", onClick: this.onClickSearch, bsSize: "small"}, "查询")
                                )
                            )
                        )
                    );

                    var empty = (
                            React.createElement("div", {className: "empty-ctn"}, 
                                React.createElement(ReactBootstrap.Image, {src: "images/404.png", responsive: true, style: {margin:"0 auto"}}), 
                                React.createElement("p", {className: "text-muted text-center"}, "暂无数据")
                            )
                        );

                    var searchRows = this.state.search.map(function(domain, index){
                        return (
                                React.createElement(ReactSearchRow, {key: index, domain: domain, onClickItemCallback: this.onClickSearchItem})
                            );
                    }.bind(this))

                    var searchTable = (
                            React.createElement(Table, {striped: true, hover: true}, 
                                React.createElement("thead", null, 
                                    React.createElement("tr", null, 
                                        React.createElement("th", null, "域名")
                                    )
                                ), 
                                React.createElement("tbody", null, 
                                    searchRows
                                )
                            )
                        );

                    if (searchRows.length === 0 && !this.state.isLoading) {
                        searchTable = empty;
                    } else if (this.state.isLoading){
                        searchTable = React.createElement(ReactLoading, null)
                    }

                    var selectedRows = this.state.selected.map(function(domain, index){
                        return (
                                React.createElement(ReactSelectedRow, {key: index, domain: domain, mainDomain: this.state.mainDomain, 
                                 onClickDeleteCallback: this.onClickSelectDelete, 
                                 onClickRadioCallback: this.onClickMainDomain})
                            );
                    }.bind(this))

                    var selectedTable = (
                            React.createElement(Table, {striped: true, hover: true}, 
                                React.createElement("thead", null, 
                                    React.createElement("tr", null, 
                                        React.createElement("th", null, "设置主域名"), 
                                        React.createElement("th", null, "操作")
                                    )
                                ), 
                                React.createElement("tbody", null, 
                                    selectedRows
                                )
                            )
                        );

                    if (selectedRows.length === 0) {
                        selectedTable = empty;
                    } 

                    var reactDoubleSelect = (
                        React.createElement("div", {className: "row"}, 
                            React.createElement("div", {className: "col-md-6"}, 
                                React.createElement(Panel, {header: header, style: {maxHeight: "600px", "overflow": "auto"}}, 
                                    searchTable
                                ), 
                                React.createElement(Button, {bsStyle: "success", onClick: this.onClickSelectAll}, "全部选择")
                            ), 
                            React.createElement("div", {className: "col-md-6"}, 
                                React.createElement(Panel, {header: "已选域名", style: {maxHeight: "600px", "overflow": "auto"}}, 
                                    selectedTable
                                ), 
                                React.createElement(Button, {bsStyle: "danger", onClick: this.onClickClearAll}, "全部清空")
                            )
                        )
                    );

                    return reactDoubleSelect

                }
            });

        return ReactDoubleSelect;
    });