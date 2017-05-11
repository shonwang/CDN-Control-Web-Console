define("liveUpBackOriginSetup.edit.view", ['require', 'exports', 'template', 'backOriginDetection.view', 'utility'],
    function(require, exports, template, BackOriginDetectionView, Utility) {

        var LiveUpBackOriginDetectionView = BackOriginDetectionView.extend({
            events: {},

            initialize: function(options) {
                this.collection = options.collection;
                this.options = options;
                this.$el = $(_.template(template['tpl/customerSetup/domainList/backOriginDetection/backOriginDetection.html'])());

                this.$el.find(".setup .backOriginSetupType").bootstrapSwitch('state', true);
                this.$el.find("h4").remove();
                this.$el.find(".well").removeClass("well");
                this.$el.removeClass("animated");
                this.$el.find(".save").parent(".form-group").remove();
                this.$el.find("hr").remove();
            },

            onClickSaveBtn: function() {
                var reg = /^\//g;
                if (reg.test(this.$el.find(".way #detectionFile").val()) == false) {
                    alert('探测文件需以"/"开头');
                    return;
                }
                if (this.$el.find(".host #setupHost").val() == "") {
                    alert('请求HOST头不能为空');
                    return;
                }

                var detectionFile = this.$el.find(".way #detectionFile");
                var setupHost = this.$el.find(".host #setupHost");
                var responseState = this.$el.find(".state #responseState");
                var detectionFrequency = this.$el.find(".frequency #detectionFrequency");

                this.defaultParam.host = setupHost.val();
                this.defaultParam.detectUrl = detectionFile.val();
                this.defaultParam.expectedResponse = responseState.val();
                this.defaultParam.frequency = parseInt(detectionFrequency.val());

                //this.collection.addDetectInfo(this.defaultParam);
            },
        });

        var AddEditItemView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.isEdit = options.isEdit;
                this.model = options.model;
                this.userInfo = options.userInfo;
                this.defaultParam = {
                    "openFlag": 0, //源站配置 0:关 1:开
                    "sourceType": 1, //1:用户源站 2:上层节点 3：视频云源站
                    "sourceName": "",
                    "originType": 1, //1:ip 2:域名 3:视频云源站
                    "originAddr": null,
                    "pushPort": 1935,
                    "pushAppFlag": 0, //转推地址频道名称 0:关 1:开启
                    "pushAppName": null,
                    "backHost": null,
                    "pushType": null,
                    "pushArgsFlag": 0,
                    "pushArgs": null,
                    "connectArgsFlag": 0,
                    "connectArgs": null,
                    "reconnectArgsFlag": 0,
                    "reconnectArgs": null,
                    "detectConfig": {
                        "flag": 0,
                        "detectMethod": null,
                        "expectedResponse": null,
                        "detectUrl": null,
                        "frequency": null,
                        "host": null
                    }
                };

                if (this.isEdit) {
                    if (this.model.get("originType") !== null && this.model.get("originType") !== undefined)
                        this.defaultParam.originType = this.model.get("originType");
                    if (this.model.get("pushPort") !== null && this.model.get("pushPort") !== undefined)
                        this.defaultParam.pushPort = this.model.get("pushPort");
                    if (this.model.get("pushAppFlag") !== null && this.model.get("pushAppFlag") !== undefined)
                        this.defaultParam.pushAppFlag = this.model.get("pushAppFlag");
                    if (this.model.get("pushType") !== null && this.model.get("pushType") !== undefined)
                        this.defaultParam.pushType = this.model.get("pushType");
                    if (this.model.get("pushArgsFlag") !== null && this.model.get("pushArgsFlag") !== undefined)
                        this.defaultParam.pushArgsFlag = this.model.get("pushArgsFlag");
                    if (this.model.get("connectArgsFlag") !== null && this.model.get("connectArgsFlag") !== undefined)
                        this.defaultParam.connectArgsFlag = this.model.get("connectArgsFlag");
                    if (this.model.get("reconnectArgsFlag") !== null && this.model.get("reconnectArgsFlag") !== undefined)
                        this.defaultParam.reconnectArgsFlag = this.model.get("reconnectArgsFlag");

                    this.defaultParam.sourceName = this.model.get("sourceName") || "";
                    this.defaultParam.originAddr = this.model.get("originAddr") || "";
                    this.defaultParam.pushAppName = this.model.get("pushAppName") || "";
                    this.defaultParam.backHost = this.model.get("backHost") || "";
                    this.defaultParam.pushArgs = this.model.get("pushArgs") || "";
                    this.defaultParam.connectArgs = this.model.get("connectArgs") || "";
                    this.defaultParam.reconnectArgs = this.model.get("reconnectArgs") || "";
                    var detectConfigObj = this.model.get("detectConfig");
                    if (detectConfigObj) {
                        this.defaultParam.detectConfig = _.extend({}, detectConfigObj)
                    }
                }

                this.$el = $(_.template(template['tpl/customerSetup/domainList/liveUpBackOriginSetup/liveUpBackOriginSetup.add.html'])({
                    data: this.defaultParam
                }));
                this.initSetup();
                this.myLiveUpBackOriginDetectionView = new LiveUpBackOriginDetectionView(options);
                this.myLiveUpBackOriginDetectionView.render(this.$el.find(".origin-detection-ctn"));
                this.myLiveUpBackOriginDetectionView.getDetecInfoSuccess(this.defaultParam.detectConfig);
            },

            initSetup: function() {
                var baseArray = [{
                        name: "IP源站",
                        value: 1
                    }, {
                        name: "域名源站",
                        value: 2
                    }],
                    rootNode = this.$el.find(".origin-type");

                if (!this.isEdit) {
                    this.$el.find(".origin-host").hide();
                } else {
                    baseArray.push({
                        name: "视频云回源",
                        value: 3
                    });
                    this.$el.find(".origin-host .edit").on("click", $.proxy(this.onEditInput, this));
                    this.$el.find(".origin-host .lock").on("click", $.proxy(this.onLockInput, this));
                }

                Utility.initDropMenu(rootNode, baseArray, function(value) {
                    this.defaultParam.originType = parseInt(value);
                    this.showOriginAddressAlert();
                }.bind(this));

                var defaultValue = _.find(baseArray, function(object) {
                    return object.value === this.defaultParam.originType;
                }.bind(this));

                if (defaultValue)
                    this.$el.find("#dropdown-origin-type .cur-value").html(defaultValue.name);
                else
                    this.$el.find("#dropdown-origin-type .cur-value").html(baseArray[0].name);

                if (this.defaultParam.originType === 3 || this.defaultParam.sourceType === 3) {
                    this.$el.find(".push-type").hide();
                    this.$el.find(".origin-type .btn-ctn").show();
                    this.$el.find("#textarea-origin-type").attr("readonly", "true");
                    this.$el.find("#dropdown-origin-type").attr("disabled", "disabled");
                    this.$el.find(".origin-type .edit").on("click", $.proxy(this.onEditInput, this));
                    this.$el.find(".origin-type .lock").on("click", $.proxy(this.onLockInput, this));
                } else {
                    this.showOriginAddressAlert();
                    var pushTypeArray = [{
                            name: "边缘转推",
                            value: 1
                        }, {
                            name: "上层转推",
                            value: 2
                        }],
                        rootNode = this.$el.find(".push-type");

                    Utility.initDropMenu(rootNode, pushTypeArray, function(value) {
                        this.defaultParam.pushType = parseInt(value)
                    }.bind(this));

                    var defaultValue = _.find(pushTypeArray, function(object) {
                        return object.value === this.defaultParam.pushType;
                    }.bind(this));

                    if (defaultValue)
                        this.$el.find("#dropdown-push-type .cur-value").html(defaultValue.name);
                    else
                        this.$el.find("#dropdown-push-type .cur-value").html(pushTypeArray[0].name);

                    this.$el.find("#textarea-origin-type").on("blur", $.proxy(this.onBlurOriginTypeTextarea, this))
                }
                var toggleInputs = this.$el.find(".togglebutton input");
                _.each(toggleInputs, function(el) {
                    el.checked = this.defaultParam[el.id] === 1 ? true : false
                    if (el.checked)
                        $(el).parents(".col-sm-2").siblings(".col-sm-6").children().show();
                    else
                        $(el).parents(".col-sm-2").siblings(".col-sm-6").children().hide();
                }.bind(this))
                this.$el.find(".togglebutton input").on("click", $.proxy(this.onClickItemToggle, this));
            },

            showOriginAddressAlert: function() {
                if (this.defaultParam.originType === 1) {
                    this.$el.find(".ip-alert").show();
                    this.$el.find(".domain-alert").hide();
                } else if (this.defaultParam.originType === 2) {
                    this.$el.find(".ip-alert").hide();
                    this.$el.find(".domain-alert").show();
                }
            },

            onBlurOriginTypeTextarea: function(event) {
                var originAddress = this.$el.find("#textarea-origin-type").val().trim(),
                    result = this.checkBaseOrigin(originAddress, this.defaultParam.originType);
            },

            onClickItemToggle: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.checked)
                    $(eventTarget).parents(".col-sm-2").siblings(".col-sm-6").children().show();
                else
                    $(eventTarget).parents(".col-sm-2").siblings(".col-sm-6").children().hide();
                this.defaultParam[eventTarget.id] = eventTarget.checked ? 1 : 0
            },

            onEditInput: function(event) {
                var eventTarget = event.srcElement || event.target;
                $(eventTarget).parent(".col-sm-2").siblings(".col-sm-6").children().removeAttr("readonly");
                $(eventTarget).hide();
                $(eventTarget).siblings(".btn").show();
            },

            onLockInput: function(event) {
                var eventTarget = event.srcElement || event.target;
                $(eventTarget).parent(".col-sm-2").siblings(".col-sm-6").children().attr("readonly", "true");
                $(eventTarget).hide();
                $(eventTarget).siblings(".btn").show();
            },

            checkBaseOrigin: function(value, type) {
                var originAddress = value;
                var originType = type;
                var domainName = this.userInfo.domain;
                if (originType == 1) {
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        alert("IP不能为空");
                        return false;
                    }

                    var ipArray = originAddress.split(",");
                    if (ipArray.length > 10) {
                        alert("你的IP数是否超过了10个。");
                        return false;
                    }
                    for (var i = 0; i < ipArray.length; i++) {
                        result = Utility.isIP(ipArray[i].trim());
                        if (!result) {
                            alert("你的IP填写有误,请检查");
                            return false;
                        }
                    }
                } else if (originType == 2) {
                    //验证域名
                    if (!originAddress) {
                        //不能为空
                        alert("域名不能为空");
                        return false;
                    }
                    if (domainName == originAddress) {
                        //域名不能与填写的域名相同
                        alert("源站地址不能与加速域名相同");
                        return false;
                    }
                    //域名校验
                    var result = Utility.isDomain(originAddress);
                    var isIPStr = Utility.isIP(originAddress);
                    if (result && !isIPStr && originAddress !== domainName && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-") {
                        return true;
                    } else {
                        alert("域名填写错误");
                        return false;
                    }
                } else if (originType == 3) {
                    //验证KS3域名，此情况只能填一个
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        alert("域名不能为空");
                        return false;
                    }
                    if (domainName == originAddress) {
                        //域名不能与填写的域名相同
                        alert("源站地址不能与加速域名相同");
                        return false;
                    }
                    //域名校验
                    var result = Utility.isDomain(originAddress);
                    var isIPStr = Utility.isIP(originAddress);
                    if (result && !isIPStr && originAddress !== domainName && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-") {
                        return true;
                    } else {
                        alert("域名填写错误");
                        return false;
                    }
                }
                return true;
            },

            onSure: function() {
                var matchConditionParam = this.matchConditionView.getMatchConditionParam(),
                    hasOriginPolicy, expireTime, summary,
                    cacheTimeType = parseInt(this.$el.find("[name='cacheTimeRadios']:checked").val());

                if (!matchConditionParam) return false;

                if (cacheTimeType === 1) {
                    expireTime = 0,
                        hasOriginPolicy = 0
                    summary = "缓存时间：不缓存";
                } else if (cacheTimeType === 2) {
                    hasOriginPolicy = 0
                    expireTime = this.defaultParam.cacheTime,
                        summary = "缓存时间：" + Utility.timeFormat2(expireTime);
                    //summary = "缓存时间：" + expireTime + "秒";
                } else if (cacheTimeType === 3) {
                    expireTime = this.defaultParam.cacheOriginTime,
                        hasOriginPolicy = 1
                    summary = "使用源站缓存, 若源站无缓存时间，则缓存：" + Utility.timeFormat2(expireTime);
                    //summary = "使用源站缓存, 若源站无缓存时间，则缓存：" + expireTime + "秒";
                }

                var postParam = {
                    "id": this.isEdit ? this.model.get("id") : new Date().valueOf(),
                    "type": matchConditionParam.type,
                    "typeName": matchConditionParam.typeName,
                    "policy": matchConditionParam.policy,
                    "expireTime": expireTime,
                    "hasOriginPolicy": hasOriginPolicy,
                    "summary": summary
                }
                return postParam
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return AddEditItemView
    });