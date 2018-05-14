define("setupTopoManage.selectNode.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var SelectNodeView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.collection = options.collection;
                this.selectedNodes = options.selectedNodes;
                this.nodesList = options.nodesList;
                this.appType = options.appType;
                this.level = options.level;

                this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.selectNode.html'])({}));
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                require(['nodeManage.model'], function(NodeManageModel) {
                    var myNodeManageModel = new NodeManageModel();
                    myNodeManageModel.on("get.operator.success", $.proxy(this.onGetOperatorSuccess, this));
                    myNodeManageModel.on("get.operator.error", $.proxy(this.onGetError, this));
                    myNodeManageModel.getOperatorList();
                    myNodeManageModel.on("get.province.success", $.proxy(this.onGetProvinceSuccess, this));
                    myNodeManageModel.on("get.province.error", $.proxy(this.onGetError, this));
                    myNodeManageModel.getAllProvince();
                    myNodeManageModel.on("get.node.success", $.proxy(this.onGetAllNode, this));
                    myNodeManageModel.on("get.node.error", $.proxy(this.onGetError, this));
                    myNodeManageModel.getNodeList({
                        "page": 1,
                        "count": 9999,
                        "chname": null, //节点名称
                        "operator": null, //运营商id
                        "status": "1,4", //节点状态
                        "appType": this.appType,
                        "cacheLevel":null,
                        "liveLevel":null
                    });
                }.bind(this))

                this.collection.off('get.area.success');
                this.collection.off('get.area.error');
                this.collection.on('get.area.success', $.proxy(this.onGetAreaSuccess, this));
                this.collection.on('get.area.error', $.proxy(this.onGetError, this));
                this.collection.getAreaList();

                this.allNodes = [];
                this.upperAllNodes = [];
                this.middleAllNodes = [];
                this.lowerAllNodes = [];
                this.curOperator = null;
                this.curArea = null;
                this.curProv = null;
                console.log("打勾的节点：", this.selectedNodes)
            },

            onKeyupNodeNameFilter: function() {
                if (!this.allNodes || this.allNodes.length === 0) return;
                var keyWord = this.$el.find("#input-name").val();

                _.each(this.allNodes, function(model, index, list) {
                    if ((this.curOperator === model.operatorId && this.curArea === model.areaId && this.curProv === model.provId) ||

                        (this.curOperator === null && this.curArea === model.areaId && this.curProv === model.provId) ||
                        (this.curOperator === model.operatorId && this.curArea === null && this.curProv === model.provId) ||
                        (this.curOperator === model.operatorId && this.curArea === model.areaId && this.curProv === null) ||

                        (this.curOperator === null && this.curArea === null && this.curProv === model.provId) ||
                        (this.curOperator === model.operatorId && this.curArea === null && this.curProv === null) ||
                        (this.curOperator === null && this.curArea === model.areaId && this.curProv === null) ||

                        (this.curOperator === null && this.curArea === null && this.curProv === null)) {
                        if (keyWord === "") {
                            model.isDisplay = true;
                        } else if (model.chName.indexOf(keyWord) > -1) {
                            model.isDisplay = true;
                        } else {
                            model.isDisplay = false;
                        }
                    } else {
                        model.isDisplay = false;
                    }
                }.bind(this));

                this.initTable();
            },

            // 这部分不需要修改
            onGetProvinceSuccess: function(res) {
                this.provList = res
                var nameList = [{
                    name: "全部",
                    value: "All"
                }];
                _.each(res, function(el, index, list) {
                    nameList.push({
                        name: el.name,
                        value: el.id
                    })
                });

                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.dropdown-prov').get(0),
                    panelID: this.$el.find('#dropdown-prov').get(0),
                    isSingle: true,
                    openSearch: true,
                    selectWidth: 200,
                    isDataVisible: false,
                    onOk: function() {},
                    data: nameList,
                    callback: function(data) {
                        this.$el.find('#dropdown-prov .cur-value').html(data.name);
                        if (data.value !== "All")
                            this.curProv = parseInt(data.value)
                        else
                            this.curProv = null;
                        this.onKeyupNodeNameFilter();
                    }.bind(this)
                });

                // Utility.initDropMenu(this.$el.find(".dropdown-prov"), nameList, function(value) {
                //     if (value !== "All")
                //         this.curProv = parseInt(value)
                //     else
                //         this.curProv = null;
                //     this.onKeyupNodeNameFilter();
                // }.bind(this));
            },

            // 这部分不需要修改
            onGetOperatorSuccess: function(res) {
                this.operatorList = res
                var nameList = [{
                    name: "全部",
                    value: "All"
                }];
                _.each(res.rows, function(el, index, list) {
                    nameList.push({
                        name: el.name,
                        value: el.id
                    })
                });
                Utility.initDropMenu(this.$el.find(".dropdown-operator"), nameList, function(value) {
                    if (value !== "All")
                        this.curOperator = parseInt(value)
                    else
                        this.curOperator = null;
                    this.onKeyupNodeNameFilter();
                }.bind(this));
            },

            // 这部分不需要修改
            onGetAreaSuccess: function(res) {
                this.areaList = res
                var nameList = [{
                    name: "全部",
                    value: "All"
                }];
                _.each(res, function(el, index, list) {
                    nameList.push({
                        name: el.name,
                        value: el.id
                    })
                });
                Utility.initDropMenu(this.$el.find(".dropdown-area"), nameList, function(value) {
                    if (value !== "All")
                        this.curArea = parseInt(value)
                    else
                        this.curArea = null;
                    this.onKeyupNodeNameFilter();
                }.bind(this));
            },

            // 这部分不需要修改
            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            onGetAllNode: function(res) {
                _.each(res, function(el, index, list) {
                    // if (el.status !== 3 && el.status !== 2) {
                        el.name = el.chName;
                        el.isDisplay = true;
                        el.isChecked = false;
                        _.each(this.selectedNodes, function(node) {
                            if (el.id === node.id) {
                                el.isChecked = true;
                                el.chiefType = node.chiefType;
                                el.ipCorporation = node.ipCorporation;
                            }
                        }.bind(this))
                        this.allNodes.push(el);
                    // }
                }.bind(this))
            
                    if(this.level === 1){
                        this.onGetUpperAllNodes();
                    }else if(this.level === 2){
                        this.onGetMiddleAllNodes();
                    }else if(this.level === 3){
                        this.onGetLowerAllNodes();
                    }
                    // else{
                    //     alert("目前层级只支持上、中、下");
                    //     return;
                    // }
           
                this.checkedOptions(this.nodesList);

                this.initTable();

                this.$el.find("#input-name").val("")
                this.$el.find("#input-name").off("keyup");
                this.$el.find("#input-name").on("keyup", $.proxy(this.onKeyupNodeNameFilter, this));
            },

            checkedOptions:function(nodesList){
                var checkedArray = _.filter(this.nodesList, function(obj) {
                    return obj.isChecked === true;
                }.bind(this))

                var notCheckedArray = _.filter(this.nodesList, function(obj) {
                    return obj.isChecked === false;
                }.bind(this))

                this.nodesList = checkedArray.concat(notCheckedArray);

                if (this.selectedNodes.length === this.nodesList.length)
                    this.isCheckedAll = true
            },

            onGetUpperAllNodes: function(){
                if(this.appType == 202){
                    _.each(this.allNodes, function(el){
                        if(el.cacheLevel == 1){
                            this.upperAllNodes.push(el);
                        }
                        }.bind(this))
                }else if(this.appType == 203){
                    _.each(this.allNodes, function(el){
                        if(el.liveLevel == 1){
                            this.upperAllNodes.push(el);
                        }
                    }.bind(this))
                }else{
                    alert("目前只支持直播或点播类型");
                    return;
                };
                
                this.nodesList = this.upperAllNodes;
            },

            onGetMiddleAllNodes: function(){
                if(this.appType == 202){
                    _.each(this.allNodes, function(el){
                        if(el.cacheLevel == 2){
                            this.middleAllNodes.push(el);
                        }
                    }.bind(this))
                }else if(this.appType == 203){
                    _.each(this.allNodes, function(el){
                        if(el.liveLevel == 2){
                            this.middleAllNodes.push(el);
                }
                    }.bind(this))
                }else{
                    alert("目前只支持直播或点播类型");
                    return;
                };

                this.nodesList = this.middleAllNodes
            },

            onGetLowerAllNodes: function(){
                if(this.appType == 202){
                    _.each(this.allNodes, function(el){
                        if(el.cacheLevel == 3){
                            this.lowerAllNodes.push(el);
                }
                    }.bind(this)) 
                }else if(this.appType == 203){
                    _.each(this.allNodes, function(el){
                        if(el.liveLevel == 3){
                            this.lowerAllNodes.push(el);
                }
                    }.bind(this))
                }else{
                    alert("目前只支持直播或点播类型");
                    return;
                };

                this.nodesList = this.lowerAllNodes
            },

            // 这部分是节点展示的地方，传输的是this.allNodes，需要修改
            initTable: function() {
                this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.selectNode.table.html'])({
                    data: this.nodesList,
                    isCheckedAll: this.isCheckedAll || false
                }));
                if (this.nodesList.length !== 0)
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

                var selectedObj = _.find(this.nodesList, function(object) {
                    return object.id === parseInt(id)
                }.bind(this));

                selectedObj.isChecked = eventTarget.checked

                var checkedList = this.nodesList.filter(function(object) {
                    return object.isChecked === true;
                })
                if (checkedList.length === this.nodesList.length)
                    this.table.find("thead input").get(0).checked = true;
                if (checkedList.length !== this.nodesList.length)
                    this.table.find("thead input").get(0).checked = false;
            },

            onAllCheckedUpdated: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                this.table.find("tbody tr").find("input").each(function(index, node) {
                    $(node).prop("checked", eventTarget.checked);
                    _.each(this.nodesList, function(el){
                        if (el.id === parseInt(node.id)) el.isChecked = eventTarget.checked;
                    }.bind(this))
                }.bind(this))
            },

            // 打钩的节点将isChecked标记为true
            getArgs: function() {
                var checkedList = _.filter(this.nodesList, function(object) {
                    return object.isChecked === true;
                })
                return checkedList
            },
            getUpperArgs: function() {
                var checkedList = _.filter(this.upperAllNodes, function(object) {
                    return object.isChecked === true;
                })
         
                return checkedList
            },
            getMiddleArgs: function() {
                var checkedList = _.filter(this.middleAllNodes, function(object) {
                    return object.isChecked === true;
                })
          
                return checkedList
            },
            getLowerArgs: function() {
                var checkedList = _.filter(this.lowerAllNodes, function(object) {
                    return object.isChecked === true;
                })
             
                return checkedList
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return SelectNodeView
    });