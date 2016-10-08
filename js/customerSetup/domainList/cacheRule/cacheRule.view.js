define("cacheRule.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditRoleView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.add.html'])());

            require(['matchCondition.view'], function(MatchConditionView){
                var  matchConditionArray = [
                    {name: "全部文件", value: 1},
                    {name: "文件类型", value: 2},
                    {name: "指定URI", value: 3},
                    {name: "指定目录", value: 4},
                    {name: "正则匹配", value: 5},
                ], matchConditionOption = {
                    defaultCondition : 4,
                    matchConditionArray: matchConditionArray
                }
                this.matchConditionView = new MatchConditionView(matchConditionOption);
                this.matchConditionView.render(this.$el.find(".match-condition-ctn"));
            }.bind(this))

            this.defaultParam = {
                cacheTimeType: 1,
                cacheTime: 60 * 60 * 24 * 30,
                cacheOriginTime: 60 * 60 * 24 * 30
            };

            this.initSetup();
        },

        initSetup: function(){
            if (this.defaultParam.cacheTimeType === 1){
                this.$el.find("#cacheTimeRadios1").get(0).checked = true;
            } else if (this.defaultParam.cacheTimeType === 2) {
                this.$el.find("#cacheTimeRadios2").get(0).checked = true;
            } else if (this.defaultParam.cacheTimeType === 3){
                this.$el.find("#cacheTimeRadios3").get(0).checked = true;
            }
            this.initTimeDropdown();
        },

        initTimeDropdown: function(){
            var  timeArray = [
                {"value": 1, "name": "秒"},
                {"value": 60, "name": "分"},
                {"value": 60 * 60, "name": "时"},
                {"value": 60 * 60 * 24, "name": "天"},
                {"value": 60 * 60 * 24 * 30, "name": "月"},
                {"value": 60 * 60 * 24 * 30 * 12, "name": "年"},
            ];
            
            var input = this.defaultParam.cacheTime,
                rootNode = this.$el.find(".yes-cache");
                curEl = this.$el.find("#dropdown-yes-cache .cur-value"),
                curInputEl = this.$el.find("#yes-cache-time");

            Utility.initDropMenu(rootNode, timeArray, function(value){
                this.defaultParam.cacheTime = parseInt(curInputEl.val()) * parseInt(value);
            }.bind(this));

            this.timeFormatWithUnit(input, curEl, curInputEl);

            //若源站无缓存时间，则缓存
            var inputNum = this.defaultParam.cacheOriginTime,
                rootOtherNode = this.$el.find(".origin-cache")
                curEl2 = this.$el.find("#dropdown-origin-cache .cur-value"),
                curInputEl2 = this.$el.find("#origin-cache-time");

            Utility.initDropMenu(rootOtherNode, timeArray, function(value){
                this.defaultParam.cacheOriginTime = parseInt(curInputEl2.val()) * parseInt(value);
            }.bind(this));

            this.timeFormatWithUnit(inputNum, curEl2, curInputEl2);
        },

        timeFormatWithUnit: function(input, curEl, curInputEl) {
            var num = parseInt(input);
            if (input >= 60 && input < 60 * 60) {
                num = parseInt(input / 60)
                curEl.html('分');
            } else if (input >= 60 * 60 && input < 60 * 60 * 24) {
                num = parseInt(input / 60 / 60);
                curEl.html('时');
            } else if (input >= 60 * 60 * 24 && input < 60 * 60 * 24 * 30) {
                num = parseInt(input / 60 / 60 / 24);
                curEl.html('天');
            } else if (input >= 60 * 60 * 24 * 30 && input < 60 * 60 * 24 * 30 * 12) {
                num = parseInt(input / 60 / 60 / 24 / 30);
                curEl.html('月');
            } else if (input >= 60 * 60 * 24 * 30 * 12){
                num = parseInt(input / 60 / 60 / 24 / 30 / 12);
                curEl.html('年');
            } else {
                curEl.html('月');
            }
            curInputEl.val(num)
        },

        onSure: function(){
            var notCacheTime = this.$el.find(".yes-cache select").get(0).value;
            console.log(notCacheTime)
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });


    var CacheRuleView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain
                }
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: false
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.collection.on("get.channel.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.channel.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRole, this))

            this.queryArgs = {
                "domain"           : null,
                "accelerateDomain" : null,
                "businessType"     : null,
                "clientName"       : null,
                "status"           : null,
                "page"             : 1,
                "count"            : 10
             }

             this.onClickQueryButton();
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
            this.queryArgs.page = 1;
            this.queryArgs.domain = this.$el.find("#input-domain").val();
            this.queryArgs.clientName = this.$el.find("#input-client").val();
            if (this.queryArgs.domain == "") this.queryArgs.domain = null;
            if (this.queryArgs.clientName == "") this.queryArgs.clientName = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.queryChannel(this.queryArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.table.html'])({
                data: this.collection.models
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .manage").on("click", $.proxy(this.onClickItemNodeName, this));
            this.table.find("tbody .up").on("click", $.proxy(this.onClickItemUp, this));
            this.table.find("tbody .down").on("click", $.proxy(this.onClickItemDown, this));
        },

        onClickAddRole: function(event){
            if (this.addRolePopup) $("#" + this.addRolePopup.modalId).remove();

            var myAddEditRoleView = new AddEditRoleView({collection: this.collection});

            var options = {
                title:"缓存规则",
                body : myAddEditRoleView,
                backdrop : 'static',
                type     : 2,
                onOkCallback: function(){}.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addRolePopup = new Modal(options);
        },

        onClickItemUp: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), modelIndex;
            this.collection.each(function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            this.collection.models = Utility.adjustElement(this.collection.models, modelIndex, true)

            this.collection.trigger("get.channel.success")
        },

        onClickItemDown: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), modelIndex;
            this.collection.each(function(el, index, list){
                if (el.get("id") === parseInt(id)) modelIndex = index; 
            }.bind(this))

            this.collection.models = Utility.adjustElement(this.collection.models, modelIndex, false)

            this.collection.trigger("get.channel.success")
        },

        onClickItemNodeName: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var model = this.collection.get(id), args = JSON.stringify({
                domain: model.get("domain")
            })
            //var clientName = JSON.parse(this.options.query)
            window.location.hash = '#/domainList/' + clientName + "/domainSetup/" + args;
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.count) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.count;
                        this.collection.queryChannel(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return CacheRuleView;
});