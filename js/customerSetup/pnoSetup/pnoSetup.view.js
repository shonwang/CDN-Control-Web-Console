define("pnoSetup.view", ['require', 'exports', 'template', 'utility', "modal.view"],
    function(require, exports, template, Utility, Modal) {

        var EditView = Backbone.View.extend({

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.isEdit = options.isEdit;

                if (this.isEdit) {
                    this.args = {
                        "param": this.model.get("param"),
                        "name": this.model.get("name"),
                    }
                } else {
                    this.args = {
                        "param": "",
                        "name": "",
                    }
                }

                this.$el = $(_.template(template['tpl/customerSetup/pnoSetup/pnoSetup.edit.html'])({
                    data: this.args
                }));
            },

            getArgs: function() {
                var name = this.$el.find("#param-label").val().trim(),
                    value = this.$el.find("#input-value").val().trim();

                if (name === "") {
                    Utility.warning("名称不能为空！")
                    return false;
                }

                var repeatList = this.collection.filter(function(model){
                    return model.get("name") === name
                }.bind(this))

                if (repeatList.length > 0) {
                    Utility.warning(name + " 控制台显示值已经添加过了!")
                    return false
                }

                if (this.isEdit) {
                    this.model.set("param", value);
                    this.model.set("name", name);
                } else {
                    this.collection.push(new this.collection.model({
                        "param": value,
                        "name": name
                    }))
                }
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        var PNOSetupView = Backbone.View.extend({

            initialize: function(options) {
                this.collection = options.collection;
                this.options = options;

                this.$el = $(_.template(template['tpl/customerSetup/pnoSetup/pnoSetup.home.html'])());
                var clientInfo = JSON.parse(options.query);
                this.userInfo = {
                    clientName: clientInfo.clientName,
                    uid: clientInfo.uid
                }
                this.optHeader = $(_.template(template['tpl/customerSetup/customerSetup.header.html'])({
                    data: this.userInfo
                }));
                this.optHeader.appendTo(this.$el.find(".opt-ctn"));

                this.queryArgs = {
                    "userId": clientInfo.uid,
                    "types": "pno",
                }

                this.collection.on("get.params.success", $.proxy(this.onParamsListSuccess, this));
                this.collection.on("get.params.error", $.proxy(this.onGetError, this));
                this.collection.on("set.params.success", function() {
                    Utility.alerts("修改成功！", "success", 5000)
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on('set.params.error', $.proxy(this.onGetError, this));

                this.$el.find(".add").on("click", $.proxy(this.onClickAdd, this));
                this.$el.find(".save").on("click", $.proxy(this.onClickSave, this));

                this.onClickQueryButton();
            },

            onClickSave:function(){
                window.IS_ALERT_SAVE = false;
                var list = _.map(this.collection.models, function(obj){
                    var name = obj.get("name"),
                        param = obj.get("param");
                    return {"name": name, "param": param}
                })

                var postParam = {
                    "userId": this.userInfo.uid,
                    "type": "pno",
                    "interfaceCaller": $(".user-name").html(),
                    "params": list
                }

                this.collection.updateParamsList(postParam);
            },

            onClickQueryButton: function() {
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.collection.queryParamsList(this.queryArgs);
            },

            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            },

            onParamsListSuccess: function() {
                this.initTable();
            },

            initTable: function() {
                this.table = $(_.template(template['tpl/customerSetup/pnoSetup/pnoSetup.table.html'])({
                    data: this.collection.models
                }));
                if (this.collection.models.length !== 0) {
                    this.$el.find(".table-ctn").html(this.table[0]);
                } else {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "暂无数据"
                        }
                    }));
                }
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            },

            onClickAdd: function(event) {
                if (this.pnoSetupPopup) $("#" + this.pnoSetupPopup.modalId).remove();
                var editView = new EditView({
                    collection: this.collection
                });
                var options = {
                    title: "新增PNO参数",
                    body: editView,
                    backdrop: 'static',
                    type: 2,
                    isEdit: false,
                    onOKCallback: function() {
                        window.IS_ALERT_SAVE = true;
                        editView.getArgs();
                        this.initTable();
                        this.pnoSetupPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){}.bind(this)
                };
                this.pnoSetupPopup = new Modal(options);
            },

            onClickItemEdit: function(event) {
                var eventTarget = event.srcElement || event.target, id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                };
                var model = this.collection.get(id);
                if (this.pnoSetupPopup) $("#" + this.pnoSetupPopup.modalId).remove();
                var editView = new EditView({
                    collection: this.collection,
                    model: model,
                    isEdit: true
                });
                var options = {
                    title: "PNO参数修改",
                    body: editView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        window.IS_ALERT_SAVE = true;
                        editView.getArgs();
                        this.initTable();
                        this.pnoSetupPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){}.bind(this)
                };
                this.pnoSetupPopup = new Modal(options);
            },

            onClickItemDelete: function(event){
                var eventTarget = event.srcElement || event.target, id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                };

                this.collection.models = this.collection.filter(function(model){
                    return model.get("id") !== id
                }.bind(this))
                this.initTable();
                window.IS_ALERT_SAVE = true;
            },

            hide: function() {
                this.$el.hide();
            },

            update: function(query, target) {
                this.options.query = query;
                this.collection.off();
                this.collection.reset();
                this.$el.remove();
                this.initialize(this.options);
                this.render(target);
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });
        return PNOSetupView;
    });