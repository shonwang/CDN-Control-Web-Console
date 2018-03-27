define("forceRedirect.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var ForceRedirectCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setHttpsForceJump: function(args){
            var url = BASE_URL + "/channelManager/domain/https/setHttpsForceJump";
            Utility.postAjax(url, args, function(res){
                this.trigger("set.forceRedirect.success");
            }.bind(this),function(res){
                this.trigger("set.forceRedirect.error", res);
            }.bind(this));
        },

        getHttpsForceJump: function(args){
            var url = BASE_URL + "/channelManager/domain/https/getHttpsForceJump";
            Utility.getAjax(url, args, function(res){
                this.trigger("get.forceRedirect.success");
            }.bind(this),function(res){
                this.trigger("get.forceRedirect.error", res);
            }.bind(this));
        }
    });

    return ForceRedirectCollection;
});