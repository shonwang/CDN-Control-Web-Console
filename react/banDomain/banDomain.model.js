define("banDomain.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var originId = this.get("originId");
            this.set("id",  originId);
        }
    });

    var logTaskListCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getTaskList: function(args) {
            var url = BASE_URL + "/channelManager/domain/block/get",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res.data, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.total = res.totalCount;
                        this.trigger("get.taskList.success", res.data);
                    } else {
                        this.trigger("get.taskList.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.taskList.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        addTask: function(args) {
            var url = BASE_URL + "/channelManager/domain/block/add",
                successCallback = function(res) {
                    this.trigger("add.task.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('add.task.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTaskDetail: function(args) {
            var url = BASE_URL + "/channelManager/domain/block/log",
                successCallback = function(res) {
                    this.trigger("task.detail.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('task.detail.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        
        deleteTask: function(args) {
            var url = BASE_URL + "/channelManager/domain/block/delete",
                successCallback = function(res) {
                    this.trigger("delete.task.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('delete.task.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        reminderDomain: function(args) {
            var url = BASE_URL + "/channelManager/domain/block/reminder",
                successCallback = function(res) {
                    this.trigger("reminder.domain.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('reminder.domain.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
    });

    return logTaskListCollection;
});