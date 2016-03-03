define("liveAllSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var AddOrEditFlieView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit     = options.isEdit;
            this.model      = options.model;

            if (this.isEdit){
                this.args = {
                    "id"          : this.model.get("id"),
                    "fileTypeId"  : this.model.get("fileTypeId"),
                    "groupTypeId" : this.model.get("groupTypeId"),
                    "fileName"    : this.model.get("fileName"),
                    "content"     : this.model.get("content"),
                    "remark"      : this.model.get("remark"),
                }
            } else {
                this.args = {
                    "fileTypeId"  : "",
                    "groupTypeId" : "",
                    "fileName"    : "",
                    "content"     : "",
                    "remark"      : "",
                }
            }

            this.$el = $(_.template(template['tpl/liveAllSetup/liveAllSetup.add&edit.html'])({data: this.args}));

            this.collection.off("get.fileType.success");
            this.collection.off("get.fileType.error");

            this.collection.on("get.fileType.success", $.proxy(this.initDropList, this));
            this.collection.on("get.fileType.error", $.proxy(this.onGetError, this));
            this.collection.getFileTypeList();
        },

        initDropList: function(res){
            this.fileTypeList = res;
            var fileTypeList = [];
            _.each(this.fileTypeList, function(el, index, list){
                fileTypeList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-filetype"), fileTypeList, function(value){
                this.args.fileTypeId = parseInt(value);
            }.bind(this));

            if (this.isEdit){
                var defaultValue = _.find(fileTypeList, function(object){
                    return object.value === this.model.attributes.fileTypeId
                }.bind(this));
                this.$el.find(".dropdown-filetype .cur-value").html(defaultValue.name);
                this.$el.find(".dropdown-filetype .dropdown-toggle").attr("disabled", "disabled")
            } else {
                this.$el.find(".dropdown-filetype .cur-value").html(fileTypeList[0].name)
                this.args.fileTypeId = fileTypeList[0].value;
            }
        },

        getArgs: function(){
            var fileName = this.$el.find("#input-name").val();
            if (!fileName) return;
            var args = {
                "id"          : this.model ? this.model.get("id") : 0,
                "fileTypeId"  : this.args.fileTypeId,
                "groupTypeId" : this.args.groupTypeId,
                "fileName"    : fileName,
                "content"     : this.$el.find("#textarea-content").val(),
                "remark"      : this.$el.find("#textarea-comment").val(),
            }
            return args;
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var HistoryView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options    = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.$el = $(_.template(template['tpl/liveAllSetup/liveAllSetup.history.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.historyList = []

            // this.collection.off("get.addConf.success");
            // this.collection.off("get.addConf.error");
            this.collection.off("get.historylist.success");
            this.collection.off("get.historylist.error");

            // this.collection.on("get.addConf.success", function(){
            //     alert("新增成功！")
            //     this.collection.getHisroryFileList(this.args)
            // }.bind(this));
            // this.collection.on("get.addConf.error", $.proxy(this.onGetError, this));
            this.collection.on("get.historylist.success", $.proxy(this.onSetupHistoryListSuccess, this));
            this.collection.on("get.historylist.error", $.proxy(this.onGetError, this));

            this.args = {
                fileId: this.model.attributes.id,
                page: 1,
                count: 9999
            };

            this.collection.getHisroryFileList(this.args)

            //this.$el.find(".create").on("click", $.proxy(this.onClickCreate, this))
            this.$el.find(".back").on("click", $.proxy(this.onClickCancel, this))
        },

        onClickCreate: function(){
            if (this.addFilePopup) $("#" + this.addFilePopup.modalId).remove();

            var addFileView = new AddOrEditFlieView({
                collection: this.collection, 
                isEdit    : false
            });
            var options = {
                title:"新建",
                body : addFileView,
                backdrop : 'static',
                type     : 2,
                width    : 800,
                onOKCallback:  function(){
                    var options = addFileView.getArgs();
                    if (!options) return;
                    this.collection.addConf(options)
                    this.addFilePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.addFilePopup = new Modal(options);
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

        onSetupHistoryListSuccess: function(res){
            this.historyList = [];
            for (var i = 0; i < res.length; i++){
                this.historyList.push(new this.collection.model(res[i]))
            }
            this.initTable();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/liveAllSetup/liveAllSetup.table.html'])({data: this.historyList, dataTpye: 3}));
            if (this.historyList.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);
                this.table.find("tbody .used").on("click", $.proxy(this.onClickItemUsed, this));
                this.table.find("tbody .file-name").on("click", $.proxy(this.onClickItemFileName, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickItemFileName: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = _.find(this.historyList, function(object){
                return parseInt(id) === object.attributes.id
            }.bind(this));

            if (this.viewShellPopup) $("#" + this.viewShellPopup.modalId).remove();

            var options = {
                title:"查看",
                body : _.template(template['tpl/liveAllSetup/liveAllSetup.viewShell.html'])({data: model, dataType: 1}),
                backdrop : 'static',
                type     : 1,
                width: 800
            }
            this.viewShellPopup = new Modal(options);
        },

        onClickItemUsed: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var usedModel = _.find(this.historyList, function(object){
                return parseInt(id) === object.attributes.id
            }.bind(this));
            usedModel.attributes.isChecked = this.model.attributes.isChecked;
            this.options.selectedCallback&&this.options.selectedCallback(usedModel, this.model);
            this.options.cancelCallback&&this.options.cancelCallback();
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
                        this.collection.getNodeList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name: "运行中", value: 1},
                {name: "挂起", value: 2},
                {name: "已关闭", value: 3}
            ],
            rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                if (value !== "All")
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

            this.collection.getOperatorList();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    var ConfirmView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options        = options;
            this.collection     = options.collection;
            this.selectedModels = options.selectedModels;
            this.$el = $(_.template(template['tpl/liveAllSetup/liveAllSetup.confirm.html'])());
            this.initTable();

            this.$el.find(".ok-again").on("click", $.proxy(this.onClickOK, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancel, this));

            this.collection.off("get.ip.success");
            this.collection.off("get.ip.error");
            this.collection.off("get.fileGroup.success");
            this.collection.off("get.fileGroup.error");
            this.collection.off("get.confirmAdd.success");
            this.collection.off("get.confirmAdd.error");

            this.collection.on("get.ip.success", $.proxy(this.onGetIpGroupSuccess, this));
            this.collection.on("get.ip.error", $.proxy(this.onGetError, this));
            this.collection.on("get.fileGroup.success", $.proxy(this.onGetFileGroupSuccess, this));
            this.collection.on("get.fileGroup.error", $.proxy(this.onGetError, this));
            this.collection.on("get.confirmAdd.success", function(){
                alert("操作成功！")
                this.onClickCancel();
            }.bind(this));
            this.collection.on("get.confirmAdd.error", $.proxy(this.onGetError, this));

            this.collection.getIpGroupList();
            this.collection.getFileGroupList();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onClickCancel: function(){
            this.options.cancelCallback&&this.options.cancelCallback();
        },

        onClickOK: function(){
            var result = confirm("你确定要这么做吗？") 
            if (!result) return;
            var ipString = this.$el.find("#textarea-ip").val()
            if (ipString.indexOf(",") > -1){
                var ipStringArray = ipString.split(",");
                for (var i = 0; i < ipStringArray.length; i++){
                    var res = Utility.isIP(ipStringArray[i].trim())
                    if (!res) {
                        alert("第" + (i+1) + "个ip没填对！");
                        return;
                    }
                }
            } else {
                var res = Utility.isIP(ipString.trim())
                if (!res) {
                    alert("ip没填对！")
                    return;
                }
            }
            var fileIds = [];
            _.each(this.selectedModels, function(el, index, list){
                fileIds.push(el.attributes.id);
            })
            var options = {
                "fileIds" : fileIds.join(","),
                "ips"     : this.$el.find("#textarea-ip").val(),
                "shellCmd": this.$el.find("#textarea-content").val(),
                "remark"  : this.$el.find("#textarea-comment").val(),
                "groupTypeId" : this.groupTypeId
            }
            this.collection.confirmAdd(options)
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/liveAllSetup/liveAllSetup.table.html'])({data: this.selectedModels, dataTpye: 2}));
            this.$el.find(".table-ctn").html(this.table[0]);

            this.table.find("tbody .file-name").on("click", $.proxy(this.onClickItemFileName, this));

            this.table.find("input").hide();
            this.table.find(".operator").hide();
        },

        onClickItemFileName: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.viewShellPopup) $("#" + this.viewShellPopup.modalId).remove();

            var options = {
                title:"查看",
                body : _.template(template['tpl/liveAllSetup/liveAllSetup.viewShell.html'])({data: model, dataType: 1}),
                backdrop : 'static',
                type     : 1,
                width: 800
            }
            this.viewShellPopup = new Modal(options);
        },

        onGetIpGroupSuccess: function(res){
            this.ipList = res
            var list = [];
            _.each(this.ipList, function(el, index, ls){
                list.push({name: el.id, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-ipgrpup"), list, function(value){
                var defaultValue = _.find(this.ipList, function(object){
                    return object.id === parseInt(value);
                }.bind(this));
                this.$el.find("#textarea-ip").val(defaultValue.ips)
            }.bind(this));
            this.$el.find(".dropdown-ipgrpup .cur-value").html(list[0].name)
            this.$el.find("#textarea-ip").val(this.ipList[0].ips)
        },

        onGetFileGroupSuccess: function(res){
            this.fileGroupList = res
            var groupList = [];
            _.each(this.fileGroupList, function(el, index, list){
                groupList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-filegroup"), groupList, function(value){
                this.groupTypeId = parseInt(value)
            }.bind(this));

            this.$el.find(".dropdown-filegroup .cur-value").html(groupList[0].name)
            this.groupTypeId = groupList[0].value;
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    var LiveAllSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/liveAllSetup/liveAllSetup.html'])());
            this.$el.find(".list .table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.on("get.filelist.success", $.proxy(this.onSetupFileListSuccess, this));
            this.collection.on("get.filelist.error", $.proxy(this.onGetError, this));

            this.collection.on("get.addConf.success", function(){
                alert("操作成功！")
                this.collection.getAllFileList()
            }.bind(this));
            this.collection.on("get.addConf.error", $.proxy(this.onGetError, this));

            this.collection.getAllFileList()

            this.$el.find(".ok").on("click", $.proxy(this.onClickConfirm, this))
            this.$el.find(".list .create").on("click", $.proxy(this.onClickCreate, this))
        },

        onClickCreate: function(){
            if (this.addFilePopup) $("#" + this.addFilePopup.modalId).remove();

            var addFileView = new AddOrEditFlieView({
                collection: this.collection, 
                isEdit    : false
            });
            var options = {
                title:"新建",
                body : addFileView,
                backdrop : 'static',
                type     : 2,
                width    : 800,
                onOKCallback:  function(){
                    var options = addFileView.getArgs();
                    if (!options) return;
                    this.collection.addConf(options)
                    this.addFilePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.addFilePopup = new Modal(options);
        },

        onClickConfirm: function(){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var options = {
                collection    : this.collection,
                selectedModels: checkedList,
                cancelCallback: $.proxy(this.onClickConfirmCancel, this) 
            };
            var confirmView = new ConfirmView(options);
            confirmView.render(this.$el.find(".confirm"));

            this.$el.find(".list").slideUp(300);
            setTimeout(function(){
                this.$el.find(".confirm").show();
            }.bind(this), 300)
        },

        onClickConfirmCancel: function(){
            this.$el.find(".list").slideDown(300);
            this.$el.find(".confirm").hide();
            this.$el.find(".confirm .confirm-ctn").remove();
        },

        onBackHistoryCallback: function(){
            this.$el.find(".list").slideDown(300);
            this.$el.find(".history-panel").hide();
            this.$el.find(".history-panel .history-ctn").remove();
        },

        selectedModelsCallback: function(usedModel, originModel){
            var model = this.collection.get(originModel.get("id"))
            _.each(usedModel.attributes, function(el, key, ls){
                model.set(key, el)
            })
            _.each(this.collection.models, function(el, index, ls){
                el.set("isChecked", false);
            })
            setTimeout(function(){
                this.collection.trigger("get.filelist.success")
            }.bind(this), 300)
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onSetupFileListSuccess: function(){
            this.initTable();
        },

        initTable: function(){
            this.$el.find(".ok").attr("disabled", "disabled");
            this.table = $(_.template(template['tpl/liveAllSetup/liveAllSetup.table.html'])({data: this.collection.models, dataTpye: 1}));
            if (this.collection.models.length !== 0){
                this.$el.find(".list .table-ctn").html(this.table[0]);
                this.table.find("tbody .file-name").on("click", $.proxy(this.onClickItemFileName, this));
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .history").on("click", $.proxy(this.onClickItemHistory, this));
                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            } else {
                this.$el.find(".list .table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickItemFileName: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.viewShellPopup) $("#" + this.viewShellPopup.modalId).remove();

            var options = {
                title:"查看",
                body : _.template(template['tpl/liveAllSetup/liveAllSetup.viewShell.html'])({data: model, dataType: 1}),
                backdrop : 'static',
                type     : 1,
                width: 800
            }
            this.viewShellPopup = new Modal(options);
        },

        onClickItemHistory: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            var aHistoryView = new HistoryView({
                collection: this.collection, 
                model     : model,
                cancelCallback: $.proxy(this.onBackHistoryCallback, this),
                selectedCallback: $.proxy(this.selectedModelsCallback, this)
            });
            aHistoryView.render(this.$el.find(".history-panel"));

            this.$el.find(".list").slideUp(300);
            setTimeout(function(){
                this.$el.find(".history-panel").show();
            }.bind(this), 300)
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.editFilePopup) $("#" + this.editFilePopup.modalId).remove();

            var editFileView = new AddOrEditFlieView({
                collection: this.collection, 
                model     : model,
                isEdit    : true,
            });
            var options = {
                title:"编辑",
                body : editFileView,
                backdrop : 'static',
                type     : 2,
                width    : 800,
                onOKCallback:  function(){
                    var options = editFileView.getArgs();
                    if (!options) return;
                    this.collection.addConf(options)
                    this.editFilePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.editFilePopup = new Modal(options);
        },

        onClickMultiStop : function(event){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [];
            _.each(checkedList, function(el, index, list){
                ids.push(el.attributes.id);
            })
            if (ids.length === 0) return;
            var result = confirm("你确定要关闭节点吗？")
            if (!result) return
            this.collection.updateNodeStatus({ids:ids, status:3})
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
                        this.collection.getNodeList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name: "运行中", value: 1},
                {name: "挂起", value: 2},
                {name: "已关闭", value: 3}
            ],
            rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                if (value !== "All")
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

            this.collection.getOperatorList();
        },

        onGetFileInfoSuccess: function(res){
            this.operatorList = res
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

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");
            var model = this.collection.get(id);
            model.set("isChecked", eventTarget.checked)

            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            if (checkedList.length === this.collection.models.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.collection.models.length)
                this.table.find("thead input").get(0).checked = false;
            if (checkedList.length === 0) {
                this.$el.find(".ok").attr("disabled", "disabled");
            } else {
                this.$el.find(".ok").removeAttr("disabled", "disabled");
            }
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
            if (eventTarget.checked){
                this.$el.find(".ok").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".ok").attr("disabled", "disabled");
            }
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

    return LiveAllSetupView;
});