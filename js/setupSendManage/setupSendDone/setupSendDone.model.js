define("setupSendDone.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var businessType = this.get("bussinessType"),
                status       = this.get("status"),
                cdnFactory   = this.get("cdnFactory"),
                createTime    = this.get("createTime"),
                taskId = this.get("taskId"),
                endTime = this.get("endTime");
            this.set("id",taskId);

            if (status === 3) this.set("statusName", '<span class="text-danger">被终止</span>');
            if (status === 2) this.set("statusName", '<span class="text-success">下发完成</span>');
            if (createTime) this.set("startTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            if (endTime) this.set("endTimeFormated", new Date(endTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var SetupAppManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        
        queryTaskDonelist:function(args){
            //任务完成的查询列表
            var url = BASE_URL + "/cd/delivery/task/donelist",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.donlist.success");
                } else {
                    this.trigger("get.donlist.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.donlist.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);            
        }, 

        retryTask:function(args){
            var url = BASE_URL + "/cd/delivery/task/retrytask",
            successCallback = function(res){
                this.trigger("get.retrytask.success"); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.retrytask.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback); 
        }

    });

    return SetupAppManageCollection;
});