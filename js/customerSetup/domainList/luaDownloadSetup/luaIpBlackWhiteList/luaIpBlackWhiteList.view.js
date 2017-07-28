define("luaIpBlackWhiteList.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var IpBlackWhiteListView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/mainCtn.html'])({
                data: {
                    mainTitle: "访问控制",
                    subTitle: "IP黑白名单"
                }
            }));
            
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
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))
            this.luaIpBlackWhiteListEl = $(_.template(template['tpl/customerSetup/domainList/ipBlackWhiteList/ipBlackWhiteList.add.html'])());
            this.luaIpBlackWhiteListEl.appendTo(this.$el.find(".main-ctn"));
            
            // this.collection.off("get.IPSafetyChainList.success");
            // this.collection.off("get.IPSafetyChainList.error");
            // this.collection.on("get.IPSafetyChainList.success", $.proxy(this.onGetIPSafetyChainListSuccess, this));
            // this.collection.on("get.IPSafetyChainList.error", $.proxy(this.onGetError, this));
            // this.collection.on("set.IPSafetyChain.success", $.proxy(this.onSaveSuccess, this));
            // this.collection.on("set.IPSafetyChain.error", $.proxy(this.onGetError, this));
            // this.onClickQueryButton();

            // this.$el.find(".add").on("click", $.proxy(this.onClickAddRole, this));
            // this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.defaultParam = {
                refererType: 1,
                ips: "",
                type: 9,
                policy: ""
            };

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
        conversionFormat: function(data,type){
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
            value = this.conversionFormat(value,1);
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
            
            var whiteIpValue = this.conversionFormat(this.$el.find("#white-IP").val(),1),
                blackIpValue = this.conversionFormat(this.$el.find("#black-IP").val(),1);
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