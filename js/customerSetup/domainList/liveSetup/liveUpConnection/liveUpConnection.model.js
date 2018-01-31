define("liveUpConnection.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveUpConnectionCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setLogConf: function(args){
            var url = BASE_URL + "/channelManager/live/setLiveBaseConf";
            Utility.postAjax(url, args, function(res){
                this.trigger("set.liveBaseConf.success");
            }.bind(this),function(res){
                this.trigger("set.liveBaseConf.error", res);
            }.bind(this));
        },

        getLiveBaseConf: function(args){
            var url = BASE_URL + "/channelManager/live/getLiveBaseConf",
            successCallback = function(res){
                if (res)
                    this.trigger("get.liveBaseConf.success", res);
                else
                    this.trigger("get.liveBaseConf.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.liveBaseConf.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

    });

    return LiveUpConnectionCollection;
});