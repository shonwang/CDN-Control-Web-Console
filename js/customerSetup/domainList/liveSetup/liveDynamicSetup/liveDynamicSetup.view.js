define("liveDynamicSetup.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LiveDynamicSetupView = Backbone.View.extend({
        events: {},
        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;

            this.$el = $(_.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveDynamicSetup.html'])({}));

            var clientInfo = JSON.parse(options.query),
                domainInfo = JSON.parse(options.query2);
            this.originId = domainInfo.id;

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

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            require(["setupModuleManage.model"], function(SetupModuleManageModel) {
                this.setupModuleManage = new SetupModuleManageModel();
                this.setupModuleManage.on("get.moduleList.success", $.proxy(this.onGetModuleListSuccess, this))
                this.setupModuleManage.on("get.moduleList.error", $.proxy(this.onGetError, this))
                this.setupModuleManage.getListModule({
                    originId: this.originId
                });
            }.bind(this));
            this.collection.on("get.moduleDyConfig.success", $.proxy(this.onGetModuleDyConfigSuccess, this))
            this.collection.on("get.moduleDyConfig.error", $.proxy(this.onGetError, this))

            this.collection.on("save.moduleDyConfig.success", $.proxy(this.onSaveModuleDyConfigSuccess, this))
            this.collection.on("save.moduleDyConfig.error", $.proxy(this.onGetError, this))

            this.collection.on("delete.moduleDyConfig.success", $.proxy(this.onDeleteModuleDyConfigSuccess, this))
            this.collection.on("delete.moduleDyConfig.error", $.proxy(this.onGetError, this))

            this.collection.on("get.moduleDyConfigById.success", $.proxy(this.onGetModuleDyConfigByIdSuccess, this))
            this.collection.on("get.moduleDyConfigById.error", $.proxy(this.onGetError, this))

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this))
        },

        onDeleteModuleDyConfigSuccess: function() {
            alert("清除成功！");
            this.setupModuleManage.getListModule({
                originId: this.originId
            })
        },

        onSaveModuleDyConfigSuccess: function() {
            this.collection.getModuleDynamicConfigByModuleId({
                originId: this.originId,
                moduleId: this.saveModuleId
            })
        },

        onGetModuleDyConfigByIdSuccess:function(res){
            console.log(res)
            if (res && res[0]) {
                var moduleNodeRoot = this.$el.find("#title-"+this.saveModuleId);
                moduleNodeRoot.find(".group-ctn").html(_.template(template['tpl/loading.html'])({}));
                var module = res[0];
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
                moduleNodeRoot.find(".group-ctn").html(module.groupTemplate);

                moduleNodeRoot.find(".glyphicon-question-sign").popover();
                moduleNodeRoot.find(".moduleList-pannel .keyInput").on("blur", $.proxy(this.onValueInputBlur, this))
                moduleNodeRoot.find("textarea").on("blur", $.proxy(this.onValueInputBlur, this))
                this.initAllDropdownMenu(res);
                moduleNodeRoot.find(".addModuleKey").on("click", $.proxy(this.onClickAddModuleKey, this))
                moduleNodeRoot.find(".editModuleKey").on("click", $.proxy(this.onClickEditModuleKey, this))
                moduleNodeRoot.find(".deleteModuleKey").on("click", $.proxy(this.onClickDeleteModuleKey, this))
                moduleNodeRoot.find(".switch .togglebutton input").on("click", $.proxy(this.onClickSwitchButton, this));
            } else {
                alert("保存刷新失败！");
            }
        },

        onGetModuleListSuccess: function(res) {
            this.moduleList = res;
            this.initSetupModule(); //初始化模块管理
            this.collection.getModuleDynamicConfig({
                originId: this.originId
            })
        },

        onGetModuleDyConfigSuccess: function(res) {
            this.moduleListDetail = res;
            this.initModuleList();
            _.each(this.moduleList, function(el) {
                var str = "#module-" + el.id
                if (!el.defaultDisplay) {
                    this.$el.find(str).hide();
                }
            }.bind(this))
        },

        launchSendPopup: function() {
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel) {
                var mySaveThenSendView = new SaveThenSendView({
                    collection: new SaveThenSendModel(),
                    domainInfo: this.domainInfo,
                    isRealLive: true,
                    description: this.$el.find("#Remarks").val(),
                    onSendSuccess: function() {
                        this.sendPopup.$el.modal("hide");
                        window.location.hash = '#/domainList/' + this.options.query;
                    }.bind(this)
                });
                var options = {
                    title: "发布",
                    body: mySaveThenSendView,
                    backdrop: 'static',
                    type: 2,
                    width: 1000,
                    onOKCallback: function() {
                        mySaveThenSendView.sendConfig();
                    }.bind(this),
                    onHiddenCallback: function() {
                        if (this.sendPopup) $("#" + this.sendPopup.modalId).remove();
                        this.update(this.options.query, this.options.query2, this.target);
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
        },

        initAllDropdownMenu: function(list) {
            _.each(list, function(module) {
                if (module.valueType == 1 || module.valueType == 2) {
                    _.each(module.groupList, function(group) {
                        _.each(group.configItemList, function(key) {
                            if (key.valueList)
                                key.valueList = JSON.parse(key.valueList)
                            else
                                key.valueList = [{
                                    "name": "请选择",
                                    "value": null
                                }];
                            // if (key.value == null && key.defaultValue && key.valueType != 7 && key.valueType != 8) {
                            //     key.value = key.defaultValue;
                            // } else if (key.value == null && key.defaultValue) {
                            //     key.value = [key.defaultValue]
                            // }
                            if (key.valueType == 3 || key.valueType == 4 || key.valueType == 5 || key.valueType == 6) {
                                var valueList = key.valueList;
                                var str = ".dropdown#" + module.id + "-" + group.id + "-" + key.id
                                var rootNode = this.$el.find(str);
                                Utility.initDropMenu(rootNode, valueList, function(value) {
                                    console.log(key.valueType + "/" + key.value)
                                    if(value+""==null+"")
                                        key.value=null
                                    else if (key.valueType == 3 || key.valueType == 5) 
                                        key.value = parseInt(value)
                                    else if (key.valueType == 4 && value == "true") 
                                        key.value = true
                                    else if (key.valueType == 4 && value == "false") 
                                        key.value = false
                                    else 
                                        key.value = value;
                                }.bind(this))

                                var defaultValue = null
                                if (key.valueType == 5 || key.valueType == 6) {
                                    defaultValue = _.find(valueList, function(el) {
                                        return el.value == key.value
                                    }.bind(this))
                                } else if (key.valueType == 3 || key.valueType == 4) {
                                    defaultValue = _.find(valueList, function(el) {
                                        return el.value + "" == key.value + ""
                                    }.bind(this))
                                }
                                if (defaultValue) {
                                    rootNode.find("#dropdown-valueType .cur-value").html(defaultValue.name)
                                } else {
                                    rootNode.find("#dropdown-valueType .cur-value").html(valueList[0].name)
                                }
                            } else if (key.valueType == 7 || key.valueType == 8) {
                                var str = ".arrayContent#" + module.id + "-" + group.id + "-" + key.id;
                                var rootNode = this.$el.find(str)
                                rootNode.find(".addArray").on("click", $.proxy(this.onClickAddArray, this));
                                if (!key.value) key.value = [];
                                if (typeof key.value != "object") {
                                    var tempArray = [];
                                    tempArray.push(key.value)
                                    key.value = tempArray
                                }
                                this.initArrayTable(rootNode, key.value, module.id + "-" + group.id + "-" + key.id);
                            }
                        }.bind(this))
                    }.bind(this))
                }
            }.bind(this))
        },

        initArrayTable: function(rootNode, data, id) {
            var arrayTable = $(_.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveArrayTable.html'])({
                data: {
                    list: data || [],
                    id: id
                }
            }));
            rootNode.find(".table-ctn").html(arrayTable[0]);
            rootNode.find(".deleteArray").on("click", $.proxy(this.onClickDeleteArray, this))
        },

        onClickAddArray: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            var currentKey = this.getCurrentKey(id);
            var value = this.$el.find(".arrayContent#" + id + " input").val().trim();
            if (!value) {
                alert("你什么都没有输入！");
                return;
            }else if(currentKey.valueType==7){
                if(!Number(value)&&value!=0){
                   alert("请输入数值型的值！");
                   return; 
                }
            }
            currentKey.value.push(value)
            this.$el.find(".arrayContent#" + id + " input").val("");
            this.initArrayTable(this.$el.find(".arrayContent#" + id), currentKey.value, id)

        },

        onClickDeleteArray: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            var currentKey = this.getCurrentKey(id);
            var index = id.split("-")[3];
            currentKey.value.splice(index, 1);
            var id1 = id.split("-")
            id1.splice(3, 1);

            var str = this.$el.find(".arrayContent#" + id1.join("-"))
            this.initArrayTable(str, currentKey.value, id1.join("-"))
        },

        getCurrentKey: function(id) {
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

        initModuleArrayTypeTable: function(headerArray, moduleData, moduleId) {
            var data = []
            _.each(moduleData, function(moduledata) {
                var obj = {}
                obj.openFlag = moduledata.openFlag
                _.each(moduledata.configValueMap, function(el, key) {
                    obj[key] = this.toChange(headerArray, el, key)
                }.bind(this))
                data.push(obj);
            }.bind(this))
            var tpl = _.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveArrayModule.table.html'])({
                header: headerArray,
                data: data,
                moduleId: moduleId
            });
            return tpl
        },

        toChange: function(headerArray, el, key) {
            var obj = {}
            _.each(headerArray, function(header) {
                if(header.id==key&&header.valueList){
                    if (!(header.valueList instanceof Array))
                        header.valueList = JSON.parse(header.valueList)
                    _.each(header.valueList, function(valuelist) {  
                        if (el+"" == valuelist.value+""){
                            obj[key] = valuelist.name
                        }
                    }.bind(this))
                }else if(header.id==key&&!header.valueList){
                    if(header.valueType == 3 || header.valueType==4){
                        if(el==0||el+""==false+"")
                            obj[key]="关"
                        else if(el==1||el+""==true+"")
                            obj[key]=="开"
                        else if(el+""==null+"")
                            obj[key]="请选择"
                    }else{
                        obj[key] = el
                    }
                } 
            }.bind(this))
            return obj[key]
        },

        initModuleList: function() {
            console.log(this.moduleListDetail)
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
            this.moduleTable = $(_.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveModuleList.html'])({
                data: this.moduleListDetail
            }));
            this.$el.find(".moduleList-pannel").html(this.moduleTable[0]);
            this.$el.find(".glyphicon-question-sign").popover();
            this.$el.find(".moduleList-pannel .keyInput").on("blur", $.proxy(this.onValueInputBlur, this))
            this.$el.find("textarea").on("blur", $.proxy(this.onValueInputBlur, this))
            this.initAllDropdownMenu(this.moduleListDetail);
            this.$el.find(".addModuleKey").on("click", $.proxy(this.onClickAddModuleKey, this))
            this.$el.find(".editModuleKey").on("click", $.proxy(this.onClickEditModuleKey, this))
            this.$el.find(".deleteModuleKey").on("click", $.proxy(this.onClickDeleteModuleKey, this))
            this.$el.find(".switch .togglebutton input").on("click", $.proxy(this.onClickSwitchButton, this));
            this.$el.find(".saveItemModule").on("click", $.proxy(this.onClickSaveItemModule, this))
            this.$el.find(".clearItemModule").on("click", $.proxy(this.onClickClearItemModule, this))

        },

        onClickClearItemModule: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            Utility.confirm("你确定要删除吗？", function() {
                // var currentModule = _.find(this.moduleListDetail, function(module) {
                //     return id == module.id
                // }.bind(this))
                // if (currentModule.valueType == 1 || currentModule.valueType == 2) {
                //     _.each(currentModule.groupList, function(group) {
                //         _.each(group.configItemList, function(key) {
                //             key.value = null;
                //         }.bind(this))
                //     }.bind(this))
                //     this.initModuleList(this.moduleListDetail);
                // } else {
                //     currentModule.value = [];
                //     this.initModuleList(this.moduleListDetail)
                // }
                var sendMessage = {
                    moduleId: id,
                    originId: this.originId
                }
                console.log(sendMessage)
                this.collection.deleteModuleDynamicConfig(sendMessage);
            }.bind(this))

        },

        onClickSaveItemModule: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            this.saveModuleId=id;
            var currentModule = _.find(this.moduleListDetail, function(module) {
                return id == module.id
            }.bind(this))
            var sendMessage = {}
            if (currentModule.valueType == 1 || currentModule.valueType == 2) {
                var value = [{
                    configValueMap: {}
                }]
                var errorMessage = "";
                _.each(currentModule.groupList, function(group) {
                    _.each(group.configItemList, function(key) {
                        if (key.valueType == 1 || key.valueType == 3 || key.valueType == 5 || key.valueType == 10) {
                            if (key.value + "" == null + "") {
                                value[0].configValueMap[key.id] = null;
                            } else if ((key.value === "" && key.valueType == 1) || (key.value === "" && key.valueType == 10)){
                                //errorMessage = errorMessage + key.itemName + "不能为空字符串！<br>"
                            } else {
                                value[0].configValueMap[key.id] = parseInt(key.value)
                            }
                        } else if (key.valueType == 4) {
                            console.log("save: " + key.value)
                            if (key.value + "" == null + "")
                                value[0].configValueMap[key.id] = null
                            else
                                value[0].configValueMap[key.id] = key.value;
                        } else if (key.valueType == 7) {
                            var temp = [];
                            _.each(key.value, function(el) {
                                temp.push(parseInt(el))
                            }.bind(this))
                            value[0].configValueMap[key.id] = temp
                        } else {
                            value[0].configValueMap[key.id] = key.value
                        }

                    }.bind(this))
                }.bind(this))

                if (errorMessage) {
                    alert(errorMessage);
                    return false
                }

                sendMessage = {
                    originId: this.originId,
                    moduleId: id,
                    value: value
                }
            } else {
               _.each(currentModule.value,function(el,index){
                 _.each(el.configValueMap,function(e,key){
                     if(e=="true")
                        el.configValueMap[key]=true
                     else if(e=="false") 
                        el.configValueMap[key]=false
                 }.bind(this))
               }.bind(this))
                sendMessage = {
                    originId: this.originId,
                    moduleId: id,
                    value: currentModule.value
                }
            }
            console.log(sendMessage)
            this.collection.saveModuleDynamicConfig(sendMessage);
        },

        onClickSwitchButton: function(evnet) {
            var eventTarget = event.srcElement || event.target,
                id;
            if (eventTarget.tagName !== "INPUT") return;
            id = $(eventTarget).attr("id")
            moduleId = id.split("-")[0]
            valueIndex = id.split("-")[1]
            var currentModule = _.find(this.moduleListDetail, function(module) {
                return moduleId == module.id
            }.bind(this))

            if (eventTarget.checked) {
                currentModule.value[valueIndex].openFlag = 1;
            } else {
                currentModule.value[valueIndex].openFlag = 0;
            }
        },

        onClickDeleteModuleKey: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            var moduleId = id.split("-")[0]
            var valueId = id.split("-")[1]
            Utility.confirm("你确定要删除吗？", function() {
                var currentModule = _.find(this.moduleListDetail, function(module) {
                    return module.id == moduleId;
                }.bind(this))
                _.each(currentModule.value, function(el, index) {
                    if (index == valueId)
                        currentModule.value.splice(index, 1);
                }.bind(this))
                var tpl = this.initModuleArrayTypeTable(currentModule.configKeyList, currentModule.value, currentModule.id)
                this.$el.find("#module-" + moduleId + " .group-ctn").html(tpl)

                this.$el.find(".addModuleKey#" + moduleId).on("click", $.proxy(this.onClickAddModuleKey, this))
                this.$el.find("." + moduleId + "-editModuleKey").on("click", $.proxy(this.onClickEditModuleKey, this))
                this.$el.find("." + moduleId + "-deleteModuleKey").on("click", $.proxy(this.onClickDeleteModuleKey, this))
                this.$el.find(".switch ." + moduleId + "-switch input").on("click", $.proxy(this.onClickSwitchButton, this));
            }.bind(this))
        },

        onClickEditModuleKey: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            var moduleId = id.split("-")[0]
            var valueId = id.split("-")[1]
            var currentModule = _.find(this.moduleListDetail, function(module) {
                return module.id == moduleId;
            }.bind(this))
            groupTemplate = "";
            _.each(currentModule.groupList, function(group) {
                var tpl = this.initGroupList(group);
                groupTemplate = groupTemplate + tpl;
            }.bind(this))
            require(["liveDynamicSetup.addKey.view"], function(AddKey) {
                var addKey = new AddKey({
                    module: currentModule,
                    groupTemplate: groupTemplate,
                    value: currentModule.value[valueId],
                    isEdit: true
                })
                var options = {
                    title: "修改配置",
                    body: addKey,
                    backdrop: 'static',
                    width: 1000,
                    type: 2,
                    onOKCallback: function() {
                        var result = addKey.getCurrentKey();
                        if (result) {
                            currentModule.value[valueId] = result;
                            var tpl = this.initModuleArrayTypeTable(currentModule.configKeyList, currentModule.value, currentModule.id)
                            this.$el.find("#module-" + moduleId + " .group-ctn").html(tpl)
                            this.addKeyModel.$el.modal("hide");
                            this.$el.find(".addModuleKey#" + moduleId).on("click", $.proxy(this.onClickAddModuleKey, this))
                            this.$el.find("." + moduleId + "-editModuleKey").on("click", $.proxy(this.onClickEditModuleKey, this))
                            this.$el.find("." + moduleId + "-deleteModuleKey").on("click", $.proxy(this.onClickDeleteModuleKey, this))
                            this.$el.find(".switch ." + moduleId + "-switch input").on("click", $.proxy(this.onClickSwitchButton, this));
                        }
                    }.bind(this),

                }

                this.addKeyModel = new Modal(options);
                this.addKeyModel.$el.find(".glyphicon-question-sign").popover();
            }.bind(this))
        },

        onClickAddModuleKey: function(event) {
            var eventTarget = event.srcElement || event.target,
                id;
            id = $(eventTarget).attr("id");
            var currentModule = _.find(this.moduleListDetail, function(module) {
                return module.id == id;
            }.bind(this))
            groupTemplate = "";
            _.each(currentModule.groupList, function(group) {
                var tpl = this.initGroupList(group);
                groupTemplate = groupTemplate + tpl;
            }.bind(this))

            if (this.addKeyModel) $("#" + this.addKeyModel.modalId).remove();

            require(["liveDynamicSetup.addKey.view"], function(AddKey) {
                var addKey = new AddKey({
                    module: currentModule,
                    groupTemplate: groupTemplate,
                    isEdit: false
                })
                var options = {
                    title: "添加配置",
                    body: addKey,
                    backdrop: 'static',
                    width: 1000,
                    type: 2,
                    onOKCallback: function() {
                        var result = addKey.getCurrentKey();
                        if (result) {
                            if (!currentModule.value) currentModule.value = []
                            currentModule.value.push(result);
                            var tpl = this.initModuleArrayTypeTable(currentModule.configKeyList, currentModule.value, currentModule.id)
                            this.$el.find("#module-" + id + " .group-ctn").html(tpl)
                            this.addKeyModel.$el.modal("hide");
                            this.$el.find(".addModuleKey#" + id).on("click", $.proxy(this.onClickAddModuleKey, this))
                            this.$el.find("." + id + "-editModuleKey").on("click", $.proxy(this.onClickEditModuleKey, this))
                            this.$el.find("." + id + "-deleteModuleKey").on("click", $.proxy(this.onClickDeleteModuleKey, this))
                            this.$el.find(".switch ." + id + "-switch input").on("click", $.proxy(this.onClickSwitchButton, this));
                        }
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
            var currentKey = this.getCurrentKey(id);
            currentKey.value = $(eventTarget).val();
        },

        initGroupList: function(groupData) {
            var tpl = _.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveGroupList.html'])({
                data: groupData
            });
            return tpl
        },

        initSetupModule: function() {
            var ul = this.$el.find(".moduleListUl");
            if(ul.find("li").size()>0)
            ul.html("");
            _.each(this.moduleList, function(el) {
                var str = '<li><div class="checkbox"><label><input type="checkbox" id="' + el.id + '">' + el.moduleName + '</label></div></li>';
                if (el.defaultDisplay) {
                    str = '<li><div class="checkbox"><label><input type="checkbox" checked="true"  id="' + el.id + '">' + el.moduleName + '</label></div></li>';
                }
                $(str).appendTo(ul);
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