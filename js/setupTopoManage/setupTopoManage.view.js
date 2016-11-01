define("setupTopoManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var EditTopoView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },
        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.isEdit     = options.isEdit;
            this.rule       = [];
            this.allNodes   = [];//存储所有节点
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.edit.html'])({data: {}}));
            
            this.collection.off('get.topo.OriginInfo.success');
            this.collection.off('get.topo.OriginInfo.error');
            this.collection.on('get.topo.OriginInfo.success',$.proxy(this.onOriginInfo, this));
            this.collection.on('get.topo.OriginInfo.error',$.proxy(this.onGetError, this));

            //获取应用商类型
            this.collection.off("get.operator.success");
            this.collection.off("get.operator.error");
            this.collection.on("get.operator.success", $.proxy(this.setOperatorInfo, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));
            this.collection.getOperatorList();

             //添加拓扑关系
            this.collection.off('add.topo.success');
            this.collection.off('add.topo.error');
            this.collection.on('add.topo.success',$.proxy(this.addTopoSuccess, this));
            this.collection.on('add.topo.error',$.proxy(this.addTopoError, this));
            //修改拓扑关系
            this.collection.off('modify.topo.success');
            this.collection.off('modify.topo.error');
            this.collection.on('modify.topo.success',$.proxy(this.modifyTopoSuccess, this));
            this.collection.on('modify.topo.error',$.proxy(this.modifyTopoError, this));
            
            if(this.isEdit){
                this.collection.getTopoOrigininfo(this.model.get('id'));
            }else{
                this.defaultParam = {
                    "id":null,
                    "name":"拓扑关系名称",
                    "type":null,
                    "allNodes": [],
                    "upperNodes": [],
                    "rule": []
                }
                this.initSetup();
            }
        },
        addTopoSuccess: function(){
            //this.WhetherSaveSuccess = true;
            this.options.onSaveCallback && this.options.onSaveCallback();
            alert('保存成功');
        },
        addTopoError: function(error){
            if (error&&error.message){
                alert(error.message);
            }
            else
                alert("网络阻塞，请刷新重试！");

        },
        modifyTopoSuccess:function(){
            this.options.onSaveCallback && this.options.onSaveCallback();
            alert('修改成功');
        },
        modifyTopoError: function(error){
           if (error&&error.message){
                alert(error.message);
            }
            else
                alert("网络阻塞，请刷新重试！");
        },
        onOriginInfo: function(res){
            var tempModel = res;
            var allNodes = [];
            this.NodeleteNodes = [];
            _.each(tempModel.allNodes,function(el){
                allNodes.push(el.id);
                this.NodeleteNodes.push(el.id);
            }.bind(this));
            var upperNodes = [];
            _.each(tempModel.upperNodes,function(el){
                upperNodes.push(el.id);
            });
            this.defaultParam = {
                "id":tempModel.id,
                "name":tempModel.name,
                "allNodes": allNodes,
                "upperNodes":upperNodes,
                "rule": tempModel.rule,
                "type": tempModel.type
            }
            this.NodeleteNodes = [];
            _.each(this.defaultParam.allNodes,function(el){
                this.NodeleteNodes.push(el)  
            }.bind(this));
            this.$el.find("#input-name").val(tempModel.name);
            this.$el.find("#input-name").attr("readonly", "true");
            this.initSetup();
        },
        initSetup: function(){
            this.$el.find('.all .add-node').hide();
            this.$el.find('.upper .add-node').hide();
            
            this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            if (!this.isEdit)
                this.$el.find(".add-rule").on("click", $.proxy(this.onClickAddRuleButton, this));
            else
                this.$el.find(".add-rule").hide();
            
            this.collection.off("get.node.success");
            this.collection.off("get.node.error");
            this.collection.on("get.node.success", $.proxy(this.onGetAllNode, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            
            this.collection.off("get.devicetype.success");
            this.collection.off("get.devicetype.error");
            this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
            this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));
            
            this.collection.getNodeList(); //获取所有节点列表接口
            this.collection.getDeviceTypeList();//获取应用类型列表接口
            if(this.isEdit){
                var data = this.analyticFunction(this.defaultParam.rule);
                this.defaultParam.rule = this. analyticRuleFunction(this.defaultParam);
                this.initRuleTable(data);
            }
        },
        analyticFunction:function(data){
            var data_save = [];
            var self = this;
            _.each(data, function(el, key, ls){
                var data_save_content = {
                     id:null,
                    'localLayer':[],
                    'upperLayer':[]
                };
                if(el.localType == 2){
                    _.each(el.local,function(local){
                        data_save_content.localLayer.push(local.name)
                    })
                }else if(el.localType == 1){
                    _.each(el.local,function(local){
                         data_save_content.localLayer.push(local.name);
                    })
                }
                _.each(el.upper,function(upper){
                     data_save_content.upperLayer.push(upper.rsNodeMsgVo.name)
                               
                })
                data_save_content.localLayer = data_save_content.localLayer.join('、');
                data_save_content.upperLayer = data_save_content.upperLayer.join('、');
                data_save_content.id = key;
                data_save.push(data_save_content);

            });
            return data_save;
        },
        analyticRuleFunction: function(res){
            var rule = [];
            _.each(res.rule,function(el){
                var localAll = [];
                var upperAll = [];
                _.each(el.local,function(local){
                     localAll.push(local.id);
                })
                _.each(el.upper,function(upper){
                    upperAll.push({id:upper.rsNodeMsgVo.id,ipCorporation:upper.ipCorporation});
                })
                rule.push({id:el.id,localType:el.localType,local:localAll,upper:upperAll});
            });
            return rule;
        },
        onClickSaveButton:function(){
            var flag = true;
            this.defaultParam.name = $.trim(this.$el.find("#input-name").val());
            if(this.defaultParam.name == ''){
                alert('请输入拓扑关系名称');
                return ;
            }
            else if(this.defaultParam.type == null){
                alert('请选择设备类型');
                return ;
            }
            else if(this.defaultParam.allNodes.length == 0){
                alert('请选择加入拓扑关系的节点');
                return ;
            }
            else if(this.defaultParam.upperNodes.length == 0){
                alert('请选择拓扑关系的上层节点');
                return ;
            }
            else if(this.defaultParam.rule.length == 0){
                alert('请添加规则');
                return;
            }
            _.each(this.defaultParam.rule,function(el){
                if(el.local.length == 0){
                    alert('请在配置规则中选择本层节点');
                    flag = false;
                    return ;
                }else if(el.upper.length == 0){
                    alert('请在配置规则中选择上层节点');
                    flag = false;
                    return ;
                }
            })
             if(flag){
                if(this.isEdit){
                    console.log(this.defaultParam);
                    this.collection.topoModify(this.defaultParam);
                }
                else{
                    this.collection.topoAdd(this.defaultParam);
                }
             }
              
        },
        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },
        initDeviceDropMenu: function(res){
            this.deviceTypeArray = [];
            var typeArray = [],
            rootNode = this.$el.find(".dropdown-type");

            _.each(res, function(el, index, ls){
                typeArray.push({name:el.name, value: el.id});
                this.deviceTypeArray.push({name:el.name, value: el.id});
            }.bind(this));
            if (!this.isEdit){
                this.defaultParam.type = typeArray[0].value;
                var rootNode = this.$el.find(".dropdown-app");
                Utility.initDropMenu(rootNode, typeArray, function(value){
                       this.defaultParam.type = parseInt(value)
                }.bind(this));

               this.$el.find("#dropdown-app .cur-value").html(typeArray[0].name); 
                
            } else {
                //this.$el.find('#dropdown-app .cur-value').html()
                var upperObj = _.find(typeArray, function(object){
                    return object.value == this.defaultParam.type;
                }.bind(this))
                this.$el.find('#dropdown-app .cur-value').html(upperObj.name);
                this.$el.find("#dropdown-app").attr("disabled", "disabled")
            }
          
        },

        onGetAllNode: function(res){
            this.$el.find('.all .add-node').show();
            var nodesArray = [];
            
            this.selectedAllNodeList = [];
            this.nodesArrayFirst = [];
            var resFlag = [];
            _.each(res,function(el,index,list){
                resFlag.push(el);
            })
            _.each(resFlag,function(el,index,list){
                if(el.status == 3 || el.status == 2){
                   res.splice(index,1);
                }
            }.bind(this));
            _.each(res, function(el, index, list){
                _.each(this.defaultParam.allNodes, function(defaultLocalId, inx, ls){
                    if (defaultLocalId === el.id) {
                        el.checked = true;
                        this.selectedAllNodeList.push({nodeId: el.id, nodeName: el.chName , operator:el.operatorId, checked:el.checked})
                    }
                }.bind(this))
                nodesArray.push({name:el.chName, value: el.id, checked: el.checked, operator:el.operatorId});
                this.allNodes.push({name:el.chName, nodeId: el.id, checked: el.checked, operator:el.operatorId});
                this.nodesArrayFirst.push({name:el.chName, value: el.id, checked: el.checked, operator:el.operatorId});
            }.bind(this))
            if(this.isEdit){
                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.all .add-node-ctn').get(0),
                    panelID: this.$el.find('.all .add-node').get(0),
                    openSearch: true,
                    onOk: function(data){
                        this.selectedAllNodeList = [];
                        _.each(data, function(el, key, ls){
                            this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
                        }.bind(this))
                        this.defaultParam.allNodes.length = 0;
                        _.each(this.selectedAllNodeList,function(el,key,ls){
                            this.defaultParam.allNodes.push(parseInt(el.nodeId));
                        }.bind(this))
                        _.each(this.nodesArrayFirst,function(el,key,ls){
                            _.each(this.selectedAllNodeList,function(data,key,ls){
                                if(el.value == data.nodeId){
                                    el.checked = true;
                                    data.operatorId = el.operator;
                                }
                            }.bind(this))
                        }.bind(this))
                        this.initAllNodesTable()
                    }.bind(this),
                    data: nodesArray,
                    isDisabled:true,
                    callback: function(data){}.bind(this)
                });
            }else{
                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.all .add-node-ctn').get(0),
                    panelID: this.$el.find('.all .add-node').get(0),
                    openSearch: true,
                    onOk: function(data){
                        this.selectedAllNodeList = [];
                        _.each(data, function(el, key, ls){
                            this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
                        }.bind(this))
                        this.defaultParam.allNodes.length = 0;
                        _.each(this.selectedAllNodeList,function(el,key,ls){
                            this.defaultParam.allNodes.push(parseInt(el.nodeId));
                        }.bind(this))
                        _.each(this.nodesArrayFirst,function(el,key,ls){
                            _.each(this.selectedAllNodeList,function(data,key,ls){
                                if(el.value == data.nodeId){
                                    el.checked = true;
                                    data.operatorId = el.operator;
                                }
                            }.bind(this))
                        }.bind(this))
                        this.initAllNodesTable()
                    }.bind(this),
                    data: nodesArray,
                    callback: function(data){}.bind(this)
                });
            }
            this.initAllNodesTable()
        },
        initAllNodesSelect: function(res){
            var nodesArray = res;
            var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.all .add-node-ctn').get(0),
                    panelID: this.$el.find('.all .add-node').get(0),
                    openSearch: true,
                    onOk: function(data){
                        this.selectedAllNodeList = [];
                        _.each(data, function(el, key, ls){
                            this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
                        }.bind(this))
                        this.defaultParam.allNodes.length = 0;
                        _.each(this.selectedAllNodeList,function(el,key,ls){
                            this.defaultParam.allNodes.push(parseInt(el.nodeId));
                        }.bind(this))
                        _.each(this.nodesArrayFirst,function(el,key,ls){
                            _.each(this.selectedAllNodeList,function(data,key,ls){
                                if(el.value == data.nodeId){
                                    el.checked = true;
                                }
                            }.bind(this))
                        }.bind(this))
                        this.initAllNodesTable()
                    }.bind(this),
                    data: nodesArray,
                    callback: function(data){}.bind(this)
                });
        },
        initAllNodesTable: function(){
            if(this.isEdit){
                var s = [];
                _.each(this.selectedAllNodeList,function(el){
                    if(this.NodeleteNodes.indexOf(el.nodeId) < 0){
                        s.push(el.nodeId);
                    }
                }.bind(this))
                _.each(this.selectedAllNodeList,function(node,index){
                    if(this.NodeleteNodes.indexOf(node.nodeId) < 0){
                        this.selectedAllNodeList.splice(index,1);
                        this.selectedAllNodeList.unshift(node);
                    }
                }.bind(this))
            }
           
            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedAllNodeList
            }));
            _.each($(this.localTable).find('.addOrEdit .delete'),function(el){
                _.each(this.NodeleteNodes,function(nodes){
                    if(el.id == nodes){
                        el.remove();
                    }
                }.bind(this))
            }.bind(this))
            if (this.selectedAllNodeList.length !== 0)
                this.$el.find(".all .table-ctn").html(this.localTable[0]);
            else
                this.$el.find(".all .table-ctn").html(_.template(template['tpl/empty.html'])());

            this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemAllDelete, this));

            this.onGetUpperNode();
        },

        onGetUpperNode: function(res){
            if (!this.isEdit) this.$el.find('.upper .add-node').show();
            var nodesArray = [];
            this.selectedUpperNodeList = [];
            this.nodesArrayFirstUpper = [];
            _.each(this.selectedAllNodeList, function(el, index, list){
                _.each(this.defaultParam.upperNodes, function(upperId, inx, ls){
                    if (upperId === el.nodeId) {
                        el.checked = true;
                        this.selectedUpperNodeList.push({
                            nodeId: el.nodeId, 
                            nodeName: el.nodeName, 
                        })
                    }
                }.bind(this))
                nodesArray.push({name:el.nodeName, value: el.nodeId, checked: el.checked, operator:el.operatorId});
                this.nodesArrayFirstUpper.push({name:el.nodeName, value: el.nodeId, checked: el.checked, operator:el.operatorId});
            }.bind(this))

            this.initUpperTable()
            
            if (nodesArray.length === 0) return;

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.upper .add-node-ctn').get(0),
                panelID: this.$el.find('.upper .add-node').get(0),
                openSearch: true,
                onOk: function(data){
                    this.selectedUpperNodeList = [];
                    _.each(data, function(el, key, ls){
                        this.selectedUpperNodeList.push({
                            nodeId: el.value, 
                            nodeName: el.name,
                            operatorId: ''
                        })
                    }.bind(this))
                    this.defaultParam.upperNodes = [];
                    _.each(this.selectedUpperNodeList,function(el){
                          this.defaultParam.upperNodes.push(parseInt(el.nodeId));
                    }.bind(this))
                    _.each(this.nodesArrayFirstUpper,function(el,key,ls){
                        _.each(this.selectedUpperNodeList,function(data,key,ls){
                            if(el.value == data.nodeId){
                                el.checked = true;
                                data.operatorId = el.operator;
                            }
                        }.bind(this))
                    }.bind(this))
                    this.initUpperTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
        },
        initUpperSelect: function(res){
            var nodesArray = res;
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.upper .add-node-ctn').get(0),
                panelID: this.$el.find('.upper .add-node').get(0),
                openSearch: true,
                onOk: function(data){
                    this.selectedUpperNodeList = [];
                    _.each(data, function(el, key, ls){
                        this.selectedUpperNodeList.push({
                            nodeId: el.value, 
                            nodeName: el.name,
                            operatorId: ''
                        })
                    }.bind(this))
                    this.defaultParam.upperNodes = [];
                    _.each(this.selectedUpperNodeList,function(el){
                          this.defaultParam.upperNodes.push(parseInt(el.nodeId));
                    }.bind(this))
                    _.each(this.nodesArrayFirstUpper,function(el,key,ls){
                        _.each(this.selectedUpperNodeList,function(data,key,ls){
                            if(el.value == data.nodeId){
                                el.checked = true;
                            }
                        }.bind(this))
                    }.bind(this))
                    this.initUpperTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
        },
        initUpperTable: function(){
            this.upperTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedUpperNodeList
            }));
            if (this.selectedUpperNodeList.length !== 0)
                this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
            else
                this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty.html'])());

            if (!this.isEdit)
                this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));
            else
                this.upperTable.find("tbody .delete").hide();
        },

        onClickItemAllDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var lengthParam = this.defaultParam.allNodes.length;
            for(var i=0; i < lengthParam; i++){
                if(this.defaultParam.allNodes[i] == parseInt(id)){
                    this.defaultParam.allNodes.splice(i,1);
                }
            }
            
            var length = this.selectedAllNodeList.length;
            for (var i = 0; i < length; i++){ 
                if (parseInt(this.selectedAllNodeList[i].nodeId) === parseInt(id)){
                   _.each(this.nodesArrayFirst,function(el,index,list){
                          if(el.value == parseInt(id)){
                             el.checked = false;
                          }
                    }.bind(this));
                    this.selectedAllNodeList.splice(i, 1);
                    this.initAllNodesTable();
                    this.initAllNodesSelect(this.nodesArrayFirst);
                    return;
                }
            }
        },

        onClickItemUpperDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var lengthParam = this.defaultParam.upperNodes.length;
            for(var i = 0 ;i<lengthParam;i++){
                if(this.defaultParam.upperNodes[i] == parseInt(id)){
                    this.defaultParam.upperNodes.splice(i,1);
                }
            }
            var length = this.selectedUpperNodeList.length;
            for (var i = 0; i < length; i++){
                if (parseInt(this.selectedUpperNodeList[i].nodeId) === parseInt(id)){
                    this.selectedUpperNodeList.splice(i, 1);
                    this.nodesArrayFirstUpper[i].checked = false;
                    this.initUpperTable();
                    this.initUpperSelect(this.nodesArrayFirstUpper);
                    return;
                }
            }
        },

        initRuleTable: function(data){
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            var data = data;
            this.roleTable = $(_.template(template['tpl/setupChannelManage/setupChannelManage.role.table.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".rule .table-ctn").html(this.roleTable[0]);
            else
                this.$el.find(".rule .table-ctn").html(_.template(template['tpl/empty.html'])());

            if (!this.isEdit){
                this.roleTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.roleTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            } else {
                this.roleTable.find("tbody .edit").hide();
                this.roleTable.find("tbody .delete").hide();
            }
        },
        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "A"){
                eventTarget = $(eventTarget).parent().parent();
                id = eventTarget.attr("data-id");
            } else {
                id = $(eventTarget).attr("data-id");
            }
            this.id = id;
            require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], function(AddEditLayerStrategyView, AddEditLayerStrategyModel){
                var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                    collection: this.collection,
                    localNodes: this.selectedAllNodeList,
                    upperNodes: this.selectedUpperNodeList,
                    rule      : this.rule,
                    id        : this.id,
                    isEdit    : true,
                    onSaveCallback: function(){
                        this.defaultParam.rule = this.rule;
                        var data = this.InformationProcessing(this.rule);
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                        console.log(data);
                        this.initRuleTable(data);
                        
                    }.bind(this),
                    onCancelCallback: function(){
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                    }.bind(this)
                })

                this.$el.find(".add-topo").hide();
                myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
            }.bind(this))
        },
        onClickItemDelete:function(){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "A"){
                eventTarget = $(eventTarget).parent().parent();
                id = eventTarget.attr("data-id");
            } else {
                id = $(eventTarget).attr("data-id");
            }
            this.rule.splice(id,1);
            var data = this.InformationProcessing(this.rule);
            this.initRuleTable(data);
            
        },
        onClickAddRuleButton: function(){
            require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], function(AddEditLayerStrategyView, AddEditLayerStrategyModel){
                var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                    collection: this.collection,
                    localNodes: this.selectedAllNodeList,
                    upperNodes: this.selectedUpperNodeList,
                    rule      : this.rule,
                    onSaveCallback: function(){
                        this.defaultParam.rule = this.rule;
                        var data = this.InformationProcessing(this.rule);
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                        this.initRuleTable(data);
                        
                    }.bind(this),
                    onCancelCallback: function(){
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                    }.bind(this)
                })

                this.$el.find(".add-topo").hide();
                myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
            }.bind(this))
        },
        setOperatorInfo: function(res){
            this.operator = [];
            _.each(res,function(el,index,list){
                this.operator.push({
                   'name' : el.name,
                   'value': el.id
                })
            }.bind(this));
        },
        InformationProcessing:function(data){
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            var data_save = [];
            var self = this;
            _.each(data, function(el, key, ls){
                var data_save_content = {
                     id:null,
                    'localLayer':[],
                    'upperLayer':[]
                };
                if(el.localType == 2){
                    _.each(el.local,function(local){
                        _.each(self.operator,function(operator){
                            if(local == operator.value){
                               data_save_content.localLayer.push(operator.name)
                            }
                        })
                    }.bind(this))
                }else if(el.localType == 1){
                    _.each(el.local,function(local){
                        _.each(self.allNodes,function(nodes){

                            if(local == nodes.nodeId){
                               data_save_content.localLayer.push(nodes.name);
                            }
                        })
                    })
                }
                _.each(el.upper,function(upper){
                        _.each(self.allNodes,function(nodes){
                            if(upper.nodeId == nodes.nodeId){
                    
                                 data_save_content.upperLayer.push(nodes.name)
                               
                               
                            }
                        })
                })
                data_save_content.localLayer = data_save_content.localLayer.join('、');
                data_save_content.upperLayer = data_save_content.upperLayer.join('、');
                data_save_content.id = key;
                data_save.push(data_save_content);

            });
            return data_save;
        },
        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });
    var SetupTopoManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.html'])());
            //获取所有的拓扑关系信息
            this.collection.off("get.topoInfo.success");
            this.collection.off("get.topoInfo.error");
            this.collection.on("get.topoInfo.success", $.proxy(this.onGetTopoSuccess, this));
            this.collection.on("get.topoInfo.error", $.proxy(this.onGetError, this));
            //获取应用类型
            this.collection.off("get.devicetype.success");
            this.collection.off("get.devicetype.error");
            this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
            this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));
            
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));
            
            this.off('enterKeyBindQuery');
            this.on('enterKeyBindQuery',$.proxy(this.onClickQueryButton, this));
            this.enterKeyBindQuery();
            
            this.queryArgs = {
                "name" : null,
                "type" : null,
                "page" : 1,
                "size" : 10
             }
            this.onClickQueryButton();
            this.collection.getDeviceTypeList();


        },
        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                   this.trigger('enterKeyBindQuery');
                }
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetTopoSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.name = this.$el.find("#input-topo-name").val();
            if (this.queryArgs.name == "") this.queryArgs.name = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            //this.collection.queryChannel(this.queryArgs);
            this.collection.getTopoinfo(this.queryArgs);
        },

        initTable: function(){

            this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .strategy").on("click", $.proxy(this.onClickItemSpecialLayer, this));
        },

        onClickItemSpecialLayer: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);
            console.log(model);
            var mySpecialLayerManageView = new SpecialLayerManageView({
                collection: this.collection,
                model: model,
                onSaveCallback: function(){}.bind(this),
                onCancelCallback: function(){
                    mySpecialLayerManageView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            mySpecialLayerManageView.render(this.$el.find(".strategy-panel"))
        },

        onClickAddRuleTopoBtn: function(){
            this.off('enterKeyBindQuery');
            var myEditTopoView = new EditTopoView({
                collection: this.collection,
                WhetherSaveSuccess: this.WhetherSaveSuccess,
                onSaveCallback: function(){
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                    this.onClickQueryButton();
                }.bind(this),
                onCancelCallback: function(){
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myEditTopoView.render(this.$el.find(".edit-panel"))
        },

        onClickItemEdit: function(event){
            this.off('enterKeyBindQuery');
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var myEditTopoView = new EditTopoView({
                collection: this.collection,
                model: model,
                WhetherModifySuccess: this.WhetherModifySuccess,
                isEdit: true,
                onSaveCallback: function(){
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                    this.onClickQueryButton();
                }.bind(this),
                onCancelCallback: function(){
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myEditTopoView.render(this.$el.find(".edit-panel"))
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.size) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.size);
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.size;
                        this.collection.getTopoinfo(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initDeviceDropMenu: function(res){
            this.deviceTypeArray = [];
            var typeArray = [
                {
                    name:'全部',
                    value:'all'
                }
            ],
            rootNode = this.$el.find(".dropdown-type");

            _.each(res, function(el, index, ls){
                typeArray.push({name:el.name, value: el.id});
                this.deviceTypeArray.push({name:el.name, value: el.id});
            }.bind(this));
            if (!this.isEdit){
                var rootNode = this.$el.find(".dropdown-app");
                Utility.initDropMenu(rootNode, typeArray, function(value){
                    if (value !== "All")
                        this.queryArgs.type = parseInt(value)
                    else
                        this.queryArgs.type = null
                }.bind(this));
            } else {
                this.$el.find("#dropdown-app").attr("disabled", "disabled")
            }
      
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.size = parseInt(value);
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return SetupTopoManageView;
});