define("dragPlay.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DragPlayView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;

            this.$el = $(_.template(template['tpl/customerSetup/domainList/dragPlay/dragPlay.html'])());
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
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.on("get.drag.success", $.proxy(this.onDragListSuccess, this));
            this.collection.on("get.drag.error", $.proxy(this.onGetError, this));

            this.collection.getDragConfList({originId: this.domainInfo.id})

            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));
            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));
            this.collection.on("set.drag.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.drag.error", $.proxy(this.onGetError, this));
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
                    width: 800,
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
                    "id": obj.get('id'),
                    "dragMode": obj.get('dragMode'),
                    "suffix": obj.get('suffix'),
                    "startParam": obj.get('startParam'),
                    "endParam": obj.get('endParam'),
                    "status": obj.get('status'),
                })
            }.bind(this))

            this.collection.setDragConf(list)
        },

        onDragListSuccess: function(){
            this.initTable();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/customerSetup/domainList/dragPlay/dragPlay.table.html'])({
                data: this.collection.models
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .suffix").on("blur", $.proxy(this.onClickItemSuffix, this));
            this.table.find("tbody .start").on("blur", $.proxy(this.onClickItemStart, this));
            this.table.find("tbody .end").on("blur", $.proxy(this.onClickItemEnd, this));
            this.table.find("tbody .togglebutton input").on("click", $.proxy(this.onClickItemToggle, this));
        },

        onClickItemSuffix: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id);

            model.set("suffix", $(eventTarget).val());
        },

        onClickItemStart: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id);

            model.set("startParam", $(eventTarget).val());
        },

        onClickItemEnd: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id);

            model.set("endParam", $(eventTarget).val());
        },

        onClickItemToggle: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;

            var id = $(eventTarget).attr("id"),
                model = this.collection.get(id);

            model.set("status", eventTarget.checked ? 1 : 0)
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
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

    return DragPlayView;
});