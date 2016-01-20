define("dispConfig.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SelectNodeView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.html'])({}));
            this.$el.find(".node-list").html(_.template(template['tpl/loading.html'])({}));
            this.nodeList = [];

            this.collection.on("get.regionNode.success", $.proxy(this.onGetNodeListSuccess, this));
            this.collection.on("get.regionNode.error", $.proxy(this.onGetError, this));
            this.collection.on("get.regionOtherNode.success", $.proxy(this.onGetOtherNodeSuccess, this));
            this.collection.on("get.regionOtherNode.error", $.proxy(this.onGetError, this));

            this.$el.find(".more").on("click", $.proxy(this.onClickMoreButton, this));

            this.args = {
                regionId: this.model.get("region.id"),
                groupId : this.model.get("dispGroup.id")
            }

            this.collection.getRegionNodeList(this.args);
        },

        onClickMoreButton: function(){
            this.$el.find(".more").hide();
            this.collection.getRegionOtherNodeList(this.args)
        },

        onGetOtherNodeSuccess: function(res){
            _.each(res.rows, function(element, index, list){
                var temp = {};
                _.each(element, function(el, key, ls){
                    _.each(el, function(el1, key1, ls1){
                        temp[key + "." + key1] = el1
                    }.bind(this))
                }.bind(this))
                this.nodeList.push(temp);
            }.bind(this))

            if (this.nodeList.length === 0){
                this.$el.find(".node-list").html(_.template(template['tpl/empty.html'])());
                return;
            }

            this.initList();
        },

        onGetNodeListSuccess: function(res){
            if (res.rows.length === 0){
                this.$el.find(".node-list").html(_.template(template['tpl/empty.html'])());
                return;
            }
            _.each(res.rows, function(element, index, list){
                var temp = {};
                _.each(element, function(el, key, ls){
                    _.each(el, function(el1, key1, ls1){
                        temp[key + "." + key1] = el1
                    }.bind(this))
                }.bind(this))
                this.nodeList.push(temp);
            }.bind(this))

            this.nodeList[this.nodeList.length - 1].line = true
                
            this.initList();
        },

        initList: function(){
            this.list = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.list.html'])({data: this.nodeList, nodeId: this.model.get("node.id")}));
            this.$el.find(".node-list").html(this.list[0]);
        },

        getArgs: function(){
            var nodeId = this.$el.find(".node-list input:checked").attr("id");
            var selectedNode = _.filter(this.nodeList ,function(obj) {
                return obj["node.id"] === parseInt(nodeId);
            })
            var nodeChName       = selectedNode[0]["node.chName"],
                nodeMinBandwidth = selectedNode[0]["node.minBandwidth"],
                nodeMaxBandwidth = selectedNode[0]["node.maxBandwidth"],
                crossLevel       = selectedNode[0]["cover.crossLevel"];

            var nodeString = nodeChName + "(" + nodeMinBandwidth + "/" + nodeMaxBandwidth + ")L" + crossLevel;
            selectedNode[0].nodeString = nodeString;
            return selectedNode[0]
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
    
    var DispConfigView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.html'])());

            this.collection.on("get.dispGroup.success", $.proxy(this.onDispGroupListSuccess, this));
            this.collection.on("get.dispGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("get.dispConfig.success", $.proxy(this.onDispConfigListSuccess, this));
            this.collection.on("get.dispConfig.error", $.proxy(this.onGetError, this));
            this.collection.on("init.dispConfig.success", $.proxy(this.onDispConfigListSuccess, this));
            this.collection.on("init.dispConfig.error", $.proxy(this.onGetError, this));

            this.collection.on("dispDns.success", function(){
                this.$el.find(".opt-ctn .sending").html('<span class="glyphicon glyphicon-send"></span>下发DNSpod');
                this.$el.find(".opt-ctn .sending").removeAttr("disabled", "disabled");
                alert("下发成功！")
            }.bind(this));
            this.collection.on("dispDns.error", function(res){
                this.$el.find(".opt-ctn .sending").html('<span class="glyphicon glyphicon-send"></span>下发DNSpod');
                this.$el.find(".opt-ctn .sending").removeAttr("disabled", "disabled");
                this.onGetError(res)
            }.bind(this));

            this.initDispConfigDropMenu();

            this.$el.find(".opt-ctn .sending").on("click", $.proxy(this.onClickSending, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".opt-ctn .init").on("click", $.proxy(this.onClickInitButton, this));
            
            this.$el.find(".page-ctn").hide();  
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("出错了")
        },

        onDispConfigListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickInitButton: function(){
            this.isInitPaginator = true;
            var args = _.extend({}, this.queryArgs);
            delete args.page;
            delete args.count;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.initDispConfigList(args);
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getDispConfigList(this.queryArgs);
        },

        onClickSending: function(){
            var result = confirm("你确定要下发DNSPod吗？");
            if (!result) return
            var tempArray = [];

            _.each(this.collection.models, function(el, index, list){
                var tempObj =  {
                  "dgroupId" : el.get("dispGroup.id"),
                  "nodeId"   : el.get("node.id"),
                  "regionId" : el.get("region.id"),
                  "ttl"      : el.get("dispGroup.ttl")
                };
                tempArray.push(tempObj)
            }.bind(this))
            var args = {
                groupId : this.queryArgs.groupId,
                list    : tempArray
            }
            this.collection.dispDns(args)
            this.$el.find(".opt-ctn .sending").attr("disabled", "disabled");
            this.$el.find(".opt-ctn .sending").html('<span class="glyphicon glyphicon-send"></span>下发中...');
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/dispConfig/dispConfig.table.html'])({data: this.collection.models}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            // this.table.find("tbody .node-name").on("click", $.proxy(this.onClickItemNodeName, this));
            // this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            // this.table.find("tbody .play").on("click", $.proxy(this.onClickItemPlay, this));
            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
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

            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

            var selectNodeView = new SelectNodeView({
                collection: this.collection, 
                model     : model
            });
            var options = {
                title:"选择节点",
                body : selectNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = selectNodeView.getArgs();
                    if (!options) return;
                    var result = confirm("你确定要修改节点吗？")
                    if (!result) return;
                    this.collection.get(id).attributes = _.extend(model.attributes, options);
                    this.collection.get(id).set("isUpdated", true);
                    this.collection.trigger("get.dispConfig.success")
                    this.selectNodePopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}
            }
            this.selectNodePopup = new Modal(options);
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
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
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

        initDispConfigDropMenu: function(){
            var regionArray = [
                {name: "全部", value: "All"},
                {name: "电信", value: "电信"},
                {name: "联通", value: "联通"},
                {name: "移动", value: "移动"}
            ],
            rootNode = this.$el.find(".dropdown-region");
            Utility.initDropMenu(rootNode, regionArray, function(value){
                this.queryArgs.regionName = value;
                if (value == "All")
                    delete this.queryArgs.regionName
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

            this.collection.getDispGroupList();
        },

        onDispGroupListSuccess: function(res){
            var temp = [];
            _.each(res.rows, function(el, index, list){
                temp.push({name: el.dispDomain, value: el.id})
            }.bind(this))
            rootNode = this.$el.find(".dropdown-disp");
            Utility.initDropMenu(rootNode, temp, function(value){
                this.queryArgs.groupId = parseInt(value);
                this.onClickQueryButton();
            }.bind(this));

            this.$el.find(".dropdown-disp .cur-value").html(res.rows[0].dispDomain)

            this.queryArgs = {
                page : 1,
                count: 999999,
                groupId: res.rows[0].id
            }
            this.onClickQueryButton();
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
            this.collection.getDispGroupList();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DispConfigView;
});