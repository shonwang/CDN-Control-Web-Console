define("liveSLAStatistics.model", ['require','exports', 'utility', 'liveFrequencyLog.model'], function(require, exports, Utility, LiveFrequencyLogCollection) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveSLAStatisticsCollection = LiveFrequencyLogCollection.extend({
        
        model: Model,

        initialize: function(){},
    });

    return LiveSLAStatisticsCollection;
});