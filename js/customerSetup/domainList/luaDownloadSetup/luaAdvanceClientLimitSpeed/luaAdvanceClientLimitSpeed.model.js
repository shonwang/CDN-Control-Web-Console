define("luaAdvanceClientLimitSpeed.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var ClientLimitSpeedCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getClientSpeed: function(args){
            var url = BASE_URL + "/channelManager/clientSpeed/getClientSpeed",
            successCallback = function(res){
                this.trigger("get.speed.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.speed.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setClientSpeedBatch: function(args){
            var url = BASE_URL + "/channelManager/clientSpeed/setClientSpeedBatch",
            successCallback = function(res){
                this.trigger("set.speed.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.speed.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return ClientLimitSpeedCollection;
});