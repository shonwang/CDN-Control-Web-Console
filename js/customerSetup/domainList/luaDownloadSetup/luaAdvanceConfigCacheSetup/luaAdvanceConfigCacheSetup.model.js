define("luaAdvanceConfigCacheSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LuaAdvanceConfigCacheSetupCollection = Backbone.Collection.extend({
        model: Model,

        initialize: function(){
        
        }
    });

    return LuaAdvanceConfigCacheSetupCollection;
});