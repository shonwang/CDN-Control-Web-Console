define("httpHeaderOpt.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditHttpHeaderView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/httpHeaderOpt/httpHeaderOpt.add.html'])());

            this.defaultParam = {
                directionType: 1, //    1:客户端到CDN 2：CDN到源站 3：源站到CDN 4：CDN到客户端
                actionType: 1, //动作类型 1:增加 2:修改 3:隐藏
                headerKey: "",
                headerValue: "",
                type: 9,
                policy: ""
            }; 

            if (this.isEdit){
                this.defaultParam.type = this.model.get("matchingType");
                this.defaultParam.policy = this.model.get("matchingValue") || "";
                this.defaultParam.directionType = this.model.get("directionType");
                this.defaultParam.actionType = this.model.get("actionType");
                this.defaultParam.headerKey = this.model.get("headerKey") || "";
                this.defaultParam.headerValue = this.model.get("headerValue") || "";
            }

            require(['matchCondition.view', 'matchCondition.model'], function(MatchConditionView, MatchConditionModel){
                var  matchConditionArray = [
                    {name: "全部文件", value: 9},
                    {name: "文件类型", value: 0},
                    {name: "指定URI", value: 2},
                    {name: "指定目录", value: 1},
                    {name: "正则匹配", value: 3},
                ], matchConditionOption = {
                    collection: new MatchConditionModel(),
                    defaultCondition : this.defaultParam.type,
                    defaultPolicy: this.defaultParam.policy,
                    matchConditionArray: matchConditionArray
                }
                this.matchConditionView = new MatchConditionView(matchConditionOption);
                this.matchConditionView.render(this.$el.find(".match-condition-ctn"));

                this.$el.find("#args").val(this.defaultParam.headerKey);
                this.$el.find("#values").val(this.defaultParam.headerValue);
                this.initDirectionDropdown();
            }.bind(this))
        },

        initDirectionDropdown: function(){
            var  directionArray = [
                {name: "1.客户端到CDN", value: 1},
                {name: "2.CDN到源站", value: 2},
                {name: "3.源到CDN", value: 3},
                {name: "4.CDN到客户端", value: 4}
            ],
            rootNode = this.$el.find(".direction");
            Utility.initDropMenu(rootNode, directionArray, function(value){
                this.defaultParam.directionType = parseInt(value)
                this.initActionDropdown();
            }.bind(this));

            var defaultValue = _.find(directionArray, function(object){
                return object.value === this.defaultParam.directionType;
            }.bind(this));

            if (defaultValue){
                this.$el.find("#dropdown-direction .cur-value").html(defaultValue.name);
                this.defaultParam.directionType = defaultValue.value;
            } else {
                this.$el.find("#dropdown-direction .cur-value").html(directionArray[0].name);
                this.defaultParam.directionType = directionArray[0].value;
            }
            this.initActionDropdown();
        },

        initActionDropdown: function(){
            var  actionArray;
            if (this.defaultParam.directionType === 1 || this.defaultParam.directionType === 4){
                actionArray = [
                    {name: "增加", value: 1},
                    {name: "隐藏", value: 3},
                    {name: "修改", value: 2}
                ]
            } else if (this.defaultParam.directionType === 2){
                actionArray = [
                    {name: "增加", value: 1},
                    {name: "修改", value: 2}
                ]
            } else if (this.defaultParam.directionType === 3){
                actionArray = [
                    {name: "隐藏", value: 3}
                ]
            }
            var rootOtherNode = this.$el.find(".action");
            Utility.initDropMenu(rootOtherNode, actionArray, function(value){
                this.defaultParam.actionType = parseInt(value)
            }.bind(this));

            var defaultOtherValue = _.find(actionArray, function(object){
                return object.value === this.defaultParam.actionType;
            }.bind(this));

            if (defaultOtherValue){
                this.$el.find("#dropdown-action .cur-value").html(defaultOtherValue.name);
                this.defaultParam.actionType = defaultOtherValue.value;
            } else {
                this.$el.find("#dropdown-action .cur-value").html(actionArray[0].name);
                this.defaultParam.actionType = actionArray[0].value;
            }
        },

        onSure: function(){
            var matchConditionParam = this.matchConditionView.getMatchConditionParam();
            if (!matchConditionParam) return false;

            var headerKey = this.$el.find("#args").val(), headerValue = this.$el.find("#values").val();
            if (headerKey === "" || headerValue === ""){
                Utility.warning("参数和值不能为空");
                return false
            } else {
                var headerKeyName = "参数: " + headerKey + "<br>",
                    headerValueName = "值: " + headerValue + "<br>";
            }

            var directionTypeName = "";
            if (this.defaultParam.directionType === 1) directionTypeName = "方向：客户端到CDN<br>";
            if (this.defaultParam.directionType === 2) directionTypeName = "方向：CDN到源站<br>";
            if (this.defaultParam.directionType === 3) directionTypeName = "方向：源到CDN<br>";
            if (this.defaultParam.directionType === 4) directionTypeName = "方向：CDN到客户端<br>";

            var actionTypeName = "";
            if (this.defaultParam.actionType === 1) actionTypeName = "动作：增加<br>";
            if (this.defaultParam.actionType === 2) actionTypeName = "动作：修改<br>";
            if (this.defaultParam.actionType === 3) actionTypeName = "动作：隐藏<br>";

            var summary = directionTypeName + actionTypeName + headerKeyName + headerValueName

            var postParam = {
                "id": this.isEdit ? this.model.get("id") : new Date().valueOf(),
                "matchingType": matchConditionParam.type,
                "typeName": matchConditionParam.typeName,
                "matchingValue": matchConditionParam.policy,
                "directionType": this.defaultParam.directionType,
                "actionType": this.defaultParam.actionType,
                "headerKey": headerKey,
                "headerValue": headerValue,
                "summary": summary
            }
            return postParam
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });


    var HttpHeaderOptView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/httpHeaderOpt/httpHeaderOpt.html'])());
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

            this.collection.on("get.header.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.header.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRule, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.onClickQueryButton();
            this.collection.on("set.header.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.header.error", $.proxy(this.onGetError, this));
        },

        onSaveSuccess: function(){
            Utility.alerts("保存成功！", "success", 5000)
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

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        onChannelListSuccess: function(){
            this.initTable();
        },

        onClickQueryButton: function(){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getHeaderList({originId:this.domainInfo.id});
        },

        initTable: function(){
            var allFileArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 9;
            }.bind(this));

            var specifiedUrlArray = this.collection.filter(function(obj){
                return obj.get('matchingType') === 2;
            }.bind(this));

            var otherArray = this.collection.filter(function(obj){
                return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
            }.bind(this));

            this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)

            this.table = $(_.template(template['tpl/customerSetup/domainList/httpHeaderOpt/httpHeaderOpt.table.html'])({
                data: this.collection.models,
                hideAction: false
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
                    _.each(postParam, function(value, key, ls){
                        model.set(key, value);
                    }.bind(this))
                    this.collection.trigger("get.header.success");
                    this.addRolePopup.$el.modal('hide');
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
                    var model = new this.collection.model(postParam);
                    var allFileArray = this.collection.filter(function(obj){
                        return obj.get('matchingType') === 9;
                    }.bind(this));

                    var specifiedUrlArray = this.collection.filter(function(obj){
                        return obj.get('matchingType') === 2;
                    }.bind(this));

                    var otherArray = this.collection.filter(function(obj){
                        return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
                    }.bind(this));

                    if (postParam.type === 9) allFileArray.push(model)
                    if (postParam.type === 2) specifiedUrlArray.push(model)
                    if (postParam.type !== 9 && postParam.type !== 2) otherArray.push(model)
  
                    this.collection.models = specifiedUrlArray.concat(otherArray, allFileArray)
                    this.collection.trigger("get.header.success");
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
            for (var i = 0; i < this.collection.models.length; i++){
                if (this.collection.models[i].get("id") === parseInt(id)){
                    this.collection.models.splice(i, 1);
                    this.collection.trigger("get.header.success")
                    return;
                }
            }
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

    return HttpHeaderOptView;
});