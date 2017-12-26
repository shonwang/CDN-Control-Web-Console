define("setupBillLiveDynamic.view", ['require','exports', 'template', 'modal.view', 'utility', 'setupBill.view'], 
    function(require, exports, template, Modal, Utility, SetupBillView) {

    var SetupLiveBillDynamicView = SetupBillView.extend({
        events: {},
         initialize:function(options){
            this.pannel=options.pannel;
            this.moduleListDetail = [{
                "id": 1, //模块Id
                "moduleName": "模块1", //模块名称
                "moduleKey": "", //模块key
                "type": 1,
                "valueType": 1,
                "moduleDescription": "some描述1", //模块描述
                "groupList": [{
                    "id": 1, //分组Id
                    "moduleId": 1, //模块Id
                    "groupName": "模块1下分组1", //分组名称
                    "groupDescription": "", //分组描述
                    "configItemList": [{
                        "id": 1, //配置项Id
                        "groupId": 1,
                        "itemName": "模块1下分组1key1", //配置项名称
                        "valueType": 1, //值类型
                        "defaultValue": "morenzhi1", //默认值
                        "valueList": "", //下拉取值列表
                        "validateRule": "", //校验规则
                        "configKey": "key1", //配置生成key
                        "itemDescription": "key描述1", //描述
                        "sort": 1, //排序 
                        "value": "1"
                    }, {
                        "id": 2, //配置项Id
                        "groupId": 1,
                        "itemName": "模块1下分组1key2", //配置项名称
                        "valueType": 9, //值类型
                        "defaultValue": "morenzhi2", //默认值
                        "valueList": "", //下拉取值列表
                        "validateRule": "", //校验规则
                        "configKey": "key2", //配置生成key
                        "itemDescription": "key描述2", //描述
                        "sort": 1, //排序 
                        "value": "2"
                    }, {
                        "id": 3, //配置项Id
                        "groupId": 1,
                        "itemName": "模块1下分组1key3", //配置项名称
                        "valueType": 4, //值类型
                        "defaultValue": "morenzhi3", //默认值
                        "valueList": [{
                            name: "请选择",
                            value: null
                        }, {
                            name: "开",
                            value: 1
                        }, {
                            name: "关",
                            value: 0
                        }], //下拉取值列表
                        "validateRule": "", //校验规则
                        "configKey": "key3", //配置生成key
                        "itemDescription": "key描述3", //描述
                        "sort": 1, //排序 
                        "value": 0
                    }, {
                        "id": 4, //配置项Id
                        "groupId": 1,
                        "itemName": "模块1下分组1key4", //配置项名称
                        "valueType": 7, //值类型
                        "defaultValue": "morenzhi4", //默认值
                        "valueList": "", //下拉取值列表
                        "validateRule": "", //校验规则
                        "configKey": "key4", //配置生成key
                        "itemDescription": "key描述4", //描述
                        "sort": 1, //排序 
                        "value": ["mm", "yy", "dd"]
                    }]
                }]
            }, {
                "id": 2,
                "moduleName": "模块2", //模块名称
                "moduleKey": "", //模块key
                "type": 1,
                "valueType": 3,
                "moduleDescription": "some描述2", //模块描述
                "groupList": [{
                    "id": 1,
                    "moduleId": 2, //模块Id
                    "groupName": "模块2下分组1", //分组名称
                    "groupDescription": "lalala", //分组描述
                    "configItemList": [{
                        "id": 1,
                        "groupId": 1,
                        "itemName": "配置项名称1", //配置项名称
                        "valueType": 5, //值类型
                        "defaultValue": "", //默认值
                        "valueList": [{
                            name: "请选择",
                            value: null
                        }, {
                            name: "开11",
                            value: 12
                        }, {
                            name: "关22",
                            value: 34
                        }], //下拉取值列表
                        "validateRule": "\\d", //校验规则
                        "configKey": "wwww", //配置生成key
                        "itemDescription": "", //描述
                        "value": ""
                    }, {
                        "id": 2,
                        "groupId": 1,
                        "itemName": "配置项名称2", //配置项名称
                        "valueType": 7, //值类型
                        "defaultValue": "", //默认值
                        "valueList": "", //下拉取值列表
                        "validateRule": "\\d", //校验规则
                        "configKey": "rrrr", //配置生成key
                        "itemDescription": "", //描述
                        "value": ""
                    }]
                }],
                value: [{
                    openFlag: 1,
                    configValueMap: {
                        1: 34,
                        2: ["lalalala", "lueluelue", "kukukujku"]
                    }
                }, {
                    openFlag: 0,
                    configValueMap: {
                        1:12,
                        2: [1, 2, 3]
                    }
                }]
            }, {
                "id": 3,
                "moduleName": "模块3", //模块名称
                "moduleKey": "", //模块key
                "type": 1,
                "valueType": 1,
                "moduleDescription": "some描述3", //模块描述
                "groupList": [{
                    "id": 2,
                    "moduleId": 1, //模块Id
                    "groupName": "分组3", //分组名称
                    "groupDescription": "", //分组描述
                    "configItemList": [{
                        "id": 3,
                        "groupId": 2,
                        "itemName": "", //配置项名称
                        "valueType": 1, //值类型
                        "defaultValue": "", //默认值
                        "valueList": [{
                            name: "11",
                            value: true
                        }], //下拉取值列表
                        "validateRule": "", //校验规则
                        "configKey": "", //配置生成key
                        "itemDescription": "", //描述
                        "sort": 1, //排序 
                        "value": "11"
                    }]
                }]
            }];
            
 
          this.initModuleList(); 
           
         }, 

          initModuleList:function(){
             _.each(this.moduleListDetail, function(module) {
                module.groupTemplate = "";
                if (module.valueType == 1 || module.valueType == 2) {
                    _.each(module.groupList, function(group) {
                        var tpl = this.initGroupList(group);
                        module.groupTemplate = module.groupTemplate + tpl;
                    }.bind(this))
                } else {
                    module.configKeyList = [];
                    _.each(module.groupList, function(group) {
                        _.each(group.configItemList, function(key) {
                            module.configKeyList.push(key)
                        }.bind(this))
                    }.bind(this))

                    module.groupTemplate = this.initModuleArrayTypeTable(module.configKeyList, module.value, module.id)
                }
            }.bind(this))

              this.liveDynamicTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.liveDynamicSetup.html'])({
                 data:this.moduleListDetail
            }));

            this.liveDynamicTable.appendTo(this.pannel);
            this.pannel.find(".glyphicon-question-sign").popover();
          },

          initGroupList: function(groupData) {
            _.each(groupData.configItemList,function(list){
               if(list.valueType==1||list.valueType==2||list.valueType==9){
                 list.valueName=list.value
               }else if(list.valueType==3||list.valueType==4){
                 if(list.value==1 ||list.value+""==true+"")
                    list.valueName="开"
                 else if(list.value==0 || list.value+""==false+"")
                    list.valueName="关"
                 else if(list.value+""==null+"")
                    list.valueName="请选择"
               }else if(list.valueType==5||list.valueType==6){
                 _.each(list.valueList,function(valuelist){
                        if(list.value==valuelist.value)
                            list.valueName=valuelist.name
                    }.bind(this))
               }
            }.bind(this))

            var tpl = _.template(template['tpl/setupChannelManage/setupBill/setupBill.liveGroupList.html'])({
                data: groupData
            });
            return tpl
        },

         initModuleArrayTypeTable: function(headerArray, moduleData, moduleId) {
            var data=[]
          _.each(moduleData,function(moduledata){
            var obj={}
            obj.openFlag=moduledata.openFlag
             _.each(moduledata.configValueMap,function(el,key){  
                    obj[key]=this.toChange(headerArray,el,key)
             }.bind(this))
             data.push(obj); 
           }.bind(this))
            var tpl = _.template(template['tpl/setupChannelManage/setupBill/setupBill.liveArrayModule.table.html'])({
                header: headerArray,
                data: data,
                moduleId: moduleId
            });
            return tpl
        },

        toChange:function(headerArray, el, key){
            var obj={}
             _.each(headerArray,function(header){
                if(header.id==key&&header.valueType==5||header.valueType==6){
                    _.each(header.valueList,function(valuelist){
                        if(el==valuelist.value)
                            obj[key]=valuelist.name
                    }.bind(this))
                }else if(header.id==key&&header.valueType==3||header.valueType==4){
                    if(el==0||el+""==false+"") 
                        obj[key]="关"
                    else if(el==1||el+""==true+"")
                        obj[key]="开"
                    else if(el+""==null+"")
                        obj[key]="请选择"
                }else if(header.id==key){
                        obj[key]=el
                }
            }.bind(this))
            return obj[key]
        },

        initArrayTable: function(rootNode, data) {
            var arrayTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.liveArrayTable.html'])({
                data: {
                    list: data || []
                }
            }));
            rootNode.find(".table-ctn").html(arrayTable[0]);
        },

    });

    return SetupLiveBillDynamicView;
});