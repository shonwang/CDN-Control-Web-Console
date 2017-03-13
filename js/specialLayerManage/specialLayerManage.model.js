define("specialLayerManage.model", ['require','exports', 'utility', 'setupTopoManage.model'], 
    function(require, exports, Utility, SetupTopoManageCollection) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var createTime = this.get('createTime');
            
            createTime = this.set("createTime", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            this.set('checked',false);
        }
    });

    var SpecialLayerManageCollection = SetupTopoManageCollection.extend({
        
        model: Model,

        initialize: function(){},
    });

    return SpecialLayerManageCollection;
});