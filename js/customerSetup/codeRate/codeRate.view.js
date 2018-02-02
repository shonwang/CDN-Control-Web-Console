define("codeRate.view", ['require', 'exports', 'template', 'utility', "modal.view"],
    function(require, exports, template, Utility, Modal) {


        var RateConfig = Backbone.View.extend({
            initialize:function(options){
                this.collection = options.collection;
                this.model = options.model;
                this.$el = $(_.template(template['tpl/customerSetup/codeRate/codeRate.rateConfig.html'])({
                    data:this.model
                }));
            },

            getArgs:function(){
                var model = this.model;
                var domains = [];
                var rateIds = [];
                _.each(model,function(ele){
                    domains.push(ele.get("domain"));
                    rateIds.push(ele.get("id"));
                });

                var value = this.$el.find("#input-value").val().trim();
                if(!value){
                    alert("请填全局码率配置");
                    return false;
                }
                return {
                    domains:domains,
                    rateIds:rateIds,
                    rate:value
                }
            },

            render:function(target){
                this.$el.appendTo(target);
            }
        });

        var SelectDispView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.userId = options.userId;
                this.$el = $(_.template(template['tpl/customerSetup/codeRate/codeRate.select.disp.html'])());
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickSearchButton, this));
                this.$el.find(".opt-ctn .cancel-select").on("click", $.proxy(this.onClickCancelSelectButton, this));

                this.curPage = 1;
                this.initDispListDropMenu();

                this.queryArgs = {
                        "domain"  : null,//调度组名称
                        "userId": this.userId,//调度组状态
                        "currentPage"  : 1,
                        "pageSize" : 10
                    }
                this.refreshList();
            },

            getDispGroupList: function(){
                require(["domainList.model"], function(DomainListModel){
                    this.myDomainListModel = new DomainListModel();
                    this.myDomainListModel.on("query.domain.success", $.proxy(this.onGetDispGroupList, this));
                    this.myDomainListModel.on("query.domain.error", $.proxy(this.onGetError, this));
                    this.myDomainListModel.getDomainInfoList(this.queryArgs);
                }.bind(this))
            },

            enterKeyBindQuery: function(){
                $(document).on('keydown', function(e){
                    if(e.keyCode == 13){
                        this.onClickSearchButton();
                    }
                }.bind(this));
            },

            onClickSearchButton: function(){
                this.curPage = 1;
                this.refreshList();
            },

            refreshList: function(){
                this.isInitPaginator = false;
                this.queryArgs.page = this.curPage;
                this.queryArgs.domain = this.$el.find("#input-name").val().trim();
                if (this.queryArgs.name == "") this.queryArgs.name = null; 

                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.$el.find(".pagination").html("");
                this.getDispGroupList();
            },

            onGetDispGroupList: function(){
                this.initTable();
                if (!this.isInitPaginator) this.initPaginator();
            },


            initTable: function(){
                this.table = $(_.template(template['tpl/customerSetup/codeRate/codeRate.disp.table.html'])({
                    data: this.myDomainListModel.models,
                    permission:{}
                }));
                if (this.myDomainListModel.models.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

                this.table.find(".remark").popover();
                this.table.find("tbody input").on("click", $.proxy(this.onClickRadioButton, this));
            },

            onClickCancelSelectButton: function(){
                _.each(this.table.find("tbody input"), function(el){
                    el.checked = false;
                })
                this.options.onCancelSelectCallback && this.options.onCancelSelectCallback()
            },

            onClickRadioButton: function(event){
                var eventTarget = event.srcElement || event.target, 
                    id = $(eventTarget).attr("id");

                var dispName = $(eventTarget).siblings('span').html();

                var data = {
                    dispId: id,
                    dispName: dispName
                }

                this.options.onOKCallback && this.options.onOKCallback(data)
            },

            initPaginator: function () {
                this.$el.find(".total-items span").html(this.myDomainListModel.total)
                if (this.myDomainListModel.total <= this.queryArgs.pageSize) return;
                var total = Math.ceil(this.myDomainListModel.total / this.queryArgs.pageSize);
                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 5,
                    currentPage: this.curPage,
                    onPageChange: function (num, type) {
                        if (type !== "init") {
                            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                            var args = _.extend(this.queryArgs);
                            args.page = num;
                            this.curPage = num;
                            args.count = this.queryArgs.count;
                            this.refreshList();
                        }
                    }.bind(this)
                });
                this.isInitPaginator = true;
            },

            initDispListDropMenu: function(){
                var pageNum = [
                    {name: "10条", value: 10},
                    {name: "20条", value: 20},
                    {name: "50条", value: 50},
                    {name: "100条", value: 100}
                ]
                Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                    this.queryArgs.count = value;
                    this.refreshList();
                }.bind(this));
            },

            onGetError: function(error){
                if (error&&error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            render: function(target) {
                this.$el.appendTo(target);
                this.enterKeyBindQuery();
            }
        }); 

        var CodeRateAddView = Backbone.View.extend({

            initialize: function(options) {
                this.options = options;
                this.userId = options.userId;
                this.collection = options.collection;
                this.model = options.model;

                this.$el = $(_.template(template['tpl/customerSetup/codeRate/codeRate.add.html'])({
                    data: this.args
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
                var stream = this.$el.find("#stream-label").val().trim(),
                    rate = this.$el.find("#input-value").val().trim();

                if (stream === "") {
                    alert("流名不能为空！")
                    return false;
                }

                var repeatList = this.collection.filter(function(model){
                    return model.get("stream") === stream
                }.bind(this))

                if (repeatList.length > 0) {
                    alert(stream + " 控制台显示值已经添加过了!")
                    return false
                }
                var domain = this.domainSelect;
                if(!domain){
                    alert("请选择域名");
                    return false;
                }
                return {
                    stream:stream,
                    rate:rate,
                    domain:domain
                }
            },

            initDispList: function(){
                var mySelectDispView = new SelectDispView({
                    curModel: this.model,
                    userId:this.userId,
                    collection: this.collection,
                    onOKCallback: function(data){
                        this.domainSelect = data.dispName;
                        this.$el.find(".disp-domain .disp-domain-html").html(data.dispName)
                    }.bind(this),
                    onCancelSelectCallback: function(){
                        //this.currentDispId = this.model.get('dispId');
                        this.domainSelect = "";
                        this.$el.find(".disp-domain .disp-domain-html").html("请选择域名");
                    }.bind(this)
                });
                mySelectDispView.render(this.$el.find(".disp-list-ctn"))
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        var CodeRateView = Backbone.View.extend({

            initialize: function(options) {
                this.collection = options.collection;
                this.options = options;

                this.$el = $(_.template(template['tpl/customerSetup/codeRate/codeRate.home.html'])());
                var clientInfo = JSON.parse(options.query);
                this.userInfo = {
                    clientName: clientInfo.clientName,
                    uid: clientInfo.uid
                }
                this.optHeader = $(_.template(template['tpl/customerSetup/customerSetup.header.html'])({
                    data: this.userInfo
                }));
                this.optHeader.appendTo(this.$el.find(".opt-ctn"));

                this.queryArgs = {
                    "userId": clientInfo.uid,
                    "streamName": ""
                }

                this.args1 = JSON.stringify({
                    clientName: this.userInfo.clientName,
                    uid: this.userInfo.uid
                });

                //this.onParamsListSuccess();
                this.collection.on("get.rate.success", $.proxy(this.onGetRateSuccess, this));
                this.collection.on("get.rete.error", $.proxy(this.onGetError, this));
                this.collection.on("set.rateConf.success", function() {
                    alert("添加成功！")
                    this.onClickQueryButton();
                }.bind(this));
                this.collection.on('set.rateConf.error', $.proxy(this.onGetError, this));

                this.collection.on("delete.rate.success", $.proxy(this.onDeleteSuccess, this));
                this.collection.on("delete.rete.error", $.proxy(this.onGetError, this));


                this.collection.on("set.rateUpdate.success", $.proxy(this.setRateUpdateSuccess, this));
                this.collection.on("set.rateUpdate.error", $.proxy(this.onGetError, this));


                this.$el.find(".add").on("click", $.proxy(this.onClickAdd, this));
                this.$el.find(".modify").on("click", $.proxy(this.onClickModify, this));
                this.$el.find("#cdn-search-btn").on("click", $.proxy(this.onClickSearchButton, this));


                //this.collection.rateQuery();

                this.onClickQueryButton();
            },

            onClickSearchButton:function(){
                this.queryArgs.streamName = this.$el.find("#cdn-search-text").val().trim();
                this.onClickQueryButton();
            },

            setRateUpdateSuccess:function(){
                this.onClickQueryButton();
            },

            onDeleteSuccess:function(){
                this.onClickQueryButton();
            },

            onClickModify:function(){
                var list = _.filter(this.collection.models, function(obj){
                    return obj.isChecked === true;
                })
                if(list.length ==0 ){
                    alert("请选择至少一项，再进行修改");
                    return false;
                }

                if (this.rateConfigPopup) $("#" + this.rateConfigPopup.modalId).remove();
                var rateConfig = new RateConfig({
                    collection: this.collection,
                    model:list
                });
                var options = {
                    title: "批量修改",
                    body: rateConfig,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var result = rateConfig.getArgs();
                        if(!result){
                            return false;
                        }
                        this.collection.rateUpdate(result);
                        this.rateConfigPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){}.bind(this)
                };
                this.rateConfigPopup = new Modal(options);
            },

            onClickItemModify:function(event){
                var eventTarget = event.srcElement || event.target, id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                };

                var selectedObj = _.find(this.collection.models, function(object) {
                    return object.id === parseInt(id)
                }.bind(this));
                if (this.rateConfigPopup) $("#" + this.rateConfigPopup.modalId).remove();
                var rateConfig = new RateConfig({
                    collection: this.collection,
                    model:[selectedObj]
                });
                var options = {
                    title: "批量修改",
                    body: rateConfig,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var result = rateConfig.getArgs();
                        if(!result){
                            return false;
                        }
                        this.collection.rateUpdate(result);
                        this.rateConfigPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){}.bind(this)
                };
                this.rateConfigPopup = new Modal(options);

            },

            onClickQueryButton: function() {
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.collection.rateQuery(this.queryArgs);
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            onGetRateSuccess: function() {
                this.initTable();
            },

            initTable: function() {
                this.table = $(_.template(template['tpl/customerSetup/codeRate/codeRate.table.html'])({
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
                this.table.find("tbody .manage").on("click", $.proxy(this.onClickItemManage, this));
                this.table.find("tbody .modify").on("click", $.proxy(this.onClickItemModify, this));
                this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            },

            onItemCheckedUpdated: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                var id = $(eventTarget).attr("id");

                var selectedObj = _.find(this.collection.models, function(object) {
                    return object.id === parseInt(id)
                }.bind(this));

                selectedObj.isChecked = eventTarget.checked;

                var checkedList = this.collection.models.filter(function(object) {
                    return object.isChecked === true;
                })
                if (checkedList.length === this.collection.models.length){
                    this.table.find("thead input").get(0).checked = true;
                }
                else{
                    this.table.find("thead input").get(0).checked = false;
                }

            },

            onAllCheckedUpdated: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                this.table.find("tbody tr").find("input").each(function(index, node) {
                    $(node).prop("checked", eventTarget.checked);
                    _.each(this.collection.models, function(el){
                        if (el.id === parseInt(node.id)) el.isChecked = eventTarget.checked;
                    }.bind(this))
                }.bind(this))
    
            },            

            onClickAdd: function(event) {
                if (this.codeRateAddPopup) $("#" + this.codeRateAddPopup.modalId).remove();
                var addView = new CodeRateAddView({
                    userId:this.userInfo.uid,
                    collection: this.collection
                });
                var options = {
                    title: "新增配置",
                    body: addView,
                    backdrop: 'static',
                    type: 2,
                    onOKCallback: function() {
                        var result = addView.getArgs();
                        if(!result){
                            return false;
                        }
                        result.userId = this.userInfo.uid;
                        console.log(12313123);
                        this.collection.rateConf(result);
                        this.codeRateAddPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){}.bind(this)
                };
                this.codeRateAddPopup = new Modal(options);
            },

            onClickItemManage: function(event) {
                var eventTarget = event.srcElement || event.target, id;
                if (eventTarget.tagName == "SPAN") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                };
                var model = this.collection.get(id);

                this.redirectToManage(id,model);
            },

            redirectToManage:function(id,model){
                var stream = model.get("stream");
                var domains = model.get("domain");
                var rateIds = model.get("id");
                var rate = model.get("rate");
                var idList = {
                    stream:stream,
                    domains:domains,
                    rateIds:rateIds,
                    rate:rate
                };
                var obj = JSON.stringify(idList);
                window.location.hash = '#/codeRate/' + this.args1 + "/manage/" + obj;
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
                            rateId:id
                        };
                        this.collection.rateDelete(args);
                        this.deleteNodeTipsPopup.$el.modal("hide");
                    }.bind(this)
                }
                this.deleteNodeTipsPopup = new Modal(options);


                
            },

            hide: function() {
                this.$el.hide();
            },

            update: function(query, target) {
                this.options.query = query;
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
        return CodeRateView;
    });