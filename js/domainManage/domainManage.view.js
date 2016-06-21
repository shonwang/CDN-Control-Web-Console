define("domainManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddDomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.modalId = options.modalId;
            console.log(this.modalId);

            this.$el = $(_.template(template['tpl/domainManage/domainManage.add&edit.html'])());
            this.$el.find(".addCacheRule").on("click", function(){
                // setTimeout(function() {
                //     this.editDispGroupPopup.$el.modal("hide");
                // }.bind(this), 500);
                this.onClickAddCacheRule();
            }.bind(this));
        },

        onClickAddCacheRule:function(){
            if (this.addCacheRulePopup) $("#" + this.addCacheRulePopup.modalId).remove();

            var addCacheRuleView = new AddCacheRuleView({
                collection: this.collection
            });
            var options = {
                title:"添加缓存规则",
                body : addCacheRuleView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    // var options = addCacheRuleView.getArgs();
                    // if (!options) return;
                    
                    // this.addCacheRulePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addCacheRulePopup = new Modal(options);
        },
        
        getArgs: function() {
            
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var EditDomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {

        },

        
        getArgs: function() {
            
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var AddCacheRuleView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.$el = $(_.template(template['tpl/domainManage/domainManage.addCacheRule.html'])());
        },

        
        getArgs: function() {
            
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var DomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/domainManage/domainManage.html'])());
            this.initTable();

            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/domainManage/domainManage.table.html'])());
            this.$el.find(".table-ctn").html(this.table[0]);
        },

        onNodeListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickCreate: function(){
            if (this.addDomainPopup) $("#" + this.addDomainPopup.modalId).remove();
            var modalId = this.addDomainPopup.modalId;

            var addDomainView = new AddDomainManageView({
                collection: this.collection,
                modalId: modalId
            });
            var options = {
                title:"添加域名",
                body : addDomainView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    // var options = addDomainView.getArgs();
                    // if (!options) return;
                    // this.collection.addDomain(options)
                    // this.addDomainPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addDomainPopup = new Modal(options);
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
                        this.collection.getNodeList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function() {
            this.$el.hide();
        },

        update: function() {
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DomainManageView;
});