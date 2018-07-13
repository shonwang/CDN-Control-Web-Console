define("setupTopoManage.replaceNode.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var ReplaceNodeView = Backbone.View.extend({

        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;

            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.replace&deleteNode.html'])({

            }));
            
            this.collection.off('get.topo.OriginInfo.success');
            this.collection.off('get.topo.OriginInfo.error');
            this.collection.on('get.topo.OriginInfo.success', $.proxy(this.onOriginInfo, this));
            this.collection.on('get.topo.OriginInfo.error', $.proxy(this.onGetError, this));
            this.collection.getTopoOrigininfo(this.model.get('id'));

            this.collection.off('get.ruleInfo.success');
            this.collection.off('get.ruleInfo.error');
            this.collection.on('get.ruleInfo.success', $.proxy(this.initItemRule, this));
            this.collection.on('get.ruleInfo.error', $.proxy(this.onGetError, this));

            this.collection.off('delete.topo.success');
            this.collection.off('delete.topo.error');
            this.collection.on('delete.topo.success', $.proxy(this.deleteTopoSuccess, this));
            this.collection.on('delete.topo.error', $.proxy(this.onDeleteError, this));

            this.collection.off('replace.topo.success');
            this.collection.off('replace.topo.error');
            this.collection.on('replace.topo.success', $.proxy(this.replaceTopoSuccess, this));
            this.collection.on('replace.topo.error', $.proxy(this.onReplaceError, this));

            require(['nodeManage.model'], function(NodeManageModel){
                var myNodeManageModel = new NodeManageModel();
                myNodeManageModel.on("get.operator.success", $.proxy(this.onGetAllOperator, this));
                myNodeManageModel.on("get.operator.error", $.proxy(this.onGetError, this));
                myNodeManageModel.getOperatorList();
            }.bind(this));            

            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this)); 
            this.$el.find(".opt-ctn #delete").on("click", $.proxy(this.onClickDeleteButton, this));
            this.$el.find(".opt-ctn #replace").on("click", $.proxy(this.onClickReplaceButton, this));   

            this.$el.find(".listShowNodeType input[name=all]").on("click",$.proxy(this.onClickAll,this));     
            this.$el.find(".listShowNodeType input[name!=all]").on("click",$.proxy(this.onClickCheckBox,this));     

            this.queryArgs={
                topoId:'',
                nodeId:'',
            }
            this.operateRule={   //当前操作的规则
               id:'',
               type:'topo',
               rules:'',
               oldNodeId:'',
               newNodeId:'',
               ipCorporation:'',
               operateType:''
            }
            this.ruleIdArr=[]; //用来存储选择的规则id        
        },

        onClickAll:function(event){
              var eventTarget = event.srcElement || event.target;
              if (eventTarget.tagName !== "INPUT") return;
              var inputChecked = $(eventTarget).prop("checked");
              var inputName = $(eventTarget).attr("name");
              this.$el.find(".listShowNodeType input[name!=all]").prop("checked",inputChecked);
              this.onGetAllOriginNodes(true);
        },

        onClickCheckBox:function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var inputChecked = $(eventTarget).prop("checked");
            var len = this.getCheck();
            if(len){
              this.$el.find(".listShowNodeType input[name=all]").prop("checked",true);
            }
            else{
              this.$el.find(".listShowNodeType input[name=all]").prop("checked",false);
            }
            this.onGetAllOriginNodes(true);
        },

        getCheck:function(){
          var len = this.$el.find(".listShowNodeType input[name!=all]:checked").length == 3;
          return len;
        },

        getCheckedList:function(){
          var checkedList = this.$el.find(".listShowNodeType input[name!=all]:checked");
          var obj = {};
          for(var i=0;i<checkedList.length;i++){
              obj[$(checkedList[i]).val()]=true;
          }
          return obj;
        },

        onOriginInfo: function(res) {
            this.defaultParam = {
                "id": res.id,
                "name": res.name,
                "allNodes": res.allNodes,
                "upperNodes": res.upperNodes,
                "middleNodes": res.middleNodes,
                "lowerNodes": res.lowerNodes,
                "rule": res.rule,
                "type": res.type,
                "mark": res.mark
            }
            this.onGetAllOriginNodes();
            this.onGetAllReplaceNodes();
            
            this.queryArgs={
                topoId:this.defaultParam.id,
                nodeId:this.defaultParam.upperNodes[0].id
            }
         //   console.log("默认"+this.queryArgs.topoId+"  "+this.queryArgs.nodeId);
            this.collection.getRuleInfo(this.queryArgs); 
        },
        

        onClickDeleteButton: function(){
            if(this.ruleList.length==0){
                Utility.warning("此节点没有匹配的规则");
                return;
            }
            var i;
            for(i=0;i<this.ruleList.length;i++){
                if(this.ruleList[i].itemRuleIsChecked) break;
            }
            if(i==this.ruleList.length) {
                Utility.warning("请先选择规则")
                return;
            } 

            if(this.model)  $("#" + this.model.modalId).remove();
            
            var options={
              body:"你确定从选中规则中删除该节点吗？",
              onOKCallback:function(){
                this.operateRule.id = this.defaultParam.id;
                this.operateRule.type = "topo";
                this.operateRule.operateType = "delete";
                this.collection.deleteOrReplaceTopoInfo(this.operateRule);
                this.$el.find(".opt-ctn #delete").attr("disabled", "disabled");
                this.model.$el.modal("hide");
              }.bind(this)
            }
           this.model=new Modal(options);
        },

        onClickReplaceButton: function(){
            if(this.ruleList.length==0){
                Utility.warning("此节点没有匹配的规则");
                return;
            }
            var i;
            for(i=0;i<this.ruleList.length;i++){
                if(this.ruleList[i].itemRuleIsChecked) break;
            }
            if(i==this.ruleList.length) {
                Utility.warning("请先选择规则")
                return;
            }
           this.operateRule.id=this.defaultParam.id;
           this.operateRule.type="topo";
           this.operateRule.operateType="replace";
          if(this.operateRule.oldNodeId==this.operateRule.newNodeId){
            Utility.warning("替换节点与原节点不能相同");
            return;
         }
           this.collection.deleteOrReplaceTopoInfo(this.operateRule);
           this.$el.find(".opt-ctn #replace").attr("disabled","disabled");
        },

        initItemRule:function(res){
          var ruleList=res;
          ruleList.allRuleIsChecked=false;
          _.each(ruleList, function(el){
              el.itemRuleIsChecked=false;
              _.each(el.upper,function(e){
                if(e.chiefType==0) el.isBackup=true;  
              }.bind(this))
         }.bind(this))

          this.initRuleTable(ruleList);
        },

        initRuleTable: function(res) {
            this.ruleList=res;              
            this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.replace.table.html'])({
                data: this.ruleList
            }));  

            if (this.ruleList.length !== 0) {
                this.$el.find(".table-ctn").html(this.table[0]);
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "暂无数据"
                    }
                }));
            }
            this.table.find("thead th").find("input").on("click", $.proxy(this.onClickSelectAllRule ,this));
            this.table.find("tbody th").find("input").on("click", $.proxy(this.onClickSelectItemRule ,this));         
        },        

        onClickSelectAllRule: function(event) {
             var eventTarget = event.srcElement || event.target;
             if(eventTarget.tagName!=="INPUT") return;
             this.ruleList.allRuleIsChecked=eventTarget.checked;
             _.each(this.ruleList ,function(el){
                  el.itemRuleIsChecked=eventTarget.checked;
             }.bind(this))
             if(this.ruleList.allRuleIsChecked){
                this.operateRule.rules="all";
                this.ruleIdArr=[];
                _.each(this.ruleList,function(el,index){
                    this.ruleIdArr.push(this.ruleList[index].id);
                }.bind(this));
            }else {
                this.operateRule.rules="";
                this.ruleIdArr=[];
            }
            this.table.find("tbody tr").find("input").attr("checked", eventTarget.checked);
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
        },
        
        onClickSelectItemRule:function() {
           var eventTarget=event.srcElement || event.target;
           if(eventTarget.tagName!=="INPUT") return;
           var id=$(eventTarget).attr("id");

           _.each(this.ruleList, function(item,index,list){
               if(index==id) {
                  item.itemRuleIsChecked=eventTarget.checked;
                  if(item.itemRuleIsChecked){
                     this.ruleIdArr.push(this.ruleList[index].id);
                  }else{
                    _.each(this.ruleIdArr,function(el,i){
                        if(el===this.ruleList[index].id){
                            this.ruleIdArr.splice(i,1);
                        }                      
                    }.bind(this))
                 }
                }   
           }.bind(this))

           this.operateRule.rules=this.ruleIdArr.join(",");

           var i;
           for(i=0;i<this.ruleList.length;i++){
            if(!this.ruleList[i].itemRuleIsChecked) {
                    this.ruleList.allRuleIsChecked=false;
                    break;
              }           
           }
           if(i==this.ruleList.length){
                this.ruleList.allRuleIsChecked=true;
                this.operateRule.rules="all";
            }  
            this.table.find("thead tr").find("input").prop("checked", this.ruleList.allRuleIsChecked); 
        },

        onGetAllOriginNodes: function(isChangeSelect) {
             this.nameList=[];
             var checkedList = this.getCheckedList();
            var nameList = _.union(checkedList.up && this.defaultParam.upperNodes || [], checkedList.middle && this.defaultParam.middleNodes || [],checkedList.low && this.defaultParam.lowerNodes || []);
            _.each(nameList, function(el, key, list) {
                this.nameList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-originNode').get(0),
                panelID: this.$el.find('#dropdown-originNode').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: this.nameList,
                callback: function(data) {
                    this.$el.find('#dropdown-originNode .cur-value').html(data.name);
                    this.operateRule.oldNodeId=parseInt(data.value);
                    this.queryArgs.nodeId=parseInt(data.value);
                    this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                    this.collection.getRuleInfo(this.queryArgs);
                }.bind(this)
            });
            if(this.nameList.length > 0){
                this.$el.find("#dropdown-originNode .cur-value").html(this.nameList[0].name);
                this.operateRule.oldNodeId=this.nameList[0].value;  
            }      

            if(isChangeSelect)  {
                this.queryArgs.nodeId=this.nameList[0].value;
                this.collection.getRuleInfo(this.queryArgs);
            }
        },

        onGetAllReplaceNodes: function() {
           this.nameList = [];
           //var nameList = _.union(this.defaultParam.upperNodes, this.defaultParam.middleNodes);
           var nameList = this.defaultParam.allNodes;
            _.each(nameList, function(el, inx, list) {
                this.nameList.push({
                    name: el.name,
                    value: el.id,
                    operatorId:el.operatorId
                })
            }.bind(this))
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-replaceNode').get(0),
                panelID: this.$el.find('#dropdown-replaceNode').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                bottom:40,
                onOk: function() {},
                data: this.nameList,
                callback: function(data) {
                    this.$el.find('#dropdown-replaceNode .cur-value').html(data.name);
                    this.operateRule.newNodeId=parseInt(data.value);
                    _.each(this.nameList,function(el){
                      if(el.value==data.value&&el.operatorId!==9){
                         this.$el.find(".dropdown-operator").addClass("hideOperator");
                         this.$el.find("#dropdown-operator .cur-value").html(this.operatorList[0].name);
                         this.operateRule.ipCorporation="";
                      }else if(el.value==data.value&&el.operatorId==9){
                         this.$el.find(".dropdown-operator").removeClass("hideOperator")
                      }
                    }.bind(this))
                }.bind(this)
            });
            if(this.nameList.length > 0){
                this.$el.find("#dropdown-replaceNode .cur-value").html(this.nameList[0].name);
                this.operateRule.newNodeId=this.nameList[0].value;
                if(this.nameList[0].operatorId==9){
                    this.$el.find(".dropdown-operator").removeClass("hideOperator")
                  }
            }         
        },

        onGetAllOperator: function(data) {
            this.operatorList=[];
            this.operatorList.push({
              name:"请选择",
              value:0
            })
            _.each(data.rows, function(el, key, list) {
                this.operatorList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))
        
            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-operator').get(0),
                panelID: this.$el.find('#dropdown-operator').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                bottom:40,
                onOk: function() {},
                data: this.operatorList,
                callback: function(data) {
                    this.$el.find('#dropdown-operator .cur-value').html(data.name);
                    this.operateRule.ipCorporation=data.name;
                    if(data.value==0) this.operateRule.ipCorporation="";
                }.bind(this)
            });
            this.$el.find("#dropdown-operator .cur-value").html(this.operatorList[0].name);
           // this.operateRule.ipCorporation=this.operatorList[0].name;
        },
        
       deleteTopoSuccess: function(){
          this.collection.getRuleInfo(this.queryArgs);
          this.ruleIdArr=[];
          Utility.alerts("选定的规则中的节点删除成功！", "success", 5000)
          this.$el.find(".opt-ctn #delete").removeAttr("disabled");
       },

        onDeleteError: function(error) {
          if (error && error.message)
            Utility.alerts(error.message)
          else
            Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
          this.$el.find(".opt-ctn #delete").removeAttr("disabled");
        },
       
        replaceTopoSuccess: function (){
          //  console.log(this.queryArgs);
            this.collection.getRuleInfo(this.queryArgs);
            this.ruleIdArr=[];
            Utility.alerts("选定的规则中的节点替换成功！", "success", 5000)
            this.$el.find(".opt-ctn #replace").removeAttr("disabled");
        },

        onReplaceError: function(error){
            if (error && error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            this.$el.find(".opt-ctn #replace").removeAttr("disabled");

        },

        onClickCancelButton: function() {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },
        
        onGetError: function(error) {
            if (error && error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }

      });
        return ReplaceNodeView;
});