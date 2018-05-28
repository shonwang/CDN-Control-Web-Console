define("luaXtcpSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LuaXtcpSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){
            
        },

        
    });

    return LuaXtcpSetupCollection;
});