define("importDomainManage.edit.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var SelectDomainView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.domainArray = options.domainArray;

            this.$el = $(_.template(template['tpl/importDomainManage/importDomainManage.select.domain.html'])());
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickConfirmButton, this));

            this.initChannelDropMenu();

            this.queryArgs = {
                cname: null,
                currentPage:1,
                pageSize:10
            }
            this.onClickConfirmButton();
        },

        enterKeyBindQuery: function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickConfirmButton();
                }
            }.bind(this));
        },

        onClickConfirmButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.currentPage = 1;
            this.queryArgs.cname = this.$el.find("#input-cname").val();
            if (this.queryArgs.cname == "") this.queryArgs.cname = null;

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");

            this.collection.on("get.cname.success", $.proxy(this.initTable, this));
            this.collection.on("get.cname.error", $.proxy(this.onGetError, this));
            this.collection.getCnameList(this.queryArgs)
        },

        initTable: function(data){
            this.collection.total = data.total;
            this.cnameList = data.rows;

            if (!this.isInitPaginator) this.initPaginator();

            this.table = $(_.template(template['tpl/importDomainManage/importDomainManage.domain.table.html'])({
                data: this.cnameList, 
            }));
            if (this.cnameList.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.pageSize) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.pageSize);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                first: '',
                last: '',
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.currentPage = num;
                        args.pageSize = this.queryArgs.pageSize;
                        this.collection.getCnameList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initChannelDropMenu: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.pageSize = value;
                this.queryArgs.currentPage = 1;
                this.onClickConfirmButton();
            }.bind(this));
        },

        onSure: function(){
            var selectedDomain = this.$el.find("input:checked");
            if (!selectedDomain.get(0)){
                alert("请选择一个域名")
                return false;
            }
            var id = selectedDomain.get(0).id,
                model = _.find(this.cnameList, function(obj){
                    return obj.id === parseInt(id)
                }.bind(this));

            return model;   
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
            this.enterKeyBindQuery();
        }
    }); 

    var ImportDomainManageEditView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/importDomainManage/importDomainManage.history.html'])({data: {}}));
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".query").on("click", $.proxy(this.onClickSearchButton, this));

            this.startTime = new Date().format("yyyy/MM/dd") + " 00:00:00";
            this.endTime = new Date().valueOf();
            this.startTime = new Date(this.startTime).valueOf();

            this.initChargeDatePicker();

            this.defaultParam = {
                // "page" : 1,
                // "count": 99999,
                "startIssueTime": this.startTime,
                "endIssueTime": this.endTime
            }

            this.collection.off("get.history.success");
            this.collection.off("get.history.error");
            this.collection.on("get.history.success", $.proxy(this.initSetup, this));
            this.collection.on("get.history.error", $.proxy(this.onGetError, this))
            this.collection.getHistoryList(this.defaultParam);
        },

        initChargeDatePicker: function(){
            var startVal = null, endVal = null;
            if (this.startTime)
                startVal = new Date(this.startTime).format("yyyy/MM/dd hh:mm");
            var startOption = {
                lang:'ch',
                timepicker: true,
                scrollInput: false,
                format:'Y/m/d H:i', 
                value: startVal, 
                onChangeDateTime: function(){
                    this.startTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#input-start").datetimepicker(startOption);
            if (this.endTime)
                endVal = new Date(this.endTime).format("yyyy/MM/dd hh:mm");
            var endOption = {
                lang:'ch',
                timepicker: true,
                scrollInput: false,
                format:'Y/m/d H:i', 
                value: endVal, 
                onChangeDateTime: function(){
                    this.endTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#input-end").datetimepicker(endOption);
        },

        initSetup: function(data){
            //if (!this.isInitPaginator) this.initPaginator();

            this.historyList = data;

            _.each(data, function(el, index, ls){
                el.createTimeFormated = new Date(el.createTime).format("yyyy/mm/dd hh:MM:ss")
            }.bind(this))

            this.table = $(_.template(template['tpl/importDomainManage/importDomainManage.history.table.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.historyList.total)
            if (this.historyList.total <= this.defaultParam.count) return;
            var total = Math.ceil(this.historyList.total/this.defaultParam.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.defaultParam);
                        args.page = num;
                        args.count = this.defaultParam.count;
                        this.collection.getHistoryList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        onClickSearchButton: function(){
            this.isInitPaginator = false;
            this.defaultParam.page = 1;
            this.defaultParam.startIssueTime = this.startTime;
            this.defaultParam.endIssueTime = this.endTime;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getHistoryList(this.defaultParam);
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

    return ImportDomainManageEditView;
});