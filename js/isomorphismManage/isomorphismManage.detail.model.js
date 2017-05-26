define("isomorphismManage.detail.model", ['require', 'exports', 'utility'],
    function(require, exports, Utility) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                var createTime = this.get("createTime");
                if (createTime) this.set("createTimeStr", new Date(createTime).format("yyyy/MM/dd hh:mm:ss"));
                this.set("isChecked", false);
            }
        });

        var Collection = Backbone.Collection.extend({

            model: Model,

            initialize: function() {},

            getVersionList: function(args) {
                var url = BASE_URL + "/channelManager/configuration/getVersionList",
                    successCallback = function(res) {
                        this.reset();
                        if (res) {
                            _.each(res, function(element, index, list) {
                                this.push(new Model(element));
                            }.bind(this))
                            this.trigger("get.channel.history.success", res);
                        } else {
                            this.trigger("get.channel.history.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("get.channel.history.error", response);
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            }
        });

        return Collection;
    });