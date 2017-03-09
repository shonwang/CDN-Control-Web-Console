define("setupTopoManageSendStrategy.model", ['require','exports', 'utility', 'setupTopoManage.model'], 
    function(require, exports, Utility, SetupTopoManageCollection) {
    var Model = Backbone.Model.extend({
        initialize: function(){
           var createTime = this.get('createTime')
           this.set("createTime", new Date(createTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var SetupTopoManageSendStrategyCollection = SetupTopoManageCollection.extend({ 
        
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
        },

        addSendView: function(args){
            var url = BASE_URL + "/cd/strategy",
            successCallback = function(res){
                if(res){
                    //this.total = res.total;
                    this.trigger("add.SendView.success",res);
                }else{
                    this.trigger("add.SendView.error");
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('add.SendView.error',response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getSendViewDetail: function(args){
            var url = BASE_URL + "/cd/strategy/"+args,
            successCallback = function(res){
                if(res){
                    //this.total = res.total;
                    this.trigger("get.SendViewDetail.success",res);
                }else{
                    this.trigger("get.SendViewDetail.error");
                }
            }.bind(this),
            
            errorCallback = function(response){
                this.trigger('get.SendViewDetail.error',response);
            }.bind(this);
            
            Utility.getAjax(url,'',successCallback, errorCallback);
        },

        modifySendStrategy: function(args){
             var url = BASE_URL + "/cd/strategy/"+args.id,
            successCallback = function(res){
                if(res){
                    //this.total = res.total;
                    this.trigger("modify.SendStrategy.success",res);
                }else{
                    this.trigger("modify.SendStrategy.error");
                }
            }.bind(this),
            
            errorCallback = function(response){
                this.trigger('modify.SendStrategy.error',response);
            }.bind(this);
            
            Utility.postAjax(url, args,successCallback, errorCallback);
        },

        deleteSendStrategy: function(args){
            var url = BASE_URL + "/cd/strategy/"+args,
            successCallback = function(res){
                if(res){
                    //this.total = res.total;
                    this.trigger("delete.SendStrategy.success",res);
                }else{
                    this.trigger("delete.SendStrategy.error");
                }
            }.bind(this),
            
            errorCallback = function(response){
                this.trigger('delete.SendStrategy.error',response);
            }.bind(this);
            
            Utility.deleteAjax(url, '',successCallback, errorCallback);
        },

        setDefaultStrategy: function(args){
            var url = BASE_URL + "/cd/strategy/default?strategyId="+args,
            successCallback = function(res){
                if(res){
                    //this.total = res.total;
                    this.trigger("set.DefaultStrategy.success",res);
                }else{
                    this.trigger("set.DefaultStrategy.error");
                }
            }.bind(this),
            
            errorCallback = function(response){
                this.trigger('set.DefaultStrategy.error',response);
            }.bind(this);
            
            Utility.postAjax(url, '',successCallback, errorCallback);
        }
    });

    return SetupTopoManageSendStrategyCollection;
});