define("httpHeaderOpt.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var type = this.get('matchingType');
            if (type === 0) this.set("typeName", "文件类型");
            if (type === 1) this.set("typeName", "指定目录");
            if (type === 2) this.set("typeName", "指定URL");
            if (type === 3) this.set("typeName", "正则匹配");
            if (type === 4) this.set("typeName", "url包含指定参数");
            if (type === 9) this.set("typeName", "全部文件");

            var directionType = this.get("directionType"), directionTypeName;
            if (directionType === 1) directionTypeName = "方向：客户端到CDN支持<br>";
            if (directionType === 2) directionTypeName = "方向：CDN到源站支持<br>";
            if (directionType === 3) directionTypeName = "方向：源到CDN支持<br>";
            if (directionType === 4) directionTypeName = "方向：CDN到客户端<br>";

            var actionType = this.get("actionType"), actionTypeName;
            if (actionType === 1) actionTypeName = "动作：增加<br>";
            if (actionType === 2) actionTypeName = "动作：修改<br>";
            if (actionType === 3) actionTypeName = "动作：隐藏<br>";

            var headerKey = this.get("headerKey");
            if (headerKey) var headerKeyName = "参数: " + headerKey + "<br>";

            var headerValue = this.get("headerValue");
            if (headerValue) var headerValueName = "值: " + headerValue + "<br>";

            var summary = directionTypeName + actionTypeName + headerKeyName + headerValueName;
            this.set("summary", summary)
        }
    });

    var HttpHeaderOptCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getHeaderList: function(args){
            var url = BASE_URL + "/channelManager/httpHeader/getHeaderList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.header.success");
                } else {
                    this.trigger("get.header.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.header.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setHttpHeader: function(args){
            var url = BASE_URL + "/channelManager/httpHeader/setHttpHeader",
            successCallback = function(res){
                this.trigger("set.header.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.header.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return HttpHeaderOptCollection;
});