define("liveBusOptimize.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveBusOptimizeCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setLiveConf:function(args){
            var url = BASE_URL + "/channelManager/live/setLiveConf",
            successCallback = function(res){
                this.trigger('set.liveConfig.success',res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger('set.liveConfig.error',response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getLiveConf: function(args){
            var url = BASE_URL + "/channelManager/live/getLiveConf",
            successCallback = function(res){
                if (res)
                    this.trigger("get.liveConfig.success", res);
                else
                    this.trigger("get.liveConfig.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.liveConfig.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
    });

    return LiveBusOptimizeCollection;
});