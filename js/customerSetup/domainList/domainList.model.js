define("domainList.model", ['require','exports','utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var auditStatus = this.get("originStatus");

            if (auditStatus === 0) this.set("statusName", '<span class="text-primary">审核中</span>');
            if (auditStatus === 1) this.set("statusName", '<span class="text-success">审核通过</span>');
            if (auditStatus === -1) this.set("statusName", '<span class="text-danger">删除</span>');
            if (auditStatus === 2) this.set("statusName", '<span class="text-danger">审核失败</span>');
            if (auditStatus === 3) this.set("statusName", '<span class="text-danger">停止</span>');
            if (auditStatus === 4) this.set("statusName", '<span class="text-primary">配置中</span>');
            if (auditStatus === 6) this.set("statusName", '<span class="text-primary">编辑中</span>');
            if (auditStatus === 14) this.set("statusName", '<span class="text-danger">配置失败</span>');
            if (auditStatus === 7) this.set("statusName", '<span class="text-primary">待下发</span>');
            if (auditStatus === 8) this.set("statusName", '<span class="text-primary">待定制</span>');
            if (auditStatus === 9) this.set("statusName", '<span class="text-danger">定制化配置错误</span>');
            if (auditStatus === 10) this.set("statusName", '<span class="text-primary">下发中</span>');
            if (auditStatus === 11) this.set("statusName", '<span class="text-danger">下发失败</span>');
            if (auditStatus === 12) this.set("statusName", '<span class="text-primary">下发成功</span>');
            if (auditStatus === 13) this.set("statusName", '<span class="text-success">运行中</span>');
            if (auditStatus === 15) this.set("statusName", '<span class="text-warning">暂停中</span>');
            if (auditStatus === 17) this.set("statusName", '<span class="text-danger">删除中</span>');
            if (auditStatus === 18) this.set("statusName", '<span class="text-danger">已封禁</span>');
            if (auditStatus === 19) this.set("statusName", '<span class="text-warning">封禁中</span>');
            if (auditStatus === 16) this.set("statusName", '<span class="text-info">开启中</span>');
            if (auditStatus === 20) this.set("statusName", '<span class="text-info">解禁中</span>');

            var type = this.get("subType");
            if (type === 2) this.set("typeName", '直播');
            if (type === 1) this.set("typeName", '下载');
            if (type === 3) this.set("typeName", '直播推流加速');

            var cnameData = this.get("cnameData"), cnameDomainStr = [], cdnFoctoryStr = [];
            _.each(cnameData, function(el, index, ls){
                cnameDomainStr.push(el.name);
                if (el.cdnFactory === "1") el.cdnFactoryName = "自建";
                if (el.cdnFactory === "2") el.cdnFactoryName = "网宿";
                if (el.cdnFactory === "3") el.cdnFactoryName = "自建+网宿";
                cdnFoctoryStr.push(el.cdnFactoryName);
            }.bind(this))
            this.set("cnameDomainStr", cnameDomainStr.join("<br>"));
            this.set("cdnFoctoryStr", cdnFoctoryStr.join("<br>"));

            var createTime = this.get("createTime"), updateTime = this.get("updateTime")
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            if (updateTime) this.set("updateTimeFormated", new Date(updateTime).format("yyyy/MM/dd hh:mm"));

            var confCustomType = this.get('confCustomType');
            if (confCustomType === 1) this.set('confCustomTypeName', '中控标准');
            if (confCustomType === 2) this.set('confCustomTypeName', 'open API');
            if (confCustomType === 3) this.set('confCustomTypeName', '中控定制');
        }
    });

    var DomainListCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryDomain: function(args){
            var url = BASE_URL + "/channelManager/domain/getDomainBasicList";

            Utility.postAjax(url, args, function(res){
                this.reset();
                if (res){
                    _.each(res.data, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.totalCount;
                    this.trigger("query.domain.success");
                } else {
                    this.trigger("query.domain.error"); 
                } 
            }.bind(this),function(res){
                this.trigger("query.domain.error", res);
            }.bind(this));
        },

        getDomainInfoList: function(args){
            var url = BASE_URL + "/channelManager/domain/getDomainInfoList";

            Utility.postAjax(url, args, function(res){
                this.reset();
                if (res){
                    _.each(res.data, function(element, index, list){
                        if (element.domainConf && element.originDomain){ 
                            element.originDomain.protocol = element.domainConf.protocol;
                            element.originDomain.confCustomType = element.domainConf.confCustomType;
                            this.push(new Model(element.originDomain));
                        }
                    }.bind(this))
                    this.total = res.totalCount;
                    this.trigger("query.domain.success");
                } else {
                    this.trigger("query.domain.error"); 
                } 
            }.bind(this),function(res){
                this.trigger("query.domain.error", res);
            }.bind(this));
        },
  
        submitDomain: function(args){
            var url = BASE_URL + "/channelManager/domain/addDomainBasic";
            Utility.postAjax(url, args, function(res){
                this.trigger("submit.domain.success");
            }.bind(this),function(res){
                this.trigger("submit.domain.error", res);
            }.bind(this));
        },

        getRegionBilling: function(args){
            var url = BASE_URL + "/channelManager/http/getRegionBilling",
            successCallback = function(res){
                if (res&&res.data)
                    this.trigger("get.region.success", res.data);
                else
                    this.trigger("get.region.error"); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.region.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getRegionBillingByUserId: function(args){
            var url = BASE_URL + "/channelManager/region/getRegionBillingByUserId",
            successCallback = function(res){
                if (res&&res.regions)
                    this.trigger("get.region.success", res.regions);
                else
                    this.trigger("get.region.error"); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.region.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        changeConfCustomType: function(args){
            var url = BASE_URL + "/channelManager/domain/changeConfCustomType",
            successCallback = function(res){
                if (res)
                    this.trigger("change.confCustomType.success", res);
                else
                    this.trigger("change.confCustomType.error", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("change.confCustomType.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        deletedOrigin: function(args){
            var url = BASE_URL + "/channelManager/domain/deletedOrigin",
            successCallback = function(res){
                this.trigger("delete.domain.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("delete.domain.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
	});

    return DomainListCollection;
});