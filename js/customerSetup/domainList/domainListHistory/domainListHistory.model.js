define("domainListHistory.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var DomainListHistoryCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getOperateLog: function(args){
            var url = BASE_URL + "/channelManager/domain/log/getOperateLog";
            Utility.getAjax(url, args, function(res){
                this.trigger("get.log.success", res);
            }.bind(this),function(res){
                this.trigger("get.log.error", res);
            }.bind(this));
        }
    });

    return DomainListHistoryCollection;
});