define("businessManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
        }
    });

    var BusinessManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
    });

    return BusinessManageCollection;
});