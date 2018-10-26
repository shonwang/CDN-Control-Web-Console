define("netRateLimiting.model", ['require', 'exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var NetRateLimitingCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        gettAllLimitRateGroup: function(args) {
            var url = BASE_URL + "/channelManager/globalLimitRate/gettAllLimitRateGroup",
                successCallback = function(res) {
                    if (res) {
                        this.trigger("get.allLimit.success", res);
                    } else {
                        this.trigger("get.allLimit.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.allLimit.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        delLimitRateByGroupId: function(args) {
            var url = BASE_URL + "/channelManager/globalLimitRate/delLimitRateByGroupId",
                successCallback = function(res) {
                    this.trigger("delete.limit.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('delete.limit.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getLimitRateDetailByGroupId: function(args) {
            var url = BASE_URL + "/channelManager/globalLimitRate/getLimitRateDetailByGroupId",
                successCallback = function(res) {
                    this.trigger("get.detail.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.detail.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }, 

        getDomainsBySubType: function(args) {
            var url = BASE_URL + "/channelManager/globalLimitRate/getDomainsBySubType",
                successCallback = function(res) {
                    this.trigger("get.domain.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.domain.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        updateLimitRateConf: function(args) {
            var url = BASE_URL + "/channelManager/globalLimitRate/updateLimitRateConf",
                successCallback = function(res) {
                    this.trigger("update.detail.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('update.detail.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        addLimitRateConf: function(args) {
            var url = BASE_URL + "/channelManager/globalLimitRate/addLimitRateConf",
                successCallback = function(res) {
                    this.trigger("update.detail.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('update.detail.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return NetRateLimitingCollection;
});