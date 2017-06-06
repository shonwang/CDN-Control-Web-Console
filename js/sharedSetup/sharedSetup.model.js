define("sharedSetup.model", ['require', 'exports', 'utility', 'setupTopoManage.model'],
    function(require, exports, Utility, SetupTopoManageCollection) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                var businessType = this.get("subType"),
                    status = this.get("auditStatus"),
                    sharedDomain = this.get("sharedDomain");

                if (sharedDomain) this.set("sharedDomainNum", sharedDomain.split(',').length)

                if (businessType === 1) this.set("businessTypeName", '下载加速');
                if (businessType === 2) this.set("businessTypeName", '直播加速');
                if (businessType === 3) this.set("businessTypeName", '直播推流加速');
            }
        });

        var SharedSetupCollection = SetupTopoManageCollection.extend({

            model: Model,

            initialize: function() {},

            queryChannel: function(args) {
                var url = BASE_URL + "/channelManager/domain/getChannelManager",
                    successCallback = function(res) {
                        this.reset();
                        if (res) {
                            _.each(res.data, function(element, index, list) {
                                this.push(new Model(element));
                            }.bind(this))
                            this.total = res.totalCount;
                            this.trigger("get.channel.success");
                        } else {
                            this.trigger("get.channel.error");
                        }
                    }.bind(this),
                    errorCallback = function(response) {
                        this.trigger("get.channel.error", response);
                    }.bind(this);
                Utility.postAjax(url, args, successCallback, errorCallback);
            }
        });

        return SharedSetupCollection;
    });