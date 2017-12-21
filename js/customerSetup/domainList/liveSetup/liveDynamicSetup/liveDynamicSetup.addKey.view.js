define("liveDynamicSetup.addKey.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var AddKey = Backbone.View.extend({
            events: {},
            initialize: function(options) {
                this.options=options
                this.defaultValue={
                    openFlag:1,
                    configValueMap:{}
                };

                this.$el = $(this.options.groupTemplate);
            },
            
            getCurrentKey:function(){
                var errorMessage="";
                _.each(this.options.module.groupList,function(group){
                    _.each(group.configItemList,function(key){
                        if(key.valueType==1||key.valueType==2||key.valueType==9){
                            var str="#"+ group.moduleId + "-" + group.id+"-"+key.id
                            var value=this.$el.find(str).val().trim();
                            try{
                                var reg=new RegExp(key.validateRule,"g");
                                if(reg.test(value)){
                                    this.defaultValue.configValueMap[key.id]=value
                                }else{
                                     errorMessage+=key.itemName + "输入有错误!<br>"
                                }
                            }catch(e){
                                errorMessage+=key.validateRule + "不是合法正则!<br>"
                            }
                        }
                    }.bind(this))
                }.bind(this))
                if (errorMessage) {
                    alert(errorMessage);
                    return false;
                } else {
                    return this.defaultValue;
                }
            },

            render: function(target) {
                this.$el.appendTo(target)
                this.target = target;
            }
        });

        return AddKey;
    });