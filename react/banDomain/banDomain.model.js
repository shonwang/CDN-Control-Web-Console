define("banDomain.model", ['require','exports', 'utility'], function(require, exports, Utility) {
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

        getTaskList: function(args) {
            var url = BASE_URL + "/mock/68/channelManager/domain/block/get",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res.list, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.total = res.totalCount;
                        this.trigger("get.taskList.success", res.list);
                    } else {
                        this.trigger("get.taskList.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.taskList.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addTask: function(args) {
            var url = BASE_URL + "/mock/68/channelManager/domain/block/add",
                successCallback = function(res) {
                    this.trigger("add.task.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('add.task.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTaskDetail: function(args) {
            var url = BASE_URL + "/mock/68/channelManager/domain/block/log",
                successCallback = function(res) {
                    this.trigger("task.detail.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('task.detail.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        stopTask: function(args) {
            var url = BASE_URL + "/2018-08-30/realtimelog/task/stop?id=" + args.id,
                successCallback = function(res) {
                    this.trigger("stop.task.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('stop.task.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }, 
        
        deleteTask: function(args) {
            var url = BASE_URL + "/2018-08-30/realtimelog/task/del?id=" + args.id,
                successCallback = function(res) {
                    this.trigger("delete.task.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('delete.task.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTaskDomain: function(args) {
            var url = BASE_URL + "/2018-08-30/realtimelog/task/domains",
                successCallback = function(res) {
                    this.trigger("get.domain.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.domain.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
    });

    return logTaskListCollection;
});