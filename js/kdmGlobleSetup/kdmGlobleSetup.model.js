define("kdmGlobleSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            this.set("id", Utility.randomStr(16));
            this.set("isChecked", false);
        }
    });

    var KdmGlobleSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getClientMessage: function(args){
            var url = BASE_URL + "/rs/evaluation/getClientMessage",
            successCallback = function(res){
                if (res)
                    this.trigger("get.client.success", res);
                else
                    this.trigger("get.client.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.client.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getHistoryList: function(args){
            var url = BASE_URL + "/rs/evaluation/getList",
            successCallback = function(res){
                if (res)
                    this.trigger("get.history.success", res);
                else
                    this.trigger("get.history.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.history.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        selectRegionList: function(args){
            var url = BASE_URL + "/rs/region/selectRegionList",
            successCallback = function(res){
                if (res)
                    this.trigger("get.region.success", res);
                else
                    this.trigger("get.region.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.region.error", response); 
            }.bind(this);

            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getCnameList: function(args){
            var url = BASE_URL + "/rs/evaluation/getCnameList",
            successCallback = function(res){
                if (res)
                    this.trigger("get.cname.success", res);
                else
                    this.trigger("get.cname.error");
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.cname.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getEvaluationFlag: function(args){
            var url = BASE_URL + "/rs/advice/getEvaluationFlag",
            successCallback = function(res){
                this.trigger("get.evaluationFlag.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.evaluationFlag.error", response); 
            }.bind(this);

            Utility.postAjax(url, args, successCallback, errorCallback, null, "text");
        }
    });

    return KdmGlobleSetupCollection;
});