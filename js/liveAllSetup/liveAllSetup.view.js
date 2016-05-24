define("liveAllSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var EditPartitionView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options
            this.isEdit = options.isEdit;
            this.$el = $(_.template(template['tpl/liveAllSetup/liveAllSetup.editPartition.html'])({data: options.partition, isEdit: this.isEdit}));
        },

        getArgs: function(){
            var keyName = this.$el.find("#input-name").val();
            if (!this.isEdit && (!keyName || keyName.length > 100)){
                alert("唯一KEY不能为空且长度不大于100！");
                return false;
            }
            if (!this.isEdit)
                this.options.partition.domain = keyName;
            this.options.partition.content = this.$el.find("#textarea-content").val();
            return this.options.partition;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var AddOrEditFlieView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options     = options
            this.collection  = options.collection;
            this.isEdit      = options.isEdit;
            this.model       = options.model;
            this.busTypeArray= options.busTypeArray;
            this.lockTime    = options.lockTime;

            if (this.isEdit){
                this.args = {
                    "fileName": this.model.get("fileName"),
                    "nodeGroupId": this.model.get("nodeGroupId"),
                    "bisTypeId": this.model.get("bisTypeId"),
                    "confFileId": this.model.get("id"),
                    "content": this.model.get("content"),
                    "remark": this.model.get("remark"),
                    "fileTypeId": this.model.get("fileTypeId"),
                    "partition": this.model.get("partition"),
                    "partitions": this.model.get("partitions"),
                    "releaseModel": parseInt(this.model.get("releaseModel"))
                }
                this.partitionsCopy = [];
                _.each(this.args.partitions, function(el, key, ls){
                    this.partitionsCopy.push(_.extend({}, el));
                }.bind(this))
            } else {
                this.args = {
                    "fileName":"",
                    "nodeGroupId":"",
                    "bisTypeId":"",
                    "content":"",
                    "remark":"",
                    "fileTypeId": "",
                    "partition": 0,
                    "releaseModel": 2,
                    "partitions": []
                }
            }

            this.$el = $(_.template(template['tpl/liveAllSetup/liveAllSetup.add&edit.html'])({data: this.args}));

            this.$el.find(".ok-again").on("click", $.proxy(this.onClickOK, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancel, this));
            this.$el.find(".lock-name").on("click", $.proxy(this.onClickLockName, this));
            this.$el.find(".edit-name").on("click", $.proxy(this.onClickEditName, this));
            this.$el.find(".fileContentType input").on("click", $.proxy(this.onClickfileContentTypeInput, this));
            this.$el.find(".partition-ctn .create-partition").on("click", $.proxy(this.onClickCreatePartition, this));

            this.updatePartitonTable();

            this.collection.off("get.nodeGroupList.success");
            this.collection.off("get.nodeGroupList.error");
            this.collection.off("get.fileType.success");
            this.collection.off("get.fileType.error");

            this.collection.on("get.nodeGroupList.success", $.proxy(this.initNodeGroupDropList, this));
            this.collection.on("get.nodeGroupList.error", $.proxy(this.onGetError, this));
            this.collection.on("get.fileType.success", $.proxy(this.initFileTypeDropList, this));
            this.collection.on("get.fileType.error", $.proxy(this.onGetError, this));

            this.initBussnessDropList();
            this.initLockTime();
        },

        initLockTime: function(){
            var message = "此文件编辑剩余时间：" + "<strong>" + this.lockTime + "</strong>秒";
            this.$el.find(".lock-time").html(message);
            this.timer = setInterval(function(){
                this.lockTime -= 1;
                this.$el.find(".lock-time").html("此文件编辑剩余时间：" + "<strong>" + this.lockTime + "</strong>秒")
                if (this.lockTime === 0 && this.timer) clearInterval(this.timer)
            }.bind(this), 1000)
        },

        onClickLockName: function(){
            this.$el.find(".lock-name").hide();
            this.$el.find(".edit-name").show();
            this.$el.find("#input-name").attr("readonly", true);
        },

        onClickEditName: function(){
            this.$el.find(".lock-name").show();
            this.$el.find(".edit-name").hide();
            alert("编辑文件路径有风险，请谨慎修改！")
            this.$el.find("#input-name").removeAttr("readonly");
        },

        updatePartitonTable: function(){
            this.partitionTable = $(_.template(template['tpl/liveAllSetup/liveAllSetup.partition.table.html'])({data: this.args.partitions}));
            this.$el.find(".partition-tb-ctn").html(this.partitionTable.get(0))
            this.$el.find(".file-content .edit").on("click", $.proxy(this.onClickPartitionItemEdit, this));
            this.$el.find(".file-content .delete").on("click", $.proxy(this.onClickPartitionItemDelete, this));
        },

        onClickCreatePartition: function(){
            if (this.addPartitionPopup) $("#" + this.addPartitionPopup.modalId).remove();

            var addPartitionView = new EditPartitionView({
                partition: {},
                isEdit: false
            })
            var options = {
                title:"新建分块",
                body : addPartitionView,
                backdrop : 'static',
                type     : 2,
                width: 800,
                onOKCallback:  function(){
                    var options = addPartitionView.getArgs();
                    if (!options) return;
                    options.partitionId = new Date().valueOf();
                    var parObjArray = _.filter(this.args.partitions, function(obj) {
                        return obj.domain === options.domain;
                    })
                    if (parObjArray.length > 0){
                        alert("你添加的域名已经存在！")
                        return;
                    }
                    this.args.partitions.push(options);
                    this.updatePartitonTable();
                    this.addPartitionPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.addPartitionPopup = new Modal(options);
        },

        onClickPartitionItemDelete: function(event) {
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            for (var i = 0; i < this.args.partitions.length; i++){
                if (this.args.partitions[i].partitionId === parseInt(id)){
                   this.args.partitions.splice(i, 1);
                   break;
                }
            }
            this.updatePartitonTable();
        },

        onClickPartitionItemEdit: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var aPartition = _.find(this.args.partitions, function(object){
                return object.partitionId === parseInt(id);
            }.bind(this));

            if (this.editPartitionPopup) $("#" + this.editPartitionPopup.modalId).remove();

            var editPartitionView = new EditPartitionView({
                partition: aPartition,
                isEdit: true
            })
            var options = {
                title:"编辑分块",
                body : editPartitionView,
                backdrop : 'static',
                type     : 2,
                width: 800,
                onOKCallback:  function(){
                    var options = editPartitionView.getArgs();
                    if (!options) return;
                    _.each(this.partitionsCopy, function(el, index, ls){
                        if (el.partitionId === options.partitionId){
                            if (options.content !== el.content){
                                this.args.partitions[index].modify = 1;
                                this.$el.find('.file-content tr[id=' + options.partitionId + ']').addClass("success");
                            } else {
                                this.$el.find('.file-content tr[id=' + options.partitionId + ']').removeClass("success");
                                this.args.partitions[index].modify = 0;
                            }
                        }
                    }.bind(this))

                    this.editPartitionPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.editPartitionPopup = new Modal(options);
        },

        onClickfileContentTypeInput: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked === true && eventTarget.value == "1"){
                this.$el.find(".file-content #textarea-content").hide();
                this.$el.find(".file-content .partition-ctn").show();
                this.args.partition = 1;
            } else {
                this.$el.find(".file-content #textarea-content").show();
                this.$el.find(".file-content .partition-ctn").hide();
                this.args.partition = 0;
            }
        },

        onClickCancel: function(){
            if (this.timer) clearInterval(this.timer)
            if (this.isEdit)
                this.model.set("partitions", this.partitionsCopy)
            this.options.cancelCallback&&this.options.cancelCallback();
        },

        initBussnessDropList: function(){
            var releaseModes = [
                {name: "多个分块为一个文件下发", value: 2},
                {name: "一个分块为一个文件下发", value: 1}
            ]
            Utility.initDropMenu(this.$el.find(".file-content"), releaseModes, function(value){
                this.args.releaseModel = parseInt(value)
            }.bind(this));
            if (this.isEdit){
                var aReleaseModel= _.find(releaseModes, function(object){
                    return parseInt(object.value) === parseInt(this.args.releaseModel);
                }.bind(this));
                this.$el.find(".file-content .cur-value").html(aReleaseModel.name);
                this.$el.find(".file-content .dropdown-toggle").attr("disabled", "disabled")
            }

            rootNode = this.$el.find(".dropdown-bustype");
            Utility.initDropMenu(rootNode, this.busTypeArray, function(value){
                this.args.bisTypeId = parseInt(value)
                this.collection.getNodeGroupList({bisTypeId: this.args.bisTypeId})
            }.bind(this));

            if (!this.isEdit){
                this.args.bisTypeId = this.busTypeArray[0].value;
                this.$el.find(".dropdown-bustype .cur-value").html(this.busTypeArray[0].name)
            } else {
                this.$el.find("#input-name").attr("readonly", true);
                this.$el.find(".fileContentType").remove();
                var defaultValue = _.find(this.busTypeArray, function(object){
                    return object.value === this.model.get("bisTypeId")
                }.bind(this));
                this.$el.find(".dropdown-bustype .cur-value").html(defaultValue.name);
                this.$el.find(".dropdown-bustype .dropdown-toggle").attr("disabled", "disabled")
            }
            this.collection.getNodeGroupList({bisTypeId: this.args.bisTypeId})
            this.collection.getFileTypeList()
        },

        initNodeGroupDropList: function(res){
            if (res.nodeGroupList.length === 0){
                this.args.nodeGroupId = "";
                this.$el.find(".dropdown-node-group .cur-value").html("你还没有添加此业务类型的节点组");
                this.$el.find(".dropdown-node-group .dropdown-menu").html("");
                return;
            }

            var tempNgList = [];
            _.each(res.nodeGroupList, function(el, index, list){
                tempNgList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-node-group"), tempNgList, function(value){
                this.args.nodeGroupId = parseInt(value);
            }.bind(this));

            if (this.isEdit){
                var defaultValue = _.find(tempNgList, function(object){
                    return object.value === this.model.get("nodeGroupId")
                }.bind(this));
                this.$el.find(".dropdown-node-group .cur-value").html(defaultValue.name);
                this.$el.find(".dropdown-node-group .dropdown-toggle").attr("disabled", "disabled")
            } else {
                this.$el.find(".dropdown-node-group .cur-value").html(tempNgList[0].name)
                this.args.nodeGroupId = tempNgList[0].value;
                this.$el.find(".edit-name").hide();
            }
        },

        initFileTypeDropList: function(res){
            var tempNgList = [];
            _.each(res, function(el, index, list){
                tempNgList.push({name: el.name, value:el.id})
            });
            Utility.initDropMenu(this.$el.find(".dropdown-filetype"), tempNgList, function(value){
                this.args.fileTypeId = parseInt(value);
            }.bind(this));

            if (this.isEdit){
                var defaultValue = _.find(tempNgList, function(object){
                    return object.value === this.model.get("fileTypeId")
                }.bind(this));
                this.$el.find(".dropdown-filetype .cur-value").html(defaultValue.name);
                this.$el.find(".dropdown-filetype .dropdown-toggle").attr("disabled", "disabled")
            } else {
                this.$el.find(".dropdown-filetype .cur-value").html(tempNgList[0].name)
                this.args.fileTypeId = tempNgList[0].value;
            }
        },

        onClickOK: function(){
            var args = this.getArgs();
            if (!args) return;
            this.options.okCallback&&this.options.okCallback(args);
        },

        getArgs: function(){
            var fileName = this.$el.find("#input-name").val();
            if (!fileName || fileName == "/"){
                alert("文件名称填错了")
                return;
            } 
            var re = /^\/[^\/]{0,}([a-z0-9\_\-\.]|\/[^\/]){0,}[^\/]{0,}$/;
            if (this.args.releaseModel === 1)
                re = /^\/[^\/]{0,}([a-z0-9\_\-\.]|\/[^\/]){0,}\/$/;
            result = re.test(fileName)
            if (!result) {
                alert("文件名称填错了")
                return;
            }
            var args = {
                "fileName" : fileName,
                "content"  : this.$el.find("#textarea-content").val(),
                "remark"   : this.$el.find("#textarea-comment").val(),
            }
            if (this.isEdit){
                args.confFileId = this.args.confFileId;
                args. partitions = this.args.partitions
            } else {
                args.fileTypeId = this.args.fileTypeId;
                args.bisTypeId = this.args.bisTypeId;
                args.nodeGroupId = this.args.nodeGroupId;
                args.partition = this.args.partition;
                args.partitions = this.args.partitions;
                args.releaseModel = this.args.releaseModel;
            }
            if (this.timer) clearInterval(this.timer)
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

            this.collection.off("get.historylist.success");
            this.collection.off("get.historylist.error");

            this.collection.on("get.historylist.success", $.proxy(this.onSetupHistoryListSuccess, this));
            this.collection.on("get.historylist.error", $.proxy(this.onGetError, this));

            this.args = {
                confFileId: this.model.get("id")
            };

            this.collection.getHisroryFileList(this.args)

            this.$el.find(".back").on("click", $.proxy(this.onClickCancel, this))
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
            this.table = $(_.template(template['tpl/liveAllSetup/liveAllSetup.table.html'])({
                data: this.historyList, 
                dataTpye: 3, 
                currentHisId: this.model.get("confFileHisId")
            }));
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
                id = $(eventTarget).attr("histroy-id");
            var model = _.find(this.historyList, function(object){
                return parseInt(id) === object.attributes.confFileHisId
            }.bind(this));

            model.set("nodeGroupName", this.model.get("nodeGroupName"))

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

        onConfirmUsed: function(event){
            var eventTarget = event.srcElement || event.target, historyId;
            historyId = $(eventTarget).attr("histroy-id");
            var usedModel = _.find(this.historyList, function(object){
                return parseInt(historyId) === object.get("confFileHisId")
            }.bind(this));
            usedModel.attributes.isChecked = this.model.attributes.isChecked;
            this.options.selectedCallback&&this.options.selectedCallback(usedModel, this.model);
            this.options.cancelCallback&&this.options.cancelCallback();
        },


        onClickItemUsed: function(event){
            if (this.confirmUsedPopup) $("#" + this.confirmUsedPopup.modalId).remove();
            var opt = {
                message: "如果确认使用该配置，这个配置将会覆盖这个版本以上的所有配置。此项功能一般用于回滚操作，请再次确认，谨慎使用。你确定要这么做吗？",
                type: "alert-danger"
            }
            var options = {
                title:"提示",
                body : _.template(template['tpl/alert.message.html'])({data: opt}),
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    this.onConfirmUsed(event);
                    this.confirmUsedPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.confirmUsedPopup = new Modal(options);
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    var SelectDeviceView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options    = options;
            this.collection = options.collection
            this.$el = $(_.template(template['tpl/liveAllSetup/liveAllSetup.confirm.selectDevice.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.$el.find(".checkAll").on("click", $.proxy(this.onClickCheckAll, this));
            this.$el.find(".cancelAll").on("click", $.proxy(this.onClickCancelCheckAll, this));
            this.$el.find("#node-list-filter").on("keyup", $.proxy(this.onKeyupSearch, this));
            // this.collection.off("get.allDevice.success");
            // this.collection.off("get.allDevice.error");
            // this.collection.on("get.allDevice.success", $.proxy(this.onGetAllDeviceSuccess, this));
            // this.collection.on("get.allDevice.error", $.proxy(this.onGetError, this));
            this.initTree();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        initTree: function(){
            var setting = {
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: function(){
                        this.getSelected();
                    }.bind(this)
                }
            };

            var zNodes =[
                { id:1, pId:0, name:"随意勾选 1", open:true, checked:true},
                { id:11, pId:1, name:"随意勾选 1-1", checked:true, highlight: true},
                { id:12, pId:1, name:"随意勾选 1-2", checked:true},
                { id:2, pId:0, name:"随意勾选 2", open:true},
                { id:21, pId:2, name:"随意勾选 2-1"},
                { id:22, pId:2, name:"随意勾选 2-2"},
                { id:23, pId:2, name:"随意勾选 2-3"}
            ];

            this.treeObj = $.fn.zTree.init(this.$el.find(".node-device-ctn #tree"), setting, zNodes);
            this.getSelected();
        },

        onKeyupSearch: function(event){
            if (!this.treeObj) return;
            var keyWord = this.$el.find("#node-list-filter").val(),
                notMatchFilter = function(node){
                    return node.name.indexOf(keyWord) === -1;
                },
                notMatchNodes = this.treeObj.getNodesByFilter(notMatchFilter),
                matchFilter = function(node){
                    return node.name.indexOf(keyWord) > -1;
                },
                matchNodes = this.treeObj.getNodesByFilter(matchFilter);
            this.treeObj.hideNodes(notMatchNodes);
            this.treeObj.showNodes(matchNodes);

            _.each(matchNodes, function(el, index, ls){
                var parentNode = el.getParentNode();
                if (parentNode&&parentNode.isHidden) this.treeObj.showNode(parentNode)
            }.bind(this))
        },

        onClickCheckAll: function(event){
            if (!this.treeObj) return;
            this.treeObj.checkAllNodes(true);
            this.getSelected();
        },

        onClickCancelCheckAll: function(event){
            if (!this.treeObj) return;
            this.treeObj.checkAllNodes(false);
            this.getSelected();
        },

        getSelected: function(){
            if (!this.treeObj) return;
            var matchFilter = function(node){
                return node.checked === true && node.pId === null;
            };
            this.matchNodes = this.treeObj.getNodesByFilter(matchFilter);
            this.$el.find(".node-num").html(this.matchNodes.length);
            var matchDeviceFilter = function(node){
                return node.checked === true && node.pId !== null;
            };
            this.matchDeviceNodes = this.treeObj.getNodesByFilter(matchDeviceFilter);
            this.$el.find(".device-num").html(this.matchDeviceNodes.length);
        },

        getArgs: function(){
            var selectedObj = {
                nodes: this.matchNodes,
                devices: this.matchDeviceNodes
            }
            return selectedObj
        },

        onGetAllDeviceSuccess: function(res){
            // this.historyList = [];
            // for (var i = 0; i < res.length; i++){
            //     this.historyList.push(new this.collection.model(res[i]))
            // }
            // this.initTable();
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
            this.nodeGroupList  = options.nodeGroupList;
            this.buisnessType   = options.buisnessType;
            this.$el = $(_.template(template['tpl/liveAllSetup/liveAllSetup.confirm.html'])({data: options.nodeGroupList}));
            this.initTable();

            this.$el.find(".ok-again").on("click", $.proxy(this.onClickOK, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancel, this));
            this.$el.find("#isShellCmd").on("click", $.proxy(this.onClickShellCmdInput, this))

            this.collection.off("get.confirmAdd.success");
            this.collection.off("get.confirmAdd.error");
            this.collection.on("get.confirmAdd.success", function(){
                alert("操作成功！")
                this.onClickCancel();
            }.bind(this));
            this.collection.on("get.confirmAdd.error", $.proxy(this.onGetError, this));

            this.collection.off("get.ip.success");
            this.collection.off("get.ip.error");
            this.collection.on("get.ip.success", $.proxy(this.onGetIpGroupSuccess, this));
            this.collection.on("get.ip.error", $.proxy(this.onGetError, this));
            // this.collection.off("get.fileGroup.success");
            // this.collection.off("get.fileGroup.error");
            // this.collection.on("get.fileGroup.success", $.proxy(this.onGetFileGroupSuccess, this));
            // this.collection.on("get.fileGroup.error", $.proxy(this.onGetError, this));
            //this.collection.getFileGroupList();
        },

        onClickShellCmdInput: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;

            if (eventTarget.checked)
                this.$el.find("#textarea-content").slideDown(200);
            else
                this.$el.find("#textarea-content").slideUp(200)
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onClickSelectDevice: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id").split("-")[1],
                nodeCtn = this.$el.find("#panel-" + id + " .node-ctn"),
                currentNodeDevice = _.find(this.nodeDeviceArray, function(obj){
                    return obj.id === parseInt(id)
                }.bind(this));

            if (this.addDevicePopup) $("#" + this.addDevicePopup.modalId).remove();

            var addDeviceView = new SelectDeviceView({
                collection: this.collection,
                currentNodeDevice: currentNodeDevice
            });
            var options = {
                title:"添加节点设备",
                body : addDeviceView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var resultObj = addDeviceView.getArgs();
                    if (!resultObj) return;
                    currentNodeDevice.nodes = resultObj.nodes;
                    currentNodeDevice.devices = resultObj.devices;
                    nodeCtn.find("li").remove();
                    _.each(currentNodeDevice.nodes, function(el, index, ls){
                        var aNode = $('<li class="node-item"><span class="label label-primary">'+ el.name + '</span></li>');
                        aNode.appendTo(nodeCtn)
                    }.bind(this))
                    this.addDevicePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addDevicePopup = new Modal(options);
        },

        onClickCancel: function(){
            this.options.cancelCallback&&this.options.cancelCallback();
        },

        onClickOK: function(){
            var result = confirm("你确定要这么做吗？") 
            if (!result) return;

            // for (var k = 0; k < this.nodeGroupList.length; k ++){
            //     var ipString = this.$el.find("#ip-" + this.nodeGroupList[k].id).val()
            //     if (ipString.indexOf(",") > -1){
            //         var ipStringArray = ipString.split(",");
            //         for (var i = 0; i < ipStringArray.length; i++){
            //             var res = Utility.isIP(ipStringArray[i].trim())
            //             if (!res) {
            //                 alert(this.nodeGroupList[k].name + "的第" + (i+1) + "个ip没填对！");
            //                 return;
            //             }
            //         }
            //     } else {
            //         var res = Utility.isIP(ipString.trim())
            //         if (!res) {
            //             alert(this.nodeGroupList[k].name + "的ip没填对！")
            //             return;
            //         }
            //     }
            // }

            // for (var i = 0; i < this.nodeDeviceArray.length; k++){
            //     if (!this.nodeDeviceArray[i].nodes || this.nodeDeviceArray[i].nodes.length === 0){
            //         alert(this.nodeDeviceArray[i].name + "还没有选择任何节点和设备")
            //         return;
            //     }
            // }

            var nodeGroupLs = [];
            _.each(this.nodeGroupList, function(obj, key, ls){
                var fileIds = [];
                _.each(this.selectedModels, function(file, key, list){
                    if (obj.id === file.attributes.nodeGroupId)
                        fileIds.push(file.attributes.confFileHisId);
                })
                nodeGroupLs.push({
                    "nodeGroupId": obj.id,
                    "confFileHisIds": fileIds.join(","),
                    "ips": this.$el.find("#ip-" + obj.id).val()
                })
            }.bind(this))

            var options = {
                "nodeGroupList": nodeGroupLs,
                "shellCmd": this.$el.find("#textarea-content").val(),
                "remark"  : this.$el.find("#textarea-comment").val(),
                "bisTypeId": this.buisnessType
            }
            this.collection.confirmAdd(options)
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/liveAllSetup/liveAllSetup.table.html'])({data: this.selectedModels, dataTpye: 2}));
            this.$el.find(".table-ctn").html(this.table[0]);
            this.table.find("tbody .file-name").on("click", $.proxy(this.onClickItemFileName, this));
            this.table.find("input").hide();
            this.table.find(".operator").hide();

            var idArray = []
            _.each(this.nodeGroupList, function(el, key, ls){
                idArray.push(el.id)
            }.bind(this))
            this.collection.getIpGroupList(idArray);

            this.nodeDeviceArray = [];
            _.each(this.nodeGroupList, function(el, key, ls){
                this.nodeDeviceArray.push({id: el.id, name: el.name})
            }.bind(this))

            this.$el.find(".edit-name").on("click", $.proxy(this.onClickSelectDevice, this))
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

            _.each(this.ipList, function(nodeGroupIps, key, ls){
                var ipArray = []
                _.each(nodeGroupIps, function(ipObj, upKey, list){
                    ipArray.push(ipObj.ip);
                }.bind(this))
                this.$el.find("#ip-" + key).val(ipArray.join(","))
            }.bind(this))
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
            this.$el.find(".ok").attr("disabled", "disabled");

            this.collection.on("get.filelist.success", $.proxy(this.onSetupFileListSuccess, this));
            this.collection.on("get.filelist.error", $.proxy(this.onGetError, this));

            this.collection.on("get.buisness.success", $.proxy(this.onGetBusinessTpye, this));
            this.collection.on("get.buisness.error", $.proxy(this.onGetError, this));

            this.collection.on("get.addConf.success", function(){
                this.showMainList(".main-list", ".create-edit-panel", ".create-edit-ctn");
                this.collection.getAllFileList({bisTypeId: this.buisnessType})
            }.bind(this));
            this.collection.on("get.addConf.error", $.proxy(this.onGetError, this));
            
            this.collection.on("get.modifyConf.success", function(){
                this.showMainList(".main-list", ".create-edit-panel", ".create-edit-ctn");
                this.collection.getAllFileList({bisTypeId: this.buisnessType})
            }.bind(this));
            this.collection.on("get.modifyConf.error", $.proxy(this.onGetError, this));

            this.collection.getBusinessType();

            this.$el.find(".ok").on("click", $.proxy(this.onClickConfirm, this))
            this.$el.find(".create").on("click", $.proxy(this.onClickCreate, this))
        },

        onGetBusinessTpye: function(res){
            var typeArray = [];
            _.each(res, function(el, key, list){
                typeArray.push({name: el.name, value: el.id})
            }.bind(this))
            this.busTypeArray = typeArray;
            rootNode = this.$el.find(".dropdown-bustype");
            Utility.initDropMenu(rootNode, typeArray, function(value){
                this.buisnessType = parseInt(value)
                this.collection.getAllFileList({bisTypeId: this.buisnessType})
            }.bind(this));

            this.buisnessType = res[0].id;
            this.$el.find(".dropdown-bustype .cur-value").html(res[0].name)
            this.collection.getAllFileList({bisTypeId: this.buisnessType})
        },

        onClickCreate: function(){
            var addFileView = new AddOrEditFlieView({
                collection: this.collection, 
                isEdit    : false,
                busTypeArray: this.busTypeArray,
                cancelCallback: function(){
                    this.showMainList(".main-list", ".create-edit-panel", ".create-edit-ctn");
                }.bind(this),
                okCallback:  function(options){
                    this.collection.addConf(options);
                }.bind(this)
            });
            addFileView.render(this.$el.find(".create-edit-panel"));

            this.hideMainList(".main-list", ".create-edit-panel")
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

        onClickConfirm: function(){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })

            var nodeGroupList = [], temp;
            _.each(checkedList, function(el, key, ls){
                if (el.get("nodeGroupId") !== temp){
                    nodeGroupList.push({id: el.get("nodeGroupId"), name:el.get("nodeGroupName")})
                    temp = el.get("nodeGroupId");
                }
            }.bind(this))

            var options = {
                collection    : this.collection,
                selectedModels: checkedList,
                nodeGroupList : nodeGroupList,
                buisnessType  : this.buisnessType,
                cancelCallback: $.proxy(this.onClickConfirmCancel, this) 
            };
            var confirmView = new ConfirmView(options);
            confirmView.render(this.$el.find(".confirm"));

            this.hideMainList(".main-list", ".confirm")
        },

        onClickConfirmCancel: function(){
            this.collection.getAllFileList({bisTypeId: this.buisnessType})
            this.showMainList(".main-list", ".confirm", ".confirm-ctn")
        },

        onBackHistoryCallback: function(){
            this.showMainList(".main-list", ".history-panel", ".history-ctn")
        },

        selectedModelsCallback: function(usedModel, originModel){
            var model = this.collection.get(originModel.get("id"))
            _.each(usedModel.attributes, function(el, key, ls){
                if (key === "version")
                    model.set("currVersion", el)
                else
                    model.set(key, el)
            })
            _.each(this.collection.models, function(el, index, ls){
                el.set("isChecked", false);
            })
            setTimeout(function(){
                this.collection.trigger("get.filelist.success")
            }.bind(this), 500)
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onSetupFileListSuccess: function(){
            this.$el.find(".ok").attr("disabled", "disabled");
            this.initTable();
        },

        initTable: function(){
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

            this.hideMainList(".main-list", ".history-panel")
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

            this.collection.off("lock.file.success");
            this.collection.off("lock.file.error");

            this.collection.on("lock.file.success", function(res){
                var addFileView = new AddOrEditFlieView({
                    collection: this.collection,
                    model     : model, 
                    isEdit    : true,
                    lockTime  : res.lockTime,
                    busTypeArray: this.busTypeArray,
                    cancelCallback: function(){
                        this.collection.cancelLockFile({confFileId: model.get("confFileId")})
                        this.showMainList(".main-list", ".create-edit-panel", ".create-edit-ctn");
                    }.bind(this),
                    okCallback:  function(options){
                        this.collection.modifyConfFile(options);
                    }.bind(this)
                });
                addFileView.render(this.$el.find(".create-edit-panel"));

                this.hideMainList(".main-list", ".create-edit-panel")
            }.bind(this));
            this.collection.on("lock.file.error", function(){
                var error = {message: "此文件已经被锁定，无法编辑！"}
                this.onGetError(error)
            }.bind(this));

            this.collection.lockFile({confFileId: model.get("confFileId")});
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
            var nodeGroupId = $(eventTarget).attr("id"),
                modelList = _.filter(this.collection.models, function(object){
                    return object.get("nodeGroupId") === parseInt(nodeGroupId);
                }.bind(this));
            _.each(modelList, function(el, key, list){
                el.set("isChecked", eventTarget.checked)
            }.bind(this))

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