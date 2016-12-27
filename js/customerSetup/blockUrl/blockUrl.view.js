define('blockUrl.view',['utility','template'],function(Utility,template){
	var TabBlockUrlView = Backbone.View.extend({
        events:{},
        initialize: function(options){
        	this.collection = options.collection;
        	this.userInfo = options.userInfo;
        	this.$el = $(_.template(template['tpl/customerSetup/blockUrl/TabBlockUrl.html'])());
            
            this.collection.off('get.GuestQuotaCount.success');
            this.collection.off('get.GuestQuotaCount.error');
            this.collection.on('get.GuestQuotaCount.success',$.proxy(this.getCountSuccess,this));
            this.collection.on('get.GuestQuotaCount.error',$.proxy(this.onGetError,this));
          //  this.collection.getGuestQuotaCount({userId:this.userInfo.uid});
            this.collection.getGuestQuotaCount({userId:1});
            
            this.collection.off('blockUrls.success');
            this.collection.off('blockUrls.error');
            this.collection.on('blockUrls.success',$.proxy(this.blockUrlsSuccess,this));
            this.collection.on('blockUrls.error',$.proxy(this.onGetError,this));

            this.$el.find('#submitBlock').on('click',$.proxy(this.onClickSubmitBlockButton,this));        
        
        },
        getCountSuccess: function(res){
            res = JSON.parse(res);
            if(res.result != null){
                this.$el.find('.quotaCount').text(res.result.quotaCount);
                this.$el.find('.quotaEffecitveCount').text(res.result.quotaEffecitveCount);
            }
        },
        blockUrlsSuccess: function(){
             $('a[data-target="#blockUrlList"]').click();
             alert('操作成功');
        },
        onGetError: function(error){
             if(error && error.message){
             	alert(error.message);
             }else{
             	alert('网络阻塞，请刷新重试！')
             }    
        },
        urlsvalidation: function(urls){
            var urls = urls;
            var quotaEffecitveCount = this.$el.find('.quotaEffecitveCount').text();
            if(urls.substr(urls.length-1,urls.length) == ';')  //若最后一个字符为分号,则去掉
                urls = urls.substr(0,urls.length-1); 
            if(urls === "") {
                alert('URL不能为空');
                return false;
            }else{
                if(urls.indexOf(';') > -1){
                    url = urls.split(';');
                    if(url.length > parseInt(quotaEffecitveCount)){
                        alert('已超过最大提交数量');
                        return false;
                    }
                    for(var i = 0; i<url.length; i++){
                        var urlEvery = url[i];
                        var urlEveryLength = url[i].length;
                        if(urlEvery.substr(0,1)=='\n') urlEvery=urlEvery.substr(1);
                        if(!Utility.isURL(urlEvery)){
                            alert('第'+ (i+1) +'个URL输入有误');
                            return false;
                        }
                    }
                }else if(!Utility.isURL(urls)){
                    alert('URL输入有误');
                    return false;
                }
            }
            return true;
        },
        onClickSubmitBlockButton: function(){
            var urls = this.$el.find('#urls').val();
            //console.log(this.urlsvalidation(urls));
        	if(this.urlsvalidation(urls)){
               urls = urls.split(';');
               var args = {
                   userId: this.userInfo.uid,
                   urls:urls
                }
                this.collection.blockUrls(args);
            };
        },
        render: function(target){
           this.$el.appendTo(target);
        }
	});

    var TabCurrentBlockListView = Backbone.View.extend({
        events:{},
        initialize: function(options){
        	this.collection = options.collection;
            this.userInfo = options.userInfo;
            this.$el = $(_.template(template['tpl/customerSetup/blockUrl/TabCurrentBlockList.html'])());
            this.initblockListDropmenu();
            
            $(document).on('keydown',$.proxy(this.onKeydownEnter,this));
            
            this.$el.find('.query').on('click',$.proxy(this.onClickQueryButton,this));
            this.$el.find('.ks-table').on('change',$.proxy(this.onClickOptions,this));
            this.$el.find('.RefreshUrl').on('click',$.proxy(this.onClickRefresh,this));
            
            this.collection.off('get.blockList.success');
            this.collection.off('get.blockList.error');
            this.collection.on('get.blockList.success',$.proxy(this.getblockListSuccess,this));
            this.collection.on('get.blockList.error',$.proxy(this.onGetError,this));
            
            this.queryArgs = {
	            page:1,
	            rows:10,
	            op: 0,
	            searchUrl: "",
	           // userId:this.userInfo.uid
                userId:1
            }
            this.blockUrlParam = {
                taskId: "",
                isNeedFresh: false
            }

            this.onClickQueryButton();
        },
        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.showloading();
            this.$el.find('thead input').prop('checked',false);
            this.collection.showCurrentBlockUrls(this.queryArgs);
        },
        onKeydownEnter: function(event){
            if(event.keyCode == 13) this.onClickQueryButton();
        },
        onClickRefresh: function(event){
            var eventTarget = event.target || event.srcElement;
            this.blockUrlParam.isNeedFresh = eventTarget.checked;
        },
        onClickOptions: function(event){
             var eventTarget = event.target || event.srcElement;
             var id = $(eventTarget).attr("id"),
                 model = this.collection.get(id),
                 AllChecked =  this.$el.find('thead input');
                 UnblockButton = this.$el.find('.unblock');
                 RefreshUrl = this.$el.find('.RefreshUrl');
             
             if(eventTarget.value == AllChecked.val()){
                this.table.find('input').prop('checked',eventTarget.checked);
                this.collection.each(function(model){
                    model.set("isChecked", eventTarget.checked);
                }.bind(this))
             }else{
                model.set('isChecked',eventTarget.checked);
             }

             var checkedList = this.collection.filter(function(model){
                return model.get('isChecked') === true;
             })
             
             if(checkedList.length > 0){
               if(checkedList.length == this.collection.models.length){
                  AllChecked.prop('checked',true);
               }else{
                  AllChecked.prop('checked',false);
               }
               UnblockButton.removeAttr('disabled');
               RefreshUrl.removeAttr('disabled');
               UnblockButton.off('click');
               UnblockButton.on('click',$.proxy(this.unblock,this));
             }else{
               UnblockButton.attr('disabled','disabled');            
               RefreshUrl.attr('disabled','disabled');
               UnblockButton.off('click');
             }
        },
        unblock: function(){
            var taskIdArray = [],taskId;
             _.each(this.collection.models,function(el,index,list){
                if(el.get('isChecked') == true){
                   taskIdArray.push(el.id);
                }
            })
            taskId = taskIdArray.join(',');
            this.blockUrlParam.taskId = taskId;
            
            alert('解除屏蔽');
        },
        initblockListDropmenu: function(){
            var statusArray = [
               {name:'全部',value:0},
               {name:'屏蔽成功',value:1},
               {name:'屏蔽失败',value:2},
               {name:'屏蔽中',value:3},
               {name:'解除屏蔽中',value:4},
               {name:'解除屏蔽失败',value:5}
            ];
            rootNode = this.$el.find('.dropdown-state');
            Utility.initDropMenu(rootNode,statusArray,function(value){
                this.queryArgs.op = parseInt(value);
            }.bind(this));

            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ];
            rootNode = this.$el.find('.page-num');
            Utility.initDropMenu(rootNode,pageNum,function(value){
                 this.queryArgs.rows = parseInt(value);
                 this.onClickQueryButton();
            }.bind(this));

        },
        showloading: function(){
            this.$el.find(".pagination").html("");
            this.$el.find(".ks-table tbody").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
        },
        getblockListSuccess: function(){
             this.initTable();
             if(!this.isInitPaginator) this.initPaginator();
        },
        initTable: function(){
             var data = this.collection.models;
             this.table = $(_.template(template['tpl/customerSetup/blockUrl/TabCurrentBlockList.table.html'])({data:data}));
             if(data.length == 0){
                this.isInitPaginator = true;
                this.$el.find('.table-ctn').html(_.template(template['tpl/empty.html'])())
             }else{
                this.$el.find('.ks-table tbody').html(this.table);
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
                        this.$el.find(".ks-table tbody").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
                        var args = _.extend(this.queryArgs);
                        args.currentPage = num;
                        args.count = this.queryArgs.pageSize;
                        this.collection.queryChannel(args);
                        this.$el.find('thead input').prop('checked',false);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },
        onGetError: function(error){
            if(error && error.message){
                alert(error.message);
            }else{
                alert('网络阻塞，请刷新重试!');
            }
        },
        render: function(target){
            this.$el.appendTo(target);
        }
    });
	
	var TabHistoryView = Backbone.View.extend({
        events:{},
        initialize: function(options){
        	this.$el = $(_.template(template['tpl/customerSetup/blockUrl/TabHistory.html'])());
            this.initHistoryDropMenu();
            this.$el.find('.query').on('click',$.proxy(this.onClickQueryButton,this));
            this.collection.off('get.history.success');
            this.collection.off('get.history.error');
            this.collection.on('get.history.success',$.proxy(this.gethistorySuccess,this));
            this.collection.on('get.history.error',$.proxy(this.onGetError,this));
            this.queryArgs = {
                domainName: "", 
                userId: "", 
                email: "", 
                companyName: "", 
                currentPage: 1, 
                pageSize: 10
            };
            this.onClickQueryButton();

        },
        initHistoryDropMenu: function(){
            var timeArray = [
              {name:'最近7天',value:null},
              {name:'最近30天',value:null}
            ]
            rootNode = this.$el.find('.dropdown-time');
            Utility.initDropMenu(rootNode,timeArray,function(){

            }.bind(this));

            var operatorArray = [
               {name:'屏蔽',value:null},
               {name:'解除屏蔽',value:null}
            ]
            rootNode = this.$el.find('.dropdown-operator');
            Utility.initDropMenu(rootNode,operatorArray,function(){

            }.bind(this));

            var pageNum = [
                {name:'10条',value:10},
                {name:'20条',value:20},
                {name:'50条',value:50},
                {name:'100条',value:100}
            ]
            rootNode = this.$el.find('.page-num');
            Utility.initDropMenu(rootNode,pageNum,function(value){
               this.queryArgs.pageSize = value;
               this.onClickQueryButton();
            }.bind(this));
        },
        onClickQueryButton: function(){
            this.showloading();
            this.isInitPaginator = false;
            this.collection.queryHistory(this.queryArgs);
        },
        gethistorySuccess: function(){
            this.initTable();
            if(!this.isInitPaginator) this.initPaginator();
        },
        initTable: function(){
           var data = this.collection.models;
           this.table = $(_.template(template['tpl/customerSetup/blockUrl/TabHistory.table.html'])({data:data}));
           if(data.length == 0){
             this.$el.find('.table-ctn').html(_.template(template['tpl/empty.html']));
           }else{
             this.$el.find('.ks-table tbody').html(this.table);
           }
        },
        initPaginator: function(){
           this.$el.find('.text-primary').html(this.collection.total);
           if(this.collection.total < this.queryArgs.pageSize) return;
           var total = Math.ceil(this.collection.total/this.queryArgs.pageSize);

           this.$el.find('.pagination').jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".ks-table tbody").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
                        var args = _.extend(this.queryArgs);
                        args.currentPage = num;
                        args.count = this.queryArgs.pageSize;
                        this.collection.queryHistory(args);
                    }
                }.bind(this)
           });
           this.isInitPaginator = true;
        },
        showloading: function(){
            this.$el.find(".pagination").html("");
            this.$el.find(".ks-table tbody").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
        },
        render: function(target){
        	this.$el.appendTo(target);
        }
	});
	
	var BlockUrlView = Backbone.View.extend({
		events:{},
		initialize: function(options){
			this.collection = options.collection;
            this.$el = $(_.template(template['tpl/customerSetup/blockUrl/blockUrl.html'])());
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(this.onShownTab, this));
		    
		    var clientInfo = JSON.parse(options.query);
            this.userInfo = {
                clientName: clientInfo.clientName,
                uid: clientInfo.uid
            }

		    this.myTabBlockView = new TabBlockUrlView({
		    	collection:this.collection,
		    	userInfo:this.userInfo
		    }); 
		},
		onShownTab: function(event){
			var target = event.target || event.srcElement;
			var id = $(target).attr('data-target');
            switch(id){
            	case '#blockUrlList':
            	  if(this.myTabCurrentBlockListView){
                      this.myTabCurrentBlockListView.onClickQueryButton();
            	  	  return;
            	  }
            	  this.myTabCurrentBlockListView = new TabCurrentBlockListView({
            	  	collection:this.collection,
            	  	userInfo:this.userInfo
            	  });
            	  this.myTabCurrentBlockListView.render(this.$el.find('#blockUrlList'));
                break;
                case '#history':
                  if(this.myTabHistoryView){
                      this.myTabHistoryView.onClickQueryButton();
                  	  return;
                  }
                  this.myTabHistoryView = new TabHistoryView({
                  	collection:this.collection,
                  	userInfo:this.userInfo
                  });
                  this.myTabHistoryView.render(this.$el.find('#history'));
                break;
            }           
		},
		hide: function(){
            this.$el.remove();
		},
		render: function(target){
			this.$el.appendTo(target);
            this.myTabBlockView.render(this.$el.find('#blockUrl'));
		}
	});
    
	return BlockUrlView;
})