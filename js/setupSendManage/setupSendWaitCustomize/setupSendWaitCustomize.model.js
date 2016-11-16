define("setupSendWaitCustomize.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var operType = this.get("operType"),
                status       = this.get("status"),
                createTime    = this.get("createTime");

            if (operType === 0) this.set("operTypeName", '新建');
            if (operType === 2) this.set("operTypeName", '删除');
            if (operType === 1) this.set("operTypeName", '更新');

            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));

            this.set("tempUseCustomized", 2);
            this.set("isChecked", false);
        }
    });

    var SetupSendWaitCustomizeCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryChannel: function(args){
            var url = BASE_URL + "/cd/predelivery/list",
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
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getChannelConfig: function(args){
            var url = BASE_URL + "/cg/config/download/domain/config",
            successCallback = function(res){
                if (res)
                    this.trigger("get.channel.config.success", res);
                else
                    this.trigger("get.channel.config.error");
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.channel.config.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getAllConfig: function(args){
            var url = BASE_URL + "/cg/config/download/domain/configs",
            successCallback = function(res){
                if (res)
                    this.trigger("get.all.config.success", res);
                else
                    this.trigger("get.all.config.error");
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.all.config.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setChannelConfig: function(args){
            var url = BASE_URL + "/cg/config/download/nginx.conf",
            successCallback = function(res){
                this.trigger("set.channel.config.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.channel.config.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        rollBack: function(args){
            var url = BASE_URL + "/cd/predelivery/rollback",
            successCallback = function(res){
                this.trigger("roll.back.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("roll.back.error", response); 
            }.bind(this);

            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        publish: function(args){
            var url = BASE_URL + "/cd/predelivery/publish",
            successCallback = function(res){
                this.trigger("set.publish.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.publish.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return SetupSendWaitCustomizeCollection;
});