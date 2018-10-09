define("topuAndStrategyDiff.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var TopuAndStrategyDiffView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.from = options.from || "stratety";//从拓扑还是分层进来的,默认分层 || topu
                this.options = options;
                this.diffData = options.diffData;
                this.operatorList = options.operatorList;
                this.collection = options.collection;
                this.onCancelCallback = options.onCancelCallback || null;
                this.collection.on("diff.strategy.success",$.proxy(this.onGetData,this));
                this.collection.on("diff.strategy.error",$.proxy(this.onGetError,this));
                this.$el = $(_.template(template['tpl/setupTopoManage/topuAndStrategyDiff.html'])());
                this.$el.find(".cancel").on("click",$.proxy(this.onCancelClick,this));
                this.showLoading();
                // setTimeout(function(){
                //     this.onGetData();
                // }.bind(this),2000);
                this.collection.getStrategyDiff(this.diffData);
            },

            showLoading:function(){
                this.$el.find(".list-panel").html(_.template(template['tpl/loading.html'])({}));
            },

            onGetData:function(res){
                var lowerDiffNodes = res && this.getDiffNodes(res.lowerDiffNodes) || [];//下
                var middleDiffNodes = res && this.getDiffNodes(res.middleDiffNodes) || [];//中
                var upperDiffNodes = res && this.getDiffNodes(res.upperDiffNodes) || [];//上
                var diffRules = res && this.getDiffRules(res.diffRules) || [];//规则
                var dataHtml = null;
                if(lowerDiffNodes.length == 0 && middleDiffNodes.length == 0 && upperDiffNodes.length == 0 && diffRules.length == 0) {
                    dataHtml = _.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "没有变化"
                        }
                    });
                }
                else{
                    dataHtml = $(_.template(template['tpl/setupTopoManage/topuAndStrategyDiff.table.html'])({
                        lowerDiffNodes:lowerDiffNodes,
                        middleDiffNodes:middleDiffNodes,
                        upperDiffNodes:upperDiffNodes,
                        diffRules:diffRules
                    }));
                }
                this.$el.find(".list-panel").html(dataHtml)
                
            },

            getDiffNodes:function(data){
                if(!data){
                    return false;
                }
                var typeNameEnumerate = this.typeNameEnumerate;
                var classEnumerate = this.classEnumerate;
                var arr = [];
                for(var i=0,_len=data.length;i<_len;i++){
                    var _type = data[i].type;
                    var obj = {
                        typeName:typeNameEnumerate[_type],
                        class:classEnumerate[_type],
                        name:data[i].name
                    }
                    arr.push(obj);
                }
                return arr;
            },

            // getLowerDiffNodes:function(data){
            //     if(!data){
            //         return false;
            //     }
            //     var typeNameEnumerate = this.typeNameEnumerate;
            //     var classEnumerate = this.classEnumerate;
            //     var arr = [];
            //     for(var i=0,_len=data.length;i<_len;i++){
            //         var _type = data[i].type;
            //         var obj = {
            //             typeName:typeNameEnumerate[_type],
            //             class:classEnumerate[type],
            //             name:data[i].name
            //         }
            //         arr.push(obj);
            //     }
            //     return arr;
            // },

            // getMiddleDiffNodes:function(data){
            //     if(!data){
            //         return false;
            //     }
            //     return data;
            // },

            // getUpperDiffNodes:function(data){
            //     if(!data){
            //         return false;
            //     }
            //     return data;
            // },

            typeNameEnumerate:{
                1:"<span class='text-success'>增</span>",
                2:"<span class='text-danger'>改</span>",
                3:"<span class='text-danger'>删</span>",
                "-1":"<span class='text-danger'>删</span>"
            },

            classEnumerate:{
                1:"success",
                2:"",
                3:"danger",
                "-1":"danger"
            },

            getDiffRules:function(data){
                if(!data){
                    return false;
                };
                var typeNameEnumerate = this.typeNameEnumerate;
                var classEnumerate = this.classEnumerate;
                var arr = [];
                for(var i=0;i<data.length;i++){
                    var ruleList = null;
                    if(this.from == "topo"){
                        ruleList = this.getTopoRuleList(data[i].topoRuleChange);
                    }
                    else{
                        ruleList = this.getRuleList(data[i].topoRuleChange);
                    }
                    var obj = {
                        type:data[i].type,
                        typeName:typeNameEnumerate[data[i].type],
                        class:classEnumerate[data[i].type],
                        content:ruleList
                    };
                    arr.push(obj);
                }
                return arr;
            },


            getRuleList: function(rule){
                //分层策略的格式
                var ruleList = [];
                _.each(rule, function(rule, index, ls){
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
                        ruleList.push(ruleStrObj)  
                   
                }.bind(this))
                return ruleList;
            },

            getTopoRuleList:function(rule){
                var ruleList = [];

                _.each(rule, function(rule, index, ls) {
                    var localLayerArray = [],
                        upperLayer = [],
                        primaryArray = [],
                        backupArray = [],
                        primaryNameArray = [],
                        backupNameArray = [];
                    _.each(rule.local, function(local, inx, list) {
                        var name = local.name;
                        if (rule.localType === 3) {
                            name = local.provinceName + '/' + local.name;
                        } else if (rule.localType === 4) {
                            name = local.areaName + '/' + local.name;
                        }
                        localLayerArray.push(name || "[后端没有返回名称]")
                    }.bind(this));
                    // if(rule.localType===1) localLayerArray=localLayerArray.join('<br>')
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

                    var upperLayer = primaryNameArray.join('<br>');
                    if (rule.upper.length > 1)
                        upperLayer = '<strong>主：</strong><br>' + primaryNameArray.join('<br>');
                    if (backupArray.length > 0)
                        upperLayer += '<br><strong>备：</strong><br>' + backupNameArray.join('<br>');

                    // 这部分是规则选择后的数据形式
                    var ruleStrObj = {
                        id: rule.id,
                        localLayer: localLayerArray.join("<br>"),
                        upperLayer: upperLayer,
                        localType: rule.localType
                    }
                    ruleList.push(ruleStrObj)
                }.bind(this))      
                return ruleList;          
            },

            onCancelClick:function(){
                this.onCancelCallback && this.onCancelCallback();
            },

            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            },

            hide: function() {
                this.$el.hide();
            },

            render: function(target) {
                this.$el.appendTo(target)
            }
        });

        return TopuAndStrategyDiffView;
    });