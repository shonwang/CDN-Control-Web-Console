define("addEditLayerStrategy.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var AddEditLayerStrategyCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getOperatorList: function(args){
            var url = BASE_URL + "/rs/metaData/operatorList?" + new Date().valueOf(),
            successCallback = function(res){
                if (res)
                    this.trigger("get.operator.success", res); 
                else
                    this.trigger("get.operator.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.operator.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getNodeList: function(args){
            var url = BASE_URL + "/rs/node/list",
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


        queryChannel: function(args){
            var url = BASE_URL + "/rs/channel/query",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
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

        getChannelDispgroup: function(args){
            var url = BASE_URL + "/rs/channel/dispgroup/get",
            successCallback = function(res){
                if (res){
                    this.trigger("channel.dispgroup.success", res);
                } else {
                    this.trigger("channel.dispgroup.error", res); 
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("channel.dispgroup.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addDispGroupChannel: function(args){
            var url = BASE_URL + "/rs/channel/dispgroup/add",
            successCallback = function(res){
                this.trigger("add.dispGroup.channel.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("add.dispGroup.channel.error", response); 
            }.bind(this);

            Utility.postAjax(url, args, successCallback, errorCallback, null, "text");
        },

        ipTypeList: function(args){
            var url = BASE_URL + "/rs/metaData/ipTypeList",
            successCallback = function(res){
                if (res)
                    this.trigger("ip.type.success", res.rows);
                else
                    this.trigger("ip.type.error");
            }.bind(this),
            errorCallback = function(response){
                this.trigger("ip.type.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        deleteDispGroupChannel: function(args){
            var url = BASE_URL + "/rs/channel/dispgroup/delete",
            successCallback = function(res){
                this.trigger("add.dispGroup.channel.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("add.dispGroup.channel.error", response); 
            }.bind(this);

            Utility.postAjax(url, args, successCallback, errorCallback, null, "text");
        },getTopoinfo: function(args){
            var url = BASE_URL + "/resource/topo/info/list",
            successCallback = function(res){
                this.reset();
                if(res){
                    _.each(res.rows,function(element, index ,list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.topoInfo.success");
                }else{
                    this.trigger("get.topoInfo.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.topoInfo.error',response);
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
        getDeviceTypeList:function(args){
            var url = BASE_URL + "/resource/rs/metaData/deviceType/list",
            successCallback = function(res) {
                if(res){
                    this.trigger("get.devicetype.success",res);
                }else{
                    this.trigger("get.devicetype.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.devicetype.error');
            }.bind(this);
            Utility.getAjax(url, '' , successCallback, errorCallback);
        },
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
        getOperatorUpperList:function(args){
            var url = BASE_URL + "/resource/rs/metaData/operator/list",
            successCallback = function(res) {
                if(res){
                    this.trigger("get.operatorUpper.success",res);
                }else{
                    this.trigger("get.operatorUpper.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.operatorUpper.error');
            }.bind(this);
            Utility.getAjax(url, '' , successCallback, errorCallback);
        },
    });

    return AddEditLayerStrategyCollection;
});