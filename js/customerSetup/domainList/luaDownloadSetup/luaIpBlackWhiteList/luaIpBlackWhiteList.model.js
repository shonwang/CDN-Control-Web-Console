define("luaIpBlackWhiteList.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
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