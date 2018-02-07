define("codeRateManage.model", ['require', 'exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function() {
            
        }
    });

    var CodeRateManageCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function() {},
        areaQuery: function(args) {
            var url = "/rs/video/rate/area/query",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.trigger("get.areaQuery.success");
                    } else {
                        this.trigger("get.areaQuery.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.areaQuery.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        areaConf:function(args){
            var url = "/rs/video/rate/area/conf",
                successCallback = function(res) {
                    this.trigger("set.areaConf.success");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("set.areaConf.error", response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);            
        },

        areaDelete:function(args){
            var url = "/rs/video/rate/area/delete",
                successCallback = function(res) {
                    this.trigger("delete.areaRate.success");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("delete.areaRate.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);              
        },

        rateUpdate:function(args){
            var url = "/rs/video/rate/update",
                successCallback = function(res) {
                    this.trigger("set.rateUpdate.success");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("set.rateUpdate.error", response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }

    });

    return CodeRateManageCollection;
});