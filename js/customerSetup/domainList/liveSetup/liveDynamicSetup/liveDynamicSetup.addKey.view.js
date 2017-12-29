define("liveDynamicSetup.addKey.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var AddKey = Backbone.View.extend({
            events: {},
            initialize: function(options) {
                this.options = options
                this.isEdit = options.isEdit;
                if (this.isEdit) {
                    this.defaultValue = this.options.value
                } else {
                    this.defaultValue = {
                        openFlag: 1,
                        configValueMap: {}
                    };
                }

                this.$el = $(this.options.groupTemplate);
                this.initDropDownAndArrayTable();
                if (this.isEdit)
                    this.initKeyValue();
            },

            initDropDownAndArrayTable: function() {
                _.each(this.options.module.groupList, function(group) {
                    _.each(group.configItemList, function(key) {
                        if (key.valueType == 3 || key.valueType == 4 || key.valueType == 5 || key.valueType == 6) {
                            var str = ".dropdown#" + this.options.module.id + "-" + group.id + "-" + key.id;
                            var rootNode = this.$el.find(str);
                            if (key.valueList && !(key.valueList instanceof Array))
                                key.valueList = JSON.parse(key.valueList)
                            Utility.initDropMenu(rootNode, key.valueList, function(value) {
                                if (value + "" == null + "")
                                    this.defaultValue.configValueMap[key.id] = null;
                                else if (key.valueType == 3 || key.valueType == 5)
                                    this.defaultValue.configValueMap[key.id] = parseInt(value)
                                else if (key.valueType == 4)
                                    this.defaultValue, configValueMap[key.id] = Boolean(value)
                            }.bind(this))
                            if (this.defaultValue.configValueMap[key.id] != undefined ||
                                this.defaultValue.configValueMap[key.id] != null) {
                                var currentValue = _.find(key.valueList, function(el) {
                                    if (key.valueType == 5 || key.valueType == 6) {
                                        return el.value == parseInt(this.defaultValue.configValueMap[key.id])
                                    } else if (key.valueType == 3 || key.valueType == 4) {
                                        return el.value + "" == this.defaultValue.configValueMap[key.id] + ""
                                    }
                                }.bind(this))
                                rootNode.find("#dropdown-valueType .cur-value").html(currentValue.name)
                            } else {
                                rootNode.find("#dropdown-valueType .cur-value").html(key.valueList[0].name)
                                this.defaultValue.configValueMap[key.id] = key.valueList[0].value
                            }
                        } else if (key.valueType == 7 || key.valueType == 8) {
                            var str = ".arrayContent#" + this.options.module.id + "-" + group.id + "-" + key.id;
                            var rootNode = this.$el.find(str)
                            rootNode.find(".addArray").on("click", $.proxy(this.onClickAddArray, this))
                            if (!this.defaultValue.configValueMap[key.id]) this.defaultValue.configValueMap[key.id] = []
                            this.initArrayTable(rootNode, this.defaultValue.configValueMap[key.id], this.options.module.id + "-" + group.id + "-" + key.id);
                        }
                    }.bind(this))
                }.bind(this))
            },

            initKeyValue: function() {
                _.each(this.options.module.groupList, function(group) {
                    _.each(group.configItemList, function(key) {
                        _.each(this.defaultValue.configValueMap, function(el, valueKey) {
                            if ((key.valueType == 1 || key.valueType == 2 || key.valueType == 9) && key.id == valueKey) {
                                var str = ".keyInput#" + this.options.module.id + "-" + group.id + "-" + key.id
                                this.$el.find(str).val(this.defaultValue.configValueMap[key.id])
                            }
                        }.bind(this))
                    }.bind(this))
                }.bind(this))
            },

            initArrayTable: function(rootNode, data, id) {
                var arrayTable = $(_.template(template['tpl/customerSetup/domainList/liveDynamicSetup/liveArrayTable.html'])({
                    data: {
                        list: data,
                        id: id
                    }
                }));
                rootNode.find(".table-ctn").html(arrayTable[0]);
                rootNode.find(".deleteArray").on("click", $.proxy(this.onClickDeleteArray, this))
            },

            onClickDeleteArray: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                id = $(eventTarget).attr("id");
                var keyId = id.split("-")[2]
                var index = id.split("-")[3]
                this.defaultValue.configValueMap[keyId].splice(index, 1);
                var newId = id.split("-");
                newId.splice(3, 1);
                var str = this.$el.find(".arrayContent#" + newId.join("-"))
                this.initArrayTable(str, this.defaultValue.configValueMap[keyId], newId.join("-"))
            },

            onClickAddArray: function(evnet) {
                var eventTarget = event.srcElement || event.target,
                    id;
                id = $(eventTarget).attr("id");
                var keyId = id.split("-")[2]
                var value = this.$el.find(".arrayContent#" + id + " input").val().trim();
                _.each(this.options.module.configItemList.groupList, function(group) {
                    _.each(group.configItemList, function(key) {
                        if (keyId == key.id && key.valueType == 7)
                            value = parseInt(value)
                    }.bind(this))
                }.bind(this))
                if (this.defaultValue.configValueMap[keyId] == undefined) this.defaultValue.configValueMap[keyId] = []
                if (!value) {
                    alert("值不能为空！");
                    return;
                }
                this.defaultValue.configValueMap[keyId].push(value)
                this.$el.find(".arrayContent#" + id + " input").val("");
                this.initArrayTable(this.$el.find(".arrayContent#" + id), this.defaultValue.configValueMap[keyId], id)
            },

            getCurrentKey: function() {
                var errorMessage = "";
                _.each(this.options.module.groupList, function(group) {
                    _.each(group.configItemList, function(key) {
                        if (key.valueType == 1 || key.valueType == 2 || key.valueType == 9 || key.valueType == 10) {
                            var str = "#" + group.moduleId + "-" + group.id + "-" + key.id
                            var value = this.$el.find(str).val().trim();
                            try {
                                var reg = new RegExp(key.validateRule, "g");
                                if (reg.test(value)) {
                                    if (key.valueType == 1 || key.valueType == 10) value = parseInt(value);
                                    this.defaultValue.configValueMap[key.id] = value
                                } else {
                                    errorMessage += key.itemName + "输入有错误!<br>"
                                }
                            } catch (e) {
                                errorMessage += key.validateRule + "不是合法正则!<br>"
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