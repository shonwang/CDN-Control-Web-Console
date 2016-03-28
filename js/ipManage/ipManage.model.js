define("ipManage.model", ['require','exports'], function(require, exports) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var status = this.get("status");
            if (status === "1") this.set("statusName", "<span class='text-success'>运行中</span>");
            if (status === "2") this.set("statusName", "<span class='text-warning'>暂停中</span>");
            if (status === "4") this.set("statusName", "<span class='text-danger'>宕机</span>");
            if (status === "6") this.set("statusName", "暂停且宕机");
        }
    });

    var IPManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getIpInfoList: function(args){
            var url = BASE_URL + "/rs/ip/info/list";
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
                    this.trigger("get.ipInfo.success");
                } else {
                    this.trigger("get.ipInfo.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.ipInfo.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getIpInfoStart: function(args){
            var url = BASE_URL + "/rs/ip/prompt/open?ip="+args;
            //var url = BASE_URL + '/rs/ip/prompt/open?ip=10.10.10.10';
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.ipInfoStart.success",res);
                } else {
                    this.trigger("get.ipInfoStart.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.ipInfoStart.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getIpInfoPause: function(args){
            var url = BASE_URL + "/rs/ip/prompt/pause?ip="+args;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.ipInfoPause.success",res);
                } else {
                    this.trigger("get.ipInfoPause.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.ipInfoPause.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getIpInfoSubmit: function(args){
            var url = BASE_URL + "/rs/ip/status/update/confirm?id="+args.id+"&status="+args.status;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.ipInfoSubmit.success",res);
                } else {
                    this.trigger("get.ipInfoSubmit.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.ipInfoSubmit.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        }

    });

    return IPManageCollection;
});