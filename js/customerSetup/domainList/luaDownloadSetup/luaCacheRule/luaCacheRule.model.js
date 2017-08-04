define("luaCacheRule.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var CacheRuleCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setCachePolicyBatch: function(args){
            var url = BASE_URL + "/channelManager/cache/setCachePolicyBatch",
            successCallback = function(res){
                this.trigger("set.policy.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.policy.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getCachePolicy: function(args){
            var url = BASE_URL + "/channelManager/cache/getCachePolicy",
            successCallback = function(res){
                if (res){
                    this.trigger("get.policy.success", res);
                } else {
                    this.trigger("get.policy.error", res); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.policy.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return CacheRuleCollection;
});