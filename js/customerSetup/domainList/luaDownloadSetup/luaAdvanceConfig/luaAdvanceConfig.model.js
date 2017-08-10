define("luaAdvanceConfig.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            //0文件后缀，1目录，2具体url,3正则预留,4url包含指定参数9全局默认缓存配置项
            var type = this.get('matchingType');
            if (type === 0) this.set("typeName", "文件类型");
            if (type === 1) this.set("typeName", "指定目录");
            if (type === 2) this.set("typeName", "指定URI");
            if (type === 3) this.set("typeName", "正则匹配");
            if (type === 4) this.set("typeName", "urI包含指定参数");
            if (type === 9) this.set("typeName", "全部文件");

            var configNames = this.get("configNames");
            if(configNames){
                var configName = configNames.replace(/\//g,"<br />");
                this.set("configName",configName);
            }
        }
    });

    var LuaAdvanceConfigCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        addAdvanceLocation: function(args){
            var url = BASE_URL + "/channelManager/location/addAdvanceLocation",
            successCallback = function(res){
                this.trigger("set.advanceLocation.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.advanceLocation.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getAdvanceLocationList: function(args){
            var url = BASE_URL + "/channelManager/location/getAdvanceLocationList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.advanceLocation.success");
                } else {
                    this.trigger("get.advanceLocation.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.advanceLocation.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return LuaAdvanceConfigCollection;
});