define("liveHttpFlvOptimize.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveHttpFlvOptimizeCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getPKConf: function(args){
            var url = BASE_URL + "/channelManager/live/getPKConf",
            successCallback = function(res){
                if (res)
                    this.trigger("get.pkConfig.success", res);
                else
                    this.trigger("get.pkConfig.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.pkConfig.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setPKConf: function(args){
            var url = BASE_URL + "/channelManager/live/setPKConf";
            Utility.postAjax(url, args, function(res){
                this.trigger("set.pkConfig.success");
            }.bind(this),function(res){
                this.trigger("set.pkConfig.error", res);
            }.bind(this));
        },
    });

    return LiveHttpFlvOptimizeCollection;
});