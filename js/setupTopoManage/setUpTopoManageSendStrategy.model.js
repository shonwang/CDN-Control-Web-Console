define("setupTopoManageSendStrategy.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var createTime = this.get('createTime')
            
            createTime = this.set("createTime", new Date(createTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var SetupTopoManageSendStrategyCollection = Backbone.Collection.extend({
        
        model: Model,
        initialize: function(){},
        getSendinfo: function(args){
            var url = BASE_URL + "/cd/strategy/list",
            successCallback = function(res){
                this.reset();
                if(res){
                    _.each(res.rows,function(element, index ,list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.sendInfo.success",res);
                }else{
                    this.trigger("get.sendInfo.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.sendInfo.error',response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        getOriginSendinfo: function(args){
            var url = BASE_URL + "/resource/topo/info/list",
            successCallback = function(res){
                if(res){
                    this.total = res.total;
                    this.trigger("get.OriginsendInfo.success",res);
                }else{
                    this.trigger("get.OriginsendInfo.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('get.OriginsendInfo.error',response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return SetupTopoManageSendStrategyCollection;
});