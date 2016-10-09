define("domainSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var DomainSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        modifyDomainBasic: function(args){
            var url = BASE_URL + "domainbase/add";
            var url = "http://192.168.158.91:8090/channelManager/domain/modifyDomainBasic";
            Utility.postAjax(url, args, function(res){
                if(res == 1){
                    this.trigger("modify.domain.success");
                } else {
                    this.trigger("modify.domain.error");
                }
            }.bind(this),function(res){
                this.trigger("modify.domain.error", res);
            }.bind(this));
        },
    });

    return DomainSetupCollection;
});