define("blockUrl.strategy.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {
        var AddEditStrategyView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.isEdit = options.isEdit;
                this.model = options.model;
                this.userId = options.userId;

                this.$el = $(_.template(template['tpl/customerSetup/blockUrl/tabStrategy.addEdit.html'])());
                this.collection.off('query.domain.success');
                this.collection.off('query.domain.error');
                this.collection.on('query.domain.success', $.proxy(this.getDomainSuccess, this));
                this.collection.on('query.domain.error', $.proxy(this.onGetError, this));

                this.queryArgs = {
                    pageSize: 999999, //每页N条数据
                    currentPage: 1,
                    userId: this.userId,
                    domain: ''
                };
                this.collection.getDomainList(this.queryArgs);
            },

            initSetup: function(){
                _.each(this.model, function(el){
                    this.$el.find(".advanced #secondary-" + el.originLine).val(el.addressBackup);
                }.bind(this))
                this.$el.find(".advanced #custom").val(this.backsourceCustom);

                var advancedArray = [
                    {name: "域名回源", value: 2},
                    {name: "IP回源", value: 1},
                    {name: "自定义", value: 3},
                ];

                var rootOtherNode = this.$el.find(".advanced .origin-type");
                Utility.initDropMenu(rootOtherNode, advancedArray, function(value){
                    this.backupOriginType = parseInt(value);
                    this.displayCustom();
                }.bind(this));

                var defaultOtherValue = _.find(advancedArray, function(object){
                    return object.value === this.backupOriginType;
                }.bind(this));

                this.displayCustom();

                if (defaultOtherValue)
                    this.$el.find(".advanced #dropdown-origin-type .cur-value").html(defaultOtherValue.name);
                else
                    this.$el.find(".advanced #dropdown-origin-type .cur-value").html(advancedArray[0].name);
            },

            getDomainSuccess: function(list) {
                var nameList = [];
                _.each(list, function(el, inx, list) {
                    nameList.push({
                        name: el.originDomain.domain,
                        value: el.originDomain.domain
                    })
                }.bind(this))

                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.dropdown-domain').get(0),
                    panelID: this.$el.find('#dropdown-domain').get(0),
                    isSingle: true,
                    openSearch: true,
                    selectWidth: 400,
                    isDataVisible: false,
                    onOk: function() {},
                    data: nameList,
                    callback: function(data) {
                        this.$el.find('#dropdown-domain .cur-value').html(data.name);
                    }.bind(this)
                });

                if (this.isEdit) {
                    this.$el.find(".dropdown-domain .cur-value").html(nameList[0].name);
                } else {
                    this.$el.find("#dropdown-domain .cur-value").html(nameList[0].name);
                }
            },

            onSure: function(){
                _.each(this.model, function(el){
                    el.addressBackup = this.$el.find(".advanced #secondary-" + el.originLine).val();
                }.bind(this))
                this.backsourceCustom = this.$el.find(".advanced #custom").val();
                return {
                    "backupOriginType": this.backupOriginType,
                    "backsourceCustom": this.backsourceCustom
                }
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        var StrategyView = Backbone.View.extend({
            events: {},
            initialize: function(options) {
                this.userInfo = options.userInfo;
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/customerSetup/blockUrl/tabStrategy.html'])());
                $(document).off('keydown');
                $(document).on('keydown', $.proxy(this.onKeydownEnter, this));
                this.$el.find('.query').on('click', $.proxy(this.onClickQueryButton, this));
                this.$el.find('.add').on('click', $.proxy(this.onClickAddStrategy, this));

                this.collection.on('get.domain.success', $.proxy(this.getStrategySuccess, this));
                this.collection.on('get.domain.error', $.proxy(this.onGetError, this));

                this.queryArgs = {
                    pageSize: 10, //每页N条数据
                    currentPage: 1,
                    userId: this.userInfo.uid,
                    domain: ''
                };
                this.onClickQueryButton();
                this.initDropMenu();

            },

            onClickAddStrategy: function(event){
                if (this.addStrategy) $("#" + this.addStrategy.modalId).remove();

                var myAddEditStrategyView = new AddEditStrategyView({
                    collection: this.collection,
                    userId: this.userInfo.uid
                });

                var options = {
                    title:"创建策略",
                    body : myAddEditStrategyView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback: function(){
                        var result = myAddEditStrategyView.onSure()
                        this.addStrategy.$el.modal('hide');
                    }.bind(this),
                    onHiddenCallback: function(){}.bind(this)
                }
                this.addStrategy = new Modal(options);
            },

            onKeydownEnter: function(event) {
                if (event.keyCode == 13) this.onClickQueryButton();
            },

            onClickQueryButton: function() {
                this.queryArgs.page = 1;
                this.showLoading();
                this.isInitPaginator = false;
                this.queryArgs.domain = $.trim(this.$el.find('#input-url').val());
                this.collection.getDomainInfoList(this.queryArgs);
            },

            getStrategySuccess: function() {
                this.initTable();
                if (!this.isInitPaginator) this.initPaginator();
            },

            initTable: function() {
                var data = this.collection.models;
                this.table = $(_.template(template['tpl/customerSetup/blockUrl/tabStrategy.table.html'])({
                    data: data
                }));
                if (data.length == 0) {
                    this.setNoData("未查到符合条件的数据，请重新查询");
                } else {
                    this.$el.find('.ks-table tbody').html(this.table);
                }
            },

            initDropMenu: function() {
                var pageNum = [{
                    name: '10条',
                    value: 10
                }, {
                    name: '20条',
                    value: 20
                }, {
                    name: '50条',
                    value: 50
                }, {
                    name: '100条',
                    value: 100
                }]
                rootNode = this.$el.find('.page-num');
                Utility.initDropMenu(rootNode, pageNum, function(value) {
                    this.queryArgs.pageSize = parseInt(value);
                    this.onClickQueryButton();
                }.bind(this));
            },

            setNoData: function(msg) {
                this.$el.find(".ks-table tbody").html('<tr><td  colspan="8" class="text-center"><p class="text-muted text-center">' + msg + '</p></td></tr>');
            },

            initPaginator: function() {
                this.$el.find('.text-primary').html(this.collection.total);
                if (this.collection.total < this.queryArgs.pageSize) return;
                var total = Math.ceil(this.collection.total / this.queryArgs.pageSize);

                this.$el.find('.pagination').jqPaginator({
                    totalPages: total,
                    visiblePages: 10,
                    currentPage: 1,
                    onPageChange: function(num, type) {
                        if (type !== "init") {
                            this.$el.find(".ks-table tbody").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
                            var args = _.extend(this.queryArgs);
                            args.currentPage = num;
                            args.pageSize = this.queryArgs.pageSize;
                            this.collection.getDomainInfoList(args);
                        }
                    }.bind(this)
                });
                this.isInitPaginator = true;
            },

            onGetError: function(error) {
                if (error && error.message) {
                    alert(error.message);
                } else {
                    alert('网络阻塞，请刷新重试！')
                }
            },

            showLoading: function() {
                this.$el.find(".pagination").html("");
                this.$el.find(".ks-table tbody").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return StrategyView
    }
);