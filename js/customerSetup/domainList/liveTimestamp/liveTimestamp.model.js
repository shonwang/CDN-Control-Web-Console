define("liveTimestamp.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var type = this.get('matchingType');
            if (type === 0) this.set("typeName", "文件类型");
            if (type === 1) this.set("typeName", "指定目录");
            if (type === 2) this.set("typeName", "指定URL");
            if (type === 3) this.set("typeName", "正则匹配");
            if (type === 4) this.set("typeName", "url包含指定参数");
            if (type === 9) this.set("typeName", "全部文件");

            var confType = this.get("confType"), confTypeName;
            if (confType === 0) confTypeName = "配置类型：标准配置<br>";//0:标准配置 1:高级配置
            if (confType === 1) confTypeName = "配置类型：高级配置<br>";

            var protectionType = this.get("protectionType"), protectionTypeName;
            if (protectionType === 1 && confType === 0) protectionTypeName = "防盗链格式：TypeA<br>";
            if (protectionType === 2 && confType === 0) protectionTypeName = "防盗链格式：TypeB<br>";
            if (protectionType === 3 && confType === 0) protectionTypeName = "防盗链格式：TypeC<br>";
            if (protectionType === 1 && confType === 1) protectionTypeName = "加密URL形式：形式1：加密字符串在参数中<br>";
            if (protectionType === 2 && confType === 1) protectionTypeName = "加密URL形式：形式2：加密字符串在路径中<br>";
            if (protectionType === 3 && confType === 1) protectionTypeName = "加密URL形式：形式2：加密字符串在路径中<br>";

            var authKeyList = this.get("authKeyList"), authKeyListName;
            authKeyListName = "共享秘钥：1主，" + (authKeyList.length - 1) + "备<br>";

            var expirationTime = this.get("expirationTime"), expirationTimeName;
            if (expirationTime === 0) expirationTimeName = "失效时间：时间戳时间<br>";
            if (expirationTime !== 0) expirationTimeName = "失效时间：时间戳时间+过期时间：" + expirationTime + "秒<br>";

            var summary = confTypeName + protectionTypeName + authKeyListName + expirationTimeName;
            this.set("summary", summary)
        }
    });

    var LiveTimestampCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getStandardProtection: function(args){
            var url = BASE_URL + "/channelManager/safety/getStandardProtection",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.protection.success");
                } else {
                    this.trigger("get.protection.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.protection.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setStandardProtection: function(args){
            var url = BASE_URL + "/channelManager/safety/setStandardProtection",
            successCallback = function(res){
                this.trigger("set.protection.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.protection.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return LiveTimestampCollection;
});