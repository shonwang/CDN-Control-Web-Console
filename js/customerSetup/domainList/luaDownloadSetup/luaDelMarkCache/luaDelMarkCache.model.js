define("luaDelMarkCache.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var DelMarkCacheCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getCacheQuestionMark: function(args){
            var url = BASE_URL + "/channelManager/cache/getCacheQuestionMark",
            successCallback = function(res){
                if (res){
                    this.trigger("get.mark.success", res);
                } else {
                    this.trigger("get.mark.error", res); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.mark.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setCacheQuestionMarkBatch: function(args){
            var url = BASE_URL + "/channelManager/cache/setCacheQuestionMarkBatch",
            successCallback = function(res){
                this.trigger("set.mark.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.mark.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return DelMarkCacheCollection;
});