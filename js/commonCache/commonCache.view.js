define("commonCache.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var AddCacheRule = Backbone.View.extend({
        events: {},
        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/commonCache/commonCache.cacheRule.add.html'])());

            this.defaultParam = {
                id:"",
                codes: "",
                expireTime: "",
                locationId:''//编辑时的id
            }; 

            if (this.isEdit){
                this.defaultParam.codes = this.model.get("codes") || "";
                this.defaultParam.expireTime = this.model.get("expireTime") || "";
                this.defaultParam.id = this.model.get("id");
            }

            this.initEditTemplate();

        },
        initEditTemplate:function(){
            if(this.isEdit){
                this.$el.find("#args").val(this.defaultParam.codes);
                this.$el.find("#values").val(this.defaultParam.expireTime);
            }
        },
        onSure: function(){

            var codes = this.$el.find("#args").val(), expireTime = this.$el.find("#values").val();
            if (codes === "" || expireTime === ""){
                alert("状态码和缓存时间不能为空");
                return false
            } 
            if(!Utility.isNumber(expireTime)){
                alert("缓存时间只能填数字");
                return false;
            }


            var postParam = {
                "id": this.isEdit ? this.model.get("id") : new Date().valueOf(),
                "locationId": this.defaultParam.locationId,
                "codes": codes,
                "expireTime": parseInt(expireTime)
            }
            return postParam
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
                    var args = {
                        "originId":this.domainInfo.id,
                        "codes":  postParam.codes,
                        "expireTime": postParam.expireTime
                    };
                    //this.collection.addStatusCode(args);
                    this.addCacheRulePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addCacheRulePopup = new Modal(options);
        },

        getCacheRule:function(){
            var args = {
                start:1,
                total:10,
                success:function(data){
                    this.onGetCacheRuleSuccess(data);
                }.bind(this),
                error:function(data){
                    this.onGetCacheRuleError(data);
                }.bind(this),
            };
            this.collection.getCacheRulesList(args);


            
        },

        onGetCacheRuleSuccess:function(data){
            this.cacheData = data;
            _.each(this.cacheData,function(el){
                console.log(el);

            });
            this.table = $(_.template(template['tpl/commonCache/commonCache.cacheRule.table.html'])());
            this.$el.find(".table-ctn").html(this.table);
        },

        onGetCacheRuleError:function(){},

        onDataArrival:function(data){
            
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
            this.model = options.model;
            this.$el = $(_.template(template['tpl/commonCache/commonCache.white.add.html'])());

            this.defaultParam = {
                id:"",
                codes: "",
                expireTime: "",
                locationId:''//编辑时的id
            }; 

            if (this.isEdit){
                this.defaultParam.codes = this.model.get("codes") || "";
                this.defaultParam.expireTime = this.model.get("expireTime") || "";
                this.defaultParam.id = this.model.get("id");
            }

            this.initEditTemplate();

        },
        initEditTemplate:function(){
            if(this.isEdit){
                this.$el.find("#args").val(this.defaultParam.codes);
                this.$el.find("#values").val(this.defaultParam.expireTime);
            }
        },
        onSure: function(){

            var codes = this.$el.find("#args").val(), expireTime = this.$el.find("#values").val();
            if (codes === "" || expireTime === ""){
                alert("状态码和缓存时间不能为空");
                return false
            } 
            if(!Utility.isNumber(expireTime)){
                alert("缓存时间只能填数字");
                return false;
            }


            var postParam = {
                "id": this.isEdit ? this.model.get("id") : new Date().valueOf(),
                "locationId": this.defaultParam.locationId,
                "codes": codes,
                "expireTime": parseInt(expireTime)
            }
            return postParam
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });  

    var IpBlackWhiteView = Backbone.View.extend({
        initialize:function(options){
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/commonCache/commonCache.ipBlackWhite.html'])());
            this.setCacheRule();
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
                    var args = {
                        "originId":this.domainInfo.id,
                        "codes":  postParam.codes,
                        "expireTime": postParam.expireTime
                    };
                    //this.collection.addStatusCode(args);
                    this.addAddWhitePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addAddWhitePopup = new Modal(options);
        },

        setCacheRule:function(){
            this.table = $(_.template(template['tpl/commonCache/commonCache.ipBlackWhite.table.html'])());
            this.$el.find(".table-ctn").html(this.table);
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
            this.model = options.model;
            this.$el = $(_.template(template['tpl/commonCache/commonCache.clearCache.add.html'])());

            this.defaultParam = {
                id:"",
                codes: "",
                expireTime: "",
                locationId:''//编辑时的id
            }; 

            if (this.isEdit){
                this.defaultParam.codes = this.model.get("codes") || "";
                this.defaultParam.expireTime = this.model.get("expireTime") || "";
                this.defaultParam.id = this.model.get("id");
            }

            this.initEditTemplate();

        },
        initEditTemplate:function(){
            if(this.isEdit){
                this.$el.find("#args").val(this.defaultParam.codes);
                this.$el.find("#values").val(this.defaultParam.expireTime);
            }
        },
        onSure: function(){

            var codes = this.$el.find("#args").val(), expireTime = this.$el.find("#values").val();
            if (codes === "" || expireTime === ""){
                alert("状态码和缓存时间不能为空");
                return false
            } 
            if(!Utility.isNumber(expireTime)){
                alert("缓存时间只能填数字");
                return false;
            }


            var postParam = {
                "id": this.isEdit ? this.model.get("id") : new Date().valueOf(),
                "locationId": this.defaultParam.locationId,
                "codes": codes,
                "expireTime": parseInt(expireTime)
            }
            return postParam
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });  

    var ClearCacheView = Backbone.View.extend({
        initialize:function(options){
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/commonCache/commonCache.clearCache.html'])());
            this.setCacheRule();
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
                    var postParam = myAddWhiteView.onSure();
                    if (!postParam) return;
                    var args = {
                        "originId":this.domainInfo.id,
                        "codes":  postParam.codes,
                        "expireTime": postParam.expireTime
                    };
                    //this.collection.addStatusCode(args);
                    this.addClearCachePopup.$el.modal('hide');
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addClearCachePopup = new Modal(options);
        },

        setCacheRule:function(){
            this.table = $(_.template(template['tpl/commonCache/commonCache.clearCache.table.html'])());
            this.$el.find(".table-ctn").html(this.table);
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
                        collection: this.liveCollection
                    })
                    this.ipBlackWhiteView.render(this.$el.find("#valuable-cache-ipBlackAndWhite"))
                break;
                case "#valuable-cache-clearRule":
                    this.currentTab = "#valuable-cache-clearRule";
                    if(this.clearCacheView) {
                        return;
                    }
                    this.clearCacheView = new ClearCacheView({
                        collection: this.liveCollection
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