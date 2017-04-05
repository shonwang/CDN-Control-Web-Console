define("setupChannelManage.model", ['require', 'exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function() {
            var businessType = this.get("type"),
                status = this.get("auditStatus"),
                protocol = this.get("protocol"),
                cdnFactory = this.get("cdnFactory");

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
            if (protocol === 1) this.set("protocolName", "http+hlv");
            if (protocol === 2) this.set("protocolName", "hls");
            if (protocol === 3) this.set("protocolName", "rtmp");
            if (protocol === 0) this.set("protocolName", "http");
            if (protocol === 4) this.set("protocolName", "https");
            if (!protocol) this.set("protocolName", "后端返回为空");
            if (cdnFactory === 1) this.set("cdnFactoryName", '自建');
            if (cdnFactory === 2) this.set("cdnFactoryName", '网宿');
            if (cdnFactory === 3) this.set("cdnFactoryName", '自建+网宿');

            this.set("tempUseCustomized", 1)
        }
    });

    var SetupChannelManageCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function() {},

        predelivery: function(args) {
            var url = BASE_URL + "/cd/predelivery",
                successCallback = function(res) {
                    this.trigger("post.predelivery.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('post.predelivery.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

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
        },

        addTopologyList: function(args) {
            var url = BASE_URL + "/channelManager/topology/addTopologyList",
                successCallback = function(res) {
                    this.trigger("add.channel.topology.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("add.channel.topology.error", response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTopoOrigininfo: function(args) {
            var url = BASE_URL + "/resource/topo/origin/consoleInfo?id=" + args,
                successCallback = function(res) {
                    if (res) {
                        this.total = res.total;
                        this.trigger("get.topo.OriginInfo.success", res);
                    } else {
                        this.trigger("get.topo.OriginInfo.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.topo.OriginInfo.error', response)
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getRuleOrigin: function(args) {
            var url = BASE_URL + "/resource/topo/rule/consoleOrigin?ruleIds=" + args,
                successCallback = function(res) {
                    if (res) {
                        this.total = res.total;
                        this.trigger("get.rule.origin.success", res);
                    } else {
                        this.trigger("get.rule.origin.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.rule.origin.error', response)
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        specilaAdd: function(args) {
            var url = BASE_URL + "/resource/topo/add/special/rule",
                successCallback = function(res) {
                    if (res) {
                        this.trigger("add.special.success", res);
                    } else {
                        this.trigger("add.special.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('add.special.error', response);
                }.bind(this);

            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTopologyRule: function(args) {
            var url = BASE_URL + "/channelManager/topology/getTopologyRoleByOriginId?originId=" + args,
                successCallback = function(res) {
                    if (res)
                        this.trigger("getTopologyRule.success", res);
                    else
                        this.trigger("getTopologyRule.error");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("getTopologyRule.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addTopologyRule: function(args) {
            var url = BASE_URL + '/channelManager/topology/addTopologyRole',
                successCallback = function(res) {
                    this.trigger("addTopologyRule.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("addTopologyRule.error", response);
                }.bind(this);

            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getDomainInfo: function(args) {
            var url = BASE_URL + "/channelManager/domain/getDomainInfo",
                successCallback = function(res) {
                    if (res) {
                        this.trigger("get.domainInfo.success", res);
                    } else {
                        this.trigger("get.domainInfo.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.domainInfo.error", response);
                }.bind(this);
            args.t = new Date().valueOf();
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addTopologyRuleList: function(args) {
            var url = BASE_URL + '/channelManager/topology/addTopologyRoleList',
                successCallback = function(res) {
                    this.trigger("set.layerStrategy.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('set.layerStrategy.error', response)
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        isTopoStrategyMatch: function(args) {
            var url = BASE_URL + '/resource/special/isTopoStrategyMatch',
                successCallback = function(res) {
                    if (res) {
                        this.trigger("get.isTopoStrategyMatch.success", res);
                    } else {
                        this.trigger("get.isTopoStrategyMatch.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.isTopoStrategyMatch.error', response)
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return SetupChannelManageCollection;
});