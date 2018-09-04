define("addEditLayerStrategy.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditLayerStrategyView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.rule = options.rule;

            this.curEditRule = options.curEditRule;
            this.isEdit = options.isEdit;
            this.notFilter = options.notFilter;
            this.appType = options.appType

            this.topologyId = options.topologyId;
            this.tempRule = []
            this.$el = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            if (!this.isEdit) {
                this.defaultParam = {
                    "id": new Date().valueOf(),
                    "local": [], //???
                    "localType": 2,
                    "localOperator": [],
                    "upper": [],
                    "upType": 1
                }
            } else {
                this.defaultParam = {
                    "id": this.curEditRule.id,
                    "local": this.curEditRule.local, 
                    "localType": this.curEditRule.localType,
                    "localOperator": [],
                    "upper": this.curEditRule.upper,
                    "upType": this.curEditRule.upType,
                }
                if(this.curEditRule.localType === 3){
                    _.each(this.curEditRule.local, function(el){
                        var tempName = el.provinceName +'/'+ el.name;
                        var tempValue = el.provinceId+'/'+ el.operatorId;
                        this.defaultParam.localOperator.push({
                            name: tempName,
                            value: tempValue
                        })

                    }.bind(this))
                }else if(this.curEditRule.localType === 4){
                    _.each(this.curEditRule.local, function(el){
                        var tempName = el.areaName +'/'+ el.name;
                        var tempValue = el.areaId +'/'+ el.operatorId;
                        this.defaultParam.localOperator.push({
                            name: tempName,
                            value: tempValue
                        })
                    }.bind(this))
                }else if(this.curEditRule.localType === 2){
                    _.each(this.curEditRule.local, function(el){
                        var tempName = el.name;
                        var tempValue = el.id;
                        this.defaultParam.localOperator.push({
                            name: tempName,
                            value: tempValue
                        })
                    }.bind(this))
                }else if(this.curEditRule.localType === 5){
                    _.each(this.curEditRule.local, function(el){
                        el.hashId = el.id;
                    }.bind(this))
                }
                this.onCancelParam= $.extend(true,{},this.curEditRule)     
            }
            if(!this.notFilter){
                this.$el.find("#asHashstrategyRadio6").hide();
                this.$el.find("#strategyRadioAsHash-ctn").hide();
            }
            this.$el.find("input[name=strategyUpperRadio]").on("click",$.proxy(this.onUpperStyleChange,this));
            if(this.defaultParam.upType == 2){
                this.$el.find("#strategyRadio6").prop("checked",true)
            }
            else{
                this.$el.find("#strategyRadio5").prop("checked",true)
            }

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
            if(this.defaultParam.localType !== 1){
                this.$el.find('.local .add-operator-btn').on('click', $.proxy(this.onClickAddOperatorButton, this))
            }
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".strategy-type input").on("click", $.proxy(this.onClickLocalTypeRadio, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancelBtn, this));
            this.$el.find('.upper .add-node').hide()
            this.$el.find('.local .add-node').hide();
            this.$el.find('.local .strategyLocal-node').hide();
            this.$el.find("#strategyRadio1").attr("disabled", "disabled");
            this.$el.find("#strategyRadio2").attr("disabled", "disabled");
            this.$el.find("#strategyRadio3").attr("disabled", "disabled");
            this.$el.find("#strategyRadio4").attr("disabled", "disabled");
            this.$el.find("#strategyRadioAsHash").attr("disabled", "disabled");

        },

        onUpperStyleChange:function(event){
            //清空upper数据
            var eventTarget = event.srcElement || event.target;
            var value = $(eventTarget).val();
            this.defaultParam.upper = [];
            if(value == 1){
                this.defaultParam.upType = 1;
                this.initUpperTable();
            }
            else if(value == 2){
                this.defaultParam.upType = 2;
                this.initUpperHashTable();
            }

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
            this.hideAllCtn();
            if (this.defaultParam.localType === 1) {
                this.$el.find("#strategyRadio1").get(0).checked = true;
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2) {
                this.$el.find("#strategyRadio2").get(0).checked = true;
                this.$el.find(".operator-ctn").show();
                this.$el.find(".operator-btn").show();
                this.$el.find('.local .operatorButton-ctn').show()
            } else if (this.defaultParam.localType === 3) {
                this.$el.find("#strategyRadio3").get(0).checked = true;
                this.$el.find(".provinceOperator-ctn").show();
                this.$el.find(".operator-btn").show();
                this.$el.find('.operatorButton-ctn').show()
            } else if (this.defaultParam.localType === 4) {
                this.$el.find("#strategyRadio4").get(0).checked = true;
                this.$el.find(".largeAreaOperator-ctn").show();
                this.$el.find(".operator-btn").show();
                this.$el.find('.operatorButton-ctn').show()
            }else if(this.defaultParam.localType === 5){
                this.$el.find("#strategyRadioAsHash").get(0).checked = true;
                this.$el.find(".nodes-ctn-hashOrigin").show();
            }
            this.$el.find("#strategyRadio2").removeAttr("disabled", "disabled")
            this.$el.find("#strategyRadio1").removeAttr("disabled", "disabled")
            this.$el.find("#strategyRadio3").removeAttr("disabled", "disabled")
            this.$el.find("#strategyRadio4").removeAttr("disabled", "disabled")
            this.$el.find("#strategyRadioAsHash").removeAttr("disabled", "disabled")

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
                this.initUpperHash();
            } else {
                this.onGetLocalNodeFromArgs();
                this.onGetUpperNodeFromArgs();
                this.initUpperHash();
            }
        },

        onClickCancelBtn: function() {
            _.each(this.onCancelParam,function(value,key){
                this.curEditRule[key]=value
            }.bind(this))
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
            if((this.defaultParam.localType==1 || this.defaultParam.localType== 5) && this.defaultParam.local.length==0){
                alert('请选择本层节点');
                return;
            }
            if(this.defaultParam.localType !== 1 && this.defaultParam.localType !==5 && this.defaultParam.localOperator.length == 0){
                alert('请选择本层节点');
                return;
            }
            if (this.defaultParam.upper.length == 0) {
                alert('请选择上层节点');
                return;

            }
            if(this.defaultParam.upType == 1){
                var chiefTypeArray = [];
                chiefTypeArray = _.filter(this.defaultParam.upper, function(obj) {
                    return obj.chiefType === 0
                }.bind(this))
                if (chiefTypeArray.length === this.defaultParam.upper.length) {
                    alert("不能都设置为备用")
                    return;
                }
            }
            if(this.defaultParam.upType == 2){
                var hashMain = _.filter(this.defaultParam.upper, function(obj) {
                    return obj.hashIndex === 0
                }.bind(this))
                if(hashMain.length < 1){
                    alert("请设置主环");
                    return false;
                }
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
                    Utility.warning(errorMessage)
                    return;
                }else if(this.defaultParam.localType==3){
                    _.each(nodesError,function(el){
                       errorMessage+=el.provinceName+"/"+el.name+"不能同时存在于两条规则的“本层”中<br>"
                    }.bind(this))
                    Utility.warning(errorMessage)
                    return;
                }else if(this.defaultParam.localType==4){
                    _.each(nodesError,function(el){
                       errorMessage+=el.areaName +'/'+ el.name + '不能同时存在于两条规则的“本层”中<br>'
                    }.bind(this))
                    Utility.warning(errorMessage);
                    return;
                }
            }

            // 这块要好好改
            if(this.defaultParam.localType==2){
                if(this.rule.length !== 0){
                    this.tempRule = this.rule
                    this.rule = []
                }
                var tempId = parseInt(Math.random()*999999999);
                var tempLocal = []
                _.each(this.defaultParam.localOperator, function(el){
                    var tempNameList = el.name;
                    var tempValueList = el.value;
                    tempLocal.push({
                        id: tempValueList,
                        name: tempNameList,
                        operatorId: tempValueList[1],
                        operatorName: tempNameList[1]
                    })
                }.bind(this))
                this.rule.push({
                    "id": tempId,
                    "local": tempLocal, 
                    "localType": this.defaultParam.localType,
                    "upper": this.defaultParam.upper,
                    "upType":this.defaultParam.upType 
                })
            }else if(this.defaultParam.localType==3){
                    if(this.rule.length !== 0){
                        this.tempRule = this.rule
                        this.rule = []
                    }               
                    var tempId = parseInt(Math.random()*999999999);
                    var tempLocal = []
                    _.each(this.defaultParam.localOperator, function(el){
                        var tempNameList = el.name.split('/');
                        var tempValueList = el.value.split('/');
                        tempLocal.push({
                            provinceId: tempValueList[0],
                            provinceName: tempNameList[0],
                            id: tempValueList[1],
                            name: tempNameList[1],
                            operatorId: tempValueList[1],
                            operatorName: tempNameList[1]
                        })
                    }.bind(this))
                    this.rule.push({
                        "id": tempId,
                        "local": tempLocal, 
                        "localType": this.defaultParam.localType,
                        "upper": this.defaultParam.upper,
                        "upType":this.defaultParam.upType 
                    })
            }else if(this.defaultParam.localType==4){
                if(this.rule.length !== 0){
                    this.tempRule = this.rule
                    this.rule = []
                }               
                var tempId = parseInt(Math.random()*999999999);
                var tempLocal = []
                _.each(this.defaultParam.localOperator, function(el){
                    var tempNameList = el.name.split('/');
                    var tempValueList = el.value.split('/');
                    tempLocal.push({
                        areaId: tempValueList[0],
                        areaName: tempNameList[0],
                        id: tempValueList[1],
                        name: tempNameList[1],
                        operatorId: tempValueList[1],
                        operatorName: tempNameList[1]
                    })
                }.bind(this))
                this.rule.push({
                    "id": tempId,
                    "local": tempLocal, 
                    "localType": this.defaultParam.localType,
                    "upper": this.defaultParam.upper,
                    "upType":this.defaultParam.upType 
                })
            }else if(this.defaultParam.localType == 1){
                if(this.rule.length !== 0){
                    this.tempRule = this.rule
                    this.rule = []
                }
                var tempId = parseInt(Math.random()*999999999);
                var tempLocal = []
                _.each(this.defaultParam.local, function(el){
                    var tempNameList = el.chName || el.name;
                    var tempValueList = el.id
                    tempLocal.push({
                        id: tempValueList,
                        name: tempNameList,
                    })
                }.bind(this))
                this.rule.push({
                    "id": tempId,
                    "local": tempLocal, 
                    "localType": this.defaultParam.localType,
                    "upper": this.defaultParam.upper,
                    "upType":this.defaultParam.upType 
                })
            }
            else if(this.defaultParam.localType == 5){
                if(this.rule.length !== 0){
                    this.tempRule = this.rule
                    this.rule = []
                } 
                var tempId = parseInt(Math.random()*999999999);
                var tempLocal = [];
                _.each(this.defaultParam.local, function(el){
                    var tempNameList = el.hashName || el.name;
                    var tempValueList = el.id
                    tempLocal.push({
                        id: tempValueList,
                        name: tempNameList,
                    })
                }.bind(this))
                this.rule.push({
                    "id": tempId,
                    "local": tempLocal, 
                    "localType": this.defaultParam.localType,
                    "upper": this.defaultParam.upper,
                    "upType":this.defaultParam.upType 
                })                

            }
            if(!this.isEdit) this.rule = this.rule.concat(this.tempRule)      
            this.options.onSaveCallback && this.options.onSaveCallback();
        },

        // 统一的错误处理方式
        onGetError: function(error) {
            if (error && error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        // localNodes本层节点(中+下)、upperNodes上层节点（上+中）
        onGetLocalNodeFromArgs: function() {
            this.$el.find('.local .add-node').show();

            this.topoAllNodes = [];
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
                if(this.options.appType == 202 && (tempNode.cacheLevel == 1 || tempNode.cacheLevel == 2)){
                    this.topoUpperNodes.push(_.clone(tempNode));
                }else if(this.options.appType == 203 && (tempNode.liveLevel == 1 || tempNode.liveLevel == 2)){
                    this.topoUpperNodes.push(_.clone(tempNode));
                }
            }.bind(this));
            _.each(this.topoUpperNodes,function(node){
                node.name = node.chName || node.name;
                node.isChecked = false;
                node.isDisplay = true;
            }.bind(this))
            
            // this.topoUpperNodes
            this.localNodeListForSelect = [];          
            if (!this.notFilter) {
                _.each(this.options.localNodes, function(node) {
                    var tempNodeLocal = _.find(this.options.localNodes, function(obj) {
                        return obj.id === node.id;
                    }.bind(this))
                    if(this.options.appType == 202 && (tempNodeLocal.cacheLevel == 2 || tempNodeLocal.cacheLevel == 3 || tempNodeLocal.cacheLevel === 1)){
                        this.localNodeListForSelect.push(_.clone(tempNodeLocal));
                    }else if(this.options.appType == 203 && (tempNodeLocal.liveLevel == 2 || tempNodeLocal.liveLevel == 3 || tempNodeLocal.liveLevel === 1)){
                        this.localNodeListForSelect.push(_.clone(tempNodeLocal));
                    }
                }.bind(this))
            }else{
                _.each(this.options.localNodes,function(node){
                    if(this.options.appType == 202 && (node.cacheLevel == 2 || node.cacheLevel == 3 || node.cacheLevel == 1)){
                        this.localNodeListForSelect.push(_.clone(node));
                    }else if(this.options.appType == 203 && (node.liveLevel == 2 || node.liveLevel == 3 || node.cacheLevel == 1)){
                        this.localNodeListForSelect.push(_.clone(node));
                    }
                }.bind(this))
            };
            _.each(this.localNodeListForSelect, function(node){
                node.name = node.chName || node.name;
                node.isChecked = false;
                node.isDisplay = true;
            }.bind(this))
            
            // this.localNodesListForSelect
            //this.$el.find('.strategyLocal input').on('click', $.proxy(this.onCheckLocalNodeType, this))
            this.$el.find('.local .add-node').on('click', $.proxy(this.onClickAddLocalNodeButton, this))
            this.$el.find('.local .add-hashOrigin-node').on('click', $.proxy(this.onClickAddLocalHashNodeButton, this))
            if(this.defaultParam.localType === 1 || this.defaultParam.localType === 5){
                this.initLocalTable();
            }else{
                this.initLocalOperatorTable();
            }
        },

        // onCheckLocalNodeType:function(event){
        //     var eventTarget = event.srcElement || event.target;
        //     if (eventTarget.tagName !== "INPUT") return;
        //     this.defaultParam.localNodeType = parseInt($(eventTarget).val());
        // },

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

        onClickAddLocalHashNodeButton:function(){
            require(['hashOrigin.selectNodeByHash.view', 'hashOrigin.model'], function(SelectNodeByHashView, HashModel) {
                if (this.selectNodeByHashPopup) $("#" + this.selectNodeByHashPopup.modalId).remove();

                var hashModel = new HashModel();
                var mySelectNodeByHashView = new SelectNodeByHashView({
                    collection: hashModel,
                    selectedhashList: this.defaultParam.local,
                    appType: this.appType
                });
                var options = {
                    title: "选择hash环",
                    body: mySelectNodeByHashView,
                    backdrop: 'static',
                    type: 2,
                    width: 800,
                    onOKCallback: function() {
                        this.defaultParam.local = mySelectNodeByHashView.getArgs();
                        this.selectNodeByHashPopup.$el.modal("hide");
                        this.initLocalTable();
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.selectNodeByHashPopup = new Modal(options);
            }.bind(this))            
        },

        onGetLocalNodeByTopo: function(res) {
            this.options.localNodes = res.allNodes;
            this.options.upperNodes = res.upperNodes;
            this.onGetLocalNodeFromArgs();
            this.onGetUpperNodeFromArgs();
            this.initUpperHash();
        },

        initLocalOperatorTable: function() {
            this.localOperatorTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.operatorTable.html'])({
                data: this.defaultParam.localOperator || []
            }));
            if (this.defaultParam.localOperator && this.defaultParam.localOperator.length !== 0){
                this.$el.find(".local .table-ctn").html(this.localOperatorTable[0]);
            }
            else{
                this.$el.find(".local .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "你还没有添加节点"
                    }
                }));
            }
            this.localOperatorTable.find("tbody .delete").on("click", $.proxy(this.onClickItemLocalOperatorDelete, this));
        },

        initLocalTable: function() {
            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.defaultParam.local || []
            }));
            if (this.defaultParam.local && this.defaultParam.local.length !== 0){
                this.$el.find(".local .table-ctn").html(this.localTable[0]);
            }
            else{
                this.$el.find(".local .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "你还没有添加节点"
                    }
                }));
            }
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

        onClickItemLocalOperatorDelete: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            this.defaultParam.localOperator = _.filter(this.defaultParam.localOperator, function(obj) {
                return obj.value.toString() !== id
            }.bind(this));
            this.initLocalOperatorTable();
        },

        onClickAddOperatorButton:function(){
            if(this.defaultParam.localType === 2){
                this.defaultParam.localOperator = this.onlyOperator
            }else if(this.defaultParam.localType === 3){
                var proAndoperatorList = []
                _.each(this.province, function(el){
                    _.each(this.proAndoperator, function(item){
                        var name = {
                            name:el.name + '/' + item.name,
                            value: el.value + '/' + item.value
                        }
                        proAndoperatorList.push(name)
                    })
                }.bind(this))
                this.defaultParam.localOperator = proAndoperatorList
            }else if(this.defaultParam.localType === 4){
                var areaAndOperatorList = []
                _.each(this.area, function(el){
                    _.each(this.areaAndoperator, function(item){

                        var name = {
                            name: el.name + '/' + item.name,
                            value: el.value + '/' + item.value
                        }
                        areaAndOperatorList.push(name)
                    })
                }.bind(this))
                this.defaultParam.localOperator = areaAndOperatorList
            }
            this.initLocalOperatorTable()
        },

        onClickLocalTypeRadio: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.prelocalType = this.defaultParam.localType;
            this.defaultParam.localType = parseInt($(eventTarget).val());

            this.hideAllCtn();
            this.defaultParam.local = [];
            this.defaultParam.localOperator = [];
            if (this.defaultParam.localType === 1) {
                //this.defaultParam.local=this.curNodes || [];
                this.$el.find(".nodes-ctn").show();
            } 
            else if (this.defaultParam.localType === 2) {
                if(this.prelocalType === 1 ){
                    //this.curNodes=this.defaultParam.local;
                }
                this.$el.find(".operator-ctn").show();
                this.$el.find(".operatorButton-ctn").show();
            }
            else if (this.defaultParam.localType === 3) {
                if(this.prelocalType === 1 ){
                    //this.curNodes=this.defaultParam.local;
                }
                this.$el.find(".provinceOperator-ctn").show();
                this.$el.find(".operatorButton-ctn").show();
            }
            else if (this.defaultParam.localType === 4) {
                if(this.prelocalType === 1 ){
                    //this.curNodes=this.defaultParam.local;
                }
                this.$el.find(".largeAreaOperator-ctn").show();
                this.$el.find(".operatorButton-ctn").show();
            }
            else if(this.defaultParam.localType === 5){
                //this.defaultParam.local=this.curNodes || [];
                this.$el.find(".nodes-ctn-hashOrigin").show();
            }

            if(this.defaultParam.localType === 1){
                this.initLocalTable();
            }else{
                this.initLocalOperatorTable();
            }
            
            if(this.defaultParam.localType !== 1){
                this.$el.find('.local .add-operator-btn').on('click', $.proxy(this.onClickAddOperatorButton, this))
            }
        },

        hideAllCtn:function(){
            this.$el.find(".operator-ctn").hide();
            this.$el.find(".operatorButton-ctn").hide();
            this.$el.find(".nodes-ctn").hide();   
            this.$el.find(".provinceOperator-ctn").hide();
            this.$el.find(".largeAreaOperator-ctn").hide();
            this.$el.find(".nodes-ctn-hashOrigin").hide();
        },

        onGetUpperNodeFromArgs: function() {
            this.$el.find('.upper .add-node').show();
            _.each(this.defaultParam.upper, function(el) {
                el.id = el.rsNodeMsgVo.id;
            }.bind(this))
            this.$el.find('.upper .add-node').on('click', $.proxy(this.onClickAddUpperNodeButton, this))
            if(this.defaultParam.upType == 2){
                return false;
            }
            this.initUpperTable();
        },

        initUpperHash:function(){
            this.$el.find('.upper .add-hash').on('click', $.proxy(this.onClickAddUpperHashButton, this))
            this.initUpperHashTable();
        },

        initUpperHashTable:function(){
            var obj= this.defaultParam.upper;
            if(this.defaultParam.upType != 2){
                return false;
            }
            this.$el.find(".strategyUpper-node-ctn").hide();
            this.$el.find(".strategyUpper-hash-ctn").show();

            var hashList = [];
            _.each(this.defaultParam.upper,function(el){
                hashList.push({
                    hashId:el.rsNodeMsgVo.id,
                    name:el.rsNodeMsgVo.name,
                    isMulti:el.rsNodeMsgVo.isMulti,
                    //chiefType:el.chiefType,
                    ipCorporation:el.ipCorporation,
                    hashIndex:el.hashIndex,
                    id:el.rsNodeMsgVo.id
                });
            }.bind(this));

            var duoxianArray = _.filter(hashList, function(obj) {
                return obj.isMulti === 1
            }.bind(this))
            var feiDuoxianArray = _.filter(hashList, function(obj) {
                return obj.isMulti !== 1
            }.bind(this))

            hashList = duoxianArray.concat(feiDuoxianArray)


            this.upperHashTable = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.upperHash.table.html'])({
                    data:hashList
            }));

            if(hashList.length !==0){
                this.$el.find(".upper .table-ctn-hash").html(this.upperHashTable[0]);
                this.upperHashTable.find("tbody .hash-radio-main").on("click", $.proxy(this.onClickItemUpperHashKey, this));
                this.upperHashTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperHashDelete, this));
            }
            else{
                this.$el.find(".upper .table-ctn-hash").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "你还没有添加hash环"
                    }
                }));
            }
         

            require(['deviceManage.model'], function(deviceManageModel) {
                var mydeviceManageModel = new deviceManageModel();
                mydeviceManageModel.on("operator.type.success", $.proxy(this.initOperatorUpperHashList, this));
                mydeviceManageModel.on("operator.type.error", $.proxy(this.onGetError, this));
                mydeviceManageModel.operatorTypeList();
            }.bind(this));
        },

        initOperatorUpperHashList: function(data) {
            var operatorArray = [];
            _.each(data, function(el, key, list) {
                operatorArray.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
            rootNodes = this.upperHashTable.find(".hashOperator .dropdown");

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
                            $(rootNodes[i]).find("#dropdown-hash-operator .cur-value").html(defaultValue.name)
                        } else {
                            $(rootNodes[i]).find("#dropdown-hash-operator .cur-value").html(operatorArray[0].name);
                            node.ipCorporation = operatorArray[0].value;
                        }
                    }
                }.bind(this))
            }
        },

        onClickItemUpperHashKey:function(events){
            var eventTarget = event.srcElement || event.target;
            var id = $(eventTarget).attr("data-id");
            this.resetHashIndex(id);
        },

        onClickAddUpperNodeButton: function(event) {
            require(['setupTopoManage.selectNode.view'], function(SelectNodeView) {
                if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();
                this.updateChecked(this.defaultParam.upper, this.topoUpperNodes);
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
                            //el.upType = 1;
                            var rsNodeMsgVo = {};
                            rsNodeMsgVo.id = el.id;
                            rsNodeMsgVo.name = el.chName;
                            rsNodeMsgVo.operatorId = el.operatorId;
                            tempArray.push({
                                upType:1,
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

        resetHashIndex:function(id){
            var upperHash = this.defaultParam.upper;
            for(var i=0;i<upperHash.length;i++){
                if(upperHash[i].id == id){
                    upperHash[i].hashIndex = 0;
                }
                else{
                    upperHash[i].hashIndex = null;
                }
            }
            this.defaultParam.upper = this.upperHashFormat(upperHash);
        },

        upperHashFormat:function(list){
            var firstList = [];
            var arr=[];
            for(var i=0,_len=list.length;i<_len;i++){
                if(list[i].hashIndex == 0){
                    firstList.push(list[i]);
                }
                else{
                    arr.push(list[i]);
                }
            }
            var newArr = firstList.concat(arr);
            for(var i=0,_len=newArr.length;i<_len;i++){
                newArr[i].hashIndex = i;
            }
            return newArr;
        },

        onClickAddUpperHashButton:function(){
            require(['hashOrigin.selectHash.view','hashOrigin.model'], function(SelectHashView,HashModel) {
                var hashModel = new HashModel();
                if (this.selectHashPopup) $("#" + this.selectHashPopup.modalId).remove();
                //this.updateChecked(this.defaultParam.upper, this.topoUpperNodes);
                var mySelectHashView = new SelectHashView({
                    collection: hashModel,
                    selectedHash:this.defaultParam.upper,
                    appType: this.appType
                });
                var options = {
                    title: "选择hash环",
                    body: mySelectHashView,
                    backdrop: 'static',
                    type: 2,
                    width: 800,
                    onOKCallback: function() {
                        var result = mySelectHashView.getArgs();
                        var upperHashFormat = this.upperHashFormat(result);
                        this.defaultParam.upper = upperHashFormat;
                        var tempArray = []
                        _.each(this.defaultParam.upper, function(el) {
                            el.upType = 2;
                            var rsNodeMsgVo = {};
                            rsNodeMsgVo.id = el.id;
                            rsNodeMsgVo.name = el.name;
                            rsNodeMsgVo.operatorId = el.operatorId;
                            rsNodeMsgVo.isMulti = el.isMulti;
                            tempArray.push({
                                name:el.name,
                                hashIndex: el.hashIndex,
                                ipCorporation: el.ipCorporation,
                                isMulti : el.isMulti,
                                rsNodeMsgVo: rsNodeMsgVo,
                                id: el.id
                                //chiefType:el.hashIndex == 0 ? 1:0
                            })
                        }.bind(this))
                        this.defaultParam.upper = tempArray;
                        this.selectHashPopup.$el.modal("hide");
                        this.initUpperHashTable();
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.selectHashPopup = new Modal(options);
            }.bind(this))            
        },

        initUpperTable: function() {
            this.$el.find(".strategyUpper-hash-ctn").hide();
            this.$el.find(".strategyUpper-node-ctn").show();
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

            if (this.defaultParam.upper.length == 1 && this.defaultParam.upper[0].chiefType == 0) {
                this.defaultParam.upper[0].chiefType = 1;
            }

            this.initUpperTable();
        },


        onClickItemUpperHashDelete: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName == "SPAN") {
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("data-id");
            } else {
                id = $(eventTarget).attr("data-id");
            }

            this.defaultParam.upper = _.filter(this.defaultParam.upper, function(obj) {
                return obj.rsNodeMsgVo.id !== parseInt(id)
            }.bind(this));
            this.initUpperHashTable();
        },

        onClickCheckboxButton: function(event) {
            var eventTarget = event.srcElement || event.target;
            var id = eventTarget.id;

            _.each(this.defaultParam.upper, function(obj) {
                if (obj.rsNodeMsgVo.id === parseInt(id))
                    obj.chiefType = eventTarget.checked ? 0 : 1;
            }.bind(this))
        },

        getArgs: function(){
            return this.rule
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });
    return AddEditLayerStrategyView;
});