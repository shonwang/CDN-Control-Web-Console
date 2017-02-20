define("addEditLayerStrategy.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var AddEditLayerStrategyCollection = Backbone.Collection.extend({
        
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
        getTopoAndNodeInfo: function(args){
            var url = BASE_URL + "/resource/topo/origin/consoleInfo?id="+args,
            successCallback = function(res){
                if(res){
                    this.trigger('get.topoAndNodeInfo.success',res);
                }else{
                    this.trigger('get.topoAndNodeInfo.error');
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.topoAndNodeInfo.error');
            }.bind(this);
            Utility.getAjax(url, '' , successCallback, errorCallback);

        }
    });

    return AddEditLayerStrategyCollection;
});