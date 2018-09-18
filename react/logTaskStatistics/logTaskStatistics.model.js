define("logTaskStatistics.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var updateTime = parseInt(this.get("updateTime")),
                createTime = parseInt(this.get("createTime"));
            if (updateTime) this.set("updateTimeFormated", new Date(updateTime).format("yyyy/MM/dd hh:mm"));
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var logTaskListCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        
        getTaskStatistics: function(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/task/statistics",
                successCallback = function(res) {
                    this.trigger("statistics.task.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('statistics.task.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return logTaskListCollection;
});