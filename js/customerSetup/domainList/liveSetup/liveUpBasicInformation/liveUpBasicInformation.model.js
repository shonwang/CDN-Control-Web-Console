define("liveUpBasicInformation.model", ['require', 'exports', 'utility', 'basicInformation.model'],
    function(require, exports, Utility, BasicInformationCollection) {
        var Model = Backbone.Model.extend({
            initialize: function() {}
        });

        var LiveUpBasicInformationCollection = BasicInformationCollection.extend({

            model: Model,

            initialize: function() {},
        });

        return LiveUpBasicInformationCollection;
    });