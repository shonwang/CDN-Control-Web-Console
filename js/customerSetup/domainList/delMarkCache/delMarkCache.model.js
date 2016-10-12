define("delMarkCache.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            //0文件后缀，1目录，2具体url,3正则预留,4url包含指定参数9全局默认缓存配置项
            var type = this.get('matchingType');
            if (type === 0) this.set("typeName", "文件类型");
            if (type === 1) this.set("typeName", "指定目录");
            if (type === 2) this.set("typeName", "指定URL");
            if (type === 3) this.set("typeName", "正则匹配");
            if (type === 4) this.set("typeName", "url包含指定参数");
            if (type === 9) this.set("typeName", "全部文件");

            var markType = this.get("markType");
            if (markType === 0) this.set("markTypeName", "是否去问号缓存：否; 指定缓存的参数：" + this.get("markValue"));
            if (markType === 1) this.set("markTypeName", "是否去问号缓存：是");
        }
    });

    var DelMarkCacheCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getCacheQuestionMarkList: function(args){
            var url = BASE_URL + "/channelManager/cache/getCacheQuestionMarkList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.mark.success");
                } else {
                    this.trigger("get.mark.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.mark.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setCacheQuestionMark: function(args){
            var url = BASE_URL + "/channelManager/cache/setCacheQuestionMark",
            successCallback = function(res){
                this.trigger("set.mark.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.mark.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return DelMarkCacheCollection;
});