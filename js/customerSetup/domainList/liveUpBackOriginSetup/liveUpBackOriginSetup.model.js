define("liveUpBackOriginSetup.model", ['require', 'exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function() {
            var pushType = this.get('pushType'); //转推类型 1:边缘转推 2:上层转推
            if (pushType === 1) this.set("pushTypeName", "边缘转推");
            if (pushType === 2) this.set("pushTypeName", "上层转推");

            var flag = this.get('detectConfig').flag;
            if (flag === 1) this.get('detectConfig').flagName = '<span class="text-success">开启</span>';
            if (flag === 0) this.get('detectConfig').flagName = '<span class="text-danger">关闭</span>';
        }
    });

    var LiveUpBackOriginSetupCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function() {},

        getPushSourceConfig: function(args) {
            var url = BASE_URL + "/channelManager/upLive/getPushSourceConfig",
                successCallback = function(res) {
                    this.reset();
                    if (res && res.appLives.length > 0) {
                        var pushList = res.appLives[0].pushList;
                        _.each(pushList, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.total = res.total;
                        this.trigger("get.pushConf.success");
                    } else {
                        this.trigger("get.pushConf.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.pushConf.error", response)
                }.bind(this);
            //Utility.getAjax(url, args, successCallback, errorCallback);
            var tempData = {
                "originId": 114,
                "appLives": [{
                    "pushList": [{
                        "id": 1,
                        "openFlag": 1, //源站配置 0:关 1:开
                        "sourceType": 3, //1:用户源站 2:上层节点 3：视频云源站
                        "sourceName": "视频云源站",
                        "originType": 3, //1:ip 2:域名 3:视频云源站
                        "originAddr": null,
                        "pushPort": null,
                        "pushAppFlag": 1, //转推地址频道名称 0:关 1:开启
                        "pushAppName": "pushAppName",
                        "backHost": null,
                        "pushType": null,
                        "pushArgsFlag": 1,
                        "pushArgs": "pushArgs",
                        "connectArgsFlag": 1,
                        "connectArgs": "connectArgs",
                        "reconnectArgsFlag": 1,
                        "reconnectArgs": "reconnectArgs",
                        "createTime": new Date().valueOf(),
                        "updateTime": new Date().valueOf(),
                        "detectConfig": {
                            "pushId": null,
                            "flag": 0,
                            "detectMethod": null,
                            "expectedResponse": null,
                            "detectUrl": null,
                            "frequency": null,
                            "host": null
                        }
                    }]
                }]
            }
            successCallback(tempData);
        },

        setPushSourceConfig: function(args) {
            var url = BASE_URL + "/channelManager/upLive/setPushSourceConfig";
            Utility.postAjax(url, args, function(res) {
                this.trigger("set.pushConf.success");
            }.bind(this), function(res) {
                this.trigger("set.pushConf.error", res);
            }.bind(this));
        },
    });

    return LiveUpBackOriginSetupCollection;
});