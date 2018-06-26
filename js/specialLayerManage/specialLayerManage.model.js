define("specialLayerManage.model", ['require', 'exports', 'utility', 'setupTopoManage.model'],
    function(require, exports, Utility, SetupTopoManageCollection) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                var createTime = this.get('createTime'),
                    type = this.get('type'),
                    updateTime = this.get('updateTime');

                createTime = this.set("createTimeStr", new Date(createTime).format("yyyy/MM/dd hh:mm"));
                updateTime = this.set("updateTimeStr", new Date(updateTime).format("yyyy/MM/dd hh:mm"));
                if (type === 200) this.set("typeName", 'LVS');
                if (type === 201) this.set("typeName", 'Relay');
                if (type === 202) this.set("typeName", 'Cache');
                if (type === 203) this.set("typeName", 'Live');
            }
        });

        var SpecialLayerManageCollection = SetupTopoManageCollection.extend({

            model: Model,

            initialize: function() {},

            getTopoinfo: function(args) {
                var url = BASE_URL + "/resource/topo/info/list",
                    successCallback = function(res) {
                        if (res) {
                            this.trigger("get.topoInfo.success",res);
                        } else {
                            this.trigger("get.topoInfo.error",res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('get.topoInfo.error', response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            getOperatorList: function(args){
                var url = BASE_URL + "/rs/metaData/operatorList?" + new Date().valueOf(); 
                var defaultParas = {
                    type: "GET",
                    url: url,
                    async: true,
                    timeout: 30000
                };
    
                defaultParas.beforeSend = function(xhr){
                    //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
                }
                defaultParas.success = function(res){
                    this.trigger("get.operator.success", res); 
                }.bind(this);
    
                defaultParas.error = function(response, msg){
                    if (response&&response.responseText)
                        response = JSON.parse(response.responseText)
                    this.trigger("get.operator.error", response); 
                }.bind(this);
    
                $.ajax(defaultParas);
            },

            checkWithTopo:function(args){
                var url = BASE_URL + "/resource/special/checkWithTopo?topoId="+args.topoId+"&strategyId="+args.strategyId,
                    successCallback = function(res) {
                        if (res) {
                            this.trigger("checkWithTopo.success", res);
                        } else {
                            this.trigger("checkWithTopo.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('checkWithTopo.error', response);
                    }.bind(this);
                Utility.getAjax(url, {}, successCallback, errorCallback);                
            },

            getStrategyList: function(args) {
                var url = BASE_URL + "/resource/special/getStrategyList",
                    successCallback = function(res) {
                        this.reset();
                        if (res) {
                            _.each(res.rows, function(element, index, list) {
                                this.push(new Model(element));
                            }.bind(this))
                            this.total = res.total;
                            this.trigger("get.strategyList.success");
                        } else {
                            this.trigger("get.strategyList.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('get.strategyList.error', response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            getStrategyInfoById: function(args) {
                var url = BASE_URL + "/resource/special/getStrategyConsoleInfo",
                    successCallback = function(res) {
                        if (res) {
                            this.trigger("get.strategyInfoById.success", res);
                        } else {
                            this.trigger("get.strategyInfoById.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('get.strategyInfoById.error', response);
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            },

            addStrategy: function(args) {
                var url = BASE_URL + "/resource/special/addStrategy",
                    successCallback = function(res) {
                        this.trigger("add.strategy.success",res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('add.strategy.error', response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            getStrategyInfoByNode: function(args) {
                var url = BASE_URL + "/resource/topo/batch/getStragetysInfoByNodeId?nodeId=" + args,
                    successCallback = function(res) {
                        if (res) {
                            this.trigger("get.strategyInfoByNode.success", res);
                        } else {
                            this.trigger("get.strategyInfoByNode.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('get.strategyInfoByNode.error', response);
                    }.bind(this);
                    console.log(url)
                Utility.getAjax(url, args, successCallback, errorCallback);
            },

            getNodeList: function(args){
                var url = BASE_URL + "/rs/node/list";
                var defaultParas = {
                    type: "POST",
                    url: url,
                    async: true,
                    timeout: 30000,
                    contentType: "application/json",
                    processData: false
                };
                
                defaultParas.data = args || {
                    "page"    : 1,
                    "count"   : 99999,
                    "chname"  : null,//节点名称
                    "operator": null,//运营商id
                    "status"  : null//节点状态
                };
                defaultParas.data = JSON.stringify(defaultParas.data);
    
                defaultParas.beforeSend = function(xhr){
                    //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
                }
                defaultParas.success = function(res){
                    if (res){
                        this.trigger("get.node.success", res);
                    } else {
                        this.trigger("get.node.error", res); 
                    }
                }.bind(this);
    
                defaultParas.error = function(response, msg){
                    if (response&&response.responseText)
                        response = JSON.parse(response.responseText)
                    this.trigger("get.node.error", response); 
                }.bind(this);
    
                $.ajax(defaultParas);
            },    

            getRuleInfo: function(args, id) {
                var url = BASE_URL + "/resource/topo/batch/getStrategysRulesByNodeId?id="+args.id+"&nodeId="+args.nodeId,
                    successCallback = function(res) {
                        if (res) {
                            this.trigger("get.ruleInfo.success", res,args.id);
                        } else {
                            this.trigger("get.ruleInfo.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('get.ruleInfo.error', response);
                    }.bind(this);
                    console.log(url)
                Utility.getAjax(url, args, successCallback, errorCallback);
            },

            updateStrategy: function(args, name) {
                console.log("update",args,"model里的upadteStrategy")
                var url = BASE_URL + "/resource/topo/batch/updateTopoOrStrategy",
                    successCallback = function(res) {
                        this.trigger("update.strategy.success", res, args.id);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('update.strategy.error', response, args.id, name);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },


            modifyStrategy: function(args) {
                var url = BASE_URL + "/resource/special/modifyStrategy",
                    successCallback = function(res) {
                        this.trigger("modify.strategy.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('modify.strategy.error', response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            deleteStrategy: function(args) {
                var url = BASE_URL + "/resource/special/deleteStrategy",
                    successCallback = function(res) {
                        this.trigger("delete.strategy.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('delete.strategy.error', response);
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            },

            copyStrategy: function(args) {
                var url = BASE_URL + "/resource/special/copyStrategy",
                    successCallback = function(res) {
                        this.trigger("copy.strategy.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('copy.strategy.error', response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            strategyUpdate:function(args, num){
                var url = BASE_URL + "/cd/task/strategyupdate/create?comment="+args.comment+"&ruleId="+args.ruleId,
                    successCallback = function(res) {
                        this.trigger("send.success", res, args.ruleId, num);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('send.error', response, args.ruleId, num);
                    }.bind(this);
                Utility.postAjax(url, [], successCallback, errorCallback);
            },

            strategyEditUpdate:function(args){
                var url = BASE_URL + "/cd/task/strategyupdate/create?comment="+args.comment+"&ruleId="+args.ruleId,
                    successCallback = function(res) {
                        this.trigger("edit.send.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('edit.send.error', response);
                    }.bind(this);
                Utility.postAjax(url, [], successCallback, errorCallback);
            }



        });

        return SpecialLayerManageCollection;
    });