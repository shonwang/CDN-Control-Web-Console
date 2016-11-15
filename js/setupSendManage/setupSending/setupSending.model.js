define("setupSending.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var status       = this.get("status"),
                createTime    = this.get("createTime");

            if (status === 1) this.set("statusName", '<span class="text-info">执行中</span>');
            if (status === 2) this.set("statusName", '<span class="text-success">执行完成</span>');
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));

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
        }
    });

    return SetupAppManageCollection;
});