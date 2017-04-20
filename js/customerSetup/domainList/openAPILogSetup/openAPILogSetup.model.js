define("openAPILogSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var OpenAPILogSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getLogSetup: function(args){
            var url = BASE_URL + "/2017-4-1/log/setting/query";
            Utility.getAjax(url, args, function(res){
                this.trigger("get.logSetup.success", res);
            }.bind(this),function(res){
                this.trigger("get.logSetup.error", res);
            }.bind(this));
        },

        setLogSetup: function(args){
            var url = BASE_URL + "/2017-4-1/log/setting/set";
            Utility.postAjax(url, args, function(res){
                this.trigger("set.logSetup.success", res);
            }.bind(this),function(res){
                this.trigger("set.logSetup.error", res);
            }.bind(this));
        },

        getAPITemplateInfo: function(args){
            var url = BASE_URL + "/2017-4-1/log/initialparams/query";
            Utility.getAjax(url, args, function(res){
                this.trigger("get.templateInfo.success", res);
            }.bind(this),function(res){
                this.trigger("get.templateInfo.error", res);
            }.bind(this));
        }
    });

    return OpenAPILogSetupCollection;
});