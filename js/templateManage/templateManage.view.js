define("templateManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditTemplateView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;
            this.isEdit     = options.isEdit;

            // if(this.isEdit){

            // }else{

            // }
            this.$el = $(_.template(template['tpl/templateManage/templateManage.add&edit.origdomain.html'])({}));

        },

        initTplDropdown: function(){
            //模版类型
            var fileSetup = [
                {name: "origdomain.conf", value: 1},
                {name: "domain.conf", value: 2},
                {name: "lua.conf", value: 3}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-fileSetup"), fileSetup, function(value){
                this.addTpl = parseInt(value);
            }.bind(this));
            this.$el.find(".dropdown-fileSetup .cur-value").text(fileSetup[0].name);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        getArgs: function(){
            // var checkedList = this.channelList.filter(function(object) {
            //     return object.isChecked === true;
            // })
            // var channelIds = [];
            // _.each(checkedList, function(el, index, list){
            //     channelIds.push(el.id)
            // }.bind(this))
            // var nodeId = this.$el.find("tbody input:checked").attr("id");
            // var options =  {
            //     "dispGroupIds": [parseInt(nodeId)],//channelIds,
            //     "channelId"   : this.model.get("id")
            // }
            // return options
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var SelectAddTplTypeView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/templateManage/templateManage.add.selectTpl.html'])({}));
            this.initTplDropdown();
        },

        initTplDropdown: function(){
            //模版类型
            var fileSetup = [
                {name: "origdomain.conf", value: 1},
                {name: "domain.conf", value: 2},
                {name: "lua.conf", value: 3}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-fileSetup"), fileSetup, function(value){
                this.addTpl = parseInt(value);
            }.bind(this));
            this.$el.find(".dropdown-fileSetup .cur-value").text(fileSetup[0].name);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        getArgs: function(){
            // var checkedList = this.channelList.filter(function(object) {
            //     return object.isChecked === true;
            // })
            // var channelIds = [];
            // _.each(checkedList, function(el, index, list){
            //     channelIds.push(el.id)
            // }.bind(this))
            // var nodeId = this.$el.find("tbody input:checked").attr("id");
            // var options =  {
            //     "dispGroupIds": [parseInt(nodeId)],//channelIds,
            //     "channelId"   : this.model.get("id")
            // }
            // return options
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var ShowTplView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/templateManage/templateManage.view.html'])({}));

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

    var TemplateManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/templateManage/templateManage.html'])());

            this.initNodeDropMenu();

            // this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            // this.collection.on("get.channel.error", $.proxy(this.onGetError, this));
            // this.collection.on("add.dispGroup.channel.success", function(){
            //     alert("关联成功！")
            //     this.onClickQueryButton();
            // }.bind(this));
            // this.collection.on("add.dispGroup.channel.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));

            this.enterKeyBindQuery();

            this.queryArgs = {
                "domain"           : null,
                "businessType"     : null,
                "deviceLevel"      : null,
                "operator"         : null,
                "originType"       : null,
                "area"             : null,
                "templateType"     : null,
                "page"             : 1,
                "count"            : 10
             }
            this.onClickQueryButton();
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

        onListSuccess: function(){
            this.initTable();
            //if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.domain = this.$el.find("#input-domain").val();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            //this.collection.queryChannel(this.queryArgs);
            this.onListSuccess(); //for test
        },

        onClickCreate: function(){
            if (this.selectAddTplTypePopup) $("#" + this.selectAddTplTypePopup.modalId).remove();

            var selectAddTplTypeView = new SelectAddTplTypeView({
                collection: this.collection,
                model: this.model
            });
            var options = {
                title:"新建模版",
                body : selectAddTplTypeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = selectAddTplTypeView.getArgs();
                    if (!options) return;
                    this.selectAddTplTypePopup.$el.modal("hide");
                    setTimeout(function(){
                        this.createTpl(options);
                    }.bind(this),500);
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.selectAddTplTypePopup = new Modal(options);
        },

        createTpl: function(tplType){
            if (this.addTplPopup) $("#" + this.addTplPopup.modalId).remove();

            var addTplView = new AddOrEditTemplateView({
                collection: this.collection,
                model: this.model,
                isEdit: false,
                tplType: tplType
            });
            var options = {
                title:"新建模版",
                body : addTplView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    // var options = addTplView.getArgs();
                    // if (!options) return;
                    // this.createTpl(options);
                    // this.addTplPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.addTplPopup = new Modal(options);
        },

        onClickItemEdit: function(e){
            if (this.editTplPopup) $("#" + this.editTplPopup.modalId).remove();

            var editTplView = new AddOrEditTemplateView({
                collection: this.collection,
                model: this.model,
                isEdit: true
            });
            var options = {
                title:"新建模版",
                body : editTplView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    // var options = editTplView.getArgs();
                    // if (!options) return;
                    // this.createTpl(options);
                    // this.editTplPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.editTplPopup = new Modal(options);
        },

        onClickItemDelete: function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }
            var result = confirm("你确定要删除吗？")
            if (!result) return;
            //请求删除接口
            //this.collection.deleteDomain(id);
        },

        initTable: function(){
            // this.table = $(_.template(template['tpl/templateManage/templateManage.table.html'])({data: this.collection.models}));
            this.table = $(_.template(template['tpl/templateManage/templateManage.table.html'])());
            // if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            // else
            //     this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .domain-name").on("click", $.proxy(this.onClickItemView, this));
            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
        },

        onClickItemView: function(){
            if (this.showTemplatePopup) $("#" + this.showTemplatePopup.modalId).remove();

            var showTplView = new ShowTplView({
                collection: this.collection,
                model: this.model
            });
            var options = {
                title:"查看",
                body : showTplView,
                backdrop : 'static',
                type     : 1,
                onOKCallback:  function(){}.bind(this),
                onHiddenCallback: function(){}
            }
            this.showTemplatePopup = new Modal(options);
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
                        //this.collection.queryChannel(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function(){
            //业务类型
            var businessType = [
                {name: "全部", value: "all"},
                {name: "直播", value: 1},
                {name: "点播", value: 2}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), businessType, function(value){
                if (value !== "all") this.queryArgs.businessType = parseInt(value);
                if (value === "all") this.queryArgs.businessType = null;
            }.bind(this));
            //设备层级
            var deviceLevel = [
                {name: "全部", value: "all"},
                {name: "上层", value: 1},
                {name: "下层", value: 2}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-deviceLevel"), deviceLevel, function(value){
                if (value !== "all") this.queryArgs.deviceLevel = parseInt(value);
                if (value === "all") this.queryArgs.deviceLevel = null;
            }.bind(this));
            //运营商
            var operator = [
                {name: "全部", value: "all"},
                {name: "电信", value: 1},
                {name: "联通", value: 2}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), operator, function(value){
                if (value !== "all") this.queryArgs.operator = parseInt(value);
                if (value === "all") this.queryArgs.operator = null;
            }.bind(this));
            //区域
            var area = [
                {name: "全部", value: "all"},
                {name: "区域1", value: 1},
                {name: "区域2", value: 2}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-area"), area, function(value){
                if (value !== "all") this.queryArgs.area = parseInt(value);
                if (value === "all") this.queryArgs.area = null;
            }.bind(this));
            //回源方式
            var originType = [
                {name: "全部", value: "all"},
                {name: "IP回源", value: 1},
                {name: "域名回源", value: 2}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-originType"), originType, function(value){
                if (value !== "all") this.queryArgs.originType = parseInt(value);
                if (value === "all") this.queryArgs.originType = null;
            }.bind(this));
            //模版类型
            var fileSetup = [
                {name: "全部", value: "all"},
                {name: "origdomain.conf", value: 1},
                {name: "domain.conf", value: 2},
                {name: "lua.conf", value: 3}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-fileSetup"), fileSetup, function(value){
                if (value !== "all") this.queryArgs.fileSetup = parseInt(value);
                if (value === "all") this.queryArgs.fileSetup = null;
            }.bind(this));
            var pageNum = [
                {name: "10条", value: 10},
                {name: "50条", value: 50},
                {name: "100条", value: 100},
                {name: "300条", value: 300}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.count = parseInt(value);
                this.queryArgs.page = 1;
                //this.onStartQueryButton();
            }.bind(this));
            //this.deviceCollection.ipTypeList();
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

    return TemplateManageView;
});