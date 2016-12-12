define("setupTopoManage.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    var SendView = Backbone.View.extend({
        event:{},
        initialize:function(options){
            this.options = options;
            this.model = options.model;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.send.html'])({data: {}}));
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.initNumberDrop();
            
            this.queryArgs = {
                "topologyId":this.model.get('id'),
                "name" : null,
                "page" : 1,
                "count" : 10
            }
            
            this.onClickQueryButton();
            //Enter键查询
            this.$el.find('#input-topo-name').on('keydown',function(e){
                  if(e.keyCode == 13){
                     this.onClickQueryButton();
                  }
            }.bind(this));
            
            this.collection.off("get.sendInfo.success");
            this.collection.off("get.sendInfo.error");
            this.collection.on("get.sendInfo.success", $.proxy(this.getSendInfoSuccess, this));
            this.collection.on("get.sendInfo.error", $.proxy(this.onGetError, this));
            //删除下发策略
            this.collection.off("delete.SendStrategy.success");
            this.collection.off("delete.SendStrategy.error");
            this.collection.on("delete.SendStrategy.success", $.proxy(this.deleteSendStrategySuccess, this));
            this.collection.on("delete.SendStrategy.error", $.proxy(this.onGetError, this));
            //设为默认
            this.collection.off("set.DefaultStrategy.success");
            this.collection.off("set.DefaultStrategy.error");
            this.collection.on("set.DefaultStrategy.success", $.proxy(this.setDefaultStrategySuccess, this));
            this.collection.on("set.DefaultStrategy.error", $.proxy(this.onGetError, this));
            
            this.$el.find('.opt-ctn .query').on('click',$.proxy(this.onClickQueryButton, this));
            this.$el.find('.opt-ctn .new').on('click',$.proxy(this.onClickAddSend, this));
        },
         onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.name = this.$el.find("#input-topo-name").val();
            if (this.queryArgs.name == "") this.queryArgs.name = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            
            this.collection.getSendinfo(this.queryArgs);
        },
        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },
        getSendInfoSuccess: function(res){
           this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.send.table.html'])({data:this.collection.models}));
           if (res.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find('.edit').on('click',$.proxy(this.onClickEditSend,this));
            this.table.find('.delete').on('click',$.proxy(this.onClickDeleteSend,this));
            this.table.find('.setDefault').on('click',$.proxy(this.onClickDefault,this));

            if(!this.isInitPaginator) this.initPaginator();
        },
        onClickAddSend: function(){
            var myEditOrAddSendView = new EditOrAddSendView({
                collection:this.collection,
                model:this.model,
                onSaveCallback:function(){
                    this.onClickQueryButton();
                    myEditOrAddSendView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this),
                onCancelCallback:function(){
                    myEditOrAddSendView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            });
            this.$el.find('.list-panel').hide();
            myEditOrAddSendView.render(this.$el.find('.SendTable'));
        },
        onClickEditSend: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            
            var myEditOrAddSendView = new EditOrAddSendView({
                collection:this.collection,
                model:this.model,
                isEdit:true,
                id:id,
                onSaveCallback:function(){
                    this.onClickQueryButton();
                    myEditOrAddSendView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this),
                onCancelCallback:function(){
                    myEditOrAddSendView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            });
            this.$el.find('.list-panel').hide();
            myEditOrAddSendView.render(this.$el.find('.SendTable'));
        },
        onClickDeleteSend: function(){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var result = confirm("确定删除"+model.get('name')+'?');
            if (!result) return;
             this.collection.deleteSendStrategy(id);
        },
        onClickDefault: function(){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var result = confirm("确定将"+model.get('name')+"设为默认?");
            if (!result) return;
             this.collection.setDefaultStrategy(id);
        },
        deleteSendStrategySuccess: function(){
             alert('删除成功');
             this.onClickQueryButton();
        },
        setDefaultStrategySuccess: function(){
             alert('设置成功');
             this.onClickQueryButton();
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
                        this.collection.getSendinfo(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },
        initNumberDrop: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.count = parseInt(value);
                this.queryArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));
        },
        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },
        render:function(target){
            this.$el.appendTo(target);
        }
    });
    var EditOrAddSendView = Backbone.View.extend({
        events:{},
        initialize: function(options){
            this.options = options;
            this.model = options.model;
            this.collection = options.collection;
            this.id = options.id;
            this.isEdit = options.isEdit;
            
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.send.edit.html'])({data: {}}));
            this.$el.find('#input-Topo').val(this.model.get('name'));
            
            this.$el.find('.add-step').on('click',$.proxy(this.onClickAddStepButton, this));
            this.$el.find('.nextStep').on('click',$.proxy(this.onClickNextStepButton,this));
            this.$el.find('.opt-ctn .cancel').on('click',$.proxy(this.onClickCancelButton, this));
            this.$el.find('.opt-ctn .save').on('click',$.proxy(this.onClickSaveButton, this));

            if(this.isEdit){
                this.collection.getSendViewDetail(this.id);
            }else{
                this.defaultParam = {
                    "name":null,
                    "topologyId":null,
                    "description":null,
                    "deliveryStrategyDef":[]
                }
            }

            //新建下发策略
            this.collection.off('add.SendView.error');
            this.collection.off('add.SendView.success');
            this.collection.on('add.SendView.success',$.proxy(this.addSendViewSuccess,this));
            this.collection.on('add.SendView.error',$.proxy(this.onGetError,this));
            //查看下发策略详情
            this.collection.off('get.SendViewDetail.success');
            this.collection.off('get.SendViewDetail.error');
            this.collection.on('get.SendViewDetail.success',$.proxy(this.getSendViewDetailSuccess,this));
            this.collection.on('get.SendViewDetail.error',$.proxy(this.onGetError,this));
            //修改下发策略
            this.collection.off('modify.SendStrategy.success');
            this.collection.off('modify.SendStrategy.error');
            this.collection.on('modify.SendStrategy.success',$.proxy(this.modifySendStrategySuccess,this));
            this.collection.on('modify.SendStrategy.error',$.proxy(this.onGetError,this));
            //获取节点信息
            this.collection.off('get.node.error');
            this.collection.off('get.node.success');
            this.collection.on('get.node.success',$.proxy(this.onGetNodeSuccess,this));
            this.collection.on('get.node.error',$.proxy(this.onGetError,this));
            this.collection.getTopoOrigininfo(this.model.get('id'));       
            
            this.initNextStep();

        },
        getSendViewDetailSuccess:function(res){
            this.defaultParam = res; 
            this.$el.find('#input-Name').val(this.defaultParam.name); 
            this.$el.find('#description').val(this.defaultParam.description);
        },
        onGetNodeSuccess: function(res){
            _.each(res.allNodes,function(el,index,list){
                 if(typeof el.chName == 'undefined'){
                    el.chName = el.name;
                 }
            });
            this.allNodes = res.allNodes; //所有的节点,会执行节点的过滤操作
            this.allNodesShow = []; //所有的节点，执行过滤操作后,此不会进行改变，从而进行回显
            _.each(this.allNodes,function(el,index,list){
                 this.allNodesShow.push(el);
            }.bind(this));
            this.initstepTable(this.InformationProcessing(this.defaultParam.deliveryStrategyDef));
        },
        initNextStep: function(){
          var mynextStepView = new nextStepView({});
           mynextStepView.render(this.$el.find('#selectNextTime')); 
           this.$el.find('#selectNextTime').css('visibility','hidden');
        },
        initstepTable: function(data){
           // var data = [{step:1,nodeName:'扬州电信节点<br>扬州联通节点<br>杭州'},{step:2,nodeName:'济南联通节点<br>惠州联通节点<br>天津电信节点'},{step:3,nodeName:'石家庄联通节点<br>襄阳电信节点<br>德阳电信节点<br>天津移动节点'}]
            var data = data;
            this.localTable = $(_.template(template['tpl/setupTopoManage/setupTopoManage.addStep.table.html'])({
                 data: data
            }));
            this.localTable.find('.edit').on('click',$.proxy(this.onClickEditStepButton,this));
            _.each($(this.localTable).find('.addOrEdit .delete'),function(el){
                _.each(this.NodeleteNodes,function(nodes){
                    if(el.id == nodes){
                        el.remove();
                    }
                }.bind(this))
            }.bind(this))

            if (data.length !== 0)
                this.$el.find(".sendStrategy .table-ctn").html(this.localTable[0]);
            else
                this.$el.find(".sendStrategy .table-ctn").html(_.template(template['tpl/empty.html'])());

            this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemAllDelete, this));
            
            this.FinallyStep = data.length+1;

        },
        onClickItemAllDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var length = this.defaultParam.deliveryStrategyDef.length;
            for (var i = 0; i < length; i++){ 
                if (parseInt(this.defaultParam.deliveryStrategyDef[i].step) === parseInt(id)){
                    this.defaultParam.deliveryStrategyDef.splice(i, 1);
                    _.each(this.defaultParam.deliveryStrategyDef,function(el,index,list){
                        el.step = index+1;
                    })
                    this.initstepTable(this.InformationProcessing(this.defaultParam.deliveryStrategyDef));
                    return;
                }
            }
            this.RestoreNodes(this.allNodesShow,id);
        },
        onClickAddStepButton: function(){
            this.allNodes = this.FilterNodes(this.allNodes);
            var myAddStepView = new AddOrEditStepView({
                collection:this.collection,
                deliveryStrategyDef:this.defaultParam.deliveryStrategyDef,
                isEdit:false,
                allNodes:this.allNodes,
                FinallyStep:this.FinallyStep,
                onCancelCallback: function(){
                    myAddStepView.$el.remove();
                    this.$el.find('.sendStrategy').show();
                }.bind(this),
                onSaveCallback: function(){
                    console.log(this.defaultParam.deliveryStrategyDef);
                    this.initstepTable(this.InformationProcessing(this.defaultParam.deliveryStrategyDef));
                    this.allNodes = this.FilterNodes(this.allNodes);
                    myAddStepView.$el.remove();
                    this.$el.find('.sendStrategy').show();
                }.bind(this)
            });
            this.$el.find('.sendStrategy').hide();
            myAddStepView.render(this.$el.find('.add-step-ctn'));
        },
        onClickEditStepButton:function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            this.allNodes = this.FilterNodes(this.allNodes);
            this.RestoreNodes(this.allNodesShow,id);
            var myAddStepView = new AddOrEditStepView({
                collection:this.collection,
                deliveryStrategyDef:this.defaultParam.deliveryStrategyDef,
                isEdit:true,
                allNodes:this.allNodes,
                CurrentStep:id,
                onCancelCallback: function(){
                    this.allNodes = this.FilterNodes(this.allNodes);
                    myAddStepView.$el.remove();
                    this.$el.find('.sendStrategy').show();
                }.bind(this),
                onSaveCallback: function(){
                    this.initstepTable(this.InformationProcessing(this.defaultParam.deliveryStrategyDef));
                    this.allNodes = this.FilterNodes(this.allNodes);
                    myAddStepView.$el.remove();
                    this.$el.find('.sendStrategy').show();
                }.bind(this)
            });
            this.$el.find('.sendStrategy').hide();
            myAddStepView.render(this.$el.find('.add-step-ctn'));
        },
        onClickNextStepButton: function(event){
           var eventTarget = event.srcElement || event.target;
           if(eventTarget.tagName != 'INPUT') return;
               
           if(eventTarget.id == 'ManualRadio'){
              this.$el.find('#selectNextTime').css('visibility','hidden');
           }
           else if(eventTarget.id == 'TimingRadio'){
              this.$el.find('#selectNextTime').css('visibility','visible');
           }
        },
        onClickSaveButton: function(){
            this.defaultParam.name = this.$el.find('#input-Name').val();
            this.defaultParam.topologyId = this.model.get('id');
            this.defaultParam.description = this.$el.find('#description').val();
            if(!this.isEdit){
               this.collection.addSendView(this.defaultParam);
            }else{
                delete this.defaultParam.creator;
                delete this.defaultParam.nodeNames;
                delete this.defaultParam.default;
                this.collection.modifySendStrategy(this.defaultParam);
            }
        },
        addSendViewSuccess: function(res){
            alert('保存成功');
            this.options.onSaveCallback && this.options.onSaveCallback();
        },
        modifySendStrategySuccess: function(res){
            alert('修改成功');
            this.options.onSaveCallback && this.options.onSaveCallback();
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
        InformationProcessing:function(data){
            var data_save = [];
            var self = this;
            _.each(data, function(el, key, ls){
                var data_save_content = {
                     step:null,
                     nodeName:[],
                };
                _.each(el.nodeId,function(node){
                    _.each(this.allNodesShow,function(data){
                        if(node == data.id){
                            data_save_content.nodeName.push(data.chName);
                            return;
                        }
                    }.bind(this))
                }.bind(this));
                 data_save_content.nodeName = data_save_content.nodeName.join('<br>');
                data_save_content.step = el.step;
                data_save.push(data_save_content);

            }.bind(this));
            return data_save;
        },
        FilterNodes: function(data){
            var arr = [];
             _.each(data,function(el,index,list){
                var flag = true;
                _.each(this.defaultParam.deliveryStrategyDef,function(del,index,list){
                    _.each(del.nodeId,function(data,index,list){
                         if(el.id == data){
                            flag = false;
                         }
                    }.bind(this))
                }.bind(this));
                if(flag){
                    arr.push(el);
                }
            }.bind(this));

            return arr;
        },
        RestoreNodes: function(data,id){
           var Nodes = _.filter(this.defaultParam.deliveryStrategyDef,function(el,index,list){
                return el.step == id;
           })[0];
           for(var i = data.length - 1;i>=0;i--){
               var flag = false;
               data[i].checked = false;
               _.each(Nodes.nodeId,function(Nodes,index,list){
                  if(data[i].id == Nodes){
                      data[i].checked = true;
                      flag = true;
                  }
               }.bind(this));
               if(flag){
                 this.allNodes.unshift(data[i]);
               }
           }
        },
        render: function(target){
            this.$el.appendTo(target);
        }
    });
    var nextStepView = Backbone.View.extend({
        events:{},
        initialize:function(options){
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.nextTimeTable.html'])({data: {}}));
        },
        render(target){
            this.$el.appendTo(target);
        }
    });
    var AddOrEditStepView = Backbone.View.extend({
        events:{},
        initialize:function(options){
            this.options = options;
            this.collection = options.collection;
            this.deliveryStrategyDef = options.deliveryStrategyDef; //全部的步骤参数
            this.isEdit = options.isEdit;
            this.allNodes = options.allNodes;
            
            if(!this.isEdit){
                this.Step = options.FinallyStep;
            }else{
                this.Step = options.CurrentStep;
            }
            console.log(this.deliveryStrategyDef);
            this.defaultParam = this.deepClone(this.parameterProcessing(this.deliveryStrategyDef));//每一条的步骤参数
            console.log(this.defaultParam);
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.addStep.html'])({data:this.Step}));
            this.$el.find('.opt-ctn .save').on('click', $.proxy(this.onClickSaveButton, this));
            this.$el.find('.opt-ctn .cancel').on('click', $.proxy(this.onClickCancelButton, this));
            this.$el.find('.other-all-node').on('click',$.proxy(this.onClickOtherNodeButton,this));
            this.$el.find('.script').on('click',$.proxy(this.onClickScriptButton,this));
            
            if(this.defaultParam.shell != "" && this.defaultParam.shell !== null && this.defaultParam.shell !== undefined){
                this.$el.find(".script").trigger('click');
                this.$el.find(".scriptContent").val(this.defaultParam.shell);
            }
            
            this.onGetNodeSuccess(this.allNodes);  
        },
        parameterProcessing: function(data){
            var param = _.filter(data,function(el,index,list){
                 return el.step == this.Step;
            }.bind(this));
            
            if(param.length == 0){
                return {"step":this.Step,"nodeId":[],"shell":""};

            }else{
                return param[0];
            }
        },
        onGetNodeSuccess: function(res){
            var nodesArray = [];
            this.selectedAllNodeList = [];
            this.nodesArrayFirst = [];
            _.each(res, function(el, index, list){
                el.checked = false;
                _.each(this.defaultParam.nodeId, function(defaultLocalId, inx, ls){
                    if (defaultLocalId === el.id) {
                        el.checked = true;
                        this.selectedAllNodeList.push({nodeId: el.id, nodeName: el.chName , operator:el.operatorId, checked:el.checked})
                    }
                }.bind(this))
                nodesArray.push({name:el.chName, value: el.id, checked: el.checked, operator:el.operatorId});
                this.nodesArrayFirst.push({name:el.chName, value: el.id, checked: el.checked, operator:el.operatorId})
            }.bind(this))
            
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.all .add-node-ctn').get(0),
                panelID: this.$el.find('.all .add-node').get(0),
                openSearch: true,
                onOk: function(data){
                    this.selectedAllNodeList = [];
                    _.each(data, function(el, key, ls){
                        this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
                    }.bind(this))
                    this.defaultParam.nodeId.length = 0;
                    _.each(this.selectedAllNodeList,function(el,key,ls){
                        this.defaultParam.nodeId.push(parseInt(el.nodeId));
                    }.bind(this));
                    _.each(this.nodesArrayFirst,function(el,key,ls){
                            el.checked = false;
                            _.each(this.selectedAllNodeList,function(data,key,ls){
                                if(el.value == data.nodeId){
                                    el.checked = true;
                                }
                            }.bind(this))
                        }.bind(this))
                    this.initAllNodesTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
            this.initAllNodesTable();
        },
        initAllNodesTable: function(){
            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedAllNodeList
            }));
            _.each($(this.localTable).find('.addOrEdit .delete'),function(el){
                _.each(this.NodeleteNodes,function(nodes){
                    if(el.id == nodes){
                        el.remove();
                    }
                }.bind(this))
            }.bind(this))
            if (this.selectedAllNodeList.length !== 0)
                this.$el.find(".all .table-ctn").html(this.localTable[0]);
            else
                this.$el.find(".all .table-ctn").html(_.template(template['tpl/empty.html'])());

            this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemAllDelete, this));
        },
        initAllNodesSelect: function(res){
            var nodesArray = res;
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.all .add-node-ctn').get(0),
                panelID: this.$el.find('.all .add-node').get(0),
                openSearch: true,
                onOk: function(data){
                    this.selectedAllNodeList = [];
                    _.each(data, function(el, key, ls){
                        this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
                    }.bind(this))
                    this.defaultParam.nodeId.length = 0;
                    _.each(this.selectedAllNodeList,function(el,key,ls){
                        this.defaultParam.nodeId.push(parseInt(el.nodeId));
                    }.bind(this));
                    _.each(this.nodesArrayFirst,function(el,key,ls){
                            el.checked = false;
                            _.each(this.selectedAllNodeList,function(data,key,ls){
                                if(el.value == data.nodeId){
                                    el.checked = true;
                                }
                            }.bind(this))
                        }.bind(this))
                    this.initAllNodesTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
            this.initAllNodesTable();
            
        },
        onClickItemAllDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var lengthParam = this.defaultParam.nodeId.length;
            for(var i=0; i < lengthParam; i++){
                if(this.defaultParam.nodeId[i] == parseInt(id)){
                    this.defaultParam.nodeId.splice(i,1);
                }
            }
            _.each(this.nodesArrayFirst,function(el,index,list){
                  if(el.value == parseInt(id)){
                     el.checked = false;
                     this.initAllNodesSelect(this.nodesArrayFirst);
                  }
            }.bind(this));
            var length = this.selectedAllNodeList.length;
            for (var i = 0; i < length; i++){ 
                if (parseInt(this.selectedAllNodeList[i].nodeId) === parseInt(id)){
                   this.selectedAllNodeList.splice(i, 1);
                   this.initAllNodesTable();
                   return;
                }
            }
        },
        onClickOtherNodeButton: function(){
            var nodesArray = [];
            _.each(this.allNodes, function(el, index, list){
                nodesArray.push({name:el.chName, value: el.id, checked: el.checked, operator:el.operatorId});
            }.bind(this))

            this.selectedAllNodeList = [];
            _.each(nodesArray, function(el, key, ls){
                this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
            }.bind(this))
            this.defaultParam.nodeId.length = 0;
            _.each(this.selectedAllNodeList,function(el,key,ls){
                this.defaultParam.nodeId.push(parseInt(el.nodeId));
            }.bind(this));
            _.each(this.nodesArrayFirst,function(el,key,ls){
                el.checked = false;
                _.each(this.selectedAllNodeList,function(data,key,ls){
                    if(el.value == data.nodeId){
                        el.checked = true;
                    }
                }.bind(this))
            }.bind(this))



            this.$el.find('.all').hide();
        },
        onClickScriptButton: function(){
            this.$el.find('.scriptContent').toggle("fast"); 
        },
        onClickCancelButton: function(){
           this.options.onCancelCallback && this.options.onCancelCallback();
        },
        onClickSaveButton: function(){

            this.defaultParam.shell = $(".scriptContent").val();
            
            if(this.defaultParam.nodeId.length == 0){
                alert('您还未选择节点');
                return;
            }
            if(!this.isEdit){
                this.deliveryStrategyDef.push(this.defaultParam);
            }else{
                _.each(this.deliveryStrategyDef,function(el,index,list){
                    if(el.step == this.Step){
                          this.deliveryStrategyDef[index] = this.defaultParam;
                    } 
                }.bind(this))
            }
            this.options.onSaveCallback && this.options.onSaveCallback();
        },
        deepClone: function(obj){
            var str, newobj = obj.constructor === Array ? [] : {};
            if(typeof obj !== 'object'){
                return;
            } else if(window.JSON){
                str = JSON.stringify(obj), //系列化对象
                newobj = JSON.parse(str); //还原
            } else {
                for(var i in obj){
                    newobj[i] = typeof obj[i] === 'object' ? 
                    cloneObj(obj[i]) : obj[i]; 
                }
            }
            return newobj;
        },
        render: function(target){
            this.$el.appendTo(target);
        }
    });
    var EditTopoView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },
        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.isEdit     = options.isEdit;
            this.rule       = [];
            this.allNodes   = [];//存储所有节点
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.edit.html'])({data: {}}));
            
            this.collection.off('get.topo.OriginInfo.success');
            this.collection.off('get.topo.OriginInfo.error');
            this.collection.on('get.topo.OriginInfo.success',$.proxy(this.onOriginInfo, this));
            this.collection.on('get.topo.OriginInfo.error',$.proxy(this.onGetError, this));

            //获取应用商类型
            this.collection.off("get.operator.success");
            this.collection.off("get.operator.error");
            this.collection.on("get.operator.success", $.proxy(this.setOperatorInfo, this));
            this.collection.on("get.operator.error", $.proxy(this.onGetError, this));
            this.collection.getOperatorList();

             //添加拓扑关系
            this.collection.off('add.topo.success');
            this.collection.off('add.topo.error');
            this.collection.on('add.topo.success',$.proxy(this.addTopoSuccess, this));
            this.collection.on('add.topo.error',$.proxy(this.addTopoError, this));
            //修改拓扑关系
            this.collection.off('modify.topo.success');
            this.collection.off('modify.topo.error');
            this.collection.on('modify.topo.success',$.proxy(this.modifyTopoSuccess, this));
            this.collection.on('modify.topo.error',$.proxy(this.modifyTopoError, this));
            
            if(this.isEdit){
                this.collection.getTopoOrigininfo(this.model.get('id'));
            }else{
                this.defaultParam = {
                    "id":null,
                    "name":"拓扑关系名称",
                    "type":null,
                    "allNodes": [],
                    "upperNodes": [],
                    "rule": []
                }
                this.initSetup();
            }
        },
        addTopoSuccess: function(){
            //this.WhetherSaveSuccess = true;
            this.options.onSaveCallback && this.options.onSaveCallback();
            alert('保存成功');
        },
        addTopoError: function(error){
            if (error&&error.message){
                alert(error.message);
            }
            else
                alert("网络阻塞，请刷新重试！");

        },
        modifyTopoSuccess:function(){
            this.options.onSaveCallback && this.options.onSaveCallback();
            alert('修改成功');
        },
        modifyTopoError: function(error){
           if (error&&error.message){
                alert(error.message);
            }
            else
                alert("网络阻塞，请刷新重试！");
        },
        onOriginInfo: function(res){
            var tempModel = res;
            var allNodes = [];
            this.NodeleteNodes = [];
            _.each(tempModel.allNodes,function(el){
                allNodes.push(el.id);
                this.NodeleteNodes.push(el.id);
            }.bind(this));
            var upperNodes = [];
            _.each(tempModel.upperNodes,function(el){
                upperNodes.push(el.id);
            });
            this.defaultParam = {
                "id":tempModel.id,
                "name":tempModel.name,
                "allNodes": allNodes,
                "upperNodes":upperNodes,
                "rule": tempModel.rule,
                "type": tempModel.type
            }
            this.NodeleteNodes = [];
            _.each(this.defaultParam.allNodes,function(el){
                this.NodeleteNodes.push(el)  
            }.bind(this));
            this.$el.find("#input-name").val(tempModel.name);
            this.$el.find("#input-name").attr("readonly", "true");
            this.initSetup();
        },
        initSetup: function(){
            this.$el.find('.all .add-node').hide();
            this.$el.find('.upper .add-node').hide();
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            if (!this.isEdit){
                if(AUTH_OBJ.ApplyCreateTopos){
                   this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
                }
                this.$el.find(".add-rule").on("click", $.proxy(this.onClickAddRuleButton, this));
                this.$el.find(".alert-danger").show();
            }
            else{
                if(AUTH_OBJ.ApplyEditTopos){
                   this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this)); 
                }
                this.$el.find(".add-rule").hide();
                this.$el.find(".alert-danger").hide();
            }
            this.collection.off("get.node.success");
            this.collection.off("get.node.error");
            this.collection.on("get.node.success", $.proxy(this.onGetAllNode, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            
            this.collection.off("get.devicetype.success");
            this.collection.off("get.devicetype.error");
            this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
            this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));
            
            this.collection.getNodeList(); //获取所有节点列表接口
            this.collection.getDeviceTypeList();//获取应用类型列表接口
            
            if(this.isEdit){
                var data = this.analyticFunction(this.defaultParam.rule);
                this.defaultParam.rule = this. analyticRuleFunction(this.defaultParam);
                this.initRuleTable(data);
            }
        },
        analyticFunction:function(data){
            var data_save = [];
            var self = this;
            _.each(data, function(el, key, ls){
                var data_save_content = {
                     id:null,
                    'localLayer':[],
                    'upperLayer':[]
                };
                if(el.localType == 2){
                    _.each(el.local,function(local){
                        data_save_content.localLayer.push(local.name)
                    })
                }else if(el.localType == 1){
                    _.each(el.local,function(local){
                         data_save_content.localLayer.push(local.name);
                    })
                }
                _.each(el.upper,function(upper){
                     data_save_content.upperLayer.push(upper.rsNodeMsgVo.name)
                               
                })
                data_save_content.localLayer = data_save_content.localLayer.join('、');
                data_save_content.upperLayer = data_save_content.upperLayer.join('、');
                data_save_content.id = key;
                data_save.push(data_save_content);

            });
            return data_save;
        },
        analyticRuleFunction: function(res){
            var rule = [];
            _.each(res.rule,function(el){
                var localAll = [];
                var upperAll = [];
                _.each(el.local,function(local){
                     localAll.push(local.id);
                })
                _.each(el.upper,function(upper){
                    upperAll.push({id:upper.rsNodeMsgVo.id,ipCorporation:upper.ipCorporation});
                })
                rule.push({id:el.id,localType:el.localType,local:localAll,upper:upperAll});
            });
            return rule;
        },
        onClickSaveButton:function(){
            var flag = true;
            this.defaultParam.name = $.trim(this.$el.find("#input-name").val());
            if(this.defaultParam.name == ''){
                alert('请输入拓扑关系名称');
                return ;
            }
            else if(this.defaultParam.type == null){
                alert('请选择设备类型');
                return ;
            }
            else if(this.defaultParam.allNodes.length == 0){
                alert('请选择加入拓扑关系的节点');
                return ;
            }
            else if(this.defaultParam.upperNodes.length == 0){
                alert('请选择拓扑关系的上层节点');
                return ;
            }
            else if(this.defaultParam.rule.length == 0){
                alert('请添加规则');
                return;
            }
            _.each(this.defaultParam.rule,function(el){
                if(el.local.length == 0){
                    alert('请在配置规则中选择本层节点');
                    flag = false;
                    return ;
                }else if(el.upper.length == 0){
                    alert('请在配置规则中选择上层节点');
                    flag = false;
                    return ;
                }
            })
             if(flag){
                if(this.isEdit){
                    console.log(this.defaultParam);
                    this.collection.topoModify(this.defaultParam);
                }
                else{
                    this.collection.topoAdd(this.defaultParam);
                }
             }
              
        },
        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },
        initDeviceDropMenu: function(res){
            this.deviceTypeArray = [];
            var typeArray = [],
            rootNode = this.$el.find(".dropdown-type");

            _.each(res, function(el, index, ls){
                typeArray.push({name:el.name, value: el.id});
                this.deviceTypeArray.push({name:el.name, value: el.id});
            }.bind(this));
            if (!this.isEdit){
                this.defaultParam.type = typeArray[0].value;
                var rootNode = this.$el.find(".dropdown-app");
                Utility.initDropMenu(rootNode, typeArray, function(value){
                       this.defaultParam.type = parseInt(value)
                }.bind(this));

               this.$el.find("#dropdown-app .cur-value").html(typeArray[0].name); 
                
            } else {
                //this.$el.find('#dropdown-app .cur-value').html()
                var upperObj = _.find(typeArray, function(object){
                    return object.value == this.defaultParam.type;
                }.bind(this))
                this.$el.find('#dropdown-app .cur-value').html(upperObj.name);
                this.$el.find("#dropdown-app").attr("disabled", "disabled")
            }
          
        },

        onGetAllNode: function(res){
            this.$el.find('.all .add-node').show();
            var nodesArray = [];
            
            this.selectedAllNodeList = [];
            this.nodesArrayFirst = [];
            var resFlag = [];
            _.each(res,function(el,index,list){
                resFlag.push(el);
            })
            _.each(resFlag,function(el,index,list){
                if(el.status == 3 || el.status == 2){
                   res.splice(index,1);
                }
            }.bind(this));
            _.each(res, function(el, index, list){
                el.checked = false;
                _.each(this.defaultParam.allNodes, function(defaultLocalId, inx, ls){
                    if (defaultLocalId === el.id) {
                        el.checked = true;
                        this.selectedAllNodeList.push({nodeId: el.id, nodeName: el.chName , operator:el.operatorId, checked:el.checked})
                    }
                }.bind(this))
                nodesArray.push({name:el.chName, value: el.id, checked: el.checked, operator:el.operatorId});
                this.allNodes.push({name:el.chName, nodeId: el.id, checked: el.checked, operator:el.operatorId});
                this.nodesArrayFirst.push({name:el.chName, value: el.id, checked: el.checked, operator:el.operatorId});
            }.bind(this))
            
            if(this.isEdit){
                this.disabledNode = [];
                _.each(this.nodesArrayFirst,function(el,index,list){
                     if(el.checked == true){
                         this.disabledNode.push(el);
                     } 
                }.bind(this));
                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.all .add-node-ctn').get(0),
                    panelID: this.$el.find('.all .add-node').get(0),
                    openSearch: true,
                    onOk: function(data){
                        this.selectedAllNodeList = [];
                        _.each(data, function(el, key, ls){
                            this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
                        }.bind(this))
                        this.defaultParam.allNodes.length = 0;
                        _.each(this.selectedAllNodeList,function(el,key,ls){
                            this.defaultParam.allNodes.push(parseInt(el.nodeId));
                        }.bind(this))
                        _.each(this.nodesArrayFirst,function(el,key,ls){
                            el.checked = false;
                            _.each(this.selectedAllNodeList,function(data,key,ls){
                                if(el.value == data.nodeId){
                                    el.checked = true;
                                    data.operatorId = el.operator;
                                }
                            }.bind(this))
                        }.bind(this))
                        var ifreset = true;
                        this.initAllNodesTable(ifreset)
                    }.bind(this),
                    data: nodesArray,
                    isDisabled:true,
                    disabledNode:this.disabledNode,
                    callback: function(data){}.bind(this)
                });
            }else{
                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.all .add-node-ctn').get(0),
                    panelID: this.$el.find('.all .add-node').get(0),
                    openSearch: true,
                    onOk: function(data){
                        this.selectedAllNodeList = [];
                        _.each(data, function(el, key, ls){
                            this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
                        }.bind(this))
                        this.defaultParam.allNodes.length = 0;
                        _.each(this.selectedAllNodeList,function(el,key,ls){
                            this.defaultParam.allNodes.push(parseInt(el.nodeId));
                        }.bind(this))
                        _.each(this.nodesArrayFirst,function(el,key,ls){
                            el.checked = false;
                            _.each(this.selectedAllNodeList,function(data,key,ls){
                                if(el.value == data.nodeId){
                                    el.checked = true;
                                    data.operatorId = el.operator;
                                }
                            }.bind(this))
                        }.bind(this))
                        this.initAllNodesTable()
                    }.bind(this),
                    data: nodesArray,
                    callback: function(data){}.bind(this)
                });
            }
            this.initAllNodesTable()
        },
        initAllNodesSelect: function(res){
            var nodesArray = res;
            if(this.isEdit){
                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.all .add-node-ctn').get(0),
                    panelID: this.$el.find('.all .add-node').get(0),
                    openSearch: true,
                    onOk: function(data){
                        this.selectedAllNodeList = [];
                        _.each(data, function(el, key, ls){
                            this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
                        }.bind(this))
                        this.defaultParam.allNodes.length = 0;
                        _.each(this.selectedAllNodeList,function(el,key,ls){
                            this.defaultParam.allNodes.push(parseInt(el.nodeId));
                        }.bind(this))
                        _.each(this.nodesArrayFirst,function(el,key,ls){
                            el.checked = false;
                            _.each(this.selectedAllNodeList,function(data,key,ls){
                                if(el.value == data.nodeId){
                                    el.checked = true;
                                }
                            }.bind(this))
                        }.bind(this)),
                        this.initAllNodesTable()
                    }.bind(this),
                    isDisabled:true,
                    disabledNode:this.disabledNode,
                    data: nodesArray,
                    callback: function(data){}.bind(this)
                });
            }else{
                var searchSelect = new SearchSelect({
                    containerID: this.$el.find('.all .add-node-ctn').get(0),
                    panelID: this.$el.find('.all .add-node').get(0),
                    openSearch: true,
                    onOk: function(data){
                        this.selectedAllNodeList = [];
                        _.each(data, function(el, key, ls){
                            this.selectedAllNodeList.push({nodeId: el.value, nodeName: el.name, operatorId:''});
                        }.bind(this))
                        this.defaultParam.allNodes.length = 0;
                        _.each(this.selectedAllNodeList,function(el,key,ls){
                            this.defaultParam.allNodes.push(parseInt(el.nodeId));
                        }.bind(this))
                        _.each(this.nodesArrayFirst,function(el,key,ls){
                            el.checked = false;
                            _.each(this.selectedAllNodeList,function(data,key,ls){
                                if(el.value == data.nodeId){
                                    el.checked = true;
                                }
                            }.bind(this))
                        }.bind(this)),
                        this.initAllNodesTable()
                    }.bind(this),
                    data: nodesArray,
                    callback: function(data){}.bind(this)
                });
            }
        },
        initAllNodesTable: function(ifreset){
            if(this.isEdit){
                var s = [];
                _.each(this.selectedAllNodeList,function(el){
                    if(this.NodeleteNodes.indexOf(el.nodeId) < 0){
                        s.push(el.nodeId);
                    }
                }.bind(this))
                _.each(this.selectedAllNodeList,function(node,index){
                    if(this.NodeleteNodes.indexOf(node.nodeId) < 0){
                        this.selectedAllNodeList.splice(index,1);
                        this.selectedAllNodeList.unshift(node);
                    }
                }.bind(this))
            }
            this.localTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedAllNodeList
            }));
            _.each($(this.localTable).find('.addOrEdit .delete'),function(el){
                _.each(this.NodeleteNodes,function(nodes){
                    if(el.id == nodes){
                        el.remove();
                    }
                }.bind(this))
            }.bind(this))
            if (this.selectedAllNodeList.length !== 0)
                this.$el.find(".all .table-ctn").html(this.localTable[0]);
            else
                this.$el.find(".all .table-ctn").html(_.template(template['tpl/empty.html'])());

            this.localTable.find("tbody .delete").on("click", $.proxy(this.onClickItemAllDelete, this));
            
            /*if(ifreset!=true){*/
             this.onGetUpperNode();
            /*}*/
        },

        onGetUpperNode: function(res){
            if (!this.isEdit) this.$el.find('.upper .add-node').show();
            var nodesArray = [];
            this.selectedUpperNodeList = [];
            this.nodesArrayFirstUpper = [];
            _.each(this.selectedAllNodeList, function(el, index, list){
                el.checked = false;
                _.each(this.defaultParam.upperNodes, function(upperId, inx, ls){
                    if (upperId === el.nodeId) {
                        el.checked = true;
                        this.selectedUpperNodeList.push({
                            nodeId: el.nodeId, 
                            nodeName: el.nodeName, 
                        })
                    }
                }.bind(this))
                nodesArray.push({name:el.nodeName, value: el.nodeId, checked: el.checked, operator:el.operatorId});
                this.nodesArrayFirstUpper.push({name:el.nodeName, value: el.nodeId, checked: el.checked, operator:el.operatorId});
            }.bind(this))

            this.initUpperTable()
            
            if (nodesArray.length === 0) return;

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.upper .add-node-ctn').get(0),
                panelID: this.$el.find('.upper .add-node').get(0),
                openSearch: true,
                onOk: function(data){
                    this.selectedUpperNodeList = [];
                    _.each(data, function(el, key, ls){
                        this.selectedUpperNodeList.push({
                            nodeId: el.value, 
                            nodeName: el.name,
                            operatorId: ''
                        })
                    }.bind(this))
                    this.defaultParam.upperNodes = [];
                    _.each(this.selectedUpperNodeList,function(el){
                          this.defaultParam.upperNodes.push(parseInt(el.nodeId));
                    }.bind(this))
                    _.each(this.nodesArrayFirstUpper,function(el,key,ls){
                        el.checked = false;
                        _.each(this.selectedUpperNodeList,function(data,key,ls){
                            if(el.value == data.nodeId){
                                el.checked = true;
                                data.operatorId = el.operator;
                            }
                        }.bind(this))
                    }.bind(this))
                    this.initUpperTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
        },
        initUpperSelect: function(res){
            var nodesArray = res;
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.upper .add-node-ctn').get(0),
                panelID: this.$el.find('.upper .add-node').get(0),
                openSearch: true,
                onOk: function(data){
                    this.selectedUpperNodeList = [];
                    _.each(data, function(el, key, ls){
                        this.selectedUpperNodeList.push({
                            nodeId: el.value, 
                            nodeName: el.name,
                            operatorId: ''
                        })
                    }.bind(this))
                    this.defaultParam.upperNodes = [];
                    _.each(this.selectedUpperNodeList,function(el){
                          this.defaultParam.upperNodes.push(parseInt(el.nodeId));
                    }.bind(this))
                    _.each(this.nodesArrayFirstUpper,function(el,key,ls){
                        el.checked = false;
                        _.each(this.selectedUpperNodeList,function(data,key,ls){
                            if(el.value == data.nodeId){
                                el.checked = true;
                            }
                        }.bind(this))
                    }.bind(this))
                    this.initUpperTable()
                }.bind(this),
                data: nodesArray,
                callback: function(data){}.bind(this)
            });
        },
        initUpperTable: function(){
            this.upperTable = $(_.template(template['tpl/businessManage/businessManage.add&edit.table.html'])({
                data: this.selectedUpperNodeList
            }));
            if (this.selectedUpperNodeList.length !== 0)
                this.$el.find(".upper .table-ctn").html(this.upperTable[0]);
            else{
                this.$el.find(".upper .table-ctn").html(_.template(template['tpl/empty.html'])());
                this.defaultParam.upperNodes = [];
            }


            if (!this.isEdit)
                this.upperTable.find("tbody .delete").on("click", $.proxy(this.onClickItemUpperDelete, this));
            else
                this.upperTable.find("tbody .delete").hide();
        },

        onClickItemAllDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var lengthParam = this.defaultParam.allNodes.length;
            for(var i=0; i < lengthParam; i++){
                if(this.defaultParam.allNodes[i] == parseInt(id)){
                    this.defaultParam.allNodes.splice(i,1);
                }
            }
            _.each(this.nodesArrayFirst,function(el,index,list){
                  if(el.value == parseInt(id)){
                     el.checked = false;
                     this.initAllNodesSelect(this.nodesArrayFirst);
                  }
            }.bind(this));
            var length = this.selectedAllNodeList.length;
            for (var i = 0; i < length; i++){ 
                if (parseInt(this.selectedAllNodeList[i].nodeId) === parseInt(id)){
                   
                    this.selectedAllNodeList.splice(i, 1);
                    this.initAllNodesTable();
                    
                    return;
                }
            }
        },

        onClickItemUpperDelete: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var lengthParam = this.defaultParam.upperNodes.length;
            for(var i = 0 ;i<lengthParam;i++){
                if(this.defaultParam.upperNodes[i] == parseInt(id)){
                    this.defaultParam.upperNodes.splice(i,1);
                }
            }
            var lengthUpperNode = this.nodesArrayFirstUpper.length;
            for(var i = 0 ;i<lengthUpperNode;i++){
                if(parseInt(this.nodesArrayFirstUpper[i].value) === parseInt(id)){
                    this.nodesArrayFirstUpper[i].checked = false;
                    this.initUpperSelect(this.nodesArrayFirstUpper);
                }
            }
            var length = this.selectedUpperNodeList.length;
            for (var i = 0; i < length; i++){
                if (parseInt(this.selectedUpperNodeList[i].nodeId) === parseInt(id)){
                    this.selectedUpperNodeList.splice(i, 1);
                    this.initUpperTable();
                    return;
                }
            }
        },

        initRuleTable: function(data){
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            var data = data;
            this.roleTable = $(_.template(template['tpl/setupChannelManage/setupChannelManage.role.table.html'])({
                data: data, 
            }));
            if (data.length !== 0)
                this.$el.find(".rule .table-ctn").html(this.roleTable[0]);
            else
                this.$el.find(".rule .table-ctn").html(_.template(template['tpl/empty.html'])());

            if (!this.isEdit){
                this.roleTable.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
                this.roleTable.find("tbody .delete").on("click", $.proxy(this.onClickItemDelete, this));
            } else {
                this.roleTable.find("tbody .edit").hide();
                this.roleTable.find("tbody .delete").hide();
            }
        },
        onClickItemEdit: function(event){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "A"){
                eventTarget = $(eventTarget).parent().parent();
                id = eventTarget.attr("data-id");
            } else {
                id = $(eventTarget).attr("data-id");
            }
            this.id = id;
            require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], function(AddEditLayerStrategyView, AddEditLayerStrategyModel){
                var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                    collection: this.collection,
                    localNodes: this.selectedAllNodeList,
                    upperNodes: this.selectedUpperNodeList,
                    rule      : this.rule,
                    id        : this.id,
                    isEdit    : true,
                    onSaveCallback: function(){
                        this.defaultParam.rule = this.rule;
                        var data = this.InformationProcessing(this.rule);
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                        this.initRuleTable(data);
                        
                    }.bind(this),
                    onCancelCallback: function(){
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                    }.bind(this)
                })

                this.$el.find(".add-topo").hide();
                myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
            }.bind(this))
        },
        onClickItemDelete:function(){
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "A"){
                eventTarget = $(eventTarget).parent().parent();
                id = eventTarget.attr("data-id");
            } else {
                id = $(eventTarget).attr("data-id");
            }
            this.rule.splice(id,1);
            var data = this.InformationProcessing(this.rule);
            this.initRuleTable(data);
            
        },
        onClickAddRuleButton: function(){
            require(['addEditLayerStrategy.view', 'addEditLayerStrategy.model'], function(AddEditLayerStrategyView, AddEditLayerStrategyModel){
                
                var myAddEditLayerStrategyModel = new AddEditLayerStrategyModel();
                var options = myAddEditLayerStrategyModel;
                var myAddEditLayerStrategyView = new AddEditLayerStrategyView({
                    collection: options,
                    localNodes: this.selectedAllNodeList,
                    upperNodes: this.selectedUpperNodeList,
                    rule      : this.rule,
                    onSaveCallback: function(){
                        this.defaultParam.rule = this.rule;
                        var data = this.InformationProcessing(this.rule);
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                        this.initRuleTable(data);
                        
                    }.bind(this),
                    onCancelCallback: function(){
                        myAddEditLayerStrategyView.$el.remove();
                        this.$el.find(".add-topo").show();
                    }.bind(this)
                })

                this.$el.find(".add-topo").hide();
                myAddEditLayerStrategyView.render(this.$el.find(".add-role-ctn"));
            }.bind(this))
        },
        setOperatorInfo: function(res){
            this.operator = [];
            _.each(res,function(el,index,list){
                this.operator.push({
                   'name' : el.name,
                   'value': el.id
                })
            }.bind(this));
        },
        InformationProcessing:function(data){
            //var data = [{localLayer: "1111", upperLayer: "22222"}];
            var data_save = [];
            var self = this;
            _.each(data, function(el, key, ls){
                var data_save_content = {
                     id:null,
                    'localLayer':[],
                    'upperLayer':[]
                };
                if(el.localType == 2){
                    _.each(el.local,function(local){
                        _.each(self.operator,function(operator){
                            if(local == operator.value){
                               data_save_content.localLayer.push(operator.name)
                            }
                        })
                    }.bind(this))
                }else if(el.localType == 1){
                    _.each(el.local,function(local){
                        _.each(self.allNodes,function(nodes){

                            if(local == nodes.nodeId){
                               data_save_content.localLayer.push(nodes.name);
                            }
                        })
                    })
                }
                _.each(el.upper,function(upper){
                        _.each(self.allNodes,function(nodes){
                            if(upper.nodeId == nodes.nodeId){
                    
                                 data_save_content.upperLayer.push(nodes.name)
                               
                               
                            }
                        })
                })
                data_save_content.localLayer = data_save_content.localLayer.join('、');
                data_save_content.upperLayer = data_save_content.upperLayer.join('、');
                data_save_content.id = key;
                data_save.push(data_save_content);

            });
            return data_save;
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
    var SetupTopoManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.html'])());
            //获取所有的拓扑关系信息
            this.collection.off("get.topoInfo.success");
            this.collection.off("get.topoInfo.error");
            this.collection.on("get.topoInfo.success", $.proxy(this.onGetTopoSuccess, this));
            this.collection.on("get.topoInfo.error", $.proxy(this.onGetError, this));
            //获取应用类型
            this.collection.off("get.devicetype.success");
            this.collection.off("get.devicetype.error");
            this.collection.on("get.devicetype.success", $.proxy(this.initDeviceDropMenu, this));
            this.collection.on("get.devicetype.error", $.proxy(this.onGetError, this));
            
            //this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
            //this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));
            
            if(AUTH_OBJ.QueryTopos) {
                this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));
                this.off('enterKeyBindQuery');
                this.on('enterKeyBindQuery',$.proxy(this.onClickQueryButton, this));
                this.enterKeyBindQuery();
            }
            else{
                this.$el.find(".opt-ctn .query").remove();
            }
            if(AUTH_OBJ.CreateTopos) {
                this.$el.find(".opt-ctn .new").on("click", $.proxy(this.onClickAddRuleTopoBtn, this));
            }
            else{
                
                this.$el.find(".opt-ctn .new").remove();
            }
            
            
            this.queryArgs = {
                "name" : null,
                "type" : null,
                "page" : 1,
                "size" : 10
             }
            this.onClickQueryButton();
            this.collection.getDeviceTypeList();


        },
        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                   this.trigger('enterKeyBindQuery');
                }
            }.bind(this));
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetTopoSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.queryArgs.page = 1;
            this.queryArgs.name = this.$el.find("#input-topo-name").val();
            if (this.queryArgs.name == "") this.queryArgs.name = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            //this.collection.queryChannel(this.queryArgs);
            this.collection.getTopoinfo(this.queryArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.table.html'])({data: this.collection.models, permission: AUTH_OBJ}));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            
            if(AUTH_OBJ.EditTopos){
               this.table.find("tbody .edit").on("click", $.proxy(this.onClickItemEdit, this));
            }else{
               this.table.find("tbody .edit").remove();
            }
            this.table.find("tbody .send").on("click", $.proxy(this.onClickItemSend, this));
        },
        onClickAddRuleTopoBtn: function(){
            this.off('enterKeyBindQuery');
            var myEditTopoView = new EditTopoView({
                collection: this.collection,
                WhetherSaveSuccess: this.WhetherSaveSuccess,
                onSaveCallback: function(){
                    this.on('enterKeyBindQuery',$.proxy(this.onClickQueryButton, this));
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                    this.onClickQueryButton();
                }.bind(this),
                onCancelCallback: function(){
                    this.on('enterKeyBindQuery',$.proxy(this.onClickQueryButton, this));
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myEditTopoView.render(this.$el.find(".edit-panel"))
        },

        onClickItemEdit: function(event){
            this.off('enterKeyBindQuery');
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);
            var myEditTopoView = new EditTopoView({
                collection: this.collection,
                model: model,
                isEdit: true,
                onSaveCallback: function(){
                    this.on('enterKeyBindQuery',$.proxy(this.onClickQueryButton, this));
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                    this.onClickQueryButton();
                }.bind(this),
                onCancelCallback: function(){
                    this.on('enterKeyBindQuery',$.proxy(this.onClickQueryButton, this));
                    myEditTopoView.$el.remove();
                    this.$el.find(".list-panel").show();
                }.bind(this)
            })

            this.$el.find(".list-panel").hide();
            myEditTopoView.render(this.$el.find(".edit-panel"))
        },
        onClickItemSend: function(){
            this.off('enterKeyBindQuery');
            var eventTarget = event.srcElement || event.target, id;
            if (eventTarget.tagName == "SPAN"){
                eventTarget = $(eventTarget).parent();
                id = eventTarget.attr("id");
            } else {
                id = $(eventTarget).attr("id");
            }
            var model = this.collection.get(id);            
            require(['setupTopoManageSendStrategy.model'], function(setupTopoManageSendStrategyModel){
                var mySendStrategeModel = new setupTopoManageSendStrategyModel();
                var options = mySendStrategeModel;
                var mySendView = new SendView({
                    collection:options,
                    model:model,
                    onSaveCallback: function(){
                        this.on('enterKeyBindQuery',$.proxy(this.onClickQueryButton, this));
                        mySendView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this),
                    onCancelCallback: function(){
                        this.on('enterKeyBindQuery',$.proxy(this.onClickQueryButton, this));
                        mySendView.$el.remove();
                        this.$el.find(".list-panel").show();
                    }.bind(this)
                })

                this.$el.find(".list-panel").hide();
                mySendView.render(this.$el.find(".edit-panel"))
            }.bind(this));
            
            
        },
        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.queryArgs.size) return;
            var total = Math.ceil(this.collection.total/this.queryArgs.size);
            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.queryArgs);
                        args.page = num;
                        args.count = this.queryArgs.size;
                        this.collection.getTopoinfo(args);
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initDeviceDropMenu: function(res){
            this.deviceTypeArray = [];
            var typeArray = [
                {
                    name:'全部',
                    value:'all'
                }
            ],
            rootNode = this.$el.find(".dropdown-type");

            _.each(res, function(el, index, ls){
                typeArray.push({name:el.name, value: el.id});
                this.deviceTypeArray.push({name:el.name, value: el.id});
            }.bind(this));
            if (!this.isEdit){
                var rootNode = this.$el.find(".dropdown-app");
                Utility.initDropMenu(rootNode, typeArray, function(value){
                    if (value !== "All")
                        this.queryArgs.type = parseInt(value)
                    else
                        this.queryArgs.type = null
                }.bind(this));
            } else {
                this.$el.find("#dropdown-app").attr("disabled", "disabled")
            }
      
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.queryArgs.size = parseInt(value);
                this.queryArgs.page = 1;
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

    return SetupTopoManageView;
});