define("preheatManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var PreheatManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){}
    });

    return PreheatManageCollection;
});