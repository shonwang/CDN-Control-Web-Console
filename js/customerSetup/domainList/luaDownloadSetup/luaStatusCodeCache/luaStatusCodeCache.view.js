define("luaStatusCodeCache.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditStatusCodeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaStatusCodeCache/luaStatusCodeCache.add.html'])());

            this.defaultParam = {
                id:"",
                codes: "",
                expireTime: "",
                locationId:''//编辑时的id
            }; 

            if (this.isEdit){
                this.defaultParam.codes = this.model.get("codes") || "";
                this.defaultParam.expireTime = this.model.get("expireTime") || "";
                this.defaultParam.id = this.model.get("id");
            }

            this.initEditTemplate();

        },
        initEditTemplate:function(){
            console.log(this.defaultParam);
            if(this.isEdit){
                this.$el.find("#args").val(this.defaultParam.codes);
                this.$el.find("#values").val(this.defaultParam.expireTime);
            }
        },
        onSure: function(){
            /*
            var matchConditionParam = this.matchConditionView.getMatchConditionParam();
            if (!matchConditionParam) return false;
            */

            var codes = this.$el.find("#args").val(), expireTime = this.$el.find("#values").val();
            if (codes === "" || expireTime === ""){
                alert("状态码和缓存时间不能为空");
                return false
            } 
            if(!Utility.isNumber(expireTime)){
                alert("缓存时间只能填数字");
                return false;
            }


            var postParam = {
                "id": this.isEdit ? this.model.get("id") : new Date().valueOf(),
                "locationId": this.defaultParam.locationId,
                "codes": codes,
                "expireTime": parseInt(expireTime)
            }
            return postParam
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });


    var LuaStatusCodeCacheView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaStatusCodeCache/luaStatusCodeCache.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.clientInfo = clientInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: false
            }));
            this.optHeader.find(".save").remove();
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.collection.on("get.statusCode.success", $.proxy(this.onStatusCodeSuccess, this));
            this.collection.on("get.statusCode.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRule, this));
            //this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.onClickQueryButton();
            this.collection.on("set.statusCode.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.statusCode.error", $.proxy(this.onGetError, this));
            this.collection.on("modify.statusCode.success", $.proxy(this.onModifySuccess, this));
            this.collection.on("modify.statusCode.error", $.proxy(this.onGetError, this));
            this.collection.on("del.statusCode.success", $.proxy(this.onDelSuccess, this));
            this.collection.on("del.statusCode.error", $.proxy(this.onGetError, this));
        },

        onSaveSuccess: function(){
            alert("保存成功！");
            this.onClickQueryButton();
        },
        
        onModifySuccess: function(){
            alert("修改成功！");
            this.onClickQueryButton();
        },

        onDelSuccess: function(){
            alert("删除成功！");
            this.onClickQueryButton();
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: new SaveThenSendModel(),
                    domainInfo: this.domainInfo,
                    onSendSuccess: function() {
                        this.sendPopup.$el.modal("hide");
                        window.location.hash = '#/domainList/' + this.options.query;
                    }.bind(this)
                });
                var options = {
                    title: "发布",
                    body : mySaveThenSendView,
                    backdrop : 'static',
                    type     : 2,
                    width: 1000,
                    onOKCallback:  function(){
                        mySaveThenSendView.sendConfig();
                    }.bind(this),
                    onHiddenCallback: function(){
                        if (this.sendPopup) $("#" + this.sendPopup.modalId).remove();
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onStatusCodeSuccess: function(){
            this.initTable();
        },

        onClickQueryButton: function(){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getStatusCodeList({originId:this.domainInfo.id});
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaStatusCodeCache/luaStatusCodeCache.table.html'])({
                data: this.collection.models
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.find(function(obj){
                return obj.get("id") === parseInt(id)
            }.bind(this));
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditStatusCodeView = new AddEditStatusCodeView({
                collection: this.collection,
                model: model,
                isEdit: true
            });

            var options = {
                title:"状态码缓存",
                body : myAddEditStatusCodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditStatusCodeView.onSure();
                    if (!postParam) return;
                    var args = {
                        "id": postParam.id,
                        "originId":this.domainInfo.id,
                        "codes":  postParam.codes,
                        "expireTime": postParam.expireTime
                    };
                    this.collection.modifyStatusCode(args);
                    this.addRolePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickAddRule: function(event){
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditStatusCodeView = new AddEditStatusCodeView({collection: this.collection});

            var options = {
                title:"状态码缓存",
                body : myAddEditStatusCodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditStatusCodeView.onSure();
                    if (!postParam) return;
                    var args = {
                        "originId":this.domainInfo.id,
                        "codes":  postParam.codes,
                        "expireTime": postParam.expireTime
                    };
                    this.collection.addStatusCode(args);
                    this.addRolePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickItemDelete: function(event){
            var result = confirm("你确定要删除吗？");
            if (!result) return;
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");
            var model = this.collection.get(id);
            var args = {
                id:id,
                originId:model.attributes.originId
            };
            
            this.collection.delStatusCode(args);
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query, query2, target){
            this.options.query = query;
            this.options.query2 = query2;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target){
            this.$el.appendTo(target);
        }
    });

    return LuaStatusCodeCacheView;
});