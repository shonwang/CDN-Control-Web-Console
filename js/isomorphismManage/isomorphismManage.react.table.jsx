define("isomorphismManage.react.table", ['require', 'exports'],
    function(require, exports) {
        var Table = ReactBootstrap.Table;
        var Tooltip = ReactBootstrap.Tooltip;
        var OverlayTrigger = ReactBootstrap.OverlayTrigger;
        var Button = ReactBootstrap.Button;

        var IsomorphismManageTableRow = React.createBackboneClass({
            render: function() {

                var tooltip = (
                    <Tooltip id="tooltip">{this.getModel().get('remark') || "无"}</Tooltip>
                );

                return <tr>
                    <td>{this.getModel().get('name')}</td>
                    <td>{this.getModel().get('typeName')}</td>
                    <td>{this.getModel().get('createTimeStr')}</td>
                    <td>{this.getModel().get('updateTimeStr')}</td>
                    <td>
                        <OverlayTrigger placement="top" overlay={tooltip}>
                            <Button bsStyle="link">备注</Button>
                        </OverlayTrigger>
                    </td>
                </tr>
            }
        });

        var IsomorphismManageTable = React.createBackboneClass({
            render: function() {
                var rows = this.getCollection().map(function(model, index){
                    return <IsomorphismManageTableRow key={index} model={model}/>;
                });
                return(
                    <Table striped condensed hover>
                        <thead>
                            <tr>
                                <th>分层策略名称</th>
                                <th>应用</th>
                                <th>创建时间</th>
                                <th>修改时间</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                );
            }
        });
        return IsomorphismManageTable;
    });