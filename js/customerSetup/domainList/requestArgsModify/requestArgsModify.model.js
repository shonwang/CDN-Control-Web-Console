define("requestArgsModify.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var RequestArgsModifyCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getUrlParameter: function(args){
            var url = BASE_URL + "/channelManager/urlParameter/getUrlParameter",
            successCallback = function(res){
                this.trigger("get.parameter.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.parameter.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setUrlParameter: function(args){
            var url = BASE_URL + "/channelManager/urlParameter/setUrlParameter",
            successCallback = function(res){
                this.trigger("set.parameter.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.parameter.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return RequestArgsModifyCollection;
});