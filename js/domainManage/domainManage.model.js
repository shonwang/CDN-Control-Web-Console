define("domainManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            //加速类型
            if(this.get("type") === 1) this.set("type_name","下载"); 
            if(this.get("type") === 2) this.set("type_name","直播"); 
            //审核状态
            if(this.get("audit_status") === 0) this.set("audit_status_name","审核中");
            if(this.get("audit_status") === -1) this.set("audit_status_name","删除");
            if(this.get("audit_status") === 1) this.set("audit_status_name","审核通过");
            if(this.get("audit_status") === 2) this.set("audit_status_name","审核驳回");
            if(this.get("audit_status") === 3) this.set("audit_status_name","暂停");
            //回源类型
            if(this.get("origin_type") === 1) this.set("origin_type_name","IP");
            if(this.get("origin_type") === 2) this.set("origin_type_name","源站域名");
            if(this.get("origin_type") === 3) this.set("origin_type_name","OSS域名");
            //过滤参数
            if(this.get("conf_param") === true) this.set("conf_param_name","是");
            if(this.get("conf_param") === false) this.set("conf_param_name","否");
            //range回源
            if(this.get("conf_range") === true) this.set("conf_range_name","是");
            if(this.get("conf_range") === false) this.set("conf_range_name","否");
            //Referer可否为空
            if(this.get("refer_nullable") === true) this.set("refer_nullable_name","是");
            if(this.get("refer_nullable") === false) this.set("refer_nullable_name","否");
            //Referer防盗链开关及类型
            if(this.get("refer_visit_control") === 0) this.set("refer_visit_control_name","关闭");
            if(this.get("refer_visit_control") === 1) this.set("refer_visit_control_name","白名单");
            if(this.get("refer_visit_control") === 2) this.set("refer_visit_control_name","黑名单");
            //IP防盗链开关及类型
            if(this.get("ip_visit_control") === 0) this.set("ip_visit_control_name","关闭");
            if(this.get("ip_visit_control") === 1) this.set("ip_visit_control_name","白名单");
            if(this.get("ip_visit_control") === 2) this.set("ip_visit_control_name","黑名单");
            //泛域名标识
            if(this.get("wildcard") === 1) this.set("wildcard_name","普通域名"); 
            if(this.get("wildcard") === 2) this.set("wildcard_name","泛域名"); 
            //回源host头类型
            if(this.get("host_type") === 1) this.set("host_type_name","加速域名"); 
            if(this.get("host_type") === 2) this.set("host_type_name","回源域名"); 
            //使用的协议
            if(this.get("protocol") === 1) this.set("protocol_name","http+flv"); 
            if(this.get("protocol") === 2) this.set("protocol_name","hls"); 
            if(this.get("protocol") === 3) this.set("protocol_name","rtmp"); 
            //源站是否有缓存规则
            if(this.get("has_origin_policy") === true) this.set("has_origin_policy_name","有"); 
            if(this.get("has_origin_policy") === false) this.set("has_origin_policy_name","没有"); 
        }
    });

    var DomainManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getDomainList: function(args){
            var url = BASE_URL + "/origin/getPage";
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

        addDomain: function(args){
            var url = BASE_URL + "/origin/addOrigin";
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
            var url = BASE_URL + "/origin/editOrigin";
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
            var url = BASE_URL + "/origin/deleteOrigin?originId="+args;
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

        sendDomain: function(args){
            var url = BASE_URL + "/origin/sendOrigin?originId="+args;
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
            var url = BASE_URL + "/origin/getPolicyByOrigin?originId="+args;
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