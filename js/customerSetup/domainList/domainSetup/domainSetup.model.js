define("domainSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var DomainSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        modifyDomainBasic: function(args){
            var url = BASE_URL + "/channelManager/domain/modifyDomainBasic";
            Utility.postAjax(url, args, function(res){
                this.trigger("modify.domain.success");
            }.bind(this),function(res){
                this.trigger("modify.domain.error", res);
            }.bind(this));
        },
    });

    return DomainSetupCollection;
});