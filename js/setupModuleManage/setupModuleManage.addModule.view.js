define("setupModuleManage.addModule.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {
    
    var AddGroup=Backbone.View.extend({
        events:{},
        initialize:function(options){
            this.options=options;
            this.collection=options.collection;
            this.$el = $(_.template(template['tpl/setupModuleManage/setupModuleManage.addGroup.html'])({}));
        },

        getCurrentGroup:function(){
            var groupName=this.$el.find("#groupName").val()
            var groupDescription=this.$el.find("#groupDescription").val()
            var group={
                groupName:groupName,
                groupDescription:groupDescription
            }
            return group;
        },

        render: function(target) {
            this.$el.appendTo(target)
            this.target = target;
        }
    });
    

    var AddModule = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit=options.isEdit
            if(this.isEdit){   
                this.currentModule={
                id:2,
                moduleName:"直播转推",
                moduleKey:"aaaa",
                type:3,
                valueType:2,
                defaultDisplay:true,
                moduleDescription:"直播转推",
                groupList:[{
                 "id": 2, //分组ID
                "moduleId": 1, //模块Id
                "groupName": "分组名称11", //分组名称
                "groupDescription": "lalala", //分组描述
                "configItemList":[
                   {"id": 3, //配置项ID
                   "groupId": 2,// 分组id
                   "itemName": "域名", //配置项名称
                    "valueType": 4, //值类型
                    "defaultValue": "默认值", //默认值
                    "valueList": "", //下拉取值列表
                   "validateRule": "校验规则", //校验规则
                   "configKey": "host", //配置生成key
                   "itemDescription": "some描述" //描述
                 }]
             }]

              }
          }else{ 
            this.currentModule={
                id:"",
                moduleName:"",
                moduleKey:"",
                type:2,
                valueType:1,
                defaultDisplay:false,
                moduleDescription:"",
                groupList:[]
             }
        }


            this.$el = $(_.template(template['tpl/setupModuleManage/setupModuleManage.addModule.html'])({
                data:this.currentModule
            }));

            this.initDropMenu();
            this.$el.find(".addGroup").on("click",$.proxy(this.onClickAddGroup,this))
            this.initGroupList()        
        },        
        
        initGroupList:function(){
           require(["setupModuleManage.addGroupList.view"], function(AddGroupList) {
                _.each(this.currentModule.groupList, function(el) {
                    var addGroupList = new AddGroupList({
                        currentGroup: el,
                        isEdit: this.isEdit
                    });
                    addGroupList.render(this.$el.find(".groupList-pannel"));
                }.bind(this))
             }.bind(this))
        },

        onClickAddGroup:function(){
            if(this.addGroupModel) $("#" + this.addGroupModel.modalId).remove();
            var addGroup=new AddGroup({
                options:this.options,
                collection:this.collection,
            })
            var options={
                title:"新增分组",
                body:addGroup,
                backdrop : 'static',
                type:2,
                width:600,
                onOKCallback:function(){
                    var group=addGroup.getCurrentGroup();
                    if(group.groupName=="") alert("分组名不能为空！");
                    else if(group.groupDescription=="") alert("分组说明不能为空！");
                    else{
                        this.addGroupModel.$el.modal("hide");
                        this.showGroupList(group);
                   }
                }.bind(this),
            }

            this.addGroupModel=new Modal(options);
        },

        showGroupList:function(group){
            require(["setupModuleManage.addGroupList.view"], function(AddGroupList) {
                      var addGroupList = new AddGroupList({
                        groupName: group.groupName,
                        groupDescription:group.groupDescription
                    });
                    addGroupList.render(this.$el.find(".groupList-pannel"));
                    this.currentModule.groupList.push(addGroupList.currentGroup);
             }.bind(this))
            console.log(this.currentModule);
        },

        initDropMenu:function(){
            var typeNode=this.$el.find(".dropdown-type");
            var valueTypeNode=this.$el.find(".dropdown-valueType");
            var defaultDisplayNode=this.$el.find(".dropdown-defaultDisplay");
            this.type=[{
                name:"直播推流",
                value:2
            },{
                name:"RTMP&FLV拉流",
                value:3
            }]

            this.valueType=[{
                name:"Normal",
                value:1
            },{
                name:"Array",
                value:2
            },{
                name:"Table",
                value:3
            }]

            this.defaultDisplay=[{
                name:"Y",
                value:1
            },{
                name:"N",
                value:2
            }]
  
            Utility.initDropMenu(typeNode,this.type, function(value) {
                var typeObj = _.find(this.type, function(object) {
                    return object.value == parseInt(value);
                }.bind(this));

            }.bind(this));
            if(!this.isEdit||this.currentModule.type==2)
                this.$el.find("#dropdown-type .cur-value").html(this.type[0].name)
            else
                this.$el.find("#dropdown-type .cur-value").html(this.type[1].name)


            Utility.initDropMenu(valueTypeNode,this.valueType, function(value) {
                var valueTypeObj = _.find(this.valueType, function(object) {
                    return object.value == parseInt(value);
                }.bind(this));

            }.bind(this));
            if(!this.isEdit){
                this.$el.find("#dropdown-valueType .cur-value").html(this.valueType[0].name)
            }else{
                _.each(this.valueType,function(el){
                    if(el.value==this.currentModule.valueType)
                        this.$el.find("#dropdown-valueType .cur-value").html(el.name)
                }.bind(this))
            }


            Utility.initDropMenu(defaultDisplayNode,this.defaultDisplay, function(value) {
                var defaultDisplayObj = _.find(this.defaultDisplay, function(object) {
                    return object.value == parseInt(value);
                }.bind(this));

            }.bind(this));
            if(!this.isEdit||!this.currentModule.defaultDisplay)
                this.$el.find("#dropdown-defaultDisplay .cur-value").html(this.defaultDisplay[1].name)
            else
                this.$el.find("#dropdown-defaultDisplay .cur-value").html(this.defaultDisplay[0].name)
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
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

    return AddModule;
});