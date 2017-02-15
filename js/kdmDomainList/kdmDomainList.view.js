define("kdmDomainList.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddEditDomainView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;

            this.$el = $(_.template(template['tpl/kdmDomainList/kdmDomainList.addEdit.html'])({data: {}}));
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            // this.$el.find(".query").on("click", $.proxy(this.onClickSearchButton, this));

            //假数据
            var blackObj = {
                "method":2,              //增加还是删除黑名单，2为增加，1为删除
                "type": 1,               //黑名单类型，1为 ip，2为cookie, 3为 arg，4为 header
                "start": "3.0.0.0",      //当黑名单类型为1时生效，start 和 end 分别表示 ip 段的起始和结束ip
                "end": "3.4.5.6",
                "ip" : "192.168.123.22",  //当黑名单类型为1时生效，为单个黑名单地址，当改字段设置后，start 和 end 中的值会被忽略
                "key": "host",           //当黑名单类型为非1时生效，表示黑名单的 key
                "value": "test.com",     //当黑民丹类型为非1时生效，表示黑名单的 value
                "measure": 2,            //对该黑名单执行的动作，1为 challenge， 2为captcha，3为 wait，4为 deny，5为 close
                "expired": 1499876383,   //黑名单的过期时间，该时间为 unix 时间，如果过期时间小于当前时间，则该条黑名单会被忽略
                "owner" : 'mc'          //黑名单标签
            };

            var exprObj = {
                "interval": 10,                       //表达式执行间隔
                "ttl": 300,                           //生成黑名单的有效时间
                "expr": '\"count\" \u003e 10',        //表达式形式
                "action": "captcha",                  //生成黑名单要执行的动作，包括 challenge/captcha/wait/deny/close
                "black": [                            //要生成的黑名单 key，必须包括一个，可以有多个
                  "ip"
                ],
               "early_check": true,                   //是否提前检测黑名单的生成
               "owner": "default",                    //生成的黑名单的标签
               "test": false                          //是否为观察模式，true 则为观察模式
            };

            var uriObj = {
                "path": "^/",                          //uri 路径，里边的表达式只会对匹配到该路径的请求生效。支持=(完全匹配）、^（前缀匹配）、~（正则匹配）三种方式。匹配优先级依次递减。
                "blacklist": true,                     //是否生成黑名单，如果为 false，则表达式无效                    
                "exprs": [exprObj],                    //上述的表达式，可以为空，也可以有多个
                "qps": {                               //qps 限流配置
                  "test": false,                       //是否开启观察模式，true 为观察模式
                  "qps" : 5                            //qps 限流阈值，如果为0或者空则表示不限流
                }
            }

            this.defaultParam = {
               "enable": true,                    //域名开关
               "name": "hard",                    //域名名称
               "source_ip": [                     //executor 处理域名配置时获取源 ip 所使用的头部，可以有多个，也可以为空
                 "x-forwarded-for"
               ],
               "whitelist": [ //全局白名单列表，可以有多个，也可以为空
                    {
                        "start": "10.0.0.0", //白名单段起始 ip
                        "end": "10.255.255.255" //白名单段结束 ip
                    }, {
                        "start": "11.11.11.11",
                        "end": "11.11.255.255"
                    }
                ],    //与全局白名单中 wihitelist 含义相同,可以为空
               "blacklist": [blackObj],    //静态黑名单，只支持 type=1 而且 ip 为空的（ip 段类型）黑名单
               "snapshot_ttl": 60,                //动态黑名单快照保存时间
               "template": "hard",                //使用的模板名称
               "blacklist_domain": "test",        //使用的黑名单集合名称
               "uri": [uriObj],                //配置的 uris，可以为空或者多个
               "copy_request": {
                   "enable": true,                       //是否允许 copyrequet
                   "args": false,                        //匹配 url时否包含参数匹配
                   "interval": 3,                        //copyrequet 的最大时间间隔
                   "max_packet": 10000,                  //copyrequet 的最大请求数
                   "max_packet_size": 131072,            //copyrequest 的最大包大小
                   "arg": ["name","time"],               //copyrequest 包含哪些 arg，可以为空或者多个
                   "cookie": ["code"],                   //copyrequest 包含哪些 cookie，可以为空或者多个
                   "header": ["xff"]                     //copyrequest 包含哪些 header，可以为空或者多个
                 }        //copyrequet 格式，具体如上
             }
             console.log(this.model)
             console.log(this.defaultParam)

             this.initSetup();

            // this.collection.off("get.history.success");
            // this.collection.off("get.history.error");
            // this.collection.on("get.history.success", $.proxy(this.initSetup, this));
            // this.collection.on("get.history.error", $.proxy(this.onGetError, this))
            // this.collection.getHistoryList(this.defaultParam);
        },

        initSetup: function(data){
            this.$el.find("#input-domain").val(this.defaultParam.name);
            this.$el.find(".domain-toggle .togglebutton input").get(0).checked = this.defaultParam.enable;

            this.initDropDropdown();

            this.$el.find(".add-white-list").on("click", $.proxy(this.onClickAddWhiteList, this))
            this.convertWhiteListArray();    
            this.updateWhiteListTable();

            this.$el.find(".flow-copy-toggle .togglebutton input").get(0).checked = this.defaultParam.copy_request.enable;
            this.$el.find(".args-copy-toggle .togglebutton input").get(0).checked = this.defaultParam.copy_request.args;
            this.$el.find("#max-request").val(this.defaultParam.copy_request.max_packet);
            this.$el.find("#max-length").val(this.defaultParam.copy_request.max_packet_size);
            this.$el.find("#copy-interval").val(this.defaultParam.copy_request.interval);

            this.convertRequestArray();
            this.$el.find(".add-args").on("click", $.proxy(this.onClickAddRequestArgs, this))
            this.updateRequestArgsTable();
            this.$el.find(".add-cookies").on("click", $.proxy(this.onClickAddRequestCookie, this))
            this.updateRequestCookieTable();
            this.$el.find(".add-header").on("click", $.proxy(this.onClickAddRequestHeader, this))
            this.updateRequestHeaderTable();

            this.convertBlackListArray();
            this.updateBlackListTable();
        },

        convertBlackListArray: function(){
            this.blackListArray = [];
            _.each(this.defaultParam.blacklist, function(el, index, ls){
                var temp = _.extend({}, el)
                temp.id = Utility.randomStr(8);
                if (el.method === 2) temp.methodName = "增加";
                if (el.method === 1) temp.methodName = "删除";
                if (el.type === 1 && el.ip !== "") temp.typeName = "ip";
                if (el.type === 2) temp.typeName = "cookie";
                if (el.type === 3) temp.typeName = "参数";
                if (el.type === 4) temp.typeName = "header";
                if (el.measure === 1) temp.measureName = "challenge";
                if (el.measure === 2) temp.measureName = "captcha";
                if (el.measure === 3) temp.measureName = "wait";
                if (el.measure === 4) temp.measureName = "deny";
                if (el.measure === 5) temp.measureName = "close";
                if (el.type !== 1)
                    temp.valueStr = el.value;
                else if (el.ip !== "")
                    temp.valueStr = el.ip;
                else if (el.start !== "" && el.end !== "")
                    temp.valueStr = el.start + "-" + el.end
                if ((el.expired + "").length < 13)
                    temp.expiredFormated = new Date(el.expired * 1000).format("yyyy/MM/dd hh:mm:ss");
                else
                    temp.expiredFormated = new Date().format("yyyy/MM/dd hh:mm:ss");
                this.blackListArray.push(temp)
            }.bind(this))
        },

        updateBlackListTable: function(){
            this.$el.find(".static-black-list-table").find(".table").remove()
            this.blackListTable = $(_.template(template['tpl/kdmDomainList/kdmDomainList.blackList.table.html'])({
                data: this.blackListArray
            }))
            this.$el.find(".static-black-list-table .table-ctn").html(this.blackListTable.get(0));
            this.blackListTable.find(".delete").on("click", $.proxy(this.onClickBlackListTableItemDelete, this));
        },


        //流量拷贝
        convertRequestArray: function(){
            this.requestArgsArray = [];
            _.each(this.defaultParam.copy_request.arg, function(el, index, ls){
                this.requestArgsArray.push({
                    id: Utility.randomStr(8),
                    value: el
                })
            }.bind(this))

            this.requestCookieArray = [];
            _.each(this.defaultParam.copy_request.cookie, function(el, index, ls){
                this.requestCookieArray.push({
                    id: Utility.randomStr(8),
                    value: el
                })
            }.bind(this))

            this.requestHeaderArray = [];
            _.each(this.defaultParam.copy_request.header, function(el, index, ls){
                this.requestHeaderArray.push({
                    id: Utility.randomStr(8),
                    value: el
                })
            }.bind(this))
        },

        updateRequestHeaderTable: function(){
            this.$el.find(".request-header-table").find(".table").remove()
            this.requestHeaderTable = $(_.template(template['tpl/kdmGlobleSetup/kdmGlobleSetup.sourceIp.table.html'])({
                data: this.requestHeaderArray
            }))
            this.$el.find(".request-header-table .table-ctn").html(this.requestHeaderTable.get(0));
            this.requestHeaderTable.find(".delete").on("click", $.proxy(this.onClickRequestHeaderTableItemDelete, this));
        },

        onClickRequestHeaderTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.requestHeaderArray, function(obj){
                return obj.id !== id
            }.bind(this))

            this.requestHeaderArray = filterArray;
            this.updateRequestHeaderTable();
        },
        
        onClickAddRequestHeader: function(event){
            var eventTarget = event.srcElement || event.target;

            var newKey = this.$el.find("#request-header").val();

            if (newKey === ""){
                alert("你什么都没填")
                return;
            }

            this.requestHeaderArray.push({
                id: Utility.randomStr(8),
                value: newKey
            });
            this.updateRequestHeaderTable();

            this.$el.find("#request-header").val("")
        },

        //请求cookies
        updateRequestCookieTable: function(){
            this.$el.find(".request-cookies-table").find(".table").remove()
            this.requestCookieTable = $(_.template(template['tpl/kdmGlobleSetup/kdmGlobleSetup.sourceIp.table.html'])({
                data: this.requestCookieArray
            }))
            this.$el.find(".request-cookies-table .table-ctn").html(this.requestCookieTable.get(0));
            this.requestCookieTable.find(".delete").on("click", $.proxy(this.onClickRequestCookieTableItemDelete, this));
        },

        onClickRequestCookieTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.requestCookieArray, function(obj){
                return obj.id !== id
            }.bind(this))

            this.requestCookieArray = filterArray;
            this.updateRequestCookieTable();
        },
        
        onClickAddRequestCookie: function(event){
            var eventTarget = event.srcElement || event.target;

            var newKey = this.$el.find("#request-cookies").val();

            if (newKey === ""){
                alert("你什么都没填")
                return;
            }

            this.requestCookieArray.push({
                id: Utility.randomStr(8),
                value: newKey
            });
            this.updateRequestCookieTable();

            this.$el.find("#request-cookies").val("")
        },

        //请求参数
        updateRequestArgsTable: function(){
            this.$el.find(".request-args-table").find(".table").remove()
            this.requestArgsTable = $(_.template(template['tpl/kdmGlobleSetup/kdmGlobleSetup.sourceIp.table.html'])({
                data: this.requestArgsArray
            }))
            this.$el.find(".request-args-table .table-ctn").html(this.requestArgsTable.get(0));
            this.requestArgsTable.find(".delete").on("click", $.proxy(this.onClickRequestArgsTableItemDelete, this));
        },

        onClickRequestArgsTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.requestArgsArray, function(obj){
                return obj.id !== id
            }.bind(this))

            this.requestArgsArray = filterArray;
            this.updateRequestArgsTable();
        },
        
        onClickAddRequestArgs: function(event){
            var eventTarget = event.srcElement || event.target;

            var newKey = this.$el.find("#request-args").val();

            if (newKey === ""){
                alert("你什么都没填")
                return;
            }

            this.requestArgsArray.push({
                id: Utility.randomStr(8),
                value: newKey
            });
            this.updateRequestArgsTable();

            this.$el.find("#request-args").val("")
        },

        //白名单
        convertWhiteListArray: function(){
            this.whiteListObjArray = [];
            _.each(this.defaultParam.whitelist, function(el, index, ls){
                this.whiteListObjArray.push({
                    id: Utility.randomStr(8),
                    start: el.start,
                    end: el.start
                })
            }.bind(this))
        },

        updateWhiteListTable: function(){
            this.$el.find(".white-list").find(".table").remove()
            this.whiteListTable = $(_.template(template['tpl/kdmGlobleSetup/kdmGlobleSetup.whiteList.table.html'])({
                data: this.whiteListObjArray
            }))
            this.$el.find(".white-list .table-ctn").html(this.whiteListTable.get(0));
            this.whiteListTable.find(".delete").on("click", $.proxy(this.onClickWhiteListTableItemDelete, this));
        },

        onClickWhiteListTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.whiteListObjArray, function(obj){
                return obj.id !== id
            }.bind(this))

            this.whiteListObjArray = filterArray;
            this.updateWhiteListTable();
        },

        onClickAddWhiteList: function(event){
            var eventTarget = event.srcElement || event.target;

            var newStart = this.$el.find("#white-list-start").val(),
                newEnd = this.$el.find("#white-list-end").val();

            if (newStart === "" || newEnd === ""){
                alert("开始和结束都需要填写")
                return;
            }

            this.whiteListObjArray.push({
                id: Utility.randomStr(8),
                start: newStart,
                end: newEnd
            });
            this.updateWhiteListTable();

            this.$el.find("#white-list-start").val("");
            this.$el.find("#white-list-end").val("");
        },

        initDropDropdown: function(){
            var  templateArray = [
                {name: "不使用模版", value: ""}
            ],
            rootOtherNode = this.$el.find(".template");
            Utility.initDropMenu(rootOtherNode, templateArray, function(value){
                this.defaultParam.template = value
            }.bind(this));

            var defaultOtherValue = _.find(templateArray, function(object){
                return object.value === this.defaultParam.template;
            }.bind(this));

            if (defaultOtherValue)
                this.$el.find("#dropdown-template .cur-value").html(defaultOtherValue.name);
            else
                this.$el.find("#dropdown-template .cur-value").html(templateArray[0].name);
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var KdmDomainListView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/kdmDomainList/kdmDomainList.html'])());

            // this.initChannelDropMenu();

            // this.collection.on("get.client.success", $.proxy(this.onGetClientMessage, this));
            // this.collection.on("get.client.error", $.proxy(this.onGetError, this));
            // this.collection.on("update.client", $.proxy(this.updateUserInfoView, this));
            this.collection.on("update.domain.table", $.proxy(this.initTable, this));
            // this.collection.on("get.evaluationFlag.success", $.proxy(this.onGetEvaluationSuccess, this));
            // this.collection.on("get.evaluationFlag.error", $.proxy(this.onGetError, this));

            // this.$el.find(".opt-ctn .confirm").on("click", $.proxy(this.onClickConfirmButton, this));
            this.$el.find(".create").on("click", $.proxy(this.onClickAddDomain, this));
            // this.$el.find(".start-assess").on("click", $.proxy(this.onClickStartAssess, this));
            // this.$el.find(".multi-delete").on("click", $.proxy(this.onClickMultiDelete, this));
            // this.$el.find(".history").on("click", $.proxy(this.onClickItemHistory, this));

            // this.enterKeyBindQuery();
            //假数据
            this.collection.push(new this.collection.model({
               "enable": true,    //域名开关
               "name": "hard",    //域名名称
               "source_ip": [                     //executor 处理域名配置时获取源 ip 所使用的头部，可以有多个，也可以为空
                 "x-forwarded-for"
               ],
               "whitelist": [],        //与全局白名单中 wihitelist 含义相同,可以为空
               "blacklist": [],    //静态黑名单，只支持 type=1 而且 ip 为空的（ip 段类型）黑名单
               "snapshot_ttl": 60,                //动态黑名单快照保存时间
               "template": "hard",                //使用的模板名称
               "blacklist_domain": "test",        //使用的黑名单集合名称
               "uri": [],                //配置的 uris，可以为空或者多个
               "copy_request": {}        //copyrequet 格式，具体如上
            }))
            this.collection.trigger("update.domain.table");
        },
        
        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/kdmDomainList/kdmDomainList.table.html'])({
                data: this.collection.models
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemDelete, this));

            // this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
            // this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            var model = this.collection.get(id);
            this.collection.remove(model);
            this.collection.trigger("update.domain.table");
        },

        onClickMultiDelete: function(){
            var checkedList = this.collection.filter(function(obj){
                return obj.get("isChecked") === true;
            }.bind(this))

            this.collection.remove(checkedList);
            this.collection.models.reverse();
            this.collection.trigger("update.assess.table");
        },

        onClickAddDomain: function(){
            var myAddEditDomainView = new AddEditDomainView({
                collection: this.collection,
                onSaveCallback: function(){}.bind(this),
                onCancelCallback: function(){
                    myAddEditDomainView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myAddEditDomainView.render(this.$el.find(".edit-panel"))
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");
            var model = this.collection.get(id);
            model.set("isChecked", eventTarget.checked)

            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            if (checkedList.length === this.collection.models.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.collection.models.length)
                this.table.find("thead input").get(0).checked = false;
            if (checkedList.length === 0) {
                this.$el.find(".multi-delete").attr("disabled", "disabled");
            } else {
                this.$el.find(".multi-delete").removeAttr("disabled", "disabled");
            }
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
            if (eventTarget.checked){
                this.$el.find(".multi-delete").removeAttr("disabled", "disabled");
            } else {
                this.$el.find(".multi-delete").attr("disabled", "disabled");
            }
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

    return KdmDomainListView;
});