define("httpHeaderCtr.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var HttpHeaderCtrCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setHttpHeaderControl: function(args){
            var url = BASE_URL + "/channelManager/httpHeader/setHttpHeaderControl",
            successCallback = function(res){
                if (res)
                    this.trigger("set.headerCtr.success", res)
                else
                    this.trigger("set.headerCtr.error", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.headerCtr.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return HttpHeaderCtrCollection;
});