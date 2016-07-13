define("clientStatistics.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
        }
    });

    var ClientStatisticsCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getDomainBandInfo: function(args){
            var url = BASE_URL + "/rs/channel/domainBandInfo",
            successCallback = function(res){
                if (res)
                    this.trigger("get.domainBand.success", res);
                else
                    this.trigger("get.domainBand.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.domainBand.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback, 300000);
        }
    });

    return ClientStatisticsCollection;
});