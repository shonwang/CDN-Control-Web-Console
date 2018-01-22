define("setupSendingSwitch.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SetupSendingSwitchView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options
            this.collection = options.collection;

            this.initSetup();
        },
        
        initSetup:function(){
            this.$el = $(_.template(template['tpl/setupSendManage/setupSendingSwitch/setupSendingSwitch.html'])());
            this.$el.find("#openapiSwitch").on("click",$.proxy(this.onClickSwitchBtn,this))
            this.$el.find("#centralControlSwitch").on("click",$.proxy(this.onClickSwitchBtn,this))
            this.$el.find("#live-openapiSwitch").on("click",$.proxy(this.onClickSwitchBtn,this))
            this.$el.find("#live-centralControlSwitch").on("click",$.proxy(this.onClickSwitchBtn,this))
        },
        
        onClickSwitchBtn:function(event){
               var eventTarget=event.srcElement || event.target
               if(!eventTarget.checked){
                   Utility.confirm("关闭下发开关，将无法进行配置下发操作，请确认是否执行该操作",function(){
                      if(eventTarget.id=="openapiSwitch"){
                        console.log(1);
                      }else if(eventTarget.id=="centralControlSwitch"){
                        console.log(2)
                      }else if(eventTarget.id=="live-openapiSwitch"){
                        console.log(3)
                      }else if(eventTarget.id=="live-centralControlSwitch"){
                        console.log(4)
                      }
                   }.bind(this))
               }else{
                  
               }
        },

        onGetError: function(error) {
            if (error && error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("网络阻塞，请刷新重试！")
        },

        hide: function() {
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(target) {
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target);
            this.target = target;
        }
    });

    return SetupSendingSwitchView;
});