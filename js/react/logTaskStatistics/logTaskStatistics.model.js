'use strict';

define("logTaskStatistics.model", ['require', 'exports', 'utility'], function (require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function initialize() {
            var updateTime = parseInt(this.get("updateTime")),
                createTime = parseInt(this.get("createTime"));
            if (updateTime) this.set("updateTimeFormated", new Date(updateTime).format("yyyy/MM/dd hh:mm"));
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var logTaskListCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function initialize() {},

        getTaskStatistics: function getTaskStatistics(args) {
            this.param = args;
            var url = BASE_URL + "/2018-08-30/realtimelog/task/statistics",
                successCallback = function (res) {
                if (res) {
                    if (this.param.status200 === true) this.trigger("statistics.chart2.200.success", res);else if (this.param.status200 === false) this.trigger("statistics.chart2.not200.success", res);else if (this.param.status200 === null) this.trigger("statistics.chart1.success", res);
                } else {
                    this.trigger('statistics.chart.error', res);
                }
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('statistics.chart.error', response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return logTaskListCollection;
});
