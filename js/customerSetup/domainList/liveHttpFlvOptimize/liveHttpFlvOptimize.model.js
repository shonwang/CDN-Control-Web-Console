define("liveHttpFlvOptimize.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var LiveHttpFlvOptimizeCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setChargingOpen: function(args){
            var url = BASE_URL + "/channelManager/domain/setChargingOpen";
            Utility.getAjax(url, args, function(res){
                this.trigger("set.chargingOpen.success");
            }.bind(this),function(res){
                this.trigger("set.chargingOpen.error", res);
            }.bind(this));
        },
    });

    return LiveHttpFlvOptimizeCollection;
});