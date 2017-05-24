define("isomorphismManage.react.table", ['require', 'exports'],
    function(require, exports) {
        var Table = ReactBootstrap.Table;
        var Tooltip = ReactBootstrap.Tooltip;
        var OverlayTrigger = ReactBootstrap.OverlayTrigger;
        var Button = ReactBootstrap.Button;

        var IsomorphismManageTableRow = React.createBackboneClass({
            render: function() {

                var tooltip = (
                    React.createElement(Tooltip, {id: "tooltip"}, this.getModel().get('remark') || "无")
                );

                return React.createElement("tr", null, 
                    React.createElement("td", null, this.getModel().get('name')), 
                    React.createElement("td", null, this.getModel().get('typeName')), 
                    React.createElement("td", null, this.getModel().get('createTimeStr')), 
                    React.createElement("td", null, this.getModel().get('updateTimeStr')), 
                    React.createElement("td", null, 
                        React.createElement(OverlayTrigger, {placement: "top", overlay: tooltip}, 
                            React.createElement(Button, {bsStyle: "link"}, "备注")
                        )
                    )
                )
            }
        });

        var IsomorphismManageTable = React.createBackboneClass({
            render: function() {
                var rows = this.getCollection().map(function(model, index){
                    return React.createElement(IsomorphismManageTableRow, {key: index, model: model});
                });
                return(
                    React.createElement(Table, {striped: true, condensed: true, hover: true}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", null, "分层策略名称"), 
                                React.createElement("th", null, "应用"), 
                                React.createElement("th", null, "创建时间"), 
                                React.createElement("th", null, "修改时间"), 
                                React.createElement("th", null, "备注")
                            )
                        ), 
                        React.createElement("tbody", null, 
                            rows
                        )
                    )
                );
            }
        });
        return IsomorphismManageTable;
    });