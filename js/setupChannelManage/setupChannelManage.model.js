define("setupChannelManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var businessType = this.get("type"),
                status       = this.get("auditStatus"),
                protocol     = this.get("protocol"),
                cdnFactory   = this.get("cdnFactory");

            if (status === 0) this.set("statusName", '<span class="text-default">审核中</span>');
            if (status === 1) this.set("statusName", '<span class="text-success">审核通过</span>');
            if (status === -1) this.set("statusName", '<span class="text-danger">删除</span>');
            if (businessType === 1) this.set("businessTypeName", '下载加速');
            if (businessType === 2) this.set("businessTypeName", '直播加速');
            if (protocol === 1) this.set("protocolName","http+hlv");
            if (protocol === 2) this.set("protocolName","hls");
            if (protocol === 3) this.set("protocolName","rtmp");
            if (cdnFactory === 1) this.set("cdnFactoryName", '自建');
            if (cdnFactory === 2) this.set("cdnFactoryName", '网宿');
            if (cdnFactory === 3) this.set("cdnFactoryName", '自建+网宿');

            this.set("tempUseCustomized", 1)
        }
    });

    var SetupChannelManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getOperatorList:function(args){
            var url = BASE_URL + "/resource/rs/metaData/operator/list",
            successCallback = function(res) {
                if(res){
                    this.trigger("get.operator.success",res);
                }else{
                    this.trigger("get.operator.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.devicetype.error');
            }.bind(this);
            Utility.getAjax(url, '' , successCallback, errorCallback);
        },

        predelivery:function(args){
            var url = BASE_URL + "/cd/predelivery",
            successCallback = function(res) {
                this.trigger("post.predelivery.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger('post.predelivery.error', response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        queryChannel: function(args){
            var url = BASE_URL + "/channelManager/domain/getChannelManager",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.data, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.totalCount;
                    this.trigger("get.channel.success");
                } else {
                    this.trigger("get.channel.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.channel.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getVersionList: function(args){
            var url = BASE_URL + "/channelManager/configuration/getVersionList",
            successCallback = function(res){
                if (res) {
                    this.trigger("get.channel.history.success", res);
                } else {
                    this.trigger("get.channel.history.error", res); 
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.channel.history.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addTopologyList: function(args){
            var url = BASE_URL + "/channelManager/topology/addTopologyList",
            successCallback = function(res){
                this.trigger("add.channel.topology.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("add.channel.topology.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTopoOrigininfo:function(args){
            var url = BASE_URL + "/resource/topo/origin/info?id="+args,
            successCallback = function(res){
                if(res){
                    this.total = res.total;
                    this.trigger("get.topo.OriginInfo.success",res);
                }else{
                    this.trigger("get.topo.OriginInfo.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.topo.OriginInfo.error',response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getRuleOrigin: function(args){
           var url = BASE_URL + "/resource/topo/rule/origin?ruleIds="+args,
           successCallback = function(res){
                if(res){
                    this.total = res.total;
                    this.trigger("get.rule.origin.success",res);
                }else{
                    this.trigger("get.rule.origin.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.rule.origin.error',response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getNodeList: function(args){
            var url = BASE_URL + "/resource/rs/node/queryNode",
            successCallback = function(res){
                if (res)
                    this.trigger("get.node.success", res); 
                else
                    this.trigger("get.node.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.node.error", response);  
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        specilaAdd:function(args){
            var url = BASE_URL + "/resource/topo/add/special/rule",
            successCallback = function(res){
                if(res){
                    this.trigger("add.special.success",res);
                }else{
                    this.trigger("add.special.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('add.special.error',response);
            }.bind(this);
            
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTopologyRole: function(args){
            var url = BASE_URL + "/channelManager/topology/getTopologyRoleByOriginId?originId="+args,
            successCallback = function(res){
                if (res)
                    this.trigger("getTopologyRole.success", res); 
                else
                    this.trigger("getTopologyRole.error"); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("getTopologyRole.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addTopologyRole: function(args){
             var url = BASE_URL + '/channelManager/topology/addTopologyRole',
            successCallback = function(res){
                this.trigger("addTopologyRole.success", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("addTopologyRole.error", response);  
            }.bind(this);
            
            Utility.getAjax(url, args, successCallback, errorCallback); 
        }

    });

    return SetupChannelManageCollection;
});