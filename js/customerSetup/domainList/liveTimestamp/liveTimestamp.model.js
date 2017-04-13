define("liveTimestamp.model", ['require','exports', 'utility', 'timestamp.model'], function(require, exports, Utility, TimestampCollection) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveTimestampCollection = TimestampCollection.extend({
        getStandardProtection: function(args){
            var url = BASE_URL + "/channelManager/safety/getStandardProtection",
            successCallback = function(res){
                if (res)
                    this.trigger("get.protection.success", res);
                else
                    this.trigger("get.protection.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.protection.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
    });

    return LiveTimestampCollection;
});