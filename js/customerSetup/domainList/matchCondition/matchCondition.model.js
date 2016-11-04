define("matchCondition.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var MatchConditionCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getFileType: function(args){
            var url = BASE_URL + "/channelManager/cache/getFileType";
            Utility.getAjax(url, args, function(res){
                if(res)
                    this.trigger("get.fileType.success", res);
                else
                    this.trigger("get.fileType.error");
            }.bind(this),function(res){
                this.trigger("get.fileType.error", res);
            }.bind(this));
        },
    });

    return MatchConditionCollection;
});