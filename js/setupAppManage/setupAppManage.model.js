define("setupAppManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var SetupAppManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
        
        getAppInfo: function(args){
            var url = BASE_URL + "/resource/app/info/list",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this));
                    this.total = res.total;
                    this.trigger("get.app.info.success",res);
                } else {
                    this.trigger("get.app.info.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.app.info.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        getTopoOrigininfo:function(args){
            var url = BASE_URL + "/resource/topo/origin/info?id="+args,
            successCallback = function(res){
                if(res){
                    this.total = res.total;
                    this.trigger("get.topo.OriginInfo.success",res);
                }else{
                    this.trigger("get.topo.OriginInfo.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.topo.OriginInfo.error',response)
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
            var url = BASE_URL + "/resource/rs/metaData/ipTypeList",
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