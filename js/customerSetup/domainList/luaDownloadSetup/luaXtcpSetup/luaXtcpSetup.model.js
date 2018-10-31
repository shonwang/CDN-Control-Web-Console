define("luaXtcpSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LuaXtcpSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getXtcpSetupInfo: function(args){
            var url = BASE_URL + "/channelManager/domain/getXTCP?originId=" + args.originId
            successCallback = function(res){
                this.trigger("get.xtcp.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.xtcp.error", response)
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        postXtcpSetupInfo: function(args){
            var url = BASE_URL + "/channelManager/domain/setXTCP",
            successCallback = function(res){
                this.trigger("set.xtcp.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.xtcp.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
        
    });

    return LuaXtcpSetupCollection;
});