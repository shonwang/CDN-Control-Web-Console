define("blockUrl.strategy.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var policy  = this.get("policy"), policyStr;
            if (policy === 1) 
                policyStr = "强制去问号";
            else if (policy === 2)
                policyStr = "强制去@符"
            this.set("policyStr", policyStr)
        }
    });

    var BlockUrlCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        searchPolicyConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/getDomainInfoList";

            Utility.postAjax(url, args, function(res){
                this.reset();
                if (res){
                    _.each(res.data, function(element, index, list){
                        element.originDomain.policy = (index%2 === 0 ? 1 : 2)
                        this.push(new Model(element.originDomain));
                    }.bind(this))
                    this.total = res.totalCount;
                    this.trigger("get.domain.success");
                } else {
                    this.trigger("get.domain.error"); 
                } 
            }.bind(this),function(res){
                this.trigger("get.domain.error", res);
            }.bind(this));
        },

        getDomainList: function(args){
            var url = BASE_URL + "/channelManager/domain/getDomainInfoList";
            Utility.postAjax(url, args, function(res){
                if (res){
                    this.trigger("query.domain.success", res.data);
                } else {
                    this.trigger("query.domain.error", res); 
                } 
            }.bind(this),function(res){
                this.trigger("query.domain.error", res);
            }.bind(this));
        },

        savePolicyConfig: function(args){
            var url = BASE_URL + "/blockurl/savePolicyConfig";
            Utility.postAjax(url, args, function(res){
                if (res&&res.code === 200){
                    this.trigger("save.policy.success", res);
                } else {
                    this.trigger("save.policy.error", res); 
                } 
            }.bind(this),function(res){
                this.trigger("save.policy.error", res);
            }.bind(this));
        },

        updatePolicyConfig: function(args){
            var url = BASE_URL + "/blockurl/updatePolicyConfig";
            Utility.postAjax(url, args, function(res){
                if (res&&res.code === 200){
                    this.trigger("save.policy.success", res);
                } else {
                    this.trigger("save.policy.error", res); 
                } 
            }.bind(this),function(res){
                this.trigger("save.policy.error", res);
            }.bind(this));
        },

        delPolicyConfig: function(args){
            var url = BASE_URL + "/blockurl/delPolicyConfig";
            Utility.postAjax(url, args, function(res){
                if (res&&res.code === 200){
                    this.trigger("delete.policy.success", res);
                } else {
                    this.trigger("delete.policy.error", res); 
                } 
            }.bind(this),function(res){
                this.trigger("delete.policy.error", res);
            }.bind(this));
        },
    });

    return BlockUrlCollection;
});