define("react.table", ['require', 'exports'],
    function(require, exports) {
        var Table = ReactBootstrap.Table;

        var ReactTableRow = React.createBackboneClass({

            render: function() {
                var model = this.getModel();
                var tds = this.props.rowFeilds.map(function(feildName, index){
                    var td = React.createElement("td", {key: index}, model.get(feildName));
                    if (feildName === "checkbox"){
                        td = React.createElement("td", {key: index}, React.createElement("input", {type: "checkbox", id: model.get('id')}));
                    }
                    return td;
                });
                var buttons = this.props.operationList.map(function(operation, index){
                    return React.createElement("a", {key: index, 
                              href: "javascript:void(0)", 
                              className: operation.className, 
                              id: model.get('id'), 
                              onClick: operation.callback}, operation.name);
                });

                return (
                    React.createElement("tr", null, 
                        tds, 
                        React.createElement("td", null, buttons)
                    )
                )
            }
        });

        var ReactTable = React.createBackboneClass({

            render: function() {
                var operationList = this.props.operationList,
                    rowFeilds = this.props.rowFeilds;
                var rows = this.getCollection().map(function(model, index){
                    return React.createElement(ReactTableRow, {key: index, model: model, operationList: operationList, rowFeilds: rowFeilds});
                });
                var theadName = this.props.theadNames.map(function(name, index){
                    var th = React.createElement("th", {key: index}, name)
                    if (name === "checkbox"){
                        th = React.createElement("th", {key: index}, React.createElement("input", {type: "checkbox"}))
                    }
                    return th;
                });

                var table = null;
                if (rows.length > 0) {
                    table = (
                        React.createElement(Table, {striped: true, hover: true}, 
                            React.createElement("thead", null, 
                                React.createElement("tr", null, 
                                    theadName, 
                                    React.createElement("th", null, "操作")
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