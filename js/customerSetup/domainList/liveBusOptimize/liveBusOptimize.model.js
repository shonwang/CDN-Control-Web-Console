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
                this.trigger('set.setLiveConf.success',res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger('set.setLiveConf.error',response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return LiveBusOptimizeCollection;
});