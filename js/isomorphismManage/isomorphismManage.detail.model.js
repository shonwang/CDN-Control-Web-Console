define("isomorphismManage.detail.model", ['require', 'exports', 'utility'],
    function(require, exports, Utility) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                this.set("id", Utility.randomStr(8))
                var createTime = this.get("createTime");
                if (createTime) this.set("createTimeStr", new Date(createTime).format("yyyy/MM/dd hh:mm:ss"));
                this.set("isChecked", false);
            }
        });

        var Collection = Backbone.Collection.extend({

            model: Model,

            initialize: function() {},

            getVersionList: function(args) {
                var url = BASE_URL + "/cd/diffcfg/domain/version/list",
                    successCallback = function(res) {
                        this.reset();
                        if (res) {
                            _.each(res, function(element, index, list) {
                                this.push(new Model(element));
                            }.bind(this))
                            this.trigger("get.domain.version.success", res);
                        } else {
                            this.trigger("get.domain.version.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("get.domain.version.error", response);
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            },

            compare: function(args) {
                var url = BASE_URL + "/cd/diffcfg/domain/version/compare",
                    successCallback = function(res) {
                        if (res) {
                            this.trigger("get.compare.success", res);
                        } else {
                            this.trigger("get.compare.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("get.compare.error", response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            editCompare: function(args) {
                var url = BASE_URL + "/cd/diffcfg/domain/editing/compare",
                    successCallback = function(res) {
                        if (res) {
                            this.trigger("get.compare.success", res);
                        } else {
                            this.trigger("get.compare.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("get.compare.error", response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            nodelist: function(args) {
                var url = BASE_URL + "/cd/api/domain/version/nodelist",
                    successCallback = function(res) {
                        if (res) {
                            this.trigger("get.nodelist.success", res);
                        } else {
                            this.trigger("get.nodelist.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("get.nodelist.error", response);
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            },
            
            publishandsaveconfig: function(args) {
                var url = BASE_URL + "/cg/domain/publishandsaveconfig",
                    successCallback = function(res) {
                        this.trigger("get.publish.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("get.publish.error", response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },
        });

        return Collection;
    });