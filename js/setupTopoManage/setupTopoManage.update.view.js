define("setupTopoManage.update.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var UpdateTopoView = Backbone.View.extend({
            events: {},
           
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.isEdit=options.isEdit;
                if(this.options.pageType==1){
                    this.collection.off("get.topoUpdateSetup.success");
                    this.collection.off("get.topoUpdateSetup.error");
                    this.collection.on("get.topoUpdateSetup.success", $.proxy(this.onGetUpdateSetupSuccess, this));
                    this.collection.on("get.topoUpdateSetup.error", $.proxy(this.onGetError, this));
                 //   this.collection.getProgress({topologyId:this.model.get('id')});
                   this.topoData={
                        "basicinfo":{
                            "topologyId":"16",
                            "topologyName":"直播通用域名拓扑-9",
                            "platformName":"Live",
                            "platformId":"203",
                            "topologyVersion":311,
                            "jobId":1,
                            "affectedNodeId":"更新配置的结点ID",
                            "domains":"域名列表",
                            "ignoreDomains":"因域名切换平台，或域名被删除无法更新配置的域名",
                            "needToUpdateCfg":true
                        },
                        "configDeliverySwitch":true,
                        "configUpdateProgress":{
                            "progressPercentage":"90%",
                            "job_status":1,//"任务状态 1:更新中 2:更新完成 3:系统或数据异常，导致更新失败",
                            "message":"任务成功",
                            "expendTime":3//"耗时（秒）"
                        }
                     }
                }else if(this.options.pageType==2){
                    this.collection.off("get.specialLayerSetup.success");
                    this.collection.off("get.specialLayerSetup.error");
                    this.collection.on("get.specialLayerSetup.success", $.proxy(this.onGetUpdateSetupSuccess, this));
                    this.collection.on("get.specialLayerSetup.error", $.proxy(this.onGetError, this));
                   // this.collection.getSpecialLayerProgress({topologyId:this.model.get('id')})
                    this.topoData={
                        "basicinfo":{
                            "specialLayerStrategyId":57,
                            "specialLayerStrategyName":"test-001",
                            "topologyId":"拓扑ID",
                            "topologyName":"拓扑名称",
                            "platformName":"Live",
                            "platformId":"应用ID",
                            "topologyVersion":"版本号",
                            "jobId":12,
                            "affectedNodeId":"更新配置的结点ID",
                            "domains":["kscdn.lala.com","kscdn.lala2.com"],
                            "ignoreDomains":["因域名切换平台，或域名被删除无法更新配置的域名"],
                            "needToUpdateCfg":true
                        },
                        "configDeliverySwitch":true,
                        "configUpdateProgress":{
                            "progressPercentage":"90%",
                            "job_status":1,
                            "message":"任务成功或失败后的一些信息",
                            "expendTime":"耗时（秒）"
                        }
                    }
                    this.domainList=this.topoData.basicinfo.domains || ['没有关联的域名']
                }else if(this.options.pageType==3){
                    this.collection.off("get.specialLayerSetup.success");
                    this.collection.off("get.specialLayerSetup.error");
                    this.collection.on("get.specialLayerSetup.success", $.proxy(this.onGetUpdateSetupSuccess, this));
                    this.collection.on("get.specialLayerSetup.error", $.proxy(this.onGetError, this));
                   // this.collection.getNodeProgress({topologyId:this.model.get('id')})
                    this.topoData={
                        "basicinfo":{
                            "nodeId":382,
                            "nodeName":"贵安电信04节点",
                            "topology":[
                                {"topologyId":1,"topologyName":"拓扑名称1"},
                                {"topologyId":2,"topologyName":"拓扑名称2"}
                            ]
                        },
                        "configDeliverySwitch":false,
                        "initProgress":{
                            "progressPercentage":"90%",
                            "job_status":1,
                            "diffDomains":["有异构的域名"]
                        }
                    }
                  this.topoList=this.topoData.basicinfo.topology
                }

                this.collection.off("set.deliveryswitch.success");
                this.collection.off("set.deliveryswitch.error");
                this.collection.on("set.deliveryswitch.success", $.proxy(this.setSwitchSuccess, this));
                this.collection.on("set.deliveryswitch.error", $.proxy(this.onGetError, this)); 

                this.collection.off("start.createSetup.success");
                this.collection.off("start.createSetup.error");
                this.collection.on("start.createSetup.success", $.proxy(this.startCreateSetupSuccess, this));
                this.collection.on("start.createSetup.error", $.proxy(this.onGetError, this)) 

                this.collection.off("start.nodeInitSetup.success");
                this.collection.off("start.nodeInitSetup.error");
                this.collection.on("start.nodeInitSetup.successs", $.proxy(this.startNodeInitSetupSuccess, this));
                this.collection.on("start.nodeInitSetup.error", $.proxy(this.onGetError, this)) 

                this.collection.off("create.sendTask.success");
                this.collection.off("create.sendTask.error");
                this.collection.on("create.sendTask.success", $.proxy(this.onCreatTaskSuccess, this));
                this.collection.on("create.sendTask.error", $.proxy(this.onGetError, this));

                this.initSetup();
               
            },
            
            onGetUpdateSetupSuccess:function(res){
                console.log(res)
               // this.topoData=res;
                //this.initSetup();
            },

            initSetup:function(){
                this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.update.html'])({
                    data: this.topoData,
                    pageType:this.options.pageType
                })); 
                this.initDomainList();  
                this.initTopoList();  
                this.$el.find(".createSetup").on("click",$.proxy(this.onClickCreateSetupBtn,this))
                this.$el.find("#stopSetupSend").on("click", $.proxy(this.onClickStopSetupSendBtn,this))
                this.$el.find(".sendSetup").on("click",$.proxy(this.onClickSendSetupBtn,this))
                this.$el.find(".cancel").on("click",$.proxy(this.onClickCancelBtn,this))

                this.$el.find(".view-more").on("click", $.proxy(this.onClickViewMoreButton, this));
                this.$el.find(".view-less").on("click", $.proxy(this.onClickViewLessButton, this));
                this.$el.find('.view-less').hide();

                if(this.topoData.configDeliverySwitch){
                    this.$el.find(".createSetup").attr("disabled","disabled")
                   // this.$el.find(".sendSetup").attr("disabled","disabled")
                }else{
                    this.$el.find(".sendSetup").attr("disabled","disabled")
                } 
            },

            startNodeInitSetupSuccess:function(){
                var showStatus="";
                var msg=""
                this.num2=0

                var showStatus=setInterval(function(){
                    if(this.topoData.initProgress.job_status==1){
                         //  this.collection.getNodeProgress({topologyId:this.model.get('id')})
                           msg="更新中... \n"+this.topoData.initProgress.progressPercentage+this.num2;
                           var highCode=hljs.highlightAuto(msg).value
                           this.$el.find(".statusBox pre").find("code").html(highCode)
                           this.num2++;
                    }
                    if(this.num2==101){   
                         clearInterval(showStatus)
                         this.topoData.initProgress.job_status=2
                        if(this.topoData.initProgress.job_status==2){ 
                            msg+=" \n初始化成功！";
                             this.$el.find(".statusBox pre").find("code").html(msg)   
                            alert(this.topoData.basicinfo.nodeName+"配置初始化操作成功")
                            setTimeout(function(){
                               this.options.onCancelCallback && this.options.onCancelCallback();
                            }.bind(this),3000)     
                        }
                        else if(this.topoData.initProgress.job_status==3){
                            msg+=" \n初始化失败！";
                            var highCode=hljs.highlightAuto(msg).value
                            this.$el.find(".statusBox pre").find("code").html(highCode) 
                            this.topoData.initProgress.job_status=1
                        }
                    }
                }.bind(this),50)  
            },

            startCreateSetupSuccess:function(){
                var showStatus="";
                var msg=""
                this.num=0
                var showStatus=setInterval(function(){
                    if(this.topoData.configUpdateProgress.job_status==1){
                         // if(this.options.pageType==1)
                         //     this.collection.getProgress({topologyId:this.model.get('id')});
                         // else
                         //     this.collection.getSpecialLayerProgress({topologyId:this.model.get('id')});
                        msg="更新中...  \n"+this.topoData.configUpdateProgress.progressPercentage+this.num;
                        var highCode=hljs.highlightAuto(msg).value
                        this.$el.find(".statusBox pre").find("code").html(highCode)
                        this.num++;
                    }
                    if(this.num==101){   
                         clearInterval(showStatus)
                         this.topoData.configUpdateProgress.job_status=2
                         if(this.topoData.configUpdateProgress.job_status!=1){
                                msg+=" \n"+this.topoData.configUpdateProgress.message;
                                var highCode=hljs.highlightAuto(msg).value
                                this.$el.find(".statusBox pre").find("code").html(highCode)
                        } 
                        if(this.topoData.configUpdateProgress.job_status==2)    
                            this.$el.find(".sendSetup").removeAttr("disabled")
                        else if(this.topoData.configUpdateProgress.job_status==3){
                            this.topoData.configUpdateProgress.job_status=1
                        }
                    }
                }.bind(this),50)           
            },

            onClickSendSetupBtn:function(){
                if(!this.topoData.basicinfo.needToUpdateCfg){
                    Utility.confirm("本次拓扑配置修改后无需对节点进行配置下发",function(){
                    /*  this.collection.setdeliveryswitch({
                        platformId:this.topoData.basicinfo.platformId,
                        switch:true
                      })*/
                      this.options.onCancelCallback && this.options.onCancelCallback();
                    }.bind(this))
                }else{
                    this.showSelectStrategyPopup()
                }
            },

            showSelectStrategyPopup: function() {
                if (this.selectStrategyPopup) $("#" + this.selectStrategyPopup.modalId).remove();
     
                require(["setupSendWaitCustomize.stratety.view"], function(SelectStrategyView) {
                    var mySelectStrategyView = new SelectStrategyView({
                        collection: this.collection,
                        model: this.model,
                        pageType:this.options.pageType,
                    });
                    var type = AUTH_OBJ.ApplySendMission ? 2 : 1;
                    var options = {
                        title: "生成下发任务",
                        body: mySelectStrategyView,
                        backdrop: 'static',
                        type: type,
                        onOKCallback: function() {
                            var obj=mySelectStrategyView.onSure()
                            if(obj){
                                 if(obj.strategyId=="myid")
                                    this.createTaskParam={
                                        "jobId":this.topoData.basicinfo.jobId
                                    }
                                 else
                                    this.createTaskParam={
                                        "jobId":this.topoData.basicinfo.jobId,
                                        "deliveryStrategyId":obj.strategyId
                                    } 
                                console.log(this.createTaskParam)
                                this.excuteCreatTask()
                           }
                        }.bind(this),
                        onHiddenCallback: function() {
                        }.bind(this)
                    }
                    this.selectStrategyPopup = new Modal(options);
                }.bind(this))
            },
             
            excuteCreatTask: function(){
               // this.collection.createSendTask(this.createTaskParam);  
                this.selectStrategyPopup.$el.modal('hide')
                this.showDisablePopup("服务器正在努力处理中...")
                this.onCreatTaskSuccess();
            },

            onCreatTaskSuccess: function() {
                this.disablePopup && this.disablePopup.$el.modal('hide');
                setTimeout(function(){
                    Utility.alerts("创建任务成功！", "success", 3000);
                    window.location.hash = '#/setupSending';
                }.bind(this), 500)
           },

            showDisablePopup: function(msg) {
                if (this.disablePopup) $("#" + this.disablePopup.modalId).remove();
                var options = {
                    title: "警告",
                    body: '<div class="alert alert-danger"><strong>' + msg + '</strong></div>',
                    backdrop: 'static',
                    type: 0,
                }
                this.disablePopup = new Modal(options);
                this.disablePopup.$el.find(".close").remove();
               },

            onClickStopSetupSendBtn:function(event){
               var eventTarget=event.srcElement || event.target
               this.switchFlag=eventTarget.checked
               // this.collection.setdeliveryswitch({     //pageType=1||pageType==2
               //    platformId:this.topoData.basicinfo.platformId,
               //    switch:eventTarget.checked
               // })
                this.setSwitchSuccess();
            },

            setSwitchSuccess:function(){
                if(!this.switchFlag)
                  this.$el.find(".createSetup").removeAttr("disabled")
                else{
                  this.$el.find(".createSetup").attr("disabled","disabled")
                  this.$el.find(".sendSetup").attr("disabled","disabled")
               }
            },
  
            onClickCreateSetupBtn:function(){
                //     if(this.options.pageType==1)
                //        this.collection.startCreateSetup({topologyId:this.model.get("id")})
                //     else if(this.options.pageType==2)
                //        this.collection.startSpecialLayerCreateSetup({topologyId:this.model.get("id")})
                //     else if(this.options.pageType==3)
                //        this.collection.startNodeInitSetup({topologyId:this.model.get("id")}) 
                this.startCreateSetupSuccess()
                this.startNodeInitSetupSuccess();
            },
            
            onClickCancelBtn:function(){
                this.options.onCancelCallback &&this.options.onCancelCallback();
            },
            
            initDomainList: function() {
                var nodeTpl = '';
                _.each(this.domainList, function(el) {
                    nodeTpl='<li class="node-item">' +
                        '<span class="label label-primary" id="' + Utility.randomStr(8) + '">' + el + '</span>' +
                        '</li>';
                    $(nodeTpl).appendTo(this.$el.find(".node-ctn"))
                }.bind(this))
            },

            initTopoList:function(){
                var nodeTpl='';
                _.each(this.topoList,function(el){
                        nodeTpl = '<li class="topoNode-item">' +
                        '<span id="' + Utility.randomStr(8) + '">' + el.topologyName + '</span>' +
                        '</li>';
                    $(nodeTpl).appendTo(this.$el.find(".node-ctn"))
                }.bind(this))
            },

            onClickViewMoreButton: function(event) {
                this.$el.find('.view-less').show();
                this.$el.find(".view-more").hide();
                this.$el.find('.domain-ctn').css('max-height', 'none');
            },

            onClickViewLessButton: function(event) {
                this.$el.find('.view-less').hide();
                this.$el.find(".view-more").show();
                this.$el.find('.domain-ctn').css('max-height', '200px');
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            onSaveError: function(error) {
                this.isSaving = false;
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return UpdateTopoView;
    });