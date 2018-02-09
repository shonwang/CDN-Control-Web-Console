define("codeRate.model", ['require', 'exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function() {
            var createTime = this.get("createTime");
            var updateTime = this.get("updateTime");

            this.set("createTimeName",new Date(createTime).format("yyyy/MM/dd hh:mm:ss"));
            this.set("updateTimeName",new Date(updateTime).format("yyyy/MM/dd hh:mm:ss"));

            var areaConfNum = this.get("areaConfNum");
            if(areaConfNum == 0) {
                this.set("areaConfNumName","否");
            }
            if(areaConfNum == 1){
                this.set("areaConfNumName","<span class='text-danger'>是</span>");
            }
        }
    });

    var CodeRateCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function() {},

        rateQuery: function(args) {
            var url = "/rs/video/rate/query",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.trigger("get.rate.success");
                    } else {
                        this.trigger("get.rate.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.rate.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        rateConf:function(args){
            var url = "/rs/video/rate/add",
                successCallback = function(res) {
                    this.trigger("set.rateConf.success");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("set.rateConf.error", response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        rateDelete:function(args){
            var url = "/rs/video/rate/delete",
                successCallback = function(res) {
                    this.trigger("delete.rate.success");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("delete.rate.error", response);
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

    return CodeRateCollection;
});