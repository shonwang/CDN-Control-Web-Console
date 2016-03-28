define("ipManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var IPQueryDetailView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/ipManage/ipManage.queryDetail.html'])());
        },

        getArgs: function(){
            var queryKey = this.$el.find("#textarea-content").val();
            return queryKey;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var IPStartView = Backbone.View.extend({
        initialize: function(options){
            this.collection = options.collection;
            this.data = options.data;
            this.id = options.id;
            this.status = options.status;

            //console.log(this.data);
            this.$el = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:this.data}));
        },

        onClickSubmit: function(){
            var submitData = {
                "id" : this.id,
                "status" : this.status
            }
            return submitData;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var IPPauseView = Backbone.View.extend({
        initialize: function(options){
            this.collection = options.collection;
            this.data = options.data;
            this.id = options.id;
            this.status = options.status;

            //console.log(this.data);
            this.$el = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:this.data}));
        },

        onClickSubmit: function(){
            var data = {
                id : this.id,
                status : this.status
            }
            this.collection.getIpInfoSubmit(data);
            this.collection.on("get.ipInfoSubmit.success", function(){
                alert('设置成功');
            }.bind(this));
        },

        onClickSubmit: function(){
            var submitData = {
                "id" : this.id,
                "status" : this.status
            }
            return submitData;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var IPManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/ipManage/ipManage.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.initNodeDropMenu();

            this.collection.on("get.ipInfo.success", $.proxy(this.onIpInfoListSuccess, this));
            this.collection.on("get.ipInfo.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            this.queryArgs = {
                page : 1,
                count: 10,
                ips  : ""
            }
            this.onStartQueryButton();
            this.collection.on("get.ipInfoSubmit.success", function(){
                alert('设置成功');
                this.onStartQueryButton();
            }.bind(this));
            this.collection.on("get.ipInfoSubmit.error", function(){
                alert('设置失败');
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onIpInfoListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(event){
            if (this.queryDetailPopup) $("#" + this.queryDetailPopup.modalId).remove();

            var detailView = new IPQueryDetailView({
                collection: this.collection
            });
            var options = {
                title: "查询IP",
                body : detailView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = detailView.getArgs();
                    this.queryArgs.ips = options;
                    this.onStartQueryButton();
                    this.queryDetailPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.queryDetailPopup = new Modal(options);
        },

        onStartQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getIpInfoList(this.queryArgs);
        },

        initTable: function(){
            //console.log(this.collection.models);
            this.table = $(_.template(template['tpl/ipManage/ipManage.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.$el.find(".ipOperation").on("click", $.proxy(this.onClickIpOperation, this));
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
                        this.collection.getIpInfoList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.count = value;
                this.queryArgs.page = 1;
                this.onStartQueryButton();
            }.bind(this));
        },

        onClickIpOperation: function(){
            var eventTarget = event.srcElement || event.target,id,status,ip;

            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
                status = eventTarget.attr("data-status");
                ip = eventTarget.attr("data-ip");
            } else {
                id = $(eventTarget).attr("id");
                status = $(eventTarget).attr("data-status");
                ip = $(eventTarget).attr("data-ip");
            }
            this.clickId = id;
            this.clickStatus = status;
            this.clickIp = ip;
            if(status == '1'){ //开启
                this.collection.getIpInfoStart(ip);
                this.collection.on("get.ipInfoStart.success", $.proxy(this.onIpInfoStartSuccess, this));
            }else if(status == '4'){
                this.collection.getIpInfoPause(ip);
                this.collection.on("get.ipInfoPause.success", $.proxy(this.onIpInfoPauseSuccess, this));
            }

        },

        onIpInfoStartSuccess: function(res){
            console.log(res);
            if (this.ipStartPopup) $("#" + this.ipStartPopup.modalId).remove();
            // var data = [
            //                 {
            //                     groupName: "g3.gslb",
            //                     regionName: "安徽电信",
            //                     nodeName: "CDNSJZUN",
            //                     currentIpNum: 2,
            //                     notRunIpNum: 0,
            //                     affectedIpNum: 1
            //                     //ip: this.clickIp
            //                 }
            //             ];
            var data = res;
            data[0].title = 'IP '+this.clickIp+'在下列调度关系中服务，点击确定，该IP将不对下列调度关系服务，点击取消，IP状态不会改变，是否确定？';
            var ipStartView = new IPStartView({
                collection : this.collection,
                //data : res
                data : data,
                id : this.clickId,
                status: this.clickStatus
            });
            console.log(this.clickId);

            var options = {
                title:"暂停IP",
                body : ipStartView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = ipStartView.onClickSubmit();
                    if (!options) return;
                    this.collection.getIpInfoSubmit(options);
                    this.ipStartPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }

            this.ipStartPopup = new Modal(options);
        },

        onIpInfoPauseSuccess: function(res){
            console.log(res);
            if (this.ipPausePopup) $("#" + this.ipPausePopup.modalId).remove();

            var data = [
                            {
                                groupName: "g3.gslb",
                                regionName: "安徽电信",
                                nodeName: "CDNSJZUN",
                                currentIpNum: 2,
                                notRunIpNum: 0,
                                affectedIpNum: 1,
                                ip: this.clickIp
                            }
                        ];
            data[0].title = 'IP '+data[0].ip+'暂停前在下列调度关系中服务，点击确定，下列调度关系将恢复，点击取消，IP状态不会变更，是否确定？';

            var ipPauseView = new IPPauseView({
                collection : this.collection,
                data : data,
                id : this.clickId,
                status: this.clickStatus
            });

            var options = {
                title:"恢复IP",
                body : ipPauseView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = ipPauseView.onClickSubmit();
                    if (!options) return;
                    this.collection.getIpInfoSubmit(options);
                    this.ipPausePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }

            this.ipPausePopup = new Modal(options);
        },

        remove: function(){
            if (this.queryDetailPopup) $("#" + this.queryDetailPopup.modalId).remove();
            this.queryDetailPopup = null;
            this.$el.remove();
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

    return IPManageView;
});