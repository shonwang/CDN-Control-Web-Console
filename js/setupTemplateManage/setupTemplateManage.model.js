define("setupTemplateManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var SetupTemplateManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        saveFrameTemplate:function(args){
            var url=BASE_URL+"/cg/live/frame/saveFrameTemplate",
            successCallback = function(res){
                if (res){
                    this.trigger("save.frameTemplate.success", res);
                } else {
                    this.trigger("save.frameTemplate.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("save.frameTemplate.error", response);  
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

    });

    return SetupTemplateManageCollection;
});