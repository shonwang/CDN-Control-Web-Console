define("liveFrequencyLog.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveFrequencyLogCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setLogConf: function(args){
            var url = BASE_URL + "/channelManager/live/setLogConf";
            Utility.getAjax(url, args, function(res){
                this.trigger("set.setLogConf.success");
            }.bind(this),function(res){
                this.trigger("set.setLogConf.error", res);
            }.bind(this));
        },
    });

    return LiveFrequencyLogCollection;
});