define("liveTimestamp.model", ['require','exports', 'utility', 'timestamp.model'], function(require, exports, Utility, TimestampCollection) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveTimestampCollection = TimestampCollection.extend({

    });

    return LiveTimestampCollection;
});