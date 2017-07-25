define("liveBackOriginSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveBackOriginSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setBackSourceConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/setBackSourceConfig";
            Utility.postAjax(url, args, function(res){
                this.trigger("set.backSourceConfig.success");
            }.bind(this),function(res){
                this.trigger("set.backSourceConfig.error", res);
            }.bind(this));
        },

        setHostHeaderConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/setHostHeaderConfig";
            Utility.getAjax(url, args, function(res){
                this.trigger("set.hostConfig.success");
            }.bind(this),function(res){
                this.trigger("set.hostConfig.error", res);
            }.bind(this));
        },
    });

    return LiveBackOriginSetupCollection;
});