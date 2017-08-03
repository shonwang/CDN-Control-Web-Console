define("luaIpBlackWhiteList.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var IpBlackWhiteListCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getIPSafetyChain: function(args){
           var url = BASE_URL + "/channelManager/safety/download/getIPSafetyChain",
            successCallback = function(res){
                this.trigger("get.IPSafetyChainList.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.IPSafetyChainList.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        
        setIPSafetyChainBatch: function(args){
            var url = BASE_URL + "/channelManager/safety/download/setIPSafetyChainBatch",
            successCallback = function(res){
                this.trigger("set.IPSafetyChain.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.IPSafetyChain.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return IpBlackWhiteListCollection;
});