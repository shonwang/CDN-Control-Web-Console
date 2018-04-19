define("userMove.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var UserMoveCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        changeUser: function(args) {
            var url = BASE_URL + "/channelManager/user/changeUser",
                successCallback = function(res) {
                    this.trigger("set.changeUser.success",res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('set.changeUser.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }

    });

    return UserMoveCollection;
});