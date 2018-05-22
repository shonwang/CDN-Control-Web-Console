define("addEditLayerStrategy.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditLayerStrategyView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;

            this.rule = options.rule;
            this.curEditRule = options.curEditRule
            this.isEdit = options.isEdit;
            this.notFilter = options.notFilter;
            this.appType = options.appType

            this.topologyId = options.topologyId;
            if (!this.isEdit) {
                this.defaultParam = {
                    "id": new Date().valueOf(),
                    "local": [], //???
                    "localType": 2,
                    "upper": [],
                }
            } else {
                this.defaultParam = this.curEditRule
                this.onCancelParam= $.extend(true,{},this.curEditRule)     
            }
            this.$el = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            require(['nodeManage.model'], function(NodeManageModel) {
                var myNodeManageModel = new NodeManageModel();
                myNodeManageModel.on("get.operator.success", $.proxy(this.initDropMenu, this));
                myNodeManageModel.on("get.operator.error", $.proxy(this.onGetError, this));
                myNodeManageModel.getOperatorList();
                myNodeManageModel.on("get.province.success", $.proxy(this.onGetProvinceSuccess, this));
                myNodeManageModel.on("get.province.error", $.proxy(this.onGetError, this));
                myNodeManageModel.getAllProvince();
                myNodeManageModel.on("get.node.success", $.proxy(this.initSetup, this));
                myNodeManageModel.on("get.node.error", $.proxy(this.onGetError, this));
                myNodeManageModel.getNodeList({
                    "page": 1,
                    "count": 99999,
                    "chname": null, //节点名称
                    "operator": null, //运营商id
                    "status": "1,4", //节点状态
                    "appType": this.appType,
                    "cacheLevel":null,
                    "liveLevel":null
                });
            }.bind(this));
            
            require(['setupTopoManage.model'], function(SetUpToPoModel) {
                var mySetUpToPoModel = new SetUpToPoModel();
                mySetUpToPoModel.on('get.area.success', $.proxy(this.onGetAreaSuccess, this));
                mySetUpToPoModel.on('get.area.error', $.proxy(this.onGetError, this));
                mySetUpToPoModel.getAreaList();
            }.bind(this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".strategy-type input").on("click", $.proxy(this.onClickLocalTypeRadio, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancelBtn, this));
            this.$el.find('.upper .add-node').hide()
            this.$el.find('.local .add-node').hide();
            this.$el.find("#strategyRadio1").attr("disabled", "disabled");
            this.$el.find("#strategyRadio2").attr("disabled", "disabled");
            this.$el.find("#strategyRadio3").attr("disabled", "disabled");
            this.$el.find("#strategyRadio4").attr("disabled", "disabled");
        },

        // 省份运营商
        onGetProvinceSuccess: function(data) {
            var nameList = [];
            if(this.isEdit && this.defaultParam.localType==3){
              var provinceId = this.defaultParam.local[0].provinceId;
            }
            _.each(data, function(el, inx, list) {
                var checked;
                if(this.isEdit)  checked = el.id == provinceId;
                else  checked=false;
                nameList.push({
                    checked:checked,
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.province').get(0),
                panelID: this.$el.find('#dropdown-province').get(0),
                isSingle: false,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: nameList,
                callback: function(data) {
                        this.$el.find("#dropdown-province .cur-value").html("选中省份个数："+data.length)
                        this.province=[];
                        _.each(nameList,function(el){
                             _.each(data,function(e){
                                if(el.value==e) this.province.push(el)
                             }.bind(this))
                        }.bind(this))
                }.bind(this)
            });
           
            var proDefalutValue = null;
            if (this.defaultParam.localType === 3 && this.defaultParam.local[0]) {
                proDefalutValue = _.find(nameList, function(object) {
                    return object.value == this.defaultParam.local[0].provinceId;
                }.bind(this));
            }
            if (proDefalutValue) {
                this.$el.find("#dropdown-province .cur-value").html("选中省份个数:1");
                this.province=[];
                this.province.push({
                    name:proDefalutValue.name,
                    value:proDefalutValue.value
                })
            } else {
                this.$el.find("#dropdown-province .cur-value").html("还未选择省份");
            }
        },

        // 大区运营商
        onGetAreaSuccess: function(data) {
            var nameList = [];
            if(this.isEdit && this.defaultParam.localType==4){
                var areaId=this.defaultParam.local[0].areaId;
            }
            _.each(data, function(el, inx, list) {
                var checked;
                if(this.isEdit) checked= el.id==areaId;
                else checked=false;
                nameList.push({
                    checked:checked,
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.largeArea').get(0),
                panelID: this.$el.find('#dropdown-largeArea').get(0),
                isSingle: false,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: nameList,
                callback: function(data) {
                        this.$el.find("#dropdown-largeArea .cur-value").html("选中大区个数："+data.length)
                        this.area=[];
                        _.each(nameList,function(el){
                             _.each(data,function(e){
                                if(el.value==e) this.area.push(el)
                             }.bind(this))
                        }.bind(this))
                }.bind(this)
            });
           
            var defalutValue = null;
            if (this.defaultParam.localType === 4 && this.defaultParam.local[0]) {
                defalutValue = _.find(nameList, function(object) {
                    return object.value == this.defaultParam.local[0].areaId;
                }.bind(this));
            }
            if (defalutValue) {
                this.$el.find("#dropdown-largeArea .cur-value").html("选中大区个数:1");
                this.area=[]
                this.area.push({
                    name:defalutValue.name,
                    value:defalutValue.value
                })
            } else {
                this.$el.find("#dropdown-largeArea .cur-value").html("还未选择大区");
            }
        },
         
        initOperatorOfpro:function(res){
            var nameList = [];
            if(this.isEdit && this.defaultParam.localType==3){
              var operatorId=this.defaultParam.local[0].id
            }
            _.each(res.rows, function(el, inx, list) {
                var checked;
                if(this.isEdit) checked= el.id==operatorId;
                else checked=false;
                nameList.push({
                    checked:checked,
                    name: el.name,
                    value: el.id
                })
            }.bind(this))

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.proAndOperator').get(0),
                panelID: this.$el.find('#dropdown-operator2').get(0),
                isSingle: false,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: nameList,
                callback: function(data) {
                          this.$el.find("#dropdown-operator2 .cur-value").html("选中运营商个数:"+data.length);
                          this.proAndoperator=[];
                          _.each(nameList,function(el){
                             _.each(data,function(e){
                                if(el.value==e) this.proAndoperator.push(el)
                             }.bind(this))
                          }.bind(this)) 
                }.bind(this)
            });

            var defaultValue2 = null;
            if (this.defaultParam.localType === 3 && this.defaultParam.local[0]) {
                defaultValue2 = _.find(nameList, function(object) {
                    return object.value == this.defaultParam.local[0].id;
                }.bind(this));
            }
            if (defaultValue2) {
                this.$el.find("#dropdown-operator2 .cur-value").html("选中运营商个数:1");
                this.proAndoperator=[]
                this.proAndoperator.push({
                    name:defaultValue2.name,
                    value:defaultValue2.value
                })
            } else {
                this.$el.find("#dropdown-operator2 .cur-value").html("还未选择运营商");
            }
        },

        initOperatorOfArea:function(res){
            var nameList = [];
            if(this.isEdit && this.defaultParam.localType==4){ 
                var operatorId=this.defaultParam.local[0].id
            }
            _.each(res.rows, function(el, inx, list) {
                var checked;
                if(this.isEdit) checked= el.id==operatorId;
                else checked=false;
                nameList.push({
                    checked:checked,
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
              var searchSelect = new SearchSelect({
                containerID: this.$el.find('.areaAndOperator').get(0),
                panelID: this.$el.find('#dropdown-operator3').get(0),
                isSingle: false,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: nameList,
                callback: function(data) {
                          this.$el.find("#dropdown-operator3 .cur-value").html("选中运营商个数:"+data.length);
                          this.areaAndoperator=[];
                          _.each(nameList,function(el){
                             _.each(data,function(e){
                                if(el.value==e) this.areaAndoperator.push(el)
                             }.bind(this))
                          }.bind(this))  
                }.bind(this)
            });

            var defaultValue3 = null;
            if (this.defaultParam.localType === 4 && this.defaultParam.local[0]) {
                defaultValue3 = _.find(nameList, function(object) {
                    return object.value == this.defaultParam.local[0].id;
                }.bind(this));
            }
            if (defaultValue3) {
                this.$el.find("#dropdown-operator3 .cur-value").html("选中运营商个数:1");
                this.areaAndoperator=[]
                this.areaAndoperator.push({
                    name:defaultValue3.name,
                    value:defaultValue3.value
                })
            } else {
                this.$el.find("#dropdown-operator3 .cur-value").html("还未选择运营商");
            }
        },

        initDropMenu: function(res) {
            var nameList = [];
            if(this.isEdit && this.defaultParam.localType==2){
               var operatorId=this.defaultParam.local[0].id
            }
            _.each(res.rows, function(el, inx, list) {
                var checked;
                if(this.isEdit) checked= el.id==operatorId;
                else checked=false;
                nameList.push({
                    checked:checked,
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            //运营商
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.onlyOperator').get(0),
                panelID: this.$el.find('#dropdown-operator1').get(0),
                isSingle: false,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: nameList,
                callback: function(data) {
                        this.$el.find("#dropdown-operator1 .cur-value").html("选中运营商个数:"+data.length);
                        this.onlyOperator=[];
                        _.each(nameList,function(el){
                             _.each(data,function(e){
                                if(el.value==e) this.onlyOperator.push(el)
                             }.bind(this))
                      }.bind(this))        
                }.bind(this)
            });

            var defaultValue1 = null;
            if (this.defaultParam.localType ===2 && this.defaultParam.local[0]) {
                defaultValue1 = _.find(nameList, function(object) {
                    return object.value == this.defaultParam.local[0].id;
                }.bind(this));
            }
            if (defaultValue1) {
                this.$el.find("#dropdown-operator1 .cur-value").html("选中运营商个数:1");
                this.onlyOperator=[]
                this.onlyOperator.push({
                    name:defaultValue1.name,
                    value:defaultValue1.value
                })
            } else {
                this.$el.find("#dropdown-operator1 .cur-value").html("还未选择运营商");
            }

            this.initOperatorOfpro(res)
            this.initOperatorOfArea(res)
           
        },        
           
        initSetup: function(data) {
            this.allNodesArray = [];
            _.each(data, function(el, index, list) {
                // if (el.s`tatus !== 3 && el.status !== 2) {
                this.allNodesArray.push(el);
                // }
            }.bind(this))

            // localType是策略方式
            if (this.defaultParam.localType === 1) {
                this.$el.find("#strategyRadio1").get(0).checked = true;
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".provinceOperator-ctn").hide();
                this.$el.find(".largeAreaOperator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2) {
                this.$el.find("#strategyRadio2").get(0).checked = true;
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".provinceOperator-ctn").hide();
                this.$el.find(".largeAreaOperator-ctn").hide();
                this.$el.find(".operator-ctn").show();
            } else if (this.defaultParam.localType === 3) {
                this.$el.find("#strategyRadio3").get(0).checked = true;
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".largeAreaOperator-ctn").hide();
                this.$el.find(".provinceOperator-ctn").show();
            } else if (this.defaultParam.localType === 4) {
                this.$el.find("#strategyRadio4").get(0).checked = true;
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".provinceOperator-ctn").hide();
                this.$el.find(".largeAreaOperator-ctn").show();

            }
            this.$el.find("#strategyRadio2").removeAttr("disabled", "disabled")
            this.$el.find("#strategyRadio1").removeAttr("disabled", "disabled")
            this.$el.find("#strategyRadio3").removeAttr("disabled", "disabled")
            this.$el.find("#strategyRadio4").removeAttr("disabled", "disabled")

            if (!this.options.localNodes && !this.options.upperNodes && !this.notFilter) {
                this.collection.on("get.topo.OriginInfo.success", $.proxy(this.onGetLocalNodeByTopo, this));
                this.collection.on("get.topo.OriginInfo.error", $.proxy(this.onGetError, this));
                this.collection.getTopoOrigininfo(this.topologyId);
                console.log("拓扑ID: ", this.topologyId);
            } else if (!this.options.localNodes && !this.options.upperNodes && this.notFilter) {
                this.options.localNodes = this.allNodesArray;
                this.options.upperNodes = this.allNodesArray;
                this.onGetLocalNodeFromArgs();
                this.onGetUpperNodeFromArgs();
            } else {
                this.onGetLocalNodeFromArgs();
                this.onGetUpperNodeFromArgs();
            }
        },

        onClickCancelBtn: function() {
            _.each(this.onCancelParam,function(value,key){
                this.curEditRule[key]=value
            }.bind(this))
          //  console.log(this.curEditRule)
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onClickSaveBtn: function() {
            if(!this.province) this.province=[];
            if(!this.area) this.area=[];
            if(!this.onlyOperator) this.onlyOperator=[];
            // 省运营商
            if(!this.proAndoperator) this.proAndoperator=[];
            // 地区运营商
            if(!this.areaAndoperator) this.areaAndoperator=[];
            
            if(this.defaultParam.localType==1 && this.defaultParam.local.length==0){
                   alert('请选择本层节点');
                   return;
            }else if(this.defaultParam.localType==2 && this.onlyOperator.length==0){
                   alert('请选择本层节点');
                   return;
            }else if(this.defaultParam.localType==3){
                if (this.province.length==0 || this.proAndoperator.length==0) {
                   alert('请选择本层节点');
                   return;
                }
            }else if(this.defaultParam.localType==4){
                if (this.area.length==0 || this.areaAndoperator.length==0) {
                   alert('请选择本层节点');
                   return;
                }
            }
            if (this.defaultParam.upper.length == 0) {
                   alert('请选择上层节点');
                   return;
            }
            var chiefTypeArray = [];
            chiefTypeArray = _.filter(this.defaultParam.upper, function(obj) {
                return obj.chiefType === 0
            }.bind(this))
            if (chiefTypeArray.length === this.defaultParam.upper.length) {
                alert("不能都设置为备用")
                return;
            }
            var nodesError =[];
            // 检测错误情况，给nodesError赋值
            for (var i = 0; i < this.rule.length; i++) {
                if (this.defaultParam.localType === this.rule[i].localType && this.rule[i].id !== this.defaultParam.id) {
                    if (this.defaultParam.localType===1){
                         _.each(this.rule[i].local,function(rule){
                            _.each(this.defaultParam.local,function(el){
                                  if(rule.id==el.id)
                                    nodesError.push(el)
                            }.bind(this))
                        }.bind(this))      
                    }else if (this.defaultParam.localType===3) {
                        _.each(this.rule[i].local,function(e){
                            _.each(this.province,function(pro){
                                _.each(this.proAndoperator,function(operator){
                                    if(e.provinceId==pro.value && e.id==operator.value)
                                       nodesError.push(e) 
                                }.bind(this))
                            }.bind(this))    
                        }.bind(this))                  
                    }else if(this.defaultParam.localType===4){
                        _.each(this.rule[i].local,function(e){
                            _.each(this.area,function(area){
                                _.each(this.areaAndoperator,function(operator){
                                    if(e.areaId==area.value && e.id==operator.value)
                                       nodesError.push(e) 
                                }.bind(this))
                            }.bind(this))    
                        }.bind(this))
                    }else if (this.defaultParam.localType===2) {
                        _.each(this.rule[i].local,function(e){
                            _.each(this.onlyOperator,function(el){
                                if(e.id===el.value){
                                    nodesError.push(e)
                                }
                            }.bind(this))       
                        }.bind(this))
                    }
                }
            }
            // 当nodesError非空时进行处理，抛出错误信息
            if(nodesError.length!=0){
                var errorMessage="";
                if(this.defaultParam.localType==1 || this.defaultParam.localType==2){
                    _.each(nodesError,function(el){
                       errorMessage+=el.name+"不能同时存在于两条规则的“本层”中"+"<br>"
                    }.bind(this))
                    alert(errorMessage)
                    return;
                }else if(this.defaultParam.localType==3){
                    _.each(nodesError,function(el){
                       errorMessage+=el.provinceName+"/"+el.name+"不能同时存在于两条规则的“本层”中<br>"
                    }.bind(this))
                    alert(errorMessage)
                    return;
                }else if(this.defaultParam.localType==4){
                    _.each(nodesError,function(el){
                       errorMessage+=el.areaName +'/'+ el.name + '不能同时存在于两条规则的“本层”中<br>'
                    }.bind(this))
                    alert(errorMessage);
                    return;
                }
            }


            if(this.defaultParam.localType==2){
                _.each(this.onlyOperator,function(el,i){
                    if(i==0){
                        this.defaultParam.local=[];
                        this.defaultParam.local[0]={
                            id:el.value,
                            name:el.name
                        }
                    }else{
                        var obj={
                            "id": parseInt(Math.random()*999999999),
                            "local": [], 
                            "localType":2,
                            "upper": this.defaultParam.upper,
                        }
                        obj.local.push({
                            id:el.value,
                            name:el.name
                        })
                        this.rule.push(obj)
                    }      
                }.bind(this))
            }else if(this.defaultParam.localType==3){
                _.each(this.province,function(pro,i){
                    _.each(this.proAndoperator,function(operator,j){
                        if(i==0 && j==0){
                            this.defaultParam.local=[];
                            this.defaultParam.local[0]={
                                provinceId: pro.value,
                                provinceName: pro.name,
                                id:operator.value,
                                name: operator.name,
                                operatorId:operator.value,
                                operatorName:operator.name
                             }
                        }else{
                            var obj={
                                "id": parseInt(Math.random()*999999999),
                                "local": [], 
                                "localType":3,
                                "upper": this.defaultParam.upper,
                            }
                            obj.local.push({
                                provinceId: pro.value,
                                provinceName: pro.name,
                                id:operator.value,
                                name: operator.name,
                                operatorId:operator.value,
                                operatorName:operator.name
                            })
                            this.rule.push(obj)
                        }                      
                    }.bind(this))
                }.bind(this))
            }else if(this.defaultParam.localType==4){
                _.each(this.area,function(area,i){
                    _.each(this.areaAndoperator,function(operator,j){
                        if(i==0 && j==0){
                            this.defaultParam.local=[];
                            this.defaultParam.local[0]={
                                areaId: area.value,
                                areaName: area.name,
                                id:operator.value,
                                name: operator.name,
                                operatorId:operator.value,
                                operatorName:operator.name
                             }
                        }else{
                            var obj={
                                "id": parseInt(Math.random()*999999999),
                                "local": [], 
                                "localType":4,
                                "upper": this.defaultParam.upper,
                            }
                            obj.local.push({
                                areaId: area.value,
                                areaName: area.name,
                                id:operator.value,
                                name: operator.name,
                                operatorId:operator.value,
                                operatorName:operator.name
                            })
                            this.rule.push(obj)
                        }                      
                    }.bind(this))
                }.bind(this))
            }

            if(!this.isEdit) this.rule.push(this.defaultParam)   
            console.log("当前保存的规则：this.rule: ", this.rule);      
            this.options.onSaveCallback && this.options.onSaveCallback();
        },

        // 统一的错误处理方式
        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        // localNodes本层节点(中+下)、upperNodes上层节点（上+中）
        onGetLocalNodeFromArgs: function() {
            this.$el.find('.local .add-node').show();

            this.topoAllNodes = [];
            // console.log(this.options.localNodes)
            _.each(this.options.localNodes, function(node) {
                var tempNode = _.find(this.allNodesArray, function(obj) {
                    return obj.id === node.id
                }.bind(this))
                if (tempNode) this.topoAllNodes.push(tempNode)
            }.bind(this))

        // 通过深拷贝来解决这一问题
            this.topoUpperNodes = [];
            _.each(this.options.upperNodes, function(node) {
                var tempNode = _.find(this.options.upperNodes, function(obj) {
                    return obj.id === node.id
                }.bind(this))
                // console.log(tempNode.isChecked)
                if(tempNode) this.topoUpperNodes.push(_.clone(tempNode));
            }.bind(this));
            _.each(this.topoUpperNodes,function(node){
                node.isChecked = false;
                node.isDisplay = true;
            }.bind(this))

            // this.topoUpperNodes
        //    console.log("拓扑上层节点: ", this.topoUpperNodes);
            this.localNodeListForSelect = [];
            if (!this.notFilter) {
                _.each(this.options.localNodes, function(node) {
                    var tempNodeLocal = _.find(this.options.localNodes, function(obj) {
                        return obj.id === node.id;
                    }.bind(this))
                    if(tempNodeLocal) this.localNodeListForSelect.push(_.clone(tempNodeLocal))
                }.bind(this))
            }else{
                _.each(this.options.localNodes,function(node){
                    this.localNodeListForSelect.push(_.clone(node))
                }.bind(this))
            };
            _.each(this.localNodeListForSelect,function(node){
                node.isChecked = false;
                node.isDisplay = true;
            }.bind(this))
            // this.localNodesListForSelect
            // console.log("拓扑本层节点: ", this.localNodeListForSelect);
            this.$el.find('.local .add-node').on('click', $.proxy(this.onClickAddLocalNodeButton, this))
            this.initLocalTable();
                     
        },


        updateChecked:function(sonNode,parentNode){
            var tempIpArray = [];
            _.each(sonNode, function(el){
                var id = el.id || el.nodeId;
                tempIpArray.push(id)
            }.bind(this));
            _.each(parentNode,function(node){
                var tempId = node.id || node.nodeId;
                if(tempIpArray.indexOf(tempId) === -1){
                    node.isChecked = false
                }
            }.bind(this))
        },

        onClickAddLocalNodeButton: function(event) {
            require(['setupTopoManage.selectNode.view'], function(SelectNodeView) {
                if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();
                this.updateChecked(this.defaultParam.local, this.localNodeListForSelect);
                var mySelectNodeView = new SelectNodeView({
                    collection: this.collection,
                    selectedNodes: this.defaultParam.local,
                    nodesList: this.localNodeListForSelect,
                    appType: this.appType
                });
                var options = {
                    title: "选择节点",
                    body: mySelectNodeView,
                    backdrop: 'static',
                    type: 2,
                    width: 800,
                    onOKCallback: function() {
                        this.defaultParam.local = mySelectNodeView.getArgs();
                        this.selectNodePopup.$el.modal("hide");
                        this.initLocalTable();
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.selectNodePopup = new Modal(options);
            }.bind(this))
            
        },

        onGetLocalNodeByTopo: function(res) {
            this.options.localNodes = res.allNodes;
            this.options.upperNodes = res.upperNodes;
            this.onGetLocalNodeFromArgs();
            this.onGetUpperNodeFromArgs();
        },

        initLocalTable: function() {
            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.defaultParam.local
            }));
            if (this.defaultParam.local.length !== 0)
                this.$el.find(".local .table-ctn").html(this.localTable[0]);
            else
                this.$el.find(".local .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "你还没有添加节点"
                    }
                }));
            this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemLocalDelete, this));
        },

        onClickItemLocalDelete: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            this.defaultParam.local = _.filter(this.defaultParam.local, function(obj) {
                return obj.id !== parseInt(id)
            }.bind(this));
            this.initLocalTable();
        },



        onClickLocalTypeRadio: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.prelocalType = this.defaultParam.localType;
            this.defaultParam.localType = parseInt($(eventTarget).val());
            if (this.defaultParam.localType === 1 && this.prelocalType === 2) {
                this.defaultParam.local=this.curNodes || [];
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 1 && this.prelocalType === 3) {
                this.defaultParam.local=this.curNodes || [];
                this.$el.find(".provinceOperator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 1 && this.prelocalType === 4) {
                this.defaultParam.local=this.curNodes || [];
                this.$el.find(".largeAreaOperator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2 && this.prelocalType === 1) {
                this.curNodes=this.defaultParam.local;
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").show();
            } else if (this.defaultParam.localType === 2 && this.prelocalType === 3) {
                this.$el.find(".provinceOperator-ctn").hide();
                this.$el.find(".operator-ctn").show();
            } else if (this.defaultParam.localType === 2 && this.prelocalType === 4) {
                this.$el.find(".largeAreaOperator-ctn").hide();
                this.$el.find(".operator-ctn").show();
            } else if (this.defaultParam.localType === 3 && this.prelocalType === 1) {
                this.curNodes=this.defaultParam.local;
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".provinceOperator-ctn").show();
            } else if (this.defaultParam.localType === 3 && this.prelocalType === 2) {
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".provinceOperator-ctn").show();
            } else if (this.defaultParam.localType === 3 && this.prelocalType === 4) {
                this.$el.find(".largeAreaOperator-ctn").hide();
                this.$el.find(".provinceOperator-ctn").show();
            } else if (this.defaultParam.localType === 4 && this.prelocalType === 1) {
                this.curNodes=this.defaultParam.local;
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".largeAreaOperator-ctn").show();
            } else if (this.defaultParam.localType === 4 && this.prelocalType === 2) {
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".largeAreaOperator-ctn").show();
            } else if (this.defaultParam.localType === 4 && this.prelocalType === 3) {
                this.$el.find(".provinceOperator-ctn").hide();
                this.$el.find(".largeAreaOperator-ctn").show();
            }
            this.initLocalTable();
        },

        onGetUpperNodeFromArgs: function() {
            this.$el.find('.upper .add-node').show();
            _.each(this.defaultParam.upper, function(el) {
                el.id = el.rsNodeMsgVo.id;
            }.bind(this))
            this.$el.find('.upper .add-node').on('click', $.proxy(this.onClickAddUpperNodeButton, this))
            this.initUpperTable();
        },

        onClickAddUpperNodeButton: function(event) {
            require(['setupTopoManage.selectNode.view'], function(SelectNodeView) {
                if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();
                this.updateChecked(this.defaultParam.upper, this.topoUpperNodes);
                console.log(this.defaultParam.upper,this.topoUpperNodes)
                var mySelectNodeView = new SelectNodeView({
                    collection: this.collection,
                    selectedNodes: this.defaultParam.upper,
                    nodesList:  this.topoUpperNodes,
                    appType: this.appType
                });
                var options = {
                    title: "选择节点",
                    body: mySelectNodeView,
                    backdrop: 'static',
                    type: 2,
                    width: 800,
                    onOKCallback: function() {
                        this.defaultParam.upper = mySelectNodeView.getArgs();
                        var tempArray = []
                        _.each(this.defaultParam.upper, function(el) {
                            var rsNodeMsgVo = {};
                            rsNodeMsgVo.id = el.id;
                            rsNodeMsgVo.name = el.chName;
                            rsNodeMsgVo.operatorId = el.operatorId;
                            tempArray.push({
                                chiefType: el.chiefType,
                                ipCorporation: el.ipCorporation,
                                rsNodeMsgVo: rsNodeMsgVo,
                                id: el.id
                            })
                        }.bind(this))
                        this.defaultParam.upper = tempArray;
                        this.selectNodePopup.$el.modal("hide");
                        this.initUpperTable();
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.selectNodePopup = new Modal(options);
            }.bind(this))
        },

        initUpperTable: function() {
            var nodeList = [];
            _.each(this.defaultParam.upper, function(el) {
                nodeList.push({
                    nodeId: el.rsNodeMsgVo.id,
                    nodeName: el.rsNodeMsgVo.name,
                    operatorId: el.rsNodeMsgVo.operatorId,
                    chiefType: el.chiefType,
                    ipCorporation: el.ipCorporation
                })
            }.bind(this))

            var duoxianArray = _.filter(nodeList, function(obj) {
                return obj.operatorId === 9
            }.bind(this))
            var feiDuoxianArray = _.filter(nodeList, function(obj) {
                return obj.operatorId !== 9
            }.bind(this))

            nodeList = duoxianArray.concat(feiDuoxianArray)
            this.upperTable = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.upper.table.html'])({
                data: nodeList
            }));

            if (nodeList.length !== 0) {
                this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
            } else {
                this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "你还没有添加节点"
                    }
                }));
            }
            this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));
            this.upperTable.find("tbody .spareradio").on("click", $.proxy(this.onClickCheckboxButton, this));

            require(['deviceManage.model'], function(deviceManageModel) {
                var mydeviceManageModel = new deviceManageModel();
                mydeviceManageModel.on("operator.type.success", $.proxy(this.initOperatorUpperList, this));
                mydeviceManageModel.on("operator.type.error", $.proxy(this.onGetError, this));
                mydeviceManageModel.operatorTypeList();
            }.bind(this));
        },

        initOperatorUpperList: function(data) {
            var operatorArray = [];
            _.each(data, function(el, key, list) {
                operatorArray.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            rootNodes = this.upperTable.find(".ipOperator .dropdown");

            for (var i = 0; i < rootNodes.length; i++) {
                this.initTableDropMenu($(rootNodes[i]), operatorArray, function(value, nodeId) {
                    _.each(this.defaultParam.upper, function(el, key, list) {
                        if (el.rsNodeMsgVo.id == parseInt(nodeId)) {
                            el.ipCorporation = parseInt(value);
                        }
                    }.bind(this));
                }.bind(this));

                _.each(this.defaultParam.upper, function(node) {
                    var curNodeId = parseInt(rootNodes[i].id);
                    if (node.rsNodeMsgVo.id === curNodeId) {
                        var defaultValue = _.find(operatorArray, function(obj) {
                            return obj.value === node.ipCorporation
                        }.bind(this))

                        if (defaultValue) {
                            $(rootNodes[i]).find("#dropdown-ip-operator .cur-value").html(defaultValue.name)
                        } else {
                            $(rootNodes[i]).find("#dropdown-ip-operator .cur-value").html(operatorArray[0].name);
                            node.ipCorporation = operatorArray[0].value;
                        }
                    }
                }.bind(this))
            }
        },

        initTableDropMenu: function(rootNode, typeArray, callback) {

            var dropRoot = rootNode.find(".dropdown-menu"),
                rootId = rootNode.attr("id"),
                showNode = rootNode.find(".cur-value");
            dropRoot.html("");
            _.each(typeArray, function(element, index, list) {
                var itemTpl = '<li value="' + element.value + '">' +
                    '<a href="javascript:void(0);" value="' + element.value + '">' + element.name + '</a>' +
                    '</li>',
                    itemNode = $(itemTpl);
                itemNode.on("click", function(event) {
                    var eventTarget = event.srcElement || event.target;
                    showNode.html($(eventTarget).html()),
                        value = $(eventTarget).attr("value");
                    callback && callback(value, rootId);
                });
                itemNode.appendTo(dropRoot);
            });
        },

        onClickItemUpperDelete: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            this.defaultParam.upper = _.filter(this.defaultParam.upper, function(obj) {
                return obj.rsNodeMsgVo.id !== parseInt(id)
            }.bind(this));
            console.log(this.defaultParam.upper)
            this.initUpperTable();
        },

        onClickCheckboxButton: function(event) {
            var eventTarget = event.srcElement || event.target;
            var id = eventTarget.id;

            _.each(this.defaultParam.upper, function(obj) {
                if (obj.rsNodeMsgVo.id === parseInt(id))
                    obj.chiefType = eventTarget.checked ? 0 : 1;
            }.bind(this))
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });
    return AddEditLayerStrategyView;
});