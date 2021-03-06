define("domainManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            //加速类型
            if(this.get("type") === 1) this.set("typeName","下载"); 
            if(this.get("type") === 2) this.set("typeName","直播"); 
            //审核状态
            if(this.get("auditStatus") === 0) this.set("auditStatusName",'<span class="label label-info">审核中</span>');
            if(this.get("auditStatus") === -1) this.set("auditStatusName",'<span class="label label-danger">删除</span>');
            if(this.get("auditStatus") === 1) this.set("auditStatusName",'<span class="label label-success">审核通过</span>');
            if(this.get("auditStatus") === 2) this.set("auditStatusName",'<span class="label label-default">审核驳回</span>');
            if(this.get("auditStatus") === 3) this.set("auditStatusName",'<span class="label label-warning">暂停</span>');
            //回源类型
            if(this.get("originType") === 1) this.set("originTypeName","IP");
            if(this.get("originType") === 2) this.set("originTypeName","源站域名");
            if(this.get("originType") === 3) this.set("originTypeName","OSS域名");
            //过滤参数
            if(this.get("confParamNew") === 1) this.set("confParamNewName","是");
            if(this.get("confParamNew") === 0) this.set("confParamNewName","否");
            if(this.get("confParamNew") === 2) this.set("confParamNewName","带?自定义域名");
            if(this.get("confParamNew") === 3) this.set("confParamNewName","不带?自定义域名");
            //range回源
            if(this.get("confRange") === 1) this.set("confRangeName","是");
            if(this.get("confRange") === 0) this.set("confRangeName","否");
            //Referer可否为空
            if(this.get("referNullable") === 1) this.set("referNullableName","是");
            if(this.get("referNullable") === 0) this.set("referNullableName","否");
            //Referer防盗链开关及类型
            if(this.get("referVisitControl") === 0) this.set("referVisitControlName","关闭");
            if(this.get("referVisitControl") === 1) this.set("referVisitControlName","白名单");
            if(this.get("referVisitControl") === 2) this.set("referVisitControlName","黑名单");
            //IP防盗链开关及类型
            if(this.get("ipVisitControl") === 0) this.set("ipVisitControlName","关闭");
            if(this.get("ipVisitControl") === 1) this.set("ipVisitControlName","白名单");
            if(this.get("ipVisitControl") === 2) this.set("ipVisitControlName","黑名单");
            //泛域名标识
            if(this.get("wildcard") === 1 || this.get("wildcard") === "1") this.set("wildcardName","普通域名"); 
            if(this.get("wildcard") === 2 || this.get("wildcard") === "2") this.set("wildcardName","泛域名"); 
            //回源host头类型
            if(this.get("hostType") === 1) this.set("hostTypeName","加速域名"); 
            if(this.get("hostType") === 2) this.set("hostTypeName","回源域名"); 
            //使用的协议
            if(this.get("protocol") === 1) this.set("protocolName","http+flv"); 
            if(this.get("protocol") === 2) this.set("protocolName","hls"); 
            if(this.get("protocol") === 3) this.set("protocolName","rtmp"); 
            //源站是否有缓存规则
            if(this.get("hasOriginPolicy") === true) this.set("hasOriginPolicyName","有"); 
            if(this.get("hasOriginPolicy") === false) this.set("hasOriginPolicyName","没有"); 
        }
    });

    var DomainManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getDomainList: function(args){
            var url = BASE_URL + "/rs/origin/getPage";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.domainList.success");
                } else {
                    this.trigger("get.domainList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.domainList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        sendAllOrigin: function(){
            var url = BASE_URL + "/rs/origin/sendAllOrigin";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.trigger("sendAllOrigin.domain.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("sendAllOrigin.domain.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        addDomain: function(args){
            var url = BASE_URL + "/rs/origin/addOrigin";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.success = function(res){
                this.trigger("add.domain.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.domain.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        editDomain: function(args){
            var url = BASE_URL + "/rs/origin/editOrigin";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.success = function(res){
                this.trigger("edit.domain.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("edit.domain.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        deleteDomain: function(args){
            var url = BASE_URL + "/rs/origin/deleteOrigin?originId="+args;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            //defaultParas.data = JSON.stringify(args);

            defaultParas.success = function(res){
                this.trigger("delete.domain.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("delete.domain.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
        deleteConfiguration:function(args){
            var url = BASE_URL + "/seed/conf/file/cache/delete?domains="+args;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.trigger("delete.configuration.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("delete.configuration.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
        sendDomain: function(args){
            var url = BASE_URL + "/rs/origin/sendOrigin?originId="+args;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            //defaultParas.data = JSON.stringify(args);

            defaultParas.success = function(res){
                this.trigger("send.domain.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("send.domain.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getCacheRuleList: function(args){
            var url = BASE_URL + "/rs/origin/getPolicyByOrigin?originId="+args;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            //defaultParas.data = JSON.stringify(args);

            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.cacheRuleList.success",res);
                } else {
                    this.trigger("get.cacheRuleList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.cacheRuleList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        }
    });

    return DomainManageCollection;
});