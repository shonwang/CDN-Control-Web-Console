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
        /*
        queryChannel: function(args){
            var url = BASE_URL + "/rs/channel/query",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.channel.success");
                } else {
                    this.trigger("get.channel.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.channel.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getChannelDispgroup: function(args){
            var url = BASE_URL + "/rs/channel/dispgroup/get",
            successCallback = function(res){
                if (res){
                    this.trigger("channel.dispgroup.success", res);
                } else {
                    this.trigger("channel.dispgroup.error", res); 
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("channel.dispgroup.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addDispGroupChannel: function(args){
            var url = BASE_URL + "/rs/channel/dispgroup/add",
            successCallback = function(res){
                this.trigger("add.dispGroup.channel.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("add.dispGroup.channel.error", response); 
            }.bind(this);

            Utility.postAjax(url, args, successCallback, errorCallback, null, "text");
        },

        ipTypeList: function(args){
            var url = BASE_URL + "/rs/metaData/ipTypeList",
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
        },

        deleteDispGroupChannel: function(args){
            var url = BASE_URL + "/rs/channel/dispgroup/delete",
            successCallback = function(res){
                this.trigger("add.dispGroup.channel.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("add.dispGroup.channel.error", response); 
            }.bind(this);

            Utility.postAjax(url, args, successCallback, errorCallback, null, "text");
        }*/
    });

    return SetupAppManageCollection;
});