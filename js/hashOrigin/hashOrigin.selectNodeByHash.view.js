define("hashOrigin.selectNodeByHash.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var SelectNodeByHashView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.collection = options.collection;
                this.selectedNodes = options.selectedNodes;
                this.appType = options.appType;
                this.allNodesArray = options.allNodesArray

                this.$el = $(_.template(template['tpl/hashOrigin/hashOrigin.selectNodeByHash.html'])({}));
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.collection.off("get.hashInfo.success");
                this.collection.off("get.hashInfo.error");
                this.collection.on("get.hashInfo.success",$.proxy(this.onGetHashInfoSuccess,this));
                this.collection.on("get.hashInfo.error",$.proxy(this.onGetError,this));

                this.collection.off("get.hashOrigin.success");
                this.collection.off("get.hashOrigin.error");
                this.collection.on("get.hashOrigin.success",$.proxy(this.onGetHashSuccess,this));
                this.collection.on("get.hashOrigin.error",$.proxy(this.onGetError,this));
                var args = {
                    type:options.appType || '',
                    "page"      : 1,
                    "count"     : 9999
                };
                this.allHash = [];
                this.collection.getHashList(args);
                this.selectedNodes = []
                console.log("打勾的节点：", this.selectedNodes)
            },

            onGetHashSuccess:function(res){
                var _res = res.rows;
                this.hashLenth = _res.length;
                _.each(_res, function(el, index, list) {                
                    this.collection.getHashInfoById(el.id)
                }.bind(this))
            },

            onGetHashInfoSuccess:function(res){
                console.log(res)
                var _data = res.hashNodeList;
                if(_data.length === 0) return;
                var tempList = {
                    hashId: res.id,
                    hashName: res.name,
                    isDisplay: true,
                    isChecked: false,
                }
                tempList.nodeInfo = []
                _.each(_data, function(el){
                   tempList.nodeInfo.push({
                       nodeId: el.nodeId,
                       nodeName: el.nodeName
                   })
                }.bind(this))
                this.allHash.push(tempList)
                console.log(this.allHash)
                if(this.allHash.length === this.hashLenth){
                    console.log("请求完毕！");
                    this.nodeNameByHashModified()
                    this.initTable()
                    this.$el.find("#input-name").off("keyup");
                    this.$el.find("#node-name").off("keyup");
                    this.$el.find("#input-name").on("keyup", $.proxy(this.onKeyupNodeNameFilter, this));
                    this.$el.find("#node-name").on("keyup", $.proxy(this.onKeyupNodeNameFilter, this));
                    this.$el.find("#input-name").on("focus", $.proxy(this.onKeyupNodeNameFilter, this));
                    this.$el.find("#node-name").on("focus", $.proxy(this.onKeyupNodeNameFilter, this));
                    this.$el.find("#input-name").on("blur", $.proxy(this.onKeyupNodeNameFilter, this));
                    this.$el.find("#node-name").on("blur", $.proxy(this.onKeyupNodeNameFilter, this));
                }
            },

            nodeNameByHashModified: function(){
                _.each(this.allHash, function(item){
                    var tempNodeNameList = []
                    _.each(item.nodeInfo, function(el){
                        tempNodeNameList.push(el.nodeName)
                    }.bind(this))
                    item.nodeName = tempNodeNameList.join('<br>')
                }.bind(this))
            },

     
            onKeyupNodeNameFilter: function() {
                if (!this.allHash || this.allHash.length === 0) return;
                var keyHashWord = this.$el.find("#input-name").val();
                var keyNodeWord = this.$el.find("#node-name").val();
                _.each(this.allHash, function(model, index, list) {
                    if(keyHashWord == "" || model.hashName.indexOf(keyHashWord) > -1){
                        if(model.nodeName.indexOf(keyNodeWord)>-1 || keyNodeWord == ""){
                            model.isDisplay = true
                        }else{
                            model.isDisplay = false
                        }
                    } else {
                        model.isDisplay = false;
                    }
                }.bind(this));
                this.initTable();
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },
    
            checkedOptions: function(nodesList){
                var checkedArray = _.filter(this.allHash, function(obj) {
                    return obj.isChecked === true;
                }.bind(this));
                var notCheckedArray = _.filter(this.allHash, function(obj) {
                    return obj.isChecked === false;
                }.bind(this))
                this.allHash = checkedArray.concat(notCheckedArray);
                if (this.selectedNodes.length === this.allHash.length)
                    this.isCheckedAll = true
            },
          
            initTable: function() {
                this.table = $(_.template(template['tpl/hashOrigin/hashOrigin.selectNodeByHash.table.html'])({
                    data: this.allHash,
                    isCheckedAll: this.isCheckedAll || false
                }));
                if (this.allHash.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "暂无数据"
                        }
                    }));

                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            },

            onItemCheckedUpdated: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                var id = $(eventTarget).attr("id");
                console.log(id)
                var selectedObj = _.find(this.allHash, function(object) {
                    return object.hashId === parseInt(id)
                }.bind(this));
                console.log(selectedObj)
                selectedObj.isChecked = eventTarget.checked

                var checkedList = this.allHash.filter(function(object) {
                    return object.isChecked === true;
                })
                if (checkedList.length === this.allHash.length)
                    this.table.find("thead input").get(0).checked = true;
                if (checkedList.length !== this.allHash.length)
                    this.table.find("thead input").get(0).checked = false;
            },

            onAllCheckedUpdated: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                this.table.find("tbody tr").find("input").each(function(index, node) {
                    $(node).prop("checked", eventTarget.checked);
                    _.each(this.allHash, function(el){
                        if (el.hashId === parseInt(node.id)) el.isChecked = eventTarget.checked;
                    }.bind(this))
                }.bind(this))
            },

            // 打钩的节点将isChecked标记为true
            getArgs: function() {
                var checkedList = _.filter(this.allHash, function(object) {
                    return object.isChecked === true;
                })
                console.log(checkedList)
                // checkedList.nodeName = checkedList.nodeName.split("<br>")
                var nodeList = [];
                _.each(checkedList, function(el){
                    el.nodeList = el.nodeName.split("<br>");
                    console.log(el.nodeList)
                    _.each(el.nodeList, function(item){
                        _.each(this.allNodesArray, function(list){
                            if(list.chName === item){
                                console.log("过滤前的nodeList", nodeList)
                                if(nodeList.indexOf(list)<0){
                                    nodeList.push(list)
                                }
                                console.log("过滤后的nodeList", nodeList)
                            }
                        }.bind(this))
                    }.bind(this))
                }.bind(this))
                console.log(nodeList)
                return nodeList
            },
           
            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return SelectNodeByHashView
    });