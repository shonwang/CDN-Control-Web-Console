define("liveCnameSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveCnameSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        modifyDomainCname: function(args){
            var url = BASE_URL + "/channelManager/domain/modifyDomainCname";
            Utility.postAjax(url, args, function(res){
                this.trigger("modify.cname.success");
            }.bind(this),function(res){
                this.trigger("modify.cname.error", res);
            }.bind(this));
        },
    });

    return LiveCnameSetupCollection;
});