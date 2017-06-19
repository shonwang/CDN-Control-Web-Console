define("liveUpBackOriginSetup.model", ['require', 'exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function() {
            var pushType = this.get('pushType'); //转推类型 1:边缘转推 2:上层转推
            if (pushType === 1) this.set("pushTypeName", "边缘转推");
            if (pushType === 2) this.set("pushTypeName", "上层转推");
            var flag
            if (this.get('detectConfig')) {
                flag = this.get('detectConfig').flag;
                if (flag === 1) this.get('detectConfig').flagName = '<span class="text-success">开启</span>';
                if (flag === 0) this.get('detectConfig').flagName = '<span class="text-danger">关闭</span>';
            }
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
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setPushSourceConfig: function(args) {
            var url = BASE_URL + "/channelManager/upLive/setPushSourceConfig";
            Utility.postAjax(url, args, function(res) {
                this.trigger("set.pushConf.success");
            }.bind(this), function(res) {
                this.trigger("set.pushConf.error", res);
            }.bind(this));
        }
    });

    return LiveUpBackOriginSetupCollection;
});