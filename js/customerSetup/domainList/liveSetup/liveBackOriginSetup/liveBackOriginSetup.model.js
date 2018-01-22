define("liveBackOriginSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveBackOriginSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setBackSourceConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/setBackSourceConfig";
            Utility.postAjax(url, args, function(res){
                this.trigger("set.backSourceConfig.success");
            }.bind(this),function(res){
                this.trigger("set.backSourceConfig.error", res);
            }.bind(this));
        },

        setHostHeaderConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/setHostHeaderConfig";
            Utility.getAjax(url, args, function(res){
                this.trigger("set.hostConfig.success");
            }.bind(this),function(res){
                this.trigger("set.hostConfig.error", res);
            }.bind(this));
        },

        getBackSourceConfig:function(args){
            var url = BASE_URL + "/channelManager/backSource/live/getBackSourceConfig",
            successCallback = function(res){
                if(res){
                   this.trigger('get.backSource.success',res);
                }else{
                   this.trigger('get.backSource.error',res)
                }      
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.backSource.error',response)
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        saveBackSourceConfig:function(args){
            var url = BASE_URL + "/channelManager/backSource/live/setBackSourceConfig",
            successCallback = function(res){
                this.trigger('save.backSource.success',res);    
            }.bind(this),
            errorCallback = function(response){
                this.trigger('save.backSource.error',response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return LiveBackOriginSetupCollection;
});