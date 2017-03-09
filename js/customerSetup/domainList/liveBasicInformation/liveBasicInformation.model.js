define("liveBasicInformation.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveBasicInformationCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        modifyDomainBasic:function(args){
            var url = BASE_URL + "/channelManager/domain/modifyDomainBasic",
            successCallback = function(res){
                this.trigger('modify.DomainBasic.success',res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger('modify.DomainBasic.error',response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return LiveBasicInformationCollection;
});