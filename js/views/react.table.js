define("react.table", ['require', 'exports'],
    function(require, exports) {
        var Table = ReactBootstrap.Table;

        var ReactTableRow = React.createBackboneClass({

            handleClickCheckbox: function(event){
                var model = this.getModel(),
                    collection = this.getCollection();
                model.set("isChecked", !model.get("isChecked"))

                this.props.checkboxCallback&&this.props.checkboxCallback();
            },

            render: function() {
                var model = this.getModel();
                var tds = this.props.rowFeilds.map(function(feildName, index){
                    var td = React.createElement("td", {key: index}, model.get(feildName));
                    if (feildName === "checkbox"){
                        td = React.createElement("td", {key: index}, 
                                React.createElement("input", {type: "checkbox", checked: model.get('isChecked'), onChange: this.handleClickCheckbox})
                             );
                    }
                    return td;
                }.bind(this));
                var buttons = this.props.operationList.map(function(operation, index){
                    return React.createElement("a", {key: index, 
                              href: "javascript:void(0)", 
                              className: operation.className, 
                              id: model.get('id'), 
                              onClick: operation.callback}, operation.name);
                });
                var thOper = React.createElement("td", null, buttons);

                if (this.props.noOperCol) thOper = null;
                return (
                    React.createElement("tr", null, 
                        tds, 
                        thOper
                    )
                )
            }
        });

        var ReactTable = React.createBackboneClass({

            getInitialState: function () {
                return { isCheckedAll: false};
            },

            handleClickCheckbox: function(event){
                this.setState({ isCheckedAll: !this.state.isCheckedAll });
                var collection = this.getCollection();
                collection.each(function(model){
                    model.set("isChecked", event.target.checked)
                })
                this.props.onChangeCheckedBox&&this.props.onChangeCheckedBox(event);
            },

            handleItemClickCheckbox: function(event){
                var collection = this.getCollection();
                var checkedList = collection.filter(function(model){
                    return model.get("isChecked")
                })
                if (checkedList.length === collection.models.length) {
                    this.setState({ isCheckedAll: true });
                } else {
                    this.setState({ isCheckedAll: false });
                }
                this.props.onChangeCheckedBox&&this.props.onChangeCheckedBox(event);
            },

            render: function() {
                var operationList = this.props.operationList || [],
                    rowFeilds = this.props.rowFeilds,
                    collection = this.getCollection(),
                    noOperCol = this.props.noOperCol;

                var rows = collection.map(function(model, index){
                    return React.createElement(ReactTableRow, {key: index, 
                                          model: model, 
                                          operationList: operationList, 
                                          noOperCol: noOperCol, 
                                          rowFeilds: rowFeilds, 
                                          checkboxCallback: this.handleItemClickCheckbox});
                }.bind(this));
                var theadName = this.props.theadNames.map(function(name, index){
                    var th = React.createElement("th", {key: index}, name)
                    if (name === "checkbox"){
                        th = React.createElement("th", {key: index}, 
                                React.createElement("input", {type: "checkbox", onChange: this.handleClickCheckbox, checked: this.state.isCheckedAll})
                             )
                    }
                    return th;
                }.bind(this));

                var table = null, thOper = React.createElement("th", null, "操作");

                if (noOperCol) thOper = null;
                if (rows.length > 0) {
                    table = (
                        React.createElement(Table, {striped: true, hover: true}, 
                            React.createElement("thead", null, 
                                React.createElement("tr", null, 
                                    theadName, 
                                    thOper
                                )
                            ), 
                            React.createElement("tbody", null, 
                                rows
                            )
                        )
                    );
                } else {
                    table = (
                        React.createElement("div", {className: "empty-ctn"}, 
                            React.createElement(ReactBootstrap.Image, {src: "images/404.png", responsive: true, style: {margin:"0 auto"}}), 
                            React.createElement("p", {className: "text-muted text-center"}, "暂无数据")
                        )
                    )
                }

                return table

            }
        });
        return ReactTable;
    });