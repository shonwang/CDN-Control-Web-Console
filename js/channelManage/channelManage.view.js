define("channelManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var ChannelInfoView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/dispGroup/dispGroup.channel.html'])({}));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.off("channel.dispgroup.success");
            this.collection.off("channel.dispgroup.error");
            this.collection.on("channel.dispgroup.success", $.proxy(this.onGetChannelSuccess, this));
            this.collection.on("channel.dispgroup.error", $.proxy(this.onGetError, this));

            this.collection.getChannelDispgroup({channelid: this.model.get("id")});
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetChannelSuccess: function(res){
            this.channelList = res;
            var count = 0, isCheckedAll = false;
            _.each(this.channelList, function(el, index, list){
                if (el.associated === 0) el.isChecked = false;
                if (el.associated === 1) {
                    el.isChecked = true;
                    count = count + 1
                }
                if (el.status === 0) el.statusName = '<span class="text-danger">已停止</span>';
                if (el.status === 1) el.statusName = '<span class="text-success">运行中</span>';
            }.bind(this))

            if (count === this.channelList.length) isCheckedAll = true

            this.table = $(_.template(template['tpl/channelManage/channelManage.disp.table.html'])({data: this.channelList, isCheckedAll: isCheckedAll}));
            if (res.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            // this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            // this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var selectedObj = _.find(this.channelList, function(object){
                return object.id === parseInt(id)
            }.bind(this));

            selectedObj.isChecked = eventTarget.checked

            var checkedList = this.channelList.filter(function(object) {
                return object.isChecked === true;
            })
            if (checkedList.length === this.channelList.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.channelList.length)
                this.table.find("thead input").get(0).checked = false;
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            _.each(this.channelList, function(el, index, list){
                el.isChecked = eventTarget.checked
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
        },

        getArgs: function(){
            // var checkedList = this.channelList.filter(function(object) {
            //     return object.isChecked === true;
            // })
            // var channelIds = [];
            // _.each(checkedList, function(el, index, list){
            //     channelIds.push(el.id)
            // }.bind(this))
            var nodeId = this.$el.find("tbody input:checked").attr("id");
            var options =  {
                "dispGroupIds": [parseInt(nodeId)],//channelIds,
                "channelId"   : this.model.get("id")
            }
            return options
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var ChannelManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/channelManage/channelManage.html'])());

            this.initChannelDropMenu();

            this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.channel.error", $.proxy(this.onGetError, this));
            this.collection.on("add.dispGroup.channel.success", function(){
                alert("关联成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.dispGroup.channel.error", $.proxy(this.onGetError, this));

            if (AUTH_OBJ.QueryChannel){
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                this.enterKeyBindQuery();
            } else {
                this.$el.find(".opt-ctn .query").remove();
            }

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

        onClickCreate: function(){
            if (this.addNodePopup) $("#" + this.addNodePopup.modalId).remove();

            var addNodeView = new AddOrEditNodeView({collection: this.collection});
            var options = {
                title:"添加节点",
                body : addNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = addNodeView.getArgs();
                    if (!options) return;
                    this.collection.addNode(options)
                    this.addNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.addNodePopup = new Modal(options);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/channelManage/channelManage.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
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
                onOKCallback:  function(){
                    var options = chInfoView.getArgs();
                    if (!options) return;
                    this.collection.addDispGroupChannel(options)
                    this.channelInfoPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.channelInfoPopup = new Modal(options);
            this.channelInfoPopup.$el.find(".btn-primary").html('<span class="glyphicon glyphicon-link"></span>关联');
            if (!AUTH_OBJ.DomainAssociatetoGslbGroup)
                this.channelInfoPopup.$el.find(".btn-primary").remove();
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

        initChannelDropMenu: function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name: "服务中", value: 1},
                {name: "已停止", value: 0}
            ],
            rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                if (value == "All")
                    this.queryArgs.status = null;
                else
                    this.queryArgs.status = parseInt(value)
            }.bind(this));

            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.count = value;
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return ChannelManageView;
});