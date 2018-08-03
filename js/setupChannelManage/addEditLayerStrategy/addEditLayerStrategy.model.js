define("addEditLayerStrategy.model", ['require','exports', 'utility', 'setupTopoManage.model'], 
    function(require, exports, Utility, SetupTopoManageCollection) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var AddEditLayerStrategyCollection = SetupTopoManageCollection.extend({
        
        model: Model,

        initialize: function(){},

        

    });

    return AddEditLayerStrategyCollection;
});