define("interfaceQuota.model", ['require','exports','utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var InterfaceQuotaCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryChannel: function(args){
            var url = BASE_URL + "/channelManager/user/getUserList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.data, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.totalCount;
                    this.trigger("get.user.success");
                } else {
                    this.trigger("get.user.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.user.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
	});

    return InterfaceQuotaCollection;
});