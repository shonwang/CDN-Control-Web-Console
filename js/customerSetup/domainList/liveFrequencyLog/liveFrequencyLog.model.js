define("liveFrequencyLog.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveFrequencyLogCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setLogConf: function(args){
            var url = BASE_URL + "/channelManager/live/setLogConf";
            Utility.postAjax(url, args, function(res){
                this.trigger("set.logConfig.success");
            }.bind(this),function(res){
                this.trigger("set.logConfig.error", res);
            }.bind(this));
        },

        getLogConf: function(args){
            var url = BASE_URL + "/channelManager/live/getLogConf",
            successCallback = function(res){
                if (res)
                    this.trigger("get.logConfig.success", res);
                else
                    this.trigger("get.logConfig.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.logConfig.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

    });

    return LiveFrequencyLogCollection;
});