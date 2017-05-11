define("liveUpFlowNameChange.model", ['require', 'exports', 'utility', 'basicInformation.model'],
    function(require, exports, Utility, BasicInformationCollection) {
        var Model = Backbone.Model.extend({
            initialize: function() {}
        });

        var LiveUpFlowNameChangeCollection = BasicInformationCollection.extend({

            model: Model,

            initialize: function() {},
        });

        return LiveUpFlowNameChangeCollection;
    });