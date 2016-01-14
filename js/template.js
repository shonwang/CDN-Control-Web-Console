define(function () {
    this['JST'] = this['JST'] || {};

    this['JST']['tpl/alert.info.html'] = '<div class="alert alert-dismissable <%=data.type%>"><button type="button" class="close" data-dismiss="alert">×</button><strong><%=data.message%></strong></div>';

    this['JST']['tpl/channelManage/channelManage.disp.table.html'] = '<table class="table table-striped table-hover"><thead><tr><th><input type="checkbox" id="inlineCheckbox6" <% if (isCheckedAll) { %> checked="true" <% } %>></th><th>名称</th><th>状态</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].id%>"><td><input type="checkbox" id="<%=data[i].id%>" <% if (data[i].isChecked) { %> checked="true" <% } %> ></td><td><%=data[i]["dispDomain"]%></td><td><%=data[i]["statusName"]%></td></tr><% } %></tbody></table>';

    this['JST']['tpl/channelManage/channelManage.html'] = '<div class="channel-manage fadeInDown animated"><h2>客户资源<small>/频道管理</small></h2><div class="error-ctn"></div><div class="well opt-ctn"><form class="form-inline"><div class="form-group"><label for="input-domain">域名</label><input type="text" class="form-control" id="input-domain"></div><div class="form-group"><label for="input-client">客户</label><input type="text" class="form-control" id="input-client"></div><div class="form-group"><label for="dropdown-status">状态</label></div><div class="form-group dropdown-status"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-status" data-toggle="dropdown"><span class="cur-value">全部</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><a href="javascript:void(0)" class="btn btn-primary btn-raised query"><span class="glyphicon glyphicon-search"></span>查询</a></form></div><div class="well"><div class="table-ctn table-responsive"></div><div class="page-ctn row"><div class="col-md-8" style="text-align:center"><div class="pagination"></div></div><div class="col-md-4" style="text-align:center"><form class="form-inline page-info"><div class="form-group"><div class="form-control-static">每页显示</div></div><div class="form-group page-num"><div class="drop-ctn dropup"><div class="btn-group"><button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown"><span class="cur-value">10 条</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div></div><div class="form-group"><div class="form-control-static total-items">共<span class="text-primary">0</span>条记录</div></div></form></div></div></div></div>';

    this['JST']['tpl/channelManage/channelManage.table.html'] = '<table class="table table-striped table-hover"><thead><tr><!--         <th><input type="checkbox" id="inlineCheckbox6"></th> --><th>域名/名称</th><th>加速域名</th><th>CDN厂商</th><th>业务类型</th><th>客户名称</th><th>状态</th><th>开始服务时间</th><th>操作</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].attributes.id%>"><!--               <td><input type="checkbox" id="<%=data[i].id%>"></td> --><td><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="disp"><%=data[i].attributes["domain"]%></a></td><td><%=data[i].attributes["accelerateDomain"]%></td><td><%=data[i].attributes["cdnCompany"]%></td><td><%=data[i].attributes["businessTypeName"]%></td><td><%=data[i].attributes["clientName"]%></td><td><%=data[i].attributes["statusName"]%></td><td><%=data[i].attributes["startTimeFormated"]%></td><td><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="edit" title="编辑"><span class="glyphicon glyphicon-edit"></span></a></td></tr><% } %></tbody></table>';

    this['JST']['tpl/coverManage/coverManage.html'] = '<div class="cover-manage fadeInDown animated"><h2>区域管理<small>/覆盖管理</small></h2><div class="error-ctn"></div><div class="well opt-ctn"><form class="form-inline"><div class="form-group"><label for="dropdown-region">区域</label></div><div class="form-group dropdown-region"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-region" data-toggle="dropdown"><span class="cur-value">全部</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><a href="javascript:void(0)" class="btn btn-primary query"><span class="glyphicon glyphicon-search"></span>查询</a></form></div><div class="well"><div class="map-ctn"></div></div></div>';

    this['JST']['tpl/coverRegion/coverRegion.html'] = '<div class="cover-region fadeInDown animated"><h2>区域管理<small>/节点区域关联</small></h2><div class="error-ctn"></div><div class="well opt-ctn"><form class="form-inline"><div class="form-group"><label for="dropdown-region">区域</label></div><div class="form-group dropdown-region"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-region" data-toggle="dropdown"><span class="cur-value">全部</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><a href="javascript:void(0)" class="btn btn-primary query"><span class="glyphicon glyphicon-search"></span>查询</a></form></div><div class="well"><div class="table-ctn table-responsive"></div><div class="page-ctn row"><div class="col-md-8" style="text-align:center"><div class="pagination"></div></div><div class="col-md-4" style="text-align:center"><form class="form-inline page-info"><div class="form-group"><div class="form-control-static">每页显示</div></div><div class="form-group page-num"><div class="drop-ctn dropup"><div class="btn-group"><button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown"><span class="cur-value">10 条</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div></div><div class="form-group"><div class="form-control-static total-items">共<span class="text-primary">0</span>条记录</div></div></form></div></div></div></div>';

    this['JST']['tpl/coverRegion/coverRegion.table.html'] = '<table class="table table-striped table-hover"><thead><tr><th>节点</th><th>区域</th><th>Level</th><th>备注</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].attributes.id%>"><td><%=data[i].attributes.nodeName%></td><td><%=data[i].attributes.regionName%></td><td><%=data[i].attributes.crossLevelName%></td><td><%=data[i].attributes.remark%></td></tr><% } %></tbody></table>';

    this['JST']['tpl/deviceManage/deviceManage.add&edit.html'] = '<div><form class="form-horizontal"><div class="form-group"><label for="input-name" class="col-sm-2 control-label">名称</label><div class="col-sm-8"><input type="text" class="form-control" id="input-name"></div></div><div class="form-group dropdown-node"><label for="dropdown-node" class="col-sm-2 control-label">节点</label><div class="dropdown col-sm-8"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-node" data-toggle="dropdown"><span class="cur-value">加载中...</span><span class="caret"></span></button><ul class="dropdown-menu long-dropdown-menu"></ul></div></div><div class="form-group dropdown-type"><label for="dropdown-type" class="col-sm-2 control-label">类型</label><div class="dropdown col-sm-8"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-type" data-toggle="dropdown"><span class="cur-value">lvs</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><div class="form-group"><label for="textarea-comment" class="col-sm-2 control-label">备注</label><div class="col-sm-8"><textarea class="form-control" rows="3" id="textarea-comment"></textarea></div></div></form><div class="ip-table-ctn table-responsive"></div><hr><form class="form-inline ip-ctn"><div class="form-group"><label for="input-ip">IP</label><input type="text" class="form-control" id="input-ip"></div><div class="form-group"><label for="dropdown-ip-type">类型</label></div><div class="form-group ip-type"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-ip-type" data-toggle="dropdown"><span class="cur-value">内网IP</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><a href="javascript:void(0)" class="btn btn-success create"><span class="glyphicon glyphicon-plus"></span>添加IP</a></form></div>';

    this['JST']['tpl/deviceManage/deviceManage.html'] = '<div class="device-manage fadeInDown animated"><h2>资源管理<small>/设备管理</small></h2><div class="error-ctn"></div><div class="well opt-ctn"><form class="form-inline"><div class="form-group"><label for="input-domain">名称</label><input type="text" class="form-control" id="input-domain"></div><div class="form-group"><label for="input-node">节点名称</label><input type="text" class="form-control" id="input-node"></div><div class="form-group"><label for="dropdown-status">状态</label></div><div class="form-group dropdown-status"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-status" data-toggle="dropdown"><span class="cur-value">全部</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><div class="form-group"><label for="dropdown-type">类型</label></div><div class="form-group dropdown-type"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-type" data-toggle="dropdown"><span class="cur-value">全部</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><a href="javascript:void(0)" class="btn btn-primary query"><span class="glyphicon glyphicon-search"></span>查询</a><a href="javascript:void(0)" class="btn btn-success create"><span class="glyphicon glyphicon-plus"></span>新建</a></form></div><div class="well"><div class="table-ctn table-responsive"></div><div class="page-ctn row"><div class="col-md-8" style="text-align:center"><div class="pagination"></div></div><div class="col-md-4" style="text-align:center"><form class="form-inline page-info"><div class="form-group"><div class="form-control-static">每页显示</div></div><div class="form-group page-num"><div class="drop-ctn dropup"><div class="btn-group"><button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown"><span class="cur-value">10 条</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div></div><div class="form-group"><div class="form-control-static total-items">共<span class="text-primary">0</span>条记录</div></div></form></div></div></div></div>';

    this['JST']['tpl/deviceManage/deviceManage.ip.table.html'] = '<table class="table table-striped table-hover"><thead><tr><th>#</th><th>IP</th><th>类型</th><th>操作</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].id%>"><td><%=data[i]["id"]%></td><td><%=data[i]["ip"]%></td><td><%=data[i]["typeName"]%></td><td><a href="javascript:void(0)" id="<%=data[i][\'id\']%>" class="delete" title="删除"><span class="glyphicon glyphicon-trash"></span></a></td></tr><% } %></tbody></table>';

    this['JST']['tpl/deviceManage/deviceManage.ipmanage.html'] = '<div><div class="ip-table-ctn table-responsive"></div><hr><form class="form-inline ip-ctn"><div class="form-group"><label for="input-ip">IP</label><input type="text" class="form-control" id="input-ip"></div><div class="form-group"><label for="dropdown-ip-type">类型</label></div><div class="form-group ip-type"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-ip-type" data-toggle="dropdown"><span class="cur-value">内网IP</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><a href="javascript:void(0)" class="btn btn-success create"><span class="glyphicon glyphicon-plus"></span>添加IP</a></form></div>';

    this['JST']['tpl/deviceManage/deviceManage.table.html'] = '<table class="table table-striped table-hover"><thead><tr><th>名称</th><th>节点</th><th>类型</th><th>状态</th><th>创建时间</th><th>操作</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].attributes.id%>"><td><%=data[i].attributes["name"]%></td><td><%=data[i].attributes["nodeName"]%></td><td><%=data[i].attributes["typeName"]%></td><td><%=data[i].attributes["statusName"]%></td><td><%=data[i].attributes["createTimeFormated"]%></td><td><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="edit" title="编辑"><span class="glyphicon glyphicon-edit"></span></a><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="delete" title="删除"><span class="glyphicon glyphicon-trash"></span></a><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="ip-manage" title="ip管理"><span class="glyphicon glyphicon-list-alt"></span></a><% if (data[i].attributes.status !== 1) { %><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="play" title="开启"><span class="glyphicon glyphicon-play-circle"></span></a><% } %><% if (data[i].attributes.status === 1) { %><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="hangup" title="挂起"><span class="glyphicon glyphicon-time"></span></a><% } %><% if (data[i].attributes.status !== 3) { %><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="stop" title="关闭"><span class="glyphicon glyphicon-off"></span></a><% } %></td></tr><% } %></tbody></table>';

    this['JST']['tpl/dispConfig/dispConfig.html'] = '<div class="disp-config fadeInDown animated"><h2>服务管理<small>/调度配置</small></h2><div class="error-ctn"></div><div class="well opt-ctn"><form class="form-inline"><div class="form-group"><label for="dropdown-disp">调度组</label></div><div class="form-group dropdown-disp"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-disp" data-toggle="dropdown"><span class="cur-value">加载中...</span><span class="caret"></span></button><ul class="dropdown-menu long-dropdown-menu"></ul></div></div><div class="form-group"><label for="dropdown-region">区域</label></div><div class="form-group dropdown-region"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-region" data-toggle="dropdown"><span class="cur-value">全部</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><a href="javascript:void(0)" class="btn btn-primary query"><span class="glyphicon glyphicon-search"></span>查询</a><a href="javascript:void(0)" class="btn btn-info init"><span class="glyphicon glyphicon-console"></span>初始化覆盖区域</a><a href="javascript:void(0)" class="btn btn-success sending"><span class="glyphicon glyphicon-send"></span>下发DNSpod</a></form></div><div class="well"><div class="table-ctn table-responsive"></div><div class="page-ctn row"><div class="col-md-8" style="text-align:center"><div class="pagination"></div></div><div class="col-md-4" style="text-align:center"><form class="form-inline page-info"><div class="form-group"><div class="form-control-static">每页显示</div></div><div class="form-group page-num"><div class="drop-ctn dropup"><div class="btn-group"><button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown"><span class="cur-value">10 条</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div></div><div class="form-group"><div class="form-control-static total-items">共<span class="text-primary">0</span>条记录</div></div></form></div></div></div></div>';

    this['JST']['tpl/dispConfig/dispConfig.selectNode.html'] = '<div><div class="text-right"><a href="javascript:void(0)" class="more">更多节点</a></div><div class="node-list" style="padding: 20px;"></div></div>';

    this['JST']['tpl/dispConfig/dispConfig.selectNode.list.html'] = '<div><% for(var i = 0; i < data.length; i++) { %><div class="radio"><label><input type="radio" name="optionsRadios" id=\'<%=data[i]["node.id"]%>\' value="<%=data[i]["node.id"]%>" <% if(data[i]["node.id"] == nodeId) { %> checked="true" <% } %>><%=data[i]["node.chName"] + "(" + data[i]["node.minBandwidth"] + "/" + data[i]["node.maxBandwidth"] + ")L" +data[i]["cover.crossLevel"]%></label></div><% if(data[i]["line"]) { %> <hr> <% } %><% } %></div>';

    this['JST']['tpl/dispConfig/dispConfig.table.html'] = '<table class="table table-striped table-hover"><thead><tr><!-- <th><input type="checkbox" id="inlineCheckbox7"></th> --><th>调度组名称</th><th>记录类型</th><th>区域</th><th>节点</th><th>TTL</th><th>操作</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].attributes.id%>" <% if(data[i].attributes["isUpdated"]) { %> class="danger" <% } %>><!-- <td><input type="checkbox" id="<%=data[i].id%>"></td> --><td><%=data[i].attributes["dispGroup.dispDomain"]%></td><td><%=data[i].attributes["config.typeName"]%></td><td><%=data[i].attributes["region.name"]%></td><td><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="edit" title="编辑节点"><%=data[i].attributes["nodeString"]%><span class="glyphicon glyphicon-edit" style="margin-left:5px"></span></a></td><td><%=data[i].attributes["dispGroup.ttl"]%></td><td><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="adjust" title="调整"><span class="glyphicon glyphicon-cog"></span></a></td></tr><% } %></tbody></table>';

    this['JST']['tpl/dispGroup/dispGroup.add&edit.html'] = '<div><form class="form-horizontal"><div class="form-group"><label for="input-name" class="col-sm-2 control-label">名称</label><div class="col-sm-8"><input type="text" class="form-control" id="input-name"></div></div><div class="form-group setup"><label class="col-sm-2 control-label">配置</label><div class="col-sm-8"><label class="checkbox-inline"><input type="checkbox" id="inlineCheckbox1" checked="true">成本</label><label class="checkbox-inline"><input type="checkbox" id="inlineCheckbox2">质量</label></div></div><div class="form-group"><label for="input-ttl" class="col-sm-2 control-label">TTL</label><div class="col-sm-8"><input type="text" class="form-control" id="input-ttl"></div></div><div class="form-group dropdown-level"><label for="dropdown-level" class="col-sm-2 control-label">Level</label><div class="dropdown col-sm-8"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-level" data-toggle="dropdown"><span class="cur-value">L0</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><div class="form-group"><label for="textarea-comment" class="col-sm-2 control-label">备注</label><div class="col-sm-8"><textarea class="form-control" rows="3" id="textarea-comment"></textarea></div></div><div class="form-group ip-type"><label class="col-sm-2 control-label">IP类型</label><div class="col-sm-8"><label class="checkbox-inline"><input type="checkbox" id="inlineCheckbox3" checked="true">LVS</label><label class="checkbox-inline"><input type="checkbox" id="inlineCheckbox4">cache</label></div></div></form><div class="table-ctn table-responsive long-dropdown-menu"></div></div>';

    this['JST']['tpl/dispGroup/dispGroup.channel.html'] = '<div><div class="alert alert-dismissable alert-info"><button type="button" class="close" data-dismiss="alert">×</button><strong>提示：</strong>勾选表示关联，取消勾选表示取消关联</div><div class="table-ctn table-responsive"></div><div class="page-ctn text-center"><div class="pagination"></div></div></div>';

    this['JST']['tpl/dispGroup/dispGroup.channel.table.html'] = '<table class="table table-striped table-hover"><thead><tr><th><input type="checkbox" id="inlineCheckbox6" <% if (isCheckedAll) { %> checked="true" <% } %>></th><th>域名/名称</th><th>加速域名</th><th>客户名称</th><th>状态</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].id%>"><td><input type="checkbox" id="<%=data[i].id%>" <% if (data[i].isChecked) { %> checked="true" <% } %> ></td><td><%=data[i]["domain"]%></td><td><%=data[i]["accelerateDomain"]%></td><td><%=data[i]["clientName"]%></td><td><%=data[i]["statusName"]%></td></tr><% } %></tbody></table>';

    this['JST']['tpl/dispGroup/dispGroup.copy.html'] = '<form class="form-horizontal"><div class="form-group dropdown-copy"><label for="dropdown-copy" class="col-sm-4 control-label">被复制的调度组</label><div class="form-control-static col-sm-4"><%=data.attributes.dispDomain%></div></div><div class="form-group"><label for="input-new-name" class="col-sm-4 control-label">新调度组名称</label><div class="col-sm-6"><input type="text" class="form-control" id="input-new-name"></div></div><div class="form-group"><label for="textarea-comment" class="col-sm-4 control-label">备注</label><div class="col-sm-6"><textarea class="form-control" rows="3" id="textarea-comment"></textarea></div></div></form>';

    this['JST']['tpl/dispGroup/dispGroup.detail.table.html'] = '<table class="table table-striped table-hover"><thead><tr><th>名称</th><th>英文缩写</th><th>状态</th><th>类型</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].id%>"><td><%=data[i]["chName"]%></td><td><%=data[i]["name"]%></td><td><%=data[i]["statusName"]%></td><td><%=data[i]["typeName"]%></td></tr><% } %></tbody></table>';

    this['JST']['tpl/dispGroup/dispGroup.html'] = '<div class="disp-manage fadeInDown animated"><h2>服务管理<small>/调度组管理</small></h2><div class="error-ctn"></div><div class="well opt-ctn"><form class="form-inline"><div class="form-group"><label for="input-domain">名称</label><input type="text" class="form-control" id="input-domain"></div><div class="form-group"><label for="dropdown-status">状态</label></div><div class="form-group dropdown-status"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-status" data-toggle="dropdown"><span class="cur-value">全部</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><div class="form-group"><label for="dropdown-type">Level</label></div><div class="form-group dropdown-type"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-type" data-toggle="dropdown"><span class="cur-value">全部</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><a href="javascript:void(0)" class="btn btn-primary query"><span class="glyphicon glyphicon-search"></span>查询</a><a href="javascript:void(0)" class="btn btn-success create"><span class="glyphicon glyphicon-plus"></span>新建</a></form></div><div class="well"><div class="table-ctn table-responsive"></div><div class="page-ctn row"><div class="col-md-8" style="text-align:center"><div class="pagination"></div></div><div class="col-md-4" style="text-align:center"><form class="form-inline page-info"><div class="form-group"><div class="form-control-static">每页显示</div></div><div class="form-group page-num"><div class="drop-ctn dropup"><div class="btn-group"><button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown"><span class="cur-value">10 条</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div></div><div class="form-group"><div class="form-control-static total-items">共<span class="text-primary">0</span>条记录</div></div></form></div></div></div></div>';

    this['JST']['tpl/dispGroup/dispGroup.node.table.html'] = '<table class="table table-striped table-hover long-dropdown-menu"><caption>节点列表</caption><thead><tr><th><input type="checkbox" id="inlineCheckbox5"></th><th>名称</th><th>英文缩写</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].id%>"><td><input type="checkbox" id="<%=data[i].id%>"></td><td><%=data[i]["chName"]%></td><td><%=data[i]["name"]%></td></tr><% } %></tbody></table>';

    this['JST']['tpl/dispGroup/dispGroup.table.html'] = '<table class="table table-striped table-hover"><thead><tr><th>名称</th><th>配置</th><th>TTL</th><th>Level</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].attributes.id%>"><td><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="disp-domain"><%=data[i].attributes["dispDomain"]%></a></td><td><%=data[i].attributes["priorityName"]%></td><td><%=data[i].attributes["ttl"]%></td><td><%=data[i].attributes["crossLevelName"]%></td><td><%=data[i].attributes["statusName"]%></td><td><%=data[i].attributes["updateTimeFormated"]%></td><td><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="edit" title="编辑"><span class="glyphicon glyphicon-edit"></span></a><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="copy" title="复制"><span class="glyphicon glyphicon-duplicate"></span></a><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="channel" title="频道信息"><span class="glyphicon glyphicon glyphicon-tasks"></span></a><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="version" title="版本信息"><span class="glyphicon glyphicon glyphicon-list-alt"></span></a><% if (data[i].attributes.status !== 1) { %><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="play" title="开启"><span class="glyphicon glyphicon-play-circle"></span></a><% } %><% if (data[i].attributes.status !== 0) { %><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="stop" title="关闭"><span class="glyphicon glyphicon-off"></span></a><% } %><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="delete" title="删除"><span class="glyphicon glyphicon-trash"></span></a></td></tr><% } %></tbody></table>';

    this['JST']['tpl/empty.html'] = '<div class="alert alert-dismissable alert-info text-center"><button type="button" class="close" data-dismiss="alert">×</button><strong>暂无数据</strong></div>';

    this['JST']['tpl/loading.html'] = '<div class="spinner"><div class="cube1">稍</div><div class="cube2">等</div></div>';

    this['JST']['tpl/modal.html'] = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel"></h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-primary">确定</button><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button></div></div></div></div>';

    this['JST']['tpl/navbar.html'] = '<div class="collapse navbar-collapse" id="ks-cdn-ctr-menu"><ul class="nav navbar-nav"><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">客户资源<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#">频道管理</a></li></ul></li><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">资源管理<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#/nodeManage">节点管理</a></li><li><a href="#/deviceManage/none">设备管理</a></li></ul></li><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">服务管理<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#/dispGroup">调度组管理</a></li><li><a href="#/dispConfig">调度配置</a></li></ul></li><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">区域管理<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#/coverManage">覆盖管理</a></li><li><a href="#/coverRegion">节点区域关联</a></li></ul></li></ul><ul class="nav navbar-nav navbar-right"><li><a href="javascript:void(0)">管理员：</a></li><li><a href="javascript:void(0)">张彬</a></li></ul></div>';

    this['JST']['tpl/nodeManage/nodeManage.add&edit.html'] = '<form class="form-horizontal"><div class="form-group"><label for="input-name" class="col-sm-2 control-label">名称</label><div class="col-sm-8"><input type="text" class="form-control" id="input-name" value="<%=data.chName%>"></div></div><div class="form-group"><label for="input-english" class="col-sm-2 control-label">英文缩写</label><div class="col-sm-8"><input type="text" class="form-control" id="input-english" value="<%=data.name%>"></div></div><div class="form-group dropdown-operator"><label for="dropdown-operator" class="col-sm-2 control-label">运营商</label><div class="dropdown col-sm-8"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-operator" data-toggle="dropdown"><span class="cur-value">加载中...</span><span class="caret"></span></button><ul class="dropdown-menu long-dropdown-menu"></ul></div></div><div class="form-group"><label for="input-maxbandwidth" class="col-sm-2 control-label">上联带宽</label><div class="col-sm-8"><input type="text" class="form-control" id="input-maxbandwidth" value="<%=data.maxBandwidth%>"></div></div><div class="form-group"><label for="input-minbandwidth" class="col-sm-2 control-label">保底带宽</label><div class="col-sm-8"><input type="text" class="form-control" id="input-minbandwidth" value="<%=data.minBandwidth%>"></div></div><div class="form-group"><label for="input-threshold" class="col-sm-2 control-label">带宽阀值</label><div class="col-sm-8"><input type="text" class="form-control" id="input-threshold" value="<%=data.maxBandwidthThreshold%>"></div></div><div class="form-group"><label for="input-unitprice" class="col-sm-2 control-label">成本权值</label><div class="col-sm-8"><input type="text" class="form-control" id="input-unitprice" value="<%=data.unitPrice%>"></div></div><div class="form-group"><label for="input-outzabname" class="col-sm-2 control-label">出口带宽zabbix名称</label><div class="col-sm-8"><input type="text" class="form-control" id="input-outzabname" value="<%=data.outZabName%>"></div></div><div class="form-group"><label for="input-inzabname" class="col-sm-2 control-label">入口带宽zabbix名称</label><div class="col-sm-8"><input type="text" class="form-control" id="input-inzabname" value="<%=data.inZabName%>"></div></div><div class="form-group"><label for="textarea-comment" class="col-sm-2 control-label">备注</label><div class="col-sm-8"><textarea class="form-control" rows="3" id="textarea-comment"><%=data.remark%></textarea></div></div></form>';

    this['JST']['tpl/nodeManage/nodeManage.html'] = '<div class="node-manage fadeInDown animated"><h2>资源管理<small>/节点管理</small></h2><div class="error-ctn"></div><div class="well opt-ctn"><form class="form-inline"><div class="form-group"><label for="input-name">名称</label><input type="text" class="form-control" id="input-name"></div><div class="form-group"><label for="input-client">运营商</label><input type="text" class="form-control" id="input-client"></div><div class="form-group"><label for="dropdown-status">状态</label></div><div class="form-group dropdown-status"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdown-status" data-toggle="dropdown"><span class="cur-value">全部</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div><a href="javascript:void(0)" class="btn btn-primary query"><span class="glyphicon glyphicon-search"></span>查询</a><a href="javascript:void(0)" class="btn btn-success create"><span class="glyphicon glyphicon-plus"></span>新建</a></form></div><div class="well"><div class="table-ctn table-responsive"></div><div class="page-ctn row"><div class="col-md-8" style="text-align:center"><div class="pagination"></div></div><div class="col-md-4" style="text-align:center"><form class="form-inline page-info"><div class="form-group"><div class="form-control-static">每页显示</div></div><div class="form-group page-num"><div class="drop-ctn dropup"><div class="btn-group"><button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown"><span class="cur-value">10 条</span><span class="caret"></span></button><ul class="dropdown-menu"></ul></div></div></div><div class="form-group"><div class="form-control-static total-items">共<span class="text-primary">0</span>条记录</div></div></form></div></div></div></div>';

    this['JST']['tpl/nodeManage/nodeManage.table.html'] = '<table class="table table-striped table-hover"><thead><tr><th>名称</th><th>英文缩写</th><th>运营商</th><th>上联带宽</th><th>保底带宽</th><th>成本权值</th><th>带宽阈值</th><th>入口带宽zabbix名称</th><th>出口带宽zabbix名称</th><th>状态</th><th>创建时间</th><th>操作</th></tr></thead><tbody><% for(var i = 0; i < data.length; i++) { %><tr data-id="<%=data[i].attributes.id%>"><td><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="node-name"><%=data[i].attributes["chName"]%></a></td><td><%=data[i].attributes["name"]%></td><td><%=data[i].attributes["operatorName"]%></td><td><%=data[i].attributes["maxBandwidth"]%></td><td><%=data[i].attributes["minBandwidth"]%></td><td><%=data[i].attributes["unitPrice"]%></td><td><%=data[i].attributes["maxBandwidthThreshold"]%></td><td><%=data[i].attributes["inZabName"]%></td><td><%=data[i].attributes["outZabName"]%></td><td><%=data[i].attributes["statusName"]%></td><td><%=data[i].attributes["createTimeFormated"]%></td><td><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="edit" title="编辑"><span class="glyphicon glyphicon-edit"></span></a><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="delete" title="删除"><span class="glyphicon glyphicon-trash"></span></a><% if (data[i].attributes.status !== 1) { %><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="play" title="开启"><span class="glyphicon glyphicon-play-circle"></span></a><% } %><% if (data[i].attributes.status === 1) { %><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="hangup" title="挂起"><span class="glyphicon glyphicon-time"></span></a><% } %><% if (data[i].attributes.status !== 3) { %><a href="javascript:void(0)" id="<%=data[i].attributes[\'id\']%>" class="stop" title="关闭"><span class="glyphicon glyphicon-off"></span></a><% } %></td></tr><% } %></tbody></table>';

    this['JST']['tpl/success.popup.html'] = '<div class="alert alert-dismissable alert-success"><strong class="h4"><%=data.message%></strong></div>';

    return this['JST'];
});