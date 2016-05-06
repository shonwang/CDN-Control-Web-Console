define("statisticsManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
        }
    });

    var StatisticsManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getAllClient: function(args){
            var url = BASE_URL + "/rs/channel/getAllClient",
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

        getBandInfo: function(args){
            var url = BASE_URL + "/rs/channel/bandInfo",
            successCallback = function(res){
                if (res)
                    this.trigger("get.bandInfo.success", res);
                else
                    this.trigger("get.bandInfo.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.bandInfo.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getDomain: function(args){
            var url = BASE_URL + "/rs/channel/getDomain",
            successCallback = function(res){
                if (res)
                    this.trigger("get.domain.success", res);
                else
                    this.trigger("get.domain.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.domain.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return StatisticsManageCollection;
});