define("templateManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options    = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.isEdit     = options.isEdit;
            this.operatorList = options.operatorList;
            this.businessTypeList = options.businessTypeList;
            this.fileTypeList = options.fileTypeList;
            this.areaList = options.areaList;
            this.originTypeList = options.originTypeList;
            this.layerList = options.layerList;

            if(this.isEdit){

            }else{
                this.args = {
                    "domain"           : null,
                    "businessType"     : null,
                    "layer"            : null,
                    "operator"         : null,
                    "originType"       : null,
                    "area"             : [],
                    "fileType"         : null
                }

            }
            this.$el = $(_.template(template['tpl/templateManage/templateManage.add&edit.html'])({}));

            this.$el.find(".ok-again").on("click", $.proxy(this.onClickOK, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancel, this));
            this.$el.find(".addAttr").on("click", $.proxy(this.onClickAddAttr,this));

            this.initTplDropdown();
            this.initAreaDropdown();
        },

        initTplDropdown: function(){
            //文件类型
            // Utility.initDropMenu(this.$el.find(".dropdown-filetype"), this.fileTypeList, function(value){
            //     this.args.fileType = value;
            // }.bind(this));
            // this.$el.find("#dropdown-filetype .cur-value").text(this.fileTypeList[0].name);
            //运营商
            var operatorList = [];
            _.each(this.operatorList, function(el, index, list){
                operatorList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), operatorList, function(value){
                this.args.operator = value;
            }.bind(this));
            this.$el.find("#dropdown-operator .cur-value").text(operatorList[0].name);
            //业务类型
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), this.businessTypeList, function(value){
                this.args.businessType = value;
            }.bind(this));
            this.$el.find("#dropdown-businessType .cur-value").text(this.businessTypeList[0].name);
            //回源方式
            Utility.initDropMenu(this.$el.find(".dropdown-originType"), this.originTypeList, function(value){
                this.args.originType = value;
            }.bind(this));
            this.$el.find("#dropdown-originType .cur-value").text(this.originTypeList[0].name);
            //设备层级
            Utility.initDropMenu(this.$el.find(".dropdown-layer"), this.layerList, function(value){
                this.args.layer = value;
            }.bind(this));
            this.$el.find("#dropdown-layer .cur-value").text(this.layerList[0].name);
        },

        initAreaDropdown: function(){
            //this.args.area = this.areaList.join(",");
            //console.log(this.areaList.join(","));
            var areaArray = [];
            _.each(this.areaList, function(el, index, list){
                areaArray.push({name:el, value: el})
            }.bind(this));

            if (this.searchSelect) this.searchSelect.destroy();
            this.searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-area').get(0),
                panelID: this.$el.find('#dropdown-area').get(0),
                isSingle: false,
                openSearch: true,
                selectWidth: 400,
                isDataVisible: false,
                defaultChecked: true,
                onOk: function(data){
                    var temp = [];
                    _.each(data, function(el, key, list){
                        temp.push(el.name)
                    }.bind(this))
                    this.args.area =temp.join(",");
                    if(this.args.area != ""){
                        this.$el.find(".textarea-area").show();
                    }else{
                        this.$el.find(".textarea-area").hide();
                    }
                    this.$el.find("#textarea-area").val(this.args.area);
                }.bind(this),
                data: areaArray,
                callback: function(data) {
                    this.args.area = data.join(",");
                    if(this.args.area != ""){
                        this.$el.find(".textarea-area").show();
                    }else{
                        this.$el.find(".textarea-area").hide();
                    }
                    this.$el.find("#textarea-area").val(this.args.area);
                }.bind(this)
            });
            //this.$el.find("#dropdown-domain .cur-value").html("选中域名个数：" + res.length + "/" + res.length);
        },

        onClickAddAttr: function(){
            if (this.addAttrPopup) $("#" + this.addAttrPopup.modalId).remove();

            var addAttrView = new AddAttrView({
                collection: this.collection,
                isEdit: false
            });
            var options = {
                title:"新增属性",
                body : addAttrView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    //var options = addAttrView.getArgs();
                    //if (!options) return;
                    //this.collection.addDomain(options);
                    this.addAttrPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addAttrPopup = new Modal(options);
        },

        onClickEditAttr: function(){
            if (this.editAttrPopup) $("#" + this.editAttrPopup.modalId).remove();

            var editAttrView = new AddOrEditAttrView({
                collection: this.collection,
                isEdit: false
            });
            var options = {
                title:"编辑属性",
                body : editAttrView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    //var options = editAttrView.getArgs();
                    //if (!options) return;
                    //this.collection.addDomain(options);
                    this.editAttrPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.editAttrPopup = new Modal(options);
        },

        onClickCancel: function(){
            if (this.timer) clearInterval(this.timer)
            this.options.cancelCallback&&this.options.cancelCallback();
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

    var AddOrEditAttrView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/templateManage/templateManage.addAttr&editAttr.html'])({}));
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

            this.queryArgs = {
                "domain"           : null,
                "businessType"     : null,
                "layer"            : null,
                "operator"         : null,
                "originType"       : null,
                "area"             : null,
                "fileType"         : null,
                "page"             : 1,
                "size"             : 10
            };

            this.collection.getFileTypeList({type:2}); //获取文件类型列表
            this.collection.getAllCity(); //获取区域列表
            this.collection.getBusinessList(); //获取业务类型列表
            this.collection.getOperatorList(); //获取运营商列表

            this.collection.on("get.tplPageList.success", $.proxy(this.onGetTplPageListSuccess,this));
            this.collection.on("get.tplPageList.error", $.proxy(this.onGetError,this));
            this.collection.on("get.fileTypeList.success", $.proxy(this.initfileTypeDropdownMenu,this));
            this.collection.on("get.fileTypeList.error", $.proxy(this.onGetError,this));
            this.collection.on("get.businessList.success", $.proxy(this.initBisDropMenu, this));
            this.collection.on("get.businessList.error", $.proxy(this.onGetError, this));
            this.collection.on("get.city.success", $.proxy(this.onGetAllCity, this));
            this.collection.on("get.city.error", $.proxy(this.onGetError, this));
            this.collection.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));

            this.onClickQueryButton();
            this.enterKeyBindQuery();
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

        onGetTplPageListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/templateManage/templateManage.table.html'])({data:this.collection.models}));
            if (this.collection.models.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);
            }else{
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }

            this.table.find("tbody .domain-name").on("click", $.proxy(this.onClickItemView, this));
            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
        },

        onGetOperatorSuccess: function(res){
            this.operatorList = res.rows;
            var nameList = [{name: "全部", value: "All"}];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), nameList, function(value){
                if (value !== "All")
                    this.queryArgs.operator = parseInt(value)
                else
                    this.queryArgs.operator = null;
            }.bind(this));
        },

        initFixDropMenu: function(){
            var originTypeList = [
                {name: "全部", value: "All"},
                {name: "域名回源", value: 1},
                {name: "IP回源", value: 2}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-originType"), originTypeList, function(value){
                if (value !== "All")
                    this.queryArgs.originType = parseInt($.trim(value));
                else
                    this.queryArgs.originType = null;
            }.bind(this));

            var layerList = [
                {name: "全部", value: "All"},
                {name: "上层", value: 1},
                {name: "下层", value: 2}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-deviceLevel"), layerList, function(value){
                if (value !== "All")
                    this.queryArgs.layer = parseInt($.trim(value));
                else
                    this.queryArgs.layer = null;
            }.bind(this));
        },

        initBisDropMenu: function(res){
            this.businessTypeList = res;
            var nameList = [{name: "全部", value: "All"}];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.name, value:el.id});
            });
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), nameList, function(value){
                if (value !== "All")
                    this.queryArgs.businessType = parseInt($.trim(value));
                else
                    this.queryArgs.businessType = null;
            }.bind(this));
        },

        initfileTypeDropdownMenu: function(res){
            this.fileTypeList = res;
            var fileTypeList = [];
            _.each(res, function(el, key, ls){
                fileTypeList.push({name: el.name, value: el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-fileSetup"), fileTypeList, function(value){
                this.queryArgs.fileType = parseInt($.trim(value));
            }.bind(this));
            this.$el.find("#dropdown-fileSetup .cur-value").html(fileTypeList[0].name);
            this.queryArgs.fileType = parseInt(fileTypeList[0].value);
            this.collection.getTplPageList(this.queryArgs);
        },

        onGetAllCity: function(res){
            var cityArray = [{name:"默认", value: "默认", isDisplay: false}];
            res = _.uniq(res);
            this.areaList = res;
            _.each(res, function(el, index, list){
                cityArray.push({name:el, value: el, isDisplay: false})
            }.bind(this))
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-area').get(0),
                panelID: this.$el.find('#dropdown-area').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: true,
                zIndex: 3,
                onOk: function(){},
                data: cityArray,
                callback: function(data) {
                    console.log(data);
                    this.$el.find('#dropdown-area .cur-value').html(data.name);
                    this.nodeGroupNamePart2 = data.name;
                }.bind(this)
            });
            this.$el.find("#dropdown-area .cur-value").html(this.nodeGroupNamePart2)
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.domain = this.$el.find("#input-domain").val();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getTplPageList(this.queryArgs);
        },

        onClickCreate: function(){
            var addView = new AddOrEditView({
                collection: this.collection, 
                isEdit    : false,
                operatorList: this.operatorList,
                businessTypeList: this.businessTypeList,
                fileTypeList: this.fileTypeList,
                areaList: this.areaList,
                originTypeList:[
                    {name: "域名回源", value: 1},
                    {name: "IP回源", value: 2}
                ],
                layerList:[
                    {name: "上层", value: 1},
                    {name: "下层", value: 2}
                ],
                cancelCallback: function(){
                    this.showMainList(".main-list",".create-edit-panel",".create-edit-ctn");
                }.bind(this),
                okCallback:  function(options){
                    //this.collection.addConf(options);
                }.bind(this)
            });
            addView.render(this.$el.find(".create-edit-panel"));

            this.hideMainList(".main-list", ".create-edit-panel");
            // if (!AUTH_OBJ.ApplyCreateConfig)
            //     addView.$el.find(".ok-again").remove()
        },

        // onClickCreate: function(){
        //     if (this.selectAddTplTypePopup) $("#" + this.selectAddTplTypePopup.modalId).remove();

        //     var selectAddTplTypeView = new SelectAddTplTypeView({
        //         collection: this.collection,
        //         model: this.model
        //     });
        //     var options = {
        //         title:"新建",
        //         body : selectAddTplTypeView,
        //         backdrop : 'static',
        //         type     : 2,
        //         onOKCallback:  function(){
        //             var options = selectAddTplTypeView.getArgs();
        //             if (!options) return;
        //             this.selectAddTplTypePopup.$el.modal("hide");
        //             setTimeout(function(){
        //                 this.createTpl(options);
        //             }.bind(this),500);
        //         }.bind(this),
        //         onHiddenCallback: function(){}
        //     }
        //     this.selectAddTplTypePopup = new Modal(options);
        // },

        // createTpl: function(tplType){
        //     if (this.addTplPopup) $("#" + this.addTplPopup.modalId).remove();

        //     var addTplView = new AddOrEditTemplateView({
        //         collection: this.collection,
        //         model: this.model,
        //         isEdit: false,
        //         tplType: tplType
        //     });
        //     var options = {
        //         title:"新建",
        //         body : addTplView,
        //         backdrop : 'static',
        //         type     : 2,
        //         onOKCallback:  function(){
        //             // var options = addTplView.getArgs();
        //             // if (!options) return;
        //             // this.createTpl(options);
        //             // this.addTplPopup.$el.modal("hide");
        //         }.bind(this),
        //         onHiddenCallback: function(){}
        //     }
        //     this.addTplPopup = new Modal(options);
        // },

        onClickItemEdit: function(e){
            if (this.editTplPopup) $("#" + this.editTplPopup.modalId).remove();

            var editTplView = new AddOrEditTemplateView({
                collection: this.collection,
                model: this.model,
                isEdit: true
            });
            var options = {
                title:"编辑",
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

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.size) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.size);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.size;
                        this.collection.getTplPageList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "50条", value: 50},
                {name: "100条", value: 100},
                {name: "300条", value: 300}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.size = parseInt(value);
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));
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