define("clientLimitSpeed.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var TimeLimitAddEditView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.addTimeLimit.html'])());
        },

        onSure: function(){
            var startHour = parseInt(this.$el.find("#start-hour").val() || "0"),
                startMinutes = parseInt(this.$el.find("#start-minutes").val() || "0"),
                startSecond = parseInt(this.$el.find("#start-second").val() || "0"),
                endHour = parseInt(this.$el.find("#end-hour").val() || "0"),
                endMinutes = parseInt(this.$el.find("#end-minutes").val() || "0"),
                endSecond = parseInt(this.$el.find("#end-second").val() || "0");

            if (startHour > 23 || endHour > 23) {
                alert("小时不能大于23！")
                return false;
            }
            if (startMinutes > 59 || endMinutes > 59 || endMinutes > 59 || endSecond > 59) {
                alert("分钟、秒不能大于59！")
                return false;
            }

            var startTimeStr = startHour + ":" + startMinutes + ":" + startSecond,
                endTimeStr = endHour + ":" + endMinutes + ":" + endSecond;

            var startTime = new Date("2016/01/01 " + startTimeStr).format("hhmmss"),
                endTime   = new Date("2016/01/01 " + endTimeStr).format("hhmmss")
            if (parseInt(endTime) <= parseInt(startTime)) {
                alert("结束时间不能小于等于开始时间！")
                return false;
            }
            var limitTimeObj = {
                id: new Date().valueOf(),
                start: new Date("2016/01/01 " + startTimeStr).format("hh:mm:ss"),
                end: new Date("2016/01/01 " + endTimeStr).format("hh:mm:ss"),
                limitSpeed: this.$el.find("#set-limit").val()
            }
            return limitTimeObj;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });


    var AddEditLimitView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.add.html'])());

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
                byteNotLimit: 1,
                byteNotLimitUnit: 1, 
                limitSpeed: "延期啦",
                timeLimitList: [{
                    id: 1,
                    start: new Date().format("hh:mm:ss"),
                    end: new Date().format("hh:mm:ss"),
                    limitSpeed: 40
                }]
            }

            this.$el.find(".byte-limit-toggle .togglebutton input").on("click", $.proxy(this.onClickByteLimitToggle, this));
            this.$el.find(".add-time-limit").on("click", $.proxy(this.onClickAddTimeLimit, this));

            this.initSetup();

        },

        initSetup: function(){
            this.initUnitDropdown();
            if (this.defaultParam.byteNotLimit === 1){
                this.$el.find(".byte-limit-toggle .togglebutton input").get(0).checked = false;
                this.$el.find(".byte-limit").hide();
            } else if (this.defaultParam.byteNotLimit === 2){
                this.$el.find(".byte-limit-toggle .togglebutton input").get(0).checked = true;
                this.$el.find(".byte-limit").show();
            }
            this.$el.find("#set-limit").val(this.defaultParam.limitSpeed);
            this.updateTimeLimitTable();
        },

        updateTimeLimitTable: function(){
            this.$el.find(".table-ctn").find(".table").remove()
            this.timeLimitTable = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.timeLimitTable.html'])({
                data: this.defaultParam.timeLimitList
            }))

            this.timeLimitTable.find(".delete").on("click", $.proxy(this.onClickTimeLimitTableItemDelete, this));
            this.$el.find(".table-ctn").html(this.timeLimitTable.get(0));
        },

        onClickTimeLimitTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.defaultParam.timeLimitList, function(obj){
                return obj.id !== parseInt(id)
            }.bind(this))

            this.defaultParam.timeLimitList = filterArray;
            this.updateTimeLimitTable();
        },

        onClickAddTimeLimit: function(){
            this.rootNode.modal("hide");

            if (this.addTimeLimitPopup) $("#" + this.addTimeLimitPopup.modalId).remove();

            var myTimeLimitAddEditView = new TimeLimitAddEditView({collection: this.collection});

            var options = {
                title:"添加时间限速",
                body : myTimeLimitAddEditView,
                backdrop : 'static',
                type     : 2,
                onOKCallback: function(){
                    var aTimeLimit = myTimeLimitAddEditView.onSure();
                    if (!aTimeLimit) return;
                    this.defaultParam.timeLimitList.push(aTimeLimit);
                    this.updateTimeLimitTable();
                    this.addTimeLimitPopup.$el.modal("hide");
                    setTimeout(function(){
                        this.rootNode.modal("show")
                    }.bind(this), 500)
                }.bind(this),
                onHiddenCallback: function(){
                    this.rootNode.modal('show')
                }.bind(this)
            }
            setTimeout(function(){
                this.addTimeLimitPopup = new Modal(options);
            }.bind(this), 500)

        },

        initUnitDropdown: function(){
            var  unitArray = [
                {name: "KB", value: 1},
                {name: "MB", value: 2}
            ],
            rootNode = this.$el.find(".byte-limit-unit");
            Utility.initDropMenu(rootNode, unitArray, function(value){
                this.defaultParam.byteNotLimitUnit = parseInt(value)
            }.bind(this));

            var defaultValue = _.find(unitArray, function(object){
                return object.value === this.defaultParam.byteNotLimitUnit;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-byte-limit-unit .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-byte-limit-unit .cur-value").html(unitArray[0].name);
        },

        onClickByteLimitToggle: function(){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.$el.find(".byte-limit").show();
            } else {
                this.$el.find(".byte-limit").hide();
            }
        },

        onSure: function(){
        },

        render: function(target, rootNode) {
            this.$el.appendTo(target);
            this.rootNode = rootNode;
        }
    });

    var ClientLimitSpeedView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.html'])());
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
            this.table = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.table.html'])({
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

            var myAddEditLimitView = new AddEditLimitView({collection: this.collection});

            var options = {
                title:"缓存规则",
                body : myAddEditLimitView,
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

    return ClientLimitSpeedView;
});