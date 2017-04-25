define("setupSendWaitSend.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var operType = this.get("operType"),
                isCustom = this.get("isCustom"),
                configReason = this.get("configReason"),
                createTime = this.get("createTime");

            if (operType === 0) this.set("operTypeName", '新建');
            if (operType === 2) this.set("operTypeName", '删除');
            if (operType === 1) this.set("operTypeName", '更新');
            if (isCustom === true) this.set("isCustomName", '是');
            if (isCustom === false) this.set("isCustomName", '否');
            if (configReason === 1) this.set("configReasonName", '用户配置变更');
            if (configReason === 2) this.set("configReasonName", '拓扑变更');
            if (configReason === 4) this.set("configReasonName", '分层策略变更');

            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));

            if (isCustom === true) this.set("tempUseCustomized", 2);
            if (isCustom === false) this.set("tempUseCustomized", 1);
            this.set("isChecked", false);
            this.set("isDisplay", true);
        }
    });

    var SetupAppManageCollection = Backbone.Collection.extend({
        
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

        createTask: function(args){
            var url = BASE_URL + "/cd/delivery/task/createtask",
            successCallback = function(res){
                this.trigger("create.task.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("create.task.error", response); 
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

        getOriginDomain: function(args){
            var url = BASE_URL + "/channelManager/domain/getOriginDomain",
            successCallback = function(res){
                if (res){
                    this.trigger("get.originDomain.success", res);
                } else {
                    this.trigger("get.originDomain.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.originDomain.error", response);  
            }.bind(this);
            args.t = new Date().valueOf();
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        modifyDomainDescription: function(args){
            var url = BASE_URL + "/channelManager/domain/modifyDomainDescription",
            successCallback = function(res){
                this.trigger("modify.domainDescription.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("modify.domainDescription.error", response);  
            }.bind(this);
            args.t = new Date().valueOf();
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        topoSpecialStrategy: function(args){
            var url = BASE_URL + "/cd/predelivery/topoSpecialStrategy",
            successCallback = function(res){
                this.trigger("get.topoSpecialStrategy.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.topoSpecialStrategy.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return SetupAppManageCollection;
});