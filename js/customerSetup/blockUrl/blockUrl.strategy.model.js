define("blockUrl.strategy.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var BlockUrlCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

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
        }
    });

    return BlockUrlCollection;
});