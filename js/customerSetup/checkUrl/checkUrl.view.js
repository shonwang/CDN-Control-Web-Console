define("checkUrl.view", ['require', 'exports', 'template', 'utility', "modal.view"],
    function(require, exports, template, Utility, Modal) {

        var DetailView = Backbone.View.extend({
            initialize:function(options){
                this.options = options;
                this.model = options.model;
                this.collection = options.collection;
                this.originVerifyCode = this.model.get("originVerifyCode");
                var data={};
                this.args = {
                    taskId:this.model.get('taskId'),
                    page:1,
                    size:5
                };
                this.collection.off("get.verifyNodeResult.success");
                this.collection.off("get.verifyNodeResult.error");
                
                this.collection.on("get.verifyNodeResult.success", $.proxy(this.bindDetailTable, this));
                this.collection.on("get.verifyNodeResult.error", $.proxy(this.getListError, this));

                this.$el = $(_.template(template['tpl/customerSetup/checkUrl/checkurl.edit.html'])({data:data}));
                //this.bindDetailTable();
                this.queryVerifyNodeResult();
            },

            showLoading:function() {
                this.$el.find(".pagination").html("");
                var ctn=this.$el.find(".ks-table tbody");
                var loadingCtn = $('<tr><td colspan="4" class="text-center">'+_.template(template['tpl/loading.html'])()+'</td></tr>');
                $(ctn).html(loadingCtn);
            },

            queryVerifyNodeResult:function(){
                this.showLoading();
                this.collection.verifyNodeResult(this.args);
            },

            bindDetailTable:function(data){
                var _rows = data.result.rows;
                this.total = data.result.total;
                this.tbodyList = $(_.template(template['tpl/customerSetup/checkUrl/checkUrl.detail.table.tbody.html'])({list:_rows,originVerifyCode:this.originVerifyCode}));
                this.$el.find(".ks-table tbody").html(this.tbodyList); 
                if(!this.isInitPaginator){
                    this.$el.find(".pagination").html("");
                    this.initPaginator();
                }                   
            },

            showNullData:function(){
                this.getListError("暂无数据");
            },

            getListError:function(res){
                var msg = res.message;
                var ctn=this.$el.find(".cdn-refresh-table tbody");
                var loadingCtn = $('<tr><td colspan="4" class="text-center">'+msg+'</td></tr>');
                $(ctn).html(loadingCtn);            
            },

            initPaginator: function(){
                this.$el.find(".total-items span").html(this.total)
                if (this.total <= this.args.size) return;
                var total = Math.ceil(this.total/this.args.size);

                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: 1,
                    onPageChange: function (num, type) {
                        if (type !== "init"){
                            var args = _.extend(this.args);
                            args.page = num;
                            args.size = this.args.size;
                            this.queryVerifyNodeResult(args);
                        }
                    }.bind(this)
                });
                this.isInitPaginator = true;
            },

            render:function(target){
                this.$el.appendTo(target);
            }            
        });

        var CheckUrlView = Backbone.View.extend({

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/customerSetup/checkUrl/checkUrl.home.html'])({}));
                var clientInfo = JSON.parse(options.query);
                this.userInfo = {
                    clientName: clientInfo.clientName,
                    uid: clientInfo.uid
                }
                this.checkArgs={
                    userId:this.userInfo.uid,
                    url:'',
                    verifyType:'',
                    originVerifyCode:''
                };
                this.args = {
                    page:1,
                    size:10,
                    url:'',
                    userId:this.userInfo.uid
                };

                this.collection.on("get.verifyResult.success", $.proxy(this.onDataArrival, this));
                this.collection.on("get.verifyResult.error", $.proxy(this.getListError, this));

                this.collection.on("set.verify.success", $.proxy(this.setVerifySuccess, this));
                this.collection.on("set.verify.error", $.proxy(this.setVerifyError, this));

                this.showLoading();
                this.onClickQueryButton();
                //this.setPageSize();
                /*域名查找按钮*/
                this.$el.find(".domain-search").on("click",$.proxy(this.onSearch,this));
                this.$el.find("#check-url-btnSubmit").on("click",$.proxy(this.onClickCheckBtn,this));
                this.$el.find("#text-domainName").on("focus",$.proxy(this.focus,this));
                this.$el.find("#text-origin-url-name").on("focus",$.proxy(this.focus,this));
                this.$el.find("[data-toggle='tooltip']").tooltip();
                this.setInitDropdownMenu();
                this.initUsersDropMenu();
                
            },
            onSearch:function(){
                this.isInitPaginator = false;
                this.onClickQueryButton();
            },
            setVerifyError:function(res){
                this.changeBtn();
                Utility.warning(res.message || "出现错误了");
            },

            setVerifySuccess:function(){
                Utility.alerts("检验成功！", "success", 5000);
                this.args.page = 1;
                this.isInitPaginator = false;
                this.changeBtn();
                this.onClickQueryButton();
            },

            focus:function(){
                this.$el.find("#url-name-error").hide();
                this.$el.find("#cdn-type-error").hide();
                this.$el.find("#origin-url-name-error").hide();
            },

            getCheckArgs:function(){
                var url = this.$el.find("#text-domainName").val();
                if(!url){
                    this.$el.find("#url-name-error").html("请输入校验URL").show();
                    return false;
                }
                this.checkArgs.url = url;

                if(!this.checkArgs.verifyType){
                    this.$el.find("#cdn-type-error").html('请选择校验方式').show();
                    return false;
                }
                var originVerifyCode = this.$el.find("#text-origin-url-name").val();
                if(!originVerifyCode){
                    this.$el.find("#origin-url-name-error").show();
                    return false;
                }
                this.checkArgs.originVerifyCode = originVerifyCode;
                return this.checkArgs;
            },

            onClickCheckBtn:function(){
                var result = this.getCheckArgs();
                if(!result){
                    return false;
                }
                this.changeBtn(true);
                this.collection.verify(result);
            },

            changeBtn:function(bool){
                if(bool){
                    this.$el.find("#check-url-btnSubmit").attr("disabled","disabled").html("正在校验...");
                }
                else{
                    this.$el.find("#check-url-btnSubmit").removeAttr("disabled").html("点击校验");   
                }
            },

            initUsersDropMenu: function(){
                var pageNum = [
                    {name: "10条", value: 10},
                    {name: "20条", value: 20},
                    {name: "50条", value: 50},
                    {name: "100条", value: 100}
                ]
                Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                    this.args.size = parseInt(value);
                    this.args.page = 1;
                    this.onSearch();
                }.bind(this));
            },

            setInitDropdownMenu:function(){
                var checkTypeArr = [
                    {name:"MD5",value:"MD5"},
                    {name:"CRC",value:"CRC"}
                ];
                var rootNode = this.$el.find('#dropdown-menu-check-type');
                    Utility.initDropMenu(rootNode, checkTypeArr, function(value) {
                        this.focus();
                        this.checkArgs.verifyType = value;
                }.bind(this));
            },


            getArgs:function(){
                var val = this.$el.find(".check-domain-input").val();
                this.args.url = val;
                return this.args;
            },

            showLoading:function(){
                this.$el.find(".pagination").html("");
                var ctn=this.$el.find(".cdn-refresh-table tbody");
                var loadingCtn = $('<tr><td colspan="7" class="text-center">'+_.template(template['tpl/loading.html'])()+'</td></tr>');
                $(ctn).html(loadingCtn);
            },

            toQueryMessage:function(){
                this.args.pageNumber = 1;
                this.isInitPaginator = false;

                var val = $(".refresh-domain-input").val();
                var re = /^\s+|\s+$/;
                this.args.searchText = val.replace(re,"");

                this.queryMessage();                
            },

            onClickQueryButton:function(){
                var args = this.getArgs();
                this.showLoading();
                this.collection.getVerifyResult(args);
            },

            onDataArrival:function(){
                var _data = this.collection.models;
                if(_data.length==0){
                    this.showNullData();
                }
                else{
                    this.tbodyList = $(_.template(template['tpl/customerSetup/checkUrl/checkUrl.table.tbody.html'])({list:_data}));
                    this.$el.find(".ks-table tbody").html(this.tbodyList); 
                    this.bindTbodyEvent();
                    // var totalPage = Math.ceil(this.collection.total/this.args.pageSize);
                    // this.$el.find(".pager-total-page").html(totalPage);
                    if(!this.isInitPaginator){
                        this.$el.find(".pagination").html("");
                        this.initPaginator();
                    }                    
                }
            },

            bindTbodyEvent:function(){
                this.tbodyList.find('.cdn-checkurl-detail').on("click",$.proxy(this.onShowDetail,this));
            },

            showNullData:function(){
                this.getListError("暂无数据");
            },

            getListError:function(msg){
                var ctn=this.$el.find(".cdn-refresh-table tbody");
                var loadingCtn = $('<tr><td colspan="7" class="text-center">'+msg+'</td></tr>');
                $(ctn).html(loadingCtn);            
            },

            onShowDetail:function(event){
                var target = event.target || event.srcElement;
                var id = $(target).attr("data-id");
                var model = this.collection.get(id);
                if (this.detailViewPopup){
                    $("#" + this.detailViewPopup.modalId).remove();
                }
                var detailView = new DetailView({
                    collection:this.collection,
                    model:model
                });

                var options = {
                    title:"<div><span></span>详情</div>",
                    body : detailView,
                    width:800,
                    backdrop :'statics',
                    type:2,
                    onOKCallback:function(){
                        this.detailViewPopup.$el.modal("hide");
                    }.bind(this),
                    onHideCallback:function(){
                       
                    }.bind(this)

                }
                this.detailViewPopup = new Modal(options);  
                
            },

            initDropMenuForPage: function (rootNode, typeArray,callback){
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
                        showNode.html($(eventTarget).attr("data-name"));
                        var value=$(eventTarget).attr("data-value");
                        var obj = {
                            value:value
                        };
                        callback&&callback(obj);
                    });
                    itemNode.appendTo(dropRoot);
                });
            },
            /*
            initPaginator: function(){
                var total = Math.ceil(this.collection.total/this.args.pageSize);
                this.$el.find(".pager-total-page").html(total);
                if (parseInt(this.collection.total) < this.args.pageSize){
                    return;
                }
                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: 1,
                    onPageChange: function (num, type) {
                        if (type !== "init"){
                            this.args.pageNumber = num;
                            this.queryMessage();
                        }
                    }.bind(this)
                });
                this.isInitPaginator = true;
            },
            */
            initPaginator: function(){
                this.$el.find(".total-items span").html(this.collection.total)
                if (this.collection.total <= this.args.size) return;
                var total = Math.ceil(this.collection.total/this.args.size);

                this.$el.find(".pagination").jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: 1,
                    onPageChange: function (num, type) {
                        if (type !== "init"){
                            var args = _.extend(this.args);
                            args.page = num;
                            args.size = this.args.size;
                            this.onClickQueryButton(args);
                        }
                    }.bind(this)
                });
                this.isInitPaginator = true;
            },

            showErrorMessage:function(msg){
                if(this.tips) {
                    this.tips.close();
                }
                var options = {
                    msg     :msg ,
                    type     : 0,
                    ctn :this.$el.find(".text-alert")
                }
                this.tips = new Alert(options);            
            },

            update:function(query, target){
                this.options.query = query;
                this.collection.off();
                this.collection.reset();
                this.$el.remove();
                this.initialize(this.options);
                this.render(target);                
            },

            show:function(){
                this.$el.show();
            },

            hide:function(){
                this.$el.hide();
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return CheckUrlView;   
    });
    