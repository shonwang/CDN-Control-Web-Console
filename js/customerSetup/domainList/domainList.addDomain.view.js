define("domainList.addDomain.view", ['require', 'exports', 'template', 'utility', "modal.view"],
    function(require, exports, template, Utility, Modal) {

        var AddDownloadView = Backbone.View.extend({
            initialize: function(options) {
                this.parent = options.obj;
                this.args = {
                    DomainName: this.parent.args.DomainName || '',
                    OriginType: null, //源站类型
                    CdnProtocol: null, //访问协议
                    OriginProtocol: null, //回源方式
                    Origin: null, //源站类型选选择后输入的ipList或urlList
                    OriginPort: 80
                };
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/customerSetup/domainList/domainList.addDomain.download.html'])({}));
                this.$el.find("input[name=radio-protocol]").on("click", $.proxy(this.onRadioProtocolChange, this))
                this.$el.find("input[name=radio-origin]").on("click", $.proxy(this.onRadioOriginChange, this));
                this.$el.find("#cdn-originIP").on("focus", $.proxy(this.hideOriginTips, this));
                this.$el.find("#cdn-originAddress").on("focus", $.proxy(this.hideOriginTips, this));
                this.$el.find("#cdn-KS3Address").on("focus", $.proxy(this.hideOriginTips, this));
                this.setDropdownMenu();
            },

            onRadioProtocolChange: function() {
                this.$el.find("#cdn-cdnProtocol-error").hide();
            },

            onRadioOriginChange: function() {
                this.$el.find("#cdn-originProtocol-error").hide();
            },

            checkArgs: function() {
                this.args.DomainName = this.parent.args.DomainName;
                this.args.CdnProtocol = this.$el.find("input[name=radio-protocol]:checked").val() || null;
                this.args.OriginProtocol = this.$el.find("input[name=radio-origin]:checked").val() || null;
                if (!this.checkProtocol()) {
                    return false;
                }
                if (!this.checkOrignTypeAndContent()) {
                    return false;
                }
                return this.args;
            },

            checkProtocol: function() {
                //访问协议
                if (!this.args.CdnProtocol) {
                    this.$el.find("#cdn-cdnProtocol-error").show();
                    return false;
                }
                //回源方式
                if (!this.args.OriginProtocol) {
                    this.$el.find("#cdn-originProtocol-error").show();
                    return false;
                }
                return true;
            },

            checkOrignTypeAndContent: function() {
                //源站类型未选的提示
                if (!this.args.OriginType || this.args.OriginType == 1) {
                    this.$el.find("#cdn-originType-error").show();
                    return false;
                }
                var _val = "";
                if (this.args.OriginType == "ipaddr") {
                    _val = this.$el.find("#cdn-originIP").val().replace(/\;+$/, '');
                } else if (this.args.OriginType == "domain") {
                    _val = this.$el.find("#cdn-originAddress").val().trim();

                } else if (this.args.OriginType == "KS3") {
                    _val = this.$el.find("#cdn-KS3Address").val().trim();
                }

                this.args.Origin = _val;

                var result = this.checkOrigin();
                if (!result) {
                    return false;
                }

                return true;
            },

            hideOriginTips: function() {
                this.$el.find("#cdn-originIP-error").hide();
                this.$el.find("#cdn-originAddress-error").hide();
                this.$el.find("#cdn-KS3Address-error").hide();
            },

            checkOrigin: function() {
                var originAddress = this.args.Origin;
                var originType = this.args.OriginType;
                var domainName = this.args.DomainName;
                if (originType == "ipaddr") {
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        this.$el.find("#cdn-originIP-error").html("IP不能为空").show();
                        return false;
                    }

                    var ipArray = originAddress.split(",");
                    if (ipArray.length > 1) {
                        this.$el.find("#cdn-originIP-error").html("你的IP数是否超过了10个。").show();
                        return false;
                    }
                    for (var i = 0; i < ipArray.length; i++) {
                        result = Utility.isIP(ipArray[i]);
                        if (!result) {
                            this.$el.find("#cdn-originIP-error").html("你的IP填写有误,请检查").show();
                            return false;
                        }
                    }

                } else if (originType == "domain") {
                    //验证域名
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        this.$el.find("#cdn-originAddress-error").html("域名不能为空").show();
                        return false;
                    }
                    if (domainName == originAddress) {
                        //域名不能与填写的域名相同
                        this.$el.find("#cdn-originAddress-error").html("源站地址不能与加速域名相同").show();
                        return false;
                    }
                    //域名校验
                    var result = Utility.isDomain(originAddress);
                    var isIPStr = Utility.isIP(originAddress);
                    if (result && !isIPStr && originAddress !== domainName && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-") {
                        return true;
                    } else {
                        this.$el.find("#cdn-originAddress-error").html("域名填写错误").show();
                        return false;
                    }

                    return true;

                } else if (originType == "KS3") {
                    //验证KS3域名，此情况只能填一个
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        this.$el.find("#cdn-KS3Address-error").html("域名不能为空").show();
                        return false;
                    }
                    if (domainName == originAddress) {
                        //域名不能与填写的域名相同
                        this.$el.find("#cdn-originAddress-error").html("源站地址不能与加速域名相同").show();
                        return false;
                    }
                    //域名校验
                    var result = Utility.isDomain(originAddress);
                    var isIPStr = Utility.isIP(originAddress);
                    if (result && !isIPStr && originAddress !== domainName && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-") {
                        return true;
                    } else {
                        this.$el.find("#cdn-KS3Address-error").html("域名填写错误").show();
                        return false;
                    }

                    return true;
                }
                return true;
            },

            setDropdownMenu: function() {
                var ctn = this.$el.find("#dropdown-menu-origin-type");
                var dateArray = [{
                    name: "请选择",
                    value: "1"
                }, {
                    name: "IP源站",
                    value: "ipaddr"
                }, {
                    name: "域名源站",
                    value: "domain"
                }, {
                    name: "KS3域名",
                    value: "KS3"
                }];
                this.initDropMenu(ctn, dateArray, function(obj) {
                    if (obj.value != 1) {
                        this.$el.find("#cdn-originType-error").hide();
                    }
                    this.$el.find(".cdn-download-live-port").hide();
                    this.args.OriginType = obj.value;
                    this.setShowOriginList();
                }.bind(this));
            },

            initDropMenu: function(rootNode, typeArray, callback) {
                var dropRoot = rootNode.find(".ks-dropdown-menu"),
                    showNode = rootNode.find(".cur-caret");
                dropRoot.html("");
                _.each(typeArray, function(element, index, list) {
                    var itemTpl = '<li data-value="' + element.value + '" data-name="' + element.name + '">' +
                        '<a data-value="' + element.value + '" data-name="' + element.name + '" href="javascript:void(0);">' + element.name + '</a>' +
                        '</li>',
                        itemNode = $(itemTpl);
                    itemNode.on("click", function(event) {
                        var eventTarget = event.srcElement || event.target;
                        showNode.html($(eventTarget).attr("data-name"));
                        var value = $(eventTarget).attr("data-value");
                        var obj = {
                            value: value
                        };
                        callback && callback(obj);
                    });
                    itemNode.appendTo(dropRoot);
                });
            },

            setShowOriginList: function() {
                //通过OriginType和type来显示不同选项
                var originType = this.args.OriginType;
                if (!originType || originType == 1) {
                    this.$el.find(".cdn-originType-list-ctn").hide();
                    return false;
                }

                if (originType == "ipaddr") {
                    this.$el.find(".cdn-originAddress").hide();
                    this.$el.find(".cdn-originKS3").hide();
                    this.$el.find(".cdn-originIP").show();
                } else if (originType == "domain") {
                    this.$el.find(".cdn-originIP").hide();
                    this.$el.find(".cdn-originKS3").hide();
                    this.$el.find(".cdn-originAddress").show();

                } else if (originType == "KS3") {
                    this.$el.find(".cdn-originIP").hide();
                    this.$el.find(".cdn-originAddress").hide();
                    this.$el.find(".cdn-originKS3").show();
                }

                if (originType == "ipaddr" || originType == "domain") {
                    this.$el.find(".cdn-download-live-port").show();
                } else {
                    this.$el.find(".cdn-download-live-port").hide();
                }

            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        var AddLiveView = Backbone.View.extend({
            initialize: function(options) {
                this.parent = options.obj;
                this.args = {
                    DomainName: this.parent.args.DomainName || '',
                    OriginType: null, //源站类型
                    CdnProtocol: null, //访问协议
                    OriginProtocol: null, //回源方式
                    Origin: null, //源站类型选选择后输入的ipList或urlList
                    OriginPort: "1935" //端口
                };
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/customerSetup/domainList/domainList.addDomain.live.html'])({}));

                this.$el.find("input[name=radio-live-protocol]").on("click", $.proxy(this.onRadioProtocolChange, this))
                this.$el.find("input[name=radio-live-origin]").on("click", $.proxy(this.onRadioLiveOriginChange, this))
                this.$el.find("input[name=radio-origin2]").on("click", $.proxy(this.onRadioOriginChange, this));
                this.$el.find("#cdn-originIP").on("focus", $.proxy(this.hideOriginTips, this));
                this.$el.find("#cdn-originAddress").on("focus", $.proxy(this.hideOriginTips, this));
                this.$el.find("#cdn-KS3Address").on("focus", $.proxy(this.hideOriginTips, this));

                this.$el.find("input[name=radio-port]").on("click", $.proxy(this.onRadioPortChange, this))

                this.setDropdownMenu();
            },

            onRadioPortChange: function(event) {
                var target = event.srcElement || event.target;
                var val = $(target).val();
                this.args.OriginPort = val;
            },

            onRadioLiveOriginChange: function(event) {
                var target = event.srcElement || event.target;
                var val = $(target).val();
                if (val == "RTMP") {
                    this.$el.find("#radio-port1935").show();
                    this.$el.find("#radio-port1935 input").click();
                    this.$el.find("#radio-port80").hide();
                } else if (val == "HTTP+FLV") {
                    this.$el.find("#radio-port1935").hide();
                    this.$el.find("#radio-port80").show();
                    this.$el.find("#radio-port80 input").click();
                }
            },

            onRadioProtocolChange: function(event) {
                this.$el.find("#cdn-cdnProtocol-error").hide();

                var target = event.srcElement || event.target;
                var val = $(target).val();
                //this.$el.find("input[name=radio-live-origin]").prop("checked",false);
                if (val == "RTMP") {
                    this.setDropdownMenu();
                    this.$el.find("#selectForRTMP").show();
                    this.$el.find("#selectForHTTPAndFLV").hide();
                    this.$el.find("#selectForHLS").hide();
                    this.$el.find("#radio-live-origin1").prop("checked", true);
                    this.$el.find("#radio-port1935").show();
                    this.$el.find("#radio-port1935 input").click();
                    this.$el.find("#radio-port80").hide();
                } else if (val == "HTTP+FLV") {
                    this.setDropdownMenu();
                    this.$el.find("#selectForRTMP").show();
                    this.$el.find("#selectForHTTPAndFLV").show();
                    this.$el.find("#selectForHLS").hide();
                    this.$el.find("#radio-live-origin1").prop("checked", true);
                    this.$el.find("#radio-port1935").show();
                    this.$el.find("#radio-port80").hide();
                    this.$el.find("#radio-port1935 input").click();
                } else if (val == "HLS") {
                    this.setDropdownMenuForHLS();
                    this.$el.find("#selectForRTMP").hide();
                    this.$el.find("#selectForHTTPAndFLV").hide();
                    this.$el.find("#selectForHLS").show();
                    this.$el.find("#radio-live-origin3").prop("checked", true);
                    this.$el.find("#radio-port1935").hide();
                    this.$el.find("#radio-port80").show();
                    this.$el.find("#radio-port80 input").click();
                }
            },

            onRadioOriginChange: function() {
                //this.$el.find("#cdn-originProtocol-error").hide();
            },

            checkArgs: function() {
                this.args.DomainName = this.parent.args.DomainName;
                this.args.CdnProtocol = this.$el.find("input[name=radio-live-protocol]:checked").val() || null;
                this.args.OriginProtocol = this.$el.find("input[name=radio-live-origin]:checked").val() || null;
                if (!this.checkProtocol()) {
                    return false;
                }
                if (!this.checkOrignTypeAndContent()) {
                    return false;
                }
                return this.args;
            },

            checkProtocol: function() {
                //访问协议
                if (!this.args.CdnProtocol) {
                    this.$el.find("#cdn-cdnProtocol-error").show();
                    return false;
                }
                //回源方式
                if (!this.args.OriginProtocol) {
                    this.$el.find("#cdn-originProtocol-error").show();
                    return false;
                }
                return true;
            },

            checkOrignTypeAndContent: function() {
                //源站类型未选的提示
                if (!this.args.OriginType || this.args.OriginType == 1) {
                    this.$el.find("#cdn-originType-error").show();
                    return false;
                }
                var _val = "";
                if (this.args.OriginType == "ipaddr") {
                    _val = this.$el.find("#cdn-originIP").val().replace(/\;+$/, '');
                } else if (this.args.OriginType == "domain") {
                    _val = this.$el.find("#cdn-originAddress").val().trim();

                } else if (this.args.OriginType == "ksvideo") {
                    _val = this.$el.find("#cdn-KS3Address").val().trim();
                }

                this.args.Origin = _val;

                var result = this.checkOrigin();
                if (!result) {
                    return false;
                }

                return true;
            },

            hideOriginTips: function() {
                this.$el.find("#cdn-originIP-error").hide();
                this.$el.find("#cdn-originAddress-error").hide();
                this.$el.find("#cdn-KS3Address-error").hide();
            },

            checkOrigin: function() {
                var originAddress = this.args.Origin;
                var originType = this.args.OriginType;
                var domainName = this.args.DomainName;
                if (originType == "ipaddr") {
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        this.$el.find("#cdn-originIP-error").html("IP不能为空").show();
                        return false;
                    }

                    var ipArray = originAddress.split(",");
                    if (ipArray.length > 10) {
                        this.$el.find("#cdn-originIP-error").html("你的IP数是否超过了10个。").show();
                        return false;
                    }
                    for (var i = 0; i < ipArray.length; i++) {
                        result = Utility.isIP(ipArray[i]);
                        if (!result) {
                            this.$el.find("#cdn-originIP-error").html("你的IP填写有误,请检查").show();
                            return false;
                        }
                    }

                } else if (originType == "domain") {
                    //验证域名
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        this.$el.find("#cdn-originAddress-error").html("域名不能为空").show();
                        return false;
                    }
                    if (domainName == originAddress) {
                        //域名不能与填写的域名相同
                        this.$el.find("#cdn-originAddress-error").html("源站地址不能与加速域名相同").show();
                        return false;
                    }
                    //域名校验
                    var result = Utility.isDomain(originAddress);
                    var isIPStr = Utility.isIP(originAddress);
                    if (result && !isIPStr && originAddress !== domainName && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-") {
                        return true;
                    } else {
                        this.$el.find("#cdn-originAddress-error").html("域名填写错误").show();
                        return false;
                    }

                    return true;

                } else if (originType == "ksvideo") {
                    //验证KS3域名，此情况只能填一个
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        this.$el.find("#cdn-KS3Address-error").html("域名不能为空").show();
                        return false;
                    }
                    if (domainName == originAddress) {
                        //域名不能与填写的域名相同
                        this.$el.find("#cdn-KS3Address-error").html("源站地址不能与加速域名相同").show();
                        return false;
                    }
                    //域名校验
                    var result = Utility.isDomain(originAddress);
                    var isIPStr = Utility.isIP(originAddress);
                    if (result && !isIPStr && originAddress !== domainName && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-") {
                        return true;
                    } else {
                        this.$el.find("#cdn-KS3Address-error").html("域名填写错误").show();
                        return false;
                    }

                    return true;
                }
                return true;
            },

            setDropdownMenu: function() {
                this.args.OriginType = 1;
                this.setShowOriginList();
                this.$el.find(".cdn-download-live-port").hide();
                this.$el.find("#dropdown-menu-origin-type .cur-caret").html("请选择");
                //直播的源站类型
                var ctn = this.$el.find("#dropdown-menu-origin-type");
                var dateArray = [{
                    name: "请选择",
                    value: "1"
                }, {
                    name: "域名源站",
                    value: "domain"
                }, {
                    name: "视频云源站",
                    value: "ksvideo"
                }];
                this.initDropMenu(ctn, dateArray, function(obj) {
                    if (obj.value != 1) {
                        this.$el.find("#cdn-originType-error").hide();
                    }
                    this.$el.find(".cdn-download-live-port").hide();
                    this.args.OriginType = obj.value;
                    this.setShowOriginList();
                }.bind(this));

            },

            setDropdownMenuForHLS: function() {
                //直播的源站类型
                this.args.OriginType = 1;
                this.setShowOriginList();
                this.$el.find(".cdn-download-live-port").hide();
                this.$el.find("#dropdown-menu-origin-type .cur-caret").html("请选择");
                var ctn = this.$el.find("#dropdown-menu-origin-type");
                var dateArray = [{
                    name: "请选择",
                    value: "1"
                }, {
                    name: "IP源站",
                    value: "ipaddr"
                }, {
                    name: "域名源站",
                    value: "domain"
                }, {
                    name: "视频云源站",
                    value: "ksvideo"
                }];
                this.initDropMenu(ctn, dateArray, function(obj) {
                    if (obj.value != 1) {
                        this.$el.find("#cdn-originType-error").hide();
                    }
                    this.$el.find(".cdn-download-live-port").hide();
                    this.args.OriginType = obj.value;
                    this.setShowOriginList();
                }.bind(this));
            },

            initDropMenu: function(rootNode, typeArray, callback) {
                var dropRoot = rootNode.find(".ks-dropdown-menu"),
                    showNode = rootNode.find(".cur-caret");
                dropRoot.html("");
                _.each(typeArray, function(element, index, list) {
                    var itemTpl = '<li data-value="' + element.value + '" data-name="' + element.name + '">' +
                        '<a data-value="' + element.value + '" data-name="' + element.name + '" href="javascript:void(0);">' + element.name + '</a>' +
                        '</li>',
                        itemNode = $(itemTpl);
                    itemNode.on("click", function(event) {
                        var eventTarget = event.srcElement || event.target;
                        showNode.html($(eventTarget).attr("data-name"));
                        var value = $(eventTarget).attr("data-value");
                        var obj = {
                            value: value
                        };
                        callback && callback(obj);
                    });
                    itemNode.appendTo(dropRoot);
                });
            },


            setShowOriginList: function() {
                //通过OriginType和type来显示不同选项
                var originType = this.args.OriginType;
                if (!originType || originType == 1) {
                    this.$el.find(".cdn-originType-list-ctn").hide();
                    return false;
                }

                if (originType == "ipaddr") {
                    this.$el.find(".cdn-originAddress").hide();
                    this.$el.find(".cdn-originKsVideo").hide();
                    this.$el.find(".cdn-originIP").show();
                } else if (originType == "domain") {
                    this.$el.find(".cdn-originIP").hide();
                    this.$el.find(".cdn-originKsVideo").hide();
                    this.$el.find(".cdn-originAddress").show();

                } else if (originType == "ksvideo") {
                    this.$el.find(".cdn-originIP").hide();
                    this.$el.find(".cdn-originAddress").hide();
                    this.$el.find(".cdn-originKsVideo").show();
                }

                if (originType == "ipaddr" || originType == "domain") {
                    this.$el.find(".cdn-download-live-port").show();
                } else {
                    this.$el.find(".cdn-download-live-port").hide();
                }

            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        var AddLiveUpwardView = AddLiveView.extend({
            initialize: function(options) {
                AddLiveUpwardView.__super__.initialize.call(this, options);

                this.$el.find(".non-rtmp").hide();
                this.$el.find(".origin-protocol").hide();
            },

            checkOrigin: function() {
                var originAddress = this.args.Origin;
                var originType = this.args.OriginType;
                var domainName = this.args.DomainName;
                if (originType == "ipaddr") {
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        this.$el.find("#cdn-originIP-error").html("IP不能为空").show();
                        return false;
                    }

                    var ipArray = originAddress.split(",");
                    if (ipArray.length > 1) {
                        this.$el.find("#cdn-originIP-error").html("你的IP数是否超过了1个。").show();
                        return false;
                    }
                    for (var i = 0; i < ipArray.length; i++) {
                        result = Utility.isIP(ipArray[i]);
                        if (!result) {
                            this.$el.find("#cdn-originIP-error").html("你的IP填写有误,请检查").show();
                            return false;
                        }
                    }

                } else if (originType == "domain") {
                    //验证域名
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        this.$el.find("#cdn-originAddress-error").html("域名不能为空").show();
                        return false;
                    }
                    if (domainName == originAddress) {
                        //域名不能与填写的域名相同
                        this.$el.find("#cdn-originAddress-error").html("源站地址不能与加速域名相同").show();
                        return false;
                    }
                    //域名校验
                    var result = Utility.isDomain(originAddress);
                    var isIPStr = Utility.isIP(originAddress);
                    if (result && !isIPStr && originAddress !== domainName && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-") {
                        return true;
                    } else {
                        this.$el.find("#cdn-originAddress-error").html("域名填写错误").show();
                        return false;
                    }

                    return true;

                } else if (originType == "ksvideo") {
                    //验证KS3域名，此情况只能填一个
                    //验证IP
                    if (!originAddress) {
                        //不能为空
                        this.$el.find("#cdn-KS3Address-error").html("域名不能为空").show();
                        return false;
                    }
                    if (domainName == originAddress) {
                        //域名不能与填写的域名相同
                        this.$el.find("#cdn-KS3Address-error").html("源站地址不能与加速域名相同").show();
                        return false;
                    }
                    //域名校验
                    var result = Utility.isDomain(originAddress);
                    var isIPStr = Utility.isIP(originAddress);
                    if (result && !isIPStr && originAddress !== domainName && originAddress.substr(0, 1) !== "-" && originAddress.substr(-1, 1) !== "-") {
                        return true;
                    } else {
                        this.$el.find("#cdn-KS3Address-error").html("域名填写错误").show();
                        return false;
                    }

                    return true;
                }
                return true;
            },

            setDropdownMenu: function() {
                //直播的源站类型
                this.args.OriginType = 1;
                this.setShowOriginList();
                this.$el.find(".cdn-download-live-port").hide();
                this.$el.find("#dropdown-menu-origin-type .cur-caret").html("请选择");
                var ctn = this.$el.find("#dropdown-menu-origin-type");
                var dateArray = [{
                    name: "请选择",
                    value: "1"
                }, {
                    name: "IP源站",
                    value: "ipaddr"
                }, {
                    name: "域名源站",
                    value: "domain"
                }, {
                    name: "视频云源站",
                    value: "ksvideo"
                }];
                this.initDropMenu(ctn, dateArray, function(obj) {
                    if (obj.value != 1) {
                        this.$el.find("#cdn-originType-error").hide();
                    }
                    this.$el.find(".cdn-download-live-port").hide();
                    this.args.OriginType = obj.value;
                    this.setShowOriginList();
                }.bind(this));
            },

            setShowOriginList: function() {
                //通过OriginType和type来显示不同选项
                var originType = this.args.OriginType;
                if (!originType || originType == 1) {
                    this.$el.find(".cdn-originType-list-ctn").hide();
                    return false;
                }

                if (originType == "ipaddr") {
                    this.$el.find(".cdn-originAddress").hide();
                    this.$el.find(".cdn-originKsVideo").hide();
                    this.$el.find(".cdn-originIP").show();
                } else if (originType == "domain") {
                    this.$el.find(".cdn-originIP").hide();
                    this.$el.find(".cdn-originKsVideo").hide();
                    this.$el.find(".cdn-originAddress").show();

                } else if (originType == "ksvideo") {
                    this.$el.find(".cdn-originIP").hide();
                    this.$el.find(".cdn-originAddress").hide();
                    this.$el.find(".cdn-originKsVideo").show();
                    if (this.$el.find(".cdn-originKsVideo input").val() === "")
                        this.$el.find(".cdn-originKsVideo input").val("uplive-orig.ks-cdn.com")
                }

                if (originType == "ipaddr" || originType == "domain") {
                    this.$el.find(".cdn-download-live-port").show();
                } else {
                    this.$el.find(".cdn-download-live-port").hide();
                }
            },
        });

        var AddDomainView = Backbone.View.extend({
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/customerSetup/domainList/domainList.addDomain.html'])({}));

                var userInfo = options.userInfo;

                this.optHeader = $(_.template(template['tpl/customerSetup/customerSetup.header.html'])({
                    data: userInfo
                }));
                this.optHeader.appendTo(this.$el.find(".opt-ctn"))

                this.$el.find("[data-toggle='tooltip']").tooltip();
                this.args = {
                    DomainName: '', //域名
                    CdnType: null, //业务类型
                    Regions: '' //地区

                };
                this.setDropdownMenu();

                this.$el.find("#add-domain-btnSubmit").on("click", $.proxy(this.onSubmit, this));
                if (!AUTH_OBJ.ApplyCreateCustomerDomain) {
                    this.$el.find("#add-domain-btnSubmit").remove();
                }
                this.$el.find("#add-domain-btnCancle").on("click", $.proxy(this.onCancel, this));

                this.collection.off("get.region.success");
                this.collection.off("get.region.error");
                this.collection.on("get.region.success", $.proxy(this.onGetRegionSuccess, this))
                this.collection.on("get.region.error", $.proxy(this.onGetError, this))

                this.collection.getRegionBillingByUserId({
                    userId: userInfo.uid
                });

                this.$el.find("#text-domainName").on("focus", $.proxy(this.onDomainNameFocus, this));

                this.collection.off("submit.domain.success");
                this.collection.off("submit.domain.error");
                this.collection.on("submit.domain.success", $.proxy(this.onSubmitSuccess, this))
                this.collection.on("submit.domain.error", $.proxy(this.onGetError, this))
            },

            onGetRegionSuccess: function(data) {
                // var regions = {
                //     hasData: true,
                //     data: [
                //         {"id":1.0,"region":"CN","name":"中国大陆","cdnFactory":"ksc"},
                //         {"id":2.0,"region":"AS","name":"亚洲","cdnFactory":"ksc"},
                //         {"id":3.0,"region":"NA","name":"北美洲","cdnFactory":"ksc"},
                //         {"id":4.0,"region":"EU","name":"欧洲和中东","cdnFactory":"ksc"},
                //         {"id":5.0,"region":"AU","name":"澳洲","cdnFactory":"ksc"},
                //         {"id":6.0,"region":"AF","name":"非洲","cdnFactory":"ksc"},
                //         {"id":7.0,"region":"SA","name":"南美洲","cdnFactory":"ksc"}
                //     ]
                // };
                // this.setRegionData(regions.data)
                this.setRegionData(data)
            },

            onSubmitSuccess: function() {
                alert("操作成功！")
                this.$el.find("#add-domain-btnSubmit").removeAttr("disabled");
                this.options.okCallback && this.options.okCallback();
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
                this.$el.find("#add-domain-btnSubmit").removeAttr("disabled");
            },

            onDomainNameFocus: function() {
                this.$el.find("#domain-name-error").hide();
            },

            onSubmit: function() {
                var result = this.checkArgs();
                if (!result) {
                    return false;
                }
                var args = this.args;
                result.Regions = args.Regions;
                result.CdnType = args.CdnType;
                var protocols = {
                        "HTTP": 0,
                        "HTTPS": 4,
                        "HLS": 2,
                        "HTTP+FLV": 1,
                        "RTMP": 3
                    },
                    originTypes = {
                        "ipaddr": 1,
                        "domain": 2,
                        "KS3": 3,
                        "ksvideo": 3
                    };
                var postParam = {
                    "domain": result.DomainName,
                    "userId": this.options.userInfo.uid,
                    "subType": result.CdnType === "download" ? 1 : (result.CdnType === "liveUpward" ? 3 : 2),
                    "protocol": protocols[result.CdnProtocol],
                    "backSourceProtocol": protocols[result.OriginProtocol],
                    "region": result.Regions,
                    "originType": originTypes[result.OriginType],
                    "originAddress": _.uniq(result.Origin.split(',')).join(','),
                    "originPort": result.OriginPort
                }

                this.collection.submitDomain(postParam);
                this.$el.find("#add-domain-btnSubmit").attr("disabled", "disabled");
            },

            onCancel: function() {
                this.options.cancelCallback && this.options.cancelCallback();
            },

            checkArgs: function() {
                /*
                 **域名验证,此验证有点多，如下分步进行验证
                 */
                //设置value
                var cdnType = this.args.CdnType;
                this.args.DomainName = this.$el.find("#text-domainName").val();

                if (!this.checkDomainName()) {
                    return false;
                }

                if (!this.checkCdnType()) {
                    return false;
                }

                if (!this.checkRegion()) {
                    return false;
                }

                if (!this.downloadAndLiveView) {
                    return false;
                }
                var result = this.downloadAndLiveView.checkArgs();
                if (!result) {
                    return false;
                }
                return result;

            },

            checkCdnType: function() {
                //业务类型
                var cdnType = this.args.CdnType;
                if (cdnType == 1 || !cdnType) {
                    this.$el.find("#cdn-type-error").show();
                    return false;
                }
                return true;
            },


            setDropdownMenu: function() {
                //业务类型
                var ctn = this.$el.find("#dropdown-menu-domain-type");
                var viewCtn = this.$el.find(".download-live-view-ctn");
                var dateArray = [{
                    name: "请选择",
                    value: "1"
                }, {
                    name: "下载加速",
                    value: "download"
                }, {
                    name: "直播加速",
                    value: "live"
                }, {
                    name: "直播推流加速",
                    value: "liveUpward"
                }];
                this.initDropMenu(ctn, dateArray, function(obj) {
                    var cdnType = obj.value;
                    if (cdnType == this.args.CdnType) {
                        //当前已选中，就不继续执行
                        return false;
                    }
                    viewCtn.html("");
                    this.downloadAndLiveView = null;
                    this.args.CdnType = cdnType;
                    if (cdnType == 1) {
                        //如果是请选择项，只清空视图
                        return false;
                    }
                    this.$el.find("#cdn-type-error").hide();
                    if (cdnType == "download") {
                        this.downloadAndLiveView = new AddDownloadView({
                            collection: this.collection,
                            obj: this
                        });
                    } else if (cdnType == "live") {
                        this.downloadAndLiveView = new AddLiveView({
                            collection: this.collection,
                            obj: this
                        })
                    } else if (cdnType == "liveUpward") {
                        this.downloadAndLiveView = new AddLiveUpwardView({
                            collection: this.collection,
                            obj: this
                        })
                    }
                    this.downloadAndLiveView.render(viewCtn);

                }.bind(this));
            },

            initDropMenu: function(rootNode, typeArray, callback) {
                var dropRoot = rootNode.find(".ks-dropdown-menu"),
                    showNode = rootNode.find(".cur-caret");
                dropRoot.html("");
                _.each(typeArray, function(element, index, list) {
                    var itemTpl = '<li data-value="' + element.value + '" data-name="' + element.name + '">' +
                        '<a data-value="' + element.value + '" data-name="' + element.name + '" href="javascript:void(0);">' + element.name + '</a>' +
                        '</li>',
                        itemNode = $(itemTpl);
                    itemNode.on("click", function(event) {
                        var eventTarget = event.srcElement || event.target;
                        showNode.html($(eventTarget).attr("data-name"));
                        var value = $(eventTarget).attr("data-value");
                        var obj = {
                            value: value
                        };
                        callback && callback(obj);
                    });
                    itemNode.appendTo(dropRoot);
                });
            },

            checkDomainName: function() {
                //检查域名
                var domainName = this.args.DomainName;
                if (domainName == "") {
                    this.$el.find("#domain-name-error").html("加速域名不能为空").show();
                    return false;
                }
                var result = Utility.isDomain(domainName);
                if (!result) {
                    this.$el.find("#domain-name-error").html("域名填写错误").show();
                    return false;
                }
                return true;
            },

            checkRegion: function() {
                var region = this.getRegion();
                if (region.length < 1) {
                    this.regionCtn.find("#cdn-regions-error").show();
                    return false;
                }
                this.args.Regions = region.join(",");
                return true;
            },

            regionList: {},

            getRegion: function() {
                var regionList = this.regionList;
                var arr = [];
                for (var i in regionList) {
                    arr.push(regionList[i]);
                }
                return arr;
            },

            setRegionData: function(data) {
                this.regionData = data;
                this.regionCtn = $(_.template(template['tpl/customerSetup/domainList/cdn.region.list.html'])({
                    data: data
                }));
                this.$el.find(".cdn-region-ctn").html(this.regionCtn);

                this.regionCtn.find("input[type=checkbox]").bind("click", $.proxy(this.onClickRegionCheckbox, this));

            },

            onClickRegionCheckbox: function() {
                this.regionCtn.find("#cdn-regions-error").hide();
                var regionRadios = this.regionCtn.find("input[type=checkbox]");
                var obj = {};
                for (var i = 0; i < regionRadios.length; i++) {
                    if (regionRadios[i].checked) {
                        var _value = regionRadios[i].value;
                        obj[_value] = _value;
                    }
                }
                this.regionList = obj;
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        exports.AddDomainView = AddDomainView;
        exports.AddLiveView = AddLiveView;
        exports.AddDownloadView = AddDownloadView
    });