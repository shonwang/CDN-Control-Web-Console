define("dragPlay.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var videoType = this.get("videoType");
            if (videoType === 1) this.set("videoTypeName", "MP4");
            if (videoType === 2) this.set("videoTypeName", "FLV");

            var dragMode = this.get("dragMode");
            if (dragMode === 1) this.set("dragModeName", "按时间");
            if (dragMode === 2) this.set("dragModeName", "按字节");
        }
    });

    var DragPlayCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getDragConfList: function(args){
            var url = BASE_URL + "/channelManager/drag/getDragConfList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.drag.success");
                } else {
                    this.trigger("get.drag.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.drag.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setDragConf: function(args){
            var url = BASE_URL + "/channelManager/drag/setDragConf",
            successCallback = function(res){
                this.trigger("set.drag.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.drag.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return DragPlayCollection;
});