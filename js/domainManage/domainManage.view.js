define("domainManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditDomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.isEdit = options.isEdit;

            if(this.isEdit){
                this.args = {
                    id : this.model.get("id"),
                    domain : this.model.get("domain"),
                    userId : this.model.get("userId"),
                    cname : this.model.get("cname"),
                    type : this.model.get("type"),
                    auditStatus : this.model.get("auditStatus"),
                    testUrl : this.model.get("testUrl"),
                    description : this.model.get("description"),
                    originType : this.model.get("originType"),
                    originAddress : this.model.get("originAddress"),
                    cdnFactory : this.model.get("cdnFactory"),
                    confParamNew : this.model.get("confParamNew"),
                    confDomain : this.model.get("confDomain"),
                    urlContent : this.model.get("urlContent"),
                    confRange : this.model.get("confRange"),
                    referNullable : this.model.get("referNullable"),
                    referVisitControl : this.model.get("referVisitControl"),
                    referVisitContent : this.model.get("referVisitContent"),
                    ipVisitControl : this.model.get("ipVisitControl"),
                    wildcard : this.model.get("wildcard"),
                    region : this.model.get("region"),
                    hostType : this.model.get("hostType"),
                    protocol : this.model.get("protocol"),
                    customHostHeader : this.model.get("customHostHeader"),
                    wsUsed : this.model.get("wsUsed"),
                    ipVisitContent : this.model.get("ipVisitContent"),
                    configRole:this.model.get('configRole'),
                    policys:[]
                }
            }else{
                this.args = {
                    id : 0,
                    domain:"",
                    userId:"",
                    cname:"",
                    type:1,
                    auditStatus:1,
                    testUrl:"",
                    description:"",
                    originType:1,
                    originAddress:"",
                    cdnFactory : 1,
                    confParamNew:0,
                    confDomain:"",
                    urlContent:"",
                    confRange:0,
                    referNullable:1,
                    referVisitControl:0,
                    referVisitContent:"",
                    ipVisitControl:0,
                    wildcard:1,
                    region:"",
                    hostType:1,
                    protocol:null,
                    customHostHeader:"",
                    wsUsed : 0,
                    ipVisitContent:"",
                    policys:[]
                }
            }

            this.$el = $(_.template(template['tpl/domainManage/domainManage.add&edit.html'])({data:this.args}));
            //如果点击编辑表单按钮，则将表单字段设置为不可编辑
            if(this.isEdit){
                var inputName = this.$el.find("#input-name");
                var inputUserId = this.$el.find("#input-userId");
                var cname = this.$el.find("#input-cname");
                var dropdownType = this.$el.find("#dropdown-type");
                var dropdownProtocol = this.$el.find("#dropdown-protocol");
                inputName.attr('readonly',true);
                inputUserId.attr('readonly',true);
                cname.attr('readonly',true);
                dropdownType.attr('disabled','disabled');
                dropdownProtocol.attr('disabled','disabled');
                //触发开关按钮
                this.$el.find("[name='my-checkbox']").bootstrapSwitch('state',true);
                this.configurationFiletype = {
                    domain:true,
                    origdomain:true,
                    lua:true
                };
                //console.log(this.args.configRole);
                var self = this;
                //1.生成domain,2.生成originDomain,3.生成lua.conf
                if(this.args.configRole != null){
                    var configRole = this.args.configRole.split(',');
                    var s = ['1','2','3'];
                    s.forEach(function(item,index){
                        var flag = false;
                        for(var i = 0;i<configRole.length;i++){
                            if(item == configRole[i]){
                               flag = true;
                               return;
                            }
                        }
                        if(flag == false){
                            if(item == '1'){
                               self.$el.find(".domain").bootstrapSwitch('state',false);
                               self.configurationFiletype.domain = false;
                            }else if(item == '2'){
                                self.$el.find(".origdomain").bootstrapSwitch('state',false)
                                self.configurationFiletype.origdomain = false;
                            }else if(item == '3'){
                                self.$el.find('.lua').bootstrapSwitch('state',false);
                                self.configurationFiletype.lua = false;
                            }
                        }
                    })
                }
                this.$el.find('.configurationFiletype').on('switchChange.bootstrapSwitch',function(event,state){
                    var target = event.target;
                   switch(target.className){
                      case 'origdomain':
                        self.configurationFiletype.origdomain = state;
                        //console.log(self.configurationFiletype);
                        break;
                      case 'domain':
                        self.configurationFiletype.domain = state;
                        //console.log(self.configurationFiletype);
                        break;
                      case 'lua':
                        self.configurationFiletype.lua = state;
                        //console.log(self.configurationFiletype);
                        break;
                    }
                })
            }
            this.collection.off("get.cacheRuleList.success");
            this.collection.on("get.cacheRuleList.success", $.proxy(this.onGetCacheRuleListSuccess, this));
            this.collection.off("get.cacheRuleList.error");
            this.collection.on("get.cacheRuleList.error", $.proxy(this.onGetError, this));

            this.$el.find(".addCacheRule").on("click", $.proxy(this.onClickAddCacheRule,this));
            this.initDropMenu();
            if(this.args.type == 1){//下载时，协议为空且置灰
                this.$el.find('#dropdown-protocol').attr('disabled','disabled');
                this.$el.find("#dropdown-protocol .cur-value").html('无');
                this.args.protocol = null;
            }

        },

        onGetCacheRuleListSuccess:function(res){
            if(res.length > 0){
                this.table = $(_.template(template['tpl/domainManage/domainManage.add&edit.table.html'])({data:res}));
                this.$el.find(".table-ctn").html(this.table[0]);
            }
            this.$el.find(".table-ctn .delete").off("click");
            this.$el.find(".table-ctn .delete").on("click", $.proxy(this.onClickDelete, this));
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        initDropMenu: function(){
            //加速类型
            var typeList = [
                {name: "下载", value: 1},
                {name: "直播", value: 2}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-type"), typeList, function(value){
                this.args.type = parseInt($.trim(value));
                if(this.args.type == 1){ //下载时，协议为空且置灰
                    this.$el.find('#dropdown-protocol').attr('disabled','disabled');
                    this.$el.find("#dropdown-protocol .cur-value").html('无');
                    this.args.protocol = null;
                }else{
                    this.$el.find('#dropdown-protocol').removeAttr('disabled');
                    this.$el.find("#dropdown-protocol .cur-value").html('http+flv');
                    this.args.protocol = 1;
                }
            }.bind(this));
            if(this.args.type == null){
               this.args.type = typeList[0].value;
            }
            if(this.isEdit){
                $.each(typeList,function(k,v){

                    if(v.value == this.model.get("type")){
                        this.$el.find("#dropdown-type .cur-value").html(v.name);
                    }
                }.bind(this));
            }

            //审核状态
            /*
            var auditStatusList = [
                {name: "审核通过", value: 1},
                {name: "审核中", value: 0}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-auditStatus"), auditStatusList, function(value){
                this.args.auditStatus = parseInt(value);
            }.bind(this));
            if(this.isEdit){
                $.each(auditStatusList,function(k,v){
                    if(v.value == this.model.get("auditStatus")){
                        this.$el.find("#dropdown-auditStatus .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            */

            //过滤参数
            var confParamNewList = [
                {name: "是", value: 1},
                {name: "否", value: 0},
                {name: "带?自定义域名", value: 2},
                {name: "不带?自定义域名", value: 3}
            ];
            if(this.args.confParamNew == null){
              this.args.confParamNew = confParamNewList[1].value;
            }
            Utility.initDropMenu(this.$el.find(".dropdown-confParamNew"), confParamNewList, function(value){
                this.args.confParamNew = parseInt($.trim(value));
                if(this.args.confParamNew > 1){
                    this.$el.find("#input-confDomain").parent().show().removeClass("fadeOutLeft").addClass("fadeInLeft");
                }else{
                    this.$el.find("#input-confDomain").parent().removeClass("fadeInLeft").addClass("fadeOutLeft");
                    setTimeout(function(){
                        this.$el.find("#input-confDomain").parent().hide();
                    }.bind(this),500);
                    this.$el.find("#input-confDomain").val("");
                }
            }.bind(this));
            if(this.isEdit){
                $.each(confParamNewList,function(k,v){
                    if(v.value == this.model.get("confParamNew")){
                        this.$el.find("#dropdown-confParamNew .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //回源类型
            var originTypeList = [
                {name: "IP", value: 1},
                {name: "源站域名", value: 2},
                {name: "OSS域名", value: 3}
            ];
            if(this.args.originType == null){
              this.args.originType = originTypeList[0].value;
            }
            Utility.initDropMenu(this.$el.find(".dropdown-originType"), originTypeList, function(value){
                this.args.originType = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(originTypeList,function(k,v){
                    if(v.value == this.model.get("originType")){
                        this.$el.find("#dropdown-originType .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //range回源
            var confRangeList = [
                {name: "是", value: 1},
                {name: "否", value: 0}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-confRange"), confRangeList, function(value){
                this.args.confRange = parseInt($.trim(value));
            }.bind(this));
            if(this.args.confRange == null){
              this.args.confRange = confRangeList[1].value;
            }
            if(this.isEdit){
                $.each(confRangeList,function(k,v){
                    if(v.value == this.model.get("confRange")){
                        this.$el.find("#dropdown-confRange .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //refer是否为空
            var referNullableList = [
                {name: "是", value: 1},
                {name: "否", value: 0}
            ];
            if(this.args.referNullable == null){
               this.args.referNullable = referNullableList[0].value;
            }
            Utility.initDropMenu(this.$el.find(".dropdown-referNullable"), referNullableList, function(value){
                this.args.referNullable = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(referNullableList,function(k,v){
                    if(v.value == this.model.get("referNullable")){
                        this.$el.find("#dropdown-referNullable .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //refer防盗链开关及类型
            var referVisitControlList = [
                {name: "关闭", value: 0},
                {name: "白名单", value: 1},
                {name: "黑名单", value: 2}
            ];
            if(this.args.referVisitControl == null){
               this.args.referVisitControl = referVisitControlList[0].value;
            }
            Utility.initDropMenu(this.$el.find(".dropdown-referVisitControl"), referVisitControlList, function(value){
                this.args.referVisitControl = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(referVisitControlList,function(k,v){
                    if(v.value == this.model.get("referVisitControl")){
                        this.$el.find("#dropdown-referVisitControl .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //IP防盗链开关及类型
            var ipVisitControlList = [
                {name: "关闭", value: 0},
                {name: "白名单", value: 1},
                {name: "黑名单", value: 2}
            ];
            if(this.args.ipVisitControl == null){
               this.args.ipVisitControl = ipVisitControlList[0].value;
            }
            Utility.initDropMenu(this.$el.find(".dropdown-ipVisitControl"), ipVisitControlList, function(value){
                this.args.ipVisitControl = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(ipVisitControlList,function(k,v){
                    if(v.value == this.model.get("ipVisitControl")){
                        this.$el.find("#dropdown-ipVisitControl .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //泛域名标识
            var wildcardList = [
                {name: "普通域名", value: 1},
                {name: "泛域名", value: 2}
            ];
            if(this.args.wildcard == null){
               this.args.wildcard = wildcardList[0].value;
            }
            Utility.initDropMenu(this.$el.find(".dropdown-wildcard"), wildcardList, function(value){
                this.args.wildcard = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(wildcardList,function(k,v){
                    if(v.value == this.model.get("wildcard")){
                        this.$el.find("#dropdown-wildcard .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //回源host头类型
            var hostTypeList = [
                {name: "加速域名", value: 1},
                {name: "回源域名", value: 2}
            ];
            if(this.args.hostType == null){
               this.args.hostType = hostTypeList[0].value;
           }
            Utility.initDropMenu(this.$el.find(".dropdown-hostType"), hostTypeList, function(value){
                this.args.hostType = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(hostTypeList,function(k,v){
                    if(v.value == this.model.get("hostType")){
                        this.$el.find("#dropdown-hostType .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //使用的协议
            var protocolList = [
                {name: "http+flv", value: 1},
                {name: "hls", value: 2},
                {name: "rtmp", value: 3}
            ];
            this.protocolList = null;
            Utility.initDropMenu(this.$el.find(".dropdown-protocol"), protocolList, function(value){
                this.args.protocol = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(protocolList,function(k,v){
                    if(v.value == this.model.get("protocol")){
                        this.$el.find("#dropdown-protocol .cur-value").html(v.name);
                    }
                }.bind(this));
            }else{
                if(this.args.type != 1){
                    this.$el.find("#dropdown-protocol .cur-value").html(protocolList[0].name);
                }
            }
        },

        onClickAddCacheRule:function(){
            if(this.isEdit){
                window.editDomainPopup.$el.modal("hide");
            }else{
                window.addDomainPopup.$el.modal("hide");
            }
            setTimeout(function() {
                this.onClickAddCacheRuleModal();
            }.bind(this), 500);
        },

        onClickDelete: function(e){
            var eTarget = e.srcElement || e.target,currentTr;

            if (eTarget.tagName == "SPAN") {
                currentTr = $(eTarget).parent().parent().parent();
            } else {
                currentTr = $(eTarget).parent().parent();
            }
            currentTr.remove();
            var tbodyLen = this.$el.find(".table-ctn tbody").children().length;
            if(!tbodyLen){
                this.$el.find(".table-ctn table").remove();
            }
        },

        onClickAddCacheRuleModal:function(){
            if (this.addCacheRulePopup) $("#" + this.addCacheRulePopup.modalId).remove();

            var addCacheRuleView = new AddCacheRuleView({
                collection: this.collection
            });
            var options = {
                title:"添加缓存规则",
                body : addCacheRuleView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = addCacheRuleView.getArgs();
                    if (!options) return;
                    this.addCacheRulePopup.$el.modal("hide");
                    if(this.isEdit){
                        setTimeout(function() {
                            window.editDomainPopup.$el.modal("show");
                        }.bind(this), 500);
                    }else{
                        setTimeout(function() {
                            window.addDomainPopup.$el.modal("show");
                        }.bind(this), 500);
                    }
                    //添加缓存规则列表
                    var tableLen = this.$el.find(".table-ctn").children().length;
                    if(tableLen){
                        this.tr = $(_.template(template['tpl/domainManage/domainManage.cacheRule.tableTr.html'])({data:options}));
                        this.$el.find(".table-ctn tbody").append(this.tr[0].outerHTML);
                    }else{
                        this.table = $(_.template(template['tpl/domainManage/domainManage.add&edit.table.html'])({data:[options]}));
                        this.$el.find(".table-ctn").html(this.table[0]);
                    }
                    this.$el.find(".table-ctn .delete").off("click");
                    this.$el.find(".table-ctn .delete").on("click", $.proxy(this.onClickDelete, this));

                    //所有缓存规则（对象数组）
                    //this.args.policys.push(options);
                }.bind(this),
                onHiddenCallback: function(){
                    if(this.isEdit){
                        window.editDomainPopup.$el.modal("show");
                    }else{
                        window.addDomainPopup.$el.modal("show");
                    }
                }.bind(this)
            }
            this.addCacheRulePopup = new Modal(options);
        },

        getArgs: function() {
            this.args.domain = $.trim(this.$el.find("#input-name").val());
            this.args.userId = $.trim(this.$el.find("#input-userId").val());
            this.args.cname = $.trim(this.$el.find("#input-cname").val());
            this.args.testUrl = $.trim(this.$el.find("#input-testUrl").val());
            this.args.originAddress = $.trim(this.$el.find("#textarea-originAddress").val());
            this.args.referVisitContent = $.trim(this.$el.find("#textarea-referVisitContent").val());
            this.args.ipVisitContent = $.trim(this.$el.find("#textarea-ipVisitContent").val());
            this.args.region = $.trim(this.$el.find("#textarea-region").val());
            this.args.customHostHeader = $.trim(this.$el.find("#input-customHostHeader").val());
            this.args.confDomain = $.trim(this.$el.find("#input-confDomain").val());
            this.args.urlContent = $.trim(this.$el.find("#textarea-urlContent").val());
            this.args.description = $.trim(this.$el.find("#textarea-description").val());
            //开关的值处理函数
            var configRoleType = '';
            for(var key in this.configurationFiletype){
                if(key == 'domain' && this.configurationFiletype.domain){
                     if(configRoleType != ''){
                      configRoleType = configRoleType + ',' +1;
                    }else{
                        configRoleType = 1;
                    }
                }else if(key == 'origdomain' && this.configurationFiletype.origdomain){
                    //console.log('originDomain');
                    if(configRoleType != ''){
                      configRoleType = configRoleType + ',' +2;
                    }else{
                        configRoleType = 2;
                    }
                }else if(key == 'lua' && this.configurationFiletype.lua){
                    //console.log('lua.conf');
                    if(configRoleType != ''){
                        configRoleType = configRoleType+ ',' +3;
                    }else{
                        configRoleType = 3;
                    }
                }
            }
            this.args.configRole = configRoleType;

            //收集缓存规则
            var trLen = this.$el.find(".table-ctn tbody").children().length;
            for(var i = 0; i< trLen; i++){
                var json = {
                    type : $.trim(this.$el.find(".table-ctn tbody").children().eq(i).children().eq(0).attr("value")),
                    hasOriginPolicy : $.trim(this.$el.find(".table-ctn tbody").children().eq(i).children().eq(1).attr("value")),
                    policy : $.trim(this.$el.find(".table-ctn tbody").children().eq(i).children().eq(2).attr("value")),
                    expireTime : $.trim(this.$el.find(".table-ctn tbody").children().eq(i).children().eq(3).attr("value"))
                }
                this.args.policys.push(json);
            }
            if(!this.args.domain || this.args.domain == ""){
                alert("请填写加速域名");
                return false;
            }

            if(!this.args.userId || this.args.userId == ""){
                alert("请填写用户ID");
                return false;
            }

            if(!this.args.cname || this.args.cname == ""){
                alert("请填写cname");
                return false;
            }
            return this.args;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var AddCacheRuleView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.$el = $(_.template(template['tpl/domainManage/domainManage.addCacheRule.html'])());
            this.initDropMenu();
        },

        initDropMenu:function(){
            //类型
            var typeList = [
                {name: "文件后缀", value: 0},
                {name: "目录", value: 1},
                {name: "具体url",value:2},
                {name: "正则预留",value:3},
                {name: "url包含指定参数",value:4},
                {name: "全局默认缓存配置项",value:9}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-type"), typeList, function(value){
                this.type = value;
                if(value == 9){
                    this.$el.find(".dropdown-hasOriginPolicy .cur-value").html("是");
                }else{
                    this.$el.find(".dropdown-hasOriginPolicy .cur-value").html("否");
                }
            }.bind(this));

            //是否遵循源站
            var originPolicyList = [
                {name: "是", value: true},
                {name: "否", value: false}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-hasOriginPolicy"), originPolicyList, function(value){
                this.hasOriginPolicy = $.trim(value);
            }.bind(this));
        },

        getArgs: function() {
            var defalutHasOriginPolicy = false;

            if(this.type && this.type == 9){
                defalutHasOriginPolicy = true;
            }

            return {
                type : this.type ? this.type : this.$el.find("#dropdown-type").siblings().children().eq(0).attr('value'),
                hasOriginPolicy : this.hasOriginPolicy != undefined ? this.hasOriginPolicy : defalutHasOriginPolicy,
                policy : $.trim(this.$el.find("#textarea-policy").val()),
                expireTime : $.trim(this.$el.find("#input-expireTime").val()) == "" ? 0 : parseInt($.trim(this.$el.find("#input-expireTime").val()))
            }
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var DomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            console.log(this.collection);
            this.$el = $(_.template(template['tpl/domainManage/domainManage.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.initPageDropMenu();

            this.getPageArgs = {
                domain: "",
                factory:"",
                type:"",
                protocol:"",
                page: 1,
                count: 10
            };
            console.log(this.collection);

            this.collection.getDomainList(this.getPageArgs); //请求域名列表接口

            this.collection.on("get.domainList.success", $.proxy(this.onGetDomainListSuccess,this));
            this.collection.on("get.domainList.error", $.proxy(this.onGetError,this));
            this.collection.on("delete.domain.success", $.proxy(this.onDeleteDomainSuccess, this));
            this.collection.on("delete.domain.error", $.proxy(this.onGetError,this));
            this.collection.on("delete.configuration.success", $.proxy(this.onDeleteConfigurationSuccess, this));
            this.collection.on("delete.configuration.err", $.proxy(this.onDeleteConfigurationError, this));
            this.collection.on("send.domain.success", $.proxy(this.onSendDomainSuccess, this));
            this.collection.on("send.domain.error", $.proxy(this.onGetError,this));
            this.collection.on("add.domain.success", $.proxy(this.onAddDomainSuccess, this));
            this.collection.on("add.domain.error", $.proxy(this.onGetError,this));
            this.collection.on("edit.domain.success", $.proxy(this.oneditDomainSuccess, this));
            this.collection.on("edit.domain.error", $.proxy(this.onGetError,this));
            this.collection.on("sendAllOrigin.domain.success", $.proxy(this.onSendAllOriginSuccess, this));
            this.collection.on("sendAllOrigin.domain.error", $.proxy(this.onGetError,this));

            if(AUTH_OBJ.DomainManagerAdd) 
                this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
            else
                this.$el.find(".opt-ctn .create").remove();

            if(AUTH_OBJ.DomainManagerSendAll)
                this.$el.find(".opt-ctn .sendAll").on("click", $.proxy(this.onClickSendAll, this));
            else
                this.$el.find(".opt-ctn .sendAll").remove();

            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            this.enterKeyBindQuery();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.getPageArgs.page = 1;
            this.getPageArgs.domain = this.$el.find("#input-domain").val();
            if (this.getPageArgs.domain == "") this.getPageArgs.domain = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getDomainList(this.getPageArgs);
        },

        initTable: function(){
            if (this.collection.models.length !== 0){
                this.table = $(_.template(template['tpl/domainManage/domainManage.table.html'])({data:this.collection.models}));
                this.$el.find(".table-ctn").html(this.table[0]);
            }else{
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onGetDomainListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
            if(AUTH_OBJ.DomainManagerUpdate) 
                this.$el.find(".table-ctn .edit").on("click", $.proxy(this.onClickEdit, this));
            else
                this.$el.find(".table-ctn .edit").remove();

            if(AUTH_OBJ.DomainManagerDelete)
                this.$el.find(".table-ctn .delete").on("click", $.proxy(this.onClickDelete, this));
            else
                this.$el.find(".table-ctn .delete").remove();
            if(AUTH_OBJ.DomainManagerSend)
                this.$el.find(".table-ctn .send").on("click", $.proxy(this.onClickSend, this));
            else
                this.$el.find(".table-ctn .send").remove();

            if(AUTH_OBJ.DomainManagerDeleteConfig)
                this.$el.find(".table-ctn .deleteConfiguration").on("click", $.proxy(this.onClickDeleteConfiguration, this));
            else
                this.$el.find(".table-ctn .deleteConfiguration").remove();
            
            this.table.find("tbody .description").tooltip({
                animation  : false,
                "placement": "top", 
                "html"     : true,
                "title"  : function(){return $(this).attr("remark")}, 
                "trigger"  : "hover"
            })
        },

        onSendAllOriginSuccess:function(res){
            alert("所有域名下发成功");
            this.onClickQueryButton();
        },

        onDeleteDomainSuccess:function(res){
            alert("域名删除成功");
            this.onClickQueryButton();
        },
        onDeleteConfigurationSuccess:function(res){
            alert("一键删除域名的所有配置成功");
            this.onClickQueryButton();
        },
        onSendDomainSuccess:function(res){
            alert("域名下发成功");
            this.onClickQueryButton();
        },

        onAddDomainSuccess:function(res){
            alert("域名添加成功");
            this.onClickQueryButton();
        },

        oneditDomainSuccess:function(res){
            alert("域名修改成功");
            this.onClickQueryButton();
        },

        onClickCreate: function(){
            if (this.addDomainPopup) $("#" + this.addDomainPopup.modalId).remove();

            var addDomainView = new AddOrEditDomainManageView({
                collection: this.collection,
                isEdit: false
            });
            var options = {
                title:"添加域名",
                body : addDomainView,
                backdrop : 'static',
                type     : 2,
                height   : 500,
                onOKCallback:  function(){
                    var options = addDomainView.getArgs();
                    if (!options) return;
                    this.collection.addDomain(options);
                    this.addDomainPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addDomainPopup = new Modal(options);
            window.addDomainPopup = this.addDomainPopup;
        },

        onClickSendAll: function(){
            this.collection.sendAllOrigin();
        },

        onClickEdit:function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }
            this.collection.getCacheRuleList(id); //调用显示缓存规则列表

            var model = this.collection.get(id);

            if(this.editDomainPopup) $("#" + this.editDomainPopup.modalId).remove();

            var editDomainView = new AddOrEditDomainManageView({
                collection: this.collection,
                model: model,
                isEdit: true
            });

            var options = {
                title:"编辑域名",
                body : editDomainView,
                backdrop : 'static',
                type     : 2, 
                height   : 500,
                onOKCallback:  function(){
                    var options = editDomainView.getArgs();
                    //console.log(options);
                    if (!options) return;
                    this.collection.editDomain(options);
                    this.editDomainPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.editDomainPopup = new Modal(options);
            window.editDomainPopup = this.editDomainPopup;
        },

        onClickDelete:function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }
            var result = confirm("你确定要删除当前域名吗？")
            if (!result) return;
            //请求删除接口
            this.collection.deleteDomain(id);
        },
        onClickDeleteConfiguration:function(e){
            var eTarget = e.srcElement || e.target,id;

            if(eTarget.tagName == "SPAN") {
                domains = $(eTarget).parent().attr("domain");
            }else {
                domains = $(eTarget).attr("domain");
            }
            var result = confirm("是否确定一键删除域名的所有配置？");
            if(!result) return;
            //请求一键删除域名的所有配置接口
            this.collection.deleteConfiguration(domains);

        },
        onClickSend:function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }

            var result = confirm("你确定要下发吗？")
            if (!result) return;
            //请求下发接口传id
            this.collection.sendDomain(id);
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.getPageArgs.count) return;
            var total = Math.ceil(this.collection.total/this.getPageArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.getPageArgs);
                        args.page = num;
                        args.count = this.getPageArgs.count;
                        this.collection.getDomainList(args); //请求域名列表接口
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initPageDropMenu: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.getPageArgs.count = value;
                this.getPageArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));


            var factoryList = [
                {name:"全部",value:""},
                {name:"自建",value:"1"},
                {name:"网宿",value:"2"}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-cdn-factory"), factoryList, function(value){
                this.getPageArgs.factory = value || null;
            }.bind(this));


            var typeList = [
                {name:"全部",value:""},
                {name:"下载",value:"1"},
                {name:"直播",value:"2"}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-speed-type"), typeList, function(value){
                this.getPageArgs.type = value || null;
            }.bind(this));


            var protocolList = [
                {name:"全部",value:""},
                {name:"http+flv",value:"1"},
                {name:"hls",value:"2"},
                {name:"rtmp",value:"3"}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-use-protocol"), protocolList, function(value){
                this.getPageArgs.protocol = value || null;
            }.bind(this));

        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function() {
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function() {
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DomainManageView;
});
