define("luaStatusCodeCache.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditHttpHeaderView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaStatusCodeCache/luaStatusCodeCache.add.html'])());

            this.defaultParam = {
                code: "",
                expireTime: "",
                locationId:''//编辑时的id
            }; 

            if (this.isEdit){
                this.defaultParam.code = this.model.get("code") || "";
                this.defaultParam.expireTime = this.model.get("expireTime") || "";
                this.defaultParam.locationId = this.model.get("locationId");
            }

        },

        onSure: function(){
            /*
            var matchConditionParam = this.matchConditionView.getMatchConditionParam();
            if (!matchConditionParam) return false;
            */

            var code = this.$el.find("#args").val(), expireTime = this.$el.find("#values").val();
            if (code === "" || expireTime === ""){
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
                "code": code,
                "expireTime": expireTime
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

            this.collection.on("get.header.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.header.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRule, this));
            //this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.onClickQueryButton();
            this.collection.on("set.header.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.header.error", $.proxy(this.onGetError, this));
            this.collection.on("modify.header.success", $.proxy(this.onModifySuccess, this));
            this.collection.on("modify.header.error", $.proxy(this.onGetError, this));
            this.collection.on("del.header.success", $.proxy(this.onDelSuccess, this));
            this.collection.on("del.header.error", $.proxy(this.onGetError, this));
        },

        onSaveSuccess: function(){
            alert("保存成功！");
            var args = {
                originId:this.domainInfo.id
            };
            this.collection.getHeaderList(args);
        },
        
        onModifySuccess: function(){
            alert("修改成功！");
            var args = {
                originId:this.domainInfo.id
            };
            this.collection.getHeaderList(args);
        },

        onDelSuccess: function(){
            alert("删除成功！");
            var args = {
                originId:this.domainInfo.id
            };
            this.collection.getHeaderList(args);
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
        /*
        onClickSaveBtn: function(){
            var list = [];
            this.collection.each(function(obj){
                list.push({
                    "matchingType": obj.get('matchingType'),
                    "matchingValue": obj.get('matchingValue'),
                    "directionType": obj.get('directionType'),
                    "actionType": obj.get('actionType'),
                    "headerKey": obj.get('headerKey'),
                    "headerValue": obj.get('headerValue')
                })
            }.bind(this))

            var postParam = {
                "originId": this.domainInfo.id,
                "list": list
            }

            this.collection.setHttpHeader(postParam)
        },
        */

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onChannelListSuccess: function(){
            this.initTable();
        },

        onClickQueryButton: function(){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getHeaderList({originId:this.domainInfo.id});
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
            this.table.find("tbody .up").on("click", $.proxy(this.onClickItemUp, this));
            this.table.find("tbody .down").on("click", $.proxy(this.onClickItemDown, this));
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.find(function(obj){
                return obj.get("id") === parseInt(id)
            }.bind(this));
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditHttpHeaderView = new AddEditHttpHeaderView({
                collection: this.collection,
                model: model,
                isEdit: true
            });

            var options = {
                title:"HTTP头的增删该查",
                body : myAddEditHttpHeaderView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditHttpHeaderView.onSure();
                    if (!postParam) return;
                    var args = {
                        "originId":this.domainInfo.id,
                        "locationId": postParam.locationId,
                        "directionType":  postParam.directionType,
                        "actionType": postParam.actionType,
                        "headerKey":  postParam.headerKey,
                        "headerValue":  postParam.headerValue
                    };
                    this.collection.trigger("get.header.success");
                    this.collection.modifyHttpHeader(args);
                    this.addRolePopup.$el.modal('hide');
                    Utility.onContentChange();
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickAddRule: function(event){
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditHttpHeaderView = new AddEditHttpHeaderView({collection: this.collection});

            var options = {
                title:"HTTP头的增删该查",
                body : myAddEditHttpHeaderView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditHttpHeaderView.onSure();
                    if (!postParam) return;
                    var args = {
                        originId:this.domainInfo.id,
                        list:[
                            {
                                "locationId": postParam.locationId,
                                "directionType":  postParam.directionType,
                                "actionType": postParam.actionType,
                                "headerKey":  postParam.headerKey,
                                "headerValue":  postParam.headerValue
                            }    
                        ]
                    };
                    
                    //下边三行用于测试数据
                    var model = new this.collection.model(postParam);
                    this.collection.push(model);
                    this.collection.trigger("get.header.success");

                    this.collection.setHttpHeader(args);
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
                locationId:model.atrributes.locationId
            };
            
            this.collection.deleteHttpHeader(args);
        },

        onClickItemUp: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), modelIndex;

            var allFileArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
            }.bind(this));

            _.each(otherArray, function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            otherArray = Utility.adjustElement(otherArray, modelIndex, true)

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.collection.trigger("get.header.success")
        },

        onClickItemDown: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), modelIndex;

            var allFileArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
            }.bind(this));

            _.each(otherArray, function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            otherArray = Utility.adjustElement(otherArray, modelIndex, false)

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.collection.trigger("get.header.success")
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