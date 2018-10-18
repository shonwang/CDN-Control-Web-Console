define("specialLayerManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var CheckSpecialLayerAndTopoView = Backbone.View.extend({
            events: {
                //"click .search-btn":"onClickSearch"
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model      = options.model;
                this.parent = options.obj;
                this.strategyId = this.model.get("id");
                this.$el = $(_.template(template['tpl/specialLayerManage/checkLayerManageAndTopo.html'])({}));

                this.$el.find(".query").on("click", $.proxy(this.checkWithTopo, this));
                
                this.collection.off('get.topoInfo.success');
                this.collection.off('get.topoInfo.error');
                this.collection.on('get.topoInfo.success',$.proxy(this.onGetTopuInfo, this));
                this.collection.on('get.topoInfo.error',$.proxy(this.onGetError, this));

                this.collection.off('checkWithTopo.success');
                this.collection.off('checkWithTopo.error');
                this.collection.on('checkWithTopo.success',$.proxy(this.onCheckTopoSuccess, this));
                this.collection.on('checkWithTopo.error',$.proxy(this.onGetError, this));
                
                if(!this.parent.topoList){
                    //请求完，数据保存在parent层的topoList中,避免再次请求
                    var args = {
                        page:1,
                        size:9999
                    };
                    this.collection.getTopoinfo(args);
                }
                else if(this.parent.topoList.length>0){
                    // this.topoId = this.parent.topoList[0].value;
                    // this.$el.find("#dropdown-topoList .cur-value").html(this.parent.topoList[0].name);
                    // this.checkWithTopo();
                    this.setDropdownMenuAndCheck();
                }
                else{
                    Utility.alerts("拓扑不存在，请刷新重试!");
                }
                
                //this.initSetup()
                //this.initSetup();
            },

            onGetTopuInfo:function(res){
                var data = res.rows;
                _.each(data,function(el){
                    el.value = el.id;
                });
                var typeArray = data;
                this.parent.topoList = typeArray;
                this.setDropdownMenuAndCheck();       
            },

            setDropdownMenuAndCheck:function(){
                var typeArray = this.parent.topoList;
                this.topoId = typeArray[0].value;
                var rootNode = this.$el.find(".dropdown-topoList");
                Utility.initDropMenu(rootNode, typeArray, function(value) {
                    this.topoId = parseInt(value);
                }.bind(this));
                this.$el.find("#dropdown-topoList .cur-value").html(typeArray[0].name); 
                this.checkWithTopo();                 
            },

            onCheckTopoSuccess:function(data){
                if(data.length>0){
                    this.table = $(_.template(template['tpl/specialLayerManage/checkLayerManageAndTopo.table.html'])({data:data}));
                }
                else{
                    this.table = $(_.template(template['tpl/success.popup.html'])({data:{message:"已全部覆盖"}}));
                }
                this.$el.find(".checkList").html(this.table);
            },

            checkWithTopo:function(){
                this.$el.find(".checkList").html(_.template(template['tpl/loading.html'])({}));
                var args = {
                    topoId:this.topoId,
                    strategyId:this.strategyId
                };
                this.collection.checkWithTopo(args);
            },

            onClickCancelButton: function(){
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            onGetError: function(error){
                if (error&&error.message)
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        var AddEditLayerView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.isEdit = options.isEdit;
                this.isView = options.isView;
                this.isCopy = options.isCopy;
                this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.edit.html'])({
                    data: {}
                }));

                this.collection.off('get.strategyInfoById.success');
                this.collection.off('get.strategyInfoById.error');
                this.collection.on('get.strategyInfoById.success', $.proxy(this.onStrategyInfo, this));
                this.collection.on('get.strategyInfoById.error', $.proxy(this.onGetError, this));

                this.collection.off('add.strategy.success');
                this.collection.off('add.strategy.error');
                this.collection.on('add.strategy.success', $.proxy(this.addStrategySuccess, this));
                this.collection.on('add.strategy.error', $.proxy(this.onGetError, this));

                this.collection.off('modify.strategy.success');
                this.collection.off('modify.strategy.error');
                this.collection.on('modify.strategy.success', $.proxy(this.modifyStrategySuccess, this));
                this.collection.on('modify.strategy.error', $.proxy(this.onGetError, this));

                this.collection.off('copy.strategy.success');
                this.collection.off('copy.strategy.error');
                this.collection.on('copy.strategy.success', $.proxy(this.copyStrategySuccess, this));
                this.collection.on('copy.strategy.error', $.proxy(this.onGetError, this));

                this.collection.off("edit.send.success");
                this.collection.off("edit.send.error");
                this.collection.on("edit.send.success", $.proxy(this.onSendSuccess, this));
                this.collection.on("edit.send.error", $.proxy(this.onSendError, this));

                this.collection.off('get.topoInfo.success');
                this.collection.off('get.topoInfo.error');
                this.collection.on('get.topoInfo.success',$.proxy(this.onGetTopuInfo, this));
                this.collection.on('get.topoInfo.error',$.proxy(this.onGetError, this));

                this.$el.find(".add-rule").hide();
                this.$el.find(".opt-ctn .compare").hide();
                this.$el.find(".opt-ctn .save").hide();
                this.$el.find(".opt-ctn .send").hide();
                this.$el.find('.view-less').hide();
                this.$el.find(".opt-ctn .send").on("click", $.proxy(this.onClickItemSend, this));

                if (this.isEdit) {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                    this.collection.getStrategyInfoById({
                        id: this.model.get('id')
                    });
                } else {
                    this.defaultParam = {
                        "id": null,
                        "name": "",
                        "type": null,
                        'remark': null,
                        'upType': 1,
                        'topoId':null,
                        "rule": []
                    }
                    this.initSetup();

                    var topoArgs = {
                        page:1,
                        size:9999
                    };
                    this.collection.getTopoinfo(topoArgs);
                }
            },

            onGetTopuInfo:function(res){
                var rows = res.rows;
                var topoList = [];
                _.each(res.rows,function(list){
                    var obj = {
                        name:list.name,
                        value:list.id
                    }
                    topoList.push(obj);
                });

                var rootNode = this.$el.find(".dropdown-topo");
                Utility.initDropMenu(rootNode, topoList, function(value) {
                    this.defaultParam.topoId = value;
                }.bind(this));
                this.defaultParam.topoId = topoList[0].value;
                rootNode.find(".cur-value").html(topoList[0].name);
            },

            onSendSuccess:function(){
                alert("成功");
                window.location.href="#/setupSending";
            },

            onSendError:function(data){
                alert(data.message);
            },

            onClickItemSend:function(){
                var args = {
                    comment:this.model.get("type"),
                    ruleId:this.model.get("id")
                };
                this.collection.strategyEditUpdate(args);
            },

            openSendBtn:function(){
                this.$el.find(".send").removeAttr("disabled");
            },

            closeSendBtn:function(){
                this.$el.find(".send").attr("disabled",'disabled');
            },

            addStrategySuccess: function() {
                alert('保存成功');
                this.openSendBtn();
                this.options.onSaveCallback && this.options.onSaveCallback();
            },

            modifyStrategySuccess: function() {
                this.openSendBtn();
                //this.options.onSaveCallback && this.options.onSaveCallback();
                alert('修改成功，可以进行下发或其它操作');
            },

            copyStrategySuccess: function() {
                this.options.onSaveCallback && this.options.onSaveCallback();
                Utility.alerts("复制成功！", "success", 5000)
            },

            onStrategyInfo: function(res) {
                this.defaultParam = {
                    "id": res.id || this.model.get('id'),
                    "name": res.name,
                    "remark": res.remark,
                    "topoId" : res.topoId,
                    "rule": res.rule,
                    "type": res.type
                }

                this.domainList = res.domainList || ['没有关联的域名'];
                this.$el.find("#input-name").val(res.name);
                this.$el.find("#secondary").val(res.remark);
                if (this.isCopy) {
                    this.$el.find("#input-name").val(res.name + "-副本");
                }
                console.log("编辑的分层策略: ", this.defaultParam)
                this.$el.find('#dropdown-topo .cur-value').html(res.topoName);
                this.$el.find("#dropdown-topo").attr("disabled", "disabled")
                this.initSetup();
            },

            initSetup: function() {
                this.initDomainList();
                if (this.isCopy) {
                    this.$el.find(".domain-list").hide();
                    this.$el.find(".saveAndSend").hide();
                }
                this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
                if (!this.isEdit) {
                    this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                    this.$el.find(".opt-ctn .saveAndSend").on("click", $.proxy(this.onClickSaveAndSendButton, this));
                    this.$el.find(".add-rule").on("click", $.proxy(this.onClickAddRuleButton, this));
                    this.$el.find(".domain-list").hide();
                    this.$el.find(".add-rule").show();
                    this.$el.find(".opt-ctn .save").show();
                } else if (!this.isView && this.isEdit) {
                    // if (AUTH_OBJ.ApplyEditTopos)
                    this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                    this.$el.find(".opt-ctn .compare").on("click", $.proxy(this.onClickCompareButton, this));
                    this.$el.find(".opt-ctn .saveAndSend").on("click", $.proxy(this.onClickSaveAndSendButton, this));
                    this.$el.find(".view-more").on("click", $.proxy(this.onClickViewMoreButton, this));
                    this.$el.find(".view-less").on("click", $.proxy(this.onClickViewLessButton, this));
                    this.$el.find(".add-rule").on("click", $.proxy(this.onClickAddRuleButton, this));
                    this.$el.find(".add-rule").show();
                    this.$el.find(".opt-ctn .save").show();
                    this.$el.find(".opt-ctn .send").show();
                    this.$el.find(".compare").show();
                    //this.$el.find(".comment-group").hide();
                } else if (this.isView) {
                    this.$el.find(".view-more").on("click", $.proxy(this.onClickViewMoreButton, this));
                    this.$el.find(".view-less").on("click", $.proxy(this.onClickViewLessButton, this));
                    //this.$el.find(".comment-group").hide();
                }
                require(['nodeManage.model'], function(NodeManageModel) {
                    var myNodeManageModel = new NodeManageModel();
                    myNodeManageModel.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
                    myNodeManageModel.on("get.operator.error", $.proxy(this.onGetError, this));
                    myNodeManageModel.getOperatorList();
                }.bind(this))

                this.collection.off("get.devicetype.success");
                this.collection.off("get.devicetype.error");
                this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
                this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));

                this.collection.getNodeList(); //获取所有节点列表接口
                this.collection.getDeviceTypeList(); //获取应用类型列表接口
            },

            initDomainList: function() {
                var nodeTpl = '';
                _.each(this.domainList, function(el) {
                    nodeTpl = '<li class="node-item">' +
                        '<span class="label label-primary" id="' + Utility.randomStr(8) + '">' + el + '</span>' +
                        '</li>';
                    $(nodeTpl).appendTo(this.$el.find(".node-ctn"))
                }.bind(this))
            },

            onClickViewMoreButton: function(event) {
                this.$el.find('.view-less').show();
                this.$el.find(".view-more").hide();
                this.$el.find('.domain-ctn').css('max-height', 'none');
            },

            onClickViewLessButton: function(event) {
                this.$el.find('.view-less').hide();
                this.$el.find(".view-more").show();
                this.$el.find('.domain-ctn').css('max-height', '200px');
            },

            onClickSaveAndSendButton: function() {
                this.btnFlag = 2;
                this.onClickSaveButton();
            },

            onClickCompareButton:function(){
                var postTopo = this.getPostParam();
                this.$el.find(".add-topo").hide();
                //需要判断是否是copy,调用的接口不一样
                require(['topuAndStrategyDiff.view'],function(TopuAndStrategyDiffView){

                    this.myTopuAndStrategyDiffView = new TopuAndStrategyDiffView({
                        collection:this.collection,
                        operatorList:this.operatorList,
                        diffData:this.getPostParam(),
                        onCancelCallback:function(){
                            this.closeDiffView();
                        }.bind(this)
                    });
                    this.myTopuAndStrategyDiffView.render(this.$el.find(".diff-role-ctn"));

                }.bind(this))
            },

            closeDiffView:function(){
                this.myTopuAndStrategyDiffView.$el.remove();
                this.$el.find(".add-topo").show();
            },

            onClickSaveButton: function() {
                var postTopo = this.getPostParam();
                if(!postTopo){
                    return false;
                }
                if (this.isEdit && !this.isCopy)
                    this.collection.modifyStrategy(postTopo);
                else if (this.isEdit && this.isCopy)
                    this.collection.copyStrategy(postTopo)
                else
                    this.collection.addStrategy(postTopo);
            },

            getPostParam:function(){
                this.defaultParam.name = $.trim(this.$el.find("#input-name").val());
                if (this.defaultParam.name == '') {
                    Utility.warning('请输入名称');
                    return false;
                } else if (this.defaultParam.type == null) {
                    Utility.warning('请选择设备类型');
                    return false;
                } else if (this.defaultParam.rule.length == 0) {
                    Utility.warning('请添加规则');
                    return false;
                }
                var postRules = [],
                    postTopo = {};
                _.each(this.defaultParam.rule, function(rule) {
                    var localIdArray = [],
                        upperObjArray = [],
                        tempRule = {};
                    _.each(rule.local, function(node) {
                        if(rule.localType == 3){
                            localIdArray.push([node.provinceId, node.id]);
                        }else if(rule.localType===4){
                            localIdArray.push([node.areaId, node.id]);
                        }else if(rule.localType === 1 || rule.localType === 2 || rule.localType === 5){
                            localIdArray.push([node.id])
                        }
                    }.bind(this))
                    _.each(rule.upper, function(node) {
                        if(rule.upType == 1){
                            upperObjArray.push({
                                nodeId: node.rsNodeMsgVo.id,
                                ipCorporation: node.ipCorporation,
                                chiefType: node.chiefType === undefined ? 1 : node.chiefType
                            })
                        }
                        else if(rule.upType == 2){
                            upperObjArray.push({
                                hashId: node.rsNodeMsgVo.id,
                                hashIndex: node.hashIndex,
                                ipCorporation: node.ipCorporation
                                //chiefType: node.chiefType === undefined ? 1 : node.chiefType
                            })
                        }
                    }.bind(this))
                    tempRule.id = rule.id;
                    tempRule.localType = rule.localType;
                    tempRule.local = localIdArray;
                    tempRule.upper = upperObjArray;
                    tempRule.upType = rule.upType;
                    postRules.push(tempRule);
                }.bind(this))

                postTopo.id = this.defaultParam.id;
                postTopo.name = this.defaultParam.name;
                postTopo.type = this.defaultParam.type;
                postTopo.topoId = this.defaultParam.topoId;
                postTopo.rule = postRules;
                postTopo.remark = this.$el.find("#secondary").val();
                return postTopo;                
            },

            onClickCancelButton: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            initDeviceDropMenu: function(res) {
                this.deviceTypeArray = [];
                var typeArray = [],
                    rootNode = this.$el.find(".dropdown-type");

                _.each(res, function(el, index, ls) {
                    if (el.id !== 200 && el.id !== 201) {
                        typeArray.push({
                            name: el.name,
                            value: el.id
                        });
                    }
                    this.deviceTypeArray.push({
                        name: el.name,
                        value: el.id
                    });
                }.bind(this));
                if (!this.isEdit) {
                    this.defaultParam.type = typeArray[0].value;
                    var rootNode = this.$el.find(".dropdown-app");
                    Utility.initDropMenu(rootNode, typeArray, function(value) {
                        this.defaultParam.type = parseInt(value)
                    }.bind(this));
                    this.$el.find("#dropdown-app .cur-value").html(typeArray[0].name);
                } else {
                    var upperObj = _.find(typeArray, function(object) {
                        return object.value == this.defaultParam.type;
                    }.bind(this))
                    this.$el.find('#dropdown-app .cur-value').html(upperObj.name);
                    this.$el.find("#dropdown-app").attr("disabled", "disabled")
                }
            },

            onGetOperatorSuccess: function(res) {
                this.operatorList = res.rows;
                this.initRuleTable();
            },

            onLocalTypeModified: function(){
                this.ruleList = [];
                _.each(this.defaultParam.rule, function(rule, index, ls){
                        var localLayerArray = [],
                            upperLayer = [],
                            primaryArray = [],
                            backupArray = [],
                            primaryNameArray = [],
                            backupNameArray = [];
                            _.each(rule.local, function(local, inx, list) {
                                var name = "";
                                if(rule.localType === 3){
                                    name = local.provinceName +'/'+ local.name;   
                                }else if(rule.localType === 4){
                                    name = local.areaName +'/'+ local.name;
                                }else if(rule.localType === 1 || rule.localType === 2){
                                    name = local.name
                                }
                                else if(rule.localType === 5){
                                    name = local.name + "<span class='text-danger'>[环]</span>";
                                }
                                localLayerArray.push(name)
                            }.bind(this));
                        var upType = rule.upType;//1是按节点,2是按hash
                        if(upType == 1){
                            //按节点
                            primaryArray = _.filter(rule.upper, function(obj) {
                                return obj.chiefType !== 0;
                            }.bind(this))
                            backupArray = _.filter(rule.upper, function(obj) {
                                return obj.chiefType === 0;
                            }.bind(this))
                            _.each(primaryArray, function(upper, inx, list) {
                                upper.ipCorporationName = "";
                                if (upper.rsNodeMsgVo && upper.rsNodeMsgVo.operatorId === 9) {
                                    for (var i = 0; i < this.operatorList.length; i++) {
                                        if (this.operatorList[i].id === upper.ipCorporation) {
                                            upper.ipCorporationName = "-" + this.operatorList[i].name;
                                            break;
                                        }
                                    }
                                }
                                if (upper.rsNodeMsgVo)
                                    primaryNameArray.push(upper.rsNodeMsgVo.name + upper.ipCorporationName)
                                else
                                    primaryNameArray.push("[后端没有返回名称]")
                            }.bind(this));
                            _.each(backupArray, function(upper, inx, list) {
                                upper.ipCorporationName = "";
                                if (upper.rsNodeMsgVo && upper.rsNodeMsgVo.operatorId === 9) {
                                    for (var i = 0; i < this.operatorList.length; i++) {
                                        if (this.operatorList[i].id === upper.ipCorporation) {
                                            upper.ipCorporationName = "-" + this.operatorList[i].name;
                                            break;
                                        }
                                    }
                                }
                                if (upper.rsNodeMsgVo)
                                    backupNameArray.push(upper.rsNodeMsgVo.name + upper.ipCorporationName)
                                else
                                    backupNameArray.push("[后端没有返回名称]")
                            }.bind(this));
                        }
                        else {
                            //按hash环
                            _.each(rule.upper,function(el){
                                //第一次点添加或编辑时需要编造，其它情况与节点的一致
                                if(!el.rsNodeMsgVo){
                                    el.rsNodeMsgVo = {
                                        id:el.hashId,
                                        //chiefType:el.hashIndex == 0 ? 1:0,
                                        isMulti:el.ipCorporation ? 1 : 0,
                                        ipCorporation:el.ipCorporation,
                                        hashName:el.hashName,
                                        name:el.hashName
                                    };
                                }
                            });
                            primaryArray = _.filter(rule.upper, function(obj) {
                                return obj.hashIndex == 0;
                            }.bind(this))
                            backupArray = _.filter(rule.upper, function(obj) {
                                return obj.hashIndex != 0;
                            }.bind(this))
                            _.each(primaryArray, function(upper, inx, list) {
                                upper.ipCorporationName = "";
                                if (upper.rsNodeMsgVo && upper.rsNodeMsgVo.isMulti === 1) {
                                    for (var i = 0; i < this.operatorList.length; i++) {
                                        if (this.operatorList[i].id === upper.ipCorporation) {
                                            upper.ipCorporationName = "-" + this.operatorList[i].name;
                                            break;
                                        }
                                    }
                                }
                                if (upper.rsNodeMsgVo)
                                    primaryNameArray.push(upper.rsNodeMsgVo.name + "<span class='text-danger'>[环]</span>" + upper.ipCorporationName)
                                else
                                    primaryNameArray.push("[后端没有返回名称]")
                            }.bind(this));
                            _.each(backupArray, function(upper, inx, list) {
                                upper.ipCorporationName = "";
                                if (upper.rsNodeMsgVo && upper.rsNodeMsgVo.isMulti === 1) {
                                    for (var i = 0; i < this.operatorList.length; i++) {
                                        if (this.operatorList[i].id === upper.ipCorporation) {
                                            upper.ipCorporationName = "-" + this.operatorList[i].name;
                                            break;
                                        }
                                    }
                                }
                                if (upper.rsNodeMsgVo)
                                    backupNameArray.push(upper.rsNodeMsgVo.name + "<span class='text-danger'>[环]</span>" + upper.ipCorporationName)
                                else
                                    backupNameArray.push("[后端没有返回名称]")
                            }.bind(this));    
        
                        }
        
                        var upperLayer = primaryNameArray.join('<br>');
                        if (rule.upper.length > 1)
                            upperLayer = '<strong>主：</strong>' + primaryNameArray.join('<br>');
                        if (backupArray.length > 0)
                            upperLayer += '<br><strong>备：</strong>' + backupNameArray.join('<br>');
                        var ruleStrObj = {
                            id: rule.id,
                            localLayer: localLayerArray.join('<br>'),
                            upperLayer: upperLayer
                        }
                        this.ruleList.push(ruleStrObj)  
                   
                }.bind(this))
            },

            initRuleTable: function() {
                this.onLocalTypeModified();
                this.roleTable = $(_.template(template['tpl/setupChannelManage/setupChannelManage.rule.table.html'])({
                    data: this.ruleList
                }));
                if (this.ruleList.length !== 0)
                    this.$el.find(".rule .table-ctn").html(this.roleTable[0]);
                else
                    this.$el.find(".rule .table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "还没有添加规则"
                        }
                    }));
                this.roleTable.find("[data-toggle='popover']").popover();

                if (!this.isView) {
                    this.roleTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                    this.roleTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                    this.roleTable.find("tbody .update").on("click", $.proxy(this.onClickItemUpdate, this));
                } else {
                    this.roleTable.find("tbody .edit").hide();
                    this.roleTable.find("tbody .delete").hide();
                }

            },

            onClickItemEdit: function(event) {
                this.closeSendBtn();
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
              
                this.curEditRule = _.find(this.defaultParam.rule, function(obj) {
                    return obj.id === parseInt(id)
                }.bind(this));
                if (!this.curEditRule) {
                    Utility.warning("找不到此行的数据，无法编辑");
                    return;
                }

                require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'],
                    function(AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                        var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                        var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                            collection: myAddEditLayerStrategyModel,
                            rule: this.defaultParam.rule,
                            curEditRule: this.curEditRule,
                            isEdit: true,
                            notFilter: true,
                            appType: this.defaultParam.type,
                            onSaveCallback: function() {
                                var tempRule = myAddEditLayerStrategyView.getArgs();
                                //this.defaultParam.rule = tempRule;
                                // this.defaultParam.rule = this.defaultParam.rule.concat(tempRule);
                                // this.defaultParam.rule = _.filter(this.defaultParam.rule, function(el){
                                //     return el.id !== this.curEditRule.id
                                // }.bind(this))
                                var newRule = [];
                                for(var i=0;i<this.defaultParam.rule.length;i++){
                                    if(this.defaultParam.rule[i].id == id){
                                        continue;
                                    }
                                    newRule.push(this.defaultParam.rule[i]);
                                }
                                newRule = newRule.concat(tempRule);
                                this.defaultParam.rule = newRule;
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                                this.initRuleTable();
                            }.bind(this),
                            onCancelCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                            }.bind(this)
                        })

                        this.$el.find(".add-topo").hide();
                        myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
                    }.bind(this))
            },

            onClickItemDelete: function(event) {
                this.closeSendBtn();
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                this.defaultParam.rule = _.filter(this.defaultParam.rule, function(obj) {
                    return obj.id !== parseInt(id)
                }.bind(this))

                this.initRuleTable();
            },

            onClickAddRuleButton: function() {
                this.closeSendBtn();
                require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'],
                    function(AddEditLayerStrategyView, AddEditLayerStrategyModel) {
                        var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                        var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                            collection: myAddEditLayerStrategyModel,
                            rule: this.defaultParam.rule,
                            notFilter: true,
                            appType: this.defaultParam.type,
                            onSaveCallback: function() {
                                this.defaultParam.rule = myAddEditLayerStrategyView.getArgs();
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                                this.initRuleTable();
                            }.bind(this),
                            onCancelCallback: function() {
                                myAddEditLayerStrategyView.$el.remove();
                                this.$el.find(".add-topo").show();
                            }.bind(this)
                        })
                        this.$el.find(".add-topo").hide();
                        myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
                    }.bind(this))
            },

            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        var SpecialLayerManageView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.html'])());

                //获取所有的拓扑关系信息
                this.collection.on("get.strategyList.success", $.proxy(this.onGetStrategySuccess, this));
                this.collection.on("get.strategyList.error", $.proxy(this.onGetError, this));
                this.collection.on("delete.strategy.success", $.proxy(this.resetList, this));
                this.collection.on("delete.strategy.error", $.proxy(this.onGetError, this));
                //获取应用类型
                this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
                this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));

                this.collection.on("send.success", $.proxy(this.onSendSuccess, this));
                this.collection.on("send.error", $.proxy(this.onSendError, this));

                this.collection.on('get.topoInfo.success',$.proxy(this.onGetTopuInfo, this));
                this.collection.on('get.topoInfo.error',$.proxy(this.onGetError, this));

                // if (AUTH_OBJ.QueryTopos) {
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.resetList, this));
                this.on('enterKeyBindQuery', $.proxy(this.resetList, this));

                this.enterKeyBindQuery();
                // } else {
                //     this.$el.find(".opt-ctn .query").remove();
                // }
                // if (AUTH_OBJ.CreateTopos)
                this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));
                this.$el.find(".opt-ctn .replace").on("click", $.proxy(this.onClickReplaceNodeBtn, this));
                this.$el.find(".opt-ctn .delete").on("click", $.proxy(this.onClickDeleteNodeBtn, this));
                // else
                //     this.$el.find(".opt-ctn .new").remove();
                this.curPage = 1;
                this.queryArgs = {
                    "name": null,
                    "type": null,
                    "page": 1,
                    "size": 10,
                    "topoId":null
                }
                this.collection.getDeviceTypeList();
                var topoArgs = {
                    page:1,
                    size:9999
                };
                this.collection.getTopoinfo(topoArgs);
                this.onClickQueryButton();
            },

            resetList: function() {
                this.curPage = 1;
                this.onClickQueryButton();
            },

            enterKeyBindQuery: function() {
                $(document).on('keydown', function(e) {
                    if (e.keyCode == 13) {
                        this.trigger('enterKeyBindQuery');
                    }
                }.bind(this));
            },

            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            },

            onGetStrategySuccess: function() {
                this.initTable();
                if (!this.isInitPaginator) this.initPaginator();
            },

            onGetTopuInfo:function(res){
                var rows = res.rows;
                var topoList = [{
                    name:"全部",
                    value:"All"
                }];
                _.each(res.rows,function(list){
                    var obj = {
                        name:list.name,
                        value:list.id
                    }
                    topoList.push(obj);
                });

                var rootNode = this.$el.find(".dropdown-topo");
                Utility.initDropMenu(rootNode, topoList, function(value) {
                    if (value == "All"){
                        this.queryArgs.topoId = null
                    }
                    else{
                        this.queryArgs.topoId = value
                    }
                }.bind(this));
            },

            onClickQueryButton: function() {
                this.isInitPaginator = false;
                this.queryArgs.page = this.curPage;
                this.queryArgs.name = this.$el.find("#input-topo-name").val();
                if (this.queryArgs.name == "") this.queryArgs.name = null;
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.$el.find(".pagination").html("");
                this.collection.getStrategyList(this.queryArgs);
            },

            initTable: function() {
                this.table = $(_.template(template['tpl/specialLayerManage/specialLayerManage.table.html'])({
                    data: this.collection.models,
                    permission: AUTH_OBJ
                }));
                if (this.collection.models.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .view").on("click", $.proxy(this.onClickItemView, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                this.table.find("tbody .update").on("click", $.proxy(this.onClickItemUpdate, this));
                this.table.find("tbody .copy").on("click", $.proxy(this.onClickItemCopy, this));
                this.table.find("tbody .send").on("click", $.proxy(this.onClickItemSend, this));
                this.table.find("tbody .check").on("click", $.proxy(this.onClickItemCheck, this));

                this.table.find("[data-toggle='popover']").popover();
            },

            onClickItemCheck:function(event){
                var eventTarget = event.srcElement || event.target, id;
                if (eventTarget.tagName == "SPAN"){
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                var model = this.collection.get(id);

                if (this.checkTopoViewPopup) $("#" + this.checkTopoViewPopup.modalId).remove();

                var myCheckSpecialLayerAndTopoView = new CheckSpecialLayerAndTopoView({
                    collection: this.collection,
                    model     : model,
                    obj:this
                });
                var options = {
                    title:"分层策略与拓扑覆盖检查",
                    body : myCheckSpecialLayerAndTopoView,
                    backdrop : 'static',
                    type     : 1,
                    onOKCallback:  function(){}.bind(this),
                    onHiddenCallback: function(){}.bind(this)
                }
                this.checkTopoViewPopup = new Modal(options);
            },

            onClickItemSend:function(event){
                var eventTarget = event.srcElement || event.target,id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                
                var model = this.collection.get(id);

                // this.domainArray = [{
                //     domain: model.get("name"),
                //     id: model.get("id"),
                //     platformId: model.get("type")                    
                // }];
                // this.showSelectStrategyPopup(model);
                var args = {
                    comment:model.get("type"),
                    ruleId:model.get("id")
                };
                this.collection.strategyUpdate(args);

            },

            showSelectStrategyPopup: function(model) {
                if (this.selectStrategyPopup) $("#" + this.selectStrategyPopup.modalId).remove();

                require(["setupSendWaitCustomize.stratety.view"], function(SelectStrategyView) {
                    var mySelectStrategyView = new SelectStrategyView({
                        collection: this.collection,
                        domainArray: this.domainArray,
                        model: model,
                        source:"specialLayerManage"
                    });
                    //var type = AUTH_OBJ.ApplySendMission ? 2 : 1;
                    var options = {
                        title: "生成下发任务",
                        body: mySelectStrategyView,
                        backdrop: 'static',
                        type: 2,
                        onOKCallback: function() {
                            this.createTaskParam = mySelectStrategyView.onSure();
                            if (!this.createTaskParam) return;
                            var args = {
                                taskName:this.domainArray[0].platformId,
                                ruleId:this.domainArray[0].id,
                                strategyId:this.createTaskParam.strategyId
                            };
                            this.collection.off("send.success");
                            this.collection.off("send.error");
                            this.collection.on("send.success", $.proxy(this.onSendSuccess, this));
                            this.collection.on("send.error", $.proxy(this.onSendError, this));
                            this.collection.strategyUpdate(args);
                            this.selectStrategyPopup.$el.modal('hide')
                        }.bind(this),
                        onHiddenCallback: function() {
                            this.enterKeyBindQuery();
                        }.bind(this)
                    }
                    this.selectStrategyPopup = new Modal(options);
                }.bind(this))
            },

            onSendSuccess:function(){
                alert("成功");
                window.location.href="#/setupSendWaitSend";
            },

            onSendError:function(data){
                alert(data.message);
            },

            onClickAddRuleTopoBtn: function() {
                this.off('enterKeyBindQuery');
                var myAddEditLayerView = new AddEditLayerView({
                    collection: this.collection,
                    onSaveCallback: function() {
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.onClickQueryButton();
                    }.bind(this),
                    onSaveAndSendCallback: function(res) {
                        var model = new this.collection.model(res);
                        require(['setupTopoManage.update.view'], function(UpdateTopoView) {
                            var myUpdateTopoView = new UpdateTopoView({
                                collection: this.collection,
                                isEdit: false,
                                pageType: 2,
                                model: model,
                                onSaveCallback: function() {}.bind(this),
                                onCancelCallback: function() {
                                    myUpdateTopoView.$el.remove();
                                    this.$el.find(".list-panel").show();
                                }.bind(this)
                            })
                            myAddEditLayerView.$el.remove();
                            myUpdateTopoView.render(this.$el.find(".update-panel"));
                        }.bind(this))
                    }.bind(this),
                    onCancelCallback: function() {
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))
            },

            onClickReplaceNodeBtn:function(){
                this.off('enterKeyBindQuery');
                // if (this.replaceNodePopup) $("#" + this.replaceNodePopup.modalId).remove();
                require(["specialLayerManage.replaceNode.view"], function(ReplaceNodeView) {
                    var myReplaceNodeView = new ReplaceNodeView({
                        collection: this.collection,
                        onSaveCallback: function() {}.bind(this),
                        onCancelCallback: function() {
                            myReplaceNodeView.$el.remove();
                            this.$el.find(".list-panel").show();
                        }.bind(this)
                    });
                    this.$el.find(".list-panel").hide();
                    myReplaceNodeView.render(this.$el.find(".edit-panel"))
                }.bind(this));
                
            },

            onClickDeleteNodeBtn:function(){
                this.off('enterKeyBindQuery');
                // if (this.replaceNodePopup) $("#" + this.replaceNodePopup.modalId).remove();
                require(["specialLayerManage.deleteNode.view"], function(DeleteNodeView) {
                    var myDeleteNodeView = new DeleteNodeView({
                        collection: this.collection,
                        onSaveCallback: function() {}.bind(this),
                        onCancelCallback: function() {
                            myDeleteNodeView.$el.remove();
                            this.$el.find(".list-panel").show();
                        }.bind(this)
                    });
                    this.$el.find(".list-panel").hide();
                    myDeleteNodeView.render(this.$el.find(".edit-panel"))
                }.bind(this));
            },


            onClickItemUpdate: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = this.collection.get(id);
                require(['setupTopoManage.update.view'], function(UpdateTopoView) {
                    var myUpdateTopoView = new UpdateTopoView({
                        collection: this.collection,
                        model: model,
                        isEdit: false,
                        pageType: 2,
                        onSaveCallback: function() {}.bind(this),
                        onCancelCallback: function() {
                            myUpdateTopoView.$el.remove();
                            this.$el.find(".list-panel").show();
                        }.bind(this)
                    })

                    this.$el.find(".list-panel").hide();
                    myUpdateTopoView.render(this.$el.find(".update-panel"));
                }.bind(this));
            },

            onClickItemDelete: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                var result = confirm("是否确认删除？");

                if (!result) return;

                this.collection.deleteStrategy({
                    id: id
                })
            },

            onClickItemCopy: function(event) {
                this.off('enterKeyBindQuery');
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = this.collection.get(id);
                var myAddEditLayerView = new AddEditLayerView({
                    collection: this.collection,
                    model: model,
                    isEdit: true,
                    isCopy: true,
                    onSaveCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.onClickQueryButton();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this),
                    onCancelCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))

            },

            onClickItemEdit: function(event) {
                this.off('enterKeyBindQuery');
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = this.collection.get(id);
                var myAddEditLayerView = new AddEditLayerView({
                    collection: this.collection,
                    model: model,
                    isEdit: true,
                    onSaveCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.onClickQueryButton();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this),
                    onSaveAndSendCallback: function() {
                        require(['setupTopoManage.update.view'], function(UpdateTopoView) {
                            var myUpdateTopoView = new UpdateTopoView({
                                collection: this.collection,
                                isEdit: true,
                                pageType: 2,
                                model: model,
                                onSaveCallback: function() {}.bind(this),
                                onCancelCallback: function() {
                                    myUpdateTopoView.$el.remove();
                                    this.$el.find(".list-panel").show();
                                    this.onClickQueryButton();
                                }.bind(this)
                            })
                            myAddEditLayerView.$el.remove();
                            myUpdateTopoView.render(this.$el.find(".update-panel"));
                        }.bind(this))
                    }.bind(this),
                    onCancelCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))
            },

            onClickItemView: function(event) {
                this.off('enterKeyBindQuery');
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = this.collection.get(id);
                var myAddEditLayerView = new AddEditLayerView({
                    collection: this.collection,
                    model: model,
                    isEdit: true,
                    isView: true,
                    onSaveCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.onClickQueryButton();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this),
                    onCancelCallback: function() {
                        myAddEditLayerView.$el.remove();
                        this.$el.find(".list-panel").show();
                        this.on('enterKeyBindQuery', $.proxy(this.resetList, this));
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myAddEditLayerView.render(this.$el.find(".edit-panel"))
            },

            initPaginator: function() {
                this.$el.find(".total-items span").html(this.collection.total)
                if (this.collection.total <= this.queryArgs.size) return;
                var total = Math.ceil(this.collection.total / this.queryArgs.size);
                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: this.curPage,
                    onPageChange: function(num, type) {
                        if (type !== "init") {
                            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                            var args = _.extend(this.queryArgs);
                            args.page = num;
                            args.count = this.queryArgs.size;
                            this.collection.getStrategyList(args);
                            this.curPage = num
                        }
                    }.bind(this)
                });
                this.isInitPaginator = true;
            },

            initDeviceDropMenu: function(res) {
                this.deviceTypeArray = [];
                var typeArray = [{
                        name: '全部',
                        value: 'all'
                    }],
                    rootNode = this.$el.find(".dropdown-type");

                _.each(res, function(el, index, ls) {
                    if (el.id !== 200 && el.id !== 201) {
                        typeArray.push({
                            name: el.name,
                            value: el.id
                        });
                    }
                    this.deviceTypeArray.push({
                        name: el.name,
                        value: el.id
                    });
                }.bind(this));
                if (!this.isEdit) {
                    var rootNode = this.$el.find(".dropdown-app");
                    Utility.initDropMenu(rootNode, typeArray, function(value) {
                        if (value !== "All")
                            this.queryArgs.type = parseInt(value)
                        else
                            this.queryArgs.type = null
                    }.bind(this));
                } else {
                    this.$el.find("#dropdown-app").attr("disabled", "disabled")
                }

                var pageNum = [{
                    name: "10条",
                    value: 10
                }, {
                    name: "20条",
                    value: 20
                }, {
                    name: "50条",
                    value: 50
                }, {
                    name: "100条",
                    value: 100
                }]
                Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value) {
                    this.queryArgs.size = parseInt(value);
                    this.curPage = 1;
                    this.onClickQueryButton();
                }.bind(this));
            },

            hide: function() {
                this.$el.hide();
                this.off('enterKeyBindQuery');
            },

            update: function(target) {
                this.collection.off();
                this.collection.reset();
                this.remove();
                this.initialize(this.options);
                this.render(target);
            },

            render: function(target) {
                this.$el.appendTo(target)
            }
        });

        return SpecialLayerManageView;
    });