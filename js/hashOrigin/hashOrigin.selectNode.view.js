define("hashOrigin.selectNode.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var SelectNodeView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.collection = options.collection;
                this.selectedNodes = options.selectedNodes;
                this.nodesList = options.nodesList;
                this.appType = options.appType;

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
                        "count": 99999,
                        "chname": null, //节点名称
                        "operator": null, //运营商id
                        "status": "1,4", //节点状态
                        "appType": this.appType
                    });
                }.bind(this))

                this.collection.off('get.area.success');
                this.collection.off('get.area.error');
                this.collection.on('get.area.success', $.proxy(this.onGetAreaSuccess, this));
                this.collection.on('get.area.error', $.proxy(this.onGetError, this));
                this.collection.getAreaList();

                this.allNodes = [];
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
                        el.nodeId = el.id;
                        el.weight = el.maxBandwidth;
                        el.isDisplay = true;
                        el.isChecked = false;
                        _.each(this.selectedNodes, function(node) {
                            if (el.id === node.nodeId) {
                                el.isChecked = true;
                                el.maxBandwidth = node.weight;
                                el.weight = node.weight;
                            }
                        }.bind(this))
                        this.allNodes.push(el);
                    // }
                }.bind(this))

                var tempArray = []
                if (this.nodesList && this.nodesList.length > 0) {
                    _.each(this.nodesList, function(el) {
                        var tempNode = _.find(this.allNodes, function(obj) {
                            return obj.id === el.id
                        }.bind(this))
                        if (tempNode) tempArray.push(tempNode)
                    }.bind(this))

                    this.allNodes = tempArray;
                }

                var checkedArray = _.filter(this.allNodes, function(obj) {
                    return obj.isChecked === true;
                }.bind(this))

                var notCheckedArray = _.filter(this.allNodes, function(obj) {
                    return obj.isChecked === false;
                }.bind(this))

                this.allNodes = checkedArray.concat(notCheckedArray);

                if (this.selectedNodes.length === this.allNodes.length)
                    this.isCheckedAll = true

                this.initTable();
                this.$el.find("#input-name").val("")
                this.$el.find("#input-name").off("keyup");
                this.$el.find("#input-name").on("keyup", $.proxy(this.onKeyupNodeNameFilter, this));
            },

            initTable: function() {
                this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.selectNode.table.html'])({
                    data: this.allNodes,
                    isCheckedAll: this.isCheckedAll || false
                }));
                if (this.allNodes.length !== 0)
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

                var selectedObj = _.find(this.allNodes, function(object) {
                    return object.id === parseInt(id)
                }.bind(this));

                selectedObj.isChecked = eventTarget.checked

                var checkedList = this.allNodes.filter(function(object) {
                    return object.isChecked === true;
                })
                if (checkedList.length === this.allNodes.length)
                    this.table.find("thead input").get(0).checked = true;
                if (checkedList.length !== this.allNodes.length)
                    this.table.find("thead input").get(0).checked = false;
            },

            onAllCheckedUpdated: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                this.table.find("tbody tr").find("input").each(function(index, node) {
                    $(node).prop("checked", eventTarget.checked);
                    _.each(this.allNodes, function(el){
                        if (el.id === parseInt(node.id)) el.isChecked = eventTarget.checked;
                    }.bind(this))
                }.bind(this))
            },

            getArgs: function() {
                var checkedList = _.filter(this.allNodes, function(object) {
                    return object.isChecked === true;
                })
                console.log(checkedList)
                return checkedList
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return SelectNodeView
    });