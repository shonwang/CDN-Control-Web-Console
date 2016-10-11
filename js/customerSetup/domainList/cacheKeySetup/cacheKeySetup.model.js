define("cacheKeySetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var CacheKeySetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setCacheKey: function(args){
            var url = BASE_URL + "/channelManager/cache/setCacheKey";
            Utility.getAjax(url, args, function(res){
                if(res == 1){
                    this.trigger("modify.cacheKey.success");
                } else {
                    this.trigger("modify.cacheKey.error");
                }
            }.bind(this),function(res){
                this.trigger("modify.cacheKey.error", res);
            }.bind(this));
        }
    });

    return CacheKeySetupCollection;
});