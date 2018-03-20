define("codeRateManage.view", ['require', 'exports', 'template', 'utility', "modal.view"],
    function(require, exports, template, Utility, Modal) {

        var CodeRateAddView = Backbone.View.extend({

            initialize: function(options) {
                this.options = options;
                this.userId = options.userId;
                this.collection = options.collection;
                this.model = options.model;
                var model = this.model;
                this.defaultParam = {
                    selectedNodes:options.selectedNodes || [],
                    name:model && model.get("area") || "",
                    rate:model && model.get("rate") || ""
                };
                this.$el = $(_.template(template['tpl/customerSetup/codeRate/codeRateManage/codeRate.manage.add.html'])({
                    data: this.defaultParam
                }));
                this.$el.find(".hide-disp-domain").on("click", $.proxy(this.onClickHideDisp, this));
                this.$el.find(".show-disp-domain").on("click", $.proxy(this.onClickShowDisp, this));   
                this.initDispList();             
            },

            onClickHideDisp: function(){
                this.$el.find(".hide-disp-domain").hide();
                this.$el.find(".show-disp-domain").show();
                this.$el.find(".disp-list-ctn").slideUp(200);
            },

            onClickShowDisp: function(){
                this.$el.find(".hide-disp-domain").show();
                this.$el.find(".show-disp-domain").hide();
                this.$el.find(".disp-list-ctn").slideDown(200);
            },

            getArgs: function() {
                var name = this.$el.find("#area-label-name").val().trim(),
                    value = this.$el.find("#rate-value").val().trim();

                if (name === "") {
                    Utility.warning("名称不能为空！")
                    return false;
                }
                
                if(!value){
                    Utility.warning("码率不能为空");
                    return false;
                }

                var re = /\uff0c/g;
                if(re.test(value)){
                    Utility.warning("不能中文逗号");
                    return false;
                }                

                var nodeIds = this.nodeIds;
                if(nodeIds.length == 0){
                    Utility.warning("请选择节点");
                    return false;
                }

                return {
                    area:name,
                    rate:value,
                    nodeIds:nodeIds
                };
            },

            setNodeSelectedTitleAndData:function(data){
                this.$el.find(".disp-domain-html").html("已选"+data.selected.length+"/共"+data.total);
            },

            initDispList: function(){

                require(['codeRateManage.selectNode.view','setupTopoManage.model'], function(SelectNodeView,TpModel) {
                    var tpModel = new TpModel();
                    var mySelectNodeView = new SelectNodeView({
                        collection: tpModel,
                        selectedNodes: this.defaultParam && this.defaultParam.selectedNodes || [],
                        appType: null,
                        callback:function(data){
                            this.setNodeSelectedTitleAndData(data);
                            this.nodeIds = data.selected;
                        }.bind(this)
                    });
                    mySelectNodeView.render(this.$el.find(".disp-list-ctn"));

                }.bind(this))

            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        var CodeRateManageView = Backbone.View.extend({
            initialize: function(options) {
                this.collection = options.collection;
                this.options = options;
                var clientInfo = JSON.parse(options.query);
                var codeRateInfo = JSON.parse(options.query2);
                this.codeRateInfo = codeRateInfo;
                this.$el = $(_.template(template['tpl/customerSetup/codeRate/codeRateManage/codeRate.manage.home.html'])({data:codeRateInfo}));
                
                this.userInfo = {
                    clientName: clientInfo.clientName,
                    uid: clientInfo.uid
                }
                this.optHeader = $(_.template(template['tpl/customerSetup/customerSetup.header.html'])({
                    data: this.userInfo
                }));
                this.optHeader.appendTo(this.$el.find(".opt-ctn"));

                this.collection.on("get.areaQuery.success", $.proxy(this.onDataArrival, this));
                this.collection.on("get.areaQuery.error", $.proxy(this.onGetError, this));

                //set.areaConf.success
                this.collection.on("set.areaConf.success", $.proxy(this.onSetAreaConfSuccess, this));
                this.collection.on("set.areaConf.error", $.proxy(this.onGetError, this));
                this.onClickQueryButton();

                //delete.areaRate.success
                this.collection.on("delete.areaRate.success", $.proxy(this.onDeleteSuccess, this));
                this.collection.on("delete.areaRate.error", $.proxy(this.onGetError, this));

                this.collection.on("set.rateUpdate.success", $.proxy(this.setRateUpdateSuccess, this));
                this.collection.on("set.rateUpdate.error", $.proxy(this.onGetError, this));


                this.$el.find(".add").on("click", $.proxy(this.onClickAdd, this));
                this.$el.find(".save").on("click", $.proxy(this.onClickSave, this));

            },

            setRateUpdateSuccess:function(){
                this.codeRateInfo.rate = this.$el.find("#input-value-manage").val().trim();
                Utility.alerts("修改成功！", "success", 5000);
            },

            onDeleteSuccess:function(){
                this.onClickQueryButton();
            },

            onSetAreaConfSuccess:function(){
                this.onClickQueryButton();
            },

            onClickSave:function(){
                var value = this.$el.find("#input-value-manage").val().trim();
                if(!value){
                    Utility.warning("请输入全局码率配置值");
                    return false;
                }
                var args = {
                    domains:[this.codeRateInfo.domains],
                    rateIds:[this.codeRateInfo.rateIds],
                    rate:value
                };
                this.collection.rateUpdate(args);
            },

            onClickQueryButton: function() {
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                //this.collection.queryParamsList(this.queryArgs);
                var args = {
                    rateId:this.codeRateInfo.rateIds
                };
                this.collection.areaQuery(args);                
            },

            onGetError: function(error) {
                if (error && error.message)
                    Utility.alerts(error.message)
                else
                    Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            },

            onDataArrival: function() {
                this.initTable();
            },

            initTable: function() {
                _.each(this.collection.models, function(item) {
                    var nodes = item.attributes.nodes;
                    var arrName = [];
                    var arrId = [];
                    _.each(nodes,function(ele){
                        arrName.push(ele.nodeName);
                        arrId.push(ele.nodeId);
                    });
                    item.attributes.nodeIds = arrId;
                    item.attributes.nodeNames = arrName;
                })
                this.table = $(_.template(template['tpl/customerSetup/codeRate/codeRateManage/codeRate.manage.table.html'])({
                    data: this.collection.models
                }));
                //this.$el.find(".table-ctn").html(this.table[0]);
                if (this.collection.models.length !== 0) {
                    this.$el.find(".table-ctn").html(this.table[0]);
                } else {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "暂无数据"
                        }
                    }));
                }
                this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            },

            onClickAdd: function(event) {
                if (this.codeRateAddPopup) $("#" + this.codeRateAddPopup.modalId).remove();
                var addView = new CodeRateAddView({
                    userId:this.userInfo.uid,
                    collection: this.collection,
                    selectedNodes:[]
                });
                var options = {
                    width:900,
                    title: "新建区域配置",
                    body: addView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var result =addView.getArgs();
                        if(!result){
                            return false;
                        }
                        result.videoRateId =this.codeRateInfo.rateIds;
                        this.collection.areaConf(result);
                        //this.initTable();
                        this.codeRateAddPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){}.bind(this)
                };
                this.codeRateAddPopup = new Modal(options);
            },

            onClickItemEdit: function(event) {
                var eventTarget = event.srcElement || event.target, id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                };

                var model = this.collection.get(id);
                var nodes = model.get("nodes");
                for(var i=0;i<nodes.length;i++){
                    nodes[i].id = nodes[i].nodeId;
                }
                if (this.codeRateAddPopup) $("#" + this.codeRateAddPopup.modalId).remove();
                var addView = new CodeRateAddView({
                    userId:this.userInfo.uid,
                    collection: this.collection,
                    selectedNodes:nodes,
                    model : model
                });
                var options = {
                    width:900,
                    title: "编辑区域配置",
                    body: addView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var result = addView.getArgs();
                        if(!result){
                            return false;
                        }
                        result.videoRateId =this.codeRateInfo.rateIds;
                        result.id = id;
                        this.collection.areaConf(result);
                        //this.initTable();
                        this.codeRateAddPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){}.bind(this)
                };
                this.codeRateAddPopup = new Modal(options);
                
            },

            onClickItemDelete: function(event){
                var eventTarget = event.srcElement || event.target, id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                };

                var options = {
                    title: "你确定要删除吗, 请谨慎操作！",
                    body: "<div style='color:red;'>请思考后决定</div>",
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var args = {
                            areaId:id
                        };
                        this.collection.areaDelete(args);
                        this.deleteNodeTipsPopup.$el.modal("hide");
                    }.bind(this)
                }
                this.deleteNodeTipsPopup = new Modal(options);
            },

            hide: function() {
                this.$el.hide();
            },

            update: function(query, query2, target) {
                this.options.query = query;
                this.options.query2 = query2;
                this.collection.off();
                this.collection.reset();
                this.$el.remove();
                this.initialize(this.options);
                this.render(target);
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });
        return CodeRateManageView;
    });