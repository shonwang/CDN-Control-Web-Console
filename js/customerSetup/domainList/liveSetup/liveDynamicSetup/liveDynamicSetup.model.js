define("liveDynamicSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var liveDynamicSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getModuleDynamicConfig:function(args){
        	var url=BASE_URL+"/channelManager/live/domain/getModuleDynamicConfig",
            successCallback = function(res){
                if (res){
                    this.trigger("get.moduleDyConfig.success", res);
                } else {
                    this.trigger("get.moduleDyConfig.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.moduleDyConfig.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        saveModuleDynamicConfig:function(args){
        	var url=BASE_URL+"/channelManager/live/domain/saveModuleDynamicConfig",
            successCallback = function(res){
                this.trigger("save.moduleDyConfig.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("save.moduleDyConfig.error", response);  
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        deleteModuleDynamicConfig:function(args){
        	var url=BASE_URL+"/channelManager/live/domain/deleteModuleDynamicConfig",
            successCallback = function(res){
                if (res)
                    this.trigger("delete.moduleDyConfig.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("delete.moduleDyConfig.error", response);  
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return liveDynamicSetupCollection;
});