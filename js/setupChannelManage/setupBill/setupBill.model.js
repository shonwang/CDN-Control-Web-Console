define("setupBill.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var SetupBillCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getVersion: function(args){
            var url = BASE_URL + "/channelManager/configuration/getVersionVo",
            successCallback = function(res){
                if (res)
                    this.trigger("get.version.success", res);
                else
                    this.trigger("get.version.error"); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.version.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return SetupBillCollection;
});