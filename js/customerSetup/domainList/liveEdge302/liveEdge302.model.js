define("liveEdge302.model", ['require','exports', 'utility', 'liveBusOptimize.model'], function(require, exports, Utility, LiveBusOptimizeCollection) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveEdge302Collection = LiveBusOptimizeCollection.extend({
        
        model: Model,

        initialize: function(){},
    });

    return LiveEdge302Collection;
});