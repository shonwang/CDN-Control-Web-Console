define("setupSendingSwitch.model", ['require','exports', 'utility'], function(require, exports, Utility) {
        var Model = Backbone.Model.extend({
            initialize: function(){}
        });

    var SetupSendingSwitchCollection = Backbone.Collection.extend({

        initialize: function(){},

        checkIsHaveInitTask: function(args) {
            var url = BASE_URL + "/cd/node/updatecfg/status",
                successCallback = function(res) {
                    if (res) {
                        this.trigger("check.haveTask.success", res);
                    } else {
                        this.trigger("check.haveTask.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('check.haveTask.error', response)
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

    });

    return SetupSendingSwitchCollection;
});