define("forceRedirect.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var ForceRedirectCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setFollowing: function(args){
            var url = BASE_URL + "/channelManager/domain/download/setFollowing";
            Utility.getAjax(url, args, function(res){
                this.trigger("set.following.success");
            }.bind(this),function(res){
                this.trigger("set.following.error", res);
            }.bind(this));
        },
    });

    return ForceRedirectCollection;
});