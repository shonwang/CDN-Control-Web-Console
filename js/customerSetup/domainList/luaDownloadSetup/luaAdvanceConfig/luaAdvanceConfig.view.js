define("luaAdvanceConfig.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditRoleView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaAdvanceConfig/luaAdvanceConfig.add.html'])());

            this.defaultParam = {
                configNames:"",
                matchingType: 0,
                matchingValue: ""
            };            

            if (this.isEdit){
              
                this.defaultParam.matchingType = this.model.get("matchingType");
                this.defaultParam.matchingValue = this.model.get("matchingValue") || "";
            }

            require(['matchCondition.view', 'matchCondition.model'], function(MatchConditionView, MatchConditionModel){
                //0文件后缀，1目录，2具体url,3正则预留,4url包含指定参数9全局默认缓存配置项
                var  matchConditionArray = [
                    //{name: "全部文件", value: 9},
                    {name: "文件类型", value: 0},
                    {name: "指定URI", value: 2},
                    {name: "指定目录", value: 1},
                    {name: "正则匹配", value: 3},
                ], matchConditionOption = {
                    collection: new MatchConditionModel(),
                    defaultCondition : this.defaultParam.matchingType,
                    defaultPolicy: this.defaultParam.matchingValue,
                    matchConditionArray: matchConditionArray
                }
                this.matchConditionView = new MatchConditionView(matchConditionOption);
                this.matchConditionView.render(this.$el.find(".match-condition-ctn"));
            }.bind(this))
        },

        onSure: function(){
            var matchConditionParam = this.matchConditionView.getMatchConditionParam();
            if (!matchConditionParam) return false;
            var postParam = {
                "id": this.isEdit ? this.model.get("id") : new Date().valueOf(),
                "matchingType": matchConditionParam.type,
                "matchingValue": matchConditionParam.policy
            }
            return postParam;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var LuaAdvanceConfigView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaAdvanceConfig/luaAdvanceConfig.html'])());
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
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))
            
            
            this.collection.on("get.advanceLocation.success", $.proxy(this.onGetAdvanceLocationListSuccess, this));
            this.collection.on("get.advanceLocation.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRole, this))
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this))
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.onClickQueryButton();

            this.collection.on("set.advanceLocation.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.advanceLocation.error", $.proxy(this.onGetError, this));
            
            this.collection.on("del.location.success", $.proxy(this.onDeleteLocationSuccess, this));
            this.collection.on("del.location.error", $.proxy(this.onGetError, this));

            this.collection.on("sort.location.success", $.proxy(this.onSortSuccess, this));
            this.collection.on("sort.location.error", $.proxy(this.onGetError, this));
        },

        onDeleteLocationSuccess:function(){
            alert("删除成功");
            this.onClickQueryButton();
        },

        onSortSuccess:function(){
            alert("保存成功");
            this.onClickQueryButton();
        },

        onSaveSuccess: function(){
            alert("添加成功！");
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

        onClickSaveBtn: function(){
            var list = [];
            this.collection.each(function(obj){
                list.push(obj.get("id"))
            }.bind(this))

            var postParam = {
                "originId": this.domainInfo.id,
                "ids": list.join(",")
            }
            this.collection.saveSort(postParam);
            Utility.onContentSave();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetAdvanceLocationListSuccess: function(){
            this.initTable();
        },

        onClickQueryButton: function(){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getAdvanceLocationList({originId: this.domainInfo.id});
        },

        initTable: function(){

            this.table = $(_.template(template['tpl/customerSetup/domainList/luaAdvanceConfig/luaAdvanceConfig.table.html'])({
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
            if(window.IS_ALERT_SAVE){
                var result = confirm("顺序已更改，但您没有保存，你确定要去配置吗？");
                if (!result) return;
            }
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");
            window.location.href+="/luaConfigListEdit/"+id;
        },

        onClickAddRole: function(event){
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditRoleView = new AddEditRoleView({collection: this.collection});

            var options = {
                title:"缓存规则",
                body : myAddEditRoleView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditRoleView.onSure();
                    if (!postParam) return;

                    //var model = new this.collection.model(postParam);
                    //this.collection.models.push(model);
                    var args = {
                        originId:this.domainInfo.id,
                        matchingType:postParam.matchingType,
                        matchingValue:postParam.matchingValue
                    };
                    this.collection.addAdvanceLocation(args);
                    //this.collection.trigger("get.advanceLocation.success");
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
            /*
            for (var i = 0; i < this.collection.models.length; i++){
                if (this.collection.models[i].get("id") === parseInt(id)){
                    this.collection.models.splice(i, 1);
                    this.collection.trigger("get.advanceLocation.success")
                    return;
                }
            }
            */
            var args = {
                originId: this.domainInfo.id,
                locationId:id
            };
            this.collection.delLocation(args);
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

            _.each(this.collection.models, function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            this.collection.models = Utility.adjustElement(this.collection.models, modelIndex, true)

            //this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.collection.trigger("get.advanceLocation.success");
            Utility.onContentChange();
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
            _.each(this.collection.models, function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            this.collection.models = Utility.adjustElement(this.collection.models, modelIndex, false)
            //this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)
            this.collection.trigger("get.advanceLocation.success");
            Utility.onContentChange();
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

    return LuaAdvanceConfigView;
});