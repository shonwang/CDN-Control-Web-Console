define("applicationChange.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var type = this.get("type");
            if (type === 1) this.set("typeName", '下载');
            if (type === 2) this.set("typeName", '直播');   
            var applicationType = this.get('applicationType');
            if(applicationType == 202) this.set("applicationTypeName","Cache");
            if(applicationType == 203) this.set("applicationTypeName","Live");

            var auditStatus = this.get("auditStatus");
            if(auditStatus == -1) this.set("auditStatusName","删除");
            if(auditStatus == 0) this.set("auditStatusName","审核中");
            if(auditStatus == 1) this.set("auditStatusName","审核通过");
            if(auditStatus == 2) this.set("auditStatusName","审核失败");
            if(auditStatus == 3) this.set("auditStatusName","停止");
            if(auditStatus == 4) this.set("auditStatusName","配置中");
            if(auditStatus == 5) this.set("auditStatusName","配置失败");
            if(auditStatus == 6) this.set("auditStatusName","编辑中");
            if(auditStatus == 7) this.set("auditStatusName","待下发");
            if(auditStatus == 8) this.set("auditStatusName","待定制");
            if(auditStatus == 9) this.set("auditStatusName","定制化配置错误");
            if(auditStatus == 10) this.set("auditStatusName","下发中");
            if(auditStatus == 11) this.set("auditStatusName","下发失败");
            if(auditStatus == 12) this.set("auditStatusName","下发成功");
            if(auditStatus == 13) this.set("auditStatusName","运行");
            if(auditStatus == 14) this.set("auditStatusName","配置失败");

        }
    });

    var ApplicationChangeCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getTopoinfo: function(args) {
            var url = BASE_URL + "/resource/topo/info/list",
                successCallback = function(res) {
                    this.trigger("get.topoInfo.success",res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.topoInfo.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getApplication:function(args){
            var url = BASE_URL + "/channelManager/domain/getApplication",
                successCallback = function(res) {
                    this.reset();
                    if(res){
                        this.push(new Model(res.data));
 
                        this.trigger("get.applicaction.success");
                    }
                    else{
                        this.trigger('get.applicaction.error');
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.applicaction.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);        
        },

        modifyApplication:function(args){
            var url = BASE_URL + "/channelManager/domain/modifyApplication",
                successCallback = function(res) {
                    this.trigger("modify.application.success",res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('modify.application.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);            
        }

    });

    return ApplicationChangeCollection;
});