define("userMove.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var UserMoveView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/userMove/userMove.html'])());

            this.collection.on("set.changeUser.success",$.proxy(this.onSetSuccess,this));
            this.collection.on("set.changeUser.error",$.proxy(this.onSetError,this));
            this.$el.find("#userMove-btnSubmit").on("click",$.proxy(this.onClickSaveButton,this));            
            this.initCalendar();
        },

        initCalendar: function(tpl,tplindex){
            var endTime = new Date().getTime();
            this.startTime = new Date(new Date().format("yyyy/MM/dd hh:mm")).valueOf();
            var starttime = endTime - 31 * 24 * 60 * 60 *1000;
            var startOption = {
                lang:'ch',
                minDate: new Date(starttime).format("yyyy/MM/dd"),
                maxDate: new Date().format("yyyy/MM/dd"),
                // maxTime  : new Date().format("yyyy/MM/dd hh:mm"),
                value: new Date().format("yyyy/MM/dd hh:mm"),
                //closeOnWithoutClick : false,
                timepicker: true,
                scrollInput: false,
                onChangeDateTime: function(){
                    var startTime = new Date(arguments[0]);
                    this.startTime = new Date(startTime).valueOf();
                }.bind(this)
            };
            this.$el.find('#starttime').datetimepicker(startOption);
        },

        onClickSaveButton:function(){
            var args = this.checkArgs();
            if(!args){
                return false;
            }
            
            this.collection.changeUser(args);
        },

        onSetSuccess:function(){
            var msg = "成功"
            Utility.alerts(msg,"success",3000);
        },

        onSetError:function(res){
            var msg = res.message || "失败，请重试";  
            Utility.alerts(msg,"danger",3000);
        },

        checkArgs:function(){

            var domains = this.$el.find("#userMoveDomains").val().split("\n");
            var oldUserId = this.$el.find("#oldUserId").val();
            var newUserId = this.$el.find("#newUserId").val();
            var fixTime = this.startTime;
            var remark = this.$el.find("#remark").val();

            if(!domains){
                Utility.alerts("请填加速域名","danger",3000);
                return false;
            }
            for (var i = 0; i < domains.length; i++) {
                result = Utility.isDomain(domains[i],true);
                if (!result) {
                    Utility.alerts("域名填写错误，请检查","danger",3000);
                    return false;
                }
            }

            if(!oldUserId){
                Utility.alerts("请填加原用户ID","danger",3000);
                return false;
            }
            if(!newUserId){
                Utility.alerts("请填加新用户ID","danger",3000);
                return false;
            }
            if(!remark){
                Utility.alerts("请填原因","danger",3000);
                return false;
            }

            var currentTime = new Date().valueOf();
            if(currentTime < fixTime){
                Utility.alerts("时间不能超过当前时间，请重新选择","danger",3000);
                return false;
            }

            if(oldUserId == newUserId){
                Utility.alerts("原ID与新ID不能一样","danger",3000);
                return false;
            }

            if(!Utility.isNumber(oldUserId) && !Utility.isNumber(newUserId)){
                Utility.alerts("用户ID不正确，应该输入数字","danger",3000);
                return false;
            }

            return {
                domains:domains,
                oldUserId:oldUserId,
                newUserId:newUserId,
                fixTime:fixTime,
                remark:remark
            }

        },

        hide: function(){
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return UserMoveView;
});