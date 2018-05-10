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

            this.defaultParam = {
                refererType: 1,
                ips: "",
                openFlag: 0
            };
            
            this.collection.on("get.IPSafetyChainList.success", $.proxy(this.initSetup, this));
            this.collection.on("get.IPSafetyChainList.error", $.proxy(this.onGetError, this));
            this.collection.on("set.IPSafetyChain.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.IPSafetyChain.error", $.proxy(this.onGetError, this));
            this.collection.getIPSafetyChain({originId: this.domainInfo.id})

            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
        },

        onClickSaveBtn: function(){
            if (this.defaultParam.openFlag === 1) {
                if (!this.checkEverything()) return false;
            }

            var whiteIpValue = this.conversionFormat(this.$el.find("#white-IP").val(), 1),
                blackIpValue = this.conversionFormat(this.$el.find("#black-IP").val(), 1);
            var ips = this.defaultParam.refererType === 1 ? whiteIpValue : blackIpValue;
            
            var postParam = {
                "originId": this.domainInfo.id,
                "list": [{
                    locationId: this.defaultParam.locationId,
                    type: this.defaultParam.refererType,
                    ips: _.uniq(ips.split('\n')).join(','),
                    openFlag: this.defaultParam.openFlag
                }]
            }
            this.collection.setIPSafetyChainBatch(postParam);
            Utility.onContentSave();
        },

        initSetup: function(data){
            if (data) {
                this.defaultParam.locationId = data.locationId;
                this.defaultParam.openFlag = data.openFlag;
                this.defaultParam.ips = data.ips;
                this.defaultParam.refererType = data.type;
            }

            if (this.defaultParam.openFlag === 1){
                this.$el.find(".setup-content").show();
                this.$el.find(".ip-list .togglebutton input").get(0).checked = true;
            } else {
                this.$el.find(".setup-content").hide();
                this.$el.find(".ip-list .togglebutton input").get(0).checked = false;
            }

            if (this.defaultParam.refererType === 1) {
                this.$el.find(".black-list").hide();
                this.$el.find("#white-IP").val(this.defaultParam.ips && this.defaultParam.ips.split(',').join("\n"))
            } else if (this.defaultParam.refererType === 2){
                this.$el.find(".white-list").hide();
                this.$el.find("#black-IP").val(this.defaultParam.ips && this.defaultParam.ips.split(',').join("\n"))
            }

            this.initTypeDropdown();
    
            this.$el.find(".ip-list .togglebutton input").on("click", $.proxy(this.onClickSetupToggle, this));
            this.$el.find("#white-IP").on("blur", $.proxy(this.onBlurIPInput, this));
            this.$el.find("#black-IP").on("blur", $.proxy(this.onBlurIPInput, this));  
            this.$el.find("#white-IP").on("focus", Utility.onContentChange);
            this.$el.find("#black-IP").on("focus", Utility.onContentChange);  
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

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        onClickSetupToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.$el.find(".setup-content").show(200);
                this.defaultParam.openFlag = 1;
            } else {
                this.defaultParam.openFlag = 0;
                this.$el.find(".setup-content").hide(200);
            }
            Utility.onContentChange();
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
                Utility.onContentChange();
            }.bind(this));

            var defaultValue = _.find(timeArray, function(object){
                return object.value === this.defaultParam.refererType;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-referer-type .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-referer-type .cur-value").html(timeArray[0].name);
        },

        conversionFormat: function(data,type){
            if(type == 1){
                data = data.split("\n")
                if(data[data.length - 1] === "") data.splice(data.length - 1,1);
                data = data.join('\n')
                var lengthcontrol = data;
                if(lengthcontrol.split('\n').length > 100) {Utility.warning('已超出最大限制100条');return false;}
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
            if (value.indexOf("\n") > -1){
                ips = value.split("\n");
                for (var i = 0; i < ips.length; i++){
                    if (!Utility.isIP(ips[i])){
                        error = {message: "第" + (i + 1) + "个IP输错了！"};
                        Utility.alerts(error.message)
                        return false;
                    }
                }
            } else if (!Utility.isIP(value)){
                error = {message: "请输入正确的IP！"};
                Utility.alerts(error.message)
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
                Utility.warning("请输入合法IP！")
                return false;
            }
            else if (this.defaultParam.refererType === 2 && balckIP === ""){
                Utility.warning("请输入非法IP！")
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