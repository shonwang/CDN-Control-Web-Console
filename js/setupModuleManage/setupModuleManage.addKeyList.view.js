define("setupModuleManage.addKeyList.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {
    
    var AddKeyList=Backbone.View.extend({
        events:{},
        initialize:function(options){
            this.options=options;
            this.collection=options.collection;
            this.isEdit=options.isEdit;
            if(this.isEdit){
                this.currentKey={
                    "id": 3, //配置项ID
                    "groupId": 2,// 分组id
                   "itemName": "域名", //配置项名称
                    "valueType": "Array", //值类型
                    "defaultValue": "默认值", //默认值
                    "valueList": "", //下拉取值列表
                   "validateRule": "校验规则", //校验规则
                   "configKey": "host", //配置生成key
                   "itemDescription": "some描述" //描述
                }
            }else{
                  "id": 3, //配置项ID
                    "groupId": 2,// 分组id
                   "itemName": "域名", //配置项名称
                    "valueType": "Array", //值类型
                    "defaultValue": "默认值", //默认值
                    "valueList": "", //下拉取值列表
                   "validateRule": "校验规则", //校验规则
                   "configKey": "host", //配置生成key
                   "itemDescription": "some描述" //描述
            
            }
            console.log(this.options)
            

            this.$el = $(_.template(template['tpl/setupModuleManage/setupModuleManage.keyTable.html'])({
            }));

            this.$el.find("#groupName").on("blur",$.proxy(this.onGroupNameBlur,this));
            this.$el.find("#groupDescription").on("blur",$.proxy(this.onGroupDescriptionBlur,this));
        },
        
        onGroupNameBlur:function(){
            this.currentGroup.groupName=this.$el.find("#groupName").val()
        },

        onGroupDescriptionBlur:function(){
            this.currentGroup.groupDescription=this.$el.find("#groupDescription").val()
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(target) {
            this.collection.off();
            this.collection.reset();
            this.remove();
            this.initialize(this.options);
            this.render(target || this.target);
        },

        render: function(target) {
            this.$el.appendTo(target)
            this.target = target;
        }
    });
    
    return AddKeyList;
});