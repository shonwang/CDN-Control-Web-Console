define("liveCurentSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DetailView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options    = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.$el = $(_.template(template['tpl/liveCurentSetup/liveCurentSetup.detail.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.detailList = []

            this.collection.off("get.resInfo.success");
            this.collection.off("get.resInfo.error");

            this.collection.on("get.resInfo.success", $.proxy(this.onGetInfoSuccess, this));
            this.collection.on("get.resInfo.error", $.proxy(this.onGetError, this));

            this.queryArgs = {
                "confRelLogId": this.model.get("logId"),
                "ip": null,
                "deviceName": null,
                "nodeName": null,
                "status": null,
                "page": 1,
                "count": 10
            }
            this.onClickQueryButton();
            this.$el.find(".back").on("click", $.proxy(this.onClickCancel, this));
            this.$el.find(".query").on("click", $.proxy(this.onClickQueryButton, this));
            this.enterKeyBindQuery();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.ip = this.$el.find("#input-ip").val();
            this.queryArgs.deviceName = this.$el.find("#input-device").val();
            this.queryArgs.nodeName = this.$el.find("#input-node").val();
            if (this.queryArgs.ip == "") this.queryArgs.ip = null;
            if (this.queryArgs.deviceName == "") this.queryArgs.deviceName = null;
            if (this.queryArgs.nodeName == "") this.queryArgs.nodeName = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getResInfo(this.queryArgs);
        },

        onClickCancel: function(){
            this.options.cancelCallback&&this.options.cancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onGetInfoSuccess: function(res){
            this.originData = res;
            this.detailList = [];
            for (var m = 0; m < res.rows.length; m++){
                this.detailList.push(new this.collection.model(res.rows[m]))
            }
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
            this.initPageDropMenu();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/liveCurentSetup/liveCurentSetup.detailTable.html'])({data: this.detailList}));
            if (this.detailList.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);
                this.table.find("tbody .used").on("click", $.proxy(this.onClickItemUsed, this));
                this.table.find("tbody .file-name").on("click", $.proxy(this.onClickItemFileName, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.originData.total)
            if (this.originData.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.originData.total/this.queryArgs.count);

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
                        this.collection.getResInfo(this.queryArgs);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initPageDropMenu: function(){
            var statusList = [
                {name: "全部", value: "all"},
                {name: "成功", value: 2},
                {name: "失败", value: 3},
                {name: "未配置", value: 1}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-status"), statusList, function(value){
                if (value !== "all")
                    this.queryArgs.status = parseInt(value);
                else
                    this.queryArgs.status = null;
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

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    var LiveCurentSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/liveCurentSetup/liveCurentSetup.html'])());
            this.$el.find(".origin-list .table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.on("get.buisness.success", $.proxy(this.onGetBusinessTpye, this));
            this.collection.on("get.buisness.error", $.proxy(this.onGetError, this));

            this.collection.on("get.confList.success", $.proxy(this.onSetupFileListSuccess, this));
            this.collection.on("get.confList.error", $.proxy(this.onGetError, this));

            this.collection.on("get.effectSingleConf.success", function(){
                alert("操作成功！");
                this.collection.getConfList(this.queryArgs);
            }.bind(this));
            this.collection.on("get.effectSingleConf.error", $.proxy(this.onGetError, this));
            this.collection.getBusinessType();
            this.initPageDropMenu();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onGetBusinessTpye: function(res){
            var typeArray = [];
            _.each(res, function(el, key, list){
                typeArray.push({name: el.name, value: el.id})
            }.bind(this))
            this.busTypeArray = typeArray;
            rootNode = this.$el.find(".dropdown-bustype");
            Utility.initDropMenu(rootNode, typeArray, function(value){
                this.isInitPaginator = false;
                this.queryArgs.page = 1;
                this.$el.find(".pagination").html("");
                this.queryArgs.bisTypeId = parseInt(value)
                this.collection.getConfList(this.queryArgs)
            }.bind(this));
            this.isInitPaginator = false;
            this.queryArgs = {
                bisTypeId: res[0].id,
                page   : 1,
                count  : 5
            }
            this.$el.find(".dropdown-bustype .cur-value").html(res[0].name);
            this.collection.getConfList(this.queryArgs);
        },

        onSetupFileListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/liveCurentSetup/liveCurentSetup.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0){
                this.$el.find(".origin-list .table-ctn").html(this.table[0]);
                this.table.find("tbody .shell").on("click", $.proxy(this.onClickItemShell, this));
                this.table.find("tbody .use").on("click", $.proxy(this.onClickItemUse, this));
                this.table.find("tbody .file-name").on("click", $.proxy(this.onClickItemFile, this));
                this.table.find("tbody .detail").on("click", $.proxy(this.onClickItemDetail, this));
            } else {
                this.$el.find(".origin-list .table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickItemDetail: function(event){
            var eventTarget = event.srcElement || event.target, id;
            id = $(eventTarget).attr("id");

            var model = this.collection.get(id);

            var aDetailView = new DetailView({
                collection: this.collection, 
                model     : model,
                cancelCallback: $.proxy(this.onBackDetailCallback, this)
            });
            aDetailView.render(this.$el.find(".detail-panel"));

            this.hideMainList(".origin", ".detail-panel")
        },

        hideMainList: function(mainClass, otherClass){
            async.series([
                function(callback){
                    this.$el.find(mainClass).addClass("fadeOutLeft animated");
                    callback()
                }.bind(this),
                function(callback){
                    setTimeout(function(){
                        this.$el.find(mainClass).hide();
                        this.$el.find(otherClass).show();
                        this.$el.find(otherClass).addClass("fadeInLeft animated");
                        callback()
                    }.bind(this), 500)
                }.bind(this),                
                function(callback){
                    setTimeout(function(){
                        this.$el.find(otherClass).removeClass("fadeInLeft animated");
                        this.$el.find(otherClass).removeClass("fadeOutLeft animated");
                        this.$el.find(mainClass).removeClass("fadeInLeft animated");
                        this.$el.find(mainClass).removeClass("fadeOutLeft animated");
                        callback()
                    }.bind(this), 500)
                }.bind(this)]
            );
        },

        showMainList: function(mainClass, otherClass, otherClass1){
            async.series([
                function(callback){
                    this.$el.find(otherClass).addClass("fadeOutLeft animated");
                    callback()
                }.bind(this),
                function(callback){
                    setTimeout(function(){
                        this.$el.find(otherClass).hide();
                        this.$el.find(otherClass + " " + otherClass1).remove();
                        this.$el.find(mainClass).show();
                        this.$el.find(mainClass).addClass("fadeInLeft animated")
                        callback()
                    }.bind(this), 500)
                }.bind(this),                
                function(callback){
                    setTimeout(function(){
                        this.$el.find(otherClass).removeClass("fadeInLeft animated");
                        this.$el.find(otherClass).removeClass("fadeOutLeft animated");
                        this.$el.find(mainClass).removeClass("fadeInLeft animated");
                        this.$el.find(mainClass).removeClass("fadeOutLeft animated");
                        callback()
                    }.bind(this), 500)
                }.bind(this)]
            );
        },

        onBackDetailCallback: function(){
            this.showMainList(".origin", ".detail-panel", ".detail-ctn")
        },

        onClickItemUse: function(event){
            var result = confirm("你确定要生效吗？")
            if (!result) return;
            var eventTarget = event.srcElement || event.target, id;
                id = $(eventTarget).attr("id");
            var model = this.collection.get(id);
            this.collection.effectSingleConf({confRelLogId: model.get("logId")})
        },

        onClickItemFile: function(event){
            var eventTarget = event.srcElement || event.target,
                filesid = $(eventTarget).attr("files-id"),
                id = $(eventTarget).attr("id");
            var model = this.collection.get(id);

            if (this.viewShellPopup1) $("#" + this.viewShellPopup1.modalId).remove();

            var options = {
                title:"查看",
                body : _.template(template['tpl/liveAllSetup/liveAllSetup.viewShell.html'])({data: model, dataType: 1}),
                backdrop : 'static',
                type     : 1,
                width: 800
            }
            this.viewShellPopup1 = new Modal(options);
        },

        onClickItemShell: function(event){
            var eventTarget = event.srcElement || event.target, id;
                id = $(eventTarget).attr("id");
            var model = this.collection.get(id);

            if (this.viewShellPopup) $("#" + this.viewShellPopup.modalId).remove();

            var options = {
                title:"查看",
                body : _.template(template['tpl/liveAllSetup/liveAllSetup.viewShell.html'])({data: model, dataType: 2}),
                backdrop : 'static',
                type     : 1,
                width: 800
            }
            this.viewShellPopup = new Modal(options);
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
                        this.collection.getConfList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initPageDropMenu: function(){
            var pageNum = [
                {name: "5条", value: 5},
                {name: "10条", value: 10},
                {name: "20条", value: 20}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.count = value;
                this.isInitPaginator = false;
                this.queryArgs.page = 1;
                this.$el.find(".pagination").html("");
                this.collection.getConfList(this.queryArgs)
            }.bind(this));
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            this.collection.getConfList(this.queryArgs);
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return LiveCurentSetupView;
});