define("ipBlackWhiteList.model", ['require','exports', 'utility'], function(require, exports, Utility) {
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
            if (type === 1) typeName = "IP：白名单<br>";
            if (type === 2) typeName = "IP：黑名单<br>";

            var summary = typeName + "控制动作：禁止<br>"
            this.set("summary", summary)
        }
    });

    var IpBlackWhiteListCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getIPSafetyChainList: function(args){
           var url = BASE_URL + "/channelManager/safety/getIPSafetyChainList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.IPSafetyChainList.success");
                } else {
                    this.trigger("get.IPSafetyChainList.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.IPSafetyChainList.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        setIPSafetyChain: function(args){
            var url = BASE_URL + "/channelManager/safety/setIPSafetyChain",
            successCallback = function(res){
                this.trigger("set.IPSafetyChain.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.IPSafetyChain.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return IpBlackWhiteListCollection;
});