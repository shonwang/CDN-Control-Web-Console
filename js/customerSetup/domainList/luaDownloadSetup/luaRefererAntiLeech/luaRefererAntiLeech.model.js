define("luaRefererAntiLeech.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var RefererAntiLeechCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getReferSafetyChain: function(args){
            var url = BASE_URL + "/channelManager/safety/download/getReferSafetyChain",
            successCallback = function(res){
                if (res){
                    this.trigger("get.refer.success", res);
                } else {
                    this.trigger("get.refer.error", res); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.refer.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setReferSafetyChainsBatch: function(args){
            var url = BASE_URL + "/channelManager/safety/download/setReferSafetyChainsBatch",
            successCallback = function(res){
                this.trigger("set.refer.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.refer.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return RefererAntiLeechCollection;
});