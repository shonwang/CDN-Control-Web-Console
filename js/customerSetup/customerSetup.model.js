define("customerSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var createTime = this.get("createTime"),
                status = this.get("status");

            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            if (status === 1) this.set("statusName", '<span class="text-success">正常</span>');
            if (status === 2) this.set("statusName", '<span class="text-danger">停止</span>');
        }
    });

    var CustomerSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryChannel: function(args){
            var url = BASE_URL + "/rs/channel/query",
                url = "http://192.168.158.91:8090/channelManager/user/getUserList",
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

    return CustomerSetupCollection;
});