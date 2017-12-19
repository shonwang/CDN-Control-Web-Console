define("setupModuleManage.addKey.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var AddKey = Backbone.View.extend({
            events: {},
            initialize: function(options) {
                this.options = options;
                this.isEdit = options.isEdit;
                if (this.isEdit) {
                    this.currentKey = options.currentKey
                } else {
                    this.currentKey = {
                        "id": Utility.randomStr(8), //配置项ID
                        "groupId": 2, //分组id
                        "itemName": "", //配置项名称
                        "valueType": 1, //值类型
                        "defaultValue": "", //默认值
                        "valueList": [], //下拉取值列表
                        "validateRule": "", //校验规则
                        "configKey": "", //配置生成key
                        "itemDescription": "" //描述
                    }
                }
                this.$el = $(_.template(template['tpl/setupModuleManage/setupModuleManage.addKey.html'])({
                    data: this.currentKey
                }));
                if (this.isEdit) {
                    this.$el.find("#configKey").attr("disabled", "disabled");
                    this.initOptionalTable();
                }

                this.initvalueTypeDropMenu();
                this.$el.find(".addOptional").on("click", $.proxy(this.onClickAddOptional, this))
            },
            
            getArgs: function() {
                if (this.$el.find("#configKey").val().trim() == "") {
                    alert("KEY不能为空！");
                    return false;
                } else if (this.$el.find("#itemName").val().trim() == "") {
                    alert("显示不能为空！");
                    return false;
                } else if (this.$el.find("#defaultValue").val().trim() == "") {
                    alert("默认值不能为空！");
                    return false;
                } else if (this.$el.find("#validateRule").val().trim() == "") {
                    alert("正则校验不能为空！");
                    return false;
                } else if (this.$el.find("#itemDescription").val().trim() == "") {
                    alert("描述说明不能为空！");
                    return false;
                } else if (this.currentKey.valueType == 5 || this.currentKey.valueType == 6) {
                    if (this.currentKey.valueList.length == 0) {
                        alert("可选值|显示不能为空！");
                        return false;
                    }
                }
                return true;
            },

            getCurrentKey: function() {
                var flag = this.getArgs();
                if (flag) {
                    this.currentKey.configKey = this.$el.find("#configKey").val().trim();
                    this.currentKey.itemName = this.$el.find("#itemName").val().trim();
                    this.currentKey.defaultValue = this.$el.find("#defaultValue").val().trim();
                    this.currentKey.validateRule = this.$el.find("#validateRule").val().trim();
                    this.currentKey.itemDescription = this.$el.find("#itemDescription").val().trim();
                    return true
                }
            },

            onClickAddOptional: function() {
                this.currentKey.valueList.push({
                    name: this.$el.find("#optional").val().trim(),
                    value: this.$el.find("#optionalValue").val().trim()
                })

                this.$el.find("#optional").val("");
                this.$el.find("#optionalValue").val("");
                this.initOptionalTable();
            },

            initOptionalTable: function() {
                if (this.currentKey.valueList.length != 0) {
                    var optionalTable = $(_.template(template['tpl/setupModuleManage/setupModuleManage.optionalTable.html'])({
                        data: this.currentKey
                    }));
                    this.$el.find(".table-ctn").html(optionalTable[0]);
                    this.$el.find(".deleteOptional").on("click", $.proxy(this.onClickDeleteOptional, this))
                } else
                    this.$el.find(".table-ctn").html("");
            },

            onClickDeleteOptional: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                id = $(eventTarget).attr("id");
                _.each(this.currentKey.valueList, function(el, index) {
                    if (index == id)
                        this.currentKey.valueList.splice(index, 1);
                }.bind(this))
                this.initOptionalTable();
            },

            initvalueTypeDropMenu: function() {
                var valueTypeNode = this.$el.find(".dropdown-valueType");
                this.valueType = [{
                    name: "数值型",
                    value: 1
                }, {
                    name: "字符型",
                    value: 2
                }, {
                    name: "数值型开关",
                    value: 3
                }, {
                    name: "布尔型开关",
                    value: 4
                }, {
                    name: "数值型枚举",
                    value: 5
                }, {
                    name: "字符型枚举",
                    value: 6
                }, {
                    name: "数值型数组",
                    value: 7
                }, {
                    name: "字符型数组",
                    value: 8
                }, {
                    name: "json",
                    value: 9
                }]

                Utility.initDropMenu(valueTypeNode, this.valueType, function(value) {
                    this.currentKey.valueType = parseInt(value);
                    if (this.currentKey.valueType == 5 || this.currentKey.valueType == 6)
                        this.$el.find("#optionalValueBox").removeClass("optionalValue");
                    else
                        this.$el.find("#optionalValueBox").addClass("optionalValue");
                }.bind(this));

                if (!this.isEdit)
                    this.$el.find("#dropdown-valueType .cur-value").html(this.valueType[0].name);
                else {
                    var currentValueType = _.find(this.valueType, function(el) {
                        return el.value == this.currentKey.valueType
                    }.bind(this))
                    this.$el.find("#dropdown-valueType .cur-value").html(currentValueType.name);
                    if (this.currentKey.valueType == 5 || this.currentKey.valueType == 6)
                        this.$el.find("#optionalValueBox").removeClass("optionalValue");
                    else
                        this.$el.find("#optionalValueBox").addClass("optionalValue");
                }
            },

            render: function(target) {
                this.$el.appendTo(target)
                this.target = target;
            }
        });

        return AddKey;
    });