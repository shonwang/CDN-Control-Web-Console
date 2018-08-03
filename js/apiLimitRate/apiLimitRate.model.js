define("apiLimitRate.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var apiLimitRateCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        // 查
        getApiLimitRateInfo: function() {
            var url = BASE_URL + "/rs/rate/limit/list";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 10 * 60 * 1000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.trigger("get.apiLimitRate.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.apiLimitRate.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
       
        // 增
        addApiLimitRateInfo: function(args) {
            var url = BASE_URL + "/rs/rate/limit/add",
                successCallback = function(res){
                    this.trigger("add.apiLimitRate.success", res);
                }.bind(this),
                errorCallback = function(response){
                    this.trigger("add.apiLimitRate.error", response); 
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        // delUserTopoInfo: function(args){
        //     var url = BASE_URL + "/channelManager/user/delUserTopoInfo?id=" + args.id;
        //     var defaultParas = {
        //         type: "DELETE",
        //         url: url,
        //         async: true,
        //         timeout: 30000,
        //         contentType: "application/json",
        //         processData: false
        //     };

        //     defaultParas.beforeSend = function(xhr){
        //         //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
        //     }
        //     defaultParas.success = function(res){
        //         this.trigger("del.userTopo.success", res);
        //     }.bind(this);

        //     defaultParas.error = function(response, msg){
        //         if (response&&response.responseText)
        //             response = JSON.parse(response.responseText)
        //         this.trigger("del.userTopo.error", response); 
        //     }.bind(this);

        //     $.ajax(defaultParas);
        // },

        // 改
        updateApiLimitRateInfo: function(args) {
            var url = BASE_URL + "/rs/rate/limit/modify";
            var defaultParas = {
                type: "PUT",
                url: url,
                async: true,
                timeout: 10 * 60 * 1000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.trigger("update.apiLimitRate.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("update.apiLimitRate.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },


    });

    return apiLimitRateCollection;
});