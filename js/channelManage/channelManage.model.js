define("channelManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var businessType = this.get("businessType"),
                status       = this.get("status"),
                startTime    = this.get("startTime");

            if (status === 0) this.set("statusName", '<span class="text-danger">已停止</span>');
            if (status === 1) this.set("statusName", '<span class="text-success">服务中</span>');
            if (businessType === 1) this.set("businessTypeName", '下载加速');
            if (businessType === 2) this.set("businessTypeName", '直播加速');
            if (startTime) this.set("startTimeFormated", new Date(startTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var ChannelManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryChannel: function(args){
            var url = BASE_URL + "/rs/channel/query"
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
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
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.channel.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getChannelDispgroup: function(args){
            var url = BASE_URL + "/rs/channel/dispgroup/get";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = args;

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res){
                    this.trigger("channel.dispgroup.success", res);
                } else {
                    this.trigger("channel.dispgroup.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("channel.dispgroup.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        addDispGroupChannel: function(args){
            var url = BASE_URL + "/rs/channel/dispgroup/add";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("add.dispGroup.channel.success", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.dispGroup.channel.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
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
        }
    });

    return ChannelManageCollection;
});