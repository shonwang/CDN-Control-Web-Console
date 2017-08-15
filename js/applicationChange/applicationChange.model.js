define("applicationChange.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var ApplicationChangeCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getTopoinfo: function(args) {
            var url = BASE_URL + "/resource/topo/info/list",
                successCallback = function(res) {
                    this.trigger("get.topoInfo.success",res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.topoInfo.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }

    });

    return ApplicationChangeCollection;
});