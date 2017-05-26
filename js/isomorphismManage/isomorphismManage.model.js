define("isomorphismManage.model", ['require', 'exports', 'utility', 'setupTopoManage.model'],
    function(require, exports, Utility, SetupTopoManageCollection) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                var businessType = this.get("subType"),
                    status = this.get("auditStatus"),
                    protocol = this.get("protocol"),
                    cdnFactory = this.get("cdnFactory"),
                    confCustomType = this.get("confCustomType");

                if (status === 0) this.set("statusName", '<span class="text-primary">审核中</span>');
                if (status === 1) this.set("statusName", '<span class="text-success">审核通过</span>');
                if (status === -1) this.set("statusName", '<span class="text-danger">删除</span>');
                if (status === 2) this.set("statusName", '<span class="text-danger">审核失败</span>');
                if (status === 3) this.set("statusName", '<span class="text-danger">停止</span>');
                if (status === 4) this.set("statusName", '<span class="text-primary">配置中</span>');
                if (status === 6) this.set("statusName", '<span class="text-primary">编辑中</span>');
                if (status === 14) this.set("statusName", '<span class="text-danger">配置失败</span>');
                if (status === 7) this.set("statusName", '<span class="text-primary">待下发</span>');
                if (status === 8) this.set("statusName", '<span class="text-primary">待定制</span>');
                if (status === 9) this.set("statusName", '<span class="text-danger">定制化配置错误</span>');
                if (status === 10) this.set("statusName", '<span class="text-primary">下发中</span>');
                if (status === 11) this.set("statusName", '<span class="text-danger">下发失败</span>');
                if (status === 12) this.set("statusName", '<span class="text-primary">下发成功</span>');
                if (status === 13) this.set("statusName", '<span class="text-success">运行中</span>');

                if (businessType === 1) this.set("businessTypeName", '下载加速');
                if (businessType === 2) this.set("businessTypeName", '直播加速');
                if (businessType === 3) this.set("businessTypeName", '直播推流加速');

                if (protocol === 1) this.set("protocolName", "http+hlv");
                if (protocol === 2) this.set("protocolName", "hls");
                if (protocol === 3) this.set("protocolName", "rtmp");
                if (protocol === 0) this.set("protocolName", "http");
                if (protocol === 4) this.set("protocolName", "https");
                if (protocol === null) this.set("protocolName", "后端返回为空");

                this.set("isChecked", false);
            }
        });

        var IsomorphismManageCollection = SetupTopoManageCollection.extend({

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
            },

            getVersionList: function(args) {
                var url = BASE_URL + "/channelManager/configuration/getVersionList",
                    successCallback = function(res) {
                        if (res) {
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

        return IsomorphismManageCollection;
    });