define("setupAppManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
        }
    });

    var SetupAppManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
        
        getAppInfo: function(args){
            var url = BASE_URL + "/resource/app/info/list",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this));
                    this.total = res.total;
                    this.trigger("get.app.info.success",res);
                } else {
                    this.trigger("get.app.info.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.app.info.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        getTopoOrigininfo:function(args){
            var url = BASE_URL + "/resource/topo/origin/info?id="+args,
            successCallback = function(res){
                if(res){
                    this.total = res.total;
                    this.trigger("get.topo.OriginInfo.success",res);
                }else{
                    this.trigger("get.topo.OriginInfo.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.topo.OriginInfo.error',response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
        getTemplateinfo:function(args){
            var url = BASE_URL + "/cg/config/template?type="+args,
            successCallback = function(res){
                if (res){
                    this.trigger("get.template.info.success",res);
                } else {
                    this.trigger("get.template.info.error"); 
                } 

            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.template.info.error", response); 
            }.bind(this);
            Utility.getAjax(url, '', successCallback, errorCallback);
        }

    });

    return SetupAppManageCollection;
});