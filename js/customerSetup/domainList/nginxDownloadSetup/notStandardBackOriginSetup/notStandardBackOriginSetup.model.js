define("notStandardBackOriginSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var BackOriginSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setBackSourceConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/download/setBackSourceConfig";
            Utility.postAjax(url, args, function(res){
                this.trigger("set.backSourceConfig.success");
            }.bind(this),function(res){
                this.trigger("set.backSourceConfig.error", res);
            }.bind(this));
        },

        setEdgeOpenFlag: function(args){
            var url = BASE_URL + "/channelManager/domain/download/setEdgeOpenFlag";
            Utility.getAjax(url, args, function(res){
                this.trigger("set.edgeOpen.success", res);
            }.bind(this),function(res){
                this.trigger("set.edgeOpen.error", res);
            }.bind(this));
        },

        getBackSourceConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/download/getBackSourceConfig";
            Utility.getAjax(url, args, function(res){
                this.trigger("get.backSourceConfig.success", res);
            }.bind(this),function(res){
                this.trigger("get.backSourceConfig.error", res);
            }.bind(this));
        },

        setHostHeaderConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/setHostHeaderConfig";
            Utility.getAjax(url, args, function(res){
                this.trigger("set.hostConfig.success");
            }.bind(this),function(res){
                this.trigger("set.hostConfig.error", res);
            }.bind(this));
        },

        setRangeConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/download/setRangeConfig";
            Utility.postAjax(url, args, function(res){
                this.trigger("set.rangeConfig.success");
            }.bind(this),function(res){
                this.trigger("set.rangeConfig.error", res);
            }.bind(this));
        },

        setOriginProtocol: function(args){
            var url = BASE_URL + "/channelManager/domain/download/setOriginProtocol";
            Utility.postAjax(url, args, function(res){
                this.trigger("set.originProtocol.success");
            }.bind(this),function(res){
                this.trigger("set.originProtocol.error", res);
            }.bind(this));
        },
    });

    return BackOriginSetupCollection;
});