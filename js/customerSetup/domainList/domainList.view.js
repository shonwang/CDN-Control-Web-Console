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
            this.$el.find("#cdn-search-btn").bind('click',$.proxy(this.onClickSearchBtn,this));
            this.$el.find(".add-domain").bind('click',$.proxy(this.onClickAddDomain,this));
            this.showLoading();
            this.args = {
                PageSize:5,//每页N条数据
                PageNumber:1,
                DomainName:'',
                DomainStatus:'',
                CdnType:'',
                FuzzyMatch:'on'//域名过滤是否使用模糊匹配，取值为on：开启，off：关闭，默认为on                
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

        onAddedDomain: function(){},

        onClickSearchBtn:function(){
            var value = this.$el.find("#cdn-search-text").val().trim();
            this.args.DomainName = value || '';
            this.isInitPaginator = false;
            this.args.PageNumber = 1;
            this.toQueryDomain();
        },

        toQueryDomain:function(){
            var args = this.args;
            this.showLoading();
            //this.collection.queryDomain(args);
            this.queryDomainSuccess();
        },

        showLoading:function(){
            this.$el.find(".pagination").html("");
            this.$el.find(".ks-table tbody").html('<tr><td  colspan="6" class="text-center"><div class="spinner">正在加载...</div></td></tr>');
        },    

        queryDomainSuccess:function(data){
            data = {
                "data": {
                    "PageNumber": 1.0,
                    "PageSize": 5.0,
                    "TotalCount": 11.0,
                    "Domains": [
                        {
                            "Description": "",
                            "DomainId": "2D09RBX",
                            "DomainName": "www.nsw88.com",
                            "CdnType": "download",
                            "CdnSubType": "live",
                            "DomainStatus": "online",
                            "Cname": "www.nsw88.com.download.ks-cdn.com",
                            "CreatedTime": "2016-09-23T10:34+0800",
                            "IcpRegistration": "粤ICP备09123656号-9",
                            "ModifiedTime": new Date().format("yyyy/MM/dd hh:mm")
                        }, {
                            "Description": "",
                            "DomainId": "2D09RC0",
                            "DomainName": "www.bjjfsd.com",
                            "CdnType": "download",
                            "CdnSubType": "live",
                            "DomainStatus": "online",
                            "Cname": "www.bjjfsd.com.download.ks-cdn.com",
                            "CreatedTime": "2016-09-23T10:33+0800",
                            "IcpRegistration": "京ICP备12041088号-1",
                            "ModifiedTime": new Date().format("yyyy/MM/dd hh:mm")
                        }
                    ]
                }
            };

            this.total = data.data && data.data.TotalCount || 0;
            var _data = data.data && data.data.Domains || [];
            _.each(_data, function(el, index, list){
                var cdnType   = el["CdnType"];
                if(cdnType == 'download'){
                    el["CdnTypeName"]="下载加速";
                }
                else if(cdnType == 'live'){
                    el["CdnTypeName"]="直播加速";
                }
                //状态
                var domainStatus = el["DomainStatus"];
                if(domainStatus == "online"){
                    el["DomainStatusName"]='<span class="text-primary">正常运行</span>';
                }
                else if(domainStatus == "offline"){
                    el["DomainStatusName"]='<span class="text-danger">已停止</span>';
                }
                else if(domainStatus == "configuring"){
                    el["DomainStatusName"]='<span class="text-warning">配置中</span>';
                }
                else if(domainStatus == "configure_failed"){
                    el["DomainStatusName"]='<span class="text-danger">配置失败</span>';
                }
                else if(domainStatus == "icp_checking"){
                    el["DomainStatusName"]='<span class="text-warning">审核中</span>';
                }
                else if(domainStatus == "icp_check_failed"){
                    el["DomainStatusName"]='<span class="text-danger">审核失败</span>';
                }
                if (el.ModifiedTime){
                    //el.ModifiedTime = el.ModifiedTime.formatGMT("yyyy/MM/dd hh:mm");
                }
                el.id = el.DomainId;
                this.collection.push(new this.collection.model(el))
            }.bind(this))            

            if(_data.length == 0){
                this.setNoData("未查到符合条件的数据，请重新查询");
            }
            else{
                this.tbodyList = $(_.template(template['tpl/customerSetup/domainList/domainList.table.tbody.html'])({data:_data}));
                this.$el.find(".ks-table tbody").html(this.tbodyList);
                this.$el.find(".ks-table tbody .manage").on("click", $.proxy(this.onClickItemManage, this));
                this.$el.find(".ks-table tbody .setup-bill").on("click", $.proxy(this.onClickViewSetupBillBtn, this));  
            }

            this.tbodyList.find("");

            if(!this.isInitPaginator){
                this.$el.find(".pagination").html('');
                this.initPaginator();
            }
        },

        onClickViewSetupBillBtn: function(){
            require(['setupBill.view', 'setupBill.model'], function(SetupBillView, SetupBillModel){
                var mySetupBillModel = new SetupBillModel();
                var mySetupBillView = new SetupBillView({
                    collection: mySetupBillModel,
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

            var model = this.collection.get(id), args = JSON.stringify({
                clientName: this.userInfo.clientName,
                uid: 123456
            }), args2 = JSON.stringify({
                domain: model.get("DomainName")
            })

            window.location.hash = '#/domainList/' + args + "/domainSetup/" + args2
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
            if (totalCount < this.args.PageSize){ return};
            var total = Math.ceil(totalCount/this.args.PageSize);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 5,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.args.PageNumber = num;
                        this.toQueryDomain();
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query){
            this.options.query = query;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(this.target);
        },

        render: function(target){
            this.$el.appendTo(target);
            this.target = target;
        }

    });

    return DomainListView;

});