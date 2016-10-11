define("cnameSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var CnameSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        modifyDomainCname: function(args){
            var url = BASE_URL + "/channelManager/domain/modifyDomainCname";
            Utility.postAjax(url, args, function(res){
                if(res == 1){
                    this.trigger("modify.cname.success");
                } else {
                    this.trigger("modify.cname.error");
                }
            }.bind(this),function(res){
                this.trigger("modify.cname.error", res);
            }.bind(this));
        },
    });

    return CnameSetupCollection;
});