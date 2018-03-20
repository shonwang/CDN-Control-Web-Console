define("setupTopoManage.update.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var UpdateTopoView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;
                this.isEdit = options.isEdit;
                if (this.options.pageType == 1) {
                    this.collection.off("get.topoUpdateSetup.success");
                    this.collection.off("get.topoUpdateSetup.error");
                    this.collection.on("get.topoUpdateSetup.success", $.proxy(this.onGetUpdateSetupSuccess, this));
                    this.collection.on("get.topoUpdateSetup.error", $.proxy(this.onGetError, this));
                    this.collection.getProgress({
                        topologyId: this.model.get('id')
                    });
                } else if (this.options.pageType == 2) {
                    this.collection.off("get.specialLayerSetup.success");
                    this.collection.off("get.specialLayerSetup.error");
                    this.collection.on("get.specialLayerSetup.success", $.proxy(this.onGetUpdateSetupSuccess, this));
                    this.collection.on("get.specialLayerSetup.error", $.proxy(this.onGetError, this));
                    this.collection.getSpecialLayerProgress({
                        specialLayerStrategyId: this.model.get('id')
                    });
                } else if (this.options.pageType == 3) {
                    this.collection.off("get.nodeInitSetup.success");
                    this.collection.off("get.nodeInitSetup.error");
                    this.collection.on("get.nodeInitSetup.success", $.proxy(this.onGetUpdateSetupSuccess, this));
                    this.collection.on("get.nodeInitSetup.error", $.proxy(this.onGetError, this));
                    this.collection.getNodeProgress({
                        nodeId: this.model.get('id'),
                        platformId: options.platformId
                    });
                    this.nodePlatformId = options.platformId
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
                this.collection.on("start.nodeInitSetup.success", $.proxy(this.startNodeInitSetupSuccess, this));
                this.collection.on("start.nodeInitSetup.error", $.proxy(this.onGetError, this))

                this.collection.off("create.sendTask.success");
                this.collection.off("create.sendTask.error");
                this.collection.on("create.sendTask.success", $.proxy(this.onCreatTaskSuccess, this));
                this.collection.on("create.sendTask.error", $.proxy(this.onGetError, this));
                this.box = $('<div></div>')
                this.isFirst = false
            },

            showUpdateMsg: function() {
                var statusArray = ["", "更新中", "更新完成", "系统或数据异常，导致更新失败"];
                if (this.options.pageType == 1 || this.pageType == 2) {
                    var str = "<span>更新状态：" + statusArray[this.topoData.configUpdateProgress.job_status] + "</span><br>";
                    str += "<span>更新进度：" + this.topoData.configUpdateProgress.progressPercentage + "</span><br>";
                    str += "<span>更新信息：" + this.topoData.configUpdateProgress.message + "</span><br>";
                    str += "<span>耗时：" + this.topoData.configUpdateProgress.expendTime + "</span><br>";
                    $(str).appendTo(this.$el.find(".statusBox pre").find("code"));
                    var scrollHeight = this.$el.find(".statusBox code").prop("scrollHeight");
                    this.$el.find(".statusBox code").scrollTop(scrollHeight)
                } else {
                    var str = "<span>更新状态：" + statusArray[this.topoData.initProgress.job_status] + "</span><br>";
                    str += "<span>更新进度：" + this.topoData.initProgress.progressPercentage + "</span><br>";
                    str += "<span>有异构的域名：</span><br>"
                    var diffDomainArray = this.topoData.initProgress.diffDomains;
                    _.each(diffDomainArray, function(el) {
                        str += "<span>" + el + "</span><br>";
                    }.bind(this))
                    $(str).appendTo(this.$el.find(".statusBox pre").find("code"));
                    var scrollHeight = this.$el.find(".statusBox code").prop("scrollHeight");
                    this.$el.find(".statusBox code").scrollTop(scrollHeight)
                }
            },

            onGetUpdateSetupSuccess: function(res) {
                console.log(res)
                this.topoData = res;
                // this.topoData.configUpdateProgress.job_status=1
                if (!this.isFirst) {
                    if (this.options.pageType == 2)
                        this.domainList = this.topoData.basicinfo.domains || ['没有关联的域名'];
                    else if (this.options.pageType == 3)
                        this.topoList = this.topoData.basicinfo.topology;
                    this.initSetup();
                    if (this.options.pageType == 1 || this.options.pageType == 2) {
                        if (this.topoData.configUpdateProgress.job_status == 2)
                            this.showUpdateMsg();
                    } else {
                        if (this.topoData.initProgress.job_status == 2)
                            this.showUpdateMsg();
                    }
                    this.isFirst = true;
                } else {
                    this.showUpdateMsg();
                }
            },

            initSetup: function() {
                this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.update.html'])({
                    data: this.topoData,
                    pageType: this.options.pageType
                }));

                this.box.html(this.$el)
                this.$el.find("pre code").each(function(i, block) {
                    hljs.highlightBlock(block);
                });
                this.initDomainList();
                this.initTopoList();
                this.$el.find(".createSetup").on("click", $.proxy(this.onClickCreateSetupBtn, this))
                this.$el.find("#stopSetupSend").on("click", $.proxy(this.onClickStopSetupSendBtn, this))
                this.$el.find(".sendSetup").on("click", $.proxy(this.onClickSendSetupBtn, this))
                this.$el.find(".cancel").on("click", $.proxy(this.onClickCancelBtn, this))

                this.$el.find(".view-more").on("click", $.proxy(this.onClickViewMoreButton, this));
                this.$el.find(".view-less").on("click", $.proxy(this.onClickViewLessButton, this));
                this.$el.find('.view-less').hide();

                if (this.topoData.configDeliverySwitch) {
                    this.$el.find(".createSetup").attr("disabled", "disabled")
                    this.$el.find(".sendSetup").attr("disabled", "disabled")
                } else if ((this.options.pageType == 1 && !this.topoData.configDeliverySwitch) ||
                    (this.options.pageType == 2 && !this.topoData.configDeliverySwitch)) {
                    if (this.topoData.configUpdateProgress.job_status == 2)
                        this.$el.find(".sendSetup").removeAttr("disabled")
                    else
                        this.$el.find(".sendSetup").attr("disabled", "disabled")
                } else if (this.options.pageType == 3 && !this.topoData.configDeliverySwitch) {
                    if (this.topoData.initProgress.job_status == 2)
                        this.$el.find(".sendSetup").removeAttr("disabled")
                    else
                        this.$el.find(".sendSetup").attr("disabled", "disabled")
                }
            },

            startNodeInitSetupSuccess: function(res) {
                if (res && res.message) {
                    Utility.warning(res.message);
                    return;
                }
                this.topoData.initProgress.job_status = null;
                var showStatus = setInterval(function() {
                    if (this.topoData.initProgress.job_status == 1 || !this.topoData.initProgress.job_status) {
                        this.collection.getNodeProgress({
                            nodeId: this.model.get('id'),
                            platformId: this.nodePlatformId
                        })
                    }
                    if (this.topoData.initProgress.job_status == 2 || this.topoData.initProgress.job_status == 3) {
                        clearInterval(showStatus)
                        if (this.topoData.initProgress.job_status == 2)
                            this.$el.find(".sendSetup").removeAttr("disabled")
                    }
                }.bind(this), 500)
            },

            startCreateSetupSuccess: function(res) {
                if (res && res.message) {
                    Utility.warning(res.message);
                    return;
                }

                this.topoData.configUpdateProgress.job_status = null;
                var showStatus = setInterval(function() {
                    console.log(this.topoData.configUpdateProgress.job_status)
                    if (this.topoData.configUpdateProgress.job_status == 1 || !this.topoData.configUpdateProgress.job_status) {
                        if (this.options.pageType == 1)
                            this.collection.getProgress({
                                topologyId: this.model.get('id')
                            });
                        else
                            this.collection.getSpecialLayerProgress({
                                topologyId: this.model.get('id')
                            });
                    }
                    if (this.topoData.configUpdateProgress.job_status == 2 || this.topoData.configUpdateProgress.job_status == 3) {
                        clearInterval(showStatus)
                        if (this.topoData.configUpdateProgress.job_status == 2) {
                            this.$el.find(".sendSetup").removeAttr("disabled")
                        }
                    }
                }.bind(this), 500)
            },

            onClickSendSetupBtn: function() {
                if (!this.topoData.basicinfo.needToUpdateCfg) {
                    Utility.confirm("本次拓扑配置修改后无需对节点进行配置下发", function() {
                        this.collection.setdeliveryswitch({
                            "platformId": this.topoData.basicinfo.platformId,
                            "switch": true
                        })
                        this.options.onCancelCallback && this.options.onCancelCallback();
                    }.bind(this))
                } else {
                    this.showSelectStrategyPopup()
                }
            },

            showSelectStrategyPopup: function() {
                if (this.selectStrategyPopup) $("#" + this.selectStrategyPopup.modalId).remove();

                require(["setupSendWaitCustomize.stratety.view"], function(SelectStrategyView) {
                    this.model.set("topologyId", this.model.get("id"))
                    var mySelectStrategyView = new SelectStrategyView({
                        collection: this.collection,
                        model: this.model,
                        pageType: this.options.pageType,
                    });
                    var type = AUTH_OBJ.ApplySendMission ? 2 : 1;
                    var options = {
                        title: "生成下发任务",
                        body: mySelectStrategyView,
                        backdrop: 'static',
                        type: type,
                        onOKCallback: function() {
                            var obj = mySelectStrategyView.onSure()
                            if (obj) {
                                if (obj.strategyId == "myid")
                                    this.createTaskParam = {
                                        "jobId": this.topoData.basicinfo.jobId
                                    }
                                else
                                    this.createTaskParam = {
                                        "jobId": this.topoData.basicinfo.jobId,
                                        "deliveryStrategyId": obj.strategyId
                                    }
                                console.log(this.createTaskParam)
                                this.excuteCreatTask()
                            }
                        }.bind(this),
                        onHiddenCallback: function() {}.bind(this)
                    }
                    this.selectStrategyPopup = new Modal(options);
                }.bind(this))
            },

            excuteCreatTask: function() {
                this.collection.createSendTask(this.createTaskParam);
                this.selectStrategyPopup.$el.modal('hide')
                this.showDisablePopup("服务器正在努力处理中...")
            },

            onCreatTaskSuccess: function() {
                this.disablePopup && this.disablePopup.$el.modal('hide');
                setTimeout(function() {
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

            onClickStopSetupSendBtn: function(event) {
                var eventTarget = event.srcElement || event.target
                this.switchFlag = eventTarget.checked;
                var setArgs = {
                    platformId: this.topoData.basicinfo.platformId || this.nodePlatformId,
                    switch: eventTarget.checked
                }
                this.collection.setdeliveryswitch(setArgs)
                eventTarget.checked = !eventTarget.checked
            },

            setSwitchSuccess: function() {
                if (!this.switchFlag) {
                    this.$el.find(".createSetup").removeAttr("disabled")
                    this.$el.find("#stopSetupSend").removeAttr("checked")
                    if (this.options.pageType == 1 || this.options.pageType == 2) {
                        if (this.topoData.configUpdateProgress.job_status == 2)
                            this.$el.find('.sendSetup').removeAttr("disabled")
                    } else {
                        if (this.topoData.initProgress.job_status == 2)
                            this.$el.find('.sendSetup').removeAttr("disabled")
                    }
                } else {
                    this.$el.find(".createSetup").attr("disabled", "disabled")
                    this.$el.find(".sendSetup").attr("disabled", "disabled")
                    this.$el.find("#stopSetupSend").attr("checked", "true")
                    this.$el.find('#stopSetupSend').prop('checked', 'true')
                }
            },

            onClickCreateSetupBtn: function() {
                if (this.options.pageType == 1) {
                    // if (this.topoData.configUpdateProgress.job_status == 2) {
                    //     Utility.warning('已完成配置生成操作');
                    //     return;
                    // }
                    this.collection.startCreateSetup({
                        topologyId: this.model.get("id")
                    })
                } else if (this.options.pageType == 2) {
                    // if (this.topoData.configUpdateProgress.job_status == 2) {
                    //     Utility.warning('已完成配置生成操作');
                    //     return;
                    // }
                    this.collection.startSpecialLayerCreateSetup({
                        specialLayerStrategyId: this.model.get("id")
                    })
                } else if (this.options.pageType == 3) {
                    // if (this.topoData.initProgress.job_status == 2) {
                    //     Utility.warning('已完成配置操作')
                    //     return;
                    // }
                    this.collection.startNodeInitSetup({
                        nodeId: this.model.get("id"),
                        platformId: this.nodePlatformId
                    })
                }
            },

            onClickCancelBtn: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            initDomainList: function() {
                var nodeTpl = '';
                _.each(this.domainList, function(el) {
                    nodeTpl = '<li class="node-item">' +
                        '<span class="label label-primary" id="' + Utility.randomStr(8) + '">' + el + '</span>' +
                        '</li>';
                    $(nodeTpl).appendTo(this.$el.find(".node-ctn"))
                }.bind(this))
            },

            initTopoList: function() {
                var nodeTpl = '';
                _.each(this.topoList, function(el) {
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
                    Utility.alerts(error.message)
                else
                    Utility.alerts("网络阻塞，请刷新重试！")
            },

            render: function(target) {
                this.box.appendTo(target);
            }
        });

        return UpdateTopoView;
    });