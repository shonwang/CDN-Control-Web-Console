define("setupBillLive.view", ['require','exports', 'template', 'modal.view', 'utility', 'setupBill.view'], 
    function(require, exports, template, Modal, Utility, SetupBillView) {

    var SetupLiveBillView = SetupBillView.extend({
        events: {},

        initOriginDetection: function(argument) {
            this.originDetectionInfo = this.config.detectOriginConfig || {};

            this.strArray = ['<span class="label label-danger">关闭</span>', '<span class="label label-success">开启</span>'];
            var flag = this.config.detectOriginConfig.flag;
            this.originDetectionInfo.flagStr = this.strArray[flag];

            this.originHostSetupTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.backOriginDetection.html'])({
                data: this.originDetectionInfo
            }));
            this.originHostSetupTable.appendTo(this.$el.find(".bill-ctn"));

            var type = this.config.originDomain.type,
                protocol = this.config.domainConf.protocol;

            if ((type === 1 && protocol === 0) ||
                (type === 1 && protocol === 4) ||
                (type === 1 && protocol === 2)) {
                this.initFollowing()
            } else if ((type === 2 && protocol === 1) ||
                       (type === 2 && protocol === 3)) {
                this.initLiveRefererAntiLeech()
            } else {
                var message = 'type=1 protocol=0,4 下载<br>type=1 protocol=2 伪直播<br>type=2 protocol= 1,3真直播<br>' + 
                              '当前返回的type为' + type + "，protocol为" + protocol;
                alert(message)
            }
        },

        initLiveRefererAntiLeech: function(){
            this.refererAntiLeechInfo = this.config.referSafetyChainList || [];
            this.refererAntiLeechInfo = [
                {
                    "type": 2,   //防盗链类型 1:白名单 2:黑名单
                    "domains": "",   //域名,英文逗号分隔
                    "nullReferer": 1,   //允许空referer 0:关 1:开
                    "openFlag": 1,   //直播开启refer防盗链 0:关 1:开
                    "regexps": "123",   //正则表达式，英文逗号分隔
                    "forgeReferer": 1,   //是否允许伪造的refer 0:否 1:是
                }
            ];

            _.each(this.refererAntiLeechInfo, function(el, index, ls){
                if (!el.openFlag){
                    this.refererAntiLeechTable = $(`<table class="table table-striped table-hover">
                                                        <caption>访问控制</caption>
                                                        <tbody>
                                                            <tr>
                                                              <td>referer防盗链</td>
                                                              <td><span class="label label-danger">关闭</span></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>`)
                } else {
                    el.openFlagStr = '<span class="label label-success">开启</span>';
                    if (el.type === 1) el.typeStr = '白名单';
                    if (el.type === 2) el.typeStr = '黑名单';

                    el.nullRefererStr = this.strArray[el.nullReferer];
                    el.forgeRefererStr = this.strArray[el.forgeReferer];

                    this.refererAntiLeechTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.liveRefererAntiLeech.html'])({
                        data: el
                    }));
                }
                this.refererAntiLeechTable.appendTo(this.$el.find(".bill-ctn"));
            }.bind(this))

            this.initLiveTimestamp();
        },

        initLiveTimestamp: function(){
            this.timestampInfo = this.config.standardProtectionList || [];

            this.timestampInfo = [
                {
                    "openFlag": 1,
                    "confType": 1,
                    "protectionType": 1,
                    "timeParam": "null",
                    "hashParam": "null",
                    "timeType": 2,
                    "timeValue": "null",
                    "expirationTime": 3600,
                    "md5Truncate": '123,123',
                    "authKeyList": [
                        {
                            "id": 4,
                            "authKey": "xxx",
                        }
                    ],
                    "authDivisorList": [
                        {
                            "id": 4,
                            "divisor": 1,
                            "divisorParam":"",
                        }
                    ]
                }
            ];

            _.each(this.timestampInfo, function(el, index, ls){
                if (!el.openFlag){
                    this.timestampTable = $(`<table class="table table-striped table-hover">
                                                        <tbody>
                                                            <tr>
                                                              <td>时间戳+共享秘钥防盗链</td>
                                                              <td><span class="label label-danger">关闭</span></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>`)
                } else {
                    el.openFlagStr = '<span class="label label-success">开启</span>';

                    if (el.protectionType === 1)  el.protectionTypeStr = "typeA";
                    if (el.protectionType === 2)  el.protectionTypeStr = "typeB";
                    if (el.protectionType === 3)  el.protectionTypeStr = "typeC";

                    var expirationTime = el.expirationTime, expirationTimeStr;
                    if (expirationTime === 0) expirationTimeStr = "时间戳时间<br>";
                    if (expirationTime !== 0) expirationTimeStr = "时间戳时间+过期时间：" + expirationTime + "秒<br>";
                    el.expirationTimeStr = expirationTimeStr

                    if (!el.confType){
                        el.confTypeStr = "标准配置";
                        this.timestampTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.liveTimestamp.html'])({
                            data: el
                        }));
                    } else {
                        el.confTypeStr = "高级配置";
                        if (el.md5Truncate == "") 
                            el.md5TruncateStr = "全部（默认）";
                        else 
                            el.md5TruncateStr = '自定义: ' + el.md5Truncate;
                        var timeTypeArray = ['', 'UNIX时间（十六进制）', 'UNIX时间（十进制）'];
                        el.timeTypeStr = timeTypeArray[el.timeType]
                        this.timestampTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.liveTimestamp.advanced.html'])({
                            data: el
                        }));
                        this.updateAuthDivisorTable(el.authDivisorList, this.timestampTable.find(".authdivisor"));
                    }
                    this.updateBaseKeyTable(el.authKeyList, this.timestampTable.find(".authkey"));
                }
                this.timestampTable.appendTo(this.$el.find(".bill-ctn"));
            }.bind(this))

            this.initLiveBusOptimize();
        },

        updateBaseKeyTable: function(data, root){
            var temp = []
            _.each(data, function(el, index, ls){
                    temp.push({
                        id: el.id,
                        backupKey: el.authKey
                    })
            }.bind(this))
            this.baseBackupKeyTable = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.backupKeyTable.html'])({
                data: temp
            }))

            this.baseBackupKeyTable.find(".delete").remove();
            root.html(this.baseBackupKeyTable.get(0));
        },

        updateAuthDivisorTable: function(data, root){
            var  authDivisorArray = [
                {value: 1, name: "host:用户请求域名"},
                {value: 2, name: "uri：用户请求的uri"},
                {value: 3, name: "url：不带参数"},
                {value: 4, name: "arg&name:请求url中的参数名称"},
                {value: 5, name: "time：请求url中是时间戳"},
                {value: 6, name: "key：秘钥"},
                {value: 7, name: "filename：文件名称，带后缀"},
                {value: 8, name: "filenameno：文件名称，不带后缀"}
            ];
            _.each(data, function(el, index, ls){
                var nameObj = _.find(authDivisorArray, function(obj){
                    return obj.value === el.divisor
                }.bind(this))
                if (nameObj) el.divisorName = nameObj.name
            }.bind(this))

            this.authDivisorTable = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.atuthDivisor.table.html'])({
                data: data
            }))

            this.authDivisorTable.find(".delete").remove();
            root.html(this.authDivisorTable.get(0));
        },

        initLiveBusOptimize: function(){
            this.appLives = this.config.appLives || [];
            this.appLives = [{
                        "optimizeConf":{
                            "gopType": 2, //1:按时长 2:按个数
                            "gopNum": 3,
                            "gopMaxDuration": 15,
                            "gopMinSendFlag": 1,
                            "gopMinSend": 2,
                            "noFlowTimeout": 21,
                            "delayClose": 6,
                            "metaType": 2, //1:append 2:on 3:copy 4:off
                            "h265Flag": 1,
                            "hdlAudioOnlyFlag": 1,
                            "hdlAudioOnlyParam": "audio-only1",
                            "rtmpAudioOnlyFlag": 1,
                            "rtmpAudioOnlyParam": "audio-only1",
                            "edge302Flag": 1
                        },
                        "pkConf":{
                            "hdlAvhZeroTimestamp": 1,
                            "hdlTimestampZeroStart": 1,
                            "hdlGopZeroTimestamp": 1,
                            "hdlGopSendAudio": 0,
                            "rtmpAvhZeroTimestamp": 1,
                            "rtmpTimestampZeroStart": 1,
                            "rtmpGopZeroTimestamp": 1,
                            "rtmpGopSendAudio": 0,
                            "avHeaderFlag": 1,
                            "avHeaderWaitTime": 1,
                            "keepAliveFlag": 1,
                            "keepAliveTime": 1,
                        },
                        "logConf":{
                            "slaAccessFlag": 1,
                            "slaFirstCache": 20,
                            "slaSecondCache":15,
                            "frequencyFlag":1,
                            "frequencyInterval":600,
                        }
                    }];

            _.each(this.appLives, function(el, index, ls){
                var optimizeConf = el.optimizeConf;
                if (optimizeConf.gopType === 1) {
                    optimizeConf.gopTypeStr = "按时长";
                    optimizeConf.gopNumStr = "gop缓存时长：" + optimizeConf.gopNum + "秒";
                } else {
                    optimizeConf.gopTypeStr = "按个数";
                    optimizeConf.gopNumStr = "gop缓存个数：" + optimizeConf.gopNum + "个";
                }
                optimizeConf.gopMaxDurationStr = optimizeConf.gopMaxDuration + "秒";
                if (optimizeConf.gopMinSendFlag === 0)
                    optimizeConf.gopMinSendStr = '<span class="label label-danger">关闭</span>';
                else
                    optimizeConf.gopMinSendStr = '<span class="label label-success">开启</span>' + optimizeConf.gopMinSend + "秒";
                optimizeConf.noFlowTimeoutStr = optimizeConf.noFlowTimeout + "秒";
                optimizeConf.delayCloseStr = optimizeConf.delayClose + "秒后关闭客户端连接";
                var metaTypeNameArray = ["", "append", "on", "copy", "off"]
                optimizeConf.metaTypeStr = metaTypeNameArray[optimizeConf.metaType];

                optimizeConf.h265FlagStr = this.strArray[optimizeConf.h265Flag];
                optimizeConf.hdlAudioOnlyFlagStr = this.strArray[optimizeConf.hdlAudioOnlyFlag];
                optimizeConf.rtmpAudioOnlyFlagStr = this.strArray[optimizeConf.rtmpAudioOnlyFlag];
                optimizeConf.edge302FlagStr = this.strArray[optimizeConf.edge302Flag];

                this.liveBusOptimizeTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.liveBusOptimize.html'])({
                    data: optimizeConf
                }));

                this.liveBusOptimizeTable.appendTo(this.$el.find(".bill-ctn"));
            }.bind(this))

            this.initPKBusOptimize();
        },

        initPKBusOptimize: function(){
            _.each(this.appLives, function(el, index, ls){
                var pkConf = el.pkConf;
                if (pkConf.keepAliveFlag === 0)
                    pkConf.keepAliveFlagStr = '<span class="label label-danger">关闭</span>';
                else
                    pkConf.keepAliveFlagStr = '<span class="label label-success">开启</span> 时长: ' + Utility.timeFormat2(pkConf.keepAliveTime);

                if (pkConf.avHeaderFlag === 0)
                    pkConf.avHeaderFlagStr = '<span class="label label-danger">关闭</span>';
                else
                    pkConf.avHeaderFlagStr = '<span class="label label-success">开启</span> 等待音视频合并头持续的时间: ' + Utility.timeFormat2(pkConf.avHeaderWaitTime);

                pkConf.hdlAvhZeroTimestampStr = this.strArray[pkConf.hdlAvhZeroTimestamp];
                pkConf.hdlTimestampZeroStartStr = this.strArray[pkConf.hdlTimestampZeroStart];
                pkConf.hdlGopZeroTimestampStr = this.strArray[pkConf.hdlGopZeroTimestamp];
                pkConf.hdlGopSendAudioStr = this.strArray[pkConf.hdlGopSendAudio];

                pkConf.rtmpAvhZeroTimestampStr = this.strArray[pkConf.rtmpAvhZeroTimestamp];
                pkConf.rtmpTimestampZeroStartStr = this.strArray[pkConf.rtmpTimestampZeroStart];
                pkConf.rtmpGopZeroTimestampStr = this.strArray[pkConf.rtmpGopZeroTimestamp];
                pkConf.rtmpGopSendAudioStr = this.strArray[pkConf.rtmpGopSendAudio];

                this.livePKOptimizeTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.livePKOptimize.html'])({
                    data: pkConf
                }));

                this.livePKOptimizeTable.appendTo(this.$el.find(".bill-ctn"));
            }.bind(this))

            this.initLogConf();
        },

        initLogConf: function(){
            _.each(this.appLives, function(el, index, ls){
                var logConf = el.logConf;
                if (logConf.slaAccessFlag === 0){
                    logConf.slaAccessFlagStr = '<span class="label label-danger">关闭</span>';
                } else {
                    logConf.slaAccessFlagStr = '<span class="label label-success">开启</span><br><hr>' + 
                    '计算access日志中的卡顿时，客户端的假设首次缓冲大小: ' + logConf.slaFirstCache + "秒<br>" + 
                    '计算access日志中的卡顿时，客户端的假设再次缓冲大小: ' + logConf.slaSecondCache + "秒<br>" ;
                }

                if (logConf.frequencyFlag === 0){
                    logConf.frequencyFlagStr = '<span class="label label-danger">关闭</span>';
                } else {
                    logConf.frequencyFlagStr = '<span class="label label-success">开启</span>间隔: ' + 
                    Utility.timeFormat2(logConf.frequencyInterval);
                }

                this.livePKOptimizeTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.livelogConf.html'])({
                    data: logConf
                }));

                this.livePKOptimizeTable.appendTo(this.$el.find(".bill-ctn"));
            }.bind(this))
        },
    });

    return SetupLiveBillView;
});