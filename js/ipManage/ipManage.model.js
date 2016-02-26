define("ipManage.model", ['require','exports'], function(require, exports) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var ipType = this.get("ipType");
            if (ipType === "1") this.set("ipTypeName", "内网IP");
            if (ipType === "2") this.set("ipTypeName", "外网IP");
            if (ipType === "3") this.set("ipTypeName", "虚拟IP");
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
    });

    return IPManageCollection;
});