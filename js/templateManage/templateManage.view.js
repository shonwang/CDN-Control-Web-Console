define("templateManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var AddOrEditAttrView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;
            this.fileType   = options.fileType;
            this.isAttrEdit = options.isAttrEdit;
            this.data = options.data;

            if(this.isAttrEdit){
                this.args = {
                    name:this.data.name,
                    code:this.data.code,
                    value:this.data.value,
                    propertyValueId:this.data.propertyValueId,
                    propertyId: this.data.propertyId
                }
            }else{
                this.args = {
                    name:"",
                    code:"",
                    value:"",
                    propertyValueId:"",
                    propertyId:""
                }
            }

            this.$el = $(_.template(template['tpl/templateManage/templateManage.addAttr&editAttr.html'])({data:this.args}));

            this.collection.on("check.tpl.success", $.proxy(this.onGetCheckTplSuccess,this));
            this.collection.on("check.tpl.error", $.proxy(this.onGetError,this));
        },

        checkAttrCode: function(){
            this.args.name = $.trim(this.$el.find("#input-attrName").val());
            this.args.value = $.trim(this.$el.find("#input-val").val());
            this.args.code = $.trim(this.$el.find("#input-code").val());
            if(this.args.name.length == 0){
                alert('属性名称不能为空');
                return;
            }
            if(this.args.code.length == 0){
                alert('属性编码不能为空');
                return;
            }
            this.collection.checkTpl({fileType:this.fileType,code:this.args.code});
        },

        onGetCheckTplSuccess: function(res){
            if(res.result){ //属性编码已存在
                this.$el.find(".error-ctn").show().html('<div class="alert alert-danger text-center"><strong> 已存在 </strong></div>');
                window.checkResult = 'hasExist';
            }else{
                this.$el.find(".error-ctn").hide().html("");
                window.checkResult = this.args;
            }
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

    var ShowTplView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;

            this.$el = $(_.template(template['tpl/templateManage/templateManage.view.html'])({data:this.model}));

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
            this.data = options.data;

            if(this.isEdit){
                this.args = {
                    "id"               : this.data.id,
                    "domain"           : this.data.domain,
                    "businessType"     : this.data.businessType,
                    "layer"            : this.data.layer,
                    "operator"         : this.data.operator,
                    "originType"       : this.data.originType,
                    "area"             : this.data.area,
                    "fileType"         : this.data.fileType,
                    "country"          : "CN",
                    "templateContent"  : this.data.templateContent,
                    "propertyAndValueList" : this.data.propertyAndValueList
                }
            }else{
                this.args = {
                    "domain"           : "",
                    "businessType"     : this.businessTypeList[0].id,
                    "layer"            : this.layerList[0].value,
                    "operator"         : this.operatorList[0].name,
                    "originType"       : this.originTypeList[0].value,
                    "area"             : "默认",
                    "fileType"         : this.fileTypeList[0].value,
                    "country"          : "CN",
                    "templateContent"  : "",
                    "propertyAndValueList" : []
                }

            }
            this.$el = $(_.template(template['tpl/templateManage/templateManage.add&edit.html'])({data:this.args}));

            this.collection.off("get.defaultTplData.success");
            this.collection.off("get.defaultTplData.error");
            this.collection.on("get.defaultTplData.success", $.proxy(this.onGetDefaultTplDataSuccess,this));
            this.collection.on("get.defaultTplData.error", $.proxy(this.onGetError,this));
            this.collection.off("set.defaultTpl.success");
            this.collection.off("set.defaultTpl.error");
            this.collection.on("set.defaultTpl.success", $.proxy(this.onSetDefaultTplSuccess,this));
            this.collection.on("set.defaultTpl.error", $.proxy(this.onGetError,this));

            this.$el.find(".ok-again").on("click", $.proxy(this.onClickOK, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancel, this));
            this.$el.find(".addAttr").on("click", $.proxy(this.onClickAddAttr,this));
            this.$el.find(".setDefaultTpl").on("click", $.proxy(this.onClickSetDefaultTpl,this));
            this.$el.find(".showDefaultTpl").on("click", $.proxy(this.onClickShowDefaultTpl,this));

            if(this.isEdit){
                if(this.args.propertyAndValueList.length > 0){
                    this.$el.find(".showDefaultTpl").attr('disabled', 'disabled');
                    this.renderAttrTable(this.args.propertyAndValueList);
                }else{
                    this.$el.find(".attr-table").html(_.template(template['tpl/empty-2.html'])({data:{message:"暂无属性数据"}}));
                }

                if(this.args.fileType == 3){ //lua 置灰运营商和区域
                    this.$el.find('#dropdown-operator').attr("disabled","disabled").find('.cur-value').html('无');
                    this.$el.find('#dropdown-area').attr("disabled","disabled");
                }else{
                    this.$el.find('#dropdown-operator').removeAttr('disabled');
                    this.$el.find('#dropdown-area').removeAttr('disabled');
                }
            }
            this.initAreaDropdown();
            this.initTplDropdown();
        },

        initTplDropdown: function(){
            //运营商
            var operatorList = [];
            _.each(this.operatorList, function(el, index, list){
                operatorList.push({name: el.name, value:el.name})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), operatorList, function(value){
                this.args.operator = value;
                // if(this.$el.find('.setDefaultTpl').hasClass('disabled')){
                //     this.$el.find('.setDefaultTpl').removeClass('disabled').html(设为默认模版);
                // }
            }.bind(this));
            if(this.isEdit){
                $.each(operatorList,function(k,v){
                    if(v.value == this.data.operator){
                        this.$el.find("#dropdown-operator .cur-value").html(v.name);
                    }
                }.bind(this));
            }else{
                this.$el.find("#dropdown-operator .cur-value").text(operatorList[0].name);
            }
            //业务类型
            var businessTypeList = [];
            _.each(this.businessTypeList, function(el, index, list){
                businessTypeList.push({name: el.name, value:el.id});
            });
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), businessTypeList, function(value){
                this.args.businessType = value;
                // if(this.$el.find('.setDefaultTpl').hasClass('disabled')){
                //     this.$el.find('.setDefaultTpl').removeClass('disabled').html(设为默认模版);
                // }
            }.bind(this));
            if(this.isEdit){
                $.each(businessTypeList,function(k,v){
                    if(v.value == this.data.businessType){
                        this.$el.find("#dropdown-businessType .cur-value").html(v.name);
                    }
                }.bind(this));
            }else{
                this.$el.find("#dropdown-businessType .cur-value").text(this.businessTypeList[0].name);
            }
            //回源方式
            Utility.initDropMenu(this.$el.find(".dropdown-originType"), this.originTypeList, function(value){
                this.args.originType = value;
                // if(this.$el.find('.setDefaultTpl').hasClass('disabled')){
                //     this.$el.find('.setDefaultTpl').removeClass('disabled').html(设为默认模版);
                // }
            }.bind(this));
            if(this.isEdit){
                $.each(this.originTypeList,function(k,v){
                    if(v.value == this.data.originType){
                        this.$el.find("#dropdown-originType .cur-value").html(v.name);
                    }
                }.bind(this));
            }else{
                this.$el.find("#dropdown-originType .cur-value").text(this.originTypeList[0].name);
            }
            //设备层级
            Utility.initDropMenu(this.$el.find(".dropdown-layer"), this.layerList, function(value){
                this.args.layer = value;
                // if(this.$el.find('.setDefaultTpl').hasClass('disabled')){
                //     this.$el.find('.setDefaultTpl').removeClass('disabled').html(设为默认模版);
                // }
            }.bind(this));
            if(this.isEdit){
                $.each(this.layerList,function(k,v){
                    if(v.value == this.data.layer){
                        this.$el.find("#dropdown-layer .cur-value").html(v.name);
                    }
                }.bind(this));
            }else{
                this.$el.find("#dropdown-layer .cur-value").text(this.layerList[0].name);
            }
            //文件类型
            Utility.initDropMenu(this.$el.find(".dropdown-fileType"), this.fileTypeList, function(value){
                this.args.fileType = value;
                if(value == 3){ //lua.conf
                    this.$el.find('#dropdown-operator').attr("disabled","disabled").find('.cur-value').html('无');
                    this.$el.find('#dropdown-area').attr("disabled","disabled");
                    this.$el.find('#textarea-area').hide();
                }else{
                    this.$el.find('#dropdown-operator').removeAttr('disabled').find('.cur-value').html(this.operatorList[0].name);
                    this.$el.find('#dropdown-area').removeAttr('disabled');
                    this.$el.find('#textarea-area').show();
                    this.args.operator = this.operatorList[0].id;
                }
            }.bind(this));
            if(this.isEdit){
                $.each(this.fileTypeList,function(k,v){
                    if(v.value == this.data.fileType){
                        this.$el.find("#dropdown-fileType .cur-value").html(v.name);
                    }
                }.bind(this));
            }else{
                this.$el.find("#dropdown-fileType .cur-value").text(this.fileTypeList[0].name);
            }
        },

        initAreaDropdown: function(){
            var areaArray = [{name:"默认", value: "默认"}];
            _.each(this.areaList, function(el, index, list){
                areaArray.push({name:el, value: el})
            }.bind(this));

            if(this.isEdit){
                if(this.data.area && this.data.area.split(",").length > 0){
                    _.each(this.data.area.split(","),function(item,key,list){
                        _.each(areaArray,function(obj,k,l){
                            if(item == obj.value){
                                obj.checked = true;
                            }
                        }.bind(this));
                    }.bind(this));
                    this.$el.find(".textarea-area").show();
                    this.$el.find("#textarea-area").val(this.data.area);
                }
            }else{
                areaArray[0].checked = true;
                this.$el.find(".textarea-area").show();
                this.$el.find("#textarea-area").val(areaArray[0].name);
            }
            if (this.searchSelect) this.searchSelect.destroy();
            this.searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-area').get(0),
                panelID: this.$el.find('#dropdown-area').get(0),
                isSingle: false,
                openSearch: true,
                selectWidth: 400,
                scrollBarHeight:200,
                isDataVisible: false,
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
                    if(this.$el.find('.setDefaultTpl').hasClass('disabled')){
                        this.$el.find('.setDefaultTpl').removeClass('disabled').html(设为默认模版);
                    }
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
                    if(this.$el.find('.setDefaultTpl').hasClass('disabled')){
                        this.$el.find('.setDefaultTpl').removeClass('disabled').html(设为默认模版);
                    }
                }.bind(this)
            });
        },

        onClickSetDefaultTpl: function(e){
            var args = this.getArgs();
            if (!args) return;
            //调用设为默认模版接口
            this.collection.setDefaultTpl(args);
        },

        onSetDefaultTplSuccess: function(res){
            this.$el.find('.setDefaultTpl').attr("disabled","disabled").html("已设为默认模版");
        },

        onClickShowDefaultTpl: function(){
            var data = {
                fileType :this.args.fileType,
                businessType :this.args.businessType,
                originType :this.args.originType,
                layer :this.args.layer,
                operator:this.args.operator,
                area:this.args.area
            }
            //调用获取默认模版数据接口
            this.collection.getDefaultTplData(data);
        },

        onGetDefaultTplDataSuccess: function(res){
            this.$el.find(".showDefaultTpl").attr('disabled', 'disabled').html("已显示默认模版");
            this.renderAttrTable(res.propertyAndValueList);
            this.$el.find("#textarea-tplContent").val(res.templateContent);
        },

        renderAttrTable: function(data){
            if(($.isArray(data) && data.length > 0) || (!$.isArray(data) && data)){
                var tableLen = this.$el.find(".attr-table").children().length;
                if(tableLen){
                    this.tr = $(_.template(template['tpl/templateManage/templateManage.add&edit.table.tr.html'])({data:data}));
                    this.$el.find(".attr-table tbody").append(this.tr[0].outerHTML);
                }else{
                    if($.isArray(data)){
                        data = data;
                    }else{
                        data = [data];
                    }
                    this.table = $(_.template(template['tpl/templateManage/templateManage.add&edit.table.html'])({data:data}));
                    this.$el.find(".attr-table").html(this.table[0]);
                }
                this.$el.find(".attr-table .delete").off("click");
                this.$el.find(".attr-table .delete").on("click", $.proxy(this.onClickDelete, this));
                this.$el.find(".attr-table .edit").off("click");
                this.$el.find(".attr-table .edit").on("click", $.proxy(this.onClickEdit, this));
            }else{
                this.$el.find(".attr-table").html(_.template(template['tpl/empty-2.html'])({data:{message:"暂无属性数据"}}));
            }
        },

        onClickDelete: function(e){
            var eTarget = e.srcElement || e.target,currentTr;

            if (eTarget.tagName == "SPAN") {
                currentTr = $(eTarget).parent().parent().parent();
            } else {
                currentTr = $(eTarget).parent().parent();
            }
            currentTr.remove();
            var tbodyLen = this.$el.find(".attr-table tbody").children().length;
            if(!tbodyLen){
                this.$el.find(".attr-table table").remove();
                this.$el.find(".showDefaultTpl").removeAttr('disabled').html("显示默认模版");
            }
        },

        onClickEdit: function(e){
            var eTarget = e.srcElement || e.target;
            var data = {};
            if (eTarget.tagName == "SPAN") {
                data = {
                    name : $(eTarget).parent().parent().siblings().eq(0).attr('value'),
                    code : $(eTarget).parent().parent().siblings().eq(1).attr('value'),
                    value : $(eTarget).parent().parent().siblings().eq(2).attr('value'),
                    propertyValueId : $(eTarget).parent().parent().parent().attr('propertyValueId'),
                    propertyId : $(eTarget).parent().parent().parent().attr('propertyId')
                }
            } else {
                data = {
                    name : $(eTarget).parent().siblings().eq(0).attr('value'),
                    code : $(eTarget).parent().siblings().eq(1).attr('value'),
                    value : $(eTarget).parent().siblings().eq(2).attr('value'),
                    propertyValueId : $(eTarget).parent().parent().attr('propertyValueId'),
                    propertyId : $(eTarget).parent().parent().attr('propertyId')
                }
            }
            if (this.editAttrPopup) $("#" + this.editAttrPopup.modalId).remove();

            var editAttrView = new AddOrEditAttrView({
                collection: this.collection,
                isAttrEdit: true,
                fileType: this.args.fileType,
                data: data
            });
            var options = {
                title:"编辑属性",
                body : editAttrView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    editAttrView.checkAttrCode();
                    var timer = setInterval(function(){
                        if(window.checkResult){
                            this.editAttrPopup.$el.modal("hide");
                            if (eTarget.tagName == "SPAN") {
                                $(eTarget).parent().parent().siblings().eq(0).attr('value',window.checkResult.name).text(window.checkResult.name);
                                $(eTarget).parent().parent().siblings().eq(1).attr('value',window.checkResult.code).text(window.checkResult.code);
                                $(eTarget).parent().parent().siblings().eq(2).attr('value',window.checkResult.value).text(window.checkResult.value);
                                $(eTarget).parent().parent().parent().attr('propertyValueId',window.checkResult.propertyValueId);
                                $(eTarget).parent().parent().parent().attr('propertyId',window.checkResult.propertyId);
                            }else{
                                $(eTarget).parent().siblings().eq(0).attr('value',window.checkResult.name).text(window.checkResult.name);
                                $(eTarget).parent().siblings().eq(1).attr('value',window.checkResult.code).text(window.checkResult.code);
                                $(eTarget).parent().siblings().eq(2).attr('value',window.checkResult.value).text(window.checkResult.value);
                                $(eTarget).parent().parent().attr('propertyValueId',window.checkResult.propertyValueId);
                                $(eTarget).parent().parent().attr('propertyId',window.checkResult.propertyId);
                            }
                            clearInterval(timer);
                        }else{
                            console.log('getting');
                        }
                    }.bind(this),10);
                    window.checkResult = null;
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.editAttrPopup = new Modal(options);
        },

        onClickAddAttr: function(){
            if (this.addAttrPopup) $("#" + this.addAttrPopup.modalId).remove();

            var addAttrView = new AddOrEditAttrView({
                collection: this.collection,
                isAttrEdit: false,
                fileType: this.args.fileType,
                data:null
            });
            var options = {
                title:"新增属性",
                body : addAttrView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    addAttrView.checkAttrCode();
                    var timer = setInterval(function(){
                        if(window.checkResult){
                            if(window.checkResult != 'hasExist'){
                                this.addAttrPopup.$el.modal("hide");
                                this.renderAttrTable(window.checkResult);
                                this.$el.find(".showDefaultTpl").attr('disabled', 'disabled');
                            }
                            clearInterval(timer);
                        }else{
                            console.log('getting');
                        }
                    }.bind(this),10);
                    window.checkResult = null;
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addAttrPopup = new Modal(options);
        },

        onClickCancel: function(){
            if (this.timer) clearInterval(this.timer)
            this.options.cancelCallback&&this.options.cancelCallback();
        },

        onClickOK: function(){
            var args = this.getArgs();
            if (!args) return;
            this.options.okCallback&&this.options.okCallback(args);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        getArgs: function(){
            this.args.domain = $.trim(this.$el.find("#input-domain").val());
            if(this.args.domain.length > 0){
                if (!/\.com$|\.net$|\.org$|\.edu$|\.gov$|\.cn$/gi.test(this.args.domain)){
                    alert('加速域名需以com、org、net、edu、gov、cn结尾');
                    return;
                }else if(this.args.domain.length > 100){
                    alert("加速域名最大可输入100个字符");
                    return;
                }
            }
            this.args.templateContent = $.trim(this.$el.find("#textarea-tplContent").val());
            this.args.propertyAndValueList = [];
            var trLen = this.$el.find(".attr-table tbody").children().length;
            if(trLen > 0){
                for(var i = 0; i< trLen; i++){
                    var json = {
                        name : $.trim(this.$el.find(".attr-table tbody").children().eq(i).children().eq(0).attr("value")),
                        code : $.trim(this.$el.find(".attr-table tbody").children().eq(i).children().eq(1).attr("value")),
                        value : $.trim(this.$el.find(".attr-table tbody").children().eq(i).children().eq(2).attr("value")),
                        propertyValueId : $.trim(this.$el.find(".attr-table tbody").children().eq(i).attr("propertyValueId")),
                        propertyId : $.trim(this.$el.find(".attr-table tbody").children().eq(i).attr("propertyId"))
                    }
                    this.args.propertyAndValueList.push(json);
                }
            }else{
                alert('属性不可以为空');
                return;
            }

            return this.args;
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
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

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
            this.initFixDropMenu();

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
            this.collection.on("add.tpl.success", function(){
                this.showMainList(".main-list", ".create-edit-panel", ".create-edit-ctn");
                alert("新建成功");
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.tpl.error", $.proxy(this.onGetError, this));
            this.collection.on("edit.tpl.success", function(){
                this.showMainList(".main-list", ".create-edit-panel", ".create-edit-ctn");
                alert("编辑成功");
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("edit.tpl.error", $.proxy(this.onGetError, this));
            this.collection.on("get.editData.success", $.proxy(this.showEditPage, this));
            this.collection.on("get.editData.error", $.proxy(this.onGetError, this));
            this.collection.on("delete.tpl.success", function(){
                this.showMainList(".main-list", ".create-edit-panel", ".create-edit-ctn");
                alert("删除成功");
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("delete.tpl.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));

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
                nameList.push({name: el.name, value:el.name})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-operator"), nameList, function(value){
                if (value !== "All"){
                    //this.queryArgs.operator = parseInt(value)
                    this.queryArgs.operator = value;
                }
                else{
                    this.queryArgs.operator = null;
                }
            }.bind(this));
        },

        initFixDropMenu: function(){
            var originTypeList = [
                {name: "全部", value: "All"},
                {name: "IP回源", value: 1},
                {name: "域名回源", value: 2}
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
            var nameList = [{name: "全部", value: "全部"}];
            _.each(res, function(el, index, list){
                nameList.push({name: el.name, value:el.name});
            });
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), nameList, function(value){
                this.queryArgs.businessType = parseInt($.trim(value));
            }.bind(this));
        },

        initfileTypeDropdownMenu: function(res){
            var fileTypeList = [];
            _.each(res, function(el, key, ls){
                fileTypeList.push({name: el.name, value: el.id})
            });
            this.fileTypeList = fileTypeList;
            Utility.initDropMenu(this.$el.find(".dropdown-fileSetup"), fileTypeList, function(value){
                this.queryArgs.fileType = parseInt($.trim(value));
            }.bind(this));
            this.$el.find("#dropdown-fileSetup .cur-value").html(fileTypeList[0].name);
            this.queryArgs.fileType = parseInt(fileTypeList[0].value);
            this.collection.getTplPageList(this.queryArgs);
        },

        onGetAllCity: function(res){
            var cityArray = [{name:"全部", value: "", isDisplay: false},{name:"默认", value: "默认", isDisplay: false}];
            res = _.uniq(res);
            this.areaList = res;
            _.each(res, function(el, index, list){
                cityArray.push({name:el, value: el, isDisplay: false})
            }.bind(this))
            this.$el.find('#dropdown-area .cur-value').html(cityArray[0].name);
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
                    this.queryArgs.area = data.value;
                    this.$el.find('#dropdown-area .cur-value').html(data.name);
                }.bind(this)
            });
        },

        onClickQueryButton: function(){
            this.queryArgs.domain = $.trim(this.$el.find("#input-domain").val());
            if (this.queryArgs.domain == ""){
                this.queryArgs.domain = null;
            }else{
                if (!/\.com$|\.net$|\.org$|\.edu$|\.gov$|\.cn$|^default$/gi.test(this.queryArgs.domain)){
                    alert('加速域名需以com、org、net、edu、gov、cn结尾');
                    return;
                }else if(this.queryArgs.domain.length > 100){
                    alert("加速域名最大可输入100个字符");
                    return;
                }
            }
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
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
                    {name: "IP回源", value: 1},
                    {name: "域名回源", value: 2}
                ],
                layerList:[
                    {name: "上层", value: 1},
                    {name: "下层", value: 2}
                ],
                data:null,
                cancelCallback: function(){
                    this.showMainList(".main-list",".create-edit-panel",".create-edit-ctn");
                }.bind(this),
                okCallback:  function(options){
                    this.collection.addTpl(options);
                }.bind(this)
            });
            addView.render(this.$el.find(".create-edit-panel"));

            this.hideMainList(".main-list", ".create-edit-panel");
        },

        onClickItemEdit: function(e){
            var eTarget = e.srcElement || e.target,id,fileType;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
                fileType = $(eTarget).parent().attr("data-filetype");
            } else {
                id = $(eTarget).attr("id");
                fileType = $(eTarget).attr("data-filetype");
            }
            this.collection.getEditData({id:id,fileType:fileType});
        },

        showEditPage: function(res){
            var editView = new AddOrEditView({
                collection: this.collection, 
                isEdit    : true,
                operatorList: this.operatorList,
                businessTypeList: this.businessTypeList,
                fileTypeList: this.fileTypeList,
                areaList: this.areaList,
                originTypeList:[
                    {name: "IP回源", value: 1},
                    {name: "域名回源", value: 2}
                ],
                layerList:[
                    {name: "上层", value: 1},
                    {name: "下层", value: 2}
                ],
                data:res,
                cancelCallback: function(){
                    this.showMainList(".main-list",".create-edit-panel",".create-edit-ctn");
                }.bind(this),
                okCallback:  function(options){
                    this.collection.editTpl(options);
                }.bind(this)
            });
            editView.render(this.$el.find(".create-edit-panel"));

            this.hideMainList(".main-list", ".create-edit-panel");
        },

        onClickItemDelete: function(e){
            var eTarget = e.srcElement || e.target,id,fileType;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
                fileType = $(eTarget).parent().attr("data-filetype");
            } else {
                id = $(eTarget).attr("id");
                fileType = $(eTarget).attr("data-filetype");
            }
            var result = confirm("你确定要删除吗？")
            if (!result) return;
            //请求删除接口
            this.collection.deleteTpl({id:id,fileType:fileType});
        },

        onClickItemView: function(e){
            var eTarget = e.srcElement || e.target,id;
            id = $(eTarget).attr('id');
            var model = this.collection.get(id);

            if (this.showTemplatePopup) $("#" + this.showTemplatePopup.modalId).remove();

            var showTplView = new ShowTplView({
                collection: this.collection,
                model:model
            });
            var options = {
                title:"查看",
                body : showTplView,
                backdrop : 'static',
                width: 800,
                type: 1,
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