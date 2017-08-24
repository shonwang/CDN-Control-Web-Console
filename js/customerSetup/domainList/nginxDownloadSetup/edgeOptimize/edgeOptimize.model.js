define("edgeOptimize.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var EdgeOptimizeCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setEdgeIpCount: function(args){
            var url = BASE_URL + "/channelManager/domain/download/setEdgeIpCount";
            Utility.getAjax(url, args, function(res){
                this.trigger("set.edgeIpCount.success");
            }.bind(this),function(res){
                this.trigger("set.edgeIpCount.error", res);
            }.bind(this));
        },
    });

    return EdgeOptimizeCollection;
});