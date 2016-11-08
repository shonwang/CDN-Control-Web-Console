define("setupChannelManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var HistoryView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.history.html'])({data: {}}));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));

            this.collection.off("get.channel.history.success");
            this.collection.off("get.channel.history.error");
            this.collection.on("get.channel.history.success", $.proxy(this.initSetup, this));
            this.collection.on("get.channel.history.error", $.proxy(this.onGetError, this));
            this.collection.getVersionList({"originId": this.model.get("id")})

            this.$el.find('#input-domain').val(this.model.get("domain"))
        },

        initSetup: function(data){
            this.versionList = data;

            _.each(data, function(el, index, ls){
                if (el.createTime) 
                    el.createTimeFormated = new Date(el.createTime).format("yyyy/MM/dd hh:mm:ss")
            }.bind(this))

            this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.history.table.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .bill").on("click", $.proxy(this.onClickItemBill, this));
        },

        onClickItemBill: function(event){
            var eventTarget = event.srcElement || event.target,
                version = $(eventTarget).attr("version");

            require(['setupBill.view', 'setupBill.model'], function(SetupBillView, SetupBillModel){
                var mySetupBillModel = new SetupBillModel();
                var mySetupBillView = new SetupBillView({
                    collection: mySetupBillModel,
                    originId: this.model.get("id"),
                    version: version,
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){
                        mySetupBillView.$el.remove();
                        this.$el.find(".history-panel").show();
                    }.bind(this)
                })

                this.$el.find(".history-panel").hide();
                mySetupBillView.render(this.$el.find(".bill-panel"));
            }.bind(this))
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var SpecialLayerManageView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.rule = [];
            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.specialLayer.html'])({data: {}}));

            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".add-role").on("click", $.proxy(this.onClickAddRuleButton, this));

            this.initSetup()
        },

        initSetup: function(){
            var data = [{localLayer: "1111", upperLayer: "22222"}];
            this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.role.table.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
        },

        onClickAddRuleButton: function(){
            require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], function(AddEditLayerStrategyView, AddEditLayerStrategyModel){
                var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                    collection: myAddEditLayerStrategyModel,
                    rule      : this.rule,
                    onSaveCallback: function(){
    
                    }.bind(this),
                    onCancelCallback: function(){
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".special-layer").show();
                    }.bind(this)
                })

                this.$el.find(".special-layer").hide();
                myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
            }.bind(this))
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },
        InformationProcessing:function(data){
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            var data_save = [];
            var self = this;
            var operator = [
                {name: "联通",  value:1},
                {name: "电信",  value:2},
                {name: "移动",  value:3},
                {name: "鹏博士", value:4},
                {name: "教育网", value:5},
                {name: "广电网", value:6},
                {name: "铁通",   value:7},
                {name: "华数",   value:8},
                {name: "多线",   value:9}
            ];
            _.each(data, function(el, key, ls){
                var data_save_content = {
                    id:null,
                    'localLayer':[],
                    'upperLayer':[]
                };
                if(el.localType == 2){
                    _.each(el.local,function(local){
                        _.each(operator,function(operator){
                            if(local == operator.value){
                               data_save_content.localLayer.push(operator.name)
                            }
                        })
                    })
                }else if(el.localType == 1){
                    _.each(el.local,function(local){
                        _.each(self.allNodes,function(nodes){
                            if(local == nodes.nodeId){
                               data_save_content.localLayer.push(nodes.chName)
                            }
                        })
                    })
                }
                _.each(el.upper,function(upper){
                   
                        _.each(self.allNodes,function(nodes){
                            if(upper.nodeId == nodes.nodeId){
                               data_save_content.upperLayer.push(nodes.chName)
                            }
                        })
                    
                    
                })
                data_save_content.localLayer = data_save_content.localLayer.join('、');
                data_save_content.upperLayer = data_save_content.upperLayer.join('、');
                data_save_content.id = key;
                data_save.push(data_save_content);

            });
            return data_save;
        },
        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var SelectTopoView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.domainArray = options.domainArray;

            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.select.topo.html'])());

            this.initDomainList();

            require(["setupTopoManage.model"], function(SetupTopoManageModel){
                this.mySetupTopoManageModel = new SetupTopoManageModel();
                this.mySetupTopoManageModel.on("get.topoInfo.success", $.proxy(this.initTable, this));
                this.mySetupTopoManageModel.on("get.topoInfo.error", $.proxy(this.onGetError, this));
                this.mySetupTopoManageModel.getTopoinfo({
                    name:null,
                    page:1,
                    size:99999,
                    type:null
                });
            }.bind(this))
        },

        initDomainList: function(){
            this.domainList = $(_.template(template['tpl/setupSendManage/setupSending/setupSending.detail.domain.html'])({
                data: this.domainArray, 
            }));
            if (this.domainArray.length !== 0)
                this.$el.find(".domain-ctn").html(this.domainList[0]);
            else
                this.$el.find(".domain-ctn").html(_.template(template['tpl/empty.html'])());
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.topo.table.html'])({
                data: this.mySetupTopoManageModel.models, 
            }));
            if (this.mySetupTopoManageModel.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        onSure: function(){
            var selectedTopo = this.$el.find("input:checked");
            if (!selectedTopo.get(0)){
                alert("请选择一个拓扑关系")
                return false;
            }
            var topoId = selectedTopo.get(0).id,
                model = this.mySetupTopoManageModel.get(topoId);

            return model;   
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    }); 

    var SetupChannelManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.html'])());

            this.initChannelDropMenu();

            this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.channel.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            this.$el.find(".multi-modify-topology").on("click", $.proxy(this.onClickMultiModifyTopology, this))
            this.enterKeyBindQuery();

            this.queryArgs = {
                "domain":null,
                "type":null,
                "protocol":null,
                "cdnFactory":null,
                "auditStatus":null,
                "currentPage":null,
                "pageSize":null
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

        onChannelListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.domain = this.$el.find("#input-domain").val();
            this.queryArgs.clientName = this.$el.find("#input-client").val();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            if (this.queryArgs.clientName == "") this.queryArgs.clientName = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.queryChannel(this.queryArgs);
        },

        initTable: function(){
            this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
            this.table = $(_.template(template['tpl/setupChannelManage/setupChannelManage.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .strategy").on("click", $.proxy(this.onClickItemSpecialLayer, this));
            this.table.find("tbody .history").on("click", $.proxy(this.onClickItemHistory, this));

            this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
        },

        onClickMultiModifyTopology: function(){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            });

            var domainArray = [];
            _.each(checkedList, function(el, index, ls){
                domainArray.push({
                    domain: el.get("domain"), 
                    id: el.get("id")
                });
            }.bind(this))

            if (this.selectTopoPopup) $("#" + this.selectTopoPopup.modalId).remove();

            var mySelectTopoView = new SelectTopoView({
                collection: this.collection, 
                domainArray : domainArray
            });
            var options = {
                title: "选择拓扑关系",
                body : mySelectTopoView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var result  = mySelectTopoView.onSure();
                    if (!result) return;
                    this.selectTopoPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){
                    this.enterKeyBindQuery();
                }.bind(this)
            }
            this.selectTopoPopup = new Modal(options);
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

            var myHistoryView = new HistoryView({
                collection: this.collection,
                model: model,
                onSaveCallback: function(){}.bind(this),
                onCancelCallback: function(){
                    myHistoryView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myHistoryView.render(this.$el.find(".history-panel"))
        },

        onClickItemSpecialLayer: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);

            var mySpecialLayerManageView = new SpecialLayerManageView({
                collection: this.collection,
                model: model,
                onSaveCallback: function(){}.bind(this),
                onCancelCallback: function(){
                    mySpecialLayerManageView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            mySpecialLayerManageView.render(this.$el.find(".strategy-panel"))
        },

        onClickItemEdit: function(event){
            require(['setupChannelManage.edit.view'], function(EditChannelView){
                var eventTarget = event.srcElement || event.target, id;
                if (eventTarget.tagName == "SPAN"){
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }

                var model = this.collection.get(id);

                var myEditChannelView = new EditChannelView({
                    collection: this.collection,
                    model: model,
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){
                        myEditChannelView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                myEditChannelView.render(this.$el.find(".edit-panel"))
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
                this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
            } else {
                this.$el.find(".multi-modify-topology").removeAttr("disabled", "disabled");
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
                this.$el.find(".multi-modify-topology").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".multi-modify-topology").attr("disabled", "disabled");
            }
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.pageSize) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.pageSize);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.currentPage = num;
                        args.pageSize = this.queryArgs.pageSize;
                        this.collection.queryChannel(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initChannelDropMenu: function(){
            var statusArray = [
                {name: "全部", value: "All"},
                {name:"审核中", value:0},
                {name: "审核通过", value:1},
                {name: "审核失败", value:2},
                {name: "测试中", value:3},
                {name: "测试未通过", value:4},
                {name: "编辑中", value:5},
                {name: "待下发", value:6},
                {name: "灰度中", value:7},
                {name: "运行中", value:8},
                {name: "删除", value:-1}
            ],
            rootNode = this.$el.find(".dropdown-status");
            Utility.initDropMenu(rootNode, statusArray, function(value){
                if (value == "All")
                    this.queryArgs.auditStatus = null;
                else
                    this.queryArgs.auditStatus = parseInt(value)
            }.bind(this));

            var protocolArray = [
                {name: "全部", value: "All"},
                {name:"http+hlv", value:1},
                {name: "hls", value:2},
                {name: "rtmp", value:3}
            ],
            rootNode = this.$el.find(".dropdown-protocol");
            Utility.initDropMenu(rootNode, protocolArray, function(value){
                if (value == "All")
                    this.queryArgs.protocol = null;
                else
                    this.queryArgs.protocol = parseInt(value)
            }.bind(this));

            var companyArray = [
                {name: "全部", value: "All"},
                {name:"自建", value:1},
                {name: "网宿", value:2}
            ],
            rootNode = this.$el.find(".dropdown-company");
            Utility.initDropMenu(rootNode, companyArray, function(value){
                if (value == "All")
                    this.queryArgs.cdnFactory = null;
                else
                    this.queryArgs.cdnFactory = parseInt(value)
            }.bind(this));

            var typeArray = [
                {name: "全部", value: "All"},
                {name:"下载加速", value:1},
                {name: "直播加速", value:2}
            ],
            rootNode = this.$el.find(".dropdown-type");
            Utility.initDropMenu(rootNode, typeArray, function(value){
                if (value == "All")
                    this.queryArgs.type = null;
                else
                    this.queryArgs.type = parseInt(value)
            }.bind(this));

            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.pageSize = value;
                this.queryArgs.currentPage = 1;
                this.onClickQueryButton();
            }.bind(this));
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return SetupChannelManageView;
});