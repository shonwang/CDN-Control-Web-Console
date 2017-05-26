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
                this.$el.find(".save-ctn").remove();
                this.$el.find("hr").remove();
            },

            setHostValue: function(value) {
                var setupHost = this.$el.find(".host #setupHost");
                setupHost.val(value);
            },

            getDetectionInfo: function() {
                var reg = /^\//g;
                if (reg.test(this.$el.find(".way #detectionFile").val()) == false && this.defaultParam.flag === 1) {
                    alert('探测文件需以"/"开头');
                    return false;
                }
                if (this.$el.find(".host #setupHost").val() == "" && this.defaultParam.flag === 1) {
                    alert('请求HOST头不能为空');
                    return false;
                }

                var detectionFile = this.$el.find(".way #detectionFile");
                var setupHost = this.$el.find(".host #setupHost");
                var responseState = this.$el.find(".state #responseState");
                var detectionFrequency = this.$el.find(".frequency #detectionFrequency");
                var postParam = {};
                postParam.host = setupHost.val();
                postParam.detectUrl = detectionFile.val();
                postParam.expectedResponse = responseState.val();
                postParam.frequency = parseInt(detectionFrequency.val());
                postParam.detectMethod = this.defaultParam.detectMethod;
                postParam.flag = this.defaultParam.flag;
                if (postParam.flag === 1) postParam.flagName = '<span class="text-success">开启</span>';
                if (postParam.flag === 0) postParam.flagName = '<span class="text-danger">关闭</span>';

                return postParam;
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
                    "backHost": this.userInfo.domain,
                    "pushType": 1,
                    "pushArgsFlag": 0,
                    "pushArgs": null,
                    "connectArgsFlag": 0,
                    "connectArgs": null,
                    "reconnectArgsFlag": 0,
                    "reconnectArgs": null,
                    "detectConfig": {
                        "flag": 1,
                        "detectMethod": null,
                        "expectedResponse": null,
                        "detectUrl": "/check",
                        "frequency": null,
                        "host": this.userInfo.domain
                    }
                };

                if (this.isEdit) {
                    if (this.model.get("openFlag") !== null && this.model.get("openFlag") !== undefined)
                        this.defaultParam.openFlag = this.model.get("openFlag");
                    if (this.model.get("sourceType") !== null && this.model.get("sourceType") !== undefined)
                        this.defaultParam.sourceType = this.model.get("sourceType");
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
                    if (this.defaultParam.originAddr.indexOf(",") > -1 && this.defaultParam.originType === 1) {
                        this.defaultParam.originAddr = this.defaultParam.originAddr.split(",").join("\n");
                    }
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

                if (this.defaultParam.sourceType === 2) {
                    this.defaultParam.originAddress = "上层节点"
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

                    this.$el.find("#textarea-origin-type").on("blur", $.proxy(this.onBlurOriginTypeTextarea, this));
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
                this.$el.find("#input-push-address").on("blur", $.proxy(this.onBlurPushAddressInput, this));
            },

            onBlurPushAddressInput: function() {
                var re = /^[0-9a-z]+$/,
                    value = this.$el.find("#input-push-address").val();
                if (value === "") return false;
                if (!re.test(value) || value.length > 32) {
                    alert("频道设置的字符长度最大为：32位，支持字符：字母，数字；不支持大写，下划线；不支持转义字符和urlencode会处理的特殊字符，如:！ # $ % & ‘ （ ）* + , . / : ; = ? @ [ / ]");
                    return false
                }
                return true;
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
                var eventTarget = event.srcElement || event.target,
                    inputElment = $(eventTarget).parents(".col-sm-2").siblings(".col-sm-6").children();
                if (eventTarget.checked) {
                    inputElment.show();
                    inputElment.focus();
                } else {
                    inputElment.hide();
                }
                this.defaultParam[eventTarget.id] = eventTarget.checked ? 1 : 0
            },

            onEditInput: function(event) {
                var eventTarget = event.srcElement || event.target;
                $(eventTarget).parent(".col-sm-2").siblings(".col-sm-6").children().removeAttr("readonly");
                $(eventTarget).hide();
                $(eventTarget).siblings(".btn").show();
            },

            onLockInput: function(event) {
                var eventTarget = event.srcElement || event.target,
                    inputElment = $(eventTarget).parent(".col-sm-2").siblings(".col-sm-6").children(),
                    result = false;
                if (inputElment.get(0).id === "input-origin-host") {
                    result = this.checkBaseOrigin(inputElment.val(), 100);
                } else {
                    result = this.checkBaseOrigin(inputElment.val(), 3);
                }
                if (result) {
                    inputElment.attr("readonly", "true");
                    $(eventTarget).hide();
                    $(eventTarget).siblings(".btn").show();
                    if (inputElment.get(0).id === "input-origin-host") {
                        this.myLiveUpBackOriginDetectionView.setHostValue(inputElment.val())
                    }
                }
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

                    var ipArray = originAddress.split("\n");
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
                } else if (originType == 100) {
                    if (!originAddress) {
                        //不能为空
                        alert("回源host不能为空");
                        return false;
                    }
                    //域名校验
                    var result = Utility.isDomain(originAddress);
                    var isIPStr = Utility.isIP(originAddress);
                    if (result && !isIPStr && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-") {
                        return true;
                    } else {
                        alert("回源host填写错误");
                        return false;
                    }
                }
                return true;
            },

            onSure: function() {
                var postParam = {
                    "openFlag": this.defaultParam.openFlag, //源站配置 0:关 1:开
                    "sourceType": this.defaultParam.sourceType, //1:用户源站 2:上层节点 3：视频云源站
                    "sourceName": this.$el.find("#input-name").val().trim(),
                    "originType": this.defaultParam.originType, //1:ip 2:域名 3:视频云源站
                    "originAddr": this.$el.find("#textarea-origin-type").val().trim(),
                    "pushPort": this.$el.find("#input-port").val().trim(),
                    "pushAppFlag": this.defaultParam.pushAppFlag, //转推地址频道名称 0:关 1:开启
                    "pushAppName": this.$el.find("#input-push-address").val().trim(),
                    "pushType": this.defaultParam.pushType,
                    "pushArgsFlag": this.defaultParam.pushArgsFlag,
                    "pushArgs": this.$el.find("#input-push-args").val().trim(),
                    "connectArgsFlag": this.defaultParam.connectArgsFlag,
                    "connectArgs": this.$el.find("#input-push-connect").val().trim(),
                    "reconnectArgsFlag": this.defaultParam.reconnectArgsFlag,
                    "reconnectArgs": this.$el.find("#input-push-reconnect").val().trim(),
                    "detectConfig": ""
                };
                if (postParam.sourceName === "") {
                    alert("请输入名称！");
                    return false;
                }
                var isCorrectBackHost,
                    isCorrectOriginAddr = this.checkBaseOrigin(postParam.originAddr, postParam.originType);
                if (!isCorrectOriginAddr) return false;
                if (this.isEdit) {
                    postParam.backHost = this.$el.find("#input-origin-host").val().trim();
                    isCorrectBackHost = this.checkBaseOrigin(postParam.backHost, 100);
                    if (!isCorrectBackHost) return false;
                    postParam.id = this.model.get("id");
                } else {
                    postParam.backHost = this.defaultParam.backHost;
                    postParam.id = new Date().valueOf();
                }
                if (postParam.pushPort === "") {
                    alert("请输入正确的端口号");
                    return false;
                }
                if (postParam.pushAppFlag === 1 && !this.onBlurPushAddressInput()) {
                    alert("既然开启了转推地址频道, 就请输入正确的转推地址频道！");
                    return false;
                }
                if (postParam.pushArgsFlag === 1 && postParam.pushArgs === "") {
                    alert("既然开启了转推参数, 就请输入正确的转推参数！");
                    return false;
                }
                if (postParam.connectArgsFlag === 1 && postParam.connectArgs === "") {
                    alert("既然开启了增加connect阶段参数, 就请输入正确的增加connect阶段参数！");
                    return false;
                }
                if (postParam.reconnectArgsFlag === 1 && postParam.reconnectArgs === "") {
                    alert("既然开启了转推重连参数, 就请输入正确的转推重连参数！");
                    return false;
                }
                if (postParam.originAddr.indexOf("\n") > -1 && postParam.originType === 1) {
                    postParam.originAddr = postParam.originAddr.split("\n").join(",");
                }

                var detectInfo = this.myLiveUpBackOriginDetectionView.getDetectionInfo();
                if (!detectInfo)
                    return false;
                else
                    postParam.detectConfig = detectInfo;

                return postParam
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return AddEditItemView
    });