define("sharedSetup.model", ['require', 'exports', 'utility', 'setupTopoManage.model'],
    function(require, exports, Utility, SetupTopoManageCollection) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                var businessType = this.get("type"),
                    createdTime= this.get("createdTime"),
                    sharedDomain = this.get("sharedDomain");

                if (sharedDomain) this.set("sharedDomainNum", sharedDomain.split(',').length)

                if (businessType === 1) this.set("businessTypeName", '下载加速');
                if (businessType === 2) this.set("businessTypeName", '直播加速');
                if (businessType === 3) this.set("businessTypeName", '直播推流加速');

                if (createdTime) this.set("createdTimeFormated", new Date(createdTime).format("yyyy/MM/dd hh:mm"));
            }
        });

        var SharedSetupCollection = SetupTopoManageCollection.extend({

            model: Model,

            initialize: function() {},

            getConfigSharedGroup: function(args) {
                var url = BASE_URL + "/channelManager/configSharedGroup/getConfigSharedGroup",
                    successCallback = function(res) {
                        this.reset();
                        if (res) {
                            _.each(res.data, function(element, index, list) {
                                this.push(new Model(element));
                            }.bind(this))
                            this.total = res.totalCount;
                            this.trigger("get.configSharedGroup.success");
                        } else {
                            this.trigger("get.configSharedGroup.error");
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("get.configSharedGroup.error", response);
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            },

            getDomains: function(args) {
                var url = BASE_URL + "/channelManager/domain/getDomains",
                    successCallback = function(res) {
                        if (res) {
                            this.trigger("get.domain.success", res);
                        } else {
                            this.trigger("get.domain.error", res);
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("get.domain.error", response);
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            },

            addConfigSharedGroup: function(args) {
                var url = BASE_URL + "/channelManager/configSharedGroup/addConfigSharedGroup",
                    successCallback = function(res) {
                        this.trigger("set.configSharedGroup.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("set.configSharedGroup.error", response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            },

            deleteConfigSharedGroup: function(args) {
                var url = BASE_URL + "/channelManager/configSharedGroup/deleteConfigSharedGroup",
                    successCallback = function(res) {
                        this.trigger("delete.configSharedGroup.success", res);
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("delete.configSharedGroup.error", response);
                    }.bind(this);
                Utility.getAjax(url, args, successCallback, errorCallback);
            },
        });

        return SharedSetupCollection;
    });