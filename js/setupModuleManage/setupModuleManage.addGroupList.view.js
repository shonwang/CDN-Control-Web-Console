define("setupModuleManage.addGroupList.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var AddGroupList = Backbone.View.extend({
            events: {},
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.isEdit = options.isEdit;
                if (this.isEdit) {
                    this.currentGroup = options.currentGroup
                } else {
                    this.currentGroup = {
                        "id": Utility.randomStr(8), //分组ID
                        "moduleId": "", //模块Id
                        "groupName": this.options.groupName, //分组名称
                        "groupDescription": this.options.groupDescription, //分组描述
                        "configItemList": []
                    }
                }
                this.$el = $(_.template(template['tpl/setupModuleManage/setupModuleManage.groupList.html'])({
                    data: this.currentGroup
                }));
                this.$el.find("#groupName").on("blur", $.proxy(this.onGroupNameBlur, this));
                this.$el.find("#groupDescription").on("blur", $.proxy(this.onGroupDescriptionBlur, this));
                this.$el.find(".addKey").on("click", $.proxy(this.addKey, this))
                this.initKeyTable();
            },

            addKey: function() {
                if (this.addKeyModel) $("#" + this.addKeyModel.modalId).remove();

                require(["setupModuleManage.addKey.view"], function(AddKey) {
                    var addKey = new AddKey({
                        isEdit: false
                    });

                    var options = {
                        title: "新增KEY",
                        body: addKey,
                        backdrop: 'static',
                        type: 2,
                        onOKCallback: function() {
                            addKey.getCurrentKey();
                            var flag = this.checkArgs(addKey.currentKey);
                            if (flag) {
                                this.currentGroup.configItemList.push(addKey.currentKey);
                                this.addKeyModel.$el.modal("hide");
                                this.initKeyTable();
                            }
                        }.bind(this),
                    }
                    this.addKeyModel = new Modal(options);

                }.bind(this))
            },

            checkArgs: function(data) {
                if (data.configKey == "") {
                    alert("KEY不能为空！");
                    return false;
                } else if (data.itemName == "") {
                    alert("显示不能为空！");
                    return false;
                } else if (data.defaultValue == "") {
                    alert("默认值不能为空！");
                    return false;
                } else if (data.validateRule == "") {
                    alert("正则校验不能为空！");
                    return false;
                } else if (data.itemDescription == "") {
                    alert("描述说明不能为空！");
                    return false;
                }
                return true
            },

            initKeyTable: function() {
                _.each(this.currentGroup.configItemList, function(el) {
                    switch (el.valueType) {
                        case 1:
                            el.valueTypeName = "数值型"
                            break;
                        case 2:
                            el.valueTypeName = "字符型"
                            break;
                        case 3:
                            el.valueTypeName = "数值型开关"
                            break;
                        case 4:
                            el.valueTypeName = "布尔型开关"
                            break;
                        case 5:
                            el.valueTypeName = "数值型枚举"
                            break;
                        case 6:
                            el.valueTypeName = "字符型枚举"
                            break;
                        case 7:
                            el.valueTypeName = "数值型数组"
                            break;
                        case 8:
                            el.valueTypeName = "字符型数组"
                            break;
                        case 9:
                            el.valueTypeName = "json"
                            break;
                    }
                }.bind(this))

                this.keyTable = $(_.template(template['tpl/setupModuleManage/setupModuleManage.keyTable.html'])({
                    data: this.currentGroup.configItemList,
                }));
                this.$el.find(".keyList-pannel").html(this.keyTable[0]);

                this.$el.find(".key-modify").on("click", $.proxy(this.onClickEditKey, this))
                this.$el.find(".key-delete").on("click", $.proxy(this.onClickDeleteKey, this))
            },

            onClickDeleteKey: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                id = $(eventTarget).attr("id");
                Utility.confirm("你确定要删除吗？", function() {
                    this.currentGroup.configItemList = _.filter(this.currentGroup.configItemList, function(el) {
                        return el.id != id
                    }.bind(this))
                    this.initKeyTable();
                }.bind(this))
            },

            onClickEditKey: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                id = $(eventTarget).attr("id");
                var currentKey = _.find(this.currentGroup.configItemList, function(el) {
                    return el.id == id;
                })
                if (this.addKeyModel) $("#" + this.addKeyModel.modalId).remove();

                require(["setupModuleManage.addKey.view"], function(AddKey) {
                    var addKey = new AddKey({
                        isEdit: true,
                        currentKey: currentKey
                    });

                    var options = {
                        title: "修改KEY",
                        body: addKey,
                        backdrop: 'static',
                        type: 2,
                        onOKCallback: function() {
                            var flag = this.checkArgs(addKey.currentKey);
                            if (flag) {
                                addKey.getCurrentKey();
                                this.addKeyModel.$el.modal("hide");
                                this.initKeyTable();
                            }
                        }.bind(this),
                    }
                    this.addKeyModel = new Modal(options);

                }.bind(this))
            },

            onGroupNameBlur: function() {
                this.currentGroup.groupName = this.$el.find("#groupName").val()
            },

            onGroupDescriptionBlur: function() {
                this.currentGroup.groupDescription = this.$el.find("#groupDescription").val()
            },

            render: function(target) {
                this.$el.appendTo(target)
                this.target = target;
            }
        });

        return AddGroupList;
    });