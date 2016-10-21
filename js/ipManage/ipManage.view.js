define("ipManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DispInfoView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/ipManage/ipManage.disp.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.off("get.dispByIp.success");
            this.collection.off("get.dispByIp.error");
            this.collection.on("get.dispByIp.success", $.proxy(this.initTable, this));
            this.collection.on("get.dispByIp.error", $.proxy(this.onGetError, this));
            this.collection.getDispByIp({ip: this.model.get("ip")})
        },

        initTable: function(res){
            this.table = $(_.template(template['tpl/ipManage/ipManage.disp.table.html'])({data: res}));
            if (res.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data:{message: "赵宪亮在胸前仔细摸索了一番，但是却没有找到数据！"}
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

    var IPManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.deviceCollection = options.deviceCollection;
            this.$el = $(_.template(template['tpl/ipManage/ipManage.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.noticeInfoStr = '<div class="alert alert-info"><strong>数据加载中，请耐心等待 </strong></div>';

            this.initNodeDropMenu();

            this.collection.on("get.ipInfo.success", $.proxy(this.onIpInfoListSuccess, this));
            this.collection.on("get.ipInfo.error", $.proxy(this.onQueryError, this));
            this.collection.on("query.ipInfo.success", $.proxy(this.onIpInfoListSuccess, this));
            this.collection.on("query.ipInfo.error", $.proxy(this.onQueryError, this));
            this.deviceCollection.on("ip.type.success", $.proxy(this.onGetIpTypeList, this));
            this.deviceCollection.on("ip.type.error", $.proxy(this.onGetError, this));

            if (AUTH_OBJ.QueryIPList)
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            else
                this.$el.find(".opt-ctn .query").remove();

            if (AUTH_OBJ.QueryIP){
                this.$el.find(".opt-ctn .query-single").on("click", $.proxy(this.onClickQuerySingleButton, this));
                $(document).on('keydown', $.proxy(this.onEnterQuery, this));
            } else {
                this.$el.find(".opt-ctn .query-single").remove();
            }

            this.isMultiIPSearch = true;
            this.isQuering = false;
            this.queryArgs = {
                page : 1,
                count: 10,
                ips  : ""
            };

            this.currentPage = 1;

            this.anotherQuery = {
                "ip": null,
                "ipType": null, //ip类型
                "ipStatus": null, //状态
                "deviceName": null, //设备名称
                "nodeName": null,  //节点名称
                //"dispDomain": null,  //调度组名称
                "page" : 1,
                "count": 10,
            };

            this.onStartQueryButton();
            this.collection.on("get.ipInfoSubmit.success", function(){
                alert('设置成功');
                this.onStartQueryButton();
            }.bind(this));
            this.collection.on("get.ipInfoSubmit.error", function(){
                alert('设置失败');
            }.bind(this));

            this.collection.on("get.ipInfoStart.error", function(err){
                this.commonPopup.$el.modal('hide');
                this.onGetError(err);
            }.bind(this));
            this.collection.on("get.ipInfoPause.error", function(err){
                this.commonPopup.$el.modal('hide');
                this.onGetError(err);
            }.bind(this));
        },

        onEnterQuery: function(e){
            if (e.keyCode !== 13) return;
            e.stopPropagation();
            e.preventDefault();
            this.isMultiIPSearch = false;
            this.currentPage = 1;
            this.onStartQueryButton();
        },

        onGetIpTypeList: function(data){
            this.ipTypeList = data;
            var typeIpArray = [{name: "全部", value: "all"}];
            _.each(this.ipTypeList, function(el, key, ls){
                typeIpArray.push({name: el.name, value: el.id})
            })
            Utility.initDropMenu(this.$el.find(".dropdown-type"), typeIpArray, function(value){
                if (value === 'all') this.anotherQuery.ipType = null
                if (value !== 'all') this.anotherQuery.ipType = parseInt(value);
            }.bind(this));
        },

        onQueryError: function(error){
            this.$el.find(".opt-ctn .query").removeAttr("disabled");
            this.$el.find(".opt-ctn .query-single").removeAttr("disabled");
            this.isQuering = false;
            this.onGetError(error)
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onIpInfoListSuccess: function(){
            this.$el.find(".opt-ctn .query").removeAttr("disabled");
            this.$el.find(".opt-ctn .query-single").removeAttr("disabled");
            this.isQuering = false;
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQuerySingleButton: function(){
            this.isMultiIPSearch = false;
            this.currentPage = 1;
            this.onStartQueryButton();
        },

        onClickDispInfoItem: function(event){
            if (this.dispInfoPopup) $("#" + this.dispInfoPopup.modalId).remove();

            var eventTarget = event.srcElement || event.target,id;

            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);

            var dispInfoView = new DispInfoView({
                collection: this.collection,
                model: model
            });
            var options = {
                title: model.get("ip") + "调度信息详情",
                body : dispInfoView,
                backdrop : 'static',
                type     : 2,
                height   : 500,
                onOKCallback:  function(){},
                onHiddenCallback: function(){}
            }
            this.dispInfoPopup = new Modal(options);
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
                    this.isMultiIPSearch = true;
                    this.currentPage = 1;
                    this.onStartQueryButton();
                    this.queryDetailPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.queryDetailPopup = new Modal(options);
        },

        onStartQueryButton: function(){
            this.$el.find(".opt-ctn .query").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .query-single").attr("disabled", "disabled");
            if (this.isQuering) return;
            this.isQuering = true;
            this.isInitPaginator = false;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            if (this.isMultiIPSearch){
                this.queryArgs.page = this.currentPage;
                //console.log(this.queryArgs);
                this.collection.getIpInfoList(this.queryArgs);
            } else {
                this.anotherQuery.page = this.currentPage;
                this.anotherQuery.ip = this.$el.find("#input-ip").val();
                this.anotherQuery.deviceName = this.$el.find("#input-device").val();
                this.anotherQuery.nodeName = this.$el.find("#input-node").val();
                //this.anotherQuery.dispDomain = this.$el.find("#input-group").val();
                this.collection.queryIpInfoList(this.anotherQuery);
            }
        },

        initTable: function(){
            //console.log(this.collection.models);
            this.table = $(_.template(template['tpl/ipManage/ipManage.table.html'])({data: this.collection.models, permission : AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.$el.find(".ipOperation").on("click", $.proxy(this.onClickIpOperation, this));
            this.$el.find(".disp-info").on("click", $.proxy(this.onClickDispInfoItem, this));
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)

            if (this.isMultiIPSearch && this.collection.total <= this.queryArgs.count) return;
            if (!this.isMultiIPSearch && this.collection.total <= this.anotherQuery.count) return;
            
            var total = Math.ceil(this.collection.total/this.queryArgs.count);
            if (!this.isMultiIPSearch)
                total = Math.ceil(this.collection.total/this.anotherQuery.count);
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: this.currentPage,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args;
                        if (this.isMultiIPSearch){
                            args = _.extend(this.queryArgs);
                            args.page = num;
                            args.count = this.queryArgs.count;
                            this.collection.getIpInfoList(args);
                        } else {
                            args = _.extend(this.anotherQuery);
                            args.page = num;
                            args.count = this.anotherQuery.count;
                            this.collection.queryIpInfoList(this.anotherQuery);
                        }
                        this.currentPage = num;
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function(){
            var status = [
                {name: "全部", value: "all"},
                {name: "运行中", value: 1},
                {name: "暂停中", value: 2},
                {name: "宕机中", value: 4},
                {name: "暂停且宕机", value: 6}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-status"), status, function(value){
                if (value !== "all") this.anotherQuery.ipStatus = parseInt(value);
                if (value === "all") this.anotherQuery.ipStatus = null;
            }.bind(this));            
            var pageNum = [
                {name: "10条", value: 10},
                {name: "50条", value: 50},
                {name: "100条", value: 100},
                {name: "300条", value: 300}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                if (this.isMultiIPSearch){
                    this.queryArgs.count = parseInt(value);
                    this.queryArgs.page = 1;
                    this.onStartQueryButton();
                } else {
                    this.anotherQuery.count = parseInt(value);
                    this.anotherQuery.page = 1;
                    this.onStartQueryButton();
                }
            }.bind(this));
            this.deviceCollection.ipTypeList();
        },

        onClickIpOperation: function(event){
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

                this.commonDialog();
                this.commonPopup.$el.find('.close').hide();
                this.commonPopup.$el.find('.commonPopup').hide();

                this.collection.off("get.ipInfoStart.success");
                this.collection.on("get.ipInfoStart.success", $.proxy(this.onIpInfoStartSuccess, this));
            }else if(status == '2' || status == '6'){ //暂停
                this.collection.getIpInfoPause(ip);

                this.commonDialog();
                this.commonPopup.$el.find('.close').hide();
                this.commonPopup.$el.find('.commonPopup').hide();

                this.collection.off("get.ipInfoPause.success");
                this.collection.on("get.ipInfoPause.success", $.proxy(this.onIpInfoPauseSuccess, this));
            }
        },

        commonDialog: function(){
            if (this.commonPopup) $("#" + this.commonPopup.modalId).remove();
            var options = {
                title: "警告",
                body : this.noticeInfoStr,
                backdrop : 'static',
                type     : 2,
                cancelButtonText : "关闭",
                onOKCallback:  function(){
                    var options = {
                        "id" : this.clickId,
                        "status" : this.clickStatus
                    }
                    if (!options) return;
                    this.collection.getIpInfoSubmit(options);
                    this.commonPopup.$el.modal('hide');
                }.bind(this),
                onCancelCallback: function(){
                    this.commonPopup.$el.modal('hide');
                }.bind(this)
            }

            this.commonPopup = new Modal(options);
        },

        onIpInfoStartSuccess: function(res){
            var data = res;
            var body = '';
            if(data.length > 0){
                data[0].title = 'IP '+this.clickIp+'暂停前在下列调度关系中服务，点击确定，下列调度关系将恢复，点击取消，IP状态不会变更，是否确定？';

                this.table_modal = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:data}));
                this.table_modal.find('.table-place').html(_.template(template['tpl/ipManage/ipManage.start&pause.table.html'])({data:data}));

                this.commonPopup.$el.find('.modal-body').html(this.table_modal);
            }else{
                body = '确定要开启服务吗？';
                this.commonPopup.$el.find('.close').show();
                this.commonPopup.$el.find('.commonPopup').show();
                this.commonPopup.$el.find('h4').html('恢复IP');
                this.commonPopup.$el.find('.modal-body strong').html(body);
            }
        },

        onIpInfoPauseSuccess: function(res){
            var data = res;
            var body = '';
            if(data.length > 0){
                data[0].title = 'IP '+this.clickIp+'在下列调度关系中服务，点击确定，该IP将不对下列调度关系服务，点击取消，IP状态不会改变，是否确定？';
                
                this.table_modal = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:data}));
                this.table_modal.find('.table-place').html(_.template(template['tpl/ipManage/ipManage.start&pause.table.html'])({data:data}));

                this.commonPopup.$el.find('.modal-body').html(this.table_modal);
            }else{
                body = '确定要暂停服务吗？';
                this.commonPopup.$el.find('.close').show();
                this.commonPopup.$el.find('.commonPopup').show();
                this.commonPopup.$el.find('h4').html('暂停IP');
                this.commonPopup.$el.find('.modal-body strong').html(body);
            }
        },

        remove: function(){
            if (AUTH_OBJ.QueryIP)
                $(document).off('keydown', $.proxy(this.onEnterQuery, this));
            if (this.queryDetailPopup) $("#" + this.queryDetailPopup.modalId).remove();
            this.queryDetailPopup = null;
            this.collection.off();
            this.$el.remove();
        },

        hide: function(){
            if (AUTH_OBJ.QueryIP)
                $(document).off('keydown', $.proxy(this.onEnterQuery, this));
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
            if (AUTH_OBJ.QueryIP)
                $(document).on('keydown', $.proxy(this.onEnterQuery, this));
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return IPManageView;
});