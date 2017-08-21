define("speedMeasure.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var SpeedMeasureCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryChannel: function(args) {
            var url = BASE_URL + "/channelManager/domain/getChannelManager",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res.data, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.total = res.totalCount;
                        this.trigger("get.channel.success");
                    } else {
                        this.trigger("get.channel.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.channel.error", response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return SpeedMeasureCollection;
});