define("preheatManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var createTime = this.get("createTime");

            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var PreheatManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getPreheatList: function(args) {
            var url = BASE_URL + "/rs/device/pagelist",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res.rows, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.total = res.total;
                        this.trigger("get.preheat.success", res.rows);
                    } else {
                        this.trigger("get.preheat.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.preheat.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return PreheatManageCollection;
});