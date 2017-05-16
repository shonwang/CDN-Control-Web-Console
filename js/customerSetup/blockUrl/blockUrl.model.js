define("blockUrl.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var op=this.get("op");
            var successRatioName = this.get("successRatio") ==-1?"---":this.get("successRatio")+"%";
            if(op == 1){
                this.set("statusName","屏蔽中");
                this.set("general","下发中");
            }
            else if(op == 2 ){
                this.set("statusName","解除屏蔽中");
                this.set("general","下发中");
            }
            else if(op == 7 ){
                this.set("statusName","刷新中");
                this.set("general","下发中");
            }

            else if(op == 3 ){
                this.set("statusName","屏蔽完成");
                this.set("general",successRatioName);
            }
            else if(op == 5 ){
                this.set("statusName","解除屏蔽完成");
                this.set("general",successRatioName);
            }
            
            else if(op == 9 ){
                this.set("statusName","刷新完成");
                this.set("general",successRatioName);
            }
            else if(op == 10 ){
                this.set("statusName","已失效");
            }
        }
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
                     }else if(res.status == 202) {
                        var result = res.result.join(';');
                        alert(result+'已在当前屏蔽列表中,请重新输入');
                        return;
                     }
                     else{
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
        
        getCurrentBlockDetail:function(args){
            var _data = {
                id:args.id,
                page:args.page,
                rows:args.rows
            };
            var url = BASE_URL + "/blockurl/blockNodeDetail",
            successCallback = args.success;
            errorCallback = args.error;
            Utility.postAjax(url, _data, successCallback, errorCallback);
        },

        showCurrentBlockUrls: function(args){
            var url = BASE_URL + "/blockurl/showCurrentBlockUrls?userId="+args.userId+'&op='+args.op+'&searchUrl='+args.searchUrl+'&page='+args.page+'&rows='+args.rows,
            successCallback = function(res){
                /*var res = {
                   "status":200,
                   "taskBlockResult":{
                         "totalNumber":20,
                          "resultList":[
                                {
                                    "id": 1,
                                    "taskId" : "xxxxx",
                                    "url" : "http://baidu.com",
                                    "date" : "2016/12/05 12:00",
                                    "status" : "屏蔽成功",
                                    "isRefreshSuccess" :0
                                },
                                {
                                    "id": 2,
                                    "taskId" : "xxxxx",
                                    "url" : "http://baidu.com",
                                    "date" : "2016/12/05 12:00",
                                    "status" : "屏蔽失败",
                                    "isRefreshSuccess":1
                                }
                          ]
                   }
                }*/
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