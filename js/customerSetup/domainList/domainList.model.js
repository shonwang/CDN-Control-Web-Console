define("domainList.model", ['require','exports','utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var auditStatus = this.get("auditStatus");
            // /**审核状态，0审核中，1正常运行，2审核失败，3停止，-1删除，4配置中，5配置失败 */
            // if (auditStatus === 0) this.set("statusName", '<span class="text-info">审核中</span>');
            // if (auditStatus === 1) this.set("statusName", '<span class="text-success">正常</span>');
            // if (auditStatus === 2) this.set("statusName", '<span class="text-warning">审核失败</span>');
            // if (auditStatus === 3) this.set("statusName", '<span class="text-danger">停止</span>');
            // if (auditStatus === 4) this.set("statusName", '<span class="text-default">配置中</span>');
            // if (auditStatus === 5) this.set("statusName", '<span class="text-warning">配置失败</span>');
            // if (auditStatus === -1) this.set("statusName", '<span class="text-danger">删除</span>');

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

            var type = this.get("type");
            /**2016/10/9 15:07:18 type    是   Integer     业务类型 1下载 2 直播 */
            if (type === 2) this.set("typeName", '直播');
            if (type === 1) this.set("typeName", '下载');

            var cnameData = this.get("cnameData"), cnameDomainStr = [], cdnFoctoryStr = [];
            _.each(cnameData, function(el, index, ls){
                cnameDomainStr.push(el.name);
                //选择CDN厂商: 1自建，2网宿，3自建+网宿
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
        }
	});

    return DomainListCollection;
});