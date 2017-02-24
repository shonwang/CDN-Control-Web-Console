define("liveAudioOnly.model", ['require','exports', 'utility', 'liveBusOptimize.model'], function(require, exports, Utility, LiveBusOptimizeCollection) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveAudioOnlyCollection = LiveBusOptimizeCollection.extend({
        
        model: Model,

        initialize: function(){},
    });

    return LiveAudioOnlyCollection;
});