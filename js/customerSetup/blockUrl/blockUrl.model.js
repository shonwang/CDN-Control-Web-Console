define("blockUrl.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var createTime = this.get("date"),
                status = this.get("status");
                op = this.get("op");
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            /*if (status === 1) this.set("statusName", '屏蔽成功');
            if (status === 2) this.set("statusName", '屏蔽失败');
            if (status === 3) this.set("statusName", '屏蔽中');
            if (status === 4) this.set("statusName", '解除屏蔽中');
            if (status === 5) this.set("statusName", '解除屏蔽失败');
            if (op === 1) this.set("opName", '屏蔽');
            if (op === 2) this.set("opName", '解除屏蔽');
            if (op === 3) this.set("opName", '自动解除屏蔽')*/
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
        blockUrls : function(args){
            var url = BASE_URL + "/blockurl/blockUrls",
            successCallback = function(res){
                if(res){
                     this.trigger('blockUrls.success',res);
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
        queryHistory: function(args){
            var url = BASE_URL + "/channelManager/user/getUserList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res.data, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.totalCount;
                    this.trigger("get.history.success");
                } else {
                    this.trigger("get.history.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.history.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
        removeBlockUrl: function(args){
            var url = BASE_URL + "/cdn/removeBlockUrl",
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
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return BlockUrlCollection;
});