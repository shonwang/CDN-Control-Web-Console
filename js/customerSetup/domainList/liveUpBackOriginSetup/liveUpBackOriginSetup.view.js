define("liveUpBackOriginSetup.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var LiveUpBackOriginSetupView = Backbone.Collection.extend({
            events: {},

            initialize: function(options) {
                this.collection = options.collection;
                this.options = options;
                this.$el = $(_.template(template['tpl/customerSetup/domainList/liveUpBackOriginSetup/liveUpBackOriginSetup.html'])());
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
                    notShowBtn: false
                }));
                this.optHeader.appendTo(this.$el.find(".opt-ctn"));

                this.$el.find(".add").on("click", $.proxy(this.onClickAddItem, this))
                this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this))
                this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

                this.collection.on("get.pushConf.success", $.proxy(this.initTable, this));
                this.collection.on("get.pushConf.error", $.proxy(this.onGetError, this));
                this.collection.getPushSourceConfig({
                    originId: this.domainInfo.id
                });

                // this.collection.on("set.pushConf.success", $.proxy(this.onSaveSuccess, this));
                // this.collection.on("set.pushConf.error", $.proxy(this.onGetError, this));
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

            initTable: function() {
                this.table = $(_.template(template['tpl/customerSetup/domainList/liveUpBackOriginSetup/liveUpBackOriginSetup.table.html'])({
                    data: this.collection.models
                }));
                if (this.collection.models.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                this.table.find("tbody .togglebutton input").on("click", $.proxy(this.onClickItemToggle, this));
            },

            onClickItemToggle: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;

                var id = $(eventTarget).attr("id"),
                    model = this.collection.get(id);

                model.set("openFlag", eventTarget.checked ? 1 : 0)
            },

            onClickItemEdit: function(event) {
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");

                var model = this.collection.find(function(obj) {
                    return obj.get("id") === parseInt(id)
                }.bind(this));
                if (this.addItemPopup) $("#" + this.addItemPopup.modalId).remove();
                require(['liveUpBackOriginSetup.edit.view'], function(AddEditItemView) {
                    var myAddEditItemView = new AddEditItemView({
                        collection: this.collection,
                        model: model,
                        isEdit: true,
                        userInfo: this.userInfo
                    });

                    var options = {
                        title: "转推设置",
                        body: myAddEditItemView,
                        backdrop: 'static',
                        type: 2,
                        width: 800,
                        onOKCallback: function() {
                            var postParam = myAddEditItemView.onSure();
                            if (!postParam) return;
                            _.each(postParam, function(value, key, ls) {
                                model.set(key, value);
                            }.bind(this))
                            this.collection.trigger("get.pushConf.success");
                            this.addItemPopup.$el.modal('hide');
                        }.bind(this),
                        onHiddenCallback: function() {}.bind(this)
                    }
                    this.addItemPopup = new Modal(options);
                }.bind(this))
            },

            onClickAddItem: function(event) {
                if (this.addItemPopup) $("#" + this.addItemPopup.modalId).remove();
                require(['liveUpBackOriginSetup.edit.view'], function(AddEditItemView) {
                    var myAddEditItemView = new AddEditItemView({
                        collection: this.collection,
                        userInfo: this.userInfo
                    });

                    var options = {
                        title: "转推设置",
                        body: myAddEditItemView,
                        backdrop: 'static',
                        type: 2,
                        width: 800,
                        onOKCallback: function() {
                            var postParam = myAddEditItemView.onSure();
                            if (!postParam) return;
                            var model = new this.collection.model(postParam);
                            this.collection.push(model);
                            this.collection.trigger("get.pushConf.success");
                            this.addItemPopup.$el.modal('hide');
                        }.bind(this),
                        onHiddenCallback: function() {}.bind(this)
                    }
                    this.addItemPopup = new Modal(options);
                }.bind(this))
            },

            onClickItemDelete: function(event) {
                var result = confirm("你确定要删除吗？");
                if (!result) return;
                var eventTarget = event.srcElement || event.target,
                    id = $(eventTarget).attr("id");
                for (var i = 0; i < this.collection.models.length; i++) {
                    if (this.collection.models[i].get("id") === parseInt(id)) {
                        this.collection.models.splice(i, 1);
                        this.collection.trigger("get.pushConf.success")
                        return;
                    }
                }
            },

            onClickSaveBtn: function() {
                var list = [];
                this.collection.each(function(obj) {
                    list.push({
                        "type": obj.get('type'),
                        "pushConf": obj.get('pushConf'),
                        "expireTime": obj.get('expireTime'),
                        "hasOriginPolicy": obj.get('hasOriginPolicy'),
                    })
                }.bind(this))

                var postParam = {
                    "originId": this.domainInfo.id,
                    "userId": this.clientInfo.uid,
                    "list": list
                }

                this.collection.setPolicy(postParam)
            },

            onSaveSuccess: function() {
                alert("保存成功！")
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

        return LiveUpBackOriginSetupView;
    });