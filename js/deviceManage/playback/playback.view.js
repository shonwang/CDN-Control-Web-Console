define("playback.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
   
    var AppDetailView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.$el = $(_.template(template['tpl/setupAppManage/setupAppManage.detail.html'])({data: {}}));
            
            this.collection.off('get.template.info.success');
            this.collection.off('get.template.info.error');
            this.collection.on('get.template.info.success',$.proxy(this.getTemplateSuccess,this));
            this.collection.on('get.template.error',$.proxy(this.onGetError,this));
            this.collection.getTemplateinfo(this.model.get('type'));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            //this.initSetup()
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
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });
    
    var PlaybackView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/deviceManage/playback/playback.html'])());
            
            this.collection.on("get.task.info.success", $.proxy(this.onTaksListSuccess, this));
            this.collection.on("get.task.info.error", $.proxy(this.onGetError, this));

            this.queryArgs = {
                "status":0
             }
            this.onClickQueryButton();
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        onTaksListSuccess: function(){
            this.initTable();
          //  if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getTaskInfo(this.queryArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/deviceManage/playback/playback.taskItem.html'])({
                data: this.collection.models,
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            // this.table.find("tbody .detail").on("click", $.proxy(this.onClickItemDetail, this));
            // this.table.find("tbody .topo").on("click", $.proxy(this.onClickItemTopo, this));
        },

        onClickItemTopo: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
        },

        onClickItemDetail: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(target) {
            this.collection.off();
            this.collection.reset();
            this.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return PlaybackView;
});