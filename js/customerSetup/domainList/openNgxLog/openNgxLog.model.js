define("openNgxLog.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var OpenNgxLogCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setChargingOpen: function(args){
            var url = BASE_URL + "/channelManager/domain/setChargingOpen";
            var url = "http://192.168.158.91:8090/channelManager/domain/setChargingOpen";
            Utility.getAjax(url, args, function(res){
                if(res == 1){
                    this.trigger("set.chargingOpen.success");
                } else {
                    this.trigger("set.chargingOpen.error");
                }
            }.bind(this),function(res){
                this.trigger("set.chargingOpen.error", res);
            }.bind(this));
        },
    });

    return OpenNgxLogCollection;
});