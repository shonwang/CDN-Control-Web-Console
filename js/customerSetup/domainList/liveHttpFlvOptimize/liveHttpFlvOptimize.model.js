define("liveHttpFlvOptimize.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveHttpFlvOptimizeCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setPKConf: function(args){
            var url = BASE_URL + "/channelManager/live/setPKConf";
            Utility.getAjax(url, args, function(res){
                this.trigger("set.setPKConf.success");
            }.bind(this),function(res){
                this.trigger("set.setPKConf.error", res);
            }.bind(this));
        },
    });

    return LiveHttpFlvOptimizeCollection;
});