define("dispConfig.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var DiffBeforeSend = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.diffCollection = options.diffCollection;
            this.groupId  = options.groupId;

            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.diffBeforeSend.html'])({}));
            this.$el.find(".diff-table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.$el.find(".ok-again").on("click", $.proxy(this.onClickOK, this));
            this.$el.find(".cancel").on("click", $.proxy(this.onClickCancel, this));

            this.diffCollection.off("send.diff.success");
            this.diffCollection.off("send.diff.error");
            this.diffCollection.on("send.diff.success", $.proxy(this.initTable, this));
            this.diffCollection.on("send.diff.error", $.proxy(this.onGetError, this));

            this.diffCollection.diffBeforeSend(options.sendData)
        },

        onClickCancel: function(){
            this.options.cancelCallback&&this.options.cancelCallback();
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/dispConfig/dispConfig.table.html'])({
                data: this.diffCollection.models, 
                isHistory: true,
                isDiff: true,
                permission: AUTH_OBJ
            }));

            if (this.diffCollection.models.length === 0){
                    this.$el.find(".diff-table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data:{message: "张彬仔细对比了一番，没有变化！"}
                    }));
            } else {
                this.$el.find(".diff-table-ctn").html(this.table[0]);
            }
        },

        onClickOK: function(){
            var result = confirm("你确定要下发DNSPod吗？");
            if (!result) return
            this.options.okCallback&&this.options.okCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    var HistoryView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.groupId  = options.groupId;

            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.history.html'])({}));
            this.$el.find(".list-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.startTime = new Date().valueOf() - 1000 * 60 * 60 * 24 * 7;
            this.endTime = new Date().valueOf() + 1000 * 60 * 60;
            this.startTime = new Date(new Date(this.startTime).format("yyyy/MM/dd hh") + ":00:00").valueOf()
            this.endTime = new Date(new Date(this.endTime).format("yyyy/MM/dd hh") + ":00:00").valueOf()

            this.index = 0;
            this.size = 10;

            this.collection.off("get.allDnsRecord.success");
            this.collection.off("get.allDnsRecord.error");
            this.collection.on("get.allDnsRecord.success", $.proxy(this.onGetRecordListSuccess, this));
            this.collection.on("get.allDnsRecord.error", $.proxy(this.onGetError, this));

            this.$el.find(".query").on("click", $.proxy(this.onClickSearch, this));
            
            this.initChargeDatePicker();
            this.onClickSearch()
        },

        onClickSearch: function(){
            this.allDnsRecord = [];
            this.collection.getAllDnsRecord({
                startTime: this.startTime,
                endTime: this.endTime,
                groupId: this.groupId,
                from: this.index,
                size: this.size,
                userName: this.$el.find("#input-user").val()
            });
        },

        onGetRecordListSuccess: function(data){
            this.allDnsRecord = this.allDnsRecord.concat(data);
            var dateArray = [];
            for (var i = 0; i < this.allDnsRecord.length; i++){
                dateArray.push(new Date(this.allDnsRecord[i].time).format("yyyy/MM"))
            }
            dateArray = _.uniq(dateArray);
            var dateObj = {};
            _.each(dateArray, function(el, inx, list){
                dateObj[el] = []
            })
            _.each(this.allDnsRecord, function(el, inx, list){
                el.timeFormated = new Date(el.time).format("yyyy/MM/dd hh:mm")
                dateObj[new Date(el.time).format("yyyy/MM")].push(el)
            })

            this.list = $(_.template(template['tpl/dispConfig/dispConfig.history.list.html'])({
                dateArray: dateArray, 
                dateObj: dateObj
            }));

            if (dateArray.length !== 0){
                this.$el.find(".list-ctn").html(this.list[0]);
                this.list.find(".card").on("click", $.proxy(this.onClickCard, this));
            } else {
                this.$el.find(".list-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickCard: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "DIV"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var selectedObj = _.find(this.allDnsRecord, function(obj){
                return obj.id === id
            }.bind(this))
            this.selectedObj = selectedObj;
            this.rootNode.modal("hide");
        },

        getArgs: function(){
            return this.selectedObj
        },

        removeDatetimepicker: function(){
            this.$el.find("#input-start").datetimepicker("destroy");
            this.$el.find("#input-end").datetimepicker("destroy");
        },

        initChargeDatePicker: function(){
            var startVal = null, endVal = null;
            if (this.startTime)
                startVal = new Date(this.startTime).format("yyyy/MM/dd hh:mm");
            var startOption = {
                lang:'ch',
                timepicker: true,
                scrollInput: false,
                format:'Y/m/d H:i', 
                value: startVal, 
                onChangeDateTime: function(){
                    this.startTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#input-start").datetimepicker(startOption);
            if (this.endTime)
                endVal = new Date(this.endTime).format("yyyy/MM/dd hh:mm");
            var endOption = {
                lang:'ch',
                timepicker: true,
                scrollInput: false,
                format:'Y/m/d H:i', 
                value: endVal, 
                onChangeDateTime: function(){
                    this.endTime = new Date(arguments[0]).valueOf();
                }.bind(this)
            };
            this.$el.find("#input-end").datetimepicker(endOption);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target, rootNode) {
            this.$el.appendTo(target);
            if (rootNode) this.rootNode = rootNode;
            this.rootNode.find(".modal-body").on("scroll", function(){
                var hh = this.rootNode.find(".modal-body").outerHeight(),
                    scrollTop = this.rootNode.find(".modal-body").scrollTop(),
                    scrollHHeight = this.rootNode.find(".modal-body").get(0).scrollHeight;
                // console.log("height: " + hh);
                // console.log("scrollTop: " + scrollTop);
                // console.log("scrollHeight: " + scrollHHeight);
                if (scrollHHeight - (hh + scrollTop) === 0) {
                    this.index = this.index + this.size;
                    this.collection.getAllDnsRecord({
                        startTime: this.startTime,
                        endTime: this.endTime,
                        groupId: this.groupId,
                        from: this.index,
                        size: this.size,
                        userName: this.$el.find("#input-user").val()
                    });
                }
            }.bind(this))
        }
    });

    var SelectVSView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.groupId  = options.groupId;

            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.selectVS.html'])({}));

            this.$el.find("#oneHistory").on("click", $.proxy(this.onClickHistory, this, "oneHistory"));
            this.$el.find("#anotherHistory").on("click", $.proxy(this.onClickHistory, this, "anotherHistory"))
            this.selectedHistory = {}
        },

        onClickHistory: function(index, event){
             this.rootNode.modal("hide");
            if (this.historyPopup) $("#" + this.historyPopup.modalId).remove();

            var aHistoryView = new HistoryView({
                collection: this.collection, 
                groupId   : this.groupId
            });

            var options = {
                title    : "历史记录",
                body     : aHistoryView,
                backdrop : 'static',
                type     : 1,
                width    : 850,
                height   : 400,
                onHiddenCallback: function(){
                    this.rootNode.modal("show");
                    var result = aHistoryView.getArgs();
                    if (!result) return;
                    this.selectedHistory[index] = result
                    var tpl = '<div>' + result.timeFormated + '</div><div>下发人: ' + result.userName + '</div>'
                    this.$el.find("#" + index).html(tpl)
                }.bind(this)
            }
            setTimeout(function(){
                this.historyPopup = new Modal(options);
            }.bind(this), 500)
        },

        getArgs: function(){
            if (!this.selectedHistory["oneHistory"] || !this.selectedHistory["anotherHistory"]){
                alert("你还没有选择历史记录！");
                return false;
            }
            return this.selectedHistory;
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target, rootNode) {
            this.$el.appendTo(target);
            if (rootNode) this.rootNode = rootNode;
        }
    });

    var SelectNodeView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.regionId = options.regionId;
            this.groupId  = options.groupId;
            this.isEdit   = options.isEdit
            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.html'])({}));
            this.$el.find(".node-list").html(_.template(template['tpl/loading.html'])({}));
            this.nodeList = [];

            this.collection.off("get.regionNode.success");
            this.collection.off("get.regionNode.error");
            this.collection.off("get.allDnsRecord.success");
            this.collection.off("get.regionOtherNode.error");

            this.collection.on("get.regionNode.success", $.proxy(this.onGetNodeListSuccess, this));
            this.collection.on("get.regionNode.error", $.proxy(this.onGetError, this));
            this.collection.on("get.regionOtherNode.success", $.proxy(this.onGetOtherNodeSuccess, this));
            this.collection.on("get.regionOtherNode.error", $.proxy(this.onGetError, this));

            if (AUTH_OBJ.ShowMoreNode)
                this.$el.find(".more").on("click", $.proxy(this.onClickMoreButton, this));
            else
                this.$el.find(".more").remove();

            this.args = {
                regionId: this.regionId,
                groupId : this.isEdit ? this.model.get("dispGroup.id") : this.groupId
            }

            this.collection.getRegionNodeList(this.args);

            this.$el.find("#node-list-filter").on("keyup", $.proxy(this.onKeyupNodeListFilter, this));
        },

        onKeyupNodeListFilter: function() {
            if (!this.nodeList || this.nodeList.length === 0) return;
            var keyWord = this.$el.find("#node-list-filter").val();
            _.each(this.nodeList, function(el, index, ls) {
                if (keyWord === ""){
                    el.isDisplay = true;
                } else {
                    var nodeString = "(" + el["node.minBandwidth"] + "/" + el["node.maxBandwidth"] + ")L" + el["cover.crossLevel"]
                    if (el["node.chName"].indexOf(keyWord) > -1 || nodeString.indexOf(keyWord) > -1)
                        el.isDisplay = true;
                    else
                        el.isDisplay = false;
                }
            });
            this.initList();
        },

        onClickMoreButton: function(){
            this.$el.find(".more").hide();
            this.$el.find(".node-list").html(_.template(template['tpl/loading.html'])());
            this.collection.getRegionOtherNodeList(this.args)
        },

        onGetOtherNodeSuccess: function(res){
            _.each(res.rows, function(element, index, list){
                var temp = {};
                _.each(element, function(el, key, ls){
                    _.each(el, function(el1, key1, ls1){
                        temp[key + "." + key1] = el1
                    }.bind(this))
                }.bind(this))
                temp.isDisplay = true;
                temp.isChecked = false;
                if (temp["node.id"] === this.model.get("node.id")) temp.isChecked = true;
                this.nodeList.push(temp);
            }.bind(this))

            if (this.nodeList.length === 0){
                this.$el.find("#node-list-filter").hide();
                this.$el.find(".node-list").html(_.template(template['tpl/empty.html'])());
                return;
            } else {
                this.$el.find("#node-list-filter").show()
            }

            this.initList();
        },

        onGetNodeListSuccess: function(res){
            if (res.rows.length === 0){
                this.$el.find("#node-list-filter").hide();
                this.$el.find(".node-list").html(_.template(template['tpl/empty.html'])());
                return;
            } else {
                this.$el.find("#node-list-filter").show();
            }
            _.each(res.rows, function(element, index, list){
                var temp = {};
                _.each(element, function(el, key, ls){
                    _.each(el, function(el1, key1, ls1){
                        temp[key + "." + key1] = el1
                    }.bind(this))
                }.bind(this))
                temp.isDisplay = true;
                temp.isChecked = false;
                if (temp["node.id"] === this.model.get("node.id")) temp.isChecked = true;
                this.nodeList.push(temp);
            }.bind(this))

            this.nodeList[this.nodeList.length - 1].line = true
                
            this.initList();
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");

            var selectedObj = _.find(this.nodeList, function(object){
                return object["node.id"] === parseInt(id)
            }.bind(this));
            if (this.isEdit){
                var oldCheckObj = _.find(this.nodeList, function(object){
                    return object["isChecked"] === true;
                }.bind(this));
                if (oldCheckObj) oldCheckObj.isChecked = false;
            }
            selectedObj.isChecked = eventTarget.checked;
            this.curCheckedId = selectedObj["node.id"];
        },

        initList: function(){
            if (this.isEdit){
                this.list = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.list.html'])({
                    data: this.nodeList, 
                    nodeId: this.curCheckedId || this.model.get("node.id")
                }));
            } else {
                this.list = $(_.template(template['tpl/dispConfig/dispConfig.selectNode.checklist.html'])({
                    data: this.nodeList, 
                    nodeId: this.model.get("node.id")
                }));
            }
            this.$el.find(".node-list").html(this.list[0]);
            this.list.find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
        },

        getArgs: function(){
            //var checkedNodes = this.$el.find(".node-list input:checked"), checkedNodeIds = [];
            var checkedNodes = _.filter(this.nodeList, function(object) {
                return object["isChecked"] === true
            }), checkedNodeIds = [];
            if (checkedNodes.length === 0) {
                alert("至少选择一个再点确定！")
                return false;
            }
            for (var i = 0; i < checkedNodes.length; i++){
                //var tempId = parseInt($(checkedNodes[i]).attr("id"));
                var tempId = checkedNodes[i]["node.id"];
                checkedNodeIds.push(tempId)
            }
            var selectedNodes = [];
            for (var k = 0; k < checkedNodeIds.length; k++){
                var aSelectedNodeArray = _.filter(this.nodeList ,function(obj) {
                    return obj["node.id"] === checkedNodeIds[k];
                })
                var aSelectedNode = aSelectedNodeArray[0];
                var nodeChName       = aSelectedNode["node.chName"],
                    nodeMinBandwidth = aSelectedNode["node.minBandwidth"],
                    nodeMaxBandwidth = aSelectedNode["node.maxBandwidth"],
                    crossLevel       = aSelectedNode["cover.crossLevel"];
                var nodeString = nodeChName + "(" + nodeMinBandwidth + "/" + nodeMaxBandwidth + ")L" + crossLevel;
                aSelectedNode.nodeString = nodeString;
                aSelectedNode.id = aSelectedNode["node.id"];
                selectedNodes.push(aSelectedNode)
            }
            return selectedNodes
        },

        onGetError: function(error){
            this.$el.find("#node-list-filter").hide();
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });
    
    var DispConfigView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.dispGroupCollection = options.dispGroupCollection;
            this.diffCollection = options.diffCollection;

            this.$el = $(_.template(template['tpl/dispConfig/dispConfig.html'])({permission: AUTH_OBJ}));

            this.collection.on("get.dispGroup.success", $.proxy(this.onDispGroupListSuccess, this));
            this.collection.on("get.dispGroup.error", $.proxy(this.onGetError, this));

            this.collection.on("get.history.success", $.proxy(this.onHistoryConfigListSuccess, this));
            this.collection.on("get.history.error", function(res){
                //this.disablePopup.$el.modal('hide');
                this.onGetError(res)
            }.bind(this));

            this.collection.on("get.dispConfig.success", $.proxy(this.onDispConfigListSuccess, this));
            this.collection.on("get.dispConfig.error", $.proxy(this.onGetError, this));

            this.collection.on("get.diff.success", $.proxy(this.onDiffConfigListSuccess, this));
            this.collection.on("get.diff.error", $.proxy(this.onGetError, this));

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
                alert("下发成功！")
            }.bind(this));
            this.collection.on("dispDns.error", function(res){
                this.disablePopup.$el.modal('hide');
                this.onGetError(res)
            }.bind(this));

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

            if (AUTH_OBJ.ShoworHideNoteandRelatedDomains) {
                this.$el.find(".opt-ctn .show-remark").on("click", $.proxy(this.onClickShowRemark, this));
                this.$el.find(".opt-ctn .hide-remark").on("click", $.proxy(this.onClickHideRemark, this));
            } else {
                this.$el.find(".opt-ctn .show-remark").remove();
                this.$el.find(".opt-ctn .hide-remark").remove();
            }

            this.$el.find(".opt-ctn .histroy").on("click", $.proxy(this.onClickHistory, this));
            this.$el.find(".opt-ctn .vs").on("click", $.proxy(this.onClickSelectVS, this));

            this.$el.find(".page-ctn").hide();
        },

        onClickHistory: function(){
            if (this.historyPopup) $("#" + this.historyPopup.modalId).remove();

            var aHistoryView = new HistoryView({
                collection: this.collection, 
                groupId   : this.queryArgs.groupId
            });

            var options = {
                title    : "历史记录",
                body     : aHistoryView,
                backdrop : 'static',
                type     : 1,
                width    : 850,
                height   : 400,
                onHiddenCallback: function(){
                    var result = aHistoryView.getArgs();
                    aHistoryView.removeDatetimepicker();
                    if (!result) return;
                    this.$el.find(".version-time").html(result.timeFormated);
                    this.$el.find(".opt-ctn .sending").hide();
                    this.collection.getHistoryConfigList({id: result.id});
                }.bind(this)
            }
            this.historyPopup = new Modal(options);
        },

        onClickSelectVS: function(){
            if (this.selectVSPopup) $("#" + this.selectVSPopup.modalId).remove();

            var aSelectVSView = new SelectVSView({
                collection: this.collection, 
                groupId   : this.queryArgs.groupId,
                selectVSPopup: this.selectVSPopup
            });

            var options = {
                title    : "对比历史记录",
                body     : aSelectVSView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var result = aSelectVSView.getArgs();
                    if (!result) return
                    this.collection.getDiffConfigList({
                        firstId: result.oneHistory.id, 
                        secondId: result.anotherHistory.id
                    })
                    this.$el.find(".version-time").html(result.oneHistory.timeFormated + " VS " + result.anotherHistory.timeFormated);
                    this.$el.find(".opt-ctn .sending").hide();
                    this.selectVSPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.selectVSPopup = new Modal(options);
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onClickShowRemark: function(){
            this.$el.find(".hide-remark").show();
            this.$el.find(".show-remark").hide();
            this.$el.find(".content-ctn").slideDown(200);
        },

        onClickHideRemark: function(){
            this.$el.find(".hide-remark").hide();
            this.$el.find(".show-remark").show();
            this.$el.find(".content-ctn").slideUp(200);
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onDispConfigListSuccess: function(){
            //this.disablePopup.$el.modal('hide');
            this.$el.find(".version-time").html("Last version");
            this.$el.find(".opt-ctn .sending").show();
            this.initTable();
            //if (!this.isInitPaginator) this.initPaginator();
            this.$el.find("#disp-config-filter").val("");
            this.$el.find("#disp-config-filter").off("keyup");
            this.$el.find("#disp-config-filter").on("keyup", $.proxy(this.onKeyupDispConfigListFilter, this));
        },

        onHistoryConfigListSuccess: function(){
            this.initTable(true);
            //if (!this.isInitPaginator) this.initPaginator();
            this.$el.find("#disp-config-filter").val("");
            this.$el.find("#disp-config-filter").off("keyup");
            this.$el.find("#disp-config-filter").on("keyup", $.proxy(this.onKeyupDispConfigListFilter, this, true));
        },

        onDiffConfigListSuccess: function(){
            this.initTable(true, true);
            //if (!this.isInitPaginator) this.initPaginator();
            this.$el.find("#disp-config-filter").val("")
            this.$el.find("#disp-config-filter").off("keyup");
            this.$el.find("#disp-config-filter").on("keyup", $.proxy(this.onKeyupDispConfigListFilter, this, true, true));
        },

        onKeyupDispConfigListFilter: function(isHistory, isDiff) {
            if (!this.collection.models || this.collection.models.length === 0) return;
            var keyWord = this.$el.find("#disp-config-filter").val();
                        
            _.each(this.collection.models, function(model, index, list) {
                if (keyWord === ""){
                    model.set("isDisplay", true);
                    _.each(model.get("listFormated"), function(modelL3, indexL3, listL3) {
                        modelL3.set("isDisplay", true);
                    })
                } else if (this.curSearchType == "1"){
                    if (model.get("region.name").indexOf(keyWord) > -1){
                        model.set("isDisplay", true);
                    } else {
                        model.set("isDisplay", false);
                    }
                    _.each(model.get("listFormated"), function(modelL4, indexL4, listL4) {
                        modelL4.set("isDisplay", true);
                    })
                } else if (this.curSearchType == "2"){
                    model.set("isDisplay", false);
                    _.each(model.get("listFormated"), function(modelL2, indexL2, listL2) {
                        if (modelL2.get("node.chName") && modelL2.get("node.chName").indexOf(keyWord) > -1){
                            modelL2.set("isDisplay", true);
                            model.set("isDisplay", true);
                        } else {
                            modelL2.set("isDisplay", false);
                        }
                    })
                }
            }.bind(this));
            this.initTable(isHistory);
        },

        onClickInitButton: function(){
            this.$el.find(".opt-ctn .init").hide();
            this.isInitPaginator = true;
            var args = _.extend({}, this.queryArgs);
            delete args.page;
            delete args.count;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.initDispConfigList(args);
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getDispConfigList(this.queryArgs);

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
                okCallback:  function(options){
                    this.onSureSending();
                }.bind(this)
            });
            diffBeforeSendView.render(this.$el.find(".diff-send-panel"));

            Utility.hideMainList(this.$el, ".main-list", ".diff-send-panel");
            this.$el.find(".opt-panel").slideUp(200);
        },

        getSendData: function(){
            var tempArray = [];

            _.each(this.collection.models, function(el, index, list){
                _.each(el.get("listFormated"), function(el1, index1, list1){
                    var tempObj =  {
                      "dgroupId" : el1.get("dispGroup.id") || this.queryArgs.groupId,
                      "nodeId"   : el1.get("node.id"),
                      "regionId" : el.get("region.id"),
                      "ttl"      : el.get("dispGroup.ttl"),
                      "ipNum"    : el1.get("dispConfIpInfo.currNum"),
                    };
                    tempArray.push(tempObj)
                }.bind(this))
            }.bind(this))
            var args = {
                groupId : this.queryArgs.groupId,
                list    : tempArray
            }
            return args;
        },

        onSureSending: function(){
            var args = this.getSendData();
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

        initTable: function(isHistory, isDiff){
            this.table = $(_.template(template['tpl/dispConfig/dispConfig.table.html'])({
                data: this.collection.models, 
                isHistory: isHistory,
                isDiff: isDiff,
                permission: AUTH_OBJ
            }));

            if (this.collection.models.length === 0){
                if (!isDiff){
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
                } else {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data:{message: "张彬仔细对比了一番，没有变化！"}
                    }));
                }
                //this.$el.find(".opt-ctn .init").show();
                this.$el.find(".opt-ctn .sending").hide();
            //} else if (this.collection.total === 0){
                //this.$el.find(".table-ctn").html(this.table[0]);
                // this.$el.find(".opt-ctn .init").show();
                // this.$el.find(".opt-ctn .sending").hide();
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
            this.table.find("tbody .add").on("click", $.proxy(this.onClickItemAdd, this));
            this.table.find("tbody .adjust").on("click", $.proxy(this.onClickItemAdjust, this));
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
            id       = $(eventTarget).attr("id");
            regionId = $(eventTarget).attr("region-id");
            var model = this.collection.get(regionId),
                list = model.get("listFormated");
            var selectedNode = _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })
            selectedNode[0].set("dispConfIpInfo.currNum", parseInt(value))
        },

        onClickItemAdjust: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }

            $(eventTarget).html('<span class="glyphicon glyphicon-cog"></span>载入中');
            var args = {
                groupId : this.queryArgs.groupId,
                regionId: id,
                success : function(data){
                    $(eventTarget).html('<span class="glyphicon glyphicon-cog"></span>调整')
                    $(eventTarget).off("click");
                    $(eventTarget).popover({
                        animation  : false,
                        "placement": "top", 
                        "html"     : true,
                        "content"  : data.message || data, 
                        "trigger"  : "hover"
                    })

                    $(eventTarget).popover('toggle')
                }.bind(this)
            }

            this.collection.getRegionAdvice(args);
        },

        onClickItemAdd: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id), list = model.get("listFormated");

            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

            var selectNodeView = new SelectNodeView({
                collection: this.collection, 
                model     : model,
                groupId   : this.queryArgs.groupId,
                regionId  : id,
                isEdit    : false
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
                    for (var k = 0; k < options.length; k++){
                        options[k]['dispGroup.id'] = this.queryArgs.groupId;
                        for (var i = 0; i < list.length; i++){
                            if (list[i]["id"] === parseInt(options[k]["node.id"])) options.splice(k, 1);
                            if (options.length === 0) {
                                alert("你选择的节点已经添加过了！")
                                this.selectNodePopup.$el.modal("hide");
                                return;
                            }
                        }
                    }
                    for(var m = 0; m < options.length; m++){
                        model.get("listFormated").push(new this.collection.model(options[m]))
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
        },

        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id       = eventTarget.attr("id");
                regionId = eventTarget.attr("region-id");
            } else {
                id       = $(eventTarget).attr("id");
                regionId = $(eventTarget).attr("region-id");
            }
            var model = this.collection.get(regionId),
                list = model.get("listFormated");
            var selectedNode = _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })

            if (this.selectNodePopup) $("#" + this.selectNodePopup.modalId).remove();

            var selectNodeView = new SelectNodeView({
                collection: this.collection, 
                model     : selectedNode[0],
                regionId  : regionId,
                isEdit    : true
            });

            var options = {
                title:"选择节点",
                body : selectNodeView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = selectNodeView.getArgs();
                    if (!options) return;
                    var result = confirm("你确定要修改节点吗？")
                    if (!result) return;
                    for (var i = 0; i < list.length; i++){
                        if (list[i]["id"] === parseInt(options[0]["node.id"])){
                            this.selectNodePopup.$el.modal("hide");
                            return;
                        }
                        if (list[i]["id"] === parseInt(id)){
                            list[i].attributes =  _.extend(selectedNode[0].attributes, options[0]);
                            list[i].set("isUpdated", true);
                            break;
                        }
                    }
                    model.set("listFormated", list);
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
        },

        onClickItemDelete: function(event){
            var eventTarget = event.srcElement || event.target, id, regionId;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id       = eventTarget.attr("id");
                regionId = eventTarget.attr("region-id");
            } else {
                id       = $(eventTarget).attr("id");
                regionId = $(eventTarget).attr("region-id");
            }
            var model = this.collection.get(regionId),
                list = model.get("listFormated");
            var selectedNode = _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })

            var result = confirm("你确定要删除节点 " + selectedNode[0].get("node.chName") + " 吗？")
            if (!result) return;
            _.filter(list ,function(obj) {
                return obj["id"] === parseInt(id);
            })
            for (var i = 0; i < list.length; i++){
                if (list[i]["id"] === parseInt(id)){
                    list.splice(i, 1);
                    break;
                }
            }
            this.collection.get(regionId).set("listFormated", list);
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
                        this.collection.getNodeList(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
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
            this.curSearchType = "1";

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

            rootNode = this.$el.find(".dropdown-disp");
            Utility.initDropMenu(rootNode, temp, function(value){
                this.queryArgs.groupId = parseInt(value);
                var curGroup = _.find(temp, function(obj){
                    return obj.value === parseInt(value)
                }.bind(this))
                this.$el.find(".content-ctn #textarea-comment").html(curGroup.remark || "无");
                this.$el.find(".content-ctn .channel-table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.dispGroupCollection.getChannelList({groupId: this.queryArgs.groupId});
                this.onClickQueryButton();
            }.bind(this));

            this.$el.find(".dropdown-disp .cur-value").html(temp[0].name)
            this.queryArgs = {
                page : 1,
                count: 999999,
                groupId: temp[0].value
            }
            this.onClickQueryButton();
            this.$el.find(".content-ctn #textarea-comment").html(temp[0].remark || "无");
            this.$el.find(".content-ctn .channel-table-ctn").html(_.template(template['tpl/loading.html'])({}));

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
        },

        update: function(){
            this.$el.show();
            this.collection.getDispGroupList();
            if (AUTH_OBJ.QueryGslbConfig) this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DispConfigView;
});