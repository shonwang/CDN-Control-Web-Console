define("setupTemplateManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var SetupTemplateManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryChannel: function(args) {
            var url = BASE_URL + "/channelManager/domain/getOriginDomain",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        this.push(new Model(res));
                        this.trigger("get.channel.success");
                    } else {
                        this.trigger("get.channel.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.channel.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return SetupTemplateManageCollection;
});