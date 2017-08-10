define("luaAdvanceConfigCacheSetupDelMark.model", ['require','exports', 'utility', "luaDelMarkCache.model"], function(require, exports, Utility, LuaDelMarkCacheModel) {

    var LuaAdvanceConfigCacheSetupDelMarkCollection = LuaDelMarkCacheModel.extend({
        initialize: function(){
        
        },

        delCacheQuestionMark: function(args){
            var url = BASE_URL + "/channelManager/cache/delCacheQuestionMark",
            successCallback = function(res){
                this.trigger("set.delCacheQuestionMark.success");
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.delCacheQuestionMark.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }   
    });

    return LuaAdvanceConfigCacheSetupDelMarkCollection;
});