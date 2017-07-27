define("luaCacheRule.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var hasOriginPolicy = this.get('hasOriginPolicy'),
                expireTime = this.get('expireTime'), summary = '';

            if (expireTime === 0 && hasOriginPolicy === 0) summary = "缓存时间：不缓存";
            if (expireTime !== 0 && hasOriginPolicy === 0) summary = "缓存时间：" + Utility.timeFormat2(expireTime);
            if (expireTime !== 0 && hasOriginPolicy === 1) summary = "使用源站缓存, 若源站无缓存时间，则缓存：" + Utility.timeFormat2(expireTime);
            // if (expireTime !== 0 && hasOriginPolicy === 0) summary = "缓存时间：" + expireTime + "秒";
            // if (expireTime !== 0 && hasOriginPolicy === 1) summary = "使用源站缓存, 若源站无缓存时间，则缓存：" + expireTime + "秒";
            this.set("summary", summary);
        }
    });

    var CacheRuleCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setPolicy: function(args){
            var url = BASE_URL + "/channelManager/cache/setPolicy",
            successCallback = function(res){
                this.trigger("set.policy.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.policy.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getPolicyList: function(args){
            var url = BASE_URL + "/channelManager/cache/getPolicyList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.policy.success");
                } else {
                    this.trigger("get.policy.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.policy.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return CacheRuleCollection;
});