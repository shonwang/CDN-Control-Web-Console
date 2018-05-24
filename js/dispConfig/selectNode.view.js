define("selectNode.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SelectNodeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.model      = options.model;
            this.regionId   = options.regionId;
            this.groupId = options.groupId || null;//添加时传的groupId,编辑时，带的是当前的id
            this.isEdit     = options.isEdit;
            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.html'])({}));
            this.$el.find(".node-list").html(_.template(template['tpl/loading.html'])({}));
            this.nodeList = [];

            this.collection.off("get.regionNode.success");
            this.collection.off("get.regionNode.error");
            this.collection.off("get.allDnsRecord.success");
            this.collection.off("get.regionOtherNode.error");

            this.collection.on("get.regionNode.success", $.proxy(this.onGetNodeListSuccess, this));
            this.collection.on("get.regionNode.error", $.proxy(this.onGetError, this));
            this.collection.on("get.regionOtherNode.success", $.proxy(this.onGetOtherNodeSuccess, this));
            this.collection.on("get.regionOtherNode.error", $.proxy(this.onGetError, this));

            // if (AUTH_OBJ.ShowMoreNode)
            //     this.$el.find(".more").on("click", $.proxy(this.onClickMoreButton, this));
            // else
            //     this.$el.find(".more").remove();

            this.args = {
                regionId: this.regionId,
                groupId : this.isEdit ? this.model.dispGroupId : this.groupId
            }

            this.collection.getRegionNodeList(this.args);

            this.$el.find("#node-list-filter").on("keyup", $.proxy(this.onKeyupNodeListFilter, this));
        },

        onKeyupNodeListFilter: function() {
            if (!this.nodeList || this.nodeList.length === 0) return;
            var keyWord = this.$el.find("#node-list-filter").val();
            _.each(this.nodeList, function(el, index, ls) {
                if (keyWord === ""){
                    el.isDisplay = true;
                } else {
                    var nodeString = "(" + el["node.maxBWLastNight"] + "/" + el["node.currBW"] + "/" + el["node.maxBandwidth"] + ")L" + el["cover.crossLevel"]
                    if (el["node.chName"].indexOf(keyWord) > -1 || nodeString.indexOf(keyWord) > -1)
                        el.isDisplay = true;
                    else
                        el.isDisplay = false;
                }
            });
            this.initList();
        },

        // onClickMoreButton: function(){
        //     this.$el.find(".more").hide();
        //     this.$el.find(".node-list").html(_.template(template['tpl/loading.html'])());
        //     this.collection.getRegionOtherNodeList(this.args)
        // },

        onGetOtherNodeSuccess: function(res){
            _.each(res.rows, function(element, index, list){
                var temp = {};
                _.each(element, function(el, key, ls){
                    _.each(el, function(el1, key1, ls1){
                        temp[key + "." + key1] = el1
                    }.bind(this))
                }.bind(this))
                temp.isDisplay = true;
                temp.isChecked = false;
                if (temp["node.id"] === this.model.nodeId) temp.isChecked = true;
                this.nodeList.push(temp);
            }.bind(this))

            if (this.nodeList.length === 0){
                this.$el.find("#node-list-filter").hide();
                this.$el.find(".node-list").html(_.template(template['tpl/empty.html'])());
                return;
            } else {
                this.$el.find("#node-list-filter").show()
            }

            this.initList();
        },

        onGetNodeListSuccess: function(res){
            if (res.rows.length === 0){
                this.$el.find("#node-list-filter").hide();
                this.$el.find(".node-list").html(_.template(template['tpl/empty.html'])());
                return;
            } else {
                this.$el.find("#node-list-filter").show();
            }
            _.each(res.rows, function(element, index, list){
                var temp = {};
                _.each(element, function(el, key, ls){
                    _.each(el, function(el1, key1, ls1){
                        temp[key + "." + key1] = el1
                    }.bind(this))
                }.bind(this))
                temp.isDisplay = true;
                temp.isChecked = false;
                if (temp["node.id"] === this.model.nodeId) temp.isChecked = true;
                this.nodeList.push(temp);
            }.bind(this))

            this.nodeList[this.nodeList.length - 1].line = true
                
            this.initList();
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var selectedObj = _.find(this.nodeList, function(object){
                return object["node.id"] === parseInt(id)
            }.bind(this));
            if (this.isEdit){
                var oldCheckObj = _.find(this.nodeList, function(object){
                    return object["isChecked"] === true;
                }.bind(this));
                if (oldCheckObj) oldCheckObj.isChecked = false;
            }
            selectedObj.isChecked = eventTarget.checked;
            this.curCheckedId = selectedObj["node.id"];
        },

        initList: function(){
            if (this.isEdit){
                this.list = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.list.html'])({
                    data: this.nodeList, 
                    nodeId: this.curCheckedId || this.model.nodeId,
                    isShowChart: this.isShowChart
                }));
            } else {
                this.list = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.checklist.html'])({
                    data: this.nodeList, 
                    nodeId: this.model.nodeId,
                    isShowChart: this.isShowChart
                }));
            }
            this.$el.find(".node-list").html(this.list[0]);
            this.list.find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.list.find(".chart").on("click", $.proxy(this.onClickViewChart, this));
        },

        onClickViewChart: function(event){
            this.rootNode.modal("hide");
            var eventTarget = event.srcElement || event.target, id;
                id = $(eventTarget).attr("id");
            var clickNode = _.find(this.nodeList, function(object) {
                return object["node.id"] === parseInt(id)
            })
            if (this.chartPopup) $("#" + this.chartPopup.modalId).remove();

            var aChartView = new ChartView({
                collection: this.collection, 
                selectedNode : clickNode
            });

            var options = {
                title:"节点带宽数据展示",
                body : aChartView,
                backdrop : 'static',
                type     : 1,
                height   : 500,
                width    : 800,
                onHiddenCallback: function(){
                    this.rootNode.modal("show");
                }.bind(this)
            }
            this.chartPopup = new Modal(options);
        },

        getArgs: function(){
            //var checkedNodes = this.$el.find(".node-list input:checked"), checkedNodeIds = [];
            var checkedNodes = _.filter(this.nodeList, function(object) {
                return object["isChecked"] === true
            }), checkedNodeIds = [];

            if (checkedNodes.length === 0) {
                alert("至少选择一个再点确定！")
                return false;
            }
            for (var i = 0; i < checkedNodes.length; i++){
                //var tempId = parseInt($(checkedNodes[i]).attr("id"));
                var tempId = checkedNodes[i]["node.id"];
                checkedNodeIds.push(tempId)
            }
            var selectedNodes = [];
            for (var k = 0; k < checkedNodeIds.length; k++){
                var aSelectedNodeArray = _.filter(this.nodeList ,function(obj) {
                    return obj["node.id"] === checkedNodeIds[k];
                })
                var aSelectedNode = aSelectedNodeArray[0];
                var nodeChName       = aSelectedNode["node.chName"],
                    nodeMaxBWLastNight = aSelectedNode["node.maxBWLastNight"],
                    nodeCurrBW = aSelectedNode["node.currBW"],
                    nodeMaxBandwidth = aSelectedNode["node.maxBandwidth"],
                    crossLevel       = aSelectedNode["cover.crossLevel"];
                var nodeString = nodeChName + "(" + nodeMaxBWLastNight + "/" + nodeCurrBW + "/" + nodeMaxBandwidth + ")L" + crossLevel;
                aSelectedNode.nodeString = nodeString;
                aSelectedNode.id = aSelectedNode["node.id"];
                aSelectedNode.isDisplay = true;
                selectedNodes.push(aSelectedNode)
            }
            // console.log(selectedNodes);
            // console.log(this.model);
            // return false;

            var selectedList = [];
            for(var i=0;i<selectedNodes.length;i++){
                var obj = {};
                obj["bandwidth"] = selectedNodes[i]["node.maxBandwidth"];
                obj["currNum"] = selectedNodes[i]["dispConfIpInfo.currNum"];
                obj["dispDomain"] = this.model.dispDomain;
                obj["dispGroupId"] = this.model.dispGroupId;
                obj["id"] = this.model.id;
                obj["ttl"] = this.model.ttl;
                obj["maxIpNum"] = selectedNodes[i]["dispConfIpInfo.maxNum"];
                obj["nodeId"] = selectedNodes[i]["node.id"];
                obj["nodeName"] = selectedNodes[i]["node.chName"];
                obj["pasuseIpNum"] = selectedNodes[i]["dispConfIpInfo.pauseNum"];
                obj["regionLineId"] = this.model.regionLineId;
                obj["regionName"] = this.model.regionName;
                obj["isDisplay"] = true;
                //obj["type"] = this.model.type;//此值不需要
                selectedList.push(obj);
            }
            var resultNode = {
                isEdit:this.isEdit,
                selectedList:selectedList
            };
            return resultNode;
            //return selectedNodes
        },

        onGetError: function(error){
            this.$el.find("#node-list-filter").hide();
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target, rootNode) {
            this.$el.appendTo(target);
            this.rootNode = rootNode;
        }
    });

    return SelectNodeView;
});