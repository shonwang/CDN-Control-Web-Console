define("interfaceQuota.model", ['require','exports','utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var InterfaceQuotaCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryChannel: function(args){
            var url ="/2017-4-1/quota/query",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.length;
                    this.trigger("get.user.success");
                } else {
                    this.trigger("get.user.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.user.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
        updateQuota: function (args) {
            var url = "/2017-4-1/quota/set?userId="+ args.userId + "&quotaName=" + args.quotaName + "&quotaValue=" + args.quotaValue;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
            };
            defaultParas.success = function () {
                this.trigger('update.quota.success');
            }.bind(this);
            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText);
                this.trigger("update.quota.error", response);
            }.bind(this);
            $.ajax(defaultParas);
        }
	});

    return InterfaceQuotaCollection;
});