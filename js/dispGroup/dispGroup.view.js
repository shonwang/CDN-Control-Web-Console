define("dispGroup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DispGroupDetailView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $('<div class="table-ctn table-responsive"></div>');
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.off("get.dispGroup.node.success");
            this.collection.off("get.dispGroup.node.error");
            this.collection.on("get.dispGroup.node.success", $.proxy(this.onGetNodeSuccess, this));
            this.collection.on("get.dispGroup.node.error", $.proxy(this.onGetError, this));
            this.collection.getNodeByGroup({groupId: this.model.get("id"), associated: 1})
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetNodeSuccess: function(res){
            this.nodeList = res;
            _.each(this.nodeList, function(el, index, list){
                if (el.status === 3) el.statusName =  '<span class="label label-danger">已关闭</span>'
                if (el.status === 2) el.statusName =  '<span class="label label-warning">挂起</span>'
                if (el.status === 1) el.statusName =  '<span class="label label-success">运行中</span>'

                if (el.type === 3) el.typeName =  'lvs&cache'
                if (el.type === 2) el.typeName =  'cache'
                if (el.type === 1) el.typeName =  'lvs'
            }.bind(this))
            this.table = $(_.template(template['tpl/dispGroup/dispGroup.detail.table.html'])({data: this.nodeList}));
            if (res.length !== 0)
                this.$el.html(this.table[0]);
            else
                this.$el.html(_.template(template['tpl/empty.html'])());
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var CopyDispGroupView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/dispGroup/dispGroup.copy.html'])({data: this.model}));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        getArgs: function(){
            var options = {
                "copyGroupId": this.model.get("id"),
                "name"       : this.$el.find("#input-new-name").val(),
                "remark"     : this.$el.find("#textarea-comment").val()
               }
            return options
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var VersionInfoView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/dispGroup/dispGroup.channel.html'])({}));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            // this.collection.off("get.node.success");
            // this.collection.off("get.node.error");
            // this.collection.on("get.node.success", $.proxy(this.onGetNodeSuccess, this));
            // this.collection.on("get.node.error", $.proxy(this.onGetError, this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetNodeSuccess: function(res){
            this.nodeList = res.rows;
            _.each(this.nodeList, function(el, index, list){
                el.isChecked = false;
            }.bind(this))
            this.table = $(_.template(template['tpl/dispGroup/dispGroup.node.table.html'])({data: this.nodeList}));
            if (res.rows.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var selectedObj = _.find(this.nodeList, function(object){
                return object.id === parseInt(id)
            }.bind(this));

            selectedObj.isChecked = eventTarget.checked

            var checkedList = this.nodeList.filter(function(object) {
                return object.isChecked === true;
            })
            if (checkedList.length === this.nodeList.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.nodeList.length)
                this.table.find("thead input").get(0).checked = false;
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            _.each(this.nodeList, function(el, index, list){
                el.isChecked = eventTarget.checked
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
        },

        getArgs: function(){
            return false
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var ChannelInfoView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/dispGroup/dispGroup.channel.html'])({}));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.collection.off("get.channelByDisp.success");
            this.collection.off("get.channelByDisp.error");
            this.collection.on("get.channelByDisp.success", $.proxy(this.onGetChannelSuccess, this));
            this.collection.on("get.channelByDisp.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            this.initNodeDropMenu();

            this.backUpChannelList = [];

            this.queryArgs = {
                "disgId"      : this.model.get("id"),
                "domain"      : null,
                "clientName"  : null,
                "page"        : 1,
                "count"       : 5
             }

            this.collection.getChannelByDisp(this.queryArgs);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.domain = this.$el.find("#input-domain").val() || null;
            this.queryArgs.clientName = this.$el.find("#input-client").val() || null;
            this.collection.getChannelByDisp(this.queryArgs);
        },

        enterKeyBindQuery: function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.total)
            if (this.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.total/this.queryArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 5,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.count;
                        this.collection.getChannelByDisp(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initNodeDropMenu: function(){
            var pageNum = [
                {name: "5条", value: 5},
                {name: "10条", value: 10},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.count = value;
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));
        },

        onGetChannelSuccess: function(res){
            this.channelList = res.rows || [];
            this.total = res.total;
            var count = 0; this.isCheckedAll = false;
            _.each(this.channelList, function(el, index, list){
                if (el.associated === 0) el.isChecked = false;
                if (el.associated === 1) el.isChecked = true;

                var aChannel = _.find(this.backUpChannelList, function(obj){
                    return el.id === obj.id
                })
                if (aChannel)
                    el.isChecked = aChannel.isChecked;
                else
                    this.backUpChannelList.push(el)

                if (el.status === 0) el.statusName = '<span class="label label-danger">已停止</span>';
                if (el.status === 1) el.statusName = '<span class="label label-success">服务中</span>';
            }.bind(this))
            _.each(this.channelList, function(el, index, list){
                if (el.isChecked) count = count + 1
            }.bind(this))

            if (count === this.channelList.length) this.isCheckedAll = true;
            this.initTable();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/dispGroup/dispGroup.channel.table.html'])({
                data: this.channelList, 
                isCheckedAll: this.isCheckedAll,
                type: 0//显示checkbox
            }));
            if (this.channelList.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data:{message: "赵宪亮在胸前仔细摸索了一番，但是却没有找到数据！"}
                    }));

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));

            if (!this.isInitPaginator) this.initPaginator();
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var selectedObj = _.find(this.channelList, function(object){
                return object.id === parseInt(id)
            }.bind(this));

            selectedObj.isChecked = eventTarget.checked

            var aChannel = _.find(this.backUpChannelList, function(obj){
                return selectedObj.id === obj.id
            })
            if (aChannel) aChannel.isChecked = selectedObj.isChecked;

            var checkedList = this.channelList.filter(function(object) {
                return object.isChecked === true;
            })
            if (checkedList.length === this.channelList.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.channelList.length)
                this.table.find("thead input").get(0).checked = false;
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            _.each(this.channelList, function(el, index, list){
                el.isChecked = eventTarget.checked;
                var aChannel = _.find(this.backUpChannelList, function(obj){
                    return el.id === obj.id
                })
                if (aChannel) aChannel.isChecked = el.isChecked;
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
        },

        getArgs: function(){
            var checkedList = this.backUpChannelList.filter(function(object) {
                return object.isChecked === true;
            })
            var channelIds = [];
            _.each(checkedList, function(el, index, list){
                channelIds.push(el.id)
            }.bind(this))
            var options =  {
                "dispGroupId": this.model.get("id"),
                "channelIds" : channelIds
            }
            return options
        },

        render: function(target) {
            this.$el.appendTo(target);
            this.enterKeyBindQuery();
        }
    });

    var AddOrEditDispGroupView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit     = options.isEdit;
            this.isCopy     = options.isCopy;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/dispGroup/dispGroup.add&edit.html'])({}));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            if (this.isEdit){
                this.collection.off("get.dispGroup.node.success");
                this.collection.off("get.dispGroup.node.error");
                this.collection.on("get.dispGroup.node.success", $.proxy(this.onGetNodeSuccess, this));
                this.collection.on("get.dispGroup.node.error", $.proxy(this.onGetError, this));
                this.$el.find("#input-name").val(this.model.attributes.dispDomain);
                this.$el.find("#input-ttl").val(this.model.attributes.ttl);
                this.$el.find("#textarea-comment").val(this.model.attributes.remark);
                this.crossLevel = this.model.attributes.crossLevel;
                if (this.model.attributes.priority == "1"){
                    this.$el.find(".setup #inlineCheckbox1").get(0).checked = true;
                    this.$el.find(".setup #inlineCheckbox2").get(0).checked = false;
                }
                if (this.model.attributes.priority == "2"){
                    this.$el.find(".setup #inlineCheckbox1").get(0).checked = false;
                    this.$el.find(".setup #inlineCheckbox2").get(0).checked = true;
                }
                if (this.model.attributes.priority == "3"){
                    this.$el.find(".setup #inlineCheckbox1").get(0).checked = true;
                    this.$el.find(".setup #inlineCheckbox2").get(0).checked = true;
                }
                if (!this.isCopy)
                    this.$el.find("#input-name").attr("readonly", true);
            } else {
                this.collection.off("get.node.success");
                this.collection.off("get.node.error");
                this.collection.on("get.node.success", $.proxy(this.onGetNodeSuccess, this));
                this.collection.on("get.node.error", $.proxy(this.onGetError, this));
                this.crossLevel = 0;
            }
            this.collection.off("ip.type.success");
            this.collection.off("ip.type.error");
            this.collection.on("ip.type.success", $.proxy(this.onGetIpTypeSuccess, this));
            this.collection.on("ip.type.error", $.proxy(this.onGetError, this));

            this.collection.ipTypeList();
            this.initDropmenu();
        },

        onKeyupNodeListFilter: function() {
            if (!this.nodeList || this.nodeList.length === 0) return;
            var keyWord = this.$el.find("#node-list-filter").val();
            _.each(this.nodeList, function(el, index, ls) {
                if (keyWord === ""){
                    el.isDisplay = true;
                } else {
                    if (el.chName.indexOf(keyWord) > -1 || el.name.indexOf(keyWord) > -1)
                        el.isDisplay = true;
                    else
                        el.isDisplay = false;
                }
            });
            this.initNodeTable();
            if (keyWord === "")
                this.table.find("#inlineCheckbox5").show();
            else
                this.table.find("#inlineCheckbox5").hide();
        },

        onGetIpTypeSuccess: function(data){
            this.ipTypeList = data;
            var typeIpArray = [];
            _.each(this.ipTypeList, function(el, key, ls){
                typeIpArray.push({name: el.name, value: el.id})
            })
            Utility.initDropMenu(this.$el.find(".ip-type"), typeIpArray, function(value){
                this.ipType = parseInt(value);
            }.bind(this));
            if (!this.isEdit){
                this.ipType = data[0].id;
                this.$el.find(".ip-type .cur-value").html(data[0].name)
            } else {
                var aIpTypeArray = _.filter(this.ipTypeList ,function(obj) {
                    return obj["id"] === this.model.get("resolveIpType");
                }.bind(this))
                if (aIpTypeArray[0]){
                    this.$el.find(".ip-type .cur-value").html(aIpTypeArray[0].name)
                    this.ipType = this.model.get("resolveIpType")
                }
                this.$el.find(".ip-type #dropdown-ip-type").attr("disabled", "disabled")
            }
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        initDropmenu: function(){
            var typeArray = [
                {name: "L0", value: 0},
                {name: "L1", value: 1},
                {name: "L2", value: 2},
                {name: "L3", value: 3},
                {name: "L4", value: 4}
            ]
            Utility.initDropMenu(this.$el.find(".dropdown-level"), typeArray, function(value){
                this.crossLevel = parseInt(value);
            }.bind(this));
            

            if (this.isEdit){ 
                var defaultValue = _.find(typeArray, function(object){
                    return object.value === this.model.attributes.crossLevel
                }.bind(this));

                this.$el.find(".dropdown-level .cur-value").html(defaultValue.name);

                this.collection.getNodeByGroup({groupId: this.model.get("id")})
            } else {
                this.collection.getNodeList();
            }
        },

        onGetNodeSuccess: function(res){
            if (!this.isEdit)
                this.nodeList = res.rows;
            else
                this.nodeList = res;
            this.selectedCount = 0;
            this.isCheckedAll = false;

            _.each(this.nodeList, function(el, index, list){
                if (el.associated === 0) el.isChecked = false;
                if (el.associated === 1) {
                    el.isChecked = true;
                    this.selectedCount = this.selectedCount + 1;
                }
                el.isDisplay = true;
            }.bind(this))
            if (this.selectedCount === this.nodeList.length) this.isCheckedAll = true;
            this.initNodeTable();
            this.$el.find("#node-list-filter").on("keyup", $.proxy(this.onKeyupNodeListFilter, this));
        },

        initNodeTable: function() {
            this.table = $(_.template(template['tpl/dispGroup/dispGroup.node.table.html'])({data: this.nodeList, isCheckedAll: this.isCheckedAll}));
            if (this.nodeList.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            if (!this.isCopy) {
                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            } else {
                this.table.find("tbody tr").find("input").prop("disabled", true);
                this.table.find("thead input").prop("disabled", true);
            }
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var selectedObj = _.find(this.nodeList, function(object){
                return object.id === parseInt(id)
            }.bind(this));

            selectedObj.isChecked = eventTarget.checked;

            var checkedList = this.nodeList.filter(function(object) {
                return object.isChecked === true;
            })
            if (checkedList.length === this.nodeList.length){
                this.table.find("thead input").get(0).checked = true;
                this.isCheckedAll = true;
            }
            if (checkedList.length !== this.nodeList.length){
                this.table.find("thead input").get(0).checked = false;
                this.isCheckedAll = false;
            }
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            _.each(this.nodeList, function(el, index, list){
                el.isChecked = eventTarget.checked
            }.bind(this))
            this.isCheckedAll = eventTarget.checked;
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
        },

        getPromptArgs: function(){
            var prompt = {
                "id": this.model ? this.model.get("id") : 0
            }
            var checkedList = this.nodeList.filter(function(object) {
                return object.isChecked === true;
            })
            var nodeIds = [];
            _.each(checkedList, function(el, index, list){
                nodeIds.push(el.id)
            })
            prompt.nodeIdList = nodeIds.join(",");

            return prompt;
        },

        getArgs: function(){
            var options = {
                "id"           : this.model ? this.model.get("id") : 0,
                "dispDomain"   : this.$el.find("#input-name").val(),
                "crossLevel"   : this.crossLevel,
                "ttl"          : this.$el.find("#input-ttl").val(),
                "remark"       : this.$el.find("#textarea-comment").val(),
                "resolveIpType": this.ipType,
            };
            var ttl = this.$el.find("#input-ttl").val(), re = /^\d+$/;
            if (!re.test(ttl)){
                alert("TTL只能填入数字！");
                return false;
            }
            if (parseInt(ttl) >= 3600 || parseInt(ttl) <= 60){
                alert("60 < TTL < 3600");
                return false; 
            }
            var setupNodes = this.$el.find(".setup input:checked");
            if (setupNodes.length === 0){
                alert("配置至少选择一项！")
                return false;
            }
            if (setupNodes.length === 1&&setupNodes.get(0).id === "inlineCheckbox1"){
                options.priority = "1";
            }
            if (setupNodes.length === 1&&setupNodes.get(0).id === "inlineCheckbox2"){
                options.priority = "2";
            }
            if (setupNodes.length === 2){
                options.priority = "1,2";
            }
            var checkedList = this.nodeList.filter(function(object) {
                return object.isChecked === true;
            })
            var nodeIds = [];
            _.each(checkedList, function(el, index, list){
                nodeIds.push(el.id)
            })
            options.nodeIdList = nodeIds.join(",");
            return options
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var PromptInfoView = Backbone.View.extend({
        initialize: function(options){
            this.collection = options.collection;
            this.model      = options.model;
            this.data = options.data;

            this.$el = $(_.template(template['tpl/ipManage/ipManage.start&pause.html'])({data:this.data}));
            this.$el.find('.table-place').html(_.template(template['tpl/ipManage/ipManage.start&pause.table.html'])({data:this.data}));
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var DispGroupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/dispGroup/dispGroup.html'])());

            this.initDispGroupDropMenu();

            this.collection.on("get.dispGroup.success", $.proxy(this.onDispGroupListSuccess, this));
            this.collection.on("get.dispGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("add.dispGroup.success", function(){
                alert("添加成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.dispGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("update.dispGroup.success", function(){
                alert("编辑成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.dispGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("delete.dispGroup.success", function(){
                alert("删除成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("delete.dispGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("copy.dispGroup.success", function(){
                alert("复制成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("copy.dispGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("update.dispGroup.status.success", function(){
                alert("操作成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("update.dispGroup.status.error", $.proxy(this.onGetError, this));

            this.collection.on("add.dispGroup.channel.success", function(){
                alert("操作成功！")
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.dispGroup.channel.error", $.proxy(this.onGetError, this));

            this.collection.off("get.InfoPrompt.success");
            this.collection.off("get.InfoPrompt.error");
            this.collection.on("get.InfoPrompt.success", $.proxy(this.onGetInfoPromptSuccess, this));
            this.collection.on("get.InfoPrompt.error", $.proxy(this.onGetError, this));

            if (AUTH_OBJ.CreateGslbGroup)
                this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
            else
                this.$el.find(".opt-ctn .create").remove();

            if (AUTH_OBJ.QueryGslbGroup){
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                this.enterKeyBindQuery();
            } else {
                this.$el.find(".opt-ctn .query").remove();
            }

            this.queryArgs = {
                "name"  : null,//调度组名称
                "status": null,//调度组状态
                "level" : null,//覆盖级别
                "page"  :1,
                "count" :10
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

        onDispGroupListSuccess: function(){
            this.collection.off("ip.type.success");
            this.collection.off("ip.type.error");
            this.collection.on("ip.type.success", $.proxy(this.onGetIpTypeSuccess, this));
            this.collection.on("ip.type.error", $.proxy(this.onGetError, this));
            this.collection.ipTypeList();
        },

        onGetIpTypeSuccess: function(data){
            _.each(this.collection.models, function(el, inx, list){
                var ipObj = _.find(data, function(obj){
                    return obj.id === el.get("resolveIpType")
                }.bind(this))
                el.set("resolveIpTypeName", ipObj.name)
            }.bind(this))

            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.queryArgs.name = this.$el.find("#input-domain").val() || null
            this.collection.getDispGroupList(this.queryArgs);
        },

        onClickCreate: function(){
            if (this.addDispGroupPopup) $("#" + this.addDispGroupPopup.modalId).remove();

            var addDispGroupView = new AddOrEditDispGroupView({collection: this.collection});
            var options = {
                title:"新建调度组",
                body : addDispGroupView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = addDispGroupView.getArgs();
                    if (!options) return;
                    this.collection.addDispGroup(options)
                    this.addDispGroupPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    if (AUTH_OBJ.QueryGslbGroup) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.addDispGroupPopup = new Modal(options);
            if (!AUTH_OBJ.ApplyCreateGslbGroup)
                 this.addDispGroupPopup.$el.find(".btn-primary").remove();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/dispGroup/dispGroup.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .channel").on("click", $.proxy(this.onClickItemChannel, this));
            this.table.find("tbody .version").on("click", $.proxy(this.onClickItemVersion, this));
            this.table.find("tbody .copy").on("click", $.proxy(this.onClickItemCopy, this));
            this.table.find("tbody .disp-domain").on("click", $.proxy(this.onClickItemDetail, this));

            this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
            this.table.find("tbody .stop").on("click", $.proxy(this.onClickItemStop, this));
            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.table.find("tbody .remark").tooltip({
                animation  : false,
                "placement": "top", 
                "html"     : true,
                "title"  : function(){return $(this).attr("remark")}, 
                "trigger"  : "hover"
            })
        },

        onClickItemDetail: function(event){
            var eventTarget = event.srcElement || event.target, id;
            id = $(eventTarget).attr("id");

            var model = this.collection.get(id);

            if (this.dgDetailPopup) $("#" + this.dgDetailPopup.modalId).remove();

            var dgDetailView = new DispGroupDetailView({
                collection: this.collection, 
                model     : model
            });
            var options = {
                title: "调度组详情: " + model.get("dispDomain"),
                body : dgDetailView,
                backdrop : 'static',
                type     : 1,
                height: 500,
                onOKCallback:  function(){},
                onHiddenCallback: function(){
                    if (AUTH_OBJ.QueryGslbGroup) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.dgDetailPopup = new Modal(options);
        },

        // onClickItemCopy: function(event){
        //     var eventTarget = event.srcElement || event.target, id;
        //     if (eventTarget.tagName == "SPAN"){
        //         eventTarget = $(eventTarget).parent();
        //         id = eventTarget.attr("id");
        //     } else {
        //         id = $(eventTarget).attr("id");
        //     }
        //     var model = this.collection.get(id);

        //     if (this.copyDispGroupPopup) $("#" + this.copyDispGroupPopup.modalId).remove();

        //     var cyDispGroupView = new CopyDispGroupView({
        //         collection: this.collection,
        //         model: model
        //     });
        //     var options = {
        //         title:"复制调度组：" + model.get("dispDomain"),
        //         body : cyDispGroupView,
        //         backdrop : 'static',
        //         type     : 2,
        //         onOKCallback:  function(){
        //             var options = cyDispGroupView.getArgs();
        //             if (!options) return;
        //             this.collection.copyDispGroup(options)
        //             this.copyDispGroupPopup.$el.modal("hide");
        //         }.bind(this),
        //         onHiddenCallback: function(){}
        //     }
        //     this.copyDispGroupPopup = new Modal(options);
        // },

        onClickItemCopy: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.copyDispGroupPopup) $("#" + this.copyDispGroupPopup.modalId).remove();

            var copyDispGroupView = new AddOrEditDispGroupView({
                collection: this.collection, 
                model     : model,
                isEdit    : true,
                isCopy    : true
            });
            var options = {
                title:"复制调度组：" + model.get("dispDomain"),
                body : copyDispGroupView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = copyDispGroupView.getArgs();
                    if (!options) return
                    this.collection.copyDispGroup(options);
                    this.copyDispGroupPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    if (AUTH_OBJ.QueryGslbGroup) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.copyDispGroupPopup = new Modal(options);
            if (!AUTH_OBJ.ApplyCopyGslbGroup)
                 this.copyDispGroupPopup.$el.find(".btn-primary").remove();
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

            this.clickInfo = model;

            if (this.editDispGroupPopup) $("#" + this.editDispGroupPopup.modalId).remove();

            var editDispGroupView = new AddOrEditDispGroupView({
                collection: this.collection, 
                model     : model,
                isEdit    : true
            });
            var options = {
                title:"编辑调度组：" + model.get("dispDomain"),
                body : editDispGroupView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    this.editGroupArgs = editDispGroupView.getArgs();
                    if (!this.editGroupArgs) return
                    var prompt = editDispGroupView.getPromptArgs();
                    setTimeout(function(){
                        this.collection.getInfoPrompt(prompt);
                    }.bind(this), 500)
                    this.editDispGroupPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    if (AUTH_OBJ.QueryGslbGroup) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.editDispGroupPopup = new Modal(options);
            if (!AUTH_OBJ.ApplyEditGslbGroup)
                 this.editDispGroupPopup.$el.find(".btn-primary").remove();
        },

        onGetInfoPromptSuccess: function(res) {
            this.editDispGroupPopup.$el.modal("hide");
            if (this.PromptPopup) $("#" + this.PromptPopup.modalId).remove();

            var data = res;
            var args = this.editGroupArgs;
            if (data.length > 0) {
                data[0].title = '取消关联的节点当前覆盖区域信息如下：';

                var promptView = new PromptInfoView({
                    collection: this.collection,
                    data: data,
                    model: this.clickInfo
                });

                var options = {
                    title: "提示",
                    body: promptView,
                    backdrop: 'static',
                    type: 2,
                    cancelButtonText: '取消',
                    onOKCallback: function() {
                        if (!args) return;
                        this.collection.updateDispGroup(args);
                        this.PromptPopup.$el.modal("hide");
                    }.bind(this),
                    onCancelCallback: function(argument) {
                        setTimeout(function(){
                            this.editDispGroupPopup.$el.modal("show");
                        }.bind(this), 500)
                    }.bind(this)
                }

                this.PromptPopup = new Modal(options);
            } else {
                var result = confirm("是否确定本次编辑？");
                if (result)
                    this.collection.updateDispGroup(args);
                else
                    this.editDispGroupPopup.$el.modal("show");
            }
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var result = confirm("你确定要删除调度组" + model.attributes.dispDomain + "吗");
            if (!result) return;
            this.collection.deleteDispGroup({id:parseInt(id)})
        },

        onClickItemChannel: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);

            if (this.channelInfoPopup) $("#" + this.channelInfoPopup.modalId).remove();

            var chInfoView = new ChannelInfoView({
                collection: this.collection, 
                model     : model
            });
            var options = {
                title: model.get("dispDomain") + "调度组关联频道信息",
                body : chInfoView,
                backdrop : 'static',
                type     : 2,
                width: 800,
                height: 500,
                onOKCallback:  function(){
                    var options = chInfoView.getArgs();
                    if (!options) return;
                    this.collection.addDispGroupChannel(options)
                    this.channelInfoPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    $(document).off('keydown');
                    if (AUTH_OBJ.QueryGslbGroup) this.enterKeyBindQuery();
                }.bind(this)
            }
            this.channelInfoPopup = new Modal(options);
            this.channelInfoPopup.$el.find(".btn-primary").html('<span class="glyphicon glyphicon-link"></span>关联');
            if (!AUTH_OBJ.GslbGroupAssociatetoDomain)
                 this.channelInfoPopup.$el.find(".btn-primary").remove()
        },

        onClickItemPlay: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            this.collection.updateDispGroupStatus({ids:[parseInt(id)], status:1})
        },

        onClickItemVersion: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);

            if (this.verInfoPopup) $("#" + this.verInfoPopup.modalId).remove();

            var verInfoView = new VersionInfoView({
                collection: this.collection, 
                model     : model
            });
            var options = {
                title: "调度组版本信息: " + model.get("dispDomain"),
                body : verInfoView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){},
                onHiddenCallback: function(){}
            }
            this.verInfoPopup = new Modal(options);
        },

        onClickItemStop: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var result = confirm("你确定要关闭调度组吗？")
            if (!result) return
            this.collection.updateDispGroupStatus({ids:[parseInt(id)], status:0})
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
                        this.collection.getDispGroupList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initDispGroupDropMenu: function(){
            var typeArray = [
                {name: "全部", value: "All"},
                {name: "L0", value: 0},
                {name: "L1", value: 1},
                {name: "L2", value: 2},
                {name: "L3", value: 3},
                {name: "L4", value: 4}
            ],
            rootNode = this.$el.find(".dropdown-type");
            Utility.initDropMenu(rootNode, typeArray, function(value){
                if (value !== "All")
                    this.queryArgs.level = parseInt(value);
                else
                    this.queryArgs.level = null;
            }.bind(this));

            var statusArray = [
                {name: "全部", value: "All"},
                {name: "运行中", value: 1},
                {name: "已关闭", value: 0}
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
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            if (AUTH_OBJ.QueryGslbGroup) this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DispGroupView;
});