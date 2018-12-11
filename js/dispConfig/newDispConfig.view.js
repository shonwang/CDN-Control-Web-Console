define("newDispConfig.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DiffBeforeSend = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.groupId  = options.groupId;

            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.diffBeforeSend.html'])({}));
            this.$el.find(".diff-table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.$el.find(".ok-again").on("click", $.proxy(this.onClickOK, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancel, this));

            this.collection.off("send.diff.success");
            this.collection.off("send.diff.error");
            this.collection.on("send.diff.success", $.proxy(this.initTable, this));
            this.collection.on("send.diff.error", $.proxy(this.onGetError, this));

            this.collection.diffBeforeSend(options.sendData)
        },

        onClickCancel: function(){
            this.options.cancelCallback&&this.options.cancelCallback();
        },

        initTable: function(res){
            this.diffData = res;
            this.table = $(_.template(template['tpl/dispConfig/dispConfig.table.diff.html'])({
                data: this.diffData
            }));

            if (this.diffData.length === 0){
                this.$el.find(".diff-table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data:{message: "无变化"}
                }));
            } else {
                this.$el.find(".diff-table-ctn").html(this.table[0]);
            }
        },

        getSendData: function(){
            var diffData = this.diffData;
            var calculate = [];
            var origin = [];
            var typeArray1 =[];//增加的
            var typeArray2 =[];//删除的

            _.each(diffData,function(el){
                _.each(el.list,function(listEl){
                    var obj = {
                        "dgroupId":el.dispGroupId,
                        "nodeId":listEl.nodeId,
                        "regionId":listEl.regionLineId,
                        "ttl":listEl.ttl || 0,
                        "ipNum":listEl.currNum,
                        "nodeName":listEl.nodeName,
                        "type":listEl.type,
                        "isIpV6":listEl.isIpV6
                    };
                    origin.push(obj);                  
                    if(obj.type == 1){
                        typeArray1.push(obj);
                    }
                    else if(obj.type == -1){
                        typeArray2.push(obj);
                    }
                });
            });

            var temp3Array = [];
            _.each(typeArray2,function(el2){

                var tempObj = _.find(typeArray1, function(el1){
                    return el2.nodeId === el1.nodeId && el2.regionId === el1.regionId
                }.bind(this));
                if (!tempObj) {
                    el2.ipNum = 0
                    temp3Array.push(el2);
                }

            });
            calculate = typeArray1.concat(temp3Array);
            return {
                calculate: calculate,
                origin: origin
            };
        },

        onClickOK: function(){
            var comment = this.$el.find("#textarea-comment").val().trim();
            if (!comment) {
                this.$el.find("#textarea-comment").focus();
                return;
            }

            Utility.confirm("你确定要下发KDNS吗？", function(){
                var postParam = this.getSendData();
                postParam.comment = comment
                this.options.okCallback&&this.options.okCallback(postParam);
            }.bind(this))

        },

        onGetError: function(error){
            this.$el.find(".ok-again").hide();
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    var NewDispConfigView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.dispGroupCollection = options.dispGroupCollection;
            this.diffCollection = options.diffCollection;
            this.count = 39;
            this.regionList = [];
            this.nodeNameList = [];
            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.html'])({permission: AUTH_OBJ}));

            this.collection.on("get.dispGroup.success", $.proxy(this.onDispGroupListSuccess, this));
            this.collection.on("get.dispGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("get.dispConfig.success", $.proxy(this.onDispConfigListSuccess, this));
            this.collection.on("get.dispConfig.error", $.proxy(this.onGetError, this));

            this.collection.on("init.dispConfig.success", $.proxy(this.onDispConfigListSuccess, this));
            this.collection.on("init.dispConfig.error", function(error){
                //this.disablePopup.$el.modal('hide');
                this.onGetError(error)
                this.$el.find(".opt-ctn .init").show();
            }.bind(this));
            this.collection.on("get.regionAdvice.error", $.proxy(this.onGetError, this));

            this.collection.on("dispDns.success", function(){
                this.disablePopup.$el.modal('hide');
                this.$el.find(".opt-panel").slideDown(200);
                Utility.showMainList(this.$el, ".main-list", ".diff-send-panel", ".diff-send-ctn");
                Utility.alerts("下发成功！", "success", 5000)
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("dispDns.error", function(res){
                this.disablePopup.$el.modal('hide');
                this.onGetError(res)
            }.bind(this));

            this.listenScroll();

            this.initDispConfigDropMenu();
            
            if (AUTH_OBJ.DispatchGslbConfig)
                this.$el.find(".opt-ctn .sending").on("click", $.proxy(this.onClickSending, this));
            else
                this.$el.find(".opt-ctn .sending").remove();

            if (AUTH_OBJ.QueryGslbConfig){
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                this.enterKeyBindQuery();
            } else {
                this.$el.find(".opt-ctn .query").remove();
            }
            this.$el.find(".opt-ctn .init").on("click", $.proxy(this.onClickInitButton, this));

            this.$el.find(".page-ctn").hide();
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
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        onDispConfigListSuccess: function(){
            this.$el.find(".version-time").html("Last version");
            this.$el.find(".opt-ctn .sending").show();
            this.initTable();
            //if (!this.isInitPaginator) this.initPaginator();
            this.$el.find("#disp-config-filter").val("");
            this.$el.find("#disp-config-filter").off("keyup");
            this.$el.find("#disp-config-filter").on("keyup", $.proxy(this.onKeyupDispConfigListFilter, this));
        },

        onKeyupDispConfigListFilter: function() {
            if (!this.collection.models || this.collection.models.length === 0) return;
            var keyWord = this.$el.find("#disp-config-filter").val().trim();
            this.regionList = [];
            this.nodeNameList = [];
            this.preRegionName = ''
            _.each(this.collection.models, function(model, index, list) {
                var that = this;
                if (keyWord === ""){

                    model.set("isDisplay", true);
                    _.each(model.get("list"), function(modelL3, indexL3, listL3) {
                        modelL3.isDisplay = true;
                    })
                } else if (this.curSearchType == "1"){
                    // model.set("isDisplay", false);
                    if (model.get("region").name.indexOf(keyWord) > -1){
                        this.regionList.push(model) ;
                        model.set("isDisplay", true);

                    } else {
                        model.set("isDisplay", false);
                    }

                    _.each(model.get("list"), function(modelL4, indexL4, listL4) {
                        modelL4.isDisplay = true;
                    })
                } else if (this.curSearchType == "2"){
                    model.set("isDisplay", false);
                    for(var i = 0;i < model.get("list").length;i++){
                        if(model.get("list")[i].nodeName && model.get("list")[i].nodeName.indexOf(keyWord) > -1){

                            this.regionName = model.get("list")[i].regionName;
                            if(this.preRegionName == this.regionName){
                                continue;
                            } else {
                                model.get("list")[i].isDisplay = true;
                                model.set("isDisplay", true);
                                that.nodeNameList.push(model)
                                this.preRegionName = this.regionName
                            }
                        }else {
                            // this.preRegionName = '';
                            model.get("list")[i].isDisplay = false;
                        }
                    }
                    _.each(model.get("list"),function (model4) {
                        if(model4.regionName){
                            if(model4.regionName == that.regionName){
                                model4.isDisplay = true;
                            }else {
                                model4.isDisplay = false;
                            }
                        }
                    })
                }
            }.bind(this));
            this.initTable();
        },

        onClickInitButton: function(){
            this.$el.find(".opt-ctn .init").hide();
            var args = _.extend({}, this.queryArgs);
            delete args.page;
            delete args.count;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.initDispConfigList(args);
        },

        onClickQueryButton: function(){
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getDispConfigList(this.queryArgs,function(data){
                this.oldData = JSON.stringify(data);
            }.bind(this));
            this.nodeNameList = [];
            this.regionList = [];
            //this.showDisablePopup("数据加载中，请耐心等待!");
        },

        onClickSending: function(){
            var diffBeforeSendView = new DiffBeforeSend({
                collection: this.collection, 
                diffCollection: this.diffCollection,
                groupId   : this.queryArgs.groupId,
                sendData  : this.getSendData(),
                cancelCallback: function(){
                    this.$el.find(".opt-panel").slideDown(200);
                    Utility.showMainList(this.$el, ".main-list", ".diff-send-panel", ".diff-send-ctn");
                }.bind(this),
                okCallback:  function(postParam){
                    this.onSureSending(postParam);
                }.bind(this)
            });
            diffBeforeSendView.render(this.$el.find(".diff-send-panel"));

            Utility.hideMainList(this.$el, ".main-list", ".diff-send-panel");
            this.$el.find(".opt-panel").hide();
        },

        getSendData: function(postParam){
            var _oldData = this.oldData;
            var oldData = JSON.parse(_oldData);
            var newData = [];
            _.each(this.collection.models,   function(el, index, list){
                newData.push(el.attributes);
            }.bind(this))

            return {
                oldData:oldData,
                newData:newData
            };
        },

        onSureSending: function(postParam){
            var args = {
                list:postParam,
                groupId:this.queryArgs.groupId
            }
            this.collection.dispDns(args)
            this.showDisablePopup("下发中，请耐心等待...")
        },

        showDisablePopup: function(msg) {
            if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
            var options = {
                title    : "警告",
                body     : '<div class="alert alert-danger"><strong>' + msg +'</strong></div>',
                backdrop : 'static',
                type     : 0,
            }
            this.disablePopup = new Modal(options);
            this.disablePopup.$el.find(".close").remove();
        },
        listenScroll:function(){
            $(window).on('scroll',function(){
                if(this.scrollTop() + this.windowHeight() >= (this.documentHeight()/*滚动响应区域高度取50px*/)){
                    this.count += 10;
                    this.initTable()
                }
            }.bind(this));
        },
        //获取页面被卷曲的高度
        scrollTop: function(){
            return Math.max(
                //chrome
                document.body.scrollTop,
                //firefox/IE
                document.documentElement.scrollTop);

        },
        //获取页面文档高度
        documentHeight: function(){
            //现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
            return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
        },
        //获取页面浏览器的可视高度
        windowHeight: function(){
            return (document.compatMode == "CSS1Compat")?
                document.documentElement.clientHeight:
                document.body.clientHeight;
        },
        initTable: function(isHistory, isDiff){
            var keyWord = this.$el.find("#disp-config-filter").val().trim();
            var data = this.collection.models;
            var dataList;
            if(this.regionList && this.regionList.length > 0){
                this.table = $(_.template(template['tpl/dispConfig/dispConfig.table.new.html'])({
                    data: this.regionList,
                    permission: AUTH_OBJ
                }));
            }else if(this.nodeNameList && this.nodeNameList.length > 0){
                this.table = $(_.template(template['tpl/dispConfig/dispConfig.table.new.html'])({
                    data: this.nodeNameList,
                    permission: AUTH_OBJ
                }));
            }
            else{
                if(data.length > 0){
                    if(data.length > 40){
                        dataList = data.slice(0,this.count);
                        this.table = $(_.template(template['tpl/dispConfig/dispConfig.table.new.html'])({
                            data: dataList,
                            permission: AUTH_OBJ
                        }));
                    }
                }
            }
            // this.table = $(_.template(template['tpl/dispConfig/dispConfig.table.new.html'])({
            //     data: this.collection.models,
            //     permission: AUTH_OBJ
            // }));
            if (this.collection.models.length === 0){
                if (!isDiff){
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
                } else {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data:{message: "张彬仔细对比了一番，没有变化！"}
                    }));
                }
                this.$el.find(".opt-ctn .sending").hide();
            } else {
                this.$el.find(".table-ctn").html(this.table[0]);
                this.$el.find(".opt-ctn .init").hide();
                if (!isHistory) this.$el.find(".opt-ctn .sending").show(); 
            }

            this.nodesEl = this.table.find("tbody .nodes .edit")
            this.nodesEl.on("click", $.proxy(this.onClickItemEdit, this));
            this.table.find("tbody .nodes .delete").on("click", $.proxy(this.onClickItemDelete, this));
            this.table.find("tbody .nodes .weight").on("keyup", $.proxy(this.onKeyupItemWeightInput, this));
            this.table.find("tbody .nodes .weight").on("blur", $.proxy(this.onBlurItemWeightInput, this));
            this.table.find("tbody .nodes .weight").on("click", $.proxy(this.onClickItemWeightInput, this));//火狐浏览器的数字控件不会自动聚焦，需要强制获取焦点
            this.table.find("tbody .add").on("click", $.proxy(this.onClickItemAdd, this));
            

        },

        onKeyupItemWeightInput: function(event){
            var eventTarget = event.srcElement || event.target,
                value = $(eventTarget).val(),
                maxValue = $(eventTarget).attr("max"),
                re = /^\d+$/;
            if (!re.test(value)){
                $(eventTarget).val("1");
                return
            }
            if (parseInt(value) > parseInt(maxValue)){
                $(eventTarget).val("1")
            }
        },

        onBlurItemWeightInput: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId, value;
            value    = $(eventTarget).val();
            id       = $(eventTarget).attr("node-Id");
            regionId = $(eventTarget).attr("region-id");
            isIpV6   = $(eventTarget).attr("isIpV6") == "true" ? 1 : 0;
            var model = this.collection.get(regionId),
                list = model.get("list");
            var selectedNode = _.filter(list ,function(obj) {
                return obj["nodeId"] === parseInt(id) && obj["isIpV6"] == isIpV6;
            })
            selectedNode[0].currNum = parseInt(value);
        },

        onClickItemWeightInput: function(event){
            var eventTarget = event.srcElement || event.target;
            $(eventTarget).focus();
        },

        getFixedProperty:function(model){
            //添加的时候，需要有默认值传入
            var obj = {};
            obj["dispDomain"] = model.get("dispGroupDomain");
            obj["dispGroupId"] = model.get("dispGroupId");
            obj["id"] = model.get("id");
            obj["regionLineId"] = model.get("region").id;
            obj["regionName"] = model.get("region").name;   
            obj["ttl"] = model.get("ttl");            
            return obj;
        },

        getOldList:function(list){
            var obj = {};
            for(var i=0,_len=list.length;i<_len;i++){
                obj[list[i].nodeId] = true;
            }
            return obj;
        },

        checkIpV6:function(list,nodeId,isIpV6){
            for(var i=0;i<list.length;i++){
                if(list[i].nodeId == nodeId && list[i].isIpV6 == isIpV6 ){
                    return true;
                }
            }
            return false;
        },

        onClickItemAdd: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
            } 
            var regionId = $(eventTarget).attr("region-id");
            var isIpV6 = $(eventTarget).attr("data-isipv6") == "true" ? 1 : 0;
            var model = this.collection.get(regionId);
            var list = model.get("list");
            var fixedProperty = this.getFixedProperty(model);
            var oldList = this.getOldList(list);
            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();
            require(["selectNode.view"], function(SelectNodeView){
                var selectNodeView = new SelectNodeView({
                    collection: this.collection, 
                    model     : fixedProperty,
                    groupId   : this.queryArgs.groupId,
                    regionId  : regionId,
                    isEdit    : false,
                    isIpV6    : isIpV6
                });

                var options = {
                    title:"选择节点",
                    body : selectNodeView,
                    backdrop : 'static',
                    type     : 2,
                    height   : 500,
                    onOKCallback:  function(){
                        var options = selectNodeView.getArgs();
                        if (!options) return;
                        options = options.selectedList;
                        for (var k = 0; k < options.length; k++){
                            if (oldList[options[k]["nodeId"]]){
                                var hasCurrentIpV6 = this.checkIpV6(list,options[k]["nodeId"],isIpV6);
                                if(hasCurrentIpV6){
                                    continue;
                                }
                            }
                            list.push(options[k]);
                        }

                        this.collection.trigger("get.dispConfig.success")
                        this.selectNodePopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){
                        if (AUTH_OBJ.QueryGslbConfig) this.enterKeyBindQuery();
                    }.bind(this)
                }
                this.selectNodePopup = new Modal(options);

                if (!AUTH_OBJ.ApplyAddNodeList)
                    this.selectNodePopup.$el.find(".btn-primary").remove();
            }.bind(this))
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
            }

            var id = eventTarget.attr("id");
            var regionId = eventTarget.attr("region-id");
            var isIpV6 = $(eventTarget).attr("data-isipv6") == "true" ? 1 : 0;
           
            var model = this.collection.get(regionId),
                list = model.get("list");
            var selectedNode = _.filter(list ,function(obj) {
                return obj.nodeId === parseInt(id);
            });
            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

            require(["selectNode.view"], function(SelectNodeView){
                var selectNodeView = new SelectNodeView({
                    collection: this.collection, 
                    model     : selectedNode[0],
                    regionId  : regionId,
                    isEdit    : true,
                    isIpV6    : isIpV6
                });

                var options = {
                    title:"选择节点",
                    body : selectNodeView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback:  function(){
                        var options = selectNodeView.getArgs();
                        if (!options) return;
                        options = options.selectedList;
                        var result = confirm("你确定要修改节点吗？")
                        if (!result) return;
                        for (var i = 0; i < list.length; i++){
                            if (list[i].nodeId === parseInt(options[0]["nodeId"]) && list[i].isIpV6 == isIpV6){
                                this.selectNodePopup.$el.modal("hide");
                                Utility.warning("列表里已包含您选的节点");
                                return;
                            }
                        }

                        for (var k = 0; k < list.length; k++){
                            if (list[k].nodeId === parseInt(id)){
                                //_.extend(list[k],options[0]);
                                list[k] = options[0];
                                break;
                            }
                        }
                        this.collection.trigger("get.dispConfig.success")
                        this.selectNodePopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){
                        if (AUTH_OBJ.QueryGslbConfig) this.enterKeyBindQuery();
                    }.bind(this)
                }
                this.selectNodePopup = new Modal(options);

                if (!AUTH_OBJ.ApplyAddNodeList)
                    this.selectNodePopup.$el.find(".btn-primary").remove();
            }.bind(this))
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId, isIpV6;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id       = eventTarget.attr("id");
                regionId = eventTarget.attr("region-id");
                isIpV6 = eventTarget.attr("data-isipv6") == "true" ? 1 : 0;
            } else {
                id       = $(eventTarget).attr("id");
                regionId = $(eventTarget).attr("region-id");
                isIpV6 = eventTarget.attr("data-isipv6") == "true" ? 1 : 0;
            }
            
            var model = this.collection.get(regionId),
                list = model.get("list");
            var selectedNode = _.filter(list ,function(obj) {
                return obj["nodeId"] === parseInt(id) && obj["isIpV6"] === isIpV6;
            })
            var result = confirm("你确定要删除节点 " + selectedNode[0].nodeName + " 吗？")
            if (!result) return;
            for (var i = 0; i < list.length; i++){
                if (list[i]["nodeId"] === parseInt(id) && list[i]["isIpV6"] ===isIpV6){
                    list.splice(i, 1);
                    break;
                }
            }
            this.collection.trigger("get.dispConfig.success")
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
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
        },

        initDispConfigDropMenu: function(){
            // var regionArray = [
            //     {name: "全部", value: "All"},
            //     {name: "电信", value: "电信"},
            //     {name: "联通", value: "联通"},
            //     {name: "移动", value: "移动"}
            // ],
            // rootNode = this.$el.find(".dropdown-region");
            // Utility.initDropMenu(rootNode, regionArray, function(value){
            //     this.queryArgs.regionName = value;
            //     if (value == "All")
            //         delete this.queryArgs.regionName
            // }.bind(this));

            var searchArray = [
                {name: "按区域", value: "1"},
                {name: "按节点", value: "2"}
            ],
            rootNode = this.$el.find(".disp-config-filter-drop");
            Utility.initDropMenu(rootNode, searchArray, function(value){
                this.curSearchType = value;
                this.onKeyupDispConfigListFilter();
            }.bind(this));
            this.curSearchType = "2";

            this.collection.getDispGroupList();
        },

        onDispGroupListSuccess: function(res){
            var temp = [];
            _.each(res.rows, function(el, index, list){
                if (el.status === 1)
                    temp.push({name: el.dispDomain, value: el.id, remark: el.remark})
            }.bind(this))

            if (temp.length === 0){
                this.$el.find(".opt-ctn").html(_.template(template['tpl/empty.html'])());
                this.$el.find(".table-ctn").parent().hide();
                return;
            }

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.SelectContainer').get(0),
                panelID: this.$el.find('#dropdown-disp').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function(){},
                data: temp,
                callback: function(data) {
                    this.$el.find('#dropdown-disp .cur-value').html(data.name);

                     this.queryArgs.groupId = parseInt(data.value);
                    var curGroup = _.find(temp, function(obj){
                        return obj.value === parseInt(data.value)
                    }.bind(this))
                    this.$el.find(".content-ctn #textarea-comment").html(curGroup.remark || "无");
                    //this.$el.find(".content-ctn .channel-table-ctn").html(_.template(template['tpl/loading.html'])({}));
                    this.dispGroupCollection.getChannelList({groupId: this.queryArgs.groupId});
                    this.onClickQueryButton();
                    
                }.bind(this)
            });

            this.$el.find(".dropdown-disp .cur-value").html(temp[0].name)
            this.queryArgs = {
                page : 1,
                count: 999999,
                groupId: temp[0].value
            }
            this.onClickQueryButton();
            this.$el.find(".content-ctn #textarea-comment").html(temp[0].remark || "无");
            //this.$el.find(".content-ctn .channel-table-ctn").html(_.template(template['tpl/loading.html'])({}));
            
            this.dispGroupCollection.off("get.channel.success");
            this.dispGroupCollection.off("get.channel.error");
            this.dispGroupCollection.on("get.channel.success", $.proxy(this.onGetChannelSuccess, this));
            this.dispGroupCollection.on("get.channel.error", $.proxy(this.onGetError, this));
            this.dispGroupCollection.getChannelList({groupId: temp[0].value});
        },

        onGetChannelSuccess: function(res){
            this.channelList = _.filter(res, function(obj){
                return obj.associated === 1;
            }.bind(this));
            _.each(this.channelList, function(el, index, list){
                if (el.status === 0) el.statusName = '<span class="text-danger">已停止</span>';
                if (el.status === 1) el.statusName = '<span class="text-success">服务中</span>';
            }.bind(this))
            this.channelTable = $(_.template(template['tpl/dispGroup/dispGroup.channel.table.html'])({
                data: this.channelList, 
                isCheckedAll: false, 
                type: 1//不显示checkbox
            }));
            if (this.channelList.length !== 0)
                this.$el.find(".content-ctn .channel-table-ctn").html(this.channelTable[0]);
            else
                this.$el.find(".content-ctn .channel-table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        remove: function(){
            if (this.dispSuggesttionView){
                this.dispSuggesttionView.remove();
                this.dispSuggesttionView = null;
                this.dispSuggesttionFailModel = null;
            }
            if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();
            this.disablePopup = null;
            this.selectNodePopup = null;
            this.collection.off();
            this.$el.remove();
            $(document).off('keydown');
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(target) {
            this.collection.off();
            this.collection.reset();
            this.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return NewDispConfigView;
});