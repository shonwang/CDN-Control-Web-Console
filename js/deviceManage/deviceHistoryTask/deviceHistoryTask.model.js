define("deviceHistoryTask.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var taskId = this.get("taskId"),
                endTimestamp = this.get("endTimestamp"),
                createTime = this.get("createTime"),
                startTimestamp = this.get("startTimestamp"),
                startTime = this.get("startTime"),
                histoTime = this.get("histoTime"),
                replayType = this.get("replayType"),
                replayStatus = this.get("replayStatus");

            if (taskId != undefined) this.set("id", taskId)
            if (endTimestamp) this.set("endTimestampFormated", new Date(endTimestamp).format("yyyy/MM/dd hh:mm:ss"));
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm:ss"));
            if (startTimestamp) this.set("startTimestampFormated", new Date(startTimestamp).format("yyyy/MM/dd hh:mm:ss"));
            if (startTime) this.set("startTimeFormated", new Date(startTime).format("yyyy/MM/dd hh:mm:ss"));
            if (histoTime) this.set("histoTimeFormated", new Date(histoTime).format("yyyy/MM/dd hh:mm:ss"));

            if (replayType == 202) this.set("replayTypeName",'cache');
            if (replayType == 201) this.set("replayTypeName",'relay');
            if (replayType == 203) this.set("replayTypeName",'live');

            if (replayStatus == 4) this.set("replayStatusName",'已完成');
            if (replayStatus == 5) this.set("replayStatusName",'已放弃');
            if (replayStatus == 9) this.set("replayStatusName",'回放失败');
        }
    });

    var DeviceHistoryTaskCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
        
        getTaskHistory: function(args){
            var url = BASE_URL + "/replay/archive/task/history",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.task, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this));
                    this.total = res.total;
                    this.trigger("get.task.history.success", res);
                } else {
                    this.trigger("get.task.history.error", res); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.task.history.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return DeviceHistoryTaskCollection;
});