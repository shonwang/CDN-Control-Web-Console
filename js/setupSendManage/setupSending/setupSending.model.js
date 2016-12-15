define("setupSending.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var status       = this.get("status"),
                createTime    = this.get("createTime");

            if (status === 1) this.set("statusName", '<span class="text-info">执行中</span>');
            if (status === 2) this.set("statusName", '<span class="text-success">执行完成</span>');
            if (status === 3) this.set("statusName", '<span class="text-danger">任务被终止</span>');
            if (status === 4) this.set("statusName", '<span class="text-warning">等待下一步</span>');
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            this.set("id", this.get("taskId"))
            this.set("isChecked", false);
        }
    });

    var SetupAppManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        querySendingChannel: function(args){
            var url = BASE_URL + "/cd/delivery/task/doinglist",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.sending.channel.success");
                } else {
                    this.trigger("get.sending.channel.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.sending.channel.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        terminateTask: function(args){
            var url = BASE_URL + "/cd/delivery/task/terminate",
            successCallback = function(res){
                this.trigger("channel.terminate.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("channel.terminate.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        nextTask: function(args){
            var url = BASE_URL + "/cd/delivery/task/next",
            successCallback = function(res){
                this.trigger("channel.next.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("channel.next.error", response); 
            }.bind(this);

            Utility.postAjax(url, args, successCallback, errorCallback, null, "text");
        },

        ipTypeList: function(args){
            var url = BASE_URL + "/resource/rs/metaData/ipTypeList",
            successCallback = function(res){
                if (res)
                    this.trigger("ip.type.success", res.rows);
                else
                    this.trigger("ip.type.error");
            }.bind(this),
            errorCallback = function(response){
                this.trigger("ip.type.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return SetupAppManageCollection;
});