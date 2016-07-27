define("templateManage.model", ['require','exports'], function(require, exports) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            
        }
    });

    var TemplateManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getTplPageList: function(args){
            var url = BASE_URL + "/api/cdn/config/templates";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.tplPageList.success");
                } else {
                    this.trigger("get.tplPageList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.tplPageList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getFileTypeList: function(args){
            var url = BASE_URL + "/api/cdn/fileTypes";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.fileTypeList.success",res.result);
                } else {
                    this.trigger("get.fileTypeList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.fileTypeList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getAllCity: function(args){
            var url = BASE_URL + "/rs/query/getAllAddr?" + new Date().valueOf(); 
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("get.city.success", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.city.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getOperatorList: function(args){
            var url = BASE_URL + "/rs/metaData/operatorList?" + new Date().valueOf(); 
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("get.operator.success", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.operator.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getBusinessList: function(){
            var url = BASE_URL + "/seed/metaData/config/release/list";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.trigger("get.businessList.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.businessList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
        
        getOperatorList: function(args){
            var url = BASE_URL + "/rs/metaData/operatorList?" + new Date().valueOf(); 
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("get.operator.success", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.operator.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        // getChannelDispgroup: function(args){
        //     var url = BASE_URL + "/rs/channel/dispgroup/get";
        //     var defaultParas = {
        //         type: "GET",
        //         url: url,
        //         async: true,
        //         timeout: 30000,
        //     };
        //     defaultParas.data = args;

        //     defaultParas.beforeSend = function(xhr){
        //         //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
        //     }
        //     defaultParas.success = function(res){
        //         if (res){
        //             this.trigger("channel.dispgroup.success", res);
        //         } else {
        //             this.trigger("channel.dispgroup.error", res); 
        //         }
        //     }.bind(this);

        //     defaultParas.error = function(response, msg){
        //         if (response&&response.responseText)
        //             response = JSON.parse(response.responseText)
        //         this.trigger("channel.dispgroup.error", response); 
        //     }.bind(this);

        //     $.ajax(defaultParas);
        // }
    });

    return TemplateManageCollection;
});