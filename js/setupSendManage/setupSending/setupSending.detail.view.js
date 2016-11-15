define("setupSendDetail.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var ConfiFileDetailView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.editCfgFalse.html'])({
                data: {},
                panelId: Utility.randomStr(8)
            }));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var SendDetailView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.html'])({data: {}}));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));

            this.initSetup()
        },

        initSetup: function(){
            var data = [{localLayer: "1111", upperLayer: "22222"}];
            this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.history.table.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            //this.table.find(".node-item").on("click", $.proxy(this.onClickItemDetail, this));
            this.initDomainList();
        },

        initDomainList: function(){
            var data = [{domain: "test1.ksyun.com", id: 1}];
            this.domainList = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.domain.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".domain-ctn").html(this.domainList[0]);
            else
                this.$el.find(".domain-ctn").html(_.template(template['tpl/empty.html'])());

            this.domainList.find(".node-item").on("click", $.proxy(this.onClickItemDetail, this));
        },

        onClickItemDetail: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");
            //var model = this.collection.get(id);

            if (this.configFilePopup) $("#" + this.configFilePopup.modalId).remove();

            var myConfiFileDetailView = new ConfiFileDetailView({
                collection: this.collection, 
                //model     : model,
                isEdit    : true
            });
            var options = {
                title: "配置文件详情",//model.get("chName") + "关联调度组信息",
                body : myConfiFileDetailView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    this.configFilePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.configFilePopup = new Modal(options);
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return SendDetailView
});