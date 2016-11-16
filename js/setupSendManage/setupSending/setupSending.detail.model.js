define("setupSendDetail.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var status  = this.get("status");
            if (status === 1) this.set("statusName", '<span class="text-success">执行下发中</span>');
            if (status === 2) this.set("statusName", '<span class="text-success">下发完成</span>');
            if (status === 3) this.set("statusName", '<span class="text-danger">下发失败</span>');
            if (status === 4) this.set("statusName", '<span class="text-success">跳过</span>');
            if (status === 5) this.set("statusName", '<span class="text-success">忽略</span>');
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

        ingoreDevice:function(args){
            var url = BASE_URL + "/cd/delivery/task/ingoredevice",
            successCallback = function(res){
                this.trigger("get.ingoredevice.error"); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.ingoredevice.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback); 
        }

    });

    return SetupSendDetailCollection;
});