define("liveRefererAntiLeech.model", ['require','exports', 'utility', 'refererAntiLeech.model'], 
    function(require, exports, Utility, RefererAntiLeechCollection) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveRefererAntiLeechCollection = RefererAntiLeechCollection.extend({
        
        model: Model,

        getReferSafetyChainList: function(args){
            var url = BASE_URL + "/channelManager/safety/getReferSafetyChainList",
            successCallback = function(res){
                if (res)
                    this.trigger("get.refer.success", res);
                else
                    this.trigger("get.refer.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.refer.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return LiveRefererAntiLeechCollection;
});