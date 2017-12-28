define("setupModuleManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var SetupModuleManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getListModule:function(args){
            var url=BASE_URL+"/channelManager/live/module/getListModule",
            successCallback = function(res){
                if (res){
                    this.trigger("get.moduleList.success", res);
                } else {
                    this.trigger("get.moduleList.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.moduleList.error", response);  
            }.bind(this);
            Utility.getAjax(url,args, successCallback, errorCallback);
        },

        getModuleInfo:function(args){
            var url=BASE_URL+"/channelManager/live/module/getModuleInfo",
            successCallback = function(res){
                if (res){
                    this.trigger("get.moduleInfo.success", res);
                } else {
                    this.trigger("get.moduleInfo.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.moduleInfo.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        
        saveModuleInfo:function(args){
            var url=BASE_URL+"/channelManager/live/module/saveModuleInfo",
            successCallback = function(res){
                this.trigger("save.moduleInfo.success");
            }.bind(this),
            errorCallback = function(response){
                this.trigger("save.moduleInfo.error", response);  
            }.bind(this);
           Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return SetupModuleManageCollection;
});