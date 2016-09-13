define("domainList.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DomainListView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/customerSetup/customerSetup.html'])());

            this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.channel.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.enterKeyBindQuery();

            this.queryArgs = {
                "domain"           : null,
                "accelerateDomain" : null,
                "businessType"     : null,
                "clientName"       : null,
                "status"           : null,
                "page"             : 1,
                "count"            : 10
             }
            this.onClickQueryButton();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onChannelListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.domain = this.$el.find("#input-domain").val();
            this.queryArgs.clientName = this.$el.find("#input-client").val();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            if (this.queryArgs.clientName == "") this.queryArgs.clientName = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.queryChannel(this.queryArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/customerSetup/customerSetup.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .disp").on("click", $.proxy(this.onClickItemNodeName, this));
        },

        onClickItemNodeName: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);

            if (this.channelInfoPopup) $("#" + this.channelInfoPopup.modalId).remove();

            var chInfoView = new ChannelInfoView({
                collection: this.collection, 
                model     : model
            });
            var options = {
                title: model.get("domain") + "频道关联调度组信息",
                body : chInfoView,
                backdrop : 'static',
                type     : 2,
                height: 500,
                onOKCallback:  function(){
                    var prompt = chInfoView.getPrompt(false);
                    var result = confirm(prompt)
                    if (!result) return;
                    var options = chInfoView.getArgs();
                    if (!options) return;
                    chInfoView.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                    this.collection.off("add.dispGroup.channel.success");
                    this.collection.off("add.dispGroup.channel.error");
                    this.collection.on("add.dispGroup.channel.success", function(){
                        this.collection.getChannelDispgroup({channelid: model.get("id")});
                        alert("操作成功！")
                    }.bind(this));
                    this.collection.on("add.dispGroup.channel.error", $.proxy(this.onGetError, this));
                    this.collection.addDispGroupChannel(options)
                    //this.channelInfoPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    this.onClickQueryButton();
                }.bind(this)
            }
            this.channelInfoPopup = new Modal(options);

            if (model.get("cdnFactory") === "1") {
                if (AUTH_OBJ.DomainDisassociatetoGslbGroup){
                    $('<button type="button" class="btn btn-danger" style="float:left">取消关联</button>').insertBefore(this.channelInfoPopup.$el.find(".btn-primary"));
                    this.channelInfoPopup.$el.find(".btn-danger").on("click", function(){
                        var prompt = chInfoView.getPrompt(true);
                        var result = confirm(prompt)
                        if (!result) return;
                        var options = chInfoView.getArgs();
                        if (!options) return;
                        chInfoView.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        this.collection.off("add.dispGroup.channel.success");
                        this.collection.off("add.dispGroup.channel.error");
                        this.collection.on("add.dispGroup.channel.success", function(){
                            this.collection.getChannelDispgroup({channelid: model.get("id")});
                            alert("操作成功！")
                        }.bind(this));
                        this.collection.on("add.dispGroup.channel.error", $.proxy(this.onGetError, this));
                        this.collection.deleteDispGroupChannel(options)
                        //this.channelInfoPopup.$el.modal("hide");
                    }.bind(this))
                }

                this.channelInfoPopup.$el.find(".btn-primary").html('<span class="glyphicon glyphicon-link"></span>关联');
                if (!AUTH_OBJ.DomainAssociatetoGslbGroup)
                    this.channelInfoPopup.$el.find(".btn-primary").remove();
            } else {
                this.channelInfoPopup.$el.find(".btn-primary").remove();
            }
        },

        onClickItemEdit: function(event){
            this.onClickItemNodeName(event);
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.count;
                        this.collection.queryChannel(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DomainListView;
});