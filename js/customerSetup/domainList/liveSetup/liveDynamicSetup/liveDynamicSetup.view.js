define("liveDynamicSetup.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveDynamicSetupView = Backbone.View.extend({
        events: {},
        initialize: function(options) {
            this.options = options;
            this.moduleList = [{
                id: 1,
                moduleName: "拉流鉴权",
                defaultDisplay: true
            }, {
                id: 2,
                moduleName: "第三方转拉",
                defaultDisplay: true
            }, {
                id: 3,
                moduleName: "直播转推",
                defaultDisplay: false
            }, {
                id: 4,
                moduleName: "直播日志",
                defaultDisplay: false
            }]

            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveDynamicSetup.html'])({}));

            var clientInfo = JSON.parse(options.query),
                domainInfo = JSON.parse(options.query2);
            this.userInfo = {
                clientName: clientInfo.clientName,
                domain: domainInfo.domain,
                uid: clientInfo.uid
            }
            this.domainInfo = domainInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: this.userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

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
                        "valueType": 3, //值类型
                        "defaultValue": "morenzhi3", //默认值
                        "valueList": [{
                            name: "请选择",
                            value: null
                        }, {
                            name: "开",
                            value: true
                        }, {
                            name: "关",
                            value: false
                        }], //下拉取值列表
                        "validateRule": "", //校验规则
                        "configKey": "key3", //配置生成key
                        "itemDescription": "key描述3", //描述
                        "sort": 1, //排序 
                        "value": true
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
                        "valueType": 1, //值类型
                        "defaultValue": "", //默认值
                        "valueList": "", //下拉取值列表
                        "validateRule": "\\d", //校验规则
                        "configKey": "wwww", //配置生成key
                        "itemDescription": "", //描述
                        "value": ""
                    },{
                        "id": 2,
                        "groupId": 1,
                        "itemName": "配置项名称2", //配置项名称
                        "valueType": 1, //值类型
                        "defaultValue": "", //默认值
                        "valueList": "", //下拉取值列表
                        "validateRule": "\\d", //校验规则
                        "configKey": "rrrr", //配置生成key
                        "itemDescription": "", //描述
                        "value": ""
                    }]
                }],
                value:[{
                   openFlag: 1,
                   configValueMap: {
                       1: "1231",
                       2: "12312"
                   }
                },{
                   openFlag: 1,
                   configValueMap: {
                       1: "dfdfdf",
                       2: "dfdfdfdf"
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
                        "valueList": "", //下拉取值列表
                        "validateRule": "", //校验规则
                        "configKey": "", //配置生成key
                        "itemDescription": "", //描述
                        "sort": 1, //排序 
                        "value": ""
                    }]
                }]
            }]

            this.initSetupModule(); //初始化模块管理


        },

        initAllDropdownMenu: function() {
            _.each(this.moduleListDetail, function(module) {
                _.each(module.groupList, function(group) {
                    _.each(group.configItemList, function(key) {
                        if (key.valueType == 3 || key.valueType == 4 || key.valueType == 5 || key.valueType == 6) {
                            var valueList = key.valueList;
                            var str = ".dropdown#" + module.id + "-" + group.id + "-" + key.id
                            var rootNode = this.$el.find(str);
                            Utility.initDropMenu(rootNode, valueList, function(value) {
                                key.value = value;
                                console.log(this.moduleListDetail)
                            }.bind(this))
                            var defaultValue = _.find(valueList, function(el) {
                                return el.value == key.value
                            }.bind(this))
                            if (defaultValue)
                                rootNode.find("#dropdown-valueType .cur-value").html(defaultValue.name)
                            else
                                rootNode.find("#dropdown-valueType .cur-value").html(valueList[0].name)
                        } else if (key.valueType == 7 || key.valueType == 8) {
                            var str = ".arrayContent#" + module.id + "-" + group.id + "-" + key.id;
                            var rootNode=this.$el.find(str)
                            rootNode.find(".addArray").on("click", $.proxy(this.onClickAddArray, this))
                            this.initArrayTable(rootNode, key.value, module.id + "-" + group.id + "-" + key.id);
                        }
                    }.bind(this))
                }.bind(this))
            }.bind(this))
        },

        initArrayTable:function(rootNode, data, id){
            var arrayTable = $(_.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveArrayTable.html'])({
                                data: {
                                   list: data,
                                   id:  id
                                }
                            }));
            rootNode.find(".table-ctn").html(arrayTable[0]);
            rootNode.find(".deleteArray").on("click",$.proxy(this.onClickDeleteArray,this))
        },

        onClickAddArray:function(event){
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            var currentKey=this.getCurrentKey(id);

            var value=this.$el.find(".arrayContent#"+ id +" input").val().trim();
            if(!currentKey.value) currentKey.value=[];
            currentKey.value.push(value)
            this.$el.find(".arrayContent#"+ id +" input").val("");
            this.initArrayTable(this.$el.find(".arrayContent#"+ id), currentKey.value, id)
             
        },
        
        onClickDeleteArray:function(event){
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            var currentKey=this.getCurrentKey(id);
            var index=id.split("-")[3];
            currentKey.value.splice(index,1);
            var id1=id.split("-")
            id1.splice(3,1);
            
            var str=this.$el.find(".arrayContent#"+id1.join("-"))
            this.initArrayTable(str, currentKey.value, id1.join("-"))
        },

        getCurrentKey:function(id){
            var moduleId = id.split("-")[0]
            var groupId = id.split("-")[1]
            var keyId = id.split("-")[2]
            var currentModule = _.find(this.moduleListDetail, function(module) {
                return module.id == moduleId
            }.bind(this))
            var currentGroup = _.find(currentModule.groupList, function(group) {
                return group.id == groupId
            }.bind(this))
            var currentKey = _.find(currentGroup.configItemList, function(key) {
                return key.id == keyId
            }.bind(this))
            return currentKey;
        },

        initModuleArrayTypeTable: function(headerArray, moduleData,moduleId){
            var tpl = _.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveArrayModule.table.html'])({
                header: headerArray,
                data: moduleData,
                moduleId:moduleId
            });
            return tpl
        },

        initModuleList: function() {
            _.each(this.moduleListDetail, function(module) {
                module.groupTemplate = "";
                if(module.valueType==1||module.valueType==2){
                     _.each(module.groupList, function(group) {
                        var tpl = this.initGroupList(group);
                        module.groupTemplate = module.groupTemplate + tpl;
                    }.bind(this))
                }else{
                    module.configKeyList = [];
                    _.each(module.groupList,function(group){
                        _.each(group.configItemList,function(key){
                            module.configKeyList.push(key)
                        }.bind(this))
                    }.bind(this))
                    module.groupTemplate = this.initModuleArrayTypeTable(module.configKeyList, module.value,module.id)
                }
                
            }.bind(this))
            console.log(this.moduleListDetail)
            this.moduleTable = $(_.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveModuleList.html'])({
                data: this.moduleListDetail
            }));
            this.$el.find(".moduleList-pannel").html(this.moduleTable[0]);
            this.$el.find(".glyphicon-question-sign").popover();
            this.$el.find(".moduleList-pannel .keyInput").on("blur", $.proxy(this.onValueInputBlur, this))
            this.$el.find("textarea").on("blur", $.proxy(this.onValueInputBlur, this))
            this.initAllDropdownMenu();
            this.$el.find(".addModuleKey").on("click",$.proxy(this.onClickAddModuleKey,this))
            this.$el.find(".editModuleKey").on("click",$.proxy(this.onClickEditModuleKey,this))
        },
        
        onClickEditModuleKey:function(){
            alert(1);
        },

        onClickAddModuleKey:function(event){
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            var currentModule=_.find(this.moduleListDetail,function(module){
                return module.id==id;
            }.bind(this))
            groupTemplate="";
            _.each(currentModule.groupList,function(group){
                var tpl = this.initGroupList(group);
                groupTemplate = groupTemplate + tpl;
            }.bind(this))

            if (this.addKeyModel) $("#" + this.addKeyModel.modalId).remove();

            require(["liveDynamicSetup.addKey.view"],function(AddKey){
                var addKey=new AddKey({
                    module:currentModule,
                    groupTemplate:groupTemplate
                })
                var options = {
                    title: "添加配置",
                    body: addKey,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var result = addKey.getCurrentKey();
                        if (result) {
                            currentModule.value.push(result);
                            var tpl = this.initModuleArrayTypeTable(currentModule.configKeyList, currentModule.value, currentModule.id)
                            this.$el.find("#module-"+id+ " .panel-body").html(tpl)
                            this.addKeyModel.$el.modal("hide");
                            this.$el.find(".addModuleKey").on("click",$.proxy(this.onClickAddModuleKey,this))                        }
                    }.bind(this),
                }

                this.addKeyModel = new Modal(options);
                this.addKeyModel.$el.find(".glyphicon-question-sign").popover();
            }.bind(this))
      
        },

        onValueInputBlur: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            var currentKey=this.getCurrentKey(id);
            currentKey.value = $(eventTarget).val();
            console.log(this.moduleListDetail)
        },

        initGroupList: function(groupData) {
            var tpl = _.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveGroupList.html'])({
                data: groupData
            });
            return tpl
        },

        initSetupModule: function() {
            var ul = this.$el.find(".moduleListUl");
            _.each(this.moduleList, function(el) {
                var str = '<li><div class="checkbox"><label><input type="checkbox" id="' + el.id + '">' + el.moduleName + '</label></div></li>';
                if (el.defaultDisplay) {
                    str = '<li><div class="checkbox"><label><input type="checkbox" checked="true"  id="' + el.id + '">' + el.moduleName + '</label></div></li>';
                }
                $(str).appendTo(ul);
            }.bind(this))

            this.initModuleList();

            _.each(this.moduleList, function(el) {
                var str = "#module-" + el.id
                if (!el.defaultDisplay)
                    this.$el.find(str).hide();
            }.bind(this))

            this.$el.find(".moduleListUl li").on("click", $.proxy(this.onClickItemSetupModule, this))
        },

        onClickItemSetupModule: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            var str = "#module-" + id;
            if (!eventTarget.checked)
                this.$el.find(str).hide();
            else
                this.$el.find(str).show();
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function() {
            this.$el.hide();
        },

        update: function(query, query2, target) {
            this.options.query = query;
            this.options.query2 = query2;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target);
            this.target = target
        }
    });

    return LiveDynamicSetupView;
});