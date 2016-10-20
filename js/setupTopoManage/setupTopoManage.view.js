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
            /*var tempModel =  {
                "id":12,
                "name":"拓扑关系名称",
                "type":23 ,
                "allNodes":[1,2,3,4,5,6],
                "upperNodes":[3,4],
                "createTime": new Date().valueOf(),
                "rule":[{
                            "id":44,
                            "local":[1,3,4],
                            "localType":1,
                            "upper":[{
                                "upperNodeId":23,
                                "upperIpCorporation":0
                            }]
                        }]
            };*/

           /* if (this.isEdit){
                this.model = tempModel;
                this.defaultParam = {
                    "allNodes": this.model.allNodes,
                    "upperNodes": this.model.upperNodes,
                    "rule": this.model.rule,
                    "type": this.model.type
                }
                this.$el.find("#input-name").val(this.model.name);
                this.$el.find("#input-name").attr("readonly", "true");
            } else {
                this.defaultParam = {
                    "allNodes": [],
                    "upperNodes": [],
                    "rule": []
                }
            }*/
            this.collection.on('get.topo.OriginInfo.success',$.proxy(this.onOriginInfo, this));
            this.collection.on('get.topo.OriginInfo.error',$.proxy(this.onGetError, this));
            if(this.isEdit){
                this.collection.getTopoOrigininfo(this.model.id);
            }else{
                this.defaultParam = {
                    "allNodes": [],
                    "upperNodes": [],
                    "rule": []
                }
                this.initSetup();
            }
            
            //this.initSetup()
        },
        onOriginInfo: function(res){
            var tempModel = res;
            this.model = tempModel;
            this.defaultParam = {
                "allNodes": this.model.allNodes,
                "upperNodes": this.model.upperNodes,
                "rule": this.model.rule,
                "type": this.model.type
            }
            this.$el.find("#input-name").val(this.model.name);
            this.$el.find("#input-name").attr("readonly", "true");
            
            this.initSetup();
        },
        initSetup: function(){
            this.$el.find('.all .add-node').hide();
            this.$el.find('.upper .add-node').hide();

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            if (!this.isEdit)
                this.$el.find(".add-rule").on("click", $.proxy(this.onClickAddRuleButton, this));
            else
                this.$el.find(".add-rule").hide();

            this.collection.on("get.node.success", $.proxy(this.onGetAllNode, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));

            this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
            this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));

            this.collection.getNodeList(); //获取所有节点列表接口
            this.collection.getDeviceTypeList();//获取应用类型列表接口
           // this.initRuleTable();
            
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        initDeviceDropMenu: function(res){
            this.deviceTypeArray = [];
            var typeArray = [
                {name: "全部", value: "All"}
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

        },

        onGetAllNode: function(res){
            this.$el.find('.all .add-node').show();
            var nodesArray = [];
            
            this.selectedAllNodeList = [];
            _.each(res, function(el, index, list){
                _.each(this.defaultParam.allNodes, function(defaultLocalId, inx, ls){
                    if (defaultLocalId === el.id) {
                        el.checked = true;
                        this.selectedAllNodeList.push({nodeId: el.id, nodeName: el.chName , operator:el.operatorId})
                    }
                }.bind(this))
                nodesArray.push({name:el.chName, value: el.id, checked: el.checked, operator:el.operatorId})
            }.bind(this))
            var self = this;
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.all .add-node-ctn').get(0),
                panelID: this.$el.find('.all .add-node').get(0),
                openSearch: true,
                onOk: function(data){
                    this.selectedAllNodeList = [];
                    _.each(data, function(el, key, ls){
                        this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
                    }.bind(this))
                    _.each(this.selectedAllNodeList,function(el,key,ls){
                        self.allNodes.push(el);
                    })
                    var one = this;
                    _.each(nodesArray,function(el,key,ls){
                        _.each(one.selectedAllNodeList,function(data,key,ls){
                            if(el.value == data.nodeId){
                                data.operatorId = el.operator;
                            }
                        })
                    })
                    this.initAllNodesTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
            this.initAllNodesTable()
        },

        initAllNodesTable: function(){
            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedAllNodeList
            }));
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
                nodesArray.push({name:el.nodeName, value: el.nodeId, checked: el.checked, operator:el.operatorId})
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
                    var one = this;
                    _.each(nodesArray,function(el,key,ls){
                        _.each(one.selectedUpperNodeList,function(data,key,ls){
                            if(el.value == data.nodeId){
                                data.operatorId = el.operator;
                            }
                        })
                    })
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

            for (var i = 0; i < this.selectedAllNodeList.length; i++){
                if (parseInt(this.selectedAllNodeList[i].nodeId) === parseInt(id)){
                    this.selectedAllNodeList.splice(i, 1);
                    this.initAllNodesTable();
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

            for (var i = 0; i < this.selectedUpperNodeList.length; i++){
                if (parseInt(this.selectedUpperNodeList[i].nodeId) === parseInt(id)){
                    this.selectedUpperNodeList.splice(i, 1);
                    this.initUpperTable();
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
            var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                collection: this.collection,
                localNodes: this.selectedAllNodeList,
                upperNodes: this.selectedUpperNodeList,
                rule      : this.rule,
                id        : this.id,
                isEdit    : true,
                onSaveCallback: function(){
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
               var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                    collection: this.collection,
                    localNodes: this.selectedAllNodeList,
                    upperNodes: this.selectedUpperNodeList,
                    rule      : this.rule,
                    onSaveCallback: function(){
                        console.log(this.rule);
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
        },
        InformationProcessing:function(data){
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            var data_save = [];
            var self = this;
            var operator = [
                {name: "联通",  value:1},
                {name: "电信",  value:2},
                {name: "移动",  value:3},
                {name: "鹏博士", value:4},
                {name: "教育网", value:5},
                {name: "广电网", value:6},
                {name: "铁通",   value:7},
                {name: "华数",   value:8},
                {name: "多线",   value:9}
            ];
            _.each(data, function(el, key, ls){
                var data_save_content = {
                    id:null,
                    'localLayer':[],
                    'upperLayer':[]
                };
                if(el.localType == 2){
                    _.each(el.local,function(local){
                        _.each(operator,function(operator){
                            if(local == operator.value){
                               data_save_content.localLayer.push(operator.name)
                            }
                        })
                    })
                }else if(el.localType == 1){
                    _.each(el.local,function(local){
                        _.each(self.allNodes,function(nodes){
                            if(local == nodes.nodeId){
                               data_save_content.localLayer.push(nodes.chName)
                            }
                        })
                    })
                }
                _.each(el.upper,function(upper){
                   
                        _.each(self.allNodes,function(nodes){
                            if(upper.nodeId == nodes.nodeId){
                               data_save_content.upperLayer.push(nodes.chName)
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
    var AddEditLayerStrategyView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.rule = options.rule;
            this.isEdit = options.isEdit;
            this.id = options.id;
            if(!this.isEdit){
                this.ruleContent = {
                    "local":[1],
                    "localType":2,
                    "upper":[
                         
                     ]
                };//用来存储规则的内容
            }else{
                this.ruleContent = this.rule[this.id];
            }
            
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            this.$el = $(_.template(template['tpl/setupTopoManage/addEditLayerStrategy.html'])());
            if(!this.isEdit){
                this.defaultParam = {
                    "local":[],
                    "localType":2,
                    "upper":[{
                        "nodeId":null,
                        "ipCorporation":0
                    }]
                }
            }else{
                this.defaultParam = {
                    "local":this.rule[this.id].local,
                    "localType":this.rule[this.id].localType,
                    "upper":[/*{
                        "nodeId":this.rule[this.id].upper[this.id].nodeId,
                        "ipCorporation":null
                    }*/]
                }
                var self = this;
                _.each(this.rule[this.id].upper,function(el){
                    self.defaultParam.upper.push(el);
                })
            }
            
            this.initSetup();

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".strategy-type input").on("click", $.proxy(this.onClickLocalTypeRadio, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancelBtn, this));
        },

        initSetup: function(){
            this.$el.find('.local .add-node').hide();
            if (this.defaultParam.localType === 1){
                this.$el.find("#strategyRadio1").get(0).checked = true;
                this.$el.find("#strategyRadio2").get(0).checked = false;
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2){
                this.$el.find("#strategyRadio2").get(0).checked = true;
                this.$el.find("#strategyRadio1").get(0).checked = false;
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").show();
            }
            this.collection.on("get.operator.success", $.proxy(this.initDropMenu, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));
            this.collection.getOperatorList();
            
            if (!this.options.localNodes && !this.options.upperNodes){
                this.collection.on("get.node.success", $.proxy(this.onGetLocalNode, this));
                this.collection.on("get.node.error", $.proxy(this.onGetError, this));
                this.collection.getNodeList({
                    chname:null,
                    count:99999,
                    operator:null,
                    page:1,
                    status:null
                })
            } else {
                this.onGetLocalNode(this.options.localNodes)
            }
        },

        onClickCancelBtn: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },
        onClickSaveBtn: function(){
            if(!this.isEdit){
                console.log(this.ruleContent);
                this.rule.push(this.ruleContent);
            }else{
                this.rule[this.id] = this.ruleContent;
            }
            this.options.onSaveCallback && this.options.onSaveCallback();
        },
        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetLocalNode: function(res){
            console.log(res);
            this.$el.find('.local .add-node').show();
            var nodesArray = [], data = res;
            this.selectedLocalNodeList = [];

            if (res&&res.rows) data = res.rows

            _.each(data, function(el, index, list){
                _.each(this.defaultParam.local, function(defaultLocalId, inx, ls){
                    if (defaultLocalId === el.id) {
                        el.checked = true;
                        this.selectedLocalNodeList.push({nodeId: el.id, nodeName: el.chName})
                    }
                }.bind(this))
                if (el.nodeId) el.id = el.nodeId;
                if (el.nodeName) el.chName = el.nodeName;
                nodesArray.push({name:el.chName, value: el.id, checked: el.checked,operatorId:el.operatorId})
            }.bind(this))

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.local .add-node-ctn').get(0),
                panelID: this.$el.find('.local .add-node').get(0),
                openSearch: true,
                onOk: function(data){
                    this.selectedLocalNodeList = [];
                    _.each(data, function(el, key, ls){
                        this.selectedLocalNodeList.push({nodeId: el.value, nodeName: el.name})
                        this.ruleContent.local.push(el.value);
                    }.bind(this))
                    this.initLocalTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
            this.initLocalTable()
            this.onGetUpperNode(res);
        },

        onGetUpperNode: function(res){
            this.$el.find('.upper .add-node').show();
            var nodesArray = [];
            this.selectedUpperNodeList = [];

            _.each(res, function(el, index, list){
                _.each(this.defaultParam.upper, function(defaultNode, inx, ls){
                    if (defaultNode.nodeId === el.id) {
                        el.checked = true;
                        this.selectedUpperNodeList.push({
                            nodeId: el.id, 
                            nodeName: el.chName, 
                            ipCorporation: defaultNode.ipCorporation,
                            operatorId: el.operatorId
                        })
                    }
                }.bind(this))
                nodesArray.push({name:el.chName, value: el.id, checked: el.checked, operatorId:el.operatorId})
            }.bind(this))
            console.log(nodesArray);
            this.initUpperTable()

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
                            ipCorporation: 0,
                            operatorId:''
                        });
                        this.ruleContent.upper.push({"nodeId":el.value,"ipCorporation":0});
                    }.bind(this))
                    var one = this;
                    _.each(nodesArray,function(el,key,ls){
                        _.each(one.selectedUpperNodeList,function(data,key,ls){
                            if(el.value == data.nodeId){
                                data.operatorId = el.operatorId;
                            }
                        })
                    })
                    console.log(this.selectedUpperNodeList);
                    this.initUpperTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
        },

        onClickLocalTypeRadio: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.localType = parseInt($(eventTarget).val());

            if (this.defaultParam.localType === 1){
                this.ruleContent.localType = 1;
                this.ruleContent.local = [];
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2){
                this.ruleContent.localType = 2;
                this.ruleContent.local = [];
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").show();
            }
        },
        initUpperTable: function(){
            if(this.selectedUpperNodeList.length > 0){
                console.log(this.selectedUpperNodeList[0].operatorId);
                console.log(this.selectedUpperNodeList[2].operatorId);
                this.selectedUpperNodeList[0].operatorId = 9;
                this.selectedUpperNodeList[2].operatorId = 9;
                _.each(this.selectedUpperNodeList,function(el,index,li){
                     if(el.operatorId == 9){
                        this.selectedUpperNodeList.splice(index,1);
                        this.selectedUpperNodeList.unshift(el);
                     }
                }.bind(this))
            }
           // console.log(this.selectedUpperNodeList);
            this.upperTable = $(_.template(template['tpl/setupTopoManage/addEditLayerStrategy.upper.table.html'])({
                data: this.selectedUpperNodeList
            }));
            if (this.selectedUpperNodeList.length !== 0)
                this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
            else
                this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty.html'])());

            this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));
            
            this.collection.on("get.operatorUpper.success",$.proxy(this.initOperatorUpperList,this));
            this.collection.on("get.operatorUpper.error",$.proxy(this.onGetError, this));
            this.collection.getOperatorUpperList();
        },
        initOperatorUpperList:function(data){
            var statusArray = [];
            _.each(data, function(el, key, list){
                statusArray.push({name: el.name, value: el.id})
            }.bind(this))
            rootNodes = this.upperTable.find(".ipOperator .dropdown");
            for (var i = 0; i < rootNodes.length; i++){
                this.ruleContent.upper[i].ipCorporation = 1;
                this.initTableDropMenu($(rootNodes[i]), statusArray, function(value, nodeId){
                    this.ruleContent.upper[i].ipCorporation = value;
                    console.log(this.ruleContent.upper[i].ipCorporation);
                    _.each(this.selectedUpperNodeList, function(el, key, list){
                        if (el.nodeId === parseInt(nodeId)){
                            el.ipCorporation = parseInt(value);
                        }
                    }.bind(this))
                }.bind(this));

                var nodeId = $(rootNodes[i]).attr("id"),
                    upperObj = _.find(this.selectedUpperNodeList, function(object){
                        return object.nodeId === parseInt(nodeId);
                    }.bind(this))

                var leberNode = this.$el.find("#dropdown-ip-operator .cur-value");

                if (upperObj){
                    var defaultValue = _.find(statusArray, function(object){
                        return object.value === upperObj.ipCorporation;
                    }.bind(this));

                    if (defaultValue)
                        leberNode.html(defaultValue.name);
                    else
                        leberNode.html(statusArray[0].name);
                } else {
                    leberNode.html(statusArray[0].name);
                }
            }
        },
        initTableDropMenu: function (rootNode, typeArray, callback){
            var dropRoot = rootNode.find(".dropdown-menu"),
                rootId = rootNode.attr("id"),
                showNode = rootNode.find(".cur-value");
            dropRoot.html("");
            _.each(typeArray, function(element, index, list){
                var itemTpl = '<li value="' + element.value + '">' + 
                                  '<a href="javascript:void(0);" value="' + element.value + '">'+ element.name + '</a>' + 
                            '</li>',
                itemNode = $(itemTpl);
                itemNode.on("click", function(event){
                    var eventTarget = event.srcElement || event.target;
                        showNode.html($(eventTarget).html()),
                        value = $(eventTarget).attr("value");
                    callback&&callback(value, rootId);
                });
                itemNode.appendTo(dropRoot);
            });
        },

        initLocalTable: function(){
            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedLocalNodeList
            }));
            if (this.selectedLocalNodeList.length !== 0)
                this.$el.find(".local .table-ctn").html(this.localTable[0]);
            else
                this.$el.find(".local .table-ctn").html(_.template(template['tpl/empty.html'])());

            this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemLocalDelete, this));
        },

        onClickItemLocalDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            } 
            var local = this.rule[this.id].local;
            for(var i=0;i<local.length;i++){
                 if(local[i] == id){
                    local.splice(i,1);
                 }
            }
            for (var i = 0; i < this.selectedLocalNodeList.length; i++){
                if (parseInt(this.selectedLocalNodeList[i].nodeId) === parseInt(id)){
                    this.selectedLocalNodeList.splice(i, 1);
                    this.initLocalTable();
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
            if(this.isEdit){
                var upper = this.rule[this.id].upper;
                for(var i=0;i<upper.length;i++){
                     if(upper[i].nodeId == id){
                        upper.splice(i,1);
                     }
                }
            }
            
            for (var i = 0; i < this.selectedUpperNodeList.length; i++){
                if (parseInt(this.selectedUpperNodeList[i].nodeId) === parseInt(id)){
                    this.selectedUpperNodeList.splice(i, 1);
                    this.initUpperTable();
                    return;
                }
            }
        },

        initDropMenu: function(data){
            var statusArray = [],
            rootNode = this.$el.find(".operator");
            _.each(data, function(el, key, list){
                statusArray.push({name: el.name, value: el.id})
            }.bind(this))
            Utility.initDropMenu(rootNode, statusArray, function(value){
                this.ruleContent.local = value;
            }.bind(this));
            
            if(this.defaultParam.localType == 2){
                var defaultValue = _.find(statusArray, function(object){
                   return object.value == this.defaultParam.local[0];
                }.bind(this));

            }
            if (defaultValue){
                this.$el.find("#dropdown-operator .cur-value").html(defaultValue.name);
            }
            else
                this.$el.find("#dropdown-operator .cur-value").html(statusArray[0].name);
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });
    var SetupTopoManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.html'])());

            this.collection.on("get.topoInfo.success", $.proxy(this.onGetTopoSuccess, this));
            this.collection.on("get.topoInfo.error", $.proxy(this.onGetError, this));
            
            this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
            this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));
            
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));

            this.enterKeyBindQuery();
            this.queryArgs = {
                "count": 10,
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
                    this.onClickQueryButton();
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
            var myEditTopoView = new EditTopoView({
                collection: this.collection,
                onSaveCallback: function(){}.bind(this),
                onCancelCallback: function(){
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myEditTopoView.render(this.$el.find(".edit-panel"))
        },

        onClickItemEdit: function(event){
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
                isEdit: true,
                onSaveCallback: function(){}.bind(this),
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
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.count);
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.count;
                        this.collection.queryChannel(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initDeviceDropMenu: function(res){
            this.deviceTypeArray = [];
            var typeArray = [
                {name: "全部", value: "All"}
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
                this.queryArgs.count = value;
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