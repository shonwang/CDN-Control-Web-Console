define("coverManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
        }
    });

    var CoverManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
    });

    return CoverManageCollection;
});