define("commonCache.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var CommonCacheCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getCacheRulesList:function(args){
            var _data = {
                host:args.host,
                uri:args.uri,
                start:args.start,
                total:args.total
            };
            var url = BASE_URL + "/rs/common/cache/getCacheRulesList",
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.getAjax(url, _data, successCallback, errorCallback);
        },

        getIpWhiteList:function(args){
            var _data = {
                host:args.host,
                uri:args.uri,
                start:args.start,
                total:args.total
            };
            var url = BASE_URL + "/rs/common/cache/getIpWhiteList",
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.getAjax(url, _data, successCallback, errorCallback);
        },

        getClearRulesList:function(args){
            var _data = {
                host:args.host,
                uri:args.uri,
                start:args.start,
                total:args.total
            };
            var url = BASE_URL + "/rs/common/cache/getClearRulesList",
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.getAjax(url, _data, successCallback, errorCallback);
        },

        addCacheRule:function(args){
            var _data = {
                host:args.host,
                uri:args.uri,
                args:args.args,
                method:args.method,
                body:args.body,
                expire:args.expire,
                offline:args.offline
            };
            var url = BASE_URL + "/rs/common/cache/addCacheRule",
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.postAjax(url, _data, successCallback, errorCallback);            
        },

        modifyCacheRule:function(args){
            var _data = {
                id:args.id,
                host:args.host,
                uri:args.uri,
                args:args.args,
                method:args.method,
                body:args.body,
                expire:args.expire,
                offline:args.offline
            };
            var url = BASE_URL + "/rs/common/cache/modifyCacheRule",
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.postAjax(url, _data, successCallback, errorCallback);            
        },

        addIpWhiteRule:function(args){
            var _data = {
                host:args.host,
                uri:args.uri,
                containCdnDevice:args.containCdnDevice,
                ipList:args.ipList                
            };
            var url = BASE_URL + "/rs/common/cache/addIpWhiteRule",
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.postAjax(url, _data, successCallback, errorCallback);  
        },

        modifyIpWhiteRule:function(args){
            var _data = {
                id:args.id,
                host:args.host,
                uri:args.uri,
                args:args.containCdnDevice,
                ipList:args.ipList
            };
            var url = BASE_URL + "/rs/common/cache/modifyIpWhiteRule",
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.postAjax(url, _data, successCallback, errorCallback);            
        },

        addClearRule:function(args){
            var _data = {
                host:args.host,
                uri:args.uri,
                method:args.method,
                rel_key:args.rel_key                
            };
            var url = BASE_URL + "/rs/common/cache/addClearRule",
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.postAjax(url, _data, successCallback, errorCallback);  
        },

        modifyClearRule:function(args){
            var _data = {
                id:args.id,
                host:args.host,
                uri:args.uri,
                method:args.method,
                rel_key:args.rel_key
            };
            var url = BASE_URL + "/rs/common/cache/modifyClearRule",
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.postAjax(url, _data, successCallback, errorCallback);            
        },

        removeCacheRule:function(args){
            var url = BASE_URL + "/rs/common/cache/removeCacheRule?ruleId="+args.id,
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.deleteAjax(url, null, successCallback, errorCallback);
        }, 

        removeIpWhiteRule:function(args){
            var url = BASE_URL + "/rs/common/cache/removeIpWhiteRule?ruleId="+args.id,
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.deleteAjax(url, null, successCallback, errorCallback);
        }, 

        removeClearRule:function(args){
            var url = BASE_URL + "/rs/common/cache/removeClearRule?ruleId="+args.id,
                successCallback = function(res) {
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.deleteAjax(url, null, successCallback, errorCallback);
        }   

    });

    return CommonCacheCollection;
});