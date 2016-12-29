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
            this.collection.getGuestQuotaCount({userId:this.userInfo.uid});
          //  this.collection.getGuestQuotaCount({userId:1});
            
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
            var protocolRegex = /https|http|ftp|rtsp|igmp|file|rtspt|rtspu/;
            var quotaEffecitveCount = this.$el.find('.quotaEffecitveCount').text();
            if(urls.substr(urls.length-1,urls.length) == ';')  //若最后一个字符为分号,则去掉
                urls = urls.substr(0,urls.length-1); 
        
            if(urls === "") {
                alert('URL不能为空');
                return false;
            }else{
                if(urls.indexOf(';') > -1){
                    url = urls.split(';');
                    var urlrepeat = [];
                   
                    if(url.length > parseInt(quotaEffecitveCount)){
                        alert('已超过最大提交数量');
                        return false;
                    }
                    for(var i = 0; i<url.length; i++){
                        if(url[i].substr(0,1)=='\n') url[i]=url[i].substr(1);
                        
                        if(urlrepeat.indexOf(url[i]) >= 0){
                            alert(url[i]+'重复,请重新填写');
                            return false;
                        }else {
                           urlrepeat.push(url[i]);
                        }
                    }
                    for(var i = 0; i<url.length; i++){
                        if(!protocolRegex.test(url[i].substr(0,4))){
                            alert('第'+ (i+1) +'个URL请以协议开头');
                            return false;
                        }
                        if(!Utility.isURL(url[i])){
                            alert('第'+ (i+1) +'个URL输入有误');
                            return false;
                        }
                    }
                }
                else if(!protocolRegex.test(urls)){
                    alert('请以协议开头');
                    return false;
                }
                else if(!Utility.isURL(urls)){
                    alert('URL输入有误');
                    return false;
                }
            }
            return true;
        },
        onClickSubmitBlockButton: function(){
          var urls = this.$el.find('#urls').val();
          this.urlsvalidation(urls);
        	if(this.urlsvalidation(urls)){
               if(urls.substr(urls.length-1,urls.length) == ';')  //若最后一个字符为分号,则去掉
                 urls = urls.substr(0,urls.length-1); 
               urls = urls.split(';');
               for(var i = 0;i<urls.length;i++){
                  if(urls[i].substr(0,1)=='\n') urls[i]=urls[i].substr(1);
               }
               var args = {
                   userId: this.userInfo.uid,
                  // userId:1,
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
            this.numberControl = 30; 
            this.$el = $(_.template(template['tpl/customerSetup/blockUrl/TabCurrentBlockList.html'])());
            this.initblockListDropmenu();
            
            this.UnblockButton = this.$el.find('.unblock');
            this.RefreshUrlButton = this.$el.find('.RefreshUrl')
            
            $(document).on('keydown',$.proxy(this.onKeydownEnter,this));
            this.$el.find('.query').on('click',$.proxy(this.onClickQueryButton,this));
            this.$el.find('.ks-table').on('change',$.proxy(this.onClickOptions,this));
            this.RefreshUrlButton.on('click',$.proxy(this.onClickRefresh,this));
            
            this.collection.off('remove.blockUrl.success');
            this.collection.off('remove.blockUrl.error');
            this.collection.on('remove.blockUrl.success',$.proxy(this.removeblockUrlSuccess,this));
            this.collection.on('remove.blockUrl.error',$.proxy(this.onGetError,this));
          
            this.collection.off('get.blockList.success');
            this.collection.off('get.blockList.error');
            this.collection.on('get.blockList.success',$.proxy(this.getblockListSuccess,this));
            this.collection.on('get.blockList.error',$.proxy(this.onGetError,this));
            
            this.collection.off('retry.blockTas.success');
            this.collection.off('retry.blockTas.error');
            this.collection.on('retry.blockTas.success',$.proxy(this.retryblockTasSuccess,this));
            this.collection.on('retry.blockTas.error',$.proxy(this.onGetError,this));
            
            this.queryArgs = {
	            page:1,
	            rows:10,
	            op: 0,
	            searchUrl: "",
	            userId:this.userInfo.uid
                //userId:1
            }
            this.blockUrlParam = {
                userId:this.userInfo.uid,
                //userId:1,
                ids: "",
                isNeedFresh: false
            }

            this.onClickQueryButton();
        },
        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.showloading();
            this.$el.find('thead input').prop('checked',false);
            this.queryArgs.searchUrl = $.trim(this.$el.find('#input-url').val());
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
             var length = 0,
                 id = $(eventTarget).attr("id"),
                 model = this.collection.get(id),
                 AllChecked =  this.$el.find('thead input');
             if(eventTarget.value == AllChecked.val()){
                    var inputs = this.table.find('input');
                    this.collection.each(function(model,index){
                        if(!model.get('isDisabled')){
                          model.set("isChecked", eventTarget.checked);
                          $(inputs[index]).prop('checked',eventTarget.checked);
                        }
                    }.bind(this));

             }else{
                model.set('isChecked',eventTarget.checked);
             }
             
             var checkedList = this.collection.filter(function(model){
                if(!model.get('isDisabled')) length++;
                return model.get('isChecked') === true;
             })
             if(checkedList.length == 0 && length == 0) return false;
             if(checkedList.length > 0){
               if(checkedList.length == length){
                  AllChecked.prop('checked',true);
               }else{
                  AllChecked.prop('checked',false);
               }
               this.UnblockButton.removeAttr('disabled');
               this.RefreshUrlButton.removeAttr('disabled');
               this.UnblockButton.off('click');
               this.UnblockButton.on('click',$.proxy(this.unblock,this));
             }else{
               this.UnblockButton.attr('disabled','disabled');            
               this.RefreshUrlButton.attr('disabled','disabled');
               this.UnblockButton.off('click');
             }
        },
        unblock: function(){
            var idsArray = [];
             _.each(this.collection.models,function(el,index,list){
                if(el.get('isChecked') == true){
                   idsArray.push(el.id);
                }
            })
            if(idsArray.length > this.numberControl)
            {  
               alert('已超出可提交的最大条数限制');
               return false;
            }
            this.blockUrlParam.ids = idsArray;
            this.collection.removeBlockUrl(this.blockUrlParam);  
        },
        removeblockUrlSuccess: function(){
            alert('操作成功');
            this.UnblockButton.attr('disabled','disabled');            
            this.RefreshUrlButton.attr('disabled','disabled');
            this.UnblockButton.off('click');
            this.onClickQueryButton();   
        },
        retryblockTasSuccess: function(){
            alert('操作成功');
            this.onClickQueryButton();
        },
        initblockListDropmenu: function(){
            var statusArray = [
               {name:'全部',value:0},
               {name:'屏蔽成功',value:3},
               {name:'屏蔽失败',value:4},
               {name:'屏蔽中',value:1},
               {name:'解除屏蔽中',value:2},
              // {name:'解除屏蔽成功',value:5},
               {name:'解除屏蔽失败',value:6}
            ];
            rootNode = this.$el.find('.dropdown-state');
            Utility.initDropMenu(rootNode,statusArray,function(value){
                this.queryArgs.op = parseInt(value);
            }.bind(this));

            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: this.numberControl+"条", value: this.numberControl}
                //{name: "100条", value: 100}
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
             _.each(this.table,function(el,index){
                var DisabledState = ['屏蔽中','屏蔽失败','解除屏蔽中','刷新中'];
                if( ( DisabledState.indexOf(data[index].get('status'))>=0 ) || (data[index].get('isRefreshSuccess') == 1) ){
                    $(el).find('input').attr('disabled','disabled');
                    data[index].set('isDisabled',true);
                }
             })
             if(data.length == 0){
                //this.isInitPaginator = true;
                this.setNoData("未查到符合条件的数据，请重新查询");
             }else{
                this.$el.find('.ks-table tbody').html(this.table);
             }

             var Reunblock = this.table.find('.Reunblock');
             var Rescreen = this.table.find('.Rescreen');
             var Refresh = this.table.find('.Refresh');
             if(Reunblock) Reunblock.on('click',$.proxy(this.onclickReunblockButton,this));
             if(Rescreen)  Rescreen.on('click',$.proxy(this.onclickRescreenOrRefreshButton,this));
             if(Refresh) Refresh.on('click',$.proxy(this.onclickRescreenOrRefreshButton,this));
        },
        onclickRescreenOrRefreshButton: function(event){
            var eventTarget = event.target || event.srcElement;
            var id = $(eventTarget).parent().attr('id'),ids = [],type;
            ids.push(parseInt(id));
            
            eventTarget.className.indexOf('Rescreen') > 0 ? type = 1 : type = 2;
            var defaultParam = {
                userId:this.userInfo.uid,
                //userId:1,
                taskId:ids,
                type:type
            } 
            this.collection.retryBlockTas(defaultParam);

        },
        onclickReunblockButton: function(event){
             var eventTarget = event.target || event.srcElement;
             var id = $(eventTarget).parent().attr('id'),ids = [];
             ids.push(id);
             this.blockUrlParam.ids = ids;
             this.collection.removeBlockUrl(this.blockUrlParam);
        },
        setNoData:function(msg){
            this.$el.find(".ks-table tbody").html('<tr><td  colspan="8" class="text-center"><p class="text-muted text-center">'+msg+'</p></td></tr>');
        },
        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.rows) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.rows);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".ks-table tbody").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.rows = this.queryArgs.rows;
                        this.collection.showCurrentBlockUrls(args);
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
            this.userInfo = options.userInfo;
        	this.$el = $(_.template(template['tpl/customerSetup/blockUrl/TabHistory.html'])());
            this.$el.find('.query').on('click',$.proxy(this.onClickQueryButton,this));
            this.collection.off('get.history.success');
            this.collection.off('get.history.error');
            this.collection.on('get.history.success',$.proxy(this.gethistorySuccess,this));
            this.collection.on('get.history.error',$.proxy(this.onGetError,this));
             this.initHistoryDropMenu();
            this.queryArgs = {
                userId:this.userInfo.uid,
                //userId:1,
                date:7,
                op:1,
                searchUrl:"",
                page:1,
                rows:10
            };
            this.onClickQueryButton();

        },
        initHistoryDropMenu: function(){
            var timeArray = [
              {name:'最近7天',value:7},
              {name:'最近30天',value:30}
            ]
            rootNode = this.$el.find('.dropdown-time');
            Utility.initDropMenu(rootNode,timeArray,function(value){
                this.queryArgs.date = parseInt(value);
            }.bind(this));

            var operatorArray = [
               {name:'屏蔽',value:1},
               {name:'解除屏蔽',value:2}
            ]
            rootNode = this.$el.find('.dropdown-operator');
            Utility.initDropMenu(rootNode,operatorArray,function(value){
               this.queryArgs.op = parseInt(value);
            }.bind(this));

            var pageNum = [
                {name:'10条',value:10},
                {name:'20条',value:20},
                {name:'50条',value:50},
                {name:'100条',value:100}
            ]
            rootNode = this.$el.find('.page-num');
            Utility.initDropMenu(rootNode,pageNum,function(value){
               this.queryArgs.rows = value;
               this.onClickQueryButton();
            }.bind(this));
        },
        onClickQueryButton: function(){
            this.showloading();
            this.isInitPaginator = false;
            this.queryArgs.searchUrl = $.trim(this.$el.find('#input-url').val());
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
             this.setNoData("未查到符合条件的数据，请重新查询");
           }else{
             this.$el.find('.ks-table tbody').html(this.table);
           }
        },
        setNoData:function(msg){
            this.$el.find(".ks-table tbody").html('<tr><td  colspan="8" class="text-center"><p class="text-muted text-center">'+msg+'</p></td></tr>');
        },
        initPaginator: function(){
           this.$el.find('.text-primary').html(this.collection.total);
           if(this.collection.total < this.queryArgs.rows) return;
           var total = Math.ceil(this.collection.total/this.queryArgs.rows);

           this.$el.find('.pagination').jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".ks-table tbody").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.rows = this.queryArgs.rows;
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
		    this.Control = false;
		    var clientInfo = JSON.parse(options.query);
            this.userInfo = {
                clientName: clientInfo.clientName,
                uid: clientInfo.uid
            }
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
        renderload: function(target){
            this.$elload = $(_.template('<div class="domain-spinner">正在进行客户权限验证,请稍候...</div>')());
            this.$elload.appendTo(target);
        },
        renderError: function(target){
            this.$el = $(_.template(template['tpl/customerSetup/blockUrl/NoControl.html'])());
            this.$el.appendTo(target);
        },
		render: function(target){
            this.myTabBlockView = new TabBlockUrlView({
                collection:this.collection,
                userInfo:this.userInfo
            }); 
			this.$el.appendTo(target);
            this.myTabBlockView.render(this.$el.find('#blockUrl'));
		}
	});
    
	return BlockUrlView;
})