define("addEditLayerStrategy.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

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
                };
                this.defaultParam = {
                    "local":[],
                    "localType":2,
                    "upper":[{
                        "nodeId":null,
                        "ipCorporation":0
                    }]
                }

            }else{
                this.ruleContent = this.rule[this.id];
                this.defaultParam = {
                    "local":this.ruleContent.local,
                    "localType":this.ruleContent.localType,
                    "upper":[]
                }
                _.each(this.rule[this.id].upper,function(el){
                    this.defaultParam.upper.push(el);
                }.bind(this));
            }
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            this.$el = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.html'])());
            
            this.collection.off("get.operator.success");
            this.collection.off("get.operator.error");
            this.collection.on("get.operator.success", $.proxy(this.initDropMenu, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));
            this.collection.getOperatorList();

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
            var flag = true;
            if(this.ruleContent.local.length == 0){
                    alert('请选择本层节点');
                    return;
            }else if(this.ruleContent.upper.length == 0){
                    alert('请选择上层节点');
                    return;
            }
            _.each(this.rule,function(rule,index,list){
                if(rule.localType == this.ruleContent.localType == 1){
                    _.each(this.ruleContent.local,function(local,index,list){
                        if(rule.local.indexOf(local) >= 0){
                            alert('同一节点不能同时存在于两条规则的“本层”中');
                            flag = false;
                        }
                    }.bind(this))
                }else if(rule.localType == this.ruleContent.localType == 2){
                    _.each(this.rule.local,function(ruleLocal,index,list){
                        if(ruleLocal == this.ruleContent.local){
                            alert('同一运营商不能同时存在于两条规则的“本层”中');
                            flag = false;
                        }
                    }.bind(this))
                }
            }.bind(this))
            
            if(flag){
                if(!this.isEdit){
                    this.rule.push(this.ruleContent);

                }else{
                    this.rule[this.id] = this.ruleContent;
                }
                
                this.options.onSaveCallback && this.options.onSaveCallback();
            }
            
            
        },
        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetLocalNode: function(res){
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
                        this.ruleContent.local = [];
                        this.selectedLocalNodeList.push({nodeId: el.value, nodeName: el.name})
                        this.ruleContent.local.push(parseInt(el.value));
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
            var data = res;
            if (res&&res.rows) data = res.rows
            _.each(data, function(el, index, list){
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
                        this.ruleContent.upper = [];
                        this.ruleContent.upper.push({"nodeId":el.value,"ipCorporation":0});
                    }.bind(this))
                    _.each(nodesArray,function(el,key,ls){
                        _.each(this.selectedUpperNodeList,function(data,key,ls){
                            if(el.value == data.nodeId){
                                data.operatorId = el.operatorId;
                            }
                        }.bind(this))
                    }.bind(this))
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
                _.each(this.selectedUpperNodeList,function(el,index,li){
                     if(el.operatorId == 9){
                        this.selectedUpperNodeList.splice(index,1);
                        this.selectedUpperNodeList.unshift(el);
                     }
                }.bind(this))
            }
            this.upperTable = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.upper.table.html'])({
                data: this.selectedUpperNodeList
            }));
            if (this.selectedUpperNodeList.length !== 0)
                this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
            else
                this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty.html'])());

            this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));
            
            this.collection.off("get.operatorUpper.success");
            this.collection.off("get.operatorUpper.error");
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
            if(!this.isEdit){
                _.each(rootNodes,function(el){
                    _.each(this.ruleContent.upper,function(key){
                        if(el.id == key.nodeId){
                            key.ipCorporation = 1;
                        }
                    }.bind(this))
                }.bind(this))
            }
            
            for (var i = 0; i < rootNodes.length; i++){
                this.initTableDropMenu($(rootNodes[i]), statusArray, function(value, nodeId){
                    _.each(this.selectedUpperNodeList, function(el, key, list){
                        if (el.nodeId === parseInt(nodeId)){
                            el.ipCorporation = parseInt(value);
                        }
                    }.bind(this));
                    _.each(this.ruleContent.upper,function(el,key,list){
                        if(el.nodeId == parseInt(nodeId)){
                            el.ipCorporation = parseInt(value);
                        }
                    }.bind(this));
                }.bind(this));

                var nodeId = $(rootNodes[i]).attr("id"),
                upperObj = _.find(this.ruleContent.upper, function(object){
                    return object.nodeId == parseInt(nodeId);
                }.bind(this))
                var leberNode = $(rootNodes[i]).find("#dropdown-ip-operator .cur-value");

                if (upperObj){
                    var defaultValue = _.find(statusArray, function(object){
                        return object.value == upperObj.ipCorporation;
                    }.bind(this));

                    if (defaultValue){
                        leberNode.html(defaultValue.name);
                    }
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
            _.each(this.ruleContent.local,function(el,index,list){
                if(el == id){
                    this.ruleContent.local.splice(index,1);
                }
            }.bind(this));
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
                this.ruleContent.local = [];
                this.ruleContent.local.push(parseInt(value));
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
    return AddEditLayerStrategyView;
});