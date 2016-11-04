define("saveThenSend.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var SaveThenSendCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        publishConfig: function(args){
            var url = BASE_URL + "/channelManager/configuration/publish",
            successCallback = function(res){
                if (res){
                    this.trigger("get.send.success");
                } else {
                    this.trigger("get.send.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.send.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
    });

    return SaveThenSendCollection;
});