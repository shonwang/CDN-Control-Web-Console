define("liveHttpsSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveHttpsSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getDetectInfo:function(args){
            var url = BASE_URL + "/channelManager/detect/getDetectInfo?originId="+args,
            successCallback = function(res){
                this.trigger('get.DetectInfo.success',res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.DetectInfo.error',response)
            }.bind(this);
            Utility.getAjax(url, '', successCallback, errorCallback);
        },
        addDetectInfo:function(args){
            var url = BASE_URL + "/channelManager/detect/setDetectInfo",
            successCallback = function(res){
                this.trigger('add.DetectInfo.success',res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger('add.DetectInfo.error',response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return LiveHttpsSetupCollection;
});