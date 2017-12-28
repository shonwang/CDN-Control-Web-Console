define("setupBillLiveDynamic.view", ['require','exports', 'template', 'modal.view', 'utility', 'setupBill.view'], 
    function(require, exports, template, Modal, Utility, SetupBillView) {

    var SetupLiveBillDynamicView = SetupBillView.extend({
        events: {},
         initialize:function(options){
            this.pannel=options.pannel;
            this.moduleListDetail=options.moduleList;
            console.log(this.moduleListDetail)

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
                    list.valueName="null"
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

    });

    return SetupLiveBillDynamicView;
});