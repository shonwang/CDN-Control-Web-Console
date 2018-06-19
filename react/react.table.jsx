define("react.table", ['require', 'exports', 'react.backbone', 'react-bootstrap'],
    function(require, exports, React, ReactBootstrap) {
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
                    var td = <td key={index}>{model.get(feildName)}</td>;
                    if (feildName === "checkbox"){
                        td = <td key={index}>
                                <input type="checkbox" checked={model.get('isChecked')} onChange={this.handleClickCheckbox} />
                             </td>;
                    }
                    return td;
                }.bind(this));
                var buttons = this.props.operationList.map(function(operation, index){
                    return <a key={index} 
                              href="javascript:void(0)" 
                              className={operation.className} 
                              id={model.get('id')} 
                              onClick={operation.callback}>{operation.name}</a>;
                });
                var thOper = <td>{buttons}</td>;

                if (this.props.noOperCol) thOper = null;
                return (
                    <tr>
                        {tds}
                        {thOper}
                    </tr>
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
                    return <ReactTableRow key={index} 
                                          model={model} 
                                          operationList={operationList}
                                          noOperCol={noOperCol} 
                                          rowFeilds={rowFeilds} 
                                          checkboxCallback={this.handleItemClickCheckbox}/>;
                }.bind(this));
                var theadName = this.props.theadNames.map(function(name, index){
                    var th = <th key={index}>{name}</th>
                    if (name === "checkbox"){
                        th = <th key={index}>
                                <input type="checkbox" onChange={this.handleClickCheckbox} checked={this.state.isCheckedAll} />
                             </th>
                    }
                    return th;
                }.bind(this));

                var table = null, thOper = <th>操作</th>;

                if (noOperCol) thOper = null;
                if (rows.length > 0) {
                    table = (
                        <Table striped hover>
                            <thead>
                                <tr>
                                    {theadName}
                                    {thOper}
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