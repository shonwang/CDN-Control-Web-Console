define("setupTemplateManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var SetupTemplateManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
        
        getFrameTemplate:function(args){
            var url=BASE_URL+"/cg/live/frame/getFrameTemplate",
            successCallback = function(res){
                if (res){
                    this.trigger("get.frameTemplate.success", res);
                } else {
                    this.trigger("get.frameTemplate.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.frameTemplate.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        saveFrameTemplate:function(args){
            var url=BASE_URL+"/cg/live/frame/saveFrameTemplate",
            successCallback = function(res){
                this.trigger("save.frameTemplate.success", res);    
            }.bind(this),
            errorCallback = function(response){
                this.trigger("save.frameTemplate.error", response);  
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

    });

    return SetupTemplateManageCollection;
});