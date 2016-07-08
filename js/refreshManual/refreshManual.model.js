define("refreshManual.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var RefreshManualCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){}
    });

    return RefreshManualCollection;
});