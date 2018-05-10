define("setupSendingSwitch.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

  var SetupSendingSwitchView = Backbone.View.extend({
    events: {},

    initialize: function(options) {
      this.options = options
      this.collection = options.collection;

      this.collection.on("check.haveTask.success", $.proxy(this.onCheckTaskSuccess, this))
      this.collection.on("check.haveTask.error", $.proxy(this.onGetError, this))
      this.collection.on("get.trigger.success", $.proxy(this.onGetTriggerStatus, this))
      this.collection.on("get.trigger.error", $.proxy(this.onGetError, this))
      this.collection.getTriggerStatus({"platformId": 202});
      this.collection.getTriggerStatus({"platformId": 203});
      this.initSetup();
    },

    onGetTriggerStatus: function(res){
      //{"platformId":202,"autoSwitch":开启：true 关闭：false,"manualSwitch":开启：true 关闭：false}
      if (res && res.platformId == 202) {
        this.$el.find("#openapiSwitch").get(0).checked = res.autoSwitch;
        this.$el.find("#centralControlSwitch").get(0).checked = res.manualSwitch;
      } else if (res && res.platformId == 203) {
        this.$el.find("#live-openapiSwitch").get(0).checked = res.autoSwitch;
        this.$el.find("#live-centralControlSwitch").get(0).checked = res.manualSwitch;
      }
    },

    initSetup: function() {
      this.$el = $(_.template(template['tpl/setupSendManage/setupSendingSwitch/setupSendingSwitch.html'])());
      this.$el.find("#openapiSwitch").on("click", $.proxy(this.onClickSwitchBtn, this))
      this.$el.find("#centralControlSwitch").on("click", $.proxy(this.onClickSwitchBtn, this))
      this.$el.find("#live-openapiSwitch").on("click", $.proxy(this.onClickSwitchBtn, this))
      this.$el.find("#live-centralControlSwitch").on("click", $.proxy(this.onClickSwitchBtn, this))
    },

    onClickSwitchBtn: function(event) {
      this.eventTarget = event.srcElement || event.target
      if (!this.eventTarget.checked) {
        Utility.confirm("关闭下发开关，将无法进行配置下发操作，请确认是否执行该操作", function() {
          require(['setupTopoManage.model'], function(SetupTopoManageModel) {
            var mySetupTopoManageModel = new SetupTopoManageModel(), querys;
            mySetupTopoManageModel.on("set.deliveryswitch.success", $.proxy(this.setSwitchSuccess, this));
            mySetupTopoManageModel.on("set.deliveryswitch.error", $.proxy(this.onGetError, this));
            if (this.eventTarget.id == "openapiSwitch") {
              querys = {
                "platformId": "202",
                "switch": false,
                "type": "auto"
              }
              mySetupTopoManageModel.setdeliveryswitch(querys)
            } else if (this.eventTarget.id == "centralControlSwitch") {
              querys = {
                "platformId": "202",
                "switch": false,
                "type": "manual"
              }
              mySetupTopoManageModel.setdeliveryswitch(querys)
            } else if (this.eventTarget.id == "live-openapiSwitch") {
              querys = {
                "platformId": "203",
                "switch": false,
                "type": "auto"
              }
              mySetupTopoManageModel.setdeliveryswitch(querys)
            } else if (this.eventTarget.id == "live-centralControlSwitch") {
              querys = {
                "platformId": "203",
                "switch": false,
                "type": "manual"
              }
              mySetupTopoManageModel.setdeliveryswitch(querys)
            }
          }.bind(this))
        }.bind(this))
        this.eventTarget.checked = true
      } else {
        if (this.eventTarget.id == "openapiSwitch" || this.eventTarget.id == "centralControlSwitch") {
          this.collection.checkIsHaveInitTask({
            "platformId": "202"
          })
        } else if (this.eventTarget.id == "live-openapiSwitch" || this.eventTarget.id == "live-centralControlSwitch") {
          this.collection.checkIsHaveInitTask({
            "platformId": "203"
          })
        }
        this.eventTarget.checked = false
      }
    },

    onCheckTaskSuccess: function(res) {
      Utility.confirm(res.length == 0 ? "是否确定开启下发开关？" : "正在进行配置初始化操作，是否开启下发开关？", function() {
        require(['setupTopoManage.model'], function(SetupTopoManageModel) {
          var mySetupTopoManageModel = new SetupTopoManageModel(), querys;
          mySetupTopoManageModel.on("set.deliveryswitch.success", $.proxy(this.setSwitchSuccess, this));
          mySetupTopoManageModel.on("set.deliveryswitch.error", $.proxy(this.onGetError, this));
          if (this.eventTarget.id == "openapiSwitch") {
            querys = {
              "platformId": "202",
              "switch": true,
              "type": "auto"
            }
            mySetupTopoManageModel.setdeliveryswitch(querys)
          } else if (this.eventTarget.id == "centralControlSwitch") {
            querys = {
              "platformId": "202",
              "switch": true,
              "type": "manual"
            }
            mySetupTopoManageModel.setdeliveryswitch(querys)
          } else if (this.eventTarget.id == "live-openapiSwitch") {
            querys = {
              "platformId": "203",
              "switch": true,
              "type": "auto"
            }
            mySetupTopoManageModel.setdeliveryswitch(querys)
          } else if (this.eventTarget.id == "live-centralControlSwitch") {
            querys = {
              "platformId": "203",
              "switch": true,
              "type": "manual"
            }
            mySetupTopoManageModel.setdeliveryswitch(querys)
          }
        }.bind(this))
      }.bind(this))
    },

    setSwitchSuccess: function() {
      this.eventTarget.checked = !this.eventTarget.checked
      setTimeout(function() {
        Utility.alerts("操作成功！", "success", 5000);
      }.bind(this), 500)
    },

    onGetError: function(error) {
      if (error && error.message)
        Utility.alerts(error.message)
      else
        Utility.alerts("网络阻塞，请刷新重试！")
    },

    hide: function() {
      this.$el.hide();
      $(document).off('keydown');
    },

    update: function(target) {
      this.collection.off();
      this.collection.reset();
      this.$el.remove();
      this.initialize(this.options);
      this.render(target);
    },

    render: function(target) {
      this.$el.appendTo(target);
      this.target = target;
    }
  });

  return SetupSendingSwitchView;
});