define("specialLayerManage.model", ['require', 'exports', 'utility', 'setupTopoManage.model'],
    function(require, exports, Utility, SetupTopoManageCollection) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                var createTime = this.get('createTime'),
                    updateTime = this.get('updateTime');

                createTime = this.set("createTimeStr", new Date(createTime).format("yyyy/MM/dd hh:mm"));
                updateTime = this.set("updateTimeStr", new Date(updateTime).format("yyyy/MM/dd hh:mm"));
                //this.set('checked',false);
            }
        });

        var SpecialLayerManageCollection = SetupTopoManageCollection.extend({

            model: Model,

            initialize: function() {},

            getStrategyList: function(args) {
                var url = BASE_URL + "/resource/special/getStrategyList",
                    successCallback = function(res) {
                        this.reset();
                        if (res) {
                            _.each(res.rows, function(element, index, list) {
                                this.push(new Model(element));
                            }.bind(this))
                            this.total = res.total;
                            this.trigger("get.strategyList.success");
                        } else {
                            this.trigger("get.strategyList.error");
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('get.strategyList.error', response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            getStrategyInfoById: function(args) {
                var url = BASE_URL + "/resource/special/getStrategyInfo",
                    successCallback = function(res) {
                        if (res) {
                            this.trigger("get.devicetype.success", res);
                        } else {
                            this.trigger("get.devicetype.error");
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('get.devicetype.error');
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            },
        });

        return SpecialLayerManageCollection;
    });