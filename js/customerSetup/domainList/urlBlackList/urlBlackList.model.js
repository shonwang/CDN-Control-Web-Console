define("urlBlackList.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var urlBlackListCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
    });

    return urlBlackListCollection;
});