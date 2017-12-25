define("luaDelMarkCache.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DelMarkCacheView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/mainCtn.html'])({
                data: {
                    mainTitle: "缓存优化",
                    subTitle: "去问号缓存"
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
            this.clientInfo = clientInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

            this.$el.find(".main-ctn").html(_.template(template['tpl/loading.html'])({}));


            this.defaultParam = {
                markType: 1,
                markValue: "",
            };  

            this.collection.on("get.mark.success", $.proxy(this.initSetup, this));
            this.collection.on("get.mark.error", $.proxy(this.onGetError, this));
            this.collection.on("set.mark.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.mark.error", $.proxy(this.onGetError, this));
            this.collection.getCacheQuestionMark({originId: this.domainInfo.id});

            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
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

        onClickSaveBtn: function(){
            var markType = parseInt(this.$el.find("[name='delMarkRadio']:checked").val()),
                spParam = this.$el.find("#sp-param").val().trim();

            var postParam = {
                "originId": this.domainInfo.id,
                "list": [{
                    "markType": markType,
                    "markValue": spParam,
                    "locationId": this.defaultParam.locationId
                }]
            }

            this.collection.setCacheQuestionMarkBatch(postParam);
            Utility.onContentSave();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        initSetup: function(data){
            var data = data.data;
            if (data) {
                this.defaultParam.locationId = data.locationId;
                this.defaultParam.markType = data.markType;
                this.defaultParam.markValue = data.markValue || "";
            }
            var SpecifyCacheParameters = AUTH_OBJ.SpecifyCacheParameters;
            this.luaCacheRuleEl = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaDelMarkCache/delMarkCache.add.html'])({SpecifyCacheParameters:SpecifyCacheParameters}));
            this.$el.find(".main-ctn").html(this.luaCacheRuleEl.get(0))

            if (this.defaultParam.markType === 1){
                this.$el.find("#delMarkRadio1").get(0).checked = true;
            } else if (this.defaultParam.markType === 2) {
                this.$el.find("#delMarkRadio2").get(0).checked = true;
                this.$el.find("#sp-param").val(this.defaultParam.markValue)
            } else if (this.defaultParam.markType === 0) {
                this.$el.find("#delMarkRadio3").get(0).checked = true;
            }

            this.$el.find("input[name=delMarkRadio]").on("change",Utility.onContentChange);
            this.$el.find("#sp-param").on("focus",Utility.onContentChange);
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

    return DelMarkCacheView;
});