define("luaAdvanceConfigHttpHeaderOpt.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var directionType = this.get("directionType"), directionTypeName;
            if (directionType === 1) this.set("directionTypeName","客户端到CDN");
            if (directionType === 2) this.set("directionTypeName","客户端CDN到源站到CDN");
            if (directionType === 3) this.set("directionTypeName","源到CDN");
            if (directionType === 4) this.set("directionTypeName","CDN到客户端");

            var actionType = this.get("actionType"), actionTypeName;
            if (actionType === 1) this.set("actionTypeName","增加");
            if (actionType === 2) this.set("actionTypeName","修改");
            if (actionType === 3) this.set("actionTypeName","隐藏");
        }
    });

    var LuaAdvanceConfigHttpHeaderOptCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getHeaderList: function(args){
            var url = BASE_URL + "/channelManager/httpHeader/getHeaderList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.header.success");
                } else {
                    this.trigger("get.header.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.header.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setHttpHeader: function(args){
            var url = BASE_URL + "/channelManager/httpHeader/addHttpHeader",
            successCallback = function(res){
                this.trigger("set.header.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.header.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        modifyHttpHeader:function(args){
            var url = BASE_URL + "/channelManager/httpHeader/modifyHttpHeader ",
            successCallback = function(res){
                this.trigger("modify.header.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("modify.header.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        deleteHttpHeader:function(args){
            var url = BASE_URL + "/channelManager/httpHeader/delHttpHeader",
            successCallback = function(res){
                this.trigger("del.header.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("del.header.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
        
    });

    return LuaAdvanceConfigHttpHeaderOptCollection;
});