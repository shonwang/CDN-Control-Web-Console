define("react.table", ['require', 'exports'],
    function(require, exports) {
        var Table = ReactBootstrap.Table;

        var ReactTableRow = React.createBackboneClass({

            render: function() {
                var model = this.getModel();
                var tds = this.props.rowFeilds.map(function(feildName, index){
                    var td = <td key={index}>{model.get(feildName)}</td>;
                    if (feildName === "checkbox"){
                        td = <td key={index}><input type="checkbox" id={model.get('id')} /></td>;
                    }
                    return td;
                });
                var buttons = this.props.operationList.map(function(operation, index){
                    return <a key={index} 
                              href="javascript:void(0)" 
                              className={operation.className} 
                              id={model.get('id')} 
                              onClick={operation.callback}>{operation.name}</a>;
                });

                return (
                    <tr>
                        {tds}
                        <td>{buttons}</td>
                    </tr>
                )
            }
        });

        var ReactTable = React.createBackboneClass({

            render: function() {
                var operationList = this.props.operationList,
                    rowFeilds = this.props.rowFeilds;
                var rows = this.getCollection().map(function(model, index){
                    return <ReactTableRow key={index} model={model} operationList={operationList} rowFeilds={rowFeilds}/>;
                });
                var theadName = this.props.theadNames.map(function(name, index){
                    var th = <th key={index}>{name}</th>
                    if (name === "checkbox"){
                        th = <th key={index}><input type="checkbox" /></th>
                    }
                    return th;
                });

                var table = null;
                if (rows.length > 0) {
                    table = (
                        <Table striped hover>
                            <thead>
                                <tr>
                                    {theadName}
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </Table>
                    );
                } else {
                    table = (
                        <div className="empty-ctn">
                            <ReactBootstrap.Image src="images/404.png" responsive style={{margin:"0 auto"}}/>
                            <p className="text-muted text-center">暂无数据</p>
                        </div>
                    )
                }

                return table

            }
        });
        return ReactTable;
    });