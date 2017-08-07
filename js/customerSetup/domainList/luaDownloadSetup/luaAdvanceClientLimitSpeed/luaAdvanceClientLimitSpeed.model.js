define("luaAdvanceClientLimitSpeed.model", ['require','exports', 'utility', 'luaClientLimitSpeed.model'], 
    function(require, exports, Utility, LuaClientLimitSpeedModel) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var ClientLimitSpeedCollection = LuaClientLimitSpeedModel.extend({});

    return ClientLimitSpeedCollection;
});