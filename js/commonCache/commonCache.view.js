define("commonCache.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var AddCacheRule = Backbone.View.extend({
        events: {},
        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model && options.model[0];
            
            this.defaultParam = {
                host:"",
                uri: "",
                args: "",
                method:'',//编辑时的id
                body:'',
                expire:'',
                offline:1
            }; 
            if (this.isEdit){
                this.defaultParam.host = this.model.host;
                this.defaultParam.uri = this.model.uri;
                this.defaultParam.args = this.model.args;
                this.defaultParam.method = this.model.method;
                this.defaultParam.body = this.model.body;
                this.defaultParam.expire = this.model.expire;
                this.defaultParam.id = this.model.id;
                this.defaultParam.offline = this.model.offline;
            }
            this.$el = $(_.template(template['tpl/commonCache/commonCache.cacheRule.add.html'])({data:this.defaultParam}));
        },

        onSure: function(){
            var host = this.$el.find("#host").val();
            var uri = this.$el.find("#uri").val();
            var args = this.$el.find("#args").val();
            var method = this.$el.find("#method").val();
            var body = this.$el.find("#body").val();
            var expire = this.$el.find("#expire").val();
            var offline = this.$el.find("input[name=cache-rule-onlineStatus]:checked").val();
            var postParam = {
                "id": this.isEdit ? this.defaultParam.id : null,
                host:host,
                uri:uri,
                args:args,
                method:method,
                body:body,
                expire:expire,
                offline:parseInt(offline)
            }
            return postParam;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });    

    var CacheView = Backbone.View.extend({
        initialize:function(options){
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/commonCache/commonCache.cacheRule.html'])());
            this.getCacheRule();
            this.$el.find(".create").on("click", $.proxy(this.onClickAddCacheRule, this));
        },

        onClickAddCacheRule: function(event){
            if (this.addCacheRulePopup) $("#" + this.addCacheRulePopup.modalId).remove();
            var myAddEditCacheRuleView = new AddCacheRule({
                collection: this.collection,
                isEdit:false
            });

            var options = {
                title:"添加缓存规则",
                body : myAddEditCacheRuleView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditCacheRuleView.onSure();
                    if (!postParam) return;
                    postParam.success = function(){
                        alert("添加成功");
                        this.getCacheRule();
                    }.bind(this);
                    postParam.error = function(){
                        this.setCacheRuleError();
                    }.bind(this);
                    this.collection.addCacheRule(postParam);
                    this.addCacheRulePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addCacheRulePopup = new Modal(options);
        },

        getCacheRule:function(){
            var args = {
                start:1,
                total:1000,
                success:function(data){
                    this.onGetCacheRuleSuccess(data);
                }.bind(this),
                error:function(data){
                    this.onGetCacheRuleError(data);
                }.bind(this)
            };

            this.collection.getCacheRulesList(args);
        },

        onGetCacheRuleSuccess:function(data){
            this.DATA = data;
            _.each(this.DATA,function(el){
                el.createTimeName = new Date(el.createTime).format("yyyy/MM/dd hh:mm");
                el.offlineName = el.offline === 0 ? "不在线" : "在线";
            });
            this.table = $(_.template(template['tpl/commonCache/commonCache.cacheRule.table.html'])({data:this.DATA}));
            this.$el.find(".table-ctn").html(this.table);
            this.table.find(".edit").on("click",$.proxy(this.onEditClick,this));
        },

        setCacheRuleError:function(){
            alert("添加失败");
        },

        onEditClick:function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.getCurrentObj(id);

            if (this.addCacheRulePopup) $("#" + this.addCacheRulePopup.modalId).remove();
            var myAddEditCacheRuleView = new AddCacheRule({
                collection: this.collection,
                isEdit:true,
                model:model
            });

            var options = {
                title:"添加缓存规则",
                body : myAddEditCacheRuleView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddEditCacheRuleView.onSure();
                    if (!postParam) return;
                    postParam.success = function(){
                        alert("修改成功");
                        this.getCacheRule();
                    }.bind(this);
                    postParam.error = function(){
                        this.setCacheRuleError();
                    }.bind(this);
                    this.collection.modifyCacheRule(postParam);
                    this.addCacheRulePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addCacheRulePopup = new Modal(options);
        },

        getCurrentObj:function(id){
            var data = this.DATA;
            var model = _.filter(data,function(el){
                return el.id == id;
            });
            return model;
        },

        onGetCacheRuleError:function(data){
            var msg =  data.message && data.message || "出现未知错误";
            alert(msg);
        },

        updateView:function(){

        },

        render:function(target){
            this.$el.appendTo(target);
        }
    });

    var AddWhiteView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model && options.model[0];
            
            this.defaultParam = {
                host:"",
                uri: "",
                containCdnDevice: "",
                ipList:""
            }; 
            if (this.isEdit){
                this.defaultParam.host = this.model.host;
                this.defaultParam.uri = this.model.uri;
                this.defaultParam.containCdnDevice = this.model.containCdnDevice;
                this.defaultParam.ipList = this.model.ipList;
                this.defaultParam.id = this.model.id;
            }
            this.$el = $(_.template(template['tpl/commonCache/commonCache.white.add.html'])({data:this.defaultParam}));
        },

        onSure: function(){
            var host = this.$el.find("#host").val();
            var uri = this.$el.find("#uri").val();
            var ipList = this.$el.find("#ipList").val();

            var containCdnDevice = this.$el.find("input[name=cache-containDevice]:checked").val();
            console.log(containCdnDevice);
            var postParam = {
                "id": this.isEdit ? this.defaultParam.id : null,
                host:host,
                uri:uri,
                containCdnDevice:parseInt(containCdnDevice),
                ipList:ipList
            }
            return postParam;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });  

    var IpBlackWhiteView = Backbone.View.extend({
        initialize:function(options){
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/commonCache/commonCache.ipBlackWhite.html'])());
            this.getIpList();
            this.$el.find(".create").on("click", $.proxy(this.onClickAddCacheRule, this));
        },


        onClickAddCacheRule: function(event){
            if (this.addAddWhitePopup) $("#" + this.addAddWhitePopup.modalId).remove();
            var myAddWhiteView = new AddWhiteView({
                collection: this.collection,
                isEdit:false
            });

            var options = {
                title:"添加白名单",
                body : myAddWhiteView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddWhiteView.onSure();
                    if (!postParam) return;
                    postParam.success = function(){
                        alert("添加成功");
                        this.getIpList();
                    }.bind(this);
                    postParam.error = function(){
                        this.setIpListError();
                    }.bind(this);
                    this.collection.addIpWhiteRule(postParam);
                    this.addAddWhitePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addAddWhitePopup = new Modal(options);
        },

        getIpList:function(){
            var args = {
                start:1,
                total:1000,
                success:function(data){
                    this.onGetIpListSuccess(data);
                }.bind(this),
                error:function(data){
                    this.onGetIpListError(data);
                }.bind(this)
            };
            this.collection.getIpWhiteList(args);
        },

        onGetIpListSuccess:function(data){
            this.DATA = data;
            _.each(this.DATA,function(el){
                el.containCdnDeviceName = el.containCdnDevice == 0 ? "不包含" : "包含";
            });
            this.table = $(_.template(template['tpl/commonCache/commonCache.ipBlackWhite.table.html'])({data:this.DATA}));
            this.$el.find(".table-ctn").html(this.table);
            this.table.find(".edit").on("click",$.proxy(this.onEditClick,this));
        },

        onEditClick:function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.getCurrentObj(id);

            if (this.addAddWhitePopup) $("#" + this.addAddWhitePopup.modalId).remove();
            var myAddWhiteView = new AddWhiteView({
                collection: this.collection,
                isEdit:true,
                model:model
            });

            var options = {
                title:"修改白名单",
                body : myAddWhiteView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddWhiteView.onSure();
                    if (!postParam) return;
                    postParam.success = function(){
                        alert("修改成功");
                        this.getIpList();
                    }.bind(this);
                    postParam.error = function(){
                        this.setIpListError();
                    }.bind(this);
                    this.collection.modifyIpWhiteRule(postParam);
                    this.addAddWhitePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addAddWhitePopup = new Modal(options);
        },

        getCurrentObj:function(id){
            var data = this.DATA;
            var model = _.filter(data,function(el){
                return el.id == id;
            });
            return model;
        },        

        setIpListError:function(res){
            var msg = res.message || "失败";
            alert(msg);
        },
        onGetIpListError:function(data){
            var msg =  data.message && data.message || "出现未知错误";
            alert(msg);
        },

        updateView:function(){

        },

        render:function(target){
            this.$el.appendTo(target);
        }        
    });

    var AddClearCacheView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model && options.model[0];
            
            this.defaultParam = {
                host:"",
                uri: "",
                method: "",
                rel_key:""
            }; 
            if (this.isEdit){
                this.defaultParam.host = this.model.host;
                this.defaultParam.uri = this.model.uri;
                this.defaultParam.method = this.model.method;
                this.defaultParam.rel_key = this.model.rel_key;
                this.defaultParam.id = this.model.id;
            }
            this.$el = $(_.template(template['tpl/commonCache/commonCache.clearCache.add.html'])({data:this.defaultParam}));
        },

        onSure: function(){
            var host = this.$el.find("#host").val();
            var uri = this.$el.find("#uri").val();
            var method = this.$el.find("#method").val();
            var rel_key = this.$el.find("#rel_key").val();

            var postParam = {
                "id": this.isEdit ? this.defaultParam.id : null,
                host:host,
                uri:uri,
                rel_key:rel_key,
                method:method
            }
            return postParam;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });  

    var ClearCacheView = Backbone.View.extend({
        initialize:function(options){
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/commonCache/commonCache.clearCache.html'])());
            this.getClearRulesList();
            this.$el.find(".create").on("click", $.proxy(this.onClickAddCacheRule, this));
        },


        onClickAddCacheRule: function(event){
            if (this.addClearCachePopup) $("#" + this.addClearCachePopup.modalId).remove();
            var myAddClearCacheView = new AddClearCacheView({
                collection: this.collection,
                isEdit:false
            });

            var options = {
                title:"清除缓存规则-添加条件",
                body : myAddClearCacheView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddClearCacheView.onSure();
                    if (!postParam) return;
                    postParam.success = function(){
                        alert("添加成功");
                        this.getClearRulesList();
                    }.bind(this);
                    postParam.error = function(){
                        this.setIpListError();
                    }.bind(this);
                    this.collection.addClearRule(postParam);
                    this.addClearCachePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addClearCachePopup = new Modal(options);
        },

        getClearRulesList:function(){
            var args = {
                start:1,
                total:1000,
                success:function(data){
                    this.onGetSuccess(data);
                }.bind(this),
                error:function(data){
                    this.onGetError(data);
                }.bind(this)
            };
            this.collection.getClearRulesList(args);
        },

        onGetSuccess:function(data){
            this.DATA = data;
            if(data.length>0){
                this.table = $(_.template(template['tpl/commonCache/commonCache.clearCache.table.html'])({data:this.DATA}));
            }
            else{
                this.table = $("<tr><td colspan='5'>暂无数据</td><tr>");
            }
            this.$el.find(".table-ctn").html(this.table);
            this.table.find(".edit").on("click",$.proxy(this.onEditClick,this));
        },

        onEditClick:function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.getCurrentObj(id);
            console.log(model);
            if (this.addClearCachePopup) $("#" + this.addClearCachePopup.modalId).remove();
            var myAddClearCacheView = new AddClearCacheView({
                collection: this.collection,
                isEdit:true,
                model:model
            });

            var options = {
                title:"修改清除缓存规则-添加条件",
                body : myAddClearCacheView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var postParam = myAddClearCacheView.onSure();
                    if (!postParam) return;
                    postParam.success = function(){
                        alert("修改成功");
                        this.getClearRulesList();
                    }.bind(this);
                    postParam.error = function(res){
                        this.setClearRuleError(res);
                    }.bind(this);
                    this.collection.modifyClearRule(postParam);
                    this.addClearCachePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addClearCachePopup = new Modal(options);
        },

        getCurrentObj:function(id){
            var data = this.DATA;
            var model = _.filter(data,function(el){
                return el.id == id;
            });
            return model;
        },

        onGetError:function(data){
            var msg =  data.message && data.message || "出现未知错误";
            alert(msg);
        },

        setClearRuleError:function(res){
            var msg = res.message || "修改失败";
            alert(msg);
        },

        updateView:function(){

        },

        render:function(target){
            this.$el.appendTo(target);
        }        
    });

    var CommonCacheView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/commonCache/commonCache.html'])());

            //this.collection.on("get.user.success", $.proxy(this.onChannelListSuccess, this));
            //this.collection.on("get.user.error", $.proxy(this.onGetError, this));

            //this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            
            //this.enterKeyBindQuery();
            //this.initUsersDropMenu();

            this.queryArgs = {
                "domainName": null,
                "userId": null,
                "email" : null,
                "companyName": null,
                "currentPage": 1,
                "pageSize": 10
             }
            //this.onClickQueryButton();
            this.setCacheView();//一上来首先加载列表
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(this.onShownTab, this));
        },

        onShownTab: function (e) {
            var eventTarget = e.target; // newly activated tab
            var id = $(eventTarget).attr("data-target");
            relatedID = $(e.relatedTarget).attr("data-target");
            switch(id){
                case "#valuable-cache-rule":
                    this.currentTab = "#valuable-cache-rule";
                    
                break;
                case "#valuable-cache-ipBlackAndWhite":
                    this.currentTab = "#valuable-cache-ipBlackAndWhite";
                    if(this.ipBlackWhiteView) {
                        return;
                    }
                    this.ipBlackWhiteView = new IpBlackWhiteView({
                        collection: this.collection
                    })
                    this.ipBlackWhiteView.render(this.$el.find("#valuable-cache-ipBlackAndWhite"))
                break;
                case "#valuable-cache-clearRule":
                    this.currentTab = "#valuable-cache-clearRule";
                    if(this.clearCacheView) {
                        return;
                    }
                    this.clearCacheView = new ClearCacheView({
                        collection: this.collection
                    })
                    this.clearCacheView.render(this.$el.find("#valuable-cache-clearRule"))
                break;
            }
        },

        setCacheView:function(){
            if(!this.cacheView){
                this.cacheView = new CacheView({
                    collection:this.collection
                });
                this.cacheView.render(this.$el.find("#valuable-cache-rule"));
            }
            this.cacheView.updateView();
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

            this.queryArgs.currentPage = 1;
            this.queryArgs.domainName = this.$el.find("#input-domain").val().trim();
            this.queryArgs.userId = this.$el.find("#input-uid").val().trim();
            this.queryArgs.email = this.$el.find("#input-email").val().trim();
            this.queryArgs.companyName = this.$el.find("#input-name").val().trim();

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.queryChannel(this.queryArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/customerSetup/customerSetup.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            
            this.table.find("tbody .manage").on("click", $.proxy(this.onClickItemNodeName, this));
            if(!AUTH_OBJ.ManageCustomer){
                this.table.find("tbody .manage").remove();
            }
        },

        onClickItemNodeName: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id), args = JSON.stringify({
                clientName: model.get("companyName"),
                uid: model.get("userId")
            })

            window.location.hash = '#/domainList/' + args;
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

        initUsersDropMenu: function(){
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

    return CommonCacheView;
});