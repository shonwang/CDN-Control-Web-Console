'use strict';

define("logTemplateManage.model", ['require', 'exports', 'utility'], function (require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function initialize() {
            var taskId = this.get("taskId");
            if (taskId) this.set("id", taskId);

            var commitTime = parseInt(this.get("commitTime")),
                startTime = parseInt(this.get("startTime")),
                endTime = parseInt(this.get("endTime")),
                batchTimeBandwidth = this.get("batchTimeBandwidth");
            if (commitTime) this.set("commitTimeFormated", new Date(commitTime).format("yyyy/MM/dd hh:mm"));
            if (startTime) this.set("startTimeFormated", new Date(startTime).format("yyyy/MM/dd hh:mm"));
            if (endTime) this.set("endTimeFormated", new Date(endTime).format("yyyy/MM/dd hh:mm"));
            _.each(batchTimeBandwidth, function (el) {
                _.each(el.timeWidth, function (time) {
                    var batchEndTime = parseInt(time.batchEndTime),
                        batchStartTime = parseInt(time.batchStartTime);
                    time.batchEndTime = new Date(batchEndTime).format("hh:mm");
                    time.batchStartTime = new Date(batchStartTime).format("hh:mm");
                });
            });
        }
    });

    var LogTemplateManageCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function initialize() {},

        getPreheatList: function getPreheatList(args) {
            var url = BASE_URL + "/refresh/task/query",
                successCallback = function (res) {
                this.reset();
                if (res) {
                    _.each(res.rows, function (element, index, list) {
                        this.push(new Model(element));
                    }.bind(this));
                    this.total = res.total;
                    this.trigger("get.preheat.success", res.rows);
                } else {
                    this.trigger("get.preheat.error");
                }
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('get.preheat.error', response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        commitTask: function commitTask(args) {
            var url = BASE_URL + "/refresh/task/commit",
                successCallback = function (res) {
                this.trigger("refresh.commit.success", res);
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('refresh.commit.error', response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        taskModify: function taskModify(args) {
            var url = BASE_URL + "/refresh/task/modify",
                successCallback = function (res) {
                this.trigger("refresh.commit.success", res);
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('refresh.commit.error', response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        taskPause: function taskPause(args) {
            var url = BASE_URL + "/refresh/task/pause",
                successCallback = function (res) {
                this.trigger("refresh.pause.success", res);
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('refresh.pause.error', response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        taskRestart: function taskRestart(args) {
            var url = BASE_URL + "/refresh/task/restart",
                successCallback = function (res) {
                this.trigger("refresh.restart.success", res);
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('refresh.restart.error', response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return LogTemplateManageCollection;
});
