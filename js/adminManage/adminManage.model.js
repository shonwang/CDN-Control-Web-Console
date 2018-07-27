define("adminManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var AdminManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getTypeInfo: function() {
            var url = BASE_URL + "/rs/device/type/list";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 10 * 60 * 1000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.trigger("get.type.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.type.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
       
        getTopoInfo: function(args) {
            var url = BASE_URL + "/resource/topo/info/list",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        this.trigger("get.topoInfo.success", res.rows);
                    } else {
                        this.trigger("get.topoInfo.error", res);
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.topoInfo.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        addUserTopoInfo: function(args, isEdit) {
            var url = BASE_URL + "/channelManager/user/addUserTopoInfo",
                successCallback = function(res){
                    this.trigger("add.topoInfo.success", res, isEdit);
                }.bind(this),
                errorCallback = function(response){
                    this.trigger("add.topoInfo.error", response); 
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        delUserTopoInfo: function(args){
            var url = BASE_URL + "/channelManager/user/delUserTopoInfo?id=" + args.id;
            var defaultParas = {
                type: "DELETE",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("del.userTopo.success", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("del.userTopo.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getUserTopoInfo: function(args) {
            var url = BASE_URL + "/channelManager/user/getUserTopoInfo",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res, function(element, index, list){
                            this.push(new Model(element));
                        }.bind(this))
                        this.total = res.totalCount;
                        this.trigger("get.userTopo.success", res);
                    } else {
                        this.trigger("get.userTopo.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.userTopo.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },


        getDispGroupList: function(args){
            var url = BASE_URL + "/rs/dispGroup/pageList";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = {
                "name"  : null,//调度组名称
                "status": null,//调度组状态
                "level" : null,//覆盖级别
                "page"  : 1,
                "count" : 99999,
                "topoId": null
            };
            defaultParas.data = JSON.stringify(defaultParas.data);

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.dispGroup.success", res);
                } else {
                    this.trigger("get.dispGroup.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.dispGroup.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        }
    });

    return AdminManageCollection;
});