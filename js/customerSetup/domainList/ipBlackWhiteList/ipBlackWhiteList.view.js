define("ipBlackWhiteList.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditRefererAntiLeechView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.IPMatchingCondition = AUTH_OBJ.IPMatchingCondition || null;
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/ipBlackWhiteList/ipBlackWhiteList.add.html'])());

            this.defaultParam = {
                refererType: 1,
                ips: "",
                type: 9,
                policy: ""
            };

            if (this.isEdit){
                var ips = this.ConversionFormat(this.model.get("ips"),2);
                this.defaultParam.type = this.model.get("matchingType");
                this.defaultParam.policy = this.model.get("matchingValue") || "";
                this.defaultParam.refererType = this.model.get("type");
                this.defaultParam.ips = ips || "";
            }

            require(['matchCondition.view', 'matchCondition.model'], function(MatchConditionView, MatchConditionModel){
                var  matchConditionArray = [
                    {name: "全部文件", value: 9},
                    {name: "文件类型", value: 0},
                    {name: "指定URI", value: 2},
                    {name: "指定目录", value: 1},
                    {name: "正则匹配", value: 3},
                ];

                if(!this.IPMatchingCondition){
                    //添加特殊条件，如果没有此属性，所有用户，只能选择全部文件
                    matchConditionArray = [
                        {name: "全部文件", value: 9}
                    ]                    
                }

                var matchConditionOption = {
                    collection: new MatchConditionModel(),
                    defaultCondition : this.defaultParam.type,
                    defaultPolicy: this.defaultParam.policy,
                    matchConditionArray: matchConditionArray
                }


                this.matchConditionView = new MatchConditionView(matchConditionOption);
                this.matchConditionView.render(this.$el.find(".match-condition-ctn"));
                
                if (this.defaultParam.refererType === 1) {
                    this.$el.find(".black-list").hide();
                    this.$el.find("#white-IP").val(this.defaultParam.ips)
                } else if (this.defaultParam.refererType === 2){
                    this.$el.find(".white-list").hide();
                    this.$el.find("#black-IP").val(this.defaultParam.ips)
                }

                this.initTypeDropdown();
                this.$el.find("#dropdown-contorl-action-type").attr('disabled','disabled');
                
                this.$el.find("#white-IP").on("blur", $.proxy(this.onBlurIPInput, this));
                this.$el.find("#black-IP").on("blur", $.proxy(this.onBlurIPInput, this));

            }.bind(this))
        },

        initTypeDropdown: function(){
            var  timeArray = [
                {name: "白名单", value: 1},
                {name: "黑名单", value: 2}
            ],
            rootNode = this.$el.find(".referer-type");
            Utility.initDropMenu(rootNode, timeArray, function(value){
                if (parseInt(value) === 1){
                    this.$el.find(".black-list").hide();
                    this.$el.find(".white-list").show();
                } else if(parseInt(value) === 2){
                    this.$el.find(".black-list").show();
                    this.$el.find(".white-list").hide();
                }
                this.defaultParam.refererType = parseInt(value);
            }.bind(this));

            var defaultValue = _.find(timeArray, function(object){
                return object.value === this.defaultParam.refererType;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-referer-type .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-referer-type .cur-value").html(timeArray[0].name);

            /*var controlArray = [
               {name:"直接禁止", value: null},
               {name:"设置友好界面",value: null}
            ];
            rootNode = this.$el.find(".control-action-type");
            Utility.initDropMenu(rootNode, controlArray, function(value){
               
            }.bind(this));
            this.$el.find("#dropdown-contorl-action-type .cur-value").html(controlArray[0].name);*/
            
        },
        ConversionFormat: function(data,type){
            if(type == 1){
                data = data.split("\n")
                if(data[data.length - 1] === "") data.splice(data.length - 1,1);
                data = data.join(',')
                var lengthcontrol = data;
                if(lengthcontrol.split(',').length > 100) {alert('已超出最大限制100条');return false;}
            }else if(type == 2){
                data = data.split(',');
                data = data.join('\n');
            }
            return data;
        },
        onBlurIPInput: function(event){
            var eventTarget = event.srcElement || event.target,
                value = eventTarget.value, ips = [], error;
            
            if (value === "") return false; 
            value = this.ConversionFormat(value,1);
            if(value == false) return;
            if (value.indexOf(",") > -1){
                ips = value.split(",");
                for (var i = 0; i < ips.length; i++){
                    if (!Utility.isIP(ips[i])){
                        error = {message: "第" + (i + 1) + "个IP输错了！"};
                        alert(error.message)
                        return false;
                    }
                }
            } else if (!Utility.isIP(value)){
                error = {message: "请输入正确的IP！"};
                alert(error.message)
                return false;
            } else {
                this.$el.find(".error-ctn").html("");
            }
            return true;
        },
        checkEverything: function(){
            var whiteIP = this.$el.find("#white-IP").val(),
                balckIP = this.$el.find("#black-IP").val();

            if (this.defaultParam.refererType === 1 && whiteIP === "" ){
                alert("请输入合法IP！")
                return false;
            }
            else if (this.defaultParam.refererType === 2 && balckIP === ""){
                alert("请输入非法IP！")
                return false;
            }
            var result = true;
            if (this.defaultParam.refererType === 1){
                result = this.onBlurIPInput({target: this.$el.find("#white-IP").get(0)});
            } else if (this.defaultParam.refererType === 2) {
                result = this.onBlurIPInput({target: this.$el.find("#black-IP").get(0)});
            }
            return result;
        },

        onSure: function(){
            var result = this.checkEverything();
            if (!result) return false;
            var matchConditionParam = this.matchConditionView.getMatchConditionParam();
            if (!matchConditionParam) return false;

            var matchingType = matchConditionParam.type, matchingTypeName;
            if (matchingType === 0) matchingTypeName = "文件类型";
            if (matchingType === 1) matchingTypeName = "指定目录";
            if (matchingType === 2) matchingTypeName = "指定URL";
            if (matchingType === 3) matchingTypeName = "正则匹配";
            if (matchingType === 4) matchingTypeName = "url包含指定参数";
            if (matchingType === 9) matchingTypeName = "全部文件";

            var type = this.defaultParam.refererType, typeName;
            if (type === 1) typeName = "IP：白名单<br>";
            if (type === 2) typeName = "IP：黑名单<br>";
            
            var whiteIpValue = this.ConversionFormat(this.$el.find("#white-IP").val(),1),
                blackIpValue = this.ConversionFormat(this.$el.find("#black-IP").val(),1);
            var ips = this.defaultParam.refererType === 1 ? whiteIpValue : blackIpValue;
            var summary = typeName;

            var postParam = {
                type: type,
                ips: _.uniq(ips.split(',')).join(','),
                id: this.isEdit ? this.model.get("id") : new Date().valueOf(),
                matchingType: matchingType,
                matchingValue: matchConditionParam.policy,
                summary: summary,
                matchingTypeName: matchingTypeName
            }

            return postParam
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });


    var IpBlackWhiteListView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/ipBlackWhiteList/ipBlackWhiteList.html'])());
            
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                     uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: false
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))
            
            this.collection.off("get.IPSafetyChainList.success");
            this.collection.off("get.IPSafetyChainList.error");
            this.collection.on("get.IPSafetyChainList.success", $.proxy(this.onGetIPSafetyChainListSuccess, this));
            this.collection.on("get.IPSafetyChainList.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRole, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.onClickQueryButton();

            this.collection.on("set.IPSafetyChain.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.IPSafetyChain.error", $.proxy(this.onGetError, this));
        },

        onSaveSuccess: function(){
            alert("保存成功！")
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

        onGetIPSafetyChainListSuccess: function(){
            this.initTable();
        },

        onClickQueryButton: function(args){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getIPSafetyChainList({
                originId:this.domainInfo.id
            });
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

            this.table = $(_.template(template['tpl/customerSetup/domainList/ipBlackWhiteList/ipBlackWhiteList.table.html'])({
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

            var myAddEditRefererAntiLeechView = new AddEditRefererAntiLeechView({
                collection: this.collection,
                model: model,
                isEdit: true
            });

            var options = {
                title:"IP防盗链",
                body : myAddEditRefererAntiLeechView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditRefererAntiLeechView.onSure();
                    if (!postParam) return;
                    _.each(postParam, function(value, key, ls){
                        model.set(key, value);
                    }.bind(this))
                    this.collection.trigger("get.IPSafetyChainList.success");
                    this.addRolePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickAddRole: function(event){
             if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditRefererAntiLeechView = new AddEditRefererAntiLeechView({collection: this.collection});

            var options = {
                title:"IP防盗链",
                body : myAddEditRefererAntiLeechView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditRefererAntiLeechView.onSure();
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
                    this.collection.trigger("get.IPSafetyChainList.success");
                    this.addRolePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
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
            this.collection.each(function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            this.collection.models = Utility.adjustElement(this.collection.models, modelIndex, true)

            this.collection.trigger("get.IPSafetyChainList.success")
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
            this.collection.each(function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            this.collection.models = Utility.adjustElement(this.collection.models, modelIndex, false)

            this.collection.trigger("get.IPSafetyChainList.success")
        },

        onClickSaveBtn: function(){
            var list = [];
            this.collection.each(function(obj){
                list.push({
                    "matchingType": obj.get('matchingType'),
                    "matchingValue": obj.get('matchingValue'),
                    type: obj.get('type'),
                    ips: obj.get('ips'),
                })
            }.bind(this))
            var postParam = {
                "originId": this.domainInfo.id,
                "list": list
            }
            this.collection.setIPSafetyChain(postParam);
        },

        onClickItemDelete: function(event){
            var result = confirm("你确定要删除吗？");
            if (!result) return;
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");
            for (var i = 0; i < this.collection.models.length; i++){
                if (this.collection.models[i].get("id") === parseInt(id)){
                    this.collection.models.splice(i, 1);
                    this.collection.trigger("get.IPSafetyChainList.success")
                    return;
                }
            }
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

    return IpBlackWhiteListView;
});