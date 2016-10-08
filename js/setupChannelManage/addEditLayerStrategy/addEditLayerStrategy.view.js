define("addEditLayerStrategy.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditLayerStrategyView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.html'])());

            this.defaultParam = {
                "local":[163,162,161],
                "localType":1,
                "upper":[{
                    "nodeId":163,
                    "ipCorporation":2
                }]
            }
            this.initSetup();

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".strategy-type input").on("click", $.proxy(this.onClickLocalTypeRadio, this));
            this.$el.find(".save").on("click", $.proxy(this.onClickLocalTypeRadio, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancelBtn, this));
        },

        initSetup: function(){
            this.$el.find('.local .add-node').hide();
            if (this.defaultParam.localType === 1){
                this.$el.find("#strategyRadio1").get(0).checked = true;
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2){
                this.$el.find("#strategyRadio2").get(0).checked = false;
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").show();
            }
            this.collection.on("get.operator.success", $.proxy(this.initDropMenu, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));
            this.collection.getOperatorList();

            if (!this.options.localNodes && !this.options.upperNodes){
                this.collection.on("get.node.success", $.proxy(this.onGetLocalNode, this));
                this.collection.on("get.node.error", $.proxy(this.onGetError, this));
                this.collection.getNodeList({
                    chname:null,
                    count:99999,
                    operator:null,
                    page:1,
                    status:null
                })
            } else {
                this.onGetLocalNode(this.options.localNodes)
            }
        },

        onClickCancelBtn: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetLocalNode: function(res){
            this.$el.find('.local .add-node').show();
            var nodesArray = [], data = res;
            this.selectedLocalNodeList = [];

            if (res&&res.rows) data = res.rows

            _.each(data, function(el, index, list){
                _.each(this.defaultParam.local, function(defaultLocalId, inx, ls){
                    if (el.nodeId) el.id = el.nodeId;
                    if (el.nodeName) el.chName = el.nodeName;
                    if (defaultLocalId === el.id) {
                        el.checked = true;
                        this.selectedLocalNodeList.push({nodeId: el.id, nodeName: el.chName})
                    }
                }.bind(this))
                nodesArray.push({name:el.chName, value: el.id, checked: el.checked})
            }.bind(this))

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.local .add-node-ctn').get(0),
                panelID: this.$el.find('.local .add-node').get(0),
                openSearch: true,
                onOk: function(data){
                    this.selectedLocalNodeList = [];
                    _.each(data, function(el, key, ls){
                        this.selectedLocalNodeList.push({nodeId: el.value, nodeName: el.name})
                    }.bind(this))
                    this.initLocalTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
            this.initLocalTable()
            this.onGetUpperNode(res);
        },

        onGetUpperNode: function(res){
            this.$el.find('.upper .add-node').show();
            var nodesArray = [];
            this.selectedUpperNodeList = [];

            _.each(res.rows, function(el, index, list){
                _.each(this.defaultParam.upper, function(defaultNode, inx, ls){
                    if (defaultNode.nodeId === el.id) {
                        el.checked = true;
                        this.selectedUpperNodeList.push({
                            nodeId: el.id, 
                            nodeName: el.chName, 
                            ipCorporation: defaultNode.ipCorporation
                        })
                    }
                }.bind(this))
                nodesArray.push({name:el.chName, value: el.id, checked: el.checked})
            }.bind(this))

            this.initUpperTable()

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.upper .add-node-ctn').get(0),
                panelID: this.$el.find('.upper .add-node').get(0),
                openSearch: true,
                onOk: function(data){
                    this.selectedUpperNodeList = [];
                    _.each(data, function(el, key, ls){
                        this.selectedUpperNodeList.push({
                            nodeId: el.value, 
                            nodeName: el.name,
                            ipCorporation: 0
                        })
                    }.bind(this))
                    this.initUpperTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
        },

        onClickLocalTypeRadio: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.defaultParam.localType = parseInt($(eventTarget).val());

            if (this.defaultParam.localType === 1){
                this.$el.find(".operator-ctn").hide();
                this.$el.find(".nodes-ctn").show();
            } else if (this.defaultParam.localType === 2){
                this.$el.find(".nodes-ctn").hide();
                this.$el.find(".operator-ctn").show();
            }
        },

        initUpperTable: function(){
            this.upperTable = $(_.template(template['tpl/setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.upper.table.html'])({
                data: this.selectedUpperNodeList
            }));
            if (this.selectedUpperNodeList.length !== 0)
                this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
            else
                this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty.html'])());

            this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));

            var statusArray = [
                {name: "联通", value:2},
                {name: "移动", value:0},
                {name: "电信", value:1},
            ],
            rootNodes = this.upperTable.find(".ipOperator .dropdown");
            for (var i = 0; i < rootNodes.length; i++){
                this.initTableDropMenu($(rootNodes[i]), statusArray, function(value, nodeId){
                    _.each(this.selectedUpperNodeList, function(el, key, list){
                        if (el.nodeId === parseInt(nodeId))
                            el.ipCorporation = parseInt(value)
                    }.bind(this))
                }.bind(this));

                var nodeId = $(rootNodes[i]).attr("id"),
                    upperObj = _.find(this.selectedUpperNodeList, function(object){
                        return object.nodeId === parseInt(nodeId);
                    }.bind(this))

                var leberNode = this.$el.find("#dropdown-ip-operator .cur-value");

                if (upperObj){
                    var defaultValue = _.find(statusArray, function(object){
                        return object.value === upperObj.ipCorporation;
                    }.bind(this));

                    if (defaultValue)
                        leberNode.html(defaultValue.name);
                    else
                        leberNode.html(statusArray[0].name);
                } else {
                    leberNode.html(statusArray[0].name);
                }
            }
        },

        initTableDropMenu: function (rootNode, typeArray, callback){
            var dropRoot = rootNode.find(".dropdown-menu"),
                rootId = rootNode.attr("id"),
                showNode = rootNode.find(".cur-value");
            dropRoot.html("");
            _.each(typeArray, function(element, index, list){
                var itemTpl = '<li value="' + element.value + '">' + 
                                  '<a href="javascript:void(0);" value="' + element.value + '">'+ element.name + '</a>' + 
                            '</li>',
                itemNode = $(itemTpl);
                itemNode.on("click", function(event){
                    var eventTarget = event.srcElement || event.target;
                        showNode.html($(eventTarget).html()),
                        value = $(eventTarget).attr("value");
                    callback&&callback(value, rootId);
                });
                itemNode.appendTo(dropRoot);
            });
        },

        initLocalTable: function(){
            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedLocalNodeList
            }));
            if (this.selectedLocalNodeList.length !== 0)
                this.$el.find(".local .table-ctn").html(this.localTable[0]);
            else
                this.$el.find(".local .table-ctn").html(_.template(template['tpl/empty.html'])());

            this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemLocalDelete, this));
        },

        onClickItemLocalDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            for (var i = 0; i < this.selectedLocalNodeList.length; i++){
                if (parseInt(this.selectedLocalNodeList[i].nodeId) === parseInt(id)){
                    this.selectedLocalNodeList.splice(i, 1);
                    this.initLocalTable();
                    return;
                }
            }
        },

        onClickItemUpperDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            for (var i = 0; i < this.selectedUpperNodeList.length; i++){
                if (parseInt(this.selectedUpperNodeList[i].nodeId) === parseInt(id)){
                    this.selectedUpperNodeList.splice(i, 1);
                    this.initUpperTable();
                    return;
                }
            }
        },

        initDropMenu: function(data){
            var statusArray = [],
            rootNode = this.$el.find(".operator");
            _.each(data.rows, function(el, key, list){
                statusArray.push({name: el.name, value: el.id})
            }.bind(this))
            Utility.initDropMenu(rootNode, statusArray, function(value){

            }.bind(this));

            var defaultValue = _.find(statusArray, function(object){
                return object.value === this.defaultParam.mtPosition;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-operator .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-operator .cur-value").html(statusArray[0].name);
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return AddEditLayerStrategyView;
});