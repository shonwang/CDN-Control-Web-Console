define("isomorphismManage.model", ['require', 'exports', 'utility', 'setupTopoManage.model'],
    function(require, exports, Utility, SetupTopoManageCollection) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                var businessType = this.get("subType"),
                    status = this.get("status"),
                    protocol = this.get("protocol"),
                    cdnFactory = this.get("cdnFactory"),
                    confCustomType = this.get("confCustomType");

                if (status === 0) this.set("statusName", React.createElement("span", {
                    className: "text-primary"
                }, null, "审核中"));
                if (status === 1) this.set("statusName", React.createElement("span", {
                    className: "text-success"
                }, null, "审核通过"));
                if (status === -1) this.set("statusName", React.createElement("span", {
                    className: "text-danger"
                }, null, "删除"));
                if (status === 2) this.set("statusName", React.createElement("span", {
                    className: "text-danger"
                }, null, "审核失败"));
                if (status === 3) this.set("statusName", React.createElement("span", {
                    className: "text-danger"
                }, null, "停止"));
                if (status === 4) this.set("statusName", React.createElement("span", {
                    className: "text-primary"
                }, null, "配置中"));
                if (status === 6) this.set("statusName", React.createElement("span", {
                    className: "text-primary"
                }, null, "编辑中"));
                if (status === 14) this.set("statusName", React.createElement("span", {
                    className: "text-danger"
                }, null, "配置失败"));
                if (status === 7) this.set("statusName", React.createElement("span", {
                    className: "text-primary"
                }, null, "待下发"));
                if (status === 8) this.set("statusName", React.createElement("span", {
                    className: "text-primary"
                }, null, "待定制"));
                if (status === 9) this.set("statusName", React.createElement("span", {
                    className: "text-danger"
                }, null, "定制化配置错误"));
                if (status === 10) this.set("statusName", React.createElement("span", {
                    className: "text-primary"
                }, null, "下发中"));
                if (status === 11) this.set("statusName", React.createElement("span", {
                    className: "text-danger"
                }, null, "下发失败"));
                if (status === 12) this.set("statusName", React.createElement("span", {
                    className: "text-primary"
                }, null, "下发成功"));
                if (status === 13) this.set("statusName", React.createElement("span", {
                    className: "text-success"
                }, null, "运行中"));

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
                var url = BASE_URL + "/cd/diffcfg/domain/list",
                    successCallback = function(res) {
                        this.reset();
                        if (res) {
                            _.each(res.rows, function(element, index, list) {
                                this.push(new Model(element));
                            }.bind(this))
                            this.total = res.total;
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

        return IsomorphismManageCollection;
    });