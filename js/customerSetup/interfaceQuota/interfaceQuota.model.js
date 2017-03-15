define("interfaceQuota.model", ['require','exports','utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var InterfaceQuotaCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
	});

    return InterfaceQuotaCollection;
});