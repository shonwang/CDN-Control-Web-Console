define("setupBillLiveDynamic.view", ['require', 'exports', 'template', 'modal.view', 'utility', 'setupBill.view'],
    function(require, exports, template, Modal, Utility, SetupBillView) {

        var SetupLiveBillDynamicView = SetupBillView.extend({
            events: {},
            initialize: function(options) {
                this.pannel = options.pannel;
                this.moduleListDetail = options.moduleList;
                if (this.moduleListDetail)
                    this.initModuleList();
            },

            initModuleList: function() {
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
                    data: this.moduleListDetail
                }));

                this.liveDynamicTable.appendTo(this.pannel);
                this.pannel.find(".glyphicon-question-sign").popover();
            },

            initGroupList: function(groupData) {
                _.each(groupData.configItemList, function(list) {
                    if (list.valueType == 1 || list.valueType == 2 || list.valueType == 9 || list.valueType == 10) {
                        list.valueName = list.value
                    } else if (list.valueType == 3 || list.valueType == 4) {
                        if (list.value == 1 || list.value + "" == true + "")
                            list.valueName = "开"
                        else if (list.value == 0 || list.value + "" == false + "")
                            list.valueName = "关"
                        else if (list.value + "" == null + "")
                            list.valueName = "null"
                    } else if (list.valueType == 5 || list.valueType == 6) {
                        if (list.valueList && !(list.valueList instanceof Array))
                            list.valueList = JSON.parse(list.valueList)
                        var obj = _.find(list.valueList, function(valuelist) {
                            return valuelist.value == list.value
                        }.bind(this))
                        if (obj)
                            list.valueName = obj.name
                    }

                    if(list.valueType == 10){
                        //新增加动态配置的时间可以选择年月日时分秒
                        if(list.valueName){
                            var valueName = list.valueName && (''+list.valueName).split("$")
                            var _value = valueName[0];
                            var _unit = valueName[1] || "s";
                            var _unitName = this.getUnitName(_unit);
                            list.valueName = _value + " " + _unitName;
                        }
                    }

                }.bind(this))

                var tpl = _.template(template['tpl/setupChannelManage/setupBill/setupBill.liveGroupList.html'])({
                    data: groupData
                });
                return tpl
            },

            getUnitName:function(unit){
                var obj = {
                    "y":"年",
                    "h":"时",
                    "m":"分",
                    "s":"秒",
                    "ms":"毫秒"
                }
                return obj[unit];
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
                var tpl = _.template(template['tpl/setupChannelManage/setupBill/setupBill.liveArrayModule.table.html'])({
                    header: headerArray,
                    data: data,
                    moduleId: moduleId
                });
                return tpl
            },

            toChange: function(headerArray, el, key) {
                var obj = {}
                _.each(headerArray, function(header) {
                    if (header.id == key && header.valueList) {
                        if (!(header.valueList instanceof Array))
                            header.valueList = JSON.parse(header.valueList)
                        _.each(header.valueList, function(valuelist) {
                            if (el + "" == valuelist.value + "") {
                                obj[key] = valuelist.name
                            }
                        }.bind(this))
                    } else if (header.id == key && !header.valueList) {
                        if (header.valueType == 3 || header.valueType == 4) {
                            if (el == 0 || el + "" == false + "")
                                obj[key] = "关"
                            else if (el == 1 || el + "" == true + "")
                                obj[key] == "开"
                            else if (el + "" == null + "")
                                obj[key] = "请选择"
                        } else {
                            obj[key] = el
                        }
                    }
                }.bind(this))
                return obj[key]
            },

        });

        return SetupLiveBillDynamicView;
    });