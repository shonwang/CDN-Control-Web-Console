define("liveH265Setup.model", ['require','exports', 'utility', 'liveBusOptimize.model'], function(require, exports, Utility, LiveBusOptimizeCollection) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveH265SetupCollection = LiveBusOptimizeCollection.extend({
        
        model: Model,

        initialize: function(){},
    });

    return LiveH265SetupCollection;
});