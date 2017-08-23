define("luaAdvanceConfigCacheSetupCacheTime.model", ['require','exports', 'utility', "luaCacheRule.model"], function(require, exports, Utility, LuaCacheRuleModel) {

    var LuaAdvanceConfigCacheSetupCacheTimeCollection = LuaCacheRuleModel.extend({
        initialize: function(){
        
        },

        delCachePolicy: function(args){
            var url = BASE_URL + "/channelManager/cache/delCachePolicy",
            successCallback = function(res){
                this.trigger("set.delCachePolicy.success");
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.delCachePolicy.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }        
    });

    return LuaAdvanceConfigCacheSetupCacheTimeCollection;
});