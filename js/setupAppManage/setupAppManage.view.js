define("setupAppManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LookOverTopoView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $('<div><div class="table-ctn"></div></div>');

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            
            this.collection.off('get.topo.OriginInfo.success');
            this.collection.off('get.topo.OriginInfo.error');
            this.collection.on('get.topo.OriginInfo.success',$.proxy(this.onOriginInfo, this));
            this.collection.on('get.topo.OriginInfo.error',$.proxy(this.onGetError, this));
            
            this.collection.getTopoOrigininfo(this.model.get('topoId'));
            
            //this.initSetup()
        },
        onOriginInfo:function(res){
            //console.log(res);
            var tempData = [{
                name : res.name,
                id:res.id
            }];
            this.initSetup(tempData);
        },
        initSetup: function(tempData){
            this.table = $(_.template(template['tpl/setupAppManage/setupAppManage.topo.table.html'])({
                data: tempData
            }));
            if (tempData.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
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
    var FuncDetailView = Backbone.View.extend({
            events: {
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model      = options.model;

                this.$el = $(_.template(template['tpl/setupAppManage/setupAppManage.func.table.detail.html'])({data: {}}));
            },
            render: function(target) {
                this.$el.appendTo(target);
            }
    });
   
    var AppDetailView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;
            console.log(this.model);
            this.$el = $(_.template(template['tpl/setupAppManage/setupAppManage.detail.html'])({data: {}}));
            
            this.collection.off('get.template.info.success');
            this.collection.off('get.template.info.error');
            this.collection.on('get.template.info.success',$.proxy(this.getTemplateSuccess,this));
            this.collection.on('get.template.error',$.proxy(this.onGetError,this));
            this.collection.getTemplateinfo(this.model.get('type'));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.initSetup()
        },
        getTemplateSuccess: function(res){
            var domain = this.$el.find('#domain'),
                lua = this.$el.find('#lua'),
                nginx = this.$el.find('#nginx');

            domain.val(res['domain.conf']);
            lua.val(res['lua.conf']);
            nginx.val(res['nginx.conf']);
        },
        initSetup: function(){
            var tempData = [{
                name: "时间戳+共享秘钥防盗链",
                id: 1
            }]
            this.table = $(_.template(template['tpl/setupAppManage/setupAppManage.func.table.html'])({
                data: tempData
            }));
            if (tempData.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .detail").on("click", $.proxy(this.onClickDetail, this));
        },
        onClickDetail: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            
            var myFuncDetailView = new FuncDetailView({});
            var options = {
                title:'时间戳+共享秘钥防盗链',
                body:myFuncDetailView,
                width:1000,
                height:300,
                type:1,
                onOKCallback:  function(){}.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.FuncDetailViewPopup = new Modal(options);

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
    
    var SetupAppManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupAppManage/setupAppManage.html'])());
            
            this.collection.off("get.app.info.success");
            this.collection.off("get.app.info.error");
            this.collection.on("get.app.info.success", $.proxy(this.onappListSuccess, this));
            this.collection.on("get.app.info.error", $.proxy(this.onGetError, this));

            this.queryArgs = {
                "count"     : 10
             }
            this.onClickQueryButton();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onappListSuccess: function(){
            this.initTable();
          //  if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getAppInfo(this.queryArgs);
        },

        initTable: function(){
            //console.log(this.collection.models[0].attributes['name']);
            this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
            this.table = $(_.template(template['tpl/setupAppManage/setupAppManage.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .detail").on("click", $.proxy(this.onClickItemDetail, this));
            this.table.find("tbody .topo").on("click", $.proxy(this.onClickItemTopo, this));
        },

        onClickItemTopo: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);

            if (this.lookOverTopoViewPopup) $("#" + this.lookOverTopoViewPopup.modalId).remove();

            var myLookOverTopoView = new LookOverTopoView({
                collection: this.collection,
                model     : model
            });
            var options = {
                title:"拓扑关系",
                body : myLookOverTopoView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){}.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.lookOverTopoViewPopup = new Modal(options);
        },

        onClickItemDetail: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);
              
            var myAppDetailView = new AppDetailView({
                collection: this.collection,
                model: model,
                onSaveCallback: function(){}.bind(this),
                onCancelCallback: function(){
                    myAppDetailView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myAppDetailView.render(this.$el.find(".detail-panel"))
        },

        initPaginator: function(){
            console.log(this.collection.total);
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
        },

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return SetupAppManageView;
});