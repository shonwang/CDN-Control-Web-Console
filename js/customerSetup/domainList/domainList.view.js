define("domainList.view", ['require','exports', 'template', 'utility', "modal.view"],
    function(require, exports, template, Utility, Modal) {

    var DomainListView = Backbone.View.extend({
        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/domainList.home.html'])({}));

            var clientInfo = JSON.parse(options.query);
            this.userInfo = {
                clientName: clientInfo.clientName,
                uid: clientInfo.uid
            }

            this.optHeader = $(_.template(template['tpl/customerSetup/customerSetup.header.html'])({
                data: this.userInfo
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.collection.on("query.domain.success",$.proxy(this.queryDomainSuccess,this));
            this.collection.on("query.domain.error",$.proxy(this.queryDomainError,this));

            this.collection.on("change.confCustomType.success", $.proxy(this.changeConfCustomTypeSuccess, this))
            this.collection.on("change.confCustomType.error", $.proxy(this.changeConfCustomTypeError, this))

            this.$el.find("#cdn-search-btn").bind('click',$.proxy(this.onClickSearchBtn,this));
            this.$el.find(".add-domain").bind('click',$.proxy(this.onClickAddDomain,this));
            if(!AUTH_OBJ.CreateCustomerDomain) {
                this.$el.find('.add-domain').remove();
            }
            this.showLoading();
            this.args = {
                pageSize: 10,//每页N条数据
                currentPage: 1,
                userId: this.userInfo.uid,
                domain:''         
            };
            this.toQueryDomain();
            this.setDropDownMenu();
        },

        onClickAddDomain: function(event){
            require(['domainList.addDomain.view'], function(DomainListAddDomainView){

                this.$el.find(".main-list").hide();

                var options = {
                    collection: this.collection,
                    userInfo: this.userInfo,
                    okCallback: $.proxy(this.onAddedDomain, this),
                    cancelCallback: $.proxy(this.onCancelAddDomain, this)
                };
                this.addDomainView = new DomainListAddDomainView.AddDomainView(options);
                this.addDomainView.render(this.$el.find(".new-domain"));
            }.bind(this));            
        },

        onCancelAddDomain: function(){
            this.addDomainView.$el.remove()
            this.addDomainView = null;
            this.$el.find(".main-list").show();
        },

        onAddedDomain: function(){
            this.onCancelAddDomain();
            this.onClickSearchBtn();
        },

        onClickSearchBtn:function(){
            var value = this.$el.find("#cdn-search-text").val().trim();
            this.args.domain = value || '';
            this.isInitPaginator = false;
            this.args.currentPage = 1;
            this.toQueryDomain();
        },

        toQueryDomain:function(){
            var args = this.args;
            this.showLoading();
            //this.collection.queryDomain(args);
            this.collection.getDomainInfoList(args);
        },

        showLoading:function(){
            this.$el.find(".pagination").html("");
            this.$el.find(".ks-table tbody").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
        },    

        queryDomainSuccess:function(data){
            this.total = this.collection.total || 0;        

            if (this.collection.models.length == 0) {
                this.setNoData("未查到符合条件的数据，请重新查询");
            } else {
                this.tbodyList = $(_.template(template['tpl/customerSetup/domainList/domainList.table.tbody.html'])({data:this.collection.models}));
                this.$el.find(".ks-table tbody").html(this.tbodyList);
                this.$el.find(".ks-table tbody .manage").on("click", $.proxy(this.onClickItemManage, this));
                if(!AUTH_OBJ.SetupCustomerDomain){
                    this.$el.find(".ks-table tbody .manage").remove();
                }
                this.$el.find(".ks-table tbody .setup-bill").on("click", $.proxy(this.onClickViewSetupBillBtn, this));  
                if(!AUTH_OBJ.ViewSetupDetails){
                    this.$el.find(".ks-table tbody .setup-bill").remove();
                }
            }

            if(!this.isInitPaginator){
                this.$el.find(".pagination").html('');
                this.initPaginator();
            }
        },

        onClickViewSetupBillBtn: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            require(['setupBillLive.view', 'setupBill.model'], function(SetupBillView, SetupBillModel){
                var mySetupBillModel = new SetupBillModel();
                var mySetupBillView = new SetupBillView({
                    collection: mySetupBillModel,
                    originId: id,
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){
                        mySetupBillView.$el.remove();
                        this.$el.find(".main-list").show();
                    }.bind(this)
                })

                this.$el.find(".main-list").hide();
                mySetupBillView.render(this.$el.find(".bill-panel"));
            }.bind(this))
        },

        onClickItemManage: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id), 
                whereAreYouFrom = model.get("confCustomType");//等于2时来自openAPI

            this.args = JSON.stringify({
                clientName: this.userInfo.clientName,
                uid: this.userInfo.uid
            });
            this.args2 = JSON.stringify({
                id: model.get("id"),
                domain: model.get("domain")
            });

            if (whereAreYouFrom === 2) {
                this.alertChangeType(model.get("id"));
                return;
            }

            this.redirectToManage();
        },

        redirectToManage: function(){
            window.location.hash = '#/domainList/' + this.args + "/basicInformation/" + this.args2;
        },

        alertChangeType: function(id){
            if (this.commonPopup) $("#" + this.commonPopup.modalId).remove();

            var message = `<div class="alert alert-danger">
                                <strong>重要提示: </strong><br>
                                使用中控对域名进行编辑管理后，该域名在控制台或使用OpenAPI进行修改下发配置
                           </div>`;
            var options = {
                title: "警告",
                body : message,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    this.collection.changeConfCustomType({
                        originId: id,
                        confCustomType: 1
                    })
                    this.commonPopup.$el.modal('hide');
                }.bind(this),
                onCancelCallback: function(){
                    this.commonPopup.$el.modal('hide');
                }.bind(this)
            }

            this.commonPopup = new Modal(options);
        },

        changeConfCustomTypeSuccess: function(){
            alert("变更成功")
            this.redirectToManage();
        },

        changeConfCustomTypeError: function(res){
            alert("变更失败: " + res)
        },

        setNoData:function(msg){
            this.$el.find(".ks-table tbody").html('<tr><td  colspan="8" class="text-center"><p class="text-muted text-center">'+msg+'</p></td></tr>');
        },

        queryDomainError:function(data){
            var msg = data && data.message || "查询出现错误";
            this.setNoData(msg);
        },

        setDropDownMenu:function(){
            //业务类型
            var ctn = this.$el.find("#cdnType-dropdown");
            
            var dateArray = [
                {name:"全部",value:""},
                {name:"下载加速",value:"download"},
                {name:"直播加速",value:"live"}
            ];
            this.initDropMenu(ctn,dateArray,"业务类型",function(obj){
                this.args.CdnType = obj.value;
                this.isInitPaginator = false;
                this.args.PageNumber = 1;
                this.toQueryDomain();
            }.bind(this));
            
            //状态
            var ctn = this.$el.find("#cdnStatus-dropdown");
            var dateArray = [
                {name:"全部",value:""},
                {name:"正常运行",value:"online"},
                {name:"已停止",value:"offline"},
                {name:"配置中",value:"configuring"},
                {name:"配置失败",value:"configure_failed"},
                {name:"审核中",value:"icp_checking"},
                {name:"审核失败",value:"icp_check_failed"}
            ];
            this.initDropMenu(ctn,dateArray,"状态",function(obj){
                this.args.DomainStatus = obj.value;
                this.isInitPaginator = false;
                this.args.PageNumber = 1;
                this.toQueryDomain();
            }.bind(this));  
        },

        initDropMenu: function (rootNode, typeArray,title,callback){
            var dropRoot = rootNode.find(".ks-dropdown-menu"),
                showNode = rootNode.find(".cur-caret");
            dropRoot.html("");
            _.each(typeArray, function(element, index, list){
                var itemTpl = '<li data-value="' + element.value + '" data-name="'+ element.name +'">' + 
                                  '<a data-value="' + element.value + '" data-name="'+ element.name +'" href="javascript:void(0);">'+ element.name + '</a>' + 
                            '</li>',
                itemNode = $(itemTpl);
                itemNode.on("click", function(event){
                    var eventTarget = event.srcElement || event.target;
                    var name=title + "("+$(eventTarget).attr("data-name")+")";
                    showNode.html(name);
                    var value=$(eventTarget).attr("data-value");
                    var obj = {
                        value:value
                    };
                    callback&&callback(obj);
                });
                itemNode.appendTo(dropRoot);
            });
        },

        initPaginator: function(){
            var totalCount =this.total;
            if (totalCount < this.args.pageSize){ return};
            var total = Math.ceil(totalCount/this.args.pageSize);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.args.currentPage = num;
                        this.toQueryDomain();
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query, target){
            this.isInitPaginator = false;
            this.options.query = query;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target){
            this.$el.appendTo(target);
        }

    });

    return DomainListView;

});