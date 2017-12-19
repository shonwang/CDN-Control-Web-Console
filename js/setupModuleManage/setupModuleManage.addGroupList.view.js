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
                        "moduleId": this.options.moduleId, //模块Id
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
                this.$el.find(".addKey").on("click", $.proxy(this.onClickAddKey, this))
                this.initKeyTable();
            },
            
            onClickAddKey: function() {
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
                            var flag = addKey.getCurrentKey();
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

                if(this.currentGroup.configItemList.length!=0){
                    this.keyTable = $(_.template(template['tpl/setupModuleManage/setupModuleManage.keyTable.html'])({
                        data: this.currentGroup.configItemList,
                    }));
                this.$el.find(".keyList-pannel").html(this.keyTable[0]);
                this.$el.find(".key-modify").on("click", $.proxy(this.onClickEditKey, this))
                this.$el.find(".key-delete").on("click", $.proxy(this.onClickDeleteKey, this))
                this.$el.find(".up").on("click",$.proxy(this.onClickUpButton,this))
                this.$el.find(".down").on("click",$.proxy(this.onClickDownButton,this))
                }
                else
                  this.$el.find(".keyList-pannel").html("");
                
            },
            
            onClickUpButton:function(event){          
                var eventTarget = event.srcElement || event.target,
                id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                }
                else 
                    id = $(eventTarget).attr("id");

                var list=this.currentGroup.configItemList;
                list=Utility.adjustElement(list,parseInt(id),true);
                this.currentGroup.configItemList = list;
                this.initKeyTable();
            },

            onClickDownButton:function(event){
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                }
                else 
                    id = $(eventTarget).attr("id");

                var list = this.currentGroup.configItemList;
                list = Utility.adjustElement(list, parseInt(id), false);
                this.currentGroup.configItemList = list;
                this.initKeyTable();
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
                        currentKey: currentKey,
                    });

                    var options = {
                        title: "修改KEY",
                        body: addKey,
                        backdrop: 'static',
                        type: 2,
                        onOKCallback: function() {
                            var flag = addKey.getCurrentKey();
                            if (flag) {
                                this.addKeyModel.$el.modal("hide");
                                this.initKeyTable();
                            }
                        }.bind(this),
                    }
                    this.addKeyModel = new Modal(options);

                }.bind(this))
            },

            onGroupNameBlur: function() {
                this.currentGroup.groupName = this.$el.find("#groupName").val().trim()
            },

            onGroupDescriptionBlur: function() {
                this.currentGroup.groupDescription = this.$el.find("#groupDescription").val().trim()
            },

            render: function(target) {
                this.$el.appendTo(target)
                this.target = target;
            }
        });

        return AddGroupList;
    });