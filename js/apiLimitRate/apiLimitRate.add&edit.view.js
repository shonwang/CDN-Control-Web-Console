define("apiLimitRate.add&edit.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var ApiLimitRateAddOrEditView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model
          
            if(this.isEdit){
                this.defaultParam = {
                    "uri"        : this.model.uri,
                    "rate"       : this.model.applicationType,
                    "nginxCount" : this.model.topoId,
                    "appCount"   : this.model.topoName,
                    "status"     : this.model.dispgroupName,
                    "notifyGroup": this.model.dispgroupId,
                }
                this.initEditSetup();
            }else{
                this.defaultParam = {
                    "uri"        : null,
                    "rate"       : null,
                    "nginxCount" : null,
                    "appCount"   : null,
                    "status"     : null,
                    "notifyGroup": null
                }
            }
            this.$el = $(_.template(template['tpl/apiLimitRate/apiLimitRate.add&edit.html'])({
                data: this.defaultParam
            }));
            
        },

        initEditSetup: function(){
            this.$el.find("#input-uri").val(this.defaultParam.uri)
            this.$el.find("#input-rate").val(this.defaultParam.rate)
            this.$el.find("#input-nginxCount").val(this.defaultParam.nginxCount)
            this.$el.find("#input-appCount").val(this.defaultParam.appCount)
            this.$el.find("#input-status").val()
            this.$el.find("#input-notifyGroup").val(this.defaultParam.notifyGroup)
        },

        getArgs: function(){
            this.defaultParam.uri = this.$el.find("#input-uri").val()
            this.defaultParam.rate = parseInt(this.$el.find("#input-rate").val())
            this.defaultParam.nginxCount = parseInt(this.$el.find("#input-nginxCount").val())
            this.defaultParam.appCount = parseInt(this.$el.find("#input-appCount").val())
            this.defaultParam.status = this.$el.find("#input-status:checked").val()
            this.defaultParam.notifyGroup = this.$el.find("#input-notifyGroup").val()
            if(!this.defaultParam.uri){
                Utility.warning("请设置正确的限速URI");
                return false
            }
            if(!this.defaultParam.rate && this.defaultParam.rate >= 0){
                Utility.warning("请设置正确的速率");
                return false
            }
            if(!this.defaultParam.nginxCount && this.defaultParam.nginxCount >= 0){
                Utility.warning("拓扑不能为空");
                return false
            }
            if(!this.defaultParam.appCount && this.defaultParam.appCount >= 0){
                Utility.warning("调度组不能为空");
                return false
            }
            var postParam = {
                "userId": this.defaultParam.userId,
                "applicationType": this.defaultParam.type,
                "topoId": this.defaultParam.topoId,
                "topoName": this.defaultParam.topoName,
                "dispgroupId": this.defaultParam.dispgroupId,
                "dispgroupName": this.defaultParam.dispgroupName
            }
            return postParam
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else{
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            }
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            // this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    
    return ApiLimitRateAddOrEditView;
});