define("domainList.model", ['require','exports','utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var auditStatus = this.get("auditStatus");
            /**审核状态，0审核中，1正常运行，2审核失败，3停止，-1删除，4配置中，5配置失败 */
            if (auditStatus === 0) this.set("statusName", '<span class="text-info">审核中</span>');
            if (auditStatus === 1) this.set("statusName", '<span class="text-success">正常</span>');
            if (auditStatus === 2) this.set("statusName", '<span class="text-warning">审核失败</span>');
            if (auditStatus === 3) this.set("statusName", '<span class="text-danger">停止</span>');
            if (auditStatus === 4) this.set("statusName", '<span class="text-default">配置中</span>');
            if (auditStatus === 5) this.set("statusName", '<span class="text-warning">配置失败</span>');
            if (auditStatus === -1) this.set("statusName", '<span class="text-danger">删除</span>');

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
        }
    });

    var DomainListCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryDomain: function(args){
            var url = BASE_URL + "domainlist/domains/get";
            var url = "http://192.168.158.91:8090/channelManager/domain/getDomainBasicList";

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
  
        submitDomain: function(args){
            var url = BASE_URL + "domainbase/add";
            var url = "http://192.168.158.91:8090/channelManager/domain/addDomainBasic";
            Utility.postAjax(url, args, function(res){
                if(res == 1){
                    this.trigger("submit.domain.success");
                } else {
                    this.trigger("submit.domain.error");
                }
            }.bind(this),function(res){
                this.trigger("submit.domain.error", res);
            }.bind(this));
        }
	});

    return DomainListCollection;
});