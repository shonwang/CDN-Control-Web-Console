define("apiLimitRate.add&edit.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var ApiLimitRateAddOrEditView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model
            console.log("iiiii", this.model, this.isEdit)
            if(this.isEdit){
                this.defaultParam = {
                    "uri"        : this.model.uri,
                    "rate"       : this.model.rate,
                    "nginxCount" : this.model.nginxCount,
                    "appCount"   : this.model.appCount,
                    "status"     : this.model.status,
                    "notifyGroup": this.model.notifyGroup,
                }
            }else{
                this.defaultParam = {
                    "uri"        : null,
                    "rate"       : null,
                    "nginxCount" : null,
                    "appCount"   : null,
                    "status"     : null,
                    "notifyGroup": null,
                }
            }
            this.$el = $(_.template(template['tpl/apiLimitRate/apiLimitRate.add&edit.html'])({
                data: this.defaultParam
            }));
            this.initSetup()
            console.log("gggg", this.defaultParam)
            this.$el.find("#input-rate").on('keyup', $.proxy(this.onNumberOnly, this))
            this.$el.find("#input-nginxCount").on('keyup', $.proxy(this.onNumberOnly, this))
            this.$el.find("#input-appCount").on('keyup', $.proxy(this.onNumberOnly, this))
            this.$el.find("#input-rate").on('afterpaste', $.proxy(this.onNumberOnly, this))
            this.$el.find("#input-nginxCount").on('afterpaste', $.proxy(this.onNumberOnly, this))
            this.$el.find("#input-appCount").on('afterpaste', $.proxy(this.onNumberOnly, this))
        },

        onNumberOnly: function(event){
            event.target.value = event.target.value.replace(/\D/g,'')
        },

        initSetup: function(){
            this.$el.find("#input-uri").val(this.defaultParam.uri)
            this.$el.find("#input-rate").val(this.defaultParam.rate)
            this.$el.find("#input-nginxCount").val(this.defaultParam.nginxCount)
            this.$el.find("#input-appCount").val(this.defaultParam.appCount)
            this.$el.find("#input-notifyGroup").val(this.defaultParam.notifyGroup)
        },

        getArgs: function(){
            this.defaultParam.uri = this.$el.find("#input-uri").val()
            this.defaultParam.rate = parseInt(this.$el.find("#input-rate").val())
            this.defaultParam.nginxCount = parseInt(this.$el.find("#input-nginxCount").val())
            this.defaultParam.appCount = parseInt(this.$el.find("#input-appCount").val())
            this.defaultParam.status = this.$el.find("input[name='input-status']:checked").val()
            this.defaultParam.notifyGroup = this.$el.find("#input-notifyGroup").val()
            console.log("未校验前", this.defaultParam)
            if(!this.defaultParam.uri){
                Utility.warning("请设置正确的限速URI");
                return false
            }
            if(!this.defaultParam.rate || this.defaultParam.rate <= 0){
                Utility.warning("请设置正确的速率");
                return false
            }
            if(!this.defaultParam.nginxCount || this.defaultParam.nginxCount <= 0){
                Utility.warning("请设置正确的nginx数量");
                return false
            }
            if(!this.defaultParam.appCount || this.defaultParam.appCount <= 0){
                Utility.warning("请设置正确的app数量");
                return false
            }
            if(!this.defaultParam.status){
                Utility.warning("请设置正确的状态");
                return false
            }
            if(!this.defaultParam.notifyGroup){
                Utility.warning("请设置正确的报警组名");
                return false
            }
            var postParam = {
                "uri"        : this.defaultParam.uri,
                "rate"       : this.defaultParam.rate,
                "nginxCount" : this.defaultParam.nginxCount,
                "appCount"   : this.defaultParam.appCount,
                "status"     : this.defaultParam.status,
                "notifyGroup": this.defaultParam.notifyGroup,
            }
            console.log("最终提交", postParam)
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