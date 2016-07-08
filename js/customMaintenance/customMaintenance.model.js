define("customMaintenance.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var CustomMaintenanceCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){}
    });

    return CustomMaintenanceCollection;
});