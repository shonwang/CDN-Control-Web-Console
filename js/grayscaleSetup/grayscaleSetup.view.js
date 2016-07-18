define("grayscaleSetup.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    // var AddOrEditView = Backbone.View.extend({
    //     events: {},

    //     initialize: function(options) {
    //         this.collection = options.collection;
    //         this.model = options.model;
    //         this.isEdit = options.isEdit;

    //         if(this.isEdit){

    //         }else{

    //         }

    //     },

    //     onGetError: function(error) {
    //         if (error && error.message)
    //             alert(error.message)
    //         else
    //             alert("网络阻塞，请刷新重试！")
    //     },

    //     initDropMenu: function(){
    //         //使用的协议
    //         // var protocolList = [
    //         //     {name: "http+flv", value: 1},
    //         //     {name: "hls", value: 2},
    //         //     {name: "rtmp", value: 3}
    //         // ];
    //         // Utility.initDropMenu(this.$el.find(".dropdown-protocol"), protocolList, function(value){
    //         //     this.args.protocol = parseInt($.trim(value));
    //         // }.bind(this));
    //         // if(this.isEdit){
    //         //     $.each(protocolList,function(k,v){
    //         //         if(v.value == this.model.get("protocol")){
    //         //             this.$el.find("#dropdown-protocol .cur-value").html(v.name);
    //         //         }
    //         //     }.bind(this));
    //         // }
    //     },

    //     getArgs: function() {
            
    //     },

    //     render: function(target) {
    //         this.$el.appendTo(target);
    //     }
    // });

    var GrayscaleSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            // this.initPageDropMenu();

            // this.getPageArgs = {
            //     domain: "",
            //     page: 1,
            //     count: 10
            // };

            //this.enterKeyBindQuery();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onClickQueryButton: function(){
            // this.isInitPaginator = false;
            // this.getPageArgs.page = 1;
            // this.getPageArgs.domain = this.$el.find("#input-domain").val();
            // if (this.getPageArgs.domain == "") this.getPageArgs.domain = null;
            // this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            // this.$el.find(".pagination").html("");
            // this.collection.getDomainList(this.getPageArgs);
        },

        initTable: function(){
            // if (this.collection.models.length !== 0){
            //     this.table = $(_.template(template['tpl/domainManage/domainManage.table.html'])({data:this.collection.models}));
            //     this.$el.find(".table-ctn").html(this.table[0]);
            // }else{
            //     this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            // }
        },

        onClickCreate: function(){
            // if (this.addDomainPopup) $("#" + this.addDomainPopup.modalId).remove();

            // var addDomainView = new AddOrEditDomainManageView({
            //     collection: this.collection,
            //     isEdit: false
            // });
            // var options = {
            //     title:"添加域名",
            //     body : addDomainView,
            //     backdrop : 'static',
            //     type     : 2,
            //     onOKCallback:  function(){
            //         var options = addDomainView.getArgs();
            //         if (!options) return;
            //         this.collection.addDomain(options);
            //         this.addDomainPopup.$el.modal("hide");
            //     }.bind(this),
            //     onHiddenCallback: function(){}.bind(this)
            // }
            // this.addDomainPopup = new Modal(options);
            // window.addDomainPopup = this.addDomainPopup;
        },

        onClickEdit:function(e){
            // var eTarget = e.srcElement || e.target,id;

            // if (eTarget.tagName == "SPAN") {
            //     id = $(eTarget).parent().attr("id");
            // } else {
            //     id = $(eTarget).attr("id");
            // }
            // this.collection.getCacheRuleList(id); //调用显示缓存规则列表

            // var model = this.collection.get(id);

            // if(this.editDomainPopup) $("#" + this.editDomainPopup.modalId).remove();

            // var editDomainView = new AddOrEditDomainManageView({
            //     collection: this.collection,
            //     model: model,
            //     isEdit: true
            // });

            // var options = {
            //     title:"编辑域名",
            //     body : editDomainView,
            //     backdrop : 'static',
            //     type     : 2,
            //     onOKCallback:  function(){
            //         var options = editDomainView.getArgs();
            //         if (!options) return;
            //         this.collection.editDomain(options);
            //         this.editDomainPopup.$el.modal("hide");
            //     }.bind(this),
            //     onHiddenCallback: function(){}.bind(this)
            // }
            // this.editDomainPopup = new Modal(options);
            // window.editDomainPopup = this.editDomainPopup;
        },

        initPaginator: function(){
            // this.$el.find(".total-items span").html(this.collection.total)
            // if (this.collection.total <= this.getPageArgs.count) return;
            // var total = Math.ceil(this.collection.total/this.getPageArgs.count);

            // this.$el.find(".pagination").jqPaginator({
            //     totalPages: total,
            //     visiblePages: 10,
            //     currentPage: 1,
            //     onPageChange: function (num, type) {
            //         if (type !== "init"){
            //             this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            //             var args = _.extend(this.getPageArgs);
            //             args.page = num;
            //             args.count = this.getPageArgs.count;
            //             this.collection.getDomainList(args); //请求域名列表接口
            //         }
            //     }.bind(this)
            // });
            // this.isInitPaginator = true;
        },

        // initPageDropMenu: function(){
        //     var pageNum = [
        //         {name: "10条", value: 10},
        //         {name: "20条", value: 20},
        //         {name: "50条", value: 50},
        //         {name: "100条", value: 100}
        //     ]
        //     Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
        //         this.getPageArgs.count = value;
        //         this.getPageArgs.page = 1;
        //         this.onClickQueryButton();
        //     }.bind(this));
        // },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function() {
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function() {
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return GrayscaleSetupView;
});
