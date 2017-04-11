define("importDomainManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var businessType = this.get("businessType"),
                open302 = this.get("open302"),
                status = this.get("status");

            if (businessType === "1") this.set("businessTypeName", '下载加速');
            if (businessType === "2") this.set("businessTypeName", '直播加速');
            if (open302) this.set("open302Name", '<span class="text-success">开启</span>');
            if (!open302) this.set("open302Name", '<span class="text-danger">关闭</span>');
            if (!status) this.set("statusName", '后端返回了不能识别的状态');
            if (status === 1) this.set("statusName", '<span class="text-info">创建中</span>');
            if (status === 2) this.set("statusName", '<span class="text-info">修改中</span>');
            if (status === 3) this.set("statusName", '<span class="text-success">运行中</span>');
            if (status === 4) this.set("statusName", '<span class="text-danger">失败</span>');
            if (status === 5) this.set("statusName", '<span class="text-warning">封禁中</span>');
            this.set('id', Utility.randomStr(8))
        }
    });

    var ImportDomainManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryByPage: function(args){
            var url = BASE_URL + "/rs/cname/queryByPage",
            successCallback = function(res){
                this.reset();
                if(res){
                    _.each(res.rows,function(element, index ,list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.list.success", res);
                }else{
                    this.trigger("get.list.error", res); 
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.list.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        forbiddenCname: function(args){
            var url = BASE_URL + "/rs/cname/forbiddenCname",
            successCallback = function(res){
                this.trigger("set.stop.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.stop.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        activeCname: function(args){
            var url = BASE_URL + "/rs/cname/activeCname",
            successCallback = function(res){
                this.trigger("set.open.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.open.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        deleteCname: function(args){
            var url = BASE_URL + "/rs/cname/deleteCname",
            successCallback = function(res){
                this.trigger("set.delete.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.delete.error", response); 
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        editCname: function(args){
            var url = BASE_URL + "/rs/cname/editCname",
            successCallback = function(res){
                this.trigger("set.cname.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.cname.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return ImportDomainManageCollection;
});