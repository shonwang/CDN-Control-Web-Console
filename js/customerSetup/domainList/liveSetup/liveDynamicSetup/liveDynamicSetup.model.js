define("liveDynamicSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var liveDynamicSetup = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){}
    });

    return liveDynamicSetup;
});