define("interfaceQuota.view", ['require','exports', 'template', 'utility', "modal.view"],
    function(require, exports, template, Utility, Modal) {

    var EditView = Backbone.View.extend({

        initialize:function(options){
        },

        render:function(target){
            this.$el.appendTo(target);
        }
    });


    var InterfaceQuotaView = Backbone.View.extend({
        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/interfaceQuota/interfaceQuota.home.html'])({}));

            var clientInfo = JSON.parse(options.query);
            this.userInfo = {
                clientName: clientInfo.clientName,
                uid: clientInfo.uid
            }

            this.optHeader = $(_.template(template['tpl/customerSetup/customerSetup.header.html'])({
                data: this.userInfo
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

            this.collection.on("get.user.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.user.error", $.proxy(this.onGetError, this));

            this.queryArgs = {
                "domainName": null,
                "userId": null,
                "email" : null,
                "companyName": null,
                "currentPage": 1,
                "pageSize": 10
             }

            this.collection.queryChannel(this.queryArgs);
            this.initUsersDropMenu();
        },

        onChannelListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/customerSetup/interfaceQuota/interfaceQuota.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            
            this.table.find("tbody .manage").on("click", $.proxy(this.onClickItemNodeName, this));
            if(!AUTH_OBJ.ManageCustomer){
                this.table.find("tbody .manage").remove();
            }
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
                        this.collection.queryChannel(args);
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
        },

        update: function(query, target){
            this.isInitPaginator = false;
            this.options.query = query;
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

    return InterfaceQuotaView;

});