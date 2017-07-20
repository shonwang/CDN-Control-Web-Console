define("pnoSetup.model", ['require', 'exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function() {
            this.set("id", Utility.randomStr(8))
        }
    });

    var PNOSetupCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function() {},

        queryParamsList: function(args) {
            var url = "/2017-4-1/custom/params/query",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        if (!res.pno) res.pno = [];
                        _.each(res.pno, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.trigger("get.params.success");
                    } else {
                        this.trigger("get.params.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.params.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        updateParamsList: function(args) {
            var url = "/2017-4-1/custom/params/update",
                successCallback = function(res) {
                    this.trigger("set.params.success");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("set.params.error", response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return PNOSetupCollection;
});