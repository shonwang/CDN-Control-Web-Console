define("specialLayerManage.model", ['require', 'exports', 'utility', 'setupTopoManage.model'],
    function(require, exports, Utility, SetupTopoManageCollection) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                var createTime = this.get('createTime'),
                    type = this.get('type'),
                    updateTime = this.get('updateTime');

                createTime = this.set("createTimeStr", new Date(createTime).format("yyyy/MM/dd hh:mm"));
                updateTime = this.set("updateTimeStr", new Date(updateTime).format("yyyy/MM/dd hh:mm"));
                if (type === 200) this.set("typeName", 'LVS');
                if (type === 201) this.set("typeName", 'Relay');
                if (type === 202) this.set("typeName", 'Cache');
                if (type === 203) this.set("typeName", 'Live');
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
                            this.trigger("get.strategyList.error", res);
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
                            this.trigger("get.strategyInfoById.success", res);
                        } else {
                            this.trigger("get.strategyInfoById.error");
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('get.strategyInfoById.error');
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            },

            addStrategy: function(args) {
                var url = BASE_URL + "/resource/special/addStrategy",
                    successCallback = function(res) {
                        this.trigger("add.strategy.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('add.strategy.error', response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            modifyStrategy: function(args) {
                var url = BASE_URL + "/resource/special/modifyStrategy",
                    successCallback = function(res) {
                        this.trigger("modify.strategy.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('modify.strategy.error', response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            deleteStrategy: function(args) {
                var url = BASE_URL + "/resource/special/deleteStrategy",
                    successCallback = function(res) {
                        this.trigger("delete.strategy.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger('delete.strategy.error', response);
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            },
        });

        return SpecialLayerManageCollection;
    });