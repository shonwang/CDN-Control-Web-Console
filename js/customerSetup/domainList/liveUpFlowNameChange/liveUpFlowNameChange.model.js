define("liveUpFlowNameChange.model", ['require', 'exports', 'utility', 'basicInformation.model'],
    function(require, exports, Utility, BasicInformationCollection) {
        var Model = Backbone.Model.extend({
            initialize: function() {}
        });

        var LiveUpFlowNameChangeCollection = Backbone.Collection.extend({

            model: Model,

            initialize: function() {},

            getPushLiveConfig: function(args) {
                var url = BASE_URL + "/channelManager/upLive/getPushLiveConfig",
                    successCallback = function(res) {
                        this.reset();
                        if (res && res.appLives.length > 0) {
                            var pushConf = res.appLives[0].pushConf;
                            this.trigger("get.pushConfig.success", pushConf);
                        } else {
                            this.trigger("get.pushConfig.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("get.pushConfig.error", response)
                    }.bind(this);
                //Utility.getAjax(url, args, successCallback, errorCallback);
                var tempData = {
                    "originId": 114,
                    "appLives": [{
                        "pushConf": {
                            "id": null,
                            "liveId": null,
                            "aliasFlag": 0,
                            "aliasName": "null"
                        }
                    }]
                }
                successCallback(tempData);
            },

            setPushLiveConfig: function(args) {
                var url = BASE_URL + "/channelManager/upLive/setPushLiveConfig",
                    successCallback = function(res) {
                        this.trigger("set.pushConfig.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("set.pushConfig.error", response)
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },
        });

        return LiveUpFlowNameChangeCollection;
    });