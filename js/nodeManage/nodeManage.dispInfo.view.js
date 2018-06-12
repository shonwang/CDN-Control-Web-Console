define("nodeManage.dispInfo.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var DispGroupInfoView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/nodeManage/nodeManage.dispGroup.html'])({}));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            
            this.collection.off("get.assocateDispGroups.success");
            this.collection.off("get.assocateDispGroups.error");
            this.collection.on("get.assocateDispGroups.success", $.proxy(this.onGetDispConfigSuccess, this));
            this.collection.on("get.assocateDispGroups.error", $.proxy(this.onGetError, this));
            this.collection.getAssocateDispGroups({
                nodeId: this.model.get("id")
            });
            this.collection.off("get.topoInfo.success");
            this.collection.off("get.topoInfo.error");
            this.collection.on("get.topoInfo.success", $.proxy(this.onGetTopoInfoSuccess, this));
            this.collection.on("get.topoInfo.error", $.proxy(this.onGetError, this));
            this.collection.getTopoinfo({
                name:null,
                page:1,
                size:9999,
            });

            // this.collection.off("get.deleteRelateTopo.success");
            // this.collection.off("get.deleteRelateTopo.error");
            // this.collection.on("get.deleteRelateTopo.success", $.proxy(this.onDeleteRelateTopoSuccess, this));
            // this.collection.on("get.deleteRelateTopo.error", $.proxy(this.onGetError, this));
            this.initSearchTypeDropList();
            
        },

        onGetTopoInfoSuccess:function(res){
            var _data = res.rows
            var topoInfoList = [];
            console.log(res)
            _.each(_data, function(el){
                var topoList = {
                    name: el.name,
                    value: el.id
                }
                topoInfoList.push(topoList)
            }.bind(this));
            Utility.initDropMenu(this.$el.find(".dropdown-topo"), topoInfoList, function(value) {
                this.topoId = parseInt(value)
                this.onTopoListFilter()
            }.bind(this));
        },

        onTopoListFilter:function(){
            if (!this.channelList || this.channelList.length === 0) return;
            var topoId = this.topoId
            _.each(this.channelList, function(model, index, list) {
                if (!topoId) {
                    model.isDisplay = true;
                } else if (model.topoId == topoId) {
                    model.isDisplay = true;
                }else if(model.topoId != topoId){
                    model.isDisplay = false;
                }
            }.bind(this));
            this.initTable();
        },

        onDeleteRelateTopoSuccess:function(res){

        },

       

        initSearchTypeDropList: function() {
            var searchArray = [{
                    name: "按名称",
                    value: "1"
                }, {
                    name: "按备注",
                    value: "2"
                }],
                rootNode = this.$el.find(".disp-filter-drop");
            Utility.initDropMenu(rootNode, searchArray, function(value) {
                this.curSearchType = value;
                this.onKeyupDispListFilter();
            }.bind(this));
            this.curSearchType = "1";
        },

        onKeyupDispListFilter: function() {
            if (!this.channelList || this.channelList.length === 0) return;
            var keyWord = this.$el.find("#disp-filter").val();

            _.each(this.channelList, function(model, index, list) {
                if (keyWord === "") {
                    model.isDisplay = true;
                } else if (this.curSearchType == "1") {
                    if (model.dispDomain.indexOf(keyWord) > -1)
                        model.isDisplay = true;
                    else
                        model.isDisplay = false;
                } else if (this.curSearchType == "2") {
                    if (model.remark.indexOf(keyWord) > -1)
                        model.isDisplay = true;
                    else
                        model.isDisplay = false;
                }
            }.bind(this));
            this.initTable();
        },

        onGetError: function(error) {
            if (error && error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        onDeleteTopo: function(){
            var 
        },

        onGetDispConfigSuccess: function(res) {
            this.channelList = res;
            if(this.channelList.length >= 1){
                console.log(this.channelList)
                var deleteRelateTopo = $("<button type='button' class='btn btn-danger deleteTopo'>解除关联</button>");
                this.target.find(".modal-footer").prepend(deleteRelateTopo);
                this.target.find(".deleteTopo").on("click", $.proxy(this.onDeleteTopo, this));
            }
            
            var count = 0;
            this.isCheckedAll = false;
            _.each(this.channelList, function(el, index, list) {
                if (el.associated === 0) el.isChecked = false;
                if (el.associated === 1) {
                    el.isChecked = true;
                    count = count + 1
                }
                el.isDisplay = true;
                if (el.status === 0) el.statusName = '<span class="label label-danger">已停止</span>';
                if (el.status === 1) el.statusName = '<span class="label label-success">运行中</span>';
                if (el.isInserive === 0) el.isInseriveName = '<span class="label label-danger">未服务</span>';
                if (el.isInserive === 1) el.isInseriveName = '<span class="label label-success">服务中</span>';
                if (el.priority == 1) el.priorityName = '成本优先';
                if (el.priority == 2) el.priorityName = '质量优先';
                if (el.priority == 3) el.priorityName = '兼顾成本与质量';
            }.bind(this))

            if (count === this.channelList.length) this.isCheckedAll = true
            this.initTable();
            this.$el.find("#disp-filter").val("")
            this.$el.find("#disp-filter").off("keyup");
            this.$el.find("#disp-filter").on("keyup", $.proxy(this.onKeyupDispListFilter, this));
        },

        initTable: function() {
            this.table = $(_.template(template['tpl/nodeManage/nodeManage.dispGroup.table.html'])({
                data: this.channelList,
                isCheckedAll: this.isCheckedAll
            }));
            if (this.channelList.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            this.table.find("tbody .remark").tooltip({
                animation: false,
                "placement": "top",
                "html": true,
                "title": function() {
                    return $(this).attr("remark")
                },
                "trigger": "hover"
            })
        },

        onItemCheckedUpdated: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var selectedObj = _.find(this.channelList, function(object) {
                return object.dispId === parseInt(id)
            }.bind(this));

            selectedObj.isChecked = eventTarget.checked

            var checkedList = this.channelList.filter(function(object) {
                return object.isChecked === true;
            })
            if (checkedList.length === this.channelList.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.channelList.length)
                this.table.find("thead input").get(0).checked = false;
        },

        onAllCheckedUpdated: function(event) {
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.table.find("tbody tr").find("input").each(function(index, node) {
                if (!$(node).prop("disabled")) {
                    $(node).prop("checked", eventTarget.checked);
                    this.channelList[index].isChecked = eventTarget.checked
                }
            }.bind(this))
        },

        getArgs: function() {
            var checkedList = this.channelList.filter(function(object) {
                return object.isChecked === true;
            })
            if (checkedList.length === 0) return false;
            _.each(checkedList, function(el, inx, list) {
                el.associated = el.isChecked ? 1 : 0;
                delete el.priorityName
                delete el.statusName
                delete el.isInseriveName
            }.bind(this))
            return checkedList
        },

        render: function(target,el) {
            this.target = el;
            this.$el.appendTo(target);
        }
    });

    return DispGroupInfoView;
});