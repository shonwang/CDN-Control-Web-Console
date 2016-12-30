define("blockUrl.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var BlockUrlCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
        getGuestQuotaCount : function(args){
            var url = BASE_URL + "/blockurl/getGuestQuotaCount",
            successCallback = function(res){
                if(res){
                    this.trigger('get.GuestQuotaCount.success',res);
                }else{
                    this.trigger('get.GuestQuotaCount.error');
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.GuestQuotaCount.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        permissionsControl : function(args){
            var url = BASE_URL + "/blockurl/getGuestQuotaCount",
            successCallback = function(res){
                if(res){
                    this.trigger('permissionsControl.success',res);
                }else{
                    this.trigger('permissionsControl.error');
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.GuestQuotaCount.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        blockUrls : function(args){
            var url = BASE_URL + "/blockurl/blockUrls",
            successCallback = function(res){
                if(res){
                     res = JSON.parse(res);
                     if(res.status == 401) {
                        alert(res.message+'不属于此客户,请重新输入');
                        return;
                     }else{
                       this.trigger('blockUrls.success',res);
                     }
                }else{
                    this.trigger('blockUrls.error',response);
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger('blockUrls.error',response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
        showCurrentBlockUrls: function(args){
            var url = BASE_URL + "/blockurl/showCurrentBlockUrls?userId="+args.userId+'&op='+args.op+'&searchUrl='+args.searchUrl+'&page='+args.page+'&rows='+args.rows,
            successCallback = function(res){
                this.reset();
                if (res){
                    res = JSON.parse(res);
                    _.each(res.taskBlockResult.resultList, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.taskBlockResult.totalNumber;
                    this.trigger("get.blockList.success");
                } else {
                    this.trigger("get.blockList.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.blockList.error", response); 
            }.bind(this);
            Utility.postAjax(url, '', successCallback, errorCallback);
        },
        removeBlockUrl: function(args){
            var url = BASE_URL + "/blockurl/removeBlockUrl",
            successCallback = function(res){
                if(res){
                    this.trigger('remove.blockUrl.success');
                }else{
                    this.trigger('remove.blockUrl.error');
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("remove.blockUrl.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
        retryBlockTas: function(args){
            var url = BASE_URL + "/blockurl/retryBlockTas?userId="+args.userId+'&id='+args.id+'&type='+args.type,
            successCallback = function(res){
                if(res){
                    this.trigger('retry.blockTas.success');
                }else{
                    this.trigger('retry.blockTas.error');
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("retry.blockTas.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
        queryHistory: function(args){
            var url = BASE_URL + "/blockurl/searchBlockHistory?userId="+args.userId+'&date='+args.date+'&op='+args.op+'&searchUrl='+args.searchUrl+'&page='+args.page+'&rows='+args.rows,
            successCallback = function(res){
                this.reset();
                if (res){
                    res = JSON.parse(res);
                    _.each(res.taskBlockResult.resultList, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.taskBlockResult.totalNumber;
                    this.trigger("get.history.success");
                } else {
                    this.trigger("get.history.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.history.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
        
    });

    return BlockUrlCollection;
});