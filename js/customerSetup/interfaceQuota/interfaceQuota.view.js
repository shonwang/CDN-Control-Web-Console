define("interfaceQuota.view", ['require', 'exports', 'template', 'utility', "modal.view"],
    function (require, exports, template, Utility, Modal) {
        var EditView = Backbone.View.extend({
            initialize: function (options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.args = {
                    "quotaName": this.model.get("quotaName"),
                    "quotaTimes": this.model.get("quotaTimes"),
                    "interfaceCaller":this.options.interfaceCaller
                }
                this.$el = $(_.template(template['tpl/customerSetup/interfaceQuota/interfaceQuota.edit.html'])({ data: this.args }));
                this.$el.find("#input-name").blur(function(){
                    this.onblur()
                }.bind(this));
            },
            onblur:function () {

                var newQuota = this.$el.find("#input-name").val();
                    if( isNaN(newQuota) || newQuota <= 0){
                        this.$el.find("#check").show();
                        this.$el.find("#editQuota").addClass('has-error');
                        return
                    }else{
                        this.$el.find("#editQuota").removeClass('has-error');
                        this.$el.find("#check").hide();
                    }
            },
            getArgs: function (id, popUp,userid) {
                var newQuota = this.$el.find("#input-name").val();
                if (!newQuota.length ||  isNaN(newQuota) || newQuota <= 0) {
                    this.$el.find("#check").show();
                    return
                }
                var quotaName = popUp.get('quotaName');
                var args = {
                    "userId": id,
                    "quotaName": quotaName,
                    "quotaValue": newQuota,
                    "interfaceCaller":userid,
                };
                return args
            },
            render: function (target) {
                this.$el.appendTo(target);
            }
        });
        var InterfaceQuotaView = Backbone.View.extend({
            initialize: function (options) {
                this.collection = options.collection;
                this.options = options;
                this.uid = JSON.parse(options.query).uid;
                this.userId = $('.user-name').html();
                this.queryArgs = {
                    "userId": this.uid,
                    "quotaname": null,
                }
                this.collection.queryChannel(this.queryArgs);
                this.$el = $(_.template(template['tpl/customerSetup/interfaceQuota/interfaceQuota.home.html'])());
                var clientInfo = JSON.parse(options.query);
                this.userInfo = {
                    clientName: clientInfo.clientName,
                    uid: clientInfo.uid
                }
                this.optHeader = $(_.template(template['tpl/customerSetup/customerSetup.header.html'])({
                    data: this.userInfo
                }));
                this.optHeader.appendTo(this.$el.find(".opt-ctn"));
                this.collection.on("get.user.success", $.proxy(this.onChannelListSuccess, this));
                this.collection.on("get.user.error", $.proxy(this.onGetError, this));
                this.collection.on("update.quota.success", function () {
                    alert("修改配额成功！")
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on('update.quota.error', $.proxy(this.onGetError, this));      
            },
            onClickQueryButton: function () {
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.collection.queryChannel(this.queryArgs);
            },
            onGetError: function (error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },
            onChannelListSuccess: function () {
                this.total = this.collection.total || 0;
                if (this.collection.models.length == 0) {
                    this.setNoData("未查到符合条件的数据，请重新查询");
                } else {
                    this.initTable();
                }
                this.initTable();
            },
            setNoData: function (msg) {
                this.$el.find(".table tbody").html('<tr><td  colspan="8" class="text-center"><p class="text-muted text-center">' + msg + '</p></td></tr>');
            },
            initTable: function () {
                this.table = $(_.template(template['tpl/customerSetup/interfaceQuota/interfaceQuota.table.html'])({ data: this.collection.models, permission: AUTH_OBJ }));
                if (this.collection.models.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
                this.table.find("tbody .manage").on("click", $.proxy(this.onClickItemNodeName, this));
                if (!AUTH_OBJ.ManageCustomer) {
                    this.table.find("tbody .manage").remove();
                }
            },
            onClickItemNodeName: function (event) {
                var eventTarget = event.srcElement || event.target;
                var id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                };
                var model = this.collection.get(id);
                if (this.editQuotaPopup) $("#" + this.editQuotaPopup.modalId).remove();
                var editView = new EditView({
                    collection: this.collection,
                    model: model
                });
                var options = {
                    title: "配额设置",
                    body: editView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function () {
                        var options = editView.getArgs(this.uid,model,this.userId);
                        if (!options) return;
                        this.collection.updateQuota(options);
                        this.editQuotaPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function () {
                    }.bind(this)
                };
                this.editQuotaPopup = new Modal(options);
            },
            hide: function () {
                this.$el.hide();
            },
            update: function (query, target) {
                this.options.query = query;
                this.collection.off();
                this.collection.reset();
                this.$el.remove();
                this.initialize(this.options);
                this.render(target);
            },
            render: function (target) {
                this.$el.appendTo(target);
            }
        });
        return InterfaceQuotaView;
    });