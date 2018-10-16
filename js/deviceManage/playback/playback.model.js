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

            if (replayType == 2) this.set("replayTypeName",'cache');
            if (replayType == 1) this.set("replayTypeName",'relay');

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
        
        getTopoOrigininfo:function(args){
            var url = BASE_URL + "/resource/topo/origin/consoleInfo?id="+args,
            successCallback = function(res){
                if(res){
                    this.total = res.total;
                    this.trigger("get.topo.OriginInfo.success",res);
                }else{
                    this.trigger("get.topo.OriginInfo.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.topo.OriginInfo.error',response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
        getTemplateinfo:function(args){
            var url = BASE_URL + "/cg/config/template?type="+args,
            successCallback = function(res){
                if (res){
                    this.trigger("get.template.info.success",res);
                } else {
                    this.trigger("get.template.info.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.template.info.error", response); 
            }.bind(this);
            Utility.getAjax(url, '', successCallback, errorCallback);
        }

    });

    return PlaybackCollection;
});