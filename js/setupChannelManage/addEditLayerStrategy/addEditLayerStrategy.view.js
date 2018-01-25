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
            this.curLocal=options.curEditLocal ||"";

            if (!this.isEdit) {
                this.defaultParam = {
                    "id": new Date().valueOf(),
                    "local": [], //???
                    "localType": 2,
                    "upper": [],
                }
            } else {
                this.defaultParam = this.curEditRule
            }
            console.log("新建规则初始化默认值: ", this.defaultParam)
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
                    "appType": this.appType
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

        onGetProvinceSuccess: function(data) {
            var nameList = [];
            _.each(data, function(el, inx, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            this.provinceData=nameList;
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
                    if(!this.isEdit){
                        this.$el.find("#dropdown-province .cur-value").html("选中省份个数："+data.length)
                        this.province=[];
                        _.each(nameList,function(el){
                             _.each(data,function(e){
                                if(el.value==e) this.province.push(el)
                             }.bind(this))
                        }.bind(this))
                    }
                }.bind(this)
            });
           
            var proDefalutValue = null;
            if (this.defaultParam.localType === 3 && this.curLocal) {
                var proName=this.curLocal.split("/")[0]
                proDefalutValue = _.find(nameList, function(object) {
                    return object.name == proName;
                }.bind(this));
            }
            if (proDefalutValue) {
                this.$el.find("#dropdown-province .cur-value").html("选中省份个数:1");
                this.$el.find('.select-value-layer li[data-name='+proName+']').find("input").attr("checked","true")
                this.province=[];
                this.province.push({
                    name:proDefalutValue.name,
                    value:proDefalutValue.value
                })
            } else {
                this.$el.find("#dropdown-province .cur-value").html("还未选择省份");
            }
            this.$el.find(".province .select-value-layer li").find("input").on("click",$.proxy(this.onClickProCheckbox,this))
        },

        onGetAreaSuccess: function(data) {
            var nameList = [];
            _.each(data, function(el, inx, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            this.AreaData=nameList;
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
                    if(!this.isEdit){
                        this.$el.find("#dropdown-largeArea .cur-value").html("选中大区个数："+data.length)
                        this.area=[];
                        _.each(nameList,function(el){
                             _.each(data,function(e){
                                if(el.value==e) this.area.push(el)
                             }.bind(this))
                        }.bind(this))
                    }
                }.bind(this)
            });
           
            var defalutValue = null;
            if (this.defaultParam.localType === 4 && this.curLocal) {
                var areaName=this.curLocal.split("/")[0]
                defalutValue = _.find(nameList, function(object) {
                    return object.name == areaName;
                }.bind(this));
            }
            if (defalutValue) {
                this.$el.find("#dropdown-largeArea .cur-value").html("选中大区个数:1");
                this.$el.find('.select-value-layer li[data-name='+areaName+']').find("input").attr("checked","true")
            } else {
                this.$el.find("#dropdown-largeArea .cur-value").html("还未选择大区");
            }
            this.$el.find(".largeArea .select-value-layer li").find("input").on("click",$.proxy(this.onClickAreaCheckbox,this))
        },

        initDropMenu: function(data) {
            var nameList = [];
            _.each(data.rows, function(el, inx, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            //运营商
            this.operatorData=nameList;
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
                    if(!this.isEdit){
                        this.$el.find("#dropdown-operator1 .cur-value").html("选中运营商个数:"+data.length);
                        this.onlyOperator=[];
                        _.each(nameList,function(el){
                             _.each(data,function(e){
                                if(el.value==e) this.onlyOperator.push(el)
                             }.bind(this))
                      }.bind(this))
                    }          
                }.bind(this)
            });

            var defaultValue1 = null;
            if (this.defaultParam.localType ===2 && this.curLocal) {
                var opName=this.curLocal
                defaultValue1 = _.find(nameList, function(object) {
                    return object.name == opName;
                }.bind(this));
            }
            if (defaultValue1) {
                this.$el.find("#dropdown-operator1 .cur-value").html("选中运营商个数:1");
                this.$el.find('.select-value-layer li[data-name='+opName+']').find("input").attr("checked","true")
            } else {
                this.$el.find("#dropdown-operator1 .cur-value").html("还未选择运营商");
            }

            this.$el.find(".onlyOperator .select-value-layer li").on("click",$.proxy(this.onClickOnlyopCheckbox,this))

            //省份运营商
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
                       if(!this.isEdit){
                          this.$el.find("#dropdown-operator2 .cur-value").html("选中运营商个数:"+data.length);
                          this.proAndoperator=[];
                          _.each(nameList,function(el){
                             _.each(data,function(e){
                                if(el.value==e) this.proAndoperator.push(el)
                             }.bind(this))
                          }.bind(this))
                       }   
                }.bind(this)
            });

            var defaultValue2 = null;
            if (this.defaultParam.localType === 3 && this.curLocal) {
                var opName=this.curLocal.split("/")[1]
                defaultValue2 = _.find(nameList, function(object) {
                    return object.name == opName;
                }.bind(this));
            }
            if (defaultValue2) {
                this.$el.find("#dropdown-operator2 .cur-value").html("选中运营商个数:1");
                this.$el.find('.select-value-layer li[data-name='+opName+']').find("input").attr("checked","true")
                this.proAndoperator=[];
                this.proAndoperator.push({
                    name:defaultValue2.name,
                    value:defaultValue2.value
                })
            } else {
                this.$el.find("#dropdown-operator2 .cur-value").html("还未选择运营商");
            }

            this.$el.find(".proAndOperator .select-value-layer li").on("click",$.proxy(this.onClickProAndopCheckbox,this))

            //大区运营商

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
                       if(!this.isEdit){
                          this.$el.find("#dropdown-operator3 .cur-value").html("选中运营商个数:"+data.length);
                          this.areaAndoperator=[];
                          _.each(nameList,function(el){
                             _.each(data,function(e){
                                if(el.value==e) this.areaAndoperator.push(el)
                             }.bind(this))
                          }.bind(this))
                       }   
                }.bind(this)
            });

            var defaultValue3 = null;
            if (this.defaultParam.localType === 4 && this.curLocal) {
                var opName=this.curLocal.split("/")[1]
                defaultValue3 = _.find(nameList, function(object) {
                    return object.name == opName;
                }.bind(this));
            }
            if (defaultValue3) {
                this.$el.find("#dropdown-operator3 .cur-value").html("选中运营商个数:1");
                this.$el.find('.select-value-layer li[data-name='+opName+']').find("input").attr("checked","true")
            } else {
                this.$el.find("#dropdown-operator3 .cur-value").html("还未选择运营商");
            }
            this.$el.find(".areaAndOperator .select-value-layer li").on("click",$.proxy(this.onClickAreaAndopCheckbox,this))

        },


        onClickProCheckbox:function(event){
           var eventTarget = event.srcElement || event.target;
           if(this.isEdit){
               var pro=_.find(this.provinceData,function(el){
                  return el.name==$(eventTarget).next().html()
               }.bind(this))
               if(eventTarget.checked){
                   this.province.push({
                      name:pro.name,
                      value:pro.value
                   })
              }else{
                 this.province=_.filter(this.province,function(el){
                    return el.value!=pro.value
                 }.bind(this))
              }
            this.$el.find("#dropdown-province .cur-value").html("选中省份个数:"+this.province.length);
           }
        },
        
        onClickProAndopCheckbox:function(event){
           var eventTarget = event.srcElement || event.target;
           if(this.isEdit){
               var op=_.find(this.operatorData,function(el){
                  return el.name==$(eventTarget).next().html()
               }.bind(this))
               if(eventTarget.checked){
                   this.operatorData.push({
                      name:op.name,
                      value:op.value
                   })
              }else{
                 this.operatorData=_.filter(this.operatorData,function(el){
                    return el.value!=op.value
                 }.bind(this))
              }
            this.$el.find("#dropdown-operator2 .cur-value").html("选中运营商个数:"+this.operatorData.length);
           }
        },
        
       
        initSetup: function(data) {
            this.allNodesArray = [];
            _.each(data, function(el, index, list) {
                // if (el.s`tatus !== 3 && el.status !== 2) {
                this.allNodesArray.push(el);
                // }
            }.bind(this))

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
                console.log("拓扑ID: ", this.topologyId)
            } else if (!this.options.localNodes && !this.options.upperNodes && this.notFilter) {
                this.options.localNodes = this.allNodesArray;
                this.options.upperNodes = this.allNodesArray;
                this.onGetLocalNodeFromArgs();
                this.onGetUpperNodeFromArgs();
            } else {
                if (this.options.localNodes.length <= this.options.upperNodes.length) {
                    this.$el.find("#strategyRadio1").attr("disabled", "disabled")
                }
                this.onGetLocalNodeFromArgs();
                this.onGetUpperNodeFromArgs();
            }
        },

        onClickCancelBtn: function() {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onClickSaveBtn: function() {

            console.log(this.province)      
            console.log(this.proAndoperator)
            if(this.defaultParam.localType==2 && this.onlyOperator){
                if(!this.isEdit) this.defaultParam.local=[];
                _.each(this.onlyOperator,function(el){
                    this.defaultParam.local.push({
                        id:el.value,
                        name:el.name
                    })
                }.bind(this))
            }else if(this.defaultParam.localType==3 && this.province && this.proAndoperator){
                if(!this.isEdit) this.defaultParam.local=[];
                _.each(this.province,function(pro,i){
                    _.each(this.proAndoperator,function(operator,j){
                            this.defaultParam.local.push({
                                provinceId: pro.value,
                                provinceName: pro.name,
                                id:operator.value,
                                name: operator.name,
                                operatorId:operator.value,
                                operatorName:operator.name
                            })
                    }.bind(this))
                }.bind(this))
            }
            console.log(this.defaultParam)
            if (this.defaultParam.local.length == 0) {
                alert('请选择本层节点');
                return;
            } else if (this.defaultParam.upper.length == 0) {
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
            var flag=false;
            for (var i = 0; i < this.rule.length; i++) {
                if (this.defaultParam.localType === this.rule[i].localType && this.rule[i].id !== this.defaultParam.id) {
                    if (this.defaultParam.localType===1){
                        for(var j=0;j<this.defaultParam.local.length;j++){
                            for(var k=0;k<this.rule[i].local.length;k++){
                                if(this.defaultParam.local[j].id===this.rule[i].local[k].id){
                                     flag=true;
                                     nodesError+=this.defaultParam.local[j].name+ "  ";
                                }
                            }
                        }
                    }else if (this.defaultParam.localType===3) {
                        _.each(this.rule[i].local,function(e){
                            _.each(this.defaultParam.local,function(el){
                                if(e.provinceId===el.provinceId && e.id===el.id){
                                    nodesError.push(el)
                                }
                            }.bind(this))       
                        }.bind(this))
                         
                    }else if(this.defaultParam.localType===4){
                        if (this.rule[i].local[0].areaId === this.defaultParam.local[0].areaId &&
                            this.rule[i].local[0].id === this.defaultParam.local[0].id) {
                            nodesError = this.defaultParam.local[0];
                            break;
                        }
                    }else if (this.defaultParam.localType==2) {
                        _.each(this.rule[i].local,function(e){
                            _.each(this.defaultParam.local,function(el){
                                if(e.id===el.id)
                                    nodesError.push(el)
                            }.bind(this))       
                        }.bind(this))
                    }
                }
            }
            if (nodesError && nodesError.length!=0) {
                 if(flag){
                    alert(nodesError+'不能同时存在于两条规则的“本层”中');
                    return;
                 } else if(nodesError[0].provinceName){
                    var errorMessage=""
                    _.each(nodesError,function(el){
                       errorMessage+=el.provinceName+"/"+el.name+"不能同时存在于两条规则的“本层”中"+"<br>"
                    }.bind(this))
                    alert(errorMessage)
                    return;
                 }else if(nodesError.areaName){
                    alert(nodesError.areaName +'/'+ nodesError.name + '不能同时存在于两条规则的“本层”中');
                    return;
                 }else{
                     var errorMessage=""
                    _.each(nodesError,function(el){
                       errorMessage+=el.name+"不能同时存在于两条规则的“本层”中"+"<br>"
                    }.bind(this))
                    alert(errorMessage)
                    return;
                 }     
            }
            if(!this.isEdit) this.rule.push(this.defaultParam)
            console.log("当前保存的规则：this.rule: ", this.rule);

            this.options.onSaveCallback && this.options.onSaveCallback();
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetLocalNodeFromArgs: function() {
            this.$el.find('.local .add-node').show();

            this.topoAllNodes = [];
            _.each(this.options.localNodes, function(node) {
                var tempNode = _.find(this.allNodesArray, function(obj) {
                    return obj.id === node.id
                }.bind(this))
                if (tempNode) this.topoAllNodes.push(tempNode)
            }.bind(this))

          //  console.log("拓扑所有节点: ", this.topoAllNodes);

            this.topoUpperNodes = [];
            _.each(this.options.upperNodes, function(node) {
                var tempNode = _.find(this.allNodesArray, function(obj) {
                    return obj.id === node.id
                }.bind(this))
                if (tempNode) this.topoUpperNodes.push(tempNode)
            }.bind(this));

//            console.log("拓扑上层节点: ", this.topoUpperNodes);

            this.localNodeListForSelect = this.topoAllNodes;
            if (!this.notFilter) {
                _.each(this.topoUpperNodes, function(node) {
                    this.localNodeListForSelect = _.filter(this.localNodeListForSelect, function(obj) {
                        return obj.id !== node.id;
                    }.bind(this))
                }.bind(this))
            }

       //     console.log("拓扑本层节点: ", this.localNodeListForSelect);
            this.$el.find('.local .add-node').on('click', $.proxy(this.onClickAddLocalNodeButton, this))
            this.initLocalTable();
        },

        onClickAddLocalNodeButton: function(event) {
            require(['setupTopoManage.selectNode.view'], function(SelectNodeView) {
                if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

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
            console.log("根据拓扑ID获取拓扑信息：", res);
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
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 1 && this.prelocalType === 3) {
                this.$el.find(".provinceOperator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 1 && this.prelocalType === 4) {
                this.$el.find(".largeAreaOperator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2 && this.prelocalType === 1) {
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").show();
            } else if (this.defaultParam.localType === 2 && this.prelocalType === 3) {
                this.$el.find(".provinceOperator-ctn").hide();
                this.$el.find(".operator-ctn").show();
            } else if (this.defaultParam.localType === 2 && this.prelocalType === 4) {
                this.$el.find(".largeAreaOperator-ctn").hide();
                this.$el.find(".operator-ctn").show();
            } else if (this.defaultParam.localType === 3 && this.prelocalType === 1) {
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".provinceOperator-ctn").show();
            } else if (this.defaultParam.localType === 3 && this.prelocalType === 2) {
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".provinceOperator-ctn").show();
            } else if (this.defaultParam.localType === 3 && this.prelocalType === 4) {
                this.$el.find(".largeAreaOperator-ctn").hide();
                this.$el.find(".provinceOperator-ctn").show();
            } else if (this.defaultParam.localType === 4 && this.prelocalType === 1) {
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

                var mySelectNodeView = new SelectNodeView({
                    collection: this.collection,
                    selectedNodes: this.defaultParam.upper,
                    nodesList: this.topoAllNodes,
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