define("luaRefererAntiLeech.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var matchingType = this.get('matchingType');
            if (matchingType === 0) this.set("matchingTypeName", "文件类型");
            if (matchingType === 1) this.set("matchingTypeName", "指定目录");
            if (matchingType === 2) this.set("matchingTypeName", "指定URL");
            if (matchingType === 3) this.set("matchingTypeName", "正则匹配");
            if (matchingType === 4) this.set("matchingTypeName", "url包含指定参数");
            if (matchingType === 9) this.set("matchingTypeName", "全部文件");

            var type = this.get('type'), typeName;
            if (type === 1) typeName = "Referer类型：白名单<br>";
            if (type === 2) typeName = "Referer类型：黑名单<br>";

            var domains = this.get('domains'), domainsName = '';
            if (domains&&type === 1) domainsName = "合法域名：" + domains + "<br>";
            if (domains&&type === 2) domainsName = "非法域名：" + domains + "<br>";

            var nullReferer = this.get('nullReferer'), nullRefererName;
            if (nullReferer === 0) nullRefererName = "是否允许空引用：否<br>";
            if (nullReferer === 1) nullRefererName = "是否允许空引用：是<br>";

            var summary = typeName + domainsName + nullRefererName;
            this.set("summary", summary)
        }
    });

    var RefererAntiLeechCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getReferSafetyChainList: function(args){
            var url = BASE_URL + "/channelManager/safety/getReferSafetyChainList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.refer.success");
                } else {
                    this.trigger("get.refer.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.refer.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setReferSafetyChains: function(args){
            var url = BASE_URL + "/channelManager/safety/setReferSafetyChains",
            successCallback = function(res){
                this.trigger("set.refer.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.refer.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return RefererAntiLeechCollection;
});