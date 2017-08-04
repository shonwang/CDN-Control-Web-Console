define("luaTimestamp.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var TimestampCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getStandardProtection: function(args){
            var url = BASE_URL + "/channelManager/safety/download/getStandardProtection",
            successCallback = function(res){
                this.trigger("get.protection.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.protection.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setStandardProtectionBatch: function(args){
            var url = BASE_URL + "/channelManager/safety/download/setStandardProtectionBatch",
            successCallback = function(res){
                this.trigger("set.protection.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.protection.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return TimestampCollection;
});