define("commonCache.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var CommonCacheCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getCacheRulesList:function(args){
            var _data = {
                start:args.start,
                total:args.total
            };
            var url = BASE_URL + "/rs/common/cache/getCacheRulesList",
                successCallback = function(res) {
                    console.log(res);
                    console.log(args.success);
                    args.success && args.success(res);
                }.bind(this),
                errorCallback = function(res) {
                    args.error && args.error(res);
                }.bind(this);
            Utility.getAjax(url, _data, successCallback, errorCallback);
        },

        getIpWhiteList:function(args){
            var _data = {
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

        queryChannel: function(args) {
            var url = BASE_URL + "/channelManager/domain/getOriginDomain",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        this.push(new Model(res));
                        this.trigger("get.channel.success");
                    } else {
                        this.trigger("get.channel.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.channel.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return CommonCacheCollection;
});