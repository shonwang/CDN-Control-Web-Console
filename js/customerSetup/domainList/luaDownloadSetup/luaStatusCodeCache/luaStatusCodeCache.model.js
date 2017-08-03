define("luaStatusCodeCache.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){

        }
    });

    var LuaStatusCodeCacheCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getStatusCodeList: function(args){
            var url = BASE_URL + "/channelManager/cache/getStatusCodeList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.statusCode.success");
                } else {
                    this.trigger("get.statusCode.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.header.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addStatusCode: function(args){
            var url = BASE_URL + "/channelManager/cache/addStatusCode",
            successCallback = function(res){
                this.trigger("set.statusCode.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.statusCode.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        modifyStatusCode:function(args){
            var url = BASE_URL + "/channelManager/cache/modifyStatusCode",
            successCallback = function(res){
                this.trigger("modify.statusCode.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("modify.statusCode.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        delStatusCode:function(args){
            var url = BASE_URL + "/channelManager/cache/delStatusCode",
            successCallback = function(res){
                this.trigger("del.statusCode.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("del.statusCode.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
        
    });

    return LuaStatusCodeCacheCollection;
});