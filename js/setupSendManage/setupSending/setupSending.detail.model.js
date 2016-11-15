define("setupSendDetail.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var businessType = this.get("bussinessType"),
                status       = this.get("status"),
                cdnFactory   = this.get("cdnFactory"),
                startTime    = this.get("startTime");

            if (status === 0) this.set("statusName", '<span class="text-danger">已停止</span>');
            if (status === 1) this.set("statusName", '<span class="text-success">服务中</span>');
            if (businessType === "1") this.set("businessTypeName", '下载加速');
            if (businessType === "2") this.set("businessTypeName", '直播加速');
            if (cdnFactory === "1") this.set("cdnFactoryName", '自建');
            if (cdnFactory === "2") this.set("cdnFactoryName", '网宿');
            if (cdnFactory === "3") this.set("cdnFactoryName", '自建+网宿');
            if (startTime) this.set("startTimeFormated", new Date(startTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var SetupSendDetailCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        taskDoingdetail:function(args){
            var url = BASE_URL + "/cd/delivery/task/doingdetail",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.task.doingdetail.success");
                } else {
                    this.trigger("get.task.doingdetail.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.task.doingdetail.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);        
        }

    });

    return SetupSendDetailCollection;
});