define("domainManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
        }
    });

    var DomainManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getNodeGroupList: function(args){
            var url = BASE_URL + "/seed/config/release/nodeGroupList?bisTypeId="+args;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
            	this.reset();
                if (res){
                    this.trigger("get.nodeGroupList.success");
                } else {
                    this.trigger("get.nodeGroupList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.nodeGroupList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        }

    });

    return DomainManageCollection;
});