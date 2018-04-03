define("blockedDomain.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var BlockedDomainView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/blockedDomain/blockedDomain.html'])());

            this.collection.on("query.domain.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("query.domain.error", $.proxy(this.onGetError, this));
            this.collection.on("block.domain.success", $.proxy(this.onBlockSuccess, this));
            this.collection.on("block.domain.error", $.proxy(this.onGetError, this));
            this.collection.on("unblock.domain.success", $.proxy(this.onBlockSuccess, this));
            this.collection.on("unblock.domain.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            
            this.enterKeyBindQuery();
            this.initUsersDropMenu();
            this.initChannelDropMenu();

            this.queryArgs = {
                "domain": null,
                "userId": null,
                "type" : null,
                "status": null,
                "companyName": null,
                "currentPage": 1,
                "pageSize": 10,
                "applicationType":202
            }

            this.onClickQueryButton();
        },

        initChannelDropMenu: function() {
            var statusArray = [{
                    name: "全部",
                    value: "All"
                }, 
                // {
                //     name: "删除",
                //     value: -1
                // }, 
                {
                    name: "审核中",
                    value: 0
                }, {
                    name: "审核通过",
                    value: 1
                }, {
                    name: "审核失败",
                    value: 2
                }, {
                    name: "停止",
                    value: 3
                }, 
                // {
                //     name: "配置中",
                //     value: 4
                // },
                 {
                    name: "编辑中",
                    value: 6
                }, {
                    name: "待下发",
                    value: 7
                }, {
                    name: "待定制",
                    value: 8
                }, {
                    name: "定制化配置错误",
                    value: 9
                }, {
                    name: "下发中",
                    value: 10
                }, {
                    name: "下发失败",
                    value: 11
                },
                //  {
                //     name: "下发成功",
                //     value: 12
                // },
                 {
                    name: "运行中",
                    value: 13
                }, {
                    name: "配置失败",
                    value: 14
                }, {
                    name: "暂停中",
                    value: 15
                }
                , {
                    name: "开启中",
                    value: 16
                }
                , {
                    name: "删除中",
                    value: 17
                }
                , {
                    name: "已封禁",
                    value: 18
                }
                , {
                    name: "封禁中",
                    value: 19
                }
                , {
                    name: "解禁中",
                    value: 20
                }],
                rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value) {
                if (value == "All")
                    this.queryArgs.status = null;
                else
                    this.queryArgs.status = parseInt(value)
            }.bind(this));

            var typeArray = [{
                    name: "全部",
                    value: "All"
                }, {
                    name: "下载加速",
                    value: 1
                }, 
                // {
                //     name: "直播加速",
                //     value: 2
                // }
                ],
                rootNode = this.$el.find(".dropdown-type");
            Utility.initDropMenu(rootNode, typeArray, function(value) {
                if (value == "All")
                    this.queryArgs.type = null;
                else
                    this.queryArgs.type = parseInt(value)
            }.bind(this));
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

            this.queryArgs.currentPage = 1;
            //this.queryArgs.domainName = this.$el.find("#input-domain").val().trim();
            this.queryArgs.domain = this.$el.find("#input-domain").val().trim();
            this.queryArgs.userId = this.$el.find("#input-uid").val().trim();
            this.queryArgs.companyName = this.$el.find("#input-name").val().trim();

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getDomainInfoList(this.queryArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/blockedDomain/blockedDomain.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            
            this.table.find("tbody .block").on("click", $.proxy(this.onClickItemBlock, this));
            this.table.find("tbody .open").on("click", $.proxy(this.onClickItemUnblock, this));
            this.table.find("tbody .operateDetail").on("click", $.proxy(this.onClickDetail, this));
        },

        onClickItemBlock: function(event) {
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");
            var model = this.collection.get(id);

            if (model.get("subType") === 3) {
                Utility.alerts("请前往直播运维平台封禁推流域名!")
                return false;
            }

            if (this.nodeTipsPopup) $("#" + this.nodeTipsPopup.modalId).remove();
            
            require(["nodeManage.operateDetail.view"], function(NodeTips) {
                var stopNodeView = new NodeTips({
                    type: 1,
                    model: model,
                    whoCallMe: "block"
                });
                var options = {
                    title: "封禁说明",
                    body: stopNodeView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var options = stopNodeView.getArgs();
                        if (!options) return;
                        this.collection.blockDomain({
                            originId: model.get("id"),
                            remark: options.opRemark
                        })
                    }.bind(this),
                    onHiddenCallback: function() {}.bind(this)
                }
                this.nodeTipsPopup = new Modal(options);
            }.bind(this));
        },

        onClickItemUnblock: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");
            var model = this.collection.get(id);

            Utility.confirm("你确定要解除域名封禁吗?", function(){
                this.collection.unblockDomain({
                    originId: model.get("id"),
                })
            }.bind(this))
        },

        onBlockSuccess: function(){
            Utility.alerts("操作成功！", "success", 2000)
            if (this.nodeTipsPopup) this.nodeTipsPopup.$el.modal("hide");
            this.onClickQueryButton();
        },

        onClickDetail: function(event) {
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id);
            if (this.detailTipsPopup) $("#" + this.detailTipsPopup.modalId).remove();

            require(["nodeManage.operateDetail.view"], function(NodeTips) {
                var detailTipsView = new NodeTips({
                    type: 2,
                    model: model,
                    collection: this.collection,
                    whoCallMe: "block"
                });
                var options = {
                    title: "操作说明",
                    body: detailTipsView,
                    backdrop: 'static',
                    type: 1,
                    onHiddenCallback: function() {}.bind(this)
                }
                this.nodeTipsPopup = new Modal(options);
            }.bind(this));
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.pageSize) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.pageSize);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.currentPage = num;
                        args.pageSize = this.queryArgs.pageSize;
                        this.collection.getDomainInfoList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initUsersDropMenu: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.pageSize = value;
                this.queryArgs.currentPage = 1;
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

    return BlockedDomainView;
});