define("luaAdvanceConfigHttpHeaderOpt.view", ['require','exports', 'template', 'modal.view', 'utility','luaHttpHeaderOpt.view'], function(require, exports, template, Modal, Utility,LuaHttpHeaderOptView) {

    var AddEditHttpHeaderView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaHttpHeaderOpt/httpHeaderOpt.add.html'])());

            this.defaultParam = {
                directionType: 1, //    1:客户端到CDN 2：CDN到源站 3：源站到CDN 4：CDN到客户端
                actionType: 1, //动作类型 1:增加 2:修改 3:隐藏
                headerKey: "",
                headerValue: "",
                locationId:''//编辑时的id
            }; 

            if (this.isEdit){
                this.defaultParam.directionType = this.model.get("directionType");
                this.defaultParam.actionType = this.model.get("actionType");
                this.defaultParam.headerKey = this.model.get("headerKey") || "";
                this.defaultParam.headerValue = this.model.get("headerValue") || "";
                this.defaultParam.locationId = this.model.get("locationId");
            }

            this.initDirectionDropdown();
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
            /*
            var matchConditionParam = this.matchConditionView.getMatchConditionParam();
            if (!matchConditionParam) return false;
            */

            var headerKey = this.$el.find("#args").val(), headerValue = this.$el.find("#values").val();
            if (headerKey === "" || headerValue === ""){
                alert("参数和值不能为空");
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
                "locationId": this.defaultParam.locationId,
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


    var LuaAdvanceConfigHttpHeaderOptView = LuaHttpHeaderOptView.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaHttpHeaderOpt/httpHeaderOpt.html'])());
            var clientInfo = options.clientInfo, 
                domainInfo = options.domainInfo,
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                };
            this.domainInfo = domainInfo;
            this.clientInfo = clientInfo;
            this.optHeader = $('<a href="javascript:void(0)" class="btn btn-success add"><span class="glyphicon glyphicon-plus"></span>添加</a>');
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

        update: function(clientInfo, domainInfo, target){
            this.options.clientInfo = clientInfo;
            this.options.domainInfo = domainInfo;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        }        
    });

    return LuaAdvanceConfigHttpHeaderOptView;
});