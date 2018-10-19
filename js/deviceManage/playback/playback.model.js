define("playback.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var taskId = this.get("taskId"),
                replayPosition = this.get("replayPosition"),
                endTimestamp = this.get("endTimestamp"),
                createTime = this.get("createTime"),
                startTimestamp = this.get("startTimestamp"),
                startTime = this.get("startTime"),
                replayType = this.get("replayType"),
                progress = this.get("progress");

            if (taskId) this.set("id", taskId)
            if (replayPosition) this.set("replayPositionFormated", new Date(replayPosition).format("yyyy/MM/dd hh:mm:ss"));
            if (endTimestamp) this.set("endTimestampFormated", new Date(endTimestamp).format("yyyy/MM/dd hh:mm:ss"));
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm:ss"));
            if (startTimestamp) this.set("startTimestampFormated", new Date(startTimestamp).format("yyyy/MM/dd hh:mm:ss"));
            if (startTime) this.set("startTimeFormated", new Date(startTime).format("yyyy/MM/dd hh:mm:ss"));

            if (replayType == 202) this.set("replayTypeName",'cache');
            if (replayType == 201) this.set("replayTypeName",'relay');
            if (replayType == 203) this.set("replayTypeName",'live');

            if (progress) this.set("progressName", progress*100 + "%");
        }
    });

    var PlaybackCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
        
        getTaskInfo: function(args){
            var url = BASE_URL + "/mock/44/archive/task/query",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this));
                    this.trigger("get.task.info.success", res);
                } else {
                    this.trigger("get.task.info.error", res); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.task.info.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        
        getTaskProgress:function(args){
            var url = BASE_URL + "/mock/44/archive/task/progress",
            successCallback = function(res){
                if (res) {
                    this.total = res.total;
                    this.trigger("get.task.progress.success", res);
                } else {
                    this.trigger("get.task.progress.error", res);
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.task.progress.error',response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        setTaskStatus:function(args){
            var url = BASE_URL + "/mock/44/archive/task/change",
            successCallback = function(res){
                if (res){
                    this.trigger("set.task.status.success",res);
                } else {
                    this.trigger("set.task.status.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.task.status.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }

    });

    return PlaybackCollection;
});