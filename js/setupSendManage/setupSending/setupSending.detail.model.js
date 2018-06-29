define("setupSending.detail.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var status  = this.get("status");
            if (status === 1) this.set("statusName", '<span class="text-primary">执行下发中</span>');
            if (status === 2) this.set("statusName", '<span class="text-success">下发完成</span>');
            if (status === 3) this.set("statusName", '<span class="text-danger">下发失败</span>');
            if (status === 4) this.set("statusName", '<span class="text-info">跳过</span>');
            if (status === 5) this.set("statusName", '<span class="text-default">忽略</span>');

            this.set("id", this.get("deviceId"))
        }
    });

    var SetupSendDetailCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryTaskDoingDetail:function(args){
            var url = BASE_URL + "/cd/delivery/task/doingdetail",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.deliveryDomains = res.deliveryDomains;
                    this.trigger("get.task.doingdetail.success");
                } else {
                    this.trigger("get.task.doingdetail.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.task.doingdetail.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);        
        },

        queryTaskDoneDetail:function(args){
            var url = BASE_URL + "/cd/delivery/task/donedetail",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.deliveryDomains = res.deliveryDomains;
                    this.trigger("get.task.donedetail.success");
                } else {
                    this.trigger("get.task.donedetail.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.task.donedetail.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback); 
        },

        batchIgnoreDevice:function(args){
            var url = BASE_URL + "/cd/delivery/task/batchignoredevice",
            successCallback = function(res){
                this.trigger("get.ingoredevice.success"); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.ingoredevice.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback); 
        }
    });

    return SetupSendDetailCollection;
});