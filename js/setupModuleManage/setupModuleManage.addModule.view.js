define("setupModuleManage.addModule.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var AddGroup = Backbone.View.extend({
            events: {},
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/setupModuleManage/setupModuleManage.addGroup.html'])({}));
            },

            getCurrentGroup: function() {
                var groupName = this.$el.find("#groupName").val().trim();
                var groupDescription = this.$el.find("#groupDescription").val().trim();
                var group = {
                    groupName: groupName,
                    groupDescription: groupDescription
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
                this.isEdit = options.isEdit;
                this.moduleId = options.moduleId
                if (this.isEdit) {
                    this.collection.off("get.moduleInfo.success");
                    this.collection.off("get.moduleInfo.error");
                    this.collection.on("get.moduleInfo.success", $.proxy(this.onGetModuleSuccess, this));
                    this.collection.on("get.moduleInfo.error", $.proxy(this.onGetError, this));
                    this.collection.getModuleInfo({
                        moduleId: this.moduleId
                    });
                } else {
                    this.currentModule = {
                        id: Utility.randomStr(8),
                        moduleName: "",
                        moduleKey: "",
                        type: 2,
                        valueType: 1,
                        defaultDisplay: false,
                        moduleDescription: "",
                        groupList: []
                    }

                    this.initSetup();
                }
            },

            initSetup: function() {
                this.$el = $(_.template(template['tpl/setupModuleManage/setupModuleManage.addModule.html'])({
                    data: this.currentModule
                }));
                if (this.isEdit) {
                    this.$el.find("#moduleName").attr("disabled", "disabled");
                    this.$el.find("#moduleKey").attr("disabled", "disabled");
                    this.$el.find("#dropdown-type").attr("disabled", "disabled");
                    this.$el.find("#dropdown-defaultDisplay").attr("disabled", "disabled");
                    this.$el.find("#dropdown-valueType").attr("disabled", "disabled");
                }

                this.$el.find(".addGroup").on("click", $.proxy(this.onClickAddGroup, this));
                this.$el.find(".goBack").on("click", $.proxy(this.onClickGoBack, this));

                this.$el.find(".saveModule").on("click", $.proxy(this.onClickSaveModule, this));
                this.collection.off("save.moduleInfo.success");
                this.collection.off("save.moduleInfo.error");
                this.collection.on("save.moduleInfo.success", $.proxy(this.onSaveModuleSuccess, this));
                this.collection.on("save.moduleInfo.error", $.proxy(this.onGetError, this));
                this.initDropMenu();
                this.initGroupList(); //编辑组信息时  
            },

            getCurrentModule: function() {
                if (this.$el.find("#moduleName").val() == "") {
                    alert("请输入模块名称！");
                    return false;
                } else if (this.$el.find("#moduleKey").val() == "") {
                    alert("请输入英文缩写！");
                    return false;
                } else if (this.$el.find("#moduleDescription").val() == "") {
                    alert("请输入描述说明！");
                    return false;
                } else if (this.currentModule.groupList.length == 0) {
                    alert("请先添加分组！");
                    return false;
                } else {
                    var obj = _.find(this.currentModule.groupList, function(el) {
                        return el.configItemList.length == 0
                    }.bind(this))
                    if (obj && obj.length != 0) {
                        alert("请先添加KEY！");
                        return false;
                    }
                }
                this.currentModule.moduleName = this.$el.find("#moduleName").val().trim();
                this.currentModule.moduleKey = this.$el.find("#moduleKey").val().trim();
                this.currentModule.moduleDescription = this.$el.find("#moduleDescription").val().trim();
                return true;
            },

            onClickSaveModule: function() {
                var flag = this.getCurrentModule()
                var module = $.extend(true, {}, this.currentModule);
                if (flag) {
                    if (!this.isEdit) delete module.id
                    _.each(module.groupList, function(group) {
                        if (group.id.length == 8 && typeof group.id == "string") {
                            delete group.id;
                            delete group.moduleId;
                        }
                        _.each(group.configItemList, function(key) {
                            if (key.id.length == 8 && typeof key.id == "string") {
                                delete key.id;
                                delete key.groupId;
                            }
                            if (key.valueList.length == 0) {
                                key.valueList = "";
                            } else {
                                key.valueList = JSON.stringify(key.valueList)
                            }
                        }.bind(this))
                    }.bind(this))
                    console.log(module);
                    this.collection.saveModuleInfo(module);
                }
            },
            //已有模块点击修改时有组的信息
            initGroupList: function() {
                require(["setupModuleManage.addGroupList.view"], function(AddGroupList) {
                    _.each(this.currentModule.groupList, function(el) {
                        var addGroupList = new AddGroupList({
                            currentGroup: el,
                            isEdit: this.isEdit
                        });
                        addGroupList.render(this.$el.find(".groupList-pannel"));
                    }.bind(this))
                    //this.$el.find(".deleteGroup").on("click", $.proxy(this.onClickDeleteGroup, this))
                }.bind(this))
            },

            onClickDeleteGroup: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                Utility.confirm("你确定要删除吗？", function() {
                    this.currentModule.groupList =
                        _.filter(this.currentModule.groupList, function(el) {
                            return el.id != id;
                        }.bind(this))
                    this.$el.find(".well#" + id).addClass("zoomOut animated");
                    setTimeout(function() {
                        this.$el.find(".well#" + id).remove();
                    }.bind(this), 800)
                }.bind(this))
            },

            onClickAddGroup: function() {
                if (this.addGroupModel) $("#" + this.addGroupModel.modalId).remove();
                var addGroup = new AddGroup({
                    options: this.options,
                    collection: this.collection,
                })
                var options = {
                    title: "新增分组",
                    body: addGroup,
                    backdrop: 'static',
                    type: 2,
                    width: 600,
                    onOKCallback: function() {
                        var group = addGroup.getCurrentGroup();
                        if (group.groupName == "")
                            alert("分组名称不能为空！");
                        else if (group.groupDescription == "")
                            alert("描述说明不能为空！");
                        else {
                            this.addGroupModel.$el.modal("hide");
                            this.showGroupList(group);
                        }
                    }.bind(this),
                }

                this.addGroupModel = new Modal(options);
            },
            //新建组时
            showGroupList: function(group) {
                require(["setupModuleManage.addGroupList.view"], function(AddGroupList) {
                    var addGroupList = new AddGroupList({
                        groupName: group.groupName,
                        groupDescription: group.groupDescription,
                        moduleId: this.currentModule.id
                    });
                    addGroupList.$el.addClass("fadeInDownBig animated")
                    addGroupList.render(this.$el.find(".groupList-pannel"));
                    addGroupList.$el.find(".deleteGroup").on("click", $.proxy(this.onClickDeleteGroup, this))
                    this.currentModule.groupList.push(addGroupList.currentGroup);
                }.bind(this))
            },

            initDropMenu: function() {
                var typeNode = this.$el.find(".dropdown-type");
                var valueTypeNode = this.$el.find(".dropdown-valueType");
                var defaultDisplayNode = this.$el.find(".dropdown-defaultDisplay");
                this.type = [{
                    name: "直播推流",
                    value: 2
                }, {
                    name: "RTMP&FLV拉流",
                    value: 3
                }]

                this.valueType = [{
                    name: "Normal",
                    value: 1
                }, {
                    name: "Table",
                    value: 2
                }, {
                    name: "Array",
                    value: 3
                }]

                this.defaultDisplay = [{
                    name: "Y",
                    value: true,
                }, {
                    name: "N",
                    value: false
                }]

                Utility.initDropMenu(typeNode, this.type, function(value) {
                    this.currentModule.type = parseInt(value);

                }.bind(this));
                if (!this.isEdit || this.currentModule.type == 2)
                    this.$el.find("#dropdown-type .cur-value").html(this.type[0].name)
                else
                    this.$el.find("#dropdown-type .cur-value").html(this.type[1].name)

                Utility.initDropMenu(valueTypeNode, this.valueType, function(value) {
                    this.currentModule.valueType = parseInt(value);
                }.bind(this));

                if (!this.isEdit) {
                    this.$el.find("#dropdown-valueType .cur-value").html(this.valueType[0].name)
                } else {
                    _.each(this.valueType, function(el) {
                        if (el.value == this.currentModule.valueType)
                            this.$el.find("#dropdown-valueType .cur-value").html(el.name)
                    }.bind(this))
                }

                Utility.initDropMenu(defaultDisplayNode, this.defaultDisplay, function(value) {
                    this.currentModule.defaultDisplay = Boolean(value);
                }.bind(this));

                if (!this.isEdit || !this.currentModule.defaultDisplay)
                    this.$el.find("#dropdown-defaultDisplay .cur-value").html(this.defaultDisplay[1].name)
                else
                    this.$el.find("#dropdown-defaultDisplay .cur-value").html(this.defaultDisplay[0].name)
            },

            onClickGoBack: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            onGetModuleSuccess: function(res) {
                _.each(res.groupList, function(group) {
                    _.each(group.configItemList, function(key) {
                        if (key.valueList == null) {
                            key.valueList = [];
                        } else if (key.valueList != "") {
                            key.valueList = JSON.parse(key.valueList);
                        }
                    }.bind(this))
                }.bind(this))
                this.currentModule = res;
                this.initSetup();
                this.$el.appendTo(this.target)
            },

            onSaveModuleSuccess: function() {
                alert("保存成功！");
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            render: function(target) {
                this.$el.appendTo(target)
                this.target = target;
            }
        });

        return AddModule;
    });